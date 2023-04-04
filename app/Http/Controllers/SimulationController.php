<?php

namespace App\Http\Controllers;

use App\Models\UssdSession;
use App\Services\Ussd\UssdService;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;

class SimulationController extends BaseController
{
    public function launchUssd()
    {
        //  If we are starting a new test session
        if( request()->input('test_mode') == true && request()->input('request_type') == 1 ) {

            /**
             *  Close other running sessions.
             *  We are using DB::table('ussd_sessions') instead of the UssdSession Eloquent Model
             *  since we want to update the sessions without touching the updated_at timestamp.
             *  This is important since the created_at and updated_at are used to calculate
             *  the user session duration. When we modify the updated_at we set the current
             *  time which can be many days or months since the user last interacted with
             *  the session, making seem as if the session was running for many days or
             *  months when in reality the session was being updated as closed.
             */
            $query = DB::table('ussd_sessions')
                ->whereIn('request_type', ['1', '2'])
                ->join('ussd_accounts', function ($join) {
                    $join->on('ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
                         ->where('ussd_accounts.user_id', auth()->user()->id);
                });

            //  Target sessions that have not elapsed the maximum session duration the End the session
            $query->whereRaw('TIMESTAMPDIFF(SECOND, ussd_sessions.created_at, ussd_sessions.updated_at) < ?', [UssdSession::MAXIMUM_SESSION_DURATION])->update(['request_type' => '3']);

            //  Target sessions that have elapsed the maximum session duration the Timeout the session
            $query->whereRaw('TIMESTAMPDIFF(SECOND, ussd_sessions.created_at, ussd_sessions.updated_at) >= ?', [UssdSession::MAXIMUM_SESSION_DURATION])->update(['request_type' => '4']);

        }

        return (new UssdService(request()))->setup();
    }

    public function stopUssd()
    {
        if( $sessionId = request()->session_id ) {

            //  Close current running session
            DB::table('ussd_sessions')->where('session_id', $sessionId)->update([
                'request_type' => '3',   //  End the session
                'updated_at' => now()
            ]);

        }
    }

}
