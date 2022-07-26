<template>
  <div class="container-calco padding text-left calco-tres">
    <div
      :key="index"
      v-for="(calcoInfo, index) in calcoList"
      class="container-calco"
    >
      <table class="table table-bordered table-calco nowrap">
        <tbody>
          <tr>
            <td rowspan="2" class="short-1"></td>
            <td colspan="6" class="text-center short-6">
              <div @click="selectTapacantoLado(index, calcoInfo, 'superior')" :class="{ grey: superior(calcoInfo) }">
                {{ medidaSuperior(calcoInfo) | round }} {{ superiorInfo(calcoInfo)}}
              </div>
            </td>
            <td rowspan="2" class="short-1"></td>
          </tr>
          <tr>
            <td colspan="2" class="short-6">{{ calcoInfo.generalName }}</td>
            <td colspan="4" class="short-6">{{ calcoInfo.moduleName }}</td>
          </tr>
          <tr>
            <td rowspan="4" class="short-1 tapacanto">
              <div @click="selectTapacantoLado(index, calcoInfo, 'derecho')" :class="{ grey: derecho(calcoInfo) }">
                {{ medidaDerecha(calcoInfo) | round }} {{ derechoInfo(calcoInfo) }}
              </div>
            </td>
            <!-- <td colspan="4" class="short-4">{{ calcoInfo.generalMueble }} | {{ calcoInfo.generalName }}</td> -->
            <td colspan="4" class="short-4">{{ calcoInfo.generalMueble }}</td>
            <td colspan="2" class="short-2">{{ calcoInfo.moduleArmado }}</td>
            <td rowspan="4" class="short-1 tapacanto">
              <div @click="selectTapacantoLado(index, calcoInfo, 'izquierdo')" :class="{ grey: izquierdo(calcoInfo) }">
                {{ medidaIzquierda(calcoInfo) | round }} {{ izquierdoInfo(calcoInfo) }}
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="4" class="short-6">{{ calcoInfo.separator.name }}</td>
          </tr>
          <tr>
            <td colspan="6" class="text-right">AN</td>
          </tr>
          <tr>
            <td colspan="6">ID: {{ calcoInfo.separator.id }}</td>
          </tr>
          <tr>
            <td rowspan="2" class="short-1"></td>
            <td colspan="6">{{ calcoInfo.separator.material | filled }}</td>
            <td rowspan="2" class="short-1"></td>
          </tr>
          <tr>
            <td colspan="6" class="text-center short-6">
              <div @click="selectTapacantoLado(index, calcoInfo, 'inferior')" :class="{ grey: inferior(calcoInfo) }">
                {{ medidaInferior(calcoInfo) | round }} {{ inferiorInfo(calcoInfo) }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import selectTapacantoLado from '@/components/selectTapacantoLado.mixin'

export default {
  props: [ 'id' ],
  mixins: [selectTapacantoLado],
  computed: {
    calcoList () {
      // this.$store.commit('calcularConexiones', this.$store.getters.getElement(this.id.id))
      return this.$store.getters.getCalcoInfo(this.id.id)
    },
    selectedElement () {
      return this.$store.getters.selectedElement
    },
    aperturaUbicacion () {
      if (this.selectedElement.puerta) {
        return this.selectedElement.puerta.aperturaUbicacion
      }
    },
    bisagraUbicacion () {
      if (this.selectedElement.puerta) {
        return this.selectedElement.puerta.bisagraUbicacion
      }
    },
    height () {
      return Number(this.$store.getters.getHeight(this.id.id)).toFixed(2)
    },
    width () {
      return Number(this.$store.getters.getWidth(this.id.id)).toFixed(2)
    }
  },
  methods: {
    medidaSuperior (o) {
      if (o.separator) {
        if (o.separator.dobleFondo) {
          return o.height
        }
      }
      return o.AVeta
    },
    medidaInferior (o) {
      if (o.separator) {
        if (o.separator.dobleFondo) {
          return o.height
        }
      }
      return o.AVeta
    },
    medidaIzquierda (o) {
      if (o.separator) {
        /* if (o.separator.dobleFondo) {
          return o.height
        } */
      }
      return o.LVeta
    },
    medidaDerecha (o) {
      if (o.separator) {
        /* if (o.separator.dobleFondo) {
          return o.height
        } */
      }
      return o.LVeta
    },
    superior (o) {
      if (o.separator && o.separator.tapacantos && o.separator.tapacantos.superior) {
        return true
      }
      if (o.separator && o.separator.dobleFondo && o.separator.dobleFondo.tapacantos && o.separator.dobleFondo.tapacantos.superior) {
        return true
      }
      if (o.separator && o.separator.puerta && o.separator.puerta.tapacantos && o.separator.puerta.tapacantos.superior) {
        return true
      }
      return false
    },
    superiorInfo (o) {
      let apertura = ''
      if (o.separator.puerta && this.aperturaUbicacion === 'Superior') {
        apertura = o.aperturaSistema
      }
      let bisagra = ''
      if (o.separator.puerta && this.bisagraUbicacion === 'Superior') {
        bisagra = o.separator.puerta.bisagraTipo
      }
      if (o.separator) {
        if (o.separator.tapacantos) {
          return (o.separator.tapacantos.superior && o.separator.tapacantos.superior.nombre) || o.separator.tapacantos.superior
        }
        if (o.separator.dobleFondo && o.separator.dobleFondo.tapacantos) {
          return o.separator.dobleFondo.tapacantos.superior
        }
        if (o.separator.puerta && o.separator.puerta.tapacantos) {
          return o.separator.puerta.tapacantos.superior + ' ' + apertura + ' ' + bisagra
        }
      }
      return ''
    },
    derecho (o) {
      if (o.separator && o.separator.tapacantos && o.separator.tapacantos.derecho) {
        return true
      }
      if (o.separator && o.separator.dobleFondo && o.separator.dobleFondo.tapacantos && o.separator.dobleFondo.tapacantos.derecho) {
        return true
      }
      if (o.separator && o.separator.puerta && o.separator.puerta.tapacantos && o.separator.puerta.tapacantos.derecho) {
        return true
      }
      return false
    },
    derechoInfo (o) {
      let apertura = ''
      if (o.separator.puerta && this.aperturaUbicacion === 'Derecha') {
        apertura = o.aperturaSistema
      }
      let bisagra = ''
      if (o.separator.puerta && this.bisagraUbicacion === 'Derecha') {
        bisagra = o.separator.puerta.bisagraTipo
      }
      if (o.separator) {
        if (o.separator.tapacantos) {
          return (o.separator.tapacantos.derecho && o.separator.tapacantos.derecho.nombre) || o.separator.tapacantos.derecho
        }
        if (o.separator.dobleFondo && o.separator.dobleFondo.tapacantos) {
          return o.separator.dobleFondo.tapacantos.derecho
        }
        if (o.separator.puerta && o.separator.puerta.tapacantos) {
          return o.separator.puerta.tapacantos.derecho + ' ' + apertura + ' ' + bisagra
        }
      }
      return ''
    },
    izquierdo (o) {
      if (o.separator && o.separator.tapacantos && o.separator.tapacantos.izquierdo) {
        return true
      }
      if (o.separator && o.separator.dobleFondo && o.separator.dobleFondo.tapacantos && o.separator.dobleFondo.tapacantos.izquierdo) {
        return true
      }
      if (o.separator && o.separator.puerta && o.separator.puerta.tapacantos && o.separator.puerta.tapacantos.izquierdo) {
        return true
      }
      return false
    },
    izquierdoInfo (o) {
      let apertura = ''
      if (o.separator.puerta && this.aperturaUbicacion === 'Izquierda') {
        apertura = o.aperturaSistema
      }
      let bisagra = ''
      if (o.separator.puerta && this.bisagraUbicacion === 'Izquierda') {
        bisagra = o.separator.puerta.bisagraTipo
      }
      if (o.separator) {
        if (o.separator.tapacantos) {
          return (o.separator.tapacantos.izquierdo && o.separator.tapacantos.izquierdo.nombre) || o.separator.tapacantos.izquierdo
        }
        if (o.separator.dobleFondo && o.separator.dobleFondo.tapacantos) {
          return o.separator.dobleFondo.tapacantos.izquierdo
        }
        if (o.separator.puerta && o.separator.puerta.tapacantos) {
          return o.separator.puerta.tapacantos.izquierdo + ' ' + apertura + ' ' + bisagra
        }
      }
      return ''
    },
    inferior (o) {
      if (o.separator && o.separator.tapacantos && o.separator.tapacantos.inferior) {
        return true
      }
      if (o.separator && o.separator.dobleFondo && o.separator.dobleFondo.tapacantos && o.separator.dobleFondo.tapacantos.inferior) {
        return true
      }
      if (o.separator && o.separator.puerta && o.separator.puerta.tapacantos && o.separator.puerta.tapacantos.inferior) {
        return true
      }
      return false
    },
    inferiorInfo (o) {
      let apertura = ''
      if (o.separator.puerta && this.aperturaUbicacion === 'Inferior') {
        apertura = o.aperturaSistema
      }
      let bisagra = ''
      if (o.separator.puerta && this.bisagraUbicacion === 'Inferior') {
        bisagra = o.separator.puerta.bisagraTipo
      }
      if (o.separator) {
        if (o.separator.tapacantos) {
          return (o.separator.tapacantos.inferior && o.separator.tapacantos.inferior.nombre) || o.separator.tapacantos.inferior
        }
        if (o.separator.dobleFondo && o.separator.dobleFondo.tapacantos) {
          return o.separator.dobleFondo.tapacantos.inferior
        }
        if (o.separator.puerta && o.separator.puerta.tapacantos) {
          return o.separator.puerta.tapacantos.inferior + ' ' + apertura + ' ' + bisagra
        }
      }
      return ''
    }
  }
}
</script>

<style scoped>
td {
  font-size: 11px;
}
.short-1 {
  min-width: 15px;
  max-width: 15px;
}
.short-2 {
  min-width: 15px;
  max-width: 15px;
}
.short-4 {
  min-width: 30px;
  max-width: 30px;
}
.short-6 {
  min-width: 45px;
  max-width: 45px;
}
.table-calco {
  min-width: 60px;
  max-width: 60px;
  font-size: 9px;
}
.container-calco {
  display: inline-block;
  vertical-align: top;
}
.tapacanto {
  vertical-align: middle;
  word-break: keep-all;
}
.padding {
  padding-right: 5px;
}
.green {
  background-color: lightgreen;
}
.grey {
  background-color: lightgray;
}
.orange {
  background-color: orange;
}

@media print
{    
  .short-1 {
    min-width: 41px !important;
    max-width: 60px !important;
  }

  td, td div {
    font-size: 18px !important;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
}
</style>
