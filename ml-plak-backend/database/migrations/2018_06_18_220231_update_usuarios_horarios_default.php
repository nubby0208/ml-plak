<?php

use App\Models\UsuariosHorario;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateUsuariosHorariosDefault extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $horario = UsuariosHorario::where('is_default',true)->first();
	if ($horario) {
		$horario->hora_inicio_lunes = '9:00';
		$horario->hora_fin_lunes = '17:00';
		$horario->habilitado_lunes = true;
		$horario->hora_inicio_martes = '9:00';
		$horario->hora_fin_martes = '17:00';
		$horario->habilitado_martes = true;
		$horario->hora_inicio_miercoles = '9:00';
		$horario->hora_fin_miercoles = '17:00';
		$horario->habilitado_miercoles = true;
		$horario->hora_inicio_jueves = '9:00';
		$horario->hora_fin_jueves = '17:00';
		$horario->habilitado_jueves = true;
		$horario->hora_inicio_viernes = '9:00';
		$horario->hora_fin_viernes = '17:00';
		$horario->habilitado_viernes = true;
		$horario->hora_inicio_sabado = '9:00';
		$horario->hora_fin_sabado = '17:00';
		$horario->habilitado_sabado = true;
		$horario->save();

	}
	$horariosUsuarios = UsuariosHorario::where('is_default',false)->get();

        foreach ($horariosUsuarios as $horario) {
            $horario->delete();
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
