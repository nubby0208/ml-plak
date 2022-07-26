<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class EncuestaPregunta extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('encuesta_pregunta', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre');
            $table->boolean('esPregunta')->default(1);
            $table->boolean('esEstrella')->default(1);
            $table->boolean('esTextarea')->default(1);
			$table->boolean('estado')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('encuesta_pregunta');
    }

}
