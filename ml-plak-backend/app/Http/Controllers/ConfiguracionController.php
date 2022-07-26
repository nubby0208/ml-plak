<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Configuracion;
use App\Models\TipoConfiguracion;

class ConfiguracionController extends Controller
{
	public function index()
	{
		$configuraciones = [];

		foreach (Configuracion::all() as $config) {
			$configuraciones[] = $config->forApi();
		}

		return response()->json([
			'configuraciones' => $configuraciones
		]);
	}

	public function store(Request $request)
	{
		// dd(json_encode($request->input('values')));
		$this->validate($request, [
			'name'   => 'required|string',
			'type'   => 'required|string',
			'values' => 'required|array',
		]);

		try {
			$config_data = [
				'nombre'    => $request->input('name'),
				'elementos' => json_encode($request->input('values')),
			];

			// TODO
			// Create setter for field `tipo`
			$tipo_config = TipoConfiguracion::where('tipo', strtolower($request->input('type')))->first();

			// If TipoConfiguracion not exists
			if (!$tipo_config) {
				$tipo_config = new TipoConfiguracion;
				$tipo_config->fill(['tipo' => strtolower($request->input('type'))]);
				$tipo_config->save();
			}

			$config_data['tipo_configuracion_id'] = $tipo_config->id;

			$config = new Configuracion;
			$config->fill($config_data);
			$config->save();

			return response()->json(['success' => true,'id' => $config->id]);
		} catch (Exception $e) {
			return response()->json(['error' => true, 'msg' => $e->getMessage()]);
		}
	}

	public function update(Request $request, $id)
	{
		try {
			$configuracion = Configuracion::findOrFail((int) $id);
			$inputs_raw = $request->all();
			$keys_table = ['values' => 'elementos', 'type' => 'tipo_configuracion_id', 'name' => 'nombre'];
			$for_update = [];

			foreach ($keys_table as $key_request => $key_database) {
				if (array_key_exists($key_request, $inputs_raw)) {
					if ($key_request === 'type') {
						$tipo_config = TipoConfiguracion::where('tipo', strtolower($request->input('type')))->first();

						// If TipoConfiguracion not exists
						if (!$tipo_config) {
							$tipo_config = new TipoConfiguracion;
							$tipo_config->fill(['tipo' => strtolower($request->input('type'))]);
							$tipo_config->save();
						}
						$for_update[$key_database] = $tipo_config->id;
					} elseif ($key_request === 'values') {
						$for_update[$key_database] = json_encode($inputs_raw[$key_request]);
					} else {
						$for_update[$key_database] = $inputs_raw[$key_request];
					}
				}
			}

			$configuracion->update($for_update);

			return response()->json(['success' => true]);
		} catch (\Exception $e) {
			return response()->json([
				'error' => true,
				'message' => $e->getMessage()
			]);
		}
	}

	public function show($id)
	{
		$configuracion = Configuracion::findOrFail((int) $id);

		return response()->json(['configuracion' => $configuracion->forApi()]);
	}

	public function get_by_tipo($type = null)
	{
		try {
			$tipo_config = TipoConfiguracion::where('tipo', strtolower($type));

			if ($tipo_config->count() === 0)
				throw new \Exception("Tipo Configuracion not found", 1);
				
			$configuraciones_raw = $tipo_config->first()->configuraciones()->get();
			$configuraciones = [];

			foreach ($configuraciones_raw as $config)
				$configuraciones[] = $config->onlyElements();

			return response()->json(['configuraciones' => $configuraciones]);
		} catch (\Exception $e) {
			return response()->json(['error' => true, 'msg' => $e->getMessage()]);
		}
	}

	public function get_by_tipo_all($type = null, $default = null)
	{
		try {
			$tipo_config = TipoConfiguracion::where('tipo', strtolower($type));
			$default = ($default === 'default') ? $default : null;

			if ($tipo_config->count() === 0)
				throw new \Exception("Tipo Configuracion not found", 1);
				
			$configuraciones_raw = $tipo_config->first()->configuraciones()->get();
			$configuraciones = [];

			foreach ($configuraciones_raw as $config) {
				$configuracion = $config->forApi(true);

				if ($default) {
					foreach ($configuracion['values'] as $value) {
						if (($value->name === 'default') && ($value->value === true)) {
							$configuraciones[] = $configuracion;
							break;
						}
					}
				} else {
					$configuraciones[] = $configuracion;
				}
			}

			return response()->json(['configuraciones' => $configuraciones]);
		} catch (\Exception $e) {
			return response()->json(['error' => true, 'msg' => $e->getMessage()]);
		}
	}

	public function delete($id)
	{
		$config = Configuracion::findOrFail((int) $id);
		
		if ($config->delete())
			return response()->json(['success' => true]);

		return response()->json(['error' => true]);
	}
}
