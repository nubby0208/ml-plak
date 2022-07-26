<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFieldsProyectosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('proyectos', function (Blueprint $table) {
			$table->longText('grupos')->nullable()->after('assistants');
			$table->tinyInteger('finalizado')->default(0)->after('grupos');
			$table->text('observaciones')->nullable()->after('finalizado');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('proyectos', function (Blueprint $table) {
			$table->dropColumn(['observaciones', 'finalizado', 'grupos']);
        });
    }
}
