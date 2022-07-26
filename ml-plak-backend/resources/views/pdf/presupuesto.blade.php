<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
  <title>{{$presupuesto->token}}</title>
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

    table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      margin-bottom: 20px;
      margin-top: 8px;
    }

    table th,
    table td {
      padding: 7px;
      background: #EEEEEE;
      text-align: center;
      border-bottom: 1px solid #FFFFFF;
    }

    table th {
      white-space: nowrap;
      font-weight: normal;
    }

    table td {
      text-align: right;
    }

    table td h3 {
      color: #57B223;
      font-size: 1em;
      font-weight: normal;
      margin: 0 0 0.2em 0;
    }

    table .no {
      color: #FFFFFF;
      font-size: 1.4em;
      background: #57B223;
    }

    table .desc {
      text-align: left;
    }

    table .unit {
      background: #DDDDDD;
    }

    table .qty {}

    table .total {
      background: #999999;
      color: #FFFFFF;
    }

    table td.unit,
    table td.qty,
    table td.total {
      text-align: center;
      font-size: 1em;
    }

    table tbody tr:last-child td {
      border: none;
    }

    table tfoot td {
      padding: 10px 20px;
      background: #FFFFFF;
      border-bottom: none;
      font-size: 1em;
      white-space: nowrap;
      border-top: 1px solid #AAAAAA;
    }

    table tfoot tr:first-child td {
      border-top: none;
    }

    table tfoot tr:last-child td {
      color: #57B223;
      font-size: 1.2em;
      border-top: 1px solid #57B223;

    }

    table tfoot tr td:first-child {
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
        <pre>
      top: 35px;
      </pre>
    }
    .pdf-pre {
      margin-top: 15px;
      text-align: left;
      font-family: segoe ui;
      font-size: 12px;
      white-space: pre-wrap;
    }
    .no-table{
      background: initial;
      border: 0;
      text-align: initial;
      padding: initial;
      border-collapse: initial;
    }
    table tr {
    page-break-inside: auto;
    }
    table tr td {
    page-break-inside: auto;
    }
    .page-break {
        page-break-before: always;
    }
  </style>
</head>

<body>
  <header class="clearfix">
    <div id="logo">
      <span id="mlplak">MLPLAK</span>
    </div>
    <div id="company">
      <span class="descripcion">{{$results->cliente->mueble}}</span>
    </div>
  </header>
  <main>
    <div id="details" class="clearfix">
      <div id="client">
        <div class="to">Presupuesto:</div>
        <h2 id="name">{{$results->cliente->name}}</h2>
        <div class="address">{{$results->cliente->address}}</div>
        @if(isset($results->cliente->mail))
        <div class="email">{{$results->cliente->mail}}</div>
        @endif

      </div>
      <div id="invoice">
        <span>Av 72 N868 e 12 y 13. La Plata</span><br />
        <span>(0221) 15-617-5290</span> <br />
        <span>Validez del presupuesto: {{$results->validezPresupuesto}}</span><br />
        <span>Validez de la promoción: {{$results->validezPromo}}</span>
      </div>
    </div>
    <table>
      <tbody>
        <tr>
          <td rowspan="2" style="vertical-align: top;padding:0px;  background: white">
            <div style="width: 360px">
              <img width="360" src="{{$presupuesto->imagen1}}"></div>
          </td>
          <td style="vertical-align: top;padding:0px; float:left;  background: white">
            <div style="text-align: left">
              <img width="170" src="{{$presupuesto->imagen2}}"></div>
          </td>
          <td style="vertical-align: top;padding:0px; float:left;  background: white">
            <div style="text-align: left">
              <img width="170" src="{{$presupuesto->imagen3}}"></div>
          </td>
        </tr>
        <tr>
          <td style=" vertical-align: top;padding:0px;  background: white">
            <div style="text-align: left"><img width="170" src="{{$presupuesto->imagen4}}"></div>
          </td>
          <td style=" vertical-align: top;padding:0px;  background: white">
            <div style="text-align: left"><img width="170" src="{{$presupuesto->imagen5}}"></div>
          </td>
        </tr>
      </tbody>
    </table>
    <table border="0" cellspacing="0" cellpadding="0">
      <thead>
        <tr>
          <th class="unit">LINEA</th>
          <th class="desc">DESCRIPCION</th>
          <th class="total">TOTAL</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td class="unit">Clasica</td>
          <td class="desc">
            @foreach($results->lineaClasica as $clasica)
            <span>{{$clasica->nombre}}</span> <br />
            @endforeach
          </td>
          <td class="total"><span style="font-size:16px;">${{$results->precioFinalClasica}}</span></td>
        </tr>
        <tr>
          <td class="unit">Premium</td>
          <td class="desc">
            @foreach($results->lineaPremium as $premium)
            <span>{{$premium->nombre}}</span> <br />
            @endforeach
          </td>
          <td class="total"><span style="font-size:16px;">${{$results->precioFinalPremium}}</span></td>
        </tr>
      </tbody>
    </table>

    <br>
    <table style="margin: 0px 0px 0px 5px;">
      <tr>
          <td style="width: 82%; padding-left: 6px; border-left: 6px solid #d5212E;" class="no-table">
            
                <div class="to">Incluye:</div>
                <h2 id="name">
                  @foreach($results->piezas as $piezas)
                  <span>{{$piezas->nombre}}</span>
                  @endforeach
                </h2>
          </td>
          <td style="padding-left: 6px; border-left: 6px solid #d5212E;" class="no-table">
            
          <div class="to">Color:</div>
                {{$results->color}}
          </td>
        </tr>
    </table>
    <br>

    <table style="margin: 0px 0px 0px 5px;">
        <tr>
          <td style="padding-left: 6px; border-left: 6px solid #d5212E;" class="no-table">
            <div class="to">Formas de pago:</div>
            {{$results->condicionesPago}}
          </td>
      </tr>
    </table>

    <br>
    <table style="margin: 0px 0px 0px 5px;">
        <tr>
          <td style="padding-left: 6px; border-left: 6px solid #d5212E;" class="no-table">
            <div class="to">Detalles:</div>
            {{$results->detalles}}
            
          </td>
        </tr>
    </table>

    <br>

    @if($results->contacto)
      <table style="margin: 0px 0px 0px 5px;">
        <tr>
          <td style="padding-left: 6px; border-left: 6px solid #d5212E;" class="no-table">
            Mas información:

          <div class="pdf-pre" style="margin: initial">
{{$results->contacto}}
          </div>
              
          </td>
        </tr>
       </table>
    @endif


  </main>

</body>

</html>
