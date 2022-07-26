<?php

namespace App\Http\Controllers;

use App\Models\CapacidadProduccionHoraria;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;
use Illuminate\Support\Facades\Artisan;

class CapacidadProduccionHorariaController extends Controller
{
    public function index()
    {
        return response()->json(['status' => true,'data' => CapacidadProduccionHoraria::all()],200);
    }

  public function store(Request $request)
  {
      DB::beginTransaction();
      try {
        $this->validate($request, [
            'nombre' => 'required|unique:capacidad_produccion_horaria,nombre',
            'lunes' => 'required|string',
            'martes' => 'required|string',
            'miercoles' => 'required|string',
            'jueves' => 'required|string',
            'viernes' => 'required|string',
            'sabado' => 'required|string',
            'domingo' => 'required|string',
            'weekday' => 'required'
        ]);

        $data = $request->all();
        CapacidadProduccionHoraria::create($data);
        $this->clear_cache();
        DB::commit();
        return response()->json(['status' => true],201);
      } catch (Exception $e) {
        DB::rollback();
        return response()->json(['status' => false,'error' => $e->getMessage()],404);
      }
  }

  public function update(Request $request, $id)
	{
    DB::beginTransaction();
    try {
      $this->validate($request, [
        'nombre' => 'required|unique:capacidad_produccion_horaria,nombre,' . $id,
        'lunes' => 'required|string',
        'martes' => 'required|string',
        'miercoles' => 'required|string',
        'jueves' => 'required|string',
        'viernes' => 'required|string',
        'sabado' => 'required|string',
        'domingo' => 'required|string',
        'weekday' => 'required'
      ]);

      $capacidad = CapacidadProduccionHoraria::findOrFail($id);

      $data = $request->all();
      $capacidad->update($data);

      $this->clear_cache();
      DB::commit();
      return response()->json(['status' => true,'data' => $capacidad],200);

    } catch (Exception $e) {
      DB::rollback();
      return response()->json(['status' => false,'error' => $e->getMessage()],404);
    }
  }

  public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $reg = CapacidadProduccionHoraria::findOrFail((int) $id);
            $reg->delete();

            $this->clear_cache();
            DB::commit();

            return response()->json(['status' => true],200);
        } catch (Exception $e) {
            DB::rollback();
        }

        return response()->json(['status' => false,'error' => $e->getMessage()],404);
    }

    public function clear_cache()
    {
      Artisan::call('cache:clear');
    }
}
