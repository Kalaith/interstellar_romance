<?php

declare(strict_types=1);

use App\Controllers\ContentController;
use App\Controllers\AuthController;
use App\Controllers\GameController;
use App\Controllers\SystemController;
use App\Middleware\WebHatcheryJwtMiddleware;

return static function (\App\Core\Router $router): void {
    $auth = [WebHatcheryJwtMiddleware::class];

    $router->get('/api/health', [SystemController::class, 'health']);
    $router->get('/api/auth/login-info', [AuthController::class, 'loginInfo']);
    $router->post('/api/auth/guest-session', [AuthController::class, 'guestSession']);
    $router->post('/api/auth/link-guest', [AuthController::class, 'linkGuest'], $auth);
    $router->get('/api/content/bootstrap', [ContentController::class, 'bootstrap'], $auth);

    $router->get('/api/game', [GameController::class, 'current'], $auth);
    $router->post('/api/game/start', [GameController::class, 'start'], $auth);
    $router->post('/api/character/select', [GameController::class, 'selectCharacter'], $auth);
    $router->post('/api/dialogue/choose', [GameController::class, 'chooseDialogue'], $auth);
    $router->post('/api/date/complete', [GameController::class, 'completeDate'], $auth);
    $router->post('/api/week/activities', [GameController::class, 'completeActivities'], $auth);
    $router->post('/api/self-improvement', [GameController::class, 'completeSelfImprovement'], $auth);
    $router->post('/api/storyline/choice', [GameController::class, 'completeStorylineChoice'], $auth);
    $router->post('/api/super-like', [GameController::class, 'useSuperLike'], $auth);
    $router->post('/api/conflict/create', [GameController::class, 'createConflict'], $auth);
    $router->post('/api/conflict/resolve', [GameController::class, 'resolveConflict'], $auth);
    $router->post('/api/moods/refresh', [GameController::class, 'refreshMoods'], $auth);
};
