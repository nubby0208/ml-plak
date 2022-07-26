<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Rango;

class RangoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $rangos = Rango::get();
        return response()->json(['success' => true,'data' => $rangos],200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'nombre'               => 'required|string|min:1',
            'valor'                => 'required|numeric|regex:/^[\d]{0,8}(\.[\d]{1,2})?$/',
            'suma_no_remunerativa' => 'required|numeric|regex:/^[\d]{0,8}(\.[\d]{1,2})?$/'
        ]);

        $rango = Rango::create($request->all());

        return response()->json(['success' => true],201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Rango $rango)
    {
        $this->validate($request, [
            'nombre'               => 'required|string|min:1',
            'valor'                => 'required|numeric|regex:/^[\d]{0,8}(\.[\d]{1,2})?$/',
            'suma_no_remunerativa' => 'required|numeric|regex:/^[\d]{0,8}(\.[\d]{1,2})?$/'
        ]);
        
        $rango->fill($request->all());
        $rango->save();

        return response()->json(['success' => true],200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Rango $rango)
    {
        $rango->delete();

        return response()->json(['success' => true],200);
    }
}
