<template>
  <div class="top-bar">
    <b-navbar :class="{ ea: cm }" toggleable="lg" type="dark" variant="dark">
      <div class="left-items">
        <div class="sidebar-container">
          <b-button class="sidebar-toggle-button" v-b-toggle.sidebar-variant>
            <b-icon-list></b-icon-list>
          </b-button>

          <b-sidebar
            v-model="sidebarVisible"
            id="sidebar-variant"
            :title="displayableUsername"
            bg-variant="dark"
            text-variant="light"
            shadow
            style="user-select:none; width: 350px"
          >
            <SideBarMenu @moduloCambiado="procesarModuloCambiado"></SideBarMenu>
          </b-sidebar>
        </div>

        <b-navbar-brand class="nav-titulo" href="#">
          <b-nav-text class="text-light mr-1" style="padding-left: 1.2rem">
            <div v-if="modulo === 'DesignDashboard'">
              <span> ML PLAK </span>
              <span> - </span>
              <span
                v-if="loadedProjectName"
                v-bind:title="loadedProjectInfo"
                class="project-name"
                >{{ loadedProjectName }}</span
              >
              <span v-if="!loadedProjectName" class="project-name text-light"
                >Proyecto Nuevo</span
              >
            </div>
            <div v-else>
              <span> ML PLAK </span>
              <span> - {{ $route.name }} </span>
            </div>
          </b-nav-text>
        </b-navbar-brand>
      </div>

      <div class="right-items">
        <TopBarDisenoActions
          :read-me-obj="readMeObj"
          @open-readme-modal="$emit('open-readme-modal')"
          @open-projectlist-modal="$emit('open-projectlist-modal')"
          v-if="modulo === 'DesignDashboard'"
        ></TopBarDisenoActions>

        <div v-if="modulo === 'DesignDashboard'" class="acciones">
          <NotificacionBar/>
        </div>

        <div class="text-username">
          <span>Bienvenido, {{ displayableUsername }}</span>
        </div>
      </div>
    </b-navbar>

    <div
      v-if="sidebarVisible"
      @click="sidebarVisible = false"
      class="sidebar-shadow"
    ></div>
  </div>
</template>

<script>
import SideBarMenu from "./SideBarMenu";
import TopBarDisenoActions from "./TopBarDisenoActions";
import NotificacionBar from "./NotificacionBar";
import { HTTP, EventBus } from "@/index";

export default {
  components: {
    SideBarMenu,
    TopBarDisenoActions,
    NotificacionBar
  },
  props: ['readMeObj'],
  data() {
    return {
      modulo: "",
      sidebarVisible: false,
    };
  },
  computed: {
    cm() {
      const today = new Date();
      return (
        today.getMonth() === 11 &&
        (today.getDate() === 24 || today.getDate() === 25)
      );
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
  },
  created() {
    this.getModuloFromStore();
    this.getUserFromStore();
  },
  methods: {
    procesarModuloCambiado() {
      this.$emit("moduloCambiado");
      this.getModuloFromStore();
    },
    getModuloFromStore() {
      this.modulo = localStorage.getItem("modulo") || "asistencia";
      // si el localstorage dice que estamos en diseño
      // pero segun la ruta no, cambiar componentes
      if (this.modulo == "DesignDashboard" && this.$route.name != "DesignDashboard") {
        this.modulo = "asistencia";
      } else if (
        this.modulo != "DesignDashboard" &&
        this.$route.name == "DesignDashboard"
      ) {
        this.modulo = "DesignDashboard";
      }
    },
    async getUserFromStore() {
      // el usuario esta autenticado si estos datos existen.
      // de igual manera cualquier llamado al api fallará si el token está inválidado.
      let userAuthenticated =
        localStorage.getItem("token") &&
        localStorage.getItem("user-name") &&
        localStorage.getItem("user-id") &&
        localStorage.getItem("user-rol");

      if (userAuthenticated) {
        this.displayableUsername = localStorage.getItem("user-name");
      }

      EventBus.$on("userLoggedIn", (loginSuccesful) => {
        userAuthenticated = loginSuccesful;
        this.displayableUsername = localStorage.getItem("user-name");
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
/** El top bar es position fixed asi que hay
que agregar un margen para que el contenido no se esconda */
/** Usar padding porque si se usa margin-top, se ignora
el margin de page-contents */
main {
  padding-top: 56px;
}
@media only screen and (max-width: 800px) {
  main {
    padding-top: 90px;
  }
}
</style>

<style scoped>
.top-bar {
  position: fixed;
  z-index: 12; /** El b-loading tiene un z-index de 10, y el shadow 11 */
  width: 100%;
  top: 0;
}
.top-bar .navbar {
  padding: 0px;
}
.text-username {
  display: flex;
  color: white;
  min-width: max-content;
  margin: auto;
  margin-left: 10px;
  margin-right: 0px;
}
.sidebar-toggle-button {
  margin: auto;
  margin-left: 20px;
}
.right-items {
  display: flex;
  margin: auto;
  margin-right: 20px;
}
.left-items {
  display: flex;
}
.sidebar-container {
  display: flex;
}
.sidebar-shadow {
  z-index: 11; /** El b-loading tiene un z-index de 10 */
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.336);
}

@media only screen and (max-width: 800px) {
  .top-bar nav {
    display: block;
  }
  /** Alinear boton de sidebar cuando es movil */
  .sidebar-toggle-button {
    margin-left: 10px;
  }
  /** Ajustar texto de la derecha cuando es mobil */
  .top-bar .navbar {
    padding-bottom: 10px;
  }
  .right-items {
    display: block;
    margin-left: 10px;
    margin-right: 10px;
  }
  .text-username {
    margin-top: 10px;
  }
}

.header-project-name-container {
  flex: 1;
  display: flex;
  align-items: center;
}

.project-name {
  margin-left: 5px;
}

</style>