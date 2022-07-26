<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProyectoActividad extends Model
{

    
    protected $table = 'proyectos_actividades';
    protected $fillable = ['id', 'proyecto_id', 'actividad_id', 'usuario_id','fecha_inicio', 'fecha_fin',  'tiempo', 'actividad', 'observacion'];

   
	public function proyecto()
	{
        return $this->belongsTo(\App\Models\Proyectos::class,'proyecto_id',  'id');

	}
    
    
      /*
    public function categoria2()
    {

         return $this->hasOne('App\Models\MkHelpCategory', 'categoria_id', 'id');
        // return $this->hasMany('App\Models\MkHelpCategory', 'categoria_id', 'id');  // no found
        // return $this->hasMany('App\Models\MkHelpCategory', 'mk_ayudas_categoria_id_fk', 'id');
        // return $this->hasMany('App\Article', 'nombre_clave_foranea', 'nombre_clave_primaria_local');
        // return $this->hasOne('App\Models\MkHelpCategory');
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


