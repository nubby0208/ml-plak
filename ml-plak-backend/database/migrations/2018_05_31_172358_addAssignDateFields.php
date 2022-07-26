<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAssignDateFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('proyectos', function (Blueprint $table) {
            $table->datetime('assignPiezasDate')->nullable();
            $table->datetime('assignPrearmadoDate')->nullable();
            $table->datetime('assignCajonesDate')->nullable();
            $table->datetime('assignTapacantosDate')->nullable();
            $table->datetime('assignModulosDate')->nullable();
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
            $table->dropColumn('assignPiezasDate');
            $table->dropColumn('assignPrearmadoDate');
            $table->dropColumn('assignCajonesDate');
            $table->dropColumn('assignTapacantosDate');
            $table->dropColumn('assignModulosDate');
        });
    }
}
