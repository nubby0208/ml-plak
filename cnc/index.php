<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Insertar Datos</title>
<link type="text/css" href="bootstrap.min.css" rel="stylesheet">
<script type="text/javascript" src="jQuery.js" ></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
<!-- jQuery library -->
<style>
table {
    border-collapse: collapse;
    width: 100%;
}
th, td {
    text-align: left;
    padding: 4px;
}
tr:nth-child(even){background-color: #f2f2f2}
th {
    background-color: #4CAF50;
    color: white;
}
.main-wrapper{
	width:100%;
	
	background:#fff;
	border:1px solid #292929;
	padding:25px;
}
hr {
    margin-top: 5px;
    margin-bottom: 5px;
    border: 0;
    border-top: 1px solid #eee;
}
.loading{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #50b0ea2e;
    z-index: 999999;

}
.loading2{
    position: absolute;
    top: 15%;
    left: 36%;

}
.rotu>div>div>span+span{
    border-bottom: 1px solid white;
    text-transform: uppercase;
}
.nav-tabs.nav-justified>li>a.active{
    background-color: rgb(51, 122, 183);
    color: white;
    font-weight: 800;
    border: 2px solid;
    border-bottom-color: rgb(51, 122, 183);
    margin-bottom: -2px;
}

.nav-tabs.nav-justified{
    border-bottom: 2px solid rgb(51, 122, 183);
}
</style>
</head>
<body>
<div class="main-wrapper">
<ul class="nav nav-tabs nav-justified md-tabs indigo" id="myTabJust" role="tablist">
  <li class="nav-item">
    <a class="nav-link active" id="home-tab-just" data-toggle="tab" href="#cnc1" role="tab" aria-controls="home-just"
      aria-selected="true">CNC 1</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="profile-tab-just" data-toggle="tab" href="#cnc2" role="tab" aria-controls="profile-just"
      aria-selected="false">CNC 2</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="contact-tab-just" data-toggle="tab" href="#cnc3" role="tab" aria-controls="contact-just"
      aria-selected="false">CNC 3</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="contact-tab-just" data-toggle="tab" href="#cnc4" role="tab" aria-controls="contact-just"
      aria-selected="false">CNC 4</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="contact-tab-just" data-toggle="tab" href="#cnc5" role="tab" aria-controls="contact-just"
      aria-selected="false">CNC 5</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="contact-tab-just" data-toggle="tab" href="#cnc6" role="tab" aria-controls="contact-just"
      aria-selected="false">CNC 6</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="contact-tab-just" data-toggle="tab" href="#cnc7" role="tab" aria-controls="contact-just"
      aria-selected="false">CNC 7</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="contact-tab-just" data-toggle="tab" href="#cnc8" role="tab" aria-controls="contact-just"
      aria-selected="false">CNC 8</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="contact-tab-just" data-toggle="tab" href="#cnc9" role="tab" aria-controls="contact-just"
      aria-selected="false">CNC 9</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="contact-tab-just" data-toggle="tab" href="#cnc10" role="tab" aria-controls="contact-just"
      aria-selected="false">CNC 10</a>
  </li>
</ul>
<div class="tab-content card pt-5" id="myTabContentJust">
  <div class="tab-pane active" id="cnc1" role="tabpanel" aria-labelledby="home-tab-just">
    <div style="padding-top: 10px;" >
        <h2 style="text-align:center;">Insertar Registros gcode CNC 1</h2>
        <div class="row mt-5" style="padding-top: 20px;">
            <div class="mb-4 col-md-6" >
                <div>
                    <h3 >Rotulo</h3>
                </div>
                <div class="row" style="padding-top: 10px;">
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="nombre1" id="nombre1" placeholder="Nombre" >
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="mueble1" placeholder="Mueble" id="mueble1" >
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="pieza1" id="pieza1" placeholder="Pieza" >
                    </div>
                </div>
                <div class="row" style="padding-top: 10px;">
                    <div class="col-md-3" >
                        <input type="text" class="form-control" name="modulo1" placeholder="Modulo" id="modulo1">
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="ar1" id="ar1" placeholder="AR" >
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="id1" id="id1"  placeholder="ID" >
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="cara1" id="cara1"  placeholder="CARA" >
                    </div>
                </div>
            </div>
            <div class="mb-4 col-md-6">
                <div>
                    <div style="    display: flex;" >
                        <h3>Copia el Texto o Sube el archivo</h3><a onclick="borrar('cnc1','1')" class="btn btn-danger" style="margin-top: 10px; margin-left: 10px;">Borrar todo!</a>
                    </div>
                    <div class="w-100 m1-4" style="margin-bottom: 5px; max-width: 100%;     padding-top: 5px;">
                        <textarea class="form-control" name="gcode1" id="gcode1" style="width:100%;  max-width: 100%;" placeholder="Datos"></textarea>
                    </div>
                </div>
                <div class="row" style="padding-top: 2px;">
                    <div class="mb-4 col-md-3" >
                        <a  onclick="insert('cnc1','#gcode1','datos1')"  class="btn btn-primary">Enviar Texto</a>
                    </div>
                    <div class="mb-4 col-lg-9" >
                        <form class="mt-2 loadajax" style="    display: flex;"  enctype="multipart/form-data" id="formuploadajax1" method="POST">
                            <input  type="hidden" name="MAX_FILE_SIZE" value="5120000" />
                            <input  type="hidden" name="cnc" value="cnc1"/>
                            <input  type="hidden" name="dato" value="datos1"/>
                            <p style="padding-top: 5px;"><input id="archivo1" name="subir_archivo" type="file" /></p>
                            <p style="padding-left: 10px;"> <input type="submit"  class="btn btn-primary" value="Subir Archivo" /></p>
                        </form> 
                    </div>                
                </div>
            </div>
        </div>
        <div class="rotu" style=" color: white;background-color: #17a282;color: white;
         padding: 5px; border: 1px solid gray;    border-bottom: none;     font-size: 14px;">
            <div class="row">
                <div class="col-md-2">
                    <span>Nombre: </span> <span id="nombre11"> </span>
                </div>
                <div class="col-md-2">
                    <span>Mueble: </span> <span id="mueble11"> </span>            
                </div>
                <div class="col-md-2">
                    <span>Pieza: </span> <span id="pieza11"> </span>
                </div>
                <div class="col-md-2">
                    <span>Modulo: </span> <span id="modulo11"> </span>
                </div>
                <div class="col-md-2">
                    <span>Ar: </span> <span id="ar11"> </span>
                </div>
                <div class="col-md-1">
                    <span>Id: </span> <span id="id11"> </span>
                </div>
                <div class="col-md-1">
                    <span>Cara: </span> <span id="cara11"> </span>
                </div>
            </div>
        </div>
        <div class="cnc1"  style="max-height: 322px; overflow-y: scroll; position: relative;">
            <table border="1" class="tabla-materiales">
                <thead>
                    <tr>
                        <th colspan="2"><strong>Datos CNC 1</strong></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td ><span class="numero"></span></td>
                        <td class="codigo"> </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        
        
    </div>
  </div>
  <div class="tab-pane " id="cnc2" role="tabpanel" aria-labelledby="profile-tab-just">
        <div style="padding-top: 10px;">
            <h2 style="text-align:center;">Insertar Registros gcode CNC 2</h2>
            <div class="row mt-5" style="padding-top: 20px;">
                <div class="mb-4 col-md-6" >
                    <div>
                        <h3 >Rotulo</h3>
                    </div>
                    <div class="row" style="padding-top: 10px;">
                        <div class="col-md-4">
                            <input type="text" class="form-control" name="nombre2" id="nombre2" placeholder="Nombre" >
                        </div>
                        <div class="col-md-4">
                            <input type="text" class="form-control" name="mueble2" placeholder="Mueble" id="mueble2" >
                        </div>
                        <div class="col-md-4">
                            <input type="text" class="form-control" name="pieza2" id="pieza2" placeholder="Pieza" >
                        </div>
                    </div>
                    <div class="row" style="padding-top: 10px;">
                        <div class="col-md-3" >
                            <input type="text" class="form-control" name="modulo2" placeholder="Modulo" id="modulo2">
                        </div>
                        <div class="col-md-3">
                            <input type="text" class="form-control" name="ar2" id="ar2" placeholder="AR" >
                        </div>
                        <div class="col-md-3">
                            <input type="text" class="form-control" name="id2" id="id2"  placeholder="ID" >
                        </div>
                        <div class="col-md-3">
                            <input type="text" class="form-control" name="cara2" id="cara2"  placeholder="CARA" >
                        </div>
                    </div>
                </div>
                <div class="mb-4 col-md-6">
                    <div>
                        <div style="    display: flex;" >
                            <h3>Copia el Texto o Sube el archivo</h3><a onclick="borrar('cnc2','2')" class="btn btn-danger" style="margin-top: 10px; margin-left: 10px;">Borrar todo!</a>
                        </div>
                        <div class="w-100 m1-4" style="margin-bottom: 5px; max-width: 100%;     padding-top: 5px;">
                            <textarea class="form-control" name="gcode2" id="gcode2" style="width:100%;  max-width: 100%;" placeholder="Datos"></textarea>
                        </div>
                    </div>
                    <div class="row" style="padding-top: 2px;">
                        <div class="mb-4 col-md-3" >
                            <a  onclick="insert('cnc2','#gcode2','datos2')"  class="btn btn-primary">Enviar Texto</a>
                        </div>
                        <div class="mb-4 col-lg-9" >
                            <form class="mt-2 loadajax" style="    display: flex;"  enctype="multipart/form-data" id="formuploadajax2" method="POST">
                                <input  type="hidden" name="MAX_FILE_SIZE" value="5120000" />
                                <input  type="hidden" name="cnc" value="cnc2"/>
                                <input  type="hidden" name="dato" value="datos2"/>
                                <p style="padding-top: 5px;"><input id="archivo2" name="subir_archivo" type="file" /></p>
                                <p style="padding-left: 10px;"> <input type="submit" class="btn btn-primary" value="Subir Archivo" /></p>
                            </form> 
                        </div>                
                    </div>
                </div>
            </div>          
            <div class="rotu" style=" color: white;background-color: #17a282;color: white;
         padding: 5px; border: 1px solid gray;    border-bottom: none;     font-size: 14px;">
                <div class="row">
                    <div class="col-md-2">
                        <span>Nombre: </span> <span id="nombre22"> </span>
                    </div>
                    <div class="col-md-2">
                        <span>Mueble: </span> <span id="mueble22"> </span>            
                    </div>
                    <div class="col-md-2">
                        <span>Pieza: </span> <span id="pieza22"> </span>
                    </div>
                    <div class="col-md-2">
                        <span>Modulo: </span> <span id="modulo22"> </span>
                    </div>
                    <div class="col-md-2">
                        <span>Ar: </span> <span id="ar22"> </span>
                    </div>
                    <div class="col-md-1">
                        <span>Id: </span> <span id="id22"> </span>
                    </div>
                    <div class="col-md-1">
                        <span>Cara: </span> <span id="cara22"> </span>
                    </div>
                </div>
            </div>
            <div style="max-height: 322px; overflow-y: scroll; position: relative;">
                <table border="1" class="tabla-materiales" >
                <thead>
                    <tr>
                        <th colspan="2"><strong>Datos CNC 2</strong></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td ><span class="numero"></span></td>
                        <td class="codigo"> </td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>
  </div>
  <div class="tab-pane " id="cnc3" role="tabpanel" aria-labelledby="contact-tab-just">
    <div style="padding-top: 10px;">
        <h2 style="text-align:center;">Insertar Registros gcode CNC 3</h2>
        <div class="row mt-5" style="padding-top: 20px;">
            <div class="mb-4 col-md-6" >
                <div>
                    <h3 >Rotulo</h3>
                </div>
                <div class="row" style="padding-top: 10px;">
                        <div class="col-md-4">
                            <input type="text" class="form-control" name="nombre3" id="nombre3" placeholder="Nombre" >
                        </div>
                        <div class="col-md-4"> 
                            <input type="text" class="form-control" name="mueble3" placeholder="Mueble" id="mueble3" >
                        </div>
                        <div class="col-md-4">
                            <input type="text" class="form-control" name="pieza3" id="pieza3" placeholder="Pieza" >
                        </div>
                    </div>
                    <div class="row" style="padding-top: 10px;">
                        <div class="col-md-3" >
                            <input type="text" class="form-control" name="modulo3" placeholder="Modulo" id="modulo3">
                        </div>
                        <div class="col-md-3">
                            <input type="text" class="form-control" name="ar3" id="ar3" placeholder="AR" >
                        </div>
                        <div class="col-md-3">
                            <input type="text" class="form-control" name="id3" id="id3"  placeholder="ID" >
                        </div>
                        <div class="col-md-3">
                            <input type="text" class="form-control" name="cara3" id="cara3"  placeholder="CARA" >
                        </div>
                    </div>
                </div>
            <div class="mb-4 col-md-6">
                <div>
                    <div style="    display: flex;" >
                        <h3>Copia el Texto o Sube el archivo</h3><a onclick="borrar('cnc3','3')" class="btn btn-danger" style="margin-top: 10px; margin-left: 10px;">Borrar todo!</a>
                    </div>
                    <div class="w-100 m1-4" style="margin-bottom: 5px; max-width: 100%;     padding-top: 5px;">
                        <textarea class="form-control" name="gcode3" id="gcode3" style="width:100%;  max-width: 100%;" placeholder="Datos"></textarea>
                    </div>
                </div>
                <div class="row" style="padding-top: 2px;">
                    <div class="mb-4 col-md-3" >
                        <a  onclick="insert('cnc3','#gcode3','datos3')"  class="btn btn-primary">Enviar Texto</a>
                    </div>
                    <div class="mb-4 col-lg-9" >
                        <form class="mt-2 loadajax" style="    display: flex;"  enctype="multipart/form-data" id="formuploadajax3" method="POST">
                            <input  type="hidden" name="MAX_FILE_SIZE" value="5120000" />
                            <input  type="hidden" name="cnc" value="cnc3"/>
                            <input  type="hidden" name="dato" value="datos3"/>
                            <p style="padding-top: 5px;"><input id="archivo3" name="subir_archivo" type="file" /></p>
                            <p style="padding-left: 10px;"> <input type="submit" class="btn btn-primary" value="Subir Archivo" /></p>
                        </form> 
                    </div>                
                </div>
            </div>
        </div>
        <div class="rotu" style=" color: white;background-color: #17a282;color: white;
         padding: 5px; border: 1px solid gray;    border-bottom: none;     font-size: 14px;">
            <div class="row">
                <div class="col-md-2">
                    <span>Nombre: </span> <span id="nombre33"> </span>
                </div>
                <div class="col-md-2">
                    <span>Mueble: </span> <span id="mueble33"> </span>            
                </div>
                <div class="col-md-2">
                    <span>Pieza: </span> <span id="pieza33"> </span>
                </div>
                <div class="col-md-2">
                    <span>Modulo: </span> <span id="modulo33"> </span>
                </div>
                <div class="col-md-2">
                    <span>Ar: </span> <span id="ar33"> </span>
                </div>
                <div class="col-md-1">
                    <span>Id: </span> <span id="id33"> </span>
                </div>
                <div class="col-md-1">
                    <span>Cara: </span> <span id="cara33"> </span>
                </div>
            </div>
        </div>
        <div style="max-height: 322px; overflow-y: scroll; position: relative;">
            <table border="1" class="tabla-materiales" >
                <thead>
                    <tr>
                        <th colspan="2"><strong>Datos CNC 3</strong></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td ><span class="numero"></span></td>
                        <td class="codigo"> </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>
  <div class="tab-pane " id="cnc4" role="tabpanel" aria-labelledby="contact-tab-just">
    <div style="padding-top: 10px;">
        <h2 style="text-align:center;">Insertar Registros gcode CNC 4</h2>
        <div class="row mt-5" style="padding-top: 20px;">
            <div class="mb-4 col-md-6" >
                <div>
                    <h3 >Rotulo</h3>
                </div>
                <div class="row" style="padding-top: 10px;">
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="nombre4" id="nombre4" placeholder="Nombre" >
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="mueble4" placeholder="Mueble" id="mueble4" >
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="pieza4" id="pieza4" placeholder="Pieza" >
                    </div>
                </div>
                <div class="row" style="padding-top: 10px;">
                    <div class="col-md-3" >
                        <input type="text" class="form-control" name="modulo4" placeholder="Modulo" id="modulo4">
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="ar4" id="ar4" placeholder="AR" >
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="id4" id="id4"  placeholder="ID" >
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="cara4" id="cara4"  placeholder="CARA" >
                    </div>
                </div>
            </div>
            <div class="mb-4 col-md-6">
                <div>
                    <div style="    display: flex;" >
                        <h3>Copia el Texto o Sube el archivo</h3><a onclick="borrar('cnc4','4')" class="btn btn-danger" style="margin-top: 10px; margin-left: 10px;">Borrar todo!</a>
                    </div>
                    <div class="w-100 m1-4" style="margin-bottom: 5px; max-width: 100%;     padding-top: 5px;">
                        <textarea class="form-control" name="gcode4" id="gcode4" style="width:100%;  max-width: 100%;" placeholder="Datos"></textarea>
                    </div>
                </div>
                <div class="row" style="padding-top: 2px;">
                    <div class="mb-4 col-md-3" >
                        <a  onclick="insert('cnc4','#gcode4','datos4')"  class="btn btn-primary">Enviar Texto</a>
                    </div>
                    <div class="mb-4 col-lg-9" >
                        <form class="mt-2 loadajax" style="    display: flex;"  enctype="multipart/form-data" id="formuploadajax4" method="POST">
                            <input  type="hidden" name="MAX_FILE_SIZE" value="5120000" />
                            <input  type="hidden" name="cnc" value="cnc4"/>
                            <input  type="hidden" name="dato" value="datos4"/>
                            <p style="padding-top: 5px;"><input id="archivo4" name="subir_archivo" type="file" /></p>
                            <p style="padding-left: 10px;"> <input type="submit" class="btn btn-primary" value="Subir Archivo" /></p>
                        </form> 
                    </div>                
                </div>
            </div>
        </div>
        <div class="rotu" style=" color: white;background-color: #17a282;color: white;
         padding: 5px; border: 1px solid gray;    border-bottom: none;     font-size: 14px;">
            <div class="row">
                <div class="col-md-2">
                    <span>Nombre: </span> <span id="nombre44"> </span>
                </div>
                <div class="col-md-2">
                    <span>Mueble: </span> <span id="mueble44"> </span>            
                </div>
                <div class="col-md-2">
                    <span>Pieza: </span> <span id="pieza44"> </span>
                </div>
                <div class="col-md-2">
                    <span>Modulo: </span> <span id="modulo44"> </span>
                </div>
                <div class="col-md-2">
                    <span>Ar: </span> <span id="ar44"> </span>
                </div>
                <div class="col-md-1">
                    <span>Id: </span> <span id="id44"> </span>
                </div>
                <div class="col-md-1">
                    <span>Cara: </span> <span id="cara44"> </span>
                </div>
            </div>
        </div>
        <div style="max-height: 322px; overflow-y: scroll; position: relative;">
            <table border="1" class="tabla-materiales" >
                <thead>
                    <tr>
                        <th colspan="2"><strong>Datos CNC 4</strong></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td ><span class="numero"></span></td>
                        <td class="codigo"> </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>
  <div class="tab-pane " id="cnc5" role="tabpanel" aria-labelledby="contact-tab-just">
    <div style="padding-top: 10px;">
        <h2 style="text-align:center;">Insertar Registros gcode CNC 5</h2>
        <div class="row mt-5" style="padding-top: 20px;">
            <div class="mb-4 col-md-6" >
                <div>
                    <h3 >Rotulo</h3>
                </div>
                <div class="row" style="padding-top: 10px;">
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="nombre5" id="nombre5" placeholder="Nombre" >
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="mueble5" placeholder="Mueble" id="mueble5" >
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="pieza5" id="pieza5" placeholder="Pieza" >
                    </div>
                </div>
                <div class="row" style="padding-top: 10px;">
                    <div class="col-md-3" >
                        <input type="text" class="form-control" name="modulo5" placeholder="Modulo" id="modulo5">
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="ar5" id="ar5" placeholder="AR" >
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="id5" id="id5"  placeholder="ID" >
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="cara5" id="cara5"  placeholder="CARA" >
                    </div>
                </div>
            </div>
            <div class="mb-4 col-md-6">
                <div>
                    <div style="    display: flex;" >
                        <h3>Copia el Texto o Sube el archivo</h3><a onclick="borrar('cnc5','5')" class="btn btn-danger" style="margin-top: 10px; margin-left: 10px;">Borrar todo!</a>
                    </div>
                    <div class="w-100 m1-4" style="margin-bottom: 5px; max-width: 100%;     padding-top: 5px;">
                        <textarea class="form-control" name="gcode5" id="gcode5" style="width:100%;  max-width: 100%;" placeholder="Datos"></textarea>
                    </div>
                </div>
                <div class="row" style="padding-top: 2px;">
                    <div class="mb-4 col-md-3" >
                        <a  onclick="insert('cnc5','#gcode5','datos5')"  class="btn btn-primary">Enviar Texto</a>
                    </div>
                    <div class="mb-4 col-lg-9" >
                        <form class="mt-2 loadajax" style="    display: flex;"  enctype="multipart/form-data" id="formuploadajax5" method="POST">
                            <input  type="hidden" name="MAX_FILE_SIZE" value="5120000" />
                            <input  type="hidden" name="cnc" value="cnc5"/>
                            <input  type="hidden" name="dato" value="datos5"/>
                            <p style="padding-top: 5px;"><input id="archivo5" name="subir_archivo" type="file" /></p>
                            <p style="padding-left: 10px;"> <input type="submit" class="btn btn-primary" value="Subir Archivo" /></p>
                        </form> 
                    </div>                
                </div>
            </div>
        </div>
        <div class="rotu" style=" color: white;background-color: #17a282;color: white;
         padding: 5px; border: 1px solid gray;    border-bottom: none;     font-size: 14px;">
            <div class="row">
                <div class="col-md-2">
                    <span>Nombre: </span> <span id="nombre55"> </span>
                </div>
                <div class="col-md-2">
                    <span>Mueble: </span> <span id="mueble55"> </span>            
                </div>
                <div class="col-md-2">
                    <span>Pieza: </span> <span id="pieza55"> </span>
                </div>
                <div class="col-md-2">
                    <span>Modulo: </span> <span id="modulo55"> </span>
                </div>
                <div class="col-md-2">
                    <span>Ar: </span> <span id="ar55"> </span>
                </div>
                <div class="col-md-1">
                    <span>Id: </span> <span id="id55"> </span>
                </div>
                <div class="col-md-1">
                    <span>Cara: </span> <span id="cara55"> </span>
                </div>
            </div>
        </div>
        <div style="max-height: 322px; overflow-y: scroll; position: relative;">
            <table border="1" class="tabla-materiales" >
                <thead>
                    <tr>
                        <th colspan="2"><strong>Datos CNC 5</strong></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td ><span class="numero"></span></td>
                        <td class="codigo"> </td>
                    </tr>
                </tbody>
            </table>
        </div>
     </div>
  </div>
  <div class="tab-pane " id="cnc6" role="tabpanel" aria-labelledby="contact-tab-just">
    <div style="padding-top: 10px;">
    <h2 style="text-align:center;">Insertar Registros gcode CNC 6</h2>
    <div class="row mt-5" style="padding-top: 20px;">
        <div class="mb-4 col-md-6" >
            <div>
                <h3 >Rotulo</h3>
            </div>
            <div class="row" style="padding-top: 10px;">
                <div class="col-md-4">
                    <input type="text" class="form-control" name="nombre6" id="nombre6" placeholder="Nombre" >
                </div>
                <div class="col-md-4">
                    <input type="text" class="form-control" name="mueble6" placeholder="Mueble" id="mueble6" >
                </div>
                <div class="col-md-4">
                    <input type="text" class="form-control" name="pieza6" id="pieza6" placeholder="Pieza" >
                </div>
            </div>
            <div class="row" style="padding-top: 10px;">
                <div class="col-md-3" >
                    <input type="text" class="form-control" name="modulo6" placeholder="Modulo" id="modulo6">
                </div>
                <div class="col-md-3">
                    <input type="text" class="form-control" name="ar6" id="ar6" placeholder="AR" >
                </div>
                <div class="col-md-3">
                    <input type="text" class="form-control" name="id6" id="id6"  placeholder="ID" >
                </div>
                <div class="col-md-3">
                    <input type="text" class="form-control" name="cara6" id="cara6"  placeholder="CARA" >
                </div>
            </div>
        </div>
        <div class="mb-4 col-md-6">
            <div>
                <div style="    display: flex;" >
                    <h3>Copia el Texto o Sube el archivo</h3><a onclick="borrar('cnc6','6')" class="btn btn-danger" style="margin-top: 10px; margin-left: 10px;">Borrar todo!</a>
                </div>
                <div class="w-100 m1-4" style="margin-bottom: 5px; max-width: 100%;     padding-top: 5px;">
                    <textarea class="form-control" name="gcode6" id="gcode6" style="width:100%;  max-width: 100%;" placeholder="Datos"></textarea>
                </div>
            </div>
            <div class="row" style="padding-top: 2px;">
                <div class="mb-4 col-md-3" >
                    <a  onclick="insert('cnc6','#gcode6','datos6')"  class="btn btn-primary">Enviar Texto</a>
                </div>
                <div class="mb-4 col-lg-9" >
                    <form class="mt-2 loadajax" style="    display: flex;"  enctype="multipart/form-data" id="formuploadajax6" method="POST">
                        <input  type="hidden" name="MAX_FILE_SIZE" value="5120000" />
                        <input  type="hidden" name="cnc" value="cnc6"/>
                        <input  type="hidden" name="dato" value="datos6"/>
                        <p style="padding-top: 5px;"><input id="archivo6" name="subir_archivo" type="file" /></p>
                        <p style="padding-left: 10px;"> <input type="submit" class="btn btn-primary" value="Subir Archivo" /></p>
                    </form> 
                </div>                
            </div>
        </div>
        </div>
        <div class="rotu" style=" color: white;background-color: #17a282;color: white;
         padding: 5px; border: 1px solid gray;    border-bottom: none;     font-size: 14px;">
            <div class="row">
                <div class="col-md-2">
                    <span>Nombre: </span> <span id="nombre66"> </span>
                </div>
                <div class="col-md-2">
                    <span>Mueble: </span> <span id="mueble66"> </span>            
                </div>
                <div class="col-md-2">
                    <span>Pieza: </span> <span id="pieza66"> </span>
                </div>
                <div class="col-md-2">
                    <span>Modulo: </span> <span id="modulo66"> </span>
                </div>
                <div class="col-md-2">
                    <span>Ar: </span> <span id="ar66"> </span>
                </div>
                <div class="col-md-1">
                    <span>Id: </span> <span id="id66"> </span>
                </div>
                <div class="col-md-1">
                    <span>Cara: </span> <span id="cara66"> </span>
                </div>
            </div>
        </div>
        <div style="max-height: 322px; overflow-y: scroll; position: relative;">
            <table border="1" class="tabla-materiales" > 
            <thead>
                    <tr>
                        <th colspan="2"><strong>Datos CNC 6</strong></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td ><span class="numero"></span></td>
                        <td class="codigo"> </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>
  <div class="tab-pane " id="cnc7" role="tabpanel" aria-labelledby="contact-tab-just">
    <div style="padding-top: 10px;">
        <h2 style="text-align:center;">Insertar Registros gcode CNC 7</h2>
        <div class="row mt-5" style="padding-top: 20px;">
            <div class="mb-4 col-md-6" >
                <div>
                    <h3 >Rotulo</h3>
                </div>
                <div class="row" style="padding-top: 10px;">
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="nombre7" id="nombre7" placeholder="Nombre" >
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="mueble7" placeholder="Mueble" id="mueble7" >
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="pieza7" id="pieza7" placeholder="Pieza" >
                    </div>
                </div>
                <div class="row" style="padding-top: 10px;">
                    <div class="col-md-3" >
                        <input type="text" class="form-control" name="modulo7" placeholder="Modulo" id="modulo7">
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="ar7" id="ar7" placeholder="AR" >
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="id7" id="id7"  placeholder="ID" >
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="cara7" id="cara7"  placeholder="CARA" >
                    </div>
                </div>
            </div>
            <div class="mb-4 col-md-6">
                <div>
                    <div style="    display: flex;" >
                        <h3>Copia el Texto o Sube el archivo</h3><a onclick="borrar('cnc7','7')" class="btn btn-danger" style="margin-top: 10px; margin-left: 10px;">Borrar todo!</a>
                    </div>
                    <div class="w-100 m1-4" style="margin-bottom: 5px; max-width: 100%;     padding-top: 5px;">
                        <textarea class="form-control" name="gcode7" id="gcode7" style="width:100%;  max-width: 100%;" placeholder="Datos"></textarea>
                    </div>
                </div>
                <div class="row" style="padding-top: 2px;">
                    <div class="mb-4 col-md-3" >
                        <a  onclick="insert('cnc7','#gcode7','datos7')"  class="btn btn-primary">Enviar Texto</a>
                    </div>
                    <div class="mb-4 col-lg-9" >
                        <form class="mt-2 loadajax" style="    display: flex;"  enctype="multipart/form-data" id="formuploadajax7" method="POST">
                            <input  type="hidden" name="MAX_FILE_SIZE" value="5120000" />
                            <input  type="hidden" name="cnc" value="cnc7"/>
                            <input  type="hidden" name="dato" value="datos7"/>
                            <p style="padding-top: 5px;"><input id="archivo7" name="subir_archivo" type="file" /></p>
                            <p style="padding-left: 10px;"> <input type="submit" class="btn btn-primary" value="Subir Archivo" /></p>
                        </form> 
                    </div>                
                </div>
            </div>

        </div>
        <div class="rotu" style=" color: white;background-color: #17a282;color: white;
         padding: 5px; border: 1px solid gray;    border-bottom: none;     font-size: 14px;">
            <div class="row">
                <div class="col-md-2">
                    <span>Nombre: </span> <span id="nombre77"> </span>
                </div>
                <div class="col-md-2">
                    <span>Mueble: </span> <span id="mueble77"> </span>            
                </div>
                <div class="col-md-2">
                    <span>Pieza: </span> <span id="pieza77"> </span>
                </div>
                <div class="col-md-2">
                    <span>Modulo: </span> <span id="modulo77"> </span>
                </div>
                <div class="col-md-2">
                    <span>Ar: </span> <span id="ar77"> </span>
                </div>
                <div class="col-md-1">
                    <span>Id: </span> <span id="id77"> </span>
                </div>
                <div class="col-md-1">
                    <span>Cara: </span> <span id="cara77"> </span>
                </div>
            </div>
        </div>
        <div style="max-height: 322px; overflow-y: scroll; position: relative;">
            <table border="1" class="tabla-materiales" >
            <thead>
                    <tr>
                        <th colspan="2"><strong>Datos CNC 7</strong></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td ><span class="numero"></span></td>
                        <td class="codigo"> </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>
  <div class="tab-pane " id="cnc8" role="tabpanel" aria-labelledby="contact-tab-just">
    <div style="padding-top: 10px;">
        <h2 style="text-align:center;">Insertar Registros gcode CNC 8</h2>
        <div class="row mt-5" style="padding-top: 20px;">
            <div class="mb-4 col-md-6" >
                <div>
                    <h3 >Rotulo</h3>
                </div>
                <div class="row" style="padding-top: 10px;">
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="nombre8" id="nombre8" placeholder="Nombre" >
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="mueble8" placeholder="Mueble" id="mueble8" >
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="pieza8" id="pieza8" placeholder="Pieza" >
                    </div>
                </div>
                <div class="row" style="padding-top: 10px;">
                    <div class="col-md-3" >
                        <input type="text" class="form-control" name="modulo8" placeholder="Modulo" id="modulo8">
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="ar8" id="ar8" placeholder="AR" >
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="id8" id="id8"  placeholder="ID" >
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="cara8" id="cara8"  placeholder="CARA" >
                    </div>
                </div>
            </div>
            <div class="mb-4 col-md-6">
                <div>
                    <div style="    display: flex;" >
                        <h3>Copia el Texto o Sube el archivo</h3><a onclick="borrar('cnc8','8')" class="btn btn-danger" style="margin-top: 10px; margin-left: 10px;">Borrar todo!</a>
                    </div>
                    <div class="w-100 m1-4" style="margin-bottom: 5px; max-width: 100%;     padding-top: 5px;">
                        <textarea class="form-control" name="gcode8" id="gcode8" style="width:100%;  max-width: 100%;" placeholder="Datos"></textarea>
                    </div>
                </div>
                <div class="row" style="padding-top: 2px;">
                    <div class="mb-4 col-md-3" >
                        <a  onclick="insert('cnc8','#gcode8','datos8')"  class="btn btn-primary">Enviar Texto</a>
                    </div>
                    <div class="mb-4 col-lg-9" >
                        <form class="mt-2 loadajax" style="    display: flex;"  enctype="multipart/form-data" id="formuploadajax8" method="POST">
                            <input  type="hidden" name="MAX_FILE_SIZE" value="5120000" />
                            <input  type="hidden" name="cnc" value="cnc8"/>
                            <input  type="hidden" name="dato" value="datos8"/>
                            <p style="padding-top: 5px;"><input id="archivo8" name="subir_archivo" type="file" /></p>
                            <p style="padding-left: 10px;"> <input type="submit" class="btn btn-primary" value="Subir Archivo" /></p>
                        </form> 
                    </div>                
                </div>
            </div>

        </div>
        <div class="rotu" style=" color: white;background-color: #17a282;color: white;
         padding: 5px; border: 1px solid gray;    border-bottom: none;     font-size: 14px;">
            <div class="row">
                <div class="col-md-2">
                    <span>Nombre: </span> <span id="nombre88"> </span>
                </div>
                <div class="col-md-2">
                    <span>Mueble: </span> <span id="mueble88"> </span>            
                </div>
                <div class="col-md-2">
                    <span>Pieza: </span> <span id="pieza88"> </span>
                </div>
                <div class="col-md-2">
                    <span>Modulo: </span> <span id="modulo88"> </span>
                </div>
                <div class="col-md-2">
                    <span>Ar: </span> <span id="ar88"> </span>
                </div>
                <div class="col-md-1">
                    <span>Id: </span> <span id="id88"> </span>
                </div>
                <div class="col-md-1">
                    <span>Cara: </span> <span id="cara88"> </span>
                </div>
            </div>
        </div>
        <div style="max-height: 322px; overflow-y: scroll; position: relative;">
            <table border="1" class="tabla-materiales" >
            <thead>
                    <tr>
                        <th colspan="2"><strong>Datos CNC 8</strong></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td ><span class="numero"></span></td>
                        <td class="codigo"> </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>
  <div class="tab-pane " id="cnc9" role="tabpanel" aria-labelledby="contact-tab-just">
    <div style="padding-top: 10px;">
        <h2 style="text-align:center;">Insertar Registros gcode CNC 9</h2>
        <div class="row mt-5" style="padding-top: 20px;">
            <div class="mb-4 col-md-6" >
                <div>
                    <h3 >Rotulo</h3>
                </div>
                <div class="row" style="padding-top: 10px;">
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="nombre9" id="nombre9" placeholder="Nombre" >
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="mueble9" placeholder="Mueble" id="mueble9" >
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="pieza9" id="pieza9" placeholder="Pieza" >
                    </div>
                </div>
                <div class="row" style="padding-top: 10px;">
                    <div class="col-md-3" >
                        <input type="text" class="form-control" name="modulo9" placeholder="Modulo" id="modulo9">
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="ar9" id="ar9" placeholder="AR" >
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="id9" id="id9"  placeholder="ID" >
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="cara9" id="cara9"  placeholder="CARA" >
                    </div>
                </div>
            </div>
            <div class="mb-4 col-md-6">
                <div>
                    <div style="    display: flex;" >
                        <h3>Copia el Texto o Sube el archivo</h3><a onclick="borrar('cnc9','9')" class="btn btn-danger" style="margin-top: 10px; margin-left: 10px;">Borrar todo!</a>
                    </div>
                    <div class="w-100 m1-4" style="margin-bottom: 5px; max-width: 100%;     padding-top: 5px;">
                        <textarea class="form-control" name="gcode9" id="gcode9" style="width:100%;  max-width: 100%;" placeholder="Datos"></textarea>
                    </div>
                </div>
                <div class="row" style="padding-top: 2px;">
                    <div class="mb-4 col-md-3" >
                        <a  onclick="insert('cnc9','#gcode9','datos9')"  class="btn btn-primary">Enviar Texto</a>
                    </div>
                    <div class="mb-4 col-lg-9" >
                        <form class="mt-2 loadajax" style="    display: flex;"  enctype="multipart/form-data" id="formuploadajax9" method="POST">
                            <input  type="hidden" name="MAX_FILE_SIZE" value="5120000" />
                            <input  type="hidden" name="cnc" value="cnc9"/>
                            <input  type="hidden" name="dato" value="datos9"/>
                            <p style="padding-top: 5px;"><input id="archivo9" name="subir_archivo" type="file" /></p>
                            <p style="padding-left: 10px;"> <input type="submit" class="btn btn-primary" value="Subir Archivo" /></p>
                        </form> 
                    </div>                
                </div>
            </div>

        </div>
        <div class="rotu" style=" color: white;background-color: #17a282;color: white;
         padding: 5px; border: 1px solid gray;    border-bottom: none;     font-size: 14px;">
            <div class="row">
                <div class="col-md-2">
                    <span>Nombre: </span> <span id="nombre99"> </span>
                </div>
                <div class="col-md-2">
                    <span>Mueble: </span> <span id="mueble99"> </span>            
                </div>
                <div class="col-md-2">
                    <span>Pieza: </span> <span id="pieza99"> </span>
                </div>
                <div class="col-md-2">
                    <span>Modulo: </span> <span id="modulo99"> </span>
                </div>
                <div class="col-md-2">
                    <span>Ar: </span> <span id="ar99"> </span>
                </div>
                <div class="col-md-1">
                    <span>Id: </span> <span id="id99"> </span>
                </div>
                <div class="col-md-1">
                    <span>Cara: </span> <span id="cara99"> </span>
                </div>
            </div>
        </div>
        <div style="max-height: 322px; overflow-y: scroll; position: relative;">
            <table border="1" class="tabla-materiales" >
            <thead>
                    <tr>
                        <th colspan="2"><strong>Datos CNC 9</strong></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td ><span class="numero"></span></td>
                        <td class="codigo"> </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>
  <div class="tab-pane " id="cnc10" role="tabpanel" aria-labelledby="contact-tab-just">
    <div style="padding-top: 10px;">
        <h2 style="text-align:center;">Insertar Registros gcode CNC 10</h2>
        <div class="row mt-5" style="padding-top: 20px;">
            <div class="mb-4 col-md-6" >
                <div>
                    <h3 >Rotulo</h3>
                </div>
                <div class="row" style="padding-top: 10px;">
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="nombre10" id="nombre10" placeholder="Nombre" >
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="mueble10" placeholder="Mueble" id="mueble10" >
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="pieza10" id="pieza10" placeholder="Pieza" >
                    </div>
                </div>
                <div class="row" style="padding-top: 10px;">
                    <div class="col-md-3" >
                        <input type="text" class="form-control" name="modulo10" placeholder="Modulo" id="modulo10" >
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="ar10" id="ar10" placeholder="AR" >
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="id10" id="id10"  placeholder="ID" >
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="cara10" id="cara10"  placeholder="CARA" >
                    </div>
                </div>
            </div>
            <div class="mb-4 col-md-6">
                <div>
                    <div style="    display: flex;" >
                        <h3>Copia el Texto o Sube el archivo</h3><a onclick="borrar('cnc10','10')" class="btn btn-danger" style="margin-top: 10px; margin-left: 10px;">Borrar todo!</a>
                    </div>
                    <div class="w-100 m1-4" style="margin-bottom: 5px; max-width: 100%;     padding-top: 5px;">
                        <textarea class="form-control" name="gcode10" id="gcode10" style="width:100%;  max-width: 100%;" placeholder="Datos"></textarea>
                    </div>
                </div>
                <div class="row" style="padding-top: 2px;">
                    <div class="mb-4 col-md-3" >
                        <a  onclick="insert('cnc10','#gcode10','datos10')"  class="btn btn-primary">Enviar Texto</a>
                    </div>
                    <div class="mb-4 col-md-9" >
                        <form class="mt-2 loadajax" style="    display: flex;"  enctype="multipart/form-data" id="formuploadajax10" method="POST">
                            <input  type="hidden" name="MAX_FILE_SIZE" value="5120000" />
                            <input  type="hidden" name="cnc" value="cnc10"/>
                            <input  type="hidden" name="dato" value="datos10"/>
                            <p style="padding-top: 5px;"><input id="archivo10" name="subir_archivo" type="file" /></p>
                            <p style="padding-left: 10px;"> <input type="submit" class="btn btn-primary" value="Subir Archivo" /></p>
                        </form> 
                    </div>                
                </div>
            </div>

        </div>
        <div class="rotu" style=" color: white;background-color: #17a282;color: white;
         padding: 5px; border: 1px solid gray;    border-bottom: none;     font-size: 14px;">
            <div class="row">
                <div class="col-md-2">
                    <span>Nombre: </span> <span id="nombre1010"> </span>
                </div>
                <div class="col-md-2">
                    <span>Mueble: </span> <span id="mueble1010"> </span>            
                </div>
                <div class="col-md-2">
                    <span>Pieza: </span> <span id="pieza1010"> </span>
                </div>
                <div class="col-md-2">
                    <span>Modulo: </span> <span id="modulo1010"> </span>
                </div>
                <div class="col-md-2">
                    <span>Ar: </span> <span id="ar1010"> </span>
                </div>
                <div class="col-md-1">
                    <span>Id: </span> <span id="id1010"> </span>
                </div>
                <div class="col-md-1">
                    <span>Cara: </span> <span id="cara1010"> </span>
                </div>
            </div>
        </div>
        <div style="max-height: 322px; overflow-y: scroll; position: relative;">
            <table border="1" class="tabla-materiales" >
            <thead>
                    <tr>
                        <th colspan="2"><strong>Datos CNC 10</strong></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td ><span class="numero"></span></td>
                        <td class="codigo"> </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

</div>

<div id="cargar"></div>

</div>
</body>
<script>

function inicio(){
    $('#cargar').html('<div class="loading" style="position: absolute;"><div class="loading2"><img src="images/Spinner.gif" alt="loading" /></div></div>');
    let i2,dato,i3,i4,dato0,dato1,dato2,dato3,dato4,dato5,dato6;
    let dat = [];
    for(let a=1; a<11; a++){
         i2 = "cnc"+a;
         dato = "datos"+a;         
        //console.log(i3);
        jQuery.ajax({
            type:'POST',
            //dataType: 'json',
            url:'/cnc/get.php',
            data:{'cnc': i2},//capturo array  
            crossDomain: true,
            cache: false,
            success: function(data){ 
                if(data){
                    $('#cargar').fadeIn(1000).html('');
                    //console.log("aquieee");                    
                    let ncode = [];
                    ncode = JSON.parse(data);
                    //console.log(ncode.length);
                    if(ncode.length>0){
                        let ty='';
                        i3 = "#cnc"+a+" .tabla-materiales>tbody";
                        for(let a=0; a<ncode.length; a++){
                            if(ncode[a]!=""){
                            ty =`${ty} <tr>
                            <td ><span class="numero">${a}</span></td>
                            <td class="codigo">${ncode[a]}</td>
                        </tr>`;    

                            }                     

                        }
                        $(i3).html(ty);   
                    }  
                    } else {
                        //alert('Error al crear!');
                    }
                }
        });          
        jQuery.ajax({
            type:'POST',
            //dataType: 'json',
            url:'/cnc/get2.php',
            data:{'dato': dato},//capturo array  
            crossDomain: true,
            cache: false,
            success: function(data){ 
                if(data){
                    $('#cargar').fadeIn(1000).html('');
                    dato0 = "#nombre"+a+a;
                    dato1 = "#mueble"+a+a;
                    dato2 = "#pieza"+a+a;
                    dato3 = "#modulo"+a+a;
                    dato4 = "#ar"+a+a;
                    dato5 = "#id"+a+a;
                    dato6 = "#cara"+a+a;                  
                    
                    dat = JSON.parse(data);
                         
                    jQuery(dato0).text(dat[0]);
                    jQuery(dato1).text(dat[1]);
                    jQuery(dato2).text(dat[2]);
                    jQuery(dato3).text(dat[3]);
                    jQuery(dato4).text(dat[4]);
                    jQuery(dato5).text(dat[5]);
                    jQuery(dato6).text(dat[6]);

                } else {
                    //alert('Error al crear!');
                }
                

            }
        }).done(function(res){ 
            $('#cargar').fadeIn(1000).html('');


        });   
    }
}
inicio();
function insert(cnc1,gcode1,dato){
    var gcode = jQuery(gcode1).val();
    var cnc = cnc1;

    let i3 = "#"+cnc+" .tabla-materiales>tbody";
    var gc = gcode.split("\n");
    //console.log(gc);
    $('#cargar').html('<div class="loading" style="position: absolute;"><div class="loading2"><img src="images/Spinner.gif" alt="loading" /></div></div>');
    let fi,i2,true1,nombre0,mueble0,pieza0,modulo0,ar0,id0,cara0,nombre,mueble,pieza,modulo,ar,id,cara;
    let dato0,dato1,dato2,dato3,dato4,dato5,dato6;
            let datos = [];
            let dat = [];
            for (var i = 1; i < 11; i++) {
                 i2 = "cnc"+i;
                 true1 = document.getElementById(i2).classList.contains( 'active' );
                if(true1 == true){
                    nombre0 = "#nombre"+i;
                    mueble0 = "#mueble"+i;
                    pieza0 = "#pieza"+i;
                    modulo0 = "#modulo"+i;
                    ar0 = "#ar"+i;
                    id0 = "#id"+i;
                    cara0 = "#cara"+i;
                    dato0 = "#nombre"+i+i;
                    dato1 = "#mueble"+i+i;
                    dato2 = "#pieza"+i+i;
                    dato3 = "#modulo"+i+i;
                    dato4 = "#ar"+i+i;
                    dato5 = "#id"+i+i;
                    dato6 = "#cara"+i+i; 
                    nombre = jQuery(nombre0).val();
                    mueble = jQuery(mueble0).val();
                    pieza = jQuery(pieza0).val();
                    modulo = jQuery(modulo0).val();
                    ar = jQuery(ar0).val();
                    id = jQuery(id0).val();
                    cara = jQuery(cara0).val();

                    if(nombre==""||mueble==""||pieza==""||modulo==""||ar==""||id==""||cara==""){
                        alert("Completar todos los datos del rótulo");
                        $('#cargar').fadeIn(1000).html('');
                        return 0;
                    }
                    if (gcode==""){
                    alert("Agregar texto al rótulo");
                        $('#cargar').fadeIn(1000).html('');
                        return 0;
                   }
                    datos.push(nombre,mueble,pieza,modulo,ar,id,cara);
                    //console.log(datos);
                   //console.log(formData);
                }

                // 
            }
    jQuery.ajax({
        type:'POST',
        //dataType: 'json',
        url:'/cnc/post.php',
        data:{'gcode': JSON.stringify(gc),'cnc': cnc, 'dato': dato, 'datos': JSON.stringify(datos) },//capturo array  
        crossDomain: true,
        cache: false,
        success: function(data){ 
            if(data){
                $('#cargar').fadeIn(1000).html('');  
                let ncode = [];
                ncode = JSON.parse(data);
                console.log(ncode.length);
                if(ncode.length>0)
                {
                    let ty='';
                    for(let a=0; a<ncode.length; a++){
                        if(ncode[a]!=""){
                            if(ncode[a]!=""){
                            ty =`${ty} <tr>
                        <td ><span class="numero">${a}</span></td>
                        <td class="codigo">${ncode[a]}</td>
                    </tr>`;    

                        }
                        }
                   

                    }
                    $(i3).html(ty);   
                    jQuery(nombre0).val('');
                    jQuery(mueble0).val('');
                    jQuery(pieza0).val('');
                    jQuery(modulo0).val('');
                    jQuery(ar0).val('');
                    jQuery(id0).val('');
                    jQuery(cara0).val('');
                    jQuery(gcode1).val('');
                    jQuery.ajax({
                        type:'POST',
                        //dataType: 'json',
                        url:'/cnc/get2.php',
                        data:{'dato': dato},//capturo array  
                        crossDomain: true,
                        cache: false,
                        success: function(data){ 
                            if(data){
                                $('#cargar').fadeIn(1000).html('');         
                                dat = JSON.parse(data);   
                                console.log(dat);                         
                                jQuery(dato0).text(dat[0]);
                                jQuery(dato1).text(dat[1]);
                                jQuery(dato2).text(dat[2]);
                                jQuery(dato3).text(dat[3]);
                                jQuery(dato4).text(dat[4]);
                                jQuery(dato5).text(dat[5]);
                                jQuery(dato6).text(dat[6]);

                            } else {
                                //alert('Error al crear!');
                            }
                            

                        }
                        });
                }

                
             } else {
                //alert('Error al crear!');
            }
        }
        }).done(function(res){
          //console.log("aqui");
          //console.log(res);   

            });   




}

$(function(){
        $(".loadajax").on("submit", function(e){
            $('#cargar').html('<div class="loading" style="position: absolute;"><div class="loading2"><img src="images/Spinner.gif" alt="loading" /></div></div>');
            e.preventDefault();
            var f = $(this);      
            let fi,i2,i3,i4,true1,nombre0,mueble0,pieza0,modulo0,ar0,id0,cara0,nombre,mueble,pieza,modulo,ar,id,cara;
            let datos = [];
            let dato0,dato1,dato,dato2,dato3,dato4,dato5,dato6;
            let dat = [];
            for (var i = 1; i < 11; i++) {
                 fi = "formuploadajax"+i;
                 i2 = "cnc"+i;
                true1 = document.getElementById(i2).classList.contains( 'active' );
                // console.log(true1);
                if(true1 == true){
                    i3 = "#cnc"+i+" .tabla-materiales>tbody";
                    nombre0 = "#nombre"+i;
                    mueble0 = "#mueble"+i;
                    pieza0 = "#pieza"+i;
                    modulo0 = "#modulo"+i;
                    ar0 = "#ar"+i;
                    id0 = "#id"+i;
                    dato = "datos"+i; 
                    cara0 = "#cara"+i;
                    i4 = "#archivo"+i;
                    cara0 = "#cara"+i;
                    dato0 = "#nombre"+i+i;
                    dato1 = "#mueble"+i+i;
                    dato2 = "#pieza"+i+i;
                    dato3 = "#modulo"+i+i;
                    dato4 = "#ar"+i+i;
                    dato5 = "#id"+i+i;
                    dato6 = "#cara"+i+i;   
                    nombre = jQuery(nombre0).val();
                    mueble = jQuery(mueble0).val();
                    pieza = jQuery(pieza0).val();
                    modulo = jQuery(modulo0).val();
                    ar = jQuery(ar0).val();
                    id = jQuery(id0).val();
                    cara = jQuery(cara0).val();
                    if(nombre==""||mueble==""||pieza==""||modulo==""||ar==""||id==""||cara==""){
                        alert("Completar todos los datos del rótulo");
                        $('#cargar').fadeIn(1000).html('');
                        return 0;
                    }
                    datos.push(nombre,mueble,pieza,modulo,ar,id,cara);
                    //console.log(datos);
                   var formData = new FormData(document.getElementById(fi));
                   console.log(jQuery(i4).val());
                   if (jQuery(i4).val()==""){
                    alert("Agregar archivo del rótulo");
                        $('#cargar').fadeIn(1000).html('');
                        return 0;
                   }
                   var nombre1 = jQuery(nombre).val();
                   //console.log(formData);
                }

                // 
            }
            //var formData = new FormData(document.getElementById("formuploadajax1"));
            //formData.append("dato", "valor");
            formData.append("datos", JSON.stringify(datos));

            //formData.append(f.attr("name"), $(this)[0].files[0]);
            $.ajax({
                url: "/cnc/upload.php",
                type: "post",
                dataType: "html",
                data: formData,//capturo array  
                crossDomain: true,
                cache: false,
                contentType: false,
	            processData: false,
                success: function(data){ 
                      // console.log(res);
                      $('#cargar').fadeIn(1000).html('');
                                
                                let ncode = [];
                                let ncode1 = [];
                                ncode = JSON.parse(data);
                                //console.log(ncode);
                                if(ncode.length>0)
                                {
                                    let ty='';
                                    for(let a=0; a<ncode.length; a++){
                                        if(ncode[a]!=""){
                                            ty =`${ty} <tr>
                                        <td ><span class="numero">${a}</span></td>
                                        <td class="codigo">${ncode[a]}</td>
                                    </tr>`;    

                                        }                     
                            
                                    }
                                    $(i3).html(ty);   
                                    jQuery(nombre0).val('');
                                    jQuery(mueble0).val('');
                                    jQuery(pieza0).val('');
                                    jQuery(modulo0).val('');
                                    jQuery(ar0).val('');
                                    jQuery(id0).val('');
                                    jQuery(cara0).val('');
                                    jQuery(gcode1).val('');
                                    console.log(i4);
                                    jQuery(i4).val('');
                                }
                                jQuery.ajax({
                                    type:'POST',
                                    //dataType: 'json',
                                    url:'/cnc/get2.php',
                                    data:{'dato': dato},//capturo array  
                                    crossDomain: true,
                                    cache: false,
                                    success: function(data){ 
                                        if(data){
                                            $('#cargar').fadeIn(1000).html('');         
                                            dat = JSON.parse(data);   
                                            //console.log(dat);                         
                                            jQuery(dato0).text(dat[0]);
                                            jQuery(dato1).text(dat[1]);
                                            jQuery(dato2).text(dat[2]);
                                            jQuery(dato3).text(dat[3]);
                                            jQuery(dato4).text(dat[4]);
                                            jQuery(dato5).text(dat[5]);
                                            jQuery(dato6).text(dat[6]);

                                        } else {
                                            //alert('Error al crear!');
                                        }
                                        

                                    }
                                    });

                }
            })
                .done(function(res){
                

                });
                
        });
});


function borrar(dato,i){
    var cnc = dato;
    let rotu = "datos"+i 
    let dato0,dato1,dato2,dato3,dato4,dato5,dato6;
    dato0 = "#nombre"+i+i;
    dato1 = "#mueble"+i+i;
    dato2 = "#pieza"+i+i;
    dato3 = "#modulo"+i+i;
    dato4 = "#ar"+i+i;
    dato5 = "#id"+i+i;
    dato6 = "#cara"+i+i;
    let i3 = "#"+cnc+" .tabla-materiales>tbody";
    var gcode = jQuery('#gcode1').val();
    $('#cargar').html('<div class="loading" style="position: absolute;"><div class="loading2"><img src="images/Spinner.gif" alt="loading" /></div></div>');
    jQuery.ajax({
        type:'POST',
        url:'/cnc/borrar.php',
        data:({'cnc':cnc , 'dato':rotu  }),
        crossDomain: true,
        cache: false,     
        success: function(data){ 
                $('#cargar').fadeIn(1000).html('');
                //location.reload();
                    jQuery(dato0).text('');
                    jQuery(dato1).text('');
                    jQuery(dato2).text('');
                    jQuery(dato3).text('');
                    jQuery(dato4).text('');
                    jQuery(dato5).text('');
                    jQuery(dato6).text('');

                    $(i3).html(''); 

        }
    }); 

}

function cargar(){
    $('#cargar').html('<div class="loading" style="position: absolute;"><div class="loading2"><img src="images/Spinner.gif" alt="loading" /></div></div>');
    var gcode = jQuery('#gcode1').val();
    jQuery.ajax({
        type:'POST',
        url:'/cnc/cargar.php',
        data:({gcode:gcode }),
        crossDomain: true,
        cache: false,     
        success: function(data){ 
                $('#cargar').fadeIn(1000).html('');
                //console.log(data);
                location.reload();

        }
    }); 
}




</script>
<footer>
<!-- <script src="https://code.jquery.com/jquery-3.2.1.js"></script> -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

</footer>
</html>

