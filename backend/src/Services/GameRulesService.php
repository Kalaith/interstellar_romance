<?php

declare(strict_types=1);

namespace App\Services;

use DateTimeImmutable;
use DateTimeZone;
use DomainException;

final class GameRulesService
{
    private const STAT_KEYS = ['charisma', 'intelligence', 'adventure', 'empathy', 'technology'];
    private const TRAIT_STAT_BONUSES = [
        'charismatic' => ['charisma' => 2],
        'intelligent' => ['intelligence' => 2],
        'adventurous' => ['adventure' => 2],
        'empathetic' => ['empathy' => 2],
        'tech-savvy' => ['technology' => 2],
    ];

    public function validatePlayer(array $body): array
    {
        $required = ['name', 'species', 'gender', 'sexualPreference', 'traits', 'backstory'];
        foreach ($required as $key) {
            if (!array_key_exists($key, $body)) {
                throw new DomainException('Missing player field: ' . $key);
            }
        }

        if (!is_string($body['name']) || trim($body['name']) === '') {
            throw new DomainException('Player name is required.');
        }
        if (!is_array($body['traits'])) {
            throw new DomainException('Player traits must be an array.');
        }

        $traits = array_values(array_unique(array_map('strval', $body['traits'])));
        if (count($traits) !== 2) {
            throw new DomainException('Exactly two player traits are required.');
        }

        $stats = array_fill_keys(self::STAT_KEYS, 5);
        foreach ($traits as $trait) {
            if (!isset(self::TRAIT_STAT_BONUSES[$trait])) {
                throw new DomainException('Unknown player trait: ' . $trait);
            }

            foreach (self::TRAIT_STAT_BONUSES[$trait] as $statKey => $bonus) {
                $stats[$statKey] = $this->clamp((int) $stats[$statKey] + (int) $bonus, 0, 100);
            }
        }
        foreach (self::STAT_KEYS as $statKey) {
            $stats[$statKey] = $this->clamp((int) $stats[$statKey], 0, 100);
        }

        return [
            'name' => trim((string) $body['name']),
            'species' => (string) $body['species'],
            'gender' => (string) $body['gender'],
            'sexual_preference' => (string) $body['sexualPreference'],
            'traits' => $traits,
            'backstory' => (string) $body['backstory'],
            'stats' => $stats,
        ];
    }

    public function normalizeTimezone(mixed $timezone): string
    {
        if (!is_string($timezone) || trim($timezone) === '') {
            return 'UTC';
        }

        try {
            new DateTimeZone($timezone);
            return $timezone;
        } catch (\Throwable) {
            return 'UTC';
        }
    }

    public function today(string $timezone): string
    {
        $zone = new DateTimeZone($this->normalizeTimezone($timezone));
        return (new DateTimeImmutable('now', $zone))->format('Y-m-d');
    }

    public function now(): string
    {
        return gmdate('Y-m-d H:i:s');
    }

    public function refreshDailyInteractions(array $relationship, string $timezone): array
    {
        $today = $this->today($timezone);
        if (($relationship['daily_reset_date'] ?? null) === $today) {
            return $relationship;
        }

        $relationship['daily_reset_date'] = $today;
        $relationship['interactions_used'] = 0;
        $relationship['timezone'] = $timezone;
        return $relationship;
    }

    public function calculateMaxInteractions(int $affection): int
    {
        if ($affection >= 80) {
            return 8;
        }
        if ($affection >= 60) {
            return 6;
        }
        if ($affection >= 40) {
            return 5;
        }
        if ($affection >= 20) {
            return 4;
        }

        return 3;
    }

    public function randomMood(array $moods): string
    {
        $keys = array_values(array_map(static fn(array $mood): string => (string) $mood['mood'], $moods));
        if ($keys === []) {
            return 'neutral';
        }

        return $keys[random_int(0, count($keys) - 1)];
    }

    public function moodModifier(?array $mood, string $topic): int
    {
        if ($mood === null) {
            return 0;
        }

        return in_array($topic, $mood['preferred_topics'] ?? [], true)
            ? (int) $mood['bonus']
            : (int) $mood['penalty'];
    }

    public function relationshipLevel(int $affection, array $levels): array
    {
        foreach ($levels as $level) {
            if ($affection >= (int) $level['min_affection'] && $affection <= (int) $level['max_affection']) {
                return $level;
            }
        }

        return [
            'level_key' => 'stranger',
            'title_template' => 'Unknown',
            'description_template' => 'This relationship is still undefined.',
        ];
    }

    public function formatRelationshipStatus(array $relationship, array $character, array $levels): array
    {
        $level = $this->relationshipLevel((int) $relationship['affection'], $levels);
        $name = (string) $character['name'];

        return [
            'level' => $level['level_key'],
            'title' => str_replace('{character}', $name, (string) $level['title_template']),
            'description' => str_replace('{character}', $name, (string) $level['description_template']),
            'compatibility' => (int) $relationship['compatibility'],
            'trust' => (int) $relationship['trust'],
            'intimacy' => (int) $relationship['intimacy'],
            'commitment' => (int) $relationship['commitment'],
            'communicationStyle' => $relationship['communication_style'],
            'sharedExperiences' => (int) $relationship['shared_experiences'],
            'conflicts' => (int) $relationship['conflicts_count'],
            'lastStatusChange' => $relationship['last_status_change'],
        ];
    }

    public function updateKnowledge(array $knownInfo, int $affection, int $achievedMilestones, array $rules): array
    {
        foreach ($rules as $rule) {
            $key = (string) $rule['info_key'];
            $requiredAffection = $rule['required_affection'];
            $requiredMilestones = $rule['required_milestone_count'];

            if ($requiredAffection !== null && $affection >= (int) $requiredAffection) {
                $knownInfo[$key] = true;
            }
            if ($requiredMilestones !== null && $achievedMilestones >= (int) $requiredMilestones) {
                $knownInfo[$key] = true;
            }
        }

        return $knownInfo;
    }

    public function calculateCompatibility(array $save, array $character): array
    {
        $profile = $character['profile'];
        $interestScore = $this->calculateInterestCompatibility($save, $profile);
        $valueScore = $this->calculateValueCompatibility($save, $profile);
        $conversationScore = $this->calculateConversationCompatibility($save, $profile);
        $activityScore = $this->calculateActivityCompatibility($save, $profile);
        $overall = (int) round(($interestScore + $valueScore + $conversationScore + $activityScore) / 4);

        return [
            'overall' => $overall,
            'breakdown' => [
                'interests' => $interestScore,
                'values' => $valueScore,
                'conversationStyle' => $conversationScore,
                'activities' => $activityScore,
            ],
            'explanation' => $this->compatibilityExplanation($overall, [
                'interests' => $interestScore,
                'values' => $valueScore,
                'conversationStyle' => $conversationScore,
                'activities' => $activityScore,
            ], $profile),
        ];
    }

    public function isRomanticallyCompatible(array $save, array $character): bool
    {
        $preference = $save['sexual_preference'];
        $gender = $character['gender'];

        return match ($preference) {
            'men' => $gender === 'male',
            'women' => $gender === 'female',
            'non-binary' => $gender === 'non-binary' || $gender === 'other',
            'all', 'alien-species', null => true,
            default => true,
        };
    }

    public function relationshipUpdateFields(
        array $save,
        array $relationship,
        array $character,
        int $newAffection,
        array $levels,
        array $knownInfo
    ): array {
        $newAffection = $this->clamp($newAffection, 0, 100);
        $level = $this->relationshipLevel($newAffection, $levels);
        $compatibility = $this->calculateCompatibility($save, $character);
        $trust = min(100, (int) $relationship['trust'] + ($newAffection > (int) $relationship['intimacy'] ? 1 : 0));
        $intimacy = min(100, (int) floor($newAffection * 0.8) + (int) $relationship['shared_experiences']);
        $commitment = min(100, (int) floor($newAffection * 0.6) + ((int) $relationship['conflicts_count'] * 2));
        $levelChanged = $level['level_key'] !== $relationship['level_key'];

        return [
            'affection' => $newAffection,
            'known_info_json' => $knownInfo,
            'max_interactions' => $this->calculateMaxInteractions($newAffection),
            'level_key' => $level['level_key'],
            'compatibility' => $compatibility['overall'],
            'trust' => $trust,
            'intimacy' => $intimacy,
            'commitment' => $commitment,
            'last_status_change' => $levelChanged ? $this->now() : $relationship['last_status_change'],
        ];
    }

    public function dateOutcome(array $save, array $relationship, array $character, array $datePlan): array
    {
        $compatibility = $this->calculateCompatibility($save, $character);
        $preferred = in_array($datePlan['activity_type'], $character['profile']['preferredActivities'] ?? [], true);
        $preferenceBonus = $preferred ? 5 : 0;
        $gain = (int) round(
            ((int) $datePlan['compatibility_bonus'] * $compatibility['overall']) / 100 + $preferenceBonus
        );

        return [
            'success' => $gain > 0 && $compatibility['overall'] >= 40,
            'affection_gained' => $gain,
            'compatibility' => $compatibility,
            'preferred_activity' => $preferred,
            'memory' => [
                'type' => 'date_experience',
                'title' => ($gain > 0 && $compatibility['overall'] >= 40 ? 'Memorable' : 'Complicated') .
                    ' Date: ' . $datePlan['name'],
                'description' => ($gain > 0 && $compatibility['overall'] >= 40)
                    ? $character['name'] . ' shared a meaningful ' . $datePlan['activity_type'] .
                        ' experience with you at ' . $datePlan['location'] . '.'
                    : 'The date with ' . $character['name'] .
                        ' did not go smoothly, but it still became part of your shared history.',
                'emotional_impact' => $gain,
                'participant_emotions' => $gain > 0 ? ['happy'] : ['neutral'],
                'tags' => ['date_experience', $gain > 5 ? 'significant' : 'minor'],
            ],
        ];
    }

    public function achievementStats(
        array $save,
        array $relationships,
        array $photoStates,
        array $milestoneStates
    ): array {
        $affections = [];
        $compatibilities = [];
        foreach ($relationships as $relationship) {
            $affections[$relationship['character_id']] = (int) $relationship['affection'];
            $compatibilities[] = (int) $relationship['compatibility'];
        }

        $unlockedPhotos = count(array_filter(
            $photoStates,
            static fn(array $row): bool => (int) $row['unlocked'] === 1
        ));
        $unlockedMilestones = count(array_filter(
            $milestoneStates,
            static fn(array $row): bool => (int) $row['achieved'] === 1
        ));

        return [
            'totalAffection' => array_sum($affections),
            'maxAffection' => $affections === [] ? 0 : max($affections),
            'totalDates' => (int) $save['total_dates'],
            'totalConversations' => (int) $save['total_conversations'],
            'unlockedPhotos' => $unlockedPhotos,
            'maxCompatibility' => $compatibilities === [] ? 0 : max($compatibilities),
            'unlockedMilestones' => $unlockedMilestones,
            'characterAffections' => $affections,
        ];
    }

    public function achievementProgress(array $achievement, array $stats): array
    {
        $condition = $achievement['condition'];
        $target = max(1, (int) ($condition['target'] ?? 1));
        $value = 0;

        switch ($condition['type'] ?? '') {
            case 'affection':
                $value = isset($condition['characterId'])
                    ? (int) ($stats['characterAffections'][$condition['characterId']] ?? 0)
                    : (int) $stats['maxAffection'];
                break;
            case 'date_count':
                $value = (int) $stats['totalDates'];
                break;
            case 'conversation_count':
                $value = (int) $stats['totalConversations'];
                break;
            case 'photo_unlock':
                $value = (int) $stats['unlockedPhotos'];
                break;
            case 'compatibility':
                $value = (int) $stats['maxCompatibility'];
                break;
            case 'milestone':
                $value = (int) $stats['unlockedMilestones'];
                break;
        }

        return [
            'progress' => $this->clamp((int) round(($value / $target) * 100), 0, 100),
            'achieved' => $value >= $target,
        ];
    }

    public function conflictChance(int $affection): int
    {
        return max(5, (int) round(30 - ($affection * 0.2)));
    }

    public function conflictSeverity(int $affection): string
    {
        if ($affection > 60) {
            return 'minor';
        }
        if ($affection > 30) {
            return 'moderate';
        }

        return 'major';
    }

    public function conflictPenalty(int $basePenalty, string $severity): int
    {
        $multiplier = match ($severity) {
            'minor' => 0.5,
            'moderate' => 1.0,
            'critical' => 2.0,
            default => 1.5,
        };

        return (int) round($basePenalty * $multiplier);
    }

    public function canUseResolutionOption(array $save, array $relationship, array $option): bool
    {
        $requirements = $option['requirements'] ?? null;
        if (!is_array($requirements)) {
            return true;
        }

        if (isset($requirements['playerStat'], $requirements['minValue'])) {
            $stat = (string) $requirements['playerStat'];
            if (($save['stats'][$stat] ?? 0) < (int) $requirements['minValue']) {
                return false;
            }
        }

        if (
            isset($requirements['characterAffection'])
            && $relationship['affection'] < (int) $requirements['characterAffection']
        ) {
            return false;
        }

        return true;
    }

    public function resolveConflict(array $save, array $relationship, array $conflict, array $option): array
    {
        if (!$this->canUseResolutionOption($save, $relationship, $option)) {
            throw new DomainException('Resolution requirements are not met.');
        }

        $successChance = (int) ($option['preview']['successChance'] ?? 50);
        $requirements = $option['requirements'] ?? null;
        if (is_array($requirements) && isset($requirements['playerStat'], $requirements['minValue'])) {
            $statValue = (int) ($save['stats'][(string) $requirements['playerStat']] ?? 0);
            $successChance = min(
                95,
                (int) round($successChance + max(0, ($statValue - (int) $requirements['minValue']) * 0.5))
            );
        }

        $severityModifier = match ($conflict['severity']) {
            'minor' => 1.1,
            'major' => 0.85,
            'critical' => 0.7,
            default => 1.0,
        };
        $actualSuccess = $this->clamp((int) round($successChance * $severityModifier), 0, 95);
        $isSuccessful = random_int(1, 100) <= $actualSuccess;
        $effectivenessMultiplier = $isSuccessful ? 1.0 : 0.3;
        $previewChange = (int) ($option['preview']['affectionChange'] ?? 0);
        $recovery = (int) round(
            ($previewChange * $effectivenessMultiplier) -
            ((int) $conflict['affection_penalty'] * ($isSuccessful ? 0.8 : 0.3))
        );

        return [
            'method' => $option['method'],
            'success' => $isSuccessful,
            'effectiveness' => $isSuccessful ? $actualSuccess : (int) round($actualSuccess * 0.3),
            'affection_recovery' => max(-(int) $conflict['affection_penalty'], $recovery),
        ];
    }

    public function memoryKey(string $type): string
    {
        return $type . '_' . gmdate('YmdHis') . '_' . bin2hex(random_bytes(4));
    }

    public function generatedId(string $prefix): string
    {
        return $prefix . '_' . gmdate('YmdHis') . '_' . bin2hex(random_bytes(5));
    }

    private function calculateInterestCompatibility(array $save, array $profile): int
    {
        $stats = $save['stats'];
        $playerInterestScores = [
            'science' => $stats['intelligence'],
            'technology' => $stats['technology'],
            'adventure' => $stats['adventure'],
            'nature' => $stats['empathy'],
            'philosophy' => $stats['intelligence'],
            'culture' => $stats['charisma'],
            'arts' => $stats['empathy'],
            'exploration' => $stats['adventure'],
        ];

        $total = 0;
        $max = 0;
        foreach ($profile['interests'] ?? [] as $interest) {
            $playerScore = (int) ($playerInterestScores[$interest['category']] ?? 0);
            $intensity = (int) $interest['intensity'];
            $total += min($playerScore, $intensity * 20) * $intensity;
            $max += 100 * $intensity;
        }

        return $max > 0 ? (int) round(($total / $max) * 100) : 50;
    }

    private function calculateValueCompatibility(array $save, array $profile): int
    {
        $traits = array_map('strtolower', $save['player_traits']);
        $values = $profile['values'] ?? [];
        if ($values === []) {
            return 50;
        }

        $matches = 0;
        foreach ($values as $value) {
            switch ($value) {
                case 'adventure':
                    $matches += $save['stats']['adventure'] >= 70
                        || in_array('adventurous', $traits, true)
                        || in_array('bold', $traits, true) ? 1 : 0;
                    break;
                case 'honesty':
                    $matches += in_array('honest', $traits, true)
                        || in_array('truthful', $traits, true)
                        || in_array('direct', $traits, true) ? 1 : 0;
                    break;
                case 'harmony':
                    $matches += $save['stats']['empathy'] >= 70
                        || in_array('peaceful', $traits, true)
                        || in_array('diplomatic', $traits, true) ? 1 : 0;
                    break;
                case 'growth':
                    $matches += $save['stats']['intelligence'] >= 70
                        || in_array('curious', $traits, true)
                        || in_array('learning', $traits, true) ? 1 : 0;
                    break;
                case 'innovation':
                    $matches += $save['stats']['technology'] >= 70
                        || in_array('innovative', $traits, true)
                        || in_array('creative', $traits, true) ? 1 : 0;
                    break;
                case 'loyalty':
                    $matches += in_array('loyal', $traits, true)
                        || in_array('faithful', $traits, true)
                        || in_array('dedicated', $traits, true) ? 1 : 0;
                    break;
                case 'freedom':
                    $matches += in_array('independent', $traits, true)
                        || in_array('free-spirited', $traits, true)
                        || $save['stats']['adventure'] >= 60 ? 1 : 0;
                    break;
                case 'tradition':
                    $matches += in_array('traditional', $traits, true)
                        || in_array('respectful', $traits, true)
                        || in_array('honorable', $traits, true) ? 1 : 0;
                    break;
            }
        }

        return (int) round(($matches / count($values)) * 100);
    }

    private function calculateConversationCompatibility(array $save, array $profile): int
    {
        $style = $profile['conversationStyle'] ?? 'direct';
        $stats = $save['stats'];

        return match ($style) {
            'direct' => $stats['charisma'] >= 60 ? 80 : 60,
            'philosophical' => $stats['intelligence'] >= 70 ? 90 : ($stats['intelligence'] >= 50 ? 70 : 50),
            'playful' => $stats['charisma'] >= 70 ? 85 : ($stats['adventure'] >= 60 ? 75 : 55),
            'serious' => $stats['intelligence'] >= 60 ? 80 : 60,
            'emotional' => $stats['empathy'] >= 70 ? 90 : ($stats['empathy'] >= 50 ? 75 : 55),
            'analytical' => $stats['intelligence'] >= 80 || $stats['technology'] >= 70
                ? 85
                : ($stats['intelligence'] >= 60 ? 70 : 50),
            default => 50,
        };
    }

    private function calculateActivityCompatibility(array $save, array $profile): int
    {
        $stats = $save['stats'];
        $activityScores = [
            'intellectual' => $stats['intelligence'],
            'adventurous' => $stats['adventure'],
            'romantic' => $stats['charisma'] + $stats['empathy'],
            'cultural' => $stats['charisma'],
            'relaxing' => $stats['empathy'],
            'social' => $stats['charisma'],
            'creative' => $stats['empathy'] + $stats['intelligence'],
        ];

        $activities = $profile['preferredActivities'] ?? [];
        if ($activities === []) {
            return 50;
        }

        $total = 0;
        foreach ($activities as $activity) {
            $total += (int) ($activityScores[$activity] ?? 0);
        }

        return (int) round(min($total / count($activities), 100));
    }

    private function compatibilityExplanation(int $overall, array $breakdown, array $profile): array
    {
        $explanations = [];
        if ($overall >= 80) {
            $explanations[] = 'You two have incredible chemistry together!';
        } elseif ($overall >= 60) {
            $explanations[] = "There's definitely potential for a strong connection.";
        } elseif ($overall >= 40) {
            $explanations[] = 'You have some things in common, but may need to work on compatibility.';
        } else {
            $explanations[] = 'You might have different approaches to life, but opposites can attract!';
        }

        if ($breakdown['interests'] >= 80) {
            $explanations[] = 'Your interests align wonderfully with theirs.';
        } elseif ($breakdown['interests'] <= 40) {
            $explanations[] = 'Your interests are quite different, which could lead to interesting discoveries.';
        }

        if ($breakdown['values'] >= 80) {
            $explanations[] = 'You share many of the same core values.';
        } elseif ($breakdown['values'] <= 40) {
            $explanations[] = 'Your values differ, which might require understanding and compromise.';
        }

        if ($breakdown['conversationStyle'] >= 80) {
            $explanations[] = 'Your communication styles complement each other well for ' .
                ($profile['conversationStyle'] ?? 'direct') . ' conversations.';
        } elseif ($breakdown['conversationStyle'] <= 40) {
            $explanations[] = 'Their ' . ($profile['conversationStyle'] ?? 'direct') .
                ' conversation style might be challenging for you at first.';
        }

        if ($breakdown['activities'] >= 80) {
            $explanations[] = "You'd enjoy many of the same activities together.";
        } elseif ($breakdown['activities'] <= 40) {
            $explanations[] = 'You might need to explore new activities to connect.';
        }

        return $explanations;
    }

    private function clamp(int $value, int $min, int $max): int
    {
        return max($min, min($max, $value));
    }
}
