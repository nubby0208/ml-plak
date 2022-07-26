<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ModifyLineaCadTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('linea_cad', function (Blueprint $table) {
            $table->dropColumn('id_Dibujo');
            $table->integer('idGrupos')->unsigned();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('linea_cad', function (Blueprint $table) {
            $table->integer('id_Dibujo')->unsigned();
            $table->dropColumn('idGrupos');
        });
    }
}
