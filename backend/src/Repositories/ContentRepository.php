<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;
use RuntimeException;

final class ContentRepository
{
    public function __construct(private readonly PDO $db)
    {
    }

    public function listCharacters(): array
    {
        $statement = $this->db->query('SELECT * FROM characters ORDER BY sort_order ASC');
        return array_map([$this, 'decodeCharacter'], $statement->fetchAll());
    }

    public function getCharacter(string $characterId): array
    {
        $statement = $this->db->prepare('SELECT * FROM characters WHERE character_id = :character_id');
        $statement->execute(['character_id' => $characterId]);
        $row = $statement->fetch();
        if (!$row) {
            throw new RuntimeException('Unknown character.');
        }

        return $this->decodeCharacter($row);
    }

    public function getGameConstant(string $key): mixed
    {
        $statement = $this->db->prepare('SELECT * FROM game_constants WHERE constant_key = :constant_key');
        $statement->execute(['constant_key' => $key]);
        $row = $statement->fetch();
        if (!$row) {
            return null;
        }

        if ($row['json_value'] !== null) {
            return $this->decodeJson((string) $row['json_value']);
        }

        return $row['numeric_value'] === null ? null : (int) $row['numeric_value'];
    }

    public function listKnowledgeUnlockRules(): array
    {
        $statement = $this->db->query('SELECT * FROM knowledge_unlock_rules ORDER BY sort_order ASC');
        return $statement->fetchAll();
    }

    public function listRelationshipLevels(): array
    {
        $statement = $this->db->query('SELECT * FROM relationship_levels ORDER BY sort_order ASC');
        return $statement->fetchAll();
    }

    public function listMilestones(): array
    {
        $statement = $this->db->query('SELECT * FROM relationship_milestones ORDER BY sort_order ASC');
        return $statement->fetchAll();
    }

    public function listPhotos(): array
    {
        $statement = $this->db->query('SELECT * FROM character_photos ORDER BY character_id ASC, sort_order ASC');
        return $statement->fetchAll();
    }

    public function listPhotosForCharacter(string $characterId): array
    {
        $statement = $this->db->prepare(
            'SELECT * FROM character_photos WHERE character_id = :character_id ORDER BY sort_order ASC'
        );
        $statement->execute(['character_id' => $characterId]);
        return $statement->fetchAll();
    }

    public function listAchievements(): array
    {
        $statement = $this->db->query('SELECT * FROM achievements ORDER BY sort_order ASC');
        return array_map([$this, 'decodeAchievement'], $statement->fetchAll());
    }

    public function listMoods(): array
    {
        $statement = $this->db->query('SELECT * FROM moods ORDER BY mood_key ASC');
        return array_map([$this, 'decodeMood'], $statement->fetchAll());
    }

    public function getMood(string $moodKey): ?array
    {
        $statement = $this->db->prepare('SELECT * FROM moods WHERE mood_key = :mood_key');
        $statement->execute(['mood_key' => $moodKey]);
        $row = $statement->fetch();
        return $row ? $this->decodeMood($row) : null;
    }

    public function getDialogueOption(string $optionId): array
    {
        $statement = $this->db->prepare('SELECT * FROM dialogue_options WHERE option_id = :option_id');
        $statement->execute(['option_id' => $optionId]);
        $row = $statement->fetch();
        if (!$row) {
            throw new RuntimeException('Unknown dialogue option.');
        }

        return $this->decodeDialogueOption($row);
    }

    public function listRootDialogueOptions(string $characterId): array
    {
        $statement = $this->db->prepare(
            'SELECT * FROM dialogue_options
             WHERE character_id = :character_id AND parent_option_id IS NULL
             ORDER BY sort_order ASC'
        );
        $statement->execute(['character_id' => $characterId]);
        return array_map([$this, 'decodeDialogueOption'], $statement->fetchAll());
    }

    public function getDialogueResponse(string $optionId): ?array
    {
        $statement = $this->db->prepare('SELECT * FROM dialogue_responses WHERE option_id = :option_id');
        $statement->execute(['option_id' => $optionId]);
        $row = $statement->fetch();
        if (!$row) {
            return null;
        }

        return [
            'option_id' => $row['option_id'],
            'text' => $row['response_text'],
            'emotion' => $row['emotion'],
            'affection_change' => (int) $row['affection_change'],
            'consequence' => $row['consequence'],
        ];
    }

    public function getDialogueFallback(string $topic): ?array
    {
        $statement = $this->db->prepare('SELECT * FROM dialogue_fallbacks WHERE topic = :topic');
        $statement->execute(['topic' => $topic]);
        $row = $statement->fetch();
        if (!$row) {
            return null;
        }

        return [
            'topic' => $row['topic'],
            'text' => $row['response_text'],
            'emotion' => $row['emotion'],
            'affection_change' => (int) $row['affection_change'],
            'min_affection' => $row['min_affection'] === null ? null : (int) $row['min_affection'],
        ];
    }

    public function listDatePlans(): array
    {
        $statement = $this->db->query('SELECT * FROM date_plans ORDER BY sort_order ASC');
        return array_map([$this, 'decodeDatePlan'], $statement->fetchAll());
    }

    public function getDatePlan(string $datePlanId): array
    {
        $statement = $this->db->prepare('SELECT * FROM date_plans WHERE date_plan_id = :date_plan_id');
        $statement->execute(['date_plan_id' => $datePlanId]);
        $row = $statement->fetch();
        if (!$row) {
            throw new RuntimeException('Unknown date plan.');
        }

        return $this->decodeDatePlan($row);
    }

    public function listActivities(?string $activityType = null): array
    {
        if ($activityType === null) {
            $statement = $this->db->query('SELECT * FROM activities ORDER BY activity_type ASC, sort_order ASC');
            return array_map([$this, 'decodeActivity'], $statement->fetchAll());
        }

        $statement = $this->db->prepare(
            'SELECT * FROM activities WHERE activity_type = :activity_type ORDER BY sort_order ASC'
        );
        $statement->execute(['activity_type' => $activityType]);
        return array_map([$this, 'decodeActivity'], $statement->fetchAll());
    }

    public function getActivity(string $activityId, string $activityType): array
    {
        $statement = $this->db->prepare(
            'SELECT * FROM activities WHERE activity_id = :activity_id AND activity_type = :activity_type'
        );
        $statement->execute([
            'activity_id' => $activityId,
            'activity_type' => $activityType,
        ]);
        $row = $statement->fetch();
        if (!$row) {
            throw new RuntimeException('Unknown activity.');
        }

        return $this->decodeActivity($row);
    }

    public function listStorylines(): array
    {
        $statement = $this->db->query('SELECT * FROM storylines ORDER BY sort_order ASC');
        return $statement->fetchAll();
    }

    public function getStoryline(string $storylineId): array
    {
        $statement = $this->db->prepare('SELECT * FROM storylines WHERE storyline_id = :storyline_id');
        $statement->execute(['storyline_id' => $storylineId]);
        $row = $statement->fetch();
        if (!$row) {
            throw new RuntimeException('Unknown storyline.');
        }

        return $row;
    }

    public function listStorylineChoices(string $storylineId): array
    {
        $statement = $this->db->prepare(
            'SELECT * FROM storyline_choices WHERE storyline_id = :storyline_id ORDER BY sort_order ASC'
        );
        $statement->execute(['storyline_id' => $storylineId]);
        return $statement->fetchAll();
    }

    public function getStorylineChoice(string $storylineId, string $choiceId): array
    {
        $statement = $this->db->prepare(
            'SELECT * FROM storyline_choices
             WHERE storyline_id = :storyline_id AND choice_id = :choice_id'
        );
        $statement->execute([
            'storyline_id' => $storylineId,
            'choice_id' => $choiceId,
        ]);
        $row = $statement->fetch();
        if (!$row) {
            throw new RuntimeException('Unknown storyline choice.');
        }

        return $row;
    }

    public function listStorylineRewards(string $storylineId): array
    {
        $statement = $this->db->prepare(
            'SELECT * FROM storyline_rewards WHERE storyline_id = :storyline_id ORDER BY sort_order ASC'
        );
        $statement->execute(['storyline_id' => $storylineId]);
        return $statement->fetchAll();
    }

    public function getSuperLikeEffect(string $characterId): ?array
    {
        $statement = $this->db->prepare('SELECT * FROM super_like_effects WHERE character_id = :character_id');
        $statement->execute(['character_id' => $characterId]);
        $row = $statement->fetch();
        if (!$row) {
            return null;
        }

        return [
            'affection_bonus' => (int) $row['affection_bonus'],
            'special_dialogue' => (bool) $row['special_dialogue'],
            'mood_boost' => (bool) $row['mood_boost'],
            'temporary_compatibility_bonus' => (int) $row['temporary_compatibility_bonus'],
            'duration_hours' => (int) $row['duration_hours'],
        ];
    }

    public function listSuperLikeResponses(string $characterId): array
    {
        $statement = $this->db->prepare(
            'SELECT response_text FROM super_like_responses
             WHERE character_id = :character_id ORDER BY response_index ASC'
        );
        $statement->execute(['character_id' => $characterId]);
        return array_map(static fn(array $row): string => (string) $row['response_text'], $statement->fetchAll());
    }

    public function getSuperLikeUnlocks(string $characterId): array
    {
        $statement = $this->db->prepare('SELECT * FROM super_like_unlocks WHERE character_id = :character_id');
        $statement->execute(['character_id' => $characterId]);
        $row = $statement->fetch();
        if (!$row) {
            return ['dialogue' => [], 'content' => []];
        }

        return [
            'dialogue' => $this->decodeJson((string) $row['dialogue_json']),
            'content' => $this->decodeJson((string) $row['content_json']),
        ];
    }

    public function listBaseResolutionOptions(): array
    {
        $statement = $this->db->query('SELECT * FROM conflict_resolution_options ORDER BY sort_order ASC');
        return array_map([$this, 'decodeResolutionOption'], $statement->fetchAll());
    }

    public function listCharacterResolutionOptions(string $characterId): array
    {
        $statement = $this->db->prepare(
            'SELECT * FROM character_resolution_options
             WHERE character_id = :character_id ORDER BY sort_order ASC'
        );
        $statement->execute(['character_id' => $characterId]);
        return array_map([$this, 'decodeResolutionOption'], $statement->fetchAll());
    }

    public function randomConflictTemplate(): ?array
    {
        $statement = $this->db->query('SELECT * FROM conflict_templates ORDER BY RAND() LIMIT 1');
        $row = $statement->fetch();
        return $row ?: null;
    }

    public function randomConflictTrigger(string $conflictType): ?string
    {
        $statement = $this->db->prepare(
            'SELECT trigger_text FROM conflict_template_triggers
             WHERE conflict_type = :conflict_type ORDER BY RAND() LIMIT 1'
        );
        $statement->execute(['conflict_type' => $conflictType]);
        $row = $statement->fetch();
        return $row ? (string) $row['trigger_text'] : null;
    }

    public function getConflictDescription(string $conflictType, string $characterId): ?string
    {
        $statement = $this->db->prepare(
            'SELECT description FROM conflict_template_descriptions
             WHERE conflict_type = :conflict_type AND character_id = :character_id'
        );
        $statement->execute([
            'conflict_type' => $conflictType,
            'character_id' => $characterId,
        ]);
        $row = $statement->fetch();
        return $row ? (string) $row['description'] : null;
    }

    public function listAvailableIcebreakers(
        string $characterId,
        int $affection,
        string $mood,
        string $timeOfDay
    ): array {
        $statement = $this->db->prepare(
            'SELECT * FROM icebreaker_messages
             WHERE character_id = :character_id
             ORDER BY effectiveness DESC, sort_order ASC'
        );
        $statement->execute(['character_id' => $characterId]);

        $messages = [];
        foreach ($statement->fetchAll() as $row) {
            $context = $this->decodeJson((string) $row['context_json']);
            if (($context['requiredAffection'] ?? 0) > $affection) {
                continue;
            }
            if (isset($context['basedOnMood']) && $context['basedOnMood'] !== $mood) {
                continue;
            }
            if (isset($context['timeOfDay']) && $context['timeOfDay'] !== $timeOfDay) {
                continue;
            }

            $messages[] = [
                'id' => $row['icebreaker_id'],
                'character_id' => $row['character_id'],
                'category' => $row['category'],
                'message' => $row['message'],
                'context' => $context,
                'effectiveness' => (int) $row['effectiveness'],
            ];
        }

        return $messages;
    }

    private function decodeCharacter(array $row): array
    {
        return [
            'id' => $row['character_id'],
            'name' => $row['name'],
            'species' => $row['species'],
            'gender' => $row['gender'],
            'personality' => $row['personality'],
            'image' => $row['image'],
            'profile' => $this->decodeJson((string) $row['profile_json']),
            'relationship_template' => $this->decodeJson((string) $row['relationship_template_json']),
            'sort_order' => (int) $row['sort_order'],
        ];
    }

    private function decodeAchievement(array $row): array
    {
        return [
            'id' => $row['achievement_id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'icon' => $row['icon'],
            'category' => $row['category'],
            'condition' => $this->decodeJson((string) $row['condition_json']),
            'reward' => $row['reward_json'] === null ? null : $this->decodeJson((string) $row['reward_json']),
            'sort_order' => (int) $row['sort_order'],
        ];
    }

    private function decodeMood(array $row): array
    {
        return [
            'mood' => $row['mood_key'],
            'description' => $row['description'],
            'bonus' => (int) $row['bonus'],
            'penalty' => (int) $row['penalty'],
            'preferred_topics' => $this->decodeJson((string) $row['preferred_topics_json']),
        ];
    }

    private function decodeDialogueOption(array $row): array
    {
        return [
            'id' => $row['option_id'],
            'tree_id' => $row['tree_id'],
            'character_id' => $row['character_id'],
            'parent_option_id' => $row['parent_option_id'],
            'text' => $row['text'],
            'topic' => $row['topic'],
            'emotion' => $row['emotion'],
            'requires_affection' => $row['requires_affection'] === null ? null : (int) $row['requires_affection'],
            'requires_mood' => $row['requires_mood'],
            'next_option_ids' => $this->decodeJson((string) $row['next_option_ids_json']),
            'sort_order' => (int) $row['sort_order'],
        ];
    }

    private function decodeDatePlan(array $row): array
    {
        return [
            'id' => $row['date_plan_id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'activity_type' => $row['activity_type'],
            'location' => $row['location'],
            'duration_minutes' => (int) $row['duration_minutes'],
            'preferred_topics' => $this->decodeJson((string) $row['preferred_topics_json']),
            'required_affection' => (int) $row['required_affection'],
            'compatibility_bonus' => (int) $row['compatibility_bonus'],
            'sort_order' => (int) $row['sort_order'],
        ];
    }

    private function decodeActivity(array $row): array
    {
        return [
            'id' => $row['activity_id'],
            'type' => $row['activity_type'],
            'name' => $row['name'],
            'description' => $row['description'],
            'reward' => $row['reward'],
            'category' => $row['category'],
            'stat_bonus' => $this->decodeJson((string) $row['stat_bonus_json']),
            'energy_cost' => $row['energy_cost'] === null ? null : (int) $row['energy_cost'],
            'time_slots' => $row['time_slots'] === null ? null : (int) $row['time_slots'],
            'sort_order' => (int) $row['sort_order'],
        ];
    }

    private function decodeResolutionOption(array $row): array
    {
        return [
            'id' => $row['option_id'],
            'method' => $row['method'],
            'label' => $row['label'],
            'description' => $row['description'],
            'requirements' => $row['requirements_json'] === null
                ? null
                : $this->decodeJson((string) $row['requirements_json']),
            'preview' => $this->decodeJson((string) $row['preview_json']),
        ];
    }

    private function decodeJson(string $json): mixed
    {
        $decoded = json_decode($json, true);
        return $decoded === null && $json !== 'null' ? [] : $decoded;
    }
}
