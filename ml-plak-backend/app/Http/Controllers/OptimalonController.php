<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use GuzzleHttp\Cookie\FileCookieJar;
use Illuminate\Http\Request;

class OptimalonController
{
    private $client;
   
    private $OPTIMALON_USER = "ventasmlplak@gmail.com";
    private $OPTIMALON_PASSWORD = "cortes12";
    private $OPTIMALON_PROJECT_ID = 122822; //108220;

    public function __construct() {
        $cookieFile = storage_path().'/temp/cookie.txt';
        $cookieJar = new FileCookieJar($cookieFile, true);
        $this->client = new Client([
            "base_uri" => "http://optimalon.com",
            "cookies" => $cookieJar
        ]);
    }

    public function verify_login() {
        $result = $this->client->request('GET', 'cutter/Project');
        
        // If not Logged...
        if (strpos($result->getBody(), "Existing User Login")) {
            // Login
            $result = $this->client->request('POST', 'cutter/User/Login', [
                'form_params' => [
                    "EditButton" => "Login",
                    "TimeZone" => "180",
                    "logEmail" => $this->OPTIMALON_USER,
                    "logPassword" => $this->OPTIMALON_PASSWORD
                ]
            ]);
            // Verify logged in
            if (strpos($result->getBody(), "Existing User Login")) {
                return false;
            }
        }

        // Select OptimalonWeb project
        $result = $this->client->request('GET', 'cutter/Project/project_select?key=' . $this->OPTIMALON_PROJECT_ID);
        return true;
    }

    public function configure_project($options) {
        $sawKerf = $options['sawKerf'];
        $trim = $options['trim'];
        $projectName = $options['projectName'];

        // Project Name
        $res = $this->client->request('POST', 'cutter/Project/project_rename?key=' . $this->OPTIMALON_PROJECT_ID, [
            'form_params' => [
                "EditButton" => "Save",
                "prjName" => $projectName
            ]
        ]);

        // Saw Kerf
        $res = $this->client->request('POST', 'cutter/settings/saw_kerf', [
            'form_params' => [
                "EditButton" => "Save",
                "Sawkerf" => $options['sawKerf']
            ]
        ]);

        // Trims
        $res = $this->client->request('POST', 'cutter/settings/trims', [
            'form_params' => [
                "EditButton" => "Save",
                "Trimbottom" => $options['trim'],
                "Trimleft" => $options['trim'],
                "Trimright" => $options['trim'],
                "Trimtop" => $options['trim'],
            ]
        ]);

        // Min Rotation
        $res = $this->client->request('POST', 'cutter/settings/cut_config', [
            'form_params' => [
                "EditButton" => "Save",
                "minrotation" => "true"
            ]
        ]);

        // Cutting Complexity (Cut Level)
        $res = $this->client->request('POST', 'cutter/settings/cut_level', [
            'form_params' => [
                "EditButton" => "Save",
                "level"=>$options['cut_level']

            ]
        ]);
    }

    public function AddPanels($panels)
    { 
      foreach ($panels as $key => $panel ) { 
        $res = $this->client->request('POST', 'cutter/Panel/create', [
          'form_params' => [
              "EditButton" => "Save",
              "FActive" => "true",
              "objName" => $panel['nombre'],
              "FLength" => $panel['largo'],
              "FWidth" => $panel['ancho'],
              "FCount" => $panel['cantidad'],
          ]
        ]);
         
      }
    }

    public function AddParts($parts)
    { 
      foreach ($parts as $key => $part ) { 
        $res = $this->client->request('POST', 'cutter/Part/create', [
          'form_params' => [
              "EditButton" => "Save",
              "FActive" => "true",
              "Rotatable" => "false",
              "objName" => $part['nombre'],
              "FLength" => $part['lveta'],
              "FWidth" => $part['aveta'],
              "FCount" => $part['cantidad'],              
          ]
        ]);
         
      }
    }

    public function import_panels($panels_path) {

        $result = $this->client->request('POST', 'cutter/panel/import', [
            'multipart' => [
                [
                    'name'     => 'EditButton',
                    'contents' => 'OK'
                ],
                [
                'name'     => 'file',
                'contents' => fopen($panels_path, 'r')
                ]
            ]
        ]);

        return $this->client->request('GET', 'cutter/Panel');
    }

    public function import_parts($parts_path) {
        $result = $this->client->request('POST', 'cutter/part/import', [
            'multipart' => [
                [
                    'name'     => 'EditButton',
                    'contents' => 'OK'
                ],
                [
                'name'     => 'file',
                'contents' => fopen($parts_path, 'r')
                ]
            ]
        ]);

        return $this->client->request('GET', 'cutter/Part');
    }

    public function optimize() {
        $result = $this->client->request('GET', 'cutter/run/start');
        // Volver a ejecutar una vez si todavia no se termino de optimizar
        if (strpos($result->getBody(), 'The calculation is in process. Please wait...')) {
            // Wait 5 seconds
            usleep(5000000);

            // Check again
            $result = $this->client->request('GET', 'cutter/run');
        }

        if (strpos($result->getBody(), 'The calculation finished successfully!')) {
            return false;
        } else if (strpos($result->getBody(), 'cannot be placed because exceeds the stock size.')) {
            return 'Error de stock en Optimalon';
        } else if (strpos($result->getBody(), 'The calculation finished un-successful.')) {
            $body = $result->getBody();
            $inicio = strpos($body, '<div id="full">');
            $fin = strlen($result->getBody());
            $respuesta = substr($body, $inicio, $fin );
            $respuesta = str_replace( '<button', '<button style="display: none;" ', $respuesta );
            $respuesta = str_replace( '<p style="margin-top:30px; margin-bottom:30px;">', '<p style="display: none;">', $respuesta );
            
            return ['vue'=>'Error general en Optimalon '.$respuesta, 'angular'=>'Error general en Optimalon'];
        }

        return 'Error en OptimizadorWeb';
    }

    public function export() {
        $result = $this->client->request('POST', 'cutter/result/export_pdf', [
            'form_params' => [
                'exportType' => 'false', // Export By Panels
                'chkSummary' => 'true', // Result Summary
                'chkShowPartList' => 'true', // List of Parts, IDs and dimensions
                'chkShowParts' => 'true', // Graphical image of parts
                'chkShowCuts' => 'false', // Graphical image of guillotine cuts
                'chkLayoutCut' => 'false', // List of guillotine cut coordinates
                'cmbPage' => 0, // A4
                'pageType' => 'True', // Portrait
                'EditButton' => 'ExcelBin'
            ]
        ]);

        return $result;
    }

    /*
    private function create_project($projectName) {
        $result = $this->client->request('POST', 'cutter/Project', [
            'form_params' => [
                "EditButton" => "Save",
                "prjName" => $projectName
            ]
        ]);
    }
    */
}
