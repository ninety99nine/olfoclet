<?php

namespace App\Http\Controllers\Auth;

use App\Repositories\AuthRepository;
use App\Http\Controllers\Controller;

class LogoutController extends Controller
{
    /**
     *  Log the user out of the application.
     *
     *  @return \Illuminate\Routing\Redirector|\Illuminate\Http\RedirectResponse
     */
    public function logout()
    {
        AuthRepository::logout();
        return redirect()->route('login.show');
    }
}
