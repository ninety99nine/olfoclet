<?php

namespace App\Traits;

use Carbon\Carbon;
use App\Traits\Base\BaseTrait;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

trait DatabaseEntryTrait
{
    use BaseTrait;

    public function getCacheName($ussd_account_id, $name)
    {
        //  CACHE_DATABASE_ENTRY_1_profile
        return $this->getBaseCacheName().'_'.$ussd_account_id.'_'.$name;
    }

    public function findAndCache($ussd_account_id, $name)
    {
        //  We failed to retrieve from the cache, therefore perform a query
        $database_entry = DB::table('database_entries')->where('ussd_account_id', $ussd_account_id)->where('name', $name)->first();

        if( $database_entry ){

            //  Convert the metadata to an associative array (We want to do this operation once)
            $database_entry->metadata = json_decode($database_entry->metadata, true);

            //  Cache the database entry e.g CACHE_DATABASE_ENTRY_1_profile = [ ... ] (Valid for only 30 minutes)
            Cache::put($this->getCacheName($ussd_account_id, $name), $database_entry, Carbon::now()->addMinutes(30));

        }

        //  Return the database entry
        return $database_entry;
    }

}
