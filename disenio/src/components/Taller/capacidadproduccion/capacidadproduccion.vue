<template>
  <div id="app-capacidad-produccion" class="container-fluid">
    <div class="col-sm-12 col-sm-offset-1">
      <div class="col-sm-12 text-center py-3">
        <h2>Capacidad de Producción</h2>
        <hr />
      </div>
      <b-overlay :show="loadingPage" opacity="0.6" spinner-variant="primary">
        <div id="capacidad-produccion" class="col-sm-12">
          <div>
            <b-form
              @submit="store"
              class="create-item-form row"
              autocomplete="off"
            >
              <div class="col-md-6">
                <div class="row">
                  <div class="form-group col">
                    <label for="item"><br>Item</label>
                    <b-form-input
                      :state="inputItemValidity()"
                      type="text"
                      class="form-control"
                      id="item"
                      v-model="form.item"
                      placeholder="item"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-1">
                <div class="row">
                  <div class="form-group col">
                    <label for="tiempoDisenio">Tiempo de Diseño</label>
                    <b-form-input
                      readonly
                      title="Haga click para seleccionar el tiempo"
                      type="text"
                      class="form-control"
                      id="tiempoDisenio"
                      v-model="form.tiempoDisenio"
                      @click="loadTimes(1)"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-1">
                <div class="row">
                  <div class="form-group col">
                    <label for="tiempoProduccion">Tiempo de Produccion</label>
                    <b-form-input
                      readonly
                      title="Haga click para seleccionar el tiempo"
                      type="text"
                      class="form-control"
                      id="tiempoProduccion"
                      v-model="form.tiempoProduccion"
                      @click="loadTimes(2)"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-1">
                <div class="row">
                  <div class="form-group col">
                    <label for="tiempoMedicion">Tiempo de Medicion</label>
                    <b-form-input
                      readonly
                      title="Haga click para seleccionar el tiempo"
                      type="text"
                      class="form-control"
                      id="tiempoMedicion"
                      v-model="form.tiempoMedicion"
                      @click="loadTimes(3)"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-1">
                <div class="row">
                  <div class="form-group col">
                    <label for="tiempoInstalacion">Tiempo de Instalacion</label>
                    <b-form-input
                      readonly
                      title="Haga click para seleccionar el tiempo"
                      type="text"
                      class="form-control"
                      id="tiempoInstalacion"
                      v-model="form.tiempoInstalacion"
                      @click="loadTimes(4)"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-2">
                <div class="row">
                  <div class="form-group col">
                    <label for="coeficiente">Coeficiente<br>Multiplicador</label>
                    <b-form-input
                      :state="inputCoeficienteMultiplicadorValidity()"
                      type="number"
                      step="0.01"
                      class="form-control"
                      id="coeficiente"
                      v-model="form.coeficiente"
                    />
                   </div>
                </div>
              </div>
            </b-form>
            <div class="form-submit-container">
              <button v-if="!updateIndex" type="button" @click="store()" class="btn btn-sm btn-primary">Agregar</button>
              <button v-if="updateIndex" type="button" @click="update()" class="btn btn-sm btn-primary">Guardar</button>
              <button v-if="updateIndex" type="button" @click="setClear()" class="btn btn-sm btn-danger">Cancelar</button>
            </div>
          </div>
          <br />
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <th>#</th>
                <th>Item</th>
                <th>Tiempo Diseño</th>
                <th>Tiempo Produccion</th>
                <th>Tiempo Medicion</th>
                <th>Tiempo Instalacion</th>
                <th>Coeficiente Multiplicador</th>
                <th></th>
              </thead>

              <tbody>
                <template v-if="capacidadProduccion.length > 0">
                  <tr v-for="(item, i) in capacidadProduccion" :key="i">
                    <td>{{ i + 1 }}</td>
                    <td>{{ item.item }}</td>
                    <td>{{ item.tiempo_disenio }}</td>
                    <td>{{ item.tiempo_produccion }}</td>
                    <td>{{ item.tiempo_medicion }}</td>
                    <td>{{ item.tiempo_instalacion }}</td>
                    <td>{{ item.coeficiente_multiplicador }}</td>
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
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faTrash);
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
      cap: 0,
      updateIndex: 0,
    };
  },
  mounted() {
    this.setClear();
    this.time = {
      hour: 0,
      min: 0,
    },
    this.form = {
      item: "",
      tiempoDisenio: "00:00",
      tiempoProduccion: "00:00",
      tiempoMedicion: "00:00",
      tiempoInstalacion: "00:00",
      coeficiente: "0",
    };
    this.getAll();
  },
  methods: {
    deleteItem(id) {
      this.loadingPage = true;

      HTTP.delete("/api/capacidad_produccion/" + id).then((result) => {
        this.loadingPage = false;
        if (result.data) {
          //this.successSwal.show();
          this.$swal({
            title: "¡Enhorabuena!",
            text: "¡Capacidad borrada con éxito!",
            type: "success",
          });

          this.getAll();
        }
      });
    },
    inputItemValidity() {
      return this.resetFormFields ? null : this.form.item != "";
    },
    inputTiempoDisenioValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form.tiempoDisenio) &&
            this.form.tiempoDisenio != "" &&
            Number.isInteger(parseFloat(this.form.tiempoDisenio));
    },
    inputTiempoProduccionValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form.tiempoProduccion) &&
            this.form.tiempoProduccion != "" &&
            Number.isInteger(parseFloat(this.form.tiempoProduccion));
    },
    inputTiempoMedicionValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form.tiempoMedicion) &&
            this.form.tiempoMedicion != "" &&
            Number.isInteger(parseFloat(this.form.tiempoMedicion));
    },
    inputTiempoInstalacionValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form.tiempoInstalacion) &&
            this.form.tiempoInstalacion != "" &&
            Number.isInteger(parseFloat(this.form.tiempoInstalacion));
    },
    inputCoeficienteMultiplicadorValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form.coeficiente) &&
            this.form.coeficiente != "";
    },
    loadTimes(cap) {
     this.cap = cap;
     let data;

     switch (cap) {
        case 1:
          data = this.form.tiempoDisenio.split(":");
          this.time.hour=parseInt(data[0]);
          this.time.min=parseInt(data[1]);
          break;
        case 2:
          data = this.form.tiempoProduccion.split(":");
          this.time.hour=parseInt(data[0]);
          this.time.min=parseInt(data[1]);
          break;
        case 3:
          data = this.form.tiempoMedicion.split(":");
          this.time.hour=parseInt(data[0]);
          this.time.min=parseInt(data[1]);
          break;
        case 4:
          data = this.form.tiempoInstalacion.split(":");
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

      switch (this.cap) {
        case 1:
          this.form.tiempoDisenio = timeUp;
          break;
        case 2:
          this.form.tiempoProduccion = timeUp;
          break;
        case 3:
          this.form.tiempoMedicion = timeUp;
          break;
        case 4:
          this.form.tiempoInstalacion = timeUp;
          break;
      }
    },
    setClear() {
      this.updateIndex = 0;
      this.form = {
        item: "",
        tiempoDisenio: "00:00",
        tiempoProduccion: "00:00",
        tiempoMedicion: "00:00",
        tiempoInstalacion: "00:00",
        coeficiente: "0",
      };
    },
    editItem(capacidad) {
      this.updateIndex = capacidad.id;
      this.form = {
        item: capacidad.item,
        tiempoDisenio: capacidad.tiempo_disenio,
        tiempoProduccion: capacidad.tiempo_produccion,
        tiempoMedicion: capacidad.tiempo_medicion,
        tiempoInstalacion: capacidad.tiempo_instalacion,
        coeficiente: capacidad.coeficiente_multiplicador,
      };
    },
    store() {
      //verificar inputs
      let valido = true;
      this.resetFormFields = false;

      if (!this.inputItemValidity()) {
        valido = false;
      }

      if (!this.inputCoeficienteMultiplicadorValidity()) {
        valido = false;
      }

      if (!valido) {
        return;
      }

      this.resetFormFields = true;
      this.loadingPage = true;

      let reqData = {
        item: this.form.item,
        tiempo_disenio: this.form.tiempoDisenio,
        tiempo_produccion: this.form.tiempoProduccion,
        tiempo_medicion: this.form.tiempoMedicion,
        tiempo_instalacion: this.form.tiempoInstalacion,
        coeficiente_multiplicador: this.form.coeficiente,
      };

      HTTP.post("/api/capacidad_produccion/store", reqData).then((result) => {
        this.loadingPage = false;
        if (result.data) {
          this.$swal({
            title: "¡Enhorabuena!",
            text: "¡Capacidad agregado con éxito!",
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

      if (!this.inputItemValidity()) {
        valido = false;
      }

      if (!this.inputCoeficienteMultiplicadorValidity()) {
        valido = false;
      }
      this.resetFormFields = true;
      this.loadingPage = true;

      let reqData = {
        item: this.form.item,
        tiempo_disenio: this.form.tiempoDisenio,
        tiempo_produccion: this.form.tiempoProduccion,
        tiempo_medicion: this.form.tiempoMedicion,
        tiempo_instalacion: this.form.tiempoInstalacion,
        coeficiente_multiplicador: this.form.coeficiente,
      };

      HTTP.put("/api/capacidad_produccion/update/" + this.updateIndex, reqData).then((result) => {
        this.loadingPage = false;
        if (result.data) {
          this.$swal({
            title: "¡Enhorabuena!",
            text: "¡Capacidad actualizada con éxito!",
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

      HTTP.get("/api/capacidad_produccion")
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
