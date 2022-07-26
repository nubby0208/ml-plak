<?php

namespace App\Main\Base\Models;

use Illuminate\Database\Eloquent\Model;

class ProyectoEtapa extends Model
{
	protected $table    = 'proyecto_etapas';
	protected $fillable = ['name'];
}
