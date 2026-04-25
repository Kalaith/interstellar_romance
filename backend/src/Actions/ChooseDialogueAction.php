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

final class ChooseDialogueAction
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
        $optionId = $this->requiredString($body, 'option_id');
        $timezone = $this->rules->normalizeTimezone($body['timezone'] ?? null);

        $save = $this->gameRepository->getOrCreateSave($user);
        $this->progressionService->ensureInitialized((int) $save['id']);
        $this->gameRepository->begin();

        try {
            $character = $this->contentRepository->getCharacter($characterId);
            $relationship = $this->rules->refreshDailyInteractions(
                $this->gameRepository->getRelationshipState((int) $save['id'], $characterId),
                $timezone
            );
            $this->gameRepository->updateRelationship((int) $save['id'], $characterId, [
                'daily_reset_date' => $relationship['daily_reset_date'],
                'interactions_used' => $relationship['interactions_used'],
                'timezone' => $timezone,
            ]);

            if ((int) $relationship['interactions_used'] >= (int) $relationship['max_interactions']) {
                throw new DomainException('No daily interactions remain for this character.');
            }
            if ($this->weeklyDialogueCount((int) $save['id'], $characterId, (int) $save['current_week']) >= 3) {
                throw new DomainException('This character needs space until the next cycle.');
            }

            $option = $this->contentRepository->getDialogueOption($optionId);
            if ($option['character_id'] !== $characterId) {
                throw new DomainException('Dialogue option does not belong to this character.');
            }
            if (
                $option['requires_affection'] !== null
                && (int) $relationship['affection'] < (int) $option['requires_affection']
            ) {
                throw new DomainException('This dialogue option requires more affection.');
            }
            if ($option['requires_mood'] !== null && $relationship['mood'] !== $option['requires_mood']) {
                throw new DomainException('This dialogue option requires a different mood.');
            }

            $response = $this->contentRepository->getDialogueResponse($optionId);
            if ($response === null) {
                $fallbackTopic = $option['topic'] === 'flirt' && (int) $relationship['affection'] < 20
                    ? 'flirt_locked'
                    : $option['topic'];
                $response = $this->contentRepository->getDialogueFallback($fallbackTopic)
                    ?? $this->contentRepository->getDialogueFallback('default');
            }

            $mood = $this->contentRepository->getMood((string) $relationship['mood']);
            $affectionChange = (int) $response['affection_change']
                + $this->rules->moodModifier($mood, $option['topic']);
            $newAffection = max(0, min(100, (int) $relationship['affection'] + $affectionChange));
            $today = $this->rules->today($timezone);

            $this->gameRepository->updateRelationship((int) $save['id'], $characterId, [
                'affection' => $newAffection,
                'interactions_used' => (int) $relationship['interactions_used'] + 1,
                'last_interaction_date' => $today,
                'timezone' => $timezone,
            ]);
            $this->gameRepository->updateSave((int) $save['id'], [
                'total_conversations' => (int) $save['total_conversations'] + 1,
            ]);
            $this->gameRepository->addMemory([
                'save_id' => (int) $save['id'],
                'character_id' => $characterId,
                'memory_key' => $this->rules->memoryKey('conversation'),
                'memory_type' => 'meaningful_conversation',
                'title' => 'Conversation: ' . $option['topic'],
                'description' => $character['name'] . ' responded to "' . $option['text'] . '".',
                'emotional_impact' => $affectionChange,
                'participant_emotions' => [$response['emotion']],
                'affection_at_time' => $newAffection,
                'consequence' => $response['consequence'] ?? null,
                'tags' => ['conversation', $option['topic']],
            ]);
            $this->gameRepository->addEvent((int) $save['id'], 'dialogue_choice', $characterId, [
                'week' => (int) $save['current_week'],
                'option_id' => $optionId,
                'topic' => $option['topic'],
                'affection_change' => $affectionChange,
                'response' => $response,
            ]);

            $this->progressionService->sync((int) $save['id']);
            $state = $this->stateService->state((int) $save['id']);
            $this->gameRepository->commit();

            return [
                'dialogue' => [
                    'option' => $option,
                    'response' => $response,
                    'affection_change' => $affectionChange,
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

    private function weeklyDialogueCount(int $saveId, string $characterId, int $week): int
    {
        $count = 0;
        foreach ($this->gameRepository->listEventsForCharacter($saveId, $characterId, 'dialogue_choice') as $event) {
            if ((int) ($event['payload']['week'] ?? 0) === $week) {
                $count++;
            }
        }
        return $count;
    }
}
