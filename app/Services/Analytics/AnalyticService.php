<?php

namespace App\Services\Analytics;

use App\Models\UssdSession;
use App\Services\Session\SessionService;

class AnalyticService
{
    public function __construct()
    {

    }

    public static function sessionTotals()
    {
        $sessions = SessionService::filterSessions();

        $totalFailed = $sessions->failed()->count();
        $totalSuccessful = $sessions->successful()->count();

        $totalActiveToday = $sessions->last()->count();

        return [
            'total' => $total,
            'totalFailed' => $totalFailed,
            'totalSuccessful' => $totalSuccessful,
        ];
    }

    public static function sessionTotals()
    {
        $accounts = SessionService::filterSessions();

        $totalFailed = $accounts->createdToday()->count();
        $totalSuccessful = $accounts->createdThisWeek()->count();
        $totalSuccessful = $accounts->createdThisMonth()->count();
        $totalSuccessful = $accounts->createdThisYear()->count();

        $totalActiveToday = $accounts->last()->count();

        return [
            'total' => $total,
            'totalFailed' => $totalFailed,
            'totalSuccessful' => $totalSuccessful,
        ];
    }
}
