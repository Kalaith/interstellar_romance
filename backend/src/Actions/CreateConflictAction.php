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

final class CreateConflictAction
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
        $characterId = $body['character_id'] ?? null;
        if (!is_string($characterId) || $characterId === '') {
            throw new DomainException('character_id is required.');
        }
        $force = (bool) ($body['force'] ?? false);

        $save = $this->gameRepository->getOrCreateSave($user);
        $this->progressionService->ensureInitialized((int) $save['id']);
        $relationship = $this->gameRepository->getRelationshipState((int) $save['id'], $characterId);
        $active = array_values(array_filter(
            $this->gameRepository->listConflicts((int) $save['id'], $characterId),
            static fn(array $conflict): bool => !$conflict['resolved']
        ));
        if ($active !== []) {
            return [
                'created' => false,
                'conflict' => $active[0],
                'game_state' => $this->stateService->state((int) $save['id']),
            ];
        }

        if (!$force && random_int(1, 100) > $this->rules->conflictChance((int) $relationship['affection'])) {
            return [
                'created' => false,
                'conflict' => null,
                'game_state' => $this->stateService->state((int) $save['id']),
            ];
        }

        $this->contentRepository->getCharacter($characterId);
        $template = $this->contentRepository->randomConflictTemplate();
        if ($template === null) {
            throw new DomainException('No conflict templates are seeded.');
        }

        $type = (string) $template['conflict_type'];
        $severity = $this->rules->conflictSeverity((int) $relationship['affection']);
        $baseOptions = $this->contentRepository->listBaseResolutionOptions();
        $specificOptions = $this->contentRepository->listCharacterResolutionOptions($characterId);
        $conflict = [
            'conflict_id' => $this->rules->generatedId('conflict'),
            'save_id' => (int) $save['id'],
            'character_id' => $characterId,
            'conflict_type' => $type,
            'severity' => $severity,
            'trigger_text' => $this->contentRepository->randomConflictTrigger($type) ?? 'relationship tension',
            'description' => $this->contentRepository->getConflictDescription($type, $characterId)
                ?? 'A relationship tension needs attention.',
            'start_at' => $this->rules->now(),
            'affection_penalty' => $this->rules->conflictPenalty((int) $template['base_affection_penalty'], $severity),
            'resolution_options' => array_values(array_merge($baseOptions, $specificOptions)),
        ];

        $this->gameRepository->addConflict($conflict);
        $this->gameRepository->addEvent((int) $save['id'], 'conflict_created', $characterId, $conflict);

        return [
            'created' => true,
            'conflict' => $this->gameRepository->getConflict((int) $save['id'], $conflict['conflict_id']),
            'game_state' => $this->stateService->state((int) $save['id']),
        ];
    }
}
