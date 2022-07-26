<template>
  <div id="app-respaldo-list" class="container-fluid">
    <vue-toastr ref="toastr"></vue-toastr>

    <div class="col-xs-12 col-md-12 col-lg-12">
      <div class="col-sm-12 text-center">
        <h2>
          Listado de reportes

          <button type="button" class="btn btn-xs btn-success" @click="modalReporte()">
            <span class="glyphicon glyphicon-plus"></span>
            Nuevo
          </button>

        </h2>
        <hr>
      </div>

      <div id="respaldo-listado" class="col-sm-12">

        <table class="table table-hover">
          <thead>
            <th>Descripción reporte</th>
            <th>Tipo de reporte</th>
            <th>Estado</th>
            <th style="text-align: right; min-width: 80px">Editar</th>
          </thead>

          <tbody>
            <template v-if="(reportes.length)">
              <tr v-for="(row, i) in reportes" :key="i">
                <td>{{ row.nombre }}</td>
                <td>
                  <span
                    class="badge badge-success">{{row.esPregunta ? 'Pregunta' : row.esTexto ? 'Campo de texto' : 'Calificación'}}
                  </span>
                </td>
                <td>
                  <span class="badge" @click="cambiarEstado(row)"
                    :class="row.estado ? 'badge-success' : 'badge-danger'">{{row.estado ? 'Activo' : 'Inactivo'}}
                  </span>

                </td>
                <td style="text-align: right; min-width: 80px">
                  <button class="btn btn-sm btn-info" @click="seleccionarEncuesta(row)">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                  </button>
                </td>
              </tr>
            </template>

            <template v-else>
              <tr>
                <td class="text-center" colspan="17"><strong>No hay reportes creados</strong></td>
              </tr>
            </template>
          </tbody>
        </table>


        <!-- <ngx-datatable #tablaReportes class="bootstrap" [footerHeight]="50" [columnMode]="'force'" [rows]="reportes"
          [scrollbarH]="true"  [messages]="{emptyMessage: 'No hay reportes creados'}" [footerHeight]="50"
          [limit]="10" [headerHeight]="50" rowHeight="auto">
          <ngx-datatable-column name="Descrición reporte">
            <template let-row="row" style="border-left: 1px solid #d1d4d7;" ngx-datatable-cell-template>
              <strong class="salto-linea"> {{ row.nombre }} </strong>
            </template>
          </ngx-datatable-column>
          <ngx-datatable-column name="Tipo de reporte">
            <template let-row="row" style="border-left: 1px solid #d1d4d7;" ngx-datatable-cell-template>
              <span
                class="badge badge-success">{{row.esPregunta ? 'Pregunta' : row.esTexto ? 'Campo de texto' : 'Calificación'}}
              </span>
            </template>
          </ngx-datatable-column>
          <ngx-datatable-column name="Estado">
            <template let-row="row" style="border-left: 1px solid #d1d4d7;" ngx-datatable-cell-template>
              <span class="badge" @click="cambiarEstado(row)"
                [ngClass]="row.estado ? 'badge-success' : 'badge-danger'">{{row.estado ? 'Activo' : 'Inactivo'}}
              </span>
            </template>
          </ngx-datatable-column>
          <ngx-datatable-column name="Editar">
            <template let-row="row" style="border-left: 1px solid #d1d4d7;" ngx-datatable-cell-template>
              <button class="btn btn-sm btn-info" @click="seleccionarEncuesta(row)">
                <span class="fa fa-edit"></span>
              </button>
            </template>
          </ngx-datatable-column>
        </ngx-datatable> -->


      </div>

      <!-- <div id="modal-reporte" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                  aria-hidden="true">&times;</span></button>
              <h4 class="modal-title">Reportes</h4>
            </div>
            <div class="modal-body">
              <div id="app-grupo-form" class="container-fluid">
                <div id="" class="col-sm-12">
                  <form id="form-grupo" class="form-horizontal" action="#!" method="post">
                    <div class="form-group">
                      <label class="control-label col-sm-4" for="reporte">Descripción reporte</label>
                      <div class="col-sm-8">
                        <textarea id="reporte" placeholder="Describa aquí la pregunta del reporte"
                          class="form-control salto-linea" name="reporte" type="text"
                          v-model="encuesta.nombre "></textarea>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="control-label col-sm-4" for="reporte">Tipo reporte</label>
                      <div class="col-sm-8">
                        <ng-select [items]="tipo_encuesta" :disabled="idTipoEncuesta != null"
                          placeholder="Seleccione el tipo de reporte" bindLabel="descripcion" name="idTipoEncuesta"
                          v-model="idTipoEncuesta" bindValue="id">
                        </ng-select>

                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" v-if="!editar"
                :disabled="(encuesta.nombre.length == 0 || idTipoEncuesta == null)"
                @click="crearEncuesta()">Guardar</button>
              <button type="button" class="btn btn-success" v-if="editar"
                :disabled="(encuesta.nombre.length == 0 || idTipoEncuesta == null)"
                @click="editarEncuesta()">Editar</button>
              <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <div class="col-xs-12 col-md-12 col-lg-12 ">
      <div class="col-sm-12 text-center">
        <h2>
          Reportes finalizados
        </h2>
        <hr>
      </div>

      <div id="reportes-listado" class="col-sm-12">
          <input type="button" @click="cambiarMostrarDatos()">
          <b-table :items="reportesFinalizados" :fields="fields" striped responsive="sm">
              <template #cell(D)="row">
                  <b-form-checkbox v-model="row.detailsShowing" @change="row.toggleDetails">
                      Ver
                  </b-form-checkbox>
              </template>
              <template #row-details="row">
                  <b-card>
                      <b-row class="">
                        <b-col>
                            <div class="container">
                              <table class="table table-striped table-bordered">
                                <thead>
                                  <tr>
                                    <th class="col-lg-1 col-md-2 col-sm-2 col-xs-2">Tipo pregunta</th>
                                    <th class="col-lg-4 col-md-4 col-sm-4 col-xs-4">Pregunta</th>
                                    <th class="col-lg-4 col-md-4 col-sm-4 col-xs-4">Respuesta</th>
                                  </tr>
                                </thead>
                                <tbody v-if="mostrarDatos">
                                  <tr v-for="dt in row" :key="dt.id">
                                    <td>
                                      <ul v-for="item in dt.datat" :key="item.id">                                        
                                        <li> {{item.encuesta}} </li>
                                        <li> {{item.respuesta}} </li>
                                        
                                      </ul>
                                      <!-- {{dt}} -->

                                    </td>                                    
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </b-col>
                      </b-row>
                  </b-card>
              </template>

              <template #cell(editar)="row">
                  <button  class="btn btn-info btn-sm">
                      <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                  </button>

              </template>                    
          </b-table>



<!-- 
        <table class="table table-hover">
          <thead>
            <th class="text-center">Nombre del proyecto</th>
            <th>Usuario</th>
          </thead>

          <tbody>
            <template v-if="(reportesFinalizados.length)">
              <tr v-for="(row, i) in reportesFinalizados" :key="i">
                <td>
                  <span>
                    {{ row.proyecto }} 
                  </span>
                </td>
                <td class="text-center">
                  <span class="badge-dark">{{row.usuario}}</span>
                </td>
              </tr>
            </template>

            <template v-else>
              <tr>
                <td class="text-center" colspan="17"><strong>No hay reportes creados</strong></td>
              </tr>
            </template>
          </tbody>
        </table> -->












        <!-- <ngx-datatable #tablaReportesRespondido class="bootstrap" [columnMode]="'force'" [rows]="reportesFinalizados"
          [scrollbarH]="true" [rowHeight]="50" [footerHeight]="50" [messages]="
        {emptyMessage: 'No hay reportes realizados'}" [headerHeight]="50" [limit]="'10'" rowHeight="auto">

          <ngx-datatable-row-detail class="force-nowrap" [rowHeight]="'auto'" #myDetailRow>
            <template let-row="row" let-expanded="expanded" ngx-datatable-row-detail-template>
              <div class="container">
                <table class="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th class="col-lg-1 col-md-2 col-sm-2 col-xs-2">Tipo pregunta</th>
                      <th class="col-lg-4 col-md-4 col-sm-4 col-xs-4">Pregunta</th>
                      <th class="col-lg-4 col-md-4 col-sm-4 col-xs-4">Respuesta</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="let data of row.data">
                      <td>
                        <strong>
                          {{data.encuesta.esPregunta ? 'Pregunta' : data.esTexto ? 'Campo de texto' : 'Calificación'}}
                        </strong>
                      </td>
                      <td>
                        <strong>
                          {{data.encuesta.nombre}}
                        </strong>
                      </td>
                      <td>
                        <strong>
                          {{data.respuesta}}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </ngx-datatable-row-detail>
          <ngx-datatable-column [width]="50" [resizeable]="false" [sortable]="false" [draggable]="false"
            [canAutoResize]="false">
            <template let-row="row" let-expanded="expanded" ngx-datatable-cell-template>
              <a href="javascript:void(0)" [class.datatable-icon-right]="!expanded" [class.datatable-icon-down]="expanded"
                title="Expandir/collapsar fila" @click="expandirFila(row)">
              </a>
            </template>
          </ngx-datatable-column>
          <ngx-datatable-column name="Nombre del proyecto">
            <template let-row="row" style="border-left: 1px solid #d1d4d7;" ngx-datatable-cell-template>
              <strong>
                {{ row.proyecto }} </strong>
            </template>
          </ngx-datatable-column>
          <ngx-datatable-column name="Usuario">
            <template let-row="row" style="border-left: 1px solid #d1d4d7;" ngx-datatable-cell-template>
              <span class="badge">{{row.usuario}}
              </span>
            </template>
          </ngx-datatable-column>
        </ngx-datatable> -->


      </div>

      <!-- <div id="modal-reporte" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                  aria-hidden="true">&times;</span></button>
              <h4 class="modal-title">Reportes</h4>
            </div>
            <div class="modal-body">
              <div id="app-grupo-form" class="container-fluid">
                <div id="" class="col-sm-12">
                  <form id="form-grupo" class="form-horizontal" action="#!" method="post">
                    <div class="form-group">
                      <label class="control-label col-sm-4" for="reporte">Descripción reporte</label>
                      <div class="col-sm-8">
                        <textarea id="reporte" placeholder="Describa aquí la pregunta del reporte" class="form-control"
                          name="reporte" type="text" v-model="encuesta.nombre "></textarea>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="control-label col-sm-4" for="reporte">Tipo reporte</label>
                      <div class="col-sm-8">
                        <ng-select [items]="tipo_encuesta" :disabled="idTipoEncuesta != null"
                          placeholder="Seleccione el tipo de reporte" bindLabel="descripcion" name="idTipoEncuesta"
                          v-model="idTipoEncuesta" bindValue="id">
                        </ng-select>

                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" v-if="!editar"
                :disabled="(encuesta.nombre.length == 0 || idTipoEncuesta == null)"
                @click="crearEncuesta()">Guardar</button>
              <button type="button" class="btn btn-success" v-if="editar"
                :disabled="(encuesta.nombre.length == 0 || idTipoEncuesta == null)"
                @click="editarEncuesta()">Editar</button>
              <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div> -->
    </div>
</div> 
</template>

<script>
import { forkJoin } from 'rxjs'

import encuesta_tipoService from "../Services/encuesta_tipoService";
import encuestaRespuestaService from "../Services/encuestaRespuestaService";
import VueToastr from "vue-toastr";

const Encuesta_tipoService = new encuesta_tipoService();
const EncuestaRespuestaService = new encuestaRespuestaService();

export default {
    components: {
      VueToastr,
    },
    data(){
        return{
            EncuestaTipo: {
                id: 0,
                nombre: '',
                esTexto: false,
                esPregunta: false,
                esEstrella: false,
                estado: false,
                descripcion: "",
                id_proyecto: 0,
                created_at: new Date(),
                updated_at: new Date()
            },
            reportes: [],
            reportesFinalizados: [],
            tipo_encuesta : [
                { id: 1, descripcion: 'Texto libre' },
                { id: 2, descripcion: 'Si / No' },
                { id: 3, descripcion: 'Calificación' }
            ],
            encuesta: this.EncuestaTipo,
            idTipoEncuesta: 0,
            editar: false,
            table:{},
            fields: ['D','proyecto', 'usuario'],
            mostrarDatos: false

        }
    },
    mounted(){
      // this._ngxUiService.start();
		  this.traerEncuestasFinal();
    },
    methods:{
      cambiarMostrarDatos(){
        this.mostrarDatos = !this.mostrarDatos
        console.log(this.reportesFinalizados)
      },
      async traerEncuestasFinal() {

        
        //let responseOne = await EncuestaRespuestaService.getAll()
        ////////////////////////////
        let responseOne = [
          {
            encuesta: {
              created_at: "2020-04-16 00:00:00",
              esEstrella: true,
              esPregunta: false,
              esTexto: false,
              estado: true,
              id: 1,
              nombre: "Califica la calidad del mueble terminado",
              updated_at: null
            },
            proyecto:{
              activo: null,
              assignCajones: null,
              assignCajonesDate: null,
              assignModulos: null,
              assignModulosDate: null,
              assignPiezas: null,
              assignPiezasDate: null,
              assignPrearmado: null,
              assignPrearmadoDate: null,
              assignTapacantos: null,
              assignTapacantosDate: null,
              assistants: null,
              cliente_id: 697,
              comentario_adicional: null,
              created_at: "2020-01-17 16:04:34",
              finalizado: 1,
              grupos: null,
              id: 666,
              instalacion_comentario: "resta abonar 30100 (24700 bajomesada mas 5400 cajonera)",
              instalacion_fecha: "2020-02-03 10:00:00",
              observaciones: "",
              proyecto: "bajomesa",
              senia: 30000,
              token_project: "5d5ef385e0f1177eedd1a956c8ccd696",
              updated_at: "2020-04-16 14:49:12",
              valor_total: 60100
            },
            respuesta:"5",
            nombre: "test", esPregunta:"",estado: true,
            usuario:{
              activo: 1,
              correo_google: "marianohernanalvarez@gmail.com",
              created_at: "2018-09-04 16:34:02",
              deleted_at: null,
              id: 3,
              last_login_date: "2021-01-29 00:00:00",
              nombre_completo: "mariano hernan alvarez",
              password: "$2y$10$r/XGVHuBmDgW./JZwKSGI.odt593FT0di9clkNqasvVwos2lEFVny",
              rol_id: 1,
              updated_at: "2021-01-29 14:40:45",
              usuario: "mariano"


            }, 
          
           }
        ]
        //////////////////////////
        let responseTwo = await Encuesta_tipoService.getAll()
        console.log('two',responseTwo)
        if(responseOne){
          if (responseOne.length > 0) {

            let arrayFiltrado = [];
            responseOne.forEach( element => {
              let filtrado = arrayFiltrado.filter(x => x.proyecto == element.proyecto.proyecto);
              if (filtrado.length == 0) {
                let object = { 'proyecto': element.proyecto.proyecto, 'usuario': element.usuario.usuario, datat: [] };
                object.datat.push({
                  'encuesta': element.encuesta,
                  'respuesta': element.respuesta
                });
                arrayFiltrado.push(object);
              } else {
                filtrado[0].datat.push({
                  'encuesta': element.encuesta,
                  'respuesta': element.respuesta
                })
              }
              this.reportesFinalizados = arrayFiltrado;
              console.log('pro-->',this.reportesFinalizados)
            });
          }
        }
        this.reportes = responseTwo;
        // this._ngxUiService.stop();
      },

      async traerEncuesta() {
        let data = EncuestaTipoService.getAll()
        if(data) {
          this.reportes = data;
        }
      },

      expandirFila(grupo) {
        this.table.rowDetail.toggleExpandRow(grupo);
      },

      async crearEncuesta() {
        if (this.idTipoEncuesta == null || this.encuesta.nombre == '' || this.encuesta.nombre == null) this._toastr.info('Datos incompletos');

        if (this.idTipoEncuesta == 1) this.encuesta.esTexto = true
        else if (this.idTipoEncuesta == 2) this.encuesta.esPregunta = true;
        else this.encuesta.esEstrella = true;

        let data = await EncuestaTipoService.store(this.encuesta)
        if(data) {
          this.$refs.toastr.s("Reporte creado");
          this.traerEncuesta();
          // _$('#modal-reporte').modal('hide');
        }
      },

      async cambiarEstado(encuesta) {
        encuesta.estado = +(!encuesta.estado);

        let data = await EncuestaTipoService.update(encuesta, encuesta.id)
        if(data) {
          this.$refs.toastr.s("Reporte editado");
          this.traerEncuesta();
          // _$('#modal-reporte').modal('hide');
        }
      },

      async editarEncuesta() {
        let encuesta = { ...this.encuesta };
        encuesta.esTexto = false;
        encuesta.esPregunta = false;
        encuesta.esEstrella = false;
        if (this.idTipoEncuesta == 1) encuesta.esTexto = true
        else if (this.idTipoEncuesta == 2) encuesta.esPregunta = true;
        else encuesta.esEstrella = true;

        let data = await EncuestaTipoService.update(encuesta, encuesta.id)
        if(data) {
          this.$refs.toastr.s("Reporte editado");
          this.traerEncuesta();
          // _$('#modal-reporte').modal('hide');
        }
      },

      seleccionarEncuesta(encuesta) {
        this.editar = true;
        this.encuesta = { ...encuesta };
        this.idTipoEncuesta = (encuesta.esPregunta ? 2 : (encuesta.esTexto) ? 1 : 3);
        // _$('#modal-reporte').modal('show');
      },

      modalReporte() {
        this.encuesta = this.EncuestaTipo();
        this.idTipoEncuesta = null;
        this.editar = false;
        // _$('#modal-reporte').modal('show');
      }
    }
}
</script>

<style>
textarea {
    resize: none;
  }

  .badge-success{
    background: green;
}

.badge-danger {
    background: orange;
}

.datatable-pager a{
  color: black !important;
}

.salto-linea{
  white-space: break-spaces;
}


</style>