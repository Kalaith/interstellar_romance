<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\AuthUser;
use App\Repositories\GameRepository;
use App\Services\GameRulesService;
use App\Services\GameStateService;
use App\Services\ProgressionService;

final class StartGameAction
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
        $player = $this->rules->validatePlayer($body);

        $this->gameRepository->begin();
        try {
            $save = $this->gameRepository->resetSave($user, $player);
            $this->progressionService->sync((int) $save['id']);
            $state = $this->stateService->state((int) $save['id']);
            $this->gameRepository->commit();
            return $state;
        } catch (\Throwable $exception) {
            $this->gameRepository->rollBack();
            throw $exception;
        }
    }
}
