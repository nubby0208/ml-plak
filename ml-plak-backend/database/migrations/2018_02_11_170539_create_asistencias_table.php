<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAsistenciasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('asistencias', function (Blueprint $table) {
            $table->increments('id');
						$table->integer('usuario_id')->unsigned();
						$table->datetime('fecha');
						$table->string('observacion')->nullable();
						$table->enum('tipo', ['in', 'out'])->comment('[in, out]');
						$table->integer('horario_id')->unsigned();
            $table->timestamps();

						$table->foreign('usuario_id')->references('id')->on('usuarios')
							->onUpdate('cascade')->onDelete('no action');

						$table->foreign('horario_id')->references('id')->on('horarios')
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
        Schema::dropIfExists('asistencias');
    }
}
