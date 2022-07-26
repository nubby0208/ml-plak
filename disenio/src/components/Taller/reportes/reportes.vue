<template>
  <div id="app-respaldo-list" class="container-fluid row">
    <vue-toastr ref="toastr"></vue-toastr>

    <div class="col-sm-12 col-md-12 col-lg-12 mt-3">
      <div class="col-sm-12 text-center">
        <h2>
          Listado de reportes
          <br/>
          <button type="button" class="btn btn-xs btn-success" @click="modalReporte()">
            <span class="glyphicon glyphicon-plus"></span>
            Nuevo
          </button>

        </h2>
        <hr>
      </div>

      <div id="respaldo-listado" class="col-sm-12">
        <div class="table-responsive">
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
                    <span class="btn btn-sm" @click="cambiarEstado(row)"
                      :class="row.estado ? 'btn-success' : 'btn-danger'"
                      :title="row.estado ? 'Desactivar' : 'Activar'"
                      >{{row.estado ? 'Activo' : 'Inactivo'}}
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
        </div>

        <div v-if="reportes.length>0" class="bg-dark text-left" colspan="17">
          <div class="col-md-12">
            <label class="text-light mt-2 text-left">{{reportes.length}}</label>
          </div>
        </div>
      </div>
      
      <!-- modal -->
      <b-modal id="modal-reporte" hide-header hide-footer size="lg">
        <div class="modal-header">
          <h4 class="modal-title">Reportes</h4>
          <button @click="$bvModal.hide('modal-reporte')" type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span></button>
        </div>
        <div id="" class="col-sm-12 mt-3">
          <form id="form-grupo" class="form-horizontal" action="#!" method="post">
            <div class="form-group row">
              <label class="control-label col-sm-4" for="reporte">Descripción reporte</label>
              <div class="col-sm-8">
                <textarea id="reporte" placeholder="Describa aquí la pregunta del reporte"
                  class="form-control salto-linea" name="reporte" type="text"
                  v-model="encuesta.nombre "></textarea>
              </div>
            </div>

            <div class="form-group row">
              <label class="control-label col-sm-4" for="reporte">Tipo reporte</label>
              <div class="col-sm-8">
	              <select id="cut_level" class="form-control" name="cut_level"
									v-model="idTipoEncuesta" >
									<option v-for="item in tipo_encuesta" :value="item.id" :key="item.id">{{item.descripcion}}</option>
								</select>   
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" v-if="!editar"
            :disabled="(encuesta.nombre.length == 0 || idTipoEncuesta == null)"
            @click="crearEncuesta()">Agregar</button>
          <button type="button" class="btn btn-success" v-if="editar"
            :disabled="(encuesta.nombre.length == 0 || idTipoEncuesta == null)"
            @click="editarEncuesta()">Guardar</button>
          <button @click="$bvModal.hide('modal-reporte')" type="button" class="btn btn-danger" data-dismiss="modal">Cerrar</button>
        </div>
      </b-modal>
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
        encuesta: {
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
        idTipoEncuesta: 0,
        editar: false,
        table:{},
        fields: ['v','proyecto', 'usuario'],
        mostrarDatos: false,
        perPage: 3,
        currentPage: 1,
        totalrows: 15,
        pagOptions: {
          total: 15,
          active: 0,
          sections: 0,
        },
      }
    },
    mounted(){
      console.log('esta es la encuesta', this.encuesta)
      // this._ngxUiService.start();
		  this.traerEncuestasFinal();
    },
    methods:{
      rows() {
        this.totalrows = this.reportesFinalizados.length
      },      
      cambiarMostrarDatos(){
        this.mostrarDatos = !this.mostrarDatos
        console.log(this.reportesFinalizados)
      },
      async traerEncuestasFinal() {
        let responseTwo
        try {
          responseTwo = await Encuesta_tipoService.getAll()
        } catch (error) {
          console.log('Encuesta_tipoService',error)
          responseTwo = []
        }

        console.log('two',responseTwo)
        this.reportes = responseTwo;
      },

      async traerEncuesta() {
        let data = await Encuesta_tipoService.getAll()
        if(data) {
          this.reportes = data;
        }
      },

      expandirFila(grupo) {
        this.table.rowDetail.toggleExpandRow(grupo);
      },

      async crearEncuesta() {
        if (this.idTipoEncuesta == null || this.encuesta.nombre == '' || this.encuesta.nombre == null) this.$refs.toastr.i('Datos incompletos');

        if (this.idTipoEncuesta == 1) this.encuesta.esTexto = true
        else if (this.idTipoEncuesta == 2) this.encuesta.esPregunta = true;
        else this.encuesta.esEstrella = true;

        let data = await Encuesta_tipoService.store(this.encuesta)
        if(data) {
          this.$refs.toastr.s("Reporte creado");
          this.traerEncuesta();
          this.$bvModal.hide('modal-reporte')
        }
      },

      async cambiarEstado(encuesta) {
        encuesta.estado = +(!encuesta.estado);

        let data = await Encuesta_tipoService.update(encuesta, encuesta.id)
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

        let data = await Encuesta_tipoService.update(encuesta, encuesta.id)
        console.log('datares',data)
        if(data) {
          this.$refs.toastr.s("Reporte editado");
          this.traerEncuesta();
          this.$bvModal.hide('modal-reporte')
          // _$('#modal-reporte').modal('hide');
        }
      },

      seleccionarEncuesta(encuesta) {
        this.editar = true;
        this.encuesta = { ...encuesta };
        this.idTipoEncuesta = (encuesta.esPregunta ? 2 : (encuesta.esTexto) ? 1 : 3);
        this.$bvModal.show('modal-reporte')
        // _$('#modal-reporte').modal('show');
      },

      modalReporte() {
        this.encuesta = this.EncuestaTipo;
        this.idTipoEncuesta = null;
        this.editar = false;
        this.$bvModal.show('modal-reporte')
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