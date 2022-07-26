<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Configuracion extends Model
{
	protected $table = 'configuraciones';
	protected $fillable = ['nombre', 'elementos', 'tipo_configuracion_id'];

	public function tipo_configuracion()
	{
		return $this->belongsTo(\App\Models\TipoConfiguracion::class);
	}

	public function forApi($with_id = false)
	{
		$data = [
			'name'   => $this->nombre,
			'type'   => $this->tipo_configuracion->tipo,
			'values' => json_decode($this->elementos)
		];

		if ($with_id) {
			$data['id'] = $this->id;
		}

		return $data;
	}

	public function onlyElements()
	{
		return [
			'id'   => $this->id,
			'name' => $this->nombre,
			'type' => $this->tipo_configuracion->tipo,
		];
	}
}
