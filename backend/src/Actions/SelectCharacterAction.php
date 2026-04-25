<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\AuthUser;
use App\Repositories\ContentRepository;
use App\Repositories\GameRepository;
use App\Services\GameStateService;
use App\Services\ProgressionService;
use DomainException;

final class SelectCharacterAction
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
        $characterId = $body['character_id'] ?? null;
        if (!is_string($characterId) || $characterId === '') {
            throw new DomainException('character_id is required.');
        }

        $this->contentRepository->getCharacter($characterId);
        $save = $this->gameRepository->getOrCreateSave($user);
        $this->progressionService->ensureInitialized((int) $save['id']);

        $relationship = $this->gameRepository->getRelationshipState((int) $save['id'], $characterId);
        $knownInfo = $relationship['known_info'];
        $knownInfo['species'] = true;
        $knownInfo['basicPersonality'] = true;

        $this->gameRepository->updateSave((int) $save['id'], ['selected_character_id' => $characterId]);
        $this->gameRepository->updateRelationship((int) $save['id'], $characterId, [
            'known_info_json' => $knownInfo,
        ]);
        $this->progressionService->sync((int) $save['id']);

        return $this->stateService->state((int) $save['id']);
    }
}
