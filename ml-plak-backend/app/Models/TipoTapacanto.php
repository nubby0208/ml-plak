<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoTapacanto extends Model
{
	protected $table    = 'tipos_tapacantos';
	protected $fillable = ['tipo'];
	public $timestamps  = false;

	public function tapacantos()
	{
		return $this->hasMany(\App\Models\Tapacanto::class);
	}
}
