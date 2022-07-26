<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use App\Main\Base\Classes\ModelConst;
use App\Main\ControlErroresProyecto\Services\GetInfoErrorServices;

class ActionNotes extends Model implements Auditable
{
	use \OwenIt\Auditing\Auditable;

	protected $table = 'action_notes';
	protected $fillable = ['name', 'description', 'modulo_id', 'proyecto_id', 'estado_id', 'commentary','created_by', 'updated_by','token_project', 'orig_modulo_id','exported'];
	protected $appends = ['hay_info_error'];

	public function proyecto()
	{
		return $this->belongsTo(\App\Models\Proyecto::class);
	}

	public function estado()
	{
		return $this->belongsTo(\App\Models\Estado::class);
	}

	public function getHayInfoErrorAttribute()
	{
		return GetInfoErrorServices::execute(ModelConst::PROYECTO_AREA_NOTA_ACCION, $this->id);
	}
}
