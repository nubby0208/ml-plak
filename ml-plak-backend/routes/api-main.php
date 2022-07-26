<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::group(['prefix' => 'controlerrores'],function () {
  Route::post('/proyecto/get-control-by-area', 'ControlErroresProyecto\Controllers\ControlErroresProyectoAreaController@getControlErrorByArea');
  Route::post('/proyecto/list-control-by-pieza', 'ControlErroresProyecto\Controllers\ControlErroresProyectoAreaController@listControlErrorByPieza');
  Route::post('/proyecto/list-control-by-nota', 'ControlErroresProyecto\Controllers\ControlErroresProyectoAreaController@listControlErrorByNota');
  Route::post('/proyecto/list-control-by-modulo', 'ControlErroresProyecto\Controllers\ControlErroresProyectoAreaController@listControlErrorByModulo');
  Route::post('/proyecto', 'ControlErroresProyecto\Controllers\ControlErroresProyectoAreaController@store');
  Route::put('/proyecto/{controlErroresProyectoArea}', 'ControlErroresProyecto\Controllers\ControlErroresProyectoAreaController@update');
  Route::delete('/proyecto/{controlErroresProyectoArea}', 'ControlErroresProyecto\Controllers\ControlErroresProyectoAreaController@destroy');
  Route::get('/proyecto/{controlErroresProyectoArea}', 'ControlErroresProyecto\Controllers\ControlErroresProyectoAreaController@show');
});

Route::group(['prefix' => 'proyectos'],function () {
  Route::resource('/areas', 'Base\Controllers\ProyectoAreaController',  ['only' => ['index']]);
  Route::resource('/etapas', 'Base\Controllers\ProyectoEtapaController',  ['only' => ['index']]);
  Route::resource('/error_motivos', 'Base\Controllers\ErrorProyectoMotivoController',  ['only' => ['index']]);
});
