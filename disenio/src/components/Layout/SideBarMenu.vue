<template>
  <div>
    <b-navbar
      id="navbar"
      :class="{ ea: cm }"
      toggleable="lg"
      type="dark"
      variant="dark"
      style="padding: 0px !important"
    >
      <div class="menuLinks">
        <a
          class="sidebar-menu-item"
          style="cursor: pointer;"
          @click="goToDesignDashboard()"
          >Vistas de Diseño</a
        >

        <div>
          <router-link class="sidebar-menu-item" to="/taller"
            >Taller</router-link
          >
          <router-link class="sidebar-menu-item" to="/presupuestos"
            >Presupuestos</router-link
          >
          <router-link class="sidebar-menu-item" to="/compras"
            >Compras</router-link
          >
          <router-link class="sidebar-menu-item" to="/calendar"
            >Calendario</router-link
          >
          <router-link class="sidebar-menu-item" to="/tareacalendar"
            >Tareas</router-link
          >
          <router-link class="sidebar-menu-item" to="/ReportesFinalizados"
            >Reportes Finalizados</router-link
          >
          <router-link class="sidebar-menu-item" to="/asistencia"
            >Asistencia</router-link
          >
          <router-link class="sidebar-menu-item" to="/MiProduccion"
            >Mi producción</router-link
          >
          <router-link class="sidebar-menu-item" to="/produccion"
            >+ info (Producción)</router-link
          >
        </div>

        <router-link class="sidebar-menu-item" to="/estados"
          >Estados</router-link
        >

        <router-link class="sidebar-menu-item" to="/Lasistencia"
          >Mi sueldo</router-link
        >
        <router-link class="sidebar-menu-item" to="/HelpMe">
          Ayuda
        </router-link>


        <b-dropdown class="sidebar-menu-item" no-caret v-if="isAdministrador">
          <template #button-content>
            <b-icon icon="gear"></b-icon>
            <span>Ajustes</span>
          </template>
          <router-link class="dropdown-item" to="/Help">
            Ayuda
          </router-link>

          <router-link class="dropdown-item" to="/conexiones"
            >Conexiones</router-link
          >
          <router-link class="dropdown-item" to="/usuarios"
            >Usuarios</router-link
          >
          <router-link class="dropdown-item" to="/Grupos">Grupos</router-link>

          <router-link class="dropdown-item" to="/Auditoria"
            >Auditoría</router-link
          >
          <router-link class="dropdown-item" to="/Horario" v-if="hasPermiso"
            >Horarios x Usuario, Feriados y Rangos</router-link
          >
          <router-link class="dropdown-item" to="/PlanillaHoraria" v-if="hasPermiso"
            >Planilla Horaria</router-link
          >
          <router-link class="dropdown-item" to="/pregunta-exportar"
            >Preguntas al exportar</router-link
          >
          <router-link class="dropdown-item" to="/pregunta-vender"
            >Preguntas al vender</router-link
          >
          <router-link class="dropdown-item" to="/Materiales"
            >Materiales</router-link
          >
          <router-link class="dropdown-item" to="/proyecto"
            >Proyectos</router-link
          >
          <router-link class="dropdown-item" to="/Maquinas"
            >Maquinas</router-link
          >
          <router-link class="dropdown-item" to="/capacidadproduccion"
            >Capacidad de Producción</router-link
          >
          <router-link class="dropdown-item" to="/capacidadproduccionhoraria"
            >Capacidad de Producción Horaria</router-link
          >
          <router-link class="dropdown-item" to="/tiempostraslados"
            >Tiempo de Traslados</router-link
          >
          <router-link class="dropdown-item" to="/adminimages"
            >Administrador de Imagenes</router-link
          >
          <router-link class="dropdown-item" to="/respaldo"
            >Respaldos</router-link
          >
          <router-link class="dropdown-item" to="/reportes"
            >Reportes</router-link
          >
          <router-link class="dropdown-item" to="/clientView"
            >Vistas Clientes</router-link
          >
          <router-link class="dropdown-item" to="/clientViewSequence"
            >Secuencia Clientes</router-link
          >
          <router-link class="dropdown-item" to="/clientViewStorage"
          >Resultados Secuencia Clientes</router-link
          >

          <router-link class="dropdown-item" to="/notification">
            Notificaciones
          </router-link>
        </b-dropdown>
        <a class="sidebar-menu-item" @click="doLogout($event)">
          <b-icon icon="power"></b-icon>
          Salir
        </a>
      </div>
    </b-navbar>
  </div>
</template>

<script>
import { HTTP, EventBus } from "@/index";
import usuarioService from "../Taller/Services/usuarioService";
import { tryCatch } from 'rxjs/internal-compatibility';
const UsuarioService = new usuarioService();

export default {
  data() {
    return {
      modulo: "",
      displayableUsername: "",
      hasPermiso: false,
      usuario: null,
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
    isAdministrador() {
      if(this.usuario)
        return this.usuario.rol_id == 1
      return false
    }
  },
  created() {
    this.getModuloFromStore();
    this.getPermisoByUser();
    EventBus.$on('changePermisoSueldo', () => {
      this.getPermisoByUser();
    })
  },
  mounted() {
    this.getPermisoByUser();
  },
  methods: {
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
    goToTaller() {
      localStorage.setItem("modulo", "asistencia");
      this.modulo = "asistencia";
      this.$router.push("/asistencia");
      this.$emit("moduloCambiado");
      this.getModuloFromStore();
    },
    goToDesignDashboard() {
      if (localStorage.getItem('projectID')!=null ) {
            localStorage.setItem("modulo", "DesignDashboard");
            this.modulo = "DesignDashboard";
            this.$router.push({ name: "DesignDashboard", params: { id: localStorage.getItem('projectID') } });
            this.$emit("moduloCambiado");
            this.getModuloFromStore();
      }else{
        this.$router.push('/design-start');
      }
    },
    doLogout: function (event) {
       var loged_user = JSON.parse(localStorage.getItem('usuario'))
      HTTP.get(`/api/logout/`+loged_user.id, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
        .then((result) => {
          localStorage.removeItem("token");
          localStorage.removeItem("user-name");
          localStorage.removeItem("user-id");
          localStorage.removeItem("user-rol");
          localStorage.removeItem("modulo");

          EventBus.$emit("userLoggedOut");
          this.$router.push("login");
        })
        .catch((result) => {
          localStorage.removeItem("token");
          localStorage.removeItem("user-name");
          localStorage.removeItem("user-id");
          localStorage.removeItem("user-rol");
          localStorage.removeItem("modulo");
          EventBus.$emit("userLoggedOut");
          this.$router.push("login");
        });
    },
    getPermisoByUser() {
      let user;
      try{
        user = JSON.parse(localStorage.getItem('usuario'))
      } catch (error) {
        console.log(error)
        return
      }
      UsuarioService.getPermiso(user.id).then(response => {
        if ((response.data) && (response.data != undefined)) {
          this.hasPermiso = response.data.permiso
          this.usuario = response.data
      }  
      }).catch(error => {
        console.log(error)
        this.usuario = user
        this.$noty.error('Ha ocurrido un error obteniendo los datos del usuario')
      })
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
.nav-titulo {
  margin-right: auto;
}
.menuLinks {
  width: 100%;
}
.sidebar-menu-item {
  padding-left: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin: 0px;
  display: block;
  background: #ffffff14;
  font-size: 1.25rem;
}
.sidebar-menu-item:hover {
  background: #d2d3ff21;
  color: white;
  text-decoration: none;
}
.sidebar-menu-item {
  color: white;
  cursor: pointer;
}
.sidebar-menu-item .dropdown-toggle {
  background: transparent;
  border: 0;
  width: 100%;
  height: 100%;
  margin-left: -0.8rem;
  display: flex;
  margin-top: -6px;
  margin-bottom: -6px;
}
.sidebar-menu-item .dropdown-toggle svg {
  margin: auto;
  margin-left: 0px;
  margin-right: 10px;
}
.sidebar-menu-item .dropdown-toggle span {
  font-size: 1.25rem;
  line-height: inherit;
  white-space: nowrap;
}
</style>
