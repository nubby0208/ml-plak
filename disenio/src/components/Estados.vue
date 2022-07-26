<template>
  <div class="container">
    <notification></notification>
    <form>
      <div class="row mt-5">
        <div class="w-100 d-none d-md-block"></div>
        <div class="col-6 col-sm-4">
          <input
            type="text"
            class="form-control"
            placeholder="Escribe tu estado"
            v-model="formData.mensaje"
          />
        </div>
        <div class="col-6 col-sm-5">
          <select class="form-control" v-model="formData.dias">
            <option value="0" selected>Publicado por</option>
            <option value="1">Un día</option>
            <option value="2">Dos días</option>
          </select>
        </div>
        <button
          type="submit"
          class="btn btn-primary"
          @click="store()"
          :disabled="sendingButton"
        >
          Publicar Estado
        </button>
      </div>
    </form>

    <div class="row mt-5">
      <table class="estados-table table table-bordered">
        <thead style="background-color: beige">
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Mensaje</th>
            <th>Último ingreso</th>
            <th>Última salida</th>
            <th>Último estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="estado in activeUsuarios" :key="estado.id">
            <td class="font-weight-bold">
              {{ estado.usuario.nombre_completo }}
            </td>

            <td class="text-success"><font-awesome-icon :icon="'circle'" /></td>

            <td>{{ estado.mensaje }}</td>

            <td>{{ estado.ultimo_ingreso }}</td>

            <td>{{ estado.ultima_salida }}</td>

            <td>{{ estado.ultimo_estado }}</td>
          </tr>

          <tr v-for="estado in desactiveUsuarios" :key="estado.id">
            <td>{{ estado.usuario.nombre_completo }}</td>

            <td class="text-danger"><font-awesome-icon :icon="'circle'" /></td>

            <td>{{ estado.mensaje }}</td>

            <td>{{ estado.ultimo_ingreso }}</td>

            <td>{{ estado.ultima_salida }}</td>

            <td>{{ estado.ultimo_estado }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
.estados-table {
  background: white;
}
.estados-table tr,
.estados-table td {
  padding-top: 0rem;
  padding-bottom: 0rem;
}
</style>

<script>
import { HTTP } from "../index";

export default {
  data() {
    return {
      activos: [],
      inactivos: [],
      formData: {},
      sendingButton: false,
      displayableUsername: "",
    };
  },
  computed: {
    activeUsuarios: function() {
      return Object.values(this.activos).filter(usuario => usuario.usuario.activo !=  0);
    },

    desactiveUsuarios: function() {
      return Object.values(this.inactivos).filter(usuario => usuario.usuario.activo !=  0);
    },
  },
  mounted() {
    this.formData = {
      mensaje: "",
      dias: 0,
    };

    this.getEstados();

    this.displayableUsername = localStorage.getItem("user-name");
  },

  methods: {
    getEstados() {
      this.activos = [];
      this.inactivos = [];
      HTTP.get("/api/usuario/estados")
        .then((result) => {
          console.log(result);
          if (result.data) {
            this.activos = result.data.activos;
            this.inactivos = result.data.inactivos;
          } else {
            console.log("falló");
          }
        })
        .catch((result) => {
          console.log(result);
        });
    },

    store() {
      let reqData = {
        mensaje: this.formData.mensaje,
        dias: this.formData.dias,
        usuario_id: localStorage.getItem("user-id"),
      };

      this.sendingButton = true;

      HTTP.post("/api/usuario/estados", reqData)
        .then((result) => {
          this.sendingButton = false;
          this.getEstados();

          this.formData = {
            mensaje: "",
            dias: 0,
          };
        })
        .catch((result) => {
          console.log(result);
        });
    },
  },
};
</script>
