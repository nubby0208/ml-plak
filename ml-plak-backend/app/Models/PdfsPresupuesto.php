<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PdfsPresupuesto extends Model
{
	protected $table    = 'pdfs_presupuesto';
	protected $fillable = ['token','pdf', 'nombre'];
  public $timestamps  = false;

}
