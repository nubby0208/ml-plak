<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Estado;

class EstadoController extends Controller
{
	public function index()
	{
		return response()->json(['estados' => Estado::all()]);
	}
}
