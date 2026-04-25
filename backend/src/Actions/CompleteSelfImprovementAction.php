<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\AuthUser;
use App\Repositories\ContentRepository;
use App\Repositories\GameRepository;
use App\Services\GameStateService;
use App\Services\ProgressionService;
use DomainException;

final class CompleteSelfImprovementAction
{
    public function __construct(
        private readonly ContentRepository $contentRepository,
        private readonly GameRepository $gameRepository,
        private readonly ProgressionService $progressionService,
        private readonly GameStateService $stateService
    ) {
    }

    public function execute(AuthUser $user, array $body): array
    {
        $activityId = $body['activity_id'] ?? null;
        if (!is_string($activityId) || $activityId === '') {
            throw new DomainException('activity_id is required.');
        }

        $save = $this->gameRepository->getOrCreateSave($user);
        $activity = $this->contentRepository->getActivity($activityId, 'daily');
        $stats = $save['stats'];
        foreach ($activity['stat_bonus'] as $stat => $amount) {
            if (isset($stats[$stat])) {
                $stats[$stat] = min(100, (int) $stats[$stat] + (int) $amount);
            }
        }

        $this->gameRepository->updateSave((int) $save['id'], [
            'charisma' => $stats['charisma'],
            'intelligence' => $stats['intelligence'],
            'adventure' => $stats['adventure'],
            'empathy' => $stats['empathy'],
            'technology' => $stats['technology'],
        ]);
        $this->gameRepository->addEvent((int) $save['id'], 'self_improvement_completed', null, [
            'activity_id' => $activityId,
            'activity' => $activity,
            'stats' => $stats,
        ]);
        $this->progressionService->sync((int) $save['id']);

        return $this->stateService->state((int) $save['id']);
    }
}
