<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateMaterialesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('materiales', function (Blueprint $table) {
            $table->integer('espesor')->default(0);
            $table->string('link_textura1')->nullable();
            $table->string('link_textura2')->nullable();
            $table->decimal('precio_mt2')->default(0);
            $table->decimal('precio_placa')->default(0);
            $table->boolean('veta')->default(false);
            $table->integer('ancho_veta')->default(0);
            $table->integer('largo_veta')->default(0);
            $table->string('extra')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('materiales', function (Blueprint $table) {
            //
        });
    }
}
