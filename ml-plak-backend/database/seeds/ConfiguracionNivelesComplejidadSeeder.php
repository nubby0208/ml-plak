<?php

use Illuminate\Database\Seeder;

class ConfiguracionNivelesComplejidadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('niveles_complejidad')->insert(
			['etapa' => 'corte',
			 'tipo' => 'complejidad',
			 'nivel' => 'alto',
			 'min' => '70001',
			 'max' => '1000000',
			 'puntos' => 6
			]
		);
        \DB::table('niveles_complejidad')->insert(
            ['etapa' => 'corte',
             'tipo' => 'complejidad',
             'nivel' => 'alto',
             'min' => '10001',
             'max' => '70000',
             'puntos' => 3
            ]
        );
        \DB::table('niveles_complejidad')->insert(
            ['etapa' => 'corte',
             'tipo' => 'complejidad',
             'nivel' => 'baja',
             'min' => '0',
             'max' => '10000',
             'puntos' => 1
            ]
        );
        \DB::table('niveles_complejidad')->insert([
            ['etapa' => 'tapacantos',
             'tipo' => 'complejidad',
             'nivel' => 'alta',
             'min' => '70001',
             'max' => '1000000',
             'puntos' => 6
            ],[
             'etapa' => 'tapacantos',
             'tipo' => 'complejidad',
             'nivel' => 'media',
             'min' => '10001',
             'max' => '70000',
             'puntos' => 3
            ],[
             'etapa' => 'tapacantos',
             'tipo' => 'complejidad',
             'nivel' => 'baja',
             'min' => '0',
             'max' => '10000',
             'puntos' => 1
            ]
        ]);

        \DB::table('niveles_complejidad')->insert([
            ['etapa' => 'prearmado',
             'tipo' => 'complejidad',
             'nivel' => 'alta',
             'min' => '70001',
             'max' => '1000000',
             'puntos' => 6
            ],[
             'etapa' => 'prearmado',
             'tipo' => 'complejidad',
             'nivel' => 'media',
             'min' => '10001',
             'max' => '70000',
             'puntos' => 3
            ],[
             'etapa' => 'prearmado',
             'tipo' => 'complejidad',
             'nivel' => 'baja',
             'min' => '0',
             'max' => '10000',
             'puntos' => 1
            ]
        ]);

        \DB::table('niveles_complejidad')->insert([
            'etapa' => 'Armado de cajones',
            'tipo' => 'cajones',
            'puntos' => 5
        ]);

        \DB::table('niveles_complejidad')->insert([
            ['etapa' => 'Armado de modulos',
             'tipo' => 'modulos',
             'nivel' => 'Si',
             'puntos' => 1
            ],[
             'etapa' => 'Armado de modulos',
             'tipo' => 'modulos',
             'nivel' => 'No',
             'puntos' => 10
            ],[
             'etapa' => 'Armado de modulos',
             'tipo' => 'modulos',
             'nivel' => 'Evaluar',
             'puntos' => 10
            ]
        ]);
        
    }
}
