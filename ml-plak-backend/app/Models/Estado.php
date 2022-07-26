<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estado extends Model
{
	protected $table    = 'estados';
	protected $fillable = ['estado'];
	public $timestamps  = false;

	public function piezas()
	{
		return $this->hasMany(\App\Models\Pieza::class);
	}

	public function piezas_prearmadas()
	{
		return $this->hasMany(\App\Models\Pieza::class, 'prearmado_estado_id');
	}
}
