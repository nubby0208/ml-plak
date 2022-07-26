<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;  //  Carbon::now()->format('Y-m-d'),

use App\Models\ProyectoActividad;

// use App\Models\ViewNotifUsActiva;
// use Illuminate\Support\Facades\Cache;
// use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

  
class ProyectoActividadController extends Controller {

  public function index(Request $request) {
      // $data = ProyectoActividad::all();  // SELECT ALL
      $data = ProyectoActividad::select(['id', 'poyecto_id', 'actividad_id', 'usuario_id','fecha_inicio', 'fecha_fin',  'tiempo', 'actividad', 'observacion'] )
        ->get();  
      // echo $data;
      //return response()->json($data);
      return response()->json(['success' => true,'data' => $data],200);
  }


    public function view(Request $request) {
      // $data = ProyectoActividad::all();  // SELECT ALL
      $proyecto = $req->proyecto_id;
      $data = ProyectoActividad::select([['id', 'poyecto_id', 'actividad_id', 'usuario_id','fecha_inicio', 'fecha_fin',  'tiempo', 'actividad', 'observacion']])
        ->where('proyecto_id', $proyecto) 
        // ->join('mk_ayudas_categorias','mk_ayudas_categorias.id' ,'mk_ayudas.categoria_id' )
        ->get();  

      return response()->json(['success' => true,'data' => $data],200);
    }

  public function show($id) {
    $data =ProyectoActividad::find($id);
    return response()->json(['success' => true,'data' => $data],200);
  }


  /*
    public function allProyects(Request $request)
	{
		$data = json_decode(json_encode($request->all()));
		$page = $data->page;
		$search = $data->search;
  */


  public function create (Request $request) {
      try {
        $this->validate($request, [
          'proyecto_id' => 'required|integer',
          'actividad_id' => 'required|integer',
          'usuario_id' => 'required|integer'        

        ]);
       
        $data = [
            'proyecto_id' => $request->proyecto_id,
            'actividad_id' => $request->actividad_id,
            'usuario_id' => $request->usuario_id,
            'fecha_inicio' => Carbon::now(),
            'actividad' => $request->actividad,
            'tiempo' => 0
        ];

        $query = ProyectoActividad::create($data);

       // $this->clear_cache();
        return response()->json(['status' => true,'data' =>$query, '_id' => $query->id,],201);
      } catch (Exception $e) {
        return response()->json(['status' => false,'error' => $e->getMessage()],404);
      }
  }



    // 'id', 'poyecto_id', 'actividad_id', 'usuario_id','fecha_inicio', 'fecha_fin',  'tiempo', 'actividad', 'observacion'
  public function update(Request $request, $id) {
      try {

        $this->validate($request, [
          'proyecto_id' => 'required|integer',
          'actividad_id' => 'required|integer',
          'usuario_id' => 'required|integer',

        ]);
 
        $data = [
          'proyecto_id' => $request->proyecto_id,
          'actividad_id' => $request->actividad_id,
          'usuario_id' => $request->usuario_id,
          'fecha_fin' => Carbon::now(),
          'actividad' => $request->actividad,
          'tiempo' => 0
      ];


        $query = ProyectoActividad::findOrFail($id);
        $query->update($data);
        
        // $this->clear_cache();
        return response()->json(['status' => true,'data' => $query],200);
      } catch (Exception $e) {
        return response()->json(['status' => false,'error' => $e->getMessage()],404);
      }
  }

  public function destroy($id)
  {
        try {            
          
            $query =ProyectoActividad::findOrFail($id);
            $query->delete();
            // $this->clear_cache();
            return response()->json(['status' => true],200);
        } catch (Exception $e) {
          return response()->json(['status' => false,'error' => $e->getMessage()],404);
        }
  }

}
