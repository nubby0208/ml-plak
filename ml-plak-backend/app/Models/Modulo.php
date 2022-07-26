<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use App\Main\Base\Classes\ModelConst;
use App\Main\ControlErroresProyecto\Services\GetInfoErrorServices;

class Modulo extends Model implements Auditable
{
	use \OwenIt\Auditing\Auditable;

	protected $table = 'modulos';
	protected $fillable = ['modulo', 'proyecto_id', 'estado_id', 'modulo_id', 'is_cajon', 'armado','comentario','descripcion','id_aux', 'control_estado_id', 'piezas_sueltas','piezas_sueltas_controladas'];
	protected $appends = ['hay_info_error','hay_info_error_cajon'];

	public function proyecto()
	{
		return $this->belongsTo(\App\Models\Proyecto::class);
	}

	public function estado()
	{
		return $this->belongsTo(\App\Models\Estado::class);
	}

	public function control_estado()
	{
		return $this->belongsTo(\App\Models\Estado::class, 'control_estado_id');
	}

	public function piezas()
	{
		return $this->hasMany(\App\Models\Pieza::class);
	}

	public function piezasueltas()
	{
		return $this->hasMany(\App\Models\Pieza::class)->where('va_suelta',1);
	}

	public function cajones()
	{
		return $this->hasMany(\App\Models\Modulo::class);
	}

	public function modulo_parent()
	{
		return $this->belongsTo(\App\Models\Modulo::class, 'modulo_id');
	}

	public function punto_pieza()
	{
	    return $this->hasMany(\App\Models\PuntoPieza::class);
	}

	public function getHayInfoErrorAttribute()
	{
		return GetInfoErrorServices::execute(ModelConst::PROYECTO_AREA_MODULO, $this->id);
	}

	public function getHayInfoErrorCajonAttribute()
	{
		return GetInfoErrorServices::execute(ModelConst::PROYECTO_AREA_CAJON, $this->id);
	}

}
