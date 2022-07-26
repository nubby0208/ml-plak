<?php

use Illuminate\Database\Seeder;

class AsistenciaCausasTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
			\DB::table('asistencia_causas')->insert([
				['causa' => 'Personal'],
				['causa' => 'Empresa'],
			]);
    }
}
