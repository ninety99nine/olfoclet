<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use App\Traits\UssdSessionTrait;

class UssdSession extends Model
{
    use HasFactory, UssdSessionTrait;

    protected $with = ['account'];

    const MAXIMUM_SESSION_DURATION = 120;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $casts = [
        'session_execution_times' => 'array',
        'inputs_and_outputs' => 'array',
        'logs_expire_at' => 'datetime',
        'allow_timeout' => 'boolean',
        'reply_records' => 'array',
        'fatal_error' => 'boolean',
        'timeout_at' => 'datetime',
        'logs' => 'array',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [

        /*  Session Information  */
        'ussd_account_id', 'ussd_account_connection_id', 'session_id', 'service_code', 'type', 'request_type',
        'text', 'reply_records', 'inputs_and_outputs', 'logs', 'logs_expire_at',
        'fatal_error', 'fatal_error_msg', 'allow_timeout', 'timeout_at', 'total_session_duration',
        'session_execution_times',

        /*  Ownership Information  */
        'project_id', 'app_id', 'version_id'

    ];

    /**
     *  Scope: Search by msisdn or session id
     */
    public function scopeSearch($query, $search)
    {
        return empty($search)
            ? $query : $query->whereHas('account', function (Builder $query) use ($search) {
                $query->search($search);
            })->orWhere('session_id', $search);
    }

    /**
     *  Scope: Test Account
     */
    public function scopeTestAccounts($query)
    {
        return $query->whereHas('account', function (Builder $query) {
            $query->testAccounts();
        });
    }

    /**
     *  Scope: Real Account
     */
    public function scopeRealAccounts($query)
    {
        return $query->whereHas('account', function (Builder $query) {
            $query->realAccounts();
        });
    }

    /**
     *  Scope: Successful sessions
     */
    public function scopeSuccessful($query)
    {
        return $query->where('fatal_error', '0');
    }

    /**
     *  Scope: Failed sessions
     */
    public function scopeFailed($query)
    {
        return $query->where('fatal_error', '1');
    }

    /**
     *  Returns the query with select columns excluded.
     */
    public function scopeExclude($query, $value = [])
    {
        $columns = array_merge($this->getFillable(), ['id', 'created_at', 'updated_at']);
        return $query->select(array_diff($columns, (array) $value));
    }

    /*
     *  Returns the owner of the ussd session
     */
    public function owner()
    {
        return $this->morphTo();
    }

    /*
     *  Returns the project
     */
    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    /*
     *  Returns the app
     */
    public function app()
    {
        return $this->belongsTo(App::class, 'app_id');
    }

    /*
     *  Returns the version
     */
    public function version()
    {
        return $this->belongsTo(Version::class, 'version_id');
    }

    /*
     *  Returns ussd account
     */
    public function account()
    {
        return $this->belongsTo(UssdAccount::class, 'ussd_account_id');
    }

    /*
     *  Returns airtime billing payments
     */
    public function airtimeBillingPayments()
    {
        return $this->hasMany(AirtimeBilingPayment::class);
    }

    /* ATTRIBUTES */

    protected $appends = [
        'origin', 'mobile_number', 'has_timed_out', 'request_type_status', 'success_status', 'total_duration', 'total_inputs_and_outputs'
    ];

    /*
     *  Returns origin
     */
    public function getOriginAttribute()
    {
        return $this->account->origin;
    }

    /*
     *  Returns total replies
     */
    public function getMobileNumberAttribute()
    {
        return $this->account->mobile_number;
    }

    /*
     *  Returns total replies
     */
    public function getTotalInputsAndOutputsAttribute()
    {
        return collect($this->inputs_and_outputs)->count();
    }

    /*
     *  Returns total duration
     */
    public function getTotalDurationAttribute()
    {
        return $this->created_at->longAbsoluteDiffForHumans($this->updated_at);
    }

    /*
     *  Returns true or false if the session has timed out or expired
     */
    public function gethasTimedOutAttribute()
    {
        //  Get the session timeout date and time (as a timestamp)
        $timeout_at = $this->timeout_at->getTimestamp();

        //  Get the current date and time (as a timestamp)
        $now = \Carbon\Carbon::now()->getTimestamp();

        //  Compare to see if the session timeout date and time has been exceeded
        $result = ($now > $timeout_at) ? true : false;

        //  Return final result
        return $result;
    }

    public function getRequestTypeStatusAttribute()
    {
        if( $this->request_type == '1' ) {

            $name = 'Started';
            $desc = 'The session was just recently started';

        }elseif( $this->request_type == '2' ) {

            $name = 'Running';
            $desc = 'The session is still curently running';

        }elseif( $this->request_type == '3' ) {

            $name = 'Ended';
            $desc = 'The session ended';

        }elseif( $this->request_type == '4' ) {

            $name = 'Timeout';
            $desc = 'The session timed out';

        }

        $response =  [
            'name' => $name,
            'description' => $desc,

        ];

        return $response;
    }

    public function getSuccessStatusAttribute()
    {
        //  If the test session failed
        if( $this->fatal_error ){

            $name = 'Fail';
            $desc = 'The session was prematurely ended due to an error';

        //  If the test session failed
        }else{

            $name = 'Success';
            $desc = 'The session was gracefully ended';

        }

        $response =  [
            'name' => $name,
            'description' => $desc,

        ];

        return $response;
    }
}
