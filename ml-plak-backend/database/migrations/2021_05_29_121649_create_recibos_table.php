<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRecibosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('recibos', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedBigInteger('usuario_id');
            $table->integer('mes');
            $table->integer('anio');
            $table->integer('diasLaborables')->nullable();
            $table->integer('diasLaborados')->nullable();
            $table->integer('faltasInjustificadas')->nullable();
            $table->integer('faltasJustificadas')->nullable();
            $table->integer('feriados')->nullable();

            $table->decimal('total_horas', 8, 2)->default(0);
            $table->decimal('total_horas_extra', 8, 2)->default(0);
            $table->decimal('total_horas_sabado_ingles', 8, 2)->default(0);

            $table->decimal('presentismo', 8, 2)->default(0);
            $table->decimal('valor_hora', 8, 2)->default(0);
            $table->decimal('valor_hora_extra', 8, 2)->default(0);
            $table->decimal('valor_hora_sabado_ingles', 8, 2)->default(0);
            $table->decimal('valor_hora_total', 8, 2)->default(0);
            $table->decimal('valor_plus_encargado', 8, 2)->default(0);
            $table->decimal('valor_plus_mes', 8, 2)->default(0);
            $table->decimal('total', 8, 2)->default(0);
            $table->integer('status')->default(1);
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
        Schema::dropIfExists('recibos');
    }
}
