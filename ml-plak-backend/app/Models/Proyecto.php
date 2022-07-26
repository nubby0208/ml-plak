<?php

namespace App\Models;

use App\Models\Exportar;
use App\Models\ProyectoJson;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Proyecto extends Model implements Auditable
{
	use \OwenIt\Auditing\Auditable;

	protected $table = 'proyectos';

	protected $fillable = ['proyecto', 'valor_total', 'senia', 'instalacion_fecha', 'instalacion_comentario', 'instalacion_nota', 'cliente_id','token_project','assignPiezas', 'assignPrearmado', 'assignCajones', 'assignTapacantos', 'assignModulos', 'assignPiezasDate', 'assignPrearmadoDate', 'assignCajonesDate', 'assignTapacantosDate', 'assignModulosDate', 'assistants', 'grupos', 'observaciones' , 'finalizado', 'activo', 'comentario_adicional'];

    protected $appends = ['detalles_exportacion'];

	public function cliente()
	{
		return $this->belongsTo(\App\Models\Cliente::class);
	}

    public function encuestarespuesta()
    {
        return $this->hasMany(\App\Models\EncuestaRespuesta::class,'id_proyecto', 'id');
    }

    public function actionnotes()
    {
        return $this->hasMany(\App\Models\ActionNotes::class,'proyecto_id', 'id');
    }

    public function medicioninstalacion()
    {
        return $this->hasMany(\App\Models\MedicionInstalacion::class,'proyecto_id', 'id');
    }

    public function capacidadproduccion()
    {
        return $this->hasMany(\App\Models\CapacidadProduccionProyecto::class,'proyecto_id', 'id');
    }

    public function capacidadproduccionproyecto()
    {
        return $this->hasMany(\App\Models\CapacidadProduccionProyecto::class,'proyecto_id', 'id');
    }

	public function modulosfiltrados()
	{
		return $this->hasMany(\App\Models\Modulo::class, 'proyecto_id', 'id')
                    ->where('modulo','not like','% (2)%');
	}

    public function modulos()
	{
		return $this->hasMany(\App\Models\Modulo::class, 'proyecto_id', 'id');
	}

    public function assignPiezas()
    {
        return $this->hasOne(\App\Models\Usuario::class, 'id', 'assignPiezas');
    }

    public function responsible()
    {
        return $this->hasOne(\App\Models\Responsible::class, 'proyecto_id', 'id');
    }

    public function assignPrearmado()
    {
        return $this->hasOne(\App\Models\Usuario::class, 'id', 'assignPrearmado');
    }

    public function assignCajones()
    {
        return $this->hasOne(\App\Models\Usuario::class, 'id', 'assignCajones');
    }

    public function assignTapacantos()
    {
        return $this->hasOne(\App\Models\Usuario::class, 'id', 'assignTapacantos');
    }

    public function assignModulos()
    {
        return $this->hasOne(\App\Models\Usuario::class, 'id', 'assignModulos');
    }

	public function metadata()
	{
		return $this->hasOne(\App\Models\ProyectoMetadata::class, 'proyecto_id', 'id');
	}

	public function metadata_materiales()
	{
		return $this->hasMany(\App\Models\ProyectoMetadataMaterial::class, 'proyecto_id', 'id');
	}

    public function getDetallesExportacionAttribute(){
        try {
            $exportar = Exportar::where("token_proyect", $this->token_project)->first();
            if($exportar){
                $exportar->decodeData();
                return $exportar;
            }
            return [];
        } catch (\Throwable $th) {
            return [];
        }
    }

    public function getProgresoTotalAttribute()
    {
        $total = [];

        $total['modulos']          = $this->modulosfiltrados()->where('estado_id', 3)->where('is_cajon', 0)->count();
        $total['cajones']          = $this->modulosfiltrados()->where('estado_id', 3)->where('is_cajon', 1)->count();
        $total['total_modulos']    = $this->modulosfiltrados()->where('is_cajon', 0)->count();
        $total['total_cajones']    = $this->modulosfiltrados()->where('is_cajon', 1)->count();
        $total['piezas']           = 0;
        $total['piezas_total']     = 0;
        $total['tapacantos']       = 0;
        $total['tapacantos_total'] = 0;
        $total['prearmados']       = 0;
        $total['prearmados_total'] = 0;
        $total['actionnotes']      = $this->actionnotes()->where('estado_id', 3)->count();
        $total['actionnotes_total']= $this->actionnotes()->count();

        $total['total'] = 0;

        foreach ($this->modulos as $modulo) {
            if ($modulo->piezas->count() > 0) {
                $total['piezas'] += (int) $modulo->piezas()->where('estado_id', 3)->count();
                $total['piezas_total'] += (int) $modulo->piezas()->count();
                $total['prearmados'] += (int) $modulo->piezas()->where('prearmado_estado_id', 3)->count();

                foreach ($modulo->piezas as $piezas) {
                    $total['tapacantos'] += (int) $piezas->tapacantos()->where('estado_id', 3)->count();
                    $total['tapacantos_total'] += (int) $piezas->tapacantos()->count();
                }
            }
        }

        $stock = $this->metadata_materiales;
        $total['stock'] = (int) $stock->where('estado_id', 3)->count();
        $total['stock_total'] = (int) $stock->count();

        // var_dump($this->id.'-'.$stock->count().'-'.($stock->count() > 0) );

        $total['prearmados_total'] = $total['piezas_total'];
        $porcejPiezas = ($total['piezas'] / $total['piezas_total']) * 100;
        $porcejStock = ($stock->count() > 0) ? ($total['stock'] / $total['stock_total']) * 100 : 0;
        $porcejTapacantos = ($total['tapacantos'] / $total['tapacantos_total']) * 100;
        $porcejPrearmado = ($total['prearmados'] / $total['prearmados_total']) * 100;
        $porcejModulos = ($total['modulos'] / $total['total_modulos']) * 100;
        $porcejActionNotes = 0;
	    	$porcejCajones = 0;

        $cont=4;
        $total['total'] = ($porcejPiezas + $porcejTapacantos + $porcejPrearmado + $porcejModulos);

        if ($total['total_cajones']) {
            $porcejCajones = ($total['cajones'] / $total['total_cajones']) * 100;
            $cont++;
            $total['total'] = $total['total'] + $porcejCajones;
        } else
            $porcejCajones = 100;

        if ($total['actionnotes_total']) {
            $porcejActionNotes = ($total['actionnotes'] / $total['actionnotes_total']) *100;
            $cont++;
            $total['total'] = $total['total'] + $porcejActionNotes;
        } else
            $porcejActionNotes = 100;

        $total['total'] = $total['total'] / $cont;

        $total['porcentaje_piezas'] = $porcejPiezas;
        $total['porcentaje_stock'] = $porcejStock;
        $total['porcentaje_tapacantos'] = $porcejTapacantos;
        $total['porcentaje_prearmados'] = $porcejPrearmado;
        $total['porcentaje_modulos'] = $porcejModulos;
		    $total['porcentaje_cajones'] = $porcejCajones;
        $total['porcentaje_actionnotes'] = $porcejActionNotes;

        return $total;
        // var porcejPiezas = (cantPiezasOk / (cantPiezasOk + cantPiezasFa)) * 100;
        // var porcejTapacantos = (cantTapacantosOk / (cantTapacantosOk + cantTapacantosFa)) * 100;
        // var porcejPrearmado = (cantPrearmadoOk / (cantPrearmadoOk + cantPrearmadoFa)) * 100;
        // var porcejModulos = (cantModulosOk / (cantModulosOk + cantModulosFa)) * 100;
        // if (cantCajonesFa == 0 && cantCajonesOk == 0) {
        //     var porcejCajones = 100;
        //     var total = (porcejPiezas + porcejTapacantos + porcejPrearmado + porcejModulos) / 4;
        // } else {
        //     var porcejCajones = (cantCajonesOk / (cantCajonesOk + cantCajonesFa)) * 100;
        //     var total = (porcejPiezas + porcejTapacantos + porcejPrearmado + porcejModulos + porcejCajones) / 5;
        // }
        // response.proyectos[i].total = total;
    }
    
}
