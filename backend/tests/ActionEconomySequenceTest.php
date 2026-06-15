<?php

declare(strict_types=1);

namespace Tests;

use App\Repositories\GameLedgerRepository;
use App\Services\ActionEconomyService;
use DomainException;
use PHPUnit\Framework\TestCase;

final class ActionEconomySequenceTest extends TestCase
{
    private object $ledger;
    private ActionEconomyService $economy;

    protected function setUp(): void
    {
        $this->ledger = $this->ledger();
        $this->economy = new ActionEconomyService($this->ledger);
    }

    public function testFocusSpendBlocksOverspendInSameWeek(): void
    {
        for ($index = 0; $index < 5; $index++) {
            $this->ledger->addEvent(1, 'dialogue_choice', 'kyrathen', [
                'week' => 1,
                'topic' => 'flirt',
                'social_cost' => 2,
            ]);
        }

        $usage = $this->economy->weeklyUsage(1, 1);

        self::assertSame(10, $usage['socialFocus']);
        self::expectException(DomainException::class);
        self::expectExceptionMessage('Super Like is unavailable: not enough 2 social focus');

        $this->economy->assertCanSpend(1, 1, $this->economy->superLikeCost(), 'Super Like');
    }

    public function testWeekRolloverScopesUsageToCurrentWeek(): void
    {
        $this->ledger->addEvent(1, 'weekly_activities_completed', null, [
            'week' => 1,
            'energy_used' => 4,
            'time_slots_used' => 2,
        ]);
        $this->ledger->addEvent(1, 'dialogue_choice', 'kyrathen', [
            'week' => 2,
            'topic' => 'greeting',
            'social_cost' => 1,
        ]);

        $weekOne = $this->economy->weeklyUsage(1, 1);
        $weekTwo = $this->economy->budgetPayload(1, 2);

        self::assertSame(['energy' => 4, 'timeSlots' => 2, 'socialFocus' => 0], $weekOne);
        self::assertSame(12, $weekTwo['energy']['remaining']);
        self::assertSame(5, $weekTwo['timeSlots']['remaining']);
        self::assertSame(9, $weekTwo['socialFocus']['remaining']);
    }

    public function testCharacterFollowUpsAndCooldownsFollowActionSequence(): void
    {
        $this->ledger->addEvent(1, 'date_completed', 'seraphina', [
            'week' => 3,
            'date_plan_id' => 'starlight_walk',
            'energy_cost' => 2,
            'time_slots' => 1,
            'social_cost' => 1,
        ]);
        $this->ledger->addEvent(1, 'storyline_choice_completed', 'seraphina', ['week' => 3]);
        $this->ledger->addEvent(1, 'super_like_used', 'seraphina', ['week' => 3]);
        $this->ledger->addEvent(1, 'conflict_check', 'seraphina', ['week' => 3]);

        self::assertTrue($this->economy->hasDateThisWeek(1, 'seraphina', 3));
        self::assertTrue($this->economy->hasDateAwaitingFollowUp(1, 'seraphina', 3));
        self::assertTrue($this->economy->hasStoryChoiceThisWeek(1, 'seraphina', 3));
        self::assertTrue($this->economy->hasSuperLikeThisWeek(1, 'seraphina', 3));
        self::assertTrue($this->economy->hasConflictCheckThisWeek(1, 'seraphina', 3));

        $this->ledger->addEvent(1, 'date_follow_up', 'seraphina', ['week' => 3]);

        self::assertFalse($this->economy->hasDateAwaitingFollowUp(1, 'seraphina', 3));
    }

    public function testConflictPressureClearsAfterRepositoryResolution(): void
    {
        $this->ledger->addConflict([
            'conflict_id' => 'conflict_1',
            'save_id' => 1,
            'character_id' => 'thessarian',
            'conflict_type' => 'miscommunication',
            'severity' => 'major',
            'trigger_text' => 'missed signal',
            'description' => 'A missed signal created tension.',
            'start_at' => '2026-06-14 00:00:00',
            'affection_penalty' => 4,
            'resolution_options' => [
                [
                    'id' => 'discuss',
                    'method' => 'discuss',
                    'label' => 'Discuss',
                    'description' => 'Talk it through.',
                    'preview' => ['successChance' => 80, 'affectionChange' => 4],
                ],
            ],
        ]);

        $conflicts = $this->ledger->listConflicts(1, 'thessarian');
        $pressure = $this->economy->activeConflictPressure($conflicts);

        self::assertTrue($this->economy->hasActiveConflict(1, 'thessarian'));
        self::assertSame(-3, $pressure['affection']);
        self::assertSame(-2, $pressure['trust']);

        $this->ledger->resolveConflict(1, 'conflict_1', 'discuss');

        self::assertFalse($this->economy->hasActiveConflict(1, 'thessarian'));
        self::assertSame([], $this->economy->activeConflictPressure(
            $this->ledger->listConflicts(1, 'thessarian')
        )['items']);
    }

    private function ledger(): object
    {
        return new class implements GameLedgerRepository {
            private array $events = [];
            private array $conflicts = [];

            public function addEvent(int $saveId, string $eventType, ?string $characterId, array $payload): void
            {
                $this->events[] = [
                    'id' => count($this->events) + 1,
                    'save_id' => $saveId,
                    'event_type' => $eventType,
                    'character_id' => $characterId,
                    'payload' => $payload,
                ];
            }

            public function listEvents(int $saveId, ?string $eventType = null): array
            {
                return array_values(array_filter(
                    $this->events,
                    static fn(array $event): bool => $event['save_id'] === $saveId
                        && ($eventType === null || $event['event_type'] === $eventType)
                ));
            }

            public function listEventsForCharacter(
                int $saveId,
                string $characterId,
                ?string $eventType = null
            ): array {
                return array_values(array_filter(
                    $this->events,
                    static fn(array $event): bool => $event['save_id'] === $saveId
                        && $event['character_id'] === $characterId
                        && ($eventType === null || $event['event_type'] === $eventType)
                ));
            }

            public function addConflict(array $data): void
            {
                $this->conflicts[] = [
                    'id' => $data['conflict_id'],
                    'character_id' => $data['character_id'],
                    'type' => $data['conflict_type'],
                    'severity' => $data['severity'],
                    'trigger' => $data['trigger_text'],
                    'description' => $data['description'],
                    'resolved' => false,
                    'affection_penalty' => $data['affection_penalty'],
                    'resolution_options' => $data['resolution_options'],
                    'save_id' => $data['save_id'],
                ];
            }

            public function listConflicts(int $saveId, ?string $characterId = null): array
            {
                return array_values(array_filter(
                    $this->conflicts,
                    static fn(array $conflict): bool => $conflict['save_id'] === $saveId
                        && ($characterId === null || $conflict['character_id'] === $characterId)
                ));
            }

            public function resolveConflict(int $saveId, string $conflictId, string $method): void
            {
                foreach ($this->conflicts as $index => $conflict) {
                    if ($conflict['save_id'] === $saveId && $conflict['id'] === $conflictId) {
                        $this->conflicts[$index]['resolved'] = true;
                        $this->conflicts[$index]['resolution_method'] = $method;
                    }
                }
            }
        };
    }
}
