<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Presupuesto extends Model
{
  protected $table = 'presupuesto';
  protected $fillable = ['token', 'proyecto_id', 'fecha', 'fecha_cotizacion', 'results', 'estado', 'imagen1', 'imagen2', 'imagen3', 'imagen4',
                         'asignado_id', 'dificultad_id', 'prioridad_id', 'seguimiento_id', 'economia_id'];
  public $timestamps  = false;
}
