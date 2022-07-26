<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    protected $fillable = [
        'usuario_id',
        'mes',
        'anio',
        'monto',
        'comentario',
        'medio_pago',
        'usuario_id',
        'recibo_id',
        'status',
    ];

    public function usuario()
	{
		return $this->belongsTo(\App\Models\Usuario::class);
	}
}
