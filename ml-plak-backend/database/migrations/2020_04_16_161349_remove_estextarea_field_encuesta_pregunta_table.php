<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveEstextareaFieldEncuestaPreguntaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('encuesta_pregunta', function (Blueprint $table) {
			$table->dropColumn('esTextarea');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('encuesta_pregunta', function (Blueprint $table) {
            $table->boolean('esTextarea')->default(1);
        });
    }
}
