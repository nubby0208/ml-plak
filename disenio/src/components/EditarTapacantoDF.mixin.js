export default {
    data () {
      return {
      }
    },
    computed: {
      tapacantos () {
        return this.$store.getters.getTapacantosAdd
      },
      selectedElement () {
        return this.$store.getters.selectedElement.dobleFondo
      },
      tcIzquierdo: {
        get () {
          return this.selectedElement.tapacantos.izquierdo
        },
        set (value) {
          this.$store.commit('setTapacantoDF', { key: 'izquierdo', value: value })
        }
      },
      tcDerecho: {
        get () {
          return this.selectedElement.tapacantos.derecho
        },
        set (value) {
          this.$store.commit('setTapacantoDF', { key: 'derecho', value: value })
        }
      },
      tcSuperior: {
        get () {
          return this.selectedElement.tapacantos.superior
        },
        set (value) {
          this.$store.commit('setTapacantoDF', { key: 'superior', value: value })
        }
      },
      tcInferior: {
        get () {
          return this.selectedElement.tapacantos.inferior
        },
        set (value) {
          this.$store.commit('setTapacantoDF', { key: 'inferior', value: value })
        }
      }
    }
  }