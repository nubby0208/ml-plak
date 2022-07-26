<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use App\Models\Puntaje;
use DB;
use Carbon\Carbon;
use App\Models\Asistencia;
use App\Models\Horario;
use App\Models\UsuariosHorario;

class ProduccionController extends Controller
{
    public function prod_by_date(Request $request)
  {

    $user = Usuario::find($request->usuario_id);

    $puntos = Puntaje::where('usuario_id', $request->usuario_id);

    #hoy
    $puntos_date = $puntos->whereDate('created_at', '>=', $request->fecha_inicio)->whereDate('created_at', '<=', $request->fecha_fin)->sum('puntos');
    $piezas = $puntos->whereDate('created_at', '>=', $request->fecha_inicio)->whereDate('created_at', '<=', $request->fecha_fin)->count();
    $horas_totales = $this->horasTotales($request->usuario_id, ['fecha_inicio' => $request->fecha_inicio, 'fecha_fin' => $request->fecha_fin]);
    $horas_fuera_taller = $this->horas_fueras_taller($request->usuario_id, ['fecha_inicio' => $request->fecha_inicio, 'fecha_fin' => $request->fecha_fin]);

  	return response()->json([
          'puntos' => $puntos_date,
          'piezas' => $piezas,
          'usuario' => $user->usuario,
          'horas_totales' => $horas_totales,
          'horas_taller' => round($horas_totales - $horas_fuera_taller, 2)

      ]);
  }

  public function horasTotales($id_usuario, $data = false)
  {
      if( !$data ){
          $horas_totales = Asistencia::select(DB::raw('TIME(fecha) as hora_entrada'),'fecha')->where('usuario_id',$id_usuario)->whereIn('tipo_asistencia_id',[1])->get();
      }else{
          $horas_totales = Asistencia::select(DB::raw('TIME(fecha) as hora_entrada'),'fecha')->where('usuario_id',$id_usuario)->whereIn('tipo_asistencia_id',[1])->whereDate('fecha', '>=', $data['fecha_inicio'])->whereDate('fecha', '<=', $data['fecha_fin'])->get();
      }
      // horas totales trabajadas
      
      // acumulador de horas
      $total_horas_total = 0;
      $total_minutos_total = 0;
      foreach ($horas_totales as $key => $hora) {
          $hora->fecha = date('Y-m-d' , strtotime($hora->fecha));
          $hora->hora_in = new Carbon($hora->fecha.$hora->hora_entrada);
          $datetime1 = date_create($hora->fecha.$hora->hora_entrada);


          $hora->hora_salida = Asistencia::select(DB::raw('TIME(fecha) as hora_salida'),'fecha','tipo_asistencia_id')->whereDate('fecha', $hora->fecha)->where('usuario_id',$id_usuario)->whereIn('tipo_asistencia_id',[2])->get();
          // horario de salida
          $horario = UsuariosHorario::where('usuario_id',$id_usuario);
          if ($horario->count()>0) {
              $horario = $horario->first();
          }else{
              $horario = Horario::all()->first();
          }
 
          if ($hora->hora_salida->count()<=0) {

                $hora->hora_salida = $horario->hora_fin;
          }else {
                $hora->hora_salida = $hora->hora_salida->first()->hora_salida;
          }
          $datetime2 = date_create("$hora->fecha $hora->hora_salida");
          $interval = date_diff($datetime1, $datetime2);

          //var_dump($interval); exit();
          //$hora->horas_hoy = $hora->hora_in->diffInMinutes("$hora->fecha $hora->hora_salida");
          //var_dump($hora->hora_in." -- "."$hora->fecha $hora->hora_salida"." | ".$hora->horas_hoy ); 

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
      }
      // arreglo el total de horas para mostrar


      $round = round($total_minutos_total/60, 2);
      $new = explode('.', $round);

      $total_horas_total = $total_horas_total + $new[0];
      $min = $total_minutos_total - ($new[0]*60);

      $total = $total_horas_total;


      return round("$total_horas_total.$min", 2);
  }

  public function horas_fueras_taller($id_usuario, $data = false){
    if( !$data ){
        $horas_totales = Asistencia::select(DB::raw('TIME(fecha) as hora_salida'),'fecha')->where('usuario_id',$id_usuario)->whereIn('tipo_asistencia_id',3)->get();
    }else{
        $horas_totales = Asistencia::select(DB::raw('TIME(fecha) as hora_salida'),'fecha')->where('usuario_id',$id_usuario)->where('tipo_asistencia_id',3)->whereDate('fecha', '>=', $data['fecha_inicio'])->whereDate('fecha', '<=', $data['fecha_fin'])->get();
    }

    $total_horas_total = 0;
    $total_minutos_total = 0;
      foreach ($horas_totales as $key => $hora) {
          $hora->hora_in = new Carbon($hora->hora_salida);
          $hora->fecha = date('Y-m-d' , strtotime($hora->fecha));
          $datetime1 = date_create($hora->fecha.$hora->hora_salida);

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
          }else {
              $hora->hora_regreso = $hora->hora_regreso->first()->hora_regreso;
          }
          $datetime2 = date_create("$hora->fecha $hora->hora_regreso");
          $interval = date_diff($datetime1, $datetime2);

         /* $hora->horas_hoy = $hora->hora_in->diffInMinutes($hora->hora_regreso);
          $total_horas_total += $hora->horas_hoy;

          return round($total_horas_total/60, 2);*/
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
        }
                // arreglo el total de horas para mostrar


                $round = round($total_minutos_total/60, 2);
                $new = explode('.', $round);

                $total_horas_total = $total_horas_total + $new[0];
                $min = $total_minutos_total - ($new[0]*60);

                $total = $total_horas_total;


                return round("$total_horas_total.$min", 2);
      }
}
