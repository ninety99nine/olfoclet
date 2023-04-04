<?php

namespace App\Traits\Base;

use stdClass;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

trait BaseTrait
{
    public function getBaseCacheName()
    {
        return 'CACHE_'.strtoupper(class_basename($this));
    }

    public function generateConfirmationCode()
    {
        return random_int(100000, 999999);
    }
}
