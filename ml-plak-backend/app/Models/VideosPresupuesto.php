<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VideosPresupuesto extends Model
{
	protected $table    = 'videos_presupuesto';
	protected $fillable = ['token','video', 'nombre', 'remote'];
  public $timestamps  = false;

}
