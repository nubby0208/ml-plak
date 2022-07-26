<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMkGrupomensajeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mk_grupomensaje', function (Blueprint $table) {
            $table->increments('grme_nid');
						$table->integer('grup_nid')->unsigned();
						$table->integer('user_nid_envidox')->unsigned();
						$table->string('grme_vmensaje')->nullable();
						$table->datetime('grme_dfechaenvio')->nullable();

						$table->foreign('grup_nid')->references('grup_nid')->on('mk_grupo')
							->onUpdate('cascade')->onDelete('no action');
						$table->foreign('user_nid_envidox')->references('id')->on('usuarios')
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
        Schema::dropIfExists('mk_grupomensaje');
    }
}
