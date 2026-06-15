<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\AuthUser;
use App\Repositories\ContentRepository;
use App\Repositories\GameRepository;
use App\Services\ActionEconomyService;
use App\Services\GameRulesService;
use App\Services\GameStateService;
use App\Services\ProgressionService;
use DomainException;

final class CompleteActivitiesAction
{
    public function __construct(
        private readonly ContentRepository $contentRepository,
        private readonly GameRepository $gameRepository,
        private readonly ActionEconomyService $actionEconomy,
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
        foreach ($this->gameRepository->listEvents((int) $save['id'], 'weekly_activities_completed') as $event) {
            if ((int) ($event['payload']['week'] ?? 0) === (int) $save['current_week']) {
                throw new DomainException('This cycle has already been completed.');
            }
        }

        $stats = $save['stats'];
        $activities = [];
        $activityCosts = [];
        foreach ($activityIds as $activityId) {
            if (!is_string($activityId)) {
                throw new DomainException('Activity IDs must be strings.');
            }
            $activity = $this->contentRepository->getActivity($activityId, 'weekly');
            $cost = $this->actionEconomy->weeklyActivityCost($activity);
            $activityCosts[] = $cost;
            $activities[] = [
                ...$activity,
                'actionCost' => $cost,
            ];
            foreach ($activity['stat_bonus'] as $stat => $amount) {
                if (isset($stats[$stat])) {
                    $stats[$stat] = min(100, (int) $stats[$stat] + (int) $amount);
                }
            }
        }
        if (count(array_unique($activityIds)) !== 2) {
            throw new DomainException('Weekly activity choices must be unique.');
        }

        $totalCost = $this->actionEconomy->addCosts($activityCosts);
        $this->actionEconomy->assertCanSpend(
            (int) $save['id'],
            (int) $save['current_week'],
            $totalCost,
            'Weekly activities'
        );

        $this->gameRepository->begin();
        try {
            $moods = $this->contentRepository->listMoods();
            $relationshipEffects = [];
            foreach ($this->gameRepository->listRelationshipStates((int) $save['id']) as $relationship) {
                $character = $this->contentRepository->getCharacter((string) $relationship['character_id']);
                $activityBonus = $this->activityPreferenceBonus($activities, $character);
                $neglectPenalty = $this->actionEconomy->wasEngagedThisWeek(
                    (int) $save['id'],
                    (string) $relationship['character_id'],
                    (int) $save['current_week']
                ) ? 0 : -1;
                $conflictPressure = $this->actionEconomy->activeConflictPressure(
                    $this->gameRepository->listConflicts(
                        (int) $save['id'],
                        (string) $relationship['character_id']
                    )
                );
                $conflictPenalty = (int) $conflictPressure['affection'];
                $followUpPenalty = $this->actionEconomy->hasDateAwaitingFollowUp(
                    (int) $save['id'],
                    (string) $relationship['character_id'],
                    (int) $save['current_week']
                ) ? -1 : 0;
                $trustChange = (int) $conflictPressure['trust'] + $followUpPenalty;
                $affectionChange = $activityBonus + $neglectPenalty + $conflictPenalty + $followUpPenalty;
                $newAffection = max(0, min(100, (int) $relationship['affection'] + $affectionChange));
                $newTrust = max(0, min(100, (int) $relationship['trust'] + $trustChange));
                $mood = $conflictPressure['mood'] !== null
                    ? (string) $conflictPressure['mood']
                    : ($activityBonus > 0
                    ? 'cheerful'
                    : ($neglectPenalty < 0 ? 'melancholy' : $this->rules->randomMood($moods)));

                $reasons = [];
                if ($activityBonus > 0) {
                    $reasons[] = 'Enjoyed your weekly activity focus';
                }
                if ($neglectPenalty < 0) {
                    $reasons[] = 'Felt neglected this cycle';
                }
                if ($conflictPenalty < 0) {
                    foreach ($conflictPressure['items'] as $pressure) {
                        $reasons[] = (string) $pressure['reason'];
                    }
                }
                if ($followUpPenalty < 0) {
                    $reasons[] = 'A date follow-up was missed';
                }
                if ($reasons === []) {
                    $reasons[] = 'Mood shifted with the week';
                }

                $this->gameRepository->updateRelationship((int) $save['id'], (string) $relationship['character_id'], [
                'affection' => $newAffection,
                'mood' => $mood,
                'trust' => $newTrust,
                ]);
                $relationshipEffects[] = [
                    'character_id' => $relationship['character_id'],
                    'character_name' => $character['name'],
                    'affection_change' => $affectionChange,
                    'trust_change' => $trustChange,
                    'mood' => $mood,
                    'reason' => implode('; ', $reasons),
                    'conflict_pressure' => $conflictPressure['items'],
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
            'super_likes_available' => min(3, (int) $save['super_likes_available'] + 1),
            'selected_activities_json' => [],
            ]);
            $this->gameRepository->addEvent((int) $save['id'], 'weekly_activities_completed', null, [
            'week' => (int) $save['current_week'],
            'activity_ids' => array_values($activityIds),
            'activities' => $activities,
            'energy_used' => $totalCost['energy'],
            'time_slots_used' => $totalCost['timeSlots'],
            'social_cost' => $totalCost['socialFocus'],
            'action_cost' => $totalCost,
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
            $state = $this->stateService->state((int) $save['id']);
            $this->gameRepository->commit();

            return $state;
        } catch (\Throwable $exception) {
            $this->gameRepository->rollBack();
            throw $exception;
        }
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

    private function randomWeeklyEvent(int $week, array $activities, array $relationshipEffects): array
    {
        $templates = [
            [
                'type' => 'message',
                'title' => 'A late-night transmission',
                'description' => 'A companion sends a thoughtful message after reviewing your week.',
            ],
            [
                'type' => 'discovery',
                'title' => 'A stellar anomaly',
                'description' => 'Your plans uncover a small opportunity for connection among the stars.',
            ],
            [
                'type' => 'invitation',
                'title' => 'Unexpected invitation',
                'description' => 'Someone hints that they would enjoy being included next cycle.',
            ],
        ];
        $index = ($week + count($activities) + count($relationshipEffects)) % count($templates);
        return $templates[$index];
    }
}
