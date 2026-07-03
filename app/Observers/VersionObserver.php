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
        //  File 02 — only repair when the builder actually changed. A settings-only
        //  save must not trigger the ~800-line repair (which normalizes and stamps
        //  schema_version:2 on a still-legacy builder), so changing a test detail or
        //  colour leaves the builder byte-identical. Builder edits still repair.
        if ($version->isDirty('builder')) {
            $version->builder = $version->repairBuilder($version->builder);
        }

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
