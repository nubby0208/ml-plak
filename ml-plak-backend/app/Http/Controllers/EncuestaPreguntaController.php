<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EncuestaPregunta;
use Carbon\Carbon;

class EncuestaPreguntaController extends Controller {

    //
    public function index() {
        return response(EncuestaPregunta::Get());
    }

    public function store(Request $request) {

        $rules = [
            'nombre' => 'required|string',
        ];

        $this->validate($request, $rules);

        $data = json_decode(json_encode($request->all()));

        $encuesta_pregunta = new EncuestaPregunta();
        $encuesta_pregunta->nombre = $data->nombre;
        $encuesta_pregunta->esTexto = $data->esTexto;
        $encuesta_pregunta->esPregunta = $data->esPregunta;
        $encuesta_pregunta->esEstrella = $data->esEstrella;
        $encuesta_pregunta->estado = 1;
        $encuesta_pregunta->created_at = Carbon::now()->format('Y-m-d');
        $encuesta_pregunta->save();

        return response()->json($encuesta_pregunta);
    }

    public function update(Request $request, $id) {
        $data = json_decode(json_encode($request->all()));

        if ($data->id != $id) {
            return response('', 400);
        }

        $encuesta_pregunta = EncuestaPregunta::Where('id', $id)->get();
        $existe = $encuesta_pregunta->count();
        if ($existe == 1) {
            $actualizo = EncuestaPregunta::find($data->id);
            $actualizo->nombre = $data->nombre;
            $actualizo->estado = $data->estado;
            $actualizo->esTexto = $data->esTexto;
            $actualizo->esEstrella = $data->esEstrella;
            $actualizo->esPregunta = $data->esPregunta;
            $actualizo->updated_at = Carbon::now()->format('Y-m-d');
            if ($actualizo->save()) {
                return response()->json($actualizo);
            } else {
                return response('Error al actualizar la entidad', 400);
            }
        } else {
            return response('', 409);
        }
    }

}
