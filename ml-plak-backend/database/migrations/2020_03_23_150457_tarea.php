<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Tarea extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('tarea', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('grupo_id')->unsigned()->nullable();
            $table->integer('usuario_id')->unsigned()->nullable();
            $table->string('descripcion');
            $table->boolean('realizado')->default(0);
            
            $table->foreign('grupo_id')->references('id')->on('grupos');
            $table->foreign('usuario_id')->references('id')->on('usuarios');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
