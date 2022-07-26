<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Tapacanto;
use App\Models\PuntoPieza;
use App\Models\Usuario;
use App\Models\Puntaje;
use DB;
use JWTAuth;

class TapacantoController extends Controller
{
	public function update($id, Request $request)
	{
		try {
			// ADD Validator
			//	$user_id = JWTAuth::parseToken()->authenticate()->id;
			DB::beginTransaction();
			$user_id = $request->usuario;

			$tapacanto = Tapacanto::where('id', $id)
				->with(['tipo_tapacanto', 'posicion_tapacanto'])
				->firstOrFail();

			$tapacanto->update($request->all());

			$tapacanto->usuario_id = $user_id; 
			$tapacanto->estado_id = $request->estado_id; 
			$tapacanto->save();

			$puntaje = Puntaje::firstOrCreate(['pieza_id'=>$tapacanto->pieza->id,'etapa'=>'tapacantos']);
			$puntos_piezas = PuntoPieza::firstOrCreate(['pieza_id'=>$tapacanto->pieza->id]);
			if ($request->estado_id == 3) {
				$puntos_piezas->usuario_id_tapacantos = $user_id;
				$puntos_piezas->puntos_tapacantos = Puntaje::puntajes_nivel($tapacanto->pieza,'tapacantos');

				$puntaje->puntos = Puntaje::puntajes_nivel($tapacanto->pieza,'tapacantos') + $tapacanto->pieza->tapacantos->where('estado_id',3)->count();
				$puntaje->usuario_id = $user_id;
				$puntaje->etapa = 'tapacantos';
				$puntaje->save();
			}
			$puntos_piezas->save();

			
			DB::commit();
			return response()->json(['success' => true, 'tapacanto' => $tapacanto, 'error' => null]);
		} catch (\Exception $th) {
			DB::rollback();
			\Log::info($th->getMessage());
			return response()->json(['success' => false, 'tapacanto' => null, 'error' => $th->getMessage()], 401);
		}
	}
}
