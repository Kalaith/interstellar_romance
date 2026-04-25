<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\AuthUser;
use PDO;
use RuntimeException;

final class GameRepository
{
    public function __construct(private readonly PDO $db)
    {
    }

    public function begin(): void
    {
        $this->db->beginTransaction();
    }

    public function commit(): void
    {
        $this->db->commit();
    }

    public function rollBack(): void
    {
        if ($this->db->inTransaction()) {
            $this->db->rollBack();
        }
    }

    public function upsertPlayer(AuthUser $user): void
    {
        $now = $this->now();
        $statement = $this->db->prepare(
            'INSERT INTO players (auth_user_id, email, username, display_name, created_at, updated_at)
             VALUES (:auth_user_id, :email, :username, :display_name, :created_at, :updated_at)
             ON DUPLICATE KEY UPDATE
                email = VALUES(email),
                username = VALUES(username),
                display_name = VALUES(display_name),
                updated_at = VALUES(updated_at)'
        );
        $statement->execute([
            'auth_user_id' => $user->id,
            'email' => $user->email,
            'username' => $user->username,
            'display_name' => $user->displayName,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    public function getOrCreateSave(AuthUser $user): array
    {
        $this->upsertPlayer($user);

        $save = $this->findSaveByUserId($user->id);
        if ($save !== null) {
            return $save;
        }

        $now = $this->now();
        $statement = $this->db->prepare(
            'INSERT INTO game_saves (
                auth_user_id, player_traits_json, icebreaker_unlocks_json, selected_activities_json,
                created_at, updated_at
             ) VALUES (
                :auth_user_id, :player_traits_json, :icebreaker_unlocks_json, :selected_activities_json,
                :created_at, :updated_at
             )'
        );
        $statement->execute([
            'auth_user_id' => $user->id,
            'player_traits_json' => $this->json([]),
            'icebreaker_unlocks_json' => $this->json([]),
            'selected_activities_json' => $this->json([]),
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $this->getSave((int) $this->db->lastInsertId());
    }

    public function resetSave(AuthUser $user, array $player): array
    {
        $this->upsertPlayer($user);

        $existing = $this->findSaveByUserId($user->id);
        if ($existing !== null) {
            $statement = $this->db->prepare('DELETE FROM game_saves WHERE id = :id');
            $statement->execute(['id' => (int) $existing['id']]);
        }

        $now = $this->now();
        $stats = $player['stats'];
        $statement = $this->db->prepare(
            'INSERT INTO game_saves (
                auth_user_id, player_name, player_species, player_gender, sexual_preference,
                player_traits_json, backstory, charisma, intelligence, adventure, empathy, technology,
                current_week, total_conversations, total_dates, super_likes_available,
                conflict_resolution_skill, icebreaker_unlocks_json, selected_activities_json,
                status, created_at, updated_at
             ) VALUES (
                :auth_user_id, :player_name, :player_species, :player_gender, :sexual_preference,
                :player_traits_json, :backstory, :charisma, :intelligence, :adventure, :empathy, :technology,
                1, 0, 0, 3, 0, :icebreaker_unlocks_json, :selected_activities_json,
                :status, :created_at, :updated_at
             )'
        );
        $statement->execute([
            'auth_user_id' => $user->id,
            'player_name' => $player['name'],
            'player_species' => $player['species'],
            'player_gender' => $player['gender'],
            'sexual_preference' => $player['sexual_preference'],
            'player_traits_json' => $this->json($player['traits']),
            'backstory' => $player['backstory'],
            'charisma' => (int) $stats['charisma'],
            'intelligence' => (int) $stats['intelligence'],
            'adventure' => (int) $stats['adventure'],
            'empathy' => (int) $stats['empathy'],
            'technology' => (int) $stats['technology'],
            'icebreaker_unlocks_json' => $this->json([]),
            'selected_activities_json' => $this->json([]),
            'status' => 'active',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $this->getSave((int) $this->db->lastInsertId());
    }

    public function moveGuestSaveToUser(string $guestUserId, AuthUser $targetUser): array
    {
        if ($guestUserId === $targetUser->id) {
            throw new RuntimeException('Guest session is already linked to this account.');
        }

        $this->begin();
        try {
            $this->upsertPlayer($targetUser);

            $guestSave = $this->findSaveByUserId($guestUserId);
            if ($guestSave === null) {
                throw new RuntimeException('Guest save not found.');
            }

            $targetSave = $this->findSaveByUserId($targetUser->id);
            if ($targetSave !== null) {
                $delete = $this->db->prepare('DELETE FROM game_saves WHERE id = :id');
                $delete->execute(['id' => (int) $targetSave['id']]);
            }

            $now = $this->now();
            $move = $this->db->prepare(
                'UPDATE game_saves
                 SET auth_user_id = :target_user_id,
                     updated_at = :updated_at
                 WHERE id = :save_id'
            );
            $move->execute([
                'target_user_id' => $targetUser->id,
                'updated_at' => $now,
                'save_id' => (int) $guestSave['id'],
            ]);

            $deleteGuest = $this->db->prepare('DELETE FROM players WHERE auth_user_id = :guest_user_id');
            $deleteGuest->execute(['guest_user_id' => $guestUserId]);

            $this->commit();
            return $this->getSave((int) $guestSave['id']);
        } catch (\Throwable $error) {
            $this->rollBack();
            throw $error;
        }
    }

    public function initializeContentState(
        int $saveId,
        array $characters,
        array $milestones,
        array $photos,
        array $achievements,
        array $storylines,
        array $defaultKnownInfo
    ): void {
        $now = $this->now();
        $today = gmdate('Y-m-d');
        $communicationStyle = [
            'compatibility' => 50,
            'playerPreference' => 'emotional',
            'characterStyle' => 'direct',
            'adaptationLevel' => 0,
        ];

        $relationship = $this->db->prepare(
            'INSERT IGNORE INTO relationship_states (
                save_id, character_id, affection, mood, known_info_json, daily_reset_date,
                interactions_used, max_interactions, timezone, level_key, compatibility, trust,
                intimacy, commitment, communication_style_json, shared_experiences, conflicts_count,
                last_status_change, created_at, updated_at
             ) VALUES (
                :save_id, :character_id, 0, :mood, :known_info_json, :daily_reset_date,
                0, 3, :timezone, :level_key, 0, 0,
                0, 0, :communication_style_json, 0, 0,
                :last_status_change, :created_at, :updated_at
             )'
        );

        foreach ($characters as $character) {
            $relationship->execute([
                'save_id' => $saveId,
                'character_id' => $character['id'],
                'mood' => 'neutral',
                'known_info_json' => $this->json($defaultKnownInfo),
                'daily_reset_date' => $today,
                'timezone' => 'UTC',
                'level_key' => 'stranger',
                'communication_style_json' => $this->json($communicationStyle),
                'last_status_change' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $milestoneStatement = $this->db->prepare(
            'INSERT IGNORE INTO relationship_milestone_states
             (save_id, character_id, milestone_id, achieved, achieved_at)
             VALUES (:save_id, :character_id, :milestone_id, 0, NULL)'
        );
        foreach ($characters as $character) {
            foreach ($milestones as $milestone) {
                $milestoneStatement->execute([
                    'save_id' => $saveId,
                    'character_id' => $character['id'],
                    'milestone_id' => $milestone['milestone_id'],
                ]);
            }
        }

        $photoStatement = $this->db->prepare(
            'INSERT IGNORE INTO character_photo_states
             (save_id, character_id, photo_id, unlocked, unlocked_at)
             VALUES (:save_id, :character_id, :photo_id, :unlocked, :unlocked_at)'
        );
        foreach ($photos as $photo) {
            $unlocked = (int) $photo['starts_unlocked'] === 1;
            $photoStatement->execute([
                'save_id' => $saveId,
                'character_id' => $photo['character_id'],
                'photo_id' => $photo['photo_id'],
                'unlocked' => $unlocked ? 1 : 0,
                'unlocked_at' => $unlocked ? $now : null,
            ]);
        }

        $achievementStatement = $this->db->prepare(
            'INSERT IGNORE INTO achievement_states
             (save_id, achievement_id, progress, achieved, achieved_at)
             VALUES (:save_id, :achievement_id, 0, 0, NULL)'
        );
        foreach ($achievements as $achievement) {
            $achievementStatement->execute([
                'save_id' => $saveId,
                'achievement_id' => $achievement['id'],
            ]);
        }

        $storylineStatement = $this->db->prepare(
            'INSERT IGNORE INTO storyline_states
             (save_id, storyline_id, unlocked, completed, completed_at)
             VALUES (:save_id, :storyline_id, 0, 0, NULL)'
        );
        foreach ($storylines as $storyline) {
            $storylineStatement->execute([
                'save_id' => $saveId,
                'storyline_id' => $storyline['storyline_id'],
            ]);
        }
    }

    public function findSaveByUserId(string $authUserId): ?array
    {
        $statement = $this->db->prepare('SELECT * FROM game_saves WHERE auth_user_id = :auth_user_id');
        $statement->execute(['auth_user_id' => $authUserId]);
        $row = $statement->fetch();
        return $row ? $this->decodeSave($row) : null;
    }

    public function getSave(int $saveId): array
    {
        $statement = $this->db->prepare('SELECT * FROM game_saves WHERE id = :id');
        $statement->execute(['id' => $saveId]);
        $row = $statement->fetch();
        if (!$row) {
            throw new RuntimeException('Game save not found.');
        }

        return $this->decodeSave($row);
    }

    public function updateSave(int $saveId, array $fields): void
    {
        $allowed = [
            'player_name', 'player_species', 'player_gender', 'sexual_preference', 'player_traits_json',
            'backstory', 'charisma', 'intelligence', 'adventure', 'empathy', 'technology',
            'current_week', 'total_conversations', 'total_dates', 'super_likes_available',
            'conflict_resolution_skill', 'icebreaker_unlocks_json', 'selected_character_id',
            'selected_activities_json', 'status',
        ];
        $this->updateTable('game_saves', 'id', $saveId, $fields, $allowed);
    }

    public function listRelationshipStates(int $saveId): array
    {
        $statement = $this->db->prepare(
            'SELECT * FROM relationship_states WHERE save_id = :save_id ORDER BY character_id ASC'
        );
        $statement->execute(['save_id' => $saveId]);
        return array_map([$this, 'decodeRelationship'], $statement->fetchAll());
    }

    public function getRelationshipState(int $saveId, string $characterId): array
    {
        $statement = $this->db->prepare(
            'SELECT * FROM relationship_states WHERE save_id = :save_id AND character_id = :character_id'
        );
        $statement->execute([
            'save_id' => $saveId,
            'character_id' => $characterId,
        ]);
        $row = $statement->fetch();
        if (!$row) {
            throw new RuntimeException('Relationship state not found.');
        }

        return $this->decodeRelationship($row);
    }

    public function updateRelationship(int $saveId, string $characterId, array $fields): void
    {
        $allowed = [
            'affection', 'mood', 'known_info_json', 'last_interaction_date', 'daily_reset_date',
            'interactions_used', 'max_interactions', 'timezone', 'level_key', 'compatibility',
            'trust', 'intimacy', 'commitment', 'communication_style_json', 'shared_experiences',
            'conflicts_count', 'last_status_change',
        ];
        $this->updateRelationshipTable($saveId, $characterId, $fields, $allowed);
    }

    public function listMilestoneStates(int $saveId, ?string $characterId = null): array
    {
        $sql = 'SELECT * FROM relationship_milestone_states WHERE save_id = :save_id';
        $params = ['save_id' => $saveId];
        if ($characterId !== null) {
            $sql .= ' AND character_id = :character_id';
            $params['character_id'] = $characterId;
        }
        $statement = $this->db->prepare($sql);
        $statement->execute($params);
        return $statement->fetchAll();
    }

    public function setMilestoneAchieved(int $saveId, string $characterId, string $milestoneId): void
    {
        $statement = $this->db->prepare(
            'UPDATE relationship_milestone_states
             SET achieved = 1, achieved_at = COALESCE(achieved_at, :achieved_at)
             WHERE save_id = :save_id AND character_id = :character_id AND milestone_id = :milestone_id'
        );
        $statement->execute([
            'achieved_at' => $this->now(),
            'save_id' => $saveId,
            'character_id' => $characterId,
            'milestone_id' => $milestoneId,
        ]);
    }

    public function listPhotoStates(int $saveId, ?string $characterId = null): array
    {
        $sql = 'SELECT * FROM character_photo_states WHERE save_id = :save_id';
        $params = ['save_id' => $saveId];
        if ($characterId !== null) {
            $sql .= ' AND character_id = :character_id';
            $params['character_id'] = $characterId;
        }
        $statement = $this->db->prepare($sql);
        $statement->execute($params);
        return $statement->fetchAll();
    }

    public function setPhotoUnlocked(int $saveId, string $characterId, string $photoId): void
    {
        $statement = $this->db->prepare(
            'UPDATE character_photo_states
             SET unlocked = 1, unlocked_at = COALESCE(unlocked_at, :unlocked_at)
             WHERE save_id = :save_id AND character_id = :character_id AND photo_id = :photo_id'
        );
        $statement->execute([
            'unlocked_at' => $this->now(),
            'save_id' => $saveId,
            'character_id' => $characterId,
            'photo_id' => $photoId,
        ]);
    }

    public function listAchievementStates(int $saveId): array
    {
        $statement = $this->db->prepare('SELECT * FROM achievement_states WHERE save_id = :save_id');
        $statement->execute(['save_id' => $saveId]);
        return $statement->fetchAll();
    }

    public function updateAchievementState(int $saveId, string $achievementId, int $progress, bool $achieved): void
    {
        $statement = $this->db->prepare(
            'UPDATE achievement_states
             SET progress = :progress,
                 achieved = :achieved,
                 achieved_at = CASE
                    WHEN :achieved_for_timestamp = 1 AND achieved_at IS NULL THEN :achieved_at
                    ELSE achieved_at
                 END
             WHERE save_id = :save_id AND achievement_id = :achievement_id'
        );
        $statement->execute([
            'progress' => $progress,
            'achieved' => $achieved ? 1 : 0,
            'achieved_for_timestamp' => $achieved ? 1 : 0,
            'achieved_at' => $this->now(),
            'save_id' => $saveId,
            'achievement_id' => $achievementId,
        ]);
    }

    public function listStorylineStates(int $saveId): array
    {
        $statement = $this->db->prepare('SELECT * FROM storyline_states WHERE save_id = :save_id');
        $statement->execute(['save_id' => $saveId]);
        return $statement->fetchAll();
    }

    public function updateStorylineUnlocked(int $saveId, string $storylineId, bool $unlocked): void
    {
        $statement = $this->db->prepare(
            'UPDATE storyline_states
             SET unlocked = :unlocked
             WHERE save_id = :save_id AND storyline_id = :storyline_id'
        );
        $statement->execute([
            'unlocked' => $unlocked ? 1 : 0,
            'save_id' => $saveId,
            'storyline_id' => $storylineId,
        ]);
    }

    public function completeStoryline(int $saveId, string $storylineId): void
    {
        $statement = $this->db->prepare(
            'UPDATE storyline_states
             SET unlocked = 1, completed = 1, completed_at = COALESCE(completed_at, :completed_at)
             WHERE save_id = :save_id AND storyline_id = :storyline_id'
        );
        $statement->execute([
            'completed_at' => $this->now(),
            'save_id' => $saveId,
            'storyline_id' => $storylineId,
        ]);
    }

    public function addDateHistory(array $data): void
    {
        $statement = $this->db->prepare(
            'INSERT INTO date_history (
                save_id, character_id, date_plan_id, success, affection_gained,
                compatibility_at_time, player_level, notes, occurred_at
             ) VALUES (
                :save_id, :character_id, :date_plan_id, :success, :affection_gained,
                :compatibility_at_time, :player_level, :notes, :occurred_at
             )'
        );
        $statement->execute([
            'save_id' => $data['save_id'],
            'character_id' => $data['character_id'],
            'date_plan_id' => $data['date_plan_id'],
            'success' => $data['success'] ? 1 : 0,
            'affection_gained' => $data['affection_gained'],
            'compatibility_at_time' => $data['compatibility_at_time'],
            'player_level' => $data['player_level'],
            'notes' => $data['notes'] ?? null,
            'occurred_at' => $data['occurred_at'] ?? $this->now(),
        ]);
    }

    public function listDateHistory(int $saveId, ?string $characterId = null): array
    {
        $sql = 'SELECT * FROM date_history WHERE save_id = :save_id';
        $params = ['save_id' => $saveId];
        if ($characterId !== null) {
            $sql .= ' AND character_id = :character_id';
            $params['character_id'] = $characterId;
        }
        $sql .= ' ORDER BY occurred_at DESC, id DESC';
        $statement = $this->db->prepare($sql);
        $statement->execute($params);
        return $statement->fetchAll();
    }

    public function addMemory(array $data): void
    {
        $statement = $this->db->prepare(
            'INSERT INTO relationship_memories (
                save_id, character_id, memory_key, memory_type, title, description,
                emotional_impact, participant_emotions_json, affection_at_time,
                consequence, tags_json, occurred_at
             ) VALUES (
                :save_id, :character_id, :memory_key, :memory_type, :title, :description,
                :emotional_impact, :participant_emotions_json, :affection_at_time,
                :consequence, :tags_json, :occurred_at
             )'
        );
        $statement->execute([
            'save_id' => $data['save_id'],
            'character_id' => $data['character_id'],
            'memory_key' => $data['memory_key'],
            'memory_type' => $data['memory_type'],
            'title' => $data['title'],
            'description' => $data['description'],
            'emotional_impact' => $data['emotional_impact'],
            'participant_emotions_json' => $this->json($data['participant_emotions']),
            'affection_at_time' => $data['affection_at_time'],
            'consequence' => $data['consequence'] ?? null,
            'tags_json' => $this->json($data['tags']),
            'occurred_at' => $data['occurred_at'] ?? $this->now(),
        ]);
    }

    public function listMemories(int $saveId, ?string $characterId = null): array
    {
        $sql = 'SELECT * FROM relationship_memories WHERE save_id = :save_id';
        $params = ['save_id' => $saveId];
        if ($characterId !== null) {
            $sql .= ' AND character_id = :character_id';
            $params['character_id'] = $characterId;
        }
        $sql .= ' ORDER BY occurred_at DESC, id DESC';
        $statement = $this->db->prepare($sql);
        $statement->execute($params);
        return array_map([$this, 'decodeMemory'], $statement->fetchAll());
    }

    public function addSuperLike(int $saveId, string $characterId, array $effect, array $result): void
    {
        $statement = $this->db->prepare(
            'INSERT INTO super_likes (save_id, character_id, effect_json, result_json, used_at)
             VALUES (:save_id, :character_id, :effect_json, :result_json, :used_at)'
        );
        $statement->execute([
            'save_id' => $saveId,
            'character_id' => $characterId,
            'effect_json' => $this->json($effect),
            'result_json' => $this->json($result),
            'used_at' => $this->now(),
        ]);
    }

    public function addTemporaryBoost(array $data): void
    {
        $statement = $this->db->prepare(
            'INSERT INTO temporary_boosts (
                boost_id, save_id, character_id, boost_type, effect, value,
                description, starts_at, expires_at
             ) VALUES (
                :boost_id, :save_id, :character_id, :boost_type, :effect, :value,
                :description, :starts_at, :expires_at
             )'
        );
        $statement->execute($data);
    }

    public function listTemporaryBoosts(int $saveId, ?string $characterId = null): array
    {
        $sql = 'SELECT * FROM temporary_boosts WHERE save_id = :save_id AND expires_at > :now';
        $params = ['save_id' => $saveId, 'now' => $this->now()];
        if ($characterId !== null) {
            $sql .= ' AND character_id = :character_id';
            $params['character_id'] = $characterId;
        }
        $statement = $this->db->prepare($sql);
        $statement->execute($params);
        return $statement->fetchAll();
    }

    public function addConflict(array $data): void
    {
        $statement = $this->db->prepare(
            'INSERT INTO relationship_conflicts (
                conflict_id, save_id, character_id, conflict_type, severity, trigger_text,
                description, start_at, resolved, affection_penalty, resolution_options_json
             ) VALUES (
                :conflict_id, :save_id, :character_id, :conflict_type, :severity, :trigger_text,
                :description, :start_at, 0, :affection_penalty, :resolution_options_json
             )'
        );
        $statement->execute([
            'conflict_id' => $data['conflict_id'],
            'save_id' => $data['save_id'],
            'character_id' => $data['character_id'],
            'conflict_type' => $data['conflict_type'],
            'severity' => $data['severity'],
            'trigger_text' => $data['trigger_text'],
            'description' => $data['description'],
            'start_at' => $data['start_at'],
            'affection_penalty' => $data['affection_penalty'],
            'resolution_options_json' => $this->json($data['resolution_options']),
        ]);
    }

    public function getConflict(int $saveId, string $conflictId): array
    {
        $statement = $this->db->prepare(
            'SELECT * FROM relationship_conflicts WHERE save_id = :save_id AND conflict_id = :conflict_id'
        );
        $statement->execute(['save_id' => $saveId, 'conflict_id' => $conflictId]);
        $row = $statement->fetch();
        if (!$row) {
            throw new RuntimeException('Conflict not found.');
        }

        return $this->decodeConflict($row);
    }

    public function listConflicts(int $saveId, ?string $characterId = null): array
    {
        $sql = 'SELECT * FROM relationship_conflicts WHERE save_id = :save_id';
        $params = ['save_id' => $saveId];
        if ($characterId !== null) {
            $sql .= ' AND character_id = :character_id';
            $params['character_id'] = $characterId;
        }
        $sql .= ' ORDER BY start_at DESC';
        $statement = $this->db->prepare($sql);
        $statement->execute($params);
        return array_map([$this, 'decodeConflict'], $statement->fetchAll());
    }

    public function resolveConflict(int $saveId, string $conflictId, string $method): void
    {
        $statement = $this->db->prepare(
            'UPDATE relationship_conflicts
             SET resolved = 1, resolved_at = :resolved_at, resolution_method = :resolution_method
             WHERE save_id = :save_id AND conflict_id = :conflict_id'
        );
        $statement->execute([
            'resolved_at' => $this->now(),
            'resolution_method' => $method,
            'save_id' => $saveId,
            'conflict_id' => $conflictId,
        ]);
    }

    public function addEvent(int $saveId, string $eventType, ?string $characterId, array $payload): void
    {
        $statement = $this->db->prepare(
            'INSERT INTO game_events (save_id, event_type, character_id, payload_json, created_at)
             VALUES (:save_id, :event_type, :character_id, :payload_json, :created_at)'
        );
        $statement->execute([
            'save_id' => $saveId,
            'event_type' => $eventType,
            'character_id' => $characterId,
            'payload_json' => $this->json($payload),
            'created_at' => $this->now(),
        ]);
    }

    private function updateTable(string $table, string $idColumn, int $id, array $fields, array $allowed): void
    {
        $fields['updated_at'] = $this->now();
        $allowed[] = 'updated_at';

        $sets = [];
        $params = [$idColumn => $id];
        foreach ($fields as $field => $value) {
            if (!in_array($field, $allowed, true)) {
                continue;
            }
            $sets[] = $field . ' = :' . $field;
            $params[$field] = is_array($value) ? $this->json($value) : $value;
        }

        if ($sets === []) {
            return;
        }

        $statement = $this->db->prepare(
            sprintf('UPDATE %s SET %s WHERE %s = :%s', $table, implode(', ', $sets), $idColumn, $idColumn)
        );
        $statement->execute($params);
    }

    private function updateRelationshipTable(int $saveId, string $characterId, array $fields, array $allowed): void
    {
        $fields['updated_at'] = $this->now();
        $allowed[] = 'updated_at';

        $sets = [];
        $params = ['save_id' => $saveId, 'character_id' => $characterId];
        foreach ($fields as $field => $value) {
            if (!in_array($field, $allowed, true)) {
                continue;
            }
            $sets[] = $field . ' = :' . $field;
            $params[$field] = is_array($value) ? $this->json($value) : $value;
        }

        if ($sets === []) {
            return;
        }

        $statement = $this->db->prepare(
            'UPDATE relationship_states SET ' . implode(', ', $sets) .
            ' WHERE save_id = :save_id AND character_id = :character_id'
        );
        $statement->execute($params);
    }

    private function decodeSave(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'auth_user_id' => $row['auth_user_id'],
            'player_name' => $row['player_name'],
            'player_species' => $row['player_species'],
            'player_gender' => $row['player_gender'],
            'sexual_preference' => $row['sexual_preference'],
            'player_traits' => $this->decodeJson((string) $row['player_traits_json']),
            'backstory' => $row['backstory'],
            'stats' => [
                'charisma' => (int) $row['charisma'],
                'intelligence' => (int) $row['intelligence'],
                'adventure' => (int) $row['adventure'],
                'empathy' => (int) $row['empathy'],
                'technology' => (int) $row['technology'],
            ],
            'current_week' => (int) $row['current_week'],
            'total_conversations' => (int) $row['total_conversations'],
            'total_dates' => (int) $row['total_dates'],
            'super_likes_available' => (int) $row['super_likes_available'],
            'conflict_resolution_skill' => (int) $row['conflict_resolution_skill'],
            'icebreaker_unlocks' => $this->decodeJson((string) $row['icebreaker_unlocks_json']),
            'selected_character_id' => $row['selected_character_id'],
            'selected_activities' => $this->decodeJson((string) $row['selected_activities_json']),
            'status' => $row['status'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at'],
        ];
    }

    private function decodeRelationship(array $row): array
    {
        return [
            'save_id' => (int) $row['save_id'],
            'character_id' => $row['character_id'],
            'affection' => (int) $row['affection'],
            'mood' => $row['mood'],
            'known_info' => $this->decodeJson((string) $row['known_info_json']),
            'last_interaction_date' => $row['last_interaction_date'],
            'daily_reset_date' => $row['daily_reset_date'],
            'interactions_used' => (int) $row['interactions_used'],
            'max_interactions' => (int) $row['max_interactions'],
            'timezone' => $row['timezone'],
            'level_key' => $row['level_key'],
            'compatibility' => (int) $row['compatibility'],
            'trust' => (int) $row['trust'],
            'intimacy' => (int) $row['intimacy'],
            'commitment' => (int) $row['commitment'],
            'communication_style' => $this->decodeJson((string) $row['communication_style_json']),
            'shared_experiences' => (int) $row['shared_experiences'],
            'conflicts_count' => (int) $row['conflicts_count'],
            'last_status_change' => $row['last_status_change'],
        ];
    }

    private function decodeMemory(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'character_id' => $row['character_id'],
            'memory_key' => $row['memory_key'],
            'type' => $row['memory_type'],
            'title' => $row['title'],
            'description' => $row['description'],
            'emotional_impact' => (int) $row['emotional_impact'],
            'participant_emotions' => $this->decodeJson((string) $row['participant_emotions_json']),
            'affection_at_time' => (int) $row['affection_at_time'],
            'consequence' => $row['consequence'],
            'tags' => $this->decodeJson((string) $row['tags_json']),
            'occurred_at' => $row['occurred_at'],
        ];
    }

    private function decodeConflict(array $row): array
    {
        return [
            'id' => $row['conflict_id'],
            'character_id' => $row['character_id'],
            'type' => $row['conflict_type'],
            'severity' => $row['severity'],
            'trigger' => $row['trigger_text'],
            'description' => $row['description'],
            'start_at' => $row['start_at'],
            'resolved' => (int) $row['resolved'] === 1,
            'resolved_at' => $row['resolved_at'],
            'resolution_method' => $row['resolution_method'],
            'affection_penalty' => (int) $row['affection_penalty'],
            'resolution_options' => $this->decodeJson((string) $row['resolution_options_json']),
        ];
    }

    private function json(array $value): string
    {
        return json_encode($value, JSON_UNESCAPED_SLASHES);
    }

    private function decodeJson(string $json): array
    {
        $decoded = json_decode($json, true);
        return is_array($decoded) ? $decoded : [];
    }

    private function now(): string
    {
        return gmdate('Y-m-d H:i:s');
    }
}
