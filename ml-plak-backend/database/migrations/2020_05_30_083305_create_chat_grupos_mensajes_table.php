<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChatGruposMensajesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chat_grupos_mensajes', function (Blueprint $table) {
            $table->increments('id');
            $table->string('mensaje');
            $table->string('tipo');
            $table->integer('usuario_id')->unsigned();
            $table->integer('chat_grupo_id')->unsigned();
            $table->integer('aprobado_usuario_id')->unsigned()->nullable();
            $table->timestamps();

            $table->foreign('usuario_id')->on('usuarios')->references('id')
                ->onUpdate('cascade')
                ->onDelete('no action');

            $table->foreign('chat_grupo_id')->on('chat_grupos')->references('id')
                ->onUpdate('cascade')
                ->onDelete('no action');

            $table->foreign('aprobado_usuario_id')->on('usuarios')->references('id')
                ->onUpdate('cascade')
                ->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('chat_grupo_mensajes');
    }
}
