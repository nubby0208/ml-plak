<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Intervention\Image\ImageManagerStatic as Image;
use Storage;
use App\Models\Imagenevento;

class ImagenesEventosController extends Controller {

    //upload image
    public function upload(Request $request) {

        $path = $request->file('file');

        $id = $request->id;

        if($id != null){

        $original = $path->store('ImagenesEventos');
        $resize = Image::make($path)->resize(100, 100);

        $nombreconextension = $original; 
        $nombrearchivo = pathinfo($nombreconextension, PATHINFO_FILENAME);

        $extension = pathinfo($nombreconextension, PATHINFO_EXTENSION); //$path->getClientOriginalExtension();

        $nombrethumbnail = $nombrearchivo . '_thumb' . '.' . $extension;

        Storage::disk()->put('ImagenesEventos/' . $nombrethumbnail, (string) $resize->encode());
        
       $imagenEvento = new Imagenevento;
       $imagenEvento->imagen = $nombrearchivo . '.' . $extension;
       $imagenEvento->evento_id = $id;
        $imagenEvento->save();
        return response()->json(['filePath' => $nombrearchivo . '.' . $extension]);
    } 
        return  response('Error al obtener ID', 400);
      //  return response()->json(['filePath' => $nombrearchivo . '.' . $extension]);
    }

    public function getEventImages($eventId) {

        $imagenes = Imagenevento::where('evento_id', '=', $eventId)->get();

        foreach ($imagenes as $img) {
            $nombre = explode('.', $img->imagen);
            $nombre[1] = '_thumb.' . $nombre[1];
            $img->imagen = implode($nombre);

        }
        return response()->json(['path' => url('/eventimage/file/'), 'imagenes' => $imagenes]);
    }

    public function getEventImagesThumbs($eventId) {

        $imagenes = Imagenevento::where('evento_id', '=', $eventId)->get();

        foreach ($imagenes as $img) {
            $img["fullimage"] = $img->imagen;
            $nombre = explode('.', $img->imagen);
            $nombre[1] = '_thumb.' . $nombre[1];
            $img->imagen = implode($nombre);
        }

        return response()->json(['path' => url('/eventimage/file/'), 'imagenes' => $imagenes]);
    }

    public function deleteEventImages($image_name) {
        //echo "deleting: " .$image_name;
        $extension = pathinfo($image_name, PATHINFO_EXTENSION);
        $nombreArr = explode('_', $image_name);
        $nombre = $nombreArr[0] . '.' . $extension;

        //echo "Borrando: " .$image_name. ' Y '. $nombre;

        Imagenevento::where('imagen', 'LIKE', $nombre)->delete();

        Storage::delete("/ImagenesEventos/" . $image_name);
        Storage::delete("/ImagenesEventos/" . $nombre);

        return response()->json("", 200);
    }

}

//end
