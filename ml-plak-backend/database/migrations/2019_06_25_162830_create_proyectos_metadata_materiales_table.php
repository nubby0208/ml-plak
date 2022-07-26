<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProyectosMetadataMaterialesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('proyectos_metadata_materiales', function (Blueprint $table) {
			$table->increments('id');
			$table->longText('material');
			$table->integer('estado_id')->unsigned()->default(9);
			$table->integer('proyecto_id')->unsigned()->nullable();
			$table->timestamps();

			$table->foreign('proyecto_id')->references('id')->on('proyectos')
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
        Schema::dropIfExists('proyectos_metadata_materiales');
    }
}
