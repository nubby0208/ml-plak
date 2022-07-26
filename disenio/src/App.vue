<template>
  <!-- Main Content -->
  <!-- Las clases mainTaller y mainDiseno solo se usan para cambiar el color del fondo -->
  <div id="app" :class="modulo === 'asistencia' ? 'mainTaller' : 'mainDiseno'">
    <!-- TopBar -->
    <div v-if="userAuthenticated && !this.$route.meta.notLogin">
      <TopBar
        :read-me-obj="readMeObj"
        @moduloCambiado="getModuloFromStore"
        @open-readme-modal="openReadMe"
        @open-projectlist-modal="openmodal"
      ></TopBar>
    </div>

    <!-- Status Bar -->
    <div
      class="status-bar error-bar"
      v-if="userAuthenticated && !this.$route.meta.notLogin && status3d && showStatus3d > 0"
    >
      3D Viewer: se ha producido un error.
      <a v-on:click="seeMore()" class="see-more-error">Ver más</a>
    </div>
    <div
      class="status-bar ok-bar"
      v-if="userAuthenticated && !this.$route.meta.notLogin && !status3d && showStatus3d === 2"
    >
      3D Viewer: Ok.
    </div>
    <menuContextual3d/>

    <div v-if="this.$route.meta.notLogin">
      <router-view></router-view>
    </div>
    <main v-else>
      <router-view></router-view>
    </main>

    <!-- Modales -->
    <b-modal
        ref="myModalRef"
        hide-footer
        title="Listado de proyectos guardados"
        >
        <div class="overflow-auto">
            <div class="row col">
            <div class="input-group input-group-sm">
                <div class="input-group-prepend">
                <span class="input-group-text" id="project-filter-label"
                    >Filtrar</span
                >
                </div>
                <input
                ref="filterInput"
                type="text"
                class="form-control"
                id="project-filter"
                v-on:keyup="filtrar()"
                v-model="filterQuery"
                />
            </div>
            </div>

            <div class="row col">
            <div class="search-check">
                <input
                type="checkbox"
                v-model="strictSearch"
                id="strict-search"
                @change="filtrar()"
                />
                <label for="strict-search">Busqueda estricta</label>
            </div>
            </div>
            <div class="row px-2 py-1">
                <div class="col">
                  <b-button
                      id="month"
                      size="sm"
                      class="btn btn-filter"
                      style="margin-right: 5px"
                      @click="loadproyectos('month')"
                    >
                90 Dias
                </b-button>
                </div>
                <div class="col">
                  <b-button
                      id="year"
                      size="sm"
                      class="btn btn-filter"
                      style="margin-right: 5px"
                      @click="loadproyectos('año')"
                    >

                Ultimo Año
                </b-button>
                </div>
                <div class="col">
                  <b-button
                      id="all"
                      size="sm"
                      class="btn btn-filter"
                      style="margin-right: 5px"
                      @click="loadproyectos('all')"
                    >

                Todos
                </b-button>
                </div>

            </div>
            <b-table
            striped
            hover
            :items="proyectosFiltered"
            :fields="fields"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :per-page="pagOptions.total"
            :current-page="pagOptions.active"
            >
            <template slot="cell(index)" slot-scope="data">
                {{ data.index + 1 }}
            </template>

            <template slot="cell(nombre)" slot-scope="data">
                <a href="#" @click="proyectoLoad(data.item.id)">{{
                data.item.nombre
                }}</a>
            </template>

            <template slot="cell(opcion)" slot-scope="data">
                <button
                type="button"
                class="btn btn-sm btn-danger"
                @click="proyectoDelete(data.item)"
                >
                Eliminar
                </button>
            </template>
            </b-table>

            <div class="mt-3">
            <b-pagination
                v-model="pagOptions.active"
                :total-rows="proyectosFiltered.length"
                :per-page="pagOptions.total"
                aria-controls="my-table"
                align="center"
            ></b-pagination>
            </div>
        </div>
        </b-modal>

    <b-modal size="xl" ref="readMeModal" hide-footer title="Notas sobre este proyecto">
      <div class="overflow-auto">
        <mc-wysiwyg  v-model="readMe" :height="530"></mc-wysiwyg>
        <div v-if="readMeObj" class="read-me-meta">
          <div class="created-at-meta">
            Creado: {{ readMeObj.createdAt }} por {{ readMeObj.createdBy }}
          </div>
          <div v-if="readMeObj.modifiedBy">
            Última modificación: {{ readMeObj.modifiedAt }} por
            {{ readMeObj.modifiedBy }}
          </div>
        </div>
        <div class="read-me-footer">
          <button
            type="button"
            class="btn-sm btn btn-success"
            @click="saveReadMe()"
          >
            Guardar
          </button>
          <button
            @click="closeReadMe()"
            type="button"
            class="btn btn-sm btn-default"
            data-dismiss="modal"
          >
            Cerrar
          </button>
          <button
            type="button"
            class="btn btn-sm btn-danger eliminar-nota"
            @click="deleteReadMe()"
          >
            Eliminar
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import { HTTP, EventBus } from "./index";
import swal from "sweetalert2";
import VueNoty from "vuejs-noty";
import BootstrapVue from "bootstrap-vue";
import Label from "./components/Module/Label.vue";
import TopBar from "./components/Layout/TopBar.vue";
import { McWysiwyg } from "@mycure/vue-wysiwyg";
import { isMobile } from "mobile-device-detect";
import menuContextual3d from "@/components/MenuContextual/menuContextual3d.vue";

Vue.use(VueNoty, {
  theme: "metroui",
});


Vue.use(BootstrapVue);

export default {
  components: {
    Label,
    McWysiwyg,
    TopBar,
    menuContextual3d
  },
  name: "app",
  data() {
    return {
      readMe: undefined,
      readMeObj: undefined,
      errorsIn3d: false,
      userAuthenticated: false,
      displayableUsername: "",
      filterQuery: "",
      proyectosFiltered: [],
      pagOptions: {
        total: 15,
        active: 0,
        sections: 0,
      },
      proyectos: [],
      strictSearch: false,
      sortBy: "created_at",
      sortDesc: true,
      fields: [
        { key: "index", label: "#" },
        { key: "nombre", sortable: true },
        { key: "created_at", label: "Creado", sortable: true },
        "opcion",
      ],
      modulo: "Diseño",
      esMobile: isMobile,
      filtro: 'month',
      month : null,
      year: null,
      all:null,
      isloaded:false,
      token_project:null
    };
  },
  created() {
    //window.addEventListener('beforeunload', this.beforeWindowUnload)

  },
  updated: function () {
    this.checkactive()
  },
  mounted: async function () {


    var vuex = JSON.parse(localStorage.getItem('vuex'))
    if(vuex){
      this.token_project =vuex.info.token_project
    }

      if (!this.$route.meta.notLogin) {
      HTTP.get("/api/configuracion/tipo/readme/all")
        .then(({data}) => {
          if (!data.error && data.configuraciones) {
            data.configuraciones.forEach((c) => {
              const idConfig = c.values.find(
                (config) => config.name === "project_id"
              );
              if (
                idConfig &&
                idConfig.value === this.token_project
              ) {
                const contentConfig = c.values.find(
                  (config) => config.name === "content"
                );
                const createdAtConfig = c.values.find(
                  (config) => config.name === "created_at"
                );
                const createdByConfig = c.values.find(
                  (config) => config.name === "created_by"
                );
                const modifiedByConfig = c.values.find(
                  (config) => config.name === "last_modified_by"
                );
                const modifiedAtConfig = c.values.find(
                  (config) => config.name === "last_modified"
                );
                this.readMe = contentConfig.value;
                this.readMeObj = {
                  id: c.id,
                  projectId: idConfig.value,
                  createdAt: createdAtConfig && createdAtConfig.value,
                  createdBy: createdByConfig && createdByConfig.value,
                  modifiedBy: modifiedByConfig && modifiedByConfig.value,
                  modifiedAt: modifiedAtConfig && modifiedAtConfig.value,
                };

                if (
                  this.$route.name === "DesignDashboard"
                ) {
                  this.openReadMe();
                }
              }
            });
          } else {
            this.readMe = undefined;
          }
        }).catch((result) => {
          this.$noty.error("¡Error al cargar datos!");
        });
      this.getModuloFromStore();
      this.initProcedure();
      this.checkUserSessionExpired();
    }

    document.getElementById("waiting-view").style.display="none"
  },
  computed: {
    in3d() {
      return this.$route.name === "3dviewer";
    },
    loadedProjectId: {
      get() {
        return localStorage.getItem("projectID") || undefined;
      },
      set(value) {
        localStorage.setItem("projectID", value);
      },
    },
    loadedProjectInfo() {
      return (
        "Proyecto: " +
        this.loadedProjectName +
        "\nCliente: " +
        this.$store.state.info.name +
        "\nMueble: " +
        this.$store.state.info.mueble +
        "\nCreado: " +
        localStorage.getItem("projectCreatedAt")
      );
    },
    loadedProjectName: {
      get() {
        return localStorage.getItem("projectName") || undefined;
      },
      set(value) {
        localStorage.setItem("projectName", value);
      },
    },
    showStatus3d() {
      return +localStorage.getItem("enable-status-3d");
    },
    status3d() {
      return this.$store.state.layout.errorsIn3d;
    },
  },
  methods: {
    beforeWindowUnload(e){
        //e.preventDefault();
        //e.returnValue = ''
        this.doLogout();
    },
    unload(){
      e.preventDefault();
      //alert('te vas')
    },
    // Verifica si la sesion expiró
    // en caso de que haya expirado, redirigir a login
    async checkUserSessionExpired() {
     var loged_user = JSON.parse(localStorage.getItem('usuario'))
      if (loged_user === null) {
        return;
      }
      HTTP.get("/api/user/tokenStatus/"+loged_user.id)
        .then((result) => {
          if ((result.data) && (result.data.response != 1)) {
            this.doLogout();
          }
        })
        .catch((error) => {
          this.doLogout();
        });
    },
    async checkactive(){
              try {
                this.month = document.getElementById('month')
                this.year = document.getElementById('year')
                this.all = document.getElementById('all')
                }catch(error){
                  alert(error)
                }
       },
    doLogout: function (event) {
      var loged_user = JSON.parse(localStorage.getItem('usuario'))
      HTTP.get(`/api/logout/`+loged_user.id ,{
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
        .then((result) => {
          localStorage.removeItem("token");
          localStorage.removeItem("user-name");
          localStorage.removeItem("user-id");
          localStorage.removeItem("user-rol");
          localStorage.removeItem("modulo");

          EventBus.$emit("userLoggedOut");
          if (this.$route.name !== 'login') {
            this.$router.push('login')
          }
        })
        .catch((result) => {
          localStorage.removeItem("token");
          localStorage.removeItem("user-name");
          localStorage.removeItem("user-id");
          localStorage.removeItem("user-rol");
          localStorage.removeItem("modulo");
          EventBus.$emit("userLoggedOut");
          if (this.$route.name !== 'login') {
            this.$router.push('login')
          }
        });
    },
   async openmodal(){
         this.$refs.myModalRef.show()
        await this.checkactive()
        this.loadproyectos()
    },
    loadproyectos(initial = 'month'){
        this.$noty.info("Cargando lista de proyectos...", {
        timeout: 3000,
      });
      let self = this;

      switch (initial) {
        case 'month':
                self.filtro = "month"

                HTTP.get(`/api/proyecto-json/initial/month`)
                .then((result) => {
                  self.proyectosFiltered = result.data.proyectos;
                  self.proyectos = result.data.proyectos;

                  this.$noty.success("Datos Cargados", {
                    timeout: 1000,
                  });
                  this.month.setAttribute('disabled',true)
                  this.year.removeAttribute('disabled')
                  this.all.removeAttribute('disabled')

                })
                .catch((result) => {
                  console.log(result)
                });
          break;
          case 'año':
            self.filtro = "year"
                HTTP.get(`/api/proyecto-json/initial/year`)
                .then((result) => {
                  self.proyectosFiltered = result.data.proyectos;
                  self.proyectos = result.data.proyectos;
                  this.$noty.success("Datos Cargados", {
                    timeout: 1000,
                  });
                  this.month.removeAttribute('disabled')
                  this.year.setAttribute('disabled',true)
                  this.all.removeAttribute('disabled')
                })
                .catch((result) => {});
          break;
          case 'all':
                self.filtro = "all"
                HTTP.get(`/api/proyecto-json/initial/all`)
                .then((result) => {
                  self.proyectosFiltered = result.data.proyectos;
                  self.proyectos = result.data.proyectos;
                  this.$noty.success("Datos Cargados", {
                    timeout: 1000,
                  });
                  this.month.removeAttribute('disabled')
                  this.year.removeAttribute('disabled')
                  this.all.setAttribute('disabled',true)
                })
                .catch((result) => {});
          break;

        default:
          break;
      }
    },
    getModuloFromStore() {
      this.modulo = localStorage.getItem("modulo") || "asistencia";
    },
    deleteReadMe() {
      HTTP.delete(`/api/configuracion/${this.readMeObj.id}`).then(
        (response) => {
          if (response.data.success) {
            this.$noty.success("Notas eliminadas con éxito!");
            this.readMeObj = undefined;
            this.readMe = undefined;
            this.closeReadMe();
          }
        }
      );
    },
    saveReadMe() {

      const readMe = {
        name: "ReadMe",
        type: "readme",
        values: [
          { name: "content", value: this.readMe },
          { name: "project_id", value: this.token_project },
        ]
      };

      const today = new Date();
      const now =
        today.getDate() +
        "/" +
        (today.getMonth() + 1) +
        "/" +
        today.getFullYear() +
        " " +
        today.getHours() +
        ":" +
        today.getMinutes();
      if (this.readMeObj) {
        readMe.id = this.readMeObj.id;
        readMe.values.push({
          name: "created_by",
          value: this.readMeObj.createdBy,
        });
        readMe.values.push({
          name: "created_at",
          value: this.readMeObj.createdAt,
        });
        readMe.values.push({
          name: "last_modified_by",
          value: this.displayableUsername,
        });
        readMe.values.push({ name: "last_modified", value: now });

        HTTP.put("/api/configuracion/" + this.readMeObj.id, readMe)
          .then((result) => {
            this.$noty.success("¡Notas actualizadas correctamente!");
            console.log("result", result, readMe, this.readMeObj);
            this.closeReadMe();
          })
          .catch((err) => {
            this.$noty.error("Error al actualizar las notas");
          });
      } else {
        readMe.values.push({
          name: "created_by",
          value: this.displayableUsername,
        });
        readMe.values.push({ name: "created_at", value: now });

        HTTP.post("/api/configuracion", readMe)
          .then((result) => {
            if (result.data.success) {
              this.$noty.success("¡Notas guardadas correctamente!");
              this.closeReadMe();
              this.readMeObj = {
                id: result.data.id,
                projectId: this.token_project,
                createdAt: 'createdAt' && now,
                createdBy: 'createdBy' && this.displayableUsername,
                modifiedBy: 'modifiedBy' && this.displayableUsername,
                modifiedAt: 'modifiedAt' && now,
              };

            }
          })
          .catch((result) => {
            alert(result)
            this.$noty.error("¡Error al guardar los datos!");
          });
      }
    },
    closeReadMe() {
      this.$refs.readMeModal.hide();
    },
    openReadMe() {
      this.$refs.readMeModal.show();
    },
    async initProcedure() {
      // el usuario esta autenticado si estos datos existen.
      // de igual manera cualquier llamado al api fallará si el token está inválidado.
      this.userAuthenticated =
        localStorage.getItem("token") &&
        localStorage.getItem("user-name") &&
        localStorage.getItem("user-id") &&
        localStorage.getItem("user-rol");

      if (this.userAuthenticated) {
        this.displayableUsername = localStorage.getItem("user-name");
      }

      EventBus.$on("userLoggedIn", (loginSuccesful) => {
        this.userAuthenticated = loginSuccesful;
        this.displayableUsername = localStorage.getItem("user-name");
      });

      EventBus.$on("userLoggedOut", () => {
        this.userAuthenticated = false;
        this.displayableUsername = "";
      });
      if (!this.$route.params.id || this.$route.params.id == 0) {
        localStorage.setItem("refreshLoad", false);
        return;
      }
      // ej /disenio/#/DesignDashboard/493040020678131
      const refreshLoad = JSON.parse(localStorage.getItem("refreshLoad"));
      // se muda la precarga del proyecto a index
    },
    parseToken(token) {
      return this.$store.getters.parseToken(token);
    },
    filtrar() {
      if (!this.filterQuery) {
        this.proyectosFiltered = this.proyectos;
      }
      this.proyectosFiltered = [];
      if (this.strictSearch) {
        this.proyectosFiltered = this.proyectosFiltered.concat(
          this.proyectosFiltered,
          this.proyectos.filter((proy) => {
            return (
              proy.nombre
                .toUpperCase()
                .indexOf(this.filterQuery.toUpperCase()) > -1
            );
          })
        );
      } else {
        this.filterQuery.split(" ").forEach((q) => {
          if (q) {
            this.proyectosFiltered = this.proyectosFiltered.concat(
              this.proyectosFiltered,
              this.proyectos.filter((proy) => {
                return (
                  proy.nombre.toUpperCase().indexOf(q.trim().toUpperCase()) > -1
                );
              })
            );
          }
        });
      }
      if (!this.filterQuery) {
        this.proyectosFiltered = this.proyectos;
      }
    },
    proyectoLoad(proyecto, template_loaded = true) {
      this.$noty.info("Cargando datos. Por favor, espere ...", {
        timeout: 3000,
      });
      const oldVuew = localStorage.vuex;
      localStorage.vuex = {};
      if(proyecto.id!=0 || proyecto.id!=undefined){
          HTTP.get(`/api/proyecto-json/${proyecto}`)
        .then((response) => {
          if (response.data.proyecto) {
            this.setErrorsIn3d(undefined);
            localStorage.vuex = JSON.parse(response.data.proyecto.proyecto);
            if (response.data.proyecto.settings) this.$store.state.projectSettings = response.data.proyecto.settings
            this.loadedProjectName = response.data.proyecto.nombre;
            this.loadedProjectId = response.data.proyecto.id;
            localStorage.setItem(
              "projectCreatedAt",
              response.data.proyecto.created_at
            );
            if (template_loaded) {
              window.localStorage.setItem("default_template_loaded", true);
            }

                location.reload();

          }
        })
        .catch((response) => {
          this.$noty.error("No se pudo cargar el proyecto");
          localStorage.vuew = oldVuew;
        });
      }

    },
    proyectoDelete(proyecto) {
      let proyectoId = proyecto.id;
      let self = this;
      this.$swal("No podrá volver a acceder a dicho proyecto", {
        title: "¿Seguro de eliminar proyecto?",
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
          this.$noty.info("Eliminando proyecto...");
          HTTP.delete(`/api/proyecto-json/${proyectoId}`)
            .then((response) => {
              if (response.data.success === true) {
                this.$noty.success("¡Proyecto eliminado con éxito!");

                for (let i = 0; i < self.proyectosFiltered.length; i++) {
                  if (self.proyectosFiltered[i].id === proyectoId) {
                    self.proyectosFiltered.splice(i, 1);
                    break;
                  }
                }
              }
            })
            .catch((response) => {});
        } else {
          this.close();
        }
      });
    },
    setErrorsIn3d(errors) {
      this.$store.commit("setErrorsIn3d", errors);
    },
    seeMore() {
      swal({
        title:
          '<div><span class="error-3d-title">' +
          this.status3d.response.statusText +
          '</span><br><br><div class="error-3d-container"><span class="error-3d-text">' +
          this.status3d.response.data +
          "</span></div></div>",
        type: "error",
      });
    },
  },
  watch: {
    $route() {
      if (this.modulo == "DesignDashboard" && this.$route.name != "DesignDashboard") {
        this.modulo = "asistencia";
      } else if (
        this.modulo != "DesignDashboard" &&
        this.$route.name == "DesignDashboard"
      ) {
        this.modulo = "DesignDashboard";
      }
    },
  },
};
</script>

<style>
body {
  background-color: #f1f1f3;
}
/* cambiar el color por defecto de bootstrap a algo mas claro */
.bg-success {
  background-color: #abf4bc !important;
}
.bg-info {
  background-color: #7dd1f8 !important;
}
/** */

.mainTaller {
  background-color: #f1f1f3;
}
.mainDiseno {
  background-color: white;
}
.page-contents {
  margin: 20px;
}
@media only screen and (max-width: 800px) {
  /** Cuando es movil se reducen los margenes de cada pagina */
  .page-contents {
    margin-left: 10px;
    margin-right: 10px;
  }
}
.read-me-meta {
  display: flex;
  padding: 0px 10px 10px 10px;
}
.read-me-meta div {
  font-size: 13px;
  color: #6f6f6f;
}
.read-me-meta .created-at-meta {
  flex: 1;
}
.read-me-footer {
  display: flex;
  flex-direction: row-reverse;
  padding-bottom: 3px;
}

.read-me-footer button {
  margin: 0px 3px;
}

.eliminar-nota {
  margin-right: 20px !important;
}
navbar {
  padding: 0px !important;
}
.b-dropdown.config-toggle .dropdown-toggle {
  background-color: transparent;
  border: none;
}
.header-controls button svg {
  position: relative;
  bottom: 2px;
}
label {
  font-weight: 500 !important;
}
body {
  margin: 0;

  /* Ajuste de impresion */
  -webkit-print-color-adjust: exact;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
}

.header-right-side-controls {
  display: flex;
  align-items: center;
}

.header-controls {
  display: flex;
  align-items: center;
}

.header-controls .btn {
  height: 30px;
  margin: 0px 2px;
}

.welcome-msg {
  margin-left: 10px;
}

#nav-collapse.ea,
#navbar.ea,
#footer.ea {
  background: #146b3a;
}

#footer.ea {
  color: #ea6366;
}

.header-title-container {
  align-items: center;
  display: flex;
  margin-right: 15px;
  font-size: 20px;
}

.logout-btn {
  margin-left: 10px;
}

.status-bar {
  color: black;
  font-family: monospace;
  padding: 0px 25px;
}
.status-bar.error-bar {
  background: #f17878;
}
.status-bar.ok-bar {
  background: #c9e8c9;
}
.error-3d-text {
  font-size: 10px;
}
.error-3d-container {
  height: 400px;
  overflow-y: auto;
}
.see-more-error {
  cursor: pointer;
}
@media print {
  .no-print,
  .no-print * {
    display: none !important;
  }
}

/*  */
#userInfoBar {
  position: absolute;
  right: 0;
  top: 10px;
}

.toolmodules {
  padding: 5px;
  display: flex;
}

.btntoolmodule {
  width: 90px;
  display: flex;
  text-align: center;
}

.bntcontainer {
  width: 100%;
  display: flex;
}

.navbar-text {
  width: 250px !important;
}

/* tables responsive*/

@media only screen and (max-width: 800px) {
  /* Ajustar tablas para que se vea mas info */
  .table td,
  .table th {
    padding: 3px;
  }

  /* Force table to not be like tables anymore */
  #no-more-tables table,
  #no-more-tables thead,
  #no-more-tables tbody,
  #no-more-tables th,
  #no-more-tables td,
  #no-more-tables tr {
    display: block;
  }

  /* Hide table headers (but not display: none;, for accessibility) */
  #no-more-tables thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  #no-more-tables tr {
    border: 1px solid #ccc;
  }

  #no-more-tables td {
    /* Behave like a "row" */
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
    white-space: normal;
    text-align: left;
  }

  #no-more-tables td:before {
    /* Now like a table header */
    position: absolute;
    /* Top/left values mimic padding */
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    text-align: left;
    font-weight: bold;
  }

  /*
        Label the data
        */
  #no-more-tables td:before {
    content: attr(data-title);
  }
}

.size {
  padding: 5px !important;
}
</style>
