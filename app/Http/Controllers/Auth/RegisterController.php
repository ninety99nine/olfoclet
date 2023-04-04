<?php

namespace App\Http\Controllers\Auth;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Repositories\UserRepository;

class RegisterController extends Controller
{
    /**
     * @return Inertia\Response
     */
    public function show()
    {
        return Inertia::render('Auth/Register/Show');
    }

    /**
     * Handle an authentication attempt.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function create()
    {
        //  Attempt to create the user
        $user = UserRepository::create();

        //  Check is we must auto-login to this new user account
        if( request()->input('signin_with_acount') === true ) {

            Auth::login($user);
            return redirect()->route('projects.show');

        }else{

            return redirect()->back();

        }
    }
}
