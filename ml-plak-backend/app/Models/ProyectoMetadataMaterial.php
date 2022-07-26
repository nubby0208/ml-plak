<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProyectoMetadataMaterial extends Model
{
	protected $table = 'proyectos_metadata_materiales';
	protected $fillable = ['proyecto_id', 'material', 'estado_id'];

	public function proyecto()
	{
		return $this->belongsTo(\App\Models\Proyecto::class, 'proyecto_id', 'id');
	}

	public function estado()
	{
		return $this->belongsTo(\App\Models\Estado::class);
	}
}
