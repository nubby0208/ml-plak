<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class ViewHistorialTaller extends Model implements Auditable
{
	use \OwenIt\Auditing\Auditable;

	protected $table    = 'view_historial_taller';
	protected $fillable = [
		'estado_id', 'etapa_id', 'usuario_id', 'campo_id', 'desc_campo', 'comentario',
		'created_at',  'usuario', 'nombre_completo', 'estado', 'etapa',
	];

	public function estado()
	{
		return $this->belongsTo(\App\Models\Estado::class);
	}


    public function usuario()
    {
        return $this->belongsTo(\App\Models\Usuario::class, 'assignTask');
    }

}
