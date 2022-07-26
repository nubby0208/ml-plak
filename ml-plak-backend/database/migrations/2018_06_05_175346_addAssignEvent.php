<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAssignEvent extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('events', function (Blueprint $table) {
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
        // Schema::table('events', function (Blueprint $table) {
        //     $table->dropColumn('assignTask')->nullable()->unsigned();
        //     $table->dropForeign(['assignTask']);
        // });
    }
}
