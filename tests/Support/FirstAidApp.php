<?php

namespace Tests\Support;

use App\Models\App;
use App\Models\Project;
use App\Models\SharedShortCode;
use App\Models\ShortCode;
use App\Models\Version;

/**
 * Stands up the real "First-Aid App" (production version 4) as a runnable app
 * graph in the test database, so the USSD engine can be driven end-to-end.
 *
 * The builder JSON is the exact production export
 * (tests/Fixtures/first-aid-app-v4-builder.json): 19 screens, 35 displays,
 * on-start REST events (Get User / Create User), timeouts and simulator config.
 *
 * Creating the Version goes through the VersionObserver (repairBuilder +
 * findAndCache) exactly as production does, so the engine sees the same builder
 * it would serve live.
 */
class FirstAidApp
{
    public Project $project;
    public App $app;
    public Version $version;
    public ShortCode $shortCode;
    public SharedShortCode $sharedShortCode;

    /** Default MSISDN — matches the fixture's simulator.subscriber.phone_number. */
    public string $msisdn = '26778705094';

    /** Shared/dedicated codes taken from the production short_codes row (app_id 2). */
    public string $sharedCode = '*100*2#';
    public string $dedicatedCode = '*217#';

    public static function fixturePath(): string
    {
        return __DIR__.'/../Fixtures/first-aid-app-v4-builder.json';
    }

    /** The RAW production builder (before repairBuilder), for File 3 upgrader tests. */
    public static function rawBuilder(): array
    {
        return json_decode(file_get_contents(self::fixturePath()), true);
    }

    public static function create(): self
    {
        $instance = new self();

        $instance->project = Project::create([
            'name' => 'First-Aid Project',
            'confirmation_code' => 'FAAPRJ',
        ]);

        // Create the app first (active_version_id filled in after the version exists).
        $instance->app = App::create([
            'name' => 'First-Aid App',
            'description' => 'First-Aid USSD service (test harness fixture)',
            'online' => true,
            'project_id' => $instance->project->id,
            'confirmation_code' => 'FAAAPP',
        ]);

        // Real production builder, saved through the observer (repair + cache).
        $instance->version = new Version();
        $instance->version->number = 1.00;
        $instance->version->description = 'First-Aid App v1.00 (production export)';
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
