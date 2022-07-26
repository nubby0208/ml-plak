<template>
  <div class="page-contents" id="calendarPage">
    <vue-toastr ref="toastr"></vue-toastr>
    <notification></notification>

    <b-overlay :show="loadingPage" opacity="0.6" spinner-variant="primary">
    <div class="row">
      <div class="col-md-10" :show="loadingPage">
       <b-card no-body>
          <b-tabs card>
            <b-tab
              v-for="(tarea, i) in tareas"
              :key="i"
              :title="
                i == 0
                  ? 'Mis tareas'
                  : i == 1
                  ? 'Tarea grupal'
                  : 'Tarea general'
              "
            >
              <b-card-text>
                <table class="table table-bordered table-sm">
                  <thead class="thead-dark">
                    <tr>
                      <th class="text-center" scope="col">Título</th>
                      <th width="10%" class="text-center" scope="col">
                        Nota
                      </th>
                      <th class="text-center" scope="col" v-if="i == 1">
                        Grupo
                      </th>
                      <th width="10%" class="text-center" scope="col">
                        ¿Realizado?
                      </th>
                      <th width="10%" class="text-center" scope="col">
                        ¿Mostrar en Calendario?
                      </th>
                      <th width="20%" class="text-center" scope="col">
                        Fecha dentro Calendario
                      </th>
                      <th width="10%" class="text-center" scope="col">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="bg-secondary"
                      v-if="
                        (i == 2 && rol == 'Administrador') || i == 1 || i == 0
                      "
                    >
                      <td>
                        <input
                          v-model="tareaPersonal.descripcion"
                          :disabled="grupos.length == 0 && i != 1"
                          placeholder="Escriba la tarea"
                          class="form-control"
                          type="text"
                        />
                      </td>
                      <td :colspan="i == 1 ? '1' : '2'">
                        <b-button
                          variant="primary"
                          size="sm"
                          class="logout-btn mr-3"
                          @click="showNota()"
                          v-b-tooltip.hover
                          title="Escribir Nota"
                        >
                          <b-icon icon="file-text"></b-icon>
                        </b-button>
                      </td>
                      <td v-if="i == 1" colspan="2">
                        <select
                          class="form-control"
                          name="grupo"
                          :disabled="grupos.length == 0"
                          v-model="tareaPersonal.grupo_id"
                        >
                          <option
                            v-for="(grupo, i) in grupos"
                            :value="grupo.id"
                            :key="i"
                          >
                            {{ grupo.nombre_grupo }}
                          </option>
                        </select>
                      </td>
                      <td style="text-align: center">
                          <div class="form-check">
                            <input
                              type="checkbox"
                              class="form-check-input"
                              v-model="tareaPersonal.ver_calendario"
                            />
                          </div>
                        </td>
                        <td style="text-align: center">
                          <div class="form-group row" style="text-align: center">
                              <span><input type="text" :disabled="tareaPersonal.ver_calendario == 0" style="width: 70%" v-model="tareaPersonal.fecha_calendario" name="fecha_calendario"  title="Click en el día del Calendario" readonly v-on:click="showCalendar()">
                              &#128197;</span>
                          </div>
                        </td>
                        <td>
                              <button v-if="operEdit==false" type="button" title ="Guardar" class="btn btn-sm ml-btn-sm btn-success" v-on:click="agregarTarea(tareaPersonal, i)">
                              <font-awesome-icon icon="check"></font-awesome-icon></button>
                              <button v-if="operEdit==true" type="button" title ="Actualizar" class="btn btn-sm ml-btn-sm btn-success" v-on:click="realizarTarea(tareaPersonal)">
                              <font-awesome-icon icon="check"></font-awesome-icon></button>
                              <button type="button" title ="Cancelar" class="btn btn-sm ml-btn-sm btn-danger" v-on:click="cancelTarea()">
                              <b>X</b></button>
                        </td>
                    </tr>
                    <tr v-if="tarea.length == 0">
                      <td class="text-center" colspan="3">
                        No hay tareas a realizar
                      </td>
                    </tr>
                    <template v-if="tarea.length > 0">
                      <tr
                        v-for="(descTarea, ii) in tarea"
                        :class="{ 'bg-light': descTarea.realizado }"
                        :key="ii"
                      >
                        <td>
                          <p v-if="descTarea.realizado == 0">{{ descTarea.descripcion }}</p>
                          <del v-if="descTarea.realizado == 1">{{ descTarea.descripcion }}</del>
                        </td>
                        <td>
                          <b-button v-if="descTarea.detalle_descripcion != null"
                          variant="success"
                          size="sm"
                          class="logout-btn mr-3"
                          @click="showNotaUpdate(descTarea)"
                          :disabled="descTarea.realizado == 1"
                          v-b-tooltip.hover
                          title="Ver y/o Editar Nota"
                          >
                          <b-icon icon="file-text"></b-icon>
                          </b-button>
                          <b-button v-if="descTarea.detalle_descripcion == null"
                          variant="secondary"
                          size="sm"
                          class="logout-btn mr-3"
                          @click="showNotaUpdate(descTarea)"
                          :disabled="descTarea.realizado == 1"
                          v-b-tooltip.hover
                          title="Ver y/o Editar Nota"
                          >
                          <b-icon icon="file-text"></b-icon>
                          </b-button>
                        </td>
                        <td v-if="i == 1">
                          <p>{{ descTarea.grupo.nombre_grupo }}</p>
                        </td>
                        <td style="text-align: center">
                          <div class="form-check">
                            <input
                              type="checkbox"
                              class="form-check-input"
                              @change="realizarTarea(descTarea)"
                              v-model="descTarea.realizado"
                              :disabled="operEdit != false"
                            />
                          </div>
                        </td>
                        <td style="text-align: center">
                          <div class="form-check">
                            <input
                              type="checkbox"
                              class="form-check-input"
                              v-model="descTarea.ver_calendario"
                              disabled
                            />
                          </div>
                        </td>
                        <td v-if="descTarea.fecha_calendario!=null" >
                          <p>{{ $moment(descTarea.fecha_calendario).format("DD/MM/YYYY") }}</p>
                        </td>
                        <td v-if="descTarea.fecha_calendario==null" >
                          <p>&nbsp;</p>
                        </td>
                         <td>
                          <button v-if="operEdit==false"
                            class="btn btn-sm btn-warning"
                            @click="editTarea(descTarea)"
                          >
                            <font-awesome-icon icon="edit"></font-awesome-icon>
                          </button>
                          <button v-if="operEdit==false"
                            class="btn btn-sm btn-danger"
                            @click="deleteTarea(descTarea.id)"
                          >
                            <font-awesome-icon icon="trash"></font-awesome-icon>
                          </button>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </b-card-text>
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
    </div>
    </b-overlay>
    <!-- Modal Calendario -->
    <b-modal
      ref="myModalCalendar"
      id="myModalCalendar"
      hide-footer
      title="Calendario"
      size="lg"
    >
    <Calendarselect
    :fechaindex="fechaindex"
    @set-fecha="setFecha"
    ></Calendarselect>
    </b-modal>
    <!-- Modal Notas      --->
    <b-modal size="lg" ref="myModalNota" id="myModalNota" hide-footer title="Notas sobre ésta tarea">
      <div class="overflow-auto">
        <mc-wysiwyg  v-model="tareaPersonal.detalle_descripcion" :height="400"></mc-wysiwyg>
        <div class="read-me-footer">
          <button
            type="button"
            class="btn btn-sm btn-secondary"
            data-dismiss="modal"
           @click="closeNota()"
          >
            Guardar
          </button>
        </div>
      </div>
    </b-modal>
    <!-- Modal Notas  Update    --->
    <b-modal size="lg" ref="myModalNotaUpdate" id="myModalNotaUpdate" hide-footer title="Notas sobre ésta tarea">
      <div class="overflow-auto">
        <mc-wysiwyg  v-model="nota.detalle_descripcion" :height="400"></mc-wysiwyg>
        <div class="read-me-footer">
          <button
            type="button"
            class="btn-sm btn btn-success"
            @click="guardarNotaUpdate()"
          >
            Guardar
          </button>
          <button
            type="button"
            class="btn btn-sm btn-secondary"
            data-dismiss="modal"
           @click="closeNotaUpdate()"
          >
            Cerrar
          </button>
        </div>
      </div>
    </b-modal>
    <!-- ----------------- -->
  </div>
</template>

<script>
import { HTTP } from "../../../index";
import grupoService from "./../Services/grupoService";
import tareaService from "./../Services/tareaService";
import proyectoService from "./../Services/proyectosService";
import feriadoService from "./../Services/feriadoService";
import ImageGallery from "./../image-gallery.vue";
import GalleryModal from './../galleryWithFolder'
import { McWysiwyg } from "@mycure/vue-wysiwyg";

// import { CalendarView, CalendarViewHeader } from "vue-simple-calendar"

// import 'fullcalendar/dist/fullcalendar.css'

import { h } from "preact";
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

const VueUploadComponent = require("vue-upload-component");
Vue.component("file-upload", VueUploadComponent);

import VueToastr from "vue-toastr";
import * as VueGoogleMaps from "gmap-vue";
import Lightbox from "vue-easy-lightbox";
import Multiselect from "vue-multiselect";

import FileUpload from "vue-upload-component";
import swal from "sweetalert2";
import Calendarselect from './Calendarselect.vue';
// Init plugin

import Vue from "vue";

Vue.use(Lightbox);
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyDWPO4BYBh5HieRmN_radXJcNBZQL3tv_Q",
    libraries: "places",
    installComponents: true,
  },
});

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
  addDays,
  subDays,
} from "vue-date-fns";
import { timeout } from "rxjs/operators";
//import { ProyectoService } from 'app/services/proyecto.service'
const GrupoService = new grupoService();
const TareaService = new tareaService();
const ProyectoService = new proyectoService();
const FeriadoService = new feriadoService();
export default {
  components: {
    FullCalendar,
    VueToastr,
    FileUpload,
    Multiselect,
    GalleryModal,
    ImageGallery,
    Calendarselect,
    McWysiwyg,
  },
  data() {
    return {
      usuarios:[],
      fechaindex: -1,
      isEditEncargadoMed: false,
      isEditEncargadoInst: false,
      loadingPage: true,
      operEdit: false,
      loadingOff: 0,
      fechaMes: "",
      instalaciones: [],
      proyDisenos: [],
      disenoProyDetail: [],
      capacidadProduccionProy: [],
      medicionInstalacionEst:[],
      images_project: [],
      //file uploader options
      files: [],
      extensions: "jpg,jpeg,png",
      accept: "image/png,image/jpeg",
      minSize: 1024,
      size: 1024 * 1024 * 10,
      multiple: true,
      directory: false,
      drop: true,
      dropDirectory: true,
      createDirectory: false,
      addIndex: false,
      thread: 3,
      name: "file",
      postAction: `http://staging.mlplak.com/server/api/eventimage`,
      headers: {},
      data: {
        id: this.idEvento,
      },
      autoCompress: 1024 * 1024,
      uploadAuto: false,
      isOption: false,
      addData: {
        show: false,
        name: "",
        type: "",
        content: "",
      },
      editFile: {
        show: false,
        name: "",
      },
      idArchivo: 0,
      fechaC: null,
      refresh: "",
      view: "month",
      tarea: {},
      viewDate: new Date(),
      locale: "es",
      events: [],
      eventsAux: [],
      proyectos: [],
      clients: [],
      sheets: [],
      sheetId: 0,
      logged: false,
      items: [],
      // users;
      itemsToShowFirst: [],
      itemsToShowFirstFinal: [],
      isFirst: true,
      myCarrouselPositionFirst: 0,
      // server: environment.API_URL;
      fileToUpload: null,
      // form: FormGroup;
      error: "",
      userId: 166,
      uploadResponse: { status: "", message: "", filePath: "" },
      currentEventImages: [],
      currentEventImagePath: "",
      rol: "",
      modalDetalleSaldo: "",

      tareaPersonal: {
        id: null,
        realizado: 0,
        descripcion: "",
        detalle_descripcion: "",
        usuario_id: null,
        grupo_id: null,
        ver_calendario: 0,
        fecha_calendario: ""
      },

      nota: {
        id: null,
        realizado: 0,
        descripcion: "",
        detalle_descripcion: "",
        usuario_id: null,
        grupo_id: null,
        ver_calendario: 0,
        fecha_calendario: ""
       },

      proyectoDiseno: {
        id: 0,
        estado: "",
        nombre: "",
        cliente: "",
        direccion: "",
        telefono: "",
        mueble: "",
        comentario: "",
        horario: "",
        dia: "",
        encargado_inst: "",
        encargado_med: "",
        encargado_inst_name: "",
        encargado_med_name: "",
        token_project:""
      },
      pDiseno: {},
      tipoItem: "",
      descripItem: "",
      weekStartsOn: 1, //number = DAYS_OF_WEEK.MONDAY;

      gruposSeleccionados: [],
      observacionesProyecto: "",
      eventoSeleccionado: "",
      grupos: [],
      tareas: [],
      cargandoCalendario: false,
      proyectoTerminado: false,
      filtroGrupo: 0,
      idTraidoTaller: null,

      uploader: "",

      latitud: 0,
      longitud: 0,
      direccion: "",
      geoCoder: "",

      searchElementRef: "",

      idEvento: "",
      cargandoEvento: false,
      circleRadius: 5000,
      // proyectoService: '',
      ref: "",
      router: "",
      formBuilder: "",

      showDate: new Date(),
      myItems: [],
      lTareas: [],
      lAgenda: [],
      isShow: false,
      title: "",
      titulo: "",
      descripcion: "",
      fecha_inicio: "",
      fecha_fin: "",
      tipo: 0,
      botonModal: "",
      evento_id: 0,
      cKey: 0,
      itemsTest: [],
      dataUsers: [],
      dataEvents: [],
      dataModal: { clientePlace: "" },
      multiple: "true",
      tarea: {
        tarea: "",
        desc: "",
        nombre: "",
        telefono: "",
        direccion: "",
        horario: "",
        dia: "",
        eventId: 0,
      },
      dateStart: new Date(),
      btMdHorizontal: {
        update: false,
        save: false,
        delete: false,
      },
      imgs: "",
      visible: false,
      index: 0,
      mesActual: "",
      canCancel: true,
      useSlot: false,
      loader: "spinner",
      color: "#007bff",
      bgColor: "#ffffff",
      height: 128,
      width: 128,
      timeout: 3000, //ms
      showmodal:false,
      galleryTokenProject: "",
      metadata_proyecto:null,
      token_proyect:null,
      isfromtaller:false,
      option:"",
      hideclose:""

    };
  },
  mounted() {
    this.loadingPage=true;
    this.getUsuarios();
    let that = this;
    this.fechaC = new Date();
    let date = that.$moment();
    this.rol = JSON.parse(localStorage.getItem("usuario")).rol;
    this.traerGrupos();
    this.traerTareas();
  },
  methods: {
    showNotaUpdate (tarea) {
      this.nota = tarea;
      this.$bvModal.show("myModalNotaUpdate");
    },
    async guardarNotaUpdate() {
      if (this.nota.realizado == false)
      {
         this.nota.realizado = 0;
      }
      if (this.nota.realizado == true)
      {
         this.nota.realizado = 1;
      }
      let result = await TareaService.update(this.nota.id, this.nota);
      if (result) {
        this.$refs.toastr.s("Tarea actualizada.");
        this.traerTareas();
        this.closeNotaUpdate();
      }
      else
      {
        this.$refs.toastr.e("ERROR: Verifique los datos por favor.");
      }
    },
    closeNotaUpdate() {
      this.nota = {};
      this.$refs.myModalNotaUpdate.hide();
    },
    showNota () {
      this.$bvModal.show("myModalNota");
    },
    closeNota() {
      this.$refs.myModalNota.hide();
    },
    showCalendar () {
      this.$bvModal.show("myModalCalendar");
    },
    setFecha (fecha) {
      this.tareaPersonal.fecha_calendario = fecha;
      this.$forceUpdate();
      this.$bvModal.hide("myModalCalendar");
    },
    getUsuarios() {
      //this.loadingPage = true;
      HTTP.get("/api/usuario")
        .then((result) => {
          if (result.data != null) {
            this.usuarios = result.data.usuarios;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editTarea(tarea){
       this.operEdit=true;
       this.tareaPersonal.id = tarea.id;
       this.tareaPersonal.realizado = tarea.realizado;
       this.tareaPersonal.descripcion = tarea.descripcion;
       this.tareaPersonal.detalle_descripcion = tarea.detalle_descripcion
       this.tareaPersonal.usuario_id = tarea.usuario_id;
       this.tareaPersonal.grupo_id = tarea.grupo_id;
       this.tareaPersonal.ver_calendario = tarea.ver_calendario;
       this.tareaPersonal.fecha_calendario = "";
       if (tarea.fecha_calendario != null) {
          this.tareaPersonal.fecha_calendario = this.$moment(tarea.fecha_calendario).format("DD/MM/YYYY");
       }

    },
    cancelTarea(){
       this.operEdit=false;
       this.tareaPersonal.id = null;
       this.tareaPersonal.realizado = 0;
       this.tareaPersonal.descripcion =  "";
       this.tareaPersonal.detalle_descripcion = "";
       this.tareaPersonal.usuario_id =  null;
       this.tareaPersonal.grupo_id = null;
       this.tareaPersonal.ver_calendario = 0;
       this.tareaPersonal.fecha_calendario =  "";
    },
    async deleteTarea(idTarea) {
    this.$swal({
        title: "Advertencia",
        text: "¿Desea eliminar tarea?",
        type: "question",
        buttons: ["No", "Si"],
      }).then((result) => {
        if (result)
        {
            let res = TareaService.delete(idTarea);
            if (res)
            {
              this.$refs.toastr.e("Tarea eliminada");
              this.traerTareas();
            }
            else {
              this.$refs.toastr.e("ERROR: En la eliminacion de Tarea");
            }
        }
      });
    },
    async realizarTarea(tarea) {
      if (tarea.realizado == false)
      {
         tarea.realizado = 0;
      }
      if (tarea.realizado == true)
      {
         tarea.realizado = 1;
      }
      if ((tarea.ver_calendario!=0) && (tarea.fecha_calendario==""))
      {
          this.loadingPage=false;
          return this.$refs.toastr.e("ERROR: Debe colocar la fecha en que se visualizará la tarea en el calendario.");
      }

      let result = await TareaService.update(tarea.id, tarea);
      if (result) {
        this.$refs.toastr.s("Tarea actualizada.");
        this.tarea = result.data;
        this.tareaPersonal.descripcion = "";
        this.tareaPersonal.detalle_descripcion = "";
        this.tareaPersonal.ver_calendario = 0;
        this.tareaPersonal.fecha_calendario = "";
        this.tareaPersonal.grupo_id = null;
        this.traerTareas();
      }
      else
      {
        this.$refs.toastr.e("ERROR: Verifique los datos por favor.");
      }
      this.operEdit=false;
    },
    async agregarTarea(tarea, proceso) {
        this.loadingPage = true;
        let { id } = JSON.parse(localStorage.getItem("usuario"));

        this.tareaPersonal = tarea;
        this.tareaPersonal.realizado = 0;
        if (proceso == 0) {
          this.tareaPersonal.usuario_id = id;
          this.tareaPersonal.grupo_id = null;
        } else if (proceso == 1) {
          this.tareaPersonal.usuario_id = null;
          if (this.tareaPersonal.grupo_id == null)
            return this.$refs.toastr.i("Seleccione un grupo");
        } else {
          this.tareaPersonal.usuario_id = null;
          this.tareaPersonal.grupo_id = null;
        }

        if (
          this.tareaPersonal.usuario_id == null &&
          this.tareaPersonal.grupo_id == null
        )
        if (this.rol != "Administrador") return false;

        if ((this.tareaPersonal.ver_calendario!=0) && (this.tareaPersonal.fecha_calendario==""))
        {
          this.loadingPage=false;
          return this.$refs.toastr.e("ERROR: Debe colocar la fecha en que se visualizará la tarea en el calendario.");
        }

        if (tarea.descripcion != "") {
          let data = await TareaService.store(this.tareaPersonal);
          if (data) {
            this.$refs.toastr.s("Tarea agregada");
            this.tareaPersonal.descripcion = "";
            this.tareaPersonal.detalle_descripcion ="";
            this.tareaPersonal.ver_calendario = 0;
            this.tareaPersonal.fecha_calendario = "";
            this.tareaPersonal.grupo_id = null;
            this.traerTareas();
          } else {
            this.$refs.toastr.e("ERROR: Verifique los datos por favor");
          }
        } else this.$refs.toastr.e("ERROR:Complete la descripción");
    },
    async traerTareas() {
      try {
        var userid = localStorage.getItem('user-id');
        let data = await TareaService.getAll(userid);
        if (data) {
          this.tareas = data;
        }
      } catch (error) {
        console.log("Error en traerTareas: ", error);
      }
      this.loadingPage=false;
    },
    async traerGrupos() {
      if (this.rol == "Administrador") {
        let data = await GrupoService.getAll();
        console.log('traer grupos',data)
        if (data) {
          this.grupos = data.filter((x) => x.activo);
        }else{
          this.grupos.length = 1
        }
      } else {
        let idUsuario = JSON.parse(localStorage.getItem("usuario")).id;
        let data = await GrupoService.getById(idUsuario);
        if (data) {
          // this._grupoService.getById(idUsuario).subscribe((data: any) => {
          this.grupos = data.filter((x) => x.activo);
        }
      }
      this.loadingPage=false;
      console.log("grupo", this.grupos);
    },
  },
};
</script>

<style lang="scss">
/** No ocultar eventos del calendario */
#calendar .fc-daygrid-day-bottom {
  display: none;
}
#calendar .fc-daygrid-day-events {
  position: initial;
  overflow: auto;
}
#calendar .fc-daygrid-event-harness {
  visibility: visible !important;
  position: initial;
  margin-bottom: 5px;
}
.fc-liquid-hack td {
  height: 100px; /** Con esto se ajusta a la cant de eventos. No se por qué. */
}
.fc-scrollgrid-section-header .fc-scroller {
  overflow: hidden !important; /** No mostrar scroll en header de dias */
}
/** */
/** Ocultar selector de modo de vista del calendario */
#calendar .fc-header-toolbar .fc-toolbar-chunk:nth-child(3) {
  display: none;
}
/** */
/** Ajustar header para responsive */
@media only screen and (max-width: 374px) {
  #calendar .fc-header-toolbar {
    display: block;
  }
  #calendar .fc-header-toolbar .fc-toolbar-chunk:nth-child(2) {
    text-align: center;
    margin-top: 10px;
  }
  #calendar .fc-header-toolbar .fc-toolbar-chunk:nth-child(1) {
    display: flex;
  }
  #calendar .fc-header-toolbar .fc-toolbar-chunk .fc-today-button {
    margin: auto !important;
    margin-right: 0px !important;
  }
}
/** */

.calendario-detalle {
  margin: 2px;
  padding: 2px 5px;
  color: white !important;
  font-size: 11px;
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
}

.ml-1 {
  margin-left: 10px !important;
}

.cargandoFotoEvento {
  filter: blur(4px);
  width: 100%;
  height: 100%;
}

.justify-center {
  justify-content: center;
}

.text-warning {
  color: orangered;
}

.position-check {
  font-size: 14px;
  position: relative;
  top: 1px;
}

.position-bolitas {
  position: relative;
  top: 2px;
  right: 2px;
}

.responsive-text {
  width: 150px;
  overflow: hidden;
}

.evento-responsive {
  overflow: hidden;
}

.wrap {
  flex-wrap: wrap;
}

.flex-wrap {
  display: flex;
  flex-wrap: wrap;
}

.flex-center {
  display: flex !important;
  justify-content: center !important;
}

@media only screen and (max-width: 374px) {
  .responsive-text {
    width: 20px !important;
  }

  .evento-responsive {
    width: 20px !important;
  }
  .position-bolitas {
    top: 0px !important;
  }

  .cal-day-badge {
    margin-left: 4px;
    font-size: 9px;
  }
  .cal-month-view .cal-day-cell.cal-today .cal-day-number {
    font-size: 1.2em;
    margin-right: 8px;
  }
  .cal-day-number {
    font-size: 1.2em !important;
    margin-right: 8px;
  }

  .calendario-detalle {
    font-size: 9px;
    display: flex;
    flex-direction: column;
  }
}

@media (min-width: 374px) and (max-width: 375px) {
  .responsive-text {
    width: 33px !important;
  }

  .evento-responsive {
    width: 33px !important;
  }
  .position-bolitas {
    top: 0px !important;
  }

  .cal-day-badge {
    margin-left: 4px;
    font-size: 9px;
  }
  .cal-month-view .cal-day-cell.cal-today .cal-day-number {
    font-size: 1.2em;
    margin-right: 8px;
  }
  .cal-day-number {
    font-size: 1.2em !important;
    margin-right: 8px;
  }

  .calendario-detalle {
    font-size: 9px;
    display: flex;
    flex-direction: column;
  }
}

@media (min-width: 377px) and (max-width: 414px) {
  .responsive-text {
    width: 35px !important;
  }

  .evento-responsive {
    width: 35px !important;
  }
  .position-bolitas {
    top: 0px !important;
  }

  .cal-day-badge {
    margin-left: 4px;
    font-size: 9px;
  }
  .cal-month-view .cal-day-cell.cal-today .cal-day-number {
    font-size: 1.2em;
    margin-right: 8px;
  }
  .cal-day-number {
    font-size: 1.2em !important;
    margin-right: 8px;
  }

  .calendario-detalle {
    font-size: 9px;
    display: flex;
    flex-direction: column;
  }
}

@media (min-width: 415px) and (max-width: 768px) {
  .position-bolitas {
    top: 0px !important;
  }

  .cal-day-badge {
    margin-left: 4px;
    font-size: 9px;
  }
  .cal-month-view .cal-day-cell.cal-today .cal-day-number {
    font-size: 1.2em;
    margin-right: 8px;
  }
  .cal-day-number {
    font-size: 1.2em !important;
    margin-right: 8px;
  }

  .calendario-detalle {
    font-size: 9px;
    display: flex;
    flex-direction: column;
  }

  .responsive-text {
    width: 45px !important;
  }
  .responsive-text {
    width: 45px !important;
  }
}

@media (min-width: 769px) and (max-width: 1025px) {
  .responsive-text {
    width: 75px !important;
  }

  .evento-responsive {
    width: 75px !important;
  }
}

@media (min-width: 1281px) and (max-width: 1440px) {
  .responsive-text {
    width: 110px !important;
  }

  .evento-responsive {
    width: 110px !important;
  }
}

@media (min-width: 1026px) and (max-width: 1280px) {
  .responsive-text {
    width: 90px !important;
  }

  .evento-responsive {
    width: 90px !important;
  }
}

@media (min-width: 1281px) and (max-width: 1680px) {
  .responsive-text {
    width: 110px !important;
  }

  .evento-responsive {
    width: 110px !important;
  }
}

.proyecto-finalizado {
  background: #006103;
  font-weight: bold;
  color: white;
}

.upload-btn-wrapper input[type="file"] {
  font-size: 40px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}

agm-map {
  height: 200px;
}

.flex {
  display: flex;
}

.relative {
  position: relative;
}

.mr-1 {
  margin-right: 10px;
}

.mt-1 {
  margin-top: 10px;
}

.eliminar-imagen {
  position: absolute;
  top: 5px;
  right: 15px;
  font-size: 18px;
  background: #efefef;
  border-radius: 15px;
  cursor: pointer;
  padding: 2px;
}

.con-observaciones {
  background: #ca860b;
  color: white;
}

#calendarPage textarea {
  resize: none;
}

#calendarPage .evento {
  background: grey !important;
}

#calendarPage .proyecto {
  background: lightgrey;
  color: black !important;
}

#calendarPage .red {
  color: red;
  border-color: black;
}
#calendarPage .orange {
  color: orange;
  border-color: black;
}
#calendarPage .grey {
  color: #cccccc;
  border-color: black;
}
#calendarPage .black {
  color: black;
  border-color: white;
}
#calendarPage .white {
  color: white;
  border-color: black;
}

#calendarPage .violet {
  color: violet;
  border-color: black;
}

#calendar {
  /*max-width: 900px;*/
  margin: 0 auto;
  text-transform: uppercase;

  /* font-size: 11px;*/
}

#div-calendar {
  padding-top: 2em;
  padding-bottom: 2em;
}

.fc-title {
  font-size: 11px !important;
}

::ng-deep .fc-unthemed td.fc-today {
  background-color: #36f4bd;
}

::ng-deep .fc-today .fc-day-number {
  font-weight: bold !important;
  font-size: 18px !important;
}

#calendarPage .modal-body .row {
  margin-left: 0px;
  margin-right: 0px;
}

/* Clases utilizadas para definir progreso de proyecto: /deep/ .progress-[color-proyecto]-[color-stock] */
/* /deep/ .progress-start-* */
/*
/deep/ .progress-start-start {
    background: linear-gradient(90deg, #9E9E1F 25%, #9E9E1F 25%);
}

/deep/ .progress-start-middle {
    background: linear-gradient(90deg, #9E9E1F 25%, #CFCF26 25%);
}

/deep/ .progress-start-complete {
    background: linear-gradient(90deg, #9E9E1F 25%, #05A730 25%);
}

/deep/ .progress-start-default {
    background: linear-gradient(90deg, #9E9E1F 25%, #337ab7 25%);
}

/* /deep/ .progress-middle-* */

/*
/deep/ .progress-middle-start {
    background: linear-gradient(90deg, #CFCF26 25%, #9E9E1F 25%);
}

/deep/ .progress-middle-middle {
    background: linear-gradient(90deg, #CFCF26 25%, #CFCF26 25%);
}

/deep/ .progress-middle-complete {
    background: linear-gradient(90deg, #CFCF26 25%, #05A730 25%);
}

/deep/ .progress-middle-default {
    background: linear-gradient(90deg, #CFCF26 25%, #337ab7 25%);
}

/* /deep/ .progress-complete-* */
/*
/deep/ .progress-complete-start {
    background: linear-gradient(90deg, #05A730 25%, #9E9E1F 25%);
}

/deep/ .progress-complete-middle {
    background: linear-gradient(90deg, #05A730 25%, #CFCF26 25%);
}

/deep/ .progress-complete-complete {
    background: linear-gradient(90deg, #05A730 25%, #05A730 25%);
}

/deep/ .progress-complete-default {
    background: linear-gradient(90deg, #05A730 25%, #337ab7 25%);
}


/* /deep/ .progress-default-* */
/* /deep/ .progress-default-start {
    background: linear-gradient(90deg, #337ab7 25%, #9E9E1F 25%);
}

/deep/ .progress-default-middle {
    background: linear-gradient(90deg, #337ab7 25%, #CFCF26 25%);
}

/deep/ .progress-default-complete {
    background: linear-gradient(90deg, #337ab7 25%, #05A730 25%);
}

/deep/ .progress-default-default {
    background: linear-gradient(90deg, #337ab7 25%, #337ab7 25%);
}*/

#calendarPage .proyecto {
  background: #adadad;
}

.cal-day-number {
  font-weight: bold;
}

.cal-day-number:hover {
  text-decoration: underline;
}

#calendarPage .red-cell {
  background-color: red !important;
}
#calendarPage .blue-cell {
  background-color: blue !important;
}

/* .cv-event{
     font-size: 11px !important;
    overflow: hidden !important;
    word-wrap: break-word;
    height: 40px !important;
} */

.cv-event {
  /* width: 150px !important; */
  font-size: 12px !important;
  /* overflow: hidden; */
}

/* #app {
	display: flex;
	flex-direction: row;
	font-family: Calibri, sans-serif;
	width: 95vw;
	min-width: 30rem;
	max-width: 100rem;
	min-height: 40rem;
	margin-left: auto;
	margin-right: auto;
} */
.calendar-controls {
  margin-right: 1rem;
  min-width: 14rem;
  max-width: 14rem;
}
.calendar-parent {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  max-height: 80vh;
  background-color: white;
}
/* For long calendars, ensure each week gets sufficient height. The body of the calendar will scroll if needed */
.cv-wrapper.period-month.periodCount-2 .cv-week,
.cv-wrapper.period-month.periodCount-3 .cv-week,
.cv-wrapper.period-year .cv-week {
  min-height: 6rem;
}
/* These styles are optional, to illustrate the flexbility of styling the calendar purely with CSS. */
/* Add some styling for items tagged with the "birthday" class */
.theme-default .cv-item.birthday {
  background-color: #e0f0e0;
  border-color: #d7e7d7;
}
.theme-default .cv-item.birthday::before {
  content: "\1F382"; /* Birthday cake */
  margin-right: 0.5em;
}
/* The following classes style the classes computed in myDateClasses and passed to the component's dateClasses prop. */
.theme-default .cv-day.ides {
  background-color: #ffe0e0;
}
.ides .cv-day-number::before {
  content: "\271D";
}
.theme-default .cv-day.do-you-remember.the-21st .cv-day-number::after {
  content: "\1F30D\1F32C\1F525";
}

.fc-col-header-cell-cushion {
  color: black !important;
}
.fc-day-today {
  background-color: #e8fde7 !important;
}
.fc-event-time {
  display: none !important;
}
// .fc-daygrid-event-dot-width{ 5px}
.fc-daygrid-day-events {
  // background-color:gray !important
}
.eventBackg {
  background-color: #c5c5c5 !important;
  color: black !important;
}
.eventTBackg {
  background-color: #7e7e7e !important;
  color: white !important;
}
.fc-daygrid-dot-event .fc-event-title {
  font-weight: normal !important;
}
.fc-daygrid-event-dot {
  margin: 0 1px !important; //Modificado de 0 a 1px por Tobias
  height: 2px !important; //Agregado por Tobias
  width: 2px !important; //Agregado por Tobias
}
.fc-bgevent {
  opacity: 1 !important;
}

@media only screen and (max-width: 800px) {
  .fc-button-group {
    display: block !important;
  }
  .fc-button-primary {
    min-width: 50px !important;
    margin: 5px !important;
  }
  .fc-toolbar {
    margin-left: 0 auto !important;
    margin-right: 0 auto !important;
  }
  .fc-daygrid-day {
    height: 70px !important;
  }

  #calendar {
    height: 1000px !important;
  }
}
.modal-header {
  background-color:#FFFFFF !important;
}

#circulo {
  width: 12px;
  height: 12px;
  border-radius: 110px;
}
</style>
