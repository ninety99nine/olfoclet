<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use App\Models\Project;
use App\Repositories\ProjectRepository;
use App\Repositories\SharedShortCodeRepository;

class ProjectController extends BaseController
{
    /**
     * @return Inertia\Response
     */
    public function index()
    {
        /**
         *  @var User $user
         */
        $user = auth()->user();
        $totalTrashedProjects = $user->trashedProjectsAsTeamMember()->count();
        $projectsPayload = resolve(ProjectRepository::class)->setModel( $user->projectsAsTeamMember() )->getProjects();

        return Inertia::render('Projects/List/index', [
            'projectsPayload' => $projectsPayload,
            'totalTrashedProjects' => $totalTrashedProjects,
        ]);
    }

    /**
     * @return Inertia\Response
     */
    public function show()
    {
        $this->project = $this->project->loadCount(['trashedApps']);
        $sharedShortCodesPayload = resolve(SharedShortCodeRepository::class)->getSharedShortCodes();
        $appsPayload = resolve(ProjectRepository::class)->setModel($this->project)->getProjectApps();

        return Inertia::render('Projects/Show/index', [
            'sharedShortCodesPayload' => $sharedShortCodesPayload,
            'projectPayload' => $this->project,
            'appsPayload' => $appsPayload,
        ]);
    }

    /**
     * @return \Illuminate\Http\RedirectResponse
     */
    public function create()
    {
        ProjectRepository::createProject();
        return redirect()->route('projects.show');
    }

    /**
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update()
    {
        resolve(ProjectRepository::class)->setModel($this->project)->updateProject();

        if( request()->input('destination') === 'projects.show' ) {

            //  Show the projects
            return redirect()->route('projects.show');

        }else{

            //  Show the project
            return redirect()->route('project.show.with.apps', ['project' => $this->project->id]);

        }
    }

    /**
     * @return \Illuminate\Http\RedirectResponse
     */
    public function delete()
    {
        resolve(ProjectRepository::class)->setModel($this->project)->deleteProject();
        return redirect()->back();
    }

    /**
     * @return \Illuminate\Http\RedirectResponse
     */
    public function restore()
    {
        resolve(ProjectRepository::class)->setModel($this->project)->restoreProject();
        return redirect()->route('trashed.projects.show');
    }
}
