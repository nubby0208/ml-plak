<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterImagenesPresupuestoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('imagenes_presupuesto', function (Blueprint $table) {
            $table->string('name', 255);
            $table->integer('remote');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('imagenes_presupuesto', function (Blueprint $table) {
            $table->dropColumn('name');
            $table->dropColumn('remote');
        });
       
    }
}
