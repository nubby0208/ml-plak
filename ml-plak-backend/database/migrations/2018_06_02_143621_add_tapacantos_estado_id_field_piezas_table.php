<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTapacantosEstadoIdFieldPiezasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('piezas', function (Blueprint $table) {
					$table->integer('tapacantos_estado_id')->unsigned()->default(1);

					$table->foreign('tapacantos_estado_id')->references('id')->on('estados')
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
        Schema::table('piezas', function (Blueprint $table) {
					$table->dropForeign(['tapacantos_estado_id']);
					$table->dropColumn(['tapacantos_estado_id']);
        });
    }
}
