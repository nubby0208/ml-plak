<template>
<div>
  <div class="bordered-container" v-if="!withDivision()">
    <div class="flex">
      <div class="container-title not-printable"  @click="toggleContainer('editTapacantos')">
        <span class="container-toggler more" v-if="containerExpanded['editTapacantos']">▼</span>
        <span class="container-toggler less" v-if="!containerExpanded['editTapacantos']">▲</span>
        Tapacantos
      </div>
    </div>
    <div class="bordered-section" :class="{'uncollapsed': containerExpanded['editTapacantos']}">
      <div class="flex flex-column margin-bottom-10">
        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcIzquierdo">Izquierdo</label>
          <select id="tcIzquierdo" v-model="tcIzquierdo">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcDerecho">Derecho</label>
          <select id="tcDerecho" v-model="tcDerecho">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcSuperior">Superior</label>
          <select id="tcSuperior" v-model="tcSuperior">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcInferior">Inferior</label>
          <select id="tcInferior" v-model="tcInferior">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <div class="bordered-container" v-if="withDivision()">
    <div class="flex">
      <div class="container-title not-printable"  @click="toggleContainer('editTapacantosTrasero')">
        <span class="container-toggler more" v-if="containerExpanded['editTapacantosTrasero']">▼</span>
        <span class="container-toggler less" v-if="!containerExpanded['editTapacantosTrasero']">▲</span>
        Tapacantos Trasero
      </div>
    </div>
    <div class="bordered-section" :class="{'uncollapsed': containerExpanded['editTapacantosTrasero']}">
      <div class="flex flex-column margin-bottom-10">
        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcIzquierdo1">Izquierdo</label>
          <select id="tcIzquierdo1" v-model="tcIzquierdo1">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcDerecho1">Derecho</label>
          <select id="tcDerecho1" v-model="tcDerecho1" class="form-control form-control-sm">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcSuperior1">Superior</label>
          <select id="tcSuperior1" v-model="tcSuperior1" class="form-control form-control-sm">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcInferior1">Inferior</label>
          <select id="tcInferior1" v-model="tcInferior1" class="form-control form-control-sm">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <div class="bordered-container" v-if="withDivision()">
    <div class="flex">
      <div class="container-title not-printable"  @click="toggleContainer('editTapacantosDelantero')">
        <span class="container-toggler more" v-if="containerExpanded['editTapacantosDelantero']">▼</span>
        <span class="container-toggler less" v-if="!containerExpanded['editTapacantosDelantero']">▲</span>
        Tapacantos Delantero
      </div>
    </div>
    <div class="bordered-section" :class="{'uncollapsed': containerExpanded['editTapacantosDelantero']}">
      <div class="flex flex-column margin-bottom-10">
        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcIzquierdo2">Izquierdo</label>
          <select id="tcIzquierdo2" v-model="tcIzquierdo2" class="form-control form-control-sm">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcDerecho2">Derecho</label>
          <select id="tcDerecho2" v-model="tcDerecho2" class="form-control form-control-sm">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcSuperior2">Superior</label>
          <select id="tcSuperior2" v-model="tcSuperior2" class="form-control form-control-sm">
              <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>

        <div class="flex align-items-center hover-line ml-control">
          <label class="bordered-section-label" for="tcInferior2">Inferior</label>
          <select id="tcInferior2" v-model="tcInferior2" class="form-control form-control-sm">
            <option v-for="(tapacanto, index) in tapacantos" :value="tapacanto" :key="index">{{ tapacanto.nombre }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      containerExpanded: {
        editTapacantos: true,
        editTapacantosTrasero: true,
        editTapacantosDelantero: true
      }
    }
  },
  mounted () {
    this.containerExpanded['editTapacantos'] = this.isContainerExpanded('editTapacantos')
    this.containerExpanded['editTapacantosTrasero'] = this.isContainerExpanded('editTapacantosTrasero')
    this.containerExpanded['editTapacantosDelantero'] = this.isContainerExpanded('editTapacantosDelantero')
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
    withDivision () {
      return this.selectedElement.separator && this.selectedElement.childs !== undefined && this.selectedElement.childs !== null && this.selectedElement.childs.length > 0
    }
  },
  computed: {
    tapacantos () {
      return this.$store.getters.getTapacantosAdd
    },
    selectedElement () {
      return this.$store.getters.selectedElement
    },
    tcIzquierdo: {
      get () {
        const tcIzq = this.selectedElement.tapacantos.izquierdo
        if (tcIzq) {
          return this.tapacantos.find(tc => tc.id === tcIzq.id)
        }
        return tcIzq
      },
      set (value) {
        this.$store.commit('setTapacanto', { key: 'izquierdo', value: value })
      }
    },
    tcDerecho: {
      get () {
        const tcDer = this.selectedElement.tapacantos.derecho
        if (tcDer) {
          return this.tapacantos.find(tc => tc.id === tcDer.id)
        }
        return tcDer
      },
      set (value) {
        this.$store.commit('setTapacanto', { key: 'derecho', value: value })
      }
    },
    tcSuperior: {
      get () {
        const tcSup = this.selectedElement.tapacantos.superior
        if (tcSup) {
          return this.tapacantos.find(tc => tc.id === tcSup.id)
        }
        return tcSup
      },
      set (value) {
        this.$store.commit('setTapacanto', { key: 'superior', value: value, pieza: this.selectedElement })
      }
    },
    tcInferior: {
      get () {
        const tcInf = this.selectedElement.tapacantos.inferior
        if (tcInf) {
          return this.tapacantos.find(tc => tc.id === tcInf.id)
        }
        return tcInf
      },
      set (value) {
        this.$store.commit('setTapacanto', { key: 'inferior', value: value })
      }
    },
    tcIzquierdo1: {
      get () {
        return this.$store.getters.getElement(this.selectedElement.childs[0]).tapacantos.izquierdo
      },
      set (value) {
        this.$store.commit('setTapacantoDivision', { key: 'izquierdo', value: value, pieza: 0 })
      }
    },
    tcDerecho1: {
      get () {
        return this.$store.getters.getElement(this.selectedElement.childs[0]).tapacantos.derecho
      },
      set (value) {
        this.$store.commit('setTapacantoDivision', { key: 'derecho', value: value, pieza: 0 })
      }
    },
    tcSuperior1: {
      get () {
        return this.$store.getters.getElement(this.selectedElement.childs[0]).tapacantos.superior
      },
      set (value) {
        this.$store.commit('setTapacantoDivision', { key: 'superior', value: value, pieza: 0 })
      }
    },
    tcInferior1: {
      get () {
        return this.$store.getters.getElement(this.selectedElement.childs[0]).tapacantos.inferior
      },
      set (value) {
        this.$store.commit('setTapacantoDivision', { key: 'inferior', value: value, pieza: 0 })
      }
    },
    tcIzquierdo2: {
      get () {
        return this.$store.getters.getElement(this.selectedElement.childs[1]).tapacantos.izquierdo
      },
      set (value) {
        this.$store.commit('setTapacantoDivision', { key: 'izquierdo', value: value, pieza: 1 })
      }
    },
    tcDerecho2: {
      get () {
        return this.$store.getters.getElement(this.selectedElement.childs[1]).tapacantos.derecho
      },
      set (value) {
        this.$store.commit('setTapacantoDivision', { key: 'derecho', value: value, pieza: 1 })
      }
    },
    tcSuperior2: {
      get () {
        return this.$store.getters.getElement(this.selectedElement.childs[1]).tapacantos.superior
      },
      set (value) {
        this.$store.commit('setTapacantoDivision', { key: 'superior', value: value, pieza: 1 })
      }
    },
    tcInferior2: {
      get () {
        return this.$store.getters.getElement(this.selectedElement.childs[1]).tapacantos.inferior
      },
      set (value) {
        this.$store.commit('setTapacantoDivision', { key: 'inferior', value: value, pieza: 1 })
      }
    }
  }
}
</script>