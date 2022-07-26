<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Imagenevento extends Model
{
	protected $table    = 'imagenes_eventos';
	protected $fillable = ['imagen','evento_id'];
	//public $timestamps  = false;

	public function Imagenevento()
	{
		return $this->hasMany(\App\Models\Imagenevento::class);
	}

    
}