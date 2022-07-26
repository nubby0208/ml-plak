<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Pieza;
use App\Models\Usuario;
use App\Models\NivelComplejidad;
use App\Models\Puntaje;
use App\Models\PuntoPieza;
use App\Models\Asistencia;
use App\Models\Horario;
use App\Models\UsuariosHorario;
use DB;
use Carbon\Carbon;
use JWTAuth;

class PuntajesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    public function getPuntajes(Request $request)
    {
        

        $fecha_actual = date("d-m-Y");
        $fecha_prod = $request->fecha;

        $id_usuario = Usuario::where('usuario',$request->usuario)->first()->id;
        
        //$piezas = Pieza::where('id_aux',$id_usuario)->where('estado_id',3);

        $puntos = Puntaje::where('usuario_id',$id_usuario);
        #hoy
        $puntos_hoy = $puntos->whereDate('updated_at', date("Y-m-d"))->sum('puntos');
        #este mes
        $estemes = Puntaje::where('usuario_id',$id_usuario)->whereMonth('updated_at', date("n"))->whereYear('updated_at',date('Y'))->sum('puntos');
        // Ultimos 7 dias
        $semana_puntos = Puntaje::where('usuario_id',$id_usuario)->whereDate('updated_at', '>=', date("Y-m-d",strtotime($fecha_actual."- 7 days")))->sum('puntos');
        
        #mi mejor mes
        $mejor_mes = Puntaje::where('usuario_id',$id_usuario)->select(DB::raw('sum(puntos) as `puntos`'),DB::raw('count(*) as piezas'),DB::raw('YEAR(updated_at) year, MONTH(updated_at) month'))->groupBy('year','month')->orderBy('puntos','DESC')->first();

        //tres mejores puntajes
         $puntos_por_usuario = Puntaje::select(DB::raw('usuario_id, sum(puntos) as puntos'))->whereMonth('created_at', date("m",strtotime($fecha_prod)))->whereYear('created_at', date("Y",strtotime($fecha_prod)))->with(['usuario:id,usuario'])->groupBy('usuario_id')->orderBy('puntos','DESC')->limit($request->limit)->get();

        foreach ($puntos_por_usuario as $key => $ppu) {
            if( $ppu->usuario_id == null){
                $puntos_por_usuario->forget($key);
            }
            $ppu->horas_total = round($this->horasTotales($ppu->usuario_id, date("m",strtotime($fecha_prod)), date("Y",strtotime($fecha_prod))) - $this->horas_fueras_taller($ppu->usuario_id, null, date("m",strtotime($fecha_prod)), date("Y",strtotime($fecha_prod))), 2);
            $ppu->promedio = ($ppu->horas_total>0) ? $ppu->puntos/$ppu->horas_total : 0;
        }

        $promedios_por_usuario = Puntaje::select(DB::raw('usuario_id, sum(puntos) as puntos'))->whereMonth('created_at',date("m",strtotime($fecha_prod)))->whereYear('created_at',date("Y",strtotime($fecha_prod)))->with(['usuario:id,usuario'])->groupBy('usuario_id')->orderBy('puntos','DESC')->limit($request->limit)->get();
        foreach ($promedios_por_usuario as $key => $ppu) {
            if( $ppu->usuario_id == null){
                $promedios_por_usuario->forget($key);
            }
            $ppu->horas_total = $this->horasTotales($ppu->usuario_id, date("m",strtotime($fecha_prod)), date("Y",strtotime($fecha_prod)));
            $ppu->promedio = ($ppu->horas_total>0) ? $ppu->puntos/$ppu->horas_total : 0;
        }
        for ($i=1; $i < count($promedios_por_usuario); $i++) {
            for ($j=0; $j < count($promedios_por_usuario)-$i; $j++) {
                if ($promedios_por_usuario[$j]->promedio<$promedios_por_usuario[$j+1]->promedio) {
                    $aux = $promedios_por_usuario[$j];
                    $promedios_por_usuario[$j] = $promedios_por_usuario[$j+1];
                    $promedios_por_usuario[$j+1]=$aux;
                }

            }
        }


        // horas totales mi mejor mes
        $horas_mi_mejor_mes_total = $this->horasTotalesMes($id_usuario,$mejor_mes->month,$mejor_mes->year);
        $horas_mi_mejor_mes = sprintf('%2$02d:%1$02d',floor(($horas_mi_mejor_mes_total-(int)$horas_mi_mejor_mes_total)*60),(int)$horas_mi_mejor_mes_total);
        $mejor_mes->horas_total = $horas_mi_mejor_mes_total;
        $mejor_mes->horas = $horas_mi_mejor_mes;

        //$puntos_por_usuario_dia = $puntos->select('usuario_id',DB::raw('DATE(updated_at) as date'), DB::raw('sum(puntos) as puntos'))->groupBy('date')->get();

        //mis piezas
        $piezas = PuntoPieza::whereRaw(DB::raw("(usuario_id_corte = $id_usuario or usuario_id_prearmado = $id_usuario or usuario_id_tapacantos = $id_usuario or usuario_id_modulo =$id_usuario or usuario_id_cajones =$id_usuario)"));
        $piezas = Puntaje::where('usuario_id',$id_usuario);
/*        (function ($query) use ($id_usuario) {
            $query->where('usuario_id_prearmado',$id_usuario)->whereOr('usuario_id_corte',$id_usuario)->whereOr('usuario_id_tapacantos',$id_usuario)->whereOr('usuario_id_modulo',$id_usuario)->whereOr('usuario_id_cajones',$id_usuario);
        });*/
        $horas_hoy = 0;
        $horas_hoy_total = 0;
        $hora_entrada = Asistencia::select(DB::raw('TIME(fecha) as hora_entrada'))->whereDate('fecha', date("Y-m-d"))->where('usuario_id',$id_usuario)->whereIn('tipo_asistencia_id',[1,4,5,6]);

        if ($hora_entrada->count()) {
            $hora_entrada = $hora_entrada->first()->hora_entrada;
            $hora_in = new Carbon($hora_entrada);

            $hora_salida = Asistencia::select(DB::raw('TIME(fecha) as hora_salida'),'tipo_asistencia_id')->whereDate('fecha', date("Y-m-d"))->where('usuario_id',$id_usuario)->whereIn('tipo_asistencia_id',[2,3])->get();
            // horario de salida
            $horario = UsuariosHorario::where('usuario_id',$id_usuario);
            if ($horario->count()>0) {
                $horario = $horario->first();
            }else{
                $horario = Horario::all()->first();
            }
            $actual = new Carbon(date('H:i'));

            if ($hora_salida->count()<=0) {
                if ($actual->between(new Carbon($horario->hora_inicio),new Carbon($horario->hora_fin))) {
                    $hora_salida = date('H:i');
                }else{
                    $hora_salida = $horario->hora_fin;
                }

            }else{
                $hora_salida = $hora_salida->first()->hora_salida;
            }

            // tiempo trabajado hoy
            $horas_hoy = $hora_in->diffInSeconds($hora_salida);
            // para llevar a horas
            $horas_hoy_total = $horas_hoy/3600;
            $horas_hoy = gmdate('H:i', $horas_hoy);


        }

        // Horas totales de semana
        $total_horas_semana = 0;
        $total_minutos_semana = 0;
        $horas_semana = Asistencia::select(DB::raw('TIME(fecha) as hora_entrada'),'fecha')->where('usuario_id',$id_usuario)->whereIn('tipo_asistencia_id',[1,4,5,6])->whereDate('fecha', '>=', date("Y-m-d",strtotime($fecha_actual."- 7 days")))->get();
      foreach ($horas_semana as $key => $hora) {
            $hora->fecha = date('Y-m-d' , strtotime($hora->fecha));
            $hora->hora_in = new Carbon($hora->fecha.$hora->hora_entrada);
            $datetime1 = date_create($hora->fecha.$hora->hora_entrada);

          $hora->hora_salida = Asistencia::select(DB::raw('TIME(fecha) as hora_salida'),'tipo_asistencia_id')->whereDate('fecha', $hora->fecha)->where('usuario_id',$id_usuario)->whereIn('tipo_asistencia_id',[2,3])->get();
          // horario de salida
          $horario = UsuariosHorario::where('usuario_id',$id_usuario);
          if ($horario->count()>0) {
              $horario = $horario->first();
          }else{
              $horario = Horario::all()->first();
          }
          $actual = new Carbon(date('H:i'));

          if ($hora->hora_salida->count()<=0) {
                  $hora->hora_salida = $horario->hora_fin;
          }else {
              $hora->hora_salida = $hora->hora_salida->first()->hora_salida;
          }
          $datetime2 = date_create("$hora->fecha $hora->hora_salida");
          $interval = date_diff($datetime1, $datetime2);
          /*
          $hora->horas_hoy = $hora->hora_in->diffInMinutes($hora->hora_salida);
          $total_horas_semana += $hora->horas_hoy;
          */
          if($interval->invert == 0){
            $horas = $interval->h;
            $minutos = $interval->i;

            $total_horas_semana += $horas;
            $total_minutos_semana += $minutos;
            }else{
            $horas = $interval->h;
            $minutos = $interval->i;

            $total_horas_semana -= $horas;
            $total_minutos_semana -= $minutos;
            }
        }

        $round = round($total_minutos_semana/60, 2);
        $new = explode('.', $round);

        $total_horas_semana = $total_horas_semana + $new[0];
        $min = $total_minutos_semana - ($new[0]*60);


        $total_horas_semana = round("$total_horas_semana.$min", 2);

        // arreglo el total de horas para mostrar
        $horas_mes_total = $this->horasTotalesMes($id_usuario,date('n'),date('Y'));
        $horas_mes = sprintf('%1$02d:%2$02d',(int)$horas_mes_total,floor(($horas_mes_total-(int)$horas_mes_total)*60));


        // horas totales trabajadas
        $horas_total = $this->horasTotales($id_usuario, date("m",strtotime($fecha_actual)), date("Y",strtotime($fecha_actual)));


        //$piezas_hoy = $piezas->whereDate('updated_at', date("Y-m-d"))->count();
        $piezas_hoy = $piezas->whereDate('updated_at', date("Y-m-d"))->count();

        //estemes
        //$piezas_estemes = PuntoPieza::whereRaw(DB::raw("(usuario_id_corte = $id_usuario or usuario_id_prearmado = $id_usuario or usuario_id_tapacantos = $id_usuario or usuario_id_modulo =$id_usuario or usuario_id_cajones =$id_usuario)"))->whereMonth('updated_at', date("n"))->count();
        $piezas_estemes = Puntaje::where('usuario_id',$id_usuario)->whereMonth('updated_at', date("n"))->count();

        // Piezas esta semana
        $piezas_semana = Puntaje::where('usuario_id',$id_usuario)->whereDate('updated_at', '>=', date("Y-m-d",strtotime($fecha_actual."- 7 days")))->count();


        // Por año y mes seleccinado
        return response()->json(['hoy' => $this->total_puntos($piezas_hoy,$puntos_hoy),
            'puntos_por_usuario'=>$this->total_puntos($puntos_por_usuario,$puntos_por_usuario),
            'estemes'=>$this->total_puntos($piezas_estemes,$estemes),
            'mejor_mes'=>$mejor_mes,
            'horas_hoy'=>$horas_hoy,
            'horas_hoy_total' => $horas_hoy_total,
            'horas_mes'=> $horas_mes,
            'horas_mes_total' => $horas_mes_total,
            'horas_total' => $horas_total,
            'promedios_por_usuario' => $promedios_por_usuario,
            'semana_puntos' => $semana_puntos,
            'piezas_semana' => $piezas_semana,
            'total_horas_semana' => $total_horas_semana
            ]);

    }

    public function getPuntajes_old(Request $request)
    {

        $id_aux = Usuario::where('usuario',$request->usuario)->first()->id;
        $piezas = Pieza::where('id_aux',$id_aux)->where('estado_id',3);

        $mispuntos = $piezas->get();
        # hoy
        $midiaactual = $piezas->whereDate('updated_at', date("Y-m-d"))->get();
        #este mes
        $estemes = $piezas->whereMonth('updated_at', date("n"))->get();
        $complejidad_cortes = NivelComplejidad::where('etapa','corte')->get();
        $puntos = 0;
        foreach ($mispuntos as $key => $piez) {
            $avetaporlveta = $piez->aveta * $piez->lveta;
            $piez->avetaporlveta = $avetaporlveta;
            if ($piez->estado_id == 3) {
                foreach ($complejidad_cortes as $key => $compl) {


                    if ($compl['nivel'] == 'alto'){
                        if ($avetaporlveta>$compl['min']) {
                            $piez->puntos = $compl->puntos;
                            $piez->nivel = $compl['nivel'];
                        }
                    }else{
                        if ($compl['min']<$avetaporlveta || $compl['max']>=$avetaporlveta) {
                        $piez->puntos = $compl->puntos;
                        $piez->nivel = $compl['nivel'];
                        }
                    }


                }
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
                $puntos += $piez->puntos;
            }
        }
        $midiaactual=$this->puntajes_nivel($midiaactual,'corte');
        $estemes=$this->puntajes_nivel($estemes,'corte');

        $complejidad_cortes = NivelComplejidad::where('etapa','pegado de cantos')->get();
        foreach ($midiaactual as $key => $piez) {
            if ($piez->estado_id == 3) {

                $baja = $piez->avetaporlveta>$complejidad_cortes[2]['min'] && $piez->avetaporlveta <= $complejidad_cortes[2]['max'];
                $media = $piez->avetaporlveta>$complejidad_cortes[1]['min'] && $piez->avetaporlveta <= $complejidad_cortes[1]['max'];
                $alto = $piez->avetaporlveta>$complejidad_cortes[0]['min'];
                if ($baja) {
                    $piez->puntosc = $complejidad_cortes[2]->puntos;
                    $piez->nivel = $complejidad_cortes[2]['nivel'];
                }else if ($media) {
                    $piez->puntosc = $complejidad_cortes[1]->puntos;
                    $piez->nivel = $complejidad_cortes[1]['nivel'];
                }else if ($alto) {
                    $piez->puntosc = $complejidad_cortes[0]->puntos;
                    $piez->nivel = $complejidad_cortes[0]['nivel'];
                }
            }
        }

        $piezasprom = $midiaactual->count();

        $resp = [
            'total' => $piezasprom,
            'puntos' => $puntos
        ];
        return response()->json(['hoy' => $this->total_puntos($midiaactual),'mispuntos'=>$this->total_puntos($mispuntos),'estemes'=>$this->total_puntos($estemes),'piezas'=>$midiaactual]);

    }

    public function puntajes_nivel($array,$etapa)
    {
        $complejidad_cortes = NivelComplejidad::where('etapa',$etapa)->get();
        foreach ($array as $key => $piez) {
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
        }
        return $array;
    }

    public function total_puntos($piezas,$puntos)
    {
        return [
            'puntos' => $puntos,
            'piezas' => $piezas,
        ];
    }

    public function getPuntajesFecha(Request $request)
    {
        $user_id = JWTAuth::parseToken()->authenticate()->id;
        $date = date($request->fecha);
        $mes = date('m', strtotime($request->fecha));
        $anio = date('Y', strtotime($request->fecha));
        $puntos = Puntaje::where('usuario_id',$user_id);

        $horas_hoy = 0;
        $horas_hoy_total = 0;
        #fecha
        if( !$request->month ){
            $puntos_fecha = $puntos->whereDate('updated_at', $date)->sum('puntos');
            $piezas_fecha = Puntaje::where('usuario_id',$user_id)->whereDate('updated_at', $date)->count();
            $hora_entrada = Asistencia::select(DB::raw('TIME(fecha) as hora_entrada'))->whereDate('fecha', $date)->where('usuario_id',$user_id)->whereIn('tipo_asistencia_id',[1,4,5,6]);
            if ($hora_entrada->count()) {
                $hora_entrada = $hora_entrada->first()->hora_entrada;
                $hora_in = new Carbon($hora_entrada);
                $hora_salida = Asistencia::select(DB::raw('TIME(fecha) as hora_salida'),'tipo_asistencia_id')->whereDate('fecha', $date)->where('usuario_id',$user_id)->whereIn('tipo_asistencia_id',[2,3])->get();
                // horario de salida
                $horario = UsuariosHorario::where('usuario_id',$user_id);
                if ($horario->count()>0) {
                    $horario = $horario->first();
                }else{
                    $horario = Horario::all()->first();
                }
                $actual = new Carbon(date('H:i'));
    
                if ($hora_salida->count()<=0) {
                        $hora_salida = $horario->hora_fin;
                }else{
                    $hora_salida = $hora_salida->first()->hora_salida;
                }
                // tiempo trabajado hoy
                $horas_hoy = $hora_in->diffInSeconds($hora_salida);
                // para llevar a horas
                $horas_hoy_total = $horas_hoy/3600;
                $horas_hoy = gmdate('H:i', $horas_hoy);
            }
        }else{
            
            $puntos_fecha = $puntos->whereMonth('updated_at', $mes)->whereYear('updated_at', $anio)->sum('puntos');
            $piezas_fecha = Puntaje::where('usuario_id',$user_id)->whereMonth('updated_at', $mes)->whereYear('updated_at', $anio)->count();
            $horas_mes = Asistencia::select(DB::raw('TIME(fecha) as hora_entrada'),'fecha')->whereMonth('fecha', $mes)->whereYear('fecha', $anio)->where('usuario_id',$user_id)->whereIn('tipo_asistencia_id',[1,4,5,6])->get();
            foreach ($horas_mes as $key => $hora) {
                $hora->hora_in = new Carbon($hora->hora_entrada);
                $hora->fecha = date('Y-m-d' , strtotime($hora->fecha));
                $hora->hora_salida = Asistencia::select(DB::raw('TIME(fecha) as hora_salida'),'tipo_asistencia_id')->whereDate('fecha', $hora->fecha)->where('usuario_id',$user_id)->whereIn('tipo_asistencia_id',[2,3])->get();
                // horario de salida
                $horario = UsuariosHorario::where('usuario_id',$user_id);
                if ($horario->count()>0) {
                    $horario = $horario->first();
                }else{
                    $horario = Horario::all()->first();
                }
                $actual = new Carbon(date('H:i'));
    
                if ($hora->hora_salida->count()<=0) {
                        $hora->hora_salida = $horario->hora_fin;
                }else{
                    $hora->hora_salida = $hora->hora_salida->first()->hora_salida;
                }
    
                $hora->horas_hoy = $hora->hora_in->diffInSeconds($hora->hora_salida);
                $horas_hoy_total += $hora->horas_hoy;
            }
            $horas_hoy = $horas_hoy_total / 3600;
            $horas_hoy_total = $horas_hoy;
        }
        

        return response()->json([
            'piezas' => $piezas_fecha,
            'puntos' => $puntos_fecha,
            'horas' => round($horas_hoy, 2),
            'horas_total' => round($horas_hoy_total, 2),
            'mes' => $mes,
            'anio' => $anio
        ]);
    }

    public function horasTotales($id_usuario, $mes, $anio)
    {

        $horas_totales = Asistencia::select(DB::raw('TIME(fecha) as hora_entrada'),'fecha')->whereMonth('fecha', $mes)->whereYear('fecha', $anio)->where('usuario_id',$id_usuario)->whereIn('tipo_asistencia_id',[1,4,5,6])->get();
        // horas totales trabajadas
        
        // acumulador de horas
        $total_horas_total = 0;
        $total_minutos_total = 0;
        foreach ($horas_totales as $key => $hora) {
            $hora->fecha = date('Y-m-d' , strtotime($hora->fecha));
            $hora->hora_in = new Carbon($hora->fecha.$hora->hora_entrada);
            $datetime1 = date_create("$hora->fecha $hora->hora_entrada");

            $hora->hora_salida = Asistencia::select(DB::raw('TIME(fecha) as hora_salida'),'tipo_asistencia_id')->whereDate('fecha', $hora->fecha)->where('usuario_id',$id_usuario)->whereIn('tipo_asistencia_id',[2,3])->get();
            // horario de salida
            $horario = UsuariosHorario::where('usuario_id',$id_usuario);
            if ($horario->count()>0) {
                $horario = $horario->first();
            }else{
                $horario = Horario::all()->first();
            }
            $actual = new Carbon(date('H:i'));

            if ($hora->hora_salida->count()<=0) {
                $hora->hora_salida = $horario->hora_fin;
            }else{
                $hora->hora_salida = $hora->hora_salida->first()->hora_salida;
            }
            $datetime2 = date_create("$hora->fecha $hora->hora_salida");
            $interval = date_diff($datetime1, $datetime2);

            if($interval->invert == 0){
                $horas = $interval->h;
                $minutos = $interval->i;
  
              $total_horas_total += $horas;
              $total_minutos_total += $minutos;
            }else{
              $horas = $interval->h;
              $minutos = $interval->i;
  
              $total_horas_total -= $horas;
              $total_minutos_total -= $minutos;
            }
            /*
            $hora->horas_hoy = $hora->hora_in->diffInMinutes($hora->hora_salida);
            $total_horas_total += $hora->horas_hoy;*/
            //var_dump("$hora->fecha.$hora->hora_entrada - $hora->fecha $hora->hora_salida | $total_horas_total");
        }

        $round = round($total_minutos_total/60, 2);
        $new = explode('.', $round);
  
        $total_horas_total = $total_horas_total + $new[0];
        $min = $total_minutos_total - ($new[0]*60);
  
        $total = $total_horas_total;
  
  
        return round("$total_horas_total.$min", 2);

    }


    public function horasTotalesMes($id_usuario, $mes, $anio)
    {
        $horas_mes = Asistencia::select(DB::raw('TIME(fecha) as hora_entrada'),'fecha')->whereMonth('fecha', $mes)->whereYear('fecha', $anio)->where('usuario_id',$id_usuario)->whereIn('tipo_asistencia_id',[1,4,5,6])->get();
        // acumulador de horas
        $total_horas_mes = 0;
        $total_minutos_mes = 0;
        foreach ($horas_mes as $key => $hora) {
            $hora->fecha = date('Y-m-d' , strtotime($hora->fecha));
            $hora->hora_in = new Carbon($hora->fecha.$hora->hora_entrada);
            $datetime1 = date_create("$hora->fecha $hora->hora_entrada");

            $hora->hora_salida = Asistencia::select(DB::raw('TIME(fecha) as hora_salida'),'tipo_asistencia_id')->whereDate('fecha', $hora->fecha)->where('usuario_id',$id_usuario)->whereIn('tipo_asistencia_id',[2,3])->get();
            // horario de salida
            $horario = UsuariosHorario::where('usuario_id',$id_usuario);
            if ($horario->count()>0) {
                $horario = $horario->first();
            }else{
                $horario = Horario::all()->first();
            }
            $actual = new Carbon(date('H:i'));

            if ($hora->hora_salida->count()<=0) {
                $hora->hora_salida = $horario->hora_fin;
            }else{
                $hora->hora_salida = $hora->hora_salida->first()->hora_salida;
            }

            $datetime2 = date_create("$hora->fecha $hora->hora_salida");
            $interval = date_diff($datetime1, $datetime2);

            if($interval->invert == 0){
                $horas = $interval->h;
                $minutos = $interval->i;
  
              $total_horas_mes += $horas;
              $total_minutos_mes += $minutos;
            }else{
              $horas = $interval->h;
              $minutos = $interval->i;
  
              $total_horas_mes -= $horas;
              $total_minutos_mes -= $minutos;
            }

            //$hora->horas_hoy = $hora->hora_in->diffInSeconds($hora->hora_salida);
            //$total_horas_mes += $hora->horas_hoy;
        }

        $round = round($total_minutos_mes/60, 2);
        $new = explode('.', $round);
  
        $total_horas_mes = $total_horas_mes + $new[0];
        $min = $total_minutos_mes - ($new[0]*60);
  
        $total = $total_horas_mes;
  
  
        return round("$total_horas_mes.$min", 2);
    }

    public function horas_fueras_taller($id_usuario, $data = false, $mes, $anio){
        if( !$data ){
            $horas_totales = Asistencia::select(DB::raw('TIME(fecha) as hora_salida'),'fecha')->whereMonth('fecha', $mes)->whereYear('fecha',$anio)->where('usuario_id',$id_usuario)->where('tipo_asistencia_id',3)->get();
        }else{
            $horas_totales = Asistencia::select(DB::raw('TIME(fecha) as hora_salida'),'fecha')->where('usuario_id',$id_usuario)->where('tipo_asistencia_id',3)->whereDate('fecha', '>=', $data['fecha_inicio'])->whereDate('fecha', '<=', $data['fecha_fin'])->get();
        }
    
        if($data = 'month'){
            $horas_totales = Asistencia::select(DB::raw('TIME(fecha) as hora_salida'),'fecha')->whereMonth('fecha',date('n'))->whereYear('fecha',date('Y'))->where('usuario_id',$id_usuario)->where('tipo_asistencia_id',3)->get();
        }
        $total_horas_total = 0;
        $total_minutos_total = 0;
          foreach ($horas_totales as $key => $hora) {
            $hora->fecha = date('Y-m-d' , strtotime($hora->fecha));
            $hora->hora_in = new Carbon($hora->fecha.$hora->hora_salida);
            $datetime1 = date_create("$hora->fecha $hora->hora_salida");
    
              $hora->hora_regreso = Asistencia::select(DB::raw('TIME(fecha) as hora_regreso'),'tipo_asistencia_id')
              ->whereDate('fecha', $hora->fecha)
              ->where('usuario_id',$id_usuario)
              ->whereIn('tipo_asistencia_id',[2,4])
              ->orderBy('tipo_asistencia_id', 'DESC')
              ->get();
              // horario de salida
              $horario = UsuariosHorario::where('usuario_id',$id_usuario);
              if ($horario->count()>0) {
                  $horario = $horario->first();
              }else{
                  $horario = Horario::all()->first();
              }
              $actual = new Carbon(date('H:i'));
    
              if ($hora->hora_regreso->count()<=0) {
                      $hora->hora_regreso = $horario->hora_fin;
              }else{
                  $hora->hora_regreso = $hora->hora_regreso->first()->hora_regreso;
              }

              $datetime2 = date_create("$hora->fecha $hora->hora_regreso");
              $interval = date_diff($datetime1, $datetime2);
  
              if($interval->invert == 0){
                  $horas = $interval->h;
                  $minutos = $interval->i;
    
                $total_horas_mes += $horas;
                $total_minutos_mes += $minutos;
              }else{
                $horas = $interval->h;
                $minutos = $interval->i;
    
                $total_horas_mes -= $horas;
                $total_minutos_mes -= $minutos;
              }
              /*
              $hora->horas_hoy = $hora->hora_in->diffInMinutes($hora->hora_regreso);
              $total_horas_total += $hora->horas_hoy;
    
              return round($total_horas_total/60, 2);
              */
              $round = round($total_minutos_total/60, 2);
              $new = explode('.', $round);
        
              $total_horas_total = $total_horas_total + $new[0];
              $min = $total_minutos_total - ($new[0]*60);
        
              $total = $total_horas_total;
        
        
              return round("$total_horas_total.$min", 2);
          }
      }
}
