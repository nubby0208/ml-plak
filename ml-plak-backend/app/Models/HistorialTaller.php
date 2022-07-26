<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class HistorialTaller extends Model implements Auditable
{
	use \OwenIt\Auditing\Auditable;
    const UPDATED_AT = null;

	protected $table    = 'taller_historiales';	
	protected $fillable = ['estado_id', 'etapa_id', 'usuario_id',  'campo_id', 'desc_campo', 'comentario', 'created_at'];

}


