<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThreeScene extends Model
{
    //
    protected $table = 'three_scenes';

    protected $fillable = ['proyecto_id','scene','markers','editorData'];
}
