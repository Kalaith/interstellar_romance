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
        foreach ($activityIds as $activityId) {
            if (!is_string($activityId)) {
                throw new DomainException('Activity IDs must be strings.');
            }
            $activity = $this->contentRepository->getActivity($activityId, 'weekly');
            $activities[] = $activity;
            foreach ($activity['stat_bonus'] as $stat => $amount) {
                if (isset($stats[$stat])) {
                    $stats[$stat] = min(100, (int) $stats[$stat] + (int) $amount);
                }
            }
        }

        $moods = $this->contentRepository->listMoods();
        foreach ($this->gameRepository->listRelationshipStates((int) $save['id']) as $relationship) {
            $this->gameRepository->updateRelationship((int) $save['id'], (string) $relationship['character_id'], [
                'mood' => $this->rules->randomMood($moods),
            ]);
        }

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
            'activity_ids' => array_values($activityIds),
            'activities' => $activities,
            'stats' => $stats,
        ]);
        $this->progressionService->sync((int) $save['id']);

        return $this->stateService->state((int) $save['id']);
    }
}
