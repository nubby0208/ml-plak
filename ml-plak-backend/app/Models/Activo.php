<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;
use OwenIt\Auditing\Contracts\Auditable;

class Activo extends Authenticatable
{
    public $timestamps = false;
	protected $table      = 'mk_activo';
	protected $fillable   = ['act_dfechaultima','user_id','grupo_nid'];
	protected $primaryKey = 'act_nid';

	public function usuario()
	{
		return $this->belongsTo(\App\Models\Usuario::class, 'user_id', 'id');
	}


}



