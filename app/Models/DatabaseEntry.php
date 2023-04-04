<?php

namespace App\Models;

use App\Traits\DatabaseEntryTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DatabaseEntry extends Model
{
    use DatabaseEntryTrait;

    protected $with = ['account'];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [

        /*  Global Variable Information  */
        'ussd_account_id', 'name',

        /*  Meta Data  */
        'metadata',

        /*  Ownership Information  */
        'app_id', 'version_id'

    ];

    /**
     *  Scope: Search by name
     */
    public function scopeSearch($query, $search)
    {
        return empty($search) ? $query : $query->where('name', 'like', '%'.$search.'%');
    }

    /*
     *  Scope:
     *  Return test database entries
     */
    public function scopeTestEntries($query)
    {
        return $query->where('test', 1);
    }

    /*
     *  Scope:
     *  Return real database entries
     */
    public function scopeRealEntries($query)
    {
        return $query->where('test', 0);
    }

    /*
     *  Returns ussd account
     */
    public function account()
    {
        return $this->belongsTo(UssdAccount::class, 'ussd_account_id');
    }

    /*
     *  Returns the owning project
     */
    public function project()
    {
        return $this->belongsTo('App\Project', 'project_id');
    }

}
