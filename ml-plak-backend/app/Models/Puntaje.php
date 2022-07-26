<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Puntaje extends Model
{
    //
    protected $fillable = ['puntos','usuario_id','etapa','pieza_id'];

    /**
     * Para calcular los puntajes
     */
    public static function puntajes_nivel($piez,$etapa)
    {
        $complejidad_cortes = NivelComplejidad::where('etapa',$etapa)->get();
        
        $avetaporlveta = $piez->aveta * $piez->lveta;
        $piez->avetaporlveta = $avetaporlveta;
        if ($piez->estado_id == 3) {

            $baja = $piez->avetaporlveta>$complejidad_cortes[2]['min'] && $piez->avetaporlveta <= $complejidad_cortes[2]['max'];
            $media = $piez->avetaporlveta>$complejidad_cortes[1]['min'] && $piez->avetaporlveta <= $complejidad_cortes[1]['max'];
            $alto = $piez->avetaporlveta>$complejidad_cortes[0]['min'];
            if ($baja) {
                $piez->puntos = $complejidad_cortes[2]->puntos;
                $piez->nivel = $complejidad_cortes[2]['nivel'];
            }else if ($media) {
                $piez->puntos = $complejidad_cortes[1]->puntos;
                $piez->nivel = $complejidad_cortes[1]['nivel'];
            }else if ($alto) {
                $piez->puntos = $complejidad_cortes[0]->puntos;
                $piez->nivel = $complejidad_cortes[0]['nivel'];
            }
        }
        
        return $piez->puntos;
    }

    /**
     *  Obtiene el puntaje del cajon de la configuracion
     */
    public static function puntajeCajon()
    {
        return NivelComplejidad::where('tipo','cajones')->select('puntos')->first()->puntos;
    }

    public static function puntajeModulo($condicion = 'No')
    {
        return NivelComplejidad::where('tipo','modulos')->where('nivel',$condicion)->select('puntos')->first()->puntos;
    }

    public function usuario()
    {
        return $this->belongsTo(\App\Models\Usuario::class, 'usuario_id');
    }
}
