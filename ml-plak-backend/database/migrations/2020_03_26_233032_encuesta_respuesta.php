<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class EncuestaRespuesta extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('encuesta_respuesta', function (Blueprint $table) {
            $table->increments('id');
			$table->integer('id_proyecto')->references('id')->on('proyectos');
            $table->integer('id_pregunta')->unsigned()->nullable();
            $table->integer('usuario_id')->unsigned()->nullable();
            $table->string('respuesta');
            $table->timestamps();
            $table->foreign('id_pregunta')->references('id')->on('encuesta_pregunta');
            $table->foreign('usuario_id')->references('id')->on('usuarios');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('encuesta_respuesta');
    }

}
