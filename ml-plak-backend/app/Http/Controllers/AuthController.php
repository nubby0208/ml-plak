<?php

namespace App\Http\Controllers;

use JWTAuth;
use Carbon\Carbon;
use App\Models\Usuario;
use App\Models\Session;
use App\Models\LoginLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Cookie;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
	public function __construct()
	{
		// $this->middleware('auth:api', ['except' => ['/login']]);
		//$this->middleware('auth:api');
	}

	public function login(Request $request)
	{
		// var_dump($request->input('username'), $request->input('password')); t();
		$this->validate($request, [
			'username' => 'required|string',
			'password' => 'required|string'
		]);

		$usuario = Usuario::where('usuario', $request->input('username'))->first();

		$token = '';
		// var_dump($usuario->count()); t();

		if (($usuario) && (Hash::check($request->input('password'), $usuario->password))) {
			// $custom_jwt = ['tst' => 'prueba'];
			if (!$token = JWTAuth::fromUser($usuario))
				return response()->json(['error' => 'invalid_credentials'], 401);
			$datetimelogin_attent = date('Y-m-d H:i');
			$store_session = $this->storesession($usuario, $datetimelogin_attent);
			$hasAsistencia = AsistenciaController::todayhasasistencia($usuario->id);
			$yet_login_today = $usuario->last_login_date ? !$usuario->last_login_date->isToday() : false;
			$usuario->last_login_date = Carbon::now()->format('Y-m-d');
			$usuario->save();



			$this->loginLog($usuario, $datetimelogin_attent, "login");
			
			return response()->json([
				'success' => true, 'data' => [
					'token' => $token,
					'usuario' => [
						'id' => $usuario->id,
						'usuario' => $usuario->usuario,
						'rol' => $usuario->rol->rol
					],
					'yet_login_today' => $yet_login_today,
					'hasasistencia' => $hasAsistencia
				]
			]);
		}

		return response()->json(['success' => false, 'error' => 'Invalid username/password!']);
	}
	public function checksession(Request $request)
	{

		$usuario = Session::where('usuario_id', $request->id)->first();

		if ($usuario) {
			$last_log = $usuario->lastlogin;
			$get_date = substr(date('Y-m-d H:i'), 0, 10);

			if ($last_log < $get_date) {
				return response()->json(['response' => 0]);
			} else {
				/**
				 * diferencial de hora
				 */
				$get_time = substr(date('Y-m-d H:i'), 11, 5);
				$time_in = $usuario->time_in;
				$diff = intval(substr($get_time, 0, 2)) - intval(substr($time_in, 0, 2));  //12-7 = 5 sale del sistema
				if ($diff > 4) {

					return response()->json(['response' => 0]);
				}
			}
		} else {
			print_r("entro");
			return response()->json(['response' => 0]);
		}

		return response()->json(['response' => 1]);
	}

	public function loginLog($user, $action_attent, $action)
	{

		$log = new loginLog;
		$data = [
			'user' => $user->usuario,
			'action' => $action,
			'date' => $action_attent,
			'time' => substr($action_attent, 11, 5)
		];
		$log->fill($data);
		if ($log->save()) {
			return true;
		} else {
			return false;
		}
	}
	public function storesession($user, $datetimelogin_attent)
	{

		$usuario = Session::where('usuario_id', $user->id)->first();
		if ($usuario) {

			$update = Session::where('usuario_id', $user->id)->update(
				[
					'lastlogin' => $datetimelogin_attent,
					'time_in' => substr($datetimelogin_attent, 11, 5)
				]
			);

			return true;
		}
		$session = new Session;

		$data = [
			'user' => $user->usuario,
			'usuario_id' => $user->id,
			'last_login' => $datetimelogin_attent,
			'time_in' => substr($datetimelogin_attent, 11, 5)
		];

		$session->fill($data);

		$session->save();

		return true;
	}

	public function logout(Request $request)
	{

		$usuario = Usuario::where('id', $request->id)->first();
		$datetimelogin_attent = date('Y-m-d H:i');
		//JWTAuth::invalidate($token);
		$this->loginLog($usuario, $datetimelogin_attent, "logout");

		return response()->json([
			'success' => true
		]);
	}

	public function get_rol()
	{
		$usuario = JWTAuth::parseToken()->authenticate();

		return response()->json(['rol' => $usuario->rol->rol]);
	}

	public function getlogs(Request $request)
	{
		$data = json_decode(json_encode($request->all()));
		$page = $data->page;
		$sortBy = $data->sortBy;
		$sortDesc = $data->sortDesc;
		$usuario = $data->searchParam;

		$logs = loginLog::when(
			$sortBy != "" && $sortBy != null,
			function ($query) use ($sortBy, $sortDesc) {
				$query->orderBy($sortBy, $sortDesc ? 'desc' : 'asc');
			}
		)->when(
			$usuario != '',
			function ($query) use ($usuario) {
				$query->where('user', 'LIKE', '%' . $usuario);
			}
		)->paginate(20, ['*'], 'page', $page);

		$pageLimit = ceil($logs->total() / 20);

		return response()->json([
			"data" => $logs,
		]);
	}
}
