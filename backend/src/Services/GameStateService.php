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
