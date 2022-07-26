<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Grupo;
use App\Models\GrupoUsuario;

class GruposController extends Controller {

    public function index() {
        $grupos = Grupo::whereHas('grupoUsuarios', function($q) {
                    $q->where('activo', true);
                })->With('grupoUsuarios.usuario')->Get();
        return response()->json($grupos);
    }

    public function byId($id) {
        $gruposUsuario = GrupoUsuario::Where('usuario_id', $id)->get();
        $arrayGruposMios = array();

        if ($gruposUsuario->count() != 0) {
            foreach ($gruposUsuario as $gu) {
                array_push($arrayGruposMios, Grupo::Where('id', $gu->grupo_id)->get()[0]);
            }
        }
        return response()->json($arrayGruposMios);
    }

    public function create(Request $request) {

        $rules = [
            'nombre_grupo' => 'required|string',
        ];
        $this->validate($request, $rules);
        $data = json_decode(json_encode($request->all()));

        $verifico = Grupo::Where('nombre_grupo', strtoupper($data->nombre_grupo))->get();
        $cantidad = $verifico->count();
        if ($cantidad == 0) {
            $grupos_data = [
                'nombre_grupo' => $data->nombre_grupo,
                'activo' => $data->activo,
                'created_at' => Carbon::now()->format('Y-m-d'),
            ];
            $grupo = new Grupo();
            $grupo->fill($grupos_data);
            if ($grupo->save()) {

                foreach ($data->integrantes as $integrantes) {
                    $grupoUsuario = new GrupoUsuario();
                    $grupoUsuario->usuario_id = $integrantes;
                    $grupoUsuario->grupo_id = $grupo->id;
                    $grupoUsuario->save();
                }
            }
            return response()->json(['grupo' => $grupo]);
        } else {
            return response('Ya existe un grupo con ese nombre', 409);
        }
    }

    public function update(Request $request, $id) {

        $data = json_decode(json_encode($request->all()));

        if ($data->id != $id) {
            return response('', 400);
        }

        $verifico = Grupo::Where('id', $id)->get();
        $cantidad = $verifico->count();
        if ($cantidad > 0) {
            $actualizo = Grupo::find($data->id);
            $actualizo->nombre_grupo = $data->nombre_grupo;
            $actualizo->activo = $data->activo;

            if (property_exists($data, 'integrantes')) {
                if (count($data->integrantes) != 0) {
                    $grupo_usuario = GrupoUsuario::Where('grupo_id', $data->id)->Get();
                    $lista_usuario = Array();

                    foreach ($grupo_usuario as $usuario) {
                        //echo $usuario->usuario_id . " ";
                        $ent_usuario = GrupoUsuario::Where('usuario_id', $usuario->usuario_id)->Where('grupo_id', $data->id)->get();
                        $ent_usuario[0]->activo = 0;
                        $ent_usuario[0]->save();
                    }


                    foreach ($data->integrantes as $integrantes) {
                        $ent_usuario = GrupoUsuario::Where('usuario_id', $integrantes)->where('grupo_id', $data->id)->get();
                        if (count($ent_usuario) > 0) {
                            $ent_usuario[0]->activo = true;
                            $ent_usuario[0]->save();
                        } else {
                            $ent_usuario = new GrupoUsuario();
                            $ent_usuario->grupo_id = $data->id;
                            $ent_usuario->usuario_id = $integrantes;
                            $ent_usuario->created_at = Carbon::now()->format('Y-m-d');
                            $ent_usuario->activo = true;
                            $ent_usuario->save();
                        };
                    }



                    /*
                     * 
                     * else {
                      $ent_usuario = new GrupoUsuario();
                      $ent_usuario->grupo_id = $data->id;
                      $ent_usuario->usuario_id = $integrantes;
                      $ent_usuario->created_at = Carbon::Now;
                      $ent_usuario->activo = true;
                      $ent_usuario->save();
                      }
                     * 
                      $verificarUsuario = array_diff($lista_usuario, $integrantesAux);
                      //return response()->json($verificarUsuario);

                      if (count($verificarUsuario) > 0) {
                      foreach ($verificarUsuario as $id) {

                      $ent_usuario = GrupoUsuario::Where('usuario_id', $id)->get();

                      if (count($ent_usuario) > 0) {

                      $ent_usuario[0]->activo = false;

                      if ($ent_usuario[0]->save()) {

                      }
                      }
                      }
                      } */
                }
            }

            if ($actualizo->save()) {
                return response()->json(['grupo' => $actualizo]);
            } else {
                return response('Error al actualizar la entidad', 400);
            }
        } else {
            return response('', 409);
        }
    }

}
