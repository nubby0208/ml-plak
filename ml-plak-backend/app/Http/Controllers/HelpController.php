<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

use App\Models\MkHelp;
use App\Models\MkHelpCategory;
// use App\Models\ViewNotifUsActiva;
use App\Models\Usuario;

// use Illuminate\Support\Facades\Cache;
// use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;


   
class HelpController extends Controller {

  public function index(Request $request) {
      // $data = MkHelp::all();  // SELECT ALL

      $data = MkHelp::select(['mk_ayudas.id', 'categoria_id',  'mk_ayudas_categorias.desc_categoria', 'titulo', 'contenido', 'ruta_archivo', 'ruta_img', 'mk_ayudas.activo'])
        ->join('mk_ayudas_categorias','mk_ayudas_categorias.id' ,'mk_ayudas.categoria_id' )
        ->get();  

        // no found
        /*
      $data = MkHelp::select(['id', 'categoria_id', 'titulo', 'contenido', 'ruta_archivo', 'ruta_img', 'activo'])
        ->where('activo', 1) 
        ->with(['categoria2' => function ($query) {
          $query->select('desc_categoria');
        }])->get();  
       */
      // echo $data;
      //return response()->json($data);
      return response()->json(['success' => true,'data' => $data],200);
    }


    public function view(Request $request) {
      // $data = MkHelp::all();  // SELECT ALL

      $data = MkHelp::select(['mk_ayudas.id', 'categoria_id',  'mk_ayudas_categorias.desc_categoria', 'titulo', 'contenido', 'ruta_archivo', 'ruta_img', 'mk_ayudas.activo'])
        ->where('mk_ayudas.activo', 1) 
        ->join('mk_ayudas_categorias','mk_ayudas_categorias.id' ,'mk_ayudas.categoria_id' )
        ->get();  

      return response()->json(['success' => true,'data' => $data],200);
    }

  public function show($id) {
    $data = MkHelp::find($id);
    return response()->json(['success' => true,'data' => $data],200);
  }


  /*
    public function allProyects(Request $request)
	{
		$data = json_decode(json_encode($request->all()));
		$page = $data->page;
		$search = $data->search;
  */

  public function helpCategory(Request $request) {
    $req    = json_decode(json_encode($request->all()));
		$usuario = $req->usuario;
		$path    = $req->path;

   //  $data = MkHelp::all();
      $data = MkHelp::select(['id', 'categoria_id', 'titulo', 'contenido', 'ruta_archivo', 'ruta_img', 'activo'])
			->where('activo', 1)  
			->get();

    /*
    $data = ViewNotifUsActiva::where("sector_id", $path)     
           ->where("usuario_id", $usuario)
           ->get();
    */
    
      $categoria = MkHelpCategory::select(['id', 'desc_categoria'])
			->where('activo', 1)  
			->get();
     
    return response()->json(['success' => true, 'data' => $data, 'categoria' => $categoria],200);
  }



  public function create (Request $request) {
      try {
        $this->validate($request, [
          'categoria_id' => 'required|integer',
          'titulo' => 'required|string',
          'contenido' => 'required|string',         
          'activo' =>'required|integer'
        ]);
       
        $data = [
            'categoria_id' => $request->categoria_id,
            'titulo' => $request->titulo,
            'contenido' => $request->contenido,
            'ruta_archivo' => $request->ruta_archivo,
            'ruta_img' =>$request->ruta_img,
            'activo' => $request->activo
        ];

        $query = MkHelp::create($data);

       // $this->clear_cache();
        return response()->json(['status' => true,'data' =>$query, 'ayuda_id' => $query->id,],201);
      } catch (Exception $e) {
        return response()->json(['status' => false,'error' => $e->getMessage()],404);
      }
  }



  
  public function update(Request $request, $id) {
      try {

        $this->validate($request, [
          'categoria_id' => 'required|integer',
          'titulo' => 'required|string',
          'contenido' => 'required|string',
          'activo' =>'required|integer'
        ]);
 
          
        $data = [
          'categoria_id' => $request->categoria_id,
          'titulo' => $request->titulo,
          'contenido' => $request->contenido,
          'ruta_archivo' => $request->ruta_archivo,
          'ruta_img' =>$request->ruta_img,
          'activo' => $request->activo
      ];



        $query = MkHelp::findOrFail($id);
        $query->update($data);
        
        // $this->clear_cache();
        return response()->json(['status' => true,'data' => $query],200);
      } catch (Exception $e) {
        return response()->json(['status' => false,'error' => $e->getMessage()],404);
      }
  }

  public function destroy($id)
  {
        try {            
          
            $query = MkHelp::findOrFail($id);
            $query->delete();
            // $this->clear_cache();
            return response()->json(['status' => true],200);
        } catch (Exception $e) {
          return response()->json(['status' => false,'error' => $e->getMessage()],404);
        }
  }

}
