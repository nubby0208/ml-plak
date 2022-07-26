<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateConfiguracionesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('configuraciones', function (Blueprint $table) {
            $table->increments('id');
						$table->string('nombre');
						$table->integer('tipo_configuracion_id')->unsigned();
						$table->longText('elementos');
            $table->timestamps();

						$table->foreign('tipo_configuracion_id')->references('id')->on('tipos_configuraciones')
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
        Schema::dropIfExists('configuraciones');
    }
}
