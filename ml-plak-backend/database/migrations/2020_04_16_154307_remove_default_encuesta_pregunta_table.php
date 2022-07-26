<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveDefaultEncuestaPreguntaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		DB::statement('ALTER TABLE encuesta_pregunta ALTER COLUMN esEstrella DROP DEFAULT');
		DB::statement('ALTER TABLE encuesta_pregunta ALTER COLUMN esPregunta DROP DEFAULT');
		DB::statement('ALTER TABLE encuesta_pregunta ALTER COLUMN esTexto DROP DEFAULT');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		DB::statement('ALTER TABLE encuesta_pregunta ALTER COLUMN esEstrella SET DEFAULT 1');
		DB::statement('ALTER TABLE encuesta_pregunta ALTER COLUMN esPregunta SET DEFAULT 1');
		DB::statement('ALTER TABLE encuesta_pregunta ALTER COLUMN esTexto SET DEFAULT 1');
    }
}
