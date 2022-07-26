<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Create3dPiezasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('3d_piezas', function (Blueprint $table) {
            $table->increments('id');
						$table->string('pieza')->nullable();
						$table->integer('cantidad')->nullable();
						$table->integer('posicion_x')->nullable();
						$table->integer('posicion_y')->nullable();
						$table->integer('posicion_z')->nullable();
						$table->integer('rotacion_x')->nullable();
						$table->integer('rotacion_y')->nullable();
						$table->integer('rotacion_z')->nullable();
						$table->integer('lveta')->nullable();
						$table->integer('aveta')->nullable();
						$table->integer('espesor')->nullable();
						$table->integer('orientacion')->nullable();
            $table->timestamps();
						$table->integer('modulo_id')->unsigned()->nullable();
						$table->string('material_name')->nullable();
						$table->string('color')->default('#FFFFFF');
						$table->integer('material_id')->unsigned()->nullable();
						$table->integer('estado_id')->unsigned()->nullable();
						$table->integer('prearmado_estado_id')->unsigned()->nullable();
						$table->string('cliente_name')->nullable();
						$table->string('proyecto_name')->nullable();
						$table->string('username')->nullable();
						$table->boolean('visible')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('3d_piezas');
    }
}
