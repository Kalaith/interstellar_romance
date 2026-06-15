<?php

declare(strict_types=1);

namespace App\Repositories;

interface GameLedgerRepository
{
    public function listEvents(int $saveId, ?string $eventType = null): array;

    public function listEventsForCharacter(int $saveId, string $characterId, ?string $eventType = null): array;

    public function listConflicts(int $saveId, ?string $characterId = null): array;
}
