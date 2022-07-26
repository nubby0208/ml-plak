<?php

namespace App\Http\Controllers;

use App\Models\TiempoTrasladoProyecto;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use DB;
use Illuminate\Support\Facades\Artisan;

class TiempoTrasladoProyectoController extends Controller
{
    public function index($proyecto_id)
    {
        $traslado = TiempoTrasladoProyecto::where('proyecto_id', $proyecto_id)->orderBy('id', 'asc')->get();

        return response()->json(['success' => true,'data' => $traslado],200);
    }

    public function indexToken($token)
    {
        $traslado = TiempoTrasladoProyecto::where('token_project', $token)
                                                          ->orderBy('id')
                                                          ->get();

        return response()->json(['success' => true,'data' => $traslado],200);
    }

    public function store(Request $request)
    {
      DB::beginTransaction();
      try {
        $this->validate($request, [
            'descripcion' => 'required',
            'tiempo_traslado' => 'required',
        ]);

        $proyectoId = null;
        if ($request->input('proyecto_id') !== null)
          $proyectoId = $request->input('proyecto_id');
        $exported = 0;
        if ($request->input('exported') !== null)
        $exported = $request->input('exported');
        $horas = explode(":", $request->input('tiempo_traslado'));
        $tt_c = (float) $horas[0];
        if (count($horas) >1)
          $tt_c += ((float) $horas[1])/60;

        $data = [
            'descripcion' => $request->input('descripcion'),
            'tiempo_traslado' => $request->input('tiempo_traslado'),
            'tiempo_traslado_c' => number_format($tt_c,2,'.',','),
            'exported' => $exported,
            'token_project' => $request->input('token_project'),
            'proyecto_id' => $proyectoId,
        ];

        TiempoTrasladoProyecto::create($data);

        $this->clear_cache();
        DB::commit();
        return response()->json(['success' => true],201);

      } catch (ModelNotFoundException $e) {
        DB::rollback();
        return response()->json(['success' => false,'error' => $e->getMessage()],404);
      } catch (Exception $e) {
        DB::rollback();
        return response()->json(['success' => false,'error' => $e->getMessage()],500);
      }

    }

    public function update(Request $request, $id)
    {

      try {
        $this->validate($request, [
          'descripcion' => 'required',
          'tiempo_traslado' => 'required',
        ]);

        $traslados = TiempoTrasladoProyecto::findOrFail($id);

        $proyectoId = null;
        if ($request->input('proyecto_id') !== null)
          $proyectoId = $request->input('proyecto_id');
        $exported = 0;
        if ($request->input('exported') !== null)
        $exported = $request->input('exported');
        $horas = explode(":", $request->input('tiempo_traslado'));
        $tt_c = (float) $horas[0];
        if (count($horas) >1)
          $tt_c += ((float) $horas[1])/60;

        $data = [
            'descripcion' => $request->input('descripcion'),
            'tiempo_traslado' => $request->input('tiempo_traslado'),
            'tiempo_traslado_c' => number_format($tt_c,2,'.',','),
            'exported' => $exported,
            'token_project' => $request->input('token_project'),
            'proyecto_id' => $proyectoId,
        ];

        $this->clear_cache();
        $traslados->update($data);
        return response()->json(['status' => true,'data' => $traslados],200);

      } catch (Exception $e) {
        return response()->json(['status' => false,'error' => $e->getMessage()],404);
      }
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $proyecto = TiempoTrasladoProyecto::findOrFail((int) $id);
            $proyecto->delete();

            $this->clear_cache();
            DB::commit();

            return response()->json(['success' => true],200);
        } catch (Exception $e) {
            DB::rollback();
        }

        return response()->json(['success' => false,'error' => $e],404);
    }

    public function clear_cache()
    {
      Artisan::call('cache:clear');
    }
}
