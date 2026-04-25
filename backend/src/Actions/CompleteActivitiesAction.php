<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\AuthUser;
use App\Repositories\ContentRepository;
use App\Repositories\GameRepository;
use App\Services\GameRulesService;
use App\Services\GameStateService;
use App\Services\ProgressionService;
use DomainException;

final class CompleteActivitiesAction
{
    private const WEEKLY_ENERGY = 100;
    private const WEEKLY_TIME_SLOTS = 5;

    public function __construct(
        private readonly ContentRepository $contentRepository,
        private readonly GameRepository $gameRepository,
        private readonly GameRulesService $rules,
        private readonly ProgressionService $progressionService,
        private readonly GameStateService $stateService
    ) {
    }

    public function execute(AuthUser $user, array $body): array
    {
        $activityIds = $body['activity_ids'] ?? null;
        if (!is_array($activityIds) || count($activityIds) !== 2) {
            throw new DomainException('Exactly two weekly activity IDs are required.');
        }

        $save = $this->gameRepository->getOrCreateSave($user);
        $this->progressionService->ensureInitialized((int) $save['id']);
        $stats = $save['stats'];
        $activities = [];
        $energyUsed = 0;
        $timeSlotsUsed = 0;
        foreach ($activityIds as $activityId) {
            if (!is_string($activityId)) {
                throw new DomainException('Activity IDs must be strings.');
            }
            $activity = $this->contentRepository->getActivity($activityId, 'weekly');
            $activities[] = $activity;
            $energyUsed += (int) ($activity['energy_cost'] ?? 25);
            $timeSlotsUsed += (int) ($activity['time_slots'] ?? 1);
            foreach ($activity['stat_bonus'] as $stat => $amount) {
                if (isset($stats[$stat])) {
                    $stats[$stat] = min(100, (int) $stats[$stat] + (int) $amount);
                }
            }
        }
        if ($energyUsed > self::WEEKLY_ENERGY) {
            throw new DomainException('Weekly activities exceed available energy.');
        }
        if ($timeSlotsUsed > self::WEEKLY_TIME_SLOTS) {
            throw new DomainException('Weekly activities exceed available time slots.');
        }

        $moods = $this->contentRepository->listMoods();
        $relationshipEffects = [];
        foreach ($this->gameRepository->listRelationshipStates((int) $save['id']) as $relationship) {
            $character = $this->contentRepository->getCharacter((string) $relationship['character_id']);
            $activityBonus = $this->activityPreferenceBonus($activities, $character);
            $neglectPenalty = $this->wasEngagedThisWeek(
                (int) $save['id'],
                (string) $relationship['character_id'],
                (int) $save['current_week']
            ) ? 0 : -1;
            $affectionChange = $activityBonus + $neglectPenalty;
            $newAffection = max(0, min(100, (int) $relationship['affection'] + $affectionChange));
            $mood = $activityBonus > 0 ? 'cheerful' : ($neglectPenalty < 0 ? 'melancholy' : $this->rules->randomMood($moods));

            $this->gameRepository->updateRelationship((int) $save['id'], (string) $relationship['character_id'], [
                'affection' => $newAffection,
                'mood' => $mood,
            ]);
            $relationshipEffects[] = [
                'character_id' => $relationship['character_id'],
                'character_name' => $character['name'],
                'affection_change' => $affectionChange,
                'mood' => $mood,
                'reason' => $activityBonus > 0
                    ? 'Enjoyed your weekly activity focus'
                    : ($neglectPenalty < 0 ? 'Felt neglected this cycle' : 'Mood shifted with the week'),
            ];
        }

        $previousStats = $save['stats'];
        $randomEvent = $this->randomWeeklyEvent((int) $save['current_week'], $activities, $relationshipEffects);
        $this->gameRepository->updateSave((int) $save['id'], [
            'charisma' => $stats['charisma'],
            'intelligence' => $stats['intelligence'],
            'adventure' => $stats['adventure'],
            'empathy' => $stats['empathy'],
            'technology' => $stats['technology'],
            'current_week' => (int) $save['current_week'] + 1,
            'selected_activities_json' => [],
        ]);
        $this->gameRepository->addEvent((int) $save['id'], 'weekly_activities_completed', null, [
            'week' => (int) $save['current_week'],
            'activity_ids' => array_values($activityIds),
            'activities' => $activities,
            'energy_used' => $energyUsed,
            'time_slots_used' => $timeSlotsUsed,
            'previous_stats' => $previousStats,
            'stats' => $stats,
            'relationship_effects' => $relationshipEffects,
            'random_event' => $randomEvent,
        ]);
        $this->gameRepository->addEvent((int) $save['id'], 'weekly_random_event', null, [
            'week' => (int) $save['current_week'],
            'event' => $randomEvent,
        ]);
        $this->progressionService->sync((int) $save['id']);

        return $this->stateService->state((int) $save['id']);
    }

    private function activityPreferenceBonus(array $activities, array $character): int
    {
        $preferred = $character['profile']['preferredActivities'] ?? [];
        if (!is_array($preferred)) {
            return 0;
        }

        $bonus = 0;
        foreach ($activities as $activity) {
            $mapped = match ((string) ($activity['category'] ?? '')) {
                'social' => 'social',
                'exploration' => 'adventurous',
                'personal' => 'relaxing',
                default => null,
            };
            if ($mapped !== null && in_array($mapped, $preferred, true)) {
                $bonus += 2;
            }
        }

        return min(4, $bonus);
    }

    private function wasEngagedThisWeek(int $saveId, string $characterId, int $week): bool
    {
        foreach (['dialogue_choice', 'date_completed', 'super_like_used'] as $eventType) {
            foreach ($this->gameRepository->listEventsForCharacter($saveId, $characterId, $eventType) as $event) {
                if ((int) ($event['payload']['week'] ?? 0) === $week) {
                    return true;
                }
            }
        }
        return false;
    }

    private function randomWeeklyEvent(int $week, array $activities, array $relationshipEffects): array
    {
        $templates = [
            ['type' => 'message', 'title' => 'A late-night transmission', 'description' => 'A companion sends a thoughtful message after reviewing your week.'],
            ['type' => 'discovery', 'title' => 'A stellar anomaly', 'description' => 'Your plans uncover a small opportunity for connection among the stars.'],
            ['type' => 'invitation', 'title' => 'Unexpected invitation', 'description' => 'Someone hints that they would enjoy being included next cycle.'],
        ];
        $index = ($week + count($activities) + count($relationshipEffects)) % count($templates);
        return $templates[$index];
    }
}
