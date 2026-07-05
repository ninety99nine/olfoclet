<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        //  Keep the hot ussd_sessions table small: every midnight (UTC) move
        //  sessions older than 24h to the archive, cap live rows at 1M per app,
        //  and purge archived rows older than 3 months. runInBackground so a long
        //  purge never delays other scheduled work; withoutOverlapping guards a
        //  slow run from stacking on the next midnight tick.
        $schedule->command('sessions:archive')
            ->dailyAt('00:00')
            ->withoutOverlapping()
            ->runInBackground();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
