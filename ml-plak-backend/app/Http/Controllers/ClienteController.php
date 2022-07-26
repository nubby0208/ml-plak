<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cliente;
use App\Models\MedicionInstalacion;
use App\Models\ProyectoJson;
use JWTAuth;

class ClienteController extends Controller
{
	public function index(Request $request)
	{
		$clientes = Cliente::with(['proyectos' => function ($query) {
        $query->select(['id', 'proyecto', 'cliente_id', 'instalacion_fecha', 'activo'])
        ->with(['medicioninstalacion']);
      }])
      ->orderBy('nombre_completo')
			->get()
			->toArray();

		return response()->json(['clientes' => $clientes]);
	}

  public function getAuditCliente (Request $request)
  {
    $clientesIdAudit = $request->clientes; 
    $clientesIdAudit = explode(',', $clientesIdAudit);
    //dd("Clientes Aufitados: ",$clientesIdAudit);
    $clientes = Cliente::query()
                        ->whereIn('id',$clientesIdAudit)
                        ->orderBy('nombre_completo')
                        ->get()
                        ->toArray();

    return response()->json(['clientes' => $clientes]);
  }

  public function indexCliente($nombre)
	{
		$clientes = Cliente::query()
					   ->distinct()
                       ->where("nombre_completo","like","%$nombre%")
                       ->join("proyectos", "proyectos.cliente_id", '=', "clientes.id")
                       ->orderBy('nombre_completo')
                       ->get(["proyectos.id as proyecto_id","proyecto","nombre_completo","token_project","instalacion_fecha"]);

		$clientes = collect($clientes);
		$clientes=$clientes->map($this->mapProcesarClientes());
		//dd("datos: ", $clientes->toArray());

    return response()->json(['success' => true,'clientes' => $clientes->toArray()],200);
	}

	public function proyectos($id)
	{
		$proyectos = Cliente::where('id', $id)->firstOrFail()->proyectos;
		return response()->json(['proyectos' => $proyectos]);
	}

	public function update(Request $request, $id)
	{
		$cliente = Cliente::find($id);
		$cliente->update($request->all());

		return response()->json(['status' => true]);
	}

	private function mapProcesarClientes():callable
    {
        return function ($cliente, $key) {
            $proyectoJson = ProyectoJson::where("token_project",$cliente["token_project"])
			               ->orderBy("id","Desc")
										 ->first();
            $mueble = "";
			      $instalaciones = $cliente["instalacion_fecha"]? $cliente["instalacion_fecha"] : "SIN FECHAS DE INSTALACIÓN";
            if ($proyectoJson !== null)
            {
              $mueble = $proyectoJson->mueble? $proyectoJson->mueble : $mueble;
            }

            $fechaInstalaciones = MedicionInstalacion::where("token_project",$cliente["token_project"])
                                ->where("tipo_medinst",1)
                                ->orderBy("fecha_medinst","Asc")
                                ->get(["fecha_medinst"]);

            if ($fechaInstalaciones !== null)
            {
              $fechaInstalaciones = $fechaInstalaciones->pluck("fecha_medinst")->toArray();
              if (empty($fechaInstalaciones) === false)
              {
                $instalaciones = implode(";", $fechaInstalaciones);
              }
            }

            if (empty($mueble) === false){
              $cliente["nombre_completo"] = $cliente["nombre_completo"] . " | ". $mueble . " | Fechas de Inst.: " . $instalaciones;
            }

            if (empty($mueble) === true){
              $cliente["nombre_completo"] = $cliente["nombre_completo"] . " | Fechas de Inst.: " . $instalaciones;
            }

            return $cliente;
        };

	}
}
