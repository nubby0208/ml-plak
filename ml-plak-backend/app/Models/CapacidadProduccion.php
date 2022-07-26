<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CapacidadProduccion extends Model
{
	protected $table    = 'capacidad_produccion';
	protected $fillable = [
		'item',
		'tiempo_disenio',
		'tiempo_produccion',
    'tiempo_medicion',
		'tiempo_instalacion',
		'coeficiente_multiplicador',
    'tiempo_disenio_c',
		'tiempo_produccion_c',
    'tiempo_medicion_c',
		'tiempo_instalacion_c',
	];
	public $timestamps  = false;
}
