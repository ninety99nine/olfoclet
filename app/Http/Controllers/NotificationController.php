<?php

namespace App\Http\Controllers;

use App\Models\App;
use Inertia\Inertia;
use App\Models\Project;
use App\Models\Version;
use App\Models\SessionNotification;
use App\Services\Session\SessionNotificationService;

class NotificationController extends BaseController
{
    public function index(Project $project, App $app, Version $version)
    {
        //  Version options
        $versionOptions = $app->versions()->select('id', 'number')->get();

        //  Get the notification service response
        $notificationServiceResponse = (new SessionNotificationService())->getNotifications();

        //  Prepare Response
        $props = array_merge([
            'appPayload' => $app,
            'projectPayload' => $project,
            'versionOptions' => $versionOptions,
            'versionPayload' => $version->makeHidden('builder'),
        ], $notificationServiceResponse);

        //  Return Response
        return request()->expectsJson() ? $props : Inertia::render('Notifications/List/index', $props);
    }

    public function show(Project $project, App $app, Version $version, SessionNotification $notification)
    {
        //  Prepare Response
        $props = [
            'appPayload' => $app,
            'projectPayload' => $project,
            'notificationPayload' => $notification,
            'versionPayload' => $version->makeHidden('builder')
        ];

        //  Return Response
        return request()->expectsJson() ? $props : Inertia::render('Notifications/Show/index', $props);
    }

    public function create()
    {
    }

    public function update()
    {
    }

    public function delete()
    {
    }
}
