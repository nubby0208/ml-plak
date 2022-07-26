<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsuariosHorarioTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('usuarios_horarios', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('usuario_id')->unsigned()->nullable();
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->boolean('is_default')->default(false);

            $table->foreign('usuario_id')->references('id')->on('usuarios')
                ->onUpdate('cascade')->onDelete('cascade');
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
        Schema::dropIfExists('usuarios_horarios');
    }
}
