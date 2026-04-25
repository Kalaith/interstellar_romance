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

final class CompleteDateAction
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
        $characterId = $this->requiredString($body, 'character_id');
        $datePlanId = $this->requiredString($body, 'date_plan_id');
        $save = $this->gameRepository->getOrCreateSave($user);
        $this->progressionService->ensureInitialized((int) $save['id']);
        $this->gameRepository->begin();

        try {
            $character = $this->contentRepository->getCharacter($characterId);
            $relationship = $this->gameRepository->getRelationshipState((int) $save['id'], $characterId);
            $datePlan = $this->contentRepository->getDatePlan($datePlanId);
            if ((int) $relationship['affection'] < (int) $datePlan['required_affection']) {
                throw new DomainException('This date plan requires more affection.');
            }

            $outcome = $this->rules->dateOutcome($save, $relationship, $character, $datePlan);
            $newAffection = max(0, min(100, (int) $relationship['affection'] + (int) $outcome['affection_gained']));

            $this->gameRepository->addDateHistory([
                'save_id' => (int) $save['id'],
                'character_id' => $characterId,
                'date_plan_id' => $datePlanId,
                'success' => (bool) $outcome['success'],
                'affection_gained' => (int) $outcome['affection_gained'],
                'compatibility_at_time' => (int) $outcome['compatibility']['overall'],
                'player_level' => (int) $save['current_week'],
                'notes' => $datePlan['name'],
            ]);
            $this->gameRepository->addMemory([
                'save_id' => (int) $save['id'],
                'character_id' => $characterId,
                'memory_key' => $this->rules->memoryKey('date'),
                'memory_type' => $outcome['memory']['type'],
                'title' => $outcome['memory']['title'],
                'description' => $outcome['memory']['description'],
                'emotional_impact' => (int) $outcome['memory']['emotional_impact'],
                'participant_emotions' => $outcome['memory']['participant_emotions'],
                'affection_at_time' => $newAffection,
                'consequence' => ((int) $outcome['affection_gained'] >= 0 ? '+' : '') .
                    (string) $outcome['affection_gained'] . ' affection',
                'tags' => $outcome['memory']['tags'],
            ]);
            $this->gameRepository->updateRelationship((int) $save['id'], $characterId, [
                'affection' => $newAffection,
                'shared_experiences' => (int) $relationship['shared_experiences'] + 1,
            ]);
            $this->gameRepository->updateSave((int) $save['id'], [
                'total_dates' => (int) $save['total_dates'] + 1,
            ]);
            $this->gameRepository->addEvent((int) $save['id'], 'date_completed', $characterId, [
                'date_plan_id' => $datePlanId,
                'outcome' => $outcome,
            ]);

            $this->progressionService->sync((int) $save['id']);
            $state = $this->stateService->state((int) $save['id']);
            $this->gameRepository->commit();

            return [
                'date' => [
                    'plan' => $datePlan,
                    'outcome' => $outcome,
                    'affection' => $newAffection,
                ],
                'game_state' => $state,
            ];
        } catch (\Throwable $exception) {
            $this->gameRepository->rollBack();
            throw $exception;
        }
    }

    private function requiredString(array $body, string $key): string
    {
        if (!isset($body[$key]) || !is_string($body[$key]) || $body[$key] === '') {
            throw new DomainException($key . ' is required.');
        }

        return $body[$key];
    }
}
