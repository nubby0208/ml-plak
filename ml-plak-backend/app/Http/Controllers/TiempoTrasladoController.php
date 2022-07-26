<?php

namespace App\Http\Controllers;

use App\Models\TiempoTraslado;
use App\Models\UsuarioEstado;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;

class TiempoTrasladoController extends Controller
{
    public function index()
    {
        $tiemposTraslados = TiempoTraslado::all();

        return response()->json(['data' => $tiemposTraslados]);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'descripcion' => 'required',
            'tiempo_traslado' => 'required'
        ]);

        $horas = explode(":", $request->input('tiempo_traslado'));
        $tt_c = (float) $horas[0];
        if (count($horas) >1)
          $tt_c += ((float) $horas[1])/60;
        $data = [
            'descripcion' => $request->input('descripcion'),
            'tiempo_traslado' => $request->input('tiempo_traslado'),
            'tiempo_traslado_c' => number_format($tt_c,2,'.',','),
        ];

        TiempoTraslado::create($data);

        return response()->json(['status' => true]);
    }

    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'descripcion' => 'required',
            'tiempo_traslado' => 'required'
        ]);

        $traslado = TiempoTraslado::findOrFail($id);

        $horas = explode(":", $request->input('tiempo_traslado'));
        $tt_c = (float) $horas[0];
        if (count($horas) >1)
          $tt_c += ((float) $horas[1])/60;
        $data = [
            'descripcion' => $request->input('descripcion'),
            'tiempo_traslado' => $request->input('tiempo_traslado'),
            'tiempo_traslado_c' => number_format($tt_c,2,'.',','),
        ];

        $traslado->update($data);
        return response()->json(['status' => true]);
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $proyecto = TiempoTraslado::findOrFail((int) $id);
            $proyecto->delete();

            DB::commit();

            return response()->json(['status' => true]);
        } catch (Exception $e) {
            DB::rollback();
        }
    }
}
