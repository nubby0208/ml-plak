<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGruposCadTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('grupos_cad', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('idDibujo')->unsigned();
            $table->string('nombre_grupo');
            $table->string('color');
            $table->string('grosor');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('grupos_cad');
    }
}
