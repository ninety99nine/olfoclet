<?php

namespace Tests\Unit\Ussd;

use PHPUnit\Framework\TestCase;

/**
 * Executable spec for 03_JSON_COMPATIBILITY_MIGRATION.md — the pure, stateless
 * App\Services\Ussd\BuilderUpgrader transformer that splits a legacy builder into
 * (a) a lean schema_version:2 builder and (b) an extracted versions.settings array.
 *
 * The class does not exist yet, so every test skips until it does (class_exists
 * marker) and then must pass. Contract per the doc:
 *   upgrade(array $builder, ?array $existingSettings=null): array{builder,settings,changed}
 *   validate(array $legacy, array $newBuilder, array $newSettings): string[]  (violations)
 *   const TARGET_SCHEMA_VERSION = 2
 *
 * @group target
 * @group file03
 */
class BuilderUpgraderTest extends TestCase
{
    private const CLASS_NAME = 'App\\Services\\Ussd\\BuilderUpgrader';

    private function upgrader(): object
    {
        if (! class_exists(self::CLASS_NAME)) {
            $this->markTestSkipped('Pending File 03 — BuilderUpgrader not yet implemented.');
        }

        $class = self::CLASS_NAME;

        return new $class();
    }

    /** A small but representative legacy builder covering every transform. */
    private function legacyBuilder(): array
    {
        return [
            // no schema_version → legacy
            'simulator' => [
                'settings' => [
                    'timeout_limit_in_seconds' => 90,
                    'allow_timeouts' => true,
                    'timeout_message' => 'Session ended',
                ],
                'subscriber' => ['phone_number' => '26770000000'],
                'debugger' => ['return_logs' => true, 'return_summarized_logs' => false],
            ],
            'color_scheme' => ['rest_api' => '#123456'],
            'global_pagination' => ['per_page' => 3, 'show_page_numbers' => true],
            'application_events' => ['on_start' => ['collection' => []]],
            'global_variables' => [],
            'markers' => [],
            'log_settings' => ['mobile' => ['save_logs' => 'never']],
            'screens' => [
                [
                    'id' => 'screen_1', 'name' => 'Home', 'hexColor' => '#111111', 'comment' => 'entry screen',
                    'displays' => [
                        [
                            'id' => 'display_1', 'hexColor' => '#222222', 'comment' => 'greeting',
                            'content' => ['pagination' => ['use_global_pagination' => true, 'per_page' => 9, 'show_page_numbers' => false]],
                            'instruction' => ['text' => 'Welcome', 'code_editor_text' => '', 'code_editor_mode' => false],
                        ],
                        [
                            'id' => 'display_2',
                            'content' => ['pagination' => ['use_global_pagination' => false, 'per_page' => 5]],
                            'value' => ['text' => '', 'code_editor_text' => "return \$user['name'];", 'code_editor_mode' => true],
                        ],
                    ],
                ],
            ],
        ];
    }

    private function upgrade(array $builder, ?array $settings = null): array
    {
        return $this->upgrader()->upgrade($builder, $settings);
    }

    // ---- schema versioning + idempotency ------------------------------------

    public function test_it_stamps_schema_version_2_and_is_idempotent(): void
    {
        $result = $this->upgrade($this->legacyBuilder());

        $this->assertSame(2, $result['builder']['schema_version']);
        $this->assertTrue($result['changed']);

        // Re-running on an already-upgraded builder changes nothing.
        $again = $this->upgrade($result['builder'], $result['settings']);
        $this->assertFalse($again['changed']);
        $this->assertSame($result['builder'], $again['builder']);
    }

    // ---- builder is cleaned -------------------------------------------------

    public function test_it_removes_simulator_color_scheme_hexcolor_and_comment_from_builder(): void
    {
        $b = $this->upgrade($this->legacyBuilder())['builder'];

        $this->assertArrayNotHasKey('simulator', $b);
        $this->assertArrayNotHasKey('color_scheme', $b);
        $this->assertFalse($this->hasKeyDeep($b, 'hexColor'));
        $this->assertFalse($this->hasKeyDeep($b, 'comment'));
    }

    // ---- values are preserved into settings ---------------------------------

    public function test_it_preserves_timeout_values_into_settings_session(): void
    {
        $s = $this->upgrade($this->legacyBuilder())['settings'];

        $this->assertSame(90, $s['session']['timeout_limit_in_seconds']);
        $this->assertTrue($s['session']['allow_timeouts']);
        $this->assertSame('Session ended', $s['session']['timeout_message']);
    }

    public function test_it_relocates_simulator_subscriber_and_debugger_into_settings(): void
    {
        $s = $this->upgrade($this->legacyBuilder())['settings'];

        $this->assertSame('26770000000', $s['simulator']['subscriber']['phone_number']);
        $this->assertTrue($s['simulator']['debugger']['return_logs']);
        $this->assertFalse($s['simulator']['debugger']['return_summarized_logs']);
    }

    public function test_it_relocates_appearance_and_per_element_ui_into_settings(): void
    {
        $s = $this->upgrade($this->legacyBuilder())['settings'];

        $this->assertSame(['rest_api' => '#123456'], $s['appearance']['color_scheme']);
        $this->assertSame('#111111', $s['builder_ui']['screen_1']['hexColor']);
        $this->assertSame('entry screen', $s['builder_ui']['screen_1']['comment']);
        $this->assertSame('#222222', $s['builder_ui']['display_1']['hexColor']);
    }

    // ---- pagination + ValueStructures ---------------------------------------

    public function test_it_normalises_global_pagination_but_keeps_custom_pagination(): void
    {
        $b = $this->upgrade($this->legacyBuilder())['builder'];
        $displays = $b['screens'][0]['displays'];

        // Global-pagination display reduced to just the flag.
        $this->assertSame(['use_global_pagination' => true], $displays[0]['content']['pagination']);

        // Custom pagination preserved verbatim.
        $this->assertSame(['use_global_pagination' => false, 'per_page' => 5], $displays[1]['content']['pagination']);
    }

    public function test_it_compacts_empty_value_structures_but_keeps_code_mode(): void
    {
        $b = $this->upgrade($this->legacyBuilder())['builder'];
        $displays = $b['screens'][0]['displays'];

        // Empty, non-code ValueStructure: the two keys are dropped.
        $this->assertArrayNotHasKey('code_editor_text', $displays[0]['instruction']);
        $this->assertArrayNotHasKey('code_editor_mode', $displays[0]['instruction']);
        $this->assertSame('Welcome', $displays[0]['instruction']['text']);

        // code_editor_mode === true: preserved verbatim.
        $this->assertTrue($displays[1]['value']['code_editor_mode']);
        $this->assertSame("return \$user['name'];", $displays[1]['value']['code_editor_text']);
    }

    // ---- topology is untouched ----------------------------------------------

    public function test_it_leaves_screen_and_display_topology_unchanged(): void
    {
        $legacy = $this->legacyBuilder();
        $b = $this->upgrade($legacy)['builder'];

        $this->assertCount(count($legacy['screens']), $b['screens']);
        $this->assertCount(
            count($legacy['screens'][0]['displays']),
            $b['screens'][0]['displays']
        );
        $this->assertSame(['on_start' => ['collection' => []]], $b['application_events']);
    }

    // ---- validate() ---------------------------------------------------------

    public function test_validate_passes_for_a_correct_upgrade(): void
    {
        $legacy = $this->legacyBuilder();
        $result = $this->upgrade($legacy);

        $violations = $this->upgrader()->validate($legacy, $result['builder'], $result['settings']);
        $this->assertSame([], $violations, 'A correct upgrade must report no violations.');
    }

    public function test_validate_flags_a_broken_upgrade(): void
    {
        $legacy = $this->legacyBuilder();
        $result = $this->upgrade($legacy);

        // Corrupt the output: drop a screen.
        $broken = $result['builder'];
        array_pop($broken['screens']);

        $violations = $this->upgrader()->validate($legacy, $broken, $result['settings']);
        $this->assertNotEmpty($violations, 'validate() must flag a changed screen count.');
    }

    // ---- golden invariants on the real First-Aid builder --------------------

    public function test_golden_first_aid_builder_upgrades_within_documented_invariants(): void
    {
        $legacy = json_decode(file_get_contents(__DIR__.'/../../Fixtures/first-aid-app-v4-builder.json'), true);
        $result = $this->upgrade($legacy);
        $b = $result['builder'];
        $s = $result['settings'];

        // Topology unchanged (19 screens, 35 displays).
        $this->assertCount(19, $b['screens']);
        $displays = 0;
        foreach ($b['screens'] as $screen) {
            $displays += count($screen['displays'] ?? []);
        }
        $this->assertSame(35, $displays);

        // Builder fully cleaned.
        $this->assertArrayNotHasKey('simulator', $b);
        $this->assertArrayNotHasKey('color_scheme', $b);
        $this->assertFalse($this->hasKeyDeep($b, 'hexColor'));
        $this->assertFalse($this->hasKeyDeep($b, 'comment'));

        // The 55 code-mode ValueStructures survive; the 998 empty ones are compacted.
        $this->assertSame(55, $this->countCodeModeValueStructures($b));
        $this->assertSame(0, $this->countEmptyValueStructures($b), 'All empty ValueStructures should be compacted.');

        // Real-session-critical values preserved.
        $this->assertSame(120, $s['session']['timeout_limit_in_seconds']);
        $this->assertSame('26778705094', $s['simulator']['subscriber']['phone_number']);
    }

    // ---- local recursive helpers (independent of the class under test) ------

    private function hasKeyDeep($node, string $key): bool
    {
        if (! is_array($node)) {
            return false;
        }
        if (array_key_exists($key, $node)) {
            return true;
        }
        foreach ($node as $v) {
            if (is_array($v) && $this->hasKeyDeep($v, $key)) {
                return true;
            }
        }

        return false;
    }

    private function countCodeModeValueStructures($node): int
    {
        $n = 0;
        if (is_array($node)) {
            if (($node['code_editor_mode'] ?? null) === true) {
                $n++;
            }
            foreach ($node as $v) {
                if (is_array($v)) {
                    $n += $this->countCodeModeValueStructures($v);
                }
            }
        }

        return $n;
    }

    private function countEmptyValueStructures($node): int
    {
        $n = 0;
        if (is_array($node)) {
            if (array_key_exists('code_editor_text', $node) && array_key_exists('code_editor_mode', $node)
                && ($node['code_editor_mode'] ?? false) !== true
                && (($node['code_editor_text'] ?? '') === '' || ($node['code_editor_text'] ?? null) === null)) {
                $n++;
            }
            foreach ($node as $v) {
                if (is_array($v)) {
                    $n += $this->countEmptyValueStructures($v);
                }
            }
        }

        return $n;
    }
}
