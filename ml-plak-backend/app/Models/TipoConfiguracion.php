<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoConfiguracion extends Model
{
	protected $table = 'tipos_configuraciones';
	protected $fillable = ['tipo'];
	public $timestamps = false;

	public function configuraciones()
	{
		return $this->hasMany(\App\Models\Configuracion::class);
	}
}
