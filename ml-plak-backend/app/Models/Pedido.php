<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $fillable = [
        'producto',
        'cantidad',
        'cliente',
        'comentario',
        'imagen',
        'resumen',
        'usuario',
        'proveedor_id',
        'estado',
    ];

    public function proveedor()
	{
		return $this->belongsTo(\App\Models\Proveedor::class);
	}
}
