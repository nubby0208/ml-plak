<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTomarTareaFieldsv2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('piezas', function (Blueprint $table) {
            $table->integer('assignTask')->nullable()->unsigned();
            $table->foreign('assignTask')->references('id')->on('usuarios')
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
        Schema::table('piezas', function (Blueprint $table) {
            $table->dropForeign(['assignTask']);
            $table->dropColumn('assignTask');
        });
    }
}
