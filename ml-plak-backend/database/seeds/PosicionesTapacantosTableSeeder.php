<?php

use Illuminate\Database\Seeder;

class PosicionesTapacantosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
			\DB::table('posiciones_tapacantos')->insert([
				['posicion' => 'Superior'],
				['posicion' => 'Inferior'],
				['posicion' => 'Derecho'],
				['posicion' => 'Izquierdo'],
			]);
    }
}
