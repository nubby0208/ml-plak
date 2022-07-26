<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UsersTableSeeder::class);
        $this->call(AsistenciaCausasTableSeeder::class);
        $this->call(HorariosTableSeeder::class);
        $this->call(TiposSalidasTableSeeder::class);
        $this->call(TiposAsistenciasTableSeeder::class);
        $this->call(MaterialesTableSeeder::class);
        $this->call(TiposTapacantosTableSeeder::class);
        $this->call(EstadosTableSeeder::class);
        $this->call(PosicionesTapacantosTableSeeder::class);
        $this->call(RolesTableSeeder::class);
        $this->call(UsuarioTableSeeder::class);
    }
}
