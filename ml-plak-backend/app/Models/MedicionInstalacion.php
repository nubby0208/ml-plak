<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class MedicionInstalacion extends Model
{
	protected $table    = 'medicion_instalacion_proyecto';
	protected $fillable = [
    "fecha_medinst",
    "comentario",
    "tipo_medinst",
    "proyecto_id",
    "token_project",
    "exported",
  ];

  protected $appends = ['proyectojson_detail'];

  public function proyecto()
	{
		return $this->belongsTo(Proyecto::class);
	}

  public function proyectojson()
	{
		return $this->belongsTo(ProyectoJson::class);
	}

  public function getProyectojsonDetailAttribute()
	{
    $proy = ProyectoJson::select('nombre','client_name','mueble')
                        ->where('token_project',$this->token_project)
                        ->orderBy('id','DESC')->first();
    if ($proy !== null)
    {
      $detail = "";
      if ($proy->client_name!==null)
          $detail = $proy->client_name;
      if ($proy->mueble!==null) {
        if (empty($detail) === false)
          $detail .= " - " . $proy->mueble;
        else
          $detail = $proy->mueble;
      }

      return $detail;
    }
    return "";
	}
}

