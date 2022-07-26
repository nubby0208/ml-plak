<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePdfsPresupuestoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pdfs_presupuesto', function (Blueprint $table) {
            $table->increments('id');
            $table->string('token', 255);
            $table->string('pdf', 255);
            $table->string('name', 255);
            $table->integer('remote');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pdfs_presupuesto');
    }
}
