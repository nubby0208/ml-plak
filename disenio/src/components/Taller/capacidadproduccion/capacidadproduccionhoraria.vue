<template>
  <div id="app-capacidad-produccion" class="container-fluid">
    <div class="col-sm-12 col-sm-offset-1">
      <div class="col-sm-12 text-center py-3">
        <h2>Capacidad de Producción Horaria</h2>
        <hr />
      </div>
      <b-overlay :show="loadingPage" opacity="0.6" spinner-variant="primary">
        <div id="capacidad-produccion-horaria" class="col-sm-12">
          <div v-if="updateIndex">
            <b-form
              @submit="store"
              class="create-item-form row"
              autocomplete="off"
            >
              <div class="col-md-3">
                <label for="item"><b>Nombre</b></label>
                <b-form-input
                  :state="inputNombreValidity()"
                  type="text"
                  class="form-control"
                  id="nombre"
                  v-model="form.nombre"
                  placeholder="Nombre"
                />
              </div>
              <div class="col-md-1">
                <label for="lunes"><b>Lunes</b></label>
                <b-form-input
                  readonly
                  title="Haga click para seleccionar el tiempo"
                  type="text"
                  class="form-control"
                  id="lunes"
                  v-model="form.lunes"
                  @click="loadTimes(1)"
                />
              </div>
              <div class="col-md-1">
                <label for="martes"><b>Martes</b></label>
                <b-form-input
                  readonly
                  title="Haga click para seleccionar el tiempo"
                  type="text"
                  class="form-control"
                  id="martes"
                  v-model="form.martes"
                  @click="loadTimes(2)"
                />
              </div>
              <div class="col-md-1">
                <label for="miercoles"><b>Miercoles</b></label>
                <b-form-input
                  readonly
                  title="Haga click para seleccionar el tiempo"
                  type="text"
                  class="form-control"
                  id="miercoles"
                  v-model="form.miercoles"
                  @click="loadTimes(3)"
                />
              </div>
              <div class="col-md-1">
                <label for="jueves"><b>Jueves</b></label>
                <b-form-input
                  readonly
                  title="Haga click para seleccionar el tiempo"
                  type="text"
                  class="form-control"
                  id="jueves"
                  v-model="form.jueves"
                  @click="loadTimes(4)"
                />
              </div>
              <div class="col-md-1">
                <div class="row">
                  <div class="form-group col">
                    <label for="viernes"><b>Viernes</b></label>
                    <b-form-input
                      readonly
                      title="Haga click para seleccionar el tiempo"
                      class="form-control"
                      id="viernes"
                      v-model="form.viernes"
                      @click="loadTimes(5)"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-1">
                <div class="row">
                  <div class="form-group col">
                    <label for="sabado"><b>Sabado</b></label>
                    <b-form-input
                      readonly
                      title="Haga click para seleccionar el tiempo"
                      class="form-control"
                      id="sabado"
                      v-model="form.sabado"
                      @click="loadTimes(6)"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-1">
                <div class="row">
                  <div class="form-group col">
                    <label for="domingo"><b>Domingo</b></label>
                    <b-form-input
                      readonly
                      title="Haga click para seleccionar el tiempo"
                      class="form-control"
                      id="domingo"
                      v-model="form.domingo"
                      @click="loadTimes(0)"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-2">
                <label for="domingo"><b>Tipo</b></label>
                <b-form-select
                  style="min-width: 100px; margin-right: 10px"
                  ref="weekday"
                  id="weekday"
                  :disabled="loadingPage"
                  class="form-control"
                  name="weekday"
                  v-model="form.weekday"
                >
                  <b-form-select-option value="0">Diario</b-form-select-option>
                  <b-form-select-option value="1">Semanal</b-form-select-option>
                </b-form-select>
              </div>
            </b-form>
            <div class="form-submit-container">
              <button v-if="!updateIndex" type="button" @click="store()" class="btn btn-primary">Agregar</button>
              <button v-if="updateIndex" type="button" @click="update()" class="btn btn-primary">Guardar</button>
              <button v-if="updateIndex" type="button" @click="setClear()" class="btn btn-primary">Cancelar</button>
            </div>
          </div>
          <br />
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <th>#</th>
                <th>Nombre</th>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miércoles</th>
                <th>Jueves</th>
                <th>Viernes</th>
                <th>Sábado</th>
                <th>Domingo</th>
                <th>Semanal/Diario</th>
                <th></th>
              </thead>
              <tbody>
                <template v-if="capacidadProduccion.length > 0">
                  <tr v-for="(item, i) in capacidadProduccion" :key="i">
                    <td>{{ i + 1 }}</td>
                    <td>{{ item.nombre }}</td>
                    <td>{{ item.lunes }}</td>
                    <td>{{ item.martes }}</td>
                    <td>{{ item.miercoles }}</td>
                    <td>{{ item.jueves }}</td>
                    <td>{{ item.viernes }}</td>
                    <td>{{ item.sabado }}</td>
                    <td>{{ item.domingo }}</td>
                    <td>
                      <div v-if="item.weekday" class="row" style="border: 2px solid;">
                        <div class="col-md-6" style="background:blue">&nbsp;</div>
                        <div class="col-md-6">&nbsp;</div>
                      </div>
                      <div v-if="!item.weekday" class="row" style="border: 2px solid;">
                        <div class="col-md-6">&nbsp;</div>
                        <div class="col-md-6" style="background:blue">&nbsp;</div>
                      </div>
                    </td>
                    <td>
                      <button
                        class="btn btn-sm btn-success"
                        @click="editItem(item)"
                      >
                        <font-awesome-icon icon="edit"></font-awesome-icon>
                      </button>
                      <button
                        class="btn btn-sm btn-danger"
                        @click="deleteItem(item.id)"
                      >
                        <font-awesome-icon icon="trash"></font-awesome-icon>
                      </button>
                    </td>
                  </tr>
                </template>

                <template v-else>
                  <tr>
                    <td class="text-center" colspan="12">
                      <strong>No posee ningun elemento.</strong>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </b-overlay>
    </div>
    <b-modal
        ref="time"
        id="time"
        title="Seleccione el Tiempo"
        size="sm"
        hide-footer
      >
      <b-form @submit="setTimeUp"
              autocomplete="off"
      >
      <table>
          <tr style="height: 30px">
            <td>
              <input style="width: 100px"
                          v-model="time.hour"
                          placeholder="Horas"
                          class="form-control"
                          type="number"
                          min="0"
                          max="99"
               />
            </td>
            <td>:</td>
            <td>
              <input style="width: 100px"
                          v-model="time.min"
                          placeholder="Minutos"
                          class="form-control"
                          type="number"
                          min="0"
                          max="59"
               />
            </td>
            <td> horas</td>
          </tr>
        </table>
        </b-form>
        <div align="right">
          <button type="button" @click="setTimeUp()" class="btn btn-primary">Agregar</button>
        </div>
   </b-modal>
  </div>
</template>

<script>
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faTrash);
library.add(faEdit);
import { HTTP } from "@/index";

export default {
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      capacidadProduccion: [],
      form: {},
      loadingPage: false,
      resetFormFields: true,
      time: {},
      day: 0,
      updateIndex: 0,
    };
  },
  mounted() {
    this.setClear();
    this.time = {
      hour: 0,
      min: 0,
    },
    this.getAll();
  },
  methods: {
    setClear() {
      this.updateIndex = 0;
      this.form = {
        nombre: "",
        lunes: "00:00",
        martes: "00:00",
        miercoles: "00:00",
        jueves: "00:00",
        viernes: "00:00",
        sabado: "00:00",
        domingo: "00:00",
        weekday: 0,
      };
    },
    loadTimes(day) {
     this.day = day;
     let data;

     switch (day) {
        case 1:
          data = this.form.lunes.split(":");
          this.time.hour=parseInt(data[0]);
          this.time.min=parseInt(data[1]);
          break;
        case 2:
          data = this.form.martes.split(":");
          this.time.hour=parseInt(data[0]);
          this.time.min=parseInt(data[1]);
          break;
        case 3:
          data = this.form.miercoles.split(":");
          this.time.hour=parseInt(data[0]);
          this.time.min=parseInt(data[1]);
          break;
        case 4:
          data = this.form.jueves.split(":");
          this.time.hour=parseInt(data[0]);
          this.time.min=parseInt(data[1]);
          break;
        case 5:
          data = this.form.viernes.split(":");
          this.time.hour=parseInt(data[0]);
          this.time.min=parseInt(data[1]);
          break;
        case 6:
          data = this.form.sabado.split(":");
          this.time.hour=parseInt(data[0]);
          this.time.min=parseInt(data[1]);
          break;
        case 0:
          data = this.form.domingo.split(":");
          this.time.hour=parseInt(data[0]);
          this.time.min=parseInt(data[1]);
          break;
     }
     this.$bvModal.show('time');
    },
    setTimeUp(){
      this.$bvModal.hide('time');
      let timeUp = (this.time.hour > 9) ? this.time.hour.toString() : "0" + this.time.hour.toString();
      timeUp = (this.time.min > 9) ? timeUp + ":" + this.time.min.toString() : timeUp + ":" + "0" + this.time.min.toString();
      this.time.hour = 0;
      this.time.min = 0;
      switch (this.day) {
        case 1:
          this.form.lunes = timeUp;
          break;
        case 2:
          this.form.martes = timeUp;
          break;
        case 3:
          this.form.miercoles = timeUp;
          break;
        case 4:
          this.form.jueves = timeUp;
          break;
        case 5:
          this.form.viernes = timeUp;
          break;
        case 6:
          this.form.sabado = timeUp;
          break;
        case 0:
          this.form.domingo = timeUp;
          break;
      }
    },
    deleteItem(id) {
      this.loadingPage = true;

      HTTP.delete("/api/capacidad_produccion/horaria/" + id).then((result) => {
        this.loadingPage = false;
        if (result.data) {
          //this.successSwal.show();
          this.$swal({
            title: "¡Enhorabuena!",
            text: "¡Capacidad de Producción borrada con éxito!",
            type: "success",
          });

          this.getAll();
        }
      });
    },
    inputNombreValidity() {
      return this.resetFormFields ? null : this.form.nombre != "";
    },
    inputLunesValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form.lunes) &&
            this.form.lunes != "" &&
            Number.isInteger(parseFloat(this.form.lunes));
    },
    inputMartesValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form.martes) &&
            this.form.martes != "" &&
            Number.isInteger(parseFloat(this.form.martes));
    },
    inputMiercolesValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form.miercoles) &&
            this.form.miercoles != "" &&
            Number.isInteger(parseFloat(this.form.miercoles));
    },
    inputJuevesValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form.jueves) &&
            this.form.jueves != "" &&
            Number.isInteger(parseFloat(this.form.jueves));
    },
    inputViernesValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form.viernes) &&
            this.form.viernes != "" &&
            Number.isInteger(parseFloat(this.form.viernes));
    },
    inputSabadoValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form.sabado) &&
            this.form.sabado != "" &&
            Number.isInteger(parseFloat(this.form.sabado));
    },
    inputDomingoValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form.domingo) &&
            this.form.domingo != "" &&
            Number.isInteger(parseFloat(this.form.domingo));
    },
    editItem(capacidad) {
      this.updateIndex = capacidad.id;
      this.form = {
        nombre: capacidad.nombre,
        lunes: capacidad.lunes,
        martes: capacidad.martes,
        miercoles: capacidad.miercoles,
        jueves: capacidad.jueves,
        viernes: capacidad.viernes,
        sabado: capacidad.sabado,
        domingo: capacidad.domingo,
        weekday: capacidad.weekday,
      };
    },
    store() {
      //verificar inputs
      let valido = true;
      this.resetFormFields = false;

      if (!this.inputNombreValidity()) {
        valido = false;
      }
      if (!valido) {
        return;
      }

      this.resetFormFields = true;
      this.loadingPage = true;

      let reqData = {
        nombre: this.form.nombre,
        lunes: this.form.lunes,
        martes: this.form.martes,
        miercoles: this.form.miercoles,
        jueves: this.form.jueves,
        viernes: this.form.viernes,
        sabado: this.form.sabado,
        domingo: this.form.domingo,
        weekday: this.form.weekday,
      };

      HTTP.post("/api/capacidad_produccion/horaria", reqData).then((result) => {
        this.loadingPage = false;
        if (result.data) {
          this.$swal({
            title: "¡Enhorabuena!",
            text: "¡Capacidad de Producción agregada con éxito!",
            type: "success",
          });
          this.setClear();
          this.getAll();
        }
      });
    },
    update() {
      //verificar inputs
      let valido = true;

      this.resetFormFields = false;

      if (!this.inputNombreValidity()) {
        valido = false;
      }

      this.resetFormFields = true;

      this.loadingPage = true;

      let reqData = {
        nombre: this.form.nombre,
        lunes: this.form.lunes,
        martes: this.form.martes,
        miercoles: this.form.miercoles,
        jueves: this.form.jueves,
        viernes: this.form.viernes,
        sabado: this.form.sabado,
        domingo: this.form.domingo,
        weekday: this.form.weekday,
      };

      HTTP.put("/api/capacidad_produccion/horaria/" + this.updateIndex, reqData).then((result) => {
        this.loadingPage = false;
        if (result.data) {
          this.$swal({
            title: "¡Enhorabuena!",
            text: "¡Capacidad de Producción actualizada con éxito!",
            type: "success",
          });
          this.updateIndex = 0;
          this.setClear();
          this.getAll();
        }
      });
    },
    getAll() {
      this.loadingPage = true;

      HTTP.get("/api/capacidad_produccion/horaria")
        .then((result) => {
          if (result.data != null) {
            this.capacidadProduccion = result.data.data;
          }
          this.loadingPage = false;
        })
        .catch((result) => {
          this.loadingPage = false;
          console.log(result);
        });
    },
  },
};
</script>
