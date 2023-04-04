<?php

namespace App\Traits;

use App\Traits\Base\BaseTrait;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

trait ShortCodeTrait
{
    use BaseTrait;

    public function getCacheName()
    {
        return $this->getBaseCacheName();
    }

    public function findAndCache()
    {
        //  We failed to retrieve from the cache, therefore perform a query
        $short_codes = DB::table('short_codes')->select('shared_code', 'dedicated_code', 'app_id')->get();

        //  Cache the shortcodes
        Cache::put($this->getCacheName(), $short_codes);

        //  Return the project
        return $short_codes;
    }

}
