<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConfiguracionMensual extends Model
{
    protected $table = 'configuraciones_mensuales';

    protected $fillable = [
        'usuario_id',
        'mes',
        'anio',
        'rango_id',
        'valor_x_hora',
        'hora_extra',
        'sabado_ingles',
        'valor_plus_mes',
        'valor_plus',
        'descuento',
        'presentismo',
        'forzar_presentismo',
        'forzar_presentismo_porcentaje',
        'sistema_horario',
        'antiguedad',
        'status',
        'jubilacion',
        'innslp', 
        'obra_social',
        'sindicato',
        'seguro_vida',
        'asignacion_extraordinaria',
        'suma_no_remunerativa',
        'remu_plus_mes',
        'remu_descuento' 
    ];

    protected $appends = [
        'valor_hora_extra',
        'valor_hora_sabado_ingles',
    ];

    const RULES = [
        'usuario_id' => 'required|exists:mysql.usuarios,id',
        'mes' => 'required',
        'anio' => 'required',
        'rango_id' => 'required|exists:mysql.rangos,id',
        'hora_extra' => 'numeric|min:0',
        'sabado_ingles' => 'numeric|min:0',
        'valor_plus_mes' => 'numeric',
        'valor_plus' => 'numeric',
        'descuento' => 'numeric',
        'forzar_presentismo' => 'in:0,1,2',
        'forzar_presentismo_porcentaje' => 'numeric|min:0',
        'sistema_horario' => 'in:0,1,2',
        'antiguedad' => 'numeric|min:0',
        'jubilacion' => 'numeric|min:0',
        'innslp' => 'numeric|min:0',
        'obra_social' => 'numeric|min:0',
        'sindicato' => 'numeric|min:0',
        'seguro_vida' => 'numeric|min:0',
        'asignacion_extraordinaria' => 'numeric',
        'suma_no_remunerativa' => 'numeric',
        'remu_descuento' => 'required|min:0|max:1',
        'remu_plus_mes' => 'required|min:0|max:1',
        'status' => 'numeric|min:0|max:1'
    ];

    public function rango()
	{
		return $this->belongsTo(\App\Models\Rango::class, 'rango_id');
	}
    
    public function getValorHoraExtraAttribute()
    {
        return $this->valor_x_hora * (1 + $this->hora_extra / 100);
    }

    public function getValorHoraSabadoInglesAttribute()
    {
        return $this->valor_x_hora * (1+ $this->sabado_ingles / 100);
    }
}
