<?php

namespace App\Providers;

use App\Models\App;
use App\Models\Project;
use App\Models\Version;
use App\Models\ShortCode;
use App\Observers\AppObserver;
use App\Observers\ProjectObserver;
use App\Observers\VersionObserver;
use App\Observers\ShortCodeObserver;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        App::observe(AppObserver::class);
        Project::observe(ProjectObserver::class);
        Version::observe(VersionObserver::class);
        ShortCode::observe(ShortCodeObserver::class);
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
