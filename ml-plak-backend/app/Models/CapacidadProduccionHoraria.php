<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CapacidadProduccionHoraria extends Model
{
	protected $table    = 'capacidad_produccion_horaria';
	protected $fillable = ['nombre','lunes','martes','miercoles','jueves','viernes','sabado','domingo','weekday'];

}
