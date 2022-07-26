<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class MkTarea extends Authenticatable
{
    public $timestamps = false;
	protected $table      = 'mk_tareas';
	protected $fillable   = ['tar_vmensaje','tar_nsts','tar_dfechacreacion','user_nid'];
	protected $primaryKey = 'tar_nid';

	public function usuario()
	{
		return $this->belongsTo(\App\Models\Usuario::class);
	}


}
