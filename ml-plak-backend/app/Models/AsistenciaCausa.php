<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AsistenciaCausa extends Model
{
	protected $table    = 'asistencia_causas';
	protected $fillable = ['causa'];

	public function asistencias()
	{
		return $this->hasMany(\App\Models\Asistencia::class);
	}
}
