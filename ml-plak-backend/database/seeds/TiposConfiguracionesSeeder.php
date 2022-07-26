<?php

use Illuminate\Database\Seeder;
use App\Models\TipoConfiguracion;

class TiposConfiguracionesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
			TipoConfiguracion::create(['tipo' => 'config']);
    }
}
