<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Intervention\Image\ImageManagerStatic as Image;
use Storage;
use App\Models\ImagenesPresupuesto;

class ImagenesPresupuestoController extends Controller
{

  public function saveUrl(Request $request)
  {
    $imagenesPresupuesto = new ImagenesPresupuesto();
    
    $imagenesPresupuesto->token = $request->token;
    $imagenesPresupuesto->imagen = $request->input('url');
    $imagenesPresupuesto->name = $request->input('nombre');
    $imagenesPresupuesto->remote = 1;
    $imagenesPresupuesto->save();

    return response()->json([
      'imagen' => $imagenesPresupuesto->imagen,
      'name' => $imagenesPresupuesto->name,
      'remote' => $imagenesPresupuesto->remote,
      'id' => $imagenesPresupuesto->id,
    ]);
  }

  public function upload(Request $request)
  {

    $path = $request->file('file');

    if(($path->getSize()/1024)/1024 > 10){
      return response()->json(['message' => 'El Archivo pesa demasiado pesado (más de 10MB)'], 400);
    }
    $token = $request->token;

    $original = $path->store('ImagenesPresupuesto');
    $resize = Image::make($path)->resize(100, 100);
    $nombreOriginal = $path->getClientOriginalName();

    $nombreconextension = $original;
    $nombrearchivo = pathinfo($nombreconextension, PATHINFO_FILENAME);

    $extension = pathinfo($nombreconextension, PATHINFO_EXTENSION); //$path->getClientOriginalExtension();

    $nombrethumbnail = $nombrearchivo . '_thumb' . '.' . $extension;

    Storage::disk()->put('ImagenesPresupuesto/' . $nombrethumbnail, (string) $resize->encode());
    $imagenesPresupuesto = new ImagenesPresupuesto();
    $imagenesPresupuesto->token = $token;
    $imagenesPresupuesto->imagen = $nombrearchivo . '.' . $extension;
    $imagenesPresupuesto->name = "";
    $imagenesPresupuesto->remote = 0;
    $imagenesPresupuesto->save();

    return response()->json(['filePath' => $nombrearchivo . '.' . $extension]);
  }


  public function get($token)
  {

    $imagenes = ImagenesPresupuesto::where('token', '=', $token)->get();

    foreach ($imagenes as $img) {
      $nombre = explode('.', $img->imagen);
      if($img->remote === 0){
        $nombre[1] = '_thumb.' . $nombre[1];
        $img->thumb = implode($nombre);
      }
      
    }
    return response()->json(['path' => url('/presupuesto/file/image/'), 'imagenes' => $imagenes]);
  }

  public function delete($id)
  {

    $image = ImagenesPresupuesto::findOrFail($id);

    if($image->remote === 0){
      $nombre = explode('.', $image->imagen);
      $nombre[1] = '_thumb.' . $nombre[1];
      $thumb = implode($nombre);
      Storage::delete("/ImagenesPresupuesto/" . $thumb);
    }
    

    Storage::delete("/ImagenesPresupuesto/" . $image->imagen);
    
    $image->delete();

    return response()->json("", 200);
  }
}
