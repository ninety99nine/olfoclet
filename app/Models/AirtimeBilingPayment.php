<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AirtimeBilingPayment extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'msisdn_to_bill', 'is_prepaid_account', 'has_enough_funds', 'amount_to_bill',
        'funds_before_deduction', 'funds_after_deduction', 'success_status',

        'currency', 'product_id', 'service_id', 'description', 'on_behalf_of',
        'purchase_category_code', 'response_reference_name',

        'ussd_account_id', 'ussd_session_id', 'version_id', 'app_id', 'project_id'
    ];
}
