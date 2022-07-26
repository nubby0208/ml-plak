<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Webpatser\Uuid\Uuid;

class ClientPresentationView extends Model
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'fieldsValues', 'template_id'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'fieldsValues' => 'array',
        'id' => 'string'
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['clientTemplate', 'urlBase'];

    protected $keyType = 'string';

    public $incrementing = false;

    /**
     * Get the template for the view.
     */
    public function template()
    {
        return $this->belongsTo('App\Models\ClientPresentationTemplate', 'template_id');
    }

    /**
     * Get the administrator flag for the user.
     *
     * @return App\Models\ClientPresentationTemplate
     */
    public function getClientTemplateAttribute()
    {
        return $this->template;
    }

    /**
     * Get the administrator flag for the user.
     *
     * @return App\Models\ClientPresentationTemplate
     */
    public function getUrlBaseAttribute()
    {
        return Storage::disk(ClientPresentationView::getStoreDisk())->url($this->getStorePath().DIRECTORY_SEPARATOR);
    }

    /**
     * The "booting" method of the model.
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function (Model $model) {
            $model->setAttribute($model->getKeyName(), (string)Uuid::generate(4));
        });
    }

    public static function getStoreDisk(){
        return config('ml_plank.client_views.store_disk');
    }

    public function getStorePath(){
        return config('ml_plank.client_views.base_path'). DIRECTORY_SEPARATOR. $this->id;
    }

    public static function getTempStorePath(){
        return config('ml_plank.client_views.temp_base_path');
    }
}
