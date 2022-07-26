<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePresupuestoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('presupuesto', function (Blueprint $table) {
            $table->increments('id');
            $table->string('token', 255);
            $table->longText('results');
            $table->tinyInteger('estado');
            $table->longText('imagen1')->nullable();
            $table->longText('imagen2')->nullable();
            $table->longText('imagen3')->nullable();
            $table->longText('imagen4')->nullable();
            $table->longText('imagen5')->nullable();
            $table->date('fecha')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->string('usuario', 255);
            $table->integer('project_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('presupuesto');
    }
}
