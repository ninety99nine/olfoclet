<?php

namespace App\Traits;

use App\Traits\Base\BaseTrait;

trait UssdSessionTrait
{
    use BaseTrait;

    public $default_timeout_message = 'TIMEOUT: You have exceeded your time limit.';
}
