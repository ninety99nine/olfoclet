<?php

namespace App\Traits;

use Carbon\Carbon;
use App\Traits\Base\BaseTrait;
use Illuminate\Support\Facades\Cache;
use App\Models\UssdAccountConnection;

trait UssdAccountConnectionTrait
{
    use BaseTrait;

    public function getCacheName($ussd_account_id, $version_id)
    {
        //  USSD_ACCOUNT_CONNECTION_1 = [ ... ]
        return $this->getBaseCacheName().'_'.$ussd_account_id.'_'.$version_id;
    }

    public function findAndCache($ussd_account_id, $version_id)
    {
        //  We failed to retrieve from the cache, therefore perform a query
        $ussdAccountConnection = resolve(UssdAccountConnection::class)
                    ->where('ussd_account_id', $ussd_account_id)
                    ->where('version_id', $version_id)
                    ->first();

        if( $ussdAccountConnection ) {

            //  Cache the account e.g USSD_ACCOUNT_CONNECTION_1 = [ ... ] (Valid for only 30 minutes)
            Cache::put($this->getCacheName($ussd_account_id, $version_id), $ussdAccountConnection, Carbon::now()->addMinutes(30));

        }

        //  Return the USSD account connection
        return $ussdAccountConnection;
    }

}
