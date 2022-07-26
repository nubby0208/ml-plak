<?php

namespace App\Http\Controllers;

use DB;
use App\Models\Pieza;
use App\Models\Estado;
use App\Models\Modulo;
use App\Models\Cliente;
use App\Models\Material;
use App\Models\Proyecto;
use App\Models\Tapacanto;
use App\Models\Responsible;
use App\Http\Controllers\StdClass;
use App\Models\Usuario;
use Illuminate\Http\Request;
use App\Models\TipoTapacanto;
use App\Models\PosicionTapacanto;
use App\Models\Calco;
use App\Models\ProyectoMetadata;
use App\Models\MedicionInstalacion;
use App\Models\CapacidadProduccionProyecto;
use Illuminate\Support\Facades\Log;
use App\Models\ProyectoMetadataMaterial;
use App\Models\ActionNotes;
use App\Models\TiempoTrasladoProyecto;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Cache;
use Barryvdh\DomPDF\Facade as PDF;
use Carbon\Carbon;
use Illuminate\Support\Facades\Artisan;

class ProyectoController extends Controller
{
	private $materiales;
	private $tipos_tapacantos;
	private $posiciones_tapacantos;
	const CACHE_TIME = 180;

	public function __construct()
	{
		$this->materiales = Material::all();
		$this->tipos_tapacantos = TipoTapacanto::all();
		$this->posiciones_tapacantos = PosicionTapacanto::all();
	}

	/**
	 * Método para guardar toda la información acerca de un nuevo proyect, esto incluye:
	 * piezas, cliente, y proyecto como tal.
	 * @param Request $request
	 * @return json
	 */
	public function save_all(Request $request)
	{
		$this->validate($request, [
			'info'    => 'required|array',
			'parts'   => 'required|array',
			'modules' => 'required|array',
			'info.name'                  => 'required|string',
			'info.address'               => 'required|string',
			'info.phone'                 => 'required|string',
			'info.total'                 => 'required|string',
			'info.senia'                 => 'required|string',
			'info.mueble'                => 'required|string',
			'info.comentarioInstalacion' => 'required|string',
		]);

		DB::beginTransaction();

		try {
			// Estado inicial de piezas
			$estado_inicial = Estado::where('estado', 'Seleccione un estado')->firstOrFail()->id;
			// Datos cliente
			$cliente_data = [
				'nombre_completo'        => $request->input('info.name'),
				'telefono'               => $request->input('info.phone'),
				'direccion'              => $request->input('info.address'),
			];

			// Objeto para guardar a através del modelo
			$cliente = new Cliente;
			$cliente->fill($cliente_data);
			$cliente->save();

			// Cambiar si cambia formato de envio de fecha-hora
		  /*	$fecha_instalacion = \DateTime::createFromFormat(
				'd/m/Y H:i',
				$request->input('info.fechaInstalacion') . ' ' . $request->input('info.horaInstalacion')
			);*/
      //Agregado por Tobias por tema de compatibilidad
      //dd($request->input('proyectoid'));
      $reg=MedicionInstalacion::where('token_project', '=', $request->input('info.token_project'))
                              ->where('tipo_medinst',1)
                              ->count();
      if ($reg==0) {
        throw new ModelNotFoundException('Fecha de Instalación no encontrado para el Proyecto: ' . $request->input('proyectoid'));
      }

      $reg = MedicionInstalacion::where('token_project', '=', $request->input('info.token_project'))
                                ->where('tipo_medinst',1)
                                ->orderBy('fecha_medinst','ASC')->first();
      //dd($reg);
      $fecha_instalacion = $reg->fecha_medinst;
      //dd("Proyecto: " . $request->input('proyectoid') . " Fecha Inst: ", $fecha_instalacion);
      //---------------------------------------------------------------
			/*Esto es necesario ya que si no se exporta ninguna imagen en el 3d no se genera el token_project*/
			if (!$request->input('info.token_project')) {
				$milisegundos = round(microtime(true) * 1000);
				$token_project = md5($request->input('info.mueble') . $milisegundos);
			} else {
				$token_project = $request->input('info.token_project');
			}
			// Datos proyecto
			$proyecto_data = [
				'proyecto'               => $request->input('info.mueble'),
				'senia'                  => $request->input('info.senia'),
				'valor_total'            => $request->input('info.total'),
				'instalacion_comentario' => $request->input('info.comentarioInstalacion'),
				'instalacion_fecha'      => $fecha_instalacion, // Formato usado en la tabla ->format('Y-m-d H:i')
				'cliente_id'             => $cliente->id,
				'token_project'          => $token_project
			];

			// Objeto para guardar a através del modelo
			$proyecto = new Proyecto;
			$proyecto->fill($proyecto_data);
			$proyecto->save();

			$piezas_raw  = $request->input('parts');
			$piezas_data = [];
			$tapacantos_data = [];
			$calcos_collect = Collect($request->input('calcos'));
			$calcos_data = [];

			$piezas_collect = Collect($piezas_raw);
			$modulos_raw = $piezas_collect->groupBy('Module')->keys()->toArray();
			$modules_raw = Collect($request->input('modules'));
			$piezas_cajones = $piezas_collect->filter(function ($item) {
				return stristr($item['Name'], 'Cajon ');
			});

			$contador_modulos_sin_id = 0;
			$cajones_raw = $piezas_cajones->map(function ($item) use ($proyecto) {
				Log::info($item);
				$cajon_explode = explode('Cajon ', $item['Name']);

				// var_dump($item['Name']);
				return new Modulo([
					'modulo'      => 'Cajon ' . $cajon_explode[count($cajon_explode) - 1],
					'modulo_id'   => explode(' ', $item['Module'])[1],
					'estado_id'   => 1,
					'is_cajon'    => true,
					'proyecto_id' => $proyecto->id,
					'id_aux' => empty($item['_Id']) ? $contador_modulos_sin_id : $item['_Id'],
				]);

				if (empty($item['_Id'])) {
					$contador_modulos_sin_id += 1;
				}
			});
			$modulos_data = [];
			$cajones_data = [];

			$cajones = $cajones_raw->unique(function ($item) {
				return $item['modulo'] . $item['modulo_id'];
			});

			foreach ($cajones as $index => $value)
				$cajones_data[] = $value;


			foreach ($modulos_raw as $value) {
				$modulo = $modules_raw->where('module', $value)->first();
				$armado = $modulo['armado'];
				$num_module  = explode(' ', $value)[1];
				$modulos_data[] = new Modulo([
					'modulo'      => $num_module,
					'estado_id'   => $estado_inicial,
					'armado'      => $armado,
					'descripcion' => empty($modulo['descripcion']) ? null : $modulo['descripcion'],
					'comentario'  => empty($modulo['comentario']) ? null : $modulo['comentario'],
				]);
			}

			$modulos = $proyecto->modulos()->saveMany($modulos_data);
			$modulos_collect = Collect($modulos);
      $modulosDef = $modulos_collect; //Para utilizar en la exportacion de la notas de acción Tobias
			$cajones_new = [];

			foreach ($cajones->groupBy('modulo_id') as $index => $value) {
				$cajones_new[] = $modulos_collect->where('modulo', $index)->first()
					->cajones()->saveMany($value);
			}
			$cajones = [];

			foreach ($cajones_new as $depth_1)
				foreach ($depth_1 as $depth_2)
					$cajones[] = $depth_2;

			$modulos = array_merge($modulos, $cajones);

			// Creación de array múltimple para guardar a través de una instacia del modelo
			foreach ($piezas_collect->sortBy('Module')->sortBy('Name')->values()->all() as $index => $value) {
				$num_module = '';

				$num_module  = explode(' ', $value['Module'])[1];

				if (stristr($value['Name'], 'Cajon ')) {
					$cajon_explode = explode('Cajon ', $value['Name']);
					$num_module = 'Cajon ' . $cajon_explode[count($cajon_explode) - 1] . ' ' . $num_module;
				}

				// var_dump($value['Material']);
				$material_id = 1;

				if (array_key_exists('Material', $value)) {
					$material_by_value = $this->materiales->where('material', $value['Material'])->first();
					if (!is_null($material_by_value)) {
						$material_id = $material_by_value->id;
					}
				}

				$piezas_data[] = [
					'pieza'               => $value['Name'],
					'modulo_id'           => $num_module,
					'cantidad'            => $value['Count'],
					'posicion_x'          => $value['X'],
					'posicion_y'          => $value['Y'],
					'posicion_z'          => $value['Z'],
					'lveta'               => $value['LVeta'],
					'aveta'               => $value['AVeta'],
					'espesor'             => $value['Espesor'],
					'orientacion'         => $value['Orientacion'],
					'material_id'         => $material_id,
					'estado_id'           => $estado_inicial,
					'prearmado_estado_id' => $estado_inicial,
					'comentario'          => empty($value['Comentario']) ? null : $value['Comentario'],
					'id_aux'              => empty($value['_Id']) ? 0 : $value['_Id'],
				];

				foreach ($value['tapacantos'] as $posicion => $tapacanto) {
					if (!empty($tapacanto) && is_array($tapacanto) && (count($tapacanto) > 0)) {
						// $temp_tapacanto = substr($tapacanto, 0, -1);
						$posicion_id = $this->posiciones_tapacantos->where('posicion', ucfirst(strtolower($posicion)))->first()->id;
						// $material_id = $tapacanto['tipo_material_id'];
						// $tipo_id = $this->tipos_tapacantos->where('tipo', $temp_tapacanto)->first()['id'];
						//$material_id = $this->tipos_tapacantos->where('tipo', $temp_tapacanto)->first()['id'];
						$material_id = $this->materiales->where('material', (array_key_exists('material', $tapacanto) ? $tapacanto['material'] : $tapacanto['nombre']))->first()['id'];

						//var_dump($tapacanto);
						//$material_by_value = $this->materiales->where('material', $value['Material'])->first();

						$tapacantos_data[] = [
							'posicion_tapacanto_id' => $posicion_id,
							'material_id'           => $material_id,
							'pieza_id'              => $index,
							// 'tipo_tapacanto_id'     => 1,
						];
					}
				}
			}

			$piezas_collect = Collect($piezas_data);
			$piezas = [];
			$modulos_collect = Collect($modulos);

			foreach ($modulos as $index => $value) {
				$module_name = $value['modulo'];

				if (stristr($value['modulo'], 'Cajon ')) {
					$temp_modulo_id = $modulos_collect->where('id', $value['modulo_id'])->first()->modulo;
					$module_name .= ' ' . $temp_modulo_id;
				}

				$to_save = $piezas_collect->where('modulo_id', $module_name)
					->map(function ($item, $key) {
						return new Pieza($item);
					});

				$saved = $value->piezas()->saveMany($to_save->all());

				$piezas = array_merge($piezas, $saved);
			}

			foreach ($piezas as $pieza) {
				if ((int) $pieza->id_aux > 0) {
					$temp = $calcos_collect->where('id', (int) $pieza->id_aux)->first();
					if ($temp) {
						foreach ($temp['calcos'] as $calco) {
							$calcos_data[] = [
								'calco'      => $calco,
								'pieza_id'   => $pieza->id,
								'created_at' => new \DateTime(),
								'updated_at' => new \DateTime()
							];
						}
					}
				}
			}

			$calcos = Calco::insert($calcos_data);

			$piezas_modulos = Collect($piezas)->sortBy('modulo_id')->sortBy('pieza')->values()->all();

			foreach ($tapacantos_data as $index => $value) {
				$tapacantos_data[$index]['pieza_id']   = $piezas_modulos[$value['pieza_id']]->id;
				$tapacantos_data[$index]['estado_id']  = $estado_inicial;
				$tapacantos_data[$index]['created_at'] = new \DateTime();
				$tapacantos_data[$index]['updated_at'] = new \DateTime();
			}

			$tapacantos = new Tapacanto;
			$tapacantos->insert($tapacantos_data);

			$materiales_metadata_raw = [];
			$materiales_metadata = [];
			$metadatos = [];

			foreach ($request->input('metadata') as $index => $row) {
				if ($row['key'] == 'materiales') {
					$materiales_metadata_raw = $row['value'];
				} else {
					$metadatos[] = $row;
				}
			}

			foreach ($materiales_metadata_raw as $material) {
				$materiales_metadata[] = new ProyectoMetadataMaterial([
					'estado_id' => 9,
					'material'  => json_encode($material),
				]);
			}

			$proyecto->metadata()->save(new ProyectoMetadata([
				'metadata' => json_encode($metadatos)
			]));

			$proyecto->metadata_materiales()->saveMany($materiales_metadata);
      //----------------------Mediciones Instalaciones ------------------------------
      //Agregado Por Tobias Bolivar
      //Fecha: 25/06/2021
      //Borrar cualquier version existente por si hay una nueva exportacion de un mismo proyecto
      /*DB::table('medicion_instalacion_proyecto')
      ->where('proyecto_json_id', $request->input('proyectoid'))
      ->delete();*/

      $medinsts=MedicionInstalacion::where('token_project', '=', $token_project)
      ->orderBy('fecha_medinst','ASC')->get();
      foreach ($medinsts as $medinst)
      {
          $data = [
              'proyecto_id' =>$proyecto->id,
              'exported' => 1,
            ];
          $medinst->update($data);
      }
      //----------------------Capacidad Produccion Proyecto ------------------------------
      //Agregado Por Tobias Bolivar
      //Fecha: 25/06/2021

      $caps=CapacidadProduccionProyecto::where('token_project', '=', $token_project)
      ->get();
      foreach ($caps as $cap)
      {
          $data = [
              'proyecto_id' =>$proyecto->id,
              'exported' => 1,
            ];
          $cap->update($data);
      }
      //-----------------------Action Notes -----------------------------------------
      //Agregado Por Tobias Bolivar
      //Fecha: 21/05/2021

      //Exportacion de las notas especificas por módulo
      foreach ($modulosDef as $mod)
      {
        $notes = ActionNotes::where('token_project', '=', $token_project)
                            ->where('orig_modulo_id','=',$mod->modulo)->get();

        foreach ($notes as $note)
        {
            $data = [
                'modulo_id' => $mod->id,
                'proyecto_id' =>$proyecto->id,
                'exported' => 1,
              ];
            $note->update($data);
        }
      }
      //Exportacion de las notas globales
      $notes = ActionNotes::where('token_project', '=', $token_project)
                          ->where('orig_modulo_id','=',0)->get();

      foreach ($notes as $note)
      {
          $data = [
              'modulo_id' => 0,
              'proyecto_id' =>$proyecto->id,
              'exported' => 1,
            ];
          $note->update($data);
      }

       //----------------------Tiempo de Traslado Proyecto ------------------------------
      //Agregado Por Tobias Bolivar
      //Fecha: 26/09/2021
      $traslados=TiempoTrasladoProyecto::where('token_project', '=', $token_project)
      ->get();
      foreach ($traslados as $traslado)
      {
          $data = [
              'proyecto_id' =>$proyecto->id,
              'exported' => 1,
            ];
          $traslado->update($data);
      }
      //-----------------------------------------------------
      $this->clear_cache();
			DB::commit();
		} catch (ModelNotFoundException $e) {
      DB::rollback();
      return response()->json(['success' => false,'error' => $e->getMessage()],404);
    } catch (Exception $e) {
      DB::rollback();
      return response()->json(['success' => false,'error' => $e->getMessage()],500);
    }
		return response()->json(['success' => true],200);
	}

	public function get_all($proyecto_id)
	{
		$proyecto = Proyecto::where('id', $proyecto_id)
			->with(['modulosfiltrados' => function ($query) {
				$query->select('*')	
					->with(['modulo_parent'])
					->with('estado')
					->with(['piezas' => function ($query) {
						// $query->select('id', 'pieza', 'material_id', 'estado_id', 'modulo_id')
						$query->select('*')
							->with(['estado'])
							->with(['prearmado'])
							->with(['modulo' => function ($query) {
								$query->select('*')->with(['modulo_parent']);     
							}])
							->with(['material' => function ($query) {
								$query->select('id', 'material');
							}])
							->with(['tapacantos' => function ($query) {
								$query->select('*')
									->with(['material', 'posicion_tapacanto', 'estado']);
							}])
							->orderBy('id_aux', 'desc');
					}])
					->orderBy('id', 'desc');
			}])
			->with(['modulos' => function ($query) {
				$query->select('*')
				    //->where('modulo','not like','% (2)%')	
					->with(['modulo_parent'])
					->with('estado')
					->with(['piezas' => function ($query) {
						// $query->select('id', 'pieza', 'material_id', 'estado_id', 'modulo_id')
						$query->select('*')
							->with(['estado'])
							->with(['prearmado'])
							->with(['modulo' => function ($query) {
								$query->select('*')->with(['modulo_parent']);     
							}])
							->with(['material' => function ($query) {
								$query->select('id', 'material');
							}])
							->with(['tapacantos' => function ($query) {
								$query->select('*')
									->with(['material', 'posicion_tapacanto', 'estado']);
							}])
							->orderBy('id_aux', 'desc');
					}])
					->orderBy('id', 'desc');
			}])
			->with(['cliente'])
			->with(['responsible' => function ($query) {
				$query->select('*')->with(['usuario']);
			}])
			->firstOrFail();

		return response()->json(['proyecto' => $proyecto]);
	}

	public function exportarPdfGenerar(Request $request)
	{
		// return response()->json($request);
		$instalaciones = $request->instalaciones;
		$mediciones = $request->mediciones;
		$preguntas = $request->preguntas;
		$proyect_data = json_decode(json_decode($request->proyecto));
		$fecha = date("Y-m-d");
		$titulo = $proyect_data->info->name." ".$proyect_data->info->mueble;
		$id = $proyect_data->info->name."-".$proyect_data->info->token_project;
		// return response()->json($proyect_data->info->name);
		// return view('pdf.generar', compact(['data', 'fecha']));
		// $pdf = PDF::loadView('pdf.generar', compact(['proyect_data', 'fecha']))->stream("temp.pdf");
		$pdf = PDF::loadView('pdf.generar', compact(['proyect_data', 'instalaciones', 'mediciones', 'fecha', 'preguntas', "titulo"]))->stream();
		// $pdf = base64_encode(file_get_contents(storage_path() . "/app/".$id.".pdf"));
		return response()->json(["ok" => true, "pdf" => base64_encode($pdf)]);
	}

	public function update(Request $request)
	{
		$this->validate($request, [
			'info'  => 'required|array',
			'parts' => 'required|array',
			'info.name'                  => 'required|string',
			'info.address'               => 'required|string',
			'info.phone'                 => 'required|string',
			'info.total'                 => 'required|string',
			'info.senia'                 => 'required|string',
			'info.mueble'                => 'required|string',
			'info.comentarioInstalacion' => 'required|string',
			'info.fechaInstalacion'      => 'required|date_format:d/m/Y',
			'info.horaInstalacion'       => 'required|date_format:H:i',
		]);


		DB::beginTransaction();

		try {
			// Datos cliente
			$cliente_data = [
				'nombre_completo'        => $request->input('info.name'),
				'telefono'               => $request->input('info.phone'),
				'direccion'              => $request->input('info.address')
			];

			// Objeto para guardar a através del modelo
			$cliente = Cliente::find($request->input('id_cliente'));
			$cliente->fill($cliente_data);
			$cliente->save();

			// Cambiar si cambia formato de envio de fecha-hora
			$fecha_instalacion = \DateTime::createFromFormat(
				'd/m/Y H:i',
				$request->input('info.fechaInstalacion') . ' ' . $request->input('info.horaInstalacion')
			);

			// Datos proyecto
			$proyecto_data = [
				'proyecto'               => $request->input('info.mueble'),
				'senia'                  => $request->input('info.senia'),
				'valor_total'            => $request->input('info.total'),
				'instalacion_comentario' => $request->input('info.comentarioInstalacion'),
				'instalacion_fecha'      => $fecha_instalacion->format('Y-m-d H:i'), // Formato usado en la tabla
				'cliente_id'             => $cliente->id,
				//'token_project'          => $request->input('info.token_project'),
			];

			// Objeto para guardar a através del modelo
			$proyecto = Proyecto::find($request->input('id_proyecto'));
			$proyecto->fill($proyecto_data);
			$proyecto->save();

			$piezas_raw  = $request->input('parts');
			$piezas_data = [];
			$tapacantos_data = [];

			$piezas_collect = Collect($piezas_raw);
			$modulos_raw = $piezas_collect->groupBy('Module')->keys()->toArray();
			$modulos_data = [];

			foreach ($modulos_raw as $value) {
				$num_module  = explode(' ', $value)[1];
				$modulos_data[] = new Modulo([
					'modulo'    => $num_module,
					'estado_id' => 1
				]);
			}

			/*Limpiando la data*/
			foreach ($proyecto->modulos as $proyecto_modulo) {
				foreach ($proyecto_modulo->piezas as $modulo_pieza) {
					$listadotapacantos = Tapacanto::where('pieza_id', $modulo_pieza->id)->get(['id']);
					Tapacanto::destroy($listadotapacantos->toArray());
				}

				$listadoPiezas = Pieza::where('modulo_id', $proyecto_modulo->id)->get(['id']);
				Pieza::destroy($listadoPiezas->toArray());
			}

			$listadoModulos = Modulo::where('proyecto_id', $proyecto->id)->get(['id']);
			Modulo::destroy($listadoModulos->toArray());

			/*Limpiando la data*/

			$modulos = $proyecto->modulos()->saveMany($modulos_data);

			// Creación de array múltimple para guardar a través de una instacia del modelo
			foreach ($piezas_collect->sortBy('Module')->sortBy('Name')->values()->all() as $index => $value) {
				$num_module  = explode(' ', $value['Module'])[1];
				// var_dump($value['Material']);
				$material_id = (array_key_exists('Material', $value)) ? $this->materiales->where('material', $value['Material'])->first()->id : 1;

				$piezas_data[] = [
					'pieza'               => $value['Name'],
					'modulo_id'           => $num_module,
					'cantidad'            => $value['Count'],
					'posicion_x'          => $value['X'],
					'posicion_y'          => $value['Y'],
					'posicion_z'          => $value['Z'],
					'lveta'               => $value['LVeta'],
					'aveta'               => $value['AVeta'],
					'espesor'             => $value['Espesor'],
					'orientacion'         => $value['Orientacion'],
					'material_id'         => $material_id,
					'comentario'		  => empty($value['Comentario']) ? null : $value['Comentario'],
					'estado_id'           => 1,
					'prearmado_estado_id' => 1,
				];

				foreach ($value['tapacantos'] as $posicion => $tapacanto) {
					if (!empty($tapacanto) && strlen($tapacanto) > 0) {
						$temp_tapacanto = substr($tapacanto, 0, -1);
						$posicion_id    = $this->posiciones_tapacantos->where('posicion', ucfirst(strtolower($posicion)))->first()->id;
						$tipo_id        = $this->tipos_tapacantos->where('tipo', $temp_tapacanto)->first()->id;

						$tapacantos_data[] = [
							'posicion_tapacanto_id' => $posicion_id,
							'tipo_tapacanto_id'     => $tipo_id,
							'pieza_id'              => $index,
						];
					}
				}
			}

			$piezas_collect = Collect($piezas_data);
			$piezas = [];

			foreach ($modulos as $index => $value) {
				$to_save = $piezas_collect->where('modulo_id', $value['modulo'])
					->map(function ($item, $key) {
						return new Pieza($item);
					});

				$saved = $value->piezas()->saveMany($to_save->all());

				$piezas = array_merge($piezas, $saved);
			}

			$piezas_modulos = Collect($piezas)->sortBy('modulo_id')->sortBy('pieza')->values()->all();

			foreach ($tapacantos_data as $index => $value) {
				$tapacantos_data[$index]['pieza_id']   = $piezas_modulos[$value['pieza_id']]->id;
				$tapacantos_data[$index]['estado_id']  = 1;
				$tapacantos_data[$index]['created_at'] = new \DateTime();
				$tapacantos_data[$index]['updated_at'] = new \DateTime();
			}

			$tapacantos = new Tapacanto;
			$tapacantos->insert($tapacantos_data);
      $this->clear_cache();
			DB::commit();
		} catch (Exception $e) {
			DB::rollback();
		}
	}

	public function all()
	{
		$proyectos = Proyecto::orderBy('id', 'desc')->first();

		return response()->json(['proyecto' => $proyectos]);
	}

	public function allProyects(Request $request)
	{
		$data = json_decode(json_encode($request->all()));
		$page = $data->page;
		$search = $data->search;

		$records = Proyecto::select(['*'])
			->with(['cliente'])
			->when($search != "" && $search != null, function ($query) use ($search) {
				$query->where('proyecto', 'like', "%$search%");
			})
			->paginate(20, ['*'], 'page', $page);
		$pageLimit = ceil($records->total() / 20);

		return response()->json(['proyectos' => $records]);
	}

	public function allProyectsWithComponents()
	{
		$proyectos = Proyecto::with(['cliente'])->get();
		$toArray = [];
		// ->find(108)

		foreach ($proyectos as $index => $element) {
			$element->setAppends(['progreso_total']);
			$temp = $element->toArray();
			unset($temp['modulos']);
			unset($temp['id']);
			unset($temp['cliente']['proyectos']);
			$toArray[] = $temp;
		}

		return response()->json(['proyectos' => $toArray]);
	}

	public function allProyectsOpenWithComponents()
	{
		$proyecto = Proyecto::select(['*'])
			->with(['modulos' => function ($query) {
				$query->select('*')
					->with(['piezas' => function ($query) {
						// $query->select('id', 'pieza', 'material_id', 'estado_id', 'modulo_id')
						$query->select('piezas.*')
							->with(['estado'])
							->with(['prearmado'])
							->with(['modulo'])
							->with(['material' => function ($query) {
								$query->select('id', 'material');
							}])
							->with(['tapacantos' => function ($query) {
								$query->select('*')
									->with(['tipo_tapacanto', 'posicion_tapacanto']);
							}]);
					}]);
			}])
			->with(['cliente'])
			->with(['assignPiezas'])
			->with(['assignPrearmado'])
			->with(['assignCajones'])
			->with(['assignTapacantos'])
			->with(['assignModulos'])
			->orderBy('instalacion_fecha', 'asc')
			->get();

		return response()->json(['proyectos' => $proyecto]);
	}

	public function assigns($id, Request $request)
	{
		$proyecto = Proyecto::where('id', $id)
			->firstOrFail();

		$proyecto->update($request->all());
    $this->clear_cache();
		return response()->json($proyecto);
	}

	public function update_proyecto(Request $request, $id)
	{
		$propyecto = Proyecto::find($id);
		$data2update = $request->all();

		if (array_key_exists('activo', $data2update) && $data2update['activo'] == 'null') {
			$data2update['activo'] = null;
		}

		$propyecto->update($data2update);
    $this->clear_cache();
		return response()->json(['status' => true]);
	}

	public function show($id)
	{
		$proyecto = Proyecto::where('id', $id)
			->with(['cliente'])
			->first();

		if ($proyecto) {
			return response()->json(['success' => true, 'proyecto' => $proyecto]);
		}

		return response()->json(['success' => false, 'msg' => '¡Proyecto no encontrado!']);
	}

	public function delete($id)
	{
		DB::beginTransaction();
		try {
			$proyecto = Proyecto::findOrFail((int) $id);
			foreach ($proyecto->modulos()->orderBy('id', 'desc')->get() as $modulo)
			{
				foreach ($modulo->piezas as $pieza) {
					// echo response()->json($pieza);
					if ($pieza->tapacantos()->count() > 0) { 
					  	$pieza->tapacantos()->delete();
					} 

					if ($pieza->calcos()->count() > 0) { 
						$pieza->calcos()->delete();
					}

					$pieza->punto_pieza()->each(function ($punto_pieza) {
						$punto_pieza->pieza()->dissociate();
						$punto_pieza->save();
					});
				}
				$modulo->punto_pieza()->each(function ($punto_pieza) {
					$punto_pieza->modulo()->dissociate();
					$punto_pieza->save();
				});
				if ($modulo->piezas()->count() > 0) {
				   	$modulo->piezas()->delete();	
				}
				if ($modulo->cajones()->count() > 0) {
					$modulo->cajones()->delete();
				}	
			}
			$proyecto->modulos()->delete();
			$proyecto->metadata()->delete();
			$proyecto->metadata_materiales()->delete();
			$proyecto->responsible()->delete();
			$proyecto->actionnotes()->delete();
			$proyecto->medicioninstalacion()->delete();
			$proyecto->capacidadproduccion()->delete();
			$proyecto->capacidadproduccionproyecto()->delete();
			$proyecto->delete();
			DB::commit();
			
			$this->clear_cache();
			return response()->json(['status' => true]);
		} catch (Exception $e) {
			DB::rollback();
			return response()->json(['status' => false]);
		}
	}

	public function desactivar($id)
	{
		DB::beginTransaction();
		try {
			$proyecto = Proyecto::findOrFail((int) $id);
			$proyecto->medicioninstalacion()->delete();
			$data = [
				'proyecto' => 'DESACTIVADO (' . $proyecto->proyecto . ')',
				'instalacion_comentario' => 'DESACTIVADO',
				'token_project' => 'DESACTIVADO',	
				'instalacion_fecha' => '1900-01-01 00:00:00',
			];
			$proyecto->update($data);
			DB::commit();
			
			return response()->json(['status' => true]);	
		} catch (Exception $e) {
			DB::rollback();
			return response()->json(['status' => false]);
		}
	}	

	public function get_calcos($id)
	{
		$calcos = [];

		$modulos = Proyecto::with(['modulos' => function ($query) {
			$query->with(['piezas' => function ($query) {
				$query->with(['calcos']);
			}]);
		}])
			->findOrFail((int) $id)->modulos;

		foreach ($modulos as $modulo) {
			foreach ($modulo->piezas as $pieza) {
				foreach ($pieza->calcos as $calco) {
					$calcos[] = array_merge($calco->toArray(), ['id_aux' => $pieza->id_aux, 'pieza' => $pieza->pieza]);
				}
			}
		}

		return response()->json(['calcos' => $calcos]);
	}

	public function get_between_dates($date_begin, $date_end, $forzar_control)
	{
		if (Cache::has($date_begin . "_" . $date_end . "_" . $forzar_control ."-PGBD")){
			$info= Cache::get($date_begin . "_" . $date_end . "_" . $forzar_control ."-PGBD");
      $toArray = $info['toarray'];
      $datos = $info['datos'];
			return response()->json(['success' => true,'proyectos' => $toArray,'proyevent' => $datos],200);
		}
		$date_begin = $date_begin . " 00:00:00"; // Concatena con hora de inicio del día
		$date_end = $date_end . " 23:59:59"; // Concatena con hora de fin del día

    $proyinsts=MedicionInstalacion::select('proyecto_id')
                                  ->distinct()
                                  ->where('tipo_medinst',1)
                                  ->whereBetween('fecha_medinst', [$date_begin, $date_end])
                                  ->get();

		$proyectos = Proyecto::with(['cliente'])
                         ->with(['medicioninstalacion' => function ($query) {
                            $query->where('tipo_medinst',1)
                                  ->orderBy('fecha_medinst', 'asc');
                          }])
                        ->whereBetween('instalacion_fecha', [$date_begin, $date_end])
                        ->orWhereIn('id',$proyinsts->pluck('proyecto_id'))
                        ->get();
		$toArray = [];
		// ->find(108)
    $data = [];
    $datos = collect([]);
		foreach ($proyectos as $index => $element) {
			$element->setAppends(['progreso_total']);
			$proy = $element->toArray();
			unset($proy['modulos']);
			unset($proy['cliente']['proyectos']);
			$toArray[] = $proy;
      $total = $proy['progreso_total']['total'];
      $stockPorcentaje = $proy['progreso_total']['porcentaje_stock'];
	  $control = $this->getControlByProy($element->id);

      $bolitas = collect([]);

      if ($stockPorcentaje > 1 && $stockPorcentaje < 70)
        $bolitas->push("#9E9E1F");
      else if ($stockPorcentaje > 70 && $stockPorcentaje < 100)
        $bolitas->push("#CFCF26");
      else if ($stockPorcentaje > 99) $bolitas->push("#05A730");
      else $bolitas->push("#337ab7");

      if ($total > 1 && $total < 70) $bolitas->push("#9E9E1F");
      else if ($total > 70 && $total < 100) $bolitas->push("#CFCF26");
      else if ($total > 99) $bolitas->push("#05A730");
      else $bolitas->push("#337ab7");

	  if ($total > 99 || $forzar_control == 1){
		if ($control > 1 && $control < 70) $bolitas->push("#9E9E1F");
		else if ($control > 70 && $control < 100) $bolitas->push("#CFCF26");
		else if ($control > 99) $bolitas->push("#05A730");
		else $bolitas->push("#337ab7");		
	  }	

      $itemBolitas = '<div class="col-sm-5" style="display: flex !important;">';
      foreach ($bolitas as $index => $item) {
        $itemBolitas .=
          '<div class="fc-daygrid-event-dot" style="text-align: center !important; border-color: ' . $item . '"  style="display: inline-block !important"></div>';
      }
      $itemBolitas .= '</div>';
      if ($proy['finalizado'] == 0 && $proy['observaciones'] != null) {
        $itemBolitas = '<div class="col-sm" style="border-color: red width:25px" style="margin-left:3px;  display:block !important">' .
                    '<img width="12px" style="margin:5px !important;padding:0px !important" src="https://upload.wikimedia.org/wikipedia/commons/c/c9/Exclamation_flat_icon.svg"></img></div>';
      }
      if ($proy['finalizado'] != 0) {
        $itemBolitas = '<div class="col-sm" style="border-color: green; width:25px" style="margin-left:3px;  display:block !important">' .
                    '<img width="14px" style="margin:5px !important;padding:1px !important" src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Check_green_icon.svg"></img></div>';
      }

      $i = 0;
      $detail = "";
      if (count($proy['medicioninstalacion']) == 0)
      {
        $data = [
            "id" => $proy['id'],
            "title" => $proy['cliente']['nombre_completo'] . " - " .  $proy['proyecto'],
            "start" => Carbon::parse($proy['instalacion_fecha'])->format('Y-m-d H:m'),
            "end" => Carbon::parse($proy['instalacion_fecha'])->format('Y-m-d H:m'),
            "classNames" => ["stockClass", "eventBackg"],
            "backgroundColor" => $bolitas[0],
            "meta" => $proy,
            "customHtml" => '<div class="container" style="padding:0px !important;">' .
            '<div class="row">' .
            '<div class="col-sm-7"><span style="white-space:normal; display:block !important;word-wrap:break-word !important; font-size:9px;">' .
            $proy['cliente']['nombre_completo'] . " - " . $proy['proyecto'] . '</span></div>' . $itemBolitas .
            '</div></div>',
            ];
        $datos->push($data);
      }
      else
      {
        foreach ($proy['medicioninstalacion'] as $index => $inst) {
          if ($inst !== null)
          {
            $i++;
            if ($i>1)
              $detail = "DIA " . $i . ":";
            $data = [
              "id" => $proy['id'],
              "title" => $proy['cliente']['nombre_completo'] . " - " .  $proy['proyecto'],
              "start" => Carbon::parse($inst['fecha_medinst'])->format('Y-m-d H:m'),
              "end" => Carbon::parse($inst['fecha_medinst'])->format('Y-m-d H:m'),
              "classNames" => ["stockClass", "eventBackg"],
              "backgroundColor" => $bolitas[0],
              "meta" => $proy,
              "customHtml" => '<div class="container" style="padding:0px !important;">' .
              '<div class="row">' .
              '<div class="col-sm-7"><span style="white-space:normal; display:block !important;word-wrap:break-word !important; font-size:9px;">' .
              $detail . ' ' . $proy['cliente']['nombre_completo'] . " - " . $proy['proyecto'] . '</span></div>' . $itemBolitas .
              '</div></div>',
              ];
            $datos->push($data);
          }
        }
      }

		}

    $info['toarray'] = $toArray;
    $info['datos'] = $datos;
		Cache::put($date_begin . "_" . $date_end . "_" . $forzar_control ."-PGBD", $info, Self::CACHE_TIME);
		return response()->json(['success' => true,'proyectos' => $toArray,'proyevent' => $datos]);
	}
    
    private function getControlByProy($proyectoId)
	{
		$totalReg = 0;
		$totalRegControl = 0;
		$control = 0;

		$moduloArmadosCount = Modulo::where('proyecto_id', $proyectoId)
								->where('armado','Si')
								//->where('modulo','not like','% (2)%')
								->count();
		$totalReg += $moduloArmadosCount;

		$moduloArmadosControlCount = Modulo::where('proyecto_id', $proyectoId)
								->where('armado','Si')
								->where('control_estado_id',3)
								//->where('modulo','not like','% (2)%')
								->count();
		$totalRegControl += $moduloArmadosControlCount;

		$moduloNoArmadosCount = Modulo::where('proyecto_id', $proyectoId)
								->where('armado','No')
								//->where('modulo','not like','% (2)%')	
								->count();
		$totalReg += $moduloNoArmadosCount;						

		$moduloNoArmadosControlCount = Modulo::where('proyecto_id', $proyectoId)
								->where('armado','No')
								//->where('modulo','not like','% (2)%')	
								->where('control_estado_id',3)
								->count();						
		$totalRegControl += $moduloNoArmadosControlCount;

		$piezasVanSueltasCount = Pieza::join('modulos','modulos.id','=','piezas.modulo_id')
								->where('modulos.proyecto_id', $proyectoId)
								//->where('modulos.modulo','not like','% (2)%')	
								->where('va_suelta',1)
								->count();		
	   // $totalReg += $piezasVanSueltasCount;								
		
		$piezasVanSueltasControlCount = Pieza::join('modulos','modulos.id','=','piezas.modulo_id')
								->where('modulos.proyecto_id', $proyectoId)
								//->where('modulos.modulo','not like','% (2)%')	
								->where('va_suelta',1)
								->where('piezas.control_estado_id',3)
								->count();
		//$totalRegControl += $piezasVanSueltasControlCount;

		if ($totalReg > 0) {
			$control = ($totalRegControl * 100) / $totalReg;
			$control = number_format($control, 2, '.', ',');
		}	

		return $control;						
	}

	public function get_metadata($id)
	{
		$proyecto = Proyecto::findOrFail((int) $id);
		$metadata = ($proyecto->metadata) ? json_decode($proyecto->metadata->metadata, true) : [];
		$metadata_materiales_raw = ($proyecto->metadata_materiales) ? $proyecto->metadata_materiales : [];
		$metadata_materiales = [];
		$metadata_index = null;

		foreach ($metadata as $index => $row) {
			if ($row['key'] == 'materiales') {
				$metadata_index = $index;
				break;
			}
		}

		foreach ($metadata_materiales_raw as $index => $row) {
			$metadata_materiales_raw[$index]['material'] = json_decode($row['material']);
		}

		if ((count($metadata_materiales_raw) == 0) && $metadata && ($metadata_index)) {
			DB::beginTransaction();
			try {
				$to_save = [];
				$metadata_materiales_raw = $metadata[$metadata_index]['value'];

				foreach ($metadata_materiales_raw as $index => $row) {
					$to_save = new ProyectoMetadataMaterial([
						'proyecto_id' => $proyecto->id,
						'material' => json_encode($row),
					]);

					$metadata_materiales[] = $proyecto->metadata_materiales()->save($to_save);
				}
        $this->clear_cache();
				DB::commit();
			} catch (Exception $e) {
				DB::rollback();
			}
		} else {


			foreach ($metadata_materiales_raw as  $material) {
				if(isset($material->material->{'nombre'})){
					$metadata_materiales[$material->material->{'nombre'}] = (array) $material->material;
					$metadata_materiales[$material->material->{'nombre'}]['id'] = $material->id;
					$metadata_materiales[$material->material->{'nombre'}]['estado_id'] = $material->estado_id;
				}else{
					//ignoramos material sin nombre (revisar en caso que sea necesario)
				}


			}
		}

		// return response()->json($metadata_materiales);

		if ($metadata_index) {
			$metadata[$metadata_index] = [
				'key'   => 'materiales',
				'value' => $metadata_materiales,
			];
		} else {
			$metadata[] = [
				'key'   => 'materiales',
				'value' => $metadata_materiales,
			];
		}

		return response()->json([
			'projectId'   => $proyecto->id,
			'projectName' => $proyecto->proyecto,
			'metadata'    => $metadata,
		]);
	}

	public function save_responsible(Request $request)
	{
		try {
			$proyecto = $request->input('proyecto');
			$usuario = $request->input('usuario');

			$responsible = new Responsible();
			$responsible->usuario_id = $usuario;
			$responsible->proyecto_id = $proyecto;

			$responsible->save();
			$usuario = Usuario::find($usuario);

			return response()->json([
				'success'   => 1,
				'nombre_compleo' => $usuario->nombre_completo
			]);
		} catch (Exception $e) {
			return response()->json([
				'success'   => 0,
				'message' => $e->getMessage()
			]);
		}
	}

	public function delete_responsible($id)
	{
		DB::beginTransaction();
		try {
			$responsible = Responsible::where('proyecto_id', (int) $id);
			$responsible->delete();

			DB::commit();

			return response()->json(['status' => 'success']);
		} catch (Exception $e) {
			DB::rollback();
		}
	}

  public function clear_cache()
  {
    Artisan::call('cache:clear');
  }
}
