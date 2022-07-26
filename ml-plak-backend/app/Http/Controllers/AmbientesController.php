<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ambiente;
use DB;

class AmbientesController extends Controller
{
    //listar ambientes
    public function obtenerAmbientes( Request $request )
    {
        DB::beginTransaction();
        try {
            $token = $request->input('token');
            //bloquear la tabla para evitar errores
            DB::table('ambientes')->lockForUpdate()->get();
            //borrar las piezas anteriores
            
            $query = DB::table('ambientes')->where('token_proyecto', $token)->get();
            
            if($query->count()>0){
                $query[0]->ambiente = json_decode($query[0]->ambiente);
                
                for ($contador=0; $contador < count($query[0]->ambiente); $contador++) { 
                    $foto = $query[0]->ambiente[$contador]->imagen;
                    $path = public_path().'/images/ambientes/'.$foto;
                    $type = pathinfo($path, PATHINFO_EXTENSION);
                    $data = file_get_contents($path);
                    $query[0]->ambiente[$contador]->imagen = 'data:image/' . $type . ';base64,' . base64_encode($data);
                    $query[0]->ambiente[$contador]->codigo = $foto;
                    $query[0]->ambiente[$contador]->interno = $contador+1;
                }
               
                $response["ambientes"] = $query[0];
                $response["message"] = "Ambiente enviados satisfactoriamente!";
                $response["status"] = 1;

            }else{ 
                $response["message"] = "No posee ambiente";
                $response["status"] = 0;
            }
            
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            $response["message"] = "Error interno, consulte al administrador!";
            $response["status"] = 2;
        }
        
        return response()->json(['response' => $response]);
    }

    //agregar ambiente
    public function nuevoAmbiente( Request $request )
    {
        DB::beginTransaction();
        try {
            $token = $request->input('token');
            $nombre = $request->input('nombre');
            $foto = $request->input('foto');
            
            //bloquear la tabla para evitar errores
            DB::table('ambientes')->lockForUpdate()->get();
            //borrar las piezas anteriores
            
            $query = DB::table('ambientes')->where('token_proyecto', $token)->get();
            
            if($query->count()>0){
                $json_db =  json_decode($query);
                $json_db = json_decode($json_db[0]->ambiente);                
                $cod_foto = count($json_db)+1;
                $nombreFoto = $cod_foto.'-'.$token.'.png';
                $ambiente = $this->cargarNuevoAmbiente($nombreFoto, $nombre, $cod_foto);
                array_push($json_db, $ambiente);
                DB::update('update ambientes set ambiente = ? where token_proyecto = ?', [json_encode($json_db) , $token]);
                $this->guardarFoto($nombreFoto, $foto);
            }else{ 
                $nombreFoto = '1-'.$token.'.png';
                $datos = [
                    'token_proyecto'    => $token,
                    'ambiente'          => $this->armarNuevoAmbiente($nombreFoto,$nombre,1)
                ];
                $sql = $this->QueryNuevoAmbiente($datos);
                $query = DB::insert( $sql );
                $this->guardarFoto($nombreFoto, $foto);
            }
            $response["message"] = "Ambiente guardado satisfactoriamente!";
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            $response["message"] = "Error interno, consulte al administrador!";
        }
        
        return response()->json(['response' => $response]);
    }

    //agregar informacion
    public function informacionAmbiente(Request $request){
        DB::beginTransaction();
        try {
            $token = $request->input('token');
            $informacion = $request->input('informacion');
            $ambiente = $request->input('ambiente');

            //bloquear la tabla para evitar errores
            DB::table('ambientes')->lockForUpdate()->get();
            //borrar las piezas anteriores
            
            $query = DB::table('ambientes')->where('token_proyecto', $token)->get();
            if($query->count()>0){
                $query[0]->ambiente = json_decode($query[0]->ambiente);
                for ($contador=0; $contador < count($query[0]->ambiente); $contador++) { 
                    if($ambiente === $query[0]->ambiente[$contador]->imagen ){
                        array_push($query[0]->ambiente[$contador]->informacion, $informacion);
                        break;
                    }
                }
                DB::update('update ambientes set ambiente = ? where token_proyecto = ?', [json_encode($query[0]->ambiente) , $token]);
                $response["message"] = "Información agregada satisfactoriamente!";
                $response["status"] = 1;
            }else{
                $response["message"] = "Ambiente no encontrado, comunquese con el administrador!";
                $response["status"] = 0;
            }
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            $response["message"] = "Error interno, consulte al administrador!";
            $response["status"] = 2;
        }
        return response()->json(['response' => $response]);  
    }

    private function QueryNuevoAmbiente($array)
    {
        $token_proyecto =  $array['token_proyecto'];
        $json =  json_encode($array['ambiente']);

        $sql = "INSERT INTO ambientes (id, token_proyecto, ambiente, created_at, updated_at) VALUES (NULL, '$token_proyecto', '$json', null, null);";
      return $sql;
    }
    private function armarNuevoAmbiente($foto, $nombre,$interno)
    {
        $ambiente['nombre'] = $nombre;
        $ambiente['imagen'] = $foto;
        $ambiente['interno'] = $interno;
        $ambiente['informacion'] = array();
        return array($ambiente);
    }
    private function cargarNuevoAmbiente($foto, $nombre,$interno)
    {
        $ambiente['nombre'] = $nombre;
        $ambiente['imagen'] = $foto;
        $ambiente['interno'] = $interno;
        $ambiente['informacion'] = array();
        return $ambiente;
    }
    public function guardarFoto($nombre, $foto64)
	{
        $foto64 = str_replace('data:image/png;base64,', '', $foto64);
        $foto   = str_replace(' ', '+', $foto64);
        $path = public_path().'/images/ambientes/'. $nombre;
        \File::put($path, base64_decode($foto));
    }

    /**
     * Nota
     * Where you don’t have access to the command line on your server, you can programmatically execute commands by adding the following to your routes:
     * Route::get('/clear-cache', function() {
     * $exitCode = Artisan::call('config:clear');
     * $exitCode = Artisan::call('cache:clear');
     * $exitCode = Artisan::call('config:cache');
     * return 'DONE'; //Return anything
     * });
    */    
}//end
