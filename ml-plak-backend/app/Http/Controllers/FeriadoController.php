<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Feriado;

class FeriadoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if($request->has('all')){
            $year = date('Y',strtotime('-100 years'));
        }else{
            $year = date('Y');
        }
        $fecha = '01-01-'.$year;
        $feriados = Feriado::where('fecha','>=',$fecha)->get();
        return response()->json(['feriados' => $feriados]);
    }

    public function indexDate($fecha1,$fecha2)
    {
      $feriados = Feriado::whereDate('fecha',">=",$fecha1)
                          ->whereDate('fecha',"<=",$fecha2)
                          ->get();
      return response()->json(['feriados' => $feriados]);
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
        $rules = [
            'fecha'  =>  'required'
        ];

        $this->validate($request, $rules);
        $feriado = Feriado::create([
            'fecha' =>  $request->fecha
        ]);

        return response()->json(['success' => true, 'feriado' => $feriado]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $feriado = Feriado::findOrFail($id);

        $feriado->fecha = $request->fecha;
        $feriado->save();

        return response()->json(['success' => true]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $feriado = Feriado::findOrFail($id);

        $feriado->delete();

        return response()->json(['success' => true]);
    }
}
