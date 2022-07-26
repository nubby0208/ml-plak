<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use App\Providers\GoogleSpreadsheetsClient;

use Google_Service_Sheets;
use Google_Service_Sheets_ValueRange;
use Google_Service_Sheets_BatchUpdateValuesRequest;

class DisenioController extends Controller
{
    private function check_null($value, $defaultValue='') {
        return isset($value) ? $value : $defaultValue;
    }

    private function process_parts($parts) {
        $lines = [];

        foreach ($parts as $part) {
            $line = array_fill(0, 87, '');
            $inputMap = [
                1 => $part['Count'], // B
                2 => $part['Name'], // C
                4 => $part['Module'], // E
                6 => $part['Espesor'], // G

                18 => $this->check_null($part['tapacantos']['izquierdo']), // S
                19 => $this->check_null($part['tapacantos']['derecho']), // T
                33 => $this->check_null($part['tapacantos']['superior']), // AH
                34 => $this->check_null($part['tapacantos']['inferior']), // AI

                24 => $part['LVeta'], // Y
                27 => $part['AVeta'], // AB

                42 => $part['Material'], // AQ
                82 => $part['Orientacion'], // CE

                84 => $part['Y'], // CG
                85 => $part['X'], // CH
                86 => $part['Z'], // CI
            ];

            foreach ($inputMap as $key => $value) {
                $line[$key] = $value;
            }

            $lines[] = $line;
        }

        return $lines;
    }

    public function export(Request $request, GoogleSpreadsheetsClient $googleSheets) {
        // if (!$googleSheets->login()) {
        //     return response('Error authenticating with Google Credentials');
        // }

        $info = $request->input('info');
        $parts = $request->input('parts');

				echo json_encode($info);
				echo json_encode($parts);
				t();

        $sheetsService = new Google_Service_Sheets($googleSheets->client);
        $values = new Google_Service_Sheets_BatchUpdateValuesRequest([
            'valueInputOption' => 'USER_ENTERED',
            'data' => [
                new Google_Service_Sheets_ValueRange([
                    'range' => 'INMOD!F16:F21',
                    'values' => [
                        [ $info['name'] ],
                        [ $info['address'] ],
                        [ $info['phone'] ],
                        [ $info['mueble'] ],
                        [ $info['total'] ],
                        [ $info['senia'] ]
                    ]
                ]),

                new Google_Service_Sheets_ValueRange([
                    'range' => 'INMOD!F23:F25',
                    'values' => [
                        [ $info['fechaInstalacion'] ],
                        [ $info['horaInstalacion'] ],
                        [ $info['comentarioInstalacion'] ]
                    ]
                ]),

                new Google_Service_Sheets_ValueRange([
                    'range' => 'interface!A1033:CI' . (1033 + sizeof($parts) - 1),
                    'values' => $this->process_parts($parts)
                ])
            ]
        ]);
        
        $sheetId = config('disenio.sheet_id_mod');
        Log::info("Saving in spreadsheet {$sheetId}", [ 'sheetId' => $sheetId, 'values' => $values ]);
        $resp = $sheetsService->spreadsheets_values->batchUpdate($sheetId, $values);
        
        return response(json_encode($resp));
    }
}
