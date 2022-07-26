<template>
  <div id="app-asistencia-list" class="page-contents">
    <notification></notification>
    <div class="col-sm-12 col-sm-offset-1" style="padding: 0; margin-top: 20px">
      <div id="usuario-listado" class="col-sm-12">
        <div class="row">
          <div class="col-sm-4">
            <div class="row">
              <label class="control-label col-sm-4">Usuario: </label>
              <div class="col-sm-8">
                <select
                  class="form-control"
                  name="usuario"
                  v-model="form.usuario_id"
                >
                  <option
                    v-for="(usuario, index) in usuarios"
                    :key="index"
                    :value="usuario.id"
                  >
                    {{ usuario.usuario }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="col-sm-4 form-group">
            <div class="row">
              <label class="control-label col-sm-4"
                ><span>Rango fecha</span></label
              >
              <div class="col-sm-8">
                <input
                  type="text"
                  id="datepicker-trigger"
                  placeholder="seleccionar Rango"
                />
                <AirbnbStyleDatepicker
                  class="AirbnbStyleDatepicker"
                  :trigger-element-id="'datepicker-trigger'"
                  :mode="'range'"
                  :fullscreen-mobile="true"
                />
              </div>
            </div>
          </div>

          <div class="col-sm-2 form-group">
            <button
              class="btn btn-sm btn-success"
              :disabled="form.usuario_id == 0"
              @click="reloadAsistencias()"
            >
              <font-awesome-icon icon="check"></font-awesome-icon>
            </button>

            <button class="btn btn-sm btn-light" @click="resetForm()">
              <font-awesome-icon icon="redo"></font-awesome-icon>
            </button>
          </div>
        </div>
        <b-overlay :show="loadingPage" opacity="0.6" spinner-variant="primary">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <th>Usuario</th>
                <th>Hs Trabajadas</th>
                <th>Hs en Taller</th>
                <th>Puntos</th>
                <th>Cantidad de piezas</th>
              </thead>

              <tbody>
                <tr v-if="data.usuario">
                  <td>{{ data.usuario }}</td>
                  <td>{{ data.horas_totales }}</td>
                  <td>{{ data.horas_taller }}</td>
                  <td>{{ data.puntos }}</td>
                  <td>{{ data.piezas }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-overlay>
      </div>
    </div>
  </div>
</template>

<script>
import format from "date-fns/format";

import usuarioService from "../Services/usuarioService";
import puntajeService from "../Services/puntajeService";
import AirbnbStyleDatepicker from "vue-airbnb-style-datepicker";
import "vue-airbnb-style-datepicker/dist/vue-airbnb-style-datepicker.min.css";
import Vue from "vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faRedo } from "@fortawesome/free-solid-svg-icons";

library.add(faCheck);
library.add(faRedo);

const PuntajeService = new puntajeService();

Vue.use(AirbnbStyleDatepicker, {
  sundayFirst: false,
  placeHolder: "Seleccionar Rango",
  dateLabelFormat: "dddd, MMMM D, YYYY",
  days: [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ],
  daysShort: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  colors: {
    selected: "#00a699",
    inRange: "#66e2da",
    selectedText: "#fff",
    text: "#565a5c",
    inRangeBorder: "#33dacd",
    disabled: "#fff",
    hoveredInRange: "#67f6ee",
  },
  texts: {
    apply: "Aplicar",
    cancel: "Cancelar",
    keyboardShortcuts: "Keyboard Shortcuts",
  },

  //   ariaLabels: {
  //     chooseDate: (date) => date,
  //     chooseStartDate: (date) => `Choose ${date} as your start date.`,
  //     chooseEndDate: (date) => `Choose ${date} as your end date.`,
  //     selectedDate: (date) => `Selected. ${date}`,
  //     unavailableDate: (date) => `Not available. ${date}`,
  //     previousMonth: 'Move backward to switch to the previous month.',
  //     nextMonth: 'Move forward to switch to the next month.',
  //     closeDatepicker: 'Close calendar',
  //     openKeyboardShortcutsMenu: 'Open keyboard shortcuts menu.',
  //     closeKeyboardShortcutsMenu: 'Close keyboard shortcuts menu'
  //   },
  //   keyboardShortcuts: [
  //     {symbol: '↵', label: 'Select the date in focus', symbolDescription: 'Enter key'},
  //     {symbol: '←/→', label: 'Move backward (left) and forward (right) by one day.', symbolDescription: 'Left or right arrow keys'},
  //     {symbol: '↑/↓', label: 'Move backward (up) and forward (down) by one week.', symbolDescription: 'Up or down arrow keys'},
  //     {symbol: 'PgUp/PgDn', label: 'Switch months.', symbolDescription: 'PageUp and PageDown keys'},
  //     {symbol: 'Home/End', label: 'Go to the first or last day of a week.', symbolDescription: 'Home or End keys'},
  //     {symbol: 'Esc', label: 'Close this panel', symbolDescription: 'Escape key'},
  //     {symbol: '?', label: 'Open this panel', symbolDescription: 'Question mark'}

  //   ],
});

const UsuarioService = new usuarioService();

let Horario = {
  user_id: 0,
  hora_inicio_lunes: "",
  hora_fin_lunes: "",
  hora_inicio_martes: "",
  hora_fin_martes: "",
  hora_inicio_miercoles: "",
  hora_fin_miercoles: "",
  hora_inicio_jueves: "",
  hora_fin_jueves: "",
  hora_inicio_viernes: "",
  hora_fin_viernes: "",
  hora_inicio_sabado: "",
  hora_fin_sabado: "",
  habilitado_lunes: false,
  habilitado_martes: false,
  habilitado_miercoles: false,
  habilitado_jueves: false,
  habilitado_viernes: false,
  habilitado_sabado: false,
  is_default: false,
};
let Usuario = {
  id: 0,
  correo_google: "",
  nombre_completo: "",
  usuario: "",
  password: "",
  activo: 0,
  rol_id: 0,
  horario: Horario,
};
export default {
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      daterange: "",
      usuarios: [],
      asistencias: [],
      loadingPage: false,
      form: {
        usuario_id: 0,
        fecha_inicio: this.$moment().format("YYYY-MM-DD"),
        fecha_fin: this.$moment().format("YYYY-MM-DD"),
      },
      data: {
        usuario: "",
        puntaje: 0,
        piezas: 0,
        horas_totales: 0,
        horas_taller: 0,
      },
    };
  },
  async mounted() {
    this.usuarios.push(Usuario);
    this.usuarios[0].usuario = "Todos";
    this.usuarios[0].id = 0;

    let res = await UsuarioService.getAll();
    this.usuarios = this.usuarios.concat(res.usuarios);
    console.log("usuarios", this.usuarios);
  },
  methods: {
    formatDates(dateOne, dateTwo) {
      let formattedDates = "";
      if (dateOne) {
        formattedDates = format(dateOne, this.dateFormat);
      }
      if (dateTwo) {
        formattedDates += " - " + format(dateTwo, this.dateFormat);
      }
      return formattedDates;
    },
    selectedDate(value, datepicker) {
      console.log(value);

      this.form.fecha_inicio = value.start._d;
      this.form.fecha_fin = value.end._d;
    },
    calendarApplied(event) {
      this.form.fecha_inicio = event.picker.startDate.format("YYYY-MM-DD");
      this.form.fecha_fin = event.picker.endDate.format("YYYY-MM-DD");
    },
    async reloadAsistencias() {
      this.loadingPage = true;
      console.log(this.form);
      let res = await PuntajeService.get_prod_by_date(
        parseInt(this.form.usuario_id),
        this.form.fecha_inicio,
        this.form.fecha_fin
      );
      if (res) {
        let data = res;
        console.log("if", data);
        console.log(res);
        this.data.usuario = data.usuario;
        this.data.puntos = data.puntos;
        this.data.piezas = data.piezas;
        this.data.horas_totales = data.horas_totales;
        this.data.horas_taller = data.horas_taller;
      }
      this.loadingPage = false;
    },
    resetForm() {
      this.form = {
        usuario_id: 0,
        fecha_inicio: this.$moment().format("YYYY-MM-DD"),
        fecha_fin: this.$moment().format("YYYY-MM-DD"),
      };
      // this.picker.datePicker.setStartDate(moment());
      // this.picker.datePicker.setEndDate(moment());
    },
  },
};
</script>

<style>
@media only screen and (min-width: 769px) {
  .asd__wrapper {
    margin-left: -300px;
    position: sticky !important;
    left: -600px !important;
    /* margin-left:-100% !important  */
  }
}
</style>
