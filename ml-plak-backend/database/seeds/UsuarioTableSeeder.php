<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsuarioTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
			\DB::table('usuarios')->insert([
				[
					'correo_google'   => 'luis1986usm@gmail.com',
					'activo'          => 1,
					'usuario'         => 'luisr',
					'password'        => Hash::make('admin'),
					'nombre_completo' => 'Luis Romero',
					'rol_id' => 1
				]
			]);
    }
}
