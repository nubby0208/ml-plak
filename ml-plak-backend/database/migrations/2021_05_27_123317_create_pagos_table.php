<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePagosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pagos', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedBigInteger('recibo_id')->nullable();
            $table->unsignedBigInteger('usuario_id');
            $table->integer('mes')->nullable();
            $table->integer('anio')->nullable();
            $table->decimal('monto', 8, 2);
            $table->string('medio_pago')->nullable();
            $table->string('comentario')->nullable();
            $table->integer('status')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pagos');
    }
}
