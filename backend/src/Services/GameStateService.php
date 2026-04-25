<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\ContentRepository;
use App\Repositories\GameRepository;

final class GameStateService
{
    public function __construct(
        private readonly ContentRepository $contentRepository,
        private readonly GameRepository $gameRepository,
        private readonly GameRulesService $rules
    ) {
    }

    public function state(int $saveId): array
    {
        $save = $this->gameRepository->getSave($saveId);
        $relationships = $this->indexBy($this->gameRepository->listRelationshipStates($saveId), 'character_id');
        $milestoneStates = $this->groupByComposite(
            $this->gameRepository->listMilestoneStates($saveId),
            'character_id',
            'milestone_id'
        );
        $photoStates = $this->groupByComposite(
            $this->gameRepository->listPhotoStates($saveId),
            'character_id',
            'photo_id'
        );
        $dateHistory = $this->groupBy($this->gameRepository->listDateHistory($saveId), 'character_id');
        $memories = $this->groupBy($this->gameRepository->listMemories($saveId), 'character_id');
        $conflicts = $this->groupBy($this->gameRepository->listConflicts($saveId), 'character_id');
        $levels = $this->contentRepository->listRelationshipLevels();
        $moods = $this->contentRepository->listMoods();

        $characters = [];
        foreach ($this->contentRepository->listCharacters() as $character) {
            $relationship = $relationships[$character['id']] ?? null;
            if ($relationship === null) {
                continue;
            }

            $characterMilestones = [];
            foreach ($this->contentRepository->listMilestones() as $milestone) {
                $state = $milestoneStates[$character['id']][$milestone['milestone_id']] ?? null;
                $characterMilestones[] = [
                    'id' => $milestone['milestone_id'],
                    'name' => $milestone['name'],
                    'description' => $milestone['description'],
                    'unlockedAt' => (int) $milestone['unlocked_at_affection'],
                    'achieved' => $state ? (int) $state['achieved'] === 1 : false,
                    'achievedDate' => $state['achieved_at'] ?? null,
                ];
            }

            $gallery = [];
            foreach ($this->contentRepository->listPhotosForCharacter($character['id']) as $photo) {
                $state = $photoStates[$character['id']][$photo['photo_id']] ?? null;
                $gallery[] = [
                    'id' => $photo['photo_id'],
                    'url' => $photo['url'],
                    'title' => $photo['title'],
                    'description' => $photo['description'],
                    'unlockedAt' => (int) $photo['unlocked_at_affection'],
                    'unlocked' => $state ? (int) $state['unlocked'] === 1 : (int) $photo['starts_unlocked'] === 1,
                    'unlockedDate' => $state['unlocked_at'] ?? null,
                    'rarity' => $photo['rarity'],
                ];
            }

            $characterConflicts = $conflicts[$character['id']] ?? [];
            $activeConflicts = array_values(array_filter(
                $characterConflicts,
                static fn(array $conflict): bool => !$conflict['resolved']
            ));
            $conflictHistory = array_values(array_filter(
                $characterConflicts,
                static fn(array $conflict): bool => $conflict['resolved']
            ));

            $characters[] = [
                'id' => $character['id'],
                'name' => $character['name'],
                'species' => $character['species'],
                'gender' => $character['gender'],
                'personality' => $character['personality'],
                'image' => $character['image'],
                'affection' => (int) $relationship['affection'],
                'mood' => $relationship['mood'],
                'milestones' => $characterMilestones,
                'profile' => $character['profile'],
                'lastInteractionDate' => $relationship['last_interaction_date'],
                'photoGallery' => $gallery,
                'dateHistory' => $dateHistory[$character['id']] ?? [],
                'knownInfo' => $relationship['known_info'],
                'dailyInteractions' => [
                    'lastResetDate' => $relationship['daily_reset_date'],
                    'interactionsUsed' => (int) $relationship['interactions_used'],
                    'maxInteractions' => (int) $relationship['max_interactions'],
                    'timezone' => $relationship['timezone'],
                ],
                'relationshipStatus' => $this->rules->formatRelationshipStatus($relationship, $character, $levels),
                'relationshipMemories' => $memories[$character['id']] ?? [],
                'activeConflicts' => $activeConflicts,
                'conflictHistory' => $conflictHistory,
                'availableDialogueOptions' => $this->contentRepository->listRootDialogueOptions($character['id']),
                'availableIcebreakers' => $this->contentRepository->listAvailableIcebreakers(
                    $character['id'],
                    (int) $relationship['affection'],
                    (string) $relationship['mood'],
                    $this->timeOfDay()
                ),
                'relationshipGoals' => $this->relationshipGoals($save, $relationship, $character, $characterMilestones),
                'journal' => [
                    'knownInfo' => $relationship['known_info'],
                    'recentMemories' => array_slice($memories[$character['id']] ?? [], 0, 5),
                    'activeConflicts' => $activeConflicts,
                    'milestones' => $characterMilestones,
                ],
                'cooldowns' => $this->cooldownPayload((int) $save['id'], (string) $character['id'], (int) $save['current_week']),
                'romanticallyCompatible' => $this->rules->isRomanticallyCompatible($save, $character),
            ];
        }

        return [
            'server_authoritative' => true,
            'save_id' => $save['id'],
            'player' => $this->playerPayload($save),
            'currentWeek' => $save['current_week'],
            'totalConversations' => $save['total_conversations'],
            'totalDates' => $save['total_dates'],
            'selectedCharacterId' => $save['selected_character_id'],
            'selectedActivities' => $save['selected_activities'],
            'advancedState' => [
                'superLikesAvailable' => $save['super_likes_available'],
                'conflictResolutionSkill' => $save['conflict_resolution_skill'],
                'icebreakerUnlocks' => $save['icebreaker_unlocks'],
            ],
            'selfImprovementState' => $this->selfImprovementPayload($save),
            'weeklySummary' => $this->weeklySummaryPayload((int) $save['id'], (int) $save['current_week']),
            'randomEvents' => $this->randomEventPayload((int) $save['id']),
            'accountStatus' => [
                'authUserId' => $save['auth_user_id'],
                'saveId' => $save['id'],
            ],
            'characters' => $characters,
            'achievements' => $this->achievementPayload($saveId),
            'availableStorylines' => $this->availableStorylinePayload($saveId),
            'content' => $this->contentPayload($moods),
        ];
    }

    public function contentPayload(?array $moods = null): array
    {
        return [
            'characters' => $this->contentRepository->listCharacters(),
            'datePlans' => $this->contentRepository->listDatePlans(),
            'weeklyActivities' => $this->contentRepository->listActivities('weekly'),
            'selfImprovementActivities' => $this->contentRepository->listActivities('daily'),
            'achievements' => $this->contentRepository->listAchievements(),
            'moods' => $moods ?? $this->contentRepository->listMoods(),
            'relationshipMilestones' => $this->contentRepository->listMilestones(),
            'relationshipLevels' => $this->contentRepository->listRelationshipLevels(),
        ];
    }

    private function playerPayload(array $save): ?array
    {
        if ($save['player_name'] === null) {
            return null;
        }

        return [
            'name' => $save['player_name'],
            'species' => $save['player_species'],
            'gender' => $save['player_gender'],
            'sexualPreference' => $save['sexual_preference'],
            'traits' => $save['player_traits'],
            'backstory' => $save['backstory'],
            'stats' => $save['stats'],
        ];
    }

    private function achievementPayload(int $saveId): array
    {
        $states = $this->indexBy($this->gameRepository->listAchievementStates($saveId), 'achievement_id');
        $payload = [];
        foreach ($this->contentRepository->listAchievements() as $achievement) {
            $state = $states[$achievement['id']] ?? null;
            $payload[] = [
                ...$achievement,
                'achieved' => $state ? (int) $state['achieved'] === 1 : false,
                'achievedDate' => $state['achieved_at'] ?? null,
                'progress' => $state ? (int) $state['progress'] : 0,
            ];
        }

        return $payload;
    }

    private function selfImprovementPayload(array $save): array
    {
        $energyAvailable = 100;
        $timeSlotsAvailable = 5;
        $energyUsed = 0;
        $timeSlotsUsed = 0;
        $completedActivityIds = [];
        $week = (int) $save['current_week'];

        foreach ($this->gameRepository->listEvents((int) $save['id'], 'self_improvement_completed') as $event) {
            $payload = $event['payload'];
            if ((int) ($payload['week'] ?? 0) !== $week) {
                continue;
            }

            if (is_string($payload['activity_id'] ?? null)) {
                $completedActivityIds[] = (string) $payload['activity_id'];
            }
            $energyUsed += (int) ($payload['energy_cost'] ?? 0);
            $timeSlotsUsed += (int) ($payload['time_slots'] ?? 0);
        }

        return [
            'energyAvailable' => $energyAvailable,
            'energyUsed' => $energyUsed,
            'timeSlotsAvailable' => $timeSlotsAvailable,
            'timeSlotsUsed' => $timeSlotsUsed,
            'completedActivityIds' => array_values(array_unique($completedActivityIds)),
        ];
    }

    private function weeklySummaryPayload(int $saveId, int $currentWeek): ?array
    {
        foreach ($this->gameRepository->listEvents($saveId, 'weekly_activities_completed') as $event) {
            $payload = $event['payload'];
            if ((int) ($payload['week'] ?? 0) === $currentWeek - 1) {
                return $payload;
            }
        }
        return null;
    }

    private function randomEventPayload(int $saveId): array
    {
        return array_slice(array_map(
            static fn(array $event): array => $event['payload']['event'] ?? [],
            $this->gameRepository->listEvents($saveId, 'weekly_random_event')
        ), 0, 3);
    }

    private function cooldownPayload(int $saveId, string $characterId, int $week): array
    {
        $dialogues = 0;
        foreach ($this->gameRepository->listEventsForCharacter($saveId, $characterId, 'dialogue_choice') as $event) {
            if ((int) ($event['payload']['week'] ?? 0) === $week) {
                $dialogues++;
            }
        }
        $dateUsed = false;
        foreach ($this->gameRepository->listEventsForCharacter($saveId, $characterId, 'date_completed') as $event) {
            if ((int) ($event['payload']['week'] ?? 0) === $week) {
                $dateUsed = true;
                break;
            }
        }

        return [
            'dialoguesUsedThisWeek' => $dialogues,
            'dialoguesAllowedThisWeek' => 3,
            'dateAvailableThisWeek' => !$dateUsed,
        ];
    }

    private function relationshipGoals(array $save, array $relationship, array $character, array $milestones): array
    {
        $knownCount = count(array_filter($relationship['known_info'], static fn(bool $known): bool => $known));
        $achievedCount = count(array_filter($milestones, static fn(array $milestone): bool => $milestone['achieved']));

        return [
            [
                'id' => 'learn_more',
                'title' => 'Learn more about ' . $character['name'],
                'description' => 'Reveal at least 4 profile facts through conversation.',
                'progress' => min(4, $knownCount),
                'target' => 4,
                'completed' => $knownCount >= 4,
            ],
            [
                'id' => 'build_milestones',
                'title' => 'Build relationship milestones',
                'description' => 'Reach two shared milestones.',
                'progress' => min(2, $achievedCount),
                'target' => 2,
                'completed' => $achievedCount >= 2,
            ],
            [
                'id' => 'plan_date',
                'title' => 'Plan a compatible date',
                'description' => 'Use the date planner when affection is high enough.',
                'progress' => (int) $relationship['shared_experiences'] > 0 ? 1 : 0,
                'target' => 1,
                'completed' => (int) $relationship['shared_experiences'] > 0,
            ],
        ];
    }

    private function availableStorylinePayload(int $saveId): array
    {
        $states = $this->indexBy($this->gameRepository->listStorylineStates($saveId), 'storyline_id');
        $payload = [];
        foreach ($this->contentRepository->listStorylines() as $storyline) {
            $state = $states[$storyline['storyline_id']] ?? null;
            if (!$state || (int) $state['unlocked'] !== 1 || (int) $state['completed'] === 1) {
                continue;
            }

            $characterId = (string) $storyline['character_id'];
            $payload[$characterId][] = [
                'id' => $storyline['storyline_id'],
                'characterId' => $characterId,
                'requiredAffection' => (int) $storyline['required_affection'],
                'title' => $storyline['title'],
                'description' => $storyline['description'],
                'dialogue' => $storyline['dialogue'],
                'unlocked' => true,
                'completed' => false,
                'choices' => $this->storylineChoicesPayload((string) $storyline['storyline_id']),
                'rewards' => $this->storylineRewardsPayload((string) $storyline['storyline_id']),
            ];
        }

        return $payload;
    }

    private function storylineChoicesPayload(string $storylineId): array
    {
        return array_map(static fn(array $choice): array => [
            'id' => $choice['choice_id'],
            'text' => $choice['text'],
            'consequence' => $choice['consequence'],
            'affectionChange' => (int) $choice['affection_change'],
            'unlockNext' => $choice['unlock_next_storyline_id'],
        ], $this->contentRepository->listStorylineChoices($storylineId));
    }

    private function storylineRewardsPayload(string $storylineId): array
    {
        return array_map(static fn(array $reward): array => [
            'type' => $reward['reward_type'],
            'id' => $reward['reward_id'],
            'description' => $reward['description'],
        ], $this->contentRepository->listStorylineRewards($storylineId));
    }

    private function indexBy(array $rows, string $key): array
    {
        $indexed = [];
        foreach ($rows as $row) {
            $indexed[(string) $row[$key]] = $row;
        }
        return $indexed;
    }

    private function groupBy(array $rows, string $key): array
    {
        $grouped = [];
        foreach ($rows as $row) {
            $grouped[(string) $row[$key]][] = $row;
        }
        return $grouped;
    }

    private function groupByComposite(array $rows, string $outerKey, string $innerKey): array
    {
        $grouped = [];
        foreach ($rows as $row) {
            $grouped[(string) $row[$outerKey]][(string) $row[$innerKey]] = $row;
        }
        return $grouped;
    }

    private function timeOfDay(): string
    {
        $hour = (int) gmdate('G');
        if ($hour < 12) {
            return 'morning';
        }
        if ($hour < 17) {
            return 'afternoon';
        }
        if ($hour < 21) {
            return 'evening';
        }

        return 'night';
    }
}
