<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Models\Rol;

class RolController extends Controller
{
	public function index()
	{
		return response()->json(['roles' => Rol::all()]);
	}
}
