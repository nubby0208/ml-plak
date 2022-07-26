<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

use App\Models\MkHelpCategory;

// use Illuminate\Support\Facades\Cache;
// use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

  
class HelpCategoryController extends Controller {


  public function index(Request $request) {
      $data = MkHelpCategory::all();

      // echo $data;
      //return response()->json($data);
      return response()->json(['success' => true,'data' => $data],200);
    }


  public function show($id) {
    $data = MkHelpCategory::find($id);
    return response()->json(['success' => true,'data' => $data],200);
  }


  public function create (Request $request) {
      try {
        $this->validate($request, [
          'desc_categoria' => 'required|string',
          'activo' =>'required|integer'
        ]);

       
        $data = [
            'desc_categoria' => $request->desc_categoria,
            'activo' => $request->activo
        ];

        $categoria = MkHelpCategory::create($data);

       // $this->clear_cache();
        return response()->json(['status' => true,'data' => $categoria, 'categoria_id' => $categoria->id,],201);
      } catch (Exception $e) {
        return response()->json(['status' => false,'error' => $e->getMessage()],404);
      }
  }



  
  public function update(Request $request, $id) {
      try {

        $this->validate($request, [
          'desc_categoria' => 'required|string',
          'activo' =>'required|integer'

        ]);
           
        $data = [
          'desc_categoria' => $request->desc_categoria,
          'activo' => $request->activo
        ];

        $categoria = MkHelpCategory::findOrFail($id);
        $categoria->update($data);
                
        // $this->clear_cache();
        return response()->json(['status' => true,'data' => $categoria],200);
      }catch (Exception $e) {
        return response()->json(['status' => false,'error' => $e->getMessage()],404);
      }
  }

  public function destroy($id)
  {
        try {

          
            $categoria =MkHelpCategory::findOrFail($id);
            $categoria->delete();

            // $this->clear_cache();
            return response()->json(['status' => true],200);
        } catch (Exception $e) {
          return response()->json(['status' => false,'error' => $e->getMessage()],404);
        }
  }

}
