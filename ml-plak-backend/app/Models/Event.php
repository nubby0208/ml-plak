<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
	protected $table    = 'events';
	protected $fillable = ['descripcion','direccion','hora_inicio','tarea','nombre','telefono','dia','id','assignTask','assistants','grupos','latitud','longitud'];
	public $timestamps  = false;

	public function events()
	{
		return $this->hasMany(\App\Models\Event::class);
	}

    public function assignTask()
    {
        return $this->hasOne(\App\Models\Usuario::class, 'id', 'assignTask');
    }
}
