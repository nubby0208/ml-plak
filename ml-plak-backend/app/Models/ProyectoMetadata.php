<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProyectoMetadata extends Model
{
	protected $table = 'proyectos_metadata';
	protected $fillable = ['proyecto_id', 'metadata'];

	public function proyecto()
	{
		return $this->belongsTo(\App\Models\Proyecto::class);
	}
}
