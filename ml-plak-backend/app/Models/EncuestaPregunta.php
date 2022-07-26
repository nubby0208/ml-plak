<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class EncuestaPregunta
 * 
 * @property int $id
 * @property int $id_encuesta
 * @property string $descripcion
 * @property bool $esPregunta
 * @property bool $esEstrella
 * @property bool $esTexto
 * @property bool $estado
 * 
 * @property Encuesta encuesta
 * @property Collection|EncuestaRespuesta[] $encuesta_respuesta
 *
 * @package App\Models
 */
class EncuestaPregunta extends Model
{
	protected $table = 'encuesta_pregunta';
	public $timestamps = false;

	protected $casts = [
		'id_encuesta' => 'int',
		'esPregunta' => 'bool',
		'esEstrella' => 'bool',
		'esTexto' => 'bool',
                'estado' => 'bool'
	];

	protected $fillable = [
		'id_encuesta',
		'descripcion',
		'esPregunta',
		'esEstrella',
		'esTexto',
                'estado'
	];

	public function encuesta()
	{
		return $this->belongsTo(Encuesta::class, 'id_encuesta');
	}

	public function encuesta_respuesta()
	{
		return $this->hasMany(EncuestaRespuesta::class, 'id_pregunta');
	}
}
