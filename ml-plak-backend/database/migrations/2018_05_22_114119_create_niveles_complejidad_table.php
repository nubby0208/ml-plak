<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNivelesComplejidadTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('niveles_complejidad', function (Blueprint $table) {
            $table->increments('id');
            $table->string('etapa');
            $table->string('tipo')->nullable();
            $table->string('nivel')->nullable();
            $table->integer('min')->nullable();
            $table->integer('max')->nullable();
            $table->integer('puntos');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('niveles_complejidad');
    }
}
