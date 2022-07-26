<template>

  <div class="bordered-container" v-shortkey="['alt', 'w']" @shortkey="setFocus('cant')">
    <div class="flex">
      <div class="container-title not-printable"  @click="containerExpanded = !containerExpanded">
        <span class="container-toggler less" v-if="containerExpanded">▲</span>
        <span class="container-toggler more" v-else>▼</span>
        Zona
      </div>
    </div>
    <div class="zona-bordered-section bordered-section not-printable" :class="{'uncollapsed': !containerExpanded}">
      
      <div class="flex zona-icon-actions">
        <div v-if="!hasChilds" class="flex zona-icons">
          <button class="increment-decrement-btn" @click="zonaCantidad--">-</button>
          <input ref="cant" id="zonaCantidad" type="number" v-model="zonaCantidad" class="zona-cantidad" >
          <button class="increment-decrement-btn" @click="zonaCantidad++">+</button>

          <div class="zona-icon-button" v-b-tooltip.hover.bottom title="Separador" @click="split({ layout: 'vertical' })" v-shortkey="['alt', 's']" @shortkey="split({ layout: 'vertical' })">
            <b-icon class="zona-icon" icon="layout-split" font-scale="2">
            </b-icon>
          </div>

          <div class="zona-icon-button" v-b-tooltip.hover.bottom title="Estante" @click="split({ layout: 'horizontal' })" v-shortkey="['alt', 'e']" @shortkey="split({ layout: 'horizontal' })">
            <b-icon class="zona-icon" icon="layout-split" font-scale="2" rotate="90">
            </b-icon>
          </div>

          <div v-if="!isAmbienteSelected" class="zona-icon-button" v-b-tooltip.hover.bottom title="Cajones" @click="addCajon()" v-shortkey="['alt', 'c']" @shortkey="addCajon()">
            <b-icon class="zona-icon" icon="inboxes" font-scale="2">
            </b-icon>
          </div>

          <div v-if="!isAmbienteSelected" class="zona-icon-button" v-b-tooltip.hover.bottom title="Barral" @click="addBarral()" v-shortkey="['alt', 'b']" @shortkey="addBarral()">
            <b-icon class="zona-icon" icon="slash" rotate="45" font-scale="2">
            </b-icon>
          </div>

          <div v-if="!isAmbienteSelected" class="zona-icon-button" v-b-tooltip.hover.bottom title="Bandeja" @click="addBandeja()" v-shortkey="['alt', 'x']" @shortkey="addBandeja()">
            <b-icon class="zona-icon" icon="dash-square-fill" font-scale="2">
            </b-icon>
          </div>
        </div>
      
        <div class="icon-separator"></div>
        
        <div class="flex zona-icons">
          <div v-if="!selectedElement.puerta && !isAmbienteSelected" class="zona-icon-button" v-b-tooltip.hover.bottom title="Puerta" @click="addPuerta()" v-shortkey="['alt', 'p']" @shortkey="addPuerta()">
            <b-icon class="zona-icon" icon="door-closed" font-scale="2">
            </b-icon>
          </div>

          <div v-if="!selectedElement.dobleFondo" class="zona-icon-button" v-b-tooltip.hover.bottom :title="dfName" @click="addDobleFondo()" v-shortkey="['alt', 'd']" @shortkey="addDobleFondo()">
            <b-icon class="zona-icon" icon="subtract" font-scale="2">
            </b-icon>
          </div>

          <div v-if="!isAmbienteSelected" class="zona-icon-button" v-b-tooltip.hover.bottom title="Estante Virtual" @click="split({ layout: 'horizontal' }, true)" v-shortkey="['alt', 'v']" @shortkey="split({ layout: 'horizontal' }, true)">
            <b-icon class="zona-icon" icon="three-dots" font-scale="2">
            </b-icon>
          </div>
        </div>
      </div>

      <!-- listones -->
      <div class="listones flex justify-center">
        <!-- Liston vertical -->
        <div class="small-screen-title">Liston Vertical</div>
        <div class="flex liston-vertical">

          <b-button-group>
            <b-button v-b-tooltip.hover.bottom title="Listón Vertical de Corte" variant="outline" @click="setListonVerticalTipo(1)" size="sm" :class="{'boton-liston-selected': listonVerticalTipo === 1}">
              <b-icon icon="layout-sidebar-reverse" style="color: #000;" font-scale="1"></b-icon>
            </b-button>
            <b-button v-b-tooltip.hover.bottom title="Listón Vertical de Frente" variant="outline" @click="setListonVerticalTipo(2)" size="sm" :class="{'boton-liston-selected': listonVerticalTipo === 2}">
              <b-icon icon="layout-sidebar-inset-reverse" style="color: #000;" font-scale="1"></b-icon>
            </b-button>

          </b-button-group>

          <div v-if="listonVerticalTipo === 1">
            <div class="flex">
              <input id="anchoListonVert" type="number" placeholder="Profundidad" v-model="anchoListonVert" class="vw-4">
              <input id="zListonVert" type="number" placeholder="Eje Z" v-model="zListonVert" class="vw-4">
              <b-button class="btn-agregar" variant="outline-secondary" @click="addListon('vertical', 1, anchoListonVert, zListonVert)" size="sm">
                <b-icon icon="plus" font-scale="1"></b-icon>
              </b-button>
            </div>
          </div>

          <div v-if="listonVerticalTipo === 2">
            <div class="flex">
              <input id="anchoListonVertCorte" type="number" placeholder="Ancho" v-model="anchoListonVertCorte" class="vw-4">
              <input id="zListonVertCorte" type="number" placeholder="Eje Z" v-model="zListonVertCorte" class="vw-4">
              <b-button class="btn-agregar" variant="outline-secondary" @click="addListon('vertical', 4, anchoListonVertCorte, zListonVertCorte)" size="sm">
                <b-icon icon="plus" font-scale="1"></b-icon>
              </b-button>
            </div>
          </div>

        </div>
     
        <!-- Liston horizontal -->
        <div class="small-screen-title">Liston Horizontal</div>
        <div class="flex liston-horizontal">
          <b-button-group>
            <b-button v-b-tooltip.hover.bottom title="Listón Horizontal de Corte" variant="outline" @click="setListonHorizontalTipo(1)" size="sm" :class="{'boton-liston-selected': listonHorizontalTipo === 1}">
              <b-icon icon="layout-sidebar-reverse" style="color: #000;" font-scale="1" rotate="90"></b-icon>
            </b-button>
            <b-button v-b-tooltip.hover.bottom title="Listón Horizontal de Frente" variant="outline" @click="setListonHorizontalTipo(2)" size="sm" :class="{'boton-liston-selected': listonHorizontalTipo === 2}">
              <b-icon icon="layout-sidebar-inset-reverse" font-scale="1" rotate="90" style="color: #000;"></b-icon>
            </b-button>
          </b-button-group>
          <div v-if="listonHorizontalTipo === 1">
            <div class="flex">
              <input id="anchoListonHorCorte" type="number" placeholder="Profundidad" v-model="anchoListonHorCorte" class="vw-4">
              <input id="zListonHorCorte" type="number" placeholder="Eje Z" v-model="zListonHorCorte" class="vw-4">
              <b-button class="btn-agregar" variant="outline-secondary" @click="addListon('horizontal', 2, anchoListonHorCorte, zListonHorCorte)" size="sm">
                <b-icon icon="plus" font-scale="1"></b-icon>
              </b-button>
            </div>
          </div>

          <div v-if="listonHorizontalTipo === 2">
            <div class="flex">
              <input id="anchoListonHor" type="number" placeholder="Alto" v-model="anchoListonHor" class="vw-4">
              <input id="zListonHor" type="number" placeholder="Eje Z" v-model="zListonHor" class="vw-4">
              <b-button class="btn-agregar" variant="outline-secondary" @click="addListon('horizontal', 3, anchoListonHor, zListonHor)" size="sm">
                <b-icon icon="plus" font-scale="1"></b-icon>
              </b-button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import swal from 'sweetalert2'
import { HTTP } from '@/plugins/HTTP.js'

export default {
  data () {
    return {
      zonaCantidad: 1,
      anchoListonVert: null,
      zListonVert: null,
      anchoListonVertCorte: null,
      zListonVertCorte: null,
      anchoListonHor: null,
      zListonHor: null,
      anchoListonHorCorte: null,
      zListonHorCorte: null,
      listonVerticalTipo: 1,
      listonHorizontalTipo: 1
    }
  },
  computed: {
    isAmbienteSelected () {
      return !!this.$store.state.layout.ambienteEnabled
    },
    dfName () {
      if (!this.isAmbienteSelected) {
        return 'Doble Fondo'
      }
      return 'Superficie'
    },
    herrajes () {
      return this.$store.getters.herrajes.map((herraje) => {
        return herraje.material + ' ' + herraje.nombre
      })
    },
    selectedElement () {
      return this.$store.getters.selectedElement
    },
    hasChilds () {
      return this.selectedElement.childs && this.selectedElement.childs.length > 0
    },
    containerExpanded: {
      get () {
        return this.$store.state.projectSettings.collapsibles.containerExpanded.zona
      },
      set (value) {
        this.$store.commit('setProjectSettingsCollapsibles', {
          key: 'containerExpanded',
          subKey: 'zona',
          value: value
        })
      }
    }
  },
  methods: {
    setListonVerticalTipo (tipo) {
      this.listonVerticalTipo = tipo
      this.anchoListonVertCorte = null
      this.zListonVertCorte = null
      this.anchoListonVert = null
      this.zListonVert = null
    },
    setListonHorizontalTipo (tipo) {
      this.listonHorizontalTipo = tipo
      this.anchoListonHorCorte = null
      this.zListonHorCorte = null
      this.anchoListonHor = null
      this.zListonHor = null
    },
    setErrorsIn3d (errors) {
      this.$store.commit('setErrorsIn3d', errors)
    },
    setFocus (ref) {
      this.$refs[ref].select()
    },
    split: function (options, virtual = false) {
      if (options.layout === 'vertical') {
        this.$store.commit('splitVertical', { count: Number(this.zonaCantidad) + 1 })
      } else {
        this.$store.commit('splitHorizontal', { count: Number(this.zonaCantidad) + 1, virtual })
      }
      this.zonaCantidad = 1
    },
    addCajon: function () {
      this.$store.commit('addCajon', Number(this.zonaCantidad))
      this.cajones = 1
    },
    addListon: function (type, orientacion, ancho, z) {
      if (type === 'vertical') {
        this.$store.commit('splitVertical', { count: Number(this.zonaCantidad) + 1, type: 'liston', ancho: Number(ancho), z: Number(z), orientacion: orientacion })
      } else {
        this.$store.commit('splitHorizontal', { count: Number(this.zonaCantidad) + 1, type: 'liston', ancho: Number(ancho), z: Number(z), orientacion: orientacion })
      }
    },
    addBarral: function (count) {
      this.$store.commit('splitHorizontal', { type: 'barral', count: Number(this.zonaCantidad) + 1 })
      this.zonaCantidad = 1
    },
    addBandeja: async function (count) {
      let result = await swal({
        title: 'Agregar bandeja',
        input: 'select',
        inputOptions: this.herrajes,
        inputPlaceholder: 'Seleccione corredera'
      })
      if (result.value !== undefined && result.value.length > 0) {
        this.$store.commit('splitHorizontal', { type: 'bandeja', count: Number(this.zonaCantidad) + 1, extra: this.herrajes[result.value] })
        this.zonaCantidad = 1
      }
    },
    addPuerta: function () {
      this.$store.commit('addPuerta')
    },
    addDobleFondo: function () {
      this.$store.commit('addDobleFondo')
    }
  }
}
</script>
<style lang="scss">
    @media (max-width: 1850px) {
      .listones {
        flex-direction: column;

        & > div.flex {
          justify-content: center;
          padding: 5px 0px;
        }
      }

      .small-screen-title {
        display: flex !important;
        align-items: center;
        margin-right: 10px;
      }

      .liston-vertical {
        border: none !important;
      }

      .liston-horizontal {
        left: 0px !important;
      }
  }

  .liston-vertical { 
    border-right: 1px solid #ccc;
  }

  .liston-horizontal {
    position: relative;
    left: 10px;
  }

  .small-screen-title {
    display: none;
  }
  .btn-agregar {
    margin-right: 10px;
  }
  .add-container {
    display: flex;
    flex-direction: row-reverse;
  }
  .boton-liston-selected {
    background-color: #007bff;
    color: white;
  }
  .liston-options {
    /* margin: 0 auto; */
    margin-top: 10px;
    margin-left: 2vw;
  }
  .section-title {
    text-align: left;
    /* margin-left: 10px; */
    font-size: 15px;
    /* width: 10vw; */
  }
  .margin-0 {
    margin: 0 auto;
  }
  .liston-container {
    margin-left: 10px;
  }
  .liston-container input {
    margin-left: 5px;
    margin-right: 5px;
  }
  .button-liston-container {
    margin-left: 50px;
  }
  .tall-button {
    height: 60px;
    width: 100%;
  }

  .no-border {
    border: none !important;
  }

  .bordered {
    border: 1px solid #dee2e6;
  }

  .zona-icon-button {
    cursor: pointer;
    padding: 2px 5px;
    transition: background-color 0.5s ease;
    border-radius: 2px;

    &:hover {
      background-color: #cbe2fb;
    }
  }

  .zona-icons {
    padding: 4px 0px;
  }

  .zona-cantidad {
    width: 2vw;
  }

  .zona-icon-actions {
    margin-bottom: 10px;

    & > div:first-of-type {
      width: 265px;
    }
  }

  .icon-separator {
    width: 1px;
    border-right: solid 1px #ccc;
    margin: 3px 3px;
  }
</style>
