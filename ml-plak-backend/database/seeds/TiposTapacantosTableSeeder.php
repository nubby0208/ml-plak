<?php

use Illuminate\Database\Seeder;

class TiposTapacantosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
			\DB::table('tipos_tapacantos')->insert([
				['tipo' => 'Melamina'],
				['tipo' => 'Perfil Liviano'],
				['tipo' => 'Perfil Pesado'],
			]);
    }
}
