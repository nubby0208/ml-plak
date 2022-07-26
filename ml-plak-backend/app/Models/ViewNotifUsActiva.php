<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class ViewNotifUsActiva extends Authenticatable
{
    # public $timestamps = false;
	protected $table      = 'view_notif_us_activas';
	protected $fillable   = ["id", "sector_id", "periodo_repeticion_id", "titulo", "contenido", "fecha_inicio", 
	                          "fecha_fin", "activo", "usuario_id", "num_repeticion", "num_vista", "vista"];

	
	public function usuario()
	{
		return $this->belongsTo(\App\Models\Usuario::class);
	}


}
