<template>
    <div>
      <div>
          <table>
              <tr><td colspan="4"><span class="ComponentTitle">Módulos Externos</span></td></tr>
              <tr><td>&nbsp;</td></tr>
          </table>
      </div>
      <div class="row">
          <div class="col-9">
            <table>
                <tr>
                  <td>
                    <label>Cantidad:</label>
                  </td>
                  <td><input type="number" class="form-control form-control-sm" v-model="currentExterno.Cantidad"></td>
                  <td>
                    <label>Módulo:</label>
                  </td>
                  <td>
                    <select v-model="currentExterno.TipoModulo" class="form-control form-control-sm">
                      <option v-for="modulo in modulosExternos" :key="modulo.key" :value="modulo.value">{{ modulo.value }}
                      </option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td v-if="isAlto">
                    <label>Alto:</label>
                  </td>
                  <td v-if="isAlto"><input type="number" class="form-control form-control-sm" v-model="currentExterno.Altura"></td>
                  <td>
                    <label>Ancho:</label>
                  </td>
                  <td><input type="number" class="form-control form-control-sm" v-model="currentExterno.Ancho"></td>
                </tr>
                <tr>
                  <td v-if="isProfundidad">
                    <label>Profundidad:</label>
                  </td>
                  <td v-if="isProfundidad"><input type="number" class="form-control form-control-sm" v-model="currentExterno.Profundidad"></td>
                  <td  v-if="isEstanteFlotante"><label>Material:</label></td>
                  <td  v-if="isEstanteFlotante">
                    <select v-model="currentExterno.Material" class="form-control form-control-sm">
                        <option v-for="mat in fondos" :key="mat" :value="mat">{{ mat }}</option>
                    </select>
                  </td>
                </tr>
                <tr v-if="isEstanteFlotante">
                  <td>
                    <label>Base:</label>
                  </td>
                  <td>
                    <select v-model="currentExterno.Base" class="form-control form-control-sm">
                        <option v-for="base in tiposDeBase" :key="base.key" :value="base.value">{{ base.value }}</option>
                    </select>
                  </td>
                  <td><label>Espesor:</label></td>
                  <td>
                    <select v-model="currentExterno.Espesor" class="form-control form-control-sm">
                        <option v-for="espesor in espesores" :key="espesor.key" :value="espesor.value">{{ espesor.value }}
                        </option>
                    </select>
                  </td>
                </tr>
                <tr><td>&nbsp;</td></tr>
                <tr><td colspan="4"><button @click="addCustomModule()">Agregar</button></td></tr>
          </table>
        </div>
          <div class="col-3">
              <span class="subtitle">Módulos</span>
              <ul>
                  <li
                    :key="index"
                    v-for="(o, index) in getCustomModules"
                  >{{o.name}}</li>
              </ul>
          </div>
      </div>
    </div>
</template>

<script>
import { Part } from './models/models'
import { ModulosExternosEnum, EnumToArray, TipoDeBaseEnum, EspesorEnum } from './models/enums'

export default {
  data () {
    return {
      listExterno: [],
      currentExterno: new Part(),
      modulosExternos: EnumToArray(ModulosExternosEnum),
      tiposDeBase: EnumToArray(TipoDeBaseEnum),
      espesores: EnumToArray(EspesorEnum),
      n: 0,
      isEstanteFlotante: false,
      isProfundidad: true,
      isAlto: true,
      fondos: [],
      materiales_add: [],
      fondos_add: []
    }
  },
  computed: {
    moduloExternoSelected () {
      return this.currentExterno.TipoModulo
    },
    listadoModulosExternos () {
      return this.$store.getters.modulosExternos
    },
    tipoDeBase () {
      return this.$store.getters.tipoDeBase
    },
    espesor () {
      return this.$store.getters.espesores
    },
    getCustomModules () {
      return this.$store.getters.getCustomModules
    }
  },
  methods: {
    addCustomModule () {
      this.currentExterno.AVeta = this.currentExterno.Profundidad
      this.currentExterno.LVeta = this.currentExterno.Ancho
      if (this.currentExterno.TipoModulo === this.listadoModulosExternos[0]) { // ModulosExternosEnum.EstanteFlotante) {

      } else if (this.currentExterno.TipoModulo === this.listadoModulosExternos[1]) { // Banquina
        this.currentExterno.AVeta = this.currentExterno.Altura
      } else if (this.currentExterno.TipoModulo === this.listadoModulosExternos[2]) {

      } else {
        this.isProfundidad = false
      }
      this.$store.commit('addCustomModule', this.currentExterno)
      this.$swal.close()
    }
  },
  watch: {
    moduloExternoSelected: function (newValue, oldValue) {
      this.isEstanteFlotante = false
      this.isAlto = true
      this.isProfundidad = true
      if (this.currentExterno.TipoModulo === this.listadoModulosExternos[0]) { // ModulosExternosEnum.EstanteFlotante) {
        this.isEstanteFlotante = true
        this.isAlto = false
      } else if (this.currentExterno.TipoModulo === this.listadoModulosExternos[1]) {
      } else if (this.currentExterno.TipoModulo === this.listadoModulosExternos[2]) {
      } else {
        this.isProfundidad = false
      }
    }
  },
  mounted () {
    this.fondos = []
    this.materiales_add = JSON.parse(localStorage.getItem('materiales_add')) || []
    this.fondos_add = JSON.parse(localStorage.getItem('fondos_add')) || []
    if (this.materiales_add) {
      this.materiales_add.forEach(p => {
        this.fondos.push(p.material)
      })
    }

    if (this.fondos_add) {
      this.fondos_add.forEach(p => {
        this.fondos.push(p.material)
      })
    }

    /* if (this.$store.state.general.color1) {
      this.fondos.push(this.$store.state.general.color1)
    }
    if (this.$store.state.general.color2) {
      this.fondos.push(this.$store.state.general.color2)
    }
    if (this.$store.state.general.color3) {
      this.fondos.push(this.$store.state.general.color3)
    } */
    /* if (this.$store.state.general.fondo1) {
      this.fondos.push(this.$store.state.general.fondo1)
    }
    if (this.$store.state.general.fondo2) {
      this.fondos.push(this.$store.state.general.fondo2)
    } */

    if (this.$store.state.general.metal1) {
      this.fondos.push(this.$store.state.general.metal1)
    }
    if (this.$store.state.general.metal2) {
      this.fondos.push(this.$store.state.general.metal2)
    }
    if (this.$store.state.general.metal3) {
      this.fondos.push(this.$store.state.general.metal3)
    }
    if (this.$store.state.general.metal4) {
      this.fondos.push(this.$store.state.general.metal4)
    }
    if (this.$store.state.general.herraje1) {
      this.fondos.push(this.$store.state.general.herraje1)
    }
    if (this.$store.state.general.herraje2) {
      this.fondos.push(this.$store.state.general.herraje2)
    }
    if (this.$store.state.general.herraje3) {
      this.fondos.push(this.$store.state.general.herraje3)
    }
    if (this.$store.state.general.herraje4) {
      this.fondos.push(this.$store.state.general.herraje4)
    }
    if (this.$store.state.general.herraje5) {
      this.fondos.push(this.$store.state.general.herraje5)
    }
    if (this.$store.state.general.herraje6) {
      this.fondos.push(this.$store.state.general.herraje6)
    }
    if (this.$store.state.general.herraje7) {
      this.fondos.push(this.$store.state.general.herraje7)
    }
    if (this.$store.state.general.herraje8) {
      this.fondos.push(this.$store.state.general.herraje8)
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
ul{
    font-size: 12px;
}
.subtitle{
    font-weight: bolder;
}
</style>