<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAsistenciaCausaIdColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('asistencias', function (Blueprint $table) {
					$table->integer('asistencia_causa_id')->unsigned()->nullable();

					$table->foreign('asistencia_causa_id')->references('id')->on('asistencia_causas')
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
        Schema::table('asistencias', function (Blueprint $table) {
					$table->dropForeign(['asistencia_causa_id']);
					$table->dropColumn(['asistencia_causa_id']);
        });
    }
}
