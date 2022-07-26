<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditoriaGoogle extends Model
{
	protected $table    = 'auditoria_gsheet';
	protected $fillable = ['hoja_calculo', 'solapa', 'valor', 'usuario_id', 'pieza', 'valor_anterior'];

	public function usuario()
	{
		return $this->belongsTo(\App\Models\Usuario::class);
	}
}
