<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use JWTAuth;
use App\Models\Chatmensajes;
use App\Models\ChatGrupo;
// use JWTAuth;

use DB;

class UsuarioController extends Controller
{
	private $code_admin;

	public function __construct() {
		$this->code_admin = Hash::make(env('CODE_ADMIN'));
	}
	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
    //->where('activo', 1) Eliminado por Tobias Bolivar 20_05_2021
		$users = Usuario::select(['id', 'usuario', 'nombre_completo', 'correo_google', 'activo', 'visible_en_planilla','cuit_cuil', 'rol_id', 'permiso', 'rango_id','fecha_ingreso','afip'])
			->with(['rol','horario','rango'])
			->when(request('activo'), function($query) {
				$query->where('activo', 1);
			})
			->orderBy('nombre_completo')
			->get();

		return response()->json(['usuarios' => $users]);
	}

	public function listAfipUsers()
	{
		$users = Usuario::select(['id', 'usuario', 'nombre_completo', 'correo_google', 'activo', 'visible_en_planilla','cuit_cuil', 'rol_id', 'permiso', 'rango_id','fecha_ingreso','afip'])
		    ->with(['rol','horario','rango'])
			->where('afip', 1)
			->orderBy('nombre_completo')
			->get();

		return response()->json(['usuarios' => $users],200);
	}

	public function listVisibleUsers()
	{
		$users = Usuario::select(['id', 'usuario', 'nombre_completo', 'correo_google', 'activo', 'visible_en_planilla','cuit_cuil', 'rol_id', 'permiso', 'rango_id','fecha_ingreso','afip'])
			->with(['rango'])
			->where('visible_en_planilla', 1)
			->orderBy('nombre_completo')
			->get();

		return response()->json(['usuarios' => $users],200);
	}

	public function listVisibleHorarioUsers()
	{
		$users = Usuario::select(['id', 'usuario', 'nombre_completo', 'correo_google', 'activo', 'visible_en_planilla','cuit_cuil', 'rol_id', 'permiso', 'rango_id','fecha_ingreso','afip'])
			->with(['rango','horario'])
			->where('visible_en_planilla', 1)
			->orderBy('nombre_completo')
			->get();

		return response()->json(['usuarios' => $users],200);
	}

    public function getId()
    {
        return JWTAuth::parseToken()->authenticate()->id;
    }

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
		$this->validate($request, [
			'correo_google'   => 'required|email',
			'activo'          => 'required|integer|in:1,0',
			'usuario'         => 'required|unique:usuarios,usuario',
			'password'        => 'required|confirmed',
			'nombre_completo' => 'required|string',
      		'visible_en_planilla' => 'required|integer|in:1,0',
      		'cuit_cuil'       => 'string',
			'fecha_ingreso'   => 'required|date', 
			'rol_id'          => 'required|exists:roles,id',
			'rango_id'        => 'required|exists:rangos,id',
			'afip'            => 'required|integer|in:0,1'
		]);

		$data             = $request->only(['correo_google', 'usuario', 'password', 'nombre_completo', 'visible_en_planilla', 'cuit_cuil', 'rol_id', 'activo', 'rango_id','fecha_ingreso','afip']);
		$data['password'] = Hash::make($data['password']);

		$usuario = new Usuario;
		$usuario->fill($data);

		if (!$usuario->save()) {
			return response()->json(['success' => false]);
		}

		return response()->json(['success' => true, 'usuario' => $usuario]);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		$user = Usuario::find($id);

		return response()->json($user);
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, $id)
	{
		$rules = [
			'id'              => 'required|integer|exists:usuarios,id',
			'correo_google'   => 'required|email',
			'activo'          => 'required|integer|in:1,0',
			'usuario'         => 'required|unique:usuarios,usuario,'.$id,
			'nombre_completo' => 'required|string',
      		'visible_en_planilla' => 'required|integer|in:1,0',
      		'cuit_cuil'       => 'string',
			'fecha_ingreso'   => 'required|date',   
			'rango_id'        => 'required|exists:rangos,id',
			'afip'            => 'required|integer|in:0,1'
		];

		if ($request->has('password'))
			$rules['password'] = 'required|confirmed';

		$this->validate($request, $rules);

		$data = $request->only(['correo_google', 'usuario', 'nombre_completo', 'visible_en_planilla', 'cuit_cuil', 'activo', 'rol_id','rango_id','fecha_ingreso','afip']);

		if ($request->has('password'))
			$data['password'] = Hash::make($request->input('password'));

		$usuario = Usuario::find($request->input('id'));
		$usuario->fill($data);

		if (!$usuario->save()) {
			return response()->json(['success' => false]);
		}

		return response()->json(['success' => true]);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		//
	}

	/**
	 * Check the specified resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function auth(Request $request)
	{
	}

	public function get_by_google(Request $request)
	{
		$this->validate($request, [
			'correo_google' => 'required|email'
		]);

		$correo_google = $request->input('correo_google');

		$usuarios = Usuario::select(['id', 'usuario', 'correo_google'])
			->where('correo_google', $correo_google)
			->get();

		return response()->json(['usuarios' => $usuarios]);
	}

	public function check_admin(Request $request)
	{
		$this->validate($request, [
			'codigo' => 'required'
		]);

		$codigo = $request->input('codigo');

		if (Hash::check($codigo, $this->code_admin)) {
			return response()->json(['success' => true]);
		}

			return response()->json(['success' => false]);
	}

	public function getUser($id, Request $request)
	{
		$usuario = Usuario::where('usuario', $id)
			->firstOrFail();

		return response()->json(['usuario' => $usuario]);
	}

	public function delete($id)
	{
		try {
			$id = (int) $id;
			$usuario = Usuario::findOrFail($id);

			DB::beginTransaction();

			if (($usuario->id !== JWTAuth::parseToken()->authenticate()->id)) {
				$usuario->delete();

				DB::commit();

				return response()->json(['status' => true]);
			}

		} catch (Exception $e) {
			DB::rollback();

			return response()->json(['status' => false]);
		}
	}

	public function order_last_messages()
	{
		$users = [];
		$chat_grupos = [];
		$current_user = (int) JWTAuth::parseToken()->authenticate()->id;
		$users_raw = Usuario::select(['id', 'usuario', 'nombre_completo', 'correo_google', 'activo', 'rol_id'])
			->where('id', '!=', $current_user)
			->get()
			->pluck(null, 'id')
			->toArray();

		$chat_grupos_raw = \App\Models\Usuario::find($current_user)
			->chat_grupos()
			->with('miembros:usuarios.id,usuarios.usuario,usuarios.nombre_completo')
			->get()
			->pluck(null, 'id')
			->toArray();
		$chat_grupos_id = collect($chat_grupos_raw)->pluck('id')->toArray();

		$messages = Chatmensajes::where('user_enviox_nid', $current_user)
			->orWhere('user_nid_destinatario', $current_user)
			->orderBy('chtm_nid', 'desc')
			->get()
			->unique(function ($item) {
				return $item['user_enviox_nid'].$item['user_nid_destinatario'];
			})
			->toArray();

		$chat_grupo_messages = \App\Models\ChatGrupoMensaje::whereIn('chat_grupo_id', $chat_grupos_id)
			->orderBy('id', 'desc')
			->get()
			->unique('chat_grupo_id')
			->toArray();


		foreach ($messages as $key => $item) {
			$another_user = ((int) $item['user_enviox_nid'] === $current_user)
				? (int) $item['user_nid_destinatario']
				: (int) $item['user_enviox_nid'];

			if (array_key_exists($another_user, $users_raw) && !array_key_exists($another_user, $users)) {
				$user_temp = $users_raw[$another_user];
				$user_temp['created_at'] = $item['chtm_dfechacrea'];
				$user_temp['tipo'] = 'chat';
				$users[$another_user] = $user_temp;
			}
		}

		foreach ($chat_grupo_messages as $key => $item) {
			$chat_grupo_id = $item['chat_grupo_id'];

			if (!array_key_exists($chat_grupo_id, $chat_grupos)) {
				$chat_grupo_temp = $chat_grupos_raw[$chat_grupo_id];
				$chat_grupo_temp['created_at'] = $item['created_at'];
				$chat_grupo_temp['tipo'] = 'chat_grupo';
				$chat_grupo_temp['mensajes_no_leidos'] = ChatGrupo::mensajesNoLeidos($chat_grupo_id, $current_user)['cantidad'];
				unset($chat_grupo_temp['pivot']);

				$chat_grupos[$chat_grupo_id] = $chat_grupo_temp;
			}
		}

		$chat_grupos_diff_raw = collect($chat_grupos_raw)->diffKeys($chat_grupos);
		$chat_grupos_diff = [];

		foreach ($chat_grupos_diff_raw->toArray() as $key => $item) {
			$chat_grupo_temp = $item;
			$chat_grupo_temp['tipo'] = 'chat_grupo';
			$chat_grupo_temp['mensajes_no_leidos'] = ChatGrupo::mensajesNoLeidos($item['id'], $current_user)['cantidad'];
			unset($chat_grupo_temp['pivot']);

			$chat_grupos_diff[] = $chat_grupo_temp;
			$chat_grupo_temp = [];
		}


		$chat_grupos = collect($chat_grupos)->merge($chat_grupos_diff);

		$users_diff_raw = collect(($users_raw))->diffKeys(($users));
		$users_diff = [];

		foreach ($users_diff_raw->toArray() as $key => $item) {
			$chat_grupo_temp = $item;
			$chat_grupo_temp['tipo'] = 'chat';

			$users_diff[] = $chat_grupo_temp;
			$chat_grupo_temp = [];
		}

		$users = collect($users)->merge($users_diff);

		$users = collect($users)->merge($chat_grupos)->sortByDesc('created_at')->values();

		return response()->json([
			'usuarios' => $users,
		]);
	}

	/**
	 * Cambia el permiso del usuario y verifica la contraseña
	 *
	 * @param Request $request
	 * @return void
	 */
	public function changePermission(Request $request)
	{
		$this->validate($request, [
			'id' => 'required',
			'permiso' => 'required',
			'password' => 'required',
		]);

		if(!($request->password==env('SUELDO_PASS', "123456")))
			return response()->json(['success' => false], 500);

		$usuario = Usuario::findOrFail($request->id);
		$usuario->permiso = $request->permiso;
		$usuario->save();

		return response()->json(['success' => true]);
	}

	/**
	 * Obtiene el usuario con su permiso de editar asistencias
	 *
	 * @param integer $id
	 * @return void Usuario
	 */
	public function getPermiso($id)
	{
		$usuario = Usuario::select(['id', 'usuario', 'activo', 'rol_id', 'permiso'])->findOrFail($id);

		return response()->json($usuario);
	}

  public function listActiveUsers()
	{
		$usuarios = Usuario::select(['id', 'usuario', 'nombre_completo'])
                      ->where('activo', 1)
                      ->orderBy('nombre_completo')
                      ->get();

		return response()->json(['usuarios' => $usuarios]);
	}

  public function changeVisiblePlanilla(Request $request, $id)
	{
		$this->validate($request, [
			'id'              => 'required|integer|exists:usuarios,id',
      		'visible_en_planilla' => 'required|integer|in:1,0',
		]);

		$usuario = Usuario::findOrFail($id);
		$usuario->visible_en_planilla = $request->visible_en_planilla;
		$usuario->save();

		return response()->json(['success' => true],200);
	}

  public function changeRangoUsuario(Request $request, $id)
	{
		$this->validate($request, [
			'id'       => 'required|integer|exists:usuarios,id',
      		'rango_id' => 'required|integer|exists:rangos,id',
		]);

		$usuario = Usuario::findOrFail($id);
		$usuario->rango_id = $request->rango_id;
		$usuario->save();

		return response()->json(['success' => true],200);
	}

	public function changeAfipUsuario(Request $request, $id)
	{
		$this->validate($request, [
			'id'       => 'required|integer|exists:usuarios,id',
      		'afip'      => 'required|integer|in:0,1',
		]);

		$usuario = Usuario::findOrFail($id);
		$usuario->afip = $request->afip;
		$usuario->save();

		return response()->json(['success' => true],200);
	}

}
