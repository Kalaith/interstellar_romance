<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\ContentRepository;
use App\Repositories\GameRepository;

final class ProgressionService
{
    public function __construct(
        private readonly ContentRepository $contentRepository,
        private readonly GameRepository $gameRepository,
        private readonly GameRulesService $rules
    ) {
    }

    public function ensureInitialized(int $saveId): void
    {
        $this->gameRepository->initializeContentState(
            $saveId,
            $this->contentRepository->listCharacters(),
            $this->contentRepository->listMilestones(),
            $this->contentRepository->listPhotos(),
            $this->contentRepository->listAchievements(),
            $this->contentRepository->listStorylines(),
            $this->contentRepository->getGameConstant('default_known_info') ?? []
        );
    }

    public function sync(int $saveId): void
    {
        $this->ensureInitialized($saveId);

        $save = $this->gameRepository->getSave($saveId);
        $characters = $this->indexBy($this->contentRepository->listCharacters(), 'id');
        $relationships = $this->gameRepository->listRelationshipStates($saveId);
        $milestones = $this->contentRepository->listMilestones();
        $photosByCharacter = $this->groupBy($this->contentRepository->listPhotos(), 'character_id');
        $knowledgeRules = $this->contentRepository->listKnowledgeUnlockRules();
        $levels = $this->contentRepository->listRelationshipLevels();
        $storylines = $this->contentRepository->listStorylines();

        foreach ($relationships as $relationship) {
            $characterId = (string) $relationship['character_id'];
            if (!isset($characters[$characterId])) {
                continue;
            }

            foreach ($milestones as $milestone) {
                if ((int) $relationship['affection'] >= (int) $milestone['unlocked_at_affection']) {
                    $this->gameRepository->setMilestoneAchieved(
                        $saveId,
                        $characterId,
                        (string) $milestone['milestone_id']
                    );
                }
            }

            foreach ($photosByCharacter[$characterId] ?? [] as $photo) {
                if ((int) $relationship['affection'] >= (int) $photo['unlocked_at_affection']) {
                    $this->gameRepository->setPhotoUnlocked($saveId, $characterId, (string) $photo['photo_id']);
                }
            }

            $milestoneStates = $this->gameRepository->listMilestoneStates($saveId, $characterId);
            $achievedCount = count(array_filter(
                $milestoneStates,
                static fn(array $state): bool => (int) $state['achieved'] === 1
            ));
            $knownInfo = $this->rules->updateKnowledge(
                $relationship['known_info'],
                (int) $relationship['affection'],
                $achievedCount,
                $knowledgeRules
            );
            $fields = $this->rules->relationshipUpdateFields(
                $save,
                $relationship,
                $characters[$characterId],
                (int) $relationship['affection'],
                $levels,
                $knownInfo
            );
            $this->gameRepository->updateRelationship($saveId, $characterId, $fields);

            foreach ($storylines as $storyline) {
                if ((string) $storyline['character_id'] !== $characterId) {
                    continue;
                }

                $isUnlocked = (int) $relationship['affection'] >= (int) $storyline['required_affection'];
                $this->gameRepository->updateStorylineUnlocked(
                    $saveId,
                    (string) $storyline['storyline_id'],
                    $isUnlocked
                );
            }
        }

        $this->syncAchievements($saveId);
    }

    private function syncAchievements(int $saveId): void
    {
        $save = $this->gameRepository->getSave($saveId);
        $relationships = $this->gameRepository->listRelationshipStates($saveId);
        $photoStates = $this->gameRepository->listPhotoStates($saveId);
        $milestoneStates = $this->gameRepository->listMilestoneStates($saveId);
        $stats = $this->rules->achievementStats($save, $relationships, $photoStates, $milestoneStates);

        foreach ($this->contentRepository->listAchievements() as $achievement) {
            $result = $this->rules->achievementProgress($achievement, $stats);
            $this->gameRepository->updateAchievementState(
                $saveId,
                (string) $achievement['id'],
                (int) $result['progress'],
                (bool) $result['achieved']
            );
        }
    }

    private function indexBy(array $rows, string $key): array
    {
        $indexed = [];
        foreach ($rows as $row) {
            $indexed[(string) $row[$key]] = $row;
        }
        return $indexed;
    }

    private function groupBy(array $rows, string $key): array
    {
        $grouped = [];
        foreach ($rows as $row) {
            $grouped[(string) $row[$key]][] = $row;
        }
        return $grouped;
    }
}
