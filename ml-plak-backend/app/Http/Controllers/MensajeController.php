<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\MkGrupo as Grupo;
use App\Models\Grupomensajes;
use App\Models\Chatmensajes;
use App\Models\MkTarea as Tarea;
use App\Models\Activo;

use JWTAuth;

class MensajeController extends Controller
{
	public function index(Request $request)
	{
		return response()->json(['grupos' => Grupo::orderBy('grup_nid', 'asc')->get()]);
	}


	public function proyectos($id)
	{
		$proyectos = Grupo::where('id', $id)->firstOrFail()->proyectos;
		return response()->json(['proyectos' => $proyectos]);
	}

	public function update(Request $request, $id)
	{
		$grupo = Grupo::find($id);
		$grupo->update($request->all());

		return response()->json(['status' => 'success']);
	}

	public function create(Request $request)
	{

			$this->validate($request, [
				'grup_vtema'               => 'required|string',
				'user_nid'                 => 'required|numeric',
				'grup_nsts'                => 'required|numeric'
			]);
			$data = json_decode(json_encode($request->all()));
   			$grupos_data = [
					'grup_vtema'            => $data->grup_vtema,
					'grup_dfechacreacion'   => $data->grup_dfechacreacion,
					'user_nid'           	=> $data->user_nid,
					'grup_nsts'         	=> $data->grup_nsts
				];
			$grupo = new Grupo();
		  	$grupo->fill($grupos_data);
			$grupo->save();
			return response()->json(['grupo' => $grupo]);
	}

	
	public function destroy($id)
	{
		// $proyectos = Grupo::where('id', $id)->firstOrFail()->proyectos;
		// return response()->json(['proyectos' => $proyectos]);
	}


	/*============================================
				Grupomensajes
	==============================================*/
	public function listagrupomensaje($id)
	{
		$listagrupomensaje = Grupomensajes::where('grup_nid', $id)->orderBy('grme_nid', 'asc')->limit(50)->get();
		return response()->json(['listagrupomensaje' => $listagrupomensaje]);
	}


	public function creategrupomensaje(Request $request)
	{

			$this->validate($request, [
				'grup_nid'               => 'required|numeric',
				'user_nid_envidox'       => 'required|numeric',
				'grme_vmensaje'          => 'required|string'
			]);

			$data = json_decode(json_encode($request->all()));
   			$grupomensajes_data = [
					'grup_nid'           	 => $data->grup_nid,
					'user_nid_envidox'   	 => $data->user_nid_envidox,
					'grme_vmensaje'          => $data->grme_vmensaje,
					'grme_dfechaenvio'       => date("Y-m-d H:i:s")
				];
			$grupomensaje = new Grupomensajes();
		  	$grupomensaje->fill($grupomensajes_data);
			$grupomensaje->save();
			return response()->json(['grupomensaje' => $grupomensaje]);
	}

	/*============================================
				Chatmensajes
	==============================================*/

	public function listachatmj(Request $request)
	{
		try{
	    	$data = json_decode(json_encode($request->all()));

			$listachatmensaje = Chatmensajes::where([
					['user_enviox_nid', '=', $data->user_enviox_nid],
					['user_nid_destinatario', '=', $data->user_nid_destinatario],
				])
				->orWhere([
					['user_enviox_nid', '=', $data->user_nid_destinatario],
					['user_nid_destinatario', '=', $data->user_enviox_nid],
				])
				->orderBy('chtm_nid', 'asc')
				->take(-100)
				->get();

			return response()->json(['listachatmensaje' => $listachatmensaje]);

    	} catch(Exception $err) {
    		return response()->json(['listachatmensaje' => $err]);
    	}
	}

	public function listachatmjcountmsj(Request $request)
	{
		try{
	    	$data = json_decode(json_encode($request->all()));
	    	//yo como destinatario
	    	//que visto este en 0
			$listachatmensajecount = Chatmensajes::where('user_nid_destinatario', $data->user_nid_destinatario)
				->where('chtm_nvisto',0)
				->get();

			return response()->json(['listachatmensajecount' => $listachatmensajecount]);

	    	}catch(Exception $err){
	    		return response()->json(['listachatmensajecount' => $err]);
	    	}
	}


	/*============================================
				tareas
	==============================================*/
	public function cargalistatareas($userid)
	{
		$listatareas = Tarea::where('user_nid', $userid)->limit(50)->get();
		return response()->json(['listatareas' => $listatareas]);
	}
	
	public function agregartarea(Request $request)
	{

			$this->validate($request, [
				'user_nid'               => 'required|numeric',
				'tar_vmensaje'           => 'required|string'
			]);

			$data = json_decode(json_encode($request->all()));
   			$tarea_data = [
					'tar_vmensaje'          => $data->tar_vmensaje,
					'tar_nsts'   			=> $data->tar_nsts,
					'tar_dfechacreacion'    => date_format(new \Datetime(), 'Y-m-d H:i:s'),
					'user_nid'     			=> $data->user_nid
				];
			$tarea = new Tarea();
		  	$tarea->fill($tarea_data);
			$tarea->save();
			return response()->json(['tarea' => $tarea]);
	}
	
	 public function realizadatarea($request)
	    {
	    	try{
	    	 $tarea = new Tarea();
		        $tarea->where('tar_nid', $request )
		            ->update([
		                'tar_nsts' => 1
		            ]);
		        return ['success' => true,'tar_nid'=>$request ];
	    	}catch(Exception $err){
	    		return ['success' => $err];
	    	}
	        
	    }


	/*============================================
				carga mensajes no leidos
	==============================================*/
	public function getmensajesnoleidos($userid)
	{
		$listachatmensajes = Chatmensajes::where('chtm_nvisto',0)->where('user_nid_destinatario', $userid)->count();
        $mensajes_grupo_tree = Grupo::getMensajesSinLeer($userid);
        $listagruposmensajes = 0;
        
        foreach ($mensajes_grupo_tree as $grupo) {
			$listagruposmensajes += (array_key_exists('mensajes_no_leidos', $grupo)) 
				? (int) $grupo['mensajes_no_leidos']
				: 0;
		}
		
		return response()->json([
			'listachatmensajes' => $listachatmensajes,
			'listagruposmensajes' => $listagruposmensajes
		]);
	}

	public function group_order_last_messages(Request $request)
	{
		$user_id = $request->input('user_id', null);
		// $user_id = 1;

		$groups = Grupo::getMensajesSinLeer($user_id);

		return response()->json([
			'grupos' => $groups,
		]);
	}
}
