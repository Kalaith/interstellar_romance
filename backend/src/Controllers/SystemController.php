<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;

final class SystemController
{
    public function health(Request $request, Response $response): void
    {
        $response->success([
            'service' => 'interstellar-romance-backend',
            'status' => 'ok',
            'server_authoritative' => true,
        ]);
    }
}
