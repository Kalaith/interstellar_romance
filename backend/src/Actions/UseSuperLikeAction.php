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

final class UseSuperLikeAction
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

        $save = $this->gameRepository->getOrCreateSave($user);
        if ((int) $save['super_likes_available'] <= 0) {
            throw new DomainException('No super likes are available.');
        }

        $character = $this->contentRepository->getCharacter($characterId);
        $effect = $this->contentRepository->getSuperLikeEffect($characterId);
        if ($effect === null) {
            throw new DomainException('Super like content is not available for this character.');
        }

        $relationship = $this->gameRepository->getRelationshipState((int) $save['id'], $characterId);
        $responses = $this->contentRepository->listSuperLikeResponses($characterId);
        $responseText = $responses === []
            ? $character['name'] . ' is visibly moved by your attention.'
            : $responses[random_int(0, count($responses) - 1)];
        $unlocks = $this->contentRepository->getSuperLikeUnlocks($characterId);
        $newAffection = min(100, (int) $relationship['affection'] + (int) $effect['affection_bonus']);
        $now = $this->rules->now();
        $expiresAt = gmdate('Y-m-d H:i:s', time() + ((int) $effect['duration_hours'] * 3600));

        $result = [
            'affectionGained' => (int) $effect['affection_bonus'],
            'specialResponse' => $responseText,
            'unlockedContent' => $unlocks['content'],
        ];

        $this->gameRepository->updateRelationship((int) $save['id'], $characterId, [
            'affection' => $newAffection,
            'mood' => $effect['mood_boost'] ? 'romantic' : $relationship['mood'],
        ]);
        $this->gameRepository->updateSave((int) $save['id'], [
            'super_likes_available' => (int) $save['super_likes_available'] - 1,
        ]);
        $this->gameRepository->addSuperLike((int) $save['id'], $characterId, $effect, $result);
        $this->gameRepository->addTemporaryBoost([
            'boost_id' => $this->rules->generatedId('boost'),
            'save_id' => (int) $save['id'],
            'character_id' => $characterId,
            'boost_type' => 'super_like',
            'effect' => 'compatibility_bonus',
            'value' => (int) $effect['temporary_compatibility_bonus'],
            'description' => 'Super like compatibility boost',
            'starts_at' => $now,
            'expires_at' => $expiresAt,
        ]);
        $this->gameRepository->addMemory([
            'save_id' => (int) $save['id'],
            'character_id' => $characterId,
            'memory_key' => $this->rules->memoryKey('super_like'),
            'memory_type' => 'romantic_moment',
            'title' => 'Super Like',
            'description' => $responseText,
            'emotional_impact' => (int) $effect['affection_bonus'],
            'participant_emotions' => ['flirty', 'happy'],
            'affection_at_time' => $newAffection,
            'consequence' => '+' . (string) $effect['affection_bonus'] . ' affection',
            'tags' => ['super_like', 'romantic'],
        ]);
        $this->gameRepository->addEvent((int) $save['id'], 'super_like_used', $characterId, [
            'effect' => $effect,
            'result' => $result,
            'unlocks' => $unlocks,
        ]);
        $this->progressionService->sync((int) $save['id']);

        return [
            'super_like' => [
                'effect' => $effect,
                'result' => $result,
                'unlocks' => $unlocks,
            ],
            'game_state' => $this->stateService->state((int) $save['id']),
        ];
    }
}
