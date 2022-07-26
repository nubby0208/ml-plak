<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFieldsMateriales extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('materiales', function (Blueprint $table) {
            $table->string('nombre')->nullable();
            $table->decimal('alto')->default(0);
            $table->decimal('descuento_alto')->default(0);
            $table->decimal('descuento_ancho')->default(0);
            $table->integer('tipo_material_id')->unsigned()->nullable();
            $table->foreign('tipo_material_id')->references('id')->on('tipo_materiales')
            ->onDelete('no action')->onUpdate('cascade');


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
