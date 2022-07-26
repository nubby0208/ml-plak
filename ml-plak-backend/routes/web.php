<?php

use \Illuminate\Support\Facades\Storage;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
  return view('welcome');
});

Route::get('/authorize', 'GoogleSpreadsheetsController@authorize');

Route::get('/test', 'DisenioController@export');
Route::get('/pdf', function () {
  return view('cargandoPdf');
});

Route::get('/pdf/{name}', function ($name) {
  //var_dump(public_path()); exit();
  $file = Storage::get('/public/pdf/' . $name);
  return response($file, 200)->header('Content-Type', 'application/pdf');
});
//Route::get('optimizacion', 'OptimizationController@optimizar');

Route::get('/eventimage/file/{filename}', function ($filename) {
  $file = \Illuminate\Support\Facades\Storage::get('ImagenesEventos/' . $filename);
  return response($file, 200)->header('Content-Type', 'image/jpeg');
});

Route::get('/presupuesto/file/{type}/{filename}', function ($type, $filename) {
  if ($type === 'image') {
    $file = \Illuminate\Support\Facades\Storage::get('ImagenesPresupuesto/' . $filename);
    $contentType = 'image/jpeg';
  } else if ($type === 'pdf') {
    $file = \Illuminate\Support\Facades\Storage::get('PdfsPresupuesto/' . $filename);
    $contentType = 'application/pdf';
  } else if ($type === 'video') {
    $file = \Illuminate\Support\Facades\Storage::get('VideosPresupuesto/' . $filename);
    $contentType = 'video/mp4';
  }


  return response($file, 200)->header('Content-Type', $contentType);
});

Route::get('/file/{file}', function ($file) {
  $file = Storage::get('/' . $file);
  return response($file, 200)->header('Content-Type', 'application/pdf');
});
