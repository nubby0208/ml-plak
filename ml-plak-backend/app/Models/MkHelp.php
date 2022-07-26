<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MkHelp extends Model
{
    protected $table = 'mk_ayudas';
    protected $fillable = ['id','categoria_id', 'titulo', 'contenido', 'ruta_archivo', 'ruta_img',  'activo', 'created_us_id', 'updated_us_id' ];

   
	public function categoria()
	{
        return $this->belongsTo(\App\Models\MkHelpCategory::class,'categoria_id',  'id');

	}
    
    
    
    public function categoria2()
    {

         return $this->hasOne('App\Models\MkHelpCategory', 'categoria_id', 'id');
        // return $this->hasMany('App\Models\MkHelpCategory', 'categoria_id', 'id');  // no found
        // return $this->hasMany('App\Models\MkHelpCategory', 'mk_ayudas_categoria_id_fk', 'id');
        // return $this->hasMany('App\Article', 'nombre_clave_foranea', 'nombre_clave_primaria_local');
        // return $this->hasOne('App\Models\MkHelpCategory');
    }
    
    /*



    /*
    return $this->hasMany('App\Article', 'nombre_clave_foranea', 'nombre_clave_primaria_local');
	public function usuario()
	{
        return $this->belongsTo(\App\Models\Usuario);
		// return $this->belongsTo(\App\Models\Usuario::class);
	}
    */    

}


