<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\UsuarioEstado;
use Carbon\Carbon;
use Illuminate\Http\Request;

class UsuarioEstadoController extends Controller
{
    public function index()
    {
        $usuarios = Usuario::all();
        $estados = [];

        foreach ($usuarios as $usuario) {
            $estado_activo = UsuarioEstado::where('usuario_id', $usuario->id)
                ->where('fecha_expiracion', '>', Carbon::today()->toDateString())
                ->get()
                ->last();

            if (is_null($estado_activo)) {
                $estado_activo = new UsuarioEstado();
                $estado_activo->usuario_id = $usuario->id;
            }

            $estado_activo->load('usuario', 'tipo_asistencia');
            $estado_activo->append(['activo', 'ultimo_ingreso', 'ultima_salida', 'ultimo_estado']);

            $estados[] = $estado_activo;
        }

        $activos = array_filter($estados, function ($estado) {
            return $estado->activo;
        });

        $inactivos = array_filter($estados, function ($estado) {
            return !$estado->activo;
        });

        return response()->json(['activos' => $activos, 'inactivos' => $inactivos]);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'mensaje' => 'required',
            'dias' => 'required'
        ]);

        $data = [
            'usuario_id' => $request->input('usuario_id'),
            'fecha_creacion' => Carbon::now(),
            'fecha_expiracion' => Carbon::now()->addDays($request->input('dias')),
            'mensaje' => $request->input('mensaje'),
            'tipo_asistencia_id' => 1
        ];

        UsuarioEstado::create($data);
    }
}
