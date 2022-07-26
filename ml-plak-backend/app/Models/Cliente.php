<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
	protected $table    = 'clientes';
	protected $fillable = ['nombre_completo', 'direccion', 'telefono'];
	protected $appends  = ['has_projects_active'];

	public function proyectos()
	{
		return $this->hasMany(\App\Models\Proyecto::class);
	}

	public function getHasProjectsActiveAttribute()
	{
		$active = false;

		if ($this->proyectos->count() > 0) {
			foreach ($this->proyectos as $index => $proyecto) {
        if (count($proyecto->medicioninstalacion) == 0) {
          $date4add = (new \DateTime($proyecto->instalacion_fecha))->add(new \DateInterval('P4D'));

          if ((($proyecto->activo == NULL) && ($date4add > (new \DateTime('now')))) || ($proyecto->activo == 1)) {
            $active = true;
            break;
          }
        }
        else{
          foreach ($proyecto->medicioninstalacion as $index => $proyecto2) {
            $date4add = (new \DateTime($proyecto2->fecha_medinst))->add(new \DateInterval('P4D'));

            if ((($proyecto->activo == NULL) && ($date4add > (new \DateTime('now')))) || ($proyecto->activo == 1)) {
              $active = true;
              break;
            }
          }
        }
			}
		}

		return $active;
	}
}
