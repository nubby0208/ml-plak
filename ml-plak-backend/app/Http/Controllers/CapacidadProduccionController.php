<?php

namespace App\Http\Controllers;

use App\Models\CapacidadProduccion;
use Illuminate\Http\Request;
use DB;

class CapacidadProduccionController extends Controller
{
    public function index()
    {
        $tiemposTraslados = CapacidadProduccion::all();

        return response()->json(['data' => $tiemposTraslados],200);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'item' => 'required',
            'tiempo_disenio' => 'required',
            'tiempo_produccion' => 'required',
            'tiempo_medicion' => 'required',
            'tiempo_instalacion' => 'required',
            'coeficiente_multiplicador' => 'required'
        ]);

        $horas = explode(":", $request->input('tiempo_disenio'));
        $td_c = (float) $horas[0];
        if (count($horas) >1)
          $td_c += ((float) $horas[1])/60;
        $horas = explode(":", $request->input('tiempo_produccion'));
        $tp_c = (float) $horas[0];
        if (count($horas) >1)
          $tp_c += ((float) $horas[1])/60;
        $horas = explode(":", $request->input('tiempo_medicion'));
        $tm_c = (float) $horas[0];
        if (count($horas) >1)
          $tm_c += ((float) $horas[1])/60;
        $horas = explode(":", $request->input('tiempo_instalacion'));
        $ti_c = (float) $horas[0];
        if (count($horas) >1)
          $ti_c += ((float) $horas[1])/60;

        //dd($td_c . " - " . $tp_c . " - " . $tm_c . " - " . $ti_c);

        $data = [
            'item' => $request->input('item'),
            'tiempo_disenio' => $request->input('tiempo_disenio'),
            'tiempo_produccion' => $request->input('tiempo_produccion'),
            'tiempo_medicion' => $request->input('tiempo_medicion'),
            'tiempo_instalacion' => $request->input('tiempo_instalacion'),
            'coeficiente_multiplicador' => number_format($request->input('coeficiente_multiplicador'),2,'.',','),
            'tiempo_disenio_c' => number_format($td_c,2,'.',','),
            'tiempo_produccion_c' => number_format($tp_c,2,'.',','),
            'tiempo_medicion_c' => number_format($tm_c,2,'.',','),
            'tiempo_instalacion_c' => number_format($ti_c,2,'.',','),
        ];

        CapacidadProduccion::create($data);

        return response()->json(['status' => true],201);
    }

    public function update(Request $request, $id)
    {

      try {
        $this->validate($request, [
          'item' => 'required',
          'tiempo_disenio' => 'required',
          'tiempo_produccion' => 'required',
          'tiempo_medicion' => 'required',
          'tiempo_instalacion' => 'required',
          'coeficiente_multiplicador' => 'required'
        ]);

        $capacidad = CapacidadProduccion::findOrFail($id);

        $horas = explode(":", $request->input('tiempo_disenio'));
        $td_c = (float) $horas[0] + ((float) $horas[1])/60;
        $horas = explode(":", $request->input('tiempo_produccion'));
        $tp_c = (float) $horas[0] + ((float) $horas[1])/60;
        $horas = explode(":", $request->input('tiempo_medicion'));
        $tm_c = (float) $horas[0] + ((float) $horas[1])/60;
        $horas = explode(":", $request->input('tiempo_instalacion'));
        $ti_c = (float) $horas[0] + ((float) $horas[1])/60;

        $data = [
          'item' => $request->input('item'),
          'tiempo_disenio' => $request->input('tiempo_disenio'),
          'tiempo_produccion' => $request->input('tiempo_produccion'),
          'tiempo_medicion' => $request->input('tiempo_medicion'),
          'tiempo_instalacion' => $request->input('tiempo_instalacion'),
          'coeficiente_multiplicador' => number_format($request->input('coeficiente_multiplicador'),2,'.',','),
          'tiempo_disenio_c' => number_format($td_c,2,'.',','),
          'tiempo_produccion_c' => number_format($tp_c,2,'.',','),
          'tiempo_medicion_c' => number_format($tm_c,2,'.',','),
          'tiempo_instalacion_c' => number_format($ti_c,2,'.',','),
        ];

        $capacidad->update($data);
        return response()->json(['status' => true,'data' => $capacidad],200);

      } catch (Exception $e) {
        return response()->json(['status' => false,'error' => $e->getMessage()],404);
      }
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $proyecto = CapacidadProduccion::findOrFail((int) $id);
            $proyecto->delete();

            DB::commit();

            return response()->json(['status' => true]);
        } catch (Exception $e) {
            DB::rollback();
        }

        return response()->json(['status' => false],404);
    }
}
