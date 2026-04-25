<?php

declare(strict_types=1);

namespace Tests;

use App\Services\GameRulesService;
use PHPUnit\Framework\TestCase;

final class GameRulesServiceTest extends TestCase
{
    public function testMaxInteractionsFollowAffectionBands(): void
    {
        $rules = new GameRulesService();

        self::assertSame(3, $rules->calculateMaxInteractions(0));
        self::assertSame(4, $rules->calculateMaxInteractions(20));
        self::assertSame(5, $rules->calculateMaxInteractions(40));
        self::assertSame(6, $rules->calculateMaxInteractions(60));
        self::assertSame(8, $rules->calculateMaxInteractions(80));
    }

    public function testPlayerValidationNormalizesStats(): void
    {
        $rules = new GameRulesService();

        $player = $rules->validatePlayer([
            'name' => 'Captain Test',
            'species' => 'human',
            'gender' => 'non-binary',
            'sexualPreference' => 'all',
            'traits' => ['curious'],
            'backstory' => 'A test explorer.',
            'stats' => [
                'charisma' => 101,
                'intelligence' => 80,
                'adventure' => 70,
                'empathy' => 60,
                'technology' => -5,
            ],
        ]);

        self::assertSame(100, $player['stats']['charisma']);
        self::assertSame(0, $player['stats']['technology']);
        self::assertSame('all', $player['sexual_preference']);
    }

    public function testCompatibilityReturnsStableBreakdown(): void
    {
        $rules = new GameRulesService();
        $save = [
            'player_species' => 'human',
            'sexual_preference' => 'all',
            'player_traits' => ['curious', 'diplomatic'],
            'stats' => [
                'charisma' => 70,
                'intelligence' => 80,
                'adventure' => 40,
                'empathy' => 75,
                'technology' => 55,
            ],
        ];
        $character = [
            'gender' => 'female',
            'profile' => [
                'interests' => [
                    ['category' => 'science', 'intensity' => 5],
                    ['category' => 'culture', 'intensity' => 3],
                ],
                'values' => ['growth', 'harmony'],
                'conversationStyle' => 'philosophical',
                'preferredActivities' => ['intellectual', 'social'],
            ],
        ];

        $compatibility = $rules->calculateCompatibility($save, $character);

        self::assertArrayHasKey('overall', $compatibility);
        self::assertGreaterThanOrEqual(0, $compatibility['overall']);
        self::assertLessThanOrEqual(100, $compatibility['overall']);
        self::assertSame(
            ['interests', 'values', 'conversationStyle', 'activities'],
            array_keys($compatibility['breakdown'])
        );
    }
}
