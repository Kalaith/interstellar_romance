<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\AuthUser;
use App\Repositories\GameRepository;
use App\Services\GameStateService;
use App\Services\ProgressionService;
use DomainException;

final class CompleteDateFollowUpAction
{
    private const CHOICES = [
        'warm' => ['affection' => 2, 'trust' => 1, 'label' => 'Warm follow-up'],
        'playful' => ['affection' => 1, 'trust' => 0, 'label' => 'Playful message'],
        'reflective' => ['affection' => 1, 'trust' => 2, 'label' => 'Reflective note'],
    ];

    public function __construct(
        private readonly GameRepository $gameRepository,
        private readonly ProgressionService $progressionService,
        private readonly GameStateService $stateService
    ) {
    }

    public function execute(AuthUser $user, array $body): array
    {
        $characterId = $body['character_id'] ?? null;
        $choiceId = $body['choice_id'] ?? null;
        if (!is_string($characterId) || $characterId === '') {
            throw new DomainException('character_id is required.');
        }
        if (!is_string($choiceId) || !isset(self::CHOICES[$choiceId])) {
            throw new DomainException('Unknown date follow-up choice.');
        }

        $save = $this->gameRepository->getOrCreateSave($user);
        $relationship = $this->gameRepository->getRelationshipState((int) $save['id'], $characterId);
        $latestDate = null;
        foreach ($this->gameRepository->listEventsForCharacter((int) $save['id'], $characterId, 'date_completed') as $event) {
            if ((int) ($event['payload']['week'] ?? 0) === (int) $save['current_week']) {
                $latestDate = $event;
                break;
            }
        }
        if ($latestDate === null) {
            throw new DomainException('No date is waiting for a follow-up this cycle.');
        }
        foreach ($this->gameRepository->listEventsForCharacter((int) $save['id'], $characterId, 'date_follow_up') as $event) {
            if ((int) ($event['payload']['week'] ?? 0) === (int) $save['current_week']) {
                throw new DomainException('This date already has a follow-up response.');
            }
        }

        $choice = self::CHOICES[$choiceId];
        $this->gameRepository->updateRelationship((int) $save['id'], $characterId, [
            'affection' => min(100, (int) $relationship['affection'] + (int) $choice['affection']),
            'trust' => min(100, (int) $relationship['trust'] + (int) $choice['trust']),
        ]);
        $this->gameRepository->addEvent((int) $save['id'], 'date_follow_up', $characterId, [
            'week' => (int) $save['current_week'],
            'choice_id' => $choiceId,
            'choice' => $choice,
        ]);
        $this->progressionService->sync((int) $save['id']);

        return [
            'choice' => $choice,
            'game_state' => $this->stateService->state((int) $save['id']),
        ];
    }
}
