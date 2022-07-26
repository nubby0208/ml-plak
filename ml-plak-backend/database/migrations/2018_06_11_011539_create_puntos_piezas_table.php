<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePuntosPiezasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('puntos_piezas', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('usuario_id_corte')->unsigned()->nullable();
            $table->integer('usuario_id_prearmado')->unsigned()->nullable();
            $table->integer('usuario_id_tapacantos')->unsigned()->nullable();
            $table->integer('usuario_id_modulo')->unsigned()->nullable();
            $table->integer('usuario_id_cajones')->unsigned()->nullable();
            $table->integer('puntos_corte')->nullable();
            $table->integer('puntos_prearmado')->nullable();
            $table->integer('puntos_tapacantos')->nullable();
            $table->integer('puntos_modulo')->nullable();
            $table->integer('puntos_cajones')->nullable();
            $table->integer('pieza_id')->unsigned()->nullable();
            $table->foreign('pieza_id')->references('id')->on('piezas')
                ->onDelete('no action')->onUpdate('cascade');

            $table->integer('modulo_id')->unsigned()->nullable();
            $table->foreign('modulo_id')->references('id')->on('piezas')
                ->onDelete('no action')->onUpdate('cascade');

            $table->boolean('is_cajon')->default(0);
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
        Schema::dropIfExists('puntos_piezas');
    }
}
