<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientPresentationTemplate extends Model
{
    use SoftDeletes;

    public const TypeFile = "file";
    public const TypeMultiFileAndText = "typeMultiFileAndText";
    public const TypeText = "text";
    public const TypeString = "string";
    public const TypeNumberLinks = "numberLink";

    public const UploadTempFile = "uploadTempFile";


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'fields', 'inputsFields'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'fields' => 'array',
        'inputsFields' => 'array',
    ];

    /**
     * Get the views for the template.
     */
    public function views()
    {
        return $this->hasMany('App\Models\ClientPresentationView', 'template_id');
    }


}
