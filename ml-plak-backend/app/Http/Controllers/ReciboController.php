<?php

namespace App\Http\Controllers;

use App\Models\Recibo;
use Illuminate\Http\Request;

class ReciboController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
       //             
    }

    public function getByUsuarioFecha(Request $request) {
        $this->validate($request, [
			'usuario_id'   => 'required',
			'anio'    => 'required',
			'mes'    => 'required',
		]);

        $recibo = Recibo::where('usuario_id',$request->usuario_id)
                         ->where('anio',$request->anio) 
                         ->where('mes',$request->mes) 
                         ->first();               
                                          
        return response()->json(['success' => true,'recibo' => $recibo],200);    
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
        $recibo = Recibo::create($request->all());
        return $recibo;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Recibo  $recibo
     * @return \Illuminate\Http\Response
     */
    public function show(Recibo $recibo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Recibo  $recibo
     * @return \Illuminate\Http\Response
     */
    public function edit(Recibo $recibo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Recibo  $recibo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Recibo $recibo)
    {
        $recibo->fill($request->all());
        $recibo->save();
        return $recibo;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Recibo  $recibo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Recibo $recibo)
    {
        //
    }
}
