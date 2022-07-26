<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImagenesPresupuesto extends Model
{
	protected $table    = 'imagenes_presupuesto';
	protected $fillable = ['token','imagen', 'name', 'remote'];
  public $timestamps  = false;

}
