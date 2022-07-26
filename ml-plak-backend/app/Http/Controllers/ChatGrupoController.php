<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ChatGrupo;

class ChatGrupoController extends Controller
{
    public function messages(Request $request)
    {
    	$this->validate($request, [
    		'chat_grupo_id' => 'required|integer|exists:chat_grupos,id',
    	]);

    	$chat_grupo_id = $request->input('chat_grupo_id');
    	$chat_grupo = ChatGrupo::find($chat_grupo_id);

    	$messages = $chat_grupo->mensajes()
    		->with(['usuario:id,usuario,nombre_completo'])
    		->with(['aprobado_usuario:id,usuario,nombre_completo'])
    		->take(-100)
    		->get()
    		->toArray();

    	return response()->json([
    		'messages' => $messages,
    	]);
	}
}
