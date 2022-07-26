<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCapacidadProduccionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('capacidad_produccion', function (Blueprint $table) {
            $table->increments('id');
            $table->string('item');
            $table->string('tiempo_disenio');
            $table->string('tiempo_produccion');
            $table->string('tiempo_instalacion');
            $table->string('coeficiente_multiplicador');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('usuario_estados');
    }
}
