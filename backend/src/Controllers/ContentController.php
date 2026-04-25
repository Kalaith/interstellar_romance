<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Actions\GetContentAction;
use App\Core\Request;
use App\Core\Response;

final class ContentController
{
    public function __construct(private readonly GetContentAction $getContentAction)
    {
    }

    public function bootstrap(Request $request, Response $response): void
    {
        $response->success($this->getContentAction->execute());
    }
}
