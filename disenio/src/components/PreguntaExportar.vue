<template>
  <div>
    <div class="preguntas-exportar">
      <h5>Preguntas al exportar</h5>
      <b-table-simple
        hover
        small
        responsive
        striped
        :class="{ loading: isBusy }"
      >
        <colgroup>
          <col />
          <col />
        </colgroup>
        <colgroup>
          <col />
          <col />
          <col />
        </colgroup>
        <colgroup>
          <col />
          <col />
        </colgroup>
        <b-thead>
          <b-tr>
            <b-th>Pregunta</b-th>
            <b-th>Estado</b-th>
            <b-th>Accion</b-th>
          </b-tr>
        </b-thead>
        <b-tbody v-if="!isBusy">
          <template v-for="(pe, i) in preguntasExportar">
            <b-tr v-bind:key="pe.id">
              <b-th>
                <b-form-input v-if="pe.edit" id="input-10" placeholder="Escriba su pregunta" v-model="pe.pregunta"></b-form-input>
                <span v-else>{{pe.pregunta}}</span>
              </b-th>
              <b-th>
                  <b-form-select v-if="pe.edit" v-model="pe.estatus" :options="optionsPreguntasExportar"></b-form-select>
                  <span v-else>{{pe.estatus}}</span>
              </b-th>
              <th>
                <b-button
                  size="sm"
                  variant="outline-primary"
                  @click="pe.edit ? guardarPregunta(i):pe.edit=true"

                >
                  <b-icon :icon="pe.edit ? 'check':'pencil'"></b-icon>
                </b-button>

                <b-button
                  size="sm"
                  variant="outline-danger"
                  @click="eliminarPreguntaExportar(i)"
                >
                  <b-icon icon="trash"></b-icon>
                </b-button>
              </th>
            </b-tr>
          </template>
        </b-tbody>
      </b-table-simple>
      <div style="width:100%;">
        <b-button
          style="width:100%;"
          variant="outline-primary"
          size="sm"
          :disabled="isBusy"
          @click="agregarPreguntaExportar()"
          >Agregar pregunta</b-button
        >
      </div>
      <template v-if="isBusy">
        <div class="text-center text-danger my-2 loading">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Cargando...</strong>
        </div>
      </template>
    </div>
    <div id="footer">MlPlak - Centro de Diseño</div>
  </div>
</template>

<script>
import { HTTP } from "../index";
import Vue from "vue";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

import swal from "sweetalert2";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

export default {
  data() {
    return {
      countPreguntas:0,
      preguntasExportar:[],
      optionsPreguntasExportar:[
          { value: null, text: 'Por favor seleccione una opcion' },
          { value: 'activo', text: 'Activo' },
          { value: 'inactivo', text: 'Inactivo' },
      ],
      isBusy: false,
    };
  },
  name: "PreguntaExportar",
  props: [],
  methods: {
    async getPreguntas(){
      this.countPreguntas = 0;
      this.isBusy = true;
      return HTTP.get("/api/configuracion/tipo/preguntaExportar/all").then(a=>{
          this.isBusy = false;
          if(a.data.configuraciones.length > 0){

            this.preguntasExportar = a.data.configuraciones.map(function(abc) {
              return {
                id: abc.id,
                pregunta: abc.values.pregunta,
                estatus: abc.values.estatus,
                edit: false
              };
            });

            this.countPreguntas = this.preguntasExportar.length;
              // return a.data.configuraciones;
          }else{
              // return getters.getOptionConfig3d;
          }
      });
      
    },
    guardarPregunta(i){
      this.countPreguntas++;
      this.preguntasExportar[i].edit = false;
      if(this.preguntasExportar[i].id == null){
        HTTP.post('/api/configuracion', {
            name:`Pregunta ${this.countPreguntas}`,
            type:"preguntaExportar",
            values:this.preguntasExportar[i],
        }).then(result => {
          this.getPreguntas();
            // newConfig.id = result.data;
        }).catch(result => {
        });
        // alert("Agregar nueva pregunta");
      }else{
        HTTP.put(`/api/configuracion/${this.preguntasExportar[i].id}`, {
            type:"preguntaExportar",
            values:this.preguntasExportar[i],
        }).then((result) => {
          if (result.data.success) {
            this.$noty.success("¡Pregunta actualizada correctamente!");
          }
          this.getPreguntas();
        }).catch((result) => {
          this.$noty.error("¡Error al guardar los datos!");
        });
      }
      
      console.log(this.preguntasExportar[i]);

    },
    agregarPreguntaExportar(){
        this.preguntasExportar.push( {
            id: null,
            pregunta: "",
            estatus: "activo",
            edit: true
        });
    },
    modoPreguntaExportar(pregunta, opc){
        console.log(pregunta, opc);
        this.preguntasExportar[pregunta].edit = opc;
    },
    eliminarPreguntaExportar(pregunta){

      this.$swal("No podrá volver a acceder a dicha pregunta", {
        title: "¿Seguro de eliminar pregunta?",
        icon: "warning",
        buttons: {
          cancel: "Cancelar",
          aceptar: {
            text: "Confirmar",
            value: true,
          },
        },
      }).then((value) => {
        if (value === true) {

          HTTP.delete(`/api/configuracion/${this.preguntasExportar[pregunta].id}`).then(
            (response) => {
              if (response.data.success) {
                this.getPreguntas();
                this.$noty.success("¡Pregunta eliminada con éxito!");
              }
            }
          );
            
        } else {
          this.close();
        }
      });
    }
  },
  created() {},
  mounted() {
    this.getPreguntas();
  },
  computed: {},
};
</script>

<style scoped lang="scss">
.header-container {
  .help-button {
    position: absolute;
    right: 20px;
    margin-top: 10px;
  }
  a {
    position: absolute;
    left: 20px;
    margin-top: 10px;
    font-size: 16px;
  }
}
.modal-footer {
  display: flex;
  flex-direction: row;
}
.button-add-container {
  margin: 10px 0px;
  display: flex;
  flex-direction: row-reverse;
}
.preguntas-exportar,
.herramientas {
  padding: 20px;
}
b-table {
  margin: 20px 0px;
}
#footer {
  margin-top: 60px;
  left: 0px;
  bottom: 0px;
  height: 56px;
  width: 100%;
  padding: 10px 16px 0 24px;
  text-align: center;
  background: #35495e;
  color: white;
  font-size: 1.3em;
}
.valor-prof-container {
  background-color: #ccc;
  padding: 10px;
}
.conexion-forms-container {
  display: flex;

  .divider {
    width: 1px;
    background: #ccc;
    margin: 40px 0px;
  }

  .conexion-form {
    flex: 1;
    padding: 0px 20px;

    & > p {
      font-size: 24px;
    }
  }
}
.nombre-form {
  padding: 0px 20px;
}
.loading {
  opacity: 0.4;
}
</style>
