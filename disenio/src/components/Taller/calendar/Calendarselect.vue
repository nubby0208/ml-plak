<template>
  <div class="page-contents" id="calendarPage">
    <vue-toastr ref="toastr"></vue-toastr>
    <vue-easy-lightbox
      :visible="visible"
      :imgs="imgs"
      :index="index"
      @hide="handleHide"
    ></vue-easy-lightbox>

    <div class="row">
      <div class="col-xs-12 col-md-12">
        <b-form-row style="margin-top: 10px">
          <b-col cols="5">
            <select
              class="form-control"
              name="grupo"
              @change="filtrarPorGrupo($event)"
              v-model="filtroGrupo"
              :disabled="grupos.length == 0"
            >
              <option selected value="0">Ver todos</option>
              <option v-for="grupo in grupos" :value="grupo.id" :key="grupo.id">
                {{ grupo.nombre_grupo }}
              </option>
            </select>
          </b-col>

          <b-col cols="5">
            <input
              class="form-control"
              type="month"
              id="start"
              name="start"
              :value="mesActual"
              @change="monthSelect($event)"
            />
          </b-col>

          <b-col cols="2">
            <b-button variant="outline-primary" @click="fetchEvents()">
              <b-icon icon="arrow-repeat"></b-icon>
            </b-button>
          </b-col>
        </b-form-row>

        <b-overlay :show="loadingPage" opacity="0.6" spinner-variant="primary">
          <div ref="calendar">
            <FullCalendar
              id="calendar"
              ref="fullCalendar"
              :options="calendarOptions"
            />
          </div>
        </b-overlay>
      </div>
    </div>
  </div>
</template>

<script>
import { HTTP } from "../../../index";
import grupoService from "./../Services/grupoService";
import tareaService from "./../Services/tareaService";
import proyectoService from "./../Services/proyectosService";
import feriadoService from "./../Services/feriadoService";

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
  },
  props: ['fechaindex'],
  data() {
    return {
      instalaciones: [],
      proyDisenos: [],
      disenoProyDetail: [],
      loadingOff: 0,
      loadingPage: true,
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

      ////////////////////
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin, // needed for dateClick
        ],
        headerToolbar: {
          left: "prev next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        views: {
          timeGridWeek: {
            type: "timeGridWeek",
            buttonText: "S",
          },
          dayGridMonth: {
            type: "dayGridMonth",
            buttonText: "M",
          },
          timeGridDay: {
            type: "timeGridDay",
            buttonText: "D",
          },
        },
        initialView: "dayGridMonth",
        // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
        editable: false,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        locale: esLocale,
        events: [],
        dateClick: this.updateFechaCalendar,
        select: this.dateClick,
        eventClick: this.dateClick,
        /*function(info) {
          //this.updateFechaCalendar(info.dateStr);
          //this.fechaCalendar = info.dateStr;
          //alert('Clicked on: ' + this.fechaCalendar);
          this.$emit('set-fecha',info.dateStr);
        },*/
        /*select: this.nuevoEvento,*/
        //eventClick: this.detalleCalendario,
        /*monthChange: this.changeM,*/
        eventContent: function (eventInfo) {
          return { html: eventInfo.event.extendedProps.customHtml };
        },
        // eventsSet: this.handleEvents
        /* you can update a remote database when these fire:
              eventAdd:
              eventChange:
              eventRemove:
              */
      },

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
        realizado: false,
        descripcion: "",
        usuario_id: null,
        grupo_id: null,
      },

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
      fullPage: true,
      canCancel: true,
      useSlot: false,
      loader: "spinner",
      color: "#007bff",
      bgColor: "#ffffff",
      height: 128,
      width: 128,
      timeout: 3000, //ms
      redirectoken:null
    };
  },
  mounted() {
    let that = this;
    document
      .getElementsByClassName("fc-prev-button")[0]
      .addEventListener("click", function () {
        let calendarApi = that.$refs.fullCalendar.getApi();
        let date = that.$moment(calendarApi.getDate()).format("YYYY-MM-DD");
        console.log(date);
        let tmp = date.substr(0, 4) + "-" + date.substr(5, 2) + "-15";
        that.setShowDate(tmp);
      });
    document
      .getElementsByClassName("fc-next-button")[0]
      .addEventListener("click", function () {
        let calendarApi = that.$refs.fullCalendar.getApi();
        let date = that.$moment(calendarApi.getDate()).format("YYYY-MM-DD");
        console.log(date);
        let tmp = date.substr(0, 4) + "-" + date.substr(5, 2) + "-15";
        that.setShowDate(tmp);
      });
    document
      .getElementsByClassName("fc-today-button")[0]
      .addEventListener("click", function () {
        let calendarApi = that.$refs.fullCalendar.getApi();
        let date = that.$moment(calendarApi.getDate()).format("YYYY-MM-DD");
        console.log(date);
        let tmp = date.substr(0, 4) + "-" + date.substr(5, 2) + "-15";
        that.setShowDate(tmp);
      });

    this.uploader = {
      url: `${this.server}/eventimage`,
      autoUpload: false,
      allowedMimeType: ["image/png", "image/jpeg"],
    };

    if (this.$route.params.id) {
      this.idTraidoTaller = this.$route.params.id;
    }

    // this._route.params.subscribe(params => {
    //     if (params.hasOwnProperty('id'))
    //         this.idTraidoTaller = params.id;
    // });
    // this._ngxUiService.start();
    this.rol = JSON.parse(localStorage.getItem("usuario")).rol;
    this.traerGrupos();
    this.traerTareas();
    this.fetchEvents();

    // this.form = this.formBuilder.group({
    //     imagen: ['']
    // });
    let calendarEl = document.getElementById("calendar");
    console.log("calendar!!!!!!!!!!!!!!!!", calendarEl);
    //let FullCalendar = new FullCalendar(calendarEl, {
    // initialView: 'dayGridMonth',
    // initialDate: '2020-06-07',
    // events: [
    //   {
    //     title: 'All Day Event',
    //     start: '2020-06-01',
    //     customHtml: '<div class="fc-daygrid-event-dot" style="border-color: rgb(51, 122, 183);"></div><div class="fc-daygrid-event-dot" style="border-color: rgb(51, 122, 183);"></div>this is <strong>really cool</strong>'
    //   }
    // ],

    //});

    //FullCalendar.render();
  },
  methods: {
    updateFechaCalendar(info) {
        info.dayEl.style.backgroundColor = 'red';
        this.$emit('set-fecha',this.$moment(info.dateStr).format("DD/MM/YYYY"),this.fechaindex);
    },
    oncancel() {},
    async eliminarEvento() {
      let id = document.getElementById("eventForm")["eventId"].value;
      console.log("eliminar evento", id);
      let res = await HTTP.delete(`/api/event/` + id);
      if (res) {
        // $.ajax({
        //     url: `${environment.API_URL}/event/` + id,
        //     type: "DELETE"
        // }).done(function (response) {
        // });
        this.$refs.toastr.s("Evento eliminado");
        //document.getElementById("openMod").click();
        this.$bvModal.hide("myModalHorizontal");
        // this.events = this.events.filter(x => x.meta.id != id);
        //this.dataUsers = this.dataUsers.filter(x => x.id != id);
        this.traerTareas();
        this.fetchEvents();

        console.log("this.dataUsers------------>", this.dataUsers);
      }
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // Filter system files or hide files
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent();
        }
        // Filter php html js file
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent();
        }
        // Automatic compression
        if (
          newFile.file &&
          newFile.type.substr(0, 6) === "image/" &&
          this.autoCompress > 0 &&
          this.autoCompress < newFile.size
        ) {
          newFile.error = "compressing";
          const imageCompressor = new ImageCompressor(null, {
            convertSize: Infinity,
            maxWidth: 512,
            maxHeight: 512,
          });
          imageCompressor
            .compress(newFile.file)
            .then((file) => {
              this.$refs.upload.update(newFile, {
                error: "",
                file,
                size: file.size,
                type: file.type,
              });
            })
            .catch((err) => {
              this.$refs.upload.update(newFile, {
                error: err.message || "compress",
              });
            });
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        // 创建 blob 字段
        newFile.blob = "";
        let URL = window.URL || window.webkitURL;
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file);
        }
        // Thumbnails
        // 缩略图
        newFile.thumb = "";
        if (newFile.blob && newFile.type.substr(0, 6) === "image/") {
          newFile.thumb = newFile.blob;
        }
      }
    },
    // add, update, remove File Event
    inputFile(newFile, oldFile) {
      if (newFile && oldFile) {
        // update
        if (newFile.active && !oldFile.active) {
          // beforeSend
          // min size
          if (
            newFile.size >= 0 &&
            this.minSize > 0 &&
            newFile.size < this.minSize
          ) {
            this.$refs.upload.update(newFile, { error: "size" });
          }
        }
        if (newFile.progress !== oldFile.progress) {
          // progress
        }
        if (newFile.error && !oldFile.error) {
          // error
        }
        if (newFile.success && !oldFile.success) {
          // success
        }
      }
      if (!newFile && oldFile) {
        // remove
        if (oldFile.success && oldFile.response.id) {
          // $.ajax({
          //   type: 'DELETE',
          //   url: '/upload/delete?id=' + oldFile.response.id,
          // })
        }
      }
      // Automatically activate upload
      if (
        Boolean(newFile) !== Boolean(oldFile) ||
        oldFile.error !== newFile.error
      ) {
        if (this.uploadAuto && !this.$refs.upload.active) {
          this.$refs.upload.active = true;
        }
      }
    },
    alert(message) {
      alert(message);
    },
    onEditFileShow(file) {
      this.editFile = { ...file, show: true };
      this.$refs.upload.update(file, { error: "edit" });
    },
    onEditorFile() {
      if (!this.$refs.upload.features.html5) {
        this.alert("Your browser does not support");
        this.editFile.show = false;
        return;
      }
      let data = {
        name: this.editFile.name,
      };
      if (this.editFile.cropper) {
        let binStr = atob(
          this.editFile.cropper
            .getCroppedCanvas()
            .toDataURL(this.editFile.type)
            .split(",")[1]
        );
        let arr = new Uint8Array(binStr.length);
        for (let i = 0; i < binStr.length; i++) {
          arr[i] = binStr.charCodeAt(i);
        }
        data.file = new File([arr], data.name, { type: this.editFile.type });
        data.size = data.file.size;
      }
      this.$refs.upload.update(this.editFile.id, data);
      this.editFile.error = "";
      this.editFile.show = false;
    },
    // add folder
    onAddFolder() {
      if (!this.$refs.upload.features.directory) {
        this.alert("Your browser does not support");
        return;
      }
      let input = document.createElement("input");
      input.style =
        "background: rgba(255, 255, 255, 0);overflow: hidden;position: fixed;width: 1px;height: 1px;z-index: -1;opacity: 0;";
      input.type = "file";
      input.setAttribute("allowdirs", true);
      input.setAttribute("directory", true);
      input.setAttribute("webkitdirectory", true);
      input.multiple = true;
      document.querySelector("body").appendChild(input);
      input.click();
      input.onchange = (e) => {
        this.$refs.upload.addInputFile(input).then(function () {
          document.querySelector("body").removeChild(input);
        });
      };
    },
    onAddData() {
      this.addData.show = false;
      if (!this.$refs.upload.features.html5) {
        this.alert("Your browser does not support");
        return;
      }
      let file = new window.File([this.addData.content], this.addData.name, {
        type: this.addData.type,
      });
      this.$refs.upload.add(file);
    },

    ////////////////////////////
    async crearEvento() {
      let that = this;
      let form = document.getElementById("eventForm");
      console.log(form);
      let day = form["dia"].value.substring(0, 2);

      let month = form["dia"].value.substring(3, 5);
      let year = form["dia"].value.substring(6);
      let gruposTmp = [];
      for await (let item of this.gruposSeleccionados) {
        gruposTmp.push(item.id);
      }

      let assistants = gruposTmp.toString();

      let obj = {
        tarea: this.tarea.tarea,
        descripcion: this.tarea.desc,
        nombre: this.tarea.nombre,
        telefono: this.tarea.telefono,
        direccion: this.tarea.direccion === "" ? "." : this.tarea.direccion,
        hora_inicio: this.tarea.horario,
        dia: this.$moment(year + "-" + month + "-" + day).format("YYYY-MM-DD"),
        grupos: assistants,
        latitud: this.latitud,
        longitud: this.longitud,
      };

      if (
        obj.tarea == "" ||
        obj.descripcion == "" ||
        obj.nombre == "" ||
        obj.telefono == "" ||
        obj.hora_inicio == "" ||
        obj.direccion == "" ||
        obj.dia == ""
      ) {
        console.log(obj);
        that.$refs.toastr.i("Faltan completar datos");
      } else {
        console.log(obj);
        let dataRes = await HTTP.post(`/api/event`, obj);
        if (dataRes) {
          let res = dataRes.data;
          //that.cargandoEvento = true;
          // $.ajax({
          //     url: `${environment.API_URL}/event`,
          //     type: "POST",
          //     data: obj
          // }).done(function (response) {

          that.$refs.toastr.s("Evento creado");
          // let hora = this.$moment(obj.dia).add("00", 'seconds')
          //     .add("00", 'minutes')
          //     .add("00", "hours").toString();
          let hora = this.$moment(obj.dia).format("YYYY-MM-DD hh:mm:ss");
          res.dia = hora;
          console.log("seguimiento...............", res);
          console.log("seguimiento...............", hora);
          this.traerTareas();
          this.fetchEvents();

          //this.dataEvents.push(res)
          //that.agregarEventoCalendario(res);

          //that.refresh.next();
          //fotos
          // if (that.uploader.queue.length > 0) {
          //     that.idEvento = response.id;
          //     that.uploader.uploadAll();
          // }

          // $('myModalHorizontal').modal('hide');
          if (that.files.length > 0) {
            let idEvento = res.id;
            for await (let item of that.files) {
              item.data.id = idEvento;
              that.postAction = `http://staging.mlplak.com/server/api/eventimage`;
              that.$refs.upload.active = true;
              let result = await that.$refs.upload.update(item, {
                active: true,
              });
              console.log("item---->", item);
              that.archivo++;
            }
            setTimeout(async () => {
              for await (let element of that.$refs.upload.files) {
                console.log(element.name, " ", element.success);
                that.$refs.toastr.s(`${element.name} subido correctamente`);
              }
              this.files = [];
            }, 2000);
          }
          this.$bvModal.hide("myModalHorizontal");
        }
      }
    },
    changeM() {
      alert("change");
    },
    handleEventClick(clickInfo) {
      alert("clic");
      console.log(clickInfo);
      // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      //   clickInfo.event.remove()
      // }
    },
    monthSelect($event) {
      // let that = this;
      // document.getElementsByClassName('fc-prev-button')[0].addEventListener('click', function() {

      //   let date = that.$moment(calendarApi.getDate()).format('YYYY-MM-DD');
      //   console.log(date)
      //   let tmp = date.substr(0,4)+'-'+date.substr(5,2) + '-15'
      //   that.setShowDate(tmp)
      // });

      let tmp =
        $event.target.value.substr(0, 4) +
        "-" +
        $event.target.value.substr(5, 2) +
        "-15";
      console.log(tmp);
      let d = new Date(tmp);
      let calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.gotoDate(d);
      this.setShowDate(d);
      //alert(d)
      //return
      //let first = this.$moment(ini.setDate(ini.getDate()-8)).format("YYYY-MM-DD")
      // this.showDate= d
      // alert(this.showDate)
      // this.dateStart = d
      // this.traerTareas();
      // this.fetchEvents()
    },
    async cargarImagenesEvento(id) {
      this.cargandoEvento = true;
      let dataImagenes = await HTTP.get(`/api/eventimage/thumbs/${id}`);
      dataImagenes = dataImagenes.data;
      console.log("imagenes!!!!!!!!!!", dataImagenes);
      if (dataImagenes) {
        this.currentEventImagePath = dataImagenes.path + "/";
        console.log("currentEventImagePath--", this.currentEventImagePath);
        this.currentEventImages = [];
        dataImagenes.imagenes.forEach((item, index) => {
          this.currentEventImages.push(item);
        });
        // this.ref.detectChanges();
        this.cargandoEvento = false;
      }
    },
    async actualizarEvento() {
      let that = this;
      let form = document.getElementById("eventForm");
      // alert(form["eventId"].value)

      let day = this.tarea.dia.substring(0, 2);
      let month = this.tarea.dia.substring(3, 5);
      let year = this.tarea.dia.substring(6);
      let gruposTmp = [];
      for await (let item of this.gruposSeleccionados) {
        gruposTmp.push(item.id);
      }

      let obj = {
        tarea: this.tarea.tarea,
        descripcion: this.tarea.desc,
        nombre: this.tarea.nombre,
        telefono: this.tarea.telefono,
        direccion: this.tarea.direccion,
        hora_inicio: this.tarea.horario,
        dia: this.$moment(year + "-" + month + "-" + day).format("YYYY-MM-DD"),
        grupos: gruposTmp.toString(),
        assistants: null,
        latitud: this.latitud,
        longitud: this.longitud,
      };

      if (
        obj.tarea == "" ||
        obj.descripcion == "" ||
        obj.nombre == "" ||
        obj.telefono == "" ||
        obj.hora_inicio == "" ||
        obj.direccion == "" ||
        obj.dia == ""
      )
        this._toastr.info("Faltan completar datos");
      else {
        let dataRes = await HTTP.patch(
          `/api/event/` + form["eventId"].value,
          obj
        );
        if (dataRes) {
          if (that.files.length > 0) {
            //that.cargandoEvento = true;
            that.idEvento = form["eventId"].value;
            that.idArchivo = 0;
            for await (let item of that.files) {
              // that.files.forEach(item => {
              item.data.id = that.idEvento;
              that.postAction = `http://staging.mlplak.com/server/api/eventimage`;
              that.$refs.upload.active = true;
              let result = await that.$refs.upload.update(item, {
                active: true,
              });
              console.log("item---->", item);
              // let resultado = that.$refs.upload.files[that.archivo].success
              // if (resultado=== true){
              //   that.$refs.toastr.s(`${that.$refs.upload.files[that.archivo].name} subido correctamente`);
              // }
              that.archivo++;
            }
            setTimeout(async () => {
              for await (let element of that.$refs.upload.files) {
                console.log(element.name, " ", element.success);
                that.$refs.toastr.s(`${element.name} subido correctamente`);
              }
              this.$bvModal.hide("myModalHorizontal");
              this.files = [];
            }, 2000);
          } else {
            // let evento = that.events.filter(x => x.meta.id == form["eventId"].value && x.meta.hasOwnProperty('tarea'));
            let evento = that.dataEvents.filter(
              (x) => x.id == form["eventId"].value
            );
            let idt = that.dataEvents.findIndex(
              (x) => (x.id = form["eventId"].value)
            );
            // console.log('index', indiceDataevents)
            console.log("evento else--------------->", evento);
            console.log(obj);
            // evento[0].meta.id = form["eventId"].value;
            // evento[0].meta.tarea = obj.tarea;
            // evento[0].meta.descripcion = obj.descripcion;
            // evento[0].meta.nombre = obj.nombre;
            // evento[0].meta.telefono = obj.telefono;
            // evento[0].meta.direccion = obj.direccion;
            // evento[0].meta.hora_inicio = obj.hora_inicio;
            // evento[0].meta.dia = obj.dia;
            // evento[0].meta.assistants = obj.assistants;

            this.dataEvents[idt].id = form["eventId"].value;
            this.dataEvents[idt].tarea = obj.tarea;
            this.dataEvents[idt].descripcion = obj.descripcion;
            this.dataEvents[idt].nombre = obj.nombre;
            this.dataEvents[idt].telefono = obj.telefono;
            this.dataEvents[idt].direccion = obj.direccion;
            this.dataEvents[idt].hora_inicio = obj.hora_inicio;
            this.dataEvents[idt].dia = obj.dia;
            this.dataEvents[idt].assistants = obj.assistants;
            this.dataEvents[idt].grupos = gruposTmp;

            // let arrayGrupos = [];

            // if (obj.grupos.length != 0) {
            //     let arr = obj.grupos.split(',');
            //     arr.forEach(id => {
            //         arrayGrupos.push(+id);
            //     });
            // };

            // evento[0].meta.grupos = gruposTmp;

            // that.eventoSeleccionado = evento[0].meta;
            // that.refresh.next();

            // if (that.uploader.queue.length == 0)
            this.$bvModal.hide("myModalHorizontal");

            // $('#myModalHorizontal').modal('hide');
          }
        }
      }
      //  this.traerCalendario();
    },
    async actualizarProyecto() {
      let that = this;
      let grupos = []; //(this.gruposSeleccionados == null) ? null : this.gruposSeleccionados.toString();
      //
      if (this.gruposSeleccionados === null) {
        grupos = null;
      } else {
        for await (let item of this.gruposSeleccionados) {
          grupos.push(item.id);
        }
      }
      grupos = grupos.toString();
      let obj = {
        grupos,
        observaciones: this.observacionesProyecto,
      };
      console.log(obj);
      let theId = this.dataModal["projectId"]; //that.proyectId// (document.getElementById("proyectId"));
      console.log(theId);
      let result = await HTTP.patch(`/api/proyectos/` + theId, obj);
      if (result) {
        // $.ajax({
        //     url: `${environment.API_URL}/proyectos/` + theId.value,
        //     type: "PATCH",
        //     data: obj
        // }).done(function (response) {
        that.gruposSeleccionados = "";

        // let arrayGrupos = [];

        // if (response.grupos.length != 0) {
        //     let arr = response.grupos.split(',');
        //     arr.forEach(id => {
        //         arrayGrupos.push(+id);
        //     });
        // };
        console.log(result);
        let res = result.data;
        res.grupos = grupos.split(",").map(Number);
        console.log(res);
        that.eventoSeleccionado = res;
        let indiceProyecto = this.dataUsers.findIndex((x) => x.id === theId);
        this.dataUsers[indiceProyecto].grupos = res.grupos;
        this.dataUsers[indiceProyecto].observaciones = res.observaciones;
        //that.refresh.next();
        //});
      }
      //$('#Calendarmodal').modal('hide');
      this.$bvModal.hide("Calendarmodal");

      //  this.getevents();
      //this.getevents();
    },

    goToTallerWithProkectId() {
      //let projectId = this.dataModal.projectId //this.$refs.proyectId.value // document.getElementById("proyectId").value;
      //console.log('pjt',this.dataModal.projectId)

      localStorage.setItem("currentProject", this.dataModal.projectId);

      //por algun motivo estos overlays se quedaban activos al ir a taller
      // let paras = document.getElementsByClassName('modal-backdrop fade in') //as HTMLCollectionOf<HTMLElement>;
      // for (let i = 0; i < paras.length; i++) {
      //     paras[i].style.display = "none";
      // }

      this.$bvModal.hide("Calendarmodal");

      // $("#Calendarmodal").modal("hide");

      //this.router.navigateByUrl('/taller');
      this.$router.push("/taller");



    },
    placeMarker($event) {
      console.log("placemarker", $event);
      let coords = JSON.parse(JSON.stringify($event.latLng.toJSON(), null, 2));

      console.log("placemarker", coords.lat);

      this.latitud = coords.lat;
      this.longitud = coords.lng;
      this.obtenerDireccion(coords.lat, coords.lng);
      this.verificarDireccion(coords.lat, coords.lng);
    },
    verificarDireccion(latitud, longitud) {
      let geoCoder = new google.maps.Geocoder();
      if (geoCoder) {
        geoCoder.geocode(
          { location: { lat: latitud, lng: longitud } },
          (results, status) => {
            if (status === "OK") {
              if (results[0]) {
                let form = document.getElementById("eventForm");
                form["direccion"].value = results[0].formatted_address;
              }
            }
          }
        );
      }
    },
    obtenerDireccion(latitud, longitud) {
      let geoCoder = new google.maps.Geocoder();
      if (geoCoder) {
        geoCoder.geocode(
          { location: { lat: latitud, lng: longitud } },
          (results, status) => {
            if (status === "OK") {
              if (results[0]) {
                this.direccion = results[0].formatted_address;
              }
            }
          }
        );
      }
    },
    /*async detalleCalendario(item) {
      item = item.event;
      console.log("item", item);
    },
    async detalleCalendario(item) {
      item = item.event;
      console.log("item", item);
      this.btMdHorizontal.update = false;
      this.btMdHorizontal.save = true;
      this.btMdHorizontal.delete = false;

      console.log(item.id);
      this.modalDetalleSaldo = null;
      let detalle = {};
      if (item.id.toString().includes("tarea")) {
        let id = item.id.substr(6, item.id.length + 1);
        for await (let itemTmp of this.dataEvents) {
          if (itemTmp.id == id) {
            detalle = itemTmp;
          }
        }
      } else {
        for await (let itemTmp of this.dataUsers) {
          if (itemTmp.id == item.id) {
            detalle = itemTmp;
          }
        }
      }
      console.log(detalle);

      //pendiente
      //this.proyectoService.getCajaMetadata(detalle.id).subscribe(response => {
      // let response = await ProyectoService.getCajaMetadata(detalle.id)
      // console.log(response)
      //this.modalDetalleSaldo = response.saldo;

      ////////////////

      this.gruposSeleccionados = [];
      this.proyectoTerminado = detalle.finalizado;
      console.log("proyectoTerminado", this.proyectoTerminado);
      //this.gruposSeleccionados = detalle.grupos ===null ? []: detalle.grupos;
      console.log("uuuuuuuuuuuu", detalle);
      console.log("uuuuuuuuuuuu", detalle.grupos);
      if (detalle.grupos === null) {
        this.gruposSeleccionados = [];
      } else {
        for await (let item of detalle.grupos) {
          for await (let it of this.grupos) {
            if (it.id === item) this.gruposSeleccionados.push(it);
          }
        }
      }

      console.log("detalle.grupos", this.gruposSeleccionados);
      if (detalle.hasOwnProperty("tarea")) {
        // document.getElementById("openMod").click();
        this.$bvModal.show("myModalHorizontal");

        ////////
        //document.getElementById("updateEvent").style.display = "block";
        this.btMdHorizontal.update = true;

        //this.$refs.updateEvent.style.display = "block";

        if (this.rol == "Administrador") this.btMdHorizontal.delete = true;
        this.btMdHorizontal.save = false;

        //     document.getElementById("deleteEvent").style.display = "block";
        // document.getElementById("saveEvent").style.display = "none";
        ////////

        this.currentEventImages = [];

        this.gruposSeleccionados = [];
        if (detalle.grupos === null) {
          this.gruposSeleccionados = [];
        } else {
          for await (let item of detalle.grupos) {
            for await (let it of this.grupos) {
              if (it.id === item) this.gruposSeleccionados.push(it);
            }
          }
        }
        console.log("gruposeleccionados----------->", this.gruposSeleccionados);
        if (detalle.latitud != "") {
          this.latitud = +detalle.latitud;
          this.longitud = +detalle.longitud;
          console.log(this.latitud);
          this.obtenerDireccion(+detalle.latitud, +detalle.longitud);
        }

        //let form = document.getElementById("eventForm");

        // form["tarea"].value = detalle.tarea;
        // form["desc"].value = detalle.descripcion;
        // form["nombre"].value = detalle.nombre;
        // form["telefono"].value = detalle.telefono;
        // form["direccion"].value = detalle.direccion;
        // form["horario"].value = detalle.hora_inicio;
        // form["dia"].value = moment(detalle.dia).format('DD-MM-YYYY');;
        // form["eventId"].value = detalle.id;
        this.tarea.tarea = detalle.tarea;
        this.tarea.desc = detalle.descripcion;
        this.tarea.nombre = detalle.nombre;
        this.tarea.telefono = detalle.telefono;
        this.tarea.direccion = detalle.direccion;
        this.tarea.horario = detalle.hora_inicio;
        this.tarea.dia = this.$moment(detalle.dia).format("DD-MM-YYYY");
        this.tarea.eventId = detalle.id;
        //pendiente
        this.cargarImagenesEvento(detalle.id);
      } else {
        let title = `${detalle.cliente.nombre_completo} - ${detalle.proyecto}`;
        this.dataModal["projectId"] = detalle.id;

        //$('#Calendarmodal').modal('show');
        //$('.modal-title').html('Detalle');

        //let idPro = (document.getElementById("proyectId"));
        //idPro.value = detalle.id;

        this.observacionesProyecto =
          detalle.observaciones === null ? "" : detalle.observaciones;
        let porcejPiezas = detalle.progreso_total.porcentaje_piezas.toFixed(2);
        let porcejStock = detalle.progreso_total.porcentaje_stock.toFixed(2);
        let porcejTapacantos = detalle.progreso_total.porcentaje_tapacantos.toFixed(
          2
        );
        let porcejPrearmado = detalle.progreso_total.porcentaje_prearmados.toFixed(
          2
        );
        let porcejModulos = detalle.progreso_total.porcentaje_modulos.toFixed(
          2
        );
        let porcejCajones = detalle.progreso_total.porcentaje_cajones.toFixed(
          2
        );

        let total = detalle.progreso_total.total.toFixed(2);

        // document.getElementById("clientePlace").innerHTML = `<b>${title}</b>`;
        this.dataModal["clientePlace"] = title;
        // this.$refs.clientePlace.v-html(`<b>${title}</b>`);
        // document.getElementById("datePlace").innerHTML = moment(detalle.instalacion_fecha).format("DD-MM-YYYY");
        this.dataModal["datePlace"] = this.$moment(
          detalle.instalacion_fecha
        ).format("DD-MM-YYYY");
        // document.getElementById("hourPlace").innerHTML = `${moment(detalle.instalacion_fecha).format("hh:mm")}hs`;
        this.dataModal["hourPlace"] = `${this.$moment(
          detalle.instalacion_fecha
        ).format("hh:mm")}hs`;
        // document.getElementById("tipoTrabajo").innerHTML = detalle.proyecto;
        this.dataModal["tipoTrabajo"] = detalle.proyecto;
        // document.getElementById("comment").innerHTML = detalle.instalacion_comentario;
        this.dataModal["comment"] = detalle.instalacion_comentario;
        // document.getElementById("phone").innerHTML = detalle.cliente.telefono;
        this.dataModal["phone"] = detalle.cliente.telefono;
        // document.getElementById("address").innerHTML = detalle.cliente.direccion;
        this.dataModal["address"] = detalle.cliente.direccion;
        // document.getElementById("piezasPorcej").innerHTML = porcejPiezas + "%";
        this.dataModal["piezasPorcej"] = porcejPiezas + "%";
        this.dataModal["piezasPorcejStyleWidth"] = porcejPiezas + "%";
        // document.getElementById("piezasPorcej").style.width = porcejPiezas + "%";
        //console.log(this.dataModal)
        if (parseFloat(porcejPiezas) > 1 && parseFloat(porcejPiezas) < 70)
          this.dataModal["piezasPorcejStylebackgroundColor"] = "#9E9E1F";
        // document.getElementById("piezasPorcej").style.backgroundColor = '#9E9E1F';
        else if (
          parseFloat(porcejPiezas) > 70 &&
          parseFloat(porcejPiezas) < 100
        )
          this.dataModal["piezasPorcejStylebackgroundColor"] = "#CFCF26";
        // document.getElementById("piezasPorcej").style.backgroundColor = '#CFCF26';
        else if (parseFloat(porcejPiezas) > 99)
          this.dataModal["piezasPorcejStylebackgroundColor"] = "#05A730";
        // document.getElementById("piezasPorcej").style.backgroundColor = '#05A730';
        else this.dataModal["piezasPorcejStylebackgroundColor"] = "#337ab7";
        // document.getElementById("piezasPorcej").style.backgroundColor = '#337ab7';

        // document.getElementById("tapacantosPorcej").innerHTML = porcejTapacantos + "%";
        // document.getElementById("tapacantosPorcej").style.width = porcejTapacantos + "%";
        this.dataModal["tapacantosPorcej"] = porcejTapacantos + "%";
        this.dataModal["tapacantosPorcejStyleWidth"] = porcejTapacantos + "%";
        if (
          parseFloat(porcejTapacantos) > 1 &&
          parseFloat(porcejTapacantos) < 70
        )
          this.dataModal["tapacantosPorcejStylebackgroundColor"] = "#9E9E1F";
        //     document.getElementById("tapacantosPorcej").style.backgroundColor = '#9E9E1F';
        else if (
          parseFloat(porcejTapacantos) > 70 &&
          parseFloat(porcejTapacantos) < 100
        )
          this.dataModal["tapacantosPorcejStylebackgroundColor"] = "#CFCF26";
        //     document.getElementById("tapacantosPorcej").style.backgroundColor = '#CFCF26';
        else if (parseFloat(porcejTapacantos) > 99)
          this.dataModal["tapacantosPorcejStylebackgroundColor"] = "#05A730";
        //     document.getElementById("tapacantosPorcej").style.backgroundColor = '#05A730';
        else this.dataModal["tapacantosPorcejStylebackgroundColor"] = "#337ab7";
        //     document.getElementById("tapacantosPorcej").style.backgroundColor = '#337ab7';

        // document.getElementById("prearmadoPorcej").innerHTML = porcejPrearmado + "%";
        // document.getElementById("prearmadoPorcej").style.width = porcejPrearmado + "%";
        this.dataModal["prearmadoPorcej"] = porcejPrearmado + "%";
        this.dataModal["prearmadoPorcejStyleWidth"] = porcejPrearmado + "%";
        if (parseFloat(porcejPrearmado) > 1 && parseFloat(porcejPrearmado) < 70)
          this.dataModal["prearmadoPorcejStylebackgroundColor"] = "#9E9E1F";
        //     document.getElementById("prearmadoPorcej").style.backgroundColor = '#9E9E1F';
        else if (
          parseFloat(porcejPrearmado) > 70 &&
          parseFloat(porcejPrearmado) < 100
        )
          this.dataModal["prearmadoPorcejStylebackgroundColor"] = "#CFCF26";
        //     document.getElementById("prearmadoPorcej").style.backgroundColor = '#CFCF26';
        else if (parseFloat(porcejPrearmado) > 99)
          this.dataModal["prearmadoPorcejStylebackgroundColor"] = "#05A730";
        //     document.getElementById("prearmadoPorcej").style.backgroundColor = '#05A730';
        else this.dataModal["prearmadoPorcejStylebackgroundColor"] = "#337ab7";
        //     document.getElementById("prearmadoPorcej").style.backgroundColor = '#337ab7';

        this.dataModal["porcejCajones"] = porcejCajones + "%";
        this.dataModal["porcejCajonesStyleWidth"] = porcejCajones + "%";

        // document.getElementById("cajonesPorcej").innerHTML = porcejCajones + "%";
        // document.getElementById("cajonesPorcej").style.width = porcejCajones + "%";

        if (parseFloat(porcejCajones) > 1 && parseFloat(porcejCajones) < 70)
          this.dataModal["porcejCajonesStylebackgroundColor"] = "#9E9E1F";
        //     document.getElementById("cajonesPorcej").style.backgroundColor = '#9E9E1F';
        else if (
          parseFloat(porcejCajones) > 70 &&
          parseFloat(porcejCajones) < 100
        )
          this.dataModal["porcejCajonesStylebackgroundColor"] = "#CFCF26";
        //     document.getElementById("cajonesPorcej").style.backgroundColor = '#CFCF26';
        else if (parseFloat(porcejCajones) > 99)
          this.dataModal["porcejCajonesStylebackgroundColor"] = "#05A730";
        //     document.getElementById("cajonesPorcej").style.backgroundColor = '#05A730';
        else this.dataModal["porcejCajonesStylebackgroundColor"] = "#337ab7";
        //     document.getElementById("cajonesPorcej").style.backgroundColor = '#337ab7';

        this.dataModal["modulosPorcej"] = porcejModulos + "%";
        this.dataModal["modulosPorcejStyleWidth"] = porcejModulos + "%";
        // document.getElementById("modulosPorcej").innerHTML = porcejModulos + "%";
        // document.getElementById("modulosPorcej").style.width = porcejModulos + "%";

        if (parseFloat(porcejModulos) > 1 && parseFloat(porcejModulos) < 70)
          this.dataModal["modulosPorcejStylebackgroundColor"] = "#9E9E1F";
        //     document.getElementById("modulosPorcej").style.backgroundColor = '#9E9E1F';
        else if (
          parseFloat(porcejModulos) > 70 &&
          parseFloat(porcejModulos) < 100
        )
          this.dataModal["modulosPorcejStylebackgroundColor"] = "#CFCF26";
        //     document.getElementById("modulosPorcej").style.backgroundColor = '#CFCF26';
        else if (parseFloat(porcejModulos) > 99)
          this.dataModal["modulosPorcejStylebackgroundColor"] = "#05A730";
        //     document.getElementById("modulosPorcej").style.backgroundColor = '#05A730';
        else this.dataModal["modulosPorcejStylebackgroundColor"] = "#337ab7";

        //     document.getElementById("modulosPorcej").style.backgroundColor = '#337ab7';

        this.dataModal["totalPorcej"] = total + "%";
        this.dataModal["totalPorcejStyleWidth"] = total + "%";

        // document.getElementById("totalPorcej").innerHTML = "<u><b>" + total + "%</b></u>";
        // document.getElementById("totalPorcej").style.width = total + "%";

        if (parseFloat(total) > 1 && parseFloat(total) < 70)
          // document.getElementById("totalPorcej").style.backgroundColor = '#9E9E1F';
          this.dataModal["totalPorcejStylebackgroundColor"] = "#9E9E1F";
        else if (parseFloat(total) > 70 && parseFloat(total) < 100)
          this.dataModal["totalPorcejStylebackgroundColor"] = "#CFCF26";
        // document.getElementById("totalPorcej").style.backgroundColor = '#CFCF26';
        else if (parseFloat(total) > 99)
          this.dataModal["totalPorcejStylebackgroundColor"] = "#05A730";
        // document.getElementById("totalPorcej").style.backgroundColor = '#05A730';
        else this.dataModal["totalPorcejStylebackgroundColor"] = "#337ab7";
        // document.getElementById("totalPorcej").style.backgroundColor = '#337ab7';

        // document.getElementById("stockPorcej").innerHTML = porcejStock + "%";
        // document.getElementById("stockPorcej").style.width = porcejStock + "%";
        this.dataModal["stockPorcej"] = porcejStock + "%";
        this.dataModal["stockPorcejStyleWidth"] = porcejStock + "%";
        if (parseFloat(porcejStock) > 1 && parseFloat(porcejStock) < 70)
          this.dataModal["stockPorcejStylebackgroundColor"] = "#9E9E1F";
        //     document.getElementById("stockPorcej").style.backgroundColor = '#9E9E1F';
        else if (parseFloat(porcejStock) > 70 && parseFloat(porcejStock) < 100)
          this.dataModal["stockPorcejStylebackgroundColor"] = "#CFCF26";
        //     document.getElementById("stockPorcej").style.backgroundColor = '#CFCF26';
        else if (parseFloat(porcejStock) > 99)
          this.dataModal["stockPorcejStylebackgroundColor"] = "#05A730";
        //     document.getElementById("stockPorcej").style.backgroundColor = '#05A730';
        else this.dataModal["stockPorcejStylebackgroundColor"] = "#337ab7";
        //     document.getElementById("stockPorcej").style.backgroundColor = '#337ab7';

        this.$bvModal.show("Calendarmodal");
      }
    },*/
    abrirGoogleMaps() {
      window.open(
        ` https://www.google.com/maps/?q=${this.latitud},${this.longitud}`
      );
    },
    removeFromQueue() {},
    async eliminarFotoEvento(imagen) {
      let eventId = document.getElementById("eventId").value;
      let dataResponse = await HTTP.delete(`/api/eventimage/${imagen}`);
      if (dataResponse) {
        this.cargarImagenesEvento(eventId);
      }
    },
    visualizarImagen(imagen) {
      // this._lightBox.open([{ src: imagen, thumb: imagen }], 0)
      this.imgs = [{ src: imagen, title: "" }];
      this.index = 1; // index of imgList
      this.visible = true;
    },
    handleHide() {
      this.visible = false;
    },

    async realizarTarea(tarea) {
      let result = await TareaService.update(tarea.id, tarea);
      console.log("realizar data--------------------->", result);
      if (result) {
        this.tarea = result.data;
        this.traerTareas();
      }
    },
    async agregarTarea(tarea, proceso) {
      if (event.keyCode == 13) {
        let { id } = JSON.parse(localStorage.getItem("usuario"));

        this.tareaPersonal = tarea;

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

        if (tarea.descripcion != "") {
          let data = await TareaService.store(this.tareaPersonal);
          if (data) {
            this.$refs.toastr.s("Tarea agregada");
            this.tareaPersonal.descripcion = "";
            this.traerTareas();
          } else {
            this.$refs.toastr.e("Error");
          }
        } else this.$refs.toastr.i("Complete la descripción");
      }
    },
    filtrarPorGrupo($event) {
      event = $event.target.value;
      console.log(event);
      let eventos = [];
      if (this.eventsAux.length == 0)
        // this.eventsAux = [...this.events];
        this.eventsAux = [...this.calendarOptions.events];

      console.log("this.eventsAux.length", this.eventsAux);
      if (event != 0) {
        this.eventsAux.forEach((element) => {
          if (element.meta.grupos != null) {
            let filtrosEncontrados = element.meta.grupos.find(
              (number) => number == +event
            );
            if (filtrosEncontrados != undefined) eventos.push(element);
          }
        });
      }

      if (eventos.length > 0)
        // this.events = eventos;
        this.calendarOptions.events = eventos;
      else {
        if (event != 0)
          this.$refs.toastr.i("No hay proyectos/eventos a cargo del grupo"); //this.$toastr.info("No hay proyectos/eventos a cargo del grupo");
        // this.events = this.eventsAux;
        this.calendarOptions.events = this.eventsAux;
      }
    },
    colorProgreso(progreso) {
      const cantidad = parseInt(progreso);
      if (cantidad == 0) return "#337ab7";
      else if (cantidad < 60) return "#dadc02";
      else if (cantidad < 100) return "#f4f566";
      else if (cantidad == 100) return "#5cb85c";
    },

   /* showpagesFirst(hide, show) {
      console.log("show----->", show);
      console.log("itemsToShowFirstFinal--->", this.itemsToShowFirst);
      let count = 0;
      let exists = true;
      console.log("asas", "#proyectoFirst-" + count);
      console.log("asas", this.$refs["#proyectoFirst-" + count.toString()]);
      while (exists) {
        if (document.getElementById("proyectoFirst-" + count.toString())) {
          // if (this.$refs['#proyectoFirst-' + count.toString()][0]) {
          //  this.$refs['#proyectoFirst-' + count.toString()].style.display="none"
          // this.$refs['#proyectoFirst-' + count].display='none'
          // document.querySelector('#proyectoFirst-' + count+'___BV_modal_body_').style.display="none"
          // document.getElementById("#proyectoFirst-" + count.toString()+'___BV_modal_body_').remove();
          //document.getElementById("#proyectoFirst-" + count.toString()+'___BV_modal_body_').style.display = 'none';
        } else {
          exists = false;
        }
        count++;
      }
      console.log("exists", exists);
      console.log(this.$refs["#proyectoFirst-" + show]);
      // if ( document.getElementById("#proyectoFirst-" + show)) {
      if (this.$refs["#proyectoFirst-" + show]) {
        console.log(
          "exists proyectoFirst",
          this.$refs["#proyectoFirst-" + show]
        );
        // document.getElementById("#proyectoFirst-" + show).style.display = 'block';
        // this.$refs['#proyectoFirst-' + count].style.display="block";
        let paras = document.getElementsByClassName("modal-backdrop fade in"); //as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < paras.length; i++) {
          paras[i].style.display = "none";
        }
        console.log("click en proyectoFirst");
        document.getElementById("#proyectoFirstOpen-" + show).click();
        // this.$refs['#proyectoFirstOpen-' + show].$el.click();
        this.myCarrouselPositionFirst = show;
      } else {
        if (this.itemsToShowFirst.length > 0) {
          console.log(
            "this.itemsToShowFirstFinal.length",
            this.itemsToShowFirst.length
          );
          this.showpagesFirst(-1, this.itemsToShowFirst.length - 1);
          this.myCarrouselPositionFirst = this.itemsToShowFirst.length - 1;
          let paras = document.getElementsByClassName("modal-backdrop fade in"); //as HTMLCollectionOf<HTMLElement>;
          for (let i = 0; i < paras.length; i++) {
            paras[i].style.display = "none";
          }
        }
      }
    },*/

    async traerProyectos(inicio, fin) {
      console.log("estoy en traer proyectos*******************");
      let dataUsers = await HTTP.get(`/api/proyectos/dates/${inicio}/${fin}/0`);
      dataUsers = dataUsers.data;
      console.log("result proyectos", dataUsers);
      if (dataUsers.proyectos) {
        // this._http.get(`${this.server}/proyectos/dates/${inicio}/${fin}`).subscribe(
        //   (dataUsers: any) => {
        let dataRes = dataUsers.proyectos.length || 0;
        console.log("dataRes---------->", dataRes);
        // if (dataRes > 0) {
        if (dataRes) {
          this.dataUsers = dataUsers.proyectos;
          this.calendarOptions.events = this.calendarOptions.events.concat(dataUsers.proyevent);
          dataUsers.proyectos.forEach(async (element, index) => {
            let total = element.progreso_total.total;
            let stockPorcentaje = element.progreso_total.porcentaje_stock;
            let stockClass = "";
            /*
            element.bolitas = [];

            if (stockPorcentaje > 1 && stockPorcentaje < 70)
              element.bolitas.push("#9E9E1F");
            else if (stockPorcentaje > 70 && stockPorcentaje < 100)
              element.bolitas.push("#CFCF26");
            else if (stockPorcentaje > 99) element.bolitas.push("#05A730");
            else element.bolitas.push("#337ab7");

            if (total > 1 && total < 70) element.bolitas.push("#9E9E1F");
            else if (total > 70 && total < 100) element.bolitas.push("#CFCF26");
            else if (total > 99) element.bolitas.push("#05A730");
            else element.bolitas.push("#337ab7");

            stockClass = "proyecto";
            */
            let arrayGrupos = [];

            if (element.grupos != null) {
              if (element.grupos.length != 0) {
                let arr = element.grupos.split(",");
                arr.forEach((id) => {
                  arrayGrupos.push(+id);
                });
              }
              element.grupos = arrayGrupos;
            }
            /*
            let itemBolitas = "";
            for await (let item of element.bolitas) {
              console.log("bolitas:", item);
              itemBolitas =
                itemBolitas +
                `<div class="fc-daygrid-event-dot" style="border-color: ${item}"  display:block !important"></div>`;
            }
            //itemBolitas = itemBolitas + "</span>";
            let elementoFinalizado;
            //<span *ngIf="event.meta.finalizado" [ngClass]="event.meta.observaciones == null || event.meta.observaciones == '' ? 'text-success' : 'text-warning'" class="fa fa-check position-check"></span>
            //<span *ngIf="!event.meta.finalizado && event.meta.observaciones" class="fa fa-exclamation-circle position-check text-warning"></span>
            if (!element.finalizado && element.observaciones) {
              itemBolitas = `<div class="" style="border-color: red width:25px" style="margin-left:3px;  display:block !important">
                          <img width="12px" style="margin:5px !important;padding:0px !important" src="https://upload.wikimedia.org/wikipedia/commons/c/c9/Exclamation_flat_icon.svg"></img></div>`;
            }
            if (element.finalizado) {
              itemBolitas = `<div class="" style="border-color: green; width:25px" style="margin-left:3px;  display:block !important">
                          <img width="14px" style="margin:5px !important;padding:1px !important" src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Check_green_icon.svg"></img></div>`;
            }
            //https://www.pinclipart.com/picdir/middle/182-1828224_file-mw-icon-checkmark-svg-creative-commons-check.png
            try {
              this.instalaciones = [];
              if (element.medicioninstalacion !==null)
                  this.instalaciones =element.medicioninstalacion;
            }
            catch (error) {
              console.log("Error: ", error);
              this.instalaciones = [];
            }
            console.log("Valores Instalaciones: " + element.id,this.instalaciones);
            let i = 0;
            let detail = "";
            if (!this.instalaciones.length) {
              this.calendarOptions.events.push({
                id: element.id,
                title: `${element.cliente.nombre_completo} - ${element.proyecto}`,
                start: this.$moment(element.instalacion_fecha).format(
                  "YYYY-MM-DD HH:MM:SS"
                ),
                end: this.$moment(element.instalacion_fecha).format(
                  "YYYY-MM-DD HH:MM:SS"
                ),
                classNames: ["stockClass", "eventBackg"],
                backgroundColor: element.bolitas[0],
                meta: element,
                customHtml:
                  `<div class="row"><div class="col-sm-8" style="white-space:normal; width:100%; display:block !important;word-wrap:break-word !important; font-size:9px;margin-right:2px">` +
                  `${element.cliente.nombre_completo} - ${element.proyecto}</div><div class="col-sm-2">${itemBolitas}</div></div>`,
              });
            }
            else {
              for await (let inst of this.instalaciones) {
                     i++;
                     if (i>1)
                        detail = "DIA " + i + ":";
                     this.calendarOptions.events.push({
                      id: element.id,
                      title: `${element.cliente.nombre_completo} - ${element.proyecto}`,
                      start: this.$moment(inst.fecha_medinst).format(
                        "YYYY-MM-DD HH:MM:SS"
                      ),
                      end: this.$moment(inst.fecha_medinst).format(
                        "YYYY-MM-DD HH:MM:SS"
                      ),
                      classNames: ["stockClass", "eventBackg"],
                      backgroundColor: element.bolitas[0],
                      meta: element,
                      customHtml:
                      `<div class="row"><div class="col-sm-8" style="white-space:normal; width:100%; display:block !important;word-wrap:break-word !important; font-size:9px;margin-right:2px">` +
                      `${detail} ${element.cliente.nombre_completo} - ${element.proyecto}</div><div class="col-sm-2">${itemBolitas}</div></div>`,
                    });
              }
            }*/
            this.cKey++;
            // console.log('ver evento', this.events)
            // this.eventsAux = this.events;
            this.eventsAux = this.calendarOptions.events;

            if (this.idTraidoTaller == null) {
              console.log("estoy en idraidotaller null");
              // let actualDate = moment().format('YYYY-MM-DD');
              let actualDate = this.$moment().format("YYYY-MM-DD");
              let fecha_corta = this.$moment(element.instalacion_fecha).format(
                "YYYY-MM-DD"
              ); //moment(element.instalacion_fecha).format("YYYY-MM-DD");
              console.log(fecha_corta);
              if (
                ((element.grupos == "" ||
                  element.grupos == null ||
                  element.grupos == "null") &&
                  (actualDate == fecha_corta ||
                    this.$moment(actualDate)
                      .add(1, "days")
                      .format("YYYY-MM-DD") == fecha_corta)) ||
                this.$moment(actualDate).add(2, "days").format("YYYY-MM-DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(3, "days").format("YYYY-MM-DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(4, "days").format("YYYY-MM-DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(5, "days").format("YYYY-MM-DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(6, "days").format("YYYY-MM-DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(7, "days").format("YYYY-MM-DD") ==
                  fecha_corta
              ) {
                let day = this.$moment(element.fecha_corta)
                  .locale("es")
                  .format("dddd");
                element.horaOriginal = this.$moment(
                  element.instalacion_fecha
                ).format("h:mm");
                element.fancyHeader =
                  day.charAt(0).toUpperCase() +
                  day.slice(1) +
                  " - " +
                  element.horaOriginal +
                  "hs";

                this.itemsToShowFirst.push(element);
              }

              if (this.isFirst) {
                console.log("estoy en isfirst");
                let dataOrdered = Array();

                for (let z = 0; z < this.itemsToShowFirst.length; z++) {
                  if (!dataOrdered[this.itemsToShowFirst[z].fecha_corta]) {
                    dataOrdered[this.itemsToShowFirst[z].fecha_corta] = Array();
                  }
                  dataOrdered[this.itemsToShowFirst[z].fecha_corta].push(
                    this.itemsToShowFirst[z]
                  );
                }
                let dataOrderedDates = Array();
                let myCount = 0;

                for (let key in dataOrdered) {
                  if (Object.keys(dataOrderedDates).length == 0) {
                    dataOrderedDates[myCount] = key;
                    myCount++;
                  } else {
                    let thisDate = new Date(key);
                    for (let i = 0; i < dataOrderedDates.length; i++) {
                      let dateToAnalyze = new Date(dataOrderedDates[i]);
                      if (thisDate < dateToAnalyze) {
                        let myLength = dataOrderedDates.length;
                        for (let j = myLength - 1; j >= i; j--) {
                          dataOrderedDates[j + 1] = dataOrderedDates[j];
                        }
                        dataOrderedDates[i] = key;
                        break;
                      }
                      if (
                        thisDate > dateToAnalyze &&
                        !dataOrderedDates[i + 1]
                      ) {
                        dataOrderedDates[i + 1] = key;
                        break;
                      }
                    }
                    myCount++;
                  }
                }
                let count = 0;

                for (let i = 0; i < dataOrderedDates.length; i++) {
                  for (let key in dataOrdered) {
                    if (key == dataOrderedDates[i]) {
                      for (let j = 0; j < dataOrdered[key].length; j++) {
                        this.itemsToShowFirstFinal[count] = dataOrdered[key][j];
                        count++;
                      }
                    }
                  }
                }
                console.log(
                  "itemsToShowFirstFinal---------------",
                  this.itemsToShowFirst
                );

                //document.getElementById("#proyectoFirstOpen-0").click();

                console.log(
                  "this.myCarrouselPositionFirst--------",
                  this.myCarrouselPositionFirst
                );
               /* setTimeout(() => {
                  if (this.isFirst) {
                    this.isFirst = false;
                    this.showpagesFirst(-1, this.myCarrouselPositionFirst);
                  }
                }, 1000);*/
              }
            } else {
              // let traerProyecto = this.events.filter(x => x.meta.id == this.idTraidoTaller);
              let traerProyecto = this.calendarOptions.events.filter(
                (x) => x.meta.id == this.idTraidoTaller
              );
              if (traerProyecto.length > 0)
                this.detalleCalendario(traerProyecto[0].meta);
            }
          });
        }
        // this.cargandoCalendario = false;
        // this._ngxUiService.stop();
      }
      this.loadingOff ++;
      if (this.loadingOff >= 7)
        this.loadingPage = false;
    },
    async agregarEventoCalendario(data) {
      console.log("en agregareventocalendario$$$$$$$$$$$$$$$$", data);
      let stockClass = "";
      if (data.tarea == "visita") stockClass = "red";
      else if (data.tarea == "pago") stockClass = "orange";
      else if (data.tarea == "medidas") stockClass = "grey";
      else if (data.tarea == "servicio") stockClass = "black";
      else if (data.tarea == "nota") stockClass = "white";
      else if (data.tarea == "tarea") stockClass = "violet";

      let arrayGrupos = [];

      if (data.grupos != null) {
        let arr = data.grupos.split(",");
        arr.forEach((id) => {
          arrayGrupos.push(+id);
        });
      }
      data.grupos = arrayGrupos;
      // title: data.tarea + " - " + data.hora_inicio+'HS',
      this.calendarOptions.events.push({
        id: "tarea-" + data.id,
        title: "",
        start: this.$moment(data.dia).format("YYYY-MM-DD HH:MM:SS"),
        end: this.$moment(data.dia).format("YYYY-MM-DD HH:MM:SS"),
        classNames: ["stockClass", "eventTBackg"],
        backgroundColor: stockClass,
        meta: data,
        customHtml: `<div class="row"><div class="col-sm-10" style="white-space:normal; width:100%; display:block !important;word-wrap:break-word !important; font-size:9px;">${
          data.tarea + " - " + data.hora_inicio
        }HS</div>
                <div class="col-sm-2"><div class="fc-daygrid-event-dot" style="border-color: ${stockClass}" style="margin-left:3px; display:block !important"></div></div></div>`,
      });
    },
    async traerEventos(inicio, fin) {
      //this._ngxUiService.start();
      this.loadingOff = 0;
      this.events = [];
      this.calendarOptions.events = [];
      //this.cargandoCalendario = true;
      //this._http.get(`${environment.API_URL}/event/dates/${inicio}/${fin}`).subscribe(
      let dataUsers = await HTTP.get(`/api/event/dates/${inicio}/${fin}`);
      dataUsers = dataUsers.data;
      console.log(
        "result00$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",
        dataUsers
      );
      if (dataUsers.events.length > 0) {
        console.log("datauser length>0");
        dataUsers.events = dataUsers.events.sort(
          (a, b) => b.hora_inicio - a.hora_inicio
        );
        dataUsers.events.forEach((element, index) => {
          console.log("foreach events", element);
          this.dataEvents.push(element);
          this.agregarEventoCalendario(element);
          if (this.idTraidoTaller == null) {
            let actualDate = this.$moment().format("YYYY/MM/DD");
            let fecha_corta = this.$moment(element.instalacion_fecha).format(
              "YYYY/MM/DD"
            );
            if (
              (element.grupos == "" || element.grupos == null) &&
              (actualDate == fecha_corta ||
                this.$moment(actualDate).add(1, "days").format("YYYY/MM/DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(2, "days").format("YYYY/MM/DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(3, "days").format("YYYY/MM/DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(4, "days").format("YYYY/MM/DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(5, "days").format("YYYY/MM/DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(6, "days").format("YYYY/MM/DD") ==
                  fecha_corta ||
                this.$moment(actualDate).add(7, "days").format("YYYY/MM/DD") ==
                  fecha_corta)
            ) {
              console.log("if final---", element.dia);
              element.dia_original = element.dia;
              element.horaOriginal = element.hora_inicio;
              // let day = this.$moment(element.fecha_corta).lang("es").format("dddd");
              let day = this.$moment(element.fecha_corta)
                .locale("es")
                .format("dddd");
              element.fancyHeader =
                day.charAt(0).toUpperCase() +
                day.slice(1) +
                " - " +
                element.horaOriginal +
                "hs";
              console.log("ln1770");
              this.itemsToShowFirst.push(element);
            }
          }
        });
      }
      this.traerProyectos(inicio, fin); //Proceso=1
      this.agregarCapacidadCalendarioV2(); //Proceso=2
      this.agregarCapacidadCalendario(); //Proceso=3
      this.traerProyectosDiseno(inicio, fin); //Proceso=4
      this.traerProyectosDisenoMed(inicio,fin); //Proceso=5
      this.agregarFeriadosCalendario(inicio, fin); //Proceso=6
      this.traerTareas(); //Proceso=7
    },
    async getAllFeriados() {
            let data = await FeriadoService.getAll()

            if (data){
                let feriados = data.feriados.sort(function (a, b) {
                    if (a.fecha < b.fecha)
                        return -1;
                    if (a.fecha > b.fecha)
                        return 1;
                    return 0;
                });
                return feriados;
            }
           return null;
    },
    async agregarFeriadosCalendario(inicio, fin) {
      console.log("Estoy en Feriado Calendario");
      let feriados = [];
      feriados = await this.getAllFeriados(inicio, fin);
      feriados.forEach((holyday,index) =>{
        console.log("Ciclo for en Feriado Calendario");
          this.calendarOptions.events.push({
                  start: this.$moment(holyday.fecha).format('YYYY-MM-DD HH:mm:ss'),
                  end: this.$moment(holyday.fecha).format('YYYY-MM-DD HH:mm:ss'),
                  allDay: true,
                  color: "red",
                  eventBorderColor: "red",
                  backgroundColor: "red",
                  customHtml: `<span style="color: red; white-space:normal; width:100%; display:block !important;word-wrap:break-word !important; font-size:10px;margin-right:2px">-</span>`,
                });
      });
      this.loadingOff ++;
      if (this.loadingOff >= 7)
        this.loadingPage = false;
    },

    async traerTareas() {
      var userid = localStorage.getItem('user-id');
      let datos = await HTTP.get(`/api/tareas/list_calendar/${userid}`);
      datos = datos.data.data;

      this.calendarOptions.events = this.calendarOptions.events.concat(datos);

      this.loadingOff ++;
      if (this.loadingOff >= 7)
        this.loadingPage = false;
    },

    async agregarCapacidadCalendario() {
      let fecha=this.mesActual;
      console.log("Estoy en Capacidad Calendario");
      let datos = await HTTP.get(`/api/medicion_instalacion/yearmonth/${fecha}`);
      datos = datos.data.data;

      this.calendarOptions.events = this.calendarOptions.events.concat(datos);

      this.loadingOff ++;
      if (this.loadingOff >= 7)
        this.loadingPage = false;
    },

    async agregarCapacidadCalendarioV2() {
      let fecha=this.mesActual;
      console.log("Estoy en Capacidad Calendario");
      let datos = await HTTP.get(`/api/medicion_instalacion/yearmonthweek/${fecha}`);
      datos = datos.data.data;

      this.calendarOptions.events = this.calendarOptions.events.concat(datos);

      this.loadingOff ++;
      if (this.loadingOff >= 7)
        this.loadingPage = false;
    },

    async traerProyectosDiseno(inicio, fin) {
      console.log("Estoy en Proyectos Diseño");
      try {
              this.proyDisenos = await HTTP.get(`/api/medicion_instalacion/instdate/${inicio}/${fin}`);
              this.proyDisenos =  this.proyDisenos.data.data;
      }
      catch (error) {
        console.log("Error: ", error);
        this.proyDisenos = [];
      }
      console.log("Proyectos Diseño: ", this.proyDisenos);

      this.calendarOptions.events = this.calendarOptions.events.concat(this.proyDisenos);

      this.loadingOff ++;
      if (this.loadingOff >= 7)
        this.loadingPage = false;
    },

    async traerProyectosDisenoMed(inicio, fin) {
      console.log("Estoy en Proyectos Diseño Med");
      try {
              this.proyDisenos = await HTTP.get(`/api/medicion_instalacion/meddate/${inicio}/${fin}`);
              this.proyDisenos =  this.proyDisenos.data.data;
      }
      catch (error) {
        console.log("Error: ", error);
        this.proyDisenos = [];
      }
      console.log("Proyectos Diseño: ", this.proyDisenos);

      this.calendarOptions.events = this.calendarOptions.events.concat(this.proyDisenos);

      this.loadingOff ++;
      if (this.loadingOff >= 7)
        this.loadingPage = false;
    },

    async fetchEvents() {
      this.loadingPage = true;

      this.filtroGrupo = 0;
      // const getStart = {
      //     month: startOfMonth,
      //     week: startOfWeek,
      //     day: startOfDay,
      // }
      // const getEnd = {
      //     month: endOfMonth,
      //     week: endOfWeek,
      //     day: endOfDay,
      // }
      // let inicio = format(subDays(getStart(this.viewDate), 8), 'yyyy-MM-dd');
      // let fin = format(addDays(getEnd(this.viewDate), 8), 'yyyy-MM-dd');

      let currIni = new Date(this.dateStart); // get current date
      let currFin = new Date(this.dateStart); // get current date
      let monthd = new Date(this.dateStart);
      // let first = this.$moment(currIni.setDate(currIni.getDate() -36)).format("YYYY-MM-DD")
      //let last = this.$moment(currFin.setDate(currFin.getDate() +8)).format("YYYY-MM-DD")
      let ini = new Date(currIni.getFullYear(), currIni.getMonth(), 1);
      let lt = new Date(currFin.getFullYear(), currFin.getMonth() + 1, 0);

      monthd = this.$moment(monthd.setDate(monthd.getDate())).format("YYYY-MM");

      let first = this.$moment(ini.setDate(ini.getDate() - 8)).format(
        "YYYY-MM-DD"
      );
      let last = this.$moment(lt.setDate(lt.getDate() + 8)).format(
        "YYYY-MM-DD"
      );

      //var lastDayOfMonth = new Date(currFin.getFullYear(), currFin.getMonth()+1, 0);
      let inicio = first; // this.$moment(first).format("YYYY-MM-DD")
      let fin = last; // this.$moment(last).format("YYYY-MM-DD")

      this.mesActual = monthd;

      //reiniciar vectores
      console.log(inicio);
      console.log(fin);
      this.isFirst = true;
      this.dataEvents = [];
      this.itemsToShowFirst = [];

      await this.traerEventos(inicio, fin);
      this.loadingPage = false;
    },
    async traerTareas() {
      let data = await TareaService.getAll();
      if (data) {
        this.tareas = data;
      }
    },
    async traerGrupos() {
      if (this.rol == "Administrador") {
        let data = await GrupoService.getAll();
        if (data) {
          this.grupos = data.filter((x) => x.activo);
        }
      } else {
        let idUsuario = JSON.parse(localStorage.getItem("usuario")).id;
        let data = await GrupoService.getById(idUsuario);
        if (data) {
          // this._grupoService.getById(idUsuario).subscribe((data: any) => {
          this.grupos = data.filter((x) => x.activo);
        }
      }
      console.log("grupo", this.grupos);
    },
    setShowDate(d) {
      this.showDate = d;
      // alert(this.showDate)
      this.dateStart = d;
      this.traerTareas();
      this.fetchEvents();
    },
    clickEvent() {},
    ubicacionActual() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitud = position.coords.latitude;
          this.longitud = position.coords.longitude;
          this.obtenerDireccion(this.latitud, this.longitud);
        });
      }
    },
    nuevoEvento(d) {
      console.log(d);
      // document.getElementById("openMod").click();
      this.$bvModal.show("myModalHorizontal");

      // this.uploader.clearQueue();
      this.currentEventImages = [];
      // document.getElementById("openMod").click();
      // document.getElementById("updateEvent").style.display = "none";
      // document.getElementById("deleteEvent").style.display = "none";
      // document.getElementById("saveEvent").style.display = "block";

      //document.getElementById("updateEvent").style.display = "block";
      this.btMdHorizontal.update = false;
      this.btMdHorizontal.delete = false;
      this.btMdHorizontal.save = true;

      this.ubicacionActual();
      setTimeout(() => {
        this.verificarDireccion(+this.latitud, +this.longitud);
      }, 250);

      let form = document.getElementById("eventForm");

      this.tarea.tarea = "";
      this.tarea.desc = "";
      this.tarea.nombre = "";
      this.tarea.telefono = "";
      this.tarea.horario = this.$moment().format("HH:mm");
      this.tarea.dia = this.$moment(d.startStr).format("DD-MM-YYYY");
      this.gruposSeleccionados = [];
    },
  },
};
</script>

<style lang="scss">
/* body {
    margin: 40px 10px;
    padding: 0;
    font-family: "Lucida Grande",Helvetica,Arial,Verdana,sans-serif;
    font-size: 14px;
} */

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
  height: 650px !important;
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
  height: 3px !important; //Agregado por Tobias
  width: 3px !important; //Agregado por Tobias
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

}
.modal-header {
  background-color:#FFFFFF !important;
}
</style>
