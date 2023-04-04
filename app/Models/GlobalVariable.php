<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class GlobalVariable extends Model
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
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [

        /*  Global Variable Information  */
        'ussd_account_id',

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
        return empty($search) ? $query : $query->whereHas('account', function (Builder $query) use ($search) {
            $query->search($search);
        });
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

}
