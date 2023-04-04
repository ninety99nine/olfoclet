<?php

namespace App\Traits;

use App\Models\ShortCode;
use App\Traits\Base\BaseTrait;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

trait AppTrait
{
    use BaseTrait;

    public function getCacheName($id)
    {
        return $this->getBaseCacheName().'_'.$id;
    }

    public function findAndCache($id = null)
    {
        if( $id == null) {

            $app = $this;
            $id = $app->id;

        }else{

            //  We failed to retrieve from the cache, therefore perform a query
            $app = DB::table('apps')->select('id', 'name', 'description', 'active_version_id', 'project_id')->find($id);

        }

        //  Cache the app
        Cache::put($this->getCacheName($id), $app);

        //  Return the project
        return $app;
    }

    public function removeFromCache($id = null)
    {
        if( $id == null) {
            $id = $this->id;
        }

        Cache::forget($this->getCacheName($id));
    }

    public function assignActiveVersion($versionId)
    {
        $this->update([
            'active_version_id' => $versionId
        ]);
    }

    public function assignSharedCode($sharedShortCodeId)
    {
        if( !empty($sharedShortCodeId) ) {

            $existingShortCode =  $this->shortCode;

            //  If this app already has a matching shared shortcode assigned then stop further execution
            if($existingShortCode && $existingShortCode->shared_short_code_id == $sharedShortCodeId) return;

            //  Search for an existing shortcode without an owning app
            if( $shortCode = (new ShortCode)->where('shared_short_code_id', $sharedShortCodeId)->whereNull('app_id')->oldest()->first() ) {

                /**
                 *  Re-assign existing shortcode to this app.
                 *  Attempt to merge shortcodes in-case this
                 *  app already has its an existing shortcode
                 *  with a dedicated code
                 */
                $shortCode->update([
                    'dedicated_code' => $existingShortCode->dedicated_code ?? null,
                    'app_id' => $this->id,
                ]);

            }else{

                //  Create new shortcode for this app
                $shortCode = ShortCode::create([
                    'shared_short_code_id' => $sharedShortCodeId,
                    'app_id' => $this->id
                ]);

            }

            //  If this app already had a shortcode
            if( $existingShortCode ) {

                //  Remove this assigned shortcode
                $existingShortCode->update([
                    'dedicated_code' => null,
                    'app_id' => null
                ]);

            }

            //  Re-Cache the shortcodes
            (new ShortCode())->findAndCache();

        }
    }

    public function assignDedicatedCode($dedicatedCode)
    {
        if( !empty($dedicatedCode) ) {

            //  Remove the dedicated code assigned to other apps
            ShortCode::where('app_id', '!=', $this->id)->where('dedicated_code', $dedicatedCode)->update([
                'dedicated_code' => null
            ]);

            //  Assign the dedicated code to this app
            $this->shortCode->update(['dedicated_code' => $dedicatedCode]);

            //  Re-Cache the shortcodes
            (new ShortCode())->findAndCache();

        }
    }

}
