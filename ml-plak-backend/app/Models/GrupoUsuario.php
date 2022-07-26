<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use App\Models\Grupo;

/**
 * Class GrupoUsuario
 * 
 * @property int $id
 * @property int $usuario_id
 * @property int $grupo_id
 * @property boolean $activo
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Grupo $grupo
 * @property Usuario $usuario
 *
 * @package App\Models
 */
class GrupoUsuario extends Model
{
	protected $table = 'grupo_usuario';

	protected $casts = [
		'usuario_id' => 'int',
		'grupo_id' => 'int',
		'activo' => 'bool'
	];

	protected $fillable = [
		'usuario_id',
		'grupo_id'
	];

	public function grupo()
	{
		return $this->belongsTo(Grupo::class);
	}

	public function usuario()
	{
		return $this->belongsTo(Usuario::class);
	}
	
}
