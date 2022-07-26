<?php

use Illuminate\Database\Seeder;
use App\Models\ClientPresentationTemplate;
use App\Models\ClientPresentationSequence;

class ClientTemplatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->templatesSeed();
        $this->manualSequenceSeed();
    }

    protected function templatesSeed(){
        $templates = [
            [
                "id" => 1,
                "data" => [
                    "Name" => "Plantilla uno",
                    "fields" => [
                        "backGround" => [
                            "type" => ClientPresentationTemplate::TypeFile,
                            "value" => "images/templates/img1.jpg",
                            "templateUrl" => true,
                            "name" => "Imagen de fondo",
                        ],
                        "texto"=> [
                            "type" => ClientPresentationTemplate::TypeText,
                            "value" => "Hola! ,Espero estés muy bien! Me presento  soy ML, el Sistema que nos va a ayudar a  recopilar la información que necesitamos parapoder realizar tu presupuesto",
                            "name" => "Texto Principal",
                        ]
                    ],
                    "inputsFields" => [],
                ],
            ],
            [
                "id" => 2,
                "data" => [
                    "Name" => "Plantilla dos",
                    "fields" => [
                        "backGround" => [
                            "type" => ClientPresentationTemplate::TypeFile,
                            "value" => "images/templates/img1.jpg",
                            "templateUrl" => true,
                            "name" => "Imagen de fondo",
                        ],
                        "texto"=> [
                            "type" => ClientPresentationTemplate::TypeText,
                            "value" => "Le estamos agradecidos por solicitar nuestros servicios. Introduzca el motivo de su visita.",
                            "name" => "Texto Principal",
                        ],
                        "label"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "Motivo de su visita",
                            "name" => "Etiqueta del cuadro de texto",
                        ]
                    ],
                    "inputsFields" => [],
                ],
            ],
            [
                "id" => 3,
                "data" => [
                    "Name" => "Plantilla tres",
                    "fields" => [
                        "backGround" => [
                            "type" => ClientPresentationTemplate::TypeFile,
                            "value" => "images/templates/img1.jpg",
                            "templateUrl" => true,
                            "name" => "Imagen de fondo",
                        ],
                        "texto"=> [
                            "type" => ClientPresentationTemplate::TypeText,
                            "value" => "Adjunte los archivos que crea necesario para su pedido.",
                            "name" => "Texto Principal",
                        ],
                        "label"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "Adjunte los archivos.",
                            "name" => "Etiqueta del cuadro de texto",
                        ]
                    ],
                    "inputsFields" => [],
                ],
            ],
            [
                "id" => 4,
                "data" => [
                    "Name" => "Plantilla cuatro",
                    "fields" => [
                        "backGround" => [
                            "type" => ClientPresentationTemplate::TypeFile,
                            "value" => "images/templates/img1.jpg",
                            "templateUrl" => true,
                            "name" => "Imagen de fondo",
                        ],
                        "texto"=> [
                            "type" => ClientPresentationTemplate::TypeText,
                            "value" => "Adjunte los archivos que crea necesario para su pedido.",
                            "name" => "Texto Principal",
                        ],
                        "linkNumber"=> [
                            "type" => ClientPresentationTemplate::TypeNumberLinks,
                            "value" => "4",
                            "name" => "Cantidad de botones",
                        ],
                        "btn1"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "Comprar un producto",
                            "name" => "Etiqueta de ruta 1",
                        ],
                        "btn2"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "Reparar producto",
                            "name" => "Etiqueta de ruta 2",
                        ],
                        "btn3"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "Hacer una pregunta",
                            "name" => "Etiqueta de ruta 3",
                        ],
                        "btn4"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "Producto a la medida",
                            "name" => "Etiqueta de ruta 4",
                        ],
                    ],
                    "inputsFields" => [],
                ],
            ],
            [
                "id" => 5,
                "data" => [
                    "Name" => "Plantilla cinco",
                    "fields" => [
                        "backGround" => [
                            "type" => ClientPresentationTemplate::TypeFile,
                            "value" => "images/templates/img1.jpg",
                            "templateUrl" => true,
                            "name" => "Imagen de fondo",
                        ],
                        "texto"=> [
                            "type" => ClientPresentationTemplate::TypeText,
                            "value" => "Adjunte los archivos que crea necesario para su pedido.",
                            "name" => "Texto Principal",
                        ],
                        "label1"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "Nombre",
                            "name" => "Etiqueta 1",
                        ],
                        "help1"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "Introdusca su nombre completo",
                            "name" => "Texto de ayuda 1",
                        ],
                        "label2"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "Direción",
                            "name" => "Etiqueta 2",
                        ],
                        "help2"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "Introduca direción donde recide",
                            "name" => "Texto de ayuda 2",
                        ],
                        "label3"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "Teléfono",
                            "name" => "Etiqueta 3",
                        ],
                        "help3"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "Introduca su teléfono",
                            "name" => "Texto de ayuda 3",
                        ],


                    ],
                    "inputsFields" => [],
                ],
            ],
            [
                "id" => 6,
                "data" => [
                    "Name" => "Plantilla seis",
                    "fields" => [
                        "backGround" => [
                            "type" => ClientPresentationTemplate::TypeFile,
                            "value" => "images/templates/img1.jpg",
                            "templateUrl" => true,
                            "name" => "Imagen de fondo",
                        ],
                        "texto"=> [
                            "type" => ClientPresentationTemplate::TypeText,
                            "value" => "Tome fotos para una mejor experiencia",
                            "name" => "Texto Principal",
                        ]
                    ],
                    "inputsFields" => [],
                ],
            ],
            [
                "id" => 7,
                "data" => [
                    "Name" => "Plantilla siete",
                    "fields" => [
                        "backGround" => [
                            "type" => ClientPresentationTemplate::TypeFile,
                            "value" => "images/templates/img1.jpg",
                            "templateUrl" => true,
                            "name" => "Imagen de fondo",
                        ],
                        "texto"=> [
                            "type" => ClientPresentationTemplate::TypeText,
                            "value" => "Adjunte los archivos que crea necesario para su pedido.",
                            "name" => "Texto Principal",
                        ],
                        "linkUrlNumber"=> [
                            "type" => ClientPresentationTemplate::TypeNumberLinks,
                            "value" => "4",
                            "name" => "Cantidad de botones",
                        ],
                        "btn1"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "Comprar un producto",
                            "name" => "Etiqueta de ruta 1",
                        ],
                        "btn2"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "Reparar producto",
                            "name" => "Etiqueta de ruta 2",
                        ],
                        "btn3"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "Hacer una pregunta",
                            "name" => "Etiqueta de ruta 3",
                        ],
                        "btn4"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "Producto a la medida",
                            "name" => "Etiqueta de ruta 4",
                        ],
                        "btn1Url"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "#",
                            "name" => "Url 1",
                        ],
                        "btn2Url"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "#",
                            "name" => "Url 2",
                        ],
                        "btn3Url"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "#",
                            "name" => "Url 3",
                        ],
                        "btn4Url"=> [
                            "type" => ClientPresentationTemplate::TypeString,
                            "value" => "#",
                            "name" => "Url 4",
                        ],
                    ],
                    "inputsFields" => [],
                ],
            ],
            [
                "id" => 8,
                "data" => [
                    "Name" => "Plantilla ocho",
                    "fields" => [
                        "images" => [
                            "type" => ClientPresentationTemplate::TypeMultiFileAndText,
                            "value" => [
                                [
                                    'url' => 'https://cdn.pixabay.com/photo/2015/12/12/15/24/amsterdam-1089646_1280.jpg',
                                    'text' => 'Texto de esplicacion de la imagen que se muestra arriba.',
                                    "templateUrl" => false,
                                ],
                                [
                                    'url' => 'https://cdn.pixabay.com/photo/2016/02/17/23/03/usa-1206240_1280.jpg',
                                    'text' => 'Texto de esplicacion de la imagen que se muestra arriba. Texto de esplicacion de la imagen que se muestra arriba.',
                                    "templateUrl" => false,
                                ],
                                [
                                    'url' => 'https://cdn.pixabay.com/photo/2015/05/15/14/27/eiffel-tower-768501_1280.jpg',
                                    'text' => null,
                                    "templateUrl" => false,
                                ],
                            ],
                            "name" => "Imagenes y textos",
                        ],
                    ],
                    "inputsFields" => [],
                ],
            ],
        ];



        foreach ($templates as $templateArrayData){
            $template = ClientPresentationTemplate::find($templateArrayData["id"]);
            if(isset($template)){
                $template->update($templateArrayData["data"]);
            }
            else{
                $template = new ClientPresentationTemplate($templateArrayData["data"]);
                $template->id = $templateArrayData["id"];
                $template->save();
            }
        }
    }

    protected function manualSequenceSeed(){

        $manualSequence = [
            "id" => "31351eb9-7ec0-4165-9249-6901767ed371",
            "name" => "Manual",
            "public" => false,
            "deleted_at" => "2021-07-26 09:46:26"
        ];

        $sequence = ClientPresentationSequence::withTrashed()->find($manualSequence["id"]);
        if(isset($sequence)){
            $sequence->update($manualSequence);
        }
        else{
            ClientPresentationSequence::create($manualSequence);
        }
    }
}
