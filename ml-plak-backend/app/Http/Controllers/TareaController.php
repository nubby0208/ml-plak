<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Grupo;
use App\Models\Tarea;
use App\Models\Usuario;
use App\Models\GrupoUsuario;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;
use JWTAuth;

class TareaController extends Controller {

    const CACHE_TIME = 180;
    public function index(Request $request) {
        /*if (!JWTAuth::parseToken()->authenticate()) {
            return response()->json('', 401);
        }*/
        $user = $request->user;
        $arrayTareasGruprales = Array();
        $arrayTareasUsuario = Array();
        $arrayTareasGenerales = Array();

        $idUsuario = $user;
        $usuario = Usuario::Find($idUsuario);

        if ($usuario->rol_id == 1) {
            $tareasGrupales = Tarea::with('grupo')->whereNotNull('grupo_id')->where('realizado', 0)->orderBy('updated_at', 'DESC')->get();
            foreach ($tareasGrupales as $tarea) {
                array_push($arrayTareasGruprales, $tarea);
            }
            $tareasGrupales = Tarea::with('grupo')->whereNotNull('grupo_id')->where('realizado', 1)->orderBy('updated_at', 'DESC')->limit(5)->get();
            foreach ($tareasGrupales as $tarea) {
                array_push($arrayTareasGruprales, $tarea);
            }
        }
        else {
            $grupos = GrupoUsuario::whereHas('grupo', function($q) {
                        $q->where('activo', 1);
                    })->Where('usuario_id', $idUsuario)->get();

            foreach ($grupos as $grupo) {
                $tareasGrupales = Tarea::with('grupo')->Where('grupo_id', $grupo->grupo_id)->where('realizado', 0)->orderBy('updated_at', 'DESC')->get();

                foreach ($tareasGrupales as $tarea) {
                    array_push($arrayTareasGruprales, $tarea);
                }
            }

            foreach ($grupos as $grupo) {
              $tareasGrupales = Tarea::with('grupo')->Where('grupo_id', $grupo->grupo_id)->where('realizado', 1)->orderBy('updated_at', 'DESC')->limit(5)->get();
              foreach ($tareasGrupales as $tarea) {
                array_push($arrayTareasGruprales, $tarea);
              }
            }
        }

        $tareasUsuarios = Tarea::Where('usuario_id', $idUsuario)->where('realizado', 0)->orderBy('updated_at', 'DESC')->get();
        foreach ($tareasUsuarios as $tareaUsuario) {
            array_push($arrayTareasUsuario, $tareaUsuario);
        }

        $tareasUsuarios = Tarea::Where('usuario_id', $idUsuario)->where('realizado', 1)->orderBy('updated_at', 'DESC')->limit(5)->get();
        foreach ($tareasUsuarios as $tareaUsuario) {
            array_push($arrayTareasUsuario, $tareaUsuario);
        }

        $tareasGenerales = Tarea::Where('usuario_id', null)->where('grupo_id', null)->orderBy('updated_at', 'DESC')->where('realizado', 0)->get();
        foreach ($tareasGenerales as $tareaGeneral) {
            array_push($arrayTareasGenerales, $tareaGeneral);
        }

        $tareasGenerales = Tarea::Where('usuario_id', null)->where('grupo_id', null)->where('realizado', 1)->orderBy('updated_at', 'DESC')->limit(5)->get();
        foreach ($tareasGenerales as $tareaGeneral) {
            array_push($arrayTareasGenerales, $tareaGeneral);
        }


        $arrayFinal = Array();
        array_push($arrayFinal, $arrayTareasUsuario);
        array_push($arrayFinal, $arrayTareasGruprales);
        array_push($arrayFinal, $arrayTareasGenerales);
        return response()->json($arrayFinal);
	}

  public function indexCalendar(Request $request) {

    $user = $request->user;
    $arrayTareasGruprales = Array();
    $arrayTareasUsuario = Array();
    $arrayTareasGenerales = Array();
    $idUsuario = $user;
    $usuario = Usuario::Find($idUsuario);

    if ($usuario->rol_id == 1) {
        $tareasGrupales = Tarea::with('grupo')->whereNotNull('grupo_id')->where('realizado', 0)->where('ver_calendario', 1)->orderBy('updated_at', 'DESC')->get();
        foreach ($tareasGrupales as $tarea) {
            array_push($arrayTareasGruprales, $tarea);
        }
    }
    else {
        $grupos = GrupoUsuario::whereHas('grupo', function($q) {
                    $q->where('activo', 1);
                })->Where('usuario_id', $idUsuario)->get();

        foreach ($grupos as $grupo) {
            $tareasGrupales = Tarea::with('grupo')->Where('grupo_id', $grupo->grupo_id)->where('realizado', 0)->where('ver_calendario', 1)->orderBy('fecha_calendario', 'ASC')->get();
            foreach ($tareasGrupales as $tarea) {
                array_push($arrayTareasGruprales, $tarea);
            }
        }
    }

    $tareasUsuarios = Tarea::Where('usuario_id', $idUsuario)->where('realizado', 0)->where('ver_calendario', 1)->orderBy('fecha_calendario', 'ASC')->get();
    foreach ($tareasUsuarios as $tareaUsuario) {
        array_push($arrayTareasUsuario, $tareaUsuario);
    }

    $tareasGenerales = Tarea::Where('usuario_id', null)->where('grupo_id', null)->orderBy('fecha_calendario', 'ASC')->where('realizado', 0)->where('ver_calendario', 1)->get();
    foreach ($tareasGenerales as $tareaGeneral) {
        array_push($arrayTareasGenerales, $tareaGeneral);
    }

    $datos = collect([]);
    $fondoClass = "#cccccc";
    $stockClass = "yellow";
    $i=0;
    foreach ($arrayTareasGruprales as $tarea)
    {
      $i++;
      $hayNota="";
      if (empty($tarea->detalle_descripcion) == false) {
         $hayNota='<div class="col-sm-1" style="display: flex !important;"><span style="color: green !important;">&#10063;</span></div>';
      }
      $data = [
        'id' => "taskcalendar" . $tarea->id,
        'title' => "FFFFFF",
        'start' => Carbon::parse( $tarea->fecha_calendario)->format('Y-m-d H:m'),
        'end' => Carbon::parse( $tarea->fecha_calendario)->format('Y-m-d'),
        'allDay' => true,
        'backgroundColor' => $fondoClass,
        'borderColor' => $stockClass,
        "customHtml" => '<div class="container" style="padding:0px !important;">' .
          '<div class="row">' .
          '<div class="col-sm-7"><span style="color: black !important;white-space:normal; display:block !important;word-wrap:break-word !important; font-size:9px;">' .
          'Tarea Grupal ' . $i . ': ' . $tarea->descripcion . '</span></div>' .  $hayNota .
          '</div></div>',
      ];
      $datos->push($data);
    }
    $i=0;
    foreach ($arrayTareasUsuario as $tarea)
    {
      $i++;
      $hayNota="";
      if (empty($tarea->detalle_descripcion) == false) {
         $hayNota='<div class="col-sm-1" style="display: flex !important;"><span style="color: green !important;">&#10063;</span></div>';
      }
      $data = [
        'id' => "taskcalendar" . $tarea->id,
        'title' => "FFFFFF",
        'start' => Carbon::parse( $tarea->fecha_calendario)->format('Y-m-d H:m'),
        'end' => Carbon::parse( $tarea->fecha_calendario)->format('Y-m-d'),
        'allDay' => true,
        'backgroundColor' => $fondoClass,
        'borderColor' => $stockClass,
        "customHtml" => '<div class="container" style="padding:0px !important;">' .
          '<div class="row">' .
          '<div class="col-sm-7"><span style="color: black !important;white-space:normal; display:block !important;word-wrap:break-word !important; font-size:9px;">' .
          'Mi Tarea ' . $i . ': ' . $tarea->descripcion . '</span></div>' .  $hayNota .
          '</div></div>',
      ];
      $datos->push($data);
    }
    $i=0;
    foreach ($arrayTareasGenerales as $tarea)
    {
      $i++;
      $hayNota="";
      if (empty($tarea->detalle_descripcion) == false) {
         $hayNota='<div class="col-sm-1" style="display: flex !important;"><span style="color: green !important;">&#10063;</span></div>';
      }
      $data = [
        'id' => "taskcalendar" . $tarea->id,
        'title' => "FFFFFF",
        'start' => Carbon::parse( $tarea->fecha_calendario)->format('Y-m-d H:m'),
        'end' => Carbon::parse( $tarea->fecha_calendario)->format('Y-m-d'),
        'allDay' => true,
        'backgroundColor' => $fondoClass,
        'borderColor' => $stockClass,
        "customHtml" => '<div class="container" style="padding:0px !important;">' .
          '<div class="row">' .
          '<div class="col-sm-7"><span style="color: black !important;white-space:normal; display:block !important;word-wrap:break-word !important; font-size:9px;">' .
          'Tarea General ' . $i . ': ' . $tarea->descripcion . '</span></div>' .  $hayNota .
          '</div></div>',
      ];
      $datos->push($data);
    }

    return response()->json(['success' => true,'data' => $datos],200);
  }

  public function show($id) {
    $tarea = Tarea::find($id);
    return response()->json(['success' => true,'data' => $tarea],200);
  }

  public function create(Request $request) {
      try {
        $this->validate($request, [
          'usuario_id' => 'nullable|integer',
          'grupo_id' => 'nullable|integer',
          'realizado' => 'required|integer|min:0|max:0',
          'descripcion' => 'required',
          'detalle_descripcion' => 'nullable|string',
          'ver_calendario' => 'required|integer|min:0|max:1',
          'fecha_calendario' => 'required_if:ver_calendario,1'
        ]);

        $fecha_calendario = null;
        if (empty($request->fecha_calendario) == false)
        {
          $fecha_calendario = explode("/", $request->fecha_calendario);
          $fecha_calendario = $fecha_calendario[2] . "-" . $fecha_calendario[1] . "-" . $fecha_calendario[0];
        }
        $data = [
            'usuario_id' => $request->usuario_id,
            'grupo_id' => $request->grupo_id,
            'realizado' => $request->realizado,
            'descripcion' => $request->descripcion,
            'detalle_descripcion' => $request->detalle_descripcion,
            'ver_calendario' => $request->ver_calendario,
            'fecha_calendario' => $fecha_calendario
        ];

        $tarea = Tarea::create($data);
        $this->clear_cache();
        return response()->json(['status' => true,'data' => $tarea],201);
      } catch (Exception $e) {
        return response()->json(['status' => false,'error' => $e->getMessage()],404);
      }
  }

  public function update(Request $request, $id) {
      try {
        $this->validate($request, [
          'usuario_id' => 'nullable|integer',
          'grupo_id' => 'nullable|integer',
          'realizado' => 'required|integer|min:0|max:1',
          'descripcion' => 'required',
          'detalle_descripcion' => 'nullable|string',
          'ver_calendario' => 'required|integer|min:0|max:1',
          'fecha_calendario' => 'required_if:ver_calendario,1'
        ]);

        $tarea = Tarea::findOrFail($id);
        $fecha_calendario = null;
        if (empty($request->fecha_calendario) === false)
        {
          $fecha_calendario = $request->fecha_calendario;
        }
        if (Str::contains($request->fecha_calendario, '/') === true)
        {
          $fecha_calendario = explode("/", $request->fecha_calendario);
          $fecha_calendario = $fecha_calendario[2] . "-" . $fecha_calendario[1] . "-" . $fecha_calendario[0];
        }
        $data = [
            'usuario_id' => $request->usuario_id,
            'grupo_id' => $request->grupo_id,
            'realizado' => $request->realizado,
            'descripcion' => $request->descripcion,
            'detalle_descripcion' => $request->detalle_descripcion,
            'ver_calendario' => $request->ver_calendario,
            'fecha_calendario' => $fecha_calendario
        ];

        $tarea->update($data);
        $this->clear_cache();
        return response()->json(['status' => true,'data' => $tarea],200);
      } catch (Exception $e) {
        return response()->json(['status' => false,'error' => $e->getMessage()],404);
      }
  }

  public function updateNota(Request $request, $id) {
    try {
      $this->validate($request, [
        'detalle_descripcion' => 'required|string'
      ]);

      $tarea = Tarea::findOrFail($id);
      $data = [
        'detalle_descripcion' => $request->detalle_descripcion,
      ];
      $tarea->update($data);
      $this->clear_cache();
      return response()->json(['status' => true,'data' => $tarea],200);
    } catch (Exception $e) {
      return response()->json(['status' => false,'error' => $e->getMessage()],404);
    }
  }

  public function destroy($id)
  {
        try {
            $tarea = Tarea::findOrFail($id);
            $tarea->delete();

            $this->clear_cache();
            return response()->json(['status' => true],200);
        } catch (Exception $e) {
          return response()->json(['status' => false,'error' => $e->getMessage()],404);
        }
  }

  public function clear_cache()
  {
    Artisan::call('cache:clear');
  }
}
