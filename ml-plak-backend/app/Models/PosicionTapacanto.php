<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PosicionTapacanto extends Model
{
	protected $table    = 'posiciones_tapacantos';
	protected $fillable = ['posicion'];
	public $timestamps  = false;

	public function tapacantos()
	{
		return $this->hasMany(\App\Models\Tapacanto::class);
	}
}
