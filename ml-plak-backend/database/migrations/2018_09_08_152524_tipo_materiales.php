<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TipoMateriales extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tipo_materiales', function (Blueprint $table) {
            $table->increments('id');
            $table->string('tipo');//ejemplo placa, herraje, tapacantos
            $table->string('caracter',1)->unique();//ejemplo placa, herraje, tapacantos
            $table->string('descripcion')->nullable(); //opcional
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
        Schema::dropIfExists('tipo_materiales');
    }
}
