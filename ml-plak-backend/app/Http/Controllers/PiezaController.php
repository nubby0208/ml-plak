<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\Models\Pieza;
use App\Models\Usuario;
use App\Models\PuntoPieza;
use App\Models\Puntaje;
use App\Models\Estado;
use App\Models\Modulo;
use App\Models\PiezaHistorial;
use App\Models\ViewPiezaHistorial;
use App\Models\HistorialTaller;
use App\Models\ViewHistorialTaller;

use JWTAuth;

class PiezaController extends Controller
{
	public function listByModulo($moduloId) {
		$piezas = Pieza::where('modulo_id',$moduloId)
						->with(['estado'])
						->with(['prearmado'])
						->with(['material' => function ($query) {
							$query->select('id', 'material');
						}])
						->with(['tapacantos' => function ($query) {
							$query->select('*')
								->with(['tipo_tapacanto', 'posicion_tapacanto']);
						}])
						->with(['modulo'])
						->get();

		return response()->json(['piezas' => $piezas],200);				
	}

	public function listSueltasByModulo($moduloId) {

		$piezas = Pieza::query();
		$modulo = Modulo::where('id',$moduloId)->first();
		if (empty($modulo->armado) === false && $modulo->armado==="Si") {	
			$piezas = $piezas->where('va_suelta',1);
		}
		$piezas = $piezas->where('modulo_id',$moduloId)
						->with(['estado'])
						->with(['prearmado'])
						->with(['sueltaestado'])
						->with(['material' => function ($query) {
							$query->select('id', 'material');
						}])
						->with(['tapacantos' => function ($query) {
							$query->select('*')
								->with(['tipo_tapacanto', 'posicion_tapacanto']);
						}])
						->with(['modulo'])
						->get();

		return response()->json(['piezas' => $piezas],200);				
	}

	public function create(Request $request)
	{
		
		$this->validate($request, [
			
			'pieza'                      => 'required|string',
			'cantidad'                   => 'required|numeric',
			'posicion_x'                 => 'required|numeric',
			'posicion_y'                 => 'required|numeric',
			'posicion_z'                 => 'required|numeric',
			'lveta'                      => 'required|numeric',
			'aveta'                      => 'required|numeric',
			'espesor'                    => 'required|numeric',
			'orientacion'                => 'required|numeric',
			'modulo_id'                  => 'required|numeric',
			'material_id'                => 'required|numeric',
			'estado_id'                  => 'required|numeric',
			//'prearmado_estado_id'        => 'required|numeric',
			//'tapacantos_estado_id'       => 'required|numeric',
		]);
		
		$data = json_decode(json_encode($request->all()));
		
		$estado_inicial = Estado::where('estado','Seleccione un estado')->firstOrFail()->id;
    $piezas_data = [
					'pieza'               => $data->pieza,
					'modulo_id'           => $data->modulo_id,
					'cantidad'            => $data->cantidad,
					'posicion_x'          => $data->posicion_x,
					'posicion_y'          => $data->posicion_y,
					'posicion_z'          => $data->posicion_z,
					'lveta'               => $data->lveta,
					'aveta'               => $data->aveta,
					'espesor'             => $data->espesor,
					'orientacion'         => $data->orientacion,
					'material_id'         => $data->material_id,
					'estado_id'           => $estado_inicial,
					'prearmado_estado_id' => $estado_inicial,
					'comentario'		  => null,
					'id_aux' => 0,
				];
		
		$pieza = new Pieza();
	  $pieza->fill($piezas_data);
		$pieza->save();

		return response()->json(['pieza' => $pieza]);
	}

	public function update($id, Request $request)
	{
		// ADD Validator
    //var_dump($id, $request->all()); d();
		
			try {
				$user_id = JWTAuth::parseToken()->authenticate()->id;
			} catch (\Throwable $th) {
				$user_id = $request->usuario["id"];
			}
		$etapa = $request->etapa;
     
		$pieza = Pieza::where('id', $id)
			->with(['estado'])
			->with(['prearmado'])
			->with(['material' => function ($query) {
				$query->select('id', 'material');
			}])
			->with(['tapacantos' => function ($query) {
				$query->select('*')
					->with(['tipo_tapacanto', 'posicion_tapacanto']);
			}])
			->with(['modulo'])
			->firstOrFail();
		 	$pieza->update($request->all());
			
			$pieza->usuario_id = $user_id; 
			$pieza->save();
    
    if( $pieza && $pieza->id && $etapa )
		   $puntaje = Puntaje::firstOrCreate(['pieza_id'=>$pieza->id,'etapa'=>$etapa]);
		
		$puntos_piezas = PuntoPieza::firstOrCreate(['pieza_id'=>$pieza->id]);
		if ($etapa == 'corte' && $pieza->estado_id == 3) {
			$puntos_piezas->usuario_id_corte = $user_id;
			$puntos = Puntaje::puntajes_nivel($pieza,'corte');
			$puntos_piezas->puntos_corte = $puntos;

			$puntaje->puntos = $puntos;
			$puntaje->usuario_id = $user_id;
			$puntaje->etapa = $etapa;
			$puntaje->save();
		}

		if ($etapa == 'prearmado' && $pieza->prearmado_estado_id == 3) {
			$puntos_piezas->usuario_id_prearmado = $user_id;
			$puntos_piezas->puntos_prearmado = Puntaje::puntajes_nivel($pieza,'prearmado');
			$puntaje->puntos = Puntaje::puntajes_nivel($pieza,'prearmado');
			$puntaje->usuario_id = $user_id;
			$puntaje->etapa = $etapa;
			$puntaje->save();
		}
		

		$puntos_piezas->save();
		$pieza->load('estado');
		$pieza->load('prearmado');

		return response()->json(['pieza' => $pieza]);
	}

	public function updateVaSuelta($id, Request $request)
	{
		try {
			$user_id = JWTAuth::parseToken()->authenticate()->id;
		} catch (\Throwable $th) {
			$user_id = $request->usuario["id"];
		}
     
		$pieza = Pieza::where('id', $id)->firstOrFail();
		$pieza->update($request->all());
		$countSueltas = Pieza::where('modulo_id',$pieza->modulo_id)
							 ->where('va_suelta',1)
							 ->count();
		$piezasSueltas = 0;					 
		if ($countSueltas > 0) {
			$piezasSueltas = 1;
		}	
		$countSueltasControladas = Pieza::where('modulo_id',$pieza->modulo_id)
							 ->where('va_suelta',1)
							 ->where('suelta_estado_id',3)
							 ->count();
		$piezasSueltasControladas = 0;
		if (($countSueltas > 0) && ($countSueltas == $countSueltasControladas)) {
			$piezasSueltasControladas = 1;
		}
		$modulo=Modulo::where('id',$pieza->modulo_id)->first();
		if ($modulo->armado ==="No") {
			$piezasSueltas = 1;
		}
		$controlEstadoId = $modulo->control_estado_id;	
		if (($piezasSueltasControladas === 0) && ($controlEstadoId===3)) {
			$controlEstadoId = 9;
		}
		$updateModulo = [
			'piezas_sueltas' => $piezasSueltas,
			'piezas_sueltas_controladas' => $piezasSueltasControladas,
			'control_estado_id' => $controlEstadoId
		];
		
		$modulo->update($updateModulo);
		
		$pieza = Pieza::where('id', $id)
			->with(['estado'])
			->with(['prearmado'])
			->with(['material' => function ($query) {
				$query->select('id', 'material');
			}])
			->with(['tapacantos' => function ($query) {
				$query->select('*')
					->with(['tipo_tapacanto', 'posicion_tapacanto']);
			}])
			->with(['modulo'])
			->firstOrFail();

		return response()->json(['pieza' => $pieza]);
	}

  public function delete($pieza_id, Request $request)
	{
		
		DB::beginTransaction();
			try {
				

				$pieza = Pieza::findOrFail((int) $pieza_id);

				$pieza->punto_pieza()->each(function ($punto_pieza) {
					$punto_pieza->pieza()->dissociate();
					$punto_pieza->save();
				});

				$pieza->delete();
			
				DB::commit();

				return response()->json(['success' => true]);
			} catch (Exception $e) {
				DB::rollback();
		    return response()->json(['success' => false]);
			}

	}



	public function historialPieza($pieza_id, Request $request)
	{
		
		try {		
			// $data = ViewPiezaHistorial::where("pieza_id", $pieza_id)    
			// $data = ViewPiezaHistorial::orderBy('created_at', 'desc')->get();
			$data = ViewPiezaHistorial::where("pieza_id", $pieza_id)->orderBy('created_at', 'desc')->get();

			// $data = ViewPiezaHistorial::all();
			return response()->json(['success' => true, 'data' => $data],200);

		} catch (Exception $e) {
			return response()->json(['success' => false]);
		}

	}



	public function createHistorialPieza(Request $request)
	{
		
		$this->validate($request, [			
			'pieza_id'                  => 'required|numeric',
			'etapa_id'                  => 'required|numeric',
			'estado_id'                 => 'required|numeric',
			'usuario_id'                => 'required|numeric'
		]);
		
		$data = json_decode(json_encode($request->all()));	

   		$piezas_data = [
					'pieza_id'           => $data->pieza_id,
					'etapa_id'           => $data->etapa_id,
					'estado_id'          => $data->estado_id,
					'usuario_id'         => $data->usuario_id,
					'comentario'		 => null,
				];
		
		// $piezaHistorial = new PiezaHistorial();
		// $piezaHistorial->fill($piezas_data);
		// $piezaHistorial->save();

		$piezaHistorial = PiezaHistorial::create($piezas_data);

		return response()->json(['historial' => $piezaHistorial]);
	}



	public function historialTaller($etapa_id, $campo_id,  Request $request)
	{
		
		try {		
			// $data = ViewPiezaHistorial::where("pieza_id", $pieza_id)    
			// $data = ViewPiezaHistorial::orderBy('created_at', 'desc')->get();
			$data = ViewHistorialTaller::where("etapa_id", $etapa_id)
			                            ->where('campo_id',$campo_id)
			                            ->orderBy('created_at', 'desc')->get();

			// $data = ViewPiezaHistorial::all();
			return response()->json(['success' => true, 'data' => $data],200);

		} catch (Exception $e) {
			return response()->json(['success' => false]);
		}

	}


	public function createHistorialTaller(Request $request)
	{
		try 
		{	
			$this->validate($request, [			
				'estado_id'                 => 'required|numeric',
				'etapa_id'                  => 'required|numeric',
				'usuario_id'                => 'required|numeric',
				'campo_id'                  => 'required|numeric',
				'desc_campo'                => 'required|string'
			]);


			$data = json_decode(json_encode($request->all()));	
			$campos = [
						'estado_id'         => $data->estado_id,					
						'etapa_id'          => $data->etapa_id,
						'usuario_id'        => $data->usuario_id,
						'campo_id'          => $data->campo_id,
						'desc_campo'        => $data->desc_campo,
						'comentario'	    => null,
					];
		
			$historial = HistorialTaller::create($campos);
			return response()->json(['historial' => $historial]);
		
		} catch (Exception $e) {
			return response()->json(['success' => false]);
		}

	}



}