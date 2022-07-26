<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class PiezaHistorial extends Model implements Auditable
{
	use \OwenIt\Auditing\Auditable;
    const UPDATED_AT = null;

	protected $table    = 'piezas_historiales';	
	protected $fillable = [
		'pieza_id', 'estado_id', 'etapa_id', 'usuario_id', 'comentario', 'created_at' ];

}