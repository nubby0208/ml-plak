<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Horario extends Model
{
	protected $table    = 'horarios';
	protected $fillable = ['hora_inicio', 'hora_fin', 'activo'];

	public function asistencias()
	{
		return $this->hasMany(\App\Models\Asistencia::class);
	}
}
