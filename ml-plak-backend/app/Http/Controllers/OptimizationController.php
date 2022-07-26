<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use GuzzleHttp\Cookie\FileCookieJar;
use Illuminate\Http\Request;

use Google_Service_Drive_DriveFile;
use Storage;
use ManagementFile;

use Maatwebsite\Excel\Facades\Excel;

class OptimizationController extends Controller
{
  public function optimizar(Request $request) {
      $panels = $request->input('data')['panels'];
      $parts = $request->input('data')['parts'];
      $infoProject = $request->input('data')['infoProject'];

      //var_dump($parts);d();
      
      $DEFAULT_SAWKERF = $infoProject['sawKerf'] ? $infoProject['sawKerf'] : 7;
      $DEFAULT_TRIM = $infoProject['trim'] ? $infoProject['trim'] : 7;
      $DEFAULT_PROJECT_NAME = $infoProject['projectName'] ? $infoProject['projectName'] : 'Optimalon Web';
      $CUT_LEVEL = $infoProject['cut_level'] ? $infoProject['cut_level'] : '';

      $parts_panels_path = storage_path().'/temp';

      if( !is_dir( $parts_panels_path ) )
        Storage::makeDirectory( $parts_panels_path );
      
      /*Generar el Archivo CSV para las Partes*/
      $file = fopen($parts_panels_path.'/parts.csv','w+');
      fwrite($file, 'Active,Name,Length[mm],Width[mm],Count,Rotatable'."\n");
       
      foreach ($parts as $key => $part) { 
        fwrite($file, 'YES,'.$part['nombre'].','.$part['lveta'].','.$part['aveta'].','.$part['cantidad'].','.$part['rotable']."\n");
                
      } 
      fclose($file);
      

      /*Generar el Archivo CSV para los Panels*/
      $file = fopen($parts_panels_path.'/panels.csv','w+');
      fwrite($file, 'Active,Name,Length[mm],Width[mm],Count'."\n");
       
      foreach ($panels as $key => $panel) { 
        fwrite($file, 'YES,'.$panel['nombre'].','.$panel['largo'].','.$panel['ancho'].','.$panel['cantidad']."\n");
                
      } 
      fclose($file);
                   


      $optimalon = new OptimalonController();
      
      // Verify Credentials
      if (!$optimalon->verify_login()) {
          return response('Error durante la conexion con Optimalon', 400);
      }

      // Configure Project
      $optimalon->configure_project([
          "sawKerf" => $DEFAULT_SAWKERF,
          "trim" => $DEFAULT_TRIM,
          "projectName" => $DEFAULT_PROJECT_NAME,
          "cut_level"=>$CUT_LEVEL,
          "exportType" => false
      ]);
      
      // Import Panels
      $result = $optimalon->import_panels($parts_panels_path.'/panels.csv');
      //$result = $optimalon->AddPanels($panels);
      
      // Import Parts
      $result = $optimalon->import_parts($parts_panels_path.'/parts.csv');
      //$result = $optimalon->AddParts($parts);

      // Optimize
      $result = $optimalon->optimize();
      if ($result) {
          return response($result, 400);
      }

      // Export to PDF
      $result = $optimalon->export();
      
      $content = $result->getBody()->getContents();
      //$fileUrl = storage_path().'/app/projects/'.$DEFAULT_PROJECT_NAME.'.pdf';
      
      $storage_path = Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix();
      $file_path    = $storage_path.'projects/'.$DEFAULT_PROJECT_NAME.'.pdf';
      
      
      file_put_contents($file_path , $content);

      return [
          'result' => "Ok", 
          'response' => [ 
              "url" => $file_path
          ]
      ]; 
  }

  public function get_optimizacion(Request $request, $project_name ) {
      
      if (!$project_name) {
          return [ 'optimizado' => false ];
      }

      $storage_path =Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix();
      $file_path    = 'projects/'.$project_name.'.pdf';
       //var_dump( $storage_path.$file_path, Storage::disk('local')->exists($file_path));f();
      if (Storage::disk('local')->exists($file_path)) 
       return [ 'optimizado' => true ];
          
    

      return [ 'optimizado' => false ];
  }

  public function download_pdf( Request $request, $project_name  )
  { 
    $project_name = trim($project_name);

    if (!$project_name) {
          return [ 'success' => false ];
    }
    
    $storage_path = Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix();
    $file_path    = 'projects/'.$project_name.'.pdf';

    if (Storage::disk('local')->exists($file_path)) {
      return  response()->download($storage_path.$file_path);
    }

    return [ 'success' => false ];
  }
}
