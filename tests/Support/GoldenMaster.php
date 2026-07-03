<?php

namespace Tests\Support;

/**
 * Minimal golden-master (a.k.a. snapshot / approval) assertion.
 *
 * Records the engine's output for a fixed input the FIRST time it runs (the
 * baseline), then on every later run asserts the output is byte-identical. This
 * is the core behaviour-preservation guarantee for files 01 and 02: every
 * optimisation in those files is supposed to change speed, not output — so these
 * snapshots must stay green through all of them (including the session-state
 * fast path and the builder-JSON relocation).
 *
 * Regenerate intentionally (e.g. after a deliberate, reviewed behaviour change):
 *     UPDATE_GOLDEN=1 vendor/bin/phpunit --group golden
 * A missing snapshot is written and the test is marked incomplete so a brand-new
 * baseline can never silently "pass".
 */
trait GoldenMaster
{
    protected function goldenDir(): string
    {
        return __DIR__.'/../Fixtures/golden';
    }

    protected function assertMatchesGolden(string $name, mixed $data): void
    {
        $path = $this->goldenDir().'/'.$name.'.json';
        $encoded = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        $updating = filter_var(getenv('UPDATE_GOLDEN'), FILTER_VALIDATE_BOOL);

        if ($updating || ! file_exists($path)) {
            if (! is_dir($this->goldenDir())) {
                mkdir($this->goldenDir(), 0777, true);
            }
            file_put_contents($path, $encoded."\n");

            if (! $updating) {
                $this->markTestIncomplete("Golden baseline created: {$name}.json. Re-run to lock it in.");
            }

            return;
        }

        $expected = rtrim(file_get_contents($path));
        $this->assertSame(
            $expected,
            $encoded,
            "Engine output diverged from golden snapshot '{$name}'. If this change is intentional, "
            ."review the diff and regenerate with UPDATE_GOLDEN=1."
        );
    }
}
