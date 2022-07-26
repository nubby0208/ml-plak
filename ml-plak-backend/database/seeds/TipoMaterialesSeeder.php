<?php

use Illuminate\Database\Seeder;

class TipoMaterialesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
      \DB::table('tipo_materiales')->insert([
				[
					'id'          => 1,
					'tipo'        => 'Placas',
					'caracter'    => 'P',
					'descripcion' => 'Los Materiales Como Placas y Fondos',
					'created_at'  => NULL,
					'updated_at'  => NULL
				],
				[
					'id'          => 2,
					'tipo'        => 'Tapacantos',
					'caracter'    => 'T',
					'descripcion' => 'Los Materiales Para los Tapacantos',
					'created_at'  => NULL,
					'updated_at'  => NULL
				],
				[
					'id'          => 3,
					'tipo'        => 'Herrajes',
					'caracter'    => 'H',
					'descripcion' => 'Los Materiales Para los Herrajes',
					'created_at'  => NULL,
					'updated_at'  => NULL
				],
				[
					'id'          => 4,
					'tipo'        => 'Metales y Kits',
					'caracter'    => 'M',
					'descripcion' => 'Los Materiales Para los Metales',
					'created_at'  => NULL,
					'updated_at'  => NULL
				]
			]);
    }
}
