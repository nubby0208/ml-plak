<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ThreeScene;

class ThreeSceneController extends Controller
{
    // crear una escena
    public function create(Request $request)
	{
        $proyecto_id =  $request->input('project_id');
        $m = ThreeScene::firstOrNew(['proyecto_id' => $proyecto_id]);
        $data=[
                'proyecto_id' => $request->input('project_id'),
                'markers' => $request->input('markers'),
                'editorData' => $request->input('editorData'),
                'scene'=> $request->input('scene')
            ];
        $m->fill($data);
        $m->save();

    }

    // obtener una escena
    public function get($proyecto_id){
 
        $scene =  ThreeScene::Where( 'proyecto_id', $proyecto_id )->firstOrFail();

        return response($scene->scene)->header('Content-Disposition', 'attachment')
                               ->header('Content-Type', 'text')
                         ->header('filename','scene-'. $proyecto_id .'.gltf');

    }

    //obtener data para re-crear marcadores
    public function getMarkers($proyecto_id){
        $row =  ThreeScene::Where( 'proyecto_id', $proyecto_id )->firstOrFail();
        return response()->json($row->markers);
    }

    //obtener la informacion de cambios del editor
    public function getEditorData($proyecto_id){
        $row =  ThreeScene::Where( 'proyecto_id', $proyecto_id )->firstOrFail();
        return response()->json($row->editorData);
    }

}
