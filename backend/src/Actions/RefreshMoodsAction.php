<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\AuthUser;
use App\Repositories\ContentRepository;
use App\Repositories\GameRepository;
use App\Services\GameRulesService;
use App\Services\GameStateService;
use App\Services\ProgressionService;

final class RefreshMoodsAction
{
    public function __construct(
        private readonly ContentRepository $contentRepository,
        private readonly GameRepository $gameRepository,
        private readonly GameRulesService $rules,
        private readonly ProgressionService $progressionService,
        private readonly GameStateService $stateService
    ) {
    }

    public function execute(AuthUser $user): array
    {
        $save = $this->gameRepository->getOrCreateSave($user);
        $this->progressionService->ensureInitialized((int) $save['id']);
        $moods = $this->contentRepository->listMoods();
        foreach ($this->gameRepository->listRelationshipStates((int) $save['id']) as $relationship) {
            $this->gameRepository->updateRelationship((int) $save['id'], (string) $relationship['character_id'], [
                'mood' => $this->rules->randomMood($moods),
            ]);
        }
        $this->gameRepository->addEvent((int) $save['id'], 'moods_refreshed', null, []);
        $this->progressionService->sync((int) $save['id']);

        return $this->stateService->state((int) $save['id']);
    }
}
