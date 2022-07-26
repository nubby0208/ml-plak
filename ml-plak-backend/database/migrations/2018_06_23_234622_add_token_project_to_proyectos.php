<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTokenProjectToProyectos extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
   
    Schema::table('proyectos', function (Blueprint $table) {
      $table->string('token_project', 50)->unique()->nullable();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::table('proyectos', function (Blueprint $table) {
      $table->dropColumn('token_project');
    });
  }
}
