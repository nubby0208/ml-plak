<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Grupo;

class GrupoController extends Controller {

    public function index() {
        $grupos = Grupo::Get();
        return response()->json($grupos);
    }

   public function create(Request $request) {

        $rules = [
            'nombre' => 'required|string',
            'activo' => 'required|boolean'
        ];
        $this->validate($request, $rules);
        $data = json_decode(json_encode($request->all()));

        $verifico = Grupo::Where(strtoupper('nombre'), strtoupper($data->nombre))->get();
        $cantidad = $verifico->count();
        if ($cantidad == 0) {
            $grupos_data = [
                'nombre' => $data->nombre,
                'activo' => $data->activo,
                'created_at' => Carbon::now()->format('Y-m-d'),
            ];
            $grupo = new Grupo();
            $grupo->fill($grupos_data);
            $grupo->save();
            return response()->json($grupo);
        } else {
            return response('Existe otro grupo con ese nombre', 409);
        }
    }

  public function update(Request $request, $id) {

        $rules = [
            'id' => 'required|int',
            'nombre' => 'required|string',
            'activo' => 'required|boolean'
        ];
        $this->validate($request, $rules);
        $data = json_decode(json_encode($request->all()));

        if ($data->id != $id) {
           return response('No se encontró el recurso', 404);
        }
        $grupo = Grupo::Where('id', $id)->get();
        $existe = $grupo->count();
        if ($existe == 1) {
            $verifico = Grupo::Where(strtoupper('nombre'), strtoupper($data->nombre))->get();
            $cantidad = $verifico->count();
            if ($cantidad == 0) {
                $actualizo = Grupo::find($data->id);
                $actualizo->nombre = $data->nombre;
                $actualizo->activo = $data->activo;
                if ($actualizo->save()) {
                    return response()->json($actualizo);
                } else {
                    return response('Error al actualizar la entidad', 400);
                }
            } else {
                return response('Existe otro grupo con ese nombre', 409);
            }
        } else {
            return response('No se encontró el recurso', 404);
        }
    }
}
