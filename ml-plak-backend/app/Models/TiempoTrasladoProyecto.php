<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TiempoTrasladoProyecto extends Model
{
	protected $table    = 'tiempos_traslados_proyecto';
	protected $fillable = ['descripcion', "tiempo_traslado","tiempo_traslado_c","exported","token_project","proyecto_id"];

  public function proyecto()
	{
		return $this->belongsTo(\App\Models\Proyecto::class);
	}
}
