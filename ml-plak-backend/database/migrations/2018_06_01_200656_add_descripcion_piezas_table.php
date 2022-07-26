<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDescripcionPiezasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('piezas', function (Blueprint $table) {
            $table->text('comentario')->nullable();
        });

        Schema::table('modulos', function (Blueprint $table) {
            $table->text('comentario')->nullable();
            $table->text('descripcion')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('piezas', function (Blueprint $table) {
            //
        });
    }
}
