<?php

namespace App\Http\Controllers\ClientPresentation;

use App\Http\Controllers\Controller;
use App\Models\ClientPresentationSequence;
use App\Models\ClientPresentationView;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Exception;

class ClientPresentationSequenceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $query = ClientPresentationSequence::query();
        if($request->input("search", '') != '' ){
            $query->where('name', 'like', "%".$request->input("search")."%");
        }
        return response()->json($query->paginate($request->get('total', 15)));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        //        $request->validate([
//            'name'   => 'required|max:191|unique:translations,name,NULL,id,lang,'.$this->transLang,
//            'string' =>'required|'
//        ]);
        $sequence = ClientPresentationSequence::create($request->all());
        return response()->json($sequence);
    }

    /**
     * Display the specified resource.
     *
     * @param ClientPresentationSequence $sequence
     * @return Response
     */
    public function show(ClientPresentationSequence $sequence)
    {
        $views = [];
        $sequence->getViewsIds($sequence->sequenceTree, $views);
        $query = ClientPresentationView::query();
        $colletions = $query->whereIn('id', array_keys($views))->get();
        foreach ($colletions as $view)
            $views[$view->id] = $view;
        return response()->json(['sequence' => $sequence, 'views' => $views]);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param ClientPresentationSequence $sequence
     * @return Response
     */
    public function update(Request $request, ClientPresentationSequence $sequence)
    {
        //        $request->validate([
//            'string' =>'required|'
//        ]);
//        $translation->string = $request->string;
//        $translation->save();
        $sequence->update($request->all());
        return response()->json($sequence);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ClientPresentationSequence $sequence
     * @return Response
     * @throws Exception
     */
    public function destroy(ClientPresentationSequence $sequence)
    {
        return response()->json($sequence->delete());
    }

    /**
     * Public Sequence
     *
     * @param Request $request
     * @return Response
     */
    public function publish(ClientPresentationSequence $sequence, Request $request)
    {
        $this->validate($request, [
            'public'   => 'required|boolean',
        ]);
        $sequence->public = $request->public;
        $sequence->save();
        return response()->json($sequence);
    }
}
