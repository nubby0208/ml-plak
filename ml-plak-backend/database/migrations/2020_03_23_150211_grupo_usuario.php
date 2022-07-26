<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class GrupoUsuario extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
          Schema::create('grupo_usuario', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('usuario_id')->unsigned()->nullable();
            $table->integer('grupo_id')->unsigned()->nullable();
			$table->boolean('activo')->default(1);
            $table->timestamps();
            $table->foreign('grupo_id')->references('id')->on('grupos');
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
        //
    }
}
