<?php

declare(strict_types=1);

namespace App\Core;

use PDO;
use RuntimeException;

final class Database
{
    private static ?PDO $connection = null;

    public static function getConnection(): PDO
    {
        if (self::$connection instanceof PDO) {
            return self::$connection;
        }

        $host = self::required('DB_HOST');
        $port = self::required('DB_PORT');
        $name = self::required('DB_NAME');
        $user = self::required('DB_USERNAME');
        $password = $_ENV['DB_PASSWORD'] ?? '';

        $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $host, $port, $name);
        self::$connection = new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        return self::$connection;
    }

    private static function required(string $key): string
    {
        $value = $_ENV[$key] ?? '';
        if (!is_string($value) || trim($value) === '') {
            throw new RuntimeException('Missing required environment variable: ' . $key);
        }

        return $value;
    }
}
