<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
  <title>{{$titulo}}</title>
  <style type="text/css">
    .clearfix:after {
      content: "";
      display: table;
      clear: both;
    }

    a {
      color: #0087C3;
      text-decoration: none;
    }

    body {
      position: relative;
      height: 29.7cm;
      margin: 0 auto;
      color: #555555;
      background: #FFFFFF;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 12px;
    }

    header {
      padding: 10px 0;
      margin-bottom: 20px;
      border-bottom: 1px solid #AAAAAA;
    }

    #logo {
      float: left;
      position: relative;
      top: -18px;
    }

    #logo img {
      height: 70px;
    }

    #company {
      float: right;
      text-align: right;
      position: relative;
      top: -30px;
    }


    #details {
      margin-bottom: 30px;
    }

    #client {
      padding-left: 6px;
      border-left: 6px solid #d5212E;
      float: left;
    }

    #client .to {
      color: #777777;
    }

    h2#name {
      font-size: 1.2em;
      font-weight: normal;
      margin: 0;
    }

    #invoice {
      float: right;
      text-align: right;
    }

    #invoice h1 {
      color: #d5212E;
      font-size: 2.2em;
      line-height: 1em;
      font-weight: normal;
      margin: 0 0 10px 0;
    }

    #invoice .date {
      font-size: .9em;
      color: #777777;
    }

    .tableHtml {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      margin-bottom: 20px;
      margin-top: 8px;
    }

    .tableHtml th,
    .tableHtml td {
      padding: 7px;
      background: #EEEEEE;
      text-align: center;
      border-bottom: 1px solid #FFFFFF;
    }

    .tableHtml th {
      white-space: nowrap;
      font-weight: normal;
    }

    .tableHtml td {
      text-align: right;
    }

    .tableHtml td h3 {
      color: #57B223;
      font-size: 1em;
      font-weight: normal;
      margin: 0 0 0.2em 0;
    }

    .tableHtml .no {
      color: #FFFFFF;
      font-size: 1.4em;
      background: #57B223;
    }

    .tableHtml .desc {
      text-align: left;
    }

    .tableHtml .unit {
      background: #DDDDDD;
    }

    .tableHtml .qty {}

    .tableHtml .total {
      background: #999999;
      color: #FFFFFF;
    }

    .tableHtml td.unit,
    .tableHtml td.qty,
    .tableHtml td.total {
      text-align: center;
      font-size: 1em;
    }

    .tableHtml tbody tr:last-child td {
      border: none;
    }

    .tableHtml tfoot td {
      padding: 10px 20px;
      background: #FFFFFF;
      border-bottom: none;
      font-size: 1em;
      white-space: nowrap;
      border-top: 1px solid #AAAAAA;
    }

    .tableHtml tfoot tr:first-child td {
      border-top: none;
    }

    .tableHtml tfoot tr:last-child td {
      color: #57B223;
      font-size: 1.2em;
      border-top: 1px solid #57B223;

    }

    .tableHtml tfoot tr td:first-child {
      border: none;
    }

    #thanks {
      font-size: 1.7em;
      margin-bottom: 50px;
    }

    #notices {
      padding-left: 6px;
      border-left: 6px solid #d5212E;
    }

    #notices .notice {
      font-size: 1em;
    }

    footer {
      color: #777777;
      width: 100%;
      height: 30px;
      position: absolute;
      bottom: 0;
      border-top: 1px solid #AAAAAA;
      padding: 8px 0;
      text-align: center;
    }

    #mlplak {
      font-size: 48px;
      font-weight: bold;
    }

    .comma span:after {
      content: ",";
    }

    .comma span:last-child {
      content: "TEST";
    }

    #block {
      display: block;
    }

    .descripcion {
      font-size: 18px;
      position: absolute;
      top: 35px;
    }
    .pdf-pre {
      margin-top: 15px;
      text-align: left;
      font-family: segoe ui;
      font-size: 12px;
    }
    .divisor{
        border-bottom: 1px solid #AAAAAA;
    }
  </style>
</head>
<body>
  <header class="clearfix">
    <div id="logo">
      <span id="mlplak">MLPLAK</span>
    </div>
    <div id="company">
      <span class="descripcion">Fecha: {{$fecha}}</span>
    </div>
  </header>
  <main>
    
  <table style="width:100%; font-size:12pt;" border="0">
        <tr style="background: #796161; color: #FFFFFF;">
            <td align="center">
                <b>Detalle del cliente</b>
            </td>
        </tr>
    </table>
    <div class="grupo">

        <table style="width:100%; font-size:12pt;" border="0">
            <tr>
                <td><b>Estado del Proyecto:</b> {{$proyect_data->info->estadoProyecto}}</td>
                <td><b>Nombre y Apellido:</b> {{$proyect_data->info->name}}</td>
            </tr>
            <tr>
                <td><b>Dirección:</b> {{$proyect_data->info->address}}</td>
                <td><b>Teléfono:</b> {{$proyect_data->info->phone}}</td>
            </tr>
            <tr>
                <td><b>Mueble:</b> {{$proyect_data->info->mueble}}</td>
                <td><b>Comentario:</b> {{$proyect_data->info->comentarioInstalacion}}</td>
            </tr>
        </table>
        
    </div>

    <br>
    <br>

    <table style="background: #796161; color: #FFFFFF; width:100%; font-size:12pt;" border="0">
        <tr>
            <td align="center">
                <b>Fechas</b>
            </td>
        </tr>
    </table>
    
    <div class="grupo">
        <br>
        <table style="width:100%;" border="0">
            <tr>
                <td colspan="3" align="center"><h4>Medición</h4></td>
            </tr>
            <tr align="center">
                <td>Fecha</td>
                <td>Hora</td>
                <td>Comentario</td>
            </tr>
            @foreach($mediciones as $med)
              <tr align="center">
                <td>{{date("d-m-Y", strtotime($med["fecha_medinst"]))}}</td>
                  <td>{{date("h:i:s A", strtotime($med["fecha_medinst"]))}}</td>
                  <td>{{$med["comentario"]}}</td>
              </tr>
            @endforeach
        </table>
        <br>
        <table style="width:100%;" border="0">
            <tr>
                <td colspan="3" align="center"><h4>Instalación</h4></td>
            </tr>
            <tr align="center">
                <td>Fecha</td>
                <td>Hora</td>
                <td>Comentario</td>
            </tr>
            @foreach($instalaciones as $inst)
              <tr align="center">
                  <td>{{date("d-m-Y", strtotime($inst["fecha_medinst"]))}}</td>
                  <td>{{date("h:i:s A", strtotime($inst["fecha_medinst"]))}}</td>
                  <td>{{$inst["comentario"]}}</td>
              </tr>
            @endforeach
        </table>

    </div>

    <br>
    <table style="background: #796161; color: #FFFFFF; width:100%; font-size:12pt;" border="0">
        <tr>
            <td align="center">
                <b>Pago</b>
            </td>
        </tr>
    </table>

    <br>
    <div class="grupo">

    <table style="width:100%;" border="1">
            <tr align="center">
                <td>Monto</td>
                <td>Producto</td>
                <td>Fecha</td>
                <td>Usuario</td>
            </tr>

          @php
            $sumItems = 0;
          @endphp

          
          @foreach($proyect_data->info->items as $items)
            @php
              $sumItems += $items->monto;
            @endphp
              <tr align="center">
                <td>{{$items->monto}}</td>
                <td>{{$items->descripcion}}</td>
                <td>{{$items->date}}</td>
                <td>{{$items->createdBy}}</td>
              </tr>
            @endforeach
            
            <tr align="center" style="background: #999999; color: #FFFFFF;">
                <td>
                    ${{$sumItems}}
                </td>
                <td colspan="3">
                    Total cargos por productos
                </td>
            </tr>
        </table>
        
    </div>

    <br>
    <table style="width:100%;" border="1">
        <tr align="center">
            <td>Monto</td>
            <td>Descripcion</td>
            <td>Tipo</td>
            <td>Fecha</td>
            <td>Usuario</td>
        </tr>
        @php
          $sumItems = 0;
        @endphp

        @foreach($proyect_data->info->pagos as $items)
          @php
            $sumItems += $items->monto;
          @endphp
          <tr align="center">
              <td>${{$items->monto}}</td>
              <td>{{$items->descripcion}}</td>
              <td>{{$items->tipo}}</td>
              <td>{{$items->date}}</td>
              <td>{{$items->createdBy}}</td>
          </tr>
        @endforeach
        <tr align="center" style="background: #999999; color: #FFFFFF;">
            <td>
                ${{$sumItems}}
            </td>
            <td colspan="4">
                Total de pagos recibidos
            </td>
        </tr>
    </table>

    <br>
    <table style="width:100%;" border="1">
        <tr align="center" style="background: #999999; color: #FFFFFF;">
            <td>
                ${{!empty($proyect_data->info->saldo) ? $proyect_data->info->saldo:0}}
            </td>
            <td colspan="4">
            Total Saldo Pendiente
            </td>
        </tr>
    </table>

    <br>
    <table style="background: #796161; color: #FFFFFF; width:100%; font-size:12pt;" border="0">
        <tr>
            <td align="center">
                <b>Preguntas ventas</b>
            </td>
        </tr>
    </table>

    <div class="grupo">

    <table style="width:100%;" border="1">
          <tr align="center">
              <td>#</td>
              <td>Pregunta</td>
              <td>Respuesta</td>
          </tr>

          @foreach($preguntas as $key => $preg)
            <tr align="center">
              <td>{{$key+1}}</td>
              <td>{{$preg["pregunta"]}}</td>
              <td>{{$preg["respuesta"]}}</td>
            </tr>
          @endforeach
        </table>
        
    </div>
        
    </div>

  </main>

</body>

</html>
