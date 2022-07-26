<?php

namespace App\Http\Controllers;

use App\Models\CapacidadProduccionProyecto;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use DB;
use Illuminate\Support\Facades\Artisan;

class CapacidadProduccionProyectoController extends Controller
{
    public function index($proyecto_id)
    {
        $capacidadProduccion = CapacidadProduccionProyecto::where('proyecto_id', $proyecto_id)->orderBy('id', 'asc')->get();

        return response()->json(['success' => true,'data' => $capacidadProduccion],200);
    }

    public function indexJson($proyecto_id)
    {
        $capacidadProduccion = CapacidadProduccionProyecto::where('token_project', $proyecto_id)
                                                          ->orderBy('id')
                                                          ->get();

        return response()->json(['success' => true,'data' => $capacidadProduccion],200);
    }

    public function store(Request $request)
    {
      DB::beginTransaction();
      try {
        $this->validate($request, [
            'item' => 'required',
            'tiempo_disenio' => 'required',
            'tiempo_produccion' => 'required',
            'tiempo_medicion' => 'required',
            'tiempo_instalacion' => 'required',
            'coeficiente_multiplicador' => 'required'
        ]);

        $proyectoId = null;
        if ($request->input('proyecto_id') !== null)
          $proyectoId = $request->input('proyecto_id');
        $exported = 0;
        if ($request->input('exported') !== null)
        $exported = $request->input('exported');
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
            'exported' => $exported,
            'token_project' => $request->input('token_project'),
            'proyecto_id' => $proyectoId,
        ];
       /* $reg=CapacidadProduccionProyecto::where('token_project', '=', $request->input('token_project'))
                                ->where('item',$request->input('item'))
                                ->count();
        if ($reg>0) {
          throw new ModelNotFoundException('El registro ya existe. Item: ' . $request->input('item'));
        }*/

        $this->clear_cache();
        CapacidadProduccionProyecto::create($data);
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
          'item' => 'required',
          'tiempo_disenio' => 'required',
          'tiempo_produccion' => 'required',
          'tiempo_medicion' => 'required',
          'tiempo_instalacion' => 'required',
          'coeficiente_multiplicador' => 'required'
        ]);

        $capacidad = CapacidadProduccionProyecto::findOrFail($id);

        $proyectoId = null;
        if ($request->input('proyecto_id') !== null)
          $proyectoId = $request->input('proyecto_id');
        $exported = 0;
        if ($request->input('exported') !== null)
          $exported = $request->input('exported');
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
            'exported' => $exported,
            'token_project' => $request->input('token_project'),
            'proyecto_id' => $proyectoId,
        ];

        $this->clear_cache();
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
            $proyecto = CapacidadProduccionProyecto::findOrFail((int) $id);
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
