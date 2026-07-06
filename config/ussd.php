<?php

return [

    /*
    |--------------------------------------------------------------------------
    | USSD session-state fast-path
    |--------------------------------------------------------------------------
    | When enabled, the engine restores a per-level "box" of computed state and
    | resumes at the focused screen instead of replaying the whole journey on
    | every keystroke. Off by default; enable per-environment once verified.
    */
    'fast_path' => env('USSD_FAST_PATH', false),

];
