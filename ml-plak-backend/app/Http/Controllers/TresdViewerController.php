<?php
namespace App\Http\Controllers;

use DB;
//use Storage;
use Illuminate\Http\Request;
class TresdViewerController extends Controller
{
	public function all_users()
  {
    $sql = "SELECT username  FROM 3d_piezas group by username";
    //$users = DB::select('select * from users where active = ?', [1]);
    $query = DB::select('SELECT username  FROM 3d_piezas group by username');
    $users = [];
    foreach ($query as $row)
      $users[] = $row->username;
    return response()->json(['users' => $users]);
  }

  public function all_parts($proyectoname)
  {
    //$query = DB::select('SELECT * FROM 3d_piezas where username= ?',[$username]);
    $query = DB::select('SELECT * FROM 3d_piezas where proyecto_name= ?',[$proyectoname]);
    $moduloes_data = [];
    $response = [];
    $modulo = [];
		foreach ($query as $row) { 
		  $modulo['pieza'] = $row->pieza;
		  $modulo['modulo_id'] = $row->modulo_id;
		  $modulo['cantidad'] = $row->cantidad;
		  $modulo['posicion_x'] = $row->posicion_x;
		  $modulo['posicion_y'] = $row->posicion_y;
		  $modulo['posicion_z'] = $row->posicion_z;
		  $modulo['rotacion_x'] = $row->rotacion_x;
		  $modulo['rotacion_y'] = $row->rotacion_y;
		  $modulo['rotacion_z'] = $row->rotacion_z;
		  $modulo['lveta'] = $row->lveta;
		  $modulo['aveta'] = $row->aveta;
		  $modulo['espesor'] = $row->espesor;
		  $modulo['orientacion'] = $row->orientacion;
		  $modulo['material_name'] = $row->material_name;
		  $modulo['color'] = $row->color;
		  $modulo['estado_id'] = $row->estado_id;
		  $modulo['prearmado_estado_id'] = $row->prearmado_estado_id;
		  $modulo['proyecto_name'] = $row->proyecto_name;
		  $modulo['cliente_name'] = $row->cliente_name;
		  $modulo['visible'] = $row->visible;
		  
		  $moduloes_data['Modulo '.$row->modulo_id][] = $modulo;
		  $modulo = [];
		}
		//$response["error"] = false;
    //$response["message"] = "Piezas cargadas";
    //$response["modulos"] = $moduloes_data;
    return response()->json(['modulos' => $moduloes_data]);
  }

  public function save_parts( Request $request )
  {

    DB::beginTransaction();
		try {
	    $piezas_collect  = (array) $request->input('data.parts');
	    $rotacion  = (array) $request->input('data.rotacion');
	    $info = (array) $request->input('data.info');
	    
	    $piezas_data = [];
	    $tapacantos_data = [];
	    $response = [];
	    if( !$info['token_project'] )
	    {
	      $milisegundos = round(microtime(true) * 1000);
	      $token_project = md5($info['mueble'].$milisegundos);
	    }else{
	      $token_project = $info['token_project'];
	    }

	    $username = trim( $info['username'] );
	    
	    //bloquear la tabla para evitar errores
	     DB::table('3d_piezas')->lockForUpdate()->get();
	    //borrar las piezas anteriores
	    $query = DB::delete('DELETE FROM 3d_piezas where username= ?',[$username]);
	    
	    $mod_rotacion = array();
	    foreach($rotacion as $r )
	      $mod_rotacion[$r['name']] = array( 'rx'=>$r['rx'], 'ry'=>$r['ry'],'rz'=>$r['rz'] );

	    //$parts_panels_path = storage_path().'/temp';
	    //$file = fopen($parts_panels_path.'/querys.txt','w+');
	    foreach ($piezas_collect as $index => $value) {
        $visible =  isset($value['Visible']) ? boolval($value['Visible']) : true; 
	      $num_module  = explode(' ', $value['Module'])[1];
        
	      $pieza = [
					'pieza'               => $value['Name'],
					'modulo_id'           => $num_module,
					'cantidad'            => $value['Count'],
					'posicion_x'          => empty($value['X']) ? 0 : $value['X'],
					'posicion_y'          => empty($value['Y']) ? 0 : $value['Y'],
					'posicion_z'          => empty($value['Z']) ? 0 : $value['Z'],
					'rotacion_x'          => empty($mod_rotacion[$value['Module']]['rx']) ? 0 : $mod_rotacion[$value['Module']]['rx'],
					'rotacion_y'          => empty($mod_rotacion[$value['Module']]['ry']) ? 0 : $mod_rotacion[$value['Module']]['ry'],
					'rotacion_z'          => empty($mod_rotacion[$value['Module']]['rz']) ? 0 : $mod_rotacion[$value['Module']]['rz'],
					'lveta'               => $value['LVeta'],
					'aveta'               => $value['AVeta'],
					'espesor'             => $value['Espesor'],
					'orientacion'         => $value['Orientacion'],
					'material_name'       => isset($value['Material']) ? $value['Material'] : '',
					'color'               => isset($value['Color']) ? $value['Color'] : '',
					'estado_id'           => 1,
					'prearmado_estado_id' => 1,
					'cliente_name' => 'default',
					'proyecto_name' => $token_project,
					'username' => $username,
					'visible' => $visible === false ? 0 : 1
	      ];
	      $sql = $this->ArmarQueryPieza($pieza);
	      
        //fwrite($file, $sql."\n");
	      $query = DB::insert( $sql );
	    }
      
	    
	    $response["token_project"] = $token_project;
	    $response["username"] = $username;
	    $response["message"] = "Pieza creada satisfactoriamente!"; 

		  DB::commit();
		} catch (Exception $e) {
			DB::rollback();
		}

		return response()->json(['response' => $response]);
  }

  private function ArmarQueryPieza($array)
  {
		
		$pieza =  $array['pieza'];
		$modulo_id =  $array['modulo_id'];
		$cantidad =  $array['cantidad'];
		$posicion_x =  $array['posicion_x'];
		$posicion_y =  $array['posicion_y'];
		$posicion_z =  $array['posicion_z'];
		$rotacion_x =  $array['rotacion_x'];
		$rotacion_y =  $array['rotacion_y'];
		$rotacion_z =  $array['rotacion_z'];
		$lveta =  $array['lveta'];
		$aveta =  $array['aveta'];
		$espesor =  $array['espesor'];
		$orientacion =  $array['orientacion'];
		$material_name=  $array['material_name'];
		$color =  $array['color'];
		$estado_id =  $array['estado_id'];
		$prearmado_estado_id =  $array['prearmado_estado_id'];
		$cliente_name =  $array['cliente_name'];
		$proyecto_name =  $array['proyecto_name'];
		$username =  $array['username'];
		$visible =  $array['visible'];

		$sql = "INSERT INTO 3d_piezas (id, pieza, cantidad, posicion_x, posicion_y, posicion_z, rotacion_x, rotacion_y, rotacion_z, lveta, aveta, espesor, orientacion, created_at, updated_at, modulo_id, material_name, color, estado_id, prearmado_estado_id, cliente_name, proyecto_name, username, visible) VALUES (NULL, '$pieza', '$cantidad', '$posicion_x', '$posicion_y', '$posicion_z', '$rotacion_x', '$rotacion_y', '$rotacion_z', '$lveta', '$aveta', '$espesor', '$orientacion', NULL, NULL, '$modulo_id', '$material_name', '$color', '1', '1', 'ar_cliente_name', '$proyecto_name', '$username', '$visible');";

    return $sql;
  }

  public function borrarPiezas( $username )
    {
            $this->conn->query('LOCK TABLES 3d_piezas WRITE;');
            $sql = "DELETE FROM 3d_piezas where username='$username';";
            $this->conn->query($sql);
    }
}
