<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSomeFieldsEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('events', function (Blueprint $table) {
			$table->string('nombre', 100)->after('direccion');
			$table->string('telefono', 15)->after('nombre');
			$table->string('latitud', 20)->after('grupos');
			$table->string('longitud', 20)->after('latitud');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('events', function (Blueprint $table) {
			$table->dropColumn(['nombre', 'telefono', 'latitud', 'longitud']);
        });
    }
}
