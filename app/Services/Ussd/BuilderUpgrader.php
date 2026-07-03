<?php

namespace App\Services\Ussd;

/**
 * Pure transformer: splits a legacy USSD builder into (a) a lean canonical
 * schema_version:2 builder containing only service-definition data, and
 * (b) a version settings array holding the relocated simulator/timeout/
 * appearance/UI config.
 *
 * Stateless and side-effect free (no DB, no cache) so it is unit-testable and
 * reusable by CI/CD. See docs/performance/02_BREAKING_JSON_STRUCTURE_FIXES.md
 * and 03_JSON_COMPATIBILITY_MIGRATION.md.
 */
class BuilderUpgrader
{
    const TARGET_SCHEMA_VERSION = 2;
    const SETTINGS_SCHEMA_VERSION = 1;

    /** Per-element builder-UI keys relocated into settings.builder_ui[<id>]. */
    const UI_ELEMENT_KEYS = ['hexColor', 'comment'];

    /**
     * @return array{builder: array, settings: array, changed: bool}
     */
    public function upgrade(array $builder, ?array $existingSettings = null, bool $force = false): array
    {
        // Idempotency — already canonical. A builder is only "done" when it is
        // schema_version:2 AND actually slimmed. repairBuilder() stamps v2 on
        // every legacy save (VersionObserver) while leaving simulator/color_scheme
        // in place, so a plain "schema_version >= 2" check would wrongly skip a
        // stamped-but-unslimmed builder. Require it to be slimmed too.
        if (! $force && $this->isCanonical($builder)) {
            return ['builder' => $builder, 'settings' => $existingSettings ?? [], 'changed' => false];
        }

        $settings = $existingSettings ?? $this->settingsTemplate();

        // ---- P5: timeouts (preserve values — engine uses them for real sessions) ----
        $sim = $builder['simulator'] ?? [];
        $settings['session']['timeout_limit_in_seconds'] =
            $sim['settings']['timeout_limit_in_seconds'] ?? $settings['session']['timeout_limit_in_seconds'];
        $settings['session']['allow_timeouts'] =
            $sim['settings']['allow_timeouts'] ?? $settings['session']['allow_timeouts'];
        $settings['session']['timeout_message'] =
            $sim['settings']['timeout_message'] ?? $settings['session']['timeout_message'];

        // ---- P4: simulator/test config ----
        if (isset($sim['subscriber'])) { $settings['simulator']['subscriber'] = $sim['subscriber']; }
        if (isset($sim['debugger']))   { $settings['simulator']['debugger']   = $sim['debugger']; }

        // ---- P3: appearance (top-level color_scheme) ----
        if (array_key_exists('color_scheme', $builder)) {
            $settings['appearance']['color_scheme'] = $builder['color_scheme'];
        }

        // ---- P3: per-element hexColor/comment -> settings.builder_ui[<id>] ----
        $builderUi = [];
        $this->collectElementUi($builder, $builderUi);
        if (! empty($builderUi)) {
            // Merge over any pre-existing builder_ui so a re-run does not lose ids.
            $settings['builder_ui'] = array_merge($settings['builder_ui'] ?? [], $builderUi);
        }

        // ---- Now slim the builder ----
        unset($builder['simulator']);                    // P6
        unset($builder['color_scheme']);                 // P3
        $builder = $this->stripElementUiKeys($builder);  // P3 (hexColor/comment recursively)

        if (isset($builder['screens']) && is_array($builder['screens'])) {
            foreach ($builder['screens'] as $sKey => $screen) {
                if (isset($screen['displays']) && is_array($screen['displays'])) {
                    foreach ($screen['displays'] as $dKey => $display) {
                        $builder['screens'][$sKey]['displays'][$dKey] =
                            $this->normalizePagination($display);          // P7
                    }
                }
            }
        }

        $builder = $this->compactValueStructures($builder);       // P8
        $builder['schema_version'] = self::TARGET_SCHEMA_VERSION;  // P1

        return ['builder' => $builder, 'settings' => $settings, 'changed' => true];
    }

    /**
     * Is this builder already fully converted? Only true when it is stamped
     * schema_version:2 AND no longer carries any relocatable key. Used both by
     * upgrade() (idempotency) and the command (skip decision).
     */
    public function isCanonical(array $builder): bool
    {
        return (($builder['schema_version'] ?? 0) >= self::TARGET_SCHEMA_VERSION)
            && ! array_key_exists('simulator', $builder)
            && ! array_key_exists('color_scheme', $builder)
            && ! $this->containsKeyDeep($builder, 'hexColor')
            && ! $this->containsKeyDeep($builder, 'comment');
    }

    private function settingsTemplate(): array
    {
        return [
            'schema_version' => self::SETTINGS_SCHEMA_VERSION,
            'simulator' => [
                'subscriber' => ['phone_number' => ''],
                'debugger'   => ['return_logs' => false, 'return_summarized_logs' => false],
            ],
            'session' => [
                'timeout_limit_in_seconds' => 120,
                'allow_timeouts'           => false,
                'timeout_message'          => '',
            ],
            'appearance' => ['color_scheme' => null],
            'builder_ui' => [],
        ];
    }

    /** Walk the tree; for any element carrying an 'id' plus hexColor/comment, record them by id. */
    private function collectElementUi($node, array &$acc): void
    {
        if (! is_array($node)) { return; }

        $hasId = isset($node['id']) && (is_string($node['id']) || is_int($node['id']));
        $ui = [];
        foreach (self::UI_ELEMENT_KEYS as $k) {
            if (array_key_exists($k, $node)) { $ui[$k] = $node[$k]; }
        }
        if ($hasId && ! empty($ui)) {
            $acc[(string) $node['id']] = array_merge($acc[(string) $node['id']] ?? [], $ui);
        }

        foreach ($node as $v) {
            if (is_array($v)) { $this->collectElementUi($v, $acc); }
        }
    }

    /** P3 — remove hexColor/comment everywhere; never descend the 'simulator' key. */
    private function stripElementUiKeys(array $node): array
    {
        foreach (self::UI_ELEMENT_KEYS as $k) { unset($node[$k]); }
        foreach ($node as $key => $value) {
            if ($key === 'simulator') { continue; }
            if (is_array($value)) { $node[$key] = $this->stripElementUiKeys($value); }
        }
        return $node;
    }

    /** P7 — reduce pagination to the flag when global pagination is used. */
    private function normalizePagination(array $display): array
    {
        $pg = $display['content']['pagination'] ?? null;
        if (is_array($pg) && (($pg['use_global_pagination'] ?? null) === true)) {
            $display['content']['pagination'] = ['use_global_pagination' => true];
        }
        return $display;
    }

    /** P8 — compact empty non-code ValueStructures; preserve code_editor_mode=true verbatim. */
    private function compactValueStructures($node)
    {
        if (! is_array($node)) { return $node; }

        if (array_key_exists('code_editor_text', $node) && array_key_exists('code_editor_mode', $node)) {
            $mode = $node['code_editor_mode'] ?? false;
            $code = $node['code_editor_text'] ?? '';
            if ($mode !== true && ($code === '' || $code === null)) {
                unset($node['code_editor_text'], $node['code_editor_mode']);
            }
        }
        foreach ($node as $key => $value) {
            if (is_array($value)) { $node[$key] = $this->compactValueStructures($value); }
        }
        return $node;
    }

    /** Validate invariants between legacy input and produced output. Returns violation strings. */
    public function validate(array $legacyBuilder, array $newBuilder, array $newSettings): array
    {
        $e = [];
        $sim = $legacyBuilder['simulator'] ?? [];

        if ($this->countScreens($legacyBuilder) !== $this->countScreens($newBuilder)) { $e[] = 'Screen count changed'; }
        if ($this->countDisplays($legacyBuilder) !== $this->countDisplays($newBuilder)) { $e[] = 'Display count changed'; }

        // code-mode ValueStructures preserved
        $a = $this->collectCodeTexts($legacyBuilder); $b = $this->collectCodeTexts($newBuilder);
        sort($a); sort($b);
        if ($a !== $b) { $e[] = 'A code_editor_mode=true ValueStructure changed/lost'; }

        // custom pagination preserved
        if ($this->countCustomPagination($legacyBuilder) !== $this->countCustomPagination($newBuilder)) {
            $e[] = 'A use_global_pagination=false display lost its custom pagination';
        }

        // timeout values preserved into settings (only assert when legacy had them)
        if (isset($sim['settings']['timeout_limit_in_seconds'])
            && (int) $newSettings['session']['timeout_limit_in_seconds'] !== (int) $sim['settings']['timeout_limit_in_seconds']) {
            $e[] = 'timeout_limit_in_seconds not preserved into settings';
        }
        if (isset($sim['settings']['timeout_message'])
            && (string) $newSettings['session']['timeout_message'] !== (string) $sim['settings']['timeout_message']) {
            $e[] = 'timeout_message not preserved into settings';
        }

        // simulator subscriber/debugger preserved
        if (isset($sim['subscriber']) && ($newSettings['simulator']['subscriber'] ?? null) != $sim['subscriber']) {
            $e[] = 'simulator.subscriber not preserved into settings';
        }
        if (isset($sim['debugger']) && ($newSettings['simulator']['debugger'] ?? null) != $sim['debugger']) {
            $e[] = 'simulator.debugger not preserved into settings';
        }

        // builder fully cleaned. NOTE: only the TOP-LEVEL relocated `simulator` is
        // removed; `log_settings.simulator` is a distinct runtime key that File 02
        // deliberately keeps, so this must be a top-level check, not containsKeyDeep.
        if (array_key_exists('simulator', $newBuilder))          { $e[] = 'builder still contains simulator'; }
        if (array_key_exists('color_scheme', $newBuilder))       { $e[] = 'builder still contains color_scheme'; }
        if ($this->containsKeyDeep($newBuilder, 'hexColor'))     { $e[] = 'builder still contains hexColor'; }
        if ($this->containsKeyDeep($newBuilder, 'comment'))      { $e[] = 'builder still contains comment'; }

        if (json_encode($newBuilder) === false || json_encode($newSettings) === false) {
            $e[] = 'Result not JSON-encodable: ' . json_last_error_msg();
        }

        return $e;
    }

    private function countScreens(array $b): int { return is_array($b['screens'] ?? null) ? count($b['screens']) : 0; }
    private function countDisplays(array $b): int
    {
        $n = 0; foreach (($b['screens'] ?? []) as $s) { $n += is_array($s['displays'] ?? null) ? count($s['displays']) : 0; } return $n;
    }
    private function collectCodeTexts($node, array &$acc = []): array
    {
        if (is_array($node)) {
            if (($node['code_editor_mode'] ?? null) === true) { $acc[] = (string) ($node['code_editor_text'] ?? ''); }
            foreach ($node as $v) { if (is_array($v)) { $this->collectCodeTexts($v, $acc); } }
        }
        return $acc;
    }
    private function countCustomPagination(array $b): int
    {
        $n = 0;
        foreach (($b['screens'] ?? []) as $s) {
            foreach (($s['displays'] ?? []) as $d) {
                $pg = $d['content']['pagination'] ?? null;
                if (is_array($pg) && (($pg['use_global_pagination'] ?? null) === false)) { $n++; }
            }
        }
        return $n;
    }
    private function containsKeyDeep($node, string $key): bool
    {
        if (! is_array($node)) { return false; }
        if (array_key_exists($key, $node)) { return true; }
        foreach ($node as $v) { if (is_array($v) && $this->containsKeyDeep($v, $key)) { return true; } }
        return false;
    }
}
