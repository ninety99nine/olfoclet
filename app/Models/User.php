<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Pivots\ProjectUserAsTeamMember;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     *  Get the Projects that have been assigned to this User as a team member
     *
     *  @return Illuminate\Database\Eloquent\Concerns\HasRelationships::belongsToMany
     */
    public function projectsAsTeamMember()
    {
        return $this->belongsToMany(Project::class, 'project_user', 'user_id', 'project_id')
                    ->withPivot(ProjectUserAsTeamMember::VISIBLE_COLUMNS)
                    ->using(ProjectUserAsTeamMember::class);
    }

    /**
     *  Get the trashed Projects that have been assigned to this User as a team member
     *
     *  @return Illuminate\Database\Eloquent\Concerns\HasRelationships::belongsToMany
     */
    public function trashedProjectsAsTeamMember()
    {
        return $this->projectsAsTeamMember()->onlyTrashed();
    }
}
