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

final class CompleteStorylineChoiceAction
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
        $storylineId = $this->requiredString($body, 'storyline_id');
        $choiceId = $this->requiredString($body, 'choice_id');
        $save = $this->gameRepository->getOrCreateSave($user);
        $this->progressionService->ensureInitialized((int) $save['id']);

        $storyline = $this->contentRepository->getStoryline($storylineId);
        $states = [];
        foreach ($this->gameRepository->listStorylineStates((int) $save['id']) as $state) {
            $states[$state['storyline_id']] = $state;
        }
        $state = $states[$storylineId] ?? null;
        if (!$state || (int) $state['unlocked'] !== 1 || (int) $state['completed'] === 1) {
            throw new DomainException('Storyline is not available.');
        }

        $choice = $this->contentRepository->getStorylineChoice($storylineId, $choiceId);
        $characterId = (string) $storyline['character_id'];
        $relationship = $this->gameRepository->getRelationshipState((int) $save['id'], $characterId);
        $newAffection = max(0, min(100, (int) $relationship['affection'] + (int) $choice['affection_change']));

        $this->gameRepository->updateRelationship((int) $save['id'], $characterId, [
            'affection' => $newAffection,
        ]);
        $this->gameRepository->completeStoryline((int) $save['id'], $storylineId);
        if ($choice['unlock_next_storyline_id'] !== null) {
            $this->gameRepository->updateStorylineUnlocked(
                (int) $save['id'],
                (string) $choice['unlock_next_storyline_id'],
                true
            );
        }
        $this->gameRepository->addMemory([
            'save_id' => (int) $save['id'],
            'character_id' => $characterId,
            'memory_key' => $this->rules->memoryKey('storyline'),
            'memory_type' => 'personal_revelation',
            'title' => $storyline['title'],
            'description' => $choice['consequence'],
            'emotional_impact' => (int) $choice['affection_change'],
            'participant_emotions' => [(int) $choice['affection_change'] >= 0 ? 'happy' : 'neutral'],
            'affection_at_time' => $newAffection,
            'consequence' => $choice['consequence'],
            'tags' => ['storyline', $storylineId],
        ]);
        $this->gameRepository->addEvent((int) $save['id'], 'storyline_choice_completed', $characterId, [
            'storyline_id' => $storylineId,
            'choice_id' => $choiceId,
            'affection_change' => (int) $choice['affection_change'],
        ]);
        $this->progressionService->sync((int) $save['id']);

        return [
            'storyline' => $storyline,
            'choice' => $choice,
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
