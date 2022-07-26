
<template>
    <div class="edit-custom-fondo" v-if="hasFondo">
     <div class="fondos bordered-container edit-custom-fondo" v-if="hasFondo">
        <div class="flex">
          <div class="container-title not-printable" @click="toggleContainer('fondos')">
            <span class="container-toggler more" v-if="containerExpanded['fondos']">▼</span>
            <span class="container-toggler less" v-if="!containerExpanded['fondos']">▲</span>
            Fondo
          </div>
        </div>
        <div class="bordered-section" :class="{'uncollapsed': containerExpanded['fondos']}">
          <div class="fondo-material">
            Material de fondo
            <span class="highlighted" v-if="materialFondo">{{materialFondo}}</span>
          </div>
          <div class="flex h-separator" v-for="fondo in customFondos" :key="fondo.Name">
            <div class="fondo-title-section cursor-pointer" :class="{selectedTitle: fondoSelectedName === fondo.Name}" v-on:click="selectFondo(fondo)">{{fondo.Name}}</div>
            <div class="flex flex-column fondo-medidas flex-1 bordered-separator-right">
              <div class="flex">
                <span class="fondo-label inline-flex">Estirar hacia arriba</span>
                <input v-model="fondo.ExtraAlto" type="number" @keydown="updateArea(fondo)">
              </div>

              <div class="flex">
                <span class="fondo-label inline-flex">Estirar hacia derecha</span>
                <input v-model="fondo.ExtraDerecha" type="number" @keydown="updateArea(fondo)">
              </div>

              <div class="flex">
                <span class="fondo-label inline-flex">Estirar hacia abajo</span>
                <input v-model="fondo.ExtraAbajo" type="number" @keydown="updateArea(fondo)">
              </div>

              <div class="flex">
                <span class="fondo-label inline-flex">Estirar hacia izquierda</span>
                <input v-model="fondo.ExtraIzquierda" type="number" @keydown="updateArea(fondo)">
              </div>
            </div>

            <div class="flex flex-1 flex-column right-section">
              <div v-if="!dividing" class="margin-top-10">
                <div class="column flex-1 align-center">
                    <label class="simple-label" :for="fondo.name">Exportar</label>
                    <input :id="fondo.name" :name="fondo.name" type="checkbox" class="exportar-check" v-model="fondo.Exportable" v-on:click="toggleExport(fondo)"/>  
                    <button class="btn btn-link btn-sm" @click="openDrawingModal(fondo)">Agregar dibujo a fondo</button>
                </div>
              </div>

              <div v-if="dividing === fondo.Name" class="not-printable flex justify-center">
                <div class="flex-1">
                  <div class="opt cursor-pointer font-divide" v-for="divideOpt in divideOpts" :key="divideOpt.id" :value="divideOpt.id" @mouseover="setHoveredElement(divideOpt.id)" @click="doDivide(divideOpt)">{{ divideOpt.id }}</div>
                  <div v-if="divideOpts.length === 0" class="font-divide">
                    No se encontraron divisiones posibles
                  </div>
                </div>
                <div class="not-printable" v-if="selectedModule.customFondos.length <= 1 && !dividing">
                  <div>                    
                      <div v-if="mounted">
                        <button class="btn btn-link btn-sm" @click="openDrawingModal()">Agregar dibujo a fondo</button>
                      </div>
                  </div>
                </div>
              </div>

              <div class="margin-top-10">
                <button class="btn btn-sm btn-primary ml-btn-sm" v-if="!dividing" v-on:click="toggleDivide(fondo)">
                  Dividir fondo
                </button>
                <button class="btn btn-sm ml-btn-sm" v-if="!dividing" v-on:click="revertDivide(fondo)">
                  Eliminar division
                </button>
                <button class="btn btn-sm ml-btn-sm" v-if="dividing === fondo.Name" v-on:click="toggleDivide">
                  Cancelar division 
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
        <!-- Modal dibujo calco -->
        <b-modal ref="drawingModal" size="lg" hide-footer title="Agregar dibujo a Doble Fondo" v-model="drawingModalShow">
            <div class="d-block text-center" v-if="drawingModalShow && calco">
              <div class="title">
                {{calco.separator.Name}}
              </div>
              <drawing-canvas :calco="calco"></drawing-canvas>
            </div>
        </b-modal>        
    </div>
</template>

<script>
import DrawingCanvas from './DrawingCanvas.vue'

export default {
  components: {
    DrawingCanvas
  },
  data () {
    return {
      collapsed: false,
      fondoSelectedName: null,
      dividing: null,
      drawingModalShow: false,
      drawingForFondo: undefined,
      containerExpanded: {
        fondos: true
      }
    }
  },
  mounted () {
    this.containerExpanded['fondos'] = this.isContainerExpanded('fondos')
  },
  watch: {
    hasFondo: function (newVal, oldVal) {
    }
  },
  computed: {
    materialFondo () {
      return this.selectedModule.fondo
    },
    calco () {
      const fondo = {
        name: this.drawingForFondo.Name,
        moduleName: this.selectedModule.moduleName,
        moduleId: this.selectedModule.moduleId,
        visible: true,
        elementType: 'fondo',
        comentario: '',
        parent: null,
        id: this.selectedModule.moduleId * 100000
      }
      return this.$store.getters.getFondoCalco(fondo)
    },
    selectedModule: {
      get () {
        return this.$store.getters.selectedModule
      }
    },
    customFondos () {
      return this.selectedModule.customFondos
    },
    divideOpts () {
      return this.$store.getters.getFondoDivideOptions
    },
    hasFondo () {
      return this.$store.getters.selectedModule.fondo
    }
  },
  methods: {
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
    timedUpdate (callback) {
      clearTimeout(this.timer)
      this.timer = setTimeout(callback, 500)
    },
    updateArea (fondo) {
      this.timedUpdate(() => {
        this.$store.commit('setFondoExtraArea', { fondo: fondo.Name, key: 'ExtraAlto', value: Number(fondo.ExtraAlto) })
        this.$store.commit('setFondoExtraArea', { fondo: fondo.Name, key: 'ExtraAbajo', value: Number(fondo.ExtraAbajo) })
        this.$store.commit('setFondoExtraArea', { fondo: fondo.Name, key: 'ExtraDerecha', value: Number(fondo.ExtraDerecha) })
        this.$store.commit('setFondoExtraArea', { fondo: fondo.Name, key: 'ExtraIzquierda', value: Number(fondo.ExtraIzquierda) })
      })
    },
    openDrawingModal (fondo) {
      this.drawingForFondo = fondo
      this.$refs.drawingModal.show()
    },
    selectFondo: function (fondo) {
      if (this.fondoSelectedName === fondo.Name) {
        this.fondoSelectedName = null
        this.$store.commit('setSelectedFondo', null)
      } else {
        this.fondoSelectedName = fondo.Name
        this.$store.commit('setSelectedFondo', fondo)
      }
    },
    toggleFondosSection: function () {
      this.collapsed = !this.collapsed
    },
    revertDivide (fondo) {
      this.$store.commit('revertDivideFondo', fondo)
    },
    toggleDivide: function (fondo) {
      if (!this.dividing) {
        this.dividing = fondo.Name
        if (this.fondoSelectedName !== fondo.Name) {
          this.selectFondo(fondo)
        }
        return
      }
      this.selectFondo(fondo)
      this.dividing = null
      this.setHoveredElement(-1)
    },
    setHoveredElement (id) {
      this.$store.commit('setHoveredElement', { elementId: id })
    },
    doDivide: function (divider) {
      this.$store.commit('divideFondo', divider)
      this.dividing = null
      this.setHoveredElement(-1)
    },
    toggleExport: function (fondo) {
      this.$store.commit('setExportableCustomFondo', fondo)
    }
  }
}
</script>

<style lang="scss">
  .edit-custom-fondo {
    .ml-btn-sm.btn.btn-sm:not(.btn-link) {
      margin: 0px;
    }

    .cursor-pointer {
      cursor: pointer;
    }

    .cursor-default {
      cursor: default;
    }

    .fondos-toggler {
      color: #9d9dc1;

      &:hover {
        text-decoration: underline;
      }
    }

    table.selected {
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      font-weight: 700;
    }

    .selectedTitle {
      font-weight: 700;    
      border-left: 2px solid #007bff;
    }

    .opt:hover {
      background-color: rgba(123, 66, 123, 0.46);
    }
    .h-separator {
      border-bottom: solid 1px #ccc;
      padding-top: 10px;
      padding-bottom: 10px;
      margin: 0px 20px;

      &:last-of-type {
        border: none;
      }
    }
    .bordered-container.fondos {
      .bordered-section {
        max-height: 260px;
        overflow-y: auto;
      }
    }
  }
  .simple-label {
    font-family:Avenir, Helvetica, Arial, sans-serif;
    font-size:12px;
    font-weight:400;
  }
  .fondo-title-section {
    border-left: 2px solid transparent;
    padding-left: 5px;
  }
  .exportar-check {
    position: relative;
    top: 2px;
  }
  .fondo-medidas {
    padding-right: 15px;
  }
  .right-section {
    padding-left: 5px;
  }
</style>