<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Proyecto;
use App\Models\Usuario;
use App\Models\EncuestaRespuesta;
use App\Models\EncuestaPregunta;

class EncuestaRespuestaController extends Controller {

    public function index(Request $request) {
        $relations = [
            'cliente',
            'encuestarespuesta.usuario',
            'encuestarespuesta.encuestapregunta'
        ];
        $search = $request->search;
        $proyectos = Proyecto::query()
                               ->join('clientes', 'clientes.id','=', 'proyectos.cliente_id')
                               ->where('finalizado',1);
        if (empty($search) === false){
            $proyectos = $proyectos->where(function ($query) use($search) {
				$query = $query->where('proyecto', 'like', "%$search%")
							   ->orWhere('clientes.nombre_completo','like', "%$search%");
			  });
        }                      
        $proyectos = $proyectos->with($relations)
                               ->select(['proyectos.id','proyecto','cliente_id','instalacion_nota','token_project'])
                               ->orderBy('id','desc')
                               ->paginate(20);
        
        $proyectos->map($this->mapProcessProyectos());                      
        return response()->json(['success' => true,'data' => $proyectos],200);
    }

    private function mapProcessProyectos(): callable {
		return function ($proy, $key) {
            $proy->detalle_reporte = 0;
        };
	}    

    public function store(Request $request) {
        $data = json_decode(json_encode($request->all()));


        foreach ($data->reportes as $encuesta_respuesta) {
            $encuesta = new EncuestaRespuesta();
            $encuesta->id_proyecto = $request->id;
            $encuesta->usuario_id = $request->usuario;
            $encuesta->id_pregunta = $encuesta_respuesta->id;
            $encuesta->respuesta = $encuesta_respuesta->descripcion;
            $encuesta->created_at = Carbon::now()->format('Y-m-d');
            $encuesta->save();
        }

        $proyecto = Proyecto::Where('id', $request->id)->get();

        $proyecto[0]->finalizado = true;
        $proyecto[0]->observaciones = "";
        $proyecto[0]->save();
        return response()->json($proyecto);
    }

    public function update(Request $request, $id) {

        $encuesta_respuesta = EncuestaRespuesta::Where('id_proyecto', $id)->get();
        if (count($encuesta_respuesta) > 0) {
            foreach ($encuesta_respuesta as $respuesta) {
                $respuesta->delete();
            }

            $proyecto = Proyecto::Find($id);
            $proyecto->finalizado = false;
            $proyecto->observaciones = "";
            $proyecto->save();
            return response()->json($proyecto);
        } else {
            return response()->json("No se encontró una entidad a actualizar", 404);
        }
    }

}
