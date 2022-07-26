<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMkGrupoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mk_grupo', function (Blueprint $table) {
            $table->increments('grup_nid');
						$table->string('grup_vtema');
						$table->datetime('grup_dfechacreacion')
							->default(\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
							->nullable();
						$table->integer('user_nid')->unsigned();
						$table->integer('grup_nsts')->nullable();

						$table->foreign('user_nid')->references('id')->on('usuarios')
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
        Schema::dropIfExists('mk_grupo');
    }
}
