<?php

namespace app\Models;

use Illuminate\Database\Eloquent\Model;

class AirtimeBillingToken extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'msisdn', 'access_token', 'expiry_date'
    ];
}
