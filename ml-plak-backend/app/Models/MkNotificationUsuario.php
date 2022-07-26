<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class MkNotificationUsuario extends Authenticatable 
{
    # public $timestamps = false;
	protected $table      = 'mk_notificaciones_usuarios';
	protected $fillable   = ['id','notificacion_id', 'sector_id', 'usuario_id','num_vista', 'vista'];
	# protected $primaryKey = 'tar_nid';
	
	public function usuario()
	{
		return $this->belongsTo(\App\Models\Usuario::class);
	}


}
