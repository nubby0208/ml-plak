<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class MkGrupo extends Authenticatable
{
    public $timestamps = false;
	protected $table      = 'mk_grupo';
	protected $fillable   = ['grup_vtema','user_nid','grup_nsts','grup_dfechacreacion'];
	protected $primaryKey = 'grup_nid';

	public function usuario()
	{
		return $this->belongsTo(\App\Models\Usuario::class);
	}

	public function scopeGetMensajesSinLeer($model, $user_id = null)
	{
		$groups_activities = \App\Models\Activo::where('user_id', $user_id)
			->orderBy('act_nid', 'desc')
			->get()
			->unique('grupo_nid')
			->groupBy('grupo_nid')
			->toArray();
		$mensajes_grupo = null;

		$groups = [];
		$groups_raw = MkGrupo::orderBy('grup_nid', 'asc')
			->get()
			->pluck(null, 'grup_nid')
			->toArray();

		$messages = \App\Models\Grupomensajes::orderBy('grme_dfechaenvio', 'desc')
			->get()
			->unique('grup_nid')
			->toArray();
		
		foreach ($messages as $key => $item) {
			$group_id = (int) $item['grup_nid'];

			if (array_key_exists($group_id, $groups_raw) && !array_key_exists($group_id, $groups)) {
				$group_raw = $groups_raw[$group_id];
				$last_active = (array_key_exists($group_id, $groups_activities)) ? $groups_activities[$group_id][0] : null;

				$mensajes_no_leidos = \App\Models\Grupomensajes::where('grup_nid', $group_id);

				if ($last_active) {
					$mensajes_no_leidos->where('user_nid_envidox', '!=', $user_id);
					$mensajes_no_leidos->where('grme_dfechaenvio', '>=', $last_active['act_dfechaultima']);
				}

				$group_raw['mensajes_no_leidos'] = ($mensajes_no_leidos) ? $mensajes_no_leidos->count() : 0;
				$groups[$group_id] = $group_raw;
			}
		}

		$groups_diff = collect(($groups_raw))->diffKeys(($groups));
		$groups = collect($groups)->merge($groups_diff);

		return $groups;
	}
}
