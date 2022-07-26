<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameIdgruposIdgrupoFieldLineaCadTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('linea_cad', function (Blueprint $table) {
            $table->dropColumn('idGrupos');
            $table->integer('idGrupo')->unsigned();
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
            $table->integer('idGrupos')->unsigned();
            $table->dropColumn('idGrupo');
        });
    }
}
