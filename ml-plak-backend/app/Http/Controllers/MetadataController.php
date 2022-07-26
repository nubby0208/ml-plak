<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\ProyectoMetadataMaterial;

class MetadataController extends Controller
{
    public function update_material(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $metadata_material = ProyectoMetadataMaterial::findOrFail((int) $id);
            $metadata_material->update($request->all());
            
            DB::commit();

            return response()->json(['success' => true, 'material' => $metadata_material]);
        } catch (\Exception $e) {
            Log::error($e->getMessage().' '.$e->getLine());
            DB::rollback();

            return response()->json(['error' => 'Error al realizar la actualización']);
        }
    }
}