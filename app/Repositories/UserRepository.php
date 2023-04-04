<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class UserRepository extends BaseRepository
{
    /**
     *  Attempt to create the user account
     *
     *  @return boolean
     *  @throws \Illuminate\Validation\ValidationException
     */
    public static function create()
    {
        $credentials = request()->validate([
            //  The security user email and password
            'signin_with_acount' => ['required', 'boolean'],
            'security_email' => ['required', 'email'],
            'security_password' => ['required'],

            //  The user email and password
            'name' => ['required', 'min:3', 'max:30'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'confirmed', Password::min(6)],
        ]);

        $securityCredentials = [
            'email' => $credentials['security_email'],
            'password' => $credentials['security_password']
        ];

        //  Check the validity of the security credentials
        if ( Auth::attempt($securityCredentials) ) {

            $credentials['name'] = ucwords($credentials['name']);
            $credentials['password'] = bcrypt($credentials['password']);
            return User::create($credentials);

        }else{

            throw ValidationException::withMessages([
                'security_email' => 'The provided credentials do not match our records.'
            ]);

        }
    }
}
