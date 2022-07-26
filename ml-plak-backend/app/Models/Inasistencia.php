<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inasistencia extends Model
{
	protected $table    = 'inasistencias';
	protected $fillable = ['usuario_id', 'fecha1', 'fecha2'];
	public $timestamps  = true;

	public function usuario()
	{
		return $this->belongsTo(Usuario::class, 'usuario_id');
	}

	public function inasistenciaDoc()
	{
		return $this->hasMany(InasistenciaDoc::class, 'inasistencia_id');
	}

}
