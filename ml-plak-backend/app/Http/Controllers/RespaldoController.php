<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use DateTime;
use JWTAuth;

class RespaldoController extends Controller
{
	private $storage_path;

	public function __construct()
	{
		$this->storage_path = Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix();
	}
	
	public function index()
	{
		// ADD Validator
		// $user_id = JWTAuth::parseToken()->authenticate()->id;
		$files_storage = Storage::files('backups/database/');
		$files_raw = Collect($files_storage)->sortByDesc(function ($elemento) {
			$date = explode(".sql.gz", explode("production_", $elemento)[1])[0];
			return DateTime::createFromFormat("dmY_H_i", $date)->format("Y-m-d");
		});
		$files =  [];

		foreach ($files_raw as $key => $value) {
			$temp = explode('backups/database/production_', explode('.', $value)[0])[1];
			// dd($temp, DateTime::createFromFormat('dmY_H_i', $temp)->format('d/m/Y H:i'), DateTime::getLastErrors());

			$files[] = [
				'name' => $temp,
				'date' => DateTime::createFromFormat('dmY_H_i', $temp)->format('d/m/Y H:i')
			];
		}

		return response()->json(['respaldos' => $files]);
	}

	public function download_file($date, $option = 'database')
	{
		// production_27112018_01_57
		$name = 'backups/';
		$name .= ($option === 'database') ? 'database/production_' : 'storage/storage_app_';
		$name .= $date;
		$name .= ($option === 'database') ? '.sql.gz' : '.7z';

		// dd($name);

		if (Storage::exists($name)) {
			return response()->download($this->storage_path.$name);
		}

		return response()->json(['error' => true, 'msg' => 'Archivo no encontrado']);
	}
}
