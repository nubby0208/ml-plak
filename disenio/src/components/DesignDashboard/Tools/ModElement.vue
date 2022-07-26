<template>
  <div
    v-if="visible"
    :class="{ 'room-editor': isAmbienteSelected, separator: element.separator,  imaginary: element.size === 0, virtual: element.virtual, cajon: element.cajon && isElementLayerVisible, bandeja: element.bandeja, barral: element.barral, selected: selected, compoundSelected: compoundSelected,hovered: hovered }"
    @:click="selectCube(element)"
  >
    <div
      v-if="showPuertaDoblefondo"
      class="positioned-parent"
    >
      <div
        v-if="element.puerta || element.dobleFondo"
        class="positioned dobleFondo"
        :style="{ width: width / 4 + 'px', height: getHeight(height) + 'px' }"
        :class="{'fondo-manual': element.dobleFondo && element.dobleFondo.isCustom, 'puerta-corrediza': element.puerta && element.puerta.corrediza, 'puerta-manual': element.puerta && element.puerta.elementType === 'puerta-custom'}"
      />
    </div>
    <ModLabel
      v-if="isElementLayerVisible"
      :id="id"
    />
    <table
      v-if="element.layout === 'horizontal'"
      :style="{ width: getWidth(width) + 'px', height: getHeight(height) + 'px' }"
    >
      <tbody>
        <tr
          style="position:absolute"
          v-if="element && (!element.childs || (isElementLayerVisible && element.layerId != -1 && element.childs)) && !element.separator && showDimensions"
        >
          <td>
            <div
              :style="{ 'max-width': getWidth(width) + 'px', 'max-height': getHeight(height) + 'px', position: 'relative', top: height / 10 + 'px', left: getWidth(width) / 3 + 'px'}"
            >
              {{ width }} x {{ height }}
            </div>
          </td>
        </tr>
        <template        
          v-if="element.division == 0 || element.division == undefined"
        >
          <tr
            class="tr-mueble"
            :key="index"
            v-for="(child, index) in element.childs"  
          >
            <td class="td-mueble">
              <mod-element 
                :id="child"
              />
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <table
      v-else
      :style="{ width: getWidth(width) + 'px', height: getHeight(height) + 'px' }" :class="{'fondo-part': isPartOfSelectedFondo}"
    >
      <tbody>
        <!-- Show Size Label -->
        <tr
          v-if="element && !element.childs && !element.separator && showDimensions"
        >
          <td>
            <div
              v-if="isElementLayerVisible" 
              :style="{ 'max-width': getWidth(width) + 'px', 'max-height': getHeight(height) + 'px', position: 'relative', top: height / 15 + 'px'}"
            >
              {{ width }} x {{ height }}
            </div>
          </td>
        </tr>
        <tr
          v-if="element.division == 0 || element.division == undefined"
        >
          <td
            v-for="(child, index) in element.childs" 
            :key="index"           
          >
            <mod-element
              :id="child"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ModLabel from './ModLabel'

export default {
  props: [ 'id' ],
  components: {
    ModLabel,
  },
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
      // console.log('getWidth from id:', this.id)
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
    }
  }
}
</script>

<style scoped>
td {
  padding: 0 !important;
}
tr {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
}
.separator {
  background-color: skyblue;
}
.separator.room-editor {
  background-color: red;
}
.separator.virtual {
  background-color: #009688 !important;
  height: 4px;
}
.separator.imaginary {
  min-width: 2px !important;
  min-height: 2px !important;
  background-color: grey;
}
.room-editor.separator.imaginary {
  background-color: red;
}
.separator.bandeja {
  background-color: orange;
}
.separator.barral {
  background-color: brown;
}
.cajon {
  background-color: burlywood;
}
.selected {
  background-color: rgb(220, 220, 220) !important;
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
  background-color:rgba(78, 94, 160, 0.3);
}
.dobleFondo {
  background-color:rgba(240, 104, 13, 0.3);
}
.dobleFondo.fondo-manual {
  background-color: rgba(236, 193, 63, 1);
}
.room-editor .dobleFondo.fondo-manual {
  background-color: rgb(232, 174, 174);
}
.puerta-corrediza {
  background-color: #2196f3;
}
.puerta-manual {
  background-color: #0d90a0;
}
.selected .dobleFondo.fondo-manual, .selected .puerta-manual, .selected .puerta-corrediza {
  background-color: limegreen !important;
}

</style>
