<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
	protected $table    = 'roles';
	protected $fillable = ['rol'];
	public $timestamps  = false;

	public function usuarios()
	{
		return $this->hasMany(\App\Models\Usuario::class);
	}
}
