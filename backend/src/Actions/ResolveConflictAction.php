<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\AuthUser;
use App\Repositories\GameRepository;
use App\Services\GameRulesService;
use App\Services\GameStateService;
use App\Services\ProgressionService;
use DomainException;

final class ResolveConflictAction
{
    public function __construct(
        private readonly GameRepository $gameRepository,
        private readonly GameRulesService $rules,
        private readonly ProgressionService $progressionService,
        private readonly GameStateService $stateService
    ) {
    }

    public function execute(AuthUser $user, array $body): array
    {
        $conflictId = $this->requiredString($body, 'conflict_id');
        $optionId = $this->requiredString($body, 'option_id');
        $save = $this->gameRepository->getOrCreateSave($user);
        $conflict = $this->gameRepository->getConflict((int) $save['id'], $conflictId);
        if ($conflict['resolved']) {
            throw new DomainException('Conflict is already resolved.');
        }

        $option = null;
        foreach ($conflict['resolution_options'] as $candidate) {
            if (($candidate['id'] ?? null) === $optionId) {
                $option = $candidate;
                break;
            }
        }
        if ($option === null) {
            throw new DomainException('Resolution option is not available for this conflict.');
        }

        $relationship = $this->gameRepository->getRelationshipState(
            (int) $save['id'],
            (string) $conflict['character_id']
        );
        $result = $this->rules->resolveConflict($save, $relationship, $conflict, $option);
        $newAffection = max(0, min(100, (int) $relationship['affection'] + (int) $result['affection_recovery']));

        $this->gameRepository->resolveConflict((int) $save['id'], $conflictId, (string) $result['method']);
        $this->gameRepository->updateRelationship((int) $save['id'], (string) $conflict['character_id'], [
            'affection' => $newAffection,
            'conflicts_count' => (int) $relationship['conflicts_count'] + 1,
        ]);
        $this->gameRepository->updateSave((int) $save['id'], [
            'conflict_resolution_skill' => min(
                100,
                (int) $save['conflict_resolution_skill'] + ($result['success'] ? 3 : 1)
            ),
        ]);
        $this->gameRepository->addMemory([
            'save_id' => (int) $save['id'],
            'character_id' => (string) $conflict['character_id'],
            'memory_key' => $this->rules->memoryKey('conflict'),
            'memory_type' => 'conflict_resolution',
            'title' => 'Conflict Resolved: ' . $option['label'],
            'description' => $conflict['description'],
            'emotional_impact' => (int) $result['affection_recovery'],
            'participant_emotions' => [$result['success'] ? 'hopeful' : 'thoughtful'],
            'affection_at_time' => $newAffection,
            'consequence' => ((int) $result['affection_recovery'] >= 0 ? '+' : '') .
                (string) $result['affection_recovery'] . ' affection',
            'tags' => ['conflict_resolution', (string) $conflict['type']],
        ]);
        $this->gameRepository->addEvent((int) $save['id'], 'conflict_resolved', (string) $conflict['character_id'], [
            'conflict_id' => $conflictId,
            'option_id' => $optionId,
            'result' => $result,
        ]);
        $this->progressionService->sync((int) $save['id']);

        return [
            'resolution' => $result,
            'game_state' => $this->stateService->state((int) $save['id']),
        ];
    }

    private function requiredString(array $body, string $key): string
    {
        if (!isset($body[$key]) || !is_string($body[$key]) || $body[$key] === '') {
            throw new DomainException($key . ' is required.');
        }

        return $body[$key];
    }
}
