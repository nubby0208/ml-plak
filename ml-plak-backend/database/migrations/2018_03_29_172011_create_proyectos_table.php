<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProyectosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('proyectos', function (Blueprint $table) {
					$table->increments('id');
					$table->string('proyecto');
					$table->double('valor_total');
					$table->integer('senia');
					$table->datetime('instalacion_fecha');
					$table->string('instalacion_comentario');
					$table->integer('cliente_id')->unsigned();
					$table->timestamps();

					$table->foreign('cliente_id')->references('id')->on('clientes')
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
        Schema::dropIfExists('proyectos');
    }
}
