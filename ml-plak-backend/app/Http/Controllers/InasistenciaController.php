<?php

namespace App\Http\Controllers;

use App\Models\Inasistencia;
use App\Models\InasistenciaDoc;
use App\Models\UsuariosHorario;
use App\Models\Horario;
use App\Models\Asistencia;
use App\Models\Feriado;
use Illuminate\Http\Request;
use Carbon\Carbon;
use DB;
use Storage;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpKernel\Exception\HttpException;

class InasistenciaController extends Controller
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
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function showByUserDate($usuarioId,$fecha)
    {
        $inasistencia  = Inasistencia::where('usuario_id', $usuarioId)
                                     ->whereDate('fecha1', '<=',$fecha)
                                     ->whereDate('fecha2', '>=',$fecha)
                                     ->with(['inasistenciaDoc'])
                                     ->first();

        return response()->json(['success' => true,'data' => $inasistencia],200);
    }

    /**
     * Store a newly created resource in db.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $inasistenciaId = $request->id;
        $usuarioId = $request->usuario_id;
        DB::beginTransaction();
        try {
            $this->validate($request, [
                'usuario_id'  => 'required|integer|exists:usuarios,id',
                'fecha1'      => 'required|date_format:Y-m-d',
                'fecha2'      => 'required|date_format:Y-m-d',
                'descripcion' => 'required|string|min:1',
                'doc'         => 'required|file|max:1000|mimes:pdf,jpj,png,jpeg',
            ]);

            if (date($request->fecha1) >  date($request->fecha2)) {
                throw new HttpException(
                    422,
                    'La fecha Desde debe ser menor o igual a la fecha Hasta.',
                    null,
                    [],
                    422
                );
            }
            
            
            $inasistenciaCount = Inasistencia::query()
                                              ->whereDate("fecha1","<=",$request->fecha1)
                                              ->whereDate("fecha2",">=",$request->fecha1)
                                              ->where("usuario_id",$usuarioId);
            if ($inasistenciaId > 0) {
                $inasistenciaCount = $inasistenciaCount->where("id","<>",$inasistenciaId);
            }
            $inasistenciaCount = $inasistenciaCount->count();   
            if ($inasistenciaCount > 0) {
                throw new HttpException(
                    422,
                    'La fecha Desde ya ha sido asignada.',
                    null,
                    [],
                    422
                );
            }   

            $inasistenciaCount = Inasistencia::query()
                                             ->whereDate("fecha1","<=",$request->fecha2)
                                             ->whereDate("fecha2",">=",$request->fecha2)
                                             ->where("usuario_id",$usuarioId);
            if ($inasistenciaId > 0) {
                $inasistenciaCount = $inasistenciaCount->where("id","<>",$inasistenciaId);
            }                                    
            $inasistenciaCount = $inasistenciaCount->count();    
            if ($inasistenciaCount > 0) {
                throw new HttpException(
                    422,
                    'La fecha Hasta ya ha sido asignada.',
                    null,
                    [],
                    422
                );
            }

            if ($inasistenciaId == 0) {
                $inasistencia = Inasistencia::create($request->all());
            }
            if ($inasistenciaId > 0) {
                $inasistencia = Inasistencia::find($inasistenciaId);
                $this->deleteAsistencias($usuarioId,$inasistencia->fecha1,$inasistencia->fecha2);
                $inasistencia->fill($request->all());
                $inasistencia->save();
            }    
            $newInasistenciaDoc                    = [];
            $newInasistenciaDoc['inasistencia_id'] = $inasistencia->id;
            $newInasistenciaDoc['descripcion']     = $request['descripcion']; 
           
            $name = "";
            if ($request->hasFile('doc'))  {
                $file = $request->file('doc');
                $ext = $file->getClientOriginalExtension();
                $name = "doc_inasistencia_" . $inasistencia->id . "_" . time() . "." . $ext;
                if ($ext === "pdf") {
                    $file->move(storage_path('app/public') . '/docs/inasistencia/',$name);
                }
                if ($ext !== "pdf"){
                    $file->move(storage_path('app/public') . '/images/inasistencia/',$name);
                }
            }

            $newInasistenciaDoc['doc'] = $name; 
            InasistenciaDoc::create($newInasistenciaDoc);
            
            $this->updateAsistencias($usuarioId, $request->fecha1, $request->fecha2);

            DB::commit();
            if ($inasistenciaId == 0) {
                return response()->json(['success' => true],201);
            }
            if ($inasistenciaId > 0) {
                return response()->json(['success' => true],200);
            }

        } catch (Exception $e) {
            DB::rollback();
            return response()->json([ 'code' => 422, 'message' =>  $e->getMessage(), 'data' => [] ], 422);
        }    
    }

    private function deleteAsistencias($usuarioId, $fechaIni, $fechaFin) {
        $fechaIni = Carbon::parse($fechaIni)->format('Y/m/d');
        $fechaFin = Carbon::parse($fechaFin)->format('Y/m/d');
        //dd('Fecha1: ' . $fechaIni . ' | Fecha2: ' . $fechaFin);
        Asistencia::whereDate('fecha', '>=',$fechaIni)
            ->whereDate('fecha', '<=',$fechaFin)
			->where('usuario_id', $usuarioId)
			->where('tipo_asistencia_id', 1)
            ->where('justificacion', 1)
            ->delete();
    }    
    private function updateAsistencias($usuarioId, $fechaIni, $fechaFin) {
        $fechaIni = Carbon::parse($fechaIni)->format('Y/m/d');
        $fechaFin = Carbon::parse($fechaFin)->format('Y/m/d');
        //dd('Fecha1: ' . $fechaIni . ' | Fecha2: ' . $fechaFin);
        $fecha = $fechaIni;
        $horaInicio = "";
        for(;$fecha <= $fechaFin;) {
            $usuariosHorario = UsuariosHorario::where('usuario_id', $usuarioId)->first();
            if (empty($usuariosHorario)===true) {
                $usuariosHorario = UsuariosHorario::where('id',1)->where('is_default',1)->first();
            }
            $feriadoCount = Feriado::whereDate('fecha', $fecha)->count();
            $diaActivo=false;
            $weekday =  $this->getDayWeek($fecha);
           // dd("Dia semena: ", $weekday);
            switch ($weekday)  {
            case 'SU':
                if ($usuariosHorario->habilitado_domingo === 1) {
                    $horaInicio = $usuariosHorario->hora_inicio_domingo;
                    $diaActivo=true;
                }
                break;
            case 'MO':
                if ($usuariosHorario->habilitado_lunes === 1) {
                    $horaInicio = $usuariosHorario->hora_inicio_lunes;
                    $diaActivo=true;
                }
                break;
            case 'TU':
                if ($usuariosHorario->habilitado_martes === 1) {
                    $horaInicio = $usuariosHorario->hora_inicio_martes;
                    $diaActivo=true;
                }
                break;
            case 'WE':
                if ($usuariosHorario->habilitado_miercoles === 1) {
                    $horaInicio = $usuariosHorario->hora_inicio_miercoles;
                    $diaActivo=true;
                }
                break;
            case 'TH':
                if ($usuariosHorario->habilitado_jueves === 1) {
                    $horaInicio = $usuariosHorario->hora_inicio_jueves;
                    $diaActivo=true;
                }
                break;
            case 'FR':
                if ($usuariosHorario->habilitado_viernes === 1) {
                    $horaInicio = $usuariosHorario->hora_inicio_viernes;
                    $diaActivo=true;
                }
                break;
            case 'SA':
                if ($usuariosHorario->habilitado_sabado === 1) {
                    $horaInicio = $usuariosHorario->hora_inicio_sabado;
                    $diaActivo=true;
                }
                break;
            }    
            $asistenciasExist = Asistencia::whereDate('fecha', $fecha)
			->where('usuario_id', $usuarioId)
			->where('tipo_asistencia_id', 1)
            ->exists();

            if (($asistenciasExist === false)  && ($diaActivo === true) && ($feriadoCount === 0)) {
                $data = [
                    'tipo_asistencia_id' => 1,
                    'justificacion'      => true,
                    'fecha'              => Carbon::parse($fecha . " " . $horaInicio),
                    'usuario_id'         => $usuarioId,
                    'horario_id'         => 1,
                ];
                //dd('Data: ', $data);
                $asistencia = Asistencia::create($data);
            }
            $fecha = Carbon::parse($fecha)->addDay()->format('Y/m/d');
            //dd('New Fecha:', $fecha);
        }
        
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

    /**
     * Update the specified resource in db.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Inasistencia $inasistencia
     * @return \Illuminate\Http\Response
     */
    public function update(Inasistencia $inasistencia, Request $request)
    {
        DB::beginTransaction();
        try {
            $this->validate($request, [
                'usuario_id'  => 'required|integer|exists:usuarios,id',
                'fecha1'      => 'required|date_format:Y-m-d',
                'fecha2'      => 'required|date_format:Y-m-d',
            ]);
            
            if (date($request->fecha1) >  date($request->fecha2)) {
                throw new HttpException(
                    422,
                    'La fecha Desde debe ser menor o igual a la fecha Hasta.',
                    null,
                    [],
                    422
                );
            }

            $inasistenciaCount = Inasistencia::whereDate("fecha1","<=",$request->fecha1)
                                             ->whereDate("fecha2",">=",$request->fecha1)
                                             ->where("id","<>",$request->id)
                                             ->where("usuario_id",$request->usuario_id)
                                             ->count();   
            if ($inasistenciaCount > 0) {
                throw new HttpException(
                    422,
                    'La fecha Desde ya ha sido asignada.',
                    null,
                    [],
                    422
                );
            }   

            $inasistenciaCount = Inasistencia::whereDate("fecha1","<=",$request->fecha2)
                                             ->whereDate("fecha2",">=",$request->fecha2)
                                             ->where("id","<>",$request->id)
                                             ->where("usuario_id",$request->usuario_id)
                                             ->count();   
            if ($inasistenciaCount > 0) {
                throw new HttpException(
                    422,
                    'La fecha Hasta ya ha sido asignada.',
                    null,
                    [],
                    422
                );
            }
            $this->deleteAsistencias($request->usuario_id,$inasistencia->fecha1,$inasistencia->fecha2);
            $inasistencia->fill($request->all());
            $inasistencia->save();
            $this->updateAsistencias($request->usuario_id, $request->fecha1, $request->fecha2);


            DB::commit();
            return response()->json(['success' => true],200);

        } catch (Exception $e) {
            DB::rollback();
            return response()->json([ 'code' => 422, 'message' =>  $e->getMessage(), 'data' => [] ], 422);
        }    
    }

    /**
     * Remove the specified resource from db.
     *
     * @param  \App\Models\Inasistencia $inasistencia
     * @return \Illuminate\Http\Response
     */
    public function destroy($inasistenciaDocId)
    {
        DB::beginTransaction();
        try {
            $inasistenciaDoc = InasistenciaDoc::find($inasistenciaDocId);
            $inasistenciaId = $inasistenciaDoc->inasistencia_id;
            $fileName = $inasistenciaDoc->doc;
            
            $filePath = storage_path('app/public') . '/docs/inasistencia/' . $fileName;
            if (File::exists($filePath)) {
                File::delete($filePath);    
            }        
            $filePath = storage_path('app/public') . '/images/inasistencia/' . $fileName;
            if (File::exists($filePath)) {
                File::delete($filePath);    
            }
            $inasistenciaDoc->delete();
              
            $inasistenciaDocCount = InasistenciaDoc::where("inasistencia_id",$inasistenciaId)->count();
            if ($inasistenciaDocCount === 0) {
                $inasistencia = Inasistencia::find($inasistenciaId);
                $this->deleteAsistencias($inasistencia->usuario_id,$inasistencia->fecha1,$inasistencia->fecha2);
                $inasistencia->delete();
            }

            DB::commit();
            return response()->json(['success' => true],200);
        
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['success' => false,'error' => $e],422);
        }       

    }
}
