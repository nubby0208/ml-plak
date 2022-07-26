<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateUsuariosHorariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('usuarios_horarios', function (Blueprint $table) {
            $table->dropColumn('hora_inicio');
            $table->dropColumn('hora_fin');
            $table->boolean('habilitado_lunes')->default(true);
            $table->time('hora_inicio_lunes');
            $table->time('hora_fin_lunes');
            $table->boolean('habilitado_martes')->default(true);
            $table->time('hora_inicio_martes');
            $table->time('hora_fin_martes');
            $table->boolean('habilitado_miercoles')->default(true);
            $table->time('hora_inicio_miercoles');
            $table->time('hora_fin_miercoles');
            $table->boolean('habilitado_jueves')->default(true);
            $table->time('hora_inicio_jueves');
            $table->time('hora_fin_jueves');
            $table->boolean('habilitado_viernes')->default(true);
            $table->time('hora_inicio_viernes');
            $table->time('hora_fin_viernes');
            $table->boolean('habilitado_sabado')->default(true);
            $table->time('hora_inicio_sabado');
            $table->time('hora_fin_sabado');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('usuarios_horarios', function (Blueprint $table) {
            //
        });
    }
}
