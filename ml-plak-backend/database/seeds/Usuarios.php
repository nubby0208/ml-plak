<?php

use App\Models\Usuario as UserModel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class Usuarios extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = UserModel::find(1);
        if($user){
            $user->usuario = "admin";
            $user->password = Hash::make('admin');
            $user->save();
        }
    }
}
