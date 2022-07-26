<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

use App\Models\MkNotification;
use App\Models\MkNotificationUsuario;
use App\Models\ViewNotifUsActiva;
use App\Models\Usuario;

// use Illuminate\Support\Facades\Cache;
// use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;


   
class NotificationController extends Controller {


  public function index(Request $request) {
      $data = MkNotification::all();

      // echo $data;
      //return response()->json($data);
      return response()->json(['success' => true,'data' => $data],200);
    }


  public function show($id) {
    $data = MkNotification::find($id);
    return response()->json(['success' => true,'data' => $data],200);
  }


  /*
    public function allProyects(Request $request)
	{
		$data = json_decode(json_encode($request->all()));
		$page = $data->page;
		$search = $data->search;
  */

  public function notUsuario(Request $request) {
    $req    = json_decode(json_encode($request->all()));
		$usuario = $req->usuario;
		$path    = $req->path;


    $data = ViewNotifUsActiva::where("sector_id", $path)     
           ->where("usuario_id", $usuario)
           ->get();

    /*
    $fecha =  date("Y-m-d");
		$data = MkNotification::select(['mk_notificaciones.id', 'mk_notificaciones.titulo', 'mk_notificaciones.contenido', 'mk_notificaciones.fecha_inicio', 'mk_notificaciones.fecha_fin', 'mk_notificaciones.created_at'])
      ->join("mk_notificaciones_usuarios", "mk_notificaciones_usuarios.notificacion_id", "=", "mk_notificaciones.id")
			->where("mk_notificaciones.sector_id", $path)     
      ->where("mk_notificaciones_usuarios.usuario_id", $usuario)
      ->where("mk_notificaciones.num_repeticion",">","mk_notificaciones_usuarios.num_vista")      
      ->where("mk_notificaciones.activo", 1)
      ->where("mk_notificaciones.fecha_inicio", "<=",  $fecha)
      ->where("mk_notificaciones.fecha_fin",">=",  $fecha)
			->get();
    */
      $user = Usuario::select(['id', 'correo_google', 'usuario', 'nombre_completo'])
			->where('id', 	$usuario)  
			->get();

      
      DB::table('mk_notificaciones_usuarios')
      ->where('sector_id', $path)     
      ->where('usuario_id', $usuario)
      ->increment('num_vista');
    
    return response()->json(['success' => true, 'user' => $user, 'data' => $data],200);
  }



  public function create (Request $request) {
      try {
        $this->validate($request, [
          'sector_id' => 'required|string',
          'periodo_repeticion_id' => 'required|integer',
          'titulo' => 'required|string',
          'contenido' => 'required|string',
          'num_repeticion' => 'required|integer',
          'fecha_inicio' => 'required',
          'fecha_fin' => 'required',
          'activo' =>'required|integer'

        ]);

       
        $data = [
            'sector_id' => $request->sector_id,
            'periodo_repeticion_id' => $request->periodo_repeticion_id,
            'titulo' => $request->titulo,
            'contenido' => $request->contenido,
            'num_repeticion'=> $request->num_repeticion,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' =>$request->fecha_fin,
            'activo' => $request->activo
        ];

        $notificacion = MkNotification::create($data);



        $users = Usuario::select(['id'])
        ->where('activo', 	1)  
        ->get();

     
        foreach ($users as $user) {         
          $data02 = [
            'notificacion_id' => $notificacion->id,
            'sector_id' =>  $notificacion->sector_id,
            'usuario_id' =>  $user->id,
            'num_vista' =>0,
            'vista' => 0
          ];
          MkNotificationUsuario::create($data02);

          
        }

        // INSERT INTO mk_notificaciones_usuarios  (id, notificacion_id, sector_id, usuario_id, num_vista, vista, created_at) 
        // SELECT null, NEW.id, NEW.sector_id, usuarios.id, 0, 0, now() FROM usuarios WHERE activo = 1 ;

       // $this->clear_cache();
        return response()->json(['status' => true,'data' => $notificacion, 'notificacion_id' => $notificacion->id,],201);
      } catch (Exception $e) {
        return response()->json(['status' => false,'error' => $e->getMessage()],404);
      }
  }



  
  public function update(Request $request, $id) {
      try {

        $this->validate($request, [
          'sector_id' => 'required|string',
          'periodo_repeticion_id' => 'required|integer',
          'titulo' => 'required|string',
          'contenido' => 'required|string',
          'num_repeticion' => 'required|integer',
          'fecha_inicio' => 'required',
          'fecha_fin' => 'required',
          'activo' =>'required|integer'

        ]);
 
          
        $data = [
          'sector_id' => $request->sector_id,
          'periodo_repeticion_id' => $request->periodo_repeticion_id,
          'titulo' => $request->titulo,
          'contenido' => $request->contenido,
          'num_repeticion'=> $request->num_repeticion,
          'fecha_inicio' => $request->fecha_inicio,
          'fecha_fin' => $request->fecha_fin,
          'activo' => $request->activo
      ];

       $data02 = ['sector_id' => $request->sector_id];

        $notificacion = MkNotification::findOrFail($id);
        $notificacion->update($data);
        
        
        /*
        $notUsuario = MkNotification::all()
        ->where('sector_id', $request->sector_id)     
        ->where('notificacion_id', $id);
        $notUsuario->update($data02);
        */


        // $this->clear_cache();
        return response()->json(['status' => true,'data' => $notificacion],200);
      } catch (Exception $e) {
        return response()->json(['status' => false,'error' => $e->getMessage()],404);
      }
  }

  public function destroy($id)
  {
        try {
            
            DB::table('mk_notificaciones_usuarios')->where('notificacion_id',  $id)->delete();
          
            $notificacion = MkNotification::findOrFail($id);
            $notificacion->delete();

            // $this->clear_cache();
            return response()->json(['status' => true],200);
        } catch (Exception $e) {
          return response()->json(['status' => false,'error' => $e->getMessage()],404);
        }
  }

}
