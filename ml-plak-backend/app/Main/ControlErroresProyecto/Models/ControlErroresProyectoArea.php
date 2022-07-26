<?php

namespace App\Main\ControlErroresProyecto\Models;

use App\Main\Base\Models\ErrorProyectoMotivo;
use App\Main\Base\Models\ProyectoArea;
use App\Main\Base\Models\ProyectoEtapa;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class ControlErroresProyectoArea extends Model implements Auditable
{
	use \OwenIt\Auditing\Auditable;
	protected $table = 'control_errores_proyecto_areas';
	protected $fillable = [
		'proyecto_area_type',
		'proyecto_area_id',
		'proyecto_etapa_id',
		'error_proyecto_motivo_id',
		'comentario'
	];

	public function proyectoArea()
	{
		return $this->belongsTo(ProyectoArea::class, 'proyecto_area_type', 'id');
	}

	public function proyectoEtapa()
	{
		return $this->belongsTo(ProyectoEtapa::class, 'proyecto_etapa_id', 'id');
	}

	public function errorProyectoMotivo()
	{
		return $this->belongsTo(ErrorProyectoMotivo::class, 'error_proyecto_motivo_id', 'id');
	}
}
