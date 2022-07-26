<?php

namespace App\Http\Controllers;

use App\Models\NivelComplejidad;
use Illuminate\Http\Request;

class NivelComplejidadController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(['niveles'=> NivelComplejidad::all()]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\NivelComplejidad  $nivelComplejidad
     * @return \Illuminate\Http\Response
     */
    public function show(NivelComplejidad $nivelComplejidad)
    {
        return NivelComplejidad::all();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\NivelComplejidad  $nivelComplejidad
     * @return \Illuminate\Http\Response
     */
    public function edit(NivelComplejidad $nivelComplejidad)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\NivelComplejidad  $nivelComplejidad
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, NivelComplejidad $nivelComplejidad)
    {
        $nivelComplejidad = NivelComplejidad::find($request->id);
        $nivelComplejidad->min = $request->min;
        $nivelComplejidad->max = $request->max;
        $nivelComplejidad->puntos = $request->puntos;
        $nivelComplejidad->save();

        return response()->json(['nivel'=> $nivelComplejidad]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\NivelComplejidad  $nivelComplejidad
     * @return \Illuminate\Http\Response
     */
    public function destroy(NivelComplejidad $nivelComplejidad)
    {
        //
    }
}
