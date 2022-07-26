<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Storage;
use App\Models\VideosPresupuesto;

class VideosPresupuestoController extends Controller
{

  public function saveUrl(Request $request)
  {
    $videosPresupuesto = new VideosPresupuesto();
    $videosPresupuesto->token = $request->token;
    $videosPresupuesto->video = $request->input('url');
    $videosPresupuesto->name = $request->input('nombre');
    $videosPresupuesto->remote = 1;
    $videosPresupuesto->save();

    return response()->json([
      'video' => $videosPresupuesto->video,
      'name' => $videosPresupuesto->name,
      'remote' => $videosPresupuesto->remote,
      'id' => $videosPresupuesto->id,
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
    $original = $path->store('VideosPresupuesto');
    $nombreconextension = $original;
    $nombrearchivo = pathinfo($nombreconextension, PATHINFO_FILENAME);
    $extension = pathinfo($nombreconextension, PATHINFO_EXTENSION); 

    

    $videosPresupuesto = new VideosPresupuesto();
    $videosPresupuesto->token = $token;
    $videosPresupuesto->video = $nombrearchivo . '.' . $extension;
    $videosPresupuesto->name = $nombreOriginal;
    $videosPresupuesto->remote = 0;
    $videosPresupuesto->save();

    return response()->json(['filePath' => $nombrearchivo . '.' . $extension]);
  }


  public function get($token)
  {

    $videos = VideosPresupuesto::where('token', '=', $token)->get();


    return response()->json(['path' => url('/presupuesto/file/video/'), 'videos' => $videos]);
  }

  public function delete($id)
  {

    $video = VideosPresupuesto::findOrFail($id);

    $nombre = explode('.', $video->imagen);

    Storage::delete("/VideosPresupuesto/" . $video->video);

    $video->delete();

    return response()->json("", 200);
  }
}
