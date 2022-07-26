<?php

use Illuminate\Database\Seeder;

class TiposAsistenciasTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
			\DB::table('tipos_asistencias')->insert([
				['tipo' => 'Ingreso'],
				['tipo' => 'Salida'],
				['tipo' => 'Salida a sitio'],
				['tipo' => 'Regreso de sitio'],
				['tipo' => 'Ingreso después de tarea'],
				['tipo' => 'Ingreso a Horas Extras'],
			]);
    }
}
