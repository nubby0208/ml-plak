<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Log;

use Google_Client;
use Google_Service_Sheets;
use Google_Service_Drive;

class GoogleSpreadsheetsClient {

    public $client;

    public $CREDENTIALS_PATH = __DIR__ . '/../Http/Controllers/credentials.json';

    public function __construct() {
        $APPLICATION_NAME = "ML Plak - Optimizador Web";
        $SCOPES = implode(' ', [
            Google_Service_Sheets::SPREADSHEETS,
            Google_Service_Drive::DRIVE_METADATA_READONLY,
            Google_Service_Drive::DRIVE_FILE,
            Google_Service_Drive::DRIVE_READONLY
        ]);
        $CLIENT_SECRET_PATH = __DIR__ . '/../Http/Controllers/client_secrets.json';
        
        $this->client = new Google_Client();
        $this->client->setApplicationName($APPLICATION_NAME);
        $this->client->setScopes($SCOPES);
        $this->client->setAuthConfig($CLIENT_SECRET_PATH);
        $this->client->setAccessType('offline');
        $this->client->setApprovalPrompt("force");
        $this->client->setRedirectUri(url('authorize'));
    }

    public function login() {
        $client = $this->client;

        // Load previously authorized credentials from a file.
        $credentialsPath = $this->CREDENTIALS_PATH;
        if (file_exists($credentialsPath)) {
          $accessToken = json_decode(file_get_contents($credentialsPath), true);
        } else {
            Log::error('[Spreadsheets] Login failed. Credentials not found');
            return false;
        }

        if ($accessToken == null) {
            Log::error('[Spreadsheets] Error! Previous Access Token is null');
            return null;
        }

        $client->setAccessToken($accessToken);
      
        // Refresh the token if it's expired.
        if ($client->isAccessTokenExpired()) {
            Log::debug('[Spreadsheets] Access token expired. Fetching new token');
            Log::debug($accessToken);
            Log::debug($client->getRefreshToken());
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
            file_put_contents($credentialsPath, json_encode($client->getAccessToken()));
        }

        Log::debug('[Spreadsheets] Logged in');
        return true;
    }
}

class GoogleSpreadsheetsProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(GoogleSpreadsheetsClient::class, function ($app) {
            $client = new GoogleSpreadsheetsClient();
            return $client;
        });
    }
}
