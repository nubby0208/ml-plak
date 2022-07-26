<?php

namespace App\Http\Controllers\ClientPresentation;

use App\Http\Controllers\Controller;
use App\Models\ClientPresentationDataStorage;
use App\Models\ClientPresentationTemplate;
use App\Models\ClientPresentationView;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Exception;
use Illuminate\Support\Facades\Storage;
use Webpatser\Uuid\Uuid;

class ClientPresentationDataStorageController extends Controller
{
    protected function statusKeys()
    {
        return [
            "nuevo",
            "faltaInfo",
            "procesado"
        ];
    }
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {

        if( $request->input("search", '') != '' ){
            $query = ClientPresentationDataStorage::whereHas('sequence', function ($q) use ($request) {
                $q->where('name', 'like', "%".$request->input("search")."%");
            });
            $query = $query->orWhere('data', 'like', "%".$request->input("search")."%");
        }else{
            $query = ClientPresentationDataStorage::query();
        }
        if( $request->input("status", '') != '' ){
            $query->where('status', $request->input("status"));
        }
        return response()->json([
            "listPaginator" => $query->orderBy('updated_at', 'desc')
                ->paginate($request->get('total', 15)),
            "newsCount" => ClientPresentationDataStorage::where('status', 'nuevo')
                ->count(),
            "informationMissingCount" => ClientPresentationDataStorage::where('status', 'faltaInfo')
                ->count(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'status' =>'required|in:'. implode(',', $this->statusKeys()),
            'info' =>'required|string'
        ]);
        $dataStorage = new ClientPresentationDataStorage();
        $dataStorage->sequence_id = "31351eb9-7ec0-4165-9249-6901767ed371";
        $dataStorage->status = $request->status;
        $dataStorage->state = "r";
        $dataStorage->data = [ "r" => [] ];
        $dataStorage->info = $request->info;
        $dataStorage->save();
        return response()->json($dataStorage);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function storeClient(Request $request)
    {
        //        $request->validate([
//            'name'   => 'required|max:191|unique:translations,name,NULL,id,lang,'.$this->transLang,
//            'string' =>'required|'
//        ]);
        $dataStorage = ClientPresentationDataStorage::create($request->all());
        return response()->json($this->postSaveHandler($dataStorage));
    }

    /**
     * Display the specified resource.
     *
     * @param ClientPresentationDataStorage $dataStorage
     * @param Request $request
     * @return Response
     */
    public function show(ClientPresentationDataStorage $dataStorage, Request $request)
    {
        if( $request->input("view", false)){
            $dataStorage->read = true;
            $dataStorage->save();
        }
        return response()->json($dataStorage);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param ClientPresentationDataStorage $dataStorage
     * @return void
     */
    public function update(Request $request, ClientPresentationDataStorage $dataStorage)
    {
        //        $request->validate([
//            'string' =>'required|'
//        ]);
//        $translation->string = $request->string;
//        $translation->save();
        $dataStorage->update($request->all());
        if($dataStorage->read){
            $dataStorage->read = false;
            $dataStorage->save();
        }
        return response()->json($this->postSaveHandler($dataStorage));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ClientPresentationDataStorage $dataStorage
     * @return Response
     * @throws Exception
     */
    public function destroy(ClientPresentationDataStorage $dataStorage)
    {
        return response()->json($dataStorage->delete());
    }

    /**
     * @param ClientPresentationDataStorage $dataStorage
     * @return ClientPresentationDataStorage
     */
    protected function postSaveHandler($dataStorage)
    {
        $dataViewValues = $dataStorage->data;
        foreach ($dataViewValues as $valueView) {
            foreach ($valueView as $value) {
                if ( is_array($value) && array_has($value, 'type') &&
                    $value['type'] == ClientPresentationTemplate::TypeFile &&
                    Storage::disk(ClientPresentationView::getStoreDisk())->exists(
                        ClientPresentationView::getTempStorePath().DIRECTORY_SEPARATOR.$value['value'])
                ){
                    Storage::disk(ClientPresentationView::getStoreDisk())->move(
                        ClientPresentationView::getTempStorePath().DIRECTORY_SEPARATOR.$value['value'],
                        $dataStorage->getStorePath().DIRECTORY_SEPARATOR.$value['value']);
                }
            }
        }
        return $dataStorage;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param ClientPresentationDataStorage $dataStorage
     * @return void
     */
    public function updateinfo(Request $request, ClientPresentationDataStorage $dataStorage)
    {
        $this->validate($request, [
            'status' =>'required|in:'. implode(',', $this->statusKeys()),
            'info' =>'required|string'
        ]);

        $dataStorage->status = $request->status;
        $dataStorage->info = $request->info;
        $dataStorage->save();
        return response()->json($dataStorage);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param ClientPresentationDataStorage $dataStorage
     * @return void
     */
    public function updateStatus(Request $request, ClientPresentationDataStorage $dataStorage)
    {
        $this->validate($request, [
            'status' =>'required|in:'. implode(',', $this->statusKeys()),
        ]);

        $dataStorage->status = $request->status;
        $dataStorage->save();
        return response()->json($dataStorage);
    }

    /**
     * Upload files.
     *
     * @param Request $request
     * @param ClientPresentationDataStorage $dataStorage
     * @return Response
     * @throws Exception
     */
    public function uploadFile(Request $request, ClientPresentationDataStorage $dataStorage)
    {
        $result = isset($dataStorage->attach) ? $dataStorage->attach : [];
        if ($request->files->count() > 0) {
            foreach ($request->files as $key => $fileArray) {
                foreach ($request->file($key) as $upload_file) {
                    $uuid = Uuid::generate();
                    $extension = $upload_file->extension();
                    $nameFile = $uuid . '.' . $extension;
                    $upload_file->storeAs($dataStorage->getStorePath(),
                        $nameFile, ClientPresentationView::getStoreDisk());
                    $result[] = $nameFile;
                }
            }
            $dataStorage->attach = $result;
            $dataStorage->save();
            return response()->json( ['attach' => $dataStorage->attach]);
        }
        return abort(422);
    }

    /**
     * delete files.
     *
     * @param Request $request
     * @param ClientPresentationDataStorage $dataStorage
     * @return Response
     */
    public function deleteFile(Request $request, ClientPresentationDataStorage $dataStorage)
    {
        $result = isset($dataStorage->attach) ? $dataStorage->attach : [];
        $this->validate($request, [
            'fileName' =>'required|in:'. implode(',', $result),
        ]);

        if ( Storage::disk(ClientPresentationView::getStoreDisk())
            ->exists($dataStorage->getStorePath().DIRECTORY_SEPARATOR.$request->fileName))
        {
            Storage::disk(ClientPresentationView::getStoreDisk())
                ->delete($dataStorage->getStorePath().DIRECTORY_SEPARATOR.$request->fileName);
            $result = array_diff($result, array($request->fileName));
        }

        $dataStorage->attach = $result;
        $dataStorage->save();
        return response()->json( ['attach' => $dataStorage->attach]);
    }
}
