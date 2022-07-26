<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProyectoJson extends Model
{
    protected $table = 'proyectos_json';
    protected $fillable = ['nombre', 'proyecto','token_project','mueble',
        'client_name','address','phone','comentario','estado', 'settings','encargado_inst','encargado_med'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'settings' => 'array'
    ];

  public function medicioninstalacion()
	{
		return $this->hasMany(\App\Models\MedicionInstalacion::class);
	}

}
