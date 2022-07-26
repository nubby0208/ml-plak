<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsuarioEstadosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('usuario_estados', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('usuario_id')->unsigned();
            $table->datetime('fecha_creacion');
            $table->datetime('fecha_expiracion');
            $table->string('mensaje');
            $table->integer('tipo_asistencia_id')->unsigned();

            $table->foreign('usuario_id')->references('id')->on('usuarios')
				->onUpdate('cascade')->onDelete('no action');
            $table->foreign('tipo_asistencia_id')->references('id')->on('tipos_asistencias')
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
        Schema::dropIfExists('usuario_estados');
    }
}
