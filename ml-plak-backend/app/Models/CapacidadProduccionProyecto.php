<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CapacidadProduccionProyecto extends Model
{
	protected $table    = 'capacidad_produccion_proyecto';
	protected $fillable = [
		'item',
		'tiempo_disenio',
		'tiempo_produccion',
    'tiempo_medicion',
		'tiempo_instalacion',
		"coeficiente_multiplicador",
    "proyecto_id",
    "token_project",
    "exported",
    'tiempo_disenio_c',
		'tiempo_produccion_c',
    'tiempo_medicion_c',
		'tiempo_instalacion_c',
	];
	//public $timestamps  = false;
  public function proyecto()
	{
		return $this->belongsTo(\App\Models\Proyecto::class);
	}
  public function proyectojson()
	{
		return $this->belongsTo(\App\Models\ProyectoJson::class);
	}
}
