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
    private const WEEKLY_ENERGY = 100;
    private const WEEKLY_TIME_SLOTS = 5;

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
        $week = (int) $save['current_week'];
        $completedThisWeek = $this->completedThisWeek((int) $save['id'], $week);
        if (in_array($activityId, $completedThisWeek['activity_ids'], true)) {
            throw new DomainException('That self-improvement activity has already been completed this week.');
        }

        $energyCost = (int) ($activity['energy_cost'] ?? 0);
        $timeSlots = (int) ($activity['time_slots'] ?? 0);
        if ($completedThisWeek['energy_used'] + $energyCost > self::WEEKLY_ENERGY) {
            throw new DomainException('Not enough weekly energy for that activity.');
        }
        if ($completedThisWeek['time_slots_used'] + $timeSlots > self::WEEKLY_TIME_SLOTS) {
            throw new DomainException('Not enough free time slots for that activity.');
        }

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
            'week' => $week,
            'activity_id' => $activityId,
            'activity' => $activity,
            'energy_cost' => $energyCost,
            'time_slots' => $timeSlots,
            'stats' => $stats,
        ]);
        $this->progressionService->sync((int) $save['id']);

        return $this->stateService->state((int) $save['id']);
    }

    private function completedThisWeek(int $saveId, int $week): array
    {
        $activityIds = [];
        $energyUsed = 0;
        $timeSlotsUsed = 0;
        foreach ($this->gameRepository->listEvents($saveId, 'self_improvement_completed') as $event) {
            $payload = $event['payload'];
            if ((int) ($payload['week'] ?? 0) !== $week) {
                continue;
            }

            if (is_string($payload['activity_id'] ?? null)) {
                $activityIds[] = (string) $payload['activity_id'];
            }
            $energyUsed += (int) ($payload['energy_cost'] ?? 0);
            $timeSlotsUsed += (int) ($payload['time_slots'] ?? 0);
        }

        return [
            'activity_ids' => array_values(array_unique($activityIds)),
            'energy_used' => $energyUsed,
            'time_slots_used' => $timeSlotsUsed,
        ];
    }
}
