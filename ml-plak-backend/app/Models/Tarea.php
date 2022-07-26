<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Tarea
 *
 * @property int $id
 * @property int $tipo_tarea_id
 * @property int $grupo_id
 * @property int $usuario_id
 * @property string $descripcion
 * @property string detalle_descripcion
 * @property bool $realizado
 * @property int $ver_calendario
 * @property date $fecha_calendario
 * @property Carbon $created_at
 * @property Carbon $updated_at
 *
 * @package App\Models
 */
class Tarea extends Model
{
	protected $table = 'tarea';
	public $incrementing = false;

	protected $casts = [
		'id' => 'int',
		'tipo_tarea_id' => 'int',
		'grupo_id' => 'int',
		'usuario_id' => 'int',
		'realizado' => 'bool',
    'ver_calendario' => 'int',
    'fecha_calendario' => 'date'
	];

	protected $fillable = [
		'id',
		'tipo_tarea_id',
		'grupo_id',
		'usuario_id',
		'descripcion',
    'detalle_descripcion',
		'realizado',
    'ver_calendario',
    'fecha_calendario'
	];

  public function grupo()
	{
		return $this->belongsTo(Grupo::class);
	}
}
