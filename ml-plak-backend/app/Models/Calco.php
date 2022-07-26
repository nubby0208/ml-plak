<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Calco extends Model
{
	protected $table = 'calcos';
	protected $fillable = ['calco', 'pieza_id'];

	public function pieza()
	{
		return $this->belongsTo(\App\Models\Pieza::class);
	}
}
