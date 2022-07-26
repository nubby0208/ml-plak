<?php

namespace App\Http\Controllers;

use App\Models\MedicionInstalacion;
use App\Models\TiempoTrasladoProyecto;
use App\Models\CapacidadProduccionProyecto;
use App\Models\CapacidadProduccionHoraria;
use App\Models\ProyectoJson;
use App\Models\Proyecto;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use DB;
use Illuminate\Support\Facades\Artisan;

class MedicionInstalacionController extends Controller
{
    const CACHE_TIME = 180;
    public function index($proyecto_id)
    {
        $medicionInstalacion  = MedicionInstalacion::where('proyecto_id', $proyecto_id)
                                                   ->orderBy('fecha_medinst', 'asc')
                                                   ->get();

        return response()->json(['success' => true,'data' => $medicionInstalacion],200);
    }

    public function indexMed($proyecto_id)
    {
        $medicionInstalacion = MedicionInstalacion::where('proyecto_id', $proyecto_id)
                                                  ->where('tipo_medinst',0)
                                                  ->orderBy('fecha_medinst', 'asc')
                                                  ->get();

        return response()->json(['success' => true,'data' => $medicionInstalacion],200);
    }

    public function indexJsonMed($token_project)
    {
        $medicionInstalacion = MedicionInstalacion::where('token_project', $token_project)
                                                  ->where('tipo_medinst',0)
                                                  ->orderBy('fecha_medinst', 'asc')
                                                  ->get();

        return response()->json(['success' => true,'data' => $medicionInstalacion],200);
    }

    public function indexInst($proyecto_id)
    {
        $medicionInstalacion = MedicionInstalacion::where('proyecto_id', $proyecto_id)
                                                  ->where('tipo_medinst',1)
                                                  ->orderBy('fecha_medinst', 'asc')
                                                  ->get();

        return response()->json(['success' => true,'data' => $medicionInstalacion],200);
    }

    public function indexJsonInst($token_project)
    {
        $medicionInstalacion = MedicionInstalacion::where('token_project', $token_project)
                                                  ->where('tipo_medinst',1)
                                                  ->orderBy('fecha_medinst', 'asc')
                                                  ->get();

        return response()->json(['success' => true,'data' => $medicionInstalacion],200);
    }

    public function indexJsonInstDate($fecha1,$fecha2)
    {
      if (Cache::has($fecha1 . "_" . $fecha2 ."-JID")){
        $datos= Cache::get($fecha1 . "_" . $fecha2 ."-JID");
        return response()->json(['success' => true,'data' => $datos],200);
      }

      $instalaciones = MedicionInstalacion::where('tipo_medinst',1)
                                                  ->where('exported',0)
                                                  ->whereNotNull('token_project')
                                                  ->whereDate('fecha_medinst',">=",$fecha1)
                                                  ->whereDate('fecha_medinst',"<=",$fecha2)
                                                  ->orderBy('token_project', 'asc')
                                                  ->orderBy('fecha_medinst', 'asc')
                                                  ->get();

      $datos = collect([]);
      $i = 0;
      $id_pinst = 0;
      foreach ($instalaciones as $inst)
      {
        if ($inst->token_project !== $id_pinst)
        {
          $id_pinst = $inst->token_project;
          $i=0;
        }
        //Verificar si hay o no encargado
        $itemBolitas = '<div class="col-sm-5" style="display: flex !important;">';
        $itemBolitas .= '<div class="fc-daygrid-event-dot" style="text-align: center !important; border-color: transparent; display: inline-block !important"></div>';
        $encargado = ProyectoJson::where('token_project',$inst->token_project)
                                ->orderBy('id','desc')
                                ->first(['encargado_inst']);
        if (empty($encargado->encargado_inst) === true)
          $itemBolitas .= '<div class="fc-daygrid-event-dot" style="text-align: center !important; border-color: grey; display: inline-block !important"></div>';
        if (empty($encargado->encargado_inst) === false)
          $itemBolitas .= '<div class="fc-daygrid-event-dot" style="text-align: center !important; border-color: green; display: inline-block !important"></div>';
        $itemBolitas .= '</div>';
        //--------------------------------------------
        $i++;
        $fecha11 = Carbon::now()->format('Y-m-d');
        $fecha22 = Carbon::now()->addDays(15)->format('Y-m-d');
        $fecha_medinst = Carbon::parse( $inst->fecha_medinst)->format('Y-m-d');
        $stockClass = "blue";
        if ($fecha_medinst >= $fecha11 && $fecha_medinst <= $fecha22)
            $stockClass = "red";

        $time = Carbon::parse( $inst->fecha_medinst)->format('h:i A');
        $fondoClass = "#cccccc";
        $data = [
          'id' => "proyjsoninst-" . $inst->token_project . "-" .  $time,
          'title' => "FFFFFF",
          'start' => Carbon::parse( $inst->fecha_medinst)->format('Y-m-d H:m'),
          'end' => Carbon::parse( $inst->fecha_medinst)->format('Y-m-d'),
          'allDay' => true,
          'backgroundColor' => $fondoClass,
          'borderColor' => $stockClass,
          'meta' => $time,
          "customHtml" => '<div class="container" style="padding:0px !important;">' .
            '<div class="row">' .
            '<div class="col-sm-7"><span style="color: black !important;white-space:normal; display:block !important;word-wrap:break-word !important; font-size:9px;">' .
            'Instalación ' . $i . ': ' . $inst->proyectojson_detail . '</span></div>' . $itemBolitas .
            '</div></div><hr style="height: 5px;background-color: ' . $stockClass . '; margin-top: 0em; margin-bottom: 0em;">',
        ];
        $datos->push($data);
      }
      Cache::put($fecha1 . "_" . $fecha2 ."-JID", $datos, Self::CACHE_TIME);
      return response()->json(['success' => true,'data' => $datos],200);
    }

    public function indexJsonMedDate($fecha1,$fecha2)
    {
      if (Cache::has($fecha1 . "_" . $fecha2 ."-JMD")){
        $datos= Cache::get($fecha1 . "_" . $fecha2 ."-JMD");
        return response()->json(['success' => true,'data' => $datos],200);
      }

      $mediciones = MedicionInstalacion::where('tipo_medinst',0)
                                                  ->where('exported',0)
                                                  ->whereNotNull('token_project')
                                                  ->whereDate('fecha_medinst',">=",$fecha1)
                                                  ->whereDate('fecha_medinst',"<=",$fecha2)
                                                  ->orderBy('token_project', 'asc')
                                                  ->orderBy('fecha_medinst', 'asc')
                                                  ->get();
      $datos = collect([]);
      $i = 0;
      $id_pmed = 0;
      foreach ($mediciones as $m)
      {
        if ($m->token_project !== $id_pmed)
        {
          $id_pmed = $m->token_project;
          $i=0;
        }
        $i++;
        //Verificar si hay o no encargado
        $itemBolitas = '<div class="col-sm-5" style="display: flex !important;">';
        $itemBolitas .= '<div class="fc-daygrid-event-dot" style="text-align: center !important; border-color: transparent; display: inline-block !important"></div>';
        $encargado = ProyectoJson::where('token_project',$m->token_project)
                                ->orderBy('id','desc')
                                ->first(['encargado_med']);
        if (empty($encargado->encargado_med) === true)
          $itemBolitas .= '<div class="fc-daygrid-event-dot" style="text-align: center !important; border-color: grey; display: inline-block !important"></div>';
        if (empty($encargado->encargado_med) === false)
          $itemBolitas .= '<div class="fc-daygrid-event-dot" style="text-align: center !important; border-color: green; display: inline-block !important"></div>';
        $itemBolitas .= '</div>';
        //--------------------------------------------
        $time = Carbon::parse( $m->fecha_medinst)->format('h:i A');
        $fondoClass = "#cccccc";
        $data = [
          'id' => "proyjsonmed-" . $m->token_project  . "-" .  $time,
          'title' => "FFFFFF",
          'start' => Carbon::parse( $m->fecha_medinst)->format('Y-m-d H:m'),
          'end' => Carbon::parse( $m->fecha_medinst)->format('Y-m-d'),
          'allDay' => true,
          'backgroundColor' => $fondoClass,
          'borderColor' => "green",
          "customHtml" => '<div class="container" style="padding:0px !important;">' .
            '<div class="row">' .
            '<div class="col-sm-7"><span style="color: black !important;white-space:normal; display:block !important;word-wrap:break-word !important; font-size:9px;">' .
            'Medición ' . $i . ': ' . $m->proyectojson_detail . '</span></div>' . $itemBolitas .
            '</div></div><hr style="height: 5px;background-color: green; margin-top: 0em; margin-bottom: 0em;">',
        ];
        $datos->push($data);
      }
      Cache::put($fecha1 . "_" . $fecha2 ."-JMD", $datos, Self::CACHE_TIME);
      return response()->json(['success' => true,'data' => $datos],200);
    }

    public function indexJsonYearMonth($fecha)
    {
        if (Cache::has($fecha . "-JYM")){
          $datos= Cache::get($fecha . "-JYM");
          return response()->json(['success' => true,'data' => $datos],200);
        }

        $datos = collect([]);
        $fecha_ini_mes = date($fecha . "-01");
        $fecha_fin_mes  = date($fecha . "-" . date("t",strtotime($fecha)));

        $mes_act = (int) substr($fecha_fin_mes,5,2);
        $anno_act = (int) substr($fecha_fin_mes,0,4);
        $anno_ant = $anno_act;
        $anno_post = $anno_act;
        $mes_ant = $mes_act;
        $mes_post = $mes_act;

        if ($mes_act ==1) {
          $mes_ant = 12;
          $anno_ant --;
        }
        else
          $mes_ant --;

        if ($mes_act ==12) {
          $mes_post = 1;
          $anno_post ++;
          }
        else
          $mes_post ++;

        if ($mes_ant < 10)
          $fecha_fin_mes_ant = date($anno_ant . "-0" . $mes_ant) . "-" . date("t",strtotime($anno_ant . "-0" . $mes_ant));
        else
          $fecha_fin_mes_ant =  date($anno_ant . "-" . $mes_ant) . "-" . date("t",strtotime($anno_ant . "-" . $mes_ant));

        $diafin1 = (int) substr($fecha_fin_mes_ant,8,2);
        $diaini1 = $diafin1 - (7 - $this->getDayWeekBefore($fecha_fin_mes_ant));

        $diaFinal = (int) substr($fecha_fin_mes,8,2);
        $diaini2 = 1;
        $diafin2 = $diaFinal;

        if ($mes_post < 10)
          $fecha_ini_mes_post = date($anno_post . "-0" . $mes_post) . "-01";
        else
          $fecha_ini_mes_post = date($anno_post . "-" . $mes_post) . "-01";
        $diaini3 = 1;

        $diafin3 = $diaini3 + (7 - $this->getDayWeekafter($fecha_ini_mes_post));

        /*$data = [
          'diaini1' => $diaini1,
          'diafin1' => $diafin1,
          'diaini2' => $diaini2,
          'diafin2' => $diafin2,
          'diaini3' => $diaini3,
          'diafin3' => $diafin3,
        ];
        dd($data);*/

        //Instalacion
        $i = $diaini1;
        $diaFinal = $diafin1;
        $j = 2;
        if ($mes_ant < 10)
          $fechaPeriodica = $anno_ant . "-0" . $mes_ant;
        else
          $fechaPeriodica = $anno_ant . "-" . $mes_ant;

        for (;$i <= $diaFinal;)
        {
            if ($i< 10)
              $fechaC = date($fechaPeriodica . "-0" . $i);
            else
              $fechaC = date($fechaPeriodica . "-" . $i);
            $proys = MedicionInstalacion::distinct()
                                                  ->select('token_project')
                                                  ->where('tipo_medinst',1)
                                                  ->whereNotNull('token_project')
                                                  ->whereDate('fecha_medinst',"=",$fechaC)
                                                  ->orderBy('token_project', 'asc')
                                                  ->get();
            if ($proys !== null) {
              $proys2 = Proyecto::distinct()
                                      ->select('token_project')
                                      ->whereNotNull('token_project')
                                      ->whereNotIn('token_project',$proys->pluck('token_project'))
                                      ->whereDate('instalacion_fecha',"=",$fechaC)
                                      ->orderBy('token_project', 'asc')
                                      ->get();
            }
            else {
              $proys2 = Proyecto::distinct()
                                      ->select('token_project')
                                      ->whereNotNull('token_project')
                                      ->whereDate('instalacion_fecha',"=",$fechaC)
                                      ->orderBy('token_project', 'asc')
                                      ->get();
            }

            $pr=collect([]);
            if ($proys !== null) {
                $proys  = collect($proys->toArray());
                $pr = $proys;
            }
            if ($proys2 !== null) {
                $proys2  = collect($proys2->toArray());
                $pr = $pr->merge($proys2);
            }
            $proys  = $pr;
            $weekday =  $this->getDayWeek($fechaC);
            $capproy = 0;
            $p = "";
            if (($proys !== null) && (count($proys) > 0))
            {
              /*
                $p = $proys->pluck('token_project');
                $capproy = CapacidadProduccionProyecto::whereNotNull('token_project')
                                                    ->whereIn('token_project',$p)
                                                    ->sum('tiempo_instalacion_c');
              */
              //Eliminar
              //return response()->json(['successXX' => true,'data' => $proys[0]->],201);
              //for ($i=1;$i<=count($proys);$i++)
              foreach ($proys as $p)
              {
                $capacidadxproy = CapacidadProduccionProyecto::whereNotNull('token_project')
                                                    ->where('token_project',$p['token_project'])
                                                    ->sum('tiempo_instalacion_c');
                $tiempotrasladoproy = TiempoTrasladoProyecto::whereNotNull('token_project')
                                                ->where('token_project',$p['token_project'])
                                                ->sum('tiempo_traslado_c');
                $totalDias = MedicionInstalacion::where('tipo_medinst',1)
                                                ->whereNotNull('token_project')
                                                ->where('token_project',$p['token_project'])
                                                ->count();
                if ($totalDias === 0)
                  $totalDias = 1;

                $capproy += ($capacidadxproy  / $totalDias) + $tiempotrasladoproy;
                //dd("Capacidaxdia: ",$capacidadxproy . " / Total Dias: " . $totalDias );
              }
            }
            $capd = 0;
            $cpinstcalcporcentaje = "N/D";
            switch ($weekday)  {
                  case 'SU':
                    $day = "DOMINGO";
                    $capday = CapacidadProduccionHoraria::select('domingo')
                                                    ->where('nombre', 'Tiempo de Instalación')
                                                    ->first();
                    if ($capday !== null)
                      $capd=$capday->domingo;
                    break;
                  case 'MO':
                      $day = "LUNES";
                      $capday = CapacidadProduccionHoraria::select('lunes')
                                                      ->where('nombre', 'Tiempo de Instalación')
                                                      ->first();
                      if ($capday !== null)
                        $capd=$capday->lunes;
                      break;
                  case 'TU':
                      $day = "MARTES";
                      $capday = CapacidadProduccionHoraria::select('martes')
                                                        ->where('nombre', 'Tiempo de Instalación')
                                                        ->first();
                      if ($capday !== null)
                        $capd=$capday->martes;
                      break;
                  case 'WE':
                      $day = "MIERCOLES";
                      $capday = CapacidadProduccionHoraria::select('miercoles')
                                                        ->where('nombre', 'Tiempo de Instalación')
                                                        ->first();
                      if ($capday !== null)
                        $capd=$capday->miercoles;
                      break;
                  case 'TH':
                      $day = "JUEVES";
                      $capday = CapacidadProduccionHoraria::select('jueves')
                                                          ->where('nombre', 'Tiempo de Instalación')
                                                          ->first();
                      if ($capday !== null)
                        $capd=$capday->jueves;
                      break;
                  case 'FR':
                      $day = "VIERNES";
                      $capday = CapacidadProduccionHoraria::select('viernes')
                                                          ->where('nombre', 'Tiempo de Instalación')
                                                          ->first();
                      if ($capday !== null)
                        $capd=$capday->viernes;
                      break;
                  case 'SA':
                      $day = "SABADO";
                      $capday = CapacidadProduccionHoraria::select('sabado')
                                                            ->where('nombre', 'Tiempo de Instalación')
                                                            ->first();
                      if ($capday !== null)
                        $capd=$capday->sabado;
                      break;
            }
            if (($capd != 0) && ($capd !== '00:00'))
            {
              $horas = explode(":", $capd);
              $capd = (int) $horas[0];
              if (count($horas) > 1)
                $capd += ((int) $horas[1])/60;
              $cpinstcalcporcentaje = ($capproy * 100)/($capd);
            }
            else
              $capd = 0;
            /*$data = [
                  'tipo' => 'Instalacion',
                  'fecha' => $fechaC,
                  'wd' => $day,
                  'cpinstdiaria' => number_format($capd,2),
                  'cpinstcalc' => number_format($capproy,2),
                  'cpinstcalcporcentaje' => ($cpinstcalcporcentaje !=="N/D")? number_format($cpinstcalcporcentaje,2):$cpinstcalcporcentaje,
                  'proyectos' => $p,
                ];*/

            $avance = ($cpinstcalcporcentaje !=="N/D")? number_format($cpinstcalcporcentaje,2):$cpinstcalcporcentaje;
            $avanceW = $avance;
            if (($avance <= 30) || ($avance == "N/D"))
              $avanceW = 50;
            if ($avance > 100)
            {
                $avanceW = 100;
            }
            if ($avance == "N/D") $stockClass = "grey";
            if ($avance <= 40) $stockClass = "green";
            else if ($avance <= 50) $stockClass = "olive";
            else if ($avance <= 70) $stockClass = "olive";
            else if ($avance <= 80) $stockClass = "orange";
            else if ($avance <= 100000) $stockClass = "red";
            $data = [
                  'id' => "medinstproyinst",
                  'title' => "BBBBBB",
                  'start' => Carbon::parse($fechaC . " 01:00:00")->format('Y-m-d H:m'),
                  'end' => Carbon::parse($fechaC . " 01:00:00")->format('Y-m-d H:m'),
                  'allDay' => true,
                  'backgroundColor' => "gray",
                  'customHtml' =>  '<div class="row"><div class="col-3" style="font-size:9px;margin-left:0px">INST: </div><div class="col-9">' .
                  '<div style="text-align:center; color: white; background: ' . $stockClass . '; white-space:normal; width: ' .  $avanceW .'%; display:block' .
                  '!important;word-wrap:break-word !important; font-size:9px;margin-left:0px">' .
                  $avance . '%</div></div></div>',
              ];
            $datos->push($data);
            $i++;
            if ($i > $diaFinal)
            {
              if ($j===2)
              {
                $i = $diaini2;
                $diaFinal = $diafin2;
                if ($mes_act < 10)
                  $fechaPeriodica = $anno_act . "-0" . $mes_act;
                else
                  $fechaPeriodica = $anno_act . "-" . $mes_act;
              }
              if ($j===3)
              {

                $i = $diaini3;
                $diaFinal = $diafin3;
                if ($mes_post < 10)
                  $fechaPeriodica = $anno_post . "-0" . $mes_post;
                else
                  $fechaPeriodica = $anno_post . "-" . $mes_post;
              }
              $j++;
            }
        }

        //Medicion
        $i = $diaini1;
        $diaFinal = $diafin1;
        $j = 2;
        if ($mes_ant < 10)
          $fechaPeriodica = $anno_ant . "-0" . $mes_ant;
        else
          $fechaPeriodica = $anno_ant . "-" . $mes_ant;
        for (;$i <= $diaFinal;)
        {
            if ($i< 10)
              $fechaC = date($fechaPeriodica . "-0" . $i);
            else
              $fechaC = date($fechaPeriodica . "-" . $i);
            $proys = MedicionInstalacion::distinct()
                                                  ->select('token_project')
                                                  ->where('tipo_medinst',0)
                                                  ->where('exported',0)
                                                  ->whereNull('proyecto_id')
                                                  ->whereNotNull('token_project')
                                                  ->whereDate('fecha_medinst',"=",$fechaC)
                                                  ->orderBy('token_project', 'asc')
                                                  ->get();

            $weekday =  $this->getDayWeek($fechaC);
            $capproy = 0;
            $p = "";
            if (($proys !== null) && (count($proys) > 0))
            {
               /* $p = $proys->pluck('token_project');
                $capproy = CapacidadProduccionProyecto::whereNotNull('token_project')
                                                    ->where('exported',0)
                                                    ->whereIn('token_project',$p)
                                                    ->sum('tiempo_medicion_c');*/
                foreach ($proys as $p)
                {
                  $capacidadxproy = CapacidadProduccionProyecto::whereNotNull('token_project')
                                                      ->where('exported',0)
                                                      ->where('token_project',$p['token_project'])
                                                      ->sum('tiempo_medicion_c');
                  $tiempotrasladoproy = TiempoTrasladoProyecto::whereNotNull('token_project')
                                                      ->where('token_project',$p['token_project'])
                                                      ->sum('tiempo_traslado_c');
                  $totalDias = MedicionInstalacion::where('tipo_medinst',0)
                                                  ->where('exported',0)
                                                  ->whereNotNull('token_project')
                                                  ->where('token_project',$p['token_project'])
                                                  ->count();
                  if ($totalDias === 0)
                    $totalDias = 1;

                  $capproy += ($capacidadxproy / $totalDias) + $tiempotrasladoproy;
                  //dd("Capacidaxdia: ",$capacidadxproy . " / Total Dias: " . $totalDias );
                }
            }
            $capd = 0;
            $cpinstcalcporcentaje = "N/D";
            switch ($weekday)  {
                  case 'SU':
                    $day = "DOMINGO";
                    $capday = CapacidadProduccionHoraria::select('domingo')
                                                    ->where('nombre', 'Tiempo de Medición')
                                                    ->first();
                    if ($capday !== null)
                      $capd=$capday->domingo;
                    break;
                  case 'MO':
                      $day = "LUNES";
                      $capday = CapacidadProduccionHoraria::select('lunes')
                                                      ->where('nombre', 'Tiempo de Medición')
                                                      ->first();
                      if ($capday !== null)
                        $capd=$capday->lunes;
                      break;
                  case 'TU':
                      $day = "MARTES";
                      $capday = CapacidadProduccionHoraria::select('martes')
                                                        ->where('nombre', 'Tiempo de Medición')
                                                        ->first();
                      if ($capday !== null)
                        $capd=$capday->martes;
                      break;
                  case 'WE':
                      $day = "MIERCOLES";
                      $capday = CapacidadProduccionHoraria::select('miercoles')
                                                        ->where('nombre', 'Tiempo de Medición')
                                                        ->first();
                      if ($capday !== null)
                        $capd=$capday->miercoles;
                      break;
                  case 'TH':
                      $day = "JUEVES";
                      $capday = CapacidadProduccionHoraria::select('jueves')
                                                          ->where('nombre', 'Tiempo de Medición')
                                                          ->first();
                      if ($capday !== null)
                        $capd=$capday->jueves;
                      break;
                  case 'FR':
                      $day = "VIERNES";
                      $capday = CapacidadProduccionHoraria::select('viernes')
                                                          ->where('nombre', 'Tiempo de Medición')
                                                          ->first();
                      if ($capday !== null)
                        $capd=$capday->viernes;
                      break;
                  case 'SA':
                      $day = "SABADO";
                      $capday = CapacidadProduccionHoraria::select('sabado')
                                                            ->where('nombre', 'Tiempo de Medición')
                                                            ->first();
                      if ($capday !== null)
                        $capd=$capday->sabado;
                      break;
            }
            if (($capd != 0) && ($capd !== '00:00'))
            {
              $horas = explode(":", $capd);
              $capd = (int) $horas[0];
              if (count($horas) > 1)
                $capd += ((int) $horas[1])/60;
              $cpinstcalcporcentaje = ($capproy * 100)/$capd;
            }
            else
              $capd = 0;
           /* $data = [
                  'tipo' => 'Medicion',
                  'fecha' => $fechaC,
                  'wd' => $day,
                  'cpinstdiaria' => number_format($capd,2),
                  'cpinstcalc' => number_format($capproy,2),
                  'cpinstcalcporcentaje' => ($cpinstcalcporcentaje !=="N/D")? number_format($cpinstcalcporcentaje,2):$cpinstcalcporcentaje,
                  'proyectos' => $p,
                ];*/
            $avance = ($cpinstcalcporcentaje !=="N/D")? number_format($cpinstcalcporcentaje,2):$cpinstcalcporcentaje;
            $avanceW = $avance;
            if (($avance <= 30) || ($avance == "N/D"))
              $avanceW = 50;
            if ($avance > 100)
            {
                $avanceW = 100;
            }
            if ($avance == "N/D") $stockClass = "grey";
            if ($avance <= 40) $stockClass = "green";
            else if ($avance <= 50) $stockClass = "olive";
            else if ($avance <= 70) $stockClass = "olive";
            else if ($avance <= 80) $stockClass = "orange";
            else if ($avance <= 100000) $stockClass = "red";
            $data = [
                  'id' => "medinstproymed",
                  'title' => "CCCCCC",
                  'start' => Carbon::parse($fechaC . " 02:00:00")->format('Y-m-d H:m'),
                  'end' => Carbon::parse($fechaC . " 02:00:00")->format('Y-m-d H:m'),
                  'allDay' => true,
                  'backgroundColor' => "gray",
                  'customHtml' =>  '<div class="row"><div class="col-3" style="font-size:9px;margin-left:0px">MED: </div><div class="col-9">' .
                  '<div style="text-align:center; color: white; background: ' . $stockClass . '; white-space:normal; width: ' .  $avanceW .'%; display:block' .
                  '!important;word-wrap:break-word !important; font-size:9px;margin-left:0px">' .
                  $avance . '%</div></div></div>',
             ];
            $datos->push($data);
            $i++;
            if ($i > $diaFinal)
            {
              if ($j===2)
              {
                $i = $diaini2;
                $diaFinal = $diafin2;
                if ($mes_act < 10)
                  $fechaPeriodica = $anno_act . "-0" . $mes_act;
                else
                  $fechaPeriodica = $anno_act . "-" . $mes_act;
              }
              if ($j===3)
              {

                $i = $diaini3;
                $diaFinal = $diafin3;
                if ($mes_post < 10)
                  $fechaPeriodica = $anno_post . "-0" . $mes_post;
                else
                  $fechaPeriodica = $anno_post . "-" . $mes_post;
              }
              $j++;
            }
        }

        Cache::put($fecha . "-JYM", $datos, Self::CACHE_TIME);

        return response()->json(['success' => true,'data' => $datos],200);
    }

    public function indexJsonYearMonthDetail($fecha,$tipo)
    {
      if (Cache::has($fecha . "-". $tipo . "-JYMD")){
        $datos= Cache::get($fecha . "-". $tipo . "-JYMD");
        return response()->json(['success' => true,'data' => $datos],200);
      }

      $datos = collect([]);
      $fechaC = $fecha;
      $tipo = (int) $tipo;
      if ($tipo===1) //Inst
      {
        //Instalacion
        $proys = MedicionInstalacion::distinct()
                                    ->select('token_project','exported')
                                    ->where('tipo_medinst',1)
                                    ->whereNotNull('token_project')
                                    ->whereDate('fecha_medinst',"=",$fechaC)
                                    ->orderBy('token_project', 'asc')
                                    ->get();

        if ($proys !== null) {
          $proys2 = Proyecto::distinct()
                            ->select('token_project')->selectSub('select 1', 'exported')
                            ->whereNotNull('token_project')
                            ->whereNotIn('token_project',$proys->pluck('token_project'))
                            ->whereDate('instalacion_fecha',"=",$fechaC)
                            ->orderBy('token_project', 'asc')
                            ->get();

        }
        else {
          $proys2 = Proyecto::distinct()
                            ->select('token_project')->selectSub('select 1', 'exported')
                            ->whereNotNull('token_project')
                            ->whereDate('instalacion_fecha',"=",$fechaC)
                            ->orderBy('token_project', 'asc')
                            ->get();
        }
        $pr=collect([]);
        if ($proys !== null)  {
            $proys  = collect($proys->toArray());
            $pr = $proys;
        }
        if (($proys2 !== null) && (count($proys2) > 0))  {
            $proys2  = collect($proys2->toArray());
            $pr = $pr->merge($proys2);
        }
        $proys  = $pr;

        $weekday =  $this->getDayWeek($fechaC);
        $capproy = 0;
        $p = "";
        $porcT = 0;
        $tT = 0;
        $tdT = 0;
        if (($proys !== null) && (count($proys) > 0))
        {
          foreach ($proys as $p) {
            $capproy = CapacidadProduccionProyecto::whereNotNull('token_project')
                                                    ->where('token_project',$p['token_project'])
                                                    ->sum('tiempo_instalacion_c');
            $tiempotrasladoproy = TiempoTrasladoProyecto::whereNotNull('token_project')
                                                    ->where('token_project',$p['token_project'])
                                                    ->sum('tiempo_traslado_c');
            $totalDias = MedicionInstalacion::where('tipo_medinst',1)
                                                    ->whereNotNull('token_project')
                                                    ->where('token_project',$p['token_project'])
                                                    ->count();
            if ($totalDias === 0)
              $totalDias = 1;

            $capproy = ($capproy / $totalDias) + $tiempotrasladoproy;

            $capd = 0;
            switch ($weekday)  {
                  case 'SU':
                    $day = "DOMINGO";
                    $capday = CapacidadProduccionHoraria::select('domingo')
                                                    ->where('nombre', 'Tiempo de Instalación')
                                                    ->first();
                    if ($capday !== null)
                      $capd=$capday->domingo;
                    break;
                  case 'MO':
                      $day = "LUNES";
                      $capday = CapacidadProduccionHoraria::select('lunes')
                                                      ->where('nombre', 'Tiempo de Instalación')
                                                      ->first();
                      if ($capday !== null)
                        $capd=$capday->lunes;
                      break;
                  case 'TU':
                      $day = "MARTES";
                      $capday = CapacidadProduccionHoraria::select('martes')
                                                        ->where('nombre', 'Tiempo de Instalación')
                                                        ->first();
                      if ($capday !== null)
                        $capd=$capday->martes;
                      break;
                  case 'WE':
                      $day = "MIERCOLES";
                      $capday = CapacidadProduccionHoraria::select('miercoles')
                                                        ->where('nombre', 'Tiempo de Instalación')
                                                        ->first();
                      if ($capday !== null)
                        $capd=$capday->miercoles;
                      break;
                  case 'TH':
                      $day = "JUEVES";
                      $capday = CapacidadProduccionHoraria::select('jueves')
                                                          ->where('nombre', 'Tiempo de Instalación')
                                                          ->first();
                      if ($capday !== null)
                        $capd=$capday->jueves;
                      break;
                  case 'FR':
                      $day = "VIERNES";
                      $capday = CapacidadProduccionHoraria::select('viernes')
                                                          ->where('nombre', 'Tiempo de Instalación')
                                                          ->first();
                      if ($capday !== null)
                        $capd=$capday->viernes;
                      break;
                  case 'SA':
                      $day = "SABADO";
                      $capday = CapacidadProduccionHoraria::select('sabado')
                                                            ->where('nombre', 'Tiempo de Instalación')
                                                            ->first();
                      if ($capday !== null)
                        $capd=$capday->sabado;
                      break;
            }
            $cpinstcalcporcentaje = "N/D";
            if (($capd !== '0') && ($capd !== '00:00'))
            {
              $horas = explode(":", $capd);
              $capd = (int) $horas[0];
              if (count($horas) > 1)
                $capd += ((int) $horas[1])/60;
              $cpinstcalcporcentaje = ($capproy * 100)/$capd;
            }
            else
              $capd = 0;
            $proyName = "";
            $exported = 1;

            if ($p['exported'] !== null)
              $exported = $p['exported'];
            if ($exported === 0)
            {
              $py = ProyectoJson::where('token_project',$p['token_project'])->orderBy('id','desc')->first();
              if ($py !== null)
              {
                $proyName = $py->nombre;
                if ($py->client_name !== null)
                  $proyName .=  " - " . $py->client_name;
                if ($py->mueble !== null)
                  $proyName .= " - " . $py->mueble;
              }
            }
            else
            {
              $py = Proyecto::where('token_project',$p['token_project'])->first();
              if ($py !== null)
                $proyName = $py->proyecto;
            }
            $data = [
                  'day' => $day,
                  'tipo' => 'INST',
                  'fecha' => Carbon::parse($fechaC)->format('d/m/Y'),
                  'tiempo' => number_format($capproy, 2),
                  'tiempoD' => number_format($capd, 2),
                  'porcentaje' => ($cpinstcalcporcentaje !=="N/D")? number_format($cpinstcalcporcentaje,2):$cpinstcalcporcentaje,
                  'proyecto' => $proyName,
                  'token_project' => $p['token_project'],
            ];
            $porcT += ($cpinstcalcporcentaje !=="N/D")? number_format($cpinstcalcporcentaje,2):0;
            $tT += $capproy;
            $tdT = $capd;
            $datos->push($data);
          }
          if ($porcT > 0){
            $data = [
              'day' => $day,
              'tipo' => 'INST',
              'fecha' => Carbon::parse($fechaC)->format('d/m/Y'),
              'tiempo' => number_format($tT, 2),
              'tiempoD' => number_format($tdT, 2),
              'porcentaje' => number_format($porcT,2),
              'proyecto' => 'TOTAL',
              'token_project' => '',
            ];
            $datos->push($data);
          }
        }
      }
      if ($tipo===0) //Med
      {
        //Medición
        $proys = MedicionInstalacion::distinct()
                                                  ->select('token_project','exported')
                                                  ->where('tipo_medinst',0)
                                                  ->whereNotNull('token_project')
                                                  ->whereNull('proyecto_id')
                                                  ->where('exported',0)
                                                  ->whereDate('fecha_medinst',"=",$fechaC)
                                                  ->orderBy('token_project', 'asc')
                                                  ->get();

        $weekday =  $this->getDayWeek($fechaC);
        $capproy = 0;
        $p = "";

        $porcT = 0;
        $tT = 0;
        $tdT = 0;
        if (($proys !== null) && (count($proys) > 0))
        {
          foreach ($proys as $p) {
            $capproy = CapacidadProduccionProyecto::whereNotNull('token_project')
                                                    ->where('exported',0)
                                                    ->where('token_project',$p->token_project)
                                                    ->sum('tiempo_medicion_c');
            $tiempotrasladoproy = TiempoTrasladoProyecto::whereNotNull('token_project')
                                                    ->where('token_project',$p['token_project'])
                                                    ->sum('tiempo_traslado_c');
            $totalDias = MedicionInstalacion::where('tipo_medinst',0)
                                                    ->where('exported',0)
                                                    ->whereNotNull('token_project')
                                                    ->where('token_project',$p['token_project'])
                                                    ->count();
            if ($totalDias === 0)
              $totalDias = 1;

            $capproy = ($capproy / $totalDias) + $tiempotrasladoproy;

            $capd = 0;
            switch ($weekday)  {
                  case 'SU':
                    $day = "DOMINGO";
                    $capday = CapacidadProduccionHoraria::select('domingo')
                                                    ->where('nombre', 'Tiempo de Medición')
                                                    ->first();
                    if ($capday !== null)
                      $capd=$capday->domingo;
                    break;
                  case 'MO':
                      $day = "LUNES";
                      $capday = CapacidadProduccionHoraria::select('lunes')
                                                      ->where('nombre', 'Tiempo de Medición')
                                                      ->first();
                      if ($capday !== null)
                        $capd=$capday->lunes;
                      break;
                  case 'TU':
                      $day = "MARTES";
                      $capday = CapacidadProduccionHoraria::select('martes')
                                                        ->where('nombre', 'Tiempo de Medición')
                                                        ->first();
                      if ($capday !== null)
                        $capd=$capday->martes;
                      break;
                  case 'WE':
                      $day = "MIERCOLES";
                      $capday = CapacidadProduccionHoraria::select('miercoles')
                                                        ->where('nombre', 'Tiempo de Medición')
                                                        ->first();
                      if ($capday !== null)
                        $capd=$capday->miercoles;
                      break;
                  case 'TH':
                      $day = "JUEVES";
                      $capday = CapacidadProduccionHoraria::select('jueves')
                                                          ->where('nombre', 'Tiempo de Medición')
                                                          ->first();
                      if ($capday !== null)
                        $capd=$capday->jueves;
                      break;
                  case 'FR':
                      $day = "VIERNES";
                      $capday = CapacidadProduccionHoraria::select('viernes')
                                                          ->where('nombre', 'Tiempo de Medición')
                                                          ->first();
                      if ($capday !== null)
                        $capd=$capday->viernes;
                      break;
                  case 'SA':
                      $day = "SABADO";
                      $capday = CapacidadProduccionHoraria::select('sabado')
                                                            ->where('nombre', 'Tiempo de Medición')
                                                            ->first();
                      if ($capday !== null)
                        $capd=$capday->sabado;
                      break;
            }
            $cpinstcalcporcentaje = "N/D";
            if (($capd !== '0') && ($capd !== '00:00'))
            {
              $horas = explode(":", $capd);
              $capd = (int) $horas[0];
              if (count($horas) > 1)
                $capd += ((int) $horas[1])/60;
              $cpinstcalcporcentaje = ($capproy * 100)/$capd;
            }
            else
              $capd = 0;
            $proyName = "";
            $py = ProyectoJson::where('token_project',$p->token_project)->orderBy('id','desc')->first();

            if ($py !== null)
            {
              $proyName = $py->nombre;
              if ($py->client_name != null)
                $proyName .= " - " . $py->client_name;
              if ($py->mueble != null)
                $proyName .= " - " . $py->mueble;
            }

            $data = [
                  'day' => $day,
                  'tipo' => 'MED',
                  'fecha' => Carbon::parse($fechaC)->format('d/m/Y'),
                  'tiempo' => number_format($capproy, 2),
                  'tiempoD' => number_format($capd, 2),
                  'porcentaje' => ($cpinstcalcporcentaje !=="N/D")? number_format($cpinstcalcporcentaje,2):$cpinstcalcporcentaje,
                  'proyecto' => $proyName,
                  'token_project' => $p->token_project,
            ];
            $porcT += ($cpinstcalcporcentaje !=="N/D")? number_format($cpinstcalcporcentaje,2):0;
            $tT += $capproy;
            $tdT = $capd;
            $datos->push($data);
          }
          if ($porcT > 0){
            $data = [
              'day' => $day,
              'tipo' => 'MED',
              'fecha' => Carbon::parse($fechaC)->format('d/m/Y'),
              'tiempo' => number_format($tT, 2),
              'tiempoD' => number_format($tdT, 2),
              'porcentaje' => number_format($porcT,2),
              'proyecto' => 'TOTAL',
              'token_project' => '',
            ];
            $datos->push($data);
          }
        }
      }

      Cache::put($fecha . "-". $tipo . "-JYMD", $datos, Self::CACHE_TIME);

      return response()->json(['success' => true,'data' => $datos],200);
    }

    public function indexJsonYearMonthWeek($fecha)
    {
        if (Cache::has($fecha. "-JYMW")){
          $datos= Cache::get($fecha . "-JYMW");
          return response()->json(['success' => true,'data' => $datos],200);
        }

        $fecha_ini_mes = date($fecha . "-01");
        $dayFinal = date("t",strtotime($fecha_ini_mes));
        $fecha_fin_mes  = date($fecha . "-" . $dayFinal);

        $mes_act = (int) substr($fecha_fin_mes,5,2);
        $anno_act = (int) substr($fecha_fin_mes,0,4);
        $anno_ant = $anno_act;
        $anno_post = $anno_act;
        $mes_ant = $mes_act;
        $mes_post = $mes_act;

        if ($mes_act ==1) {
          $mes_ant = 12;
          $anno_ant --;
        }
        else
          $mes_ant --;

        if ($mes_act ==12) {
          $mes_post = 1;
          $anno_post ++;
          }
        else
          $mes_post ++;

        if ($mes_ant < 10)
          $fecha_fin_mes_ant = date($anno_ant . "-0" . $mes_ant) . "-" . date("t",strtotime($anno_ant . "-0" . $mes_ant));
        else
          $fecha_fin_mes_ant =  date($anno_ant . "-" . $mes_ant) . "-" . date("t",strtotime($anno_ant . "-" . $mes_ant));
        $diafin1 = (int) substr($fecha_fin_mes_ant,8,2);
        $diaini1 = $diafin1 - (7 - $this->getDayWeekBefore($fecha_fin_mes_ant));
        if ($mes_ant < 10)
          $fecha_ini_mes_ant = date($anno_ant . "-0" . $mes_ant . "-" . $diaini1);
        else
          $fecha_ini_mes_ant =  date($anno_ant . "-" . $mes_ant . "-" . $diaini1);

        if ($mes_post < 10)
          $fecha_ini_mes_post = date($anno_post . "-0" . $mes_post . "-01");
        else
          $fecha_ini_mes_post = date($anno_post . "-" . $mes_post . "-01");
        $diaini3 = 1;
        $diafin3 = $diaini3 + (7 - $this->getDayWeekafter($fecha_ini_mes_post));
        if ($mes_post < 10)
          $fecha_fin_mes_post =  date($anno_post . "-0" . $mes_post . "-0" . $diafin3);
        else
          $fecha_fin_mes_post =  date($anno_post . "-" . $mes_post . "-0" . $diafin3);

        if ($mes_post < 10)
          $mes_post = "0" . $mes_post;
        $dayini=1;
        $daysum=6;
        $datos = collect([]);
        $fecha1_sem1 = date($fecha . "-01");
        $fpost=false;
        $weekday =  $this->getDayWeek($fecha1_sem1);
        switch ($weekday)  {
          case 'SU':
            $daysum=0;
            break;
          case 'MO':
            $daysum=6;
            break;
          case 'TU':
            $daysum=5;
            break;
          case 'WE':
            $daysum=4;
            break;
          case 'TH':
            $daysum=3;
            break;
          case 'FR':
            $daysum=2;
            break;
          case 'SA':
            $daysum=1;
            break;
        }
        $fecha1_sem1 = $fecha_ini_mes_ant;
        $dayini += $daysum;
        if ($dayini < 10)
          $fecha2_sem1 = date($fecha . "-0" . $dayini);
        else
          $fecha2_sem1 = date($fecha . "-" . $dayini);
        //--
        $dayini += 1;
        if ($dayini < 10)
          $fecha3_sem2 = date($fecha . "-0" . $dayini);
        else
          $fecha3_sem2 = date($fecha . "-" . $dayini);
        $dayini += 6;
        if ($dayini < 10)
          $fecha4_sem2 = date($fecha . "-0" . $dayini);
        else
          $fecha4_sem2 = date($fecha . "-" . $dayini);
        //--
        $dayini += 1;
        $fecha5_sem3 = date($fecha . "-" . $dayini);
        $dayini += 6;
        $fecha6_sem3 = date($fecha . "-" . $dayini);
        //--
        $dayini += 1;
        $fecha7_sem4 = date($fecha . "-" . $dayini);
        $dayini += 6;
        $fecha8_sem4 = date($fecha . "-" . $dayini);
        //--
        $dayini += 1;
        if ($dayini > $dayFinal) {
          $fpost = true;
          $dayini = 1;
          if ($dayini < 10)
            $fecha9_sem5 =  date($anno_post . "-". $mes_post . "-0" . $dayini);
          else
            $fecha9_sem5 =  date($anno_post . "-" . $mes_post . "-" . $dayini);
        }
        else
        {
          if  ($dayini < 10)
            $fecha9_sem5 = date($fecha . "-0" . $dayini);
          else
            $fecha9_sem5 = date($fecha . "-" . $dayini);
        }
        $dayini += 6;
        if ($dayini > $dayFinal) {
          $fpost = true;
          $dayini = $diafin3;
          if ($dayini < 10)
            $fecha10_sem5 = date($anno_post . "-" . $mes_post . "-0" . $dayini);
          else
            $fecha10_sem5 = date($anno_post . "-" . $mes_post . "-" . $dayini);
        }
        else {
          if ($fpost == true)
          {
            if ($dayini < 10)
              $fecha10_sem5 = date($anno_post . "-" . $mes_post . "-0" . $dayini);
            else
              $fecha10_sem5 = date($anno_post . "-" . $mes_post . "-" . $dayini);
          }
          else
          {
            if ($dayini < 10)
              $fecha10_sem5 = date($fecha . "-0" . $dayini);
            else
              $fecha10_sem5 = date($fecha . "-" . $dayini);
          }
        }
        if ($fecha9_sem5 == $fecha8_sem4)
        {
          $fecha9_sem5 = '';
          $fecha10_sem5 = '';
        }

        $dayini += 1;
        if ($dayini > $dayFinal) {
          $fpost = true;
          $dayini = 1;
          if ($dayini < 10)
            $fecha11_sem6 =  date($anno_post . "-". $mes_post . "-0" . $dayini);
          else
            $fecha11_sem6 =  date($anno_post . "-" . $mes_post . "-" . $dayini);
        }
        else
        {
          if  ($fpost == true)
          {
            if ($dayini < 10)
            $fecha11_sem6 =  date($anno_post . "-". $mes_post . "-0" . $dayini);
          else
            $fecha11_sem6 =  date($anno_post . "-" . $mes_post . "-" . $dayini);
          }
          else
          {
            if ($dayini < 10)
              $fecha11_sem6 = date($fecha . "-0" . $dayini);
            else
              $fecha11_sem6 = date($fecha . "-" . $dayini);
          }
        }
        $dayini += 6;
        if ($dayini > $dayFinal) {
          $fpost = true;
          $dayini = $diafin3;
          if ($dayini < 10)
            $fecha12_sem6 = date($anno_post . "-" . $mes_post . "-0" . $dayini);
          else
            $fecha12_sem6 = date($anno_post . "-" . $mes_post . "-" . $dayini);
        }
        else {
          if ($fpost == true){
            if ($dayini < 10)
              $fecha12_sem6 = date($anno_post . "-" . $mes_post . "-0" . $dayini);
            else
              $fecha12_sem6 = date($anno_post . "-" . $mes_post . "-" . $dayini);
            }
          else
            {
              if ($dayini < 10)
              $fecha12_sem6 = date($fecha . "-0" . $dayini);
            else
              $fecha12_sem6 = date($fecha . "-" . $dayini);
            }
        }

        if ($fecha11_sem6 == $fecha10_sem5 || $fecha11_sem6 == $fecha8_sem4)
        {
          $fecha11_sem6 = '';
          $fecha12_sem6 = '';
        }

      /*  $data = [
          'fecha1' => $fecha1_sem1,
          'fecha2' => $fecha2_sem1,
          'fecha3' => $fecha3_sem2,
          'fecha4' => $fecha4_sem2,
          'fecha5' => $fecha5_sem3,
          'fecha6' => $fecha6_sem3,
          'fecha7' => $fecha7_sem4,
          'fecha8' => $fecha8_sem4,
          'fecha9' => $fecha9_sem5,
          'fecha10' => $fecha10_sem5,
          'fecha11' => $fecha11_sem6,
          'fecha12' => $fecha12_sem6,
        ];
        $datos->push($data);
        dd($data);*/
        //---Tiempo de Produccion Semanal
        $tpw_domingo = CapacidadProduccionHoraria::select('domingo')
                                            ->where('nombre', 'Tiempo de Producción')
                                            ->first();
        $horas = explode(":", $tpw_domingo->domingo);
        $tpw_domingo = (int) $horas[0] + ((int) $horas[1])/60;

        $tpw_lunes = CapacidadProduccionHoraria::select('lunes')
                                            ->where('nombre', 'Tiempo de Producción')
                                            ->first();
        $horas = explode(":", $tpw_lunes->lunes);
        $tpw_lunes = (int) $horas[0] + ((int) $horas[1])/60;

        $tpw_martes = CapacidadProduccionHoraria::select('martes')
                                            ->where('nombre', 'Tiempo de Producción')
                                            ->first();
        $horas = explode(":", $tpw_martes->martes);
        $tpw_martes = (int) $horas[0] + ((int) $horas[1])/60;

        $tpw_miercoles = CapacidadProduccionHoraria::select('miercoles')
                                            ->where('nombre', 'Tiempo de Producción')
                                            ->first();
        $horas = explode(":", $tpw_miercoles->miercoles);
        $tpw_miercoles = (int) $horas[0] + ((int) $horas[1])/60;

        $tpw_jueves = CapacidadProduccionHoraria::select('jueves')
                                            ->where('nombre', 'Tiempo de Producción')
                                            ->first();
        $horas = explode(":", $tpw_jueves->jueves);
        $tpw_jueves = (int) $horas[0] + ((int) $horas[1])/60;

        $tpw_viernes = CapacidadProduccionHoraria::select('viernes')
                                            ->where('nombre', 'Tiempo de Producción')
                                            ->first();
        $horas = explode(":", $tpw_viernes->viernes);
        $tpw_viernes = (int) $horas[0] + ((int) $horas[1])/60;

        $tpw_sabado = CapacidadProduccionHoraria::select('sabado')
                                            ->where('nombre', 'Tiempo de Producción')
                                            ->first();
        $horas = explode(":", $tpw_sabado->sabado);
        $tpw_sabado = (int) $horas[0] + ((int) $horas[1])/60;

        $tpw = $tpw_domingo + $tpw_lunes + $tpw_martes + $tpw_miercoles + $tpw_jueves + $tpw_viernes + $tpw_sabado;

        //---Tiempo de Diseño Semanal
        $tdw_domingo = CapacidadProduccionHoraria::select('domingo')
                                            ->where('nombre', 'Tiempo de Diseño')
                                            ->first();
        $horas = explode(":", $tdw_domingo->domingo);
        $tdw_domingo = (int) $horas[0] + ((int) $horas[1])/60;

        $tdw_lunes = CapacidadProduccionHoraria::select('lunes')
                                            ->where('nombre', 'Tiempo de Diseño')
                                            ->first();
        $horas = explode(":", $tdw_lunes->lunes);
        $tdw_lunes = (int) $horas[0] + ((int) $horas[1])/60;

        $tdw_martes = CapacidadProduccionHoraria::select('martes')
                                            ->where('nombre', 'Tiempo de Diseño')
                                            ->first();
        $horas = explode(":", $tdw_martes->martes);
        $tdw_martes = (int) $horas[0] + ((int) $horas[1])/60;

        $tdw_miercoles = CapacidadProduccionHoraria::select('miercoles')
                                            ->where('nombre', 'Tiempo de Diseño')
                                            ->first();
        $horas = explode(":", $tdw_miercoles->miercoles);
        $tdw_miercoles = (int) $horas[0] + ((int) $horas[1])/60;

        $tdw_jueves = CapacidadProduccionHoraria::select('jueves')
                                            ->where('nombre', 'Tiempo de Diseño')
                                            ->first();
        $horas = explode(":", $tdw_jueves->jueves);
        $tdw_jueves = (int) $horas[0] + ((int) $horas[1])/60;

        $tdw_viernes = CapacidadProduccionHoraria::select('viernes')
                                            ->where('nombre', 'Tiempo de Diseño')
                                            ->first();
        $horas = explode(":", $tdw_viernes->viernes);
        $tdw_viernes = (int) $horas[0] + ((int) $horas[1])/60;

        $tdw_sabado = CapacidadProduccionHoraria::select('sabado')
                                            ->where('nombre', 'Tiempo de Diseño')
                                            ->first();
        $horas = explode(":", $tdw_sabado->sabado);
        $tdw_sabado = (int) $horas[0] + ((int) $horas[1])/60;

        $tdw = $tdw_domingo + $tdw_lunes + $tdw_martes + $tdw_miercoles + $tdw_jueves + $tdw_viernes + $tdw_sabado;
        //---
        $datos = collect([]);
        for ($i=1; $i <=6; $i++)
        {
            if ($i==1)
            {
              $fecha1 = $fecha1_sem1;
              $fecha2 = $fecha2_sem1;
            }
            if ($i==2)
            {
              $fecha1 = $fecha3_sem2;
              $fecha2 = $fecha4_sem2;
            }
            if ($i==3)
            {
              $fecha1 = $fecha5_sem3;
              $fecha2 = $fecha6_sem3;
            }
            if ($i==4)
            {
              $fecha1 = $fecha7_sem4;
              $fecha2 = $fecha8_sem4;
            }
            if ($i==5)
            {
              $fecha1 = $fecha9_sem5;
              $fecha2 = $fecha10_sem5;
            }
            if ($i==6)
            {
              $fecha1 = $fecha11_sem6;
              $fecha2 = $fecha12_sem6;
            }
            $proys = null;
/*
            if ($fecha2 == $fecha_fin_mes)
            {
              $day = Carbon::parse($fecha_fin_mes)->dayOfWeek;
              $day = 7 - $day;
              $fechaX = explode("-", $fecha_fin_mes);
              $anno = $fechaX[0];
              $mes = (int) $fechaX[1];
              if ($mes == 12)
              {
                $mes = 1;
                $anno ++;
              }
              else
                $mes++;
              if ($mes < 10)
                $mes = "0" . $mes;
              if ($day < 10)
                $day = "0" . $day;
              $fecha2 = date($anno . "-" . $mes . "-" . $day);

            }
*/
            if ($fecha1 !== "")
            {
              $proys = MedicionInstalacion::distinct()
                                                  ->select('token_project')
                                                  ->whereNotNull('token_project')
                                                  ->whereDate('fecha_medinst',">=",$fecha1)
                                                  ->whereDate('fecha_medinst',"<=",$fecha2)
                                                  ->orderBy('token_project', 'asc')
                                                  ->get();
              if ($proys !== null) {
                $proys2 = Proyecto::distinct()
                                  ->select('token_project')
                                  ->whereNotNull('token_project')
                                  ->whereNotIn('token_project',$proys->pluck('token_project'))
                                  ->whereDate('instalacion_fecha',">=",$fecha1)
                                  ->whereDate('instalacion_fecha',"<=",$fecha2)
                                  ->orderBy('token_project', 'asc')
                                  ->get();
              }
              else {
                $proys2 = Proyecto::distinct()
                                  ->select('token_project')
                                  ->whereNotNull('token_project')
                                  ->whereDate('instalacion_fecha',">=",$fecha1)
                                  ->whereDate('instalacion_fecha',"<=",$fecha2)
                                  ->orderBy('token_project', 'asc')
                                  ->get();
              }
              $pr=collect([]);
              if ($proys !== null) {
                 $proys  = collect($proys->toArray());
                 $pr = $proys;
              }
              if ($proys2 !== null) {
                 $proys2  = collect($proys2->toArray());
                 $pr = $pr->merge($proys2);
              }
              $proys  = $pr;

            }

            $p = "";
            $tp = 0;
            $td = 0;
            if (($proys !== null) && (count($proys) > 0))
            {
                $p = $proys->pluck('token_project');
                $tp = CapacidadProduccionProyecto::whereNotNull('token_project')
                                                    ->whereIn('token_project',$p)
                                                    ->sum('tiempo_produccion_c');
                $td = CapacidadProduccionProyecto::whereNotNull('token_project')
                                                    ->whereIn('token_project',$p)
                                                    ->sum('tiempo_disenio_c');
            }
            $tpporcentaje = "N/D";
            if ($tpw !== 0)
              $tpporcentaje = ($tp * 100)/$tpw;
            $tdporcentaje = "N/D";
            if ($tdw !== 0)
              $tdporcentaje = ($td * 100)/$tdw;
            /*$data = [
                  'week' => $i,
                  'fecha' => $fecha2,
                  'tp' => number_format($tp, 2),
                  'td' => number_format($td, 2),
                  'tpw'=> number_format($tpw, 2),
                  'tdw'=> number_format($tdw, 2),
                  'tpporcentaje' => ($tpporcentaje !=="N/D")? number_format($tpporcentaje,2):$tpporcentaje,
                  'tdporcentaje' => ($tdporcentaje !=="N/D")? number_format($tdporcentaje,2):$tdporcentaje,
                  'proyectos' => $p,
                ];*/

            $avanceTD = ($tdporcentaje !=="N/D")? number_format($tdporcentaje,2):$tdporcentaje;
            $avanceTDW = $avanceTD;
            $avanceTP = ($tpporcentaje !=="N/D")? number_format($tpporcentaje,2):$tpporcentaje;
            $avanceTPW = $avanceTP;
            if (($avanceTD <= 30) || ($avanceTD == "N/D"))
              $avanceTDW = 20;
            if (($avanceTP <= 30) || ($avanceTP == "N/D"))
              $avanceTPW = 20;
            if ($avanceTD > 100)
            {
              $avanceTDW = 100;
            }
            if ($avanceTP > 100)
            {
              $avanceTPW = 100;
            }
            if (($avanceTD <= 40) || ($avanceTD == "N/D")) $stockClassTD = "green";
            else if ($avanceTD <= 50) $stockClassTD = "olive";
            else if ($avanceTD <= 70) $stockClassTD = "olive";
            else if ($avanceTD <= 80) $stockClassTD = "orange";
            else if ($avanceTD <= 1000) $stockClassTD = "red";

            if (($avanceTP <= 40) || ($avanceTP == "N/D")) $stockClassTP = "green";
            else if ($avanceTP <= 50) $stockClassTP = "olive";
            else if ($avanceTP <= 70) $stockClassTP = "olive";
            else if ($avanceTP <= 80) $stockClassTP = "orange";
            else if ($avanceTP <= 1000) $stockClassTP = "red";

            $data = [
                  'id' => "proddisproy",
                  'title' => "ZZZZZZ",
                  'start' => Carbon::parse($fecha2 . " 23:59:59")->format('Y-m-d H:m'),
                  'allDay' => true,
                  'backgroundColor' => "#EEEEEE",
                  'customHtml' => '<div align ="center"><table class="table" style="width:80px">' .
                            '<tr style="height:10px;font-size:9px;">' .
                            '  <th>PRO</th>' .
                            '  <th>DIS</th>' .
                            '</tr>' .
                            '<tr style="vertical-align:middle; color: white; height:50px">' .
                            ' <td style="width:50%">' .
                            '      <div style="text-align:center; background: ' . $stockClassTP .'; height:' . $avanceTPW .'px; display:block !important;word-wrap:break-word !important; font-size:9px;">' .
                                   $avanceTP .'%' .
                            '      </div>' .
                            '  </td>' .
                            '  <td style="width:50%">' .
                            '      <div style="text-align:center; background: ' .$stockClassTD .'; height:' . $avanceTDW . 'px; display:block !important;word-wrap:break-word !important; font-size:9px;">' .
                                    $avanceTD . '%' .
                            '      </div>' .
                            '  </td>' .
                            '</tr>' .
                            '</table></div>',
              ];
            $datos->push($data);

        }

        Cache::put($fecha . "-JYMW", $datos, Self::CACHE_TIME);

        return response()->json(['success' => true,'data' => $datos],200);
    }

    public function indexJsonYearMonthWeekDetail($fecha)
    {
        if (Cache::has($fecha. "-JYMWD")){
          $datos= Cache::get($fecha . "-JYMWD");
          return response()->json(['success' => true,'data' => $datos],200);
        }
        $fpost = false;  
        $fechaW = $fecha;
        $fecha = substr($fecha,0,7);
        $fecha_ini_mes = date($fecha . "-01");
        $dayFinal = date("t",strtotime($fecha_ini_mes));
        $fecha_fin_mes  = date($fecha . "-" . $dayFinal);
        $mes_act = (int) substr($fecha_fin_mes,5,2);
        $anno_act = (int) substr($fecha_fin_mes,0,4);
        $anno_ant = $anno_act;
        $anno_post = $anno_act;
        $mes_ant = $mes_act;
        $mes_post = $mes_act;

        if ($mes_act ==1) {
          $mes_ant = 12;
          $anno_ant --;
        }
        else
          $mes_ant --;

        if ($mes_act ==12) {
          $mes_post = 1;
          $anno_post ++;
          }
        else
          $mes_post ++;

        if ($mes_ant < 10)
          $fecha_fin_mes_ant = date($anno_ant . "-0" . $mes_ant) . "-" . date("t",strtotime($anno_ant . "-0" . $mes_ant));
        else
          $fecha_fin_mes_ant =  date($anno_ant . "-" . $mes_ant) . "-" . date("t",strtotime($anno_ant . "-" . $mes_ant));
        $diafin1 = (int) substr($fecha_fin_mes_ant,8,2);
        $diaini1 = $diafin1 - (7 - $this->getDayWeekBefore($fecha_fin_mes_ant));
        if ($mes_ant < 10)
          $fecha_ini_mes_ant = date($anno_ant . "-0" . $mes_ant) . "-" . $diaini1;
        else
          $fecha_ini_mes_ant =  date($anno_ant . "-" . $mes_ant) . "-" . $diaini1;

        if ($mes_post < 10)
          $fecha_ini_mes_post = date($anno_post . "-0" . $mes_post) . "-01";
        else
          $fecha_ini_mes_post = date($anno_post . "-" . $mes_post) . "-01";
        $diaini3 = 1;
        $diafin3 = $diaini3 + (7 - $this->getDayWeekafter($fecha_ini_mes_post));
        if ($mes_post < 10)
          $fecha_fin_mes_post =  date($anno_post . "-0" . $mes_post) . "-0" . $diafin3;
        else
          $fecha_fin_mes_post =  date($anno_post . "-" . $mes_post) . "-0" . $diafin3;

          if ($mes_post < 10)
          $mes_post = "0" . $mes_post;
        $dayini=1;
        $daysum=6;
        $datos = collect([]);
        $fecha1_sem1 = date($fecha . "-01");

        $weekday =  $this->getDayWeek($fecha1_sem1);
        switch ($weekday)  {
          case 'SU':
            $daysum=0;
            break;
          case 'MO':
            $daysum=6;
            break;
          case 'TU':
            $daysum=5;
            break;
          case 'WE':
            $daysum=4;
            break;
          case 'TH':
            $daysum=3;
            break;
          case 'FR':
            $daysum=2;
            break;
          case 'SA':
            $daysum=1;
            break;
        }
        $fecha1_sem1 = $fecha_ini_mes_ant;
        $dayini += $daysum;
        if ($dayini < 10)
          $fecha2_sem1 = date($fecha . "-0" . $dayini);
        else
          $fecha2_sem1 = date($fecha . "-" . $dayini);
        //--
        $dayini += 1;
        if ($dayini < 10)
          $fecha3_sem2 = date($fecha . "-0" . $dayini);
        else
          $fecha3_sem2 = date($fecha . "-" . $dayini);
        $dayini += 6;
        if ($dayini < 10)
          $fecha4_sem2 = date($fecha . "-0" . $dayini);
        else
          $fecha4_sem2 = date($fecha . "-" . $dayini);
        //--
        $dayini += 1;
        $fecha5_sem3 = date($fecha . "-" . $dayini);
        $dayini += 6;
        $fecha6_sem3 = date($fecha . "-" . $dayini);
        //--
        $dayini += 1;
        $fecha7_sem4 = date($fecha . "-" . $dayini);
        $dayini += 6;
        $fecha8_sem4 = date($fecha . "-" . $dayini);
        //--
        $dayini += 1;
        if ($dayini > $dayFinal) {
          $fpost = true;
          $dayini = 1;
          if ($dayini < 10)
            $fecha9_sem5 =  date($anno_post . "-". $mes_post . "-0" . $dayini);
          else
            $fecha9_sem5 =  date($anno_post . "-" . $mes_post . "-" . $dayini);
        }
        else
        {
          if  ($dayini < 10)
            $fecha9_sem5 = date($fecha . "-0" . $dayini);
          else
            $fecha9_sem5 = date($fecha . "-" . $dayini);
        }
        $dayini += 6;
        if ($dayini > $dayFinal) {
          $fpost = true;
          $dayini = $diafin3;
          if ($dayini < 10)
            $fecha10_sem5 = date($anno_post . "-" . $mes_post . "-0" . $dayini);
          else
            $fecha10_sem5 = date($anno_post . "-" . $mes_post . "-" . $dayini);
        }
        else {
          if ($fpost == true)
          {
            if ($dayini < 10)
              $fecha10_sem5 = date($anno_post . "-" . $mes_post . "-0" . $dayini);
            else
              $fecha10_sem5 = date($anno_post . "-" . $mes_post . "-" . $dayini);
          }
          else
          {
            if ($dayini < 10)
              $fecha10_sem5 = date($fecha . "-0" . $dayini);
            else
              $fecha10_sem5 = date($fecha . "-" . $dayini);
          }
        }
        if ($fecha9_sem5 == $fecha8_sem4)
        {
          $fecha9_sem5 = '';
          $fecha10_sem5 = '';
        }

        $dayini += 1;
        if ($dayini > $dayFinal) {
          $fpost = true;
          $dayini = 1;
          if ($dayini < 10)
            $fecha11_sem6 =  date($anno_post . "-". $mes_post . "-0" . $dayini);
          else
            $fecha11_sem6 =  date($anno_post . "-" . $mes_post . "-" . $dayini);
        }
        else
        {
          if  ($fpost == true)
          {
            if ($dayini < 10)
            $fecha11_sem6 =  date($anno_post . "-". $mes_post . "-0" . $dayini);
          else
            $fecha11_sem6 =  date($anno_post . "-" . $mes_post . "-" . $dayini);
          }
          else
          {
            if ($dayini < 10)
              $fecha11_sem6 = date($fecha . "-0" . $dayini);
            else
              $fecha11_sem6 = date($fecha . "-" . $dayini);
          }
        }
        $dayini += 6;
        if ($dayini > $dayFinal) {
          $fpost = true;
          $dayini = $diafin3;
          if ($dayini < 10)
            $fecha12_sem6 = date($anno_post . "-" . $mes_post . "-0" . $dayini);
          else
            $fecha12_sem6 = date($anno_post . "-" . $mes_post . "-" . $dayini);
        }
        else {
          if ($fpost == true){
            if ($dayini < 10)
              $fecha12_sem6 = date($anno_post . "-" . $mes_post . "-0" . $dayini);
            else
              $fecha12_sem6 = date($anno_post . "-" . $mes_post . "-" . $dayini);
            }
          else
            {
              if ($dayini < 10)
              $fecha12_sem6 = date($fecha . "-0" . $dayini);
            else
              $fecha12_sem6 = date($fecha . "-" . $dayini);
            }
        }

        if ($fecha11_sem6 == $fecha10_sem5 || $fecha11_sem6 == $fecha8_sem4)
        {
          $fecha11_sem6 = '';
          $fecha12_sem6 = '';
        }
/*
        $data = [
          'fecha1' => $fecha1_sem1,
          'fecha2' => $fecha2_sem1,
          'fecha3' => $fecha3_sem2,
          'fecha4' => $fecha4_sem2,
          'fecha5' => $fecha5_sem3,
          'fecha6' => $fecha6_sem3,
          'fecha7' => $fecha7_sem4,
          'fecha8' => $fecha8_sem4,
          'fecha9' => $fecha9_sem5,
          'fecha10' => $fecha10_sem5,
          'fecha11' => $fecha11_sem6,
          'fecha12' => $fecha12_sem6,
        ];
        $datos->push($data);
        dd($data);*/
        //---Tiempo de Produccion Semanal
        $tpw_domingo = CapacidadProduccionHoraria::select('domingo')
                                            ->where('nombre', 'Tiempo de Producción')
                                            ->first();
        $horas = explode(":", $tpw_domingo->domingo);
        $tpw_domingo = (int) $horas[0] + ((int) $horas[1])/60;

        $tpw_lunes = CapacidadProduccionHoraria::select('lunes')
                                            ->where('nombre', 'Tiempo de Producción')
                                            ->first();
        $horas = explode(":", $tpw_lunes->lunes);
        $tpw_lunes = (int) $horas[0] + ((int) $horas[1])/60;

        $tpw_martes = CapacidadProduccionHoraria::select('martes')
                                            ->where('nombre', 'Tiempo de Producción')
                                            ->first();
        $horas = explode(":", $tpw_martes->martes);
        $tpw_martes = (int) $horas[0] + ((int) $horas[1])/60;

        $tpw_miercoles = CapacidadProduccionHoraria::select('miercoles')
                                            ->where('nombre', 'Tiempo de Producción')
                                            ->first();
        $horas = explode(":", $tpw_miercoles->miercoles);
        $tpw_miercoles = (int) $horas[0] + ((int) $horas[1])/60;

        $tpw_jueves = CapacidadProduccionHoraria::select('jueves')
                                            ->where('nombre', 'Tiempo de Producción')
                                            ->first();
        $horas = explode(":", $tpw_jueves->jueves);
        $tpw_jueves = (int) $horas[0] + ((int) $horas[1])/60;

        $tpw_viernes = CapacidadProduccionHoraria::select('viernes')
                                            ->where('nombre', 'Tiempo de Producción')
                                            ->first();
        $horas = explode(":", $tpw_viernes->viernes);
        $tpw_viernes = (int) $horas[0] + ((int) $horas[1])/60;

        $tpw_sabado = CapacidadProduccionHoraria::select('sabado')
                                            ->where('nombre', 'Tiempo de Producción')
                                            ->first();
        $horas = explode(":", $tpw_sabado->sabado);
        $tpw_sabado = (int) $horas[0] + ((int) $horas[1])/60;

        $tpw = $tpw_domingo + $tpw_lunes + $tpw_martes + $tpw_miercoles + $tpw_jueves + $tpw_viernes + $tpw_sabado;

        //---Tiempo de Diseño Semanal
        $tdw_domingo = CapacidadProduccionHoraria::select('domingo')
                                            ->where('nombre', 'Tiempo de Diseño')
                                            ->first();
        $horas = explode(":", $tdw_domingo->domingo);
        $tdw_domingo = (int) $horas[0] + ((int) $horas[1])/60;

        $tdw_lunes = CapacidadProduccionHoraria::select('lunes')
                                            ->where('nombre', 'Tiempo de Diseño')
                                            ->first();
        $horas = explode(":", $tdw_lunes->lunes);
        $tdw_lunes = (int) $horas[0] + ((int) $horas[1])/60;

        $tdw_martes = CapacidadProduccionHoraria::select('martes')
                                            ->where('nombre', 'Tiempo de Diseño')
                                            ->first();
        $horas = explode(":", $tdw_martes->martes);
        $tdw_martes = (int) $horas[0] + ((int) $horas[1])/60;

        $tdw_miercoles = CapacidadProduccionHoraria::select('miercoles')
                                            ->where('nombre', 'Tiempo de Diseño')
                                            ->first();
        $horas = explode(":", $tdw_miercoles->miercoles);
        $tdw_miercoles = (int) $horas[0] + ((int) $horas[1])/60;

        $tdw_jueves = CapacidadProduccionHoraria::select('jueves')
                                            ->where('nombre', 'Tiempo de Diseño')
                                            ->first();
        $horas = explode(":", $tdw_jueves->jueves);
        $tdw_jueves = (int) $horas[0] + ((int) $horas[1])/60;

        $tdw_viernes = CapacidadProduccionHoraria::select('viernes')
                                            ->where('nombre', 'Tiempo de Diseño')
                                            ->first();
        $horas = explode(":", $tdw_viernes->viernes);
        $tdw_viernes = (int) $horas[0] + ((int) $horas[1])/60;

        $tdw_sabado = CapacidadProduccionHoraria::select('sabado')
                                            ->where('nombre', 'Tiempo de Diseño')
                                            ->first();
        $horas = explode(":", $tdw_sabado->sabado);
        $tdw_sabado = (int) $horas[0] + ((int) $horas[1])/60;

        $tdw = $tdw_domingo + $tdw_lunes + $tdw_martes + $tdw_miercoles + $tdw_jueves + $tdw_viernes + $tdw_sabado;
        //---
        $datos = collect([]);
        $week = 0;
        if ($fecha2_sem1 == $fechaW)
        {
          $week = 1;
          $fecha1 = $fecha1_sem1;
          $fecha2 = $fecha2_sem1;
        }
        if ($fecha4_sem2 == $fechaW)
        {
          $week = 2;
          $fecha1 = $fecha3_sem2;
          $fecha2 = $fecha4_sem2;
        }
        if ($fecha6_sem3 == $fechaW)
        {
          $week = 3;
          $fecha1 = $fecha5_sem3;
          $fecha2 = $fecha6_sem3;
        }
        if ($fecha8_sem4 == $fechaW)
        {
          $week = 4;
          $fecha1 = $fecha7_sem4;
          $fecha2 = $fecha8_sem4;
        }
        if ($fecha10_sem5 == $fechaW)
        {
          $week = 5;
          $fecha1 = $fecha9_sem5;
          $fecha2 = $fecha10_sem5;
        }
        if ($fecha12_sem6 == $fechaW)
        {
          $week = 6;
          $fecha1 = $fecha11_sem6;
          $fecha2 = $fecha12_sem6;
        }

        $proys = null;
        /*if ($fecha2 == $fecha_fin_mes)
        {
          $day = Carbon::parse($fecha_fin_mes)->dayOfWeek;
          $day = 7 - $day;
          $fecha = explode("-", $fecha_fin_mes);
          $anno = $fecha[0];
          $mes = (int) $fecha [1];
          if ($mes == 12)
          {
            $mes = 1;
            $anno ++;
          }
          else
            $mes++;
          if ($mes < 10)
            $mes = "0" . $mes;
          if ($day < 10)
            $day = "0" . $day;
          $fecha2 = date($anno . "-" . $mes . "-" . $day);
        }*/

        if ($fecha1 !== "")
        {
          $proys = MedicionInstalacion::distinct()
                                              ->select('token_project','exported')
                                              ->whereNotNull('token_project')
                                              ->whereDate('fecha_medinst',">=",$fecha1)
                                              ->whereDate('fecha_medinst',"<=",$fecha2)
                                              ->get();
          if ($proys !== null) {
            $proys2 = Proyecto::distinct()
                                      ->select('token_project')->selectSub('select 1', 'exported')
                                      ->whereNotNull('token_project')
                                      ->whereNotIn('token_project',$proys->pluck('token_project'))
                                      ->whereDate('instalacion_fecha',">=",$fecha1)
                                      ->whereDate('instalacion_fecha',"<=",$fecha2)
                                      ->get();
          }
          else {
            $proys2 = Proyecto::distinct()
                                      ->select('token_project')->selectSub('select 1', 'exported')
                                      ->whereNotNull('token_project')
                                      ->whereDate('instalacion_fecha',">=",$fecha1)
                                      ->whereDate('instalacion_fecha',"<=",$fecha2)
                                      ->get();
          }
          $pr=collect([]);
          if ($proys !== null) {
             $proys  = collect($proys->toArray());
             $pr = $proys;
          }
          if ($proys2 !== null) {
             $proys2  = collect($proys2->toArray());
             $pr = $pr->merge($proys2);
          }
          $proys  = $pr;
        }

        $p = "";
        $tp = 0;
        $td = 0;
        //Totales
        $porcDis = 0;
        $tdDis = 0;
        $tdwDis = 0;
        $porcPro = 0;
        $tpPro = 0;
        $tpwPro = 0;
        //-------------------------
        if (($proys !== null) && (count($proys) > 0))
        {
          foreach ($proys as $p) {
            $tp = CapacidadProduccionProyecto::whereNotNull('token_project')
                                                ->where('token_project',$p['token_project'])
                                                ->sum('tiempo_produccion_c');
            $proyName = "";
            $exported = 1;
            if ($p['exported'] !== null)
              $exported = $p['exported'];
            if ($exported === 0)
            {
              $py = ProyectoJson::where('token_project',$p['token_project'])->orderBy('id','desc')->first();
              if ($py !== null)
              {
                $proyName = $py->nombre;
                if ($py->client_name != null)
                $proyName = $py->client_name . " - " . $py->nombre;
                if ($py->mueble != null)
                  $proyName .= " - " . $py->mueble;
              }
            }
            else
            {
              $py = Proyecto::where('token_project',$p['token_project'])->first();
              if ($py !== null)
                $proyName = $py->proyecto;
            }
            $porc = "N/D";
            if ($tpw !== 0)
              $porc = ($tp * 100)/$tpw;
            $data = [
                'week' => $week,
                'fecha1' => $fecha1,
                'fecha2' => $fecha2,
                'tipo' => 'PRO',
                'tiempo' => number_format($tp, 2),
                'tiempoW'=> number_format($tpw, 2),
                'porcentaje' => ($porc !=="N/D")? number_format($porc,2):$porc,
                'proyecto' => $proyName,
                'token_project' => $p['token_project'],
            ];
            if ($tpw > 0)
            {
              $porcPro += ($porc !=="N/D")? $porc:0;
              $tpPro += $tp;
              $tpwPro = $tpw;
              $datos->push($data);
            }
            $td = CapacidadProduccionProyecto::whereNotNull('token_project')
                                                    ->where('token_project',$p['token_project'])
                                                    ->sum('tiempo_disenio_c');
            $porc = "N/D";
            if ($tdw !== 0)
              $porc = ($td * 100)/$tdw;
            $data = [
              'week' => $week,
              'fecha1' => $fecha1,
              'fecha2' => $fecha2,
              'tipo' => 'DIS',
              'tiempo' => number_format($td, 2),
              'tiempoW'=> number_format($tdw, 2),
              'porcentaje' => ($porc !=="N/D")? number_format($porc,2):$porc,
              'proyecto' => $proyName,
              'token_project' => $p['token_project'],
            ];
            if ($tdw > 0)
            {
              $porcDis += ($porc !=="N/D")? $porc:0;
              $tdDis += $td;
              $tdwDis = $tdw;
              $datos->push($data);
            }
          }
        }
        if ($porcPro > 0)
        {
          $data = [
            'week' => $week,
            'fecha1' => $fecha1,
            'fecha2' => $fecha2,
            'tipo' => 'PRO',
            'tiempo' => number_format($tpPro, 2),
            'tiempoW'=> number_format($tpwPro, 2),
            'porcentaje' => number_format($porcPro, 2),
            'proyecto' => 'TOTAL',
            'token_project' => '',
          ];
          $datos->push($data);
        }
        if ($porcDis > 0)
        {
          $data = [
            'week' => $week,
            'fecha1' => $fecha1,
            'fecha2' => $fecha2,
            'tipo' => 'DIS',
            'tiempo' => number_format($tdDis, 2),
            'tiempoW'=> number_format($tdwDis, 2),
            'porcentaje' => number_format($porcDis, 2),
            'proyecto' => 'TOTAL',
            'token_project' => '',
          ];
          $datos->push($data);
        }

        Cache::put($fecha . "-JYMWD", $datos, Self::CACHE_TIME);

        return response()->json(['success' => true,'data' => $datos],200);
    }

    private function getDayWeek($date)
    {
        $weekMap = [
            0 => 'SU',
            1 => 'MO',
            2 => 'TU',
            3 => 'WE',
            4 => 'TH',
            5 => 'FR',
            6 => 'SA',
          ];
        $dayOfTheWeek = Carbon::parse($date)->dayOfWeek;
        return $weekMap[$dayOfTheWeek];
    }

    private function getDayWeekBefore($date)
    {

      if (Carbon::parse($date)->dayOfWeek == 1)
         return 7;
      if (Carbon::parse($date)->dayOfWeek == 2)
         return 6;
      if (Carbon::parse($date)->dayOfWeek == 3)
         return 5;
      if (Carbon::parse($date)->dayOfWeek == 4)
         return 4;
      if (Carbon::parse($date)->dayOfWeek == 5)
         return 3;
      if (Carbon::parse($date)->dayOfWeek == 6)
         return 2;
      if (Carbon::parse($date)->dayOfWeek == 0)
         return 1;
    }

    private function getDayWeekafter($date)
    {

      if (Carbon::parse($date)->dayOfWeek >= 1)
         return Carbon::parse($date)->dayOfWeek;
      else
         return 7;
    }

    public function store(Request $request)
    {
      DB::beginTransaction();
      try {
        $this->validate($request, [
          'fecha_medinst' => 'required',
          'hora_medinst' => 'required',
          'tipo_medinst' => 'required',
          'token_project' => 'required',
          'proyecto_id' => '',
          'comentario' => '',
          'exported' => '',
      ]);

      $hora = explode("T", $request->input('hora_medinst'));
      $dia = substr($request->input('fecha_medinst'),0,2);
      $mes = substr($request->input('fecha_medinst'),3,2);
      $año = substr($request->input('fecha_medinst'),6,4);
      $fecha = $año."-".$mes."-".$dia . " " . substr($hora[1],0,5);

      $fecha = \DateTime::createFromFormat('Y-m-d H:i',$fecha);
      $proyecto_id = null;
      if ($request->input('proyecto_id') !== null)
        $proyecto_id = $request->input('proyecto_id');
      $exported = 0;

      if ($request->input('exported') !== null)
        $exported = $request->input('exported');
      $data = [
          'fecha_medinst' => $fecha,
          'tipo_medinst' => $request->input('tipo_medinst'),
          'comentario' => $request->input('comentario'),
          'proyecto_id' => $proyecto_id,
          'token_project' => $request->input('token_project'),
          'exported'  => $exported,
      ];
      MedicionInstalacion::create($data);
      if ($proyecto_id !== null)
      {
        $reg = MedicionInstalacion::where('token_project', '=', $request->input('token_project'))
                                  ->where('tipo_medinst',1)
                                  ->orderBy('fecha_medinst','ASC')->first();
        $instalacion_fecha = $reg->fecha_medinst;
        $p = Proyecto::find($proyecto_id);
        $data = ['instalacion_fecha' => $instalacion_fecha];
        $p->update($data);
      }
      $this->clear_cache();
      DB::commit();
      return response()->json(['success' => true],201);

      } catch (Exception $e) {
        DB::rollback();
        return response()->json(['success' => false,'error' => $e],422);
      }

    }

    public function update($id, Request $request)
    {
      DB::beginTransaction();
      try {
        $this->validate($request, [
          'fecha_medinst' => 'required',
          'hora_medinst' => 'required',
          'tipo_medinst' => 'required',
          'comentario' => '',
      ]);

      $hora = explode("T", $request->input('hora_medinst'));
      $dia = substr($request->input('fecha_medinst'),0,2);
      $mes = substr($request->input('fecha_medinst'),3,2);
      $año = substr($request->input('fecha_medinst'),6,4);
      $fecha = $año."-".$mes."-".$dia . " " . substr($hora[1],0,5);

      $fecha = \DateTime::createFromFormat('Y-m-d H:i',$fecha); //Formato produccion

      $data = [
          'fecha_medinst' => $fecha,
          'tipo_medinst' => $request->input('tipo_medinst'),
          'comentario' => $request->input('comentario'),
      ];

      $medinst = MedicionInstalacion::find($id);

      $medinst->update($data);

      if ($medinst->proyecto_id !== null)
      {
        $reg = MedicionInstalacion::where('token_project', '=', $medinst->token_project)
                                  ->where('tipo_medinst',1)
                                  ->orderBy('fecha_medinst','ASC')->first();
        $instalacion_fecha = $reg->fecha_medinst;
        $p = Proyecto::find($medinst->proyecto_id);
        $data = ['instalacion_fecha' => $instalacion_fecha];
        $p->update($data);
      }

      $this->clear_cache();
      DB::commit();
      return response()->json(['success' => true],200);

      } catch (Exception $e) {
        DB::rollback();
        return response()->json(['success' => false,'error' => $e],422);
      }

    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $proyecto = MedicionInstalacion::findOrFail((int) $id);
            $proyecto->delete();

            $this->clear_cache();
            DB::commit();

            return response()->json(['success' => true],200);
        } catch (Exception $e) {
            DB::rollback();
        }

        return response()->json(['success' => false,'error' => $e],404);
    }

  public function clear_cache()
  {
    Artisan::call('cache:clear');
  }
}
