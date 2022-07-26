<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;
use OwenIt\Auditing\Contracts\Auditable;
use Illuminate\Database\Eloquent\SoftDeletes;

class Usuario extends Authenticatable implements JWTSubject, Auditable
{
	use \OwenIt\Auditing\Auditable;
	use SoftDeletes;

	protected $table      = 'usuarios';
	protected $fillable   = ['correo_google', 'activo', 'usuario', 'password', 'nombre_completo','visible_en_planilla', 'cuit_cuil', 'rol_id','rango_id','fecha_ingreso','afip'];
	protected $primaryKey = 'id';
	protected $dates      = ['last_login_date', 'created_at', 'updated_at', 'delete_at'];
	protected $casts = [
		'permiso' => 'boolean',
	];

	public function asistencias()
	{
		return $this->hasMany(\App\Models\Asistencia::class);
	}

	public function horario()
	{
		return $this->hasOne(\App\Models\UsuariosHorario::class);
	}

	public function auditorias_google()
	{
		return $this->hasMany(\App\Models\AuditoriaGoogle::class);
	}

	public function rol()
	{
		return $this->belongsTo(\App\Models\Rol::class, 'rol_id');
	}

	public function rango()
	{
		return $this->belongsTo(\App\Models\Rango::class, 'rango_id');
	}

	public function activos()
	{
		return $this->hasMany(\App\Models\Activo::class, 'user_id', 'id');
	}

	/**
	 * Get the identifier that will be stored in the subject claim of the JWT.
	 *
	 * @return mixed
	 */
	public function getJWTIdentifier()
	{
		return $this->getKey();
	}

	/**
	 * Return a key value array, containing any custom claims to be added to the JWT.
	 *
	 * @return array
	 */
	public function getJWTCustomClaims()
	{
		return [];
	}

    public function chat_grupos()
    {
    	return $this->belongsToMany(\App\Models\ChatGrupo::class, 'chat_grupos_usuarios', 'usuario_id', 'chat_grupo_id')
    		->withPivot(['activo'])
    		->withTimestamps();
    }
}
