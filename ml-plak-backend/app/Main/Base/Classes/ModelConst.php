<?php

namespace App\Main\Base\Classes;

class ModelConst
{   
    public const PROYECTO_AREA_CORTE = 1;
    public const PROYECTO_AREA_TAPACANTO = 2;
    public const PROYECTO_AREA_PREARMADO = 3;
    public const PROYECTO_AREA_NOTA_ACCION = 4;
    public const PROYECTO_AREA_CAJON = 5;
    public const PROYECTO_AREA_MODULO = 6;

    public const ETAPA_DISENNO = 1;
    public const ETAPA_CORTES = 2;
    public const ETAPA_TAPACANTOS = 3;
    public const ETAPA_PREARMADO = 4;
    public const ETAPA_MODULO = 5;
    public const ETAPA_CAJON = 6;
    public const ETAPA_CONTROL = 7;
    public const ETAPA_INSTALACION = 8;
    
    public const MOTIVO_ERROR_1 = 1;
    public const MOTIVO_ERROR_2 = 2;
    public const MOTIVO_ERROR_3 = 3;
    public const MOTIVO_ERROR_4 = 4;
    public const MOTIVO_ERROR_5 = 5;
    public const MOTIVO_ERROR_6 = 6;
    public const MOTIVO_ERROR_7 = 7;
    public const MOTIVO_ERROR_8 = 8;

    public const AUDIT_ESTADOS = [
        '{"estado_id":1}',
        '{"estado_id":2}',
        '{"estado_id":3}',
        '{"estado_id":4}',
        '{"estado_id":5}',
        '{"estado_id":6}',
        '{"estado_id":7}',
        '{"estado_id":8}',
        '{"estado_id":9}',
        '{"prearmado_estado_id":1}',
        '{"prearmado_estado_id":2}',
        '{"prearmado_estado_id":3}',
        '{"prearmado_estado_id":4}',
        '{"prearmado_estado_id":5}',
        '{"prearmado_estado_id":6}',
        '{"prearmado_estado_id":7}',
        '{"prearmado_estado_id":8}',
        '{"prearmado_estado_id":9}'
    ];

    public const AUDIT_ESTADOS_PIEZAS = [
        '{"estado_id":1}',
        '{"estado_id":2}',
        '{"estado_id":3}',
        '{"estado_id":4}',
        '{"estado_id":5}',
        '{"estado_id":6}',
        '{"estado_id":7}',
        '{"estado_id":8}',
        '{"estado_id":9}' 
    ];    
    
    public const AUDIT_ESTADOS_TAPACANTOS = [
        '{"prearmado_estado_id":1}',
        '{"prearmado_estado_id":2}',
        '{"prearmado_estado_id":3}',
        '{"prearmado_estado_id":4}',
        '{"prearmado_estado_id":5}',
        '{"prearmado_estado_id":6}',
        '{"prearmado_estado_id":7}',
        '{"prearmado_estado_id":8}',
        '{"prearmado_estado_id":9}'
    ];  

    public const AUDIT_ESTADOS_AREAS = '"estado_id":';
    public const AUDIT_ESTADOS_PREARMADO_AREAS = '"prearmado_estado_id":';
}    