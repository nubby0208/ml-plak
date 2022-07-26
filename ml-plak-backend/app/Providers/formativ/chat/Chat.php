<?php

namespace App\Providers\formativ\chat;

use Evenement\EventEmitterInterface;
use Exception;
use Ratchet\ConnectionInterface as RatchetConnectionInterface;
use SplObjectStorage;

use App\Models\MkGrupo as Grupo;
use App\Models\Activo;
use App\Models\Grupomensajes;
use App\Models\Chatmensajes;
use App\Models\ChatGrupo;
use App\Models\ChatGrupoMensaje;
use App\Models\Usuario;

use Illuminate\Support\Facades\Log;
use App\Providers\formativ\chat\User;
use DB;

class Chat implements ChatInterface
{
    protected $users;
    protected $emitter;
    protected $id = 1;

    /* Listado de tipos de eventos emitidos por el cliente */
    private const NEW_CONNECTION = 'new_connection';
    private const GLOBAL_TEMA_NUEVO = 'env_gru_temanuevo';
    private const GLOBAL_MENSAJE_NUEVO = 'env_grumen_mensajenuevo';
    private const GLOBAL_USUARIO_ACTIVO = 'env_activogrupo_user';
    private const GLOBAL_TEMA_ELIMINAR = 'env_deletetema_delete';
    private const CHAT_MENSAJE_NUEVO = 'env_chatmen_mensajenuevo';
    private const CHAT_USUARIO_ACTIVO = 'env_marcarvisto_mensajechat';
    private const CHAT_PEDIDO_APROBAR = 'env_actchatpedido_ok';
    private const CHAT_GRUPO_NUEVO = 'chat_grupo_nuevo';
    private const CHAT_GRUPO_MENSAJE = 'chat_grupo_mensaje';
    private const CHAT_GRUPO_ACTIVO = 'chat_grupo_activo';
    private const CHAT_GRUPO_APROBAR = 'chat_grupo_aprobar';

    /* Listado de tipos de eventos emitidos por el servidor de websocket y enviados al cliente */
    private const RESPONSES = [
        self::NEW_CONNECTION => 'resp_new_connection',
        self::GLOBAL_TEMA_NUEVO => 'resp_gru_temanuevo',
        self::GLOBAL_MENSAJE_NUEVO => 'resp_grumen_mensajenuevo',
        self::GLOBAL_USUARIO_ACTIVO => 'resp_activogrupo_user',
        self::GLOBAL_TEMA_ELIMINAR => 'resp_deletetema_delete',
        self::CHAT_MENSAJE_NUEVO => 'resp_chatmen_mensajenuevo',
        self::CHAT_USUARIO_ACTIVO => 'resp_marcarvisto_mensajechat',
        self::CHAT_PEDIDO_APROBAR => 'resp_actchatpedido_ok',
        self::CHAT_GRUPO_NUEVO => 'resp_chat_grupo_nuevo',
        self::CHAT_GRUPO_MENSAJE => 'resp_chat_grupo_mensaje',
        self::CHAT_GRUPO_ACTIVO => 'resp_chat_grupo_activo',
        self::CHAT_GRUPO_APROBAR => 'resp_chat_grupo_aprobar',
    ];

    public function __construct(EventEmitterInterface $emitter)
    {
        $this->emitter = $emitter;
        $this->users   = new SplObjectStorage();
    }

    public function getUserBySocket(RatchetConnectionInterface $socket)
    {
        foreach ($this->users as $next) {
            if ($next->getSocket() === $socket) {
                return $next;
            }
        }

        return null;
    }

    public function getUsersByAppId($id)
    {
        $list_users = [];
        $ids = (is_array($id)) ? $id : [$id];

        foreach ($this->users as $user) {
            if (in_array($user->getUserId(), $ids)) {
                $list_users[] = $user;
            }
        }

        return $list_users;
    }

    public function getEmitter()
    {
        return $this->emitter;
    }

    public function setEmitter(EventEmitterInterface $emitter)
    {
        $this->emitter = $emitter;
    }

    public function getUsers()
    {
        return $this->users;
    }

    public function onOpen(RatchetConnectionInterface $socket)
    {
        $user = new User();
        $user->setId($this->id++);
        $user->setSocket($socket);
        $this->users->attach($user);
		$this->emitter->emit("open", [$user]);
    }

    public function onMessage(RatchetConnectionInterface $socket, $message)
    {
        $user = $this->getUserBySocket($socket);
        $message = json_decode($message, true);
        var_dump('message =>', $message);

        switch ($message['type']) {
            case self::NEW_CONNECTION:
            {
                $saved = $user->setAppData($message['data']);
                $userData = $message['data'];
                $mensajes_no_leidos = ($userData)
                    ? $this->get_mensajes_no_leidos($userData['id'])
                    : null;
                $message_data = [
                    'saved' => $saved,
                    'mensajes_no_leidos' => $mensajes_no_leidos,
                ];

                $resp_message = json_encode([
                    'data' => $message_data,
                    'type' => self::RESPONSES[self::NEW_CONNECTION],
                    'message' => 'new user',
                ]);

                $receiver = $this->getUsersByAppId($userData['id']);

                $this->chatSendMessage($receiver, $resp_message);
                // var_dump($user->getUserId());
                break;
            }
            case "name":
            {
                $user->setName($message['data']);
                $this->emitter->emit("name", [
                    $user,
                    $message['data']
                ]);
                break;
            }
            case "message":
            {
                $this->emitter->emit("message", [
                    $user,
                    $message['data']
                ]);
               
                break;
            }
            /*
            * GRUPOS
            * descripcion: al crearse un nuevo grupo, se enviara ha todos los usuarios conectados.
            * Para que salga en pantalla.
            */
            case self::GLOBAL_TEMA_NUEVO:
            {
                $data = $message['data'];
                $grupo = $this->createGroup($data);
                $message_data = [
                    'grupo' => $grupo,
                ];

                $message = json_encode([
                    'type' => self::RESPONSES[self::GLOBAL_TEMA_NUEVO],
                    'message' => null,
                    'data' => $message_data,
                ]);

                $this->sendMessageAll($user, $message);
                break;
            }
            /*
            * Mensajes de GRUPOS
            */
            case self::GLOBAL_MENSAJE_NUEVO:
            {
                $data = $message['data'];

                $message_data = [
                    'message' => $this->createGroupMessage($data),
                    'mensajes_no_leidos' => $this->get_mensajes_no_leidos($data['from']),
                    'from' => $data['from'],
                ];

                $message = json_encode([
                    'type' => self::RESPONSES[self::GLOBAL_MENSAJE_NUEVO],
                    'message' => '',
                    'data' => $message_data,
                ]);

                $this->sendMessageAll($user, $message);
                break;
            }
            //para crear el ultimo momento que un usuario estuvo en
            //grupos
            case self::GLOBAL_USUARIO_ACTIVO:
            {
                $data = $message['data'];
                $message_data = [
                    'activo' => $this->createActiveGroup($data),
                    'mensajes_no_leidos' => $this->get_mensajes_no_leidos($data['user_id']),
                ];

                $message = json_encode([
                    'type' => 'resp_activogrupo_user',
                    'message' => null,
                    'data' => $message_data
                ]);

                $this->sendMessageAll($user, $message);
                break;
            }
            /*
                Para eliminar un tema y sus mensajes
            */
             case self::GLOBAL_TEMA_ELIMINAR:
            {
                $res = $this->deletetema($message['data']);
                $todata = json_encode(['type' => 'resp_deletetema_delete', 'data' => $res]);
                $this->sendMessageAll($user, $todata);
                break;
            }
            /*
            * Mensajes de CHATS
            */
            case self::CHAT_MENSAJE_NUEVO:
            {
				$data = $message['data'];
                $message = $this->createChatMessage($data);
                $data_response = [
                    'mensajes_no_leidos' => $this->get_mensajes_no_leidos($data['to']),
                    'to' => $data['to'],
                    'from' => $data['from'],
                ];

                $message_data = json_encode([
                    'type' => self::RESPONSES[self::CHAT_MENSAJE_NUEVO],
                    'message' => $message,
					'data' => $data_response,
                ]);

                $receivers = $this->getUsersByAppId([$data['to'], $data['from']]);

                // var_dump('count', count($receivers));
                $this->chatSendMessage($receivers, $message_data);

                // $this->sendMessageAll($user, $todata);
                break;
            }
            // para marcar todos los mensajes de este chat como vistos
            case self::CHAT_USUARIO_ACTIVO:
            {
				$data = $message['data'];
                $res = $this->actmensajevisto($data);

                $data_response = ['from' => $data['from'], 'to' => $data['to']];
                $data_response['mensajes_no_leidos'] = $this->get_mensajes_no_leidos($data['from']);

				// $res['idenviox'] = $data->idenviox;
                // $todata = json_encode(['resptype'=>'resp_marcarvisto_mensajechat','data'=>$res]);

                $message_data = json_encode([
                    'type' => self::RESPONSES[self::CHAT_USUARIO_ACTIVO],
                    'message' => null,
                    'data' => $data_response,
                ]);

                $this->sendMessageAll($user, $message_data);
                break;
            }
            case self::CHAT_PEDIDO_APROBAR:
            {
                $data = $message['data'];
                $chat_id = $this->updateChatPedido($data);
                $data_response = [
                    'from' => $data['from'],
                    'to' => $data['to'],
                    'chtm_nid' => $chat_id,
                ];

                $message_data = json_encode([
                    'type' => self::RESPONSES[self::CHAT_PEDIDO_APROBAR],
                    'message' => null,
                    'data' => $data_response,
                ]);

                $receivers = $this->getUsersByAppId([$data['to'], $data['from']]);

                $this->chatSendMessage($receivers, $message_data);
                break;
            }
            case self::CHAT_GRUPO_NUEVO:
            {
                $data = $message['data'];
                $chat_grupo = new ChatGrupo;
                $chat_grupo->nombre = $data['nombre'];
                $chat_grupo->usuario_id = $data['from'];
                $chat_grupo->save();

                $chat_grupo_usuarios = [];
                $miembros = $data['usuarios'];
                $miembros[] = $data['from'];

                foreach ($miembros as $miembro) {
                    $chat_grupo_usuarios[$miembro] = [
                        'activo' => \Carbon\Carbon::now(),
                    ];
                }

                $chat_grupo->miembros()->sync($chat_grupo_usuarios);
                $chat_grupo_array = $chat_grupo->toArray();
                $chat_grupo_array['tipo'] = 'chat_grupo';

                $receivers = $this->getUsersByAppId($miembros);

                $message_data = json_encode([
                    'type' => self::RESPONSES[self::CHAT_GRUPO_NUEVO],
                    'message' => null,
                    'data' => [
                        'chat_grupo' => $chat_grupo_array,
                    ],
                ]);

                $this->chatSendMessage($receivers, $message_data);
                break;
            }
            case self::CHAT_GRUPO_MENSAJE:
            {
                $data = $message['data'];
                $message = new ChatGrupoMensaje;
                $message->fill([
                    'mensaje' => $data['message'],
                    'tipo' => $data['type'],
                    'usuario_id' => $data['from'],
                    'chat_grupo_id' => $data['chat_grupo_id'],
                ]);
                $message->save();
                $message->load('usuario:id,usuario,nombre_completo');

                $chat_grupo = ChatGrupo::find($data['chat_grupo_id']);
                $miembros = $chat_grupo->miembros()->get()->pluck('id')->all();

                $receivers = $this->getUsersByAppId($miembros);

                $message_data = json_encode([
                    'type' => self::RESPONSES[self::CHAT_GRUPO_MENSAJE],
                    'message' => $message,
                ]);

                $this->chatSendMessage($receivers, $message_data);
                break;
            }
            case self::CHAT_GRUPO_ACTIVO:
            {
                $data = $message['data'];
                $user = Usuario::find($data['from']);
                $user->chat_grupos()->updateExistingPivot(
                    $data['chat_grupo_id'],
                    ['activo' => \Carbon\Carbon::now()]
                );

                $chat_grupo = ChatGrupo::find($data['chat_grupo_id']);
                $miembros = $chat_grupo->miembros()->get()->pluck('id')->all();
                $data['mensajes_no_leidos'] = $this->get_mensajes_no_leidos($data['from']);

                $receivers = $this->getUsersByAppId($miembros);

                $message_data = json_encode([
                    'type' => self::RESPONSES[self::CHAT_GRUPO_ACTIVO],
                    'data' => $data,
                ]);

                $this->chatSendMessage($receivers, $message_data);
                break;
            }
            case self::CHAT_GRUPO_APROBAR:
            {
                $data = $message['data'];
                $message = ChatGrupoMensaje::find($data['message_id']);
                $message->aprobado_usuario_id = $data['from'];
                $message->save();
                $message->load('aprobado_usuario:id,usuario,nombre_completo');

                $response_data = $data;
                $response_data['chat_grupo_id'] = $message->chat_grupo_id;

                $chat_grupo = ChatGrupo::find($message->chat_grupo_id);
                $miembros = $chat_grupo->miembros()->get()->pluck('id')->all();

                $receivers = $this->getUsersByAppId($miembros);

                $message_data = json_encode([
                    'type' => self::RESPONSES[self::CHAT_GRUPO_APROBAR],
                    'data' => $message,
                ]);

                $this->chatSendMessage($receivers, $message_data);
                break;
            }
        }  
    }

    public function onClose(RatchetConnectionInterface $socket)
    {
        $user = $this->getUserBySocket($socket);
        if ($user) {
            $this->users->detach($user);
            $this->emitter->emit("close", [$user]);
        }
    }

    public function onError(RatchetConnectionInterface $socket, Exception $exception)
    {
        $user = $this->getUserBySocket($socket) ?? null;

        if ($user) {
            $user->getSocket()->close();
        }

		var_dump('into exception: ', $exception->getLine(), $exception->getFile(), $exception->getMessage());
        $this->emitter->emit("error", [$user, $exception]);
    }

    public function sendMessageAll($user, $message_data)
    {
        foreach ($this->users as $next) {
            $next->getSocket()->send($message_data);
            
        }
    }

    /*
    * Metodos SQL para grups
    */
    public function createGroup($request)
    {
        try{
            $data = $request;
            $grupos_data = [
                    'grup_vtema'            => $data['grup_vtema'],
                    'grup_dfechacreacion'   => date_format(new \Datetime(), 'Y-m-d H:i:s'),
                    'user_nid'              => $data['user_nid'],
                    'grup_nsts'             => $data['grup_nsts']
                ];
            $grupo = new Grupo();
            $grupo->fill($grupos_data);
            $grupo->save();
            return $grupo;

        }catch(Exception $err){
            $this->emitter->emit("error", [$user, $request]);
        }       
    }

    /*
    * Metodos SQL para activo en grupo
    */
    public function createActiveGroup($request)
    {
        try{
            $data = $request;
            $activo_data = [
                    'act_dfechaultima'  => date_format(new \Datetime(), 'Y-m-d H:i:s'),
                    'user_id'           => $data['user_id'],
                    'grupo_nid' =>$data['grupo_nid']
                ];
            $activo = new Activo();
            $activo->fill($activo_data);
            $activo->save();

            return $activo;

        }catch(Exception $err){
            $this->emitter->emit("error", [$user, $request]);
        }       
    }

    /*
    * Metodos SQL para mensajes de grups
    */
    public function createGroupMessage($request)
    {
        try{
            $data = $request;
            $grupomensajes_data = [
                    'grup_nid'               => $data['to_group'],
                    'user_nid_envidox'       => $data['from'],
                    'grme_vmensaje'          => $data['message'],
                    'grme_dfechaenvio'       => date_format(new \Datetime(), 'Y-m-d H:i:s')//$data->grme_dfechaenvio
                ];
            $grupomensaje = new Grupomensajes();
            $grupomensaje->fill($grupomensajes_data);
            $grupomensaje->save();

            return $grupomensaje;

        }catch(Exception $exception){
            $this->emitter->emit("error", [null, $exception]);
        }
    }

    /*
    * Metodos SQL para mensajes de chats
    */
    public function createChatMessage($request)
    {
        DB::beginTransaction();
        try {
            $data = $request;
            $chatmensajes_data = [
                    'user_enviox_nid'        => $data['from'],
                    'chtm_mensaje'           => $data['message'],
                    'chtm_tipo'              => $data['type'],
                    'user_nid_destinatario'  => $data['to'],
                    'chtm_dfechacrea'        => date_format(new \Datetime(), 'Y-m-d H:i:s')//$data->chtm_dfechacrea
                ];

            $chatmensaje = new Chatmensajes();
            $chatmensaje->fill($chatmensajes_data);
            $chatmensaje->save();
            
            DB::commit();

            return $chatmensaje;
        } catch(Exception $exception) {
            DB::rollback();
			// var_dump($exception->getMessage(), $exception->getFile());
            $this->emitter->emit("error", [null, $exception]);
        }
    }

    public function updateChatPedido($request)
    {
        try {
            $chatmensaje = new Chatmensajes();
            $chatmensaje->where('chtm_nid', $request['chtm_nid'])
                ->update([
                    'chtm_npedidosts' => 1
                ]);

            return $request['chtm_nid'];

        } catch(Exception $err) {
            $this->emitter->emit("error", [null, $request]);
        }
    }

    /*
    * Metodos SQL para actualizar activo
    */ 
    public function actmensajevisto($request)
    {
        try{
            $chatmensaje = new Chatmensajes();
            $chatmensaje->where('user_enviox_nid',  $request['to'])->where('user_nid_destinatario',$request['from'])
                ->update([
                    'chtm_nvisto' => 1
                ]);

            return ['success' => true];

        }catch(Exception $exception){
            $this->emitter->emit("error", [null, $exception]);
        }
    }

    /*
    * DELETE TEMA
    */
    public function deletetema($request)
    {
        try{
            $grupo = new Grupo();
            $grupomensaje = new Grupomensajes();
            $grupomensaje->where('grup_nid',$request['idgrupo'])->delete();
            $grupo->where('grup_nid',$request['idgrupo'])->delete();

            return ['success' => true,'idgrupo'=>$request['idgrupo']];

        }catch(Exception $err){
            $this->emitter->emit("error", [$user, $request]);
        }
    }

	private function get_mensajes_no_leidos($user_id)
	{
		$mensajes_chat = Chatmensajes::where('chtm_nvisto', 0)
			->where('user_nid_destinatario', $user_id)
			->count();

        $mensajes_grupo_tree = Grupo::getMensajesSinLeer($user_id);
        $mensajes_grupo = 0;

        $mensajes_chat_grupo = ChatGrupo::getMensajesSinLeer($user_id);
        $mensajes_chat += $mensajes_chat_grupo['cantidad'];
        
        foreach ($mensajes_grupo_tree as $grupo) {
            $mensajes_grupo += (array_key_exists('mensajes_no_leidos', $grupo))
				? (int) $grupo['mensajes_no_leidos']
				: 0;
        }

		return [
			'mensajes_chat' => $mensajes_chat,
            'mensajes_grupo' => $mensajes_grupo,
            'mensajes_grupos_tree' => $mensajes_grupo_tree,
		];
	}

    private function chatSendMessage($receivers, $message_data)
    {
        foreach ($receivers as $receiver) {
            $receiver->getSocket()->send($message_data);
        }
    }

    private function chatGrupoSend($receivers, $message_data)
    {
        foreach ($receivers as $receiver) {
            $receiver->getSocket()->send($message_data);
        }
    }
}
