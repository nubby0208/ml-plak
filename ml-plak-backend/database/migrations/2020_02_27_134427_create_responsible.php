<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateResponsible extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('project_responsible', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('proyecto_id')->unsigned()->unique();
            $table->integer('usuario_id')->unsigned();
            $table->timestamps();

            $table->foreign('proyecto_id')->references('id')->on('proyectos');
            $table->foreign('usuario_id')->references('id')->on('usuarios');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('project_responsible');
    }
}
