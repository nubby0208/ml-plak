<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMkChatmensajeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mk_chatmensaje', function (Blueprint $table) {
            $table->increments('chtm_nid');
						$table->integer('user_enviox_nid')->unsigned();
						$table->string('chtm_mensaje');
						$table->string('chtm_tipo')->nullable();
						$table->integer('user_nid_destinatario')->unsigned()->nullable();
						$table->datetime('chtm_dfechacrea')->nullable();
						$table->boolean('chtm_npedidosts')->default(0);
						$table->boolean('chtm_nvisto')->default(0);

						$table->foreign('user_nid_destinatario')->references('id')->on('usuarios')
							->onUpdate('cascade')->onDelete('no action');
						$table->foreign('user_enviox_nid')->references('id')->on('usuarios')
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
        Schema::dropIfExists('mk_chatmensaje');
    }
}
