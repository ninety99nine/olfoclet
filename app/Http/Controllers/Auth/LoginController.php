<?php

namespace App\Http\Controllers\Auth;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Repositories\AuthRepository;

class LoginController extends Controller
{
    /**
     * @return Inertia\Response
     */
    public function show()
    {
        return Inertia::render('Auth/Login/Show');
    }

    /**
     *  Handle an authentication attempt.
     *
     *  @return \Illuminate\Routing\Redirector|\Illuminate\Http\RedirectResponse
     */
    public function authenticate()
    {
        AuthRepository::login();
        return redirect()->intended('projects');
    }
}
