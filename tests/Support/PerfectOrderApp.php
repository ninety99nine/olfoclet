<?php

namespace Tests\Support;

use App\Models\App;
use App\Models\Project;
use App\Models\SharedShortCode;
use App\Models\ShortCode;
use App\Models\Version;

/**
 * Stands up the real "Perfect Order App" (production *250#, version 1.00) as a
 * runnable app graph in the test database, so the USSD engine can be driven
 * end-to-end for behaviour-preservation (golden-master) gating.
 *
 * The builder JSON is the exact production export
 * (tests/Fixtures/perfect-order-app-v1-builder.json): 36 screens, 407 mustache
 * tags, 81 custom-code blocks. This is a SECOND live MNO service (alongside the
 * First-Aid *217# app) — any engine optimisation must leave both byte-identical.
 *
 * Creating the Version goes through the VersionObserver (repairBuilder +
 * findAndCache) exactly as production does, so the engine sees the same builder
 * it would serve live.
 *
 * @see FirstAidApp — the sibling fixture this mirrors.
 */
class PerfectOrderApp
{
    public Project $project;
    public App $app;
    public Version $version;
    public ShortCode $shortCode;
    public SharedShortCode $sharedShortCode;

    /** Default MSISDN — matches the fixture's simulator.subscriber.phone_number. */
    public string $msisdn = '26772882239';

    /** Shared/dedicated codes taken from the production app (shared *100#). */
    public string $sharedCode = '*100*1#';
    public string $dedicatedCode = '*250#';

    public static function fixturePath(): string
    {
        return __DIR__.'/../Fixtures/perfect-order-app-v1-builder.json';
    }

    /** The RAW production builder (before repairBuilder). */
    public static function rawBuilder(): array
    {
        return json_decode(file_get_contents(self::fixturePath()), true);
    }

    public static function create(): self
    {
        $instance = new self();

        $instance->project = Project::create([
            'name' => 'Perfect Order Project',
            'confirmation_code' => 'POAPRJ',
        ]);

        // Create the app first (active_version_id filled in after the version exists).
        $instance->app = App::create([
            'name' => 'Perfect Order App',
            'description' => 'Perfect Order USSD service (test harness fixture)',
            'online' => true,
            'project_id' => $instance->project->id,
            'confirmation_code' => 'POAAPP',
        ]);

        // Real production builder, saved through the observer (repair + cache).
        $instance->version = new Version();
        $instance->version->number = 1.00;
        $instance->version->description = 'Perfect Order App v1.00 (production export)';
        $instance->version->app_id = $instance->app->id;
        $instance->version->builder = self::rawBuilder();
        $instance->version->save();

        $instance->app->active_version_id = $instance->version->id;
        $instance->app->save();

        // The ShortCodeObserver regenerates `shared_code` from the parent
        // SharedShortCode on creation, so the base code must exist first.
        $instance->sharedShortCode = SharedShortCode::create(['code' => '*100#']);

        $instance->shortCode = ShortCode::create([
            'shared_short_code_id' => $instance->sharedShortCode->id,
            'dedicated_code' => $instance->dedicatedCode,
            'app_id' => $instance->app->id,
        ]);

        // Reflect the observer-generated shared code back onto the instance.
        $instance->shortCode->refresh();
        $instance->sharedCode = $instance->shortCode->shared_code;

        return $instance;
    }
}
