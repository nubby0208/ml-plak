<template>
<div>

  <div class="bordered-container">
    <div class="flex">
      <div class="container-title not-printable"  @click="toggleContainer('separador')">
        <span class="container-toggler more" v-if="containerExpanded['separador']">▼</span>
        <span class="container-toggler less" v-if="!containerExpanded['separador']">▲</span>
        <span v-if="!this.selectedElement.virtual && !this.selectedElement.liston && !this.selectedElement.barral">Separador</span>
        <span v-if="this.selectedElement.virtual">Separador Virtual</span>
        <span v-if="this.selectedElement.liston">Liston</span>
        <span v-if="this.selectedElement.barral">Barral</span>
      </div>
    </div>
    <div class="separador-bordered-section bordered-section not-printable" :class="{'uncollapsed': containerExpanded['separador']}">
      <div class="orientacion" v-if="this.selectedElement.liston">
        <span class="label">Orientacion</span>
        <span class="value">{{ this.selectedElement.Orientacion }}</span>
      </div>

      <div class="posicionamiento flex" v-if="horizontalPositioning || verticalPositioning">
        <div v-if="horizontalPositioning" class="ml-control flex align-items-center hover-line">
          <label for="top">Arriba</label>
          <input id="top" class="vw-4" ref="desdeArriba" v-model="top" type="number" v-shortkey="['alt', 'arrowup']" @shortkey="setFocus('desdeArriba')">
        </div>
        <div v-if="horizontalPositioning" class="ml-control flex align-items-center hover-line">
          <label for="bottom">Abajo</label>
          <input id="bottom" class="vw-4" ref="desdeAbajo" v-model="bottom" type="number" v-shortkey="['alt', 'arrowdown']" @shortkey="setFocus('desdeAbajo')">
        </div>

        <div v-if="verticalPositioning" class="ml-control flex  hover-line align-items-center">
          <label for="left">Izquierda</label>
          <input id="left" class="vw-4" ref="desdeIzquierda" v-model="left" type="number" v-shortkey="['alt', 'arrowleft']" @shortkey="setFocus('desdeIzquierda')">
        </div>
        <div v-if="verticalPositioning" class="ml-control flex align-items-center hover-line">
          <label for="right">Derecha</label>
          <input id="right" ref="desdeDerecha" class="vw-4" v-model="right" type="number" v-shortkey="['alt', 'arrowright']" @shortkey="setFocus('desdeDerecha')">
        </div>
      </div>

      <div class="extras-size flex">
        <div v-if="this.selectedElement.liston" class="ml-control flex align-items-center hover-line">
          <label for="anchoListon">Ancho</label>
          <input id="anchoListon" v-model="anchoListon" type="number" class="vw-4">
        </div>        

        <div v-if="this.selectedElement.liston" class="ml-control flex align-items-center hover-line">
          <label for="posicionZ">Eje Z</label>
          <input id="posicionZ" v-model="posicionZ" type="number" class="vw-4">
        </div> 

        <div v-if="this.selectedElement.liston && this.selectedElement.lPartId" class="hover-line ml-control flex align-items-center">
          <label for="posicionX">Eje X de parte L</label>
          <input id="posicionX" v-model="posicionX" type="number" class="vw-4">
        </div> 

        <div v-if="this.selectedElement.barral" class="ml-control flex align-items-center hover-line">
          <label for="profBarral">Prof2</label>
          <input id="profBarral" v-model="profBarral" type="number" class="vw-4">
        </div>
      </div>

      <div class="color-espesor flex">
        <div class="hover-line flex align-items-center ml-control">
          <label for="color">Color</label>
          <select id="material" v-model="material" name="material" class="form-control form-control-sm">
              <option value=""></option>
              <option v-for="color in availableMaterials" :key="color" :value="color">{{ color }}</option>
          </select>
        </div>
        <div v-if="!this.selectedElement.virtual && !this.selectedElement.liston" class="ml-control hover-line flex align-items-center">
          <label for="size">Espesor</label>
          <input id="size" v-model="size" type="number" class="vw-4">
        </div>
        <div v-if="this.selectedElement.liston" class="ml-control flex align-items-center">
          <label for="espesorListon">Espesor</label>
          <input id="espesorListon" v-model="espesorListon" type="number" class="vw-4">
        </div>
      </div>

      <div class="separator-icons flex">
        <div class="first-icons flex" v-if="!isAmbienteSelected">
          <div v-if="!this.hasDoor() && !this.selectedElement.virtual && !this.selectedElement.liston" class="mlplak-icon-button" v-b-tooltip.hover.bottom title="Puerta Manual" @click="addDoor(false)">
            <b-icon class="zona-icon" icon="door-closed-fill" font-scale="2">
            </b-icon>
          </div>
          <div v-if="!this.hasDoor() && !this.selectedElement.virtual && !this.selectedElement.liston" class="mlplak-icon-button" v-b-tooltip.hover.bottom title="Puerta Corrediza" @click="addDoor(true)">
            <b-icon class="zona-icon" icon="square-half" font-scale="2">
            </b-icon>
          </div>
        </div>
        <div class="second-icons flex">
          <div v-if="!this.selectedElement.virtual && !this.selectedElement.liston" class="mlplak-icon-button" v-b-tooltip.hover.bottom :title="dfName + ' Manual'" @click="addDobleFondoManual(true)">
            <b-icon class="zona-icon" icon="intersect" font-scale="2">
            </b-icon>
          </div>
        </div>
        <div class="third-icons flex" :class="{ibordered: (!this.selectedElement.virtual && !this.selectedElement.liston) || (isAmbienteSelected)}">
          <div @click="deleteNext()" class="mlplak-icon-button shifted delete-next">
            <b-iconstack font-scale="2">
              <b-icon v-if="isSeparadorVertical" stacked icon="chevron-compact-left" shift-h="-10"></b-icon>
              <b-icon v-if="isSeparadorHorizontal" stacked icon="chevron-compact-up" shift-h="-11" scale="0.75"></b-icon>
              <b-icon stacked icon="trash"></b-icon>
            </b-iconstack>
          </div>
          <div @click="deletePrevious()" class="mlplak-icon-button delete-previous shifted">
            <b-iconstack font-scale="2">
              <b-icon v-if="isSeparadorVertical" stacked icon="chevron-compact-right" shift-h="10"></b-icon>
              <b-icon v-if="isSeparadorHorizontal" stacked icon="chevron-compact-down" shift-h="11" scale="0.75"></b-icon>
              <b-icon stacked icon="trash"></b-icon>
            </b-iconstack>
          </div>
        </div>
      </div>

      <div v-if="!componiendo && (isListonVertical || isListonHorizontal)" class="extra-size-actions">

        <b>Modificar Area</b>

        <div class="flex">
          <div v-if="isListonVertical" class="ml-control flex align-items-center">
            <label class="modificar-area-label" for="extraAlto">Estirar hacia arriba</label>
            <input id="extraAlto" v-model="extraAlto" type="number" class="vw-4">
          </div>

          <div v-if="isListonHorizontal" class="ml-control flex align-items-center">
            <label class="modificar-area-label" for="extraDerecha">Estirar hacia derecha</label>
            <input id="extraDerecha" v-model="extraDerecha" type="number" class="vw-4">
          </div>

          <div v-if="isListonVertical" class="ml-control flex align-items-center">
            <label class="modificar-area-label" for="extraAbajo">Estirar hacia abajo</label>
            <input id="extraAbajo" v-model="extraAbajo" type="number" class="vw-4">
          </div>

          <div v-if="isListonHorizontal" class="ml-control flex align-items-center">
            <label class="modificar-area-label" for="extraIzquierda">Estirar hacia izquierda</label>
            <input id="extraIzquierda" v-model="extraIzquierda" type="number" class="vw-4">
          </div>

          <div>
            <b-button variant="outline" size="sm" @click="updateArea()">Aplicar</b-button>
          </div>
        </div>
      </div>

      <div class="composition-actions">
        <div class="composition flex" v-if="this.selectedElement.liston && !componiendo && this.selectedElement.compound && this.selectedElement.compound.length > 0" @mouseout="setHoveredElement(null)">
          <div>
            <label>Liston compuesto</label>
          </div>
          <div class="flex-1 justify-left">
            <div v-for="(liston, index) in this.selectedElement.compound" :key="index" @mouseover="setHoveredCompoundElement(liston)" class="compound-item">
              <span>{{liston}}</span>
              <span :class="{invisible: liston === selectedElement.id}" class="remove-from-compound" title="Sacar de grupo compuesto" @click="removeFromCompound(liston)">X</span>
            </div>
          </div>
        </div>

        <div v-if="this.selectedElement.liston && !componiendo">
          <button class="btn btn-link btn-sm" @click="checkCompoundOptions()">Liston Compuesto</button>
        </div>

        <div v-if="componiendo" class="liston-background">
          <div class="liston-option" v-for="(option, index) in listonesToCompound" :key="index" @mouseover="setHoveredElement(option)" @click="compoundListon(option)">
            {{option}}
          </div>
          <div v-if="listonesToCompound.length > 0">
            <button class="cancel-compound btn btn-link btn-sm" @click="cancelCompound()">Cancelar</button>
          </div>
          <div v-if="componiendo && listonesToCompound.length === 0">
            <strong>No se encontraron listones para componer</strong>
            <button class="btn btn-link btn-sm" @click="cancelCompound()">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { MaterialEnum } from '../models/enums'
export default {
  data () {
    return {
      fondos: [],
      materiales_add: [],
      fondos_add: [],
      timer: null,
      listonesToCompound: [],
      componiendo: false,
      containerExpanded: {
        separador: true
      },
      extras: {
        extraAlto: undefined,
        extraAbajo: undefined,
        extraIzquierda: undefined,
        extraDerecha: undefined
      }
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
    removeFromCompound (listonId) {
      this.$store.commit('removeFromCompound', listonId)
    },
    updateArea () {
      this.$store.commit('setSepartorExtraArea', { key: 'extraAlto', value: this.extras.extraAlto === undefined ? this.extraAlto : this.extras.extraAlto })
      this.$store.commit('setSepartorExtraArea', { key: 'extraAbajo', value: this.extras.extraAbajo === undefined ? this.extraAbajo : this.extras.extraAbajo })
      this.$store.commit('setSepartorExtraArea', { key: 'extraDerecha', value: this.extras.extraDerecha === undefined ? this.extraDerecha : this.extras.extraDerecha })
      this.$store.commit('setSepartorExtraArea', { key: 'extraIzquierda', value: this.extras.extraIzquierda === undefined ? this.extraIzquierda : this.extras.extraIzquierda })
    },
    cancelCompound () {
      this.listonesToCompound = [].slice()
      this.setHoveredElement(null)
      this.componiendo = false
    },
    checkCompoundOptions () {
      this.componiendo = true
      let ids = []
      const piecesThatConnect = this.$store.getters.getPiecesThatConnectWithGivenElementId(this.selectedElement.id).map(piece => piece.id)
      piecesThatConnect.forEach(id => {
        const piece = this.$store.getters.getElement(id)
        if (piece.name !== 'Techo' && piece.name !== 'Piso' && piece.name !== 'Lat. Derecho' && piece.name !== 'Lat. Izquierdo') {
          ids = [...ids, ...this.getConexionesIds(piece)]
        }
      })

      ids.forEach(id => {
        const element = this.$store.getters.getElement(id)
        const vertical = this.$store.getters.getY(element.id) !== this.$store.getters.getY(this.selectedElement.id)
        const horizontal = this.$store.getters.getY(element.id) === this.$store.getters.getY(this.selectedElement.id) && this.$store.getters.getX(element.id) !== this.$store.getters.getX(this.selectedElement.id)
        if (id !== this.selectedElement.id && (vertical || horizontal) && this.selectedElement.compound.indexOf(id) === -1) {
          this.listonesToCompound.push(id)
        }
      })
    },
    compoundListon (option) {
      this.$store.commit('componerListones', { origen: this.selectedElement.id, destino: option })
      this.cancelCompound()
    },
    setHoveredCompoundElement (id) {
      this.$store.commit('setHoveredElement', { elementId: +id })
    },
    setHoveredElement (id) {
      const element = this.$store.getters.getElement(id)
      if (element && element.compound && element.compound.length > 0) {
        this.$store.commit('setHoveredElement', { elementIds: [ ...element.compound.map(id => +id) ] })
      } else {
        this.$store.commit('setHoveredElement', { elementId: +id })
      }
    },
    getConexionesIds (element) {
      const ids = []
      element.conexionesAfter.forEach(conexion => {
        if (conexion.separator.liston) {
          ids.push(conexion.separator.id)
        }
      })

      element.conexionesBefore.forEach(conexion => {
        if (conexion.separator.liston) {
          ids.push(conexion.separator.id)
        }
      })

      return ids
    },
    timedUpdate (callback) {
      clearTimeout(this.timer)
      this.timer = setTimeout(callback, 500)
    },
    setFocus (ref) {
      this.$refs[ref].select()
    },
    deletePrevious () {
      this.$store.commit('deleteElements', [ this.selectedElement.id, this.before.id ])
    },
    addDoor (isCorrediza) {
      this.$store.commit('addPuerta', { corrediza: isCorrediza })
    },
    addDobleFondoManual () {
      this.$store.commit('addDobleFondo')
    },
    hasDoor () {
      const customDoor = this.selectedElement.puerta && this.selectedElement.puerta.sides
      if (customDoor) {
        return customDoor.side1 && customDoor.side2 && customDoor.side3 && customDoor.side4
      }
      return false
    },
    deleteNext () {
      this.$store.commit('deleteElements', [ this.selectedElement.id, this.after.id ])
    }
  },
  computed: {
    isListonVertical () {
      return this.selectedElement.liston && (this.selectedElement.Orientacion === 4 || this.selectedElement.Orientacion === 1)
    },
    isListonHorizontal () {
      return this.selectedElement.liston && (this.selectedElement.Orientacion === 3 || this.selectedElement.Orientacion === 2)
    },
    isSeparadorVertical () {
      return this.$store.getters.getSelectedSeparadorOrientacion === 1 || this.$store.getters.getSelectedSeparadorOrientacion === 4
    },
    isSeparadorHorizontal () {
      return this.$store.getters.getSelectedSeparadorOrientacion === 2 || this.$store.getters.getSelectedSeparadorOrientacion === 3
    },
    extraAlto: {
      get () {
        return this.selectedElement.extraAlto
      },
      set (value) {
        const number = Number(value)
        if (!isNaN(number)) {
          this.extras.extraAlto = number
        }
      }
    },
    extraDerecha: {
      get () {
        return this.selectedElement.extraDerecha
      },
      set (value) {
        const number = Number(value)
        if (!isNaN(number)) {
          this.extras.extraDerecha = number
        }
      }
    },
    extraAbajo: {
      get () {
        return this.selectedElement.extraAbajo
      },
      set (value) {
        const number = Number(value)
        if (!isNaN(number)) {
          this.extras.extraAbajo = number
        }
      }
    },
    extraIzquierda: {
      get () {
        return this.selectedElement.extraIzquierda
      },
      set (value) {
        const number = Number(value)
        if (!isNaN(number)) {
          this.extras.extraIzquierda = number
        }
      }
    },
    isAmbienteSelected () {
      return this.$store.state.layout.ambienteEnabled
    },
    dfName () {
      if (!this.isAmbienteSelected) {
        return 'Doble Fondo'
      }
      return 'Superficie'
    },
    horizontalPositioning () {
      return this.before && this.after && this.selectedParent.layout === 'horizontal'
    },
    verticalPositioning () {
      return this.before && this.after && this.selectedParent.layout === 'vertical'
    },
    left: {
      get () {
        return Math.round(this.$store.getters.getWidth(this.before.id))
      },
      set (value) {
        this.timedUpdate(() => this.$store.commit('setSeparatorLeft', Number(value)))
      }
    },
    right: {
      get () {
        return Math.round(this.$store.getters.getWidth(this.after.id))
      },
      set (value) {
        this.timedUpdate(() => this.$store.commit('setSeparatorRight', Number(value)))
      }
    },
    top: {
      get () {
        return Math.round(this.$store.getters.getHeight(this.before.id))
      },
      set (value) {
        this.timedUpdate(() => this.$store.commit('setSeparatorTop', Number(value)))
      }
    },
    bottom: {
      get () {
        return Math.round(this.$store.getters.getHeight(this.after.id))
      },
      set (value) {
        this.timedUpdate(() => this.$store.commit('setSeparatorBottom', Number(value)))
      }
    },
    x: {
      get () {
        return Math.round(this.$store.getters.getX(this.selectedElement.id))
      },
      set (value) {
        this.$store.commit('setSeparatorX', { x: Number(value), y: 0 })
      }
    },
    y: {
      get () {
        return Math.round(this.$store.getters.getY(this.selectedElement.id))
      },
      set (value) {
        this.$store.commit('setSeparatorY', { x: 0, y: Number(value) })
      }
    },
    profBarral: {
      get () {
        return this.selectedElement.prof2
      },
      set (value) {
        this.$store.commit('setProfBarral', Number(value))
      }
    },
    posicionZ: {
      get () {
        return this.selectedElement.ejeZ
      },
      set (value) {
        this.timedUpdate(() => this.$store.commit('setListonEjeZ', value))
      }
    },
    posicionX: {
      get () {
        const lPart = this.$store.getters.getElement(this.selectedElement.lPartId)
        let x = lPart.X - lPart.size
        return x + 18
      },
      set (value) {
        this.timedUpdate(() => this.$store.commit('setListonEjeX', value))
      }
    },
    anchoListon: {
      get () {
        return this.selectedElement.anchoListon
      },
      set (value) {
        this.timedUpdate(() => this.$store.commit('setListonAncho', value))
      }
    },
    espesorListon: {
      get () {
        return this.selectedElement.espesorListon
      },
      set (value) {
        this.timedUpdate(() => this.$store.commit('setListonEspesor', value))
      }
    },
    size: {
      get () {
        return this.selectedElement.size
      },
      set (value) {
        this.timedUpdate(() => this.$store.commit('setSeparatorSize', Number(value)))
      }
    },
    selectedElement () {
      return this.$store.getters.selectedElement
    },
    selectedParent () {
      return this.$store.getters.getParent(this.selectedElement.id)
    },
    before () {
      return this.$store.getters.getBeforeSibling(this.selectedElement.id)
    },
    after () {
      return this.$store.getters.getAfterSibling(this.selectedElement.id)
    },
    canDelete () {
      return this.before != null && this.after != null
    },
    availableMaterials () {
      let materiales = []
      if (this.$store.state.general.materiales_add) {
        materiales = JSON.parse(this.$store.state.general.materiales_add).map(m => m.material)
      }
      if (this.selectedElement.barral) {
        if (!materiales.find(material => material === MaterialEnum.BarralCromado)) {
          materiales.push(MaterialEnum.BarralCromado)
        }

        if (!materiales.find(material => material === MaterialEnum.BarralAluminio)) {
          materiales.push(MaterialEnum.BarralAluminio)
        }

        if (typeof this.material !== 'string') {
          this.material = MaterialEnum.BarralCromado
        }
      } else if (typeof this.material !== 'string' && this.$store.state.general.material_default) {
        this.material = JSON.parse(this.$store.state.general.material_default)
      }
      return materiales
    },
    material: {
      get () {
        return this.selectedElement.material
      },
      set (value) {
        this.$store.commit('setSeparatorMaterial', value)
      }
    }
  },
  watch: {
    availableMaterials: function (newValue, oldValue) {
      if (this.selectedElement.barral) {
        // cargo materiales por defecto para barral en caso de que no esten seleccionados en el modulo general
        if (!newValue.find(material => material === MaterialEnum.BarralCromado)) {
          newValue.push(MaterialEnum.BarralCromado)
        }

        if (!newValue.find(material => material === MaterialEnum.BarralAluminio)) {
          newValue.push(MaterialEnum.BarralAluminio)
        }

        if (!newValue.find(material => material === this.material) || !this.material) {
          this.material = MaterialEnum.BarralCromado
        }
      } else if (typeof this.material !== 'string' && this.$store.state.general.material_default) {
        this.material = JSON.parse(this.$store.state.general.material_default)
      }
      return newValue
    }
  },
  mounted () {
    this.containerExpanded['separador'] = this.isContainerExpanded('separador')
    this.fondos = []
    this.materiales_add = this.availableMaterials || []
    this.fondos_add = JSON.parse(localStorage.getItem('fondos_add')) || []
    if (this.materiales_add) {
      this.materiales_add.forEach(material => {
        this.fondos.push(material)
      })

      if (this.fondos_add) {
        this.fondos_add.forEach(material => {
          this.fondos.push(material)
        })
      }
    }
  }
}
</script>
<style scoped>
.ml-control select {
  width: 12vw;
}
.liston-option:hover, .compound-item:hover {
  cursor: pointer;
  background-color: #7b427b75;
}
.liston-background {
  background-color: #efc5c5;
}
.cancel-compound {
  margin-top: 25px;
}
.compound-item {
  text-align: left;
  display: flex;
  padding: 0px 25px;
}
.compound-item span:first-child {
  flex: 1;
}
.remove-from-compound {
  color: #007bff;
}
.remove-from-compound:hover {
  color: #0056b3;
  cursor: pointer;
  text-decoration: underline;
}
.bordered-section .label {
  color: #6c757d;
}
.bordered-section .value {
  font-weight: bold;
  font-size: 15px;
}
.orientacion {
  text-align: left;
  padding-left: 20px;
}
.orientacion .label {
  margin-right: 5px;
}
.composition-actions {
  margin-top: 10px;

}
.composition-actions label {
  width: initial;
  padding-left: 20px;
}
</style>
<style scoped lang="scss">
  .posicionamiento {
    height: 47px;
  }
  .modificar-area-label {
    padding-left: 20px;
    width: initial;
    padding-right: 5px;
  }
  .extra-size-actions {
    .btn {
      margin-left: 5px;
    }
  }
  label {
    width: 4vw;
  }
  .separator-icons {
    padding-left: 20px;
  }
  .third-icons.ibordered {
    padding-left: 5px;
    border-left: 1px solid #ccc;
    margin-left: 5px;
  }
  .mlplak-icon-button.shifted {
    padding: 2px 0px;
    width: 45px;
  }
  @media (max-width: 1600px) {
    .vw-4 {
      width: 6vw !important;
    }
  }
  .color-espesor {
    height: 47px;
  }
</style>