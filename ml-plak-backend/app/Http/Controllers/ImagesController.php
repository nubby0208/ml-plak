<?php

namespace App\Http\Controllers;
use App\Models\Cliente;
use App\Models\Proyecto;
use App\Models\Imagesfolder;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Storage;
use ManagementFile;

class ImagesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //var_dump('expression');
    }

    /**
     * Show the form for creating a new resource.
     *  
     * @return \Illuminate\Http\Response
     */
    public function create()
    {}

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    
    public function store(Request $request)
    {
      $filename = md5($request->input('filename').date('dmy h:i:s'));
      $base64   = $request->input('base64');
      $project_name   =  strtolower( trim(  $request->input('project_name') ) );
     
      $base_to_php = explode(',', $base64 );
      $data = base64_decode($base_to_php[1]);
      $storage_path = Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix();
      $folder = trim($request->input('folder'));
      $description = trim($request->input('description'));
      $folderGeneral = $request->input('folderGeneral') ;


      if(isset($folder) == false || $folder == ''  || $folderGeneral == 'true' ) {
          $folder =  'General';
      }

      
      
      // verificar si existe el directorio para el proyecto
      // if( !is_dir( $storage_path.'projects/'.$project_name."/General" ) )
      if( !is_dir( $storage_path.'projects/'.$project_name.'/'.$folder ) ){
          // Storage::makeDirectory( 'projects/'.$project_name."/General" );
          Storage::makeDirectory( 'projects/'.$project_name."/".$folder,711,true,true );

          $dataFolder = [
            "token_project" => $project_name,
            "folder_name" => $folder,
            "folder_des" => $description,
            "files" => 1
          ];

          $ImgFolder = new Imagesfolder;
          $ImgFolder->fill($dataFolder);
          $ImgFolder->save();

        }else{

          DB::table('folders_info')
          ->where('token_project',$project_name)
          ->where('folder_name',$folder)
          ->increment('files');
        }

        // $file_path    = $storage_path.'projects/'.$project_name.'/General'.'/'.$filename.'.jpeg';
        $file_path    = $storage_path.'projects/'.$project_name.'/'.$folder.'/'.$filename.'.jpeg';

        file_put_contents($file_path , $data);

        return [
          'result' => "Ok",
          'response' => [
              "folderGeneral" =>  $folderGeneral
          ]
      ];

      }




    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function showAll( $token_project, $folder='General' )
    {
      $array_folder = array();
      $files        = array();
      $array_images = array();
      
      $list_folder = array();
      $list_images = array();


      
      $array_all = array();
      $storage_path = Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix();
      $project_name   =  strtolower( trim(  $token_project ) );
    
      if( !is_dir( $storage_path.'projects/'.$project_name.'/'.$folder ) ){
        return [ 'result'=>'false', 'response' => ['error'=>'No se han exportado imagenes para esta carpeta'] ];
      }
      $array_folder =  $this->list_folder($project_name,  $storage_path);

      if( count($array_folder) == 0 ){ 
        return [ 'result'=>'false', 'response' => ['error'=>'No se han exportado imagenes para esta carpeta'] ];
      }

      foreach ($array_folder as $valor) {
        $list_images =  $this->search_files( 'projects/'.$project_name.'/'.$valor, $storage_path );
        $list_files = Storage::files('projects/'.$project_name.'/'.$valor);
        
          foreach($list_images as $datos)
          {
              $array_images[] = $datos;
          }

          foreach($list_files as $datos)
          {
              $files[] = $datos;
          }

      }


        
    

      return [
        'result' => "Ok",
        'response' => [
            "imagenes" => $array_images,
            "files" => $files,          
            "path" =>  $storage_path,
            "folder" => $project_name,
            "folders" => $array_folder,



        ]
      ];

    }



    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show( $token_project, $folder='General' )
    {
		$array_images = array();
		$array_all = array();
		$storage_path = Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix();
		$project_name   =  strtolower( trim(  $token_project ) );

		if ($project_name === 'all') {
          $directories = Storage::directories('projects');
          $tokens_projects = preg_grep("/^([a-zA-Z0-9\/])*$/", $directories); // Filtrado de directorios válidos. Alphanumerics
          $tokens_projects = preg_replace('/projects\//', '', $tokens_projects);

          $proyectos = Proyecto::select('id', 'cliente_id', 'proyecto', 'created_at', 'token_project')
            ->with(['cliente' => function ($query) {
              $query->select('id', 'nombre_completo');
            }])
            ->whereIn('token_project', $tokens_projects)
            ->orderBy('created_at', 'desc')
            ->get()
            ->toArray();

          foreach ($proyectos as $key => $value) {
            unset($proyectos[$key]['cliente']['proyectos']);
          }

          return response()->json(['proyectos' => $proyectos]);

          // dd($proyectos);

          foreach( $directories as $directory )
          {
            $client_project = $this->infoClientProject( $directory );
            $array_all[] = [ 'show'=>true, 'folder' => $directory, 'client_project'=>$client_project,'images' => $this->search_files( $directory, $storage_path) ];
          }
          return [
            'result' => "Ok",
            'response' => [
              "array_all" => $array_all
            ]
          ];
     }
      if($folder!='General'){
        if( !is_dir( $storage_path.'projects/'.$project_name.'/'.$folder ) )
        return [ 'result'=>'false', 'response' => ['error'=>'No se han exportado imagenes para esta carpeta'] ];

      $array_images =  $this->search_files( 'projects/'.$project_name.'/'.$folder, $storage_path );
      $files = Storage::files('projects/'.$project_name.'/general');

      }else{//$folder= General
        if( !is_dir( $storage_path.'projects/'.$project_name.'/'.$folder ) ){
          $files = Storage::files('projects/'.$project_name.'/');
          if($files>0){ // es un proyecto actiguo
            Storage::makeDirectory( 'projects/'.$project_name."/General" );
            //var_dump($files);
            $array_images =  $this->search_files( 'projects/'.$project_name, $storage_path );
            $n = count($files);
            for ($i=0; $i <$n; $i++) {
              //echo $array_images[$i]['file'];
              $split = explode('/',$array_images[$i]['file']);
              $filename = $split[2];
              rename($storage_path.$array_images[$i]['file'],$storage_path.'projects/'.$project_name."/General/".$filename);
            }
            $array_images =  $this->search_files( 'projects/'.$project_name.'/'.$folder, $storage_path );

          }else{
            return [ 'result'=>'false', 'response' => ['error'=>'No se han exportado imagenes para esta carpeta'] ];
          }
        }else{
          $array_images =  $this->search_files( 'projects/'.$project_name.'/'.$folder, $storage_path );
          $files = Storage::files('projects/'.$project_name.'/general');
        }

      }

      return [
        'result' => "Ok",
        'response' => [
            "imagenes" => $array_images,
            "files" => $files
        ]
    ];

    }
  /**
   * ves que la funcion esta 2 veces
   */
    public function makefolder(Request $request){
      $folder= $request->name;
      $des = $request->des;
      $token = $request->token;
      $storage_path = Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix();

      if( !is_dir( $storage_path.'projects/'.$token.'/'.$folder ) ){


          if(Storage::makeDirectory( 'projects/'.$token."/".$folder,711,true,true )){
            //save info
            $data = [
              "token_project" => $token,
              "folder_name" => $folder,
              "folder_des" => $des,
              "files" => 0
            ];

            $folder = new Imagesfolder;
            $folder->fill($data);
            $folder->save();

            return [
              'result'=> 'Ok',
              'folder'=> $folder,
              'existe'=> false
            ];
          }else{
            return "fail";
          }

        }else{
          return [ 
            'result'=> 'Ok',
            'folder'=> $folder,
            'existe'=> true
          ];
        }     

    }

    public function loadfolder(Request $request){
      $token = $request->token;

      $folders = Imagesfolder::select('folder_name','folder_des','files')->where('token_project',$token)->get()->toArray();

      return response()->json(['folders' => $folders]);
    }

    public function setfolder (Request $request){
      $destino = $request->destino;
      $src = $request->src;
      $token = $request->token;
      $split = explode("/",$src);
      $filename= $split[3];

      $storage_path = Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix();
      $copy = copy($storage_path.$src,$storage_path.'projects/'.$token.'/'.$destino.'/'.$filename);
      if($copy){
        $update = DB::table('folders_info')->where('folder_name',$destino)->increment('files');
        return "done";
      }

    }

    public function deletefolder(Request $request){
      $token = $request->token;
      $folder = $request->folder;

      $storage_path = Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix();
      $dir = 'projects/'.$token.'/'.$folder.'/';
      if(Storage::deleteDirectory($dir)){

        $delete = Imagesfolder::where([
          ['token_project',"=",$token],
          ['folder_name',"=",$folder]
          ])->delete();
        if($delete){
          return 'done';
        }else{
          return 'no se elimino el registro';
        }
      }else{
        return 'Problemas con el directorio';
      }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy( $project_file_name )
    {

      $error = false;
      $storage_path = Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix();
      if( strpos($project_file_name, 'projects') === false ) //si esto se cumple se mando a borrar una imagen
      {
        $project_file_name = 'projects/'.str_replace ( '|' , '/' , $project_file_name );
        if (Storage::exists( $project_file_name ) )
          Storage::delete($project_file_name);
        else
          $error = true;
      }else{ //se mando a borrar un directorio
        $directory = str_replace ( '|' , '/' , $project_file_name );
        if( !is_dir( $directory ) )
          Storage::deleteDirectory( $directory);
        else
          $error = true;
      }

      return [
        'result' => $error  ? "error" : "success"
      ];
    }

		public function delete_project($token_project)
		{
			$proyecto     = Proyecto::where('token_project', $token_project)->first();
			$storage_path = Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix();
			$dir_project  = 'projects/'.$token_project;

			if ($proyecto && Storage::exists($dir_project)) {
				if (Storage::deleteDirectory($dir_project)) {
					return response()->json(['success' => true]);
				}
			}

			return response()->json(['success' => false]);
		}

		public function delete_one_image(Request $request, $token_project)
		{
      $filename = $request->filename;
			$proyecto     = Proyecto::where('token_project', $token_project)->first();
			$storage_path = Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix();
			// $dir_file  = 'projects/'.$token_project.'/'.$folder.'/'.$token_image.'.jpeg';
			$dir_file  = $filename;

			if ($proyecto && Storage::exists($dir_file)) {
				if (Storage::delete($dir_file)) {
					return response()->json(['success' => true]);
				}
			}

			return response()->json(['success' => false]);
		}


    private function list_folder($directory,  $storage_path){

      $ruta =  $storage_path."projects/". $directory . "/";
      $folder = array();

      if(is_dir($ruta)) {
        //fijamos la ruta del directorio que se va a abrir
        if($dir = opendir($ruta)){
 
          while(($archivo = readdir($dir)) !== false) {
            //le avisamos que no lea el "." y los dos ".."
            if($archivo != '.' && $archivo != '..') {
              //comprobramos que se trata de un directorio
              if (is_dir($ruta.$archivo)) {

                $folder[] = $archivo;
              }
            }
          }
        closedir($dir);
      }}

      return $folder;
            
    }

    private function search_files( $directory,  $storage_path )
    {
      /* chuleta formato 16:9
        1024 x576
        1024/16= 64
        576/9= 64

        1280 x 720
        1280/16= 80
        720/9= 80

        1920 x 1080
        1920/16= 120
        1080/9= 120
      */
      $array_images = array();
      foreach(Storage::files( $directory ) as $file )
      {
        $array_images[] = [
          'src' => 'data:image/jpeg;base64,'.base64_encode(file_get_contents($storage_path.$file)),
          'w'=> '1920',
          'h'=> '1080',
          'file'=>$file
        ];
        //$contents = Storage::get($file);
        //var_dump($contents);
      }
      return $array_images;
    }

    private function infoClientProject( $token_project )
    {
      $token = explode('/', $token_project)[1];
      $info_project = DB::table('clientes')
            ->join('proyectos', 'clientes.id', '=', 'proyectos.cliente_id')
            ->select('proyectos.proyecto', 'clientes.nombre_completo')
             ->where('proyectos.token_project', '=',$token)->get();

     return isset( $info_project[0] ) ? ($info_project[0]->nombre_completo
.' '.$info_project[0]->proyecto) : 'sin_definir';

    }

	public function delete_multiple(Request $request)
	{
		$this->validate($request, [
			'images' => 'required|array|min:1',
		]);

		$images = $request->input('images', []);
    $folder = $request->current;
    $countfiles = 0;
		try {
			foreach ($images as $image) {

				if (Storage::disk("local")->exists($image)) {
					if (!Storage::disk("local")->delete($image)) {
						Log::warning("Imagen no eliminada: => ".$image);
					}
				} else {
					Log::warning("Imagen a eliminar no existe: => ".$image);
				}
        $countfiles++;
			}
         for ($i=0; $i < $countfiles; $i++) {
            $update = DB::table('folders_info')->where('folder_name',$folder)->decrement('files');
         }
			return response()->json([
				'success' => true
			]);
		} catch (Exception $e) {
			Log::warning("Error al elimnar imagen: => ".$e->getMessage());

			return response()->json([
				'error' => true,
				// 'msg' => $e->getMessage(),
			]);
		}

	}
}
