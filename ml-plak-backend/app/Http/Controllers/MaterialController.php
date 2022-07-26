<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Material;
use App\Models\TipoMaterial;

use Storage;

class MaterialController extends Controller
{
	public function index()
	{
    $materiales = array();
    foreach (Material::with(['tipo_materiales'])->get() as $key => $material )
    {
      $material->link_textura1 = $this->SearchTextureMaterial( $material->material, 'textura1' );
      $materiales[] = $material;
    }
		return response()->json(['materiales' =>  $materiales]);
	}

  public function all_materiales()
  {
    //$materiales = Material::where('material', 'like', '%'.$search_material.'%')->get();
    //return response()->json(['materiales' => $materiales ]);
    return response()->json(['materiales' => Material::all() ]);
  }

  public function materiles_por_tipo( $tipo )//en diseño no se cargan las texturas
  {

    return response()->json(['materiales' => $this->SearcMateriales($tipo ) ]);
  }

  public function materiles_por_tipo_taller( $tipo )//en taller se cargan las texturas en el listado
  {

    return response()->json(['materiales' => $this->SearcMateriales($tipo, true ) ]);//para que cargue las texturas
  }

  public function tipo_materiales()
  {
    return response()->json(['tipo_materiales' => TipoMaterial::all() ]);
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
            'material' 		=> 	'required|string',
            'espesor' 		=>	'nullable|numeric',
            'link_textura1'	=>	'nullable|string',
            'link_textura2'	=>	'nullable|string',
            'precio_mt2'	=>	'nullable|numeric',
            'precio_placa'	=>	'nullable|numeric',
            'veta'			=>	'nullable|boolean',
            'ancho_veta'	=>	'nullable|numeric',
            'largo_veta'	=>	'nullable|numeric',
            'nombre' =>     'nullable|string',
            'alto' =>       'nullable|numeric',
            'descuento_alto' => 'nullable|numeric',
            'descuento_ancho' => 'nullable|numeric',
            'tipos_material_id' => 'nullable|numeric',
            'extra'			=>	'nullable|string',
        ];

        $this->validate($request, $rules);
        $material = $this->SaveMaterial( $request );
				$material->load('tipo_materiales');
        
        //$material = Material::create($material_data);
        $this->UploapTexture($request);
        $material->texture_exists = (boolean) $request->input('link_textura1');

        return response()->json(['success' => true,'material' => $material]);
    }

     

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
      $textura1 = $this->SearchTextureMaterial( $id, 'textura1' );
      $textura2 = '';//$this->SearchTextureMaterial( $id, 'textura2' );
      return [
       'result' => ( $textura1 || $textura2 ) ? "Ok" : "false", 
       'response' => [ 
          "textura1" => $textura1,
          "textura2" => $textura2
        ]
      ];
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
        $rules = [
        	'id'			=>	'required|exists:materiales,id',
          'material'    =>  'required|string',
          'espesor'     =>  'nullable|numeric',
          'link_textura1' =>  'nullable|string',
          'link_textura2' =>  'nullable|string',
          'precio_mt2'  =>  'nullable|numeric',
          'precio_placa'  =>  'nullable|numeric',
          'veta'      =>  'nullable|boolean',
          'ancho_veta'  =>  'nullable|numeric',
          'largo_veta'  =>  'nullable|numeric',
          'nombre' =>     'nullable|string',
          'alto' =>       'nullable|numeric',
          'descuento_alto' => 'nullable|numeric',
          'descuento_ancho' => 'nullable|numeric',
          'tipos_material_id' => 'nullable|numeric',
          'extra'     =>  'nullable|string',
        ];

        $this->validate($request, $rules);

        $material = $this->SaveMaterial( $request, $id );
        $this->UploapTexture($request);
        return response()->json(['success' => true,'material'	=>	$material]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Material::destroy($id);
        return response()->json(['success' => true]);
    }

    private function UploapTexture($request)
    {  

      
      $material_type = $request->input('tipo_materiales');
      if($material_type['id']!=1){
        $material_name = strtolower( trim(  $request->input('nombre') ) );
      }else{
        $material_name = strtolower( trim(  $request->input('material') ) );
      }
      if( $material_name && $request->input('link_textura1') )
      {
        $base_to_php1 = explode(',', $request->input('link_textura1') );
        $data_textura1 = base64_decode( $base_to_php1[1] );
        
        $storage_path = Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix();
        // verificar si existe el directorio para el material
        if( !is_dir( $storage_path.'textures/'.$material_name ) )
          Storage::makeDirectory( 'textures/'.$material_name );

        $file_path1    = $storage_path.'textures/'.$material_name.'/textura1';
        
        
        file_put_contents($file_path1 , $data_textura1);
        
      }  
    }

    private function SearchTextureMaterial( $material_name, $texture )
    {
      $storage_path = Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix();
      $material_name = strtolower( trim(  $material_name ) );
      if( is_file( $storage_path.'textures/'.$material_name.'/'.$texture ) )
        return 'data:image/jpeg;base64,'.base64_encode(file_get_contents($storage_path.'textures/'.$material_name.'/'.$texture));
      return '';
      //'data:image/jpeg;base64,'
    }

    private function SaveMaterial( $request, $id = null )
    {
        if( $id )
           $material = Material::find($id);
        else 
          $material = new Material();
        
        $material->material = trim( $request->input('material') );
        $material->espesor = trim( $request->input('espesor') );
        $material->link_textura2 = trim( $request->input('link_textura2') );
        $material->precio_mt2 = empty($request->input('precio_mt2')) ? 0 : $request->input('precio_mt2');
        $material->precio_placa = empty($request->input('precio_placa')) ? 0 : $request->input('precio_placa');
        $material->veta = empty($request->input('veta')) ? 0 : $request->input('veta'); 
        $material->ancho_veta = empty($request->input('ancho_veta')) ? 0 : $request->input('ancho_veta');
        $material->largo_veta = empty($request->input('largo_veta')) ? 0 : $request->input('largo_veta'); 
        $material->nombre = trim( $request->input('nombre') );
        $material->alto = empty($request->input('alto')) ? 0 : $request->input('alto');
        $material->descuento_alto = empty($request->input('descuento_alto')) ? 0: $request->input('descuento_alto');
        $material->descuento_ancho = empty($request->input('descuento_ancho')) ? 0: $request->input('descuento_ancho');
        $material->extra = empty($request->input('extra')) ? '' : $request->input('extra');
        $material->tipo_material_id = intval( $request->input('tipo_material_id') );
        $material->default = $request->input('default');
        $material->save();
        return $material;

    }

    private function SearcMateriales($tipo, $textures = false )
    {
      $materiales = array();
      $materiales_por_tipo = Material::with('tipo_materiales')->whereHas('tipo_materiales', function ($query) use ($tipo) {
				$query->where('caracter', $tipo);
			})->get();
      
// dd($materiales_por_tipo->get()->toArray());
      
			if ($textures) {
        foreach ($materiales_por_tipo as $key => $material) {
          $material->link_textura1 = $this->SearchTextureMaterial( $material->material, 'textura1' );
          $materiales[] = $material;
        }
			} else {
        foreach ($materiales_por_tipo as $key => $material) {
          if($material->tipo_material_id!=1){
            $material->texture_exists = $this->check_texture_exists($material->nombre, 'textura1');
            $materiales[] = $material;
          }else{
            $material->texture_exists = $this->check_texture_exists($material->material, 'textura1');
            $materiales[] = $material;
          }
          
        }
			}

      return $materiales;
  }

	private function check_texture_exists($material_name, $texture)
	{
		$storage_path = Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix();
		$material_name = strtolower(trim($material_name));

		return (is_file($storage_path.'textures/'.$material_name.'/'.$texture));
	}

  public function get_by_default()
  {
    return response()->json(['materiales' => Material::where('default', 1)->get()]);
  }

  public function get_raw()
  {
	return response()->json(['materiales' => Material::all()]);
  }

	public function get_texture($id,$tipo_id)
	{
		$material = Material::findOrFail($id);
    
      if($tipo_id!=1){
        $parameter = $material->nombre;          
      }else{
        $parameter = $material->material;
      }
		return response()->json([
			'textura' => $this->SearchTextureMaterial($parameter, 'textura1')
		]);
	}


  /**
  *
  * Obtiene la informacion de texturas necesaria par utilizarse en el 3dviewer.
  * $request.ids es una lista de ids de texturas cuya data 
  *
  * NOTA: la idea es que funcione con ids, pero en staging no hay ids
  * para los matriales en las piezas (tabla 3d_piezas), se usaran los nombres
  * se recomienda resolver la integridad referencial para resolver esto.
  *
  * Ver TresdVieverController.php all_parts.
  * Ver proyecto 3dViewer app.js loadModelfromAPi y getModelTexturesFromAPI
  * 
  * Autor: Gustavo Vivas 
  * gustavoadolfovivas@hotmail.com
  * 12 Marzo 2019
  */
  public function get_texture_list(Request $request)
  {
    //$textures_ids = $request->input('ids'); <- asi debe ser.
    $textures_ids = $request->input('names');
      foreach ($textures_ids as $key => $name) {
        $textura = Material::where('material','=', $name)->orwhere('nombre','=', $name)
        ->select(['id', 'material','nombre', 'link_textura1', 'link_textura2','tipo_material_id'])->get();
       foreach ($textura as $key => $material )
        {
          if($material->tipo_material_id!=1){
            $material->link_textura1 = $this->SearchTextureMaterial($material->nombre, 'textura1');
          }else{
            $material->link_textura1 = $this->SearchTextureMaterial($material->material, 'textura1');
          }    
          $texturas[]=array(
            'id'=>$material->id,
            'material'=>$material->material,
            'nombre'=>$material->nombre,
            'link_textura1'=>$material->link_textura1,
            'link_textura2'=>$material->link_textura2,
            'tipo_material_id'=>$material->tipo_material_id
          ); 
        }               
       
      }

    /*$texturas = Material::where('material','=', $textures_ids)->orwhere('nombre','=', $textures_ids)
              ->select(['id', 'material','nombre', 'link_textura1', 'link_textura2'])->get();
        foreach ($texturas as $key => $material )
        {
           
        }*/
    
    return response()->json(['materiales' => $texturas]);
    
  }

  public function search()
  {
    $search_material = request('query');
    $materiales = Material::where('material', 'like', '%'.$search_material.'%')->get();
    return response()->json($materiales);
  }
}
