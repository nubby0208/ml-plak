<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClientPresentationDataStoragesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('client_presentation_data_storages', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->string('state');
            $table->text('data');
            $table->boolean('read')->default(false);

            $table->timestamps();
            $table->softDeletes();

            $table->uuid('sequence_id');
            $table->foreign('sequence_id', 'client_presentation_sequences_fk')
                ->references('id')->on('client_presentation_sequences');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('client_presentation_data_storages');
    }
}
