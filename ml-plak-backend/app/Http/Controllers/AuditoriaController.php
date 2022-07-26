<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AuditoriaGoogle;
use App\Models\Estado;
use App\Models\Pieza;
use App\Models\Modulo;
use App\Models\Tapacanto;
use App\Models\Proyecto;
use \OwenIt\Auditing\Models\Audit;
use Illuminate\Support\Str;
use App\Main\Base\Classes\ModelConst;

class AuditoriaController extends Controller
{
	public function store(Request $request)
	{
		$this->validate($request, [
			'usuario_id'   => 'required|integer|exists:usuarios,id',
			'hoja_calculo' => 'required|string',
			'solapa'       => 'required|string',
			'valor'        => 'required|string',
			'pieza'        => 'required|string',
			'valor_anterior'     => 'required|string',
		]);
		
		$data = $request->only(['usuario_id', 'hoja_calculo', 'solapa', 'valor', 'pieza', 'valor_anterior']);

		$registro = new AuditoriaGoogle();
		$registro->fill($data);

		if ($registro->save()) {
			return response()->json(['success' => true]);
		}

			return response()->json(['success' => false]);
	}
	public function get_sheet_by_usuario(Request $request)
	{
		$this->validate($request, [
			'usuario' => 'required|exists:usuarios,usuario'
		]);

		$usuario = $request->input('usuario');

		$records = AuditorioGoogle::where('usuario', $usuario)
			->with(['usuario' => function ($query) {
				$query->select('id', 'usuario');
			}])
			->get();

		return response()->json(['registros' => $records]);
	}

	public function get_by_usuario_fecha(Request $request)
	{
		$this->validate($request, [
			'area'         => 'nullable|string',
			'cliente_id'   => 'required|integer',
			'estado'	   => 'required|string',	
			'usuario_id'   => 'required|integer|min:-1',
			'fecha_inicio' => 'required|date',
			'fecha_fin'    => 'required|date'
		]);
		$page = $request->page;
		$data = $request->only(['area','cliente_id','corte','estado','usuario_id', 'fecha_inicio', 'fecha_fin']);
		
		$columnas = [
			'audits.created_at', 
			'usuarios.usuario', 
			'audits.auditable_type',
			'audits.auditable_id',
			'audits.new_values',
			'audits.old_values',
			'audits.id',
			'audits.event'
		];
		$records = $this->prepareAuditSelect($data);
		$records = $records->select($columnas)
						   ->orderBy('created_at','Desc')	
						   ->paginate(20);
		$records->map($this->mapRecordsProcess());
		
		return response()->json(['success' => true,'registros' => $records]);
	}
    
	private function transformar ($estado) {
		if ($estado === '"estado_id":1') {
			return '"prearmado_estado_id":1';
		}
		if ($estado === '"estado_id":2') {
			return '"prearmado_estado_id":2';
		}
		if ($estado === '"estado_id":3') {
			return '"prearmado_estado_id":3';
		}
		if ($estado === '"estado_id":4') {
			return '"prearmado_estado_id":4';
		}
		if ($estado === '"estado_id":5') {
			return '"prearmado_estado_id":5';
		}
		if ($estado === '"estado_id":6') {
			return '"prearmado_estado_id":6';
		}
		if ($estado === '"estado_id":7') {
			return '"prearmado_estado_id":7';
		}
		if ($estado === '"estado_id":8') {
			return '"prearmado_estado_id":8';
		}
		if ($estado === '"estado_id":9') {
			return '"prearmado_estado_id":9';
		}
	}
	public function get_estadistica_by_usuario_fecha(Request $request)
	{
		$this->validate($request, [
			'area'         => 'nullable|string',
			'cliente_id'   => 'required|integer',
			'estado'	   => 'required|string',	
			'usuario_id'   => 'required|integer|min:-1',
			'fecha_inicio' => 'required|date',
			'fecha_fin'    => 'required|date'
		]);
		$data = $request->only(['area','cliente_id','corte','estado','usuario_id', 'fecha_inicio', 'fecha_fin']);
		
		$columnas = [
			'audits.created_at', 
			'usuarios.usuario', 
			'audits.auditable_type',
			'audits.auditable_id',
			'audits.new_values',
			'audits.old_values',
			'audits.id',
			'audits.event'
		];
		$estadisticas = $this->prepareAuditSelect($data);
		$estadisticas = $estadisticas->get($columnas);
        $estadisticas->map($this->mapEstadisticasProcess());
        
		$resumen = [];
		$resumen['cortes'] = ($estadisticas !== null)? $estadisticas->where("area","Corte")->count(): 0;
		$resumen['prearmados'] = ($estadisticas !== null)? $estadisticas->where("area","Prearmado")->count(): 0;
		$resumen['tapacantos'] = ($estadisticas !== null)? $estadisticas->where("area","Tapacanto")->count(): 0;
		$resumen['cajones'] = ($estadisticas !== null)? $estadisticas->where("area","Cajon")->count(): 0;
		$resumen['modulos'] = ($estadisticas !== null)? $estadisticas->where("area","Modulo")->count(): 0;
		$resumen['clientes'] = 0;

		return response()->json(['success' => true,'resumen' => $resumen]);
	}

	private function prepareAuditSelect($data){
		
		$audits = Audit::query()
		->join('usuarios', 'usuarios.id', '=', 'audits.usuario_id');
		if (($data['area'] === 'Modulo') || ($data['area'] === 'Cajon')) {
			$audits = $audits->leftjoin('modulos', function($join) {
				$join->on(function($query) {
					$query->on('modulos.id','=','audits.auditable_id')
					->where('audits.auditable_type','like', 'App%Models%Modulo');
				 });
			});
		}
		if (($data['cliente_id'] !== 0)) { 
			$audits = $audits->leftjoin('tapacantos', function($join){
				$join->on('tapacantos.id','=','audits.auditable_id')
				->where('audits.auditable_type','like', 'App%Models%Tapacanto'); 
			})
			->leftjoin('piezas', function($join) {
				$join->on(function($query) {		
					$query->on('piezas.id','=','audits.auditable_id')
					->where('audits.auditable_type','like', 'App%Models%Pieza');
				 });
				$join->orOn(function($query) {
					$query->on('piezas.id','=','tapacantos.pieza_id')
					->where('audits.auditable_type','like', 'App%Models%Tapacanto');
				 }); 
			})
			->leftjoin('modulos', function($join) use($data) {
				$join->on(function($query) {
					$query->on('modulos.id','=','audits.auditable_id')
					->where('audits.auditable_type','like', 'App%Models%Modulo');
				 });
				if (($data['area'] !== 'Cajon') &&  ($data['area'] !== 'Modulo')) 
				{
					$join->orOn(function($query) {
						$query->on('modulos.id','=','piezas.modulo_id');
					}); 
				}	
			})
			->leftjoin('proyectos','proyectos.id','=','modulos.proyecto_id')
			->leftjoin('clientes', 'clientes.id','=', 'proyectos.cliente_id');
		}
		if ($data['estado'] !== '"estado_id":0') {
			$audits = $audits->where(function ($query) use ($data) {
				$query->where('audits.new_values','like', '%'. $data['estado'] . '%')
					->orWhere('audits.new_values', 'like', '%' . $this->transformar($data['estado']) . '%');
			});	
		}	
		if ($data['estado'] === '"estado_id":0') {
			$audits = $audits->where(function ($query) {
				$query->where('audits.new_values', 'like', '%'. ModelConst::AUDIT_ESTADOS_AREAS . '%')
					->orWhere('audits.new_values', 'like', '%'. ModelConst::AUDIT_ESTADOS_PREARMADO_AREAS . '%');  
			});	
		}
		$audits = $audits->where('usuarios.activo', 1)
		->whereDate('audits.created_at', '>=', $data['fecha_inicio'])
		->whereDate('audits.created_at', '<=', $data['fecha_fin']);
		if (($data['usuario_id'] !== 0)  && ($data['usuario_id'] !== -1)) {
			$audits = $audits->where('audits.usuario_id',$data['usuario_id']);	
		}
		if ($data['area'] === 'Todas') {
			$audits = $audits->where(function ($query) {
				$query->where('audits.auditable_type', 'like','App%Models%Pieza')
					->orWhere('audits.auditable_type', 'like','App%Models%Tapacanto')
					->orWhere('audits.auditable_type', 'like','App%Models%Modulo');
			});
		}
		if ($data['area'] === 'Corte') {
			$audits = $audits->where('audits.auditable_type', 'like','App%Models%Pieza')
							 ->where('audits.new_values', 'like', '%'. ModelConst::AUDIT_ESTADOS_AREAS . '%');
		}
		if ($data['area'] === 'Prearmado') {
			$audits = $audits->where('audits.auditable_type', 'like','App%Models%Pieza')
							 ->Where('audits.new_values', 'like', '%'. ModelConst::AUDIT_ESTADOS_PREARMADO_AREAS . '%');
		}
		if ($data['area'] === 'Tapacanto') {
			$audits = $audits->where('audits.auditable_type', 'like','App%Models%Tapacanto');
		}	
		if ($data['area'] === 'Cajon') {
			$audits = $audits->where('audits.auditable_type', 'like','App%Models%Modulo')
							   ->where('modulos.is_cajon',1);
		}
		if ($data['area'] === 'Modulo') {
			$audits = $audits->where('audits.auditable_type', 'like','App%Models%Modulo')
							   ->where('modulos.is_cajon','<>',1);
		}
		if ($data['cliente_id'] !== 0) {
			$audits = $audits->where('clientes.id',$data['cliente_id']);	
		}
		
		return $audits; 

	}
	private function mapEstadisticasProcess(): callable {
		return function ($reg, $key) {
            $reg->area = $this->getArea($reg);
        };
	}    

	private function mapRecordsProcess(): callable {
		return function ($reg, $key) {
            $reg->area = $this->getArea($reg);
			//$reg->campo = $this->getCampo($reg);
			$reg->new_estado = $this->getNewEstado($reg);
			$reg->old_estado = $this->getOldEstado($reg);
			[$reg->proyecto, $reg->cliente] = $this->getProyecto($reg);
			$reg->modulo = $this->getModulo($reg);
			$reg->pieza = $this->getPieza($reg);
			$reg->posicion_tapacanto = $this->getTapacanto($reg);
        };
	}    

	private function getCampo($reg) {
		
		$values = $reg->new_values;
		
		if (is_array($values) === false) {
			return '';
		}
		if ((array_key_exists('estado_id',$values) === true) && ($values['estado_id'] === 1)) {
			return 'Estado';	
		}
		if ((array_key_exists('prearmado_estado_id',$values) === true) && ($values['prearmado_estado_id'] === 1)) {
			return 'Prearmado';	
		}
		return '';
	}

	private function getNewEstado($reg) {
		
		$values = $reg->new_values;
		
		if  ((is_array($values) === true) && (array_key_exists('estado_id',$values) === true)) {
			$value = $values['estado_id'];
			$estado = Estado::find($value);
			if ($estado !== null) {
				if ($value == 9) {
					return $estado->estado;
				}
				return "Estado " . $estado->estado;		
			}   
		}
		
		if  ((is_array($values) === true) && (array_key_exists('prearmado_estado_id',$values) === true)) {
			$value = $values['prearmado_estado_id'];
			$estado = Estado::find($value);
			if ($estado !== null) {
				if ($value == 9) {
					return $estado->estado;
				}
				return "Estado " . $estado->estado;		
			}  
		}

		$values = json_encode($values);
		if (empty($values) === true || ($values === "[]")) {
			return "No disponible";
		}
		return $values;
	}

	private function getOldEstado($reg) {
		
		$values = $reg->old_values;
		
		if ((is_array($values) === true) && (array_key_exists('estado_id',$values) === true)) {
			$value = $values['estado_id'];
			$estado = Estado::find($value);
			if ($estado !== null) {
				if ($value == 9) {
			   		return $estado->estado;
				}
				return "Estado " . $estado->estado;		
			}   
		}

		if  ((is_array($values) === true) && (array_key_exists('prearmado_estado_id',$values) === true)) {
			$value = $values['prearmado_estado_id'];
			$estado = Estado::find($value);
			if ($estado !== null) {
				if ($value == 9) {
					return $estado->estado;
				}
				return "Estado " . $estado->estado;		
			}  	
		}
		
		$values = json_encode($values);
		if (empty($values) === true || ($values === "[]")) {
			return "No disponible";
		}
		return $values;
	}

	private function getArea($reg) {
		
        if (Str::contains($reg->auditable_type,'Pieza') === true) {
			if (Str::contains(json_encode($reg->new_values),'{"prearmado_estado_id":') === true) {
				return 'Prearmado';	
			}
			return 'Corte';	
		}

		if (Str::contains($reg->auditable_type,'Tapacanto') === true) {
			return 'Tapacanto';
		}
		if (Str::contains($reg->auditable_type,'Modulo') === true) {
			$modulo = Modulo::where('id',$reg->auditable_id)->first();
			if (($modulo !== null) && ($modulo->is_cajon === 1)) {
				return 'Cajon';	
			}
			return 'Modulo';
		}
	}

	private function getProyecto($reg) {
		
        if (Str::contains($reg->auditable_type,'Pieza') === true) {
			$pieza = Pieza::where('id',$reg->auditable_id)->first();
			if (($pieza !== null) && ($pieza->modulo !== null) && ($pieza->modulo->proyecto !== null)) {
				return [$pieza->modulo->proyecto->proyecto, $pieza->modulo->proyecto->cliente->nombre_completo];
			} 
			return ['',''];	
		}
		if (Str::contains($reg->auditable_type,'Tapacanto') === true) {
			$tapacanto = Tapacanto::where('id',$reg->auditable_id)->first();
			if (($tapacanto !== null) && ($tapacanto->pieza !== null) && ($tapacanto->pieza->modulo !== null) 
				&& ($tapacanto->pieza->modulo->proyecto !== null)) {
				return [$tapacanto->pieza->modulo->proyecto->proyecto,$tapacanto->pieza->modulo->proyecto->cliente->nombre_completo];
			} 
			return ['',''];		
		}
		
		if (Str::contains($reg->auditable_type,'Modulo') === true) {
			$modulo = Modulo::where('id',$reg->auditable_id)->first();
			if (($modulo !== null) && ($modulo->proyecto !== null)) {
				return [$modulo->proyecto->proyecto, $modulo->proyecto->cliente->nombre_completo];
			} 
			return ['',''];	
		}
		if (Str::contains($reg->auditable_type,'Proyecto') === true) {
			$proyecto = Proyecto::where('id',$reg->auditable_id)->first();
			if ($proyecto !== null) {
				return [$proyecto->proyecto, $proyecto->cliente->nombre_completo];
			} 
			return ['',''];	
		}
	    
	}

	private function getModulo($reg) {
		
        if (Str::contains($reg->auditable_type,'Pieza') === true) {
			$pieza = Pieza::where('id',$reg->auditable_id)->first();
			if (($pieza !== null) && ($pieza->modulo !== null)) {
				return $pieza->modulo->modulo;
			} 
			return '';	
		}
		if (Str::contains($reg->auditable_type,'Tapacanto') === true) {
			$tapacanto = Tapacanto::where('id',$reg->auditable_id)->first();
			if (($tapacanto !== null) && ($tapacanto->pieza !== null) && ($tapacanto->pieza->modulo !== null)) {
				return $tapacanto->pieza->modulo->modulo;
			} 
			return '';		
		}
		
		if (Str::contains($reg->auditable_type,'Modulo') === true) {
			$modulo = Modulo::where('id',$reg->auditable_id)->first();
			if ($modulo !== null) {
				return $modulo->modulo;
			} 
			return '';	
		}
	}

	private function getPieza($reg) {
        if (Str::contains($reg->auditable_type,'Pieza') === true) {
			$pieza = Pieza::where('id',$reg->auditable_id)->first();
			if ($pieza !== null) {
				return $pieza->pieza;
			} 
			return '';	
		}
		if (Str::contains($reg->auditable_type,'Tapacanto') === true) {
			$tapacanto = Tapacanto::where('id',$reg->auditable_id)->first();
			if (($tapacanto !== null) && ($tapacanto->pieza !== null)) {
				return $tapacanto->pieza->pieza;
			} 
			return '';		
		}
	}

	private function getTapacanto($reg) {
		if (Str::contains($reg->auditable_type,'Tapacanto') === true) {
			$tapacanto = Tapacanto::where('id',$reg->auditable_id)->first();
			if (($tapacanto !== null) && ($tapacanto->posicion_tapacanto !== null)) {
				return $tapacanto->posicion_tapacanto->posicion;
			} 
			return '';		
		}
	}

	public function get_sheet_by_usuario_fecha(Request $request)
	{
		$this->validate($request, [
			'usuario_id'   => 'required|integer',
			'fecha_inicio' => 'required',
			'fecha_fin'    => 'required'
		]);

		$data = $request->only(['usuario_id', 'fecha_inicio', 'fecha_fin']);
		$auditoria = new AuditoriaGoogle();
		$query_ok = new AuditoriaGoogle();

		if ($data['usuario_id'] !== 0) {
			$auditoria = $auditoria->where('usuario_id', $data['usuario_id']);
			$query_ok  = $auditoria->where('usuario_id', $data['usuario_id']);
		}

		$records = $auditoria->whereDate('created_at', '>=', $data['fecha_inicio'])
			->whereDate('created_at', '<=', $data['fecha_fin'])
			->with(['usuario' => function ($query) {
				$query->select('id', 'usuario');
			}])
			->get();

		$cantidad_ok = $query_ok->whereDate('created_at', '>=', $data['fecha_inicio'])
			->whereDate('created_at', '<=', $data['fecha_fin'])
			->where('valor', 'like', 'OK_%')
			->with(['usuario' => function ($query) {
				$query->select('id', 'usuario');
			}])
			->count();

		return response()->json(['registros' => $records, 'cantidad_ok' => $cantidad_ok]);
	}

	public function get_by_usuario_fecha_old(Request $request)
	{
		set_time_limit(180);
		$this->validate($request, [
			'area'         => 'nullable|string',
			'corte'        => 'nullable|string',
			'cliente_id'   => 'required|integer',
			'estado'	   => 'required|string',	
			'usuario_id'   => 'required|integer|min:-1',
			'fecha_inicio' => 'required|date',
			'fecha_fin'    => 'required|date'
		]);
		$page = $request->page;
		$data = $request->only(['area','cliente_id','corte','estado','usuario_id', 'fecha_inicio', 'fecha_fin']);
		
/*		$sql = <<<EOD
select a.created_at, u.usuario, m.modulo, pr.proyecto, c.nombre_completo cliente,
case
when locate('estado_id', SUBSTRING_INDEX(new_values, ':', 1)) then 'estado'
when locate('prearmado_estado_id', SUBSTRING_INDEX(new_values, ':', 1)) then 'prearmado'
end campo,
case
when locate('Pieza', a.auditable_type) then 'Pieza'
when locate('Tapacanto', a.auditable_type) then 'Tapacanto'
when locate('Modulo', a.auditable_type) and m.is_cajon=1 then 'Cajon'
when locate('Modulo', a.auditable_type) and m.is_cajon<>1 then 'Modulo'
end area,
p.pieza, e.estado new_estado, e_old.estado old_estado,
pt.posicion posicion_tapacanto
-- , a.*
from	audits a
inner join usuarios u on u.id = a.usuario_id
left join tapacantos t on t.id = case 
when locate('Tapacanto', a.auditable_type) then a.auditable_id
else null
end
left join posiciones_tapacantos pt on pt.id = t.posicion_tapacanto_id
left join piezas p on p.id = case 
when locate('Pieza', a.auditable_type) then a.auditable_id
when locate('Tapacanto', a.auditable_type) then t.pieza_id
else null
end
left join modulos m on m.id = case
when locate('Modulo', a.auditable_type) then a.auditable_id
else p.modulo_id
end
inner join proyectos pr on pr.id = m.proyecto_id
inner join clientes c on c.id = pr.cliente_id
inner join estados e on e.id = SUBSTR(SUBSTRING_INDEX(SUBSTRING_INDEX(new_values, ':', 2), ':', -1), 
-2, length(SUBSTRING_INDEX(SUBSTRING_INDEX(new_values, ':', 2), ':', -1))-1
) 
inner join estados e_old on e_old.id = SUBSTR(SUBSTRING_INDEX(SUBSTRING_INDEX(old_values, ':', 2), ':', -1), 
-2, length(SUBSTRING_INDEX(SUBSTRING_INDEX(old_values, ':', 2), ':', -1))-1
) 
left join action_notes an on an.proyecto_id = pr.id        
where		(a.auditable_type like 'App%Models%Pieza'
or a.auditable_type like 'App%Models%Tapacanto'
or a.auditable_type like 'App%Models%Modulo')
and a.new_values = '{"estado_id":3}'
and date(a.created_at) >= '{$data['fecha_inicio']}' and date(a.created_at) <= '{$data['fecha_fin']}'
EOD;   */
		$columnas = [
			'audits.created_at', 
			'usuarios.usuario', 
			'modulos.modulo', 
			'proyectos.proyecto', 
			'clientes.id',
			'clientes.nombre_completo as cliente',
			'piezas.pieza', 
			'audits.auditable_type',
			'audits.new_values',
			'audits.old_values',
			'modulos.is_cajon',
			'piezas.estado_id as pieza_estado',
			'tapacantos.estado_id as tapacanto_estado',
			'posiciones_tapacantos.posicion as posicion_tapacanto'
		];
		$records = Audit::query()
		->join('usuarios', 'usuarios.id', '=', 'audits.usuario_id')	
		->leftjoin('tapacantos', function($join){
            $join->on('tapacantos.id','=','audits.auditable_id')
            ->where('audits.auditable_type','like', 'App%Models%Tapacanto'); 
        })
		->leftjoin('posiciones_tapacantos','posiciones_tapacantos.id','=','tapacantos.posicion_tapacanto_id')
		->leftjoin('piezas', function($join) {
            $join->on(function($query) {		
				$query->on('piezas.id','=','audits.auditable_id')
				->where('audits.auditable_type','like', 'App%Models%Pieza');
			 });
			$join->orOn(function($query) {
				$query->on('piezas.id','=','tapacantos.pieza_id')
				->where('audits.auditable_type','like', 'App%Models%Tapacanto');
			 }); 
        })
		->leftjoin('modulos', function($join) use($data) {
            $join->on(function($query) {
				$query->on('modulos.id','=','audits.auditable_id')
				->where('audits.auditable_type','like', 'App%Models%Modulo');
				//->where('modulos.modulo','not like','% (2)%');
			 });
			if (($data['area'] !== 'Cajon') &&  ($data['area'] !== 'Modulo')) 
			{
				$join->orOn(function($query) {
					$query->on('modulos.id','=','piezas.modulo_id');
					//->where('modulos.modulo','not like','% (2)%');
				}); 
			}	
        })
		->leftjoin('proyectos','proyectos.id','=','modulos.proyecto_id')
		->leftjoin('clientes', 'clientes.id','=', 'proyectos.cliente_id')
		->where('audits.new_values', $data['estado'])
		->where('usuarios.activo', 1)
		->where(function ($query) {
			$query->where('audits.auditable_type', 'like','App%Models%Pieza')
				->orWhere('audits.auditable_type', 'like','App%Models%Tapacanto')
				->orWhere('audits.auditable_type', 'like','App%Models%Modulo');
		})
		->whereDate('audits.created_at', '>=', $data['fecha_inicio'])
		->whereDate('audits.created_at', '<=', $data['fecha_fin']);
		if (($data['usuario_id'] !== 0)  && ($data['usuario_id'] !== -1)) {
			$records = $records->where('audits.usuario_id',$data['usuario_id']);	
		}
		/*if ($data['usuario_id'] === -1) {
			$records = $records->where('usuarios.activo',1);	
		}*/
		if ($data['cliente_id'] !== 0) {
			$records = $records->where('clientes.id',$data['cliente_id']);	
		}
		if (empty($data['corte']) === false) {
			$piezas = Pieza::where('pieza','like','%' . $data['corte'] . '%')->get(['id']);
			$piezas = $piezas? $piezas->pluck('id') : null; 
			$records = $records->where('audits.auditable_type', 'like','App%Models%Pieza')
			                   ->whereIn('audits.auditable_id',$piezas);
		}
		if ($data['area'] === 'Corte') {
			$records = $records->where('audits.auditable_type', 'like','App%Models%Pieza');
		}
		if ($data['area'] === 'Prearmado') {
			$records = $records->where('audits.auditable_type', 'like','App%Models%Tapacanto')
							   ->where('piezas.estado_id',3)
							   ->where('tapacantos.estado_id',3);
		}
		if ($data['area'] === 'Tapacanto') {
			$records = $records->where('audits.auditable_type', 'like','App%Models%Tapacanto')
							   ->where('piezas.estado_id','<>',3)
							   ->where('tapacantos.estado_id','<>',3);
		}	
		if ($data['area'] === 'Cajon') {
			$records = $records->where('audits.auditable_type', 'like','App%Models%Modulo')
							   ->where('modulos.is_cajon',1);
		}
		if ($data['area'] === 'Modulo') {
			$records = $records->where('audits.auditable_type', 'like','App%Models%Modulo')
							   ->where('modulos.is_cajon','<>',1);
		}
		//dd($records->select($columnas)->toSql());	
		//$estadisticas = $records;
		$records = $records->select($columnas)
						   ->orderBy('created_at','Desc')	
						   ->paginate(20);
		$records->map($this->mapRecordsProcess());
							
		$resumen = [];
		$resumen['cortes'] = 0;
		$resumen['prearmados'] = 0;
		$resumen['tapacantos'] = 0;
		$resumen['cajones'] = 0;
		$resumen['modulos'] = 0;
		$resumen['clientes'] = $this->getCountByAreaType($data,0);
		if ($data['area'] === 'Todas') {
			$resumen['cortes'] = $this->getCountByAreaType($data,1);
			$resumen['prearmados'] = $this->getCountByAreaType($data,2);
			$resumen['tapacantos'] = $this->getCountByAreaType($data,3);
			$resumen['cajones'] = $this->getCountByAreaType($data,4);
			$resumen['modulos'] = $this->getCountByAreaType($data,5);
		}
		if ($data['area'] === 'Corte') {
			$resumen['cortes'] = $this->getCountByAreaType($data,1);
		}
		if ($data['area'] === 'Prearmado') {
			$resumen['prearmados'] = $this->getCountByAreaType($data,2);
		}
		if ($data['area'] === 'Tapacanto') {
			$resumen['tapacantos'] = $this->getCountByAreaType($data,3);
		}
		if ($data['area'] === 'Cajon') {
			$resumen['cajones'] = $this->getCountByAreaType($data,4);
		}
		if ($data['area'] === 'Modulo') {
			$resumen['modulos'] = $this->getCountByAreaType($data,5);
		}
		//dd('resumen', $resumen);
		//dd($records);	
		
		return response()->json(['registros' => $records, 'resumen' => $resumen]);
	}
}
