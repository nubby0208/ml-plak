<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Presupuesto;
use App\Models\Usuario;
use Barryvdh\DomPDF\Facade as PDF;
use Carbon\Carbon;
use JWTAuth;

class PresupuestoController extends Controller
{

  public function getByToken($token)
  {
    $token = Presupuesto::where('token', $token)->get();
    return response()->json($token);
  }

  public function create(Request $request)
  {
    $data = json_decode(json_encode($request->all()));

    if ($data->id != null) {
      $presupuesto = Presupuesto::find($request->id);
    } else {
      $presupuesto = new Presupuesto();
    }

    $presupuesto->token = $data->token;
    $presupuesto->results = $data->results;
    $presupuesto->estado = $data->estado;
    $presupuesto->imagen1 = $data->imagen1;
    $presupuesto->imagen2 = $data->imagen2;
    $presupuesto->imagen3 = $data->imagen3;
    $presupuesto->imagen4 = $data->imagen4;
    $presupuesto->imagen5 = $data->imagen5;
    $presupuesto->usuario = $data->usuario;
    $presupuesto->project_id = $data->project_id;

    $presupuesto->save();
    return response()->json(["ok" => true]);
  }

  public function reabrir(Request $request)
  {

    $presupuesto = Presupuesto::find($request->id);
    $presupuesto->estado = 1;
    $presupuesto->save();

    return response()->json(["ok" => true]);
  }

  public function exportarPdf(Request $request)
  {
    $presupuesto = Presupuesto::find($request->id);
    $presupuesto->estado = 0;
    $presupuesto->fecha_cotizacion =  Carbon::now()->format('Y-m-d');
    $presupuesto->save();

    $results = json_decode($presupuesto->results);
    $pdf = PDF::loadView('pdf.presupuesto', compact(['presupuesto', 'results']))->setOptions(["setIsHtml5ParserEnabled"=>true])->save(storage_path() . "/app/" .  $presupuesto->id . "-" . $presupuesto->token . ".pdf");
    $pdf = base64_encode(file_get_contents(storage_path() . "/app/" . $presupuesto->id . "-" . $presupuesto->token . ".pdf"));

    return response()->json(["ok" => true, "dataPresupuesto" => $presupuesto,  "pdf" => $pdf]);
  }

  public function verPdfPresupuesto($id)
  {
    $presupuesto = Presupuesto::find($id);
    $results = json_decode($presupuesto->results);
    $pdf = PDF::loadView('pdf.presupuesto', compact(['presupuesto', 'results']))->setOptions(["setIsHtml5ParserEnabled"=>true])->stream($presupuesto->id . "-" . $presupuesto->token . ".pdf");
    $pdf = base64_encode($pdf);

    return response()->json(["ok" => true, "pdf" => $pdf]);
  }

  public function index(Request $request)
  {
    $data = json_decode(json_encode($request->all()));
    $page = $data->page;
    $sortBy = $data->sortBy;
    $sortDesc = $data->sortDesc;
    $nombre = $data->searchParam;
    $usuario = $data->usuario;
    $seguimiento = $data->seguimiento;

    $presupuesto = Presupuesto::select(["id","token","results","estado","fecha", "fecha_cotizacion", "usuario","project_id","usuario_cotizando",
                                        "asignado_id", "dificultad_id", "prioridad_id", "seguimiento_id", "economia_id"])->when(
      $sortBy != "" && $sortBy != null,
      function ($query) use ($sortBy, $sortDesc) {
        $query->orderBy($sortBy, $sortDesc ? 'desc' : 'asc');
      }
    )->when($nombre != '', function ($query) use ($nombre) {
      $query->where('results', 'LIKE', '%"name":"%'.$nombre.'%"%');
    })->when($usuario != '', function ($query) use ($usuario) {
      $query->where('usuario', $usuario);
    })->when($seguimiento != '', function ($query) use ($seguimiento) {
      $query->where('seguimiento_id', $seguimiento);
    })
      ->paginate(20, ['*'], 'page', $page);

    $pageLimit = ceil($presupuesto->total() / 20);

    foreach ($presupuesto as $pres) {
      if ($pres->estado == 0 ||  $pres->estado == 3 ) {
        try {
          if(file_exists(storage_path() . "/app/" . $pres->id . "-" . $pres->token . ".pdf")){
            $pres->pdf = base64_encode(file_get_contents(storage_path() . "/app/" . $pres->id . "-" . $pres->token . ".pdf"));         
            // mejorar de perform wuilmer garcia
            // $pres->pdf = base64_encode(file_get_contents(storage_path() . "/app/" . $pres->id . "-" . $pres->token . ".pdf"));    
            $pres->pdf = true;
            $pres->pdflink = url("/file/" .$pres->id . "-" . $pres->token . ".pdf");
          }else{
            $pres->pdf = false;;
            $pres->pdflink ="";
          }          
        } catch (\Throwable $th) {
          $pres->pdf = false;
          $pres->pdflink ="";
        }
        
      }
    };

    return response()->json([
      "data" => $presupuesto,
    ]);
  }

  public function loginFromPresupuesto(Request $request)
  {

    $data = json_decode(json_encode($request->all()));
    $token = Presupuesto::where('token', $data->token)->get();

    if ($token->count() > 0) {

      $usuario = Usuario::where('usuario', $data->usuario)->first();
      if ($usuario != null) {
        $token = '';
        if (!$token = JWTAuth::fromUser($usuario))
          return response()->json(['error' => 'invalid_credentials'], 401);
        $usuario->last_login_date = Carbon::now()->format('Y-m-d');
        $usuario->save();
        return response()->json([
          'success' => true, 'data' => [
            'token' => $token,
            'usuario' => [
              'id' => $usuario->id,
              'usuario' => $usuario->usuario,
              'rol' => $usuario->rol->rol
            ],
            'yet_login_today' => false
          ]
        ]);
      }
    }
  }

  public function deletebulk(Request $request)
  {
    $this->validate($request, [
      'ids' => 'array'
    ]);
    foreach($request->ids as $id) {
      $presupuesto = Presupuesto::find($id);
      if($presupuesto)
        $presupuesto->delete();
    }
    return response()->json(["ok" => true]);
  }

  public function update(Request $request, Presupuesto $presupuesto)
  {
    $this->validate($request, [
      'estado' => 'required|in:0,1,2,3',
      'usuario_cotizando' => 'string',
    ]); 
    $presupuesto->estado = $request->estado;
    $presupuesto->usuario_cotizando = $request->usuario_cotizando;
    $presupuesto->save();
    return response()->json($presupuesto);
  }


  public function updateEstado(Request $request, Presupuesto $presupuesto)
  {
    $this->validate($request, [
      'estado' => 'required|in:0,1,2,3'
    ]); 
    $presupuesto->estado = $request->estado;
    $presupuesto->save();
    return response()->json($presupuesto);
  }
 
  public function updateCampo(Request $request, $id) {
    try {
  
      $this->validate($request, [
        'campo' => 'required|string',
        'campo_id' =>'required|integer'  
      ]);
      
      $data = [];
      
      if($request->campo == "asignado"){
        $data = ['asignado_id' => $request->campo_id];
      }

      if($request->campo == "dificultad"){
        $data = ['dificultad_id' => $request->campo_id];
      }

      if($request->campo == "prioridad"){
        $data = ['prioridad_id' => $request->campo_id];
      }

      if($request->campo == "seguimiento"){
        $data = ['seguimiento_id' => $request->campo_id];
      }

      if($request->campo == "economia"){
        $data = ['economia_id' => $request->campo_id];
      }

  
      $query = Presupuesto::findOrFail($id);
      $query->update($data);
              
      // $this->clear_cache();
      return response()->json(['status' => true,'data' => $query],200);
    }catch (Exception $e) {
      return response()->json(['status' => false,'error' => $e->getMessage()],404);
    }
  }


}



