<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateConfiguracionMensualsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('configuraciones_mensuales', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('anio');
            $table->integer('mes');
            $table->integer('usuario_id')->unsigned();
            $table->decimal('valor_x_hora', 8, 2)->default(0);
            $table->decimal('hora_extra', 8, 2)->default(0);
            $table->decimal('sabado_ingles', 8, 2)->default(0);
            $table->decimal('valor_plus_mes', 8, 2)->default(0);
            $table->decimal('valor_plus', 8, 2)->default(0);
            $table->decimal('descuento', 8, 2)->default(0);
            $table->decimal('presentismo', 8, 2)->default(0);
            $table->integer('forzar_presentismo')->default(0);
            $table->decimal('forzar_presentismo_porcentaje', 8, 2)->default(0);
            $table->integer('sistema_horario')->default(0);
            $table->decimal('antiguedad', 8, 2)->default(0);
            $table->integer('status')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('configuraciones_mensuales');
    }
}
