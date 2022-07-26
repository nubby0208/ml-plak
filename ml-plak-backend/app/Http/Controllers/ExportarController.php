<?php

namespace App\Http\Controllers;

use DB;
use App\Models\Pieza;
use App\Models\Estado;
use App\Models\Modulo;
use App\Models\Cliente;
use App\Models\Material;
use App\Models\Proyecto;
use App\Models\Tapacanto;
use App\Models\Responsible;
use App\Http\Controllers\StdClass;
use App\Models\Usuario;
use App\Models\Exportar;
use Illuminate\Http\Request;
use App\Models\TipoTapacanto;
use App\Models\PosicionTapacanto;
use App\Models\Calco;
use App\Models\ProyectoMetadata;
use App\Models\MedicionInstalacion;
use App\Models\CapacidadProduccionProyecto;
use Illuminate\Support\Facades\Log;
use App\Models\ProyectoMetadataMaterial;
use App\Models\ActionNotes;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ExportarController extends Controller
{
	private $estados = [
        "Peticion",
        "Revisado",
        "Corregir",
        "Confirmado",
    ];

	public function __construct()
	{

	}

	/**
	 * Método para validar toda la información acerca de un nuevo proyect, esto incluye:
	 * piezas, cliente, y proyecto como tal.
	 * @param Request $request
	 * @return json
	 */
	public function validarProyecto(Request $request)
	{
		$this->validate($request, [
			'info'    => 'required|array',
			'parts'   => 'required|array',
			'modules' => 'required|array',
			'info.name'                  => 'required|string',
			'info.address'               => 'required|string',
			'info.phone'                 => 'required|string',
			'info.total'                 => 'required|string',
			'info.senia'                 => 'required|string',
			'info.mueble'                => 'required|string',
			'info.comentarioInstalacion' => 'required|string',
		]);

		try {
		    $estado_inicial = Estado::where('estado', 'Seleccione un estado')->firstOrFail()->id;
            $reg = MedicionInstalacion::where('token_project', '=', $request->input('info.token_project'))
                              ->where('tipo_medinst',1)
                              ->count();
            if ($reg==0) {
                throw new ModelNotFoundException('Fecha de Instalación no encontrado para el Proyecto: ' . $request->input('proyectoid'));
            }

		} catch (ModelNotFoundException $e) {
            return response()->json(['success' => false,'error' => $e->getMessage()], 404);
		} catch (Exception $e) {
		    return response()->json(['success' => false,'error' => $e->getMessage()], 500);
		}

		return response()->json(['success' => true], 200);
	}

	public function getExportar()
	{
		$exportar = collect(Exportar::whereRaw("estado <> 'Confirmado'")->get())->map(function ($item, $key) {
			$item->proyect_id = $item->proyect_id;
			return $item;
		});
		
		return response()->json($exportar);
	}

    public function ocultar($id)
    {
        $exportar = Exportar::find($id);
        $exportar->mostrar = $exportar->mostrar == "1" ? "0":"1";
        $exportar->save();
        return $exportar;
    }

    public function setRevision(Request $request)
    {

        $this->validate($request, [
			'info'    => 'required|array',
			'info.token_project'                  => 'required|string',
			'info.name'                  => 'required|string',
			'info.address'               => 'required|string',
			'info.phone'                 => 'required|string',
			'info.total'                 => 'required|string',
			'info.senia'                 => 'required|string',
			'info.mueble'                => 'required|string',
			'info.comentarioInstalacion' => 'required|string',
			'usuario' => 'required|string',
			'preguntas' => 'required|array',
			'preguntas_ventas' => 'required|array',
		]);

        

        try {
            $exportar = Exportar::where("token_proyect", $request->input("info.token_project"))->first();
            if($exportar){
                $usuarioReq = json_decode($exportar->usuarios);
            }else{
                $exportar = new Exportar;
            }

            $usuario = Usuario::find($request->usuario);
            $usuarioArray = [
                "id" => $usuario->id,
                "usuario" => $usuario->usuario,
                "nombre_completo" => $usuario->nombre_completo,
                "correo_google" => $usuario->correo_google,
                "operacion" => $this->estados[0],
                "comentario" => ""
            ];

            
            $exportar->token_proyect = $request->input("info.token_project");
            $exportar->data = json_encode($request->input("info"));
            $usuarioReq[] = $usuarioArray;
            $exportar->usuarios = json_encode($usuarioReq);
            $exportar->usuario_solicitador = $usuario->id;
            $exportar->estado = $this->estados[0];
			$exportar->preguntas = json_encode($request->preguntas);
			$exportar->preguntas_ventas = json_encode($request->preguntas_ventas);
            $exportar->save();
            return response()->json($exportar);
        } catch (\Throwable $th) {
            //throw $th;
        }
        
    }

    public function setCofirmarRevicion(Request $request)
    {

        $this->validate($request, [
			'info'    => 'required|array',
			'info.token_project'                  => 'required|string',
			'info.name'                  => 'required|string',
			'info.address'               => 'required|string',
			'info.phone'                 => 'required|string',
			'info.total'                 => 'required|string',
			'info.senia'                 => 'required|string',
			'info.mueble'                => 'required|string',
			'info.comentarioInstalacion' => 'required|string',
			'usuario' => 'required|string',
			'preguntas' => 'required|array',
			'preguntas_ventas' => 'required|array',
		]);

        try {
            $usuario = Usuario::find($request->usuario);
            $usuarioArray = [
                "id" => $usuario->id,
                "usuario" => $usuario->usuario,
                "nombre_completo" => $usuario->nombre_completo,
                "correo_google" => $usuario->correo_google,
                "operacion" => $this->estados[1],
                "comentario" => ""
            ];

            $exportar = Exportar::where("token_proyect", $request->input("info.token_project"))->first();
            $exportar->data = json_encode($request->input("info"));
            $usuarioReq = json_decode($exportar->usuarios);
            $usuarioReq[] = $usuarioArray;
            $exportar->usuarios = json_encode($usuarioReq);
			$exportar->usuario_confirmador = $usuario->id;
            $exportar->estado = $this->estados[1];
            $exportar->preguntas = json_encode($request->preguntas);
            $exportar->preguntas_ventas = json_encode($request->preguntas_ventas);
            $exportar->save();
            return response()->json($exportar);
        } catch (\Throwable $th) {
            //throw $th;
        }
        
    }

    public function setCorregir(Request $request)
    {

        $this->validate($request, [
			'info'    => 'required|array',
			'info.token_project'                  => 'required|string',
			'info.name'                  => 'required|string',
			'info.address'               => 'required|string',
			'info.phone'                 => 'required|string',
			'info.total'                 => 'required|string',
			'info.senia'                 => 'required|string',
			'info.mueble'                => 'required|string',
			'info.comentarioInstalacion' => 'required|string',
			'usuario' => 'required|string',
			'preguntas' => 'required|array',
			'comentario' => 'required|string',
			'preguntas_ventas' => 'required|array',
		]);

        try {
            $usuario = Usuario::find($request->usuario);
            $usuarioArray = [
                "id" => $usuario->id,
                "usuario" => $usuario->usuario,
                "nombre_completo" => $usuario->nombre_completo,
                "correo_google" => $usuario->correo_google,
                "operacion" => $this->estados[2],
                "comentario" => $request->input("comentario")
            ];

            $exportar = Exportar::where("token_proyect", $request->input("info.token_project"))->first();
            $exportar->data = json_encode($request->input("info"));
            $usuarioReq = json_decode($exportar->usuarios);
            $usuarioReq[] = $usuarioArray;
            $exportar->usuarios = json_encode($usuarioReq);
            $exportar->estado = $this->estados[2];
            $exportar->preguntas = json_encode($request->preguntas);
            $exportar->cometarios = $request->input("comentario");
            $exportar->preguntas_ventas = json_encode($request->preguntas_ventas);
            $exportar->save();
            return response()->json($exportar);
        } catch (\Throwable $th) {
            //throw $th;
        }
        
    }

    public function setConfirmaExportar(Request $request)
    {

        $this->validate($request, [
			'info'    => 'required|array',
			'info.token_project'                  => 'required|string',
			'info.name'                  => 'required|string',
			'info.address'               => 'required|string',
			'info.phone'                 => 'required|string',
			'info.total'                 => 'required|string',
			'info.senia'                 => 'required|string',
			'info.mueble'                => 'required|string',
			'info.comentarioInstalacion' => 'required|string',
			'usuario' => 'required|string',
			'preguntas' => 'required|array',
			'preguntas_ventas' => 'required|array',
		]);

        try {
            $usuario = Usuario::find($request->usuario);
            $usuarioArray = [
                "id" => $usuario->id,
                "usuario" => $usuario->usuario,
                "nombre_completo" => $usuario->nombre_completo,
                "correo_google" => $usuario->correo_google,
                "operacion" => $this->estados[3],
                "comentario" => ""
            ];

            $exportar = Exportar::where("token_proyect", $request->input("info.token_project"))->first();
            $exportar->data = json_encode($request->input("info"));
            $usuarioReq = json_decode($exportar->usuarios);
            $usuarioReq[] = $usuarioArray;
            $exportar->usuarios = json_encode($usuarioReq);
			$exportar->usuario_confirmador = $usuario->id;
            $exportar->estado = $this->estados[3];
            $exportar->preguntas = json_encode($request->preguntas);
            $exportar->preguntas_ventas = json_encode($request->preguntas_ventas);
            $exportar->save();
            return response()->json($exportar);
        } catch (\Throwable $th) {
            //throw $th;
        }
        
    }

}
