<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PresupuestosPreset;

class PresupuestosPresetController extends Controller
{
  public function index()
  {
    $presupuestos_preset = PresupuestosPreset::Get();

    return response()->json($presupuestos_preset);
  }

  public function create(Request $request)
  {
    $data = json_decode(json_encode($request->all()));

    if ($data->nombre == null || $data->result == null) return response('El nombre no puede ser nulo', 400);

    $verifico = PresupuestosPreset::Where('nombre', $data->nombre)->get();
    if ($verifico->count() == 0) {
      $presupuestos_preset = new PresupuestosPreset();
      $presupuestos_preset->nombre = $data->nombre;
      $presupuestos_preset->result = $data->result;
      $presupuestos_preset->save();
      return response()->json(['ok' => true, 'presupuestos_preset' => $presupuestos_preset]);
    } else {
      return response()->json(['ok' => false, 'message' => 'Existe otro preset con ese nombre']);
    }
  }

  public function delete($id)
  {
    $presupuestos_preset = PresupuestosPreset::findOrFail($id);

    if ($presupuestos_preset->delete())
      return response()->json(['ok' => true]);

    return response()->json(['ok' => false]);
  }

  public function update($id)
  {
    $presupuestos_preset = PresupuestosPreset::get();

    if ($presupuestos_preset->count() != 0) {

      foreach ($presupuestos_preset as $presupuesto) {
        if ($presupuesto->predeterminado) {
          $presupuesto_ent = PresupuestosPreset::findOrFail($presupuesto->id);
          $presupuesto_ent->predeterminado = false;
          $presupuesto_ent->save();
        }

        if ($presupuesto->id == $id) {
          $presupuesto_ent = PresupuestosPreset::findOrFail($id);
          $presupuesto_ent->predeterminado = true;
          $presupuesto_ent->save();
        }
      }
      return response()->json(['ok' => true]);
    }
    return response('No se encontraron registros', 400);
  }
}
