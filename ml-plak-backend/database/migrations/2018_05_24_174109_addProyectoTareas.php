<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddProyectoTareas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('piezas', function (Blueprint $table) {
            $table->dropForeign(['assignTask']);
            $table->dropColumn('assignTask');
        });

        Schema::table('proyectos', function (Blueprint $table) {
            $table->integer('assignPiezas')->nullable()->unsigned();
            $table->foreign('assignPiezas')->references('id')->on('usuarios')
                ->onUpdate('cascade')->onDelete('no action');
        });

        Schema::table('proyectos', function (Blueprint $table) {
            $table->integer('assignPrearmado')->nullable()->unsigned();
            $table->foreign('assignPrearmado')->references('id')->on('usuarios')
                ->onUpdate('cascade')->onDelete('no action');
        });

        Schema::table('proyectos', function (Blueprint $table) {
            $table->integer('assignCajones')->nullable()->unsigned();
            $table->foreign('assignCajones')->references('id')->on('usuarios')
                ->onUpdate('cascade')->onDelete('no action');
        });

        Schema::table('proyectos', function (Blueprint $table) {
            $table->integer('assignTapacantos')->nullable()->unsigned();
            $table->foreign('assignTapacantos')->references('id')->on('usuarios')
                ->onUpdate('cascade')->onDelete('no action');
        });

        Schema::table('proyectos', function (Blueprint $table) {
            $table->integer('assignModulos')->nullable()->unsigned();
            $table->foreign('assignModulos')->references('id')->on('usuarios')
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
        //
    }
}
