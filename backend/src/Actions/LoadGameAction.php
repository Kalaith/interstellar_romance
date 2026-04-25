<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\AuthUser;
use App\Repositories\GameRepository;
use App\Services\GameStateService;
use App\Services\ProgressionService;

final class LoadGameAction
{
    public function __construct(
        private readonly GameRepository $gameRepository,
        private readonly ProgressionService $progressionService,
        private readonly GameStateService $stateService
    ) {
    }

    public function execute(AuthUser $user): array
    {
        $save = $this->gameRepository->getOrCreateSave($user);
        $this->progressionService->sync((int) $save['id']);
        return $this->stateService->state((int) $save['id']);
    }
}
