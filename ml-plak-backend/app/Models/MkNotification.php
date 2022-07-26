<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MkNotification extends Model
{
    protected $table = 'mk_notificaciones';
    protected $fillable = ['id','sector_id','periodo_repeticion_id','titulo', 'contenido', 'num_repeticion', 'fecha_inicio', 'fecha_fin', 'activo', 'created_us_id', 'updated_us_id' ];

   
	public function notUsuario()
	{
        return $this->belongsTo(\App\Models\MkNotificationUsuario::class,'notificacion_id',  'id');

	}
    



   
    /*
    return $this->hasMany('App\Article', 'nombre_clave_foranea', 'nombre_clave_primaria_local');
	public function usuario()
	{
        return $this->belongsTo(\App\Models\Usuario);
		// return $this->belongsTo(\App\Models\Usuario::class);
	}
    */    

}


