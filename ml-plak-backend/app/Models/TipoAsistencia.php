<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoAsistencia extends Model
{
	protected $table    = 'tipos_asistencias';
	protected $fillable = ['tipo'];
	public $timestamps  = false;

	public function asistencias()
	{
		return $this->hasMany(\App\Models\Asistencia::class);
	}
}
