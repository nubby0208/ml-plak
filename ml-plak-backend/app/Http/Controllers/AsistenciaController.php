<?php

namespace App\Http\Controllers;

use DateTime;
use DatePeriod;
use DateInterval;
use Carbon\Carbon;
use App\Models\Recibo;
use App\Models\Feriado;
use App\Models\Horario;
use App\Models\Usuario;
use App\Models\Asistencia;
use App\Models\TipoSalida;
use Illuminate\Http\Request;
use App\Models\UsuarioEstado;
use App\Models\TipoAsistencia;
use App\Models\AsistenciaCausa;
use App\Models\UsuariosHorario;
use App\Models\Inasistencia;
use Barryvdh\DomPDF\Facade as PDF;
use Illuminate\Support\Facades\Log;

class AsistenciaController extends Controller
{
	private $months = [
		'Mon' => 'Lunes',
		'Tue' => 'Martes',
		'Wed' => 'Miercoles',
		'Thu' => 'Jueves',
		'Fri' => 'Viernes',
		'Sat' => 'Sabado',
		'Sun' => 'Domingo',
	];

	public function __construct()
	{
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		//
	}

   /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function planilla($fecha)
    {

        $columnas = ["usuarios.nombre_completo as nombre","usuarios.cuit_cuil as cuit_cuil","aa.fecha as inicio","bb.fecha as fin"];
        $horarios = Usuario::query()
                            ->where("activo",1)
                            ->where("visible_en_planilla",1)
                            ->join('asistencias as aa', 'usuarios.id', '=', 'aa.usuario_id')
                            ->where('aa.tipo_asistencia_id',1)
                            ->whereDate("aa.fecha",$fecha)
                            ->leftJoin('asistencias as bb', function ($join) use ($fecha) {
								$join->on('usuarios.id', '=', 'bb.usuario_id')
								->where('bb.tipo_asistencia_id',2)
								->whereDate("bb.fecha",$fecha);
							})
                            ->orderBy("usuarios.nombre_completo")
                            ->get($columnas);

        $horarios = $horarios->map($this->mapTransformHorarios());
        return response()->json(['success' => true,'data' => $horarios],200);
    }

    private function mapTransformHorarios(): callable {
      return function ($horario, $key) {
            $horario['inicio'] = date_format(date_create($horario['inicio']),"H:i");
			if ($horario['fin'] !== null){
            	$horario['fin'] = date_format(date_create($horario['fin']),"H:i");
			}
			if ($horario['fin'] == null){
				$horario['fin'] = null;
			}	
        return $horario;
      };
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
		$rules = [
			'usuario' => 'required|exists:usuarios,usuario',
			'type'    => 'required|exists:tipos_asistencias,id',
		];
		$this->validate($request, $rules);

		$usuario = Usuario::where('usuario', $request->input('usuario'))->first();
		// Validar si hay asistencia hoy
		$today = date('Y-m-d');
		$asistenciasToday = Asistencia::where('fecha', 'like', '%'.$today.'%')
			->where('usuario_id', $usuario->id)
			->where('tipo_asistencia_id', $request->input('type'))->exists();

		if($asistenciasToday)
			return response()->json([
				'result' => false,
				'message' => 'Ya existe registro',
			], 422);

		$data = [
			'tipo_asistencia_id' => $request->input('type'),
			'fecha'              => date_format(new \Datetime(), 'Y-m-d H:i:s'),
			'usuario_id'         => $usuario->id,
			'horario_id'         => 1
		];

		if ((int) ($request->input('cause')) > 0) {
			$data['asistencia_causa_id'] = $request->input('cause');
		}

		if (strlen($request->input('tipo_salida')) > 0) {
			$data['tipo_salida_id'] = $request->input('tipo_salida');
		}

		if (strlen($request->input('observation')) > 0) {
			$data['observacion']    = $request->input('observation');
		}

		$asistencia = new Asistencia;
		$asistencia->fill($data);
		$result = $asistencia->save();

		return response()->json(['result' => $result]);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		//
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
		$this->validate($request, [
			'ajuste_hora' => 'integer',
		]);

		$data = $request->only(['ajuste_hora']);

		$asistencia = Asistencia::findOrFail($id);

		$asistencia->fill($data);
		$result = $asistencia->save();

		return response()->json(['result' => $result]);

	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		$asistencia = Asistencia::findOrFail($id);
		$result = $asistencia->delete();
		return response()->json(['result' => $result]);
	}

	/**
	 * Method use to verify the check of account google in the day
	 *
	 * @param Request $request
	 * @return array[json]
	 */
	public function check_time(Request $request)
	{
		$this->validate($request, [
			'usuario' => 'required|exists:usuarios,usuario'
		]);

		$today   = new \Datetime;
		$date    = $today->format('Y-m-d');
		$late    = false;
		$type    = '';
		$username = $request->input('usuario');
		$usuario = Usuario::where('usuario',$username)->firstOrFail();

		$period = $usuario->horario;
		if(is_null($period)){
			$period  = UsuariosHorario::where('is_default', true)->first();
		}

		// Check log of check in the day
		// $num_check = Usuario::where('correo_google', 'gustavoquero7@gmail.com')->first()
		$num_check = $usuario->asistencias()->where('fecha', 'like', '%'.$date.' %')
			->where('tipo_asistencia_id', 1)
			->count();

		$type = ($num_check === 0) ? 1 : 2;
		//var_dump($period);
		$late = $this->check_period($period, $type);

		return response()->json(['late' => $late, 'type' => $type]);
	}

	public function all_causes()
	{
		$causes = AsistenciaCausa::all();

		return response()->json(['causes' => $causes]);
	}

	public function checks_today(Request $request)
	{
		$this->validate($request, [
			'usuario' => 'required|exists:usuarios,usuario'
		]);

		$usuario = $request->input('usuario');
		$today   = new \Datetime;
		$date    = $today->format('Y-m-d');

		$usuario_id = Usuario::where('usuario', $usuario)->first()->id;

		$checks = Asistencia::where('usuario_id', $usuario_id)
			->with(['tipo_asistencia' => function ($query) {
				$query->select('id', 'tipo');
			}])
			->with(['tipo_salida' => function ($query) {
				$query->select('id', 'tipo');
			}])
			->where('fecha', 'like', '%'.$date.' %')
			->orderBy('fecha', 'asc')
			->get();

		return response()->json(['checks' => $checks]);
	}

	private function check_period(UsuariosHorario $horario, $type = 1)
	{
		$result = '';
		$today  = new \Datetime;
		$time   = strtotime($today->format('H:i:s').'+1 hour');
		$fecha   = strtotime($today->format('Y-m-d'));

		if (Feriado::where('fecha',$fecha)->count() > 0) {
			return false;
		}

		$day = $today->format('N');
		if ($type === 1) {
			switch ($day) {
				case 1:
					$result = ($horario->habilitado_lunes && ($time > strtotime($horario->hora_inicio_lunes)));
					break;

				case 2:
					$result = ($horario->habilitado_martes && ($time > strtotime($horario->hora_inicio_martes)));
					break;

				case 3:
					$result = ($horario->habilitado_miercoles && ($time > strtotime($horario->hora_inicio_miercoles)));
					break;

				case 4:
					$result = ($horario->habilitado_jueves && ($time > strtotime($horario->hora_inicio_jueves)));
					break;

				case 5:
					$result = ($horario->habilitado_viernes && ($time > strtotime($horario->hora_inicio_viernes)));
					break;

				case 6:
					$result = ($horario->habilitado_sabado && ($time > strtotime($horario->hora_inicio_sabado)));
					break;
			}

		} elseif ($type === 2) {
			switch ($day) {
				case 1:
					$result = ($horario->habilitado_lunes && ($time < strtotime($horario->hora_fin_lunes)));
					break;

				case 2:
					$result = ($horario->habilitado_martes && ($time < strtotime($horario->hora_fin_martes)));
					break;

				case 3:
					$result = ($horario->habilitado_miercoles && ($time < strtotime($horario->hora_fin_miercoles)));
					break;

				case 4:
					$result = ($horario->habilitado_jueves && ($time < strtotime($horario->hora_fin_jueves)));
					break;

				case 5:
					$result = ($horario->habilitado_viernes && ($time < strtotime($horario->hora_fin_viernes)));
					break;

				case 6:
					$result = ($horario->habilitado_sabado && ($time < strtotime($horario->hora_fin_sabado)));
					break;
			}
		}

		return $result;
	}

	public function get_by_usuario_fecha(Request $request)
	{
		$this->validate($request, [
			'usuario_id'   => 'required',
			'anio'    => 'required',
			'mes'    => 'required',
		]);


		$fecha_inicio = Carbon::create($request->anio, $request->mes)->startOfMonth()->format('Y-m-d');
		$fecha_fin = Carbon::create($request->anio, $request->mes)->endOfMonth()->format('Y-m-d');

		$data = $request->only(['usuario_id', 'fecha_inicio', 'fecha_fin']);
		$data['fecha_inicio'] = $fecha_inicio;
		$data['fecha_fin'] = $fecha_fin;

		$asistencia = new Asistencia();
		$todas_fechas = [];

		if ($data['usuario_id'] !== 0) {
			$asistencia = $asistencia->where('usuario_id', $data['usuario_id']);
			$usuario = Usuario::find($data['usuario_id']);
			$horas_extras = 0;
			if( $usuario->horario ){
				$horario[0] = $usuario->horario;
			}else{
				$horario_default = new UsuariosHorario();
				$horario_default = $horario_default->where('is_default', 1)->get();

				$horario = $horario_default;
			}
		}else{
			$usuario = new \stdClass;
			$usuario->id = 0;
			$usuario->usuario = '';
			$horario = UsuariosHorario::where('is_default', 1)->get();
		}

		$registros = $asistencia->whereDate('fecha', '>=', $fecha_inicio)
			->whereDate('fecha', '<=', $fecha_fin)
			// ->with(['asistencia_causa' => function ($query) {
			// 	$query->select('id', 'causa');
			// }])
			->with(['tipo_asistencia' => function ($query) {
				$query->select('id', 'tipo');
			}])
			// ->with(['tipo_salida' => function ($query) {
			// 	$query->select('id', 'tipo');
			// }])
			->with(['usuario' => function ($query) {
				$query->select('id', 'usuario');
			}])->orderBy('fecha', 'ASC')
			->get();

		//Calculos de hofras de trabajo y extras
		$horasTrabajadasReales = $this->calcularHorasTrabajadasReales($request->usuario_id,$request->anio, $request->mes);
		$horasDebidas = $this->calcularHorasDebidas($request->usuario_id,$request->anio, $request->mes);
		$horasInasistenciasJustificadas = $this->calcularHorasInasistenciasJustificadas($request->usuario_id,$request->anio, $request->mes);
		$horasTrabajadas = $horasDebidas - $horasInasistenciasJustificadas;
		$horasSabadoIngles = $this->calcularHorasSabadoIngles($request->usuario_id,$request->anio, $request->mes);
		$horasFeriadas = $this->calcularHorasFeriadas($request->usuario_id,$request->anio, $request->mes);
		//$horasInasistenciasInjustificadas = $this->calcularHorasInasistenciasInjustificadas($request->usuario_id,$request->anio, $request->mes);
		$horasInasistenciasInjustificadas = $horasDebidas - $horasInasistenciasJustificadas - $horasTrabajadasReales - $horasFeriadas;
		if ($horasInasistenciasInjustificadas < 0) {
			$horasInasistenciasInjustificadas = 0;
		}
		$horasExtras = $horasTrabajadasReales - $horasTrabajadas - $horasInasistenciasInjustificadas - $horasSabadoIngles;
		if ($horasExtras < 0) {
			$horasExtras = 0;
		}
		//-----------------------------------------
		$minutes = 0;
		$months = [
			'Mon' => 'Lunes',
			'Tue' => 'Martes',
			'Wed' => 'Miercoles',
			'Thu' => 'Jueves',
			'Fri' => 'Viernes',
			'Sat' => 'Sabado',
			'Sun' => 'Domingo',
		];

		$registros->transform(function ($r, $key) use ($months) {
			$d = new DateTime($r->fecha);
			$r->dia = $months[$d->format('D')];

			return $r;
		});

		$actual = new Datetime($data['fecha_inicio']);
		$anioActual = $actual->format("Y");
		$mesActual = $actual->format("n");

		$diasMes = cal_days_in_month(CAL_GREGORIAN, $mesActual, $anioActual);

		$feriados = Feriado::whereMonth('fecha', $actual->format('m'))->count();

		$diasLaborados = $registros->map(function ($item) {
			$item->fechaDia = (new DateTime($item->fecha))->format('Y-m-d');
			$item->cert_medico = false;
			return $item;
		})->unique('fechaDia')->count();

		$diasLaborables = $diasMes - $feriados;

		$begin = new DateTime($fecha_inicio);
		$end = new DateTime($fecha_fin);
		$end = $end->modify( '+1 day' );
		$interval = DateInterval::createFromDateString('1 day');
		$period = new DatePeriod($begin, $interval, $end);

		foreach ($period as $dt) {
			$certMedico = false;
			$inasistenciaCount = Inasistencia::where('usuario_id',$usuario->id )
										->whereDate('fecha1','<=',$dt->format("Y-m-d"))
										->whereDate('fecha2','>=',$dt->format("Y-m-d"))
										->count();
			$feriadoCount = Feriado::whereDate('fecha', $dt->format("Y-m-d"))->count();
			$usuariosHorario = UsuariosHorario::where('usuario_id', $usuario->id)->first();
			if (empty($usuariosHorario)===true) {
				$usuariosHorario = UsuariosHorario::where('id',1)->where('is_default',1)->first();
			}
			if (($inasistenciaCount > 0) && ($feriadoCount == 0)) {
				$weekday = $months[$dt->format("D")];
				switch ($weekday)  {
					case 'Domingo':
						if ($usuariosHorario->habilitado_domingo === 1) {
							$certMedico = true;
						}
						break;
					case 'Lunes':
						if ($usuariosHorario->habilitado_lunes === 1) {
							$certMedico = true;
						}
						break;
					case 'Martes':
						if ($usuariosHorario->habilitado_martes === 1) {
							$certMedico = true;
						}
						break;
					case 'Miercoles':
						if ($usuariosHorario->habilitado_miercoles === 1) {
							$certMedico = true;
						}
						break;
					case 'Jueves':
						if ($usuariosHorario->habilitado_jueves === 1) {
							$certMedico = true;
						}
						break;
					case 'Viernes':
						if ($usuariosHorario->habilitado_viernes === 1) {
							$certMedico = true;
						}
						break;
					case 'Sabado':
						if ($usuariosHorario->habilitado_sabado === 1) {
							$certMedico = true;
						}
						break;
				}
			}	
						
			array_push($todas_fechas, [
				'id' => null,
				'usuario_id' => $usuario->id,
				'fecha' => $dt->format("Y-m-d"),
				'fechaDia' => $dt->format("Y-m-d"),
				'cert_medico' => $certMedico,
				'observacion' => null,
				'horario_id' => 1,
				'dia' => $months[$dt->format("D")],
				'asistencia_causa_id' => null,
				'tipo_asistencia_id' => 1,
				'tipo_salida_id' => null,
				'asistencia_causa' => null,
				'tipo_asistencia' => ['id' => 0, "tipo" => "---"],
				"tipo_salida" => null,
				'usuario' => ['id' => $usuario->id, 'usuario' => $usuario->usuario]
			]);
			if(!$horario[0]->habilitado(strtolower($months[$dt->format("D")]))) {
				$diasLaborables--;
			}
			$isFeriado = Feriado::whereMonth('fecha', $actual->format('m'))->whereDay('fecha', $dt->format("d"))->exists();
		}
		$registros = $registros->map($this->mapProcessReg());
			
		$todas_fechas = collect($todas_fechas)->concat($registros);

		$todas_fechas = $todas_fechas->all();
		
		usort($todas_fechas, function($a1, $a2) {
			$v1 = strtotime($a1['fecha']);
			$v2 = strtotime($a2['fecha']);
			return $v1 - $v2; // $v2 - $v1 to reverse direction
		});

		$horasDias = collect($months)->map(function($item) use ($horario) {
			return $horario[0]->hoursByDay(strtolower($item));
		});

		$recibo_id = Recibo::firstOrNew([
            'usuario_id' => $request->usuario_id,
            'mes' => $request->mes,
            'anio' => $request->anio,
        ],[])->id;

		if( $usuario->id > 0 ){
			return response()->json([
				'asistencias' => $todas_fechas,
				'faltas_justificadas' => $horasInasistenciasJustificadas,
				'faltas_injustificadas' => $horasInasistenciasInjustificadas,
				'horas_debidas' => $horasDebidas,
				'horas_trabajadas' => $horasTrabajadas,
				'horas_trabajadas_reales' => $horasTrabajadasReales,
				'horas_extras' => $horasExtras,
				'horas_sabado_ingles' => $horasSabadoIngles,
				'horas_feriadas' => $horasFeriadas,
				'feriados' => $feriados,
				'dias_laborables' => $diasLaborables,
				'dias_laborados' => $diasLaborados,
				'horas_dias' => $horasDias,
				'recibo_id' => $recibo_id,				
			]);
		}else{
			return response()->json(['asistencias' => $todas_fechas]);
		}

	}

	private function calcularHorasFeriadas($usuarioId,$anno,$mes) {
		$fechaInicio = Carbon::create($anno, $mes)->startOfMonth()->format('Y-m-d');
		$fechaFin = Carbon::create($anno, $mes)->endOfMonth()->format('Y-m-d');

		$registros = Feriado::whereDate('fecha', '>=', $fechaInicio)
			->whereDate('fecha', '<=', $fechaFin)
			->get();

		$horas=collect([]);	
		$horas = $registros->map($this-> mapProcessHorasFeriadas($usuarioId));
		
		if ($horas->count() === 0) {
			return 0;
		}
		return $horas->sum();

	}

	private function mapProcessHorasFeriadas($usuarioId): callable {
		return function ($reg, $key) use($usuarioId) {

			$usuariosHorario = UsuariosHorario::where('usuario_id', $usuarioId)->first();
			if (empty($usuariosHorario)===true) {
				$usuariosHorario = UsuariosHorario::where('id',1)->where('is_default',1)->first();
			}
			$weekday = $this->months[Carbon::parse($reg->fecha)->format("D")];
			$fecha = Carbon::parse($reg->fecha)->format('Y-m-d');
			$horaInicio = Carbon::parse($fecha);
			$horaFin = "";
			switch ($weekday)  {
				case 'Domingo':
					if ($usuariosHorario->habilitado_domingo === 1) {
						$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_domingo);
						$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_domingo);
					}
					break;
				case 'Lunes':
					if ($usuariosHorario->habilitado_lunes === 1) {
						$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_lunes);
						$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_lunes);
					}
					break;
				case 'Martes':
					if ($usuariosHorario->habilitado_martes === 1) {
						$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_martes);
						$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_martes);
					}
					break;
				case 'Miercoles':
					if ($usuariosHorario->habilitado_miercoles === 1) {
						$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_miercoles);
						$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_miercoles);
					}
					break;
				case 'Jueves':
					if ($usuariosHorario->habilitado_jueves === 1) {
						$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_jueves);
						$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_jueves);
					}
					break;
				case 'Viernes':
					if ($usuariosHorario->habilitado_viernes === 1) {
						$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_viernes);
						$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_viernes);
					}
					break;
				case 'Sabado':
					if ($usuariosHorario->habilitado_sabado === 1) {
						$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_sabado);
						$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_sabado);
					}
					break;
			}
			if (empty($horaFin) === true) {
				return 0;
			}	
			$minutos = $horaInicio->diffInMinutes($horaFin, false);
			$horas = (int)(round($minutos / 60));
			if ($horas < 0) {
				$horas = 0;
			} 
			return $horas; 
		};
	}

	private function calcularHorasSabadoIngles($usuarioId,$anno,$mes) {
		$fechaInicio = Carbon::create($anno, $mes)->startOfMonth()->format('Y-m-d');
		$fechaFin = Carbon::create($anno, $mes)->endOfMonth()->format('Y-m-d');

		$horas=collect([]);
		$fecha = $fechaInicio;
		for(;$fecha <= $fechaFin;) {
			$hora = $this->processHorasSabadoIngles($fecha,$usuarioId);
			$horas->push($hora);
			$fecha = Carbon::parse($fecha)->addDay()->format('Y-m-d');
		}

		if ($horas->count() === 0) {
			return 0;
		}
		return $horas->sum();

	}

	private function processHorasSabadoIngles($fecha,$usuarioId) {
		
		$horaInicio = null;
		$horaFin = null;
		$usuariosHorario = UsuariosHorario::where('usuario_id', $usuarioId)->first();
		if (empty($usuariosHorario)===true) {
			$usuariosHorario = UsuariosHorario::where('id',1)->where('is_default',1)->first();
		}
		$weekday = $this->months[Carbon::parse($fecha)->format("D")];
		$fecha = Carbon::parse($fecha)->format('Y-m-d');
		$isFeriado = Feriado::whereDate('fecha', $fecha)->exists();
		if (($isFeriado === true) || ($weekday === 'Sabado')) {
			$asistencia = Asistencia::whereDate('fecha', $fecha)
					->where('tipo_asistencia_id',1)
					->where('usuario_id',$usuarioId)
					->first();
			if 	($asistencia !== null) {
				$horaInicio = Carbon::parse($asistencia->fecha);
				$asistencia2 = Asistencia::whereDate('fecha', $fecha)
					->where('tipo_asistencia_id',2)
					->where('usuario_id',$usuarioId)
					->first();	
				if 	($asistencia2 !== null) {	
					$horaFin = Carbon::parse($asistencia->fecha);	
				}	
			}
		}		

		if (($horaInicio !== null) && ($horaFin === null)) {
			switch ($weekday)  {
				case 'Domingo':
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_domingo);
					break;
				case 'Lunes':
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_lunes);
					break;
				case 'Martes':
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_martes);
					break;
				case 'Miercoles':
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_miercoles);
					break;
				case 'Jueves':
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_jueves);
					break;
				case 'Viernes':
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_viernes);
					break;
				case 'Sabado':
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_sabado);
					break;
			}
		}

		if (($horaInicio === null) && ($horaFin === null)) {
			return 0;
		}
		$minutos = $horaInicio->diffInMinutes($horaFin, false);
		if (($isFeriado === false) && ($weekday === 'Sabado')) {
			$horaInicioSab =  Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_sabado);
			$horaFinSab =  Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_sabado);
			$minutosSab = $horaInicioSab->diffInMinutes($horaFinSab, false);
			$minutos -= $minutosSab;
		}
		$horas = (int)(round($minutos / 60));
		
		if ($horas < 0) {
			$horas = 0;
		} 
		return $horas; 
	}

	private function calcularHorasInasistenciasInjustificadas($usuarioId,$anno,$mes) {
		$fechaInicio = Carbon::create($anno, $mes)->startOfMonth()->format('Y-m-d');
		$fechaFin = Carbon::create($anno, $mes)->endOfMonth()->format('Y-m-d');

		$horas=collect([]);
		$fecha = $fechaInicio;
		for(;$fecha <= $fechaFin;) {
			$hora = $this->processHorasInasistenciasInjustificadas($fecha,$usuarioId);
			$horas->push($hora);
			$fecha = Carbon::parse($fecha)->addDay()->format('Y-m-d');
		}

		if ($horas->count() === 0) {
			return 0;
		}
		return $horas->sum();

	}

	private function processHorasInasistenciasInjustificadas($fecha,$usuarioId) {
		
		$horaInicio = Carbon::parse($fecha);
		$horaFin = "";
		$usuariosHorario = UsuariosHorario::where('usuario_id', $usuarioId)->first();
		if (empty($usuariosHorario)===true) {
			$usuariosHorario = UsuariosHorario::where('id',1)->where('is_default',1)->first();
		}
		$weekday = $this->months[Carbon::parse($fecha)->format("D")];
		$fecha = Carbon::parse($fecha)->format('Y-m-d');
		switch ($weekday)  {
			case 'Domingo':
				if ($usuariosHorario->habilitado_domingo === 1) {
					$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_domingo);
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_domingo);
				}
				break;
			case 'Lunes':
				if ($usuariosHorario->habilitado_lunes === 1) {
					$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_lunes);
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_lunes);
				}
				break;
			case 'Martes':
				if ($usuariosHorario->habilitado_martes === 1) {
					$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_martes);
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_martes);
				}
				break;
			case 'Miercoles':
				if ($usuariosHorario->habilitado_miercoles === 1) {
					$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_miercoles);
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_miercoles);
				}
				break;
			case 'Jueves':
				if ($usuariosHorario->habilitado_jueves === 1) {
					$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_jueves);
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_jueves);
				}
				break;
			case 'Viernes':
				if ($usuariosHorario->habilitado_viernes === 1) {
					$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_viernes);
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_viernes);
				}
				break;
			case 'Sabado':
				if ($usuariosHorario->habilitado_sabado === 1) {
					$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_sabado);
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_sabado);
				}
				break;
		}
		if (empty($horaFin) === true) {
			return 0;
		}	
		$minutos = $horaInicio->diffInMinutes($horaFin, false);
		$horas = (int)(round($minutos / 60));
		if ($horas > 0) {
			$isFeriado = Feriado::whereDate('fecha', $fecha)->exists();
			if ($isFeriado === true) {
				return 0;
			}
			$asistenciaCount = Asistencia::whereDate('fecha', $fecha)
				->where('tipo_asistencia_id',1)
				->where('usuario_id',$usuarioId)
				->count();
			if ($asistenciaCount > 0) {
				return 0;
			}	
		}
		if ($horas < 0) {
			$horas = 0;
		} 
		return $horas; 
	}

	private function calcularHorasInasistenciasJustificadas($usuarioId,$anno,$mes) {
		$fechaInicio = Carbon::create($anno, $mes)->startOfMonth()->format('Y-m-d');
		$fechaFin = Carbon::create($anno, $mes)->endOfMonth()->format('Y-m-d');

		$registros = Asistencia::whereDate('fecha', '>=', $fechaInicio)
			->whereDate('fecha', '<=', $fechaFin)
			->where('tipo_asistencia_id',1)
			->where('justificacion',1)
			->where('usuario_id',$usuarioId)->orderBy('fecha', 'ASC')
			->get();

		$horas=collect([]);	
		$horas = $registros->map($this-> mapProcessHorasInasistenciasJustificadas($usuarioId));
		//dd("HorasInasisTjus: ", $horas);
		if ($horas->count() === 0) {
			return 0;
		}
		return $horas->sum();

	}

	private function mapProcessHorasInasistenciasJustificadas($usuarioId): callable {
		return function ($reg, $key) use($usuarioId) {

			$usuariosHorario = UsuariosHorario::where('usuario_id', $usuarioId)->first();
			if (empty($usuariosHorario)===true) {
				$usuariosHorario = UsuariosHorario::where('id',1)->where('is_default',1)->first();
			}
			$weekday = $this->months[Carbon::parse($reg->fecha)->format("D")];
			$fecha = Carbon::parse($reg->fecha)->format('Y-m-d');
			$horaInicio = Carbon::parse($reg->fecha);
			$horaFin = null;
			switch ($weekday)  {
				case 'Domingo':
					if ($usuariosHorario->habilitado_domingo === 1) {
						$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_domingo);
					}
					break;
				case 'Lunes':
					if ($usuariosHorario->habilitado_lunes === 1) {
						$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_lunes);
					}
					break;
				case 'Martes':
					if ($usuariosHorario->habilitado_martes === 1) {
						$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_martes);
					}
					break;
				case 'Miercoles':
					if ($usuariosHorario->habilitado_miercoles === 1) {
						$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_miercoles);
					}
					break;
				case 'Jueves':
					if ($usuariosHorario->habilitado_jueves === 1) {
						$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_jueves);
					}
					break;
				case 'Viernes':
					if ($usuariosHorario->habilitado_viernes === 1) {
						$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_viernes);
					}
					break;
				case 'Sabado':
					if ($usuariosHorario->habilitado_sabado === 1) {
						$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_sabado);
					}
					break;
			}
			if (empty($horaFin) === true) {
				return 0;
			}	
			$minutos = $horaInicio->diffInMinutes($horaFin, false);
			$horas = (int)(round($minutos / 60));
			if ($horas < 0) {
				$horas = 0;
			} 
			return $horas; 
		};
	}

	private function calcularHorasDebidas($usuarioId,$anno,$mes) {
		$fechaInicio = Carbon::create($anno, $mes)->startOfMonth()->format('Y-m-d');
		$fechaFin = Carbon::create($anno, $mes)->endOfMonth()->format('Y-m-d');

		$horas=collect([]);
		$fecha = $fechaInicio;
		for(;$fecha <= $fechaFin;) {
			$hora = $this->processHorasDebidas($fecha,$usuarioId);
			$horas->push($hora);
			$fecha = Carbon::parse($fecha)->addDay()->format('Y-m-d');
		}

		if ($horas->count() === 0) {
			return 0;
		}
		return $horas->sum();

	}

	private function processHorasDebidas($fecha,$usuarioId) {
		
		$horaInicio = Carbon::parse($fecha);
		$horaFin = "";
		$usuariosHorario = UsuariosHorario::where('usuario_id', $usuarioId)->first();
		if (empty($usuariosHorario)===true) {
			$usuariosHorario = UsuariosHorario::where('id',1)->where('is_default',1)->first();
		}
		$weekday = $this->months[Carbon::parse($fecha)->format("D")];
		$fecha = Carbon::parse($fecha)->format('Y-m-d');
		switch ($weekday)  {
			case 'Domingo':
				if ($usuariosHorario->habilitado_domingo === 1) {
					$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_domingo);
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_domingo);
				}
				break;
			case 'Lunes':
				if ($usuariosHorario->habilitado_lunes === 1) {
					$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_lunes);
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_lunes);
				}
				break;
			case 'Martes':
				if ($usuariosHorario->habilitado_martes === 1) {
					$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_martes);
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_martes);
				}
				break;
			case 'Miercoles':
				if ($usuariosHorario->habilitado_miercoles === 1) {
					$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_miercoles);
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_miercoles);
				}
				break;
			case 'Jueves':
				if ($usuariosHorario->habilitado_jueves === 1) {
					$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_jueves);
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_jueves);
				}
				break;
			case 'Viernes':
				if ($usuariosHorario->habilitado_viernes === 1) {
					$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_viernes);
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_viernes);
				}
				break;
			case 'Sabado':
				if ($usuariosHorario->habilitado_sabado === 1) {
					$horaInicio = Carbon::parse($fecha . " " . $usuariosHorario->hora_inicio_sabado);
					$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_sabado);
				}
				break;
		}
		if (empty($horaFin) === true) {
			return 0;
		}		
		$minutos = $horaInicio->diffInMinutes($horaFin, false);
		$horas = (int)(round($minutos / 60));
		if ($horas < 0) {
			$horas = 0;
		} 
		return $horas; 
	}

	private function calcularHorasTrabajadasReales($usuarioId,$anno,$mes) {
		$fechaInicio = Carbon::create($anno, $mes)->startOfMonth()->format('Y-m-d');
		$fechaFin = Carbon::create($anno, $mes)->endOfMonth()->format('Y-m-d');

		$registros = Asistencia::whereDate('fecha', '>=', $fechaInicio)
			->whereDate('fecha', '<=', $fechaFin)
			->where('tipo_asistencia_id',1)
			->where('usuario_id',$usuarioId)
			->where(function ($query) {
				$query = $query->orWhereNull('justificacion');
				$query = $query->orWhere('justificacion',0);
			  })
			->orderBy('fecha', 'ASC')
			->get();

		$horas=collect([]);	
		$horas = $registros->map($this->mapProcessHorasTrabajadasReales($usuarioId));

		if ($horas->count() === 0) {
			return 0;
		}
		return $horas->sum();

	}

	private function mapProcessHorasTrabajadasReales($usuarioId): callable {
		return function ($reg, $key) use($usuarioId) {
			return $this->calcularHorasTrabajadasDiarias($reg->fecha, $reg->ajuste_hora, $usuarioId);
		};
	}
	
	private function calcularHorasTrabajadasDiarias($regFecha, $regAjusteHora, $usuarioId ,$incluirAjuste = true) {
			$horaInicio = Carbon::parse($regFecha);
			$horaFin = "";
			$horaAjusteEntrada = 0;
			$horaAjusteSalida = 0;
			if ($regAjusteHora !== null) {
				$horaAjusteEntrada = $regAjusteHora;
			}
			$asistenciaSalida = Asistencia::whereDate('fecha', Carbon::parse($regFecha)->format('Y-m-d'))
				->where('tipo_asistencia_id',2)
				->where('usuario_id',$usuarioId)
				->where(function ($query) {
					$query = $query->orWhereNull('justificacion');
					$query = $query->orWhere('justificacion',0);
				  })
				->first();
				
			if (empty($asistenciaSalida) === false)	{
				$horaFin = Carbon::parse($asistenciaSalida->fecha);	
				if ($asistenciaSalida->ajuste_hora !== null) {
					$horaAjusteSalida = $asistenciaSalida->ajuste_hora;
				}
			}
			if (empty($asistenciaSalida) === true) {
				$usuariosHorario = UsuariosHorario::where('usuario_id', $usuarioId)->first();
				$usuariosHorarioDefault = UsuariosHorario::where('id',1)->where('is_default',1)->first();
				if (empty($usuariosHorario)===true) {
					$usuariosHorario = $usuariosHorarioDefault;
				}
				$weekday = $this->months[Carbon::parse($regFecha)->format("D")];
				$fecha = Carbon::parse($regFecha)->format('Y-m-d');
				switch ($weekday)  {
					case 'Domingo':
						if ($usuariosHorario->habilitado_domingo === 1) {
							$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_domingo);
							break;
						}
						if ($usuariosHorarioDefault->habilitado_domingo === 1) {
							$horaFin = Carbon::parse($fecha . " " . $usuariosHorarioDefault->hora_fin_domingo);	
						    break;
						}
						break;
					case 'Lunes':
						if ($usuariosHorario->habilitado_lunes === 1) {
							$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_lunes);
							break;
						}
						if ($usuariosHorarioDefault->habilitado_lunes === 1) {
							$horaFin = Carbon::parse($fecha . " " . $usuariosHorarioDefault->hora_fin_lunes);
							break;
						}
						break;
					case 'Martes':
						if ($usuariosHorario->habilitado_martes === 1) {
							$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_martes);
							break;
						}
						if ($usuariosHorarioDefault->habilitado_martes === 1) {
							$horaFin = Carbon::parse($fecha . " " . $usuariosHorarioDefault->hora_fin_martes);
							break;
						}
						break;
					case 'Miercoles':
						if ($usuariosHorario->habilitado_miercoles === 1) {
							$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_miercoles);
							break;
						}
						if ($usuariosHorarioDefault->habilitado_miercoles === 1) {
							$horaFin = Carbon::parse($fecha . " " . $usuariosHorarioDefault->hora_fin_miercoles);
							break;
						}
						break;
					case 'Jueves':
						if ($usuariosHorario->habilitado_jueves === 1) {
							$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_jueves);
							break;
						}
						if ($usuariosHorarioDefault->habilitado_jueves === 1) {
							$horaFin = Carbon::parse($fecha . " " . $usuariosHorarioDefault->hora_fin_jueves);
							break;
						}
						break;
					case 'Viernes':
						if ($usuariosHorario->habilitado_viernes === 1) {
							$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_viernes);
							break;
						}
						if ($usuariosHorarioDefault->habilitado_viernes === 1) {
							$horaFin = Carbon::parse($fecha . " " . $usuariosHorarioDefault->hora_fin_viernes);
							break;
						}
						break;
					case 'Sabado':
						if ($usuariosHorario->habilitado_sabado === 1) {
							$horaFin = Carbon::parse($fecha . " " . $usuariosHorario->hora_fin_sabado);
							break;
						}
						if ($usuariosHorarioDeafult->habilitado_sabado === 1) {
							$horaFin = Carbon::parse($fecha . " " . $usuariosHorarioDefault->hora_fin_sabado);
							break;
						}
						break;
				}

			}	

			if (empty($horaFin) === true) {
				return 0;
			}
			$minutos = $horaInicio->diffInMinutes($horaFin, false);
			$horas = (int)(round($minutos / 60));
			if ($incluirAjuste === true) {
				$horas += $horaAjusteEntrada + $horaAjusteSalida;
			}
			if ($horas < 0) {
				$horas = 0;
			} 			
			return $horas;
	}

	private function mapProcessReg(): callable {
		$months = [
			'Mon' => 'Lunes',
			'Tue' => 'Martes',
			'Wed' => 'Miercoles',
			'Thu' => 'Jueves',
			'Fri' => 'Viernes',
			'Sat' => 'Sabado',
			'Sun' => 'Domingo',
		];
        return function ($reg, $key) use($months) {
			$horasTrabajadasDiarias = 0;
			if ($reg->tipo_asistencia_id === 1) {
				$horasTrabajadasDiarias = $this->calcularHorasTrabajadasDiarias($reg['fecha'], $reg['ajuste_hora'], $reg['usuario_id'], true);	
			}
			$reg['horas_trabajadas_diarias'] = $horasTrabajadasDiarias;	
			$certMedico = false;
			$inasistenciaCount = Inasistencia::where('usuario_id',$reg['usuario_id'])
										->whereDate('fecha1','<=',(new DateTime($reg['fechaDia']))->format("Y-m-d"))
										->whereDate('fecha2','>=',(new DateTime($reg['fechaDia']))->format("Y-m-d"))
										->count();
			$feriadoCount = Feriado::whereDate('fecha', (new DateTime($reg['fechaDia']))->format("Y-m-d"))->count();
			if (($inasistenciaCount > 0) && ($feriadoCount == 0)) {
				$usuariosHorario = UsuariosHorario::where('usuario_id', $reg['usuario_id'])->first();
				if (empty($usuariosHorario)===true) {
					$usuariosHorario = UsuariosHorario::where('id',1)->where('is_default',1)->first();
				}
				$weekday = $months[(new DateTime($reg['fechaDia']))->format("D")];
				switch ($weekday)  {
					case 'Domingo':
						if ($usuariosHorario->habilitado_domingo === 1) {
							$certMedico = true;
						}
						break;
					case 'Lunes':
						if ($usuariosHorario->habilitado_lunes === 1) {
							$certMedico = true;
						}
						break;
					case 'Martes':
						if ($usuariosHorario->habilitado_martes === 1) {
							$certMedico = true;
						}
						break;
					case 'Miercoles':
						if ($usuariosHorario->habilitado_miercoles === 1) {
							$certMedico = true;
						}
						break;
					case 'Jueves':
						if ($usuariosHorario->habilitado_jueves === 1) {
							$certMedico = true;
						}
						break;
					case 'Viernes':
						if ($usuariosHorario->habilitado_viernes === 1) {
							$certMedico = true;
						}
						break;
					case 'Sabado':
						if ($usuariosHorario->habilitado_sabado === 1) {
							$certMedico = true;
						}
						break;
				}	
			}	
			$reg['cert_medico'] = $certMedico;	
            return $reg;
        };
    }

	private function includeUsuarioEstados($array, $data)
	{
		$query = UsuarioEstado::query();

		$query->whereDate('fecha_creacion', '>=', $data['fecha_inicio'])
			->whereDate('fecha_creacion', '<=', $data['fecha_fin']);

		if ($data['usuario_id'] > 0) {
			$query->where('usuario_id', $data['usuario_id']);
		}

		$estados = $query->with(['tipo_asistencia' => function ($query) {
			$query->select('id', 'tipo');
		}])
		->with(['usuario' => function ($query) {
			$query->select('id', 'usuario');
		}])
		->orderBy('id', 'DESC')
		->get();

		foreach ($estados as $estado) {

			$array[] = [
				'id' => null,
				'usuario_id' => $estado->usuario->id,
				'fecha' => $estado->fecha_creacion,
				'observacion' => $estado->mensaje,
				'horario_id' => 1,
				'dia' => '',
				'asistencia_causa_id' => null,
				'tipo_asistencia_id' => 1,
				'tipo_salida_id' => null,
				'asistencia_causa' => null,
				'tipo_asistencia' => ['id' => 1, "tipo" => "Estado"],
				"tipo_salida" => null,
				'usuario' => ['id' => $estado->usuario->id, 'usuario' => $estado->usuario->usuario]
			];
		}

		return $array;
	}

	public function get_tipos_asistencias()
	{
		$tipos_asistencias = TipoAsistencia::where('show','==','0')->get();

		return response()->json(['tipos_asistencias' => $tipos_asistencias->toArray()]);
	}

	public function get_tipos_salidas()
	{
		$tipos_salidas = TipoSalida::all();

		return response()->json(['tipos_salidas' => $tipos_salidas->toArray()]);
	}

	public function pdf(Request $r){

		$data = (object) $r->data;
		//print_r($data); exit();
		$name = uniqid();

		PDF::setOptions(['dpi' => 150, 'defaultFont' => 'sans-serif', ]);

		$pdf = PDF::loadView('pdf.index', compact('data'));

		\Storage::put('/public/pdf/'.$name.'.pdf', $pdf->output());

		/*return response()->json([
			'path' => storage_path().'/pdf/'.$name.'.pdf'
		], 200);*/
		return response()->json([
			'path' => url("/pdf/$name.pdf")
		], 200);
	}

	public function horas_extras($fecha, $dia, $inicio, $horario, $old_date, $last_type, $actual_type){
		$minutes = 0;
		$horas_extras = 0;
		$dia_contado = false;
		$d = new DateTime($fecha);
		if( ( $old_date == $d->format('Y-m-d') && $last_type != $actual_type) || ( $old_date != $d->format('Y-m-d') )){
			$dia_contado = true;

			// "2020-03-10 09:56:00"
			$hora_entrada = new DateTime(date("H:i:s",strtotime($fecha)));
			$hora_entrada_horario = new DateTime(date("H:i:s",strtotime($inicio)));

			$diff = $hora_entrada_horario->diff($hora_entrada);

			if ( $horario[0]->habilitado_.strtolower($dia) ){

				switch( $actual_type ){
					case  'Ingreso':

						switch($diff->invert){
							case 0:
								$h = $diff->h;
								$m = $diff->i;

								//$horas_extras -= "$h.$m";
								$horas_extras = -$h;
								$minutes = -$m;
							break;

							case 1:
								$h = $diff->h;
								$m = $diff->i;

								//$horas_extras += "$h.$m";
								$horas_extras = $h;
								$minutes = $m;
							break;
						}

						break;
					case  'Salida':
						switch($diff->invert){
							case 0:
								$h = $diff->h;
								$m = $diff->i;

								//$horas_extras += "$h.$m";

								$horas_extras = $h;
								$minutes = $m;
							break;

							case 1:
								$h = $diff->h;
								$m = $diff->i;

								//$horas_extras -= "$h.$m";
								$horas_extras = -$h;
								$minutes = -$m;
							break;
						}
						break;
				}

			}

		}
		/*
		$hoy =  $hora_entrada->format('H:i:s');
		$horario = $hora_entrada_horario->format('H:i:s');
		var_dump("$actual_type - hora: $hoy horario: $horario | horas: $diff->h | Minutos: $diff->i | horas extras: $horas_extras $minutes");
		*/
		return ['horas_extras' => $horas_extras, 'dia_contado' => $dia_contado, 'minutes' => $minutes];
	}

	public function round_min($horas_extras)
	{
		$tiempo = explode('.', $horas_extras);
		$min = $tiempo[1];
		$hr = $tiempo[0];

		$round = round($min/60, 2);
		$new = explode('.', $round);

		//$r = implode(".", $tiempo);
		$hr = $hr + $new[0];
		$min = $min - ($new[0]*60);
		//var_dump($hr); exit();
		return "$hr.$min";
	}

	public function justify(Request $request)
	{
		$this->validate($request, [
			'usuario_id' => 'required',
			'fecha' => 'required',
			'horario_id' => 'required'
		]);

		$data = $request->only(['usuario_id', 'fecha', 'horario_id','observacion']);
		$horario = UsuariosHorario::where('usuario_id', $request->usuario_id)->first();
		if(!$horario)
			$horario = UsuariosHorario::where('is_default', 1)->first();

		$days = [
			'Mon' => 'Lunes',
			'Tue' => 'Martes',
			'Wed' => 'Miercoles',
			'Thu' => 'Jueves',
			'Fri' => 'Viernes',
			'Sat' => 'Sabado',
			'Sun' => 'Domingo',
		];
		$day = strtolower($days[date_format(new \Datetime($request->fecha), 'D')]);

		$data['tipo_asistencia_id'] = 1;
		$data['justificacion'] = true;
		$data['fecha'] = date_format(new \Datetime($request->fecha), 'Y-m-d') . ' ' . $horario->getHoraInicio($day);

		$asistencia = new Asistencia;
		$asistencia->fill($data);
		$result = $asistencia->save();
		return response()->json(['result' => $result]);
	}

	public function force(Request $request)
	{
		$tipos = $request->tipo;
		$horario = UsuariosHorario::where('usuario_id', $request->usuario_id)->first();
		if(!$horario)
			$horario = UsuariosHorario::where('is_default', 1)->first();

		$days = [
			'Mon' => 'Lunes',
			'Tue' => 'Martes',
			'Wed' => 'Miercoles',
			'Thu' => 'Jueves',
			'Fri' => 'Viernes',
			'Sat' => 'Sabado',
			'Sun' => 'Domingo',
		];
		$day = strtolower($days[date_format(new \Datetime($request->fecha), 'D')]);

		if(count($tipos)==1&&in_array('Ingreso', $tipos)) {
			// Solo hay ingreso

			$data = [
				'tipo_asistencia_id' => 2,
				'fecha'              => date_format(new \Datetime($request->fecha), 'Y-m-d') . ' ' . $horario->getHoraFin($day),
				'usuario_id'         => $request->usuario_id,
				'horario_id'         => $request->horario_id,
			];

			if (strlen($request->input('observation')) > 0) {
				$data['observacion']    = $request->input('observation');
			}

			$asistencia = new Asistencia;
			$asistencia->fill($data);
			$result = $asistencia->save();

			return response()->json(['result' => $result]);
		}

		if(count($tipos)==1&&in_array("Salida", $tipos)) {
			// Solo hay dalida

			$data = [
				'tipo_asistencia_id' => 1,
				'fecha'              => date_format(new \Datetime($request->fecha), 'Y-m-d') . ' ' . $horario->getHoraInicio($day),
				'usuario_id'         => $request->usuario_id,
				'horario_id'         => $request->horario_id,
			];

			if (strlen($request->input('observation')) > 0) {
				$data['observacion']    = $request->input('observation');
			}

			$asistencia = new Asistencia;
			$asistencia->fill($data);
			$result = $asistencia->save();

			return response()->json(['result' => $result]);
		}

		if(count($tipos)==0&&!in_array("Salida", $tipos)&&!in_array("Salida", $tipos)) {
			// Solo hay salida ni entrada

			$datas = [[
				'tipo_asistencia_id' => 1,
				'fecha'              => date_format(new \Datetime($request->fecha), 'Y-m-d') . ' ' . $horario->getHoraInicio($day),
				'usuario_id'         => $request->usuario_id,
				'horario_id'         => $request->horario_id,
			],[
				'tipo_asistencia_id' => 2,
				'fecha'              => date_format(new \Datetime($request->fecha), 'Y-m-d') . ' ' . $horario->getHoraFin($day),
				'usuario_id'         => $request->usuario_id,
				'horario_id'         => $request->horario_id,
			]];

			foreach($datas as $data) {
				$asistencia = new Asistencia;
				$asistencia->fill($data);
				$asistencia->save();
			}

			return response()->json(['result' => true]);
		}
	}

	static public function todayhasasistencia($id){


		$today = date('Y-m-d');
		$asistenciasToday = Asistencia::where('usuario_id', $id)
			->where('fecha', 'like', $today.'%' )->count();
		//var_dump($asistenciasToday);
		if ($asistenciasToday>0){
			return true;
		}else{
			return false;
		}


	}

}
