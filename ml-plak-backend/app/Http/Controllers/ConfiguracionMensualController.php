<?php

namespace App\Http\Controllers;

use App\Models\ConfiguracionMensual;
use App\Models\Horario;
use App\Models\UsuariosHorario;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ConfiguracionMensualController extends Controller
{
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
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function get(Request $request)
    {
        $this->validate($request, [
            'usuario_id' => 'required',
            'mes' => 'required',
            'anio' => 'required',
        ]);

        $antiguedad = $this->calcularAntiguedad($request->usuario_id, $request->anio, $request->mes);
        $horario = UsuariosHorario::where('usuario_id', $request->usuario_id)->first();
        if(!$horario)
            $horario = UsuariosHorario::where('is_default', 1)->first();

        $relaciones = [
            'rango'
        ];

        $config = ConfiguracionMensual::with($relaciones)
        ->firstOrNew([
            'usuario_id' => $request->usuario_id,
            'mes' => $request->mes,
            'anio' => $request->anio,
        ],[ 
            'id' => 0,
            'valor_x_hora' => 0,
            'antiguedad' => $antiguedad,
            'suma_no_remunerativa' => 0,
            'hora_extra' => 50,
            'sabado_ingles' =>100,
            'valor_plus_mes' => 0,
            'descuento' => 0,
            'presentismo' => 0,
            'forzar_presentismo' => 0,
            'forzar_presentismo_porcentaje' => 0,
            'status' => 0,
            'rango_id' => 0,
            'jubilacion' => 0,
            'innslp' => 0, 
            'obra_social' => 0,
            'sindicato' => 0,
            'seguro_vida' => 0,
            'asignacion_extraordinaria' => 0,  
            'remu_descuento' => 1,
            'remu_plus_mes' => 1
        ]);
    
        if(!$config->id) {
            $mes = $request->mes - 1;
            $anio = $request->anio;
            if($request->mes==0) {
                $mes = 12;
                $anio = $request->anio - 1;
            }
            $configAnterior = ConfiguracionMensual::where('usuario_id', $request->usuario_id)
                ->where('mes', $mes)
                ->where('anio', $anio)
                ->with($relaciones)
                ->first();
            if($configAnterior){ 
                $config->id = 0;
                $config->valor_x_hora = 0;
                $config->antiguedad = $antiguedad;
                $config->suma_no_remunerativa = 0;
                $config->hora_extra = $configAnterior->hora_extra;
                $config->sabado_ingles = $configAnterior->sabado_ingles;
                $config->valor_plus_mes = $configAnterior->valor_plus_mes;
                $config->presentismo = $configAnterior->presentismo;
                $config->forzar_presentismo = $configAnterior->forzar_presentismo;
                $config->forzar_presentismo_porcentaje = $configAnterior->forzar_presentismo_porcentaje;
                $config->jubilacion = $configAnterior->jubilacion;
                $config->innslp = $configAnterior->innslp; 
                $config->obra_social = $configAnterior->obra_social;
                $config->sindicato = $configAnterior->sindicato;
                $config->seguro_vida = $configAnterior->seguro_vida;
                $config->asignacion_extraordinaria = $configAnterior->asignacion_extraordinaria; 
                $config->remu_descuento = $configAnterior->remu_descuento;
                $config->remu_plus_mes = $configAnterior->remu_plus_mes;
                $config->status = 0;
                $config->rango_id = 0;
            }    
        }

        return $config;
    }

    private function calcularAntiguedad($usuarioId, $anio, $mes) {
        $usuario = Usuario::find($usuarioId);
        if ($usuario === null)
          return 0;
        if ($usuario->fecha_ingreso === null)
          return 0; 
        $fechaIngreso =  Carbon::parse($usuario->fecha_ingreso);
        $fecheCalc = Carbon::create($anio, $mes, 1, 0, 0, 0);
        $antiguedad = $fechaIngreso->diffInYears($fecheCalc, false);
        return $antiguedad;
    }
/**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getConfigMensualAnterior(Request $request)
    {
        $this->validate($request, [
            'usuario_id' => 'required|integer|min:1',
            'mes' => 'required|integer|min:1|max:12',
            'anio' => 'required|integer|min:1',
        ]);

        $mes = $request->mes - 1;
        $anio = $request->anio;
        if($request->mes==0) {
            $mes = 12;
            $anio = $request->anio - 1;
        }

        $relaciones = [
            'rango'
        ];

        $configAnterior = ConfiguracionMensual::where('usuario_id', $request->usuario_id)
            ->with($relaciones)
            ->where('mes', $mes)
            ->where('anio', $anio)
            ->first();
          
        return response()->json(['success' => true, 'data' =>  $configAnterior]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, ConfiguracionMensual::RULES);
        $antiguedad = $this->calcularAntiguedad($request->usuario_id, $request->anio, $request->mes);
        $data = $request->all();
        $data['antiguedad'] = $antiguedad;
        $config = ConfiguracionMensual::create($data);
        return $config;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ConfiguracionMensual  $configuracionMensual
     * @return \Illuminate\Http\Response
     */
    public function show(ConfiguracionMensual $configuracionMensual)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ConfiguracionMensual  $configuracionMensual
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ConfiguracionMensual $configuracionMensual)
    {
      
        $this->validate($request, [
            'hora_extra' => 'numeric|min:0',
            'sabado_ingles' => 'numeric|min:0',
            'valor_plus_mes' => 'numeric',
            'valor_plus' => 'numeric',
            'descuento' => 'numeric',
            'forzar_presentismo' => 'in:0,1,2',
            'forzar_presentismo_porcentaje' => 'numeric|min:0',
            'sistema_horario' => 'in:0,1,2',
            'antiguedad' => 'numeric|min:0',
            'jubilacion' => 'numeric|min:0',
            'innslp' => 'numeric|min:0',
            'obra_social' => 'numeric|min:0',
            'sindicato' => 'numeric|min:0',
            'seguro_vida' => 'numeric|min:0',
            'asignacion_extraordinaria' => 'numeric',
            'suma_no_remunerativa' => 'numeric',
            'remu_descuento' => 'required|min:0|max:1',
            'remu_plus_mes' => 'required|min:0|max:1',
            'status' => 'numeric|min:0|max:1'
        ]);
        $antiguedad = $this->calcularAntiguedad($request->usuario_id, $request->anio, $request->mes);
        $data = $request->all();
        $data['antiguedad'] = $antiguedad;
        $relaciones = [
            'rango'
        ];
        $configuracionMensual->update($data);
        $configuracionMensual->load($relaciones);
        return $configuracionMensual;
    }

     /**
     * Update status the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ConfiguracionMensual  $configuracionMensual
     * @return \Illuminate\Http\Response
     */
    public function updateStatus(Request $request, ConfiguracionMensual $configuracionMensual)
    {
        $this->validate($request, [
            'status' => 'numeric|min:0|max:1',
        ]);
        $relaciones = [
            'rango'
        ];
        $data = [];
        $data['status'] = $request->status;
        $configuracionMensual->update($data);
        $configuracionMensual->load($relaciones);
        return $configuracionMensual;
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ConfiguracionMensual  $configuracionMensual
     * @return \Illuminate\Http\Response
     */
    public function destroy(ConfiguracionMensual $configuracionMensual)
    {
        //
    }
}
