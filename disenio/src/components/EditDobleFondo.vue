<template>
<div>
    <h4>{{dfName}}:</h4>
    <table class="table table-bordered">
        <tr v-if="this.selectedElement.separator && !this.dobleFondoIsCompleted && this.currentSide === 1" class="df-step-background">
          <td>{{firstStepText}}</td>
          <td>
            <div class="df-option" v-for="option in stepOneIds" @mouseover="setHoveredElement(option)" @click="addDobleFondoElement(option)">{{option}}</div>
          </td>
        </tr>
        <tr v-if="this.selectedElement.separator && !this.dobleFondoIsCompleted && this.currentSide === 2" class="df-step-background">
          <td>{{secondStepText}}</td>
          <td>
            <div class="df-option" v-for="option in stepTwoIds" @mouseover="setHoveredElement(option)" @click="addDobleFondoElement(option)">{{option}}</div>
          </td>
        </tr>
        <tr v-if="this.selectedElement.separator && !this.dobleFondoIsCompleted && this.currentSide === 3" class="df-step-background">
          <td>{{thirdStepText}}</td>
          <td>
            <div class="df-option" v-for="option in stepThreeIds" @mouseover="setHoveredElement(option)" @click="addDobleFondoElement(option)">{{option}}</div>
          </td>
        </tr>
        <tr>
            <td>Material:</td>
            <td>
              <select v-model="material" class="form-control form-control-sm">
                <option v-for="material in availableMaterials" :key="material" :value=material>{{ material }}</option>
              </select>
            </td>
        </tr>
        <tr>
            <td>Espesor:</td>
            <td>
                <input v-model="size">
            </td>
        </tr>
        <tr>
            <td>Posicion Z:</td>
            <td>
                <input v-model="z">
            </td>
        </tr>
        <tr>
            <td>Girar Veta:</td>
            <td>
              <input type="checkbox" v-model="girarVeta">
            </td>
        </tr>
        <tr>
          <td colspan="2">
            <b>Modificar area</b>
          </td>
        </tr>
        <tr>
            <td>Estirar hacia arriba:</td>
            <td>
                <input v-model="extraAlto" type="number">
            </td>
        </tr>
        <tr>
            <td>Estirar hacia derecha:</td>
            <td>
                <input v-model="extraDerecha" type="number">
            </td>
        </tr>
        <tr>
            <td>Estirar hacia abajo:</td>
            <td>
                <input v-model="extraAbajo" type="number">
            </td>
        </tr>
        <tr>
            <td>Estirar hacia izquierda:</td>
            <td>
                <input v-model="extraIzquierda" type="number">
            </td>
        </tr>
        <tr>
          <td colspan="2">
            <button @click="updateArea()">Aplicar</button>
          </td>
        </tr>        
        <tr>
            <td colspan="2">
              <button class="btn btn-link btn-sm" @click="openDrawingModal()">Agregar dibujo</button>
            </td>
        </tr>        
    </table>
    <button class="delete-df" @click="deleteDF()">Eliminar {{dfName}}</button>

    <!-- Editar Tapacantos -->
    <edit-tapacantosdf v-if="tapacantos && !isAmbienteSelected"></edit-tapacantosdf>

    <!-- Modal dibujo calco -->
    <b-modal ref="drawingModal" hide-footer title="Agregar dibujo a Doble Fondo" v-model="drawingModalShow">
        <div class="d-block text-center" v-if="drawingModalShow && calco">
          <div class="title">
            {{calco.separator.name}}
          </div>
          <drawing-canvas :calco="calco" :property="'dobleFondo'"></drawing-canvas>
        </div>
    </b-modal>
</div>
</template>

<script>
export default {
  data () {
    return {
      customDF: {},
      currentSide: 1,
      timer: null,
      drawingModalShow: false,
      extras: {
        extraAlto: undefined,
        extraAbajo: undefined,
        extraIzquierda: undefined,
        extraDerecha: undefined
      }
    }
  },
  watch: {
    availableMaterials: function (newValue, oldValue) {
      if (typeof this.material !== 'string') {
        this.material = JSON.parse(this.$store.state.general.material_default)
      }
      return newValue
    },
    selectedElement (newValue, oldValue) {
      this.extras = {
        extraAlto: undefined,
        extraAbajo: undefined,
        extraIzquierda: undefined,
        extraDerecha: undefined
      }
    }
  },
  computed: {
    calco () {
      if (!this.selectedElement) {
        return
      }
      return this.$store.getters.getCalcoInfo(this.selectedElement.id)[0]
    },
    extraAlto: {
      get () {
        return this.selectedElement.dobleFondo.extraAlto
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
        return this.selectedElement.dobleFondo.extraDerecha
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
        return this.selectedElement.dobleFondo.extraAbajo
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
        return this.selectedElement.dobleFondo.extraIzquierda
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
    isHorizontal () {
      return this.$store.getters.getElement(this.selectedElement.parent).layout === 'horizontal'
    },
    piecesConnecting () {
      return this.$store.getters.getPiecesThatConnectWithGivenElementId(this.selectedElement.id).map(piece => piece.id)
    },
    isDobleFondoManual () {
      return this.selectedElement.dobleFondo && this.selectedElement.dobleFondo.sides.length !== 0
    },
    dobleFondoIsCompleted () {
      if (this.isDobleFondoManual) {
        const customDF = this.selectedElement.dobleFondo.sides
        return customDF.side1 && customDF.side2 && customDF.side3 && customDF.side4
      }
      return false
    },
    firstStepText () {
      return this.isHorizontal ? '1er Lado' : '1era Parte inferior/superior'
    },
    secondStepText () {
      return this.isHorizontal ? '2do Lado' : '2da Parte inferior/superior'
    },
    thirdStepText () {
      return !this.isHorizontal ? 'Lado' : 'Parte inferior/superior'
    },
    stepOneIds () {
      const ids = []

      this.selectedElement.conexionesAfter.forEach(conexion => {
        if (!conexion.separator.virtual && !conexion.separator.separadorCajon && !conexion.separator.cajon) {
          ids.push(conexion.separator.id)
        }
      })

      this.selectedElement.conexionesBefore.forEach(conexion => {
        if (!conexion.separator.virtual && !conexion.separator.separadorCajon && !conexion.separator.cajon) {
          ids.push(conexion.separator.id)
        }
      })

      return ids.concat(this.piecesConnecting)
    },
    stepTwoIds () {
      this.stepOneIds.splice(this.stepOneIds.indexOf(this.customDF['side1']), 1)
      return this.stepOneIds
    },
    stepThreeIds () {
      let result = this.$store.getters.getElementConnectingPiecesInCommon(this.customDF['side1'], this.customDF['side2']).map(connection => connection.separator.id || connection.id)
      return result.filter(id => id !== this.selectedElement.id)
    },
    availableMaterials () {
      let materiales = []
      if (this.$store.state.general.materiales_add) {
        materiales = JSON.parse(this.$store.state.general.materiales_add).map(m => m.material)
      }
      if (typeof this.material !== 'string') {
        this.material = JSON.parse(this.$store.state.general.material_default)
      }
      return materiales
    },
    selectedElement () {
      return this.$store.getters.selectedElement
    },
    tapacantos () {
      return this.selectedElement.dobleFondo.tapacantos
    },
    material: {
      get () {
        return this.selectedElement.dobleFondo.material
      },
      set (value) {
        this.$store.commit('setDoblefondoProperty', { key: 'material', value: value })
      }
    },
    size: {
      get () {
        return this.selectedElement.dobleFondo.size
      },
      set (value) {
        this.timedUpdate(() => this.$store.commit('setDoblefondoProperty', { key: 'size', value: Number(value) }))
      }
    },
    z: {
      get () {
        return this.selectedElement.dobleFondo.z
      },
      set (value) {
        this.timedUpdate(() => this.$store.commit('setDoblefondoProperty', { key: 'z', value: Number(value) }))
      }
    },
    girarVeta: {
      get () {
        return this.selectedElement.dobleFondo.girarVeta
      },
      set (value) {
        this.$store.commit('setDoblefondoProperty', { key: 'girarVeta', value: value })
      }
    }
  },
  mounted () {
  },
  methods: {
    updateArea () {
      this.$store.commit('setDoblefondoProperty', { key: 'extraAlto', value: this.extras.extraAlto === undefined ? this.extraAlto : this.extras.extraAlto })
      this.$store.commit('setDoblefondoProperty', { key: 'extraAbajo', value: this.extras.extraAbajo === undefined ? this.extraAbajo : this.extras.extraAbajo })
      this.$store.commit('setDoblefondoProperty', { key: 'extraDerecha', value: this.extras.extraDerecha === undefined ? this.extraDerecha : this.extras.extraDerecha })
      this.$store.commit('setDoblefondoProperty', { key: 'extraIzquierda', value: this.extras.extraIzquierda === undefined ? this.extraIzquierda : this.extras.extraIzquierda })
    },
    openDrawingModal () {
      this.$refs.drawingModal.show()
    },
    timedUpdate (callback) {
      clearTimeout(this.timer)
      this.timer = setTimeout(callback, 500)
    },
    deleteDF () {
      this.$store.commit('deleteDobleFondo')
    },
    setHoveredElement (id) {
      this.$store.commit('setHoveredElement', { elementId: id })
    },
    addDobleFondoElement (id) {
      this.setHoveredElement(null)
      this.customDF[`side${this.currentSide}`] = id
      this.currentSide++
      if (this.currentSide === 4) {
        this.customDF['side4'] = this.selectedElement.id
        this.$store.commit('addDobleFondoCustom', { dobleFondoSides: this.customDF })
      }
    }
  }
}
</script>
<style scoped>
.df-option:hover {
  cursor: pointer;
  background-color: #7b427b75;
}
.df-step-background {
  background-color: #efc5c5;
}
.delete-df {
  margin-bottom: 20px;
}
</style>