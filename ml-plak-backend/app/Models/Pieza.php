<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use App\Main\Base\Classes\ModelConst;
use App\Main\ControlErroresProyecto\Services\GetInfoErrorServices;

class Pieza extends Model implements Auditable
{
	use \OwenIt\Auditing\Auditable;

	protected $table    = 'piezas';
	protected $fillable = [
		'pieza', 'modulo_id', 'cantidad', 'posicion_x', 'posicion_y', 'posicion_z', 'lveta', 'aveta', 'espesor', 'proyecto_id', 'material_id', 'estado_id', 'orientacion', 'prearmado_estado_id', 'assignTask', 'assignTaskPrearmado','id_aux', 'tapacantos_estado_id', 'comentario', 'va_suelta', 'control_estado_id','suelta_estado_id', 'usuario_id'
	];
	protected $appends = ['hay_info_error','hay_info_error_tapacanto', 'hay_info_error_prearmado'];

	public function material()
	{
		return $this->belongsTo(\App\Models\Material::class);
	}

	public function estado()
	{
		return $this->belongsTo(\App\Models\Estado::class);
	}

	public function tapacantos()
	{
		return $this->hasMany(\App\Models\Tapacanto::class);
	}

	public function prearmado()
	{
		return $this->belongsTo(\App\Models\Estado::class, 'prearmado_estado_id');
	}

	public function control_estado()
	{
		return $this->belongsTo(\App\Models\Estado::class, 'control_estado_id');
	}

	public function sueltaestado()
	{
		return $this->belongsTo(\App\Models\Estado::class, 'suelta_estado_id');
	}

	public function modulo()
	{
		return $this->belongsTo(\App\Models\Modulo::class);
	}

    public function usuario()
    {
        return $this->belongsTo(\App\Models\Usuario::class, 'assignTask');
    }

    public function usuarioPrearmado()
    {
        return $this->belongsTo(\App\Models\Usuario::class, 'assignTaskPrearmado');
    }

    public function punto_pieza()
    {
        return $this->hasMany(\App\Models\PuntoPieza::class);
    }

	public function calcos()
	{
		return $this->hasMany(\App\Models\Calco::class);
	}

	public function getHayInfoErrorAttribute()
	{
		return GetInfoErrorServices::execute(ModelConst::PROYECTO_AREA_CORTE, $this->id);
	}

	public function getHayInfoErrorTapacantoAttribute()
	{
		return GetInfoErrorServices::execute(ModelConst::PROYECTO_AREA_TAPACANTO, $this->id);
	}

	public function getHayInfoErrorPrearmadoAttribute()
	{
		return GetInfoErrorServices::execute(ModelConst::PROYECTO_AREA_PREARMADO, $this->id);
	}
}
