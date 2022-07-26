<?php

namespace App\Models;

use App\Models\ProyectoJson;
use Illuminate\Database\Eloquent\Model;

class Exportar extends Model
{
	protected $table    = 'exportar';
	protected $fillable = [
		'token_proyect',
		'usuario_solicitador',
		'usuario_confirmador',
		'data',
		'usuarios',
		'preguntas',
		'preguntas_ventas',
		'cometarios',
		'estado'
	];

    // public $timestamps  = false;

	public function decodeData()
	{
		$this->data = json_decode($this->data);
		$this->usuarios = json_decode($this->usuarios);
		$this->preguntas = json_decode($this->preguntas);
		$this->preguntas_ventas = json_decode($this->preguntas_ventas);
	}
	
	public function getProyectIdAttribute()
	{
		$proyectojson = ProyectoJson::selectRaw("id")->where("token_project", $this->token_proyect)->orderByDesc("id")->first();
		if($proyectojson){
			return $proyectojson->id;
		}
	}
	
}
