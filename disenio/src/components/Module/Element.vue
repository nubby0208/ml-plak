<template>
<div 
  :style="`--color-separador: ${colores.separator}; --color-separador-virtual: ${colores.separator_virtual}; --color-imaginary: ${colores.imaginary}; --color-bandeja:${colores.bandeja}; --color-barral:${colores.barral}; --color-cajon:${colores.cajon}; --color-selected:${colores.selected}; --color-separator-selected:${colores.separator_selected}; --color-puerta:${colores.puerta}; --color-dobleFondo:${colores.dobleFondo}; --color-fondo-manual:${colores.fondo_manual}; --color-dobleFondo-fondo-manual:${colores.dobleFondo_fondo_manual}; --color-puerta-corrediza:${colores.puerta_corrediza}; --color-puerta-manual:${colores.puerta_manual};`"
  v-if="visible" :class="{ 'room-editor': isAmbienteSelected, separator: element.separator,  imaginary: element.size === 0, virtual: element.virtual, cajon: element.cajon && isElementLayerVisible, bandeja: element.bandeja, barral: element.barral, selected: selected, compoundSelected: compoundSelected,hovered: hovered }" v-on:contextmenu="selectCubeMenuContextual(element, $event)" v-on:click="selectCube(element)">
    <div v-if="showPuertaDoblefondo" return class="positioned-parent">
      <div v-if="element.puerta || element.dobleFondo" class="positioned dobleFondo" :style="{ width: width / 4 + 'px', height: getHeight(height) + 'px' }" :class="{'fondo-manual': element.dobleFondo && element.dobleFondo.isCustom, 'puerta-corrediza': element.puerta && element.puerta.corrediza, 'puerta-manual': element.puerta && element.puerta.elementType === 'puerta-custom'}"></div>
    </div>
    <mod-label v-if="isElementLayerVisible" :id="id"></mod-label>
    <table v-if="element.layout === 'horizontal'" :style="{ width: getWidth(width) + 'px', height: getHeight(height) + 'px' }">
      <tbody>
        <tr style="position:absolute" v-if="element && (!element.childs || (isElementLayerVisible && element.layerId != -1 && element.childs)) && !element.separator && showDimensions">
          <td>
            <div :style="{ 'max-width': getWidth(width) + 'px', 'max-height': getHeight(height) + 'px', position: 'relative', top: height / 10 + 'px', left: getWidth(width) / 3 + 'px'}">
              {{ width }} x {{ height }}
            </div>
          </td>
        </tr>
        <tr class="tr-mueble" v-for="(child, index) in element.childs" :key="index" v-if="element.division == 0 || element.division == undefined">
          <td class="td-mueble">
            <mod-element :id="child"></mod-element>
          </td>
        </tr>
      </tbody>
    </table>

    <table v-else :style="{ width: getWidth(width) + 'px', height: getHeight(height) + 'px' }" :class="{'fondo-part': isPartOfSelectedFondo}">
      <tbody>
        <!-- Show Size Label -->
        <tr v-if="element && !element.childs && !element.separator && showDimensions">
          <td>
            <div v-if="isElementLayerVisible" :style="{ 'max-width': getWidth(width) + 'px', 'max-height': getHeight(height) + 'px', position: 'relative', top: height / 15 + 'px'}">
              {{ width }} x {{ height }}
            </div>
          </td>
        </tr>
        <tr>
          <td v-for="child in element.childs" v-if="element.division == 0 || element.division == undefined" :key="child">
            <mod-element :id="child"></mod-element>
          </td>
        </tr>
      </tbody>
    </table>
</div>
</template>

<script>
import { EventBus } from '@/index'

export default {
  props: [ 'id' ],
  data () {
    return {
      parentElement: null
    }
  },
  watch: {
    hovered: function (newVal, oldVal) {
    },
    isPartOfSelectedFondo: function (newVal, oldVal) {
    }
  },
  computed: {
    colores(){
      return this.$store.getters.getColoresModulo;
    },
    isAmbienteSelected () {
      return !!this.$store.state.layout.ambienteEnabled
    },
    element () {
      let element = this.$store.getters.getElement(this.id)
      return element
    },
    parent () {
      return this.$store.getters.getParent(this.id)
    },
    width () {
      return Number(this.$store.getters.getWidth(this.id)).toFixed(2)
    },
    height () {
      return Number(this.$store.getters.getHeight(this.id)).toFixed(2)
    },
    selected () {
      return this.$store.getters.selectedElement &&
        this.$store.getters.selectedElement.id === this.id
    },
    compoundSelected () {
      const selected = this.$store.getters.selectedElement
      if (selected && selected.compound && selected.compound.length > 0) {
        return selected.compound.indexOf(this.id) > -1
      }
    },
    hovered () {
      return this.$store.getters.hoveredElement && this.$store.getters.hoveredElement.indexOf(this.id) > -1
    },
    showPuertaDoblefondo () {
      return this.$store.state.layout.showPuertaDoblefondo
    },
    isElementLayerVisible () {
      const element = this.element
      if (element.layerId != null && element.layerId > -1) {
        return this.$store.getters.selectedModule.layers[element.layerId].visible
      }

      return true
    },
    visible () {
      if (!this.element) {
        return false
      }
      if (this.element.liston || this.element.separadorCajon) {
        return this.isElementLayerVisible
      }
      return true
    },
    showDimensions () {
      return this.$store.state.layout.showDimensions
    },
    isPartOfSelectedFondo ({element}) {
      const fondo = this.$store.getters.selectedFondo
      if (!fondo || !(element.cube || element.cajon)) {
        return false
      }

      if (element.childs && element.childs.length) {
        return false
      }

      const elementX = this.$store.getters.getX(element.id)
      const elementY = this.$store.getters.getY(element.id)
      return ((elementY >= fondo.Y) && (elementY < (fondo.Y + fondo.LVeta))) && ((elementX >= fondo.X) && (elementX < (fondo.X + fondo.AVeta)))
    }
  },
  methods: {
    getHeight (height) {
      let h = +height
      if (this.isAmbienteSelected) {
        h = h === 0 ? this.$store.state.layout.roomEditorLineWidth : height
      }

      return h / 4
    },
    getWidth (width) {
      let w = +width
      if (this.isAmbienteSelected) {
        w = w === 0 ? this.$store.state.layout.roomEditorLineWidth : width
      } else {
        w = this.element.diagramWidth > 0 ? this.element.diagramWidth : width
      }

      return w / 4
    },
    selectCube () {
      if (this.element.childs && this.element.childs.length > 0 && !this.element.separator &&
        (!this.showPuertaDoblefondo || (!this.element.puerta && !this.element.dobleFondo))) {
        return
      }
      this.$store.commit('selectCube', this.element.id)
    },
    selectCubeMenuContextual(element, event) {
      event.preventDefault();
      if (this.element.childs && this.element.childs.length > 0 && !this.element.separator &&
        (!this.showPuertaDoblefondo || (!this.element.puerta && !this.element.dobleFondo))) {
            return
      }
      this.$store.commit('clearSelectionMod');
      this.$store.commit('selectCube', this.element.id)
        console.log(this.$store.getters.selectedElement);
        EventBus.$emit('showMenuContextual', {event:event, menu:"modulo"});
    }
  }
}
</script>

<style scoped>
tr {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
}
.separator {
  background-color: var(--color-separador);
}
.separator.room-editor {
  background-color: red;
}
.separator.virtual {
  background-color: var(--color-separador-virtual) !important;
  height: 4px;
}
.separator.imaginary {
  min-width: 2px !important;
  min-height: 2px !important;
  background-color: var(--color-imaginary);
  margin-top:-2px !important;
  margin-left:-2px !important;
}
.room-editor.separator.imaginary {
  background-color: red;
}
.separator.bandeja {
  background-color: var(--color-bandeja);
}
.separator.barral {
  background-color: var(--color-barral);
}
.cajon {
  background-color: var(--color-cajon);
}
.selected {
  background-color: rgb(219, 219, 219) !important;
}
.fondo-part {
  background-color: #4CAF50;
}
.separator.selected {
  background-color: limegreen !important;
}
.separator.compoundSelected {
  background-color: #7ae692;
}
.separator.hovered {
  background-color: darkmagenta !important;
}
.positioned-parent {
  position: relative;
}
.positioned {
  position: absolute;
}
.puerta {
  background-color:var(--color-puerta);
}
.dobleFondo {
  background-color:var(--color-dobleFondo);
}
.dobleFondo.fondo-manual {
  background-color: var(--color-fondo-manual);
}
.room-editor .dobleFondo.fondo-manual {
  background-color: var(--color-dobleFondo-fondo-manual);
}
.puerta-corrediza {
  background-color: var(--color-puerta-corrediza);
}
.puerta-manual {
  background-color: var(--color-puerta-manual);
}
.selected .dobleFondo.fondo-manual, .selected .puerta-manual, .selected .puerta-corrediza {
  background-color: limegreen !important;
}

</style>
