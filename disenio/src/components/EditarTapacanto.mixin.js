export default {
  methods: {
    withDivision () {
      return this.selectedElement.separator &&
        this.selectedElement.childs !== undefined &&
        this.selectedElement.childs !== null &&
        this.selectedElement.childs.length > 0
    }
  },
  mounted(){
  },
  computed: {
    containerExpandedTapacantos: {
      get () {
        return this.$store.state.projectSettings.collapsibles.containerExpanded.editTapacantos
      },
      set (value) {
        this.$store.commit('setProjectSettingsCollapsibles', {
          key: 'containerExpanded',
          subKey: 'editTapacantos',
          value: value
        })
      }
    },
    containerExpandedTapacantosTrasero: {
      get () {
        return this.$store.state.projectSettings.collapsibles.containerExpanded.editTapacantosTrasero
      },
      set (value) {
        this.$store.commit('setProjectSettingsCollapsibles', {
          key: 'containerExpanded',
          subKey: 'editTapacantosTrasero',
          value: value
        })
      }
    },
    containerExpandedTapacantosDelantero: {
      get () {
        return this.$store.state.projectSettings.collapsibles.containerExpanded.editTapacantosDelantero
      },
      set (value) {
        this.$store.commit('setProjectSettingsCollapsibles', {
          key: 'containerExpanded',
          subKey: 'editTapacantosDelantero',
          value: value
        })
      }
    },
    tapacantos () {
      return this.$store.getters.getTapacantosAdd
    },
    selectedElement () {
      return this.$store.getters.selectedElement
      return this.$store.getters.selectedElement.dobleFondo
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