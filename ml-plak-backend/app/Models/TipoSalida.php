<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoSalida extends Model
{
	protected $table    = 'tipos_salidas';
	protected $fillable = ['tipo'];
	public $timestamps  = false;

	public function asistencias()
	{
		return $this->hasMany(\App\Models\Asistencia::class);
	}
}
