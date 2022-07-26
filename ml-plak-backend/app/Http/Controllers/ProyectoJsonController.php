<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ProyectoJson;
use App\Models\ActionNotes;
use App\Models\MedicionInstalacion;
use App\Models\CapacidadProduccionProyecto;
use App\Models\Usuario;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\File;
use Exception;
use Carbon\Carbon;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ProyectoJsonController extends Controller
{
  public function index()
  {
		$proyectos = ProyectoJson::select(['id', 'nombre', 'created_at'])
			->orderBy('created_at', 'desc')
			->get();

  	return response()->json([
  		'proyectos' => $proyectos
  	]);
  }

  public function getLast(){
    $proyecto = ProyectoJson::select(['id', 'nombre', 'proyecto'])->latest('id')->first();

    return response()->json([
      'proyectos' => $proyecto
    ]);
  }

  public function checkname(Request $request){
    $name = $request->project;
    $proyecto = ProyectoJson::select(['id'])->where('nombre','=',$name)->count();
      if($proyecto>0){
        return response()->json([
          'exist' => true
        ]);
      }else{
        return response()->json([
          'exist' => false
        ]);
      }
  }

  public function store(Request $request)
  {
    if ($request->force == true) {
      $name= $request->nombre;
      $proyectojson_id=$request->proyectojson_id;
      $proyecto = ProyectoJson::Where('nombre', $request->nombre)->firstOrFail();
      $proyecto->proyecto = $request->proyecto;
      $proyecto->settings = $request->get('settings');
      $status = $proyecto->save();
    }
    else
    {
      try {

        /**
         *
         *
         * Se crea rutina para evitar nombre repetido al trabajar en una version
         */

        $name= $request->nombre;
        $x = 1;
        while ($x == 1) {
          $checkname = ProyectoJson::where('nombre','=',$name)->orderby('nombre')->count();

          $x=0;
          if($checkname>0){
            $parts = explode("-",$name);
            $version=0;
            if (count ($parts) > 1){
              $version = intval(substr($parts[1],2,3));
            }
            $version++;
            $name= $parts[0]."- v".$version;
          }else{
            $request->nombre = $name;
            $x=0;
          }

        }

        DB::beginTransaction();
        $proyecto = new ProyectoJson;
        $data =[
          "nombre"=>$name,
          "proyecto"=>$request->proyecto,
          "token_project"=>$request->token_project,
          "client_name"=>$request->client_name,
          "mueble"=>$request->mueble,
          "address"=>$request->address,
          "phone"=>$request->phone,
          "comentario"=>$request->comentario,
          "estado"=>$request->estado,
          "encargado_med"=>$request->encargado_med,
          "encargado_inst"=>$request->encargado_inst,
          "settings" => $request->get('settings')
        ];

        $proyecto->fill($data);
        $status = $proyecto->save();
        $proyectojson_id = $proyecto->id;

        if ($request->actual_token_project !== $request->token_project)
        {
          //-----------------------Action Notes -----------------------------------------
          //Agregado Por Tobias Bolivar
          //Fecha: 8/07/2021

          //Salvar notas de action

          $notes = ActionNotes::where('token_project', '=', $request->actual_token_project)
                                ->get();

          foreach ($notes as $note)
          {
                $data = [
                  'name' => $note->name,
                  'description' =>$note->description,
                  'exported' => 0,
                  'orig_modulo_id' => $note->orig_modulo_id,
                  'commentary'  => $note->commentary,
                  'estado_id' => $note->estado_id,
                  'created_by' => $note->created_by,
                  'updated_by' => $note->updated_by,
                  'token_project' =>  $request->token_project,
                ];
                ActionNotes::create($data);
          }
          //----------------------Capacidad Produccion Proyecto ------------------------------

          $caps=CapacidadProduccionProyecto::where('token_project', '=', $request->actual_token_project)
                                            ->get();
          foreach ($caps as $cap)
          {
              $data = [
                  'item' => $cap->item,
                  'tiempo_disenio' => $cap->tiempo_disenio,
                  'tiempo_medicion' => $cap->tiempo_medicion,
                  'tiempo_produccion' => $cap->tiempo_produccion,
                  'tiempo_instalacion' => $cap->tiempo_instalacion,
                  'coeficiente_multiplicador' => $cap->coeficiente_multiplicador,
                  'token_project' =>  $request->token_project,
                  'exported' => 0,
                ];
              CapacidadProduccionProyecto::create($data);
          }

          //----------------------Mediciones Instalaciones ------------------------------
          if ((!is_null($request->token_project)))
          {
            $medinsts=MedicionInstalacion::where('token_project', '=', $request->actual_token_project)
                                        ->get();
            foreach ($medinsts as $medinst)
            {
                $data = [
                    'fecha_medinst' => $medinst->fecha_medinst,
                    'comentario'  => $medinst->comentario,
                    'tipo_medinst'  => $medinst->tipo_medinst,
                    'token_project' =>  $request->token_project,
                    'exported' => 0,
                  ];
                MedicionInstalacion::create($data);
            }
          }
          //-----------------------------------------------------
        }
        $this->clear_cache();
        DB::commit();

      } catch (Exception $e) {
        DB::rollback();
        return response()->json(['success' => false,'error' => $e->getMessage()],500);
      }

    }

    return response()->json(['success' => $status,'proyectojson_id' => $proyectojson_id,'nombre'=>$name],201);
  }

  public function update(Request $request)
	{
    try {
      // Objeto para guardar a através del modelo
			$proyecto = ProyectoJson::find($request->input('id'));
      $data = $request->all();
			$proyecto->fill($data);
			$proyecto->save();
      $this->clear_cache();
      return $proyecto;
    } catch (Exception $e) {
      return response()->json(['success' => false,'error' => $e->getMessage()],500);
    }
    return response()->json(['success' => true],200);
  }

  public function updateEncargadoMed(Request $request)
	{
    try {
      // Objeto para guardar a através del modelo
			$proyecto = ProyectoJson::find($request->id);
      $proyect_decode = json_decode(json_decode($proyecto->proyecto));
      $proyect_decode->info->encargadoMed =  $request->encargado_med;
      $proyect_encode = json_encode(json_encode($proyect_decode));

      $data = [
        'encargado_med' => $request->encargado_med,
        'proyecto' => $proyect_encode
      ];

      $proyecto->fill($data);
			$proyecto->save();
      $this->clear_cache();
      return $proyecto;
    } catch (Exception $e) {
      return response()->json(['success' => false,'error' => $e->getMessage()],500);
    }
    return response()->json(['success' => true],200);
  }

  public function updateEncargadoInst(Request $request)
	{
    try {
      // Objeto para guardar a através del modelo
      $proyecto = ProyectoJson::find($request->id);
      $proyect_decode = json_decode(json_decode($proyecto->proyecto));
      $proyect_decode->info->encargadoInst =  $request->encargado_inst;
      $proyect_encode = json_encode(json_encode($proyect_decode));

      $data = [
        'encargado_inst' => $request->encargado_inst,
        'proyecto' => $proyect_encode
      ];

			$proyecto->fill($data);
			$proyecto->save();
      $this->clear_cache();
      return $proyecto;
    } catch (Exception $e) {
      return response()->json(['success' => false,'error' => $e->getMessage()],500);
    }
    return response()->json(['success' => true],200);
  }

  public function show($id)
  {
  	$proyecto = ProyectoJson::findOrFail((int) $id);
    return response()->json(['proyecto' =>$proyecto],200);
  }

  public function showdetail($token_project)
  {
  	$proyecto = ProyectoJson::select(['id','nombre','client_name','mueble','address','phone','comentario','estado','encargado_med','encargado_inst'])
                            ->where('token_project',$token_project)
                            ->orderBy('id','desc')
                            ->first();
    /*
    if ($proyecto !==null) {
      $proyect_decode = json_decode(json_decode($proyecto['proyecto']));
    }*/

    $encargado_med_name = null;
    if (empty($proyecto->encargado_med) === false) {
      $user = Usuario::find($proyecto->encargado_med);
      if (empty($user->nombre_completo) === false)
        $encargado_med_name = $user->nombre_completo;
    }
    $encargado_inst_name = null;
    if (empty($proyecto->encargado_inst) === false) {
      $user = Usuario::find($proyecto->encargado_inst);
      if (empty($user->nombre_completo) === false)
        $encargado_inst_name = $user->nombre_completo;
    }
    $data = [];
    $data = ['id'          => $proyecto->id,
             'nombre'      => $proyecto->nombre,
             'client_name' => $proyecto->client_name,
             'mueble'      => $proyecto->mueble,
             'address'     => $proyecto->address,
             'phone'       => $proyecto->phone,
             'comentario'  => $proyecto->comentario,
             'estado'      => $proyecto->estado,
             'encargado_med'  => $proyecto->encargado_med,
             'encargado_inst' => $proyecto->encargado_inst,
             'encargado_med_name'  => $encargado_med_name,
             'encargado_inst_name' => $encargado_inst_name
            ];
    $proyecto = collect($data);
    return response()->json(['proyecto' => $proyecto],200);
  }

	public function delete($id)
	{
		$proyecto = ProyectoJson::findOrFail((int) $id);

		if ($proyecto->delete())
    {
      $this->clear_cache();
			return response()->json(['success' => true]);
    }

		return response()->json(['success' => false]);
	}

  public function returid($token_proyect){
    $proyecto = ProyectoJson::select(['id'])->where('token_project',$token_proyect);
  }

  public function getlastfromtoken($token){
    $proyecto = ProyectoJson::where('token_project',$token);
  }

  public function removeoldversions(Request $request){

          $versiones = ProyectoJson::where('token_project','=',$request->token)->orderby('id','DESC')->get();
          $i=0;
          foreach ($versiones as $ver){
            $i++;
            if($i>3){
              ProyectoJson::where('id','=',$ver->id)->delete();
            }
          }
          return response()->json(['success' => $request->token],200);
  }

  public function  subirProy(Request $request) {
    $this->validate($request, [
      'proyname'    => 'nullable|string',
      'proyfile'    => 'required|file|mimes:csv,txt',
      'prodfile'    => 'nullable|file|mimes:csv,txt',
      'medinstfile' => 'nullable|file|mimes:csv,txt',
      'notesfile'   => 'nullable|file|mimes:csv,txt',
    ]);
    
    if ($request->hasFile('proyfile') === false)  {
        throw new HttpException(
          422,
          "NO EXISTE UN ARCHIVO DEL PROYECTO",
          null,
          [],
          422
        );
    }  
    //try {
      DB::beginTransaction();
      if ($request->hasFile('proyfile'))  {
        $file = $request->file('proyfile');
        $f = fopen($file, 'r');
        $tokenProject = "";
        if (($data = fgetcsv($f,0,';')) === false) {
          throw new HttpException(
              422,
              "NO EXISTE DATA EN EL PROYECTO",
              null,
              [],
              422
          );
        }  
        if ($data[0] === 'nombre') {
          if (($data = fgetcsv($f,0,';')) === false) {
            throw new HttpException(
                422,
                "NO EXISTE DATA EN EL PROYECTO",
                null,
                [],
                422
            );
          }  
        }

        $newProy = [];
        $proyName = $request->proyname? $request->proyname : $data[0];
        $newProy['nombre'] = $proyName;
        $newProy['client_name'] = (empty($data[1]) === false)? $data[1] : null;
        $newProy['mueble'] = (empty($data[2]) === false)? $data[2] : null;
        $newProy['address'] = (empty($data[3]) === false)? $data[3] : null;
        $newProy['phone'] = (empty($data[4]) === false)? $data[4] : null;
        $newProy['comentario'] =(empty($data[5]) === false)? $data[5] : null;
        $newProy['estado'] = (empty($data[6]) === false)? $data[6] : null;
        $newProy['encargado_med'] = (empty($data[7]) === false)? $data[7] : null;
        $newProy['encargado_inst'] = (empty($data[8]) === false)? $data[8] : null;
        $newProy['settings'] = (empty($data[9]) === false)? json_decode($data[9]) : null;
        $newProy['proyecto'] = $data[10];
        $tokenProject = $this->generarToken($newProy['mueble']);
        $newProy['token_project'] = $tokenProject;
        ProyectoJson::create($newProy); 
      }  

      if ($request->hasFile('notesfile'))  {
        $file = $request->file('notesfile');
        $f = fopen($file, 'r');
        while (($data = fgetcsv($f,0,';')) !== false) {
          if ($data[0] !== 'name') {
            $newItem = [];
            $newItem['name'] = $data[0];
            $newItem['description'] = (empty($data[1]) === false)? $data[1] : null;
            $newItem['modulo_id'] = (empty($data[2]) === false)? $data[2] : null;
            $newItem['proyecto_id'] = null;
            $newItem['estado_id'] = (empty($data[4]) === false)? $data[4] : null;
            $newItem['comentary'] = (empty($data[5]) === false)? $data[5] : null;
            $newItem['created_by'] = (empty($data[6]) === false)? $data[6] : null;
            $newItem['updated_by'] = (empty($data[7]) === false)? $data[7] : null;
            $newItem['orig_modulo_id'] = (empty($data[8]) === false)? $data[8] : null;
            $newItem['orig_proyecto_id'] = (empty($data[9]) === false)? $data[9] : null;
            $newItem['exported'] = 0;
            $newItem['token_project'] = $tokenProject;
            ActionNotes::create($newItem);
          }  
        }  
      }  

      if ($request->hasFile('medinstfile'))  {
        $file = $request->file('medinstfile');
        $f = fopen($file, 'r');
        while (($data = fgetcsv($f,0,';')) !== false) {
          if ($data[0] !== 'fecha_medinst') {
            $newItem = [];
            $newItem['fecha_medinst'] = $data[0];
            $newItem['comentario'] = (empty($data[1]) === false)? $data[1] : null;
            $newItem['tipo_medinst'] = $data[2];
            $newItem['proyecto_id'] = null;
            $newItem['proyecto_json_id'] =(empty($data[4]) === false)? $data[4] : null;
            $newItem['exported'] = 0;
            $newItem['token_project'] = $tokenProject;
            MedicionInstalacion::create($newItem);
          }  
        }  
      }  

      if ($request->hasFile('prodfile'))  {
        $file = $request->file('prodfile');
        $f = fopen($file, 'r');
        while (($data = fgetcsv($f,0,';')) !== false) {
          if ($data[0] !== 'item') {
            $newItem = [];
            $newItem['item'] = $data[0];
            $newItem['tiempo_disenio'] = (empty($data[1]) === false)? $data[1] : '00:00';
            $newItem['tiempo_produccion'] = (empty($data[2]) === false)? $data[2] : '00:00';
            $newItem['tiempo_medicion'] = (empty($data[3]) === false)? $data[3] : '00:00';
            $newItem['tiempo_instalacion'] = (empty($data[4]) === false)? $data[4] : '00:00';
            $newItem['coeficiente_multiplicador'] = (empty($data[5]) === false)? $data[5] : 0;
            $newItem['proyecto_id'] = null;
            $newItem['proyecto_json_id'] = (empty($data[7]) === false)? $data[7] : null;
            $newItem['tiempo_disenio_c'] = (empty($data[8]) === false)? $data[8] : 0;
            $newItem['tiempo_produccion_c'] = (empty($data[9]) === false)? $data[9] : 0;
            $newItem['tiempo_medicion_c'] = (empty($data[10]) === false)? $data[10] : 0;
            $newItem['tiempo_instalacion_c'] = (empty($data[11]) === false)? $data[11] : 0;
            $newItem['exported'] = 0;
            $newItem['token_project'] = $tokenProject;
            CapacidadProduccionProyecto::create($newItem);
          }  
        }  
      }  

      DB::commit();
   // } catch (Exception $e) {
      //DB::rollback();
     // return response()->json([ 'code' => 422, 'message' =>  $e, 'data' => [] ], 422);
  //  }   
    return response()->json(['success' => true, 'message' =>  'PROYECTO PROCESADO EXITOSAMENTE.'], 201);
  }
  
  private function generarToken($mueble) {
	      $milisegundos = round(microtime(true) * 1000);
	      return md5($mueble . $milisegundos);
  }

  public function descargarProy($id) {
      $proy = ProyectoJson::find($id);
      $urls = [];
      if ($proy === null) {
        return response()->json(['success' => true,'urls' => $urls], 200);
      }

      $tokenProject = $proy->token_project;
      $fecha = Carbon::now()->format('Y-m-d');
      $urls['proy'] = $this->getUrlProy($id, $fecha);
      $urls['action_notes'] = $this->getUrlActionNotes($id, $fecha, $tokenProject);
      $urls['medicion_instalacion'] = $this->getUrlMedicionInstalacion($id, $fecha, $tokenProject);
      $urls['capacidad_produccion'] = $this->getUrlCapacidadProduccion($id, $fecha, $tokenProject);

      return response()->json(['success' => true,'urls' => $urls], 200);
  }

  private function getUrlProy($id, $fecha) {
    //Nombre del archivo que generaremos
    //$baseFile = storage_path('app/public') . '/proys/descargados/';
    $baseFile = storage_path('app/public') . '/';
    $fileName = 'ProyectoJson_'. $id . '_' . $fecha .'.csv';
    //Arreglo que contendrá las filas de datos
    $arrayDetalle = Array();

    $proyectos = ProyectoJson::where('id',$id)->get();
    
    foreach ($proyectos as $item){
      $arrayDetalle[] = array('nombre'         => $item->nombre,
                              'client_name'    => $item->client_name,
                              'mueble'         => $item->mueble, 
                              'address'        => $item->address,
                              'phone'          => $item->phone,
                              'comentario'     => $item->comentario,
                              'estado'         => $item->estado,
                              'encargado_med'  => $item->encargado_med,
                              'encargado_inst' => $item->encargado_inst, 
                              'settings'       => collect($item->settings),
                              'proyecto'       => $item->proyecto
                              );
    }

    $columns = array( 'nombre',
                      'client_name',
                      'mueble', 
                      'address',
                      'phone',
                      'comentario',
                      'estado',
                      'encargado_med',
                      'encargado_inst', 
                      'settings',
                      'proyecto'
                      );

    $file = fopen($baseFile . $fileName, 'w');
    //si no quieren que el csv muestre el titulo de columnas omitan la siguiente línea.
    fputcsv($file, $columns,";");
    foreach ($arrayDetalle as $item) {
        fputcsv($file, $item,";");
    }
    fclose($file);
    
    $filePath = public_path() . '/storage/' . $fileName;
    $url = "";
    if (File::exists($filePath)) {
      $url = url('/storage') . "/" . $fileName;
    }
    return $url;
  }

  private function getUrlActionNotes($id, $fecha, $tokenProject) {
    //Nombre del archivo que generaremos
    //$baseFile = storage_path('app/public') . '/proys/descargados/';
    $baseFile = storage_path('app/public') . '/';
    $fileName = 'ActionNotes_'. $id . '_' . $fecha .'.csv';
    //Arreglo que contendrá las filas de datos
    $arrayDetalle = Array();

    $items = ActionNotes::where('token_project',$tokenProject)->get();
    
    foreach ($items as $item){
      $arrayDetalle[] = array('name'             => $item->name,
                              'description'      => $item->description,
                              'modulo_id'        => $item->modulo_id, 
                              'proyecto_id'      => $item->proyecto_id,
                              'estado_id'        => $item->estado_id,
                              'commentary'       => $item->commentary,
                              'created_by'       => $item->created_by,
                              'updated_by'       => $item->updated_by,
                              'orig_modulo_id'   => $item->orig_modulo_id, 
                              'orig_proyecto_id' => $item->orig_proyecto_id,
                              'exported'         => $item->exported
                              );
    }

    $columns = array('name', 'description', 'modulo_id', 'proyecto_id', 'estado_id', 'commentary','created_by', 'updated_by', 'orig_modulo_id', 'orig_proyecto_id', 'exported');

    $file = fopen($baseFile . $fileName, 'w');
    //si no quieren que el csv muestre el titulo de columnas omitan la siguiente línea.
    fputcsv($file, $columns,";");
    foreach ($arrayDetalle as $item) {
        fputcsv($file, $item,";");
    }
    fclose($file);
    
    $filePath = public_path() . '/storage/' . $fileName;
    $url = "";
    if (File::exists($filePath)) {
      $url = url('/storage') . "/" . $fileName;
    }
    return $url;
  }

  private function getUrlMedicionInstalacion($id, $fecha, $tokenProject) {
    //Nombre del archivo que generaremos
    //$baseFile = storage_path('app/public') . '/proys/descargados/';
    $baseFile = storage_path('app/public') . '/';
    $fileName = 'MedicionInstalacion_'. $id . '_' . $fecha .'.csv';
    //Arreglo que contendrá las filas de datos
    $arrayDetalle = Array();

    $items = MedicionInstalacion::where('token_project',$tokenProject)->get();
    
    foreach ($items as $item){
      $arrayDetalle[] = array('fecha_medinst'    => $item->fecha_medinst,
                              'comentario'       => $item->comentario,
                              'tipo_medinst'     => $item->tipo_medinst, 
                              'proyecto_id'      => $item->proyecto_id,
                              'proyecto_json_id' => $item->proyecto_json_id,
                              'exported'         => $item->exported
                              );
    }

    $columns = array("fecha_medinst",
                    "comentario",
                    "tipo_medinst",
                    "proyecto_id",
                    "proyecto_json_id",
                    "exported"
                    );

    $file = fopen($baseFile . $fileName, 'w');
    //si no quieren que el csv muestre el titulo de columnas omitan la siguiente línea.
    fputcsv($file, $columns,";");
    foreach ($arrayDetalle as $item) {
        fputcsv($file, $item,";");
    }
    fclose($file);
    
    $filePath = public_path() . '/storage/' . $fileName;
    $url = "";
    if (File::exists($filePath)) {
      $url = url('/storage') . "/" . $fileName;
    }
    return $url;
  }

  private function getUrlCapacidadProduccion($id, $fecha, $tokenProject) {
    //Nombre del archivo que generaremos
    //$baseFile = storage_path('app/public') . '/proys/descargados/';
    $baseFile = storage_path('app/public') . '/';
    $fileName = 'CapacidadProduccion_'. $id . '_' . $fecha .'.csv';
    //Arreglo que contendrá las filas de datos
    $arrayDetalle = Array();

    $items = CapacidadProduccionProyecto::where('token_project',$tokenProject)->get();
    
    foreach ($items as $item){
      $arrayDetalle[] = array('item'    => $item->item,
                              'tiempo_disenio'            => $item->tiempo_disenio,
                              'tiempo_produccion'         => $item->tiempo_produccion, 
                              'tiempo_medicion'           => $item->tiempo_medicion,
                              'tiempo_instalacion'        => $item->tiempo_instalacion,
                              'coeficiente_multiplicador' => $item->coeficiente_multiplicador,
                              'proyecto_id'               => $item->proyecto_id,
                              'proyecto_json_id'          => $item->proyecto_json_id,
                              'tiempo_disenio_c'          => $item->tiempo_disenio_c,
                              'tiempo_produccion_c'       => $item->tiempo_produccion_c,
                              'tiempo_medicion_c'         => $item->tiempo_medicion_c,
                              'tiempo_instalacion_c'      => $item->tiempo_instalacion_c,
                              'exported'                  => $item->exported
                              );
    }

    $columns = array('item',
                    'tiempo_disenio',
                    'tiempo_produccion',
                    'tiempo_medicion',
                    'tiempo_instalacion',
                    'coeficiente_multiplicador',
                    'proyecto_id',
                    'proyecto_json_id',
                    'tiempo_disenio_c',
                    'tiempo_produccion_c',
                    'tiempo_medicion_c',
                    'tiempo_instalacion_c',
                    'exported'
                    );

    $file = fopen($baseFile . $fileName, 'w');
    //si no quieren que el csv muestre el titulo de columnas omitan la siguiente línea.
    fputcsv($file, $columns,";");
    foreach ($arrayDetalle as $item) {
        fputcsv($file, $item,";");
    }
    fclose($file);
    
    $filePath = public_path() . '/storage/' . $fileName;
    $url = "";
    if (File::exists($filePath)) {
      $url = url('/storage') . "/" . $fileName;
    }
    return $url;
  }

  public function clear_cache()
  {
    Artisan::call('cache:clear');
  }
}
