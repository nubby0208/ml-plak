<template>
    <div>
        <table>
            <tr><td colspan="4"><span class="ComponentTitle">Configurar Ejes Generales(Módulo {{selectedModuleId}})</span></td></tr>
            <tr><td>&nbsp;</td></tr>
            <tr>
              <td>
                <label>X:</label>
              </td>
              <td><input type="number" class="form-control form-control-sm" v-model="ejeX"></td>
              <td><label>X &deg;:</label></td>
              <td><input type="number" class="form-control form-control-sm" v-model="ejeRX"></td>
            </tr>
            <tr>
              <td>
                <label>Y:</label>
              </td>
              <td><input type="number" class="form-control form-control-sm" v-model="ejeY"></td>
              <td>
                <label>Y &deg;:</label>
              </td>
              <td><input type="number" class="form-control form-control-sm" v-model="ejeRY"></td>
            </tr>
            <tr>
              <td>
                <label>Z:</label>
              </td>
              <td><input type="number" class="form-control form-control-sm" v-model="ejeZ"></td>
              <td>
                <label>Z &deg;:</label>
              </td>
              <td><input type="number" class="form-control form-control-sm" v-model="ejeRZ"></td>
            </tr>
      </table>
    </div>
</template>

<script>
export default {
  data () {
    return {
      timer: null
    }
  },
  methods: {
    timedUpdate (callback) {
      clearTimeout(this.timer)
      this.timer = setTimeout(callback, 300)
    }
  },
  computed: {
    ejeX: {
      get () {
        return this.$store.getters.selectedModule._x
      },
      set (value) {
        this.timedUpdate(() => this.$store.commit('setEjeX', value))
      }
    },
    ejeY: {
      get () {
        return this.$store.getters.selectedModule._y
      },
      set (value) {
        this.timedUpdate(() => this.$store.commit('setEjeY', value))
      }
    },
    ejeZ: {
      get () {
        return this.$store.getters.selectedModule._z
      },
      set (value) {
        this.timedUpdate(() => this.$store.commit('setEjeZ', value))
      }
    },
    ejeRX: {
      get () {
        return this.$store.getters.selectedModule._rx
      },
      set (value) {
        this.timedUpdate(() => this.$store.commit('setEjeRX', value))
      }
    },
    ejeRY: {
      get () {
        return this.$store.getters.selectedModule._ry
      },
      set (value) {
        this.timedUpdate(() => this.$store.commit('setEjeRY', value))
      }
    },
    ejeRZ: {
      get () {
        return this.$store.getters.selectedModule._rz
      },
      set (value) {
        this.timedUpdate(() => this.$store.commit('setEjeRZ', value))
      }
    },
    selectedModuleId: {
      get () {
        return this.$store.getters.selectedModuleId + 1
      }
    }
  }
}
</script>

<style scoped>
.ComponentTitle {
    text-decoration: underline;
    font-weight: bold;
    font-size: 3vh;
}
table{
  margin: auto;
}
</style>