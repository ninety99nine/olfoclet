<?php

namespace App\Observers;

use App\Models\SharedShortCode;
use App\Models\ShortCode;
use Illuminate\Support\Facades\Cache;

class ShortCodeObserver
{
    public function created(ShortCode $shortCode)
    {
        //  Count the matching shared shortcodes
        $totalMatchingShortCodes = ShortCode::where('shared_short_code_id', $shortCode->shared_short_code_id)->count();

        //  Generate a new and unique shared shortcode
        $uniqueSharedCode = str_replace('#', '*'.($totalMatchingShortCodes).'#', $shortCode->sharedShortCode->code);

        //  Set the generated unique shared shortcode
        $shortCode->update([
            'shared_code' => $uniqueSharedCode
        ]);

        //  Re-Cache the shortcodes
        $shortCode->findAndCache();
    }

    public function updated(ShortCode $shortCode)
    {
        //
    }

    public function deleted(ShortCode $shortCode)
    {
        //
    }

    public function restored(ShortCode $shortCode)
    {
        //
    }

    public function forceDeleted(ShortCode $shortCode)
    {
    }
}
