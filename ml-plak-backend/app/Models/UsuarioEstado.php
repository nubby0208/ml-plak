<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class UsuarioEstado extends Model
{
    protected $guarded = [];
    public $timestamps = false;

    public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'usuario_id');
	}

	public function tipo_asistencia()
	{
		return $this->belongsTo(TipoAsistencia::class, 'tipo_asistencia_id');
	}

	public function getActivoAttribute()
	{
		$asistencia = Asistencia::where('usuario_id', $this->attributes['usuario_id'])
			->get()
			->last();
		
		if (is_null($asistencia) || Carbon::createFromFormat('Y-m-d H:i:s', $asistencia->fecha)->toDateString() != Carbon::today()->toDateString()) {
			return false;
		}

		$asistencia->load('tipo_asistencia');

		$tiposIngreso = [ 'Ingreso', 'Regreso de sitio', 'Ingreso después de la tarea', 'Ingreso a Horas Extras' ];

		return in_array($asistencia->tipo_asistencia->tipo, $tiposIngreso);
	}

	public function getUltimoIngresoAttribute()
	{	
		$tiposIngreso = TipoAsistencia::whereIn('tipo', [
				'Ingreso', 
				'Regreso de sitio', 
				'Ingreso después de tarea', 
				'Ingreso a Horas Extras' 
			])
			->get();

		$tiposIngresoIds = [];

		foreach ($tiposIngreso as $tipo) {
			$tiposIngresoIds[] = $tipo->id;
		}
		
		$ultimoIngreso = Asistencia::where('usuario_id', $this->attributes['usuario_id'])
			->whereIn('tipo_asistencia_id', $tiposIngresoIds)
			->get()
			->last();
			
		return !is_null($ultimoIngreso) ? $ultimoIngreso->fecha : '';
	}

	public function getUltimaSalidaAttribute()
	{
		$tiposSalida = TipoAsistencia::whereIn('tipo', [
			'Salida', 
			'Salida a sitio' 
		])
		->get();

	$tiposSalidaIds = [];

	foreach ($tiposSalida as $tipo) {
		$tiposSalidaIds[] = $tipo->id;
	}
	
	$ultimaSalida = Asistencia::where('usuario_id', $this->attributes['usuario_id'])
		->whereIn('tipo_asistencia_id', $tiposSalidaIds)
		->get()
		->last();
		
	return !is_null($ultimaSalida) ? $ultimaSalida->fecha : '';
	}

	public function getUltimoEstadoAttribute()
	{
		$query = UsuarioEstado::where('usuario_id', $this->attributes['usuario_id']);

		// Saltamos el ultimo estado si esta activo
		$isNoExpirado = isset($this->attributes['fecha_expiracion']) ? $this->attributes['fecha_expiracion'] > Carbon::today()->toDateString() : false;
		if ($isNoExpirado) {
			$query->where('id', '!=', $this->attributes['id']);
		}

		$ultimo_estado = $query->get()->last();
		
		return !is_null($ultimo_estado) ? $ultimo_estado->mensaje : '';
	}
}
