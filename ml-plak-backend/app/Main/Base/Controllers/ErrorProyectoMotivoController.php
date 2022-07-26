<?php

namespace App\Main\Base\Controllers;

use App\Main\Base\Models\ErrorProyectoMotivo;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;

class ErrorProyectoMotivoController extends Controller
{
  public function index(Request $request)
	{
		$errorProyectoMotivo = ErrorProyectoMotivo::query()->get();
		return response()->json(['success' => true,'data' => $errorProyectoMotivo], Response::HTTP_OK);
	}
}