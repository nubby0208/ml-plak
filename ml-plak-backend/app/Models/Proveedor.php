<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Proveedor extends Model
{
    protected $fillable = [
        'empresa',
        'contacto',
        'email',
        'telefono',
        'direccion',
        'estado',
    ];

    public function pedidos()
	{
		return $this->hasMany(\App\Models\Pedido::class);
	}
}
