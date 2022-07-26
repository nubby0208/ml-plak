<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMkActivoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mk_activo', function (Blueprint $table) {
            $table->increments('act_nid');
						$table->datetime('act_dfechaultima')->nullable();
						$table->integer('user_id')->unsigned()->nullable();
						$table->integer('grupo_id')->unsigned()->nullable();

						$table->foreign('user_id')->references('id')->on('usuarios')
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
        Schema::dropIfExists('mk_activo');
    }
}
