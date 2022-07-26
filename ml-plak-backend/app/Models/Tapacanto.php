<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Tapacanto extends Model implements Auditable
{
	use \OwenIt\Auditing\Auditable;

	protected $table = 'tapacantos';
	protected $fillable = ['pieza_id', 'tipo_tapacanto_id', 'posicion_tapacanto_id', 'estado_id', 'assignTask', 'usuario_id'];

	public function pieza()
	{
		return $this->belongsTo(\App\Models\Pieza::class);
	}

	public function tipo_tapacanto()
	{
		return $this->belongsTo(\App\Models\TipoTapacanto::class);
	}

	public function material()
	{
		return $this->belongsTo(\App\Models\Material::class);
		//belongsTo($related, $foreignKey = null, $ownerKey = null, $relation = null)
	}

	public function posicion_tapacanto()
	{
		return $this->belongsTo(\App\Models\PosicionTapacanto::class);
	}

	public function estado()
	{
		return $this->belongsTo(\App\Models\Estado::class);
	}

}
