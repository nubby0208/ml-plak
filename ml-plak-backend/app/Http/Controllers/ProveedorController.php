<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use Illuminate\Http\Request;

class ProveedorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Proveedor::all();
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
            'empresa' => 'required',
            'contacto' => 'required',
            'email' => 'required|email',
            'telefono' => 'required',
            'direccion' => 'required',
        ]);
        $pago = Proveedor::create($request->all());
        return $pago;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Proveedor $proveedor)
    {
        $this->validate($request, [
            'empresa' => 'required',
            'contacto' => 'required',
            'email' => 'required|email',
            'telefono' => 'required',
            'direccion' => 'required',
        ]);
        $proveedor = $proveedor->update($request->all());
        return response()->json(['success' => true]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Proveedor $proveedor
     * @return \Illuminate\Http\Response
     */
    public function destroy(Proveedor $proveedor)
    {
        $proveedor->delete();
        return $proveedor;
    }
}
