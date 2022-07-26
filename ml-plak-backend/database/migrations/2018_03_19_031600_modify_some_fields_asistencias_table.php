<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ModifySomeFieldsAsistenciasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('asistencias', function (Blueprint $table) {
					$table->dropColumn('tipo');
					$table->integer('tipo_asistencia_id')->unsigned();
					$table->integer('tipo_salida_id')->unsigned()->nullable();

					$table->foreign('tipo_asistencia_id')->references('id')->on('tipos_asistencias')
						->onUpdate('cascade')->onDelete('no action');
					$table->foreign('tipo_salida_id')->references('id')->on('tipos_salidas')
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
						$table->dropForeign(['tipo_asistencia_id']);
						$table->dropForeign(['tipo_salida_id']);
						$table->dropColumn(['tipo_asistencia_id']);
						$table->dropColumn(['tipo_salida_id']);
						// $table->enum('tipo', ['in', 'out'])->comment('[in, out]');
        });
    }
}
