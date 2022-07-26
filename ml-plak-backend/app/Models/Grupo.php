<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;
use App\Models\GrupoUsuario;
use App\Models\Usuario;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Grupo
 * 
 * @property int $id
 * @property string $nombre
 * @property bool $activo
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Collection|Usuario[] $usuarios
 *
 * @package App\Models
 */
class Grupo extends Model
{
	protected $table = 'grupos';

	protected $casts = [
		'activo' => 'bool'
	];

	protected $fillable = [
		'nombre_grupo',
		'activo'
	];

	public function grupoUsuarios()
    {
        return $this->hasMany(GrupoUsuario::class);
    }
}
