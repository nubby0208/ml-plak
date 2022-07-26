<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class EncuestaRespuesta
 * 
 * @property int $id
 * @property int $id_proyecto
 * @property int $id_pregunta
 * @property int $usuario_id
 * @property string $respuesta
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property EncuestaPregunta $encuesta_pregunta
 * @property Usuario $usuario
 *
 * @package App\Models
 */
class EncuestaRespuesta extends Model
{
	protected $table = 'encuesta_respuesta';

	protected $casts = [
		'id_pregunta' => 'int',
		'id_proyecto' => 'int',
		'usuario_id' => 'int'
	];

	protected $fillable = [
		'id_pregunta',
        'id_proyecto',
		'usuario_id',
		'respuesta'
	];

	public function encuestapregunta()
	{
		return $this->belongsTo(EncuestaPregunta::class, 'id_pregunta');
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'usuario_id');
	}

	public function proyecto()
	{
		return $this->belongsTo(Proyecto::class, 'id_proyecto');
	}
}
