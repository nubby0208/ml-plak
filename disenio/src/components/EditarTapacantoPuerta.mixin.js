export default {
    computed: {
        tapacantos () {
        let tapacantos = []
        this.$store.getters.getTapacantosAdd.forEach((tapacanto) => tapacantos.push(tapacanto))
        if (this.selectedElement.corrediza && this.$store.getters.getMetalesAdd) {
            this.$store.getters.getMetalesAdd.forEach((kit) => {
            tapacantos.push({nombre: kit.material})
            })
        }
        return tapacantos
        },
        selectedElement () {
        return this.$store.getters.selectedElement.puerta
        },
        tcIzquierdo: {
        get () {
            return this.selectedElement.tapacantos.izquierdo
        },
        set (value) {
            this.$store.commit('setTapacantoPuerta', { key: 'izquierdo', value: value })
        }
        },
        tcDerecho: {
        get () {
            return this.selectedElement.tapacantos.derecho
        },
        set (value) {
            this.$store.commit('setTapacantoPuerta', { key: 'derecho', value: value })
        }
        },
        tcSuperior: {
        get () {
            return this.selectedElement.tapacantos.superior
        },
        set (value) {
            this.$store.commit('setTapacantoPuerta', { key: 'superior', value: value })
        }
        },
        tcInferior: {
        get () {
            return this.selectedElement.tapacantos.inferior
        },
        set (value) {
            this.$store.commit('setTapacantoPuerta', { key: 'inferior', value: value })
        }
        }
    }
}