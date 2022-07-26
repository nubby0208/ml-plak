<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PuntoPieza extends Model
{
    protected $table    = 'puntos_piezas';
    protected $fillable = ['pieza_id','usuario_id_corte',
        'usuario_id_prearmado',
        'usuario_id_tapacantos',
        'usuario_id_modulo',
        'usuario_id_cajones',
        'puntos_corte',
        'puntos_prearmado',
        'puntos_tapacantos',
        'puntos_modulo',
        'puntos_cajones',
    ];

    public function pieza()
    {
        return $this->belongsTo(\App\Models\Pieza::class);
    }

    public function modulo()
    {
        return $this->belongsTo(\App\Models\Modulo::class);
    }
}
