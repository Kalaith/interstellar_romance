<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\GameLedgerRepository;
use DomainException;
use LogicException;

final class ActionEconomyService
{
    public const WEEKLY_ENERGY = 12;
    public const WEEKLY_TIME_SLOTS = 5;
    public const WEEKLY_SOCIAL_FOCUS = 10;
    public const WEEKLY_DIALOGUES_PER_CHARACTER = 3;
    public const WEEKLY_STORY_CHOICES_PER_CHARACTER = 1;
    public const WEEKLY_SUPER_LIKES_PER_CHARACTER = 1;
    public const WEEKLY_CONFLICT_CHECKS_PER_CHARACTER = 1;

    public function __construct(private readonly ?GameLedgerRepository $gameRepository = null)
    {
    }

    public function weeklyActivityCost(array $activity): array
    {
        return $this->cost(
            (int) ($activity['energy_cost'] ?? 2),
            (int) ($activity['time_slots'] ?? 1),
            0
        );
    }

    public function selfImprovementCost(array $activity): array
    {
        return $this->cost(
            (int) ($activity['energy_cost'] ?? 1),
            (int) ($activity['time_slots'] ?? 1),
            0
        );
    }

    public function dialogueCost(array $option): array
    {
        $topic = (string) ($option['topic'] ?? 'general');
        $emotion = (string) ($option['emotion'] ?? 'neutral');
        $intenseTopics = ['backstory', 'flirt', 'philosophy', 'romantic', 'spiritual'];
        $socialFocus = in_array($topic, $intenseTopics, true) || $emotion === 'flirty' ? 2 : 1;

        return $this->cost(0, 0, $socialFocus);
    }

    public function dateCost(array $datePlan): array
    {
        $duration = (int) ($datePlan['duration_minutes'] ?? $datePlan['duration'] ?? 90);
        if ($duration <= 60) {
            return $this->cost(2, 1, 1);
        }
        if ($duration <= 120) {
            return $this->cost(3, 2, 1);
        }

        return $this->cost(4, 2, 1);
    }

    public function storylineChoiceCost(): array
    {
        return $this->cost(2, 1, 1);
    }

    public function dateFollowUpCost(): array
    {
        return $this->cost(0, 0, 1);
    }

    public function superLikeCost(): array
    {
        return $this->cost(0, 0, 2);
    }

    public function conflictResolutionCost(array $option): array
    {
        $method = (string) ($option['method'] ?? '');
        if ($method === 'time_apart') {
            return $this->cost(0, 0, 0);
        }
        if ($method === 'ignore') {
            return $this->cost(0, 0, 1);
        }

        return $this->cost(2, 1, 1);
    }

    public function addCosts(array $costs): array
    {
        $total = $this->cost(0, 0, 0);
        foreach ($costs as $cost) {
            $total['energy'] += (int) ($cost['energy'] ?? 0);
            $total['timeSlots'] += (int) ($cost['timeSlots'] ?? 0);
            $total['socialFocus'] += (int) ($cost['socialFocus'] ?? 0);
        }

        return $total;
    }

    public function assertCanSpend(int $saveId, int $week, array $cost, string $actionLabel): void
    {
        $reason = $this->disabledReason($this->weeklyUsage($saveId, $week), $cost);
        if ($reason !== null) {
            throw new DomainException($actionLabel . ' is unavailable: ' . $reason);
        }
    }

    public function actionAvailability(int $saveId, int $week, array $cost, ?string $blockedReason = null): array
    {
        $reason = $blockedReason ?? $this->disabledReason($this->weeklyUsage($saveId, $week), $cost);

        return [
            'actionCost' => $cost,
            'canUse' => $reason === null,
            'disabledReason' => $reason,
        ];
    }

    public function budgetPayload(int $saveId, int $week): array
    {
        $usage = $this->weeklyUsage($saveId, $week);

        return [
            'week' => $week,
            'energy' => $this->resourcePayload(self::WEEKLY_ENERGY, $usage['energy']),
            'timeSlots' => $this->resourcePayload(self::WEEKLY_TIME_SLOTS, $usage['timeSlots']),
            'socialFocus' => $this->resourcePayload(self::WEEKLY_SOCIAL_FOCUS, $usage['socialFocus']),
            'costs' => [
                'storylineChoice' => $this->storylineChoiceCost(),
                'dateFollowUp' => $this->dateFollowUpCost(),
                'superLike' => $this->superLikeCost(),
            ],
            'warnings' => $this->warnings($usage),
        ];
    }

    public function weeklyUsage(int $saveId, int $week): array
    {
        $this->requireRepository();
        $usage = [
            'energy' => 0,
            'timeSlots' => 0,
            'socialFocus' => 0,
        ];

        foreach ($this->gameRepository->listEvents($saveId) as $event) {
            $payload = $event['payload'];
            if ((int) ($payload['week'] ?? 0) !== $week) {
                continue;
            }

            if (($event['event_type'] ?? '') === 'weekly_activities_completed') {
                $usage['energy'] += (int) ($payload['energy_used'] ?? 0);
                $usage['timeSlots'] += (int) ($payload['time_slots_used'] ?? 0);
                continue;
            }

            $usage['energy'] += (int) ($payload['energy_cost'] ?? 0);
            $usage['timeSlots'] += (int) ($payload['time_slots'] ?? 0);
            $usage['socialFocus'] += (int) ($payload['social_cost'] ?? 0);
        }

        return $usage;
    }

    public function weeklyDialogueCount(int $saveId, string $characterId, int $week): int
    {
        return $this->countCharacterEvents($saveId, $characterId, 'dialogue_choice', $week);
    }

    public function topicCountThisWeek(int $saveId, string $characterId, int $week, string $topic): int
    {
        $this->requireRepository();
        $count = 0;
        foreach ($this->gameRepository->listEventsForCharacter($saveId, $characterId, 'dialogue_choice') as $event) {
            if (
                (int) ($event['payload']['week'] ?? 0) === $week
                && ($event['payload']['topic'] ?? null) === $topic
            ) {
                $count++;
            }
        }

        return $count;
    }

    public function hasDateThisWeek(int $saveId, string $characterId, int $week): bool
    {
        return $this->countCharacterEvents($saveId, $characterId, 'date_completed', $week) > 0;
    }

    public function hasStoryChoiceThisWeek(int $saveId, string $characterId, int $week): bool
    {
        return $this->countCharacterEvents($saveId, $characterId, 'storyline_choice_completed', $week) >=
            self::WEEKLY_STORY_CHOICES_PER_CHARACTER;
    }

    public function hasSuperLikeThisWeek(int $saveId, string $characterId, int $week): bool
    {
        return $this->countCharacterEvents($saveId, $characterId, 'super_like_used', $week) >=
            self::WEEKLY_SUPER_LIKES_PER_CHARACTER;
    }

    public function hasConflictCheckThisWeek(int $saveId, string $characterId, int $week): bool
    {
        return $this->countCharacterEvents($saveId, $characterId, 'conflict_check', $week) >=
            self::WEEKLY_CONFLICT_CHECKS_PER_CHARACTER
            || $this->countCharacterEvents($saveId, $characterId, 'conflict_created', $week) > 0;
    }

    public function hasDateFollowUpThisWeek(int $saveId, string $characterId, int $week): bool
    {
        return $this->countCharacterEvents($saveId, $characterId, 'date_follow_up', $week) > 0;
    }

    public function hasDateAwaitingFollowUp(int $saveId, string $characterId, int $week): bool
    {
        return $this->hasDateThisWeek($saveId, $characterId, $week)
            && !$this->hasDateFollowUpThisWeek($saveId, $characterId, $week);
    }

    public function wasEngagedThisWeek(int $saveId, string $characterId, int $week): bool
    {
        foreach (['dialogue_choice', 'date_completed', 'storyline_choice_completed', 'super_like_used'] as $type) {
            if ($this->countCharacterEvents($saveId, $characterId, $type, $week) > 0) {
                return true;
            }
        }

        return false;
    }

    public function hasActiveConflict(int $saveId, string $characterId): bool
    {
        $this->requireRepository();
        foreach ($this->gameRepository->listConflicts($saveId, $characterId) as $conflict) {
            if (!$conflict['resolved']) {
                return true;
            }
        }

        return false;
    }

    public function activeConflictPressure(array $conflicts): array
    {
        $items = [];
        $affection = 0;
        $trust = 0;
        $mood = null;
        $highestWeight = 0;

        foreach ($conflicts as $conflict) {
            if ((bool) ($conflict['resolved'] ?? false)) {
                continue;
            }

            $pressure = $this->unresolvedConflictPressure($conflict);
            $items[] = $pressure;
            $affection += $pressure['affection'];
            $trust += $pressure['trust'];

            if ($pressure['weight'] > $highestWeight) {
                $mood = $pressure['mood'];
                $highestWeight = $pressure['weight'];
            }
        }

        return [
            'affection' => $affection,
            'trust' => $trust,
            'mood' => $mood,
            'items' => $items,
        ];
    }

    public function unresolvedConflictPressure(array $conflict): array
    {
        $severity = (string) ($conflict['severity'] ?? 'moderate');
        $impact = match ($severity) {
            'minor' => ['affection' => -1, 'trust' => 0, 'mood' => 'melancholy', 'weight' => 1],
            'major' => ['affection' => -3, 'trust' => -2, 'mood' => 'tired', 'weight' => 3],
            'critical' => ['affection' => -4, 'trust' => -3, 'mood' => 'melancholy', 'weight' => 4],
            default => ['affection' => -2, 'trust' => -1, 'mood' => 'tired', 'weight' => 2],
        };

        return [
            ...$impact,
            'conflict_id' => (string) ($conflict['id'] ?? $conflict['conflict_id'] ?? ''),
            'severity' => $severity,
            'reason' => ucfirst($severity) . ' unresolved conflict added pressure',
        ];
    }

    public function conflictRecoveryBonus(string $characterId, array $option, bool $successful): array
    {
        if (!$successful) {
            return [
                'affection' => 0,
                'trust' => 0,
                'commitment' => 0,
                'reason' => 'The recovery approach did not land cleanly.',
            ];
        }

        $method = (string) ($option['method'] ?? '');
        $base = match ($method) {
            'apologize' => [
                'affection' => 1,
                'trust' => 1,
                'commitment' => 0,
                'reason' => 'A direct apology repaired some trust.',
            ],
            'discuss' => [
                'affection' => 0,
                'trust' => 2,
                'commitment' => 0,
                'reason' => 'A patient discussion rebuilt trust.',
            ],
            'compromise' => [
                'affection' => 1,
                'trust' => 1,
                'commitment' => 1,
                'reason' => 'A fair compromise strengthened commitment.',
            ],
            'gift' => [
                'affection' => 2,
                'trust' => 0,
                'commitment' => 0,
                'reason' => 'A thoughtful gesture softened the moment.',
            ],
            'time_apart' => [
                'affection' => 0,
                'trust' => 1,
                'commitment' => 0,
                'reason' => 'Giving space prevented deeper harm.',
            ],
            default => [
                'affection' => 0,
                'trust' => 0,
                'commitment' => 0,
                'reason' => null,
            ],
        };

        $character = $this->characterRecoveryPath($characterId, $method);

        return [
            'affection' => $base['affection'] + $character['affection'],
            'trust' => $base['trust'] + $character['trust'],
            'commitment' => $base['commitment'] + $character['commitment'],
            'reason' => trim((string) $base['reason'] . ' ' . (string) $character['reason']),
        ];
    }

    public function disabledReason(array $usage, array $cost): ?string
    {
        $missing = [];
        $energyShortfall = (int) ($usage['energy'] ?? 0) + (int) ($cost['energy'] ?? 0) - self::WEEKLY_ENERGY;
        if ($energyShortfall > 0) {
            $missing[] = $energyShortfall . ' energy';
        }

        $timeShortfall = (int) ($usage['timeSlots'] ?? 0) + (int) ($cost['timeSlots'] ?? 0) -
            self::WEEKLY_TIME_SLOTS;
        if ($timeShortfall > 0) {
            $missing[] = $timeShortfall . ' time slot' . ($timeShortfall === 1 ? '' : 's');
        }

        $socialShortfall = (int) ($usage['socialFocus'] ?? 0) + (int) ($cost['socialFocus'] ?? 0) -
            self::WEEKLY_SOCIAL_FOCUS;
        if ($socialShortfall > 0) {
            $missing[] = $socialShortfall . ' social focus';
        }

        return $missing === [] ? null : 'not enough ' . implode(', ', $missing);
    }

    private function countCharacterEvents(int $saveId, string $characterId, string $eventType, int $week): int
    {
        $this->requireRepository();
        $count = 0;
        foreach ($this->gameRepository->listEventsForCharacter($saveId, $characterId, $eventType) as $event) {
            if ((int) ($event['payload']['week'] ?? 0) === $week) {
                $count++;
            }
        }

        return $count;
    }

    private function resourcePayload(int $available, int $used): array
    {
        return [
            'available' => $available,
            'used' => $used,
            'remaining' => max(0, $available - $used),
        ];
    }

    private function warnings(array $usage): array
    {
        $warnings = [];
        if ($usage['energy'] >= self::WEEKLY_ENERGY) {
            $warnings[] = 'Energy is fully committed for this cycle.';
        }
        if ($usage['timeSlots'] >= self::WEEKLY_TIME_SLOTS) {
            $warnings[] = 'No free time slots remain this cycle.';
        }
        if ($usage['socialFocus'] >= self::WEEKLY_SOCIAL_FOCUS) {
            $warnings[] = 'Social focus is fully spent this cycle.';
        }

        return $warnings;
    }

    private function cost(int $energy, int $timeSlots, int $socialFocus): array
    {
        return [
            'energy' => max(0, $energy),
            'timeSlots' => max(0, $timeSlots),
            'socialFocus' => max(0, $socialFocus),
        ];
    }

    private function characterRecoveryPath(string $characterId, string $method): array
    {
        $empty = ['affection' => 0, 'trust' => 0, 'commitment' => 0, 'reason' => ''];

        return match ($characterId) {
            'kyrathen' => in_array($method, ['discuss', 'compromise'], true)
                ? [
                    'affection' => 0,
                    'trust' => 1,
                    'commitment' => 1,
                    'reason' => 'Kyra\'then respects honorable repair.',
                ]
                : $empty,
            'seraphina' => in_array($method, ['apologize', 'discuss'], true)
                ? [
                    'affection' => 0,
                    'trust' => 1,
                    'commitment' => 0,
                    'reason' => 'Seraphina values emotional clarity.',
                ]
                : $empty,
            'thessarian' => $method === 'discuss'
                ? [
                    'affection' => 0,
                    'trust' => 2,
                    'commitment' => 0,
                    'reason' => 'Thessarian responds to clear analysis.',
                ]
                : $empty,
            'lyralynn' => in_array($method, ['apologize', 'compromise'], true)
                ? [
                    'affection' => 1,
                    'trust' => 1,
                    'commitment' => 0,
                    'reason' => 'Lyralynn recovers through care and gentleness.',
                ]
                : $empty,
            'zarantha' => in_array($method, ['compromise', 'discuss'], true)
                ? [
                    'affection' => 0,
                    'trust' => 1,
                    'commitment' => 1,
                    'reason' => 'Zarantha respects decisive accountability.',
                ]
                : $empty,
            'thalassos' => in_array($method, ['time_apart', 'discuss'], true)
                ? [
                    'affection' => 0,
                    'trust' => 1,
                    'commitment' => 0,
                    'reason' => 'Thalassos values patient reflection.',
                ]
                : $empty,
            'nightshade' => $method === 'discuss'
                ? [
                    'affection' => 0,
                    'trust' => 2,
                    'commitment' => 0,
                    'reason' => 'Nightshade rewards direct honesty.',
                ]
                : $empty,
            'kronos' => $method === 'discuss'
                ? [
                    'affection' => 0,
                    'trust' => 2,
                    'commitment' => 0,
                    'reason' => 'Kronos responds to transparent reasoning.',
                ]
                : $empty,
            default => $empty,
        };
    }

    private function requireRepository(): void
    {
        if (!$this->gameRepository instanceof GameLedgerRepository) {
            throw new LogicException('Action economy usage requires a game repository.');
        }
    }
}
