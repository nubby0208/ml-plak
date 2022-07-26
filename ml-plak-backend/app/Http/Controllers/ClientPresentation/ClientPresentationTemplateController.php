<?php

namespace App\Http\Controllers\ClientPresentation;

use App\Http\Controllers\Controller;
use App\Models\ClientPresentationTemplate;
use Illuminate\Http\Response;
use Exception;

class ClientPresentationTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return response()->json(ClientPresentationTemplate::paginate(50));
    }

    /**
     * Display the specified resource.
     *
     * @param ClientPresentationTemplate $clientPresentationTemplate
     * @return Response
     */
    public function show(ClientPresentationTemplate $template)
    {
        return response()->json($template);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param ClientPresentationTemplate $clientPresentationTemplate
     * @return Response
     * @throws Exception
     */
    public function destroy(ClientPresentationTemplate $template)
    {
        return response()->json($template->delete());
    }
}
