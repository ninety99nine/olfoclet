<?php

namespace App\Observers;

use App\Models\Version;
use App\Models\ShortCode;

class VersionObserver
{
    public function creating(Version $version)
    {
        //  If the version builder hasn't been provided
        if( empty($version->builder) ) {

            //  Set the version builder
            $version->builder = $version->getBuilderTemplate();

        }

        //  Generate a confirmation code
        $version->confirmation_code = $version->generateConfirmationCode();
    }

    public function saving(Version $version)
    {
        //  Repair the version builder
        $version->builder = $version->repairBuilder($version->builder);

        //  Generate a confirmation code
        $version->confirmation_code = $version->generateConfirmationCode();
    }

    public function created(Version $version)
    {
        //  Re-Cache this version
        $version->findAndCache();
    }

    public function updated(Version $version)
    {
        //  Re-Cache this version
        $version->findAndCache();
    }

    public function deleted(Version $version)
    {
        //  Remove this version from cache
        $version->removeFromCache();
    }

    public function restored(Version $version)
    {
        //  Re-Cache this version
        $version->findAndCache();
    }

    public function forceDeleted(Version $version)
    {
        //  Remove this version from cache
        $version->removeFromCache();
    }
}
