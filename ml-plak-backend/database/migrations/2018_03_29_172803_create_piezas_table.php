<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePiezasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('piezas', function (Blueprint $table) {
					$table->increments('id');
					$table->string('pieza');
					$table->integer('cantidad');
					$table->integer('posicion_x');
					$table->integer('posicion_y');
					$table->integer('posicion_z');
					$table->integer('lveta');
					$table->integer('aveta');
					$table->integer('espesor');
					$table->integer('orientacion');
					$table->timestamps();

					$table->integer('modulo_id')->unsigned();
					$table->integer('material_id')->unsigned();
					$table->integer('estado_id')->unsigned();
					$table->integer('prearmado_estado_id')->unsigned();

					$table->foreign('modulo_id')->references('id')->on('modulos')
						->onUpdate('cascade')->onDelete('no action');

					$table->foreign('material_id')->references('id')->on('materiales')
						->onUpdate('cascade')->onDelete('no action');

					$table->foreign('estado_id')->references('id')->on('estados')
						->onUpdate('cascade')->onDelete('no action');

					$table->foreign('prearmado_estado_id')->references('id')->on('estados')
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
        Schema::dropIfExists('piezas');
    }
}
