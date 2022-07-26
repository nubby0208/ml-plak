<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Usuario;
use Illuminate\Http\Request;
use App\Models\UsuariosHorario;

class HorarioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $horario_default = UsuariosHorario::where('is_default',true)->first();
        if(is_null($horario_default)) {
            $horario_default = new UsuariosHorario();
            $horario_default->hora_inicio = Carbon::createFromTimeString('9:00:00', 'America/Argentina/Buenos_Aires')->format('H:i');
            $horario_default->hora_fin = Carbon::createFromTimeString('17:00:00', 'America/Argentina/Buenos_Aires')->format('H:i');
            $horario_default->is_default = true;
            $horario_default->save();
        }
        return response()->json(['horario' => $horario_default]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function planilla($fecha)
    {
        $horariosQuery = UsuariosHorario::query()
                         ->join('usuarios as u', 'usuarios_horarios.usuario_id', '=', 'u.id')
                         ->where("u.activo",1);

        $weekday =  $this->getDayWeek($fecha);
        switch ($weekday)  {
          case 'SU':
            $horariosQuery = $horariosQuery->where("habilitado_domingo",1);
            $columnas = ["u.nombre_completo as nombre","hora_inicio_domingo as inicio","hora_fin_domingo as fin"];
            break;
          case 'MO':
            $horariosQuery = $horariosQuery->where("habilitado_lunes",1);
            $columnas = ["u.nombre_completo as nombre","hora_inicio_lunes as inicio","hora_fin_lunes as fin"];
            break;
          case 'TU':
            $horariosQuery = $horariosQuery->where("habilitado_martes",1);
            $columnas = ["u.nombre_completo as nombre","hora_inicio_martes as inicio","hora_fin_martes as fin"];
            break;
          case 'WE':
            $horariosQuery = $horariosQuery->where("habilitado_miercoles",1);
            $columnas = ["u.nombre_completo as nombre","hora_inicio_miercoles as inicio","hora_fin_miercoles as fin"];
            break;
          case 'TH':
            $horariosQuery = $horariosQuery->where("habilitado_jueves",1);
            $columnas = ["u.nombre_completo as nombre","hora_inicio_jueves as inicio","hora_fin_jueves as fin"];
            $daysum=3;
            break;
          case 'FR':
            $horariosQuery = $horariosQuery->where("habilitado_viernes",1);
            $columnas = ["u.nombre_completo as nombre","hora_inicio_viernes as inicio","hora_fin_viernes as fin"];
            break;
          case 'SA':
            $horariosQuery = $horariosQuery->where("habilitado_sabado",1);
            $columnas = ["u.nombre_completo as nombre","hora_inicio_sabado as inicio","hora_fin_sabado as fin"];
            break;
        }
        $datos = $horariosQuery->get($columnas);

        return response()->json(['success' => true,'data' => $datos],200);
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
            'habilitado_lunes'      => 'required|boolean',
            'hora_inicio_lunes'     => 'required|date_format:H:i:s',
            'hora_fin_lunes'        => 'required|date_format:H:i:s',
            'habilitado_martes'     => 'required|boolean',
            'hora_inicio_martes'    => 'required|date_format:H:i:s',
            'hora_fin_martes'       => 'required|date_format:H:i:s',
            'habilitado_miercoles'  => 'required|boolean',
            'hora_inicio_miercoles' => 'required|date_format:H:i:s',
            'hora_fin_miercoles'    => 'required|date_format:H:i:s',
            'habilitado_jueves'     => 'required|boolean',
            'hora_inicio_jueves'    => 'required|date_format:H:i:s',
            'hora_fin_jueves'       => 'required|date_format:H:i:s',
            'habilitado_viernes'    => 'required|boolean',
            'hora_inicio_viernes'   => 'required|date_format:H:i:s',
            'hora_fin_viernes'      => 'required|date_format:H:i:s',
            'habilitado_sabado'     => 'required|boolean',
            'hora_inicio_sabado'    => 'required|date_format:H:i:s',
            'hora_fin_sabado'       => 'required|date_format:H:i:s',
            'habilitado_domingo'    => 'required|boolean',
            'hora_inicio_domingo'   => 'required|date_format:H:i:s',
            'hora_fin_domingo'      => 'required|date_format:H:i:s',
            'valor_x_hora'          => 'required',
            'valor_plus'            => 'required',
            'sistema'               => 'required',
            'is_default'            => 'boolean',
        ];

        $this->validate($request, $rules);
				$horario = [];

				try {
					$horario = new UsuariosHorario;
					$is_default = ($request->has('is_default')) ? (int) $request->input('is_default') : 0;

					if ($is_default === 1) {
						if (UsuariosHorario::where('is_default', 1)->count() > 0)
							$horario = UsuariosHorario::where('is_default', 1)->first();
					}

					$horario->hora_inicio_lunes = $request->hora_inicio_lunes;
					$horario->hora_fin_lunes = $request->hora_fin_lunes;
					$horario->habilitado_lunes = $request->habilitado_lunes;
					$horario->hora_inicio_martes = $request->hora_inicio_martes;
					$horario->hora_fin_martes = $request->hora_fin_martes;
					$horario->habilitado_martes = $request->habilitado_martes;
					$horario->hora_inicio_miercoles = $request->hora_inicio_miercoles;
					$horario->hora_fin_miercoles = $request->hora_fin_miercoles;
					$horario->habilitado_miercoles = $request->habilitado_miercoles;
					$horario->hora_inicio_jueves = $request->hora_inicio_jueves;
					$horario->hora_fin_jueves = $request->hora_fin_jueves;
					$horario->habilitado_jueves = $request->habilitado_jueves;
					$horario->hora_inicio_viernes = $request->hora_inicio_viernes;
					$horario->hora_fin_viernes = $request->hora_fin_viernes;
					$horario->habilitado_viernes = $request->habilitado_viernes;
					$horario->hora_inicio_sabado = $request->hora_inicio_sabado;
					$horario->hora_fin_sabado = $request->hora_fin_sabado;
					$horario->habilitado_sabado = $request->habilitado_sabado;
          $horario->hora_inicio_domingo = $request->hora_inicio_domingo;
					$horario->hora_fin_domingo = $request->hora_fin_domingo;
					$horario->habilitado_domingo = $request->habilitado_domingo;
          $horario->valor_x_hora = $request->valor_x_hora;
          $horario->valor_plus = $request->valor_plus;
          $horario->sistema = $request->sistema;
					$horario->is_default = $is_default;
					$horario->save();

					return response()->json(['success' => true]);
				} catch (Exception $exception) {
					return response()->json(['success' => false, 'msg' => $exception->getMessage()]);
				}
    }

     /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store_horario_user(Request $request, $id)
    {
        $usuario = Usuario::findOrFail($id);
        $rules = [
            'habilitado_lunes'  =>  'required|boolean',
            'hora_inicio_lunes' =>  'required|date_format:H:i:s',
            'hora_fin_lunes'    =>  'required|date_format:H:i:s',
            'habilitado_martes'  =>  'required|boolean',
            'hora_inicio_martes' =>  'required|date_format:H:i:s',
            'hora_fin_martes'    =>  'required|date_format:H:i:s',
            'habilitado_miercoles'  =>  'required|boolean',
            'hora_inicio_miercoles' =>  'required|date_format:H:i:s',
            'hora_fin_miercoles'    =>  'required|date_format:H:i:s',
            'habilitado_jueves'  =>  'required|boolean',
            'hora_inicio_jueves' =>  'required|date_format:H:i:s',
            'hora_fin_jueves'    =>  'required|date_format:H:i:s',
            'habilitado_viernes'  =>  'required|boolean',
            'hora_inicio_viernes' =>  'required|date_format:H:i:s',
            'hora_fin_viernes'    =>  'required|date_format:H:i:s',
            'habilitado_sabado'  =>  'required|boolean',
            'hora_inicio_sabado' =>  'required|date_format:H:i:s',
            'hora_fin_sabado'    =>  'required|date_format:H:i:s',
            'habilitado_domingo'  =>  'required|boolean',
            'hora_inicio_domingo' =>  'required|date_format:H:i:s',
            'hora_fin_domingo'    =>  'required|date_format:H:i:s',
            'valor_x_hora'       => 'required',
            'valor_plus'          => 'required',
            'sistema'            => 'required',
        ];

        $this->validate($request, $rules);
        $horario = $usuario->horario;
        if(is_null($horario)){
            $usuario->horario()->create([
                'hora_inicio_lunes' => $request->hora_inicio_lunes,
                'hora_fin_lunes' => $request->hora_fin_lunes,
                'habilitado_lunes' => $request->habilitado_lunes,
                'hora_inicio_martes' => $request->hora_inicio_martes,
                'hora_fin_martes' => $request->hora_fin_martes,
                'habilitado_martes' => $request->habilitado_martes,
                'hora_inicio_miercoles' => $request->hora_inicio_miercoles,
                'hora_fin_miercoles' => $request->hora_fin_miercoles,
                'habilitado_miercoles' => $request->habilitado_miercoles,
                'hora_inicio_jueves' => $request->hora_inicio_jueves,
                'hora_fin_jueves' => $request->hora_fin_jueves,
                'habilitado_jueves' => $request->habilitado_jueves,
                'hora_inicio_viernes' => $request->hora_inicio_viernes,
                'hora_fin_viernes' => $request->hora_fin_viernes,
                'habilitado_viernes' => $request->habilitado_viernes,
                'hora_inicio_sabado' => $request->hora_inicio_sabado,
                'hora_fin_sabado' => $request->hora_fin_sabado,
                'habilitado_sabado' => $request->habilitado_sabado,
                'valor_x_hora'  => $request->valor_x_hora,
                'valor_plus' => $request->valor_plus,
                'sistema'       => $request->sistema,
                'is_default'    =>  false
            ]);
        }else {
            $horario->hora_inicio_lunes = $request->hora_inicio_lunes;
            $horario->hora_fin_lunes = $request->hora_fin_lunes;
            $horario->habilitado_lunes = $request->habilitado_lunes;
            $horario->hora_inicio_martes = $request->hora_inicio_martes;
            $horario->hora_fin_martes = $request->hora_fin_martes;
            $horario->habilitado_martes = $request->habilitado_martes;
            $horario->hora_inicio_miercoles = $request->hora_inicio_miercoles;
            $horario->hora_fin_miercoles = $request->hora_fin_miercoles;
            $horario->habilitado_miercoles = $request->habilitado_miercoles;
            $horario->hora_inicio_jueves = $request->hora_inicio_jueves;
            $horario->hora_fin_jueves = $request->hora_fin_jueves;
            $horario->habilitado_jueves = $request->habilitado_jueves;
            $horario->hora_inicio_viernes = $request->hora_inicio_viernes;
            $horario->hora_fin_viernes = $request->hora_fin_viernes;
            $horario->habilitado_viernes = $request->habilitado_viernes;
            $horario->hora_inicio_sabado = $request->hora_inicio_sabado;
            $horario->hora_fin_sabado = $request->hora_fin_sabado;
            $horario->habilitado_sabado = $request->habilitado_sabado;
            $horario->hora_inicio_domingo = $request->hora_inicio_domingo;
            $horario->hora_fin_domingo = $request->hora_fin_domingo;
            $horario->habilitado_domingo = $request->habilitado_domingo;
            $horario->valor_x_hora = $request->valor_x_hora;
            $horario->valor_plus = $request->valor_plus;
            $horario->sistema = $request->sistema;
            $horario->save();
        }

        return response()->json(['success' => true]);
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
        $usuario->horario()->create([
            'horario_inicio'    =>  $request->horario_inicio,
            'horario_fin'    =>  $request->horario_fin,
            'activo'    =>  true,
        ]);

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

    private function getDayWeek($date)
    {
        $weekMap = [
            0 => 'SU',
            1 => 'MO',
            2 => 'TU',
            3 => 'WE',
            4 => 'TH',
            5 => 'FR',
            6 => 'SA',
          ];
        $dayOfTheWeek = Carbon::parse($date)->dayOfWeek;
        return $weekMap[$dayOfTheWeek];
    }

}
