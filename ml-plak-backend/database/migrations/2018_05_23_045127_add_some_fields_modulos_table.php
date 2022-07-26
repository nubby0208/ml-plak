<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSomeFieldsModulosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('modulos', function (Blueprint $table) {
					$table->boolean('is_cajon')->default(0);
					$table->integer('modulo_id')->unsigned()->nullable();

					$table->foreign('modulo_id')->references('id')->on('modulos')
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
        Schema::table('modulos', function (Blueprint $table) {
            //
        });
    }
}
