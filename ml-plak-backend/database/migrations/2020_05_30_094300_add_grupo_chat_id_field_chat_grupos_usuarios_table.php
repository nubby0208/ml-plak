<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddGrupoChatIdFieldChatGruposUsuariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('chat_grupos_usuarios', function (Blueprint $table) {
            $table->integer('chat_grupo_id')->unsigned()->after('usuario_id');

            $table->foreign('chat_grupo_id')->on('chat_grupos')->references('id')
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
        Schema::table('chat_grupos_usuarios', function (Blueprint $table) {
            $table->dropForeign('chat_grupo_id');
            $table->dropColumn('chat_grupo_id');
        });
    }
}
