<?php

use Illuminate\Http\Request;
use JWTAuth as JWTAuth;

/*  
  |--------------------------------------------------------------------------
  | API Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register API routes for your application. These
  | routes are loaded by the RouteServiceProvider within a group which
  | is assigned the "api" middleware group. Enjoy building your API!
  |
 */

Route::middleware('auth:api')->get('/user', function (Request $request) {
  return $request->user();
});

Route::get('/user/tokenStatus/{id}', 'AuthController@checksession');



Route::post('optimizacion', 'OptimizationController@optimizar');
Route::get('/{project_name}/optimizacion', 'OptimizationController@get_optimizacion');
Route::get('/{project_name}/download_pdf', 'OptimizationController@download_pdf');

// Seccion Diseño
Route::post('disenio/export', 'DisenioController@export');
Route::post('proyectos/save-all', 'ProyectoController@save_all');

// Route::apiResource('usuario', 'UsuarioController');
Route::resource('/niveles', 'NivelComplejidadController');

Route::get('/logout/{id}', 'AuthController@logout');

Route::post('/login', 'AuthController@login');

Route::get('/loginlogs','AuthController@getlogs');

Route::group(['prefix' => 'configuracion'], function () {
  Route::get('/', 'ConfiguracionController@index');
  Route::post('/', 'ConfiguracionController@store');
  Route::get('/{id}', 'ConfiguracionController@show')->where('id', '[0-9]+');
  Route::put('/{id}', 'ConfiguracionController@update')->where('id', '[0-9]+');
  Route::get('/tipo/{tipo}', 'ConfiguracionController@get_by_tipo');
  Route::get('/tipo/{tipo}/all/{default?}', 'ConfiguracionController@get_by_tipo_all');
  Route::delete('/{id}', 'ConfiguracionController@delete')->where('id', '[0-9]+');
});

// Route::group(['middleware' => ['jwt.auth']], function () {
Route::group([], function () {
  Route::get('/rol', 'RolController@index');
  Route::get('auth/rol', 'AuthController@get_rol');

  Route::group(['prefix' => 'clientes'], function () {
    Route::get('/', 'ClienteController@index');
    Route::get('/{id}/proyectos', 'ClienteController@proyectos');
    Route::get('/listadoProy/{name}', 'ClienteController@indexCliente');
    Route::get('/getAuditCliente/{clientes}', 'ClienteController@getAuditCliente');
    Route::put('/{id}', 'ClienteController@update');
  });

  Route::group(['prefix' => 'asistencia'], function () {
    Route::put('/{id}', 'AsistenciaController@update');
    Route::delete('/{id}', 'AsistenciaController@destroy');
    Route::post('/check-time', 'AsistenciaController@check_time');
    Route::post('/store', 'AsistenciaController@store');
    Route::post('/checks-today', 'AsistenciaController@checks_today');
    Route::get('/usuario/{id}', 'AsistenciaController@get_by_usuario');
    Route::get('/planilla/{fecha}', 'AsistenciaController@planilla');
    Route::post('/usuario-fecha', 'AsistenciaController@get_by_usuario_fecha');
    Route::post('/pdf', 'AsistenciaController@pdf');
    Route::post('/justify', 'AsistenciaController@justify');
    Route::post('/force', 'AsistenciaController@force');

    Route::group(['prefix' => 'causes'], function () {
      Route::get('/', 'AsistenciaController@all_causes');
    });

    Route::get('/tipo-asistencia', 'AsistenciaController@get_tipos_asistencias');
    Route::get('/tipo-salida', 'AsistenciaController@get_tipos_salidas');
  });

  Route::group(['prefix' => 'imprimir'], function () {
    Route::post('/datos-generales', 'ProyectoController@exportarPdfGenerar');
  });

  Route::group(['prefix' => 'tiempo_traslado'], function () {
    Route::get('/', 'TiempoTrasladoController@index');
    Route::post('/store', 'TiempoTrasladoController@store');
    Route::put('/update/{id}', 'TiempoTrasladoController@update');
    Route::delete('/{id}', 'TiempoTrasladoController@destroy');
    Route::get('/proyectotoken/{id}', 'TiempoTrasladoProyectoController@indexToken');
    Route::get('/proyecto/{id}', 'TiempoTrasladoProyectoController@index');
    Route::post('/proyecto', 'TiempoTrasladoProyectoController@store');
    Route::put('/proyecto/{id}', 'TiempoTrasladoProyectoController@update');
    Route::delete('/proyecto/{id}', 'TiempoTrasladoProyectoController@destroy');
  });

  Route::group(['prefix' => 'medicion_instalacion'], function () {
    Route::get('/med/{id}', 'MedicionInstalacionController@indexJsonMed');
    Route::get('/inst/{id}', 'MedicionInstalacionController@indexJsonInst');
    Route::get('/instdate/{fecha1}/{fecha2}', 'MedicionInstalacionController@indexJsonInstDate');
    Route::get('/yearmonth/{fecha}', 'MedicionInstalacionController@indexJsonYearMonth');
    Route::get('/yearmonthweek/{fecha}', 'MedicionInstalacionController@indexJsonYearMonthWeek');
    Route::get('/yearmonthdetail/{fecha}/{tipo}', 'MedicionInstalacionController@indexJsonYearMonthDetail');
    Route::get('/yearmonthweekdetail/{fecha}', 'MedicionInstalacionController@indexJsonYearMonthWeekDetail');
	  Route::get('/meddate/{fecha1}/{fecha2}', 'MedicionInstalacionController@indexJsonMedDate');
    Route::get('/medtaller/{id}', 'MedicionInstalacionController@indexMed');
    Route::get('/installer/{id}', 'MedicionInstalacionController@indexInst');
    Route::post('/', 'MedicionInstalacionController@store');
    Route::put('/{id}', 'MedicionInstalacionController@update');
    Route::delete('/{id}', 'MedicionInstalacionController@destroy');
  });

  Route::group(['prefix' => 'capacidad_produccion'], function () {
    Route::get('/', 'CapacidadProduccionController@index');
    Route::post('/store', 'CapacidadProduccionController@store');
    Route::put('/update/{id}', 'CapacidadProduccionController@update');
    Route::delete('/{id}', 'CapacidadProduccionController@destroy');
    Route::get('/horaria', 'CapacidadProduccionHorariaController@index');
    Route::post('/horaria', 'CapacidadProduccionHorariaController@store');
    Route::put('/horaria/{id}', 'CapacidadProduccionHorariaController@update');
    Route::delete('/horaria/{id}', 'CapacidadProduccionHorariaController@destroy');
    Route::get('/proyectojson/{id}', 'CapacidadProduccionProyectoController@indexJson');
    Route::get('/proyecto/{id}', 'CapacidadProduccionProyectoController@index');
    Route::post('/proyecto', 'CapacidadProduccionProyectoController@store');
    Route::put('/proyecto/{id}', 'CapacidadProduccionProyectoController@update');
    Route::delete('/proyecto/{id}', 'CapacidadProduccionProyectoController@destroy');
  });

  Route::group(['prefix' => 'usuario'], function () {
    Route::get('/', 'UsuarioController@index');
    Route::get('/listAfipUsers', 'UsuarioController@listAfipUsers');
    Route::get('/listVisibleUsers', 'UsuarioController@listVisibleUsers');
    Route::get('/listVisibleHorarioUsers', 'UsuarioController@listVisibleHorarioUsers');
    Route::get('/listActiveUsers', 'UsuarioController@listActiveUsers');
    Route::get('/{id}', 'UsuarioController@getUser')->where('id', '[0-9]+');
    Route::post('/', 'UsuarioController@store');
    Route::put('/{id}', 'UsuarioController@update')->where('id', '[0-9]+');
    Route::post('/correo-google/', 'UsuarioController@get_by_google');
    Route::post('/check-admin/', 'UsuarioController@check_admin');
    Route::delete('/{id}', 'UsuarioController@delete');
    Route::get('/order-last-messages', 'UsuarioController@order_last_messages');
    Route::post('/changePermission', 'UsuarioController@changePermission');
    Route::put('/change-visible-planilla/{id}', 'UsuarioController@changeVisiblePlanilla');
    Route::put('/change-rango-usuario/{id}', 'UsuarioController@changeRangoUsuario');
    Route::put('/change-afip-usuario/{id}', 'UsuarioController@changeAfipUsuario');
    Route::get('/getPermiso/{id}', 'UsuarioController@getPermiso');

    Route::group(['prefix' => 'estados'], function () {
      Route::get('/', 'UsuarioEstadoController@index');
      Route::post('/', 'UsuarioEstadoController@store');
    });
  });

  Route::group(['prefix' => 'grupo'], function () {
    Route::get('/', 'GrupoController@index');
  });

  Route::group(['prefix' => 'encuesta_pregunta'], function () {
    Route::get('/', 'EncuestaPreguntaController@index');
    Route::post('/', 'EncuestaPreguntaController@store');
    Route::put('/{id}', 'EncuestaPreguntaController@update');
  });

  Route::group(['prefix' => 'encuesta_respuesta'], function () {
    Route::get('/', 'EncuestaRespuestaController@index');
    Route::post('/', 'EncuestaRespuestaController@store');
    Route::put('/{id}', 'EncuestaRespuestaController@update');
  });

  Route::group(['prefix' => 'event'], function () {
    Route::post('/', 'EventsController@store');
    Route::get('/', 'EventsController@getAll');
    Route::get('/today/{type}', 'EventsController@getFromToday');
    Route::patch('/{id}', 'EventsController@update');
    Route::delete('/{id}', 'EventsController@delete');
    Route::patch('/{id}/assign', 'ProyectoController@assigns');
    Route::get('/dates/{date_begin}/{date_end}', 'EventsController@get_between_dates');
  });

  Route::group(['prefix' => 'auditoria'], function () {
    Route::post('/sheet/store', 'AuditoriaController@store');
    Route::post('/sheet/usuario', 'AuditoriaController@get_sheet_by_usuario');
    Route::post('/sheet/usuario-fecha', 'AuditoriaController@get_sheet_by_usuario_fecha');
    Route::post('/estadistica-usuario-fecha', 'AuditoriaController@get_estadistica_by_usuario_fecha');
    Route::post('/usuario-fecha', 'AuditoriaController@get_by_usuario_fecha');
  });

  Route::group(['prefix' => 'proyectos'], function () {
    Route::get('/{id}', 'ProyectoController@show')->where('id', '0-9');
    Route::get('/{id}/all', 'ProyectoController@get_all');

    Route::post('/save-all', 'ProyectoController@save_all');
    Route::post('/responsible', 'ProyectoController@save_responsible');
    Route::delete('/responsible/{id}', 'ProyectoController@delete_responsible');
    // Route::post('/update', 'ProyectoController@update');
    Route::put('/{id}', 'ProyectoController@update');
    Route::put('/desactivar/{id}', 'ProyectoController@desactivar');
    Route::put('/only/{id}', 'ProyectoController@update_proyecto');
    Route::get('/all', 'ProyectoController@all');
    Route::get('/allProyects', 'ProyectoController@allProyects');
    Route::get('/allProyectsOpen', 'ProyectoController@allProyectsOpenWithComponents');
    Route::get('/allProyectsTotal', 'ProyectoController@allProyectsWithComponents');
    Route::patch('/{id}', 'ProyectoController@assigns');
    Route::delete('/{id}', 'ProyectoController@delete');
    Route::get('/{id}/calcos', 'ProyectoController@get_calcos')->where('id', '[0-9]+');
    Route::get('/dates/{date_begin}/{date_end}/{forzar_control}', 'ProyectoController@get_between_dates');
  });

  Route::group(['prefix' => 'presupuestos'], function () {
    Route::get('/presets', 'PresupuestosPresetController@index');
    Route::post('/presets', 'PresupuestosPresetController@create');
    Route::delete('/presets/{id}', 'PresupuestosPresetController@delete');
    Route::put('/presets/{id}', 'PresupuestosPresetController@update');
    Route::post('/images', 'ImagenesPresupuestoController@upload');
    Route::delete('/images/{id}', 'ImagenesPresupuestoController@delete');
    Route::get('/images/{token}', 'ImagenesPresupuestoController@get');
    Route::post('/images/url', 'ImagenesPresupuestoController@saveUrl');
    Route::post('/pdfs', 'PdfsPresupuestoController@upload');
    Route::delete('/pdfs/{id}', 'PdfsPresupuestoController@delete');
    Route::get('/pdfs/{token}', 'PdfsPresupuestoController@get');
    Route::post('/pdfs/url', 'PdfsPresupuestoController@saveUrl');
    Route::post('/videos', 'VideosPresupuestoController@upload');
    Route::delete('/videos/{id}', 'VideosPresupuestoController@delete');
    Route::get('/videos/{token}', 'VideosPresupuestoController@get');
    Route::post('/videos/url', 'VideosPresupuestoController@saveUrl');
  });

  Route::group(['prefix' => 'presupuesto'], function () {
    Route::post('/', 'PresupuestoController@create');
    Route::put('/{presupuesto}', 'PresupuestoController@update');
    Route::put('/estado/{presupuesto}', 'PresupuestoController@updateEstado');
    Route::put('/campo/{id}', 'PresupuestoController@updateCampo');
    Route::get('/{token}', 'PresupuestoController@getByToken');
    Route::get('/', 'PresupuestoController@index');
    Route::post('/exportar', 'PresupuestoController@exportarPdf');
    Route::get('/ver-pdf-presupuesto/{id}', 'PresupuestoController@verPdfPresupuesto');
    Route::post('/reabrir', 'PresupuestoController@reabrir');
    Route::post('/login', 'PresupuestoController@loginFromPresupuesto');
    Route::post('/deletebulk', 'PresupuestoController@deletebulk');
  });


  Route::group(['prefix' => 'estados'], function () {
    Route::get('/', 'EstadoController@index');
  });

  Route::group(['prefix' => 'piezas'], function () {
    Route::get('/list-by-modulo/{modulo_id}', 'PiezaController@listByModulo');
    Route::get('/list-sueltas-by-modulo/{modulo_id}', 'PiezaController@listSueltasByModulo');
    Route::get('/historialPieza/{pieza_id}', 'PiezaController@historialPieza');
    Route::post('/historialPieza', 'PiezaController@createHistorialPieza');  
    Route::put('/{id}', 'PiezaController@update');
    Route::put('/change-va-suelta/{id}', 'PiezaController@updateVaSuelta');
    Route::get('/historialTaller/{etapa_id}/{campo_id}', 'PiezaController@historialTaller');
    Route::post('/historialTaller', 'PiezaController@createHistorialTaller');      

  });
  
  /*
  Route::group(['prefix' => 'tallerHistorial', 'middleware' => 'cors'], function () {
      // Route::get('/list-by-modulo/{modulo_id}', 'TallerHistorialController@listByModulo');
      // Route::get('/view/{etapa_id}/{campo_id}', 'TallerHistorialController@view');
      Route::post('/historial', 'TallerHistorialController@create');    
      // Route::put('/{id}', 'PiezaController@update');
  });
  */

  Route::group(['prefix' => 'piezas_admin'], function () {
    Route::put('/{id}', 'PiezaController@update');
    Route::post('/', 'PiezaController@create');
    Route::delete('/{id}', 'PiezaController@delete');
  });

  Route::group(['prefix' => 'action_notes'], function () {
    Route::get('allOrig/{id}', 'ActionNoteController@allOrig');
    Route::get('/{id}', 'ActionNoteController@index');
    Route::post('/', 'ActionNoteController@store');
    Route::put('/{id}', 'ActionNoteController@update');
    Route::delete('/{id}', 'ActionNoteController@delete');
  });

  Route::group(['prefix' => 'tapacantos'], function () {
    Route::put('/{id}', 'TapacantoController@update');
  });

  Route::group(['prefix' => 'materiales'], function () {
    Route::get('/', 'MaterialController@index');
    Route::get('/all_materiales', 'MaterialController@all_materiales');
    Route::get('/materials_for_type/{type}', 'MaterialController@materiles_por_tipo');
    Route::get('/materials_for_type_textures/{type}', 'MaterialController@materiles_por_tipo_taller');
    Route::get('/tipo_materiales', 'MaterialController@tipo_materiales');
    Route::get('/{id}', 'MaterialController@show')->where('id', '[0-9]+');
    Route::post('/', 'MaterialController@store');
    Route::put('/{id}', 'MaterialController@update');
    Route::delete('/{id}', 'MaterialController@destroy');
    Route::get('/default', 'MaterialController@get_by_default');
    Route::get('/raw', 'MaterialController@get_raw');
    Route::get('/{id}/textura/{tipo_id}', 'MaterialController@get_texture');
    Route::get('/lista/{ids?}', 'MaterialController@get_texture_list');
    Route::get('/search', 'MaterialController@search');
  });

  Route::group(['prefix' => 'modulos'], function () {
    Route::get('/get-control-by-proy/{proyecto_id}', 'ModuloController@getControlByProy');
    Route::put('/{id}', 'ModuloController@update');
    Route::put('/update-armado/{id}', 'ModuloController@updateArmado');
  });

  Route::group(['prefix' => 'horarios'], function () {
    Route::get('/', 'HorarioController@index');
    Route::get('/planilla/{fecha}', 'HorarioController@planilla');
    Route::put('/', 'HorarioController@store');
    Route::put('/{id}', 'HorarioController@store_horario_user');
  });

  Route::post('mispuntajes', 'PuntajesController@getPuntajes');
  Route::post('mispuntajesfecha', 'PuntajesController@getPuntajesFecha');
  Route::post('prod_by_dates', 'ProduccionController@prod_by_date');

  //Route para el manejo de las imagenes

    Route::group(['prefix' => 'v2', 'middleware' => 'cors'], function () {
    Route::resource('images', 'ImagesController');
    Route::get('/images/allFolder/{token}/', 'ImagesController@showAll');
    Route::get('/images/{token}/{folder?}', 'ImagesController@show');
    Route::post('/images/folder', 'ImagesController@makefolder');
    Route::post('/images/loadfolder', 'ImagesController@loadfolder');
    Route::post('/images/setfolder', 'ImagesController@setfolder');
    Route::post('/images/deletefolder', 'ImagesController@deletefolder');
    Route::delete('/images/proyecto/{token}', 'ImagesController@delete_project');
    Route::post('/images/proyecto/{token_project}', 'ImagesController@delete_one_image');
    Route::delete('/images', 'ImagesController@delete_multiple');
  });

  Route::group(['prefix' => 'feriados'], function () {
    Route::get('/', 'FeriadoController@index');
    Route::get('/{fecha1}/{fecha2}', 'FeriadoController@indexDate');
    Route::post('/', 'FeriadoController@store');
    Route::put('/{id}', 'FeriadoController@update');
    Route::delete('/{id}', 'FeriadoController@destroy');
  });

  Route::group(['prefix' => 'configuracionmensual'], function () {
    Route::get('/', 'ConfiguracionMensualController@get');
    Route::get('/configanterior', 'ConfiguracionMensualController@getConfigMensualAnterior');
    Route::post('/', 'ConfiguracionMensualController@store');
    Route::put('/{configuracionMensual}', 'ConfiguracionMensualController@update');
    Route::put('/updatestatus/{configuracionMensual}', 'ConfiguracionMensualController@updateStatus');
    Route::delete('/{id}', 'ConfiguracionMensualController@destroy');
  });

  Route::group(['prefix' => 'pagos'], function () {
    Route::get('/', 'PagoController@get');
    Route::post('/', 'PagoController@store');
    Route::put('/{pago}', 'PagoController@update');
    Route::delete('/{pago}', 'PagoController@destroy');
  });

  Route::group(['prefix' => 'recibos'], function () {
    Route::get('/', 'ReciboController@get');
    Route::post('/get_by_usuario_fecha', 'ReciboController@getByUsuarioFecha');
    Route::post('/', 'ReciboController@store');
    Route::put('/{recibo}', 'ReciboController@update');
  });

  Route::group(['prefix' => 'inasistencias'], function () {
    Route::get('/{usuario_id}/{fecha}', 'InasistenciaController@showByUserDate');
    Route::post('/', 'InasistenciaController@store');
    Route::put('/{inasistencia}', 'InasistenciaController@update');
    Route::delete('/{inasistenciadoc_id}', 'InasistenciaController@destroy');
  });

  Route::group(['prefix' => 'rangos'], function () {
    Route::get('/', 'RangoController@index');
    Route::post('/', 'RangoController@store');
    Route::put('/{rango}', 'RangoController@update');
    Route::delete('/{rango}', 'RangoController@destroy');
  });

  // Compras
  Route::apiResource('proveedors', 'ProveedorController');

  Route::apiResource('pedidos', 'PedidoController');

  Route::post('pedidos/deletebulk', 'PedidoController@deletebulk');

  //Route para el manejo de mensajes, grupo, chat

  Route::group(['prefix' => 'grupo'], function () {
    Route::get('/', 'MensajeController@index');
    Route::post('/', 'MensajeController@create');
    Route::put('/{id}', 'MensajeController@update');
    Route::delete('/{id}', 'MensajeController@destroy');

    Route::post('/listagrupomensaje/{id}', 'MensajeController@listagrupomensaje');
    Route::post('/grupomensaje', 'MensajeController@creategrupomensaje');
    Route::post('/order-last-messages', 'MensajeController@group_order_last_messages');
  });
  // Route::group(['prefix'=>'chat'], function(){
  // 	Route::post('/listachatmensaje','MensajeController@listachatmensaje');
  // });
  Route::post('/chatmensajesl', 'MensajeController@listachatmj');
  Route::post('/getmensajesnoleidos/{userid}', 'MensajeController@getmensajesnoleidos');
  Route::post('/listachatmjcountmsj', 'MensajeController@listachatmjcountmsj');

  Route::group(['prefix' => 'tarea'], function () {
    Route::post('/getlistatareas/{userid}', 'MensajeController@cargalistatareas');
    Route::post('/agregartarea', 'MensajeController@agregartarea');
    Route::post('/tarearealizada/{tareaid}', 'MensajeController@realizadatarea');
  });

  Route::group(['prefix' => 'proyecto-json'], function () {
    Route::get('/', 'ProyectoJsonController@index');
    Route::post('/checkname', 'ProyectoJsonController@checkname');
    Route::post('/versions', 'ProyectoJsonController@removeoldversions');
    Route::get('/last', 'ProyectoJsonController@getLast');
    Route::get('/initial/{filter}', 'ProyectoJsonController@index');
    Route::get('/{id}', 'ProyectoJsonController@show')->where('id', '[0-9]+');
	  Route::get('/showdetail/{token}', 'ProyectoJsonController@showdetail');
    Route::get('/descargarproy/{id}', 'ProyectoJsonController@descargarProy');
    Route::post('/', 'ProyectoJsonController@store');
    Route::post('/subirproy', 'ProyectoJsonController@subirProy');
    Route::put('/', 'ProyectoJsonController@update');
    Route::put('/encargadomed', 'ProyectoJsonController@updateEncargadoMed');
    Route::put('/encargadoinst', 'ProyectoJsonController@updateEncargadoInst');
    Route::delete('/{id}', 'ProyectoJsonController@delete')->where('id', '[0-9]+');
    Route::put('/{token}', 'ProyectoJsonController@getlastfromtoken');
  });

  
  Route::group(['prefix' => 'proyectoActividad' , 'middleware' => 'cors'] , function () {
    Route::get('/', 'ProyectoActividadController@index');
    Route::get('/view', 'ProyectoActividadController@view');
    Route::get('/show/{id}', 'ProyectoActividadController@show');   
    Route::post('/', 'ProyectoActividadController@create');
    Route::put('/{id}', 'ProyectoActividadController@update');
    // Route::delete('/{id}', 'ProyectoActividadController@destroy');
  });

  Route::group(['prefix' => '3dviewer'], function () {
    Route::get('/all_users', 'TresdViewerController@all_users');
    Route::get('/all_parts/{proyectoname}', 'TresdViewerController@all_parts');
    Route::POST('/save_parts', 'TresdViewerController@save_parts');

    Route::POST('/scene/create', 'ThreeSceneController@create');
    Route::GET('/scene/{proyecto_id}', 'ThreeSceneController@get');
    Route::GET('/markers/{proyecto_id}', 'ThreeSceneController@getMarkers');
    Route::GET('/editor/{proyecto_id}', 'ThreeSceneController@getEditorData');
  });

  Route::group(['prefix' => 'respaldo'], function () {
    Route::get('/', 'RespaldoController@index');
    Route::get('/download/{date}/{option?}', 'RespaldoController@download_file');
  });

  Route::group(['prefix' => 'projectMetadata'], function () {
    Route::get('/{projectId}', 'ProyectoController@get_metadata')->where('id', '[0-9]+');
  });

  Route::group(['prefix' => 'metadata'], function () {
    Route::group(['prefix' => 'material'], function () {
      Route::put('/{id}', 'MetadataController@update_material')->where('id', '[0-9]+');
    });
  });

  Route::group(['prefix' => 'eventimage', 'middleware' => 'cors'], function () {
    Route::POST('/', 'ImagenesEventosController@upload');
    Route::GET('/{id}', 'ImagenesEventosController@getEventImages')->where('id', '[0-9]+');
    Route::GET('/thumbs/{id}', 'ImagenesEventosController@getEventImagesThumbs')->where('id', '[0-9]+');
    Route::delete('/{imagename}', 'ImagenesEventosController@deleteEventImages');
  });

  Route::group(['prefix' => 'grupos', 'middleware' => 'cors'], function () {
    Route::get('/', 'GruposController@index');
    Route::get('/{id}', 'GruposController@byId');
    Route::post('/', 'GruposController@create');
    Route::put('/{id}', 'GruposController@update');
   /* Route::group(['prefix' => 'usuario'], function () {
      Route::post('/', 'GrupoUsuarioController@create');
      Route::delete('/{id}', 'GrupoUsuarioController@destroy');
    });*/
  });
    Route::group(['prefix' => 'tareas', 'middleware' => 'cors'], function () {
    Route::get('/{user}', 'TareaController@index');
    Route::get('/show/{id}', 'TareaController@show');
    Route::get('/list_calendar/{user}', 'TareaController@indexCalendar');
    Route::post('/', 'TareaController@create');
    Route::put('/{id}', 'TareaController@update');
    Route::put('/nota/{id}', 'TareaController@updateNota');
    Route::delete('/{id}', 'TareaController@destroy');
  });



  Route::group(['prefix' => 'notification', 'middleware' => 'cors'], function () {
    Route::get('/', 'NotificationController@index');
   // Route::get('/notUsuario/usuario/{usuario}/path/${path}', 'NotificationController@notUsuario');
    Route::get('/notUsuario', 'NotificationController@notUsuario');
    Route::get('/show/{id}', 'NotificationController@show');   
    Route::post('/', 'NotificationController@create');
    Route::put('/{id}', 'NotificationController@update');
    Route::delete('/{id}', 'NotificationController@destroy');
  });
  


  Route::group(['prefix' => 'help', 'middleware' => 'cors'], function () {
    Route::get('/', 'HelpController@index');
    Route::get('/HelpCategory', 'HelpController@HelpCategoria');
    Route::get('/view', 'HelpController@view');
    Route::get('/show/{id}', 'HelpController@show');   
    Route::post('/', 'HelpController@create');
    Route::put('/{id}', 'HelpController@update');
    Route::delete('/{id}', 'HelpController@destroy');
  });
  
  
  Route::group(['prefix' => 'helpCategory', 'middleware' => 'cors'], function () {
    Route::get('/', 'HelpCategoryController@index');
    Route::get('/show/{id}', 'HelpCategoryController@show');   
    Route::post('/', 'HelpCategoryController@create');
    Route::put('/{id}', 'HelpCategoryController@update');
    Route::delete('/{id}', 'HelpCategoryController@destroy');
  });


/*
  Route::group(['prefix' => 'tipoTarea', 'middleware' => 'cors'], function () {
    Route::get('/', 'TipoTareaController@index');
    Route::post('/', 'TipoTareaController@create');
    Route::put('/{id}', 'TipoTareaController@update');
  });
*/
  // ROUTES para el manejo de imagen Intercactiva en Disenio
  Route::group(['prefix' => 'ambientes'], function () {
    Route::POST('/nuevo', 'AmbientesController@nuevoAmbiente'); //->where('id', '[0-9]+');
    Route::POST('/obtener', 'AmbientesController@obtenerAmbientes'); //->where('id', '[0-9]+');
    Route::POST('/informacion', 'AmbientesController@informacionAmbiente'); //->where('id', '[0-9]+');
    Route::delete('/nota/{imagename}', 'AmbientesController@deleteEventImages');
    Route::delete('/ambiente/{imagename}', 'AmbientesController@deleteEventImages');
  });

  Route::group(['prefix' => 'chat-grupo'], function () {
    Route::post('/messages', 'ChatGrupoController@messages');
  });

  Route::group(['prefix' => 'clients', 'namespace' => 'ClientPresentation', 'as' => 'clientPresentation.' ], function () {

    Route::resource('templates', 'ClientPresentationTemplateController',  ['only' => [ 'index', 'show']]);
    Route::resource('views', 'ClientPresentationViewController', ['except' => [ 'create', 'edit']]);
    Route::resource('sequence', 'ClientPresentationSequenceController', ['except' => [ 'create', 'edit']]);
    Route::resource('dataStorage', 'ClientPresentationDataStorageController', ['except' => [ 'create', 'edit']]);
    Route::post('upload', 'ClientPresentationViewController@uploadTempFile')->name('uploadFile');
    Route::post('sequence/publish/{sequence}', 'ClientPresentationSequenceController@publish')->name('sequence.publish');
    Route::put('dataStorage/{dataStorage}/info', 'ClientPresentationDataStorageController@updateinfo')->name('dataStorage.updateinfo');
    Route::put('dataStorage/{dataStorage}/status', 'ClientPresentationDataStorageController@updateStatus')->name('dataStorage.updateStatus');
    Route::post('dataStorage/{dataStorage}/upload', 'ClientPresentationDataStorageController@uploadFile')->name('dataStorage.uploadFile');
    Route::delete('dataStorage/{dataStorage}/upload', 'ClientPresentationDataStorageController@deleteFile')->name('dataStorage.uploadFile');

    });
});

Route::group(['prefix' => 'sequence', 'namespace' => 'ClientPresentation', 'as' => 'clientSequence.' ], function () {

//    Route::resource('dataStorage', 'ClientPresentationDataStorageController', ['except' => [ 'create', 'edit']]);
//    Route::post('upload', 'ClientPresentationViewController@uploadTempFile')->name('uploadFile');
    Route::post('store', 'ClientPresentationDataStorageController@storeClient')->name('data.store');
//    Route::put('dataStorage/{dataStorage}/info', 'ClientPresentationDataStorageController@updateinfo')->name('dataStorage.updateinfo');
//    Route::put('dataStorage/{dataStorage}/status', 'ClientPresentationDataStorageController@updateStatus')->name('dataStorage.updateStatus');
//    Route::post('dataStorage/{dataStorage}/upload', 'ClientPresentationDataStorageController@uploadFile')->name('dataStorage.uploadFile');
//    Route::delete('dataStorage/{dataStorage}/upload', 'ClientPresentationDataStorageController@deleteFile')->name('dataStorage.uploadFile');

});

Route::group(['prefix' => 'exportar'], function () {
  Route::post('/validar', 'ExportarController@validarProyecto');
  Route::post('/set-revision', 'ExportarController@setRevision');
  Route::post('/set-cofirmar-revicion', 'ExportarController@setCofirmarRevicion');
  Route::post('/set-confirma-exportar', 'ExportarController@setConfirmaExportar');
  Route::post('/set-corregir', 'ExportarController@setCorregir');
  Route::get('/get-exportar', 'ExportarController@getExportar');
  Route::get('/ocultar/{id}', 'ExportarController@ocultar');
});
