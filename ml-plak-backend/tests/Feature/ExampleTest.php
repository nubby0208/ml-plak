<?php

namespace Tests\Feature;

use App\Models\Presupuesto;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testBasicTest()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_making_an_api_request()
    {
        $response = $this->postJson('/api/presupuesto/deletebulk', ['ids' => [
            127, 126, 130
        ]]);

        $response
            ->assertStatus(200)
            ->assertJson([
                'ok' => true,
            ]);
    }

    public function test_update_presupuesto()
    {
        $data = [
            "estado" => 1,
            "fecha" => "2021-06-24",
            "imagen1" => "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA",
            "imagen2" => "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA",
            "imagen3" => null,
            "imagen4" => null,
            "imagen5" => null,
            "project_id" => 1095,
            "results" => "{\n              \"cliente\": {\"username\":\"LUISR\",\"token_project\":\"159d0d55ddc82249e800feccafe5cd33\",\"name\":\"chiquistruquis\",\"address\":\"al polo norte\",\"phone\":\"1312312313\",\"mueble\":\"muy bonito\",\"total\":\"\",\"senia\":\"\",\"connectedCNC\":-1,\"fechaMedicion\":[],\"horaMedicion\":[],\"otrasFechaInstalacion\":[],\"otrasHoraInstalacion\":[],\"fechaInstalacion\":\"\",\"horaInstalacion\":\"\",\"comentarioInstalacion\":\"un comentario\",\"comentario\":\"\",\"saldo\":\"\",\"pagos\":[],\"items\":[],\"links\":[],\"seniaDescripcion\":\"\",\"totalDescripcion\":\"\",\"estadoProyecto\":\"Proyecto en Curso\"}, \"canalComunicacion\": {\"fb\":true,\"ig\":false,\"wp\":false,\"mail\":false,\"local\":false}, \"nombreRedSocialCliente\": \"dqsdasdasd\", \"comentarioResumen\": \"el comentario\", \"comentarioOpcional\": \"\", \"observaciones\": [], \"postPresupuesto\": {\"postTexto\":\"\",\"postRespondio\":\"\",\"postInterno\":\"\"}, \"retomoPresupuesto\": {\"retomaTexto\":\"\",\"retomaRespondio\":\"\",\"retomaInterno\":\"\"}, \"lineaClasica\": [{\"id\":\"gyqik\",\"nombre\":\"asdasd\",\"mostrar\":true}], \"lineaPremium\": [{\"id\":\"qigxe\",\"nombre\":\"asdasd\",\"mostrar\":true}], \"color\": \"Blanco aglo\", \"validezPresupuesto\": \"06/\",\"validezPromo\": \"06/\", \"detalles\": \"asdasd\",\"condicionesPago\": \"dinero dinero\", \"comentarioInternoPresupuesto\": \"aloja\", \"piezas\": [{\"id\":\"vhllc\",\"nombre\":\"asdasdas\",\"mostrar\":true}],\n       \"precioFinalClasica\": 2509.65,\n       \"precioFinalPremium\":  4182.84,\n       \"contacto\": \"Te envio presupuesto aproximado \\nMedidas: Alto !alto! Ancho  !ancho! Prof !prof!\\n\\t\\t\\t\\t\\t\\n- Precio en Linea clasica \\t\\t\\t\\t\\t\\n$2509.65\\t\\t\\t\\t\\t\\n\\n- Precio en Linea Premium\\n$4182.84\\n\\nContamos con la siguiente financiacion:\\nLinea Clasica\\nLinea Premium\\n\\t\\t\\n\\t\\t\\t\\t\\t\\n\\t\\t\\t\\t\\t\\n-------------------------------------------------------\\t\\t\\t\\t\\t\\nInstalacion aca\\n----------------------------------------------------\\t\\t\\t\\t\\t\\nML PLAK\"\n      }",
            "token" => "159d0d55ddc82249e800feccafe5cd33",
            "usuario" => "LUISR",
        ];
        $presupuesto = new Presupuesto($data);
        $presupuesto->usuario = $data['usuario'];
        $presupuesto->project_id = $data['project_id'];
        $presupuesto->save();
        $this->assertDatabaseHas('presupuesto', $data);
    }
}
