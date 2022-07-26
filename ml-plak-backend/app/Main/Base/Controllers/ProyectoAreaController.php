<?php

namespace App\Main\Base\Controllers;

use App\Main\Base\Models\ProyectoArea;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;

class ProyectoAreaController extends Controller
{
  public function index()
	{
		$proyectoArea = ProyectoArea::query()->get();
		return response()->json(['success' => true,'data' => $proyectoArea], Response::HTTP_OK);
	}
}
