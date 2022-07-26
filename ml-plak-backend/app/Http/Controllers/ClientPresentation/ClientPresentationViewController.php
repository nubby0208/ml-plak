<?php

namespace App\Http\Controllers\ClientPresentation;

use App\Http\Controllers\Controller;
use App\Models\ClientPresentationTemplate;
use App\Models\ClientPresentationView;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Webpatser\Uuid\Uuid;
use Exception;

class ClientPresentationViewController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request)
    {
        $query = ClientPresentationView::query();
        if($request->input("search", '') != ''){
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
        $view = ClientPresentationView::create($this->preSaveViewHandler($request));
        return response()->json($this->postSaveViewHandler($view));
    }

    /**
     * Display the specified resource.
     *
     * @param ClientPresentationView $view
     * @return Response
     */
    public function show(ClientPresentationView $view)
    {
        return response()->json($view);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param ClientPresentationView $view
     * @return Response
     */
    public function update(Request $request, ClientPresentationView $view)
    {
//        $request->validate([
//            'string' =>'required|'
//        ]);
//        $translation->string = $request->string;
//        $translation->save();
        $view->update($this->preSaveViewHandler($request));
        return response()->json($this->postSaveViewHandler($view));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ClientPresentationView $view
     * @return Response
     * @throws Exception
     */
    public function destroy(ClientPresentationView $view)
    {
        return response()->json($view->delete());
    }

    /**
     * Upload files.
     *
     * @param Request $request
     * @return Response
     * @throws Exception
     */
    public function uploadTempFile(Request $request)
    {
        if ($request->files->count() > 0) {
            $result = [];
            foreach ($request->files as $key => $fileArray) {
                foreach ($request->file($key) as $upload_file) {
                    $uuid = Uuid::generate();
                    $extension = $upload_file->extension();
                    $nameFile = $uuid . '.' . $extension;
                    $upload_file->storeAs(ClientPresentationView::getTempStorePath(),
                        $nameFile, ClientPresentationView::getStoreDisk());
                    if(substr_count($key, '__') == 2)
                    {
                        $arrayKey = explode("__", $key);
                        $result[$arrayKey[0]][$arrayKey[1]] = $nameFile;
                    }
                    else{
                        $result[$key][] = $nameFile;
                    }
                }
            }
            return response()->json($result);
        }
        return abort(422);
    }

    /**
     * @param Request $request
     * @return array
     */
    protected function preSaveViewHandler($request)
    {
        $result = $request->all();
        return $result;
    }

    /**
     * @param ClientPresentationView $view
     * @return ClientPresentationView
     */
    protected function postSaveViewHandler($view)
    {
        $change = false;
        $fieldsValues = $view->fieldsValues;
        foreach ($fieldsValues as $key => $value) {
            if ( is_array($value) && array_has($value, 'type') &&
                $value['type'] == ClientPresentationTemplate::TypeFile &&
                array_has($value, ClientPresentationTemplate::UploadTempFile) &&
                $value[ClientPresentationTemplate::UploadTempFile] == true) {

                Storage::disk(ClientPresentationView::getStoreDisk())-> move(
                    ClientPresentationView::getTempStorePath().DIRECTORY_SEPARATOR.$value['value'],
                    $view->getStorePath().DIRECTORY_SEPARATOR.$value['value']);
                unset($fieldsValues[$key][ClientPresentationTemplate::UploadTempFile]);
                $fieldsValues[$key]['templateUrl'] = false;
                $change = true;
            }
            if ( is_array($value) && array_has($value, 'type') &&
                $value['type'] == ClientPresentationTemplate::TypeMultiFileAndText) {
                foreach ($value['value'] as $subKey => $subValue) {
                    if(array_has($subValue, ClientPresentationTemplate::UploadTempFile) &&
                        $subValue[ClientPresentationTemplate::UploadTempFile] == true){

                        Storage::disk(ClientPresentationView::getStoreDisk())-> move(
                            ClientPresentationView::getTempStorePath().DIRECTORY_SEPARATOR.$subValue['url'],
                            $view->getStorePath().DIRECTORY_SEPARATOR.$subValue['url']);
                        unset($fieldsValues[$key]['value'][$subKey][ClientPresentationTemplate::UploadTempFile]);
                        $subValue['templateUrl'] = false;
                        $change = true;

                    }
                }
            }
        }
        if($change){
            $view->fieldsValues = $fieldsValues;
            $view->save();
        }

        return $view;
    }
}
