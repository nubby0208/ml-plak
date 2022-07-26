<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddStatesToClientPresentationDataStoragesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('client_presentation_data_storages', function (Blueprint $table) {
            $table->string('status')->default('nuevo');
            $table->text('attach')->nullable();
            $table->text('info')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('client_presentation_data_storages', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->dropColumn('attach');
            $table->dropColumn('info');
        });
    }
}
