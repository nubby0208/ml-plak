<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsuariosHorario extends Model
{
    protected $table    = 'usuarios_horarios';
	protected $fillable = ['hora_inicio_lunes',
                'hora_fin_lunes',
                'habilitado_lunes',
                'hora_inicio_martes',
                'hora_fin_martes',
                'habilitado_martes',
                'hora_inicio_miercoles',
                'hora_fin_miercoles',
                'habilitado_miercoles',
                'hora_inicio_jueves',
                'hora_fin_jueves',
                'habilitado_jueves',
                'hora_inicio_viernes',
                'hora_fin_viernes',
                'habilitado_viernes',
                'hora_inicio_sabado',
                'hora_fin_sabado',
                'habilitado_sabado',
                'hora_inicio_domingo',
                'hora_fin_domingo',
                'habilitado_domingo',
                'valor_x_hora',
                'valor_plus',
                'sistema',
                'is_default'];

	public function usuario()
	{
		return $this->belongsTo(\App\Models\Usuario::class);
	}

    public function hoursByDay($day)
    {
        $inicio = "hora_inicio_$day";
        $fin = "hora_fin_$day";
        $entrada = new \Datetime($this->{$inicio});
		$salida = new \Datetime($this->{$fin});
		return $entrada->diff($salida)->h;
    }

    public function getHoraInicio($day)
    {
        $attr = "hora_inicio_$day";
		return $this->{$attr};
    }

    public function getHoraFin($day)
    {
        $attr = "hora_fin_$day";
		return $this->{$attr};
    }

    public function habilitado($day)
    {
        $able = "habilitado_$day";
		return $this->{$able};
    }
}
