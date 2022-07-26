<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Webpatser\Uuid\Uuid;

class ClientPresentationDataStorage extends Model
{
    use SoftDeletes;

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['data', 'state', 'sequence_id'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'data' => 'array',
        'id' => 'string',
        'attach' => 'array'
    ];

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

    /**
     * Get the sequence for the view.
     */
    public function sequence()
    {
        return $this->belongsTo('App\Models\ClientPresentationSequence', 'sequence_id')->withTrashed();
    }

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['clientSequence', 'urlBase'];

    /**
     * Get the administrator flag for the user.
     *
     * @return App\Models\ClientPresentationSequence
     */
    public function getClientSequenceAttribute()
    {
        return $this->sequence;
    }

    /**
     * Get the administrator flag for the user.
     *
     * @return string
     */
    public function getUrlBaseAttribute()
    {
        return Storage::disk(ClientPresentationDataStorage::getStoreDisk())->url($this->getStorePath().DIRECTORY_SEPARATOR);
    }

    public static function getStoreDisk(){
        return config('ml_plank.client_views.store_disk');
    }

    public function getStorePath(){
        return config('ml_plank.client_views.storage_base_path'). DIRECTORY_SEPARATOR. $this->id;
    }
}
