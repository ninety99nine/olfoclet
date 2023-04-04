<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use App\Traits\UssdAccountConnectionTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UssdAccountConnection extends Model
{
    use HasFactory, UssdAccountConnectionTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [

        /*  Pivot Information  */
        'ussd_account_id', 'project_id', 'app_id', 'version_id'

    ];

    /**
     *  Scope: Test Account
     */
    public function scopeTestAccounts($query)
    {
        return $query->whereHas('ussdAccount', function (Builder $query) {
            $query->testAccounts();
        });
    }

    /**
     *  Scope: Real Account
     */
    public function scopeRealAccounts($query)
    {
        return $query->whereHas('ussdAccount', function (Builder $query) {
            $query->realAccounts();
        });
    }

    /**
     *  Scope: Active Account
     */
    public function scopeActive($query, $duration = 1)
    {
        return $query->whereHas('sessions', function (Builder $query) use ($duration) {
            $query->where('created_at', '>=', Carbon::now()->subDays($duration));
        });
    }

    /**
     *  Scope: Inactive Account
     */
    public function scopeInactive($query, $duration = 1)
    {
        return $query->whereDoesntHave('sessions', function (Builder $query) use ($duration) {
            $query->where('created_at', '>=', Carbon::now()->subDays($duration));
        });
    }

    /*
     *  Returns project
     */
    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    /*
     *  Returns app
     */
    public function app()
    {
        return $this->belongsTo(App::class, 'app_id');
    }

    /*
     *  Returns version
     */
    public function version()
    {
        return $this->belongsTo(Version::class, 'version_id');
    }

    /*
     *  Returns version
     */
    public function ussdAccount()
    {
        return $this->belongsTo(UssdAccount::class, 'ussd_account_id');
    }

    /*
     *  Returns sessions
     */
    public function sessions()
    {
        return $this->hasMany(UssdSession::class);
    }
}
