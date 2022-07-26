<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePedidosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->increments('id');
            $table->string('producto');
            $table->string('cliente')->nullable();
            $table->integer('cantidad')->nullable();
            $table->string('comentario')->nullable();
            $table->string('resumen')->nullable();
            $table->string('imagen')->nullable();
            $table->string('usuario');
            $table->integer('proveedor_id');
            $table->integer('estado')->default(0)->comment('0: para pedir,1:pedido,2:En deposito,3: Disponible');
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
        Schema::dropIfExists('pedidos');
    }
}
