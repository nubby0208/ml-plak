<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
// use App\Models\Pieza;
use App\Models\Usuario;
use App\Models\Estado;
use App\Models\HistorialTaller;
// use App\Models\ViewHistorialTaller;

// use JWTAuth;

class PiezaController extends Controller
{
	public function listByModulo($moduloId) {
		$piezas = TallerHistorial::where('modulo_id',$moduloId)
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


	public function view($campo_id, $etapa_id, Request $request)
	{
		
		try {		
			// $data = ViewPiezaHistorial::where("pieza_id", $pieza_id)    
			// $data = ViewPiezaHistorial::orderBy('created_at', 'desc')->get();
			$data = TallerHistorial::where("pieza_id", $pieza_id)->orderBy('created_at', 'desc')->get();

			// $data = ViewPiezaHistorial::all();
			return response()->json(['success' => true, 'data' => $data],200);

		} catch (Exception $e) {
			return response()->json(['success' => false]);
		}

	}
	
	
	public function create(Request $request)
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
		
			$historial = TallerHistorial::create($campos);

			return response()->json(['historial' => $historial]);
		

		} catch (Exception $e) {
			return response()->json(['success' => false]);
		}
	

	}


}