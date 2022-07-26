<!doctype html>
<html lang="es">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <title>PDF</title>
        <style>
        body{
            font-size: 13px;
        }
        .page-break {
            page-break-after: always;
        }
        </style>
    </head>
    <body>
            <div class="row">
                <div class="col-xs-6">
                    <h4>Usuario: {{ $data->asistencias[0]['usuario']['usuario'] }}</h4>
                    <p><b>Dias trabajados:</b> {{$data->calculadora['dias_trabajados']}} x ${{$data->calculadora['sueldo_dia']}}</p>
                    <p><b>Horas extras:</b> {{$data->calculadora['horas_extras']}} x ${{$data->calculadora['valor_horas_extras']}}</p>

                </div>
                <div class="col-xs-6" style="text-align:right;">
                    <h5>Subtotal: </h5>
                    <p><b>Sueldo:</b> ${{$data->calculadora['dias_trabajados'] * $data->calculadora['sueldo_dia']}}</p>
                    <p><b>Horas extras:</b> ${{$data->calculadora['horas_extras'] * $data->calculadora['valor_horas_extras']}}</p>
                    <p><b>Premio:</b> ${{$data->calculadora['pcd']}}</p>
                    <p><b>Compensacion:</b> ${{$data->calculadora['compensacion']}}</p>
                    <p><b>Descuento:</b> ${{$data->calculadora['descuento']}}</p>
                    <h4>Total: ${{ ($data->calculadora['dias_trabajados'] * $data->calculadora['sueldo_dia']) + ($data->calculadora['horas_extras'] * $data->calculadora['valor_horas_extras']) + $data->calculadora['pcd'] + $data->calculadora['compensacion'] + $data->calculadora['descuento']}}</h4>
                    <p> <b>Observacion:</b> {{$data->calculadora['observacion']}}</p>
                </div>
            </div>

            <div class="row" style="margin-top: -25px;">
                <div class="col-xs-12">
                	<table  class="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th>Dia</th>
                                <th>Fecha</th>
                                <th>Tipo</th>
                                <th>Causa/Salida</th>
                                <th>Observacion</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($data->asistencias as $asistencia)
                                <tr>
                                    <td>{{ $asistencia['dia'] }}</td>
                                    <td style="width: 150px;text-align:center;">{{ $asistencia['fecha'] }}</td>
                                    <td>{{ $asistencia['tipo_asistencia']['tipo'] }}</td>
                                    <td>
                                        @if ($asistencia['tipo_asistencia_id'] == 3 || $asistencia['tipo_asistencia_id'] == 4) {{$asistencia['tipo_salida']['tipo']}}  @else @if(empty($asistencia['asistencia_causa'])) N/A @else {{ $asistencia['asistencia_causa']['causa'] }}  @endif @endif
                                    </td>
                                    <td>
                                        @if( $asistencia['observacion'] ) {{$asistencia['observacion']}} @else N/A @endif
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
    </body>
</html>
