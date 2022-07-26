<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCalcosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('calcos', function (Blueprint $table) {
            $table->increments('id');
						$table->longText('calco');
						$table->integer('pieza_id')->unsigned();
            $table->timestamps();

						$table->foreign('pieza_id')->references('id')->on('piezas')
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
        Schema::dropIfExists('calcos');
    }
}
