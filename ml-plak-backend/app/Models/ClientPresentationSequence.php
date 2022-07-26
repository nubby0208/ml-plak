<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Webpatser\Uuid\Uuid;

class ClientPresentationSequence extends Model
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
    protected $fillable = ['name', 'sequenceTree'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'sequenceTree' => 'array',
        'id' => 'string'
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
            if(empty($model->getAttribute($model->getKeyName()))){
                $model->setAttribute($model->getKeyName(), (string)Uuid::generate(4));
            }
        });
    }

    public function getViewsIds($tree, & $views){
        if($tree && count($tree) > 0)
        {
            $views[$tree['viewId']] = null;
            foreach($tree['children'] as $child)
                $this->getViewsIds($child, $views);
        }
    }

    /**
     * Get the views for the storages.
     */
    public function storages()
    {
        return $this->hasMany('App\Models\ClientPresentationDataStorage', 'sequence_id');
    }

}
