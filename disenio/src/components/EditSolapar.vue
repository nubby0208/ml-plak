<style lang="scss" scoped>
  .solapar-actions, .dividir-actions {
    padding: 0px 20px;

    label {
      margin-right: 5px;
      margin-left: 5px;
    }
  }
  .element-control {
    width: 5vw !important;
  }
  .dividir-control {
    width: 15vw !important;
  }
</style>
<template>
<div>
    <div class="bordered-container">
      <div class="flex">
        <div class="container-title not-printable"  @click="toggleContainer('solapar')">
          <span class="container-toggler more" v-if="containerExpanded['solapar']">▼</span>
          <span class="container-toggler less" v-if="!containerExpanded['solapar']">▲</span>
          Solapar
        </div>
      </div>
      <div class="bordered-section" :class="{'uncollapsed': containerExpanded['solapar']}">
        <div class="flex solapar-actions" v-if="this.selectedElement.childs == null || this.selectedElement.childs.length == 0">
          <div class="flex align-items-center hover-line ml-control small">
              <label class="" for="accion">Acción</label>
              <select id="accion" v-model="accion" name="accion" class="element-control">
                  <option value="solapar">Solapar</option>
                  <option value="recortar">Recortar</option>
              </select>
          </div>

          <div class="flex align-items-center hover-line ml-control small">
              <label class="" for="direccion">Dirección</label>
              <select id="direccion" v-model="direccion" name="direccion" class="element-control">
                  <option v-if="this.selectedElement.full && (this.selectedElement.name == 'Lat. Derecho' || this.selectedElement.name == 'Lat. Izquierdo')" value="arriba">Arriba</option>
                  <option v-if="this.selectedElement.full && (this.selectedElement.name == 'Techo' || this.selectedElement.name == 'Piso')" value="derecha">Derecha</option>
                  <option v-if="this.selectedElement.full && (this.selectedElement.name == 'Techo' || this.selectedElement.name == 'Piso')" value="izquierda">Izquierda</option>
                  <option value="frente">frente</option>
                  <option v-if="this.accion === 'recortar'" value="atras">atras</option>
              </select>
          </div>

          <div class="flex align-items-center hover-line ml-control small">
              <label class="" for="valor">Valor</label>
              <input class="form-control element-control" id="valor" v-model="value" type="number">
          </div>

          <div class="flex justify-center margin-left-5" v-if="this.selectedElement.childs == null || this.selectedElement.childs.length == 0">
            <button class="btn btn-sm" v-on:click="aplicar()">
              Aplicar
            </button>
          </div>
        </div>
        <div class="margin-top-10 margin-bottom-10" v-if="this.selectedElement.childs != null && this.selectedElement.childs.length > 0"><b>No se puede solapar/recortar si el elemento esta dividido</b></div>
      </div>
    </div>

    <div class="bordered-container">
      <div class="flex">
        <div class="container-title not-printable"  @click="toggleContainer('dividir')">
          <span class="container-toggler more" v-if="containerExpanded['dividir']">▼</span>
          <span class="container-toggler less" v-if="!containerExpanded['dividir']">▲</span>
          Dividir
        </div>
      </div>
      <div class="bordered-section" :class="{'uncollapsed': containerExpanded['dividir']}">
        <div class="dividir-actions flex">
          <div class="flex align-items-center hover-line ml-control" v-if="this.selectedElement.childs == null || this.selectedElement.childs.length == 0">
              <label for="espacio">Espacio</label>
              <input class="form-control dividir-control" id="espacio" v-model="valueEspacio" type="number">
          </div>

          <div class="flex justify-center margin-left-5" v-if="this.selectedElement.childs == null || this.selectedElement.childs.length == 0">
            <button class="btn btn-sm" v-on:click="aplicarDividir()">
              Dividir
            </button>
          </div>
        </div>


        <div class="flex justify-center margin-bottom-10" v-if="this.selectedElement.childs != null && this.selectedElement.childs.length > 0">
          <button class="btn btn-sm btn-danger" v-on:click="deleteDividir()">
            Eliminar división
          </button>
        </div>
      </div>
    </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      value: 0,
      valueEspacio: 0,
      direccion: null,
      accion: null,
      containerExpanded: {
        dividir: true,
        solapar: true
      }
    }
  },
  mounted () {
    this.containerExpanded['dividir'] = this.isContainerExpanded('dividir')
    this.containerExpanded['solapar'] = this.isContainerExpanded('solapar')
  },
  methods: {
    isContainerExpanded (containerId) {
      const value = localStorage.getItem(containerId)
      if (value === undefined) {
        return true
      }
      return localStorage.getItem(containerId) === 'true'
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
    aplicar () {
      this.$store.commit('aplicarSolapar', [ this.selectedElement.id, this.value, this.direccion, this.accion ])
      this.value = 0
    },
    aplicarDividir () {
      this.$store.commit('dividirSeparador', [ this.selectedElement.id, this.valueEspacio ])
    },
    deleteDividir () {
      this.$store.commit('deleteDivided', this.selectedElement)
      this.$store.commit('deleteElements', [...this.selectedElement.childs])
    }
  },
  computed: {
    selectedElement () {
      return this.$store.getters.selectedElement
    }
  }
}
</script>