<style lang="scss">
  .title {
    text-align: left;
    font-size: 20px;
    color: #aaa;
  }
  .conexion-row:hover {
    background-color: rgba(123, 66, 123, 0.46);
    font-style: italic;
    font-weight: bold;
  }
  .layers-combo {
    width: 150px;
  }
  .margin-top-5 {
    margin-top: 5px;
  }
  .general.bordered-container {
    .bordered-section {
      .label {
        color: #6c757d;
      }
      .value {
        font-weight: bold;
        font-size: 15px;
      }
    }
  }
  .ml-label {
    margin-bottom: 0px;
    margin-right: 5px;
  }
  .visible-3d {
    align-items: center;
    justify-content: center;
    border-right: solid 1px #ccc;
  }
  .comment-element {
    display: flex;
    padding: 8px 24px;
  }
  .capa {
    text-align: left;
    padding: 8px 24px;
  }
</style>
<template>
  <div>
     
      <div class="general bordered-container">
        <div class="flex">
          <div class="container-title not-printable"  @click="toggleContainer('general')">
            <span class="container-toggler more" v-if="containerExpanded['general']">▼</span>
            <span class="container-toggler less" v-if="!containerExpanded['general']">▲</span>
            General
          </div>
        </div>
        <div class="bordered-section" :class="{'uncollapsed': containerExpanded['general']}">
          <div class="flex">
            <div class="flex-1">
              <span class="label">Id</span>
              <span class="value">{{ selected }}</span>
            </div>

            <div class="flex-1" v-if="!isCube">
              <span class="label">LVeta</span>
              <span class="value">{{ lveta | round }}mm</span>
            </div>

            <div class="flex-1" v-if="!isCube">
              <span class="label">AVeta</span>
              <span class="value">{{ aveta | round }}mm</span>
            </div>

            <div class="flex-1" v-if="!isCajon && !isCube">
              <span class="label">Espesor</span>
              <span class="value">{{ thickness | round }}mm</span>
            </div>
          </div>

          <div class="flex">
            <div class="flex-1 comment-element">
              <label class="ml-label" for="elemento-comentario">Comentario</label>
              <input name="elemento-comentario" id="elemento-comentario" class="flex-1" v-model="comentario">
            </div>
          </div>

          <div class="flex" v-if="!isCube">
            <div class="flex-1 flex visible-3d">
              <label class="ml-label" for="visible-en-3d">Visible en 3d</label>
              <input id="visible-en-3d" name="visible-en-3d" type="checkbox" v-model="visibility">
            </div>

            <div class="flex-1 flex visible-3d">
              <label class="ml-label" for="girar-veta">Girar veta</label>
              <input id="girar-veta" name="girar-veta" type="checkbox" v-model="selectedElement.girarVeta">
            </div>

            <div class="flex-1" v-if="allowsDrawing">
              <button class="btn btn-link btn-sm" @click="openDrawingModal()">Agregar dibujo a pieza</button>
            </div>
          </div>

          <div class="flex">
            <div class="flex-1 capa" v-if="layerable">
              <label class="ml-label" for="capa">Capa</label>
              <select id="capa" name="capa" v-model="selectedElement.layerId" class="layers-combo" @change="changeLayer($event)">
                <option value="-1">Sin capa</option>
                <option v-for="(layer, index) in layers" :key="index" :value="index">{{ layer.name }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

    <table style="margin-top: 15px" class="table table-bordered">
        <tr v-if="connectionsBefore && connectionsBefore.length > 0">
          <td colspan="2">
            <p class="margin-top-5"><b>Conexiones Anteriores</b></p>
            <table class="table table-bordered" @mouseout="setHoveredElement(null)">
              <tr>
                <td>Nombre</td>
                <td>Tipo</td>
              </tr>
              <tr class="conexion-row" v-for="(c, index) in connectionsBefore" :key="index" @mouseover="setHoveredElement(c.separator.id)">
                <td>{{ c.separator.name }}</td>
                <td>
                  <select v-model="c.tipo" @change="calcularConexion(selectedElement, c, $event)">
                    <option v-for="tipo in conexionTipo" :key="tipo.key" :value="tipo.value">{{ tipo.value }}</option>
                  </select>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr v-if="connectionsAfter && connectionsAfter.length > 0">
          <td colspan="2">
            <p class="margin-top-5"><b>Conexiones Posteriores</b></p>
            <table class="table table-bordered" @mouseout="setHoveredElement(null)">
              <tr>
                <td>Nombre</td>
                <td>Tipo</td>
              </tr>
              <tr class="conexion-row" v-for="(c, index) in connectionsAfter" :key="index" @mouseover="setHoveredElement(c.separator.id)">
                <td>{{ c.separator.name }}</td>
                <td>
                  <select v-model="c.tipo" @change="calcularConexion(selectedElement, c, $event)">
                    <option v-for="tipo in conexionTipo" :key="tipo.key" :value="tipo.value">{{ tipo.value }}</option>
                  </select>
                </td>
              </tr>
            </table>
          </td>
        </tr>
    </table>


    <!-- Modal dibujo calco -->
    <b-modal ref="drawingModal" hide-footer title="Agregar dibujo a calcomania" v-model="drawingModalShow">
        <div class="d-block text-center" v-if="drawingModalShow && calco">
          <div class="title">
            {{calco.separator.name}}
          </div>
          <drawing-canvas :calco="calco"></drawing-canvas>
        </div>
    </b-modal>
  </div>
</template>

<script>
import { ConexionTypeEnum } from '../models/models'
import { EnumToArray } from '../models/enums'
import { HTTP } from "../index";

export default {
  props: [ 'selected' ],
  data () {
    return {
      conexionTipo: EnumToArray(ConexionTypeEnum),
      drawingModalShow: false,
      containerExpanded: {
        general: true
      }
    }
  },
  mounted () {
    this.containerExpanded['general'] = this.isContainerExpanded('general')
    this.getConexiones()
  },
  computed: {
    allowsDrawing () {
      if (this.$store.state.layout.ambienteEnabled) {
        return false
      }

      return this.selectedElement.separator
    },
    selectedElement () {
      return this.$store.getters.selectedElement
    },
    layerable () {
      // elementos que por el momento se pueden organizar en en capas
      return this.selectedElement.liston || this.selectedElement.cajon || this.selectedElement.separadorCajon || this.selectedElement.cube
    },
    layers: {
      get () {
        return this.$store.getters.selectedModule.layers
      }
    },
    comentario: {
      get () {
        return this.selectedElement.comentario
      },
      set (value) {
        this.$store.commit('setComentario', value)
      }
    },
    visibility: {
      get () {
        return this.selectedElement.visible
      },
      set (value) {
        this.$store.commit('setVisibility', value)
      }
    },
    calco () {
      if (!this.selectedElement) {
        return
      }
      return this.$store.getters.getCalcoInfo(this.selectedElement.id)[0]
    },
    aveta () {
      const calco = this.$store.getters.getCalcoInfo(this.selectedElement.id)[0]
      return calco.AVeta
    },
    lveta () {
      const calco = this.$store.getters.getCalcoInfo(this.selectedElement.id)[0]
      return calco.LVeta
    },
    thickness () {
      return this.selectedElement.espesorListon || this.selectedElement.size
    },
    before () {
      return this.$store.getters.getBeforeSibling(this.selectedElement.id)
    },
    after () {
      return this.$store.getters.getAfterSibling(this.selectedElement.id)
    },
    connectionsBefore () {
      if (!this.selectedElement.separator) {
        return []
      }
      return this.selectedElement.conexionesBefore
    },
    connectionsAfter () {
      if (!this.selectedElement.separator) {
        return []
      }
      return this.selectedElement.conexionesAfter
    },
    isCajon () {
      return this.selectedElement.cajon
    },
    isCube () {
      return this.selectedElement.cube
    }
  },
  methods: {
    getConexiones () {
      const conexiones = []
      HTTP.get(
        "/api/configuracion/tipo/ConexionesConfig/all"
      )
        .then(({ data }) => {
          if (!data.error && data.configuraciones) {
            data.configuraciones.forEach((config) => {
              const object = this.buildFromJson(config.values);
              object.id = config.id;
              if (object.tipo === "conexion") {
                conexiones.push(object);
              }
            });
          }
          localStorage.setItem('conexiones', JSON.stringify(conexiones))
          // agrego las conexiones por default
          this.conexionTipo = [...EnumToArray(ConexionTypeEnum), ...conexiones.map(c => ({ key: c.key, value: c.nombre }))]
        })
        .catch((result) => {
          this.isBusy = false;
          this.$noty.error(
            "¡Error al cargar la configuracion de las conexiones!"
          );
        });
    },
    buildFromJson(values) {
      const obj = {};
      values.forEach((value) => {
        obj[value.name] = value.value;
      });
      return obj;
    },
    toggleContainer (containerId) {
      const value = localStorage.getItem(containerId)
      if (value === 'true') {
        localStorage.setItem(containerId, 'false')
        this.containerExpanded[containerId] = false
      } else {
        localStorage.setItem(containerId, 'true')
        this.containerExpanded[containerId] = true
      }
    },
    isContainerExpanded (containerId) {
      const value = localStorage.getItem(containerId)
      if (value === undefined) {
        return true
      }
      return localStorage.getItem(containerId) === 'true'
    },
    openDrawingModal () {
      this.$refs.drawingModal.show()
    },
    changeLayer (e) {
      // this.$store.commit('layerChanged')
    },
    calcularConexion: function (selectedElement, conexion, event) {
      this.$store.commit('calcularConexion', {
        separator: selectedElement,
        s2: conexion.separator,
        tipo: event.target.value
      })
      this.$store.commit('calcularConexiones', selectedElement)
    },
    setHoveredElement (id) {
      this.$store.commit('setHoveredElement', { elementId: id })
    }
  }
}
</script>