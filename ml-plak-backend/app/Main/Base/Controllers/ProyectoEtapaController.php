<?php

namespace App\Main\Base\Controllers;

use App\Main\Base\Models\ProyectoEtapa;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;

class ProyectoEtapaController extends Controller
{
  public function index()
	{
		$proyectoEtapa = ProyectoEtapa::query()->get();
		return response()->json(['success' => true,'data' => $proyectoEtapa], Response::HTTP_OK);
	}
}
