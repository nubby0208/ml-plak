<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asistencia extends Model
{
	protected $table    = 'asistencias';
	protected $fillable = ['usuario_id', 'horario_id', 'observacion', 'fecha', 'asistencia_causa_id', 'tipo_asistencia_id', 'tipo_salida_id','justificacion','ajuste_hora'];
	public $timestamps  = false;

	protected $casts = [
		'justificacion' => 'boolean',
	];

	public function usuario()
	{
		return $this->belongsTo(\App\Models\Usuario::class, 'usuario_id');
	}

	public function horario()
	{
		return $this->belongsTo(\App\Models\Horario::class, 'horario_id');
	}

	public function asistencia_causa()
	{
		return $this->belongsTo(\App\Models\AsistenciaCausa::class, 'asistencia_causa_id');
	}

	public function tipo_asistencia()
	{
		return $this->belongsTo(\App\Models\TipoAsistencia::class, 'tipo_asistencia_id');
	}

	public function tipo_salida()
	{
		return $this->belongsTo(\App\Models\TipoSalida::class, 'tipo_salida_id');
	}
}
