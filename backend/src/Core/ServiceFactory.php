<?php

declare(strict_types=1);

namespace App\Core;

use App\Actions\ChooseDialogueAction;
use App\Actions\CompleteActivitiesAction;
use App\Actions\CompleteDateAction;
use App\Actions\CompleteDateFollowUpAction;
use App\Actions\CompleteSelfImprovementAction;
use App\Actions\CompleteStorylineChoiceAction;
use App\Actions\CreateConflictAction;
use App\Actions\GetContentAction;
use App\Actions\LoadGameAction;
use App\Actions\LinkGuestAccountAction;
use App\Actions\RefreshMoodsAction;
use App\Actions\ResolveConflictAction;
use App\Actions\SelectCharacterAction;
use App\Actions\StartGameAction;
use App\Actions\UseSuperLikeAction;
use App\Controllers\ContentController;
use App\Controllers\AuthController;
use App\Controllers\GameController;
use App\Controllers\SystemController;
use App\Repositories\ContentRepository;
use App\Repositories\GameRepository;
use App\Services\GameRulesService;
use App\Services\GameStateService;
use App\Services\ProgressionService;
use PDO;
use RuntimeException;

final class ServiceFactory
{
    private ?PDO $db = null;
    private ?ContentRepository $contentRepository = null;
    private ?GameRepository $gameRepository = null;
    private ?GameRulesService $rules = null;
    private ?ProgressionService $progressionService = null;
    private ?GameStateService $stateService = null;

    public function create(string $class): object
    {
        return match ($class) {
            SystemController::class => new SystemController(),
            AuthController::class => new AuthController(
                new LinkGuestAccountAction($this->gameRepository(), $this->progressionService(), $this->stateService())
            ),
            ContentController::class => new ContentController(
                new GetContentAction($this->stateService())
            ),
            GameController::class => new GameController(
                new LoadGameAction($this->gameRepository(), $this->progressionService(), $this->stateService()),
                new StartGameAction(
                    $this->gameRepository(),
                    $this->rules(),
                    $this->progressionService(),
                    $this->stateService()
                ),
                new SelectCharacterAction(
                    $this->contentRepository(),
                    $this->gameRepository(),
                    $this->progressionService(),
                    $this->stateService()
                ),
                new ChooseDialogueAction(
                    $this->contentRepository(),
                    $this->gameRepository(),
                    $this->rules(),
                    $this->progressionService(),
                    $this->stateService()
                ),
                new CompleteDateAction(
                    $this->contentRepository(),
                    $this->gameRepository(),
                    $this->rules(),
                    $this->progressionService(),
                    $this->stateService()
                ),
                new CompleteDateFollowUpAction(
                    $this->gameRepository(),
                    $this->progressionService(),
                    $this->stateService()
                ),
                new CompleteActivitiesAction(
                    $this->contentRepository(),
                    $this->gameRepository(),
                    $this->rules(),
                    $this->progressionService(),
                    $this->stateService()
                ),
                new CompleteSelfImprovementAction(
                    $this->contentRepository(),
                    $this->gameRepository(),
                    $this->progressionService(),
                    $this->stateService()
                ),
                new CompleteStorylineChoiceAction(
                    $this->contentRepository(),
                    $this->gameRepository(),
                    $this->rules(),
                    $this->progressionService(),
                    $this->stateService()
                ),
                new UseSuperLikeAction(
                    $this->contentRepository(),
                    $this->gameRepository(),
                    $this->rules(),
                    $this->progressionService(),
                    $this->stateService()
                ),
                new CreateConflictAction(
                    $this->contentRepository(),
                    $this->gameRepository(),
                    $this->rules(),
                    $this->progressionService(),
                    $this->stateService()
                ),
                new ResolveConflictAction(
                    $this->gameRepository(),
                    $this->rules(),
                    $this->progressionService(),
                    $this->stateService()
                ),
                new RefreshMoodsAction(
                    $this->contentRepository(),
                    $this->gameRepository(),
                    $this->rules(),
                    $this->progressionService(),
                    $this->stateService()
                )
            ),
            default => throw new RuntimeException('Unknown class ' . $class),
        };
    }

    private function contentRepository(): ContentRepository
    {
        if ($this->contentRepository instanceof ContentRepository) {
            return $this->contentRepository;
        }

        $this->contentRepository = new ContentRepository($this->db());
        return $this->contentRepository;
    }

    private function gameRepository(): GameRepository
    {
        if ($this->gameRepository instanceof GameRepository) {
            return $this->gameRepository;
        }

        $this->gameRepository = new GameRepository($this->db());
        return $this->gameRepository;
    }

    private function rules(): GameRulesService
    {
        if ($this->rules instanceof GameRulesService) {
            return $this->rules;
        }

        $this->rules = new GameRulesService();
        return $this->rules;
    }

    private function progressionService(): ProgressionService
    {
        if ($this->progressionService instanceof ProgressionService) {
            return $this->progressionService;
        }

        $this->progressionService = new ProgressionService(
            $this->contentRepository(),
            $this->gameRepository(),
            $this->rules()
        );
        return $this->progressionService;
    }

    private function stateService(): GameStateService
    {
        if ($this->stateService instanceof GameStateService) {
            return $this->stateService;
        }

        $this->stateService = new GameStateService(
            $this->contentRepository(),
            $this->gameRepository(),
            $this->rules()
        );
        return $this->stateService;
    }

    private function db(): PDO
    {
        if ($this->db instanceof PDO) {
            return $this->db;
        }

        $this->db = Database::getConnection();
        return $this->db;
    }
}
