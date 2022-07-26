<?php

use Illuminate\Database\Seeder;

class TiposSalidasTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
			\DB::table('tipos_salidas')->insert([
				['tipo' => 'Instalación'],
				['tipo' => 'Relevo/medición'],
				['tipo' => 'Servicio técnico'],
				['tipo' => 'Compras'],
			]);
    }
}
