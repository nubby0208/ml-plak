<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClientPresentationTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('client_presentation_templates', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->text('fields');
            $table->text('inputsFields');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('client_presentation_views', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->string('name');
            $table->text('fieldsValues');

            $table->timestamps();
            $table->softDeletes();

            $table->integer('template_id')->unsigned();
            $table->foreign('template_id', 'client_presentation_templates_fk')
                ->references('id')->on('client_presentation_templates');
        });


    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('client_presentation_views');
        Schema::dropIfExists('client_presentation_templates');
    }
}
