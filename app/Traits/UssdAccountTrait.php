<?php

namespace App\Traits;

use Carbon\Carbon;
use App\Models\UssdAccount;
use App\Traits\Base\BaseTrait;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Builder;

trait UssdAccountTrait
{
    use BaseTrait;

    public function getCacheName($msisdn, $test_mode, $version_id)
    {
        //  If this is a test account
        if( $test_mode && ($authUser = auth()->user()) ) {

            $user_id = $authUser->id;

            //  USSD_ACCOUNT_26772123456_1_2 = [ ... ]
            return $this->getBaseCacheName().'_'.$msisdn.'_'.$user_id.'_'.$version_id;

        }else{

            //  USSD_ACCOUNT_26772123456_2 = [ ... ]
            return $this->getBaseCacheName().'_'.$msisdn.'_'.$version_id;

        }
    }

    public function findAndCache($msisdn, $test_mode, $version_id)
    {
        //  We failed to retrieve from the cache, therefore perform a query
        $account = resolve(UssdAccount::class)
                    ->where('msisdn', $msisdn)
                    ->where('test', $test_mode)
                    ->where('user_id', auth()->user() ? auth()->user()->id : null)
                    ->whereHas('versions', function (Builder $query) use($version_id) {
                        $query->where('versions.id', $version_id);
                    })->first();

        if( $account ) {

            //  Cache the account e.g USSD_ACCOUNT_1_2 = [ ... ] (Valid for only 30 minutes)
            Cache::put($this->getCacheName($msisdn, $test_mode, $version_id), $account, Carbon::now()->addMinutes(30));

        }

        //  Return the account
        return $account;
    }

}
