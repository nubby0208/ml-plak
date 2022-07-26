<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoMaterial extends Model
{
  protected $table    = 'tipo_materiales';
	protected $fillable = ['tipo','caracter','descripcion'];

	public function materiales()
	{
		return $this->hasMany(\App\Models\Material::class);
	}
}
