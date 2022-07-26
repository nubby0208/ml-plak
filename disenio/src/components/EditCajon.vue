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
<template>
<div>
    <h4>Cajon:</h4>
    <div>
      <button @click="saveElementConfig()" type="button" class="btn btn-link btn-sm">Guardar configuracion</button>
      <span>|</span>
      <button @click="loadElementConfig()" type="button" class="btn btn-link btn-sm">Cargar configuracion</button>
    </div>    
    <table class="table table-bordered">
        <tr>
            <td>Frente Encastre:</td>
            <td>
              <select v-model="frenteEncastre" class="form-control form-control-sm">
                  <option value="encastrado">Encastrado</option>
                  <option value="superpuesto">Superpuesto</option>
              </select>
            </td>
        </tr>
        <tr>
            <td>Profundidad:</td>
            <td>
                <input v-model="profundidad" type="number" step="50">
            </td>
        </tr>
        <tr>
            <td>Corredera:</td>
            <td>
              <select v-model="corredera" class="form-control form-control-sm">
                <option v-for="herraje in herrajes" :key="herraje.id" :value="herraje.name">{{ herraje.name }}</option>
              </select>
            </td>
        </tr>
       <tr>
            <td>Frente Material:</td>
            <td>
              <select name="frente" v-model="frenteMaterial" class="form-control form-control-sm">
                <option v-for="color in colorsFrente" :key="color" :value="color">{{ color }}</option>
              </select>
            </td>
        </tr>        
        <tr>
            <td>Material:</td>
            <td>
              <select v-model="material" class="form-control form-control-sm">
                <option v-for="color in colors" :key="color" :value="color">{{ color }}</option>
              </select>
            </td>
        </tr>
        <tr>
            <td>Fondo Material:</td>
            <td>
              <select name="fondo" v-model="fondoMaterial" class="form-control form-control-sm">
                <option v-for="color in colorsFondo" :key="color" :value="color">{{ color }}</option>
              </select>
            </td>
        </tr>   
        <tr>
            <td>Fondo Encastre:</td>
            <td>
              <select v-model="fondoEncastre" class="form-control form-control-sm">
                  <option value="encastrado">Encastrado</option>
                  <option value="superpuesto">Superpuesto</option>
              </select>
            </td>
        </tr>
        <tr>
            <td>Sistema de Apertura:</td>
            <td>
              <select v-model="aperturaSistema" class="form-control form-control-sm">
                <option v-for="apertura in aperturas" :key="apertura" :value="apertura">{{ apertura }}</option>
              </select>
            </td>
        </tr>
        <tr>
            <td>Ubicacion de Apertura:</td>
            <td>
              <select v-model="aperturaUbicacion" class="form-control form-control-sm">
                <option v-for="ubicacion in ubicaciones" :key="ubicacion" :value="ubicacion">{{ ubicacion }}</option>
              </select>
            </td>
        </tr>
        <tr>
            <td>Sentido de Veta:</td>
            <td>
              <select v-model="sentidoVeta" class="form-control form-control-sm">
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
              </select>
            </td>
        </tr>
        <tr>
            <td>Luz:</td>
            <td>
                <input v-model="luz" type="number">
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
            <td>Reducir o aumentar altura del cajon:</td>
            <td>
                <input v-model="extraAltoLatYCF">
            </td>
        </tr>                
        <tr v-if="!selectedElement.dobleFondo">
          <td colspan="2" class="text-center">
            <button v-on:click="removeCajon()">
              Borrar Cajones
            </button>
          </td>
        </tr>
    </table>
    <div style="display:none" ref="configOptions">
      <div>
        <h3>Guardar Configuración</h3>
        <br/>
        <form style="text-align:left">
          <div class="form-group">
            <label for="config-name">Nombre de la configuración</label>
            <input type="text" class="form-control config-name" id="config-name">
          </div>
          <div class="form-group form-check">
            <input type="checkbox" class="form-check-input tapacantos-check" id="tapacantos-check" checked="checked">
            <label class="form-check-label" for="tapacantos-check">Guardar tapacantos</label>
          </div>
        </form>
      </div>
    </div>

    <b-modal ref="loadConfigModal" hide-footer title="Listado de presets guardadas">
      <div class="d-block text-center">
        <!-- <div>
          <div class="input-group input-group-sm mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="project-filter-label">Filtrar</span>
            </div>
            <input ref="filterInput" type="text" class="form-control" id="project-filter" v-on:keyup="filtrar()" v-model="filterQuery">
          </div>
        </div> -->
        <table class="table table-bordered" style="width: 100% !important;">
          <thead class="thead-light">
            <tr>
              <th class="text-center">Nombre</th>
              <th class="text-center">Tipo</th>
              <th class="text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(config, index) in configuraciones" :key="index">
              <td><a @click="configLoad(config.id)" class="config-elem config-elem-clickeable">{{ config.name }}</a></td>
              <td><a class="config-elem">{{ config.type }}</a></td>
              <td><button type="button" class="btn btn-sm btn-danger" @click="configDelete(index)">&#10006;</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-modal>  
</div>
</template>

<script>
import { HTTP } from '../index'
export default {
  data () {
    return {
      configuraciones: [],
      extras: {
        extraAlto: undefined,
        extraAbajo: undefined,
        extraIzquierda: undefined,
        extraDerecha: undefined
      }
    }
  },
  computed: {
    selectedElement () {
      return this.$store.getters.selectedElement
    },
    colors () {
      const materiales = this.$store.state.general.materiales_add
      const defaultMaterial = this.$store.state.general.material_default

      if (!materiales || !defaultMaterial) {
        return []
      }

      return JSON.parse(materiales).map(m => m.material)
    },
    colorsFondo () {
      const materiales = this.$store.state.general.materiales_add
      const defaultMaterial = this.$store.state.general.material_default

      if (!materiales || !defaultMaterial) {
        return []
      }

      return JSON.parse(materiales).map(m => m.material)
    },
    colorsFrente () {
      const materiales = this.$store.state.general.materiales_add
      const defaultMaterial = this.$store.state.general.material_default

      if (!materiales || !defaultMaterial) {
        return []
      }

      return JSON.parse(materiales).map(m => m.material)
    },
    herrajes () {
      return this.$store.getters.herrajes.map((herraje) => {
        return { name: herraje.material + ' ' + herraje.nombre, id: herraje.id }
      })
    },
    aperturas () {
      return this.$store.getters.aperturas
    },
    ubicaciones () {
      return this.$store.getters.ubicaciones
    },
    frenteEncastre: {
      get () {
        return this.selectedElement.frenteEncastre
      },
      set (value) {
        this.$store.commit('setCajonProperty', { frenteEncastre: value })
      }
    },
    profundidad: {
      get () {
        return this.selectedElement.profundidad
      },
      set (value) {
        this.$store.commit('setCajonProperty', { profundidad: Number(value) })
      }
    },
    corredera: {
      get () {
        return this.selectedElement.corredera
      },
      set (value) {
        this.$store.commit('setCajonProperty', { corredera: value })
      }
    },
    material: {
      get () {
        return this.selectedElement.material
      },
      set (value) {
        this.$store.commit('setCajonProperty', { material: value })
      }
    },
    fondoMaterial: {
      get () {
        return this.selectedElement.fondoMaterial
      },
      set (value) {
        this.$store.commit('setCajonProperty', { fondoMaterial: value })
      }
    },
    frenteMaterial: {
      get () {
        return this.selectedElement.frenteMaterial
      },
      set (value) {
        this.$store.commit('setCajonProperty', { frenteMaterial: value })
      }
    },
    fondoEncastre: {
      get () {
        return this.selectedElement.fondoEncastre
      },
      set (value) {
        this.$store.commit('setCajonProperty', { fondoEncastre: value })
      }
    },
    altura: {
      get () {
        return this.selectedElement.altura
      },
      set (value) {
        this.$store.commit('setCajonProperty', { altura: Number(value) })
      }
    },
    aperturaSistema: {
      get () {
        return this.selectedElement.aperturaSistema
      },
      set (value) {
        this.$store.commit('setCajonProperty', { aperturaSistema: value })
      }
    },
    aperturaUbicacion: {
      get () {
        return this.selectedElement.aperturaUbicacion
      },
      set (value) {
        this.$store.commit('setCajonProperty', { aperturaUbicacion: value })
      }
    },
    sentidoVeta: {
      get () {
        return this.selectedElement.sentidoVeta
      },
      set (value) {
        this.$store.commit('setCajonProperty', { sentidoVeta: value })
      }
    },
    luz: {
      get () {
        return this.selectedElement.luz
      },
      set (value) {
        this.$store.commit('setCajonProperty', { luz: Number(value) })
      }
    },
    extraAlto: {
      get () {
        return this.selectedElement.extraAlto
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
        return this.selectedElement.extraDerecha
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
        return this.selectedElement.extraAbajo
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
        return this.selectedElement.extraIzquierda
      },
      set (value) {
        const number = Number(value)
        if (!isNaN(number)) {
          this.extras.extraIzquierda = number
        }
      }
    },
    extraAltoLatYCF: {
      get () {
        return this.selectedElement.extraAltoLatYCF
      },
      set (value) {
        const number = Number(value)
        if (!isNaN(number)) {
          this.$store.commit('setCajonProperty', { extraAltoLatYCF: number })
        }
      }
    }
  },
  methods: {
    updateArea () {
      this.$store.commit('setCajonProperty', { extraAlto: this.extras.extraAlto === undefined ? this.extraAlto : this.extras.extraAlto })
      this.$store.commit('setCajonProperty', { extraAbajo: this.extras.extraAbajo === undefined ? this.extraAbajo : this.extras.extraAbajo })
      this.$store.commit('setCajonProperty', { extraDerecha: this.extras.extraDerecha === undefined ? this.extraDerecha : this.extras.extraDerecha })
      this.$store.commit('setCajonProperty', { extraIzquierda: this.extras.extraIzquierda === undefined ? this.extraIzquierda : this.extras.extraIzquierda })
    },
    saveElementConfig () {
      this.$refs.configOptions.style.display = 'block'
      this.$swal({
        content: this.$refs.configOptions,
        buttons: {
          cancelar: {
            text: 'Cancelar',
            value: 0
          },
          save: {
            text: 'Guardar',
            value: 1
          }
        }
      }).then((result) => {
        const name = document.getElementsByClassName('config-name')[1].value
        if (result === 1 && name) {
          const config = {
            name,
            type: 'Cajon',
            values: [
              { name: 'frenteEncastre', value: this.frenteEncastre },
              { name: 'profundidad', value: this.profundidad },
              { name: 'corredera', value: this.corredera },
              { name: 'frenteMaterial', value: this.frenteMaterial },
              { name: 'material', value: this.material },
              { name: 'fondoMaterial', value: this.fondoMaterial },
              { name: 'fondoEncastre', value: this.fondoEncastre },
              { name: 'aperturaSistema', value: this.aperturaSistema },
              { name: 'aperturaUbicacion', value: this.aperturaUbicacion },
              { name: 'luz', value: this.luz },
              { name: 'extraAlto', value: this.extraAlto },
              { name: 'extraAbajo', value: this.extraAbajo },
              { name: 'extraDerecha', value: this.extraDerecha },
              { name: 'extraIzquierda', value: this.extraIzquierda },
              { name: 'extraAltoLatYCF', value: this.extraAltoLatYCF },
              { name: 'sentidoVeta', value: this.sentidoVeta }
            ]
          }

          if (document.getElementsByClassName('tapacantos-check')[1].checked) {
            config.values.push({ name: 'tapacantos', value: { izquierdo: this.selectedElement.izquierdo, derecho: this.selectedElement.derecho, superior: this.selectedElement.superior, inferior: this.selectedElement.inferior } })
          }

          HTTP.post('/api/configuracion', config).then(result => {
            if (result.data.success) {
              this.$noty.success('¡Datos guardados correctamente!')
            }
          }).catch(result => {
            this.$noty.error('¡Error al guardar los datos!')
          })
        }
        document.getElementsByClassName('config-name')[1].value = ''
        document.getElementsByClassName('tapacantos-check')[1].checked = true
        this.$refs.configOptions.style.display = 'none'
      })
    },
    loadElementConfig () {
      let self = this
      HTTP.get('/api/configuracion/tipo/cajon').then(result => {
        self.configuraciones = result.data.configuraciones
        self.$refs.loadConfigModal.show()
      }).catch(result => {
        this.$noty.error('¡Error al cargar datos!')
      })
    },
    configLoad (id) {
      this.$noty.info('Cargando configuración...')
      HTTP.get(`/api/configuracion/${id}`).then((response) => {
        const config = response.data.configuracion.values
        let self = this
        config.forEach((config) => {
          if (config.name === 'tapacantos') {
            const value = config.value
            if (value.derecho) {
              this.$store.commit('setTapacantoById', { key: 'derecho', value: config.value.derecho.id })
            }
            if (value.inferior) {
              this.$store.commit('setTapacantoById', { key: 'inferior', value: config.value.inferior.id })
            }
            if (value.superior) {
              this.$store.commit('setTapacantoById', { key: 'superior', value: config.value.superior.id })
            }
            if (value.izquierdo) {
              this.$store.commit('setTapacantoById', { key: 'izquierdo', value: config.value.izquierdo.id })
            }
          } else {
            self[config.name] = config.value
          }
        })
        this.updateArea()
        this.$refs.loadConfigModal.hide()
        this.$noty.success('¡Configuración cargada con éxito!')
      })
    },
    configDelete (index) {
      const config = this.configuraciones[index]
      let self = this

      this.$swal('No podrá volver a acceder a dicha configuración', {
        title: '¿Seguro de eliminar configuración?',
        icon: 'warning',
        buttons: {
          cancel: 'Cancelar',
          aceptar: {
            text: 'Confirmar',
            value: true
          }
        }
      }).then((value) => {
        if (value === true) {
          self.$noty.info('Eliminando configuración...')
          HTTP.delete(`/api/configuracion/${config.id}`).then((response) => {
            if (response.data.success) {
              self.$noty.success('¡Configuración eliminada con éxito!')
              self.configuraciones.splice(index, 1)
            }
          })
        } else {
          this.close()
        }
      })
    },

    removeCajon () {
      this.$store.commit('removeCajon')
    }
  },
  watch: {
    selectedElement (newValue, oldValue) {
      this.extras = {
        extraAlto: undefined,
        extraAbajo: undefined,
        extraIzquierda: undefined,
        extraDerecha: undefined
      }
    }
  }
}
</script>