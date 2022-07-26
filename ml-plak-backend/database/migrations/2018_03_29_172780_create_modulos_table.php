<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateModulosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('modulos', function (Blueprint $table) {
					$table->increments('id');
					$table->string('modulo');
					$table->integer('proyecto_id')->unsigned();
					$table->integer('estado_id')->unsigned();
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
        Schema::dropIfExists('modulos');
    }
}
