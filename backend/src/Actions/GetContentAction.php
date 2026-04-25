<?php

declare(strict_types=1);

namespace App\Actions;

use App\Services\GameStateService;

final class GetContentAction
{
    public function __construct(private readonly GameStateService $stateService)
    {
    }

    public function execute(): array
    {
        return $this->stateService->contentPayload();
    }
}
