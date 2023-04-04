<?php

namespace App\Models;

use App\Traits\AppTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class App extends Model
{
    use HasFactory, SoftDeletes, AppTrait;

    protected $with = ['shortCode'];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $casts = [
        'online' => 'boolean'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description', 'online', 'offline_message', 'confirmation_code', 'active_version_id', 'project_id'
    ];

    /**
     *  Scope: Search by name
     */
    public function scopeSearch($query, $search)
    {
        return empty($search) ? $query : $query->where('name', 'like', '%'.$search.'%');
    }

    /*
     *  Returns ussd short code
     */
    public function shortCode()
    {
        return $this->hasOne(ShortCode::class);
    }

    /*
     *  Returns app project
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /*
     *  Returns versions of this app
     */
    public function versions()
    {
        return $this->hasMany(Version::class);
    }

    /*
     *  Returns trashed versions of this app
     */
    public function trashedVersions()
    {
        return $this->versions()->onlyTrashed();
    }

    /*
     *  Returns versions of this app without the builder
     */
    public function versionsWithoutBuilder()
    {
        $fields = collect(['id', ...resolve(Version::class)->getFillable(), 'created_at', 'updated_at', 'deleted_at'])->reject(fn($value) => $value == 'builder')->toArray();
        return $this->versions()->select(...$fields);
    }

    /*
     *  Returns trashed versions of this app without the builder
     */
    public function trashedVersionsWithoutBuilder()
    {
        return $this->versionsWithoutBuilder()->onlyTrashed();
    }

    /*
     *  Returns the active version of this app
     */
    public function activeVersion()
    {
        return $this->belongsTo(Version::class, 'active_version_id');
    }

    /*
     *  Returns the sessions
     */
    public function sessions()
    {
        return $this->hasMany(UssdSession::class);
    }

    /*
     *  Returns test sessions
     */
    public function testSessions()
    {
        return $this->sessions()->where('test', 1);
    }

    /*
     *  Returns live sessions
     */
    public function liveSessions()
    {
        return $this->sessions()->where('test', 0);
    }

    /*
     *  Returns accounts of this app
     */
    public function accounts()
    {
        return $this->hasMany(UssdAccount::class);
    }

    /*
     *  Returns project, app and version connections
     */
    public function connections()
    {
        return $this->hasMany(UssdAccountConnection::class, 'app_id');
    }

    /*
     *  Returns the session notification
     */
    public function sessionNotifications()
    {
        return $this->hasMany(SessionNotification::class);
    }

    /*
     *  Returns the global variables
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

    /*
     *  Returns test database entries
     */
    public function testDatabaseEntries()
    {
        return $this->databaseEntries()->where('test', 1);
    }

    /*
     *  Returns live database entries
     */
    public function liveDatabaseEntries()
    {
        return $this->databaseEntries()->where('test', 0);
    }

    //  ON DELETE EVENT
    public static function boot()
    {
        try {

            parent::boot();

            //  before delete() method call this
            static::deleting(function ($app) {

                //  If this is not a soft delete
                if($app->forceDeleting === true) {

                    //  Delete sessions
                    $app->sessions()->delete();

                    //  Delete global variables
                    $app->globalVariables()->delete();

                    //  Delete database entries
                    $app->databaseEntries()->delete();

                    //  Delete session notifications
                    $app->sessionNotifications()->delete();

                    //  Remove shortcode ownership
                    $app->shortCode()->update([
                        'dedicated_code' => null,
                        'app_id' => null
                    ]);

                    //  Foreach app version (including those that are trashed)
                    foreach($app->versions()->withTrashed()->get() as $version) {

                        //  Force delete the version (This deletes permanetly)
                        $version->forceDelete();

                    }

                }

                // do the rest of the cleanup...
            });

        } catch (\Exception $e) {
            throw($e);
        }
    }

}
