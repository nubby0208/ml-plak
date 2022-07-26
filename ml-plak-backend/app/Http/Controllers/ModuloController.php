<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PuntoPieza;
use App\Models\Modulo;
use App\Models\Puntaje;
use App\Models\Usuario;
use App\Models\Pieza;
use DB;
use JWTAuth;

class ModuloController extends Controller
{
	public function getControlByProy($proyectoId)
	{
		$totalReg = 0;
		$totalRegControl = 0;
		$control = 0;
		$columnas = [
			'id',
			'modulo',
			'armado',
			'control_estado_id',
			'piezas_sueltas',
			'piezas_sueltas_controladas'
		];

		$moduloArmados = Modulo::where('proyecto_id', $proyectoId)
								->where('armado','Si')
								//->where('modulo','not like','% (2)%')
								->with(['control_estado'])
								->with(['piezas'])
								->with(['piezasueltas'])	
								->orderBy('id','desc')
								->get($columnas);
		$totalReg += $moduloArmados->count();

		$moduloArmadosControlCount = Modulo::where('proyecto_id', $proyectoId)
								->where('armado','Si')
								->where('control_estado_id',3)
								//->where('modulo','not like','% (2)%')
								->count();
		$totalRegControl += $moduloArmadosControlCount;

		$moduloNoArmados = Modulo::where('proyecto_id', $proyectoId)
								->where('armado','No')
								//->where('modulo','not like','% (2)%')	
								->with(['control_estado'])
								->with(['piezas'])
								->orderBy('id','desc')
								->get($columnas);
		$totalReg += $moduloNoArmados->count();						

		$moduloNoArmadosControlCount = Modulo::where('proyecto_id', $proyectoId)
								->where('armado','No')
								//->where('modulo','not like','% (2)%')	
								->where('control_estado_id',3)
								->count();						
		$totalRegControl += $moduloNoArmadosControlCount;

		$columnasPiezas = [
			'piezas.id',
			'piezas.pieza',
			'piezas.lveta',
			'piezas.aveta',
			'piezas.modulo_id',
			'piezas.material_id',
			'piezas.control_estado_id',
			'piezas.suelta_estado_id'
		];
		$relacionesPiezas = [
			'modulo',
			'material',
			'control_estado'
		];

		$piezasVanSueltas = Pieza::join('modulos','modulos.id','=','piezas.modulo_id')
								->where('modulos.proyecto_id', $proyectoId)
								//->where('modulos.modulo','not like','% (2)%')	
								->where('va_suelta',1)
								->with($relacionesPiezas)
								->orderBy('piezas.id','desc')
								->get($columnasPiezas);		
	    //$totalReg += $piezasVanSueltas->count();								
		
		$piezasVanSueltasControlCount = Pieza::join('modulos','modulos.id','=','piezas.modulo_id')
								->where('modulos.proyecto_id', $proyectoId)
								//->where('modulos.modulo','not like','% (2)%')	
								->where('va_suelta',1)
								->where('piezas.control_estado_id',3)
								->count();
		//$totalRegControl += $piezasVanSueltasControlCount;

		if ($totalReg > 0) {
			$control = ($totalRegControl * 100) / $totalReg;
			$control = number_format($control, 2, '.', ',');
		}	

		return response()->json([
			'armados'    => $moduloArmados, 
			'noarmados'  => $moduloNoArmados, 
		    'vansueltas' => $piezasVanSueltas,
			'control'	 => $control
		],200);						
	}	

	public function update($id, Request $request)
	{
		$user_id = $request->userid;
		$modulo = Modulo::where('id', $id)
			->firstOrFail();
		$updateData = $request->all();	
		$modulo->update($updateData);
		$modulo->load('estado');
		$armar = (!is_null($modulo->armado)) ? $modulo->armado : 'No' ;
		$armado = $request->armado;
		if (empty($armado) === false) {
			$piezasSueltas = 0;
			if ($armado === "Si") {
				Pieza::where("modulo_id",$id)->update([
					'va_suelta' => 0,
					'suelta_estado_id' => 9
				]);
			} 
			if ($armado === "No") {
				$piezasSueltas = 1;
				Pieza::where("modulo_id",$id)->update([
					'va_suelta' => 1,
					'suelta_estado_id' => 9
				]);
			} 
			$updateData = [];
			$updateData['piezas_sueltas'] = $piezasSueltas;
			$updateData['piezas_sueltas_controladas'] = 0;
			$modulo->update($updateData);
		}	
		//$puntos_piezas = PuntoPieza::firstOrCreate(['modulo_id'=>$modulo->id]);
		$piezas = Pieza::where('modulo_id',$modulo->id)->get();
		$id_piezas = [];
		foreach ($piezas as $p) {
			$id_piezas[] = $p->id;
		}
		$puntos_prearmado = Puntaje::where('etapa','prearmado')->whereIn('pieza_id',$id_piezas)->sum('puntos');

		if ($request->estado_id == 3) {
			
			if ($modulo->is_cajon) {
				$puntaje = Puntaje::firstOrCreate(['pieza_id'=>$modulo->id,'etapa'=>'cajones']);
				//$puntos_piezas->usuario_id_cajones = $user_id;
				$puntaje->puntos = Puntaje::puntajeCajon();
				$puntaje->etapa = 'cajones';
			}else{
				$puntaje = Puntaje::firstOrCreate(['pieza_id'=>$modulo->id,'etapa'=>'modulo']);
				//$puntos_piezas->usuario_id_modulo = $user_id;

				$puntaje->puntos = round($puntos_prearmado / Puntaje::puntajeModulo($armar));
			}

			//$puntos_piezas->puntos_modulo = 1;
			//$puntos_piezas->modulo_id = $modulo->id;
			//$puntos_piezas->is_cajon = $modulo->is_cajon;
			
			
			
			$puntaje->usuario_id = $user_id;
			$puntaje->save();

		}
		//$puntos_piezas->save();


		return response()->json(['modulo' => $modulo]);
	}

	public function updateArmado($id, Request $request)
	{
		DB::beginTransaction();

        try {
			$modulo = Modulo::where('id', $id)
							->firstOrFail();
			$armado = $request->armado;
			$piezasSueltas = 0;
			if ($armado === "Si") {
				Pieza::where("modulo_id",$id)->update([
					'va_suelta' => 0,
					'suelta_estado_id' => 9
				]);
			} 
			if ($armado === "No") {
				$piezasSueltas = 1;
				Pieza::where("modulo_id",$id)->update([
					'va_suelta' => 1,
					'suelta_estado_id' => 9
				]);
			} 
			$updateData = $request->all();
			$updateData['piezas_sueltas'] = $piezasSueltas;
			$updateData['piezas_sueltas_controladas'] = 0;
			$modulo->update($updateData);
			DB::commit();
			return response()->json(['success' => true],200);
		} catch (Exception $e) {
			DB::rollback();
			return response()->json(['success' => false,'error' => $e],404);
		}
	}
}
