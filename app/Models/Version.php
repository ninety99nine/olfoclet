<?php

namespace App\Models;

use App\Traits\VersionTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Version extends Model
{
    use HasFactory, SoftDeletes, VersionTrait;

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'builder' => 'array',
        'features' => 'array',
        'number' => 'decimal:2',    //  2 represents the decimal precision to return e.g 1.00, 2.00, e.t.c
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'number', 'description', 'builder', 'features', 'app_id', 'confirmation_code'
    ];

    /**
     *  Scope: Search by name
     */
    public function scopeSearch($query, $search)
    {
        return $search ? $query->where('number', 'like', '%'.$search.'%')
                               ->orWhere('description', 'like', '%'.$search.'%')
                       : $query;
    }

    /*
     *  Returns the app of this version
     */
    public function app()
    {
        return $this->belongsTo(App::class);
    }
    /*
     *  Returns accounts
     */
    public function accounts()
    {
        return $this->belongsToMany(UssdAccount::class, 'ussd_account_connections', 'version_id', 'ussd_account_id')->withTimestamps();
    }

    /*
     *  Returns project, app and version connections
     */
    public function connections()
    {
        return $this->hasMany(UssdAccountConnection::class, 'version_id');
    }

    /*
     *  Returns sessions
     */
    public function sessions()
    {
        return $this->hasMany(UssdSession::class);
    }

    /*
     *  Returns session notifications
     */
    public function sessionNotifications()
    {
        return $this->hasMany(SessionNotification::class);
    }

    /*
     *  Returns global variables
     */
    public function globalVariables()
    {
        return $this->hasMany(GlobalVariable::class);
    }

    /*
     *  Returns database entries
     */
    public function databaseEntries()
    {
        return $this->hasMany(DatabaseEntry::class);
    }

}
