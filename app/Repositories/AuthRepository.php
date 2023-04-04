<?php

namespace App\Repositories;

use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthRepository extends BaseRepository
{
    /**
     *  Attempt to log into the user account
     *
     *  @return boolean
     *  @throws \Illuminate\Validation\ValidationException
     */
    public static function login()
    {
        $credentials = request()->validate([
            'email' => ['required', 'email'],
            'password' => ['required', Password::min(6)]
        ]);

        //  Check the validity of the credentials
        if (Auth::attempt($credentials)) {
            request()->session()->regenerate();
        }else{
            throw ValidationException::withMessages([
                'email' => 'The provided credentials do not match our records.'
            ]);
        }
    }

    /**
     *  Attempt to logout of the user account
     *
     *  @return boolean
     */
    public static function logout()
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
    }
}
