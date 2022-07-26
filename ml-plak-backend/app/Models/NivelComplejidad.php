<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NivelComplejidad extends Model
{
    protected $table    = 'niveles_complejidad';
	protected $fillable = ['etapa','tipo','min','max','puntos'];
}
