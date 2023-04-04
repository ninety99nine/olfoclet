<?php

namespace App\Observers;

use App\Models\Project;

class ProjectObserver
{
    public function creating(Project $project)
    {
        //  Generate a confirmation code
        $project->confirmation_code = $project->generateConfirmationCode();
    }

    public function saving(Project $project)
    {
        //  Generate a confirmation code
        $project->confirmation_code = $project->generateConfirmationCode();
    }

    public function created(Project $project)
    {
    }

    public function updated(Project $project)
    {
    }

    public function deleted(Project $project)
    {
    }

    public function restored(Project $project)
    {
    }

    public function forceDeleted(Project $project)
    {
    }
}
