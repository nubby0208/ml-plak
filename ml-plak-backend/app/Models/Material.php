<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
	protected $table    = 'materiales';
	protected $fillable = ['material','espesor','link_textura2','precio_mt2','precio_placa','veta','ancho_veta','largo_veta','extra','nombre','alto','descuento_alto','descuento_ancho','tipo_material_id', 'material'];
	public $timestamps  = false;

	public function piezas()
	{
		return $this->hasMany(\App\Models\Pieza::class);
	}

	public function tipo_materiales()
	{
		return $this->belongsTo(\App\Models\TipoMaterial::class, 'tipo_material_id');
	}

	public function tapacantos()
	{
		return $this->hasMany(\App\Models\Tapacanto::class);
	}
}
