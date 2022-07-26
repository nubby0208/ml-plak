<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMkTareasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mk_tareas', function (Blueprint $table) {
            $table->increments('tar_nid');
						$table->string('tar_vmensaje', 150)->nullable();
						$table->boolean('tar_nsts')->nullable();
						$table->datetime('tar_dfechacreacion')->nullable();
						$table->integer('user_nid')->unsigned()->nullable();

						$table->foreign('user_nid')->references('id')->on('usuarios')
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
        Schema::dropIfExists('mk_tareas');
    }
}
