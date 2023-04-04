<?php

namespace App\Models;

use App\Traits\ProjectTrait;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use App\Models\Pivots\ProjectUserAsTeamMember;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory, SoftDeletes, ProjectTrait;

    const PERMISSIONS = [
        'View users', 'Manage users',
        'View apps', 'Manage apps'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'confirmation_code'
    ];

    /**
     *  Scope: Search by name
     */
    public function scopeSearch($query, $search)
    {
        return empty($search) ? $query : $query->where('name', 'like', '%'.$search.'%');
    }

    /**
     *  Get the Users that have been assigned to this Project as a team member
     *
     *  @return Illuminate\Database\Eloquent\Concerns\HasRelationships::belongsToMany
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'project_user', 'project_id', 'user_id')
                    ->withPivot(ProjectUserAsTeamMember::VISIBLE_COLUMNS)
                    ->using(ProjectUserAsTeamMember::class);
    }

    /*
     *  Returns apps of this project
     */
    public function apps()
    {
        return $this->hasMany(App::class);
    }

    /*
     *  Returns trashed apps of this project
     */
    public function trashedApps()
    {
        return $this->apps()->onlyTrashed();
    }

    /*
     *  Returns project, app and version connections
     */
    public function connections()
    {
        return $this->hasMany(UssdAccountConnection::class, 'project_id');
    }

    //  ON DELETE EVENT
    public static function boot()
    {
        try {

            parent::boot();

            //  before delete() method call this
            static::deleting(function ($project) {

                //  If this is not a soft delete
                if($project->forceDeleting === true) {

                    //  Foreach project app (including those that are trashed)
                    foreach($project->apps()->withTrashed()->get() as $app) {

                        //  Force delete the app (This deletes permanetly)
                        $app->forceDelete();

                    }

                    //  Delete user associations
                    DB::table('project_user')->where(['project_id' => $project->id])->delete();

                }

                // do the rest of the cleanup...
            });

        } catch (\Exception $e) {
            throw($e);
        }
    }

}
