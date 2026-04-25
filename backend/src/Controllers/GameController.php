<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Actions\ChooseDialogueAction;
use App\Actions\CompleteActivitiesAction;
use App\Actions\CompleteDateAction;
use App\Actions\CompleteSelfImprovementAction;
use App\Actions\CompleteStorylineChoiceAction;
use App\Actions\CreateConflictAction;
use App\Actions\LoadGameAction;
use App\Actions\RefreshMoodsAction;
use App\Actions\ResolveConflictAction;
use App\Actions\SelectCharacterAction;
use App\Actions\StartGameAction;
use App\Actions\UseSuperLikeAction;
use App\Core\Request;
use App\Core\Response;
use App\Models\AuthUser;

final class GameController
{
    public function __construct(
        private readonly LoadGameAction $loadGameAction,
        private readonly StartGameAction $startGameAction,
        private readonly SelectCharacterAction $selectCharacterAction,
        private readonly ChooseDialogueAction $chooseDialogueAction,
        private readonly CompleteDateAction $completeDateAction,
        private readonly CompleteActivitiesAction $completeActivitiesAction,
        private readonly CompleteSelfImprovementAction $completeSelfImprovementAction,
        private readonly CompleteStorylineChoiceAction $completeStorylineChoiceAction,
        private readonly UseSuperLikeAction $useSuperLikeAction,
        private readonly CreateConflictAction $createConflictAction,
        private readonly ResolveConflictAction $resolveConflictAction,
        private readonly RefreshMoodsAction $refreshMoodsAction
    ) {
    }

    public function current(Request $request, Response $response): void
    {
        $response->success($this->loadGameAction->execute($this->user($request)));
    }

    public function start(Request $request, Response $response): void
    {
        $response->success($this->startGameAction->execute($this->user($request), $request->getBody()));
    }

    public function selectCharacter(Request $request, Response $response): void
    {
        $response->success($this->selectCharacterAction->execute($this->user($request), $request->getBody()));
    }

    public function chooseDialogue(Request $request, Response $response): void
    {
        $response->success($this->chooseDialogueAction->execute($this->user($request), $request->getBody()));
    }

    public function completeDate(Request $request, Response $response): void
    {
        $response->success($this->completeDateAction->execute($this->user($request), $request->getBody()));
    }

    public function completeActivities(Request $request, Response $response): void
    {
        $response->success($this->completeActivitiesAction->execute($this->user($request), $request->getBody()));
    }

    public function completeSelfImprovement(Request $request, Response $response): void
    {
        $response->success($this->completeSelfImprovementAction->execute($this->user($request), $request->getBody()));
    }

    public function completeStorylineChoice(Request $request, Response $response): void
    {
        $response->success(
            $this->completeStorylineChoiceAction->execute($this->user($request), $request->getBody())
        );
    }

    public function useSuperLike(Request $request, Response $response): void
    {
        $response->success($this->useSuperLikeAction->execute($this->user($request), $request->getBody()));
    }

    public function createConflict(Request $request, Response $response): void
    {
        $response->success($this->createConflictAction->execute($this->user($request), $request->getBody()));
    }

    public function resolveConflict(Request $request, Response $response): void
    {
        $response->success($this->resolveConflictAction->execute($this->user($request), $request->getBody()));
    }

    public function refreshMoods(Request $request, Response $response): void
    {
        $response->success($this->refreshMoodsAction->execute($this->user($request)));
    }

    private function user(Request $request): AuthUser
    {
        return AuthUser::fromArray($request->getAttribute('auth_user', []));
    }
}
