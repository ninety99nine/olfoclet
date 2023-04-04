<?php

namespace App\Repositories;

use App\Models\Project;
use App\Models\User;

class SharedShortCodeRepository extends BaseRepository
{
    /**
     *  Return the shared shortcodes
     *
     *  @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getSharedShortCodes()
    {
        return $this->model->get();
    }
}
