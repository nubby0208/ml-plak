<?php

use Illuminate\Database\Seeder;

class MaterialesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
			\DB::table('materiales')->insert([
				['material' => 'Blanco MDF'],
				['material' => 'Gris Grafito MDF'],
				['material' => 'Rojo MDF'],
				['material' => 'Negro MDF'],
				['material' => 'Aluminio MDF'],
				['material' => 'Gris Humo MDF'],
				['material' => 'Ceniza MDF'],
				['material' => 'Arcilla MDF'],
				['material' => 'Almendra MDF'],
				['material' => 'Wengue MDF'],
				['material' => 'Roble Moro MDF'],
				['material' => 'Roble Ingles MDF'],
				['material' => 'Nogal Brianza MDF'],
				['material' => 'Teca MDF'],
				['material' => 'Guindo MDF'],
				['material' => 'Cedro MDF'],
				['material' => 'Haya MDF'],
				['material' => 'Cerejeira MDF'],
				['material' => 'Concreto Metropolitan Mat MDF'],
				['material' => 'Nebraska Mat MDF'],
				['material' => 'Tweed Mat MDF'],
				['material' => 'Lino Mat MDF'],
				['material' => 'Enigma Esc MDF'],
				['material' => 'Teca Limo Esc MDF'],
				['material' => 'Roble Natural Esc MDF'],
				['material' => 'Roble Ameriano Ench Esc MDF'],
				['material' => 'Nogal Habano Esc MDF'],
				['material' => 'Wengue Ench Esc MDF'],
				['material' => 'Fresno Abedul Esc MDF'],
				['material' => 'Roble Blanco Ench Es MDF'],
				['material' => 'Fresno Negro Esc MDF'],
				['material' => 'Mango Laca MDF'],
				['material' => 'Coñac Laca MDF'],
				['material' => 'Esmeralda Laca MDF'],
				['material' => 'Vison Laca MDF'],
				['material' => 'Verde Oliva Laca MDF'],
				['material' => 'Blanco Laca MDF'],
			]);
    }
}
