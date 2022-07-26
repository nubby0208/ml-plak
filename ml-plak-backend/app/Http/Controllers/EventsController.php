<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;

class EventsController extends Controller
{
	public function store(Request $request)
	{
		$this->validate($request, [
			'descripcion'  => 'required|string',
			'tarea'        => 'required|string',
			'hora_inicio'  => 'required|string',
			'nombre'  => 'required|string',
			'telefono'  => 'required|string',
            'direccion'    => 'required|string',
            'dia'          => 'required|string'
		]);

		$data = $request->only(['descripcion', 'tarea', 'hora_inicio', 'nombre','telefono', 'direccion', 'dia', 'assistants','grupos','latitud','longitud']);

		$registro = new Event();
		$registro->fill($data);

		if ($registro->save()) {
			return response()->json($registro);
		}
			return response()->json(['success' => false]);
	}

    public function update($id, Request $request)
    {
        $event = Event::where('id', $id)
            ->firstOrFail();
        $event->update($request->all());

        return response()->json(['event' => $event]);
    }
 
    public function delete($id, Request $request)
    {
        $event = Event::where('id', $id)
            ->firstOrFail();
        $event->delete($request->all());

        return response()->json(['event' => $event]);
    }

    public function getAll(Request $request)
    {
        $records = Event::select(['id', 'tarea', 'descripcion','direccion','hora_inicio','nombre', 'telefono','dia','assistants','grupos','latitud','longitud'])
            ->get();

        return response()->json(['events' => $records]);
    }

    public function getFromToday($type, Request $request)
    {
        if ($type != "Administrador") {
            $records = Event::select(['id', 'tarea', 'descripcion','direccion','hora_inicio','nombre', 'telefono','dia','assignTask','assistants','grupos','latitud','longitud'])
            ->whereRaw("tarea != 'visita' AND tarea != 'pago'")
            ->whereDate('dia', '>=', date('Y-m-d'))->orderByRaw('dia ASC')->with(['assignTask'])->get();
        } else {
            $records = Event::select(['id', 'tarea', 'descripcion','direccion','hora_inicio','nombre', 'telefono','dia','assignTask','assistants','grupos','latitud','longitud'])
            ->whereDate('dia', '>=', date('Y-m-d'))->orderByRaw('dia ASC')->with(['assignTask'])->get();
        }

        return response()->json(['events' => $records]);
    }

    public function assigns($id, Request $request)
    {
        $proyecto = Event::where('id', $id)
            ->firstOrFail();
        $proyecto->update($request->all());

        return response()->json(['event' => $proyecto]);
    }

    public function get_between_dates($date_begin, $date_end)
    {
        $records = Event::select(['id', 'tarea', 'descripcion','direccion','hora_inicio','nombre', 'telefono','dia','assistants','grupos','latitud','longitud'])
            ->whereBetween('dia', [$date_begin, $date_end])
            ->get();

        return response()->json(['events' => $records]);
    }
}
