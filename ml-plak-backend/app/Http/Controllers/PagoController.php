<?php

namespace App\Http\Controllers;

use App\Models\Pago;
use Illuminate\Http\Request;

class PagoController extends Controller
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

    public function get(Request $request)
    {
        $this->validate($request, [
            'usuario_id' => 'required',
            'mes' => 'required',
            'anio' => 'required',
        ]);

        $pagos = Pago::where('usuario_id', $request->usuario_id)
            ->where('mes', $request->mes)
            ->where('anio', $request->anio)
            ->get();
        $total = Pago::where('usuario_id', $request->usuario_id)
            ->where('mes', $request->mes)
            ->where('anio', $request->anio)
            ->sum('monto');
        return response()->json([
            'pagos' => $pagos,
            'total' => $total,
        ]);
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
            'usuario_id' => 'required',
            'mes' => 'required',
            'anio' => 'required',
            'monto' => 'numeric|required',
            'comentario' => 'string|nullable',
        ]);
        $pago = Pago::create($request->all());
        return $pago;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Pago  $pago
     * @return \Illuminate\Http\Response
     */
    public function show(Pago $pago)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Pago  $pago
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Pago $pago)
    {
        $this->validate($request, [
            'monto' => 'numeric|required',
            'comentario' => 'string|nullable',
        ]);
        $pago = $pago->fill($request->all());
        return $pago;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Pago  $pago
     * @return \Illuminate\Http\Response
     */
    public function destroy(Pago $pago)
    {
        $pago->delete();
        return $pago;
    }
}
