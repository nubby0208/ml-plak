<template>
  <div>
    <div v-if="cm" style="position: absolute; bottom: -60px">
      <img style="position: absolute" src="../assets/f.png" />
    </div>
    <div class="row w-100">
      <div class="bhoechie-tab-menu no-print">
        <div class="list-group">
          <a
            v-b-tooltip.hover.right
            title="General"
            href="#"
            class="list-group-item text-center"
            @click="menuOptionClicked('general')"
          >
            <b-icon icon="person" font-scale="1.5"></b-icon>
          </a>
          <a
            v-b-tooltip.hover.right
            title="Módulo"
            href="#"
            class="list-group-item text-center active"
            @click="menuOptionClicked('modulo')"
          >
            <b-icon v-if="!cm" icon="box" font-scale="1.5"></b-icon>
            <b-icon v-if="cm" icon="gift" font-scale="1.5"></b-icon>
          </a>
          <a
            v-b-tooltip.hover.right
            title="Ambiente de Instalación"
            href="#"
            class="list-group-item text-center"
            @click="menuOptionClicked('ambiente')"
            v-if="roomEditorEnabled"
          >
            <b-icon icon="house" font-scale="1.5"></b-icon>
          </a>
          <a
            v-b-tooltip.hover.right
            title="Mensajes"
            href="#"
            class="list-group-item text-center"
            @click="menuOptionClicked('mensajes')"
          >
            <b-icon icon="chat-square-dots" font-scale="1.5"></b-icon>
          </a>
          <a
            v-b-tooltip.hover.right
            title="Centro de Disenio CAD"
            class="list-group-item text-center"
            v-bind:href="disenio2dUrl"
          >
            <b-icon icon="pencil-square" font-scale="1.5"></b-icon>
          </a>
          <a
            v-b-tooltip.hover.right
            title="Exportar"
            href="#"
            class="list-group-item text-center"
            @click="menuOptionClicked('exportar')"
          >
            <b-icon icon="arrow-up-square" font-scale="1.5"></b-icon>
          </a>
          <a
            v-b-tooltip.hover.right
            title="Materiales"
            href="#"
            class="list-group-item text-center"
            @click="menuOptionClicked('materiales')"
          >
            <b-icon icon="receipt" font-scale="1.5"></b-icon>
          </a>
          <a
            v-b-tooltip.hover.right
            title="Administrador de Imágenes"
            href="#"
            class="list-group-item text-center"
            @click="menuOptionClicked('imagenes')"
          >
            <b-icon icon="images" font-scale="1.5"></b-icon>
          </a>
          <a
            v-b-tooltip.hover.right
            title="Fotos e Información de Obras"
            href="#"
            class="list-group-item text-center"
            @click="modoMovil(true)"
          >
            <b-icon icon="building" font-scale="1.5"></b-icon>
          </a>
          <a
            v-b-tooltip.hover.right
            title="Sistema"
            href="#"
            class="list-group-item text-center"
            @click="menuOptionClicked('sistema')"
          >
            <b-icon icon="gear" font-scale="1.5"></b-icon>
          </a>
        </div>
      </div>
      <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10 bhoechie-tab">
        <!-- section -->
        <div class="bhoechie-tab-content">
          <h1
            class="glyphicon glyphicon-plane"
            style="font-size: 14em; color: #55518a"
          ></h1>
          <h2>General</h2>
          <form-general></form-general>
        </div>

        <!-- MODULO section -->
        <div v-show="username" class="bhoechie-tab-content active">
          <form-module></form-module>
        </div>

        <!-- section -->
        <div class="bhoechie-tab-content" v-if="roomEditorEnabled">
          <room-editor></room-editor>
        </div>

        <!-- section -->
        <div class="bhoechie-tab-content">
          <h1
            class="glyphicon glyphicon-road"
            style="font-size: 12em; color: #55518a"
          ></h1>
          <messages-editor></messages-editor>
        </div>

        <!-- section -->
        <div class="bhoechie-tab-content">
          <h1
            class="glyphicon glyphicon-road"
            style="font-size: 12em; color: #55518a"
          ></h1>
          <DesignCAD></DesignCAD>
        </div>

        <!-- section -->
        <div v-show="username" class="bhoechie-tab-content">
          <form-export></form-export>
        </div>

        <!-- section -->
        <div v-show="username" class="bhoechie-tab-content">
          <listado-materiales v-if="materiales"> </listado-materiales>
        </div>

        <!-- section -->
        <div v-show="username" class="bhoechie-tab-content">
          <images-admin v-if="imagenes"> </images-admin>
        </div>

        <!-- section pablo-->
        <div v-show="username" class="bhoechie-tab-content">
          <interactive-picture v-if="mMovil" :modoMobile="mMovil">
          </interactive-picture>
        </div>

        <!-- section -->
        <div v-show="username" class="bhoechie-tab-content">
          <form-advanced></form-advanced>
        </div>
      </div>
    </div>
    <div id="footer" :class="{ ea: cm }">MlPlak - Centro de Diseño</div>
  </div>
</template>

<script>
import { HTTP } from "../index";
// import Vue from 'vue'
// import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

// Vue.use(BootstrapVue)
// Vue.use(BootstrapVueIcons)

export default {
  data() {
    return {
      materiales: false,
      imagenes: false,
      mMovil: false,
    };
  },
  name: "design",
  props: [],
  methods: {
    modoMovil(modo) {
      this.mMovil = true;
    },
    menuOptionClicked(section) {
      this.$store.commit("setLayoutProperty", {
        key: "currentDesignSystemSection",
        value: section,
      });
      this.toggleMateriales(section === "materiales");
      this.toggleImagenes(section === "imagenes");
      this.toggleAmbienteInstalacion(section === "ambiente");
    },
    toggleAmbienteInstalacion(value) {
      this.$store.commit("setLayoutProperty", {
        key: "ambienteEnabled",
        value,
      });
    },
    toggleMateriales(value) {
      this.materiales = value;
    },
    toggleImagenes(value) {
      this.imagenes = value;
    },
    watchModel() {
      try {
        const moduloModules = this.$store.getters.getModuloModules;
        let model = JSON.parse(window.localStorage.getItem("vuex"));
        model.layout.modules.forEach((modulo, index) => {
          if (modulo._x !== moduloModules[index]._x) {
            this.$store.commit("setEjeX", { _x: modulo._x, index });
          }
          if (modulo._y !== moduloModules[index]._y) {
            this.$store.commit("setEjeY", { _y: modulo._y, index });
          }
          if (modulo._z !== moduloModules[index]._z) {
            this.$store.commit("setEjeZ", { _z: modulo._z, index });
          }
          if (modulo._rx !== moduloModules[index]._rx) {
            this.$store.commit("setEjeRX", { _rx: modulo._rx, index });
          }
          if (modulo._ry !== moduloModules[index]._ry) {
            this.$store.commit("setEjeRY", { _ry: modulo._ry, index });
          }
          if (modulo._rz !== moduloModules[index]._rz) {
            this.$store.commit("setEjeRZ", { _rz: modulo._rz, index });
          }
        });
        const ambienteModules = this.$store.getters.getAmbienteModules;
        model.layout.roomEditorModules.forEach((modulo, index) => {
          if (modulo._x !== ambienteModules[index]._x) {
            this.$store.commit("setEjeX", { _x: modulo._x, index });
          }
          if (modulo._y !== ambienteModules[index]._y) {
            this.$store.commit("setEjeY", { _y: modulo._y, index });
          }
          if (modulo._z !== ambienteModules[index]._z) {
            this.$store.commit("setEjeZ", { _z: modulo._z, index });
          }
          if (modulo._rx !== ambienteModules[index]._rx) {
            this.$store.commit("setEjeRX", { _rx: modulo._rx, index });
          }
          if (modulo._ry !== ambienteModules[index]._ry) {
            this.$store.commit("setEjeRY", { _ry: modulo._ry, index });
          }
          if (modulo._rz !== ambienteModules[index]._rz) {
            this.$store.commit("setEjeRZ", { _rz: modulo._rz, index });
          }
        });
      } catch (e) {
        console.log("No se puede recuperar modelo", e);
      }
    },
  },
  created() {
    this.$store.commit("configureElement");
    window.axios = HTTP;
    HTTP.get(`/api/materiales/default`)
      .then(async (response) => {
        const materiales = response.data.materiales;
        if (!this.$store.state.general.materiales_add) {
          this.$store.commit("setGeneralProperty", {
            key: "materiales_add",
            value: JSON.stringify(
              materiales.filter((m) => m.tipo_material_id === 1)
            ),
          });
        }

        if (!this.$store.state.general.tapacantos_add) {
          this.$store.commit("setGeneralProperty", {
            key: "tapacantos_add",
            value: JSON.stringify(
              materiales.filter((m) => m.tipo_material_id === 2)
            ),
          });
        }

        if (!this.$store.state.general.herrajes_add) {
          this.$store.commit("setGeneralProperty", {
            key: "herrajes_add",
            value: JSON.stringify(
              materiales.filter((m) => m.tipo_material_id === 3)
            ),
          });
        }

        if (!this.$store.state.general.metales_add) {
          this.$store.commit("setGeneralProperty", {
            key: "metales_add",
            value: JSON.stringify(
              materiales.filter((m) => m.tipo_material_id === 4)
            ),
          });
        }
      })
      .then(() => {});
  },
  mounted() {
    const $ = window.$;
    console.log("___________DESIGN SYSTEM MOUNTED____________");
    this.$store.commit("setLayoutProperty", {
      key: "ambienteEnabled",
      value: false,
    });
    this.$store.commit("setLayoutProperty", {
      key: "currentDesignSystemSection",
      value: "modulo",
    });
    setInterval(() => this.watchModel(), 1000);
    // verificar si el usuario ha hecho login  de no ser asi, enviarlo de vuelta al inicio
    if (!(localStorage.getItem("token") && localStorage.getItem("user-name"))) {
      this.$router.push("/");
      return;
    }

    $(document).ready(function () {
      $("div.bhoechie-tab-menu>div.list-group>a").click(function (e) {
        e.preventDefault();
        $(this).siblings("a.active").removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
        $("div.bhoechie-tab>div.bhoechie-tab-content")
          .eq(index)
          .addClass("active");
      });
    });
  },
  computed: {
    roomEditorEnabled: {
      get() {
        return +localStorage.getItem("enable-room-editor") === 1;
      },
    },
    cm() {
      const today = new Date();
      return (
        today.getMonth() === 11 &&
        (today.getDate() === 24 || today.getDate() === 25)
      );
    },
    username: {
      get() {
        return this.$store.state.info.username;
      },
    },
    disenio2dUrl: {
      get() {
        return `${window.location.origin}/disenio2d/?user=${this.username}`;
      },
    },
  },
};
</script>

<style scoped lang="scss">
/*  bhoechie tab */
div.bhoechie-tab-container {
  z-index: 10;
  background-color: #ffffff;
  padding: 0 !important;
  border-radius: 4px;
  -moz-border-radius: 4px;
  border: 1px solid #ddd;
  margin-top: 20px;
  margin-left: 50px;
  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  -moz-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  background-clip: padding-box;
  opacity: 0.97;
  filter: alpha(opacity=97);
}
div.bhoechie-tab-menu {
  padding-right: 0;
  padding-left: 0;
  padding-bottom: 0;
  width: 55px;
}
div.bhoechie-tab-menu div.list-group {
  margin-bottom: 0;
}
div.bhoechie-tab-menu div.list-group a svg {
  position: relative;
  top: 2px;
}
div.bhoechie-tab-menu div.list-group > a {
  margin-bottom: 0;
}
div.bhoechie-tab-menu div.list-group > a .glyphicon,
div.bhoechie-tab-menu div.list-group > a .fa {
  color: #5a55a3;
}
div.bhoechie-tab-menu div.list-group > a:first-child {
  border-top-right-radius: 0;
  -moz-border-top-right-radius: 0;
}
div.bhoechie-tab-menu div.list-group > a:last-child {
  border-bottom-right-radius: 0;
  -moz-border-bottom-right-radius: 0;
}
div.bhoechie-tab-menu div.list-group > a.active:after {
  content: "";
  position: absolute;
  left: 100%;
  top: 50%;
  margin-top: -13px;
  border-left: 0;
  border-bottom: 13px solid transparent;
  border-top: 13px solid transparent;
  border-left: 10px solid #5a55a3;
}

div.bhoechie-tab-content {
  background-color: #ffffff;
  padding-left: 20px;
  padding-top: 10px;
  width: 90vw;
}

div.bhoechie-tab div.bhoechie-tab-content:not(.active) {
  display: none;
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
.bhoechie-tab {
  max-width: 100%;
  width: 95vw;
  display: flex;
  flex: 1;
}
.sidebar {
  position: relative;
  top: 60px;
}
</style>
