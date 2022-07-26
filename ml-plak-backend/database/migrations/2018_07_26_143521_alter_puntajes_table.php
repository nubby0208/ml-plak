<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterPuntajesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('puntajes', function (Blueprint $table) {
            $table->integer('pieza_id')->unsigned()->nullable()->after('puntos');
            $table->integer('usuario_id')->nullable()->change();
            $table->integer('puntos')->nullable()->change();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('puntajes', function (Blueprint $table) {
            $table->dropColumn('pieza_id');
            $table->integer('puntos')->change();
            $table->integer('usuario_id')->change();
        });
    }
}
