<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTapacantosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tapacantos', function (Blueprint $table) {
					$table->increments('id');
					$table->integer('pieza_id')->unsigned();
					$table->integer('tipo_tapacanto_id')->unsigned();
					$table->integer('posicion_tapacanto_id')->unsigned();
					$table->integer('estado_id')->unsigned();
					$table->timestamps();

					$table->foreign('pieza_id')->references('id')->on('piezas')
						->onUpdate('cascade')->onDelete('no action');

					$table->foreign('tipo_tapacanto_id')->references('id')->on('tipos_tapacantos')
						->onUpdate('cascade')->onDelete('no action');

					$table->foreign('posicion_tapacanto_id')->references('id')->on('posiciones_tapacantos')
						->onUpdate('cascade')->onDelete('no action');

					$table->foreign('estado_id')->references('id')->on('estados')
						->onUpdate('cascade')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tapacantos');
    }
}
