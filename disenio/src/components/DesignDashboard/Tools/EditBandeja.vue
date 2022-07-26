
<template>

<div>
    <h4 class="titulo">Bandeja:</h4>
    <table class="table table-bordered">
        <tr>
            <td>Corredera:</td>
            <td>
              <select v-model="corredera" class="form-control form-control-sm">
                <option v-for="herraje in herrajes" :key="herraje.id" :value="herraje.name">{{ herraje.name }}</option>
              </select>
            </td>
        </tr>
    </table>
</div>

</template>

<script>
export default {
  data () {
    return {
      configuraciones: [],
      extras: {
        extraAlto: 0,
        extraAbajo: 0,
        extraIzquierda: 0,
        extraDerecha: 0
      }
    }
  },
  computed: {
    selectedElement () {
      return this.$store.getters.selectedElement
    },
    herrajes () {
      return this.$store.getters.herrajes.map((herraje) => {
        return { name: herraje.material + ' ' + herraje.nombre, id: herraje.id }
      })
    },
    corredera: {
      get () {
        return this.selectedElement.corredera
      },
      set (value) {
        this.$store.commit('setBandejaProperty', { corredera: value })
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped>
    .config-elem {
    font-size: 16px;
    color: black !important;
    }
    .config-elem-clickeable {
    cursor: pointer;
    color: #007bff !important;
    }
</style>