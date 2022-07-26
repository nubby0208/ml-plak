<?php

use Illuminate\Database\Seeder;

class EstadosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
			\DB::table('estados')->insert([
				['estado' => 'Falta'],
				['estado' => 'Suspendido'],
				['estado' => 'OK'],
				['estado' => 'Pedido'],
				['estado' => 'En proceso'],
				['estado' => 'Stock'],
				['estado' => 'Tira'],
				['estado' => 'Optimizar'],
			]);
    }
}
