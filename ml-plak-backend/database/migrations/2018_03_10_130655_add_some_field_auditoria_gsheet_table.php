<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSomeFieldAuditoriaGsheetTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('auditoria_gsheet', function (Blueprint $table) {
					$table->string('pieza');
					$table->string('valor_anterior');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('auditoria_gsheet', function (Blueprint $table) {
					$table->dropColumn('pieza');
					$table->dropColumn('valor_anterior');
        });
    }
}
