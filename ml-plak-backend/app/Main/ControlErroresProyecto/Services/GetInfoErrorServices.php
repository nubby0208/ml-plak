<?php

namespace App\Main\ControlErroresProyecto\Services;

use App\Main\ControlErroresProyecto\Models\ControlErroresProyectoArea;

class GetInfoErrorServices
{

    public static function execute($proyectoAreaType, $proyectoAreaId)
    {
        $controlErroresProyectoArea = ControlErroresProyectoArea::query()
        ->where("proyecto_area_type", $proyectoAreaType)
        ->where("proyecto_area_id", $proyectoAreaId)
        ->count();

        if ($controlErroresProyectoArea > 0) {
            return true;
        }				
        return false;
    }
}
