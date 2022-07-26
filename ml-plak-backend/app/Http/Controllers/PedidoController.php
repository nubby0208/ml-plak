<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\Request;

class PedidoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $page = $request->page;
        $sortBy = $request->sortBy;
        $sortDesc = $request->sortDesc == 'true' ? true : false;
        $nombre = $request->searchParam;
        $usuario = $request->usuario;
        $proveedor = $request->proveedor;
        $estado = $request->estado;

        return Pedido::when(
            $sortBy != "" && $sortBy != null,
            function ($query) use ($sortBy, $sortDesc) {
              $query->orderBy($sortBy, $sortDesc ? 'desc' : 'asc');
            }
            )->when($proveedor != '', function ($query) use ($proveedor) {
                $query->where('proveedor_id', $proveedor);
            })->when($usuario != '', function ($query) use ($usuario) {
                $query->where('usuario', $usuario);
            })->when($nombre != '', function ($query) use ($nombre) {
                $query->where('producto', 'LIKE', '%'.$nombre.'%');
            })->when($estado != '', function ($query) use ($estado) {
                $query->where('estado', $estado);
            })
            ->paginate(20, ['*'], 'page', $page);
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
            'producto' => 'required',
            'usuario' => 'required',
            'proveedor_id' => 'required',
        ]);
        $pago = Pedido::create($request->all());
        return $pago;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Pedido  $pedido
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Pedido $pedido)
    {
        $pedido = $pedido->fill($request->all());
        $pedido->save();
        return $pedido;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Pedido  $pedido
     * @return \Illuminate\Http\Response
     */
    public function destroy(Pedido $pedido)
    {
        $pedido->delete();
        return $pedido;
    }

    public function deletebulk(Request $request)
    {
        $this->validate($request, [
            'ids' => 'array'
        ]);
        foreach($request->ids as $id) {
        $pedido = Pedido::find($id);
        if($pedido)
            $pedido->delete();
        }
        return response()->json(["ok" => true]);
    }
}
