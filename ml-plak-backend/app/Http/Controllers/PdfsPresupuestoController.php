<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Storage;
use App\Models\PdfsPresupuesto;

class PdfsPresupuestoController extends Controller
{

  public function saveUrl(Request $request)
  {
    $pdfsPresupuesto = new PdfsPresupuesto();
    $pdfsPresupuesto->token = $request->token;
    $pdfsPresupuesto->pdf = $request->input('url');
    $pdfsPresupuesto->name = $request->input('nombre');
    $pdfsPresupuesto->remote = 1;
    $pdfsPresupuesto->save();

    return response()->json([
      'pdf' => $pdfsPresupuesto->pdf,
      'name' => $pdfsPresupuesto->name,
      'remote' => $pdfsPresupuesto->remote,
      'id' => $pdfsPresupuesto->id,
    ]);
  }

  public function upload(Request $request)
  {

    $path = $request->file('file');

    if(($path->getSize()/1024)/1024 > 10){
      return response()->json(['message' => 'El Archivo pesa demasiado pesado (más de 10MB)'], 400);
    }

    $token = $request->token;
    $nombreOriginal = $path->getClientOriginalName();
    $original = $path->store('PdfsPresupuesto');

    $nombreconextension = $original;
    $nombrearchivo = pathinfo($nombreconextension, PATHINFO_FILENAME);
    $extension = pathinfo($nombreconextension, PATHINFO_EXTENSION); 


    $pdfsPresupuesto = new PdfsPresupuesto();
    $pdfsPresupuesto->token = $token;
    $pdfsPresupuesto->pdf = $nombrearchivo . '.' . $extension;
    $pdfsPresupuesto->name = $nombreOriginal;
    $pdfsPresupuesto->remote = 0;
    $pdfsPresupuesto->save();

    return response()->json(['filePath' => $nombrearchivo . '.' . $extension]);
  }


  public function get($token)
  {

    $pdfs = PdfsPresupuesto::where('token', '=', $token)->get();


    return response()->json(['path' => url('/presupuesto/file/pdf/'), 'pdfs' => $pdfs]);
  }

  public function delete($id)
  {

    $pdf = PdfsPresupuesto::findOrFail($id);

    $nombre = explode('.', $pdf->imagen);

    Storage::delete("/PdfsPresupuesto/" . $pdf->pdf);

    $pdf->delete();

    return response()->json("", 200);
  }
}
