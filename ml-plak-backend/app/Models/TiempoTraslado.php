<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TiempoTraslado extends Model
{
	protected $table    = 'tiempos_traslados';
	protected $fillable = ['descripcion', "tiempo_traslado","tiempo_traslado_c"];
	public $timestamps  = false;
}
