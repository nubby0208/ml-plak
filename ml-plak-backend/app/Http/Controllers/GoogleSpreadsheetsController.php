<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use App\Providers\GoogleSpreadsheetsClient;

use Google_Client;
use Google_Spreadsheet_DefaultServiceRequest;
use Google_Spreadsheet_ServiceRequestFactory;
use Google_Spreadsheet_SpreadsheetService;
use Google_Service_Drive_DriveFile;

use Google_Service_Drive;
use Google_Service_Sheets;

class GoogleSpreadsheetsController
{
    // ID de carpeta de optimizaciones
    public $FOLDER_ID = "0B48Iht9OCsBUN3JNbllSMDlMblk";

    public $CREDENTIALS_PATH = __DIR__ . '/credentials.json';

    private function getClient() {
        $googleSheets = app()->make(\App\Providers\GoogleSpreadsheetsClient::class);
        $googleSheets->login();

        return $googleSheets->client;
    }

    public function authorize(Request $request, GoogleSpreadsheetsClient $googleSheets) {
        $client = $googleSheets->client;

        if (!$request->has('code')) {
            // Request authorization from the user.
            return redirect($client->createAuthUrl());
        }

        $authCode = $request->input('code');
        $credentialsPath = $this->CREDENTIALS_PATH;

        // Exchange authorization code for an access token.
        $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);
    
        // Create directory if not exists
        if(!file_exists(dirname($credentialsPath))) {
            mkdir(dirname($credentialsPath), 0700, true);
        }

        // Store the credentials to disk.
        file_put_contents($credentialsPath, json_encode($accessToken));

        // Return
        return response("Credenciales guardadas correctamente");
    }

    // Subir documento PDF de optimizacion
    public function upload_document($fileMetadata, $content) {
        $client = $this->getClient();        
        $driveService = new Google_Service_Drive($client);

        $file = $driveService->files->create($fileMetadata, array(
            'data' => $content,
            'mimeType' => 'application/pdf',
            'uploadType' => 'multipart',
            'fields' => 'id'));

        return $file;
    }

    // Exportar documento de partes y paneles como archivo XLSX
    public function export_spreadsheet($fileId) {
        $client = $this->getClient();        
        $driveService = new Google_Service_Drive($client);

        $response = $driveService->files->export(
            $fileId, 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            [ 'alt' => 'media' ]
        );

        return $response->getBody()->getContents();
    }

    // Crear carpeta en Drive
    public function create_folder($folder_name, $parent_id) {
        $client = $this->getClient();        
        $driveService = new Google_Service_Drive($client);

        $fileMetadata = new Google_Service_Drive_DriveFile([
            'name' => $folder_name,
            'mimeType' => 'application/vnd.google-apps.folder',
            'parents' => [ $parent_id ]
        ]);

        return $driveService->files->create($fileMetadata, [ 'fields' => 'id' ]);
    }

    // Buscar carpeta en Drive
    public function search_folder($folder_name, $parent_id) {
        $client = $this->getClient();        
        $driveService = new Google_Service_Drive($client);

        // Buscar nodos de tipo carpeta que tengan ese nombre
        $response = $driveService->files->listFiles([
            'q' => "mimeType='application/vnd.google-apps.folder' and name='$folder_name' and '$parent_id' in parents",
            'fields' => 'nextPageToken, files(id, name)'
        ]);

        return $response->files ? $response->files[0] : null;
    }

    // Buscar una carpeta por nombre y crearla si no existe
    public function get_or_create_folder($folder_name) {
        $parent_id = $this->FOLDER_ID;

        // Buscar una carpeta existente con ese nombre
        $folder = $this->search_folder($folder_name, $parent_id);

        // En caso de que no exista, crear y devolver el id de la nueva carpeta
        return $folder ? $folder : $this->create_folder($folder_name, $parent_id);
    }

    // Obtener ultima optimizacion segun el nombre de la hoja y el proyecto
    public function get_last_file($project_name, $sheet_name) {
        $client = $this->getClient();        
        $driveService = new Google_Service_Drive($client);

        // Buscar la carpeta del proyecto
        $project_folder = $this->search_folder($project_name, $this->FOLDER_ID);

        // Si no existe la carpeta retornar null
        if (!$project_folder) {
            return null;
        }

        $project_folder_id = $project_folder->id;

        // Buscar archivos y ordenarlos por fecha de creacion
        $response = $driveService->files->listFiles([
            'q' => "mimeType!='application/vnd.google-apps.folder' and name = '$sheet_name.pdf' and '$project_folder_id' in parents",
            'orderBy' => "modifiedTime desc",
            'fields' => 'nextPageToken, files(id, name)'
        ]);

        // Devolver el primer resultado o null
        return $response->files ? $response->files[0] : null;
    }
}
