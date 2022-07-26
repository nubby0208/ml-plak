<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class ViewPiezaHistorial extends Model implements Auditable
{
	use \OwenIt\Auditing\Auditable;

	protected $table    = 'view_historial_piezas';
	protected $fillable = [
		'pieza_id', 'estado_id', 'etapa_id', 'usuario_id', 'comentario', 'created_at', 'id_aux', 'etapa', 'usuario', 'nombre_completo', 'pieza', 'estado'
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
