<template>
  <div class="page-contents">
    <vue-toastr ref="toastr"></vue-toastr>
    <notification></notification>
    <div class="row">
      <div class="col-sm-12">
        <b-overlay
          :show="loadingPuntos"
          opacity="0.6"
          spinner-variant="primary"
        >
          <div class="table-responsive" style="background-color: white">
            <table
              class="table table-hover table-bordered"
              style="border: none"
              v-if="mispuntos"
            >
              <thead>
                <tr class="bg-success">
                  <th>Nombre</th>
                  <th>
                    T<span class="hidden-xs">otal Piezas</span
                    ><span class="visible-xs-inline">. Pzs.</span>
                  </th>
                  <th>
                    T<span class="hidden-xs">otal Puntos</span
                    ><span class="visible-xs-inline">. Pts.</span>
                  </th>
                  <th>
                    Prom<span class="hidden-xs">edio de Produccion</span
                    ><span class="visible-xs-inline">.</span>
                  </th>
                  <th>Horas</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mi día</td>
                  <td v-if="mispuntos.hoy">{{ mispuntos.hoy.piezas }}</td>
                  <td v-if="mispuntos.hoy">{{ mispuntos.hoy.puntos }}</td>
                  <td v-if="mispuntos.hoy">
                    {{
                      (
                        mispuntos.hoy.puntos /
                        (mispuntos.horas_hoy_total > 0
                          ? mispuntos.horas_hoy_total
                          : 1)
                      ).toFixed(2)
                    }}
                  </td>
                  <td v-if="mispuntos">{{ mispuntos.horas_hoy }}</td>
                </tr>
                <tr>
                  <td>Mi Semana</td>
                  <td v-if="mispuntos.piezas_semana >= 0">
                    {{ mispuntos.piezas_semana }}
                  </td>
                  <td v-if="mispuntos.semana_puntos >= 0">
                    {{ mispuntos.semana_puntos }}
                  </td>
                  <td v-if="mispuntos.total_horas_semana >= 0">
                    {{
                      (
                        mispuntos.semana_puntos /
                        (mispuntos.total_horas_semana > 0
                          ? mispuntos.total_horas_semana
                          : 1)
                      ).toFixed(2)
                    }}
                  </td>
                  <td v-if="mispuntos.total_horas_semana >= 0">
                    {{ mispuntos.total_horas_semana }}
                  </td>
                </tr>
                <tr>
                  <td>Mi Mejor mes</td>
                  <td v-if="mispuntos.mejor_mes">
                    {{ mispuntos.mejor_mes.piezas }}
                  </td>
                  <td v-if="mispuntos.mejor_mes">
                    {{ mispuntos.mejor_mes.puntos }}
                  </td>
                  <td v-if="mispuntos.mejor_mes">
                    {{
                      (
                        mispuntos.mejor_mes.puntos /
                        (mispuntos.mejor_mes.horas_total > 0
                          ? mispuntos.mejor_mes.horas_total
                          : 1)
                      ).toFixed(2)
                    }}
                  </td>
                  <td v-if="mispuntos.mejor_mes">
                    {{ mispuntos.mejor_mes.horas }}
                  </td>
                </tr>
                <tr>
                  <td>Mes Actual</td>
                  <td v-if="mispuntos.estemes">
                    {{ mispuntos.estemes.piezas }}
                  </td>
                  <td v-if="mispuntos.estemes">
                    {{ mispuntos.estemes.puntos }}
                  </td>
                  <td v-if="mispuntos.estemes">
                    {{
                      (
                        mispuntos.estemes.puntos /
                        (mispuntos.horas_mes_total > 0
                          ? mispuntos.horas_mes_total
                          : 1)
                      ).toFixed(2)
                    }}
                  </td>
                  <td v-if="mispuntos">{{ mispuntos.horas_mes }}</td>
                </tr>
                <tr>
                  <td>
                    <input
                      class="form-control"
                      type="month"
                      id="start"
                      name="start"
                      @change="calendarApplied($event)"
                      :value="currentMonth"
                    />
                    <!-- <input type="text" class="form-control miprod" daterangepicker :options="{'singleDatePicker': true, locale: { format: 'YYYY-MM'}}" (selected)="selectedDate($event)"
                                        (applyDaterangepicker)="calendarApplied($event)"> -->
                  </td>
                  <td v-if="mispuntosmes">{{ mispuntosmes.piezas }}</td>
                  <td v-if="mispuntosmes">{{ mispuntosmes.puntos }}</td>
                  <td v-if="mispuntosmes">
                    {{
                      (
                        mispuntosmes.puntos /
                        (mispuntosmes.horas_total > 0
                          ? mispuntosmes.horas_total
                          : 1)
                      ).toFixed(2)
                    }}
                  </td>
                  <td v-if="mispuntosmes">{{ mispuntosmes.horas }}</td>
                </tr>
                <tr>
                  <input
                    class="form-control"
                    type="date"
                    id="start"
                    name="start"
                    v-model="fecha"
                    @change="calendarAppliedProd($event)"
                  />
                  <!-- <td><input class="form-control" type="date" name="date" [(ngModel)]="fecha" (applyDaterangepicker)="calendarAppliedProd($event)"></td> -->
                  <td v-if="mispuntosfecha">{{ mispuntosfecha.piezas }}</td>
                  <td v-if="mispuntosfecha">{{ mispuntosfecha.puntos }}</td>
                  <td v-if="mispuntosfecha">
                    {{
                      (
                        mispuntosfecha.puntos /
                        (mispuntosfecha.horas_total > 0
                          ? mispuntosfecha.horas_total
                          : 1)
                      ).toFixed(2)
                    }}
                  </td>
                  <td v-if="mispuntosfecha">{{ mispuntosfecha.horas }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="form-group">
            <label class="control-label" for="inputSuccess2"
              >Mes a visualizar</label
            >
            <input
              class="form-control"
              type="month"
              id="start"
              name="start"
              @change="calendarAppliedProd($event)"
              :value="currentMonth"
            />

            <!-- <input type="text" class="form-control miprod" daterangepicker [options]="{'singleDatePicker': true, locale: { format: 'YYYY-MM'}}" (selected)="selectedDateProd($event)"
                        (applyDaterangepicker)="calendarAppliedProd($event)"> -->
          </div>
          <div class="form-group" v-if="mispuntos.puntos_por_usuario">
            <label class="control-label" for="inputSuccess2"
              >Numero de posiciones</label
            >
            <select
              class="form-control"
              name="usuario"
              v-model="limit"
              @change="getPuntos()"
            >
              <option
                v-for="(limitValue, i) in limits"
                :value="limitValue"
                :key="i"
              >
                {{ limitValue }}
              </option>
            </select>
          </div>

          <div class="table-responsive">
            <table
              class="table table-hover table-bordered"
              v-if="mispuntos.puntos_por_usuario"
            >
              <tr>
                <th class="primary text-center" colspan="5">
                  Posiciones por promedio de producción
                </th>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td>Puntos</td>
                <td>Horas</td>
                <td>Producion por hora(promedio)</td>
              </tr>
              <tr
                v-for="(punto, i) in mispuntos.promedios_por_usuario"
                :key="i"
              >
                <td>{{ i + 1 }}</td>
                <td
                  v-if="
                    punto.usuario.usuario == null &&
                    punto.usuario.usuario_id == null &&
                    punto.usuario.puntos == null
                  "
                  colspan="3"
                >
                  No hay resultados
                </td>
                <td>{{ punto.usuario.usuario }}</td>
                <td>{{ punto.puntos }}</td>
                <td>{{ punto.horas_total }}</td>
                <td>{{ punto.promedio.toFixed(2) }} P/h</td>
              </tr>
            </table>
          </div>

          <div class="table-responsive">
            <table
              class="table table-hover table-bordered"
              v-if="mispuntos.puntos_por_usuario"
            >
              <tr>
                <th class="bg-info text-center" colspan="3">
                  Posiciones por produccion neta
                </th>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td>Total de produccion mensual(total)</td>
              </tr>
              <tr
                v-for="(punto, i) in mispuntos.puntos_por_usuario.puntos"
                :key="i"
              >
                <td>{{ i + 1 }}</td>
                <td>{{ punto.usuario.usuario }}</td>
                <td>{{ punto.puntos }}</td>
              </tr>
            </table>
          </div>
        </b-overlay>
      </div>

      <div v-if="is_admin === 'Administrador'" class="col-sm-12">
        <h2>Configuracion de los Valores</h2>
        <b-overlay
          :show="loadingConfigValores"
          opacity="0.6"
          spinner-variant="primary"
        >
          <div
            class="table-responsive"
            style="background-color: white"
            v-if="niveles.length"
          >
            <table
              v-for="(nivel, i) in niveles"
              :key="i"
              class="table table-hover table-bordered"
            >
              <tr
                class="bg-info text-center"
                v-if="nivel[i].tipo == 'complejidad'"
              >
                <th colspan="2">Valores de complejidad</th>
                <th colspan="2">Etapa: {{ nivel[i].etapa }}</th>
              </tr>

              <tr>
                <td v-if="nivel[i].tipo">{{ nivel[i].tipo }}</td>
                <td>min</td>
                <td>max</td>
                <td>
                  <span class="hidden-xs">Puntos</span
                  ><span class="visible-xs-inline">Pts.</span>
                </td>
                <td>Acciones</td>
              </tr>
              <tr v-for="(niv, i) in nivel" :key="i">
                <td>{{ niv.nivel }}</td>
                <td>{{ niv.min }}</td>
                <td>{{ niv.max }}</td>
                <td>{{ niv.puntos }}</td>
                <td>
                  <button
                    class="btn btn-primary"
                    @click="changeConfig($event, niv)"
                  >
                    editar
                  </button>
                </td>
              </tr>
            </table>
          </div>

          <div class="table-responsive" style="background-color: white">
            <table class="table table-hover table-bordered">
              <tr class="bg-success">
                <th colspan="2">{{ cajones.tipo }}</th>
                <th colspan="2">{{ cajones.etapa }}</th>
              </tr>
              <tr>
                <td>{{ cajones.tipo }}</td>
                <td></td>
                <td></td>
                <td>
                  <span class="hidden-xs">Puntos</span
                  ><span class="visible-xs-inline">Pts.</span>
                </td>
                <td>Acciones</td>
              </tr>
              <tr>
                <td>X cada cajon</td>
                <td></td>
                <td></td>
                <td>{{ cajones.puntos }}</td>
                <td>
                  <button
                    class="btn btn-primary"
                    @click="changeConfig($event, cajones)"
                  >
                    editar
                  </button>
                </td>
              </tr>
            </table>
          </div>

          <div
            class="table-responsive"
            style="background-color: white"
            v-if="modulos.length"
          >
            <table class="table table-hover table-bordered">
              <tr class="bg-info text-center">
                <th colspan="4">Armado de modulos</th>
              </tr>
              <tr>
                <td>Armado de modulos</td>
                <td></td>
                <td></td>
                <td>
                  <span class="hidden-xs">Puntos</span
                  ><span class="visible-xs-inline">Pts.</span>
                </td>
                <td>Acciones</td>
              </tr>
              <tr v-for="(niv, i) in modulos" :key="i">
                <td>{{ niv.nivel }}</td>
                <td></td>
                <td>divide por</td>
                <td>{{ niv.puntos }}</td>
                <td>
                  <button
                    class="btn btn-primary"
                    @click="changeConfig($event, niv)"
                  >
                    editar
                  </button>
                </td>
              </tr>
            </table>
          </div>
        </b-overlay>
      </div>
    </div>

    <b-modal id="change-config" size="lg" hide-header hide-footer>
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Niveles de complejidad:</h4>
        </div>

        <div class="modal-body">
          <p v-if="config2Change">
            Etapa: {{ config2Change.etapa }},
            <span v-if="config2Change.nivel"
              >Nivel: {{ config2Change.nivel }}</span
            >
          </p>
          <div v-if="config2Change">
            <div v-if="config2Change.tipo == 'complejidad'">
              <div class="form-group">
                <label>Minimo</label>
                <input
                  class="form-control"
                  type="text"
                  name="min"
                  v-model="config2Change.min"
                />
              </div>

              <div class="form-group">
                <label>Maximo</label>
                <input
                  class="form-control"
                  type="text"
                  name="max"
                  v-model="config2Change.max"
                />
              </div>
            </div>
            <div class="form-group" v-if="config2Change">
              <label>Puntos</label>
              <input
                class="form-control"
                type="text"
                name="puntos"
                v-model="config2Change.puntos"
              />
            </div>
          </div>
          <div>
            <button
              type="button"
              class="btn btn-primary"
              data-dismiss="modal"
              @click="onChangeConfig(config2Change)"
            >
              Actualizar
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-default"
            data-dismiss="modal"
            @click="$bvModal.hide('change-config')"
          >
            Cerrar
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { HTTP } from "../../../index";
import usuarioService from "../Services/usuarioService";
import puntajeService from "../Services/puntajeService";
import VueToastr from "vue-toastr";

const PuntajeService = new puntajeService();

export default {
  components: {
    VueToastr,
  },
  data() {
    return {
      mispuntosmes: 0,
      currentMonth: this.$moment().format("YYYY-MM"),
      form: { usuario_id: 0, fecha: this.$moment().format("YYYY-MM") },
      niveles: [],
      cajones: [],
      modulos: [],
      mispuntos: {},
      loadingPuntos: true,
      loadingConfigValores: true,
      mispuntosfecha: {
        piezas: 0,
        puntos: 0,
        horas: "00:00",
        horas_total: 1,
      },
      config2Change: "",
      is_admin: "",
      fecha: "",
      fecha_prod: this.$moment().format("YYYY-MM"),
      limits: [10, 25, 50, 100],
      limit: 10,
      punto: { usuario: { usuario: null, usuario_id: null } },
      months: { Enero: "" },
    };
  },
  mounted() {
    this.getNiveles();
    this.getPuntos();
    this.is_admin = JSON.parse(localStorage.getItem("usuario")).rol;
  },
  methods: {
    async calendarAppliedProd(event) {
      this.fecha_prod = this.$moment(event.target.value).format("YYYY-MM");
      console.log(this.fecha_prod);
      this.getPuntos();
    },
    async calendarApplied(event) {
      console.log(event.target.value);
      this.form.fecha = this.$moment(event.target.value).format("YYYY-MM");
      let result = await PuntajeService.getPuntajeDate({
        fecha: this.form.fecha,
        month: true,
      });
      this.mispuntosmes = result;
      console.log(this.mispuntosmes);
    },
    async onChangeConfig(nivel) {
      let data = nivel;
      console.log(nivel);
      this.$refs.toastr.i("Actualizando...");
      let result = await PuntajeService.updateNivel(data);
      console.log(result);
      if (result.nivel) {
        this.$refs.toastr.s("Nivel de Complejidad actualizado!");
        this.$bvModal.hide("change-config");
        this.getNiveles();
      }
    },
    changeConfig(event, nivel) {
      console.log(nivel);
      this.config2Change = nivel;
      this.$bvModal.show("change-config");
    },
    selectedDate(value) {
      console.log("valor---------------->", value);
      this.form.fecha_inicio = value.start._d;
      this.form.fecha_fin = value.end._d;
    },
    async getPuntos() {
      this.loadingPuntos = true;
      let dataos = {
        usuario: JSON.parse(localStorage.getItem("usuario")).usuario,
        limit: this.limit,
        fecha: this.fecha_prod,
      };
      console.log("data puntaje", dataos);
      let result = await PuntajeService.getPuntaje(dataos);
      this.mispuntos = result;
      console.log("mis puntos", this.mispuntos);
      this.loadingPuntos = false;
    },
    async getNiveles() {
      this.loadingConfigValores = true;
      let res = await HTTP.get(`/api/niveles`);
      if (res) {
        res = res.data;
        //let res = response;
        let niveles = res.niveles;
        let nuevo2 = [];

        if (niveles.length) {
          nuevo2 = [
            [niveles[0], niveles[1], niveles[2]],
            [niveles[3], niveles[4], niveles[5]],
            [niveles[6], niveles[7], niveles[8]],
          ];

          this.modulos = [niveles[10], niveles[11], niveles[12]];

          this.cajones = niveles[9];
        }

        this.niveles = nuevo2;
        //console.log('estos son los niveles', niveles)
        //console.log(this.modulos[0])
      }
      this.loadingConfigValores = false;
    },
  },
};
</script>

<style>
</style>