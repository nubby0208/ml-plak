
<template>

  <div>           
      <div class="general bordered-container">
        <div class="flex">
          <div class="container-title not-printable"  @click="containerExpanded = !containerExpanded">
            <span class="container-toggler less" v-if="containerExpanded">▲</span>
            <span class="container-toggler more" v-else>▼</span>
            General
          </div>
        </div>
        <div class="bordered-section" :class="{'uncollapsed': !containerExpanded}">
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
              <input
                id="visible-en-3d"
                name="visible-en-3d"
                type="checkbox"
                v-model="selectedPieceVisibility"
              >
            </div>

            <div class="flex-1 flex visible-3d">
              <label class="ml-label" for="girar-veta">Girar veta</label>
              <input id="girar-veta" name="girar-veta" type="checkbox" v-model="selectedElement.girarVeta">
            </div>

            <div class="flex-1 flex visible-3d">
              <label class="ml-label" for="grupo-set">Grupo 1</label>
              <input id="grupo-set" name="grupo-set" type="checkbox" @change="setGrupoMaterial(selectedElement.grupoMaterial)" v-model="selectedElement.grupoMaterial">
            </div>

            <div class="flex-1" v-if="allowsDrawing">
              <button class="btn btn-link btn-sm" @click="openDrawingModal()">Agregar dibujo a pieza</button>
            </div>
          </div>
          <div v-else>
            <div class="flex-1 flex visible-3d">
              <label class="ml-label" for="grupo-set">Grupo 1</label>
              <input id="grupo-set" name="grupo-set" type="checkbox" @change="setGrupoMaterial(selectedElement.grupoMaterial)" v-model="selectedElement.grupoMaterial">
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
    <b-modal ref="drawingModal" size="lg" hide-footer title="Agregar dibujo a calcomania" v-model="drawingModalShow">
        <div class="d-block text-center" v-if="drawingModalShow && calco">
          <div class="title">
            {{calco.separator.name}}
          </div>
          <drawing-canvas :calcoSideProps="caraDibujo" :calco="calco"></drawing-canvas>
        </div>
    </b-modal>
  </div>
</template>

<script>
import DrawingCanvas from './DrawingCanvas.vue'
import { HTTP } from '@/plugins/HTTP.js'
import { ConexionTypeEnum } from './models/models'
import { EnumToArray } from './models/enums'

export default {
  components: {
    DrawingCanvas
  },
  props: [ 'selected' ],
  data () {
    return {
      conexionTipo: [],
      drawingModalShow: false,
      caraDibujo:"front"
    }
  },
  mounted () {
    this.getConexiones()
  },
  computed: {
    containerExpanded: {
      get () {
        return this.$store.state.projectSettings.collapsibles.containerExpanded.general
      },
      set (value) {
        this.$store.commit('setProjectSettingsCollapsibles', {
          key: 'containerExpanded',
          subKey: 'general',
          value: value
        })
      }
    },
    allowsDrawing () {
      if (this.$store.state.layout.ambienteEnabled) {
        return false
      }

      return this.selectedElement.separator
    },
    selectedElement () {
      return this.$store.getters.selectedElement
    },
    selectedModulo () {
      return this.$store.getters.selectedModule
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
    selectedPieceVisibility: {
      get () {
        return this.selectedElement.visible
      },
      set (value) {
        this.$store.commit(
          'togglePieceVisibility',
          {
            visible: value,
            moduleName: this.selectedElement.moduleName,
            pieceName: this.selectedElement.name,
            isRoomEditor: false,
          }
        )
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
    setGrupoMaterial(valor){

      if(valor){
        var materialGrupo = this.materialDefaultGrupo();
        if(materialGrupo !== "" && materialGrupo !== null && materialGrupo !== " "){
          this.$store.commit('updatePiecesMaterialGrupo', { material: materialGrupo, update: 0 });
        }        
      }else{
        this.$store.commit('updatePiecesMaterialGrupo', { material: this.materialDefault(), update: 0, elementSelect:true });
      }
      
    },
    materialDefault () {
      const material = this.getMaterialDefaultPorModulo(this.selectedModulo.moduleId)
      return material ? JSON.parse(material) : ''
    },
    getMaterialDefaultPorModulo (id) {
      return this.$store.state.general[this.isAmbienteSelected ? 'material_default_por_modulo_room_editor' : 'material_default_por_modulo'][id - 1]
    },
    materialDefaultGrupo () {
      const material = this.getMaterialDefaultPorModuloGrupo(this.selectedModulo.moduleId)
      return material ? JSON.parse(material) : ''
    },
    getMaterialDefaultPorModuloGrupo (id) {
      return this.$store.state.general[this.isAmbienteSelected ? 'material_default_por_modulo_room_editor' : 'material_default_por_modulo_grupo'][id - 1]
    },
    getConexiones() {
      this.$store.dispatch('getConexionesDB').then((conexiones) => {
        console.log(this.$store.state.layout.conexionesDb);
        // localStorage.setItem('conexiones', JSON.stringify(conexiones))
        this.conexionTipo = this.$store.state.layout.conexionesDb.map(c => ({ key: c.key, value: c.nombre }))
      });
    },
    buildFromJson(values) {
      const obj = {};
      values.forEach((value) => {
        obj[value.name] = value.value;
      });
      return obj;
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
  },
}
</script>

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
