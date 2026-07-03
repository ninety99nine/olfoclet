<?php

namespace Tests\Support;

use App\Services\Ussd\UssdService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Support for "target" tests — tests that describe the state the codebase should
 * be in AFTER a specific fix from files 01/02/03 lands.
 *
 * Each target test begins by detecting a cheap STRUCTURAL MARKER of its fix
 * (a new column, index, method, config value, command, cast...). If the marker
 * is absent the fix hasn't been implemented yet, so the test is skipped with a
 * clear "pending <ref>" message. The moment the fix lands, the marker appears,
 * the test activates automatically and must pass.
 *
 * This keeps the whole suite green TODAY (regression tests pass, target tests
 * skip) while giving each fix a precise, executable acceptance criterion for
 * tomorrow.
 */
trait PendingUntilImplemented
{
    protected function pendingUnless(bool $implemented, string $ref): void
    {
        if (! $implemented) {
            $this->markTestSkipped("Pending {$ref} — not yet implemented.");
        }
    }

    // ---- structural markers -------------------------------------------------

    protected function tableHasIndexOnColumns(string $table, array $columns): bool
    {
        $database = DB::connection()->getDatabaseName();
        $rows = DB::select(
            'SELECT INDEX_NAME, COLUMN_NAME, SEQ_IN_INDEX
               FROM information_schema.STATISTICS
              WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
              ORDER BY INDEX_NAME, SEQ_IN_INDEX',
            [$database, $table]
        );

        $byIndex = [];
        foreach ($rows as $row) {
            $byIndex[$row->INDEX_NAME][] = $row->COLUMN_NAME;
        }

        foreach ($byIndex as $cols) {
            if (array_slice($cols, 0, count($columns)) === $columns) {
                return true;
            }
        }

        return false;
    }

    protected function columnExists(string $table, string $column): bool
    {
        return Schema::hasColumn($table, $column);
    }

    protected function serviceMethodExists(string $method): bool
    {
        return method_exists(UssdService::class, $method);
    }

    protected function artisanCommandExists(string $signature): bool
    {
        return array_key_exists($signature, \Illuminate\Support\Facades\Artisan::all());
    }

    /** Read a protected property off a model/instance (e.g. $with, $appends). */
    protected function protectedProp(object $object, string $prop): mixed
    {
        $p = (new \ReflectionClass($object))->getProperty($prop);
        $p->setAccessible(true);

        return $p->getValue($object);
    }
}
