<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionNotification extends Model
{
    use HasFactory;

    protected $with = ['account'];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $casts = [
        'metadata' => 'array',
        'expiry_date' => 'datetime',
        'marked_as_seen' => 'boolean',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [

        /*  Session Notification Details  */
        'ussd_account_id', 'session_id', 'type', 'name', 'message',
        'continue_text', 'marked_as_seen', 'display_session_type',

        /* Validity Period */
        'expiry_date',

        /*  Meta Data  */
        'metadata',

        /*  Ownership Information  */
        'app_id', 'version_id'

    ];

    /**
     *  Scope: Search by message
     */
    public function scopeSearch($query, $search)
    {
        return empty($search) ? $query : $query->where('message', 'like', '%'.$search.'%');
    }

    /*
     *  Returns ussd account
     */
    public function account()
    {
        return $this->belongsTo(UssdAccount::class, 'ussd_account_id');
    }
}
