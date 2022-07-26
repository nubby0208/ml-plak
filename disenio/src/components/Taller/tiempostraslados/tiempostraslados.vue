<template>
  <div id="app-tiempo-traslado" class="container">
    <div class="col-sm-12 col-sm-offset-1">
      <div class="col-sm-12 text-center py-3">
        <h2>Tiempos de Traslado</h2>
        <hr />
      </div>
      <b-overlay :show="loadingPage" opacity="0.6" spinner-variant="primary">
        <div id="tiempo-traslado" class="col-sm-12">
          <div>
            <b-form
              @submit="store"
              class="create-item-form row"
              autocomplete="off"
            >
              <div class="form-group col-sm-12 col-md-10">
                <label for="item">Descripción</label>
                <b-form-input
                  :state="inputDescripcionValidity()"
                  type="text"
                  class="form-control"
                  id="item"
                  v-model="form.descripcion"
                  placeholder="Descripcion"
                />
              </div>
              <div class="form-group col-sm-12 col-md-2">
                <label for="tiempoTraslado">Tiempo de Traslado</label>
                <b-form-input
                  readonly
                  title="Haga click para seleccionar el tiempo"
                  type="text"
                  class="form-control"
                  id="tiempoTraslado"
                  v-model="form.tiempoTraslado"
                  @click="loadTimes()"
                />
              </div>
            </b-form>
            <div class="form-submit-container col-md-12">
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
                <th>Descripción</th>
                <th>Tiempo Traslado</th>
                <th></th>
              </thead>

              <tbody>
                <template v-if="tiemposTraslados.length > 0">
                  <tr v-for="(item, i) in tiemposTraslados" :key="i">
                    <td>{{ i + 1 }}</td>
                    <td>{{ item.descripcion }}</td>
                    <td>{{ item.tiempo_traslado }}</td>
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
import { HTTP } from "@/index";

library.add(faTrash);

export default {
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      tiemposTraslados: [],
      form: {},
      loadingPage: false,
      resetFormFields: true,
      time: {},
      updateIndex: 0,
    };
  },
  mounted() {
    this.setClear();
    this.form = {
      descripcion: "",
      tiempoTraslado: "00:00",
    };
    this.time = {
      hour: 0,
      min: 0,
    },
    this.getAll();
  },
  methods: {
    inputDescripcionValidity() {
      return this.resetFormFields ? null : this.form.descripcion != "";
    },
    inputTiempoTrasladoValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form.tiempoTraslado) &&
            this.form.tiempoTraslado != "" &&
            Number.isInteger(parseFloat(this.form.tiempoTraslado));
    },
    deleteItem(id) {
      this.loadingPage = true;

      HTTP.delete("/api/tiempo_traslado/" + id).then((result) => {
        this.loadingPage = false;
        if (result.data) {
          //this.successSwal.show();
          this.$swal({
            title: "¡Enhorabuena!",
            text: "¡Tiempo de traslado borrado con éxito!",
            type: "success",
          });

          this.getAll();
        }
      });
    },
    loadTimes() {
     let data;
     data = this.form.tiempoTraslado.split(":");
     this.time.hour=parseInt(data[0]);
     this.time.min=parseInt(data[1]);
     this.$bvModal.show('time');
    },
    setTimeUp(){
      this.$bvModal.hide('time');
      let timeUp = (this.time.hour > 9) ? this.time.hour.toString() : "0" + this.time.hour.toString();
      timeUp = (this.time.min > 9) ? timeUp + ":" + this.time.min.toString() : timeUp + ":" + "0" + this.time.min.toString();
      this.time.hour = 0;
      this.time.min = 0;
      this.form.tiempoTraslado = timeUp;
    },
    setClear() {
      this.updateIndex = 0;
      this.form = {
        descripcion: "",
        tiempoTraslado: "00:00"
      };
    },
    editItem(traslado) {
      this.updateIndex = traslado.id;
      this.form = {
        descripcion: traslado.descripcion,
        tiempoTraslado: traslado.tiempo_traslado
      };
    },
    store() {
      //verificar inputs
      let valido = true;

      this.resetFormFields = false;

      if (!this.inputDescripcionValidity()) {
        valido = false;
      }

      if (!valido) {
        return;
      }

      this.resetFormFields = true;

      //
      this.loadingPage = true;

      let reqData = {
        descripcion: this.form.descripcion,
        tiempo_traslado: this.form.tiempoTraslado,
      };

      HTTP.post("/api/tiempo_traslado/store", reqData).then((result) => {
        this.loadingPage = false;
        if (result.data) {
          //this.successSwal.show();
          this.$swal({
            title: "¡Enhorabuena!",
            text: "¡Tiempo de traslado agregado con éxito!",
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

     if (!this.inputDescripcionValidity()) {
        valido = false;
      }

      this.resetFormFields = true;
      this.loadingPage = true;

      let reqData = {
        descripcion: this.form.descripcion,
        tiempo_traslado: this.form.tiempoTraslado,
      };

      HTTP.put("/api/tiempo_traslado/update/" + this.updateIndex, reqData).then((result) => {
        this.loadingPage = false;
        if (result.data) {
          this.$swal({
            title: "¡Enhorabuena!",
            text: "¡Tiempo de traslado actualizado con éxito!",
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

      HTTP.get("/api/tiempo_traslado")
        .then((result) => {
          if (result.data != null) {
            this.tiemposTraslados = result.data.data;
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

<style>
</style>
