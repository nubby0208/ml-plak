<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLineaCadTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('linea_cad', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('id_Dibujo')->unsigned();
            $table->string('color')->nullable();
            $table->string('tamano')->nullable();
            $table->string('grueso')->nullable();
            $table->double('x1')->nullable();
            $table->double('y1')->nullable();
            $table->double('x2')->nullable();
            $table->double('y2')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('linea_cad');
    }
}
