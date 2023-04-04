<?php

namespace App\Traits;

use App\Traits\Base\BaseTrait;
use Illuminate\Support\Facades\DB;

trait ProjectTrait
{
    use BaseTrait;

    /**
     *  @param \App\Models\User $user
     */
    public function addTeamMember($user)
    {
        DB::table('project_user')->insert([
            'permissions' => json_encode(['*']),
            'project_id' => $this->id,
            'user_id' => $user->id,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}
