<?php

use Illuminate\Database\Seeder;

class HorariosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
			\DB::table('horarios')->insert([
				'hora_inicio' => '08:00:00',
				'hora_fin'    => '17:00:00',
				'activo'      => 1
			]);
    }
}
