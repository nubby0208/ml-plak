<?php

namespace App\Main\Base\Models;

use Illuminate\Database\Eloquent\Model;

class ErrorProyectoMotivo extends Model
{
	protected $table    = 'error_proyecto_motivos';
	protected $fillable = ['name'];
}
