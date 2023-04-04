<?php

namespace App\Models;

use App\Traits\ShortCodeTrait;
use Illuminate\Database\Eloquent\Model;

class ShortCode extends Model
{
    use ShortCodeTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'shared_code', 'dedicated_code', 'shared_short_code_id', 'app_id'
    ];

    /*
     *  Returns the app of this shortcode
     */
    public function app()
    {
        return $this->belongsTo(App::class);
    }

    /*
     *  Returns the shared shortcode of this shortcode
     */
    public function sharedShortCode()
    {
        return $this->belongsTo(SharedShortCode::class);
    }

    /****************************
     *  ACCESSORS               *
     ***************************/

    protected $appends = ['primary_code'];

    public function getPrimaryCodeAttribute()
    {
        return empty($this->dedicated_code) ? $this->shared_code : $this->dedicated_code;
    }

}
