<?php

namespace App\Main\ControlErroresProyecto\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 *
 */
class StoreControlErroresProyectoAreaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'proyecto_area_id' => 'required|integer|min:1', 
            'proyecto_area_type' => 'required|integer|min:1|exists:mysql.proyecto_areas,id', 
            'proyecto_etapa_id' => 'required|integer|min:1|exists:mysql.proyecto_etapas,id', 
            'error_proyecto_motivo_id' => 'required|integer|min:1|exists:mysql.error_proyecto_motivos,id', 
            'comentario' => 'nullable|string'
        ];
    }
}
