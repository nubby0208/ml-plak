<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recibo extends Model
{
    protected $table      = 'recibo_salarios';
    
    protected $fillable = [
        'usuario_id',
        'mes',
        'anio',
        'dias_laborables',
        'dias_laborados',
        'horas_trabajadas_reales',
        'faltas_justificadas',
        'faltas_injustificadas',
        'horas_debidas',
        'horas_trabajadas',
        'horas_extras',
        'horas_sabado_ingles',
        'horas_feriadas',
        'valor_hora',
        'valor_suma_no_remunerativa',
        'valor_asignacion_extraordinaria',
        'valor_hora_sabado_ingles',
        'hora_x_falta_justificadas',
        'hora_x_falta_injustificadas',
        'hora_mas_falta_justificadas',
        'valor_hora_extra',
        'antiguedad',
        'valor_descuento',
        'presentismo',
        'valor_jubilacion', 
        'valor_innslp',  
        'valor_obra_social', 
        'valor_sindicato',
        'valor_seguro_vida', 
        'valor_plus_mes',
        'subtotal_descuento',
        'subtotal_remunerativo',
        'subtotal_noremunerativo',
        'total',
        'status',
    ];

    public function usuario()
	{
		return $this->belongsTo(\App\Models\Usuario::class);
	}
}
