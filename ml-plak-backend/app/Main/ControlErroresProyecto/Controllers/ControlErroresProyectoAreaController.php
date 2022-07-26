<?php

namespace App\Main\ControlErroresProyecto\Controllers;

use App\Main\ControlErroresProyecto\Models\ControlErroresProyectoArea;
use Illuminate\Http\Request;
use App\Main\ControlErroresProyecto\Requests\StoreControlErroresProyectoAreaRequest;
use App\Main\ControlErroresProyecto\Services\GetInfoErrorServices;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Main\Base\Classes\ModelConst;

class ControlErroresProyectoAreaController extends Controller
{
	
  public function __construct() 
  	{ 
		//$this->middleware('auth:api');
	}

  public function show(ControlErroresProyectoArea $controlErroresProyectoArea)
	{
		return response()->json(['success' => true,'data' => $controlErroresProyectoArea], Response::HTTP_OK);
	}

  public function store(StoreControlErroresProyectoAreaRequest $request)
	{
		$newData = new ControlErroresProyectoArea;
		$newData->fill($request->all());
		$newData->save();

		return response()->json(['success' => true, 'data' => $newData], Response::HTTP_OK);
	}

	public function update(ControlErroresProyectoArea $controlErroresProyectoArea, StoreControlErroresProyectoAreaRequest $request)
	{
		$controlErroresProyectoArea->update($request->all());

		return response()->json(['success' => true,'data' => $controlErroresProyectoArea], Response::HTTP_OK);
	}

  	public function destroy(ControlErroresProyectoArea $controlErroresProyectoArea)
	{
		$controlErroresProyectoArea->delete();
		$hayInfoError = GetInfoErrorServices::execute($controlErroresProyectoArea->proyecto_area_type,$controlErroresProyectoArea->proyecto_area_id);
		return response()->json(['success' => true, 'data' => $hayInfoError],Response::HTTP_OK);
	}
	
	public function getControlErrorByArea(Request $request)
	{
		$controlErroresProyectoArea = ControlErroresProyectoArea::query()
										->where("proyecto_area_type",$request->proyecto_area_type)
										->where("proyecto_area_id",$request->proyecto_area_id)
										->first();
		if ($controlErroresProyectoArea === null) {
			$controlErroresProyectoArea = [
				'id' => 0,
				'proyecto_area_type' => $request->proyecto_area_type, 
				'proyecto_area_id' => $request->proyecto_area_id,
				'proyecto_etapa_id' => null,
				'error_proyecto_motivo_id' => null,
				'comentario' => null  
			]; 
		}	
				
		return response()->json(['success' => true,'data' => $controlErroresProyectoArea], Response::HTTP_OK);
	}	

	public function listControlErrorByPieza(Request $request)
	{	
		$areasPiezas = [
			ModelConst::PROYECTO_AREA_CORTE,
			ModelConst::PROYECTO_AREA_TAPACANTO,
			ModelConst::PROYECTO_AREA_PREARMADO,
		];

		$columnas = [
			'proyectoArea',
			'proyectoEtapa',
			'errorProyectoMotivo'
		];

		$controlErroresProyectoArea = ControlErroresProyectoArea::query()
										->whereIn("proyecto_area_type",$areasPiezas)
										->where("proyecto_area_id",$request->proyecto_area_id)
										->with($columnas)
										->get();
				
		return response()->json(['success' => true,'data' => $controlErroresProyectoArea], Response::HTTP_OK);
	}

	public function listControlErrorByNota(Request $request)
	{
		$columnas = [
			'proyectoArea',
			'proyectoEtapa',
			'errorProyectoMotivo'
		];

		$controlErroresProyectoArea = ControlErroresProyectoArea::query()
										->where("proyecto_area_type",ModelConst::PROYECTO_AREA_NOTA_ACCION)
										->where("proyecto_area_id",$request->proyecto_area_id)
										->with($columnas)
										->get();
				
		return response()->json(['success' => true,'data' => $controlErroresProyectoArea], Response::HTTP_OK);
	}

	public function listControlErrorByModulo(Request $request)
	{
		$areasModulos = [
			ModelConst::PROYECTO_AREA_CAJON,
			ModelConst::PROYECTO_AREA_MODULO,
		];

		$columnas = [
			'proyectoArea',
			'proyectoEtapa',
			'errorProyectoMotivo'
		];

		$controlErroresProyectoArea = ControlErroresProyectoArea::query()
										->whereIn("proyecto_area_type",$areasModulos)
										->where("proyecto_area_id",$request->proyecto_area_id)
										->with($columnas)
										->get();
		//dd($controlErroresProyectoArea)	;	
		return response()->json(['success' => true,'data' => $controlErroresProyectoArea], Response::HTTP_OK);
	}
}
