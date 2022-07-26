<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;
use OwenIt\Auditing\Contracts\Auditable;

class Grupomensajes extends Authenticatable
{
    public $timestamps = false;
	protected $table      = 'mk_grupomensaje';
	protected $fillable   = ['grup_nid','user_nid_envidox','grme_vmensaje','grme_dfechaenvio'];
	protected $primaryKey = 'grme_nid';

	public function usuario()
	{
		return $this->belongsTo(\App\Models\Usuario::class);
	}

	public function grupo()
	{
		return $this->belongsTo(\App\Models\Grupo::class);
	}
}


