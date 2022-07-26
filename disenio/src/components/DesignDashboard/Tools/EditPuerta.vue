<template>    
<div>
    <h4
      class="titulo"
      v-if="!this.isCorrediza"
    >
      Puerta:
    </h4>
    <h4
      class="titulo"
      v-if="this.isCorrediza"
    >
      Puerta Corrediza (grupo):
    </h4>    
    <div v-if="!this.isCustomDoor || this.doorIsCompleted">
      <button @click="saveElementConfig()" type="button" class="btn btn-link btn-sm">Guardar configuracion</button>
      <span>|</span>
      <button @click="loadElementConfig()" type="button" class="btn btn-link btn-sm">Cargar configuracion</button>
    </div>
    <table class="table table-bordered">
        <tr v-if="this.selectedElement.separator && !this.doorIsCompleted && this.currentSide === 1" class="door-step-background">
          <td>{{firstStepText}}</td>
          <td>
            <div
              class="door-option"
              :key="index"
              v-for="(option,index) in stepOneIds"
              @mouseover="setHoveredElement(option)"
              @click="addDoorElement(option)"
            >{{option}}</div>
          </td>
        </tr>
        <tr v-if="this.selectedElement.separator && !this.doorIsCompleted && this.currentSide === 2" class="door-step-background">
          <td>{{secondStepText}}</td>
          <td>
            <div
              class="door-option"
              :key="index"
              v-for="(option,index) in stepTwoIds" 
              @mouseover="setHoveredElement(option)"
              @click="addDoorElement(option)"
            >
              {{option}}
            </div>
          </td>
        </tr>
        <tr v-if="this.selectedElement.separator && !this.doorIsCompleted && this.currentSide === 3" class="door-step-background">
          <td>{{thirdStepText}}</td>
          <td>
            <div
            class="door-option"
            :key="index"
            v-for="(option,index) in stepThreeIds"
            @mouseover="setHoveredElement(option)"
            @click="addDoorElement(option)"
          >
            {{option}}
          </div>
          </td>
        </tr>
        <tr v-if="!this.isCorrediza">
            <td>Tipo:</td>
            <td>
              <select v-model="tipo" class="form-control form-control-sm">
                  <option value="Entera">Entera</option>
                  <option value="Dividida">Dividida</option>
              </select>
            </td>
        </tr>
        <tr v-if="this.isCorrediza">
            <td>Cantidad de puertas:</td>
            <td>
              <input type="number" v-model="cantDoors" class="form-control form-control-sm">
            </td>
        </tr>        
        <tr>
            <td>Material: <br><span  v-if="this.isCorrediza" style="color: grey">(todas las puertas)</span></td>
            <td>
              <select id="material" v-model="material" name="material" class="form-control form-control-sm" @change="onMaterialChange()">
                <option value=""></option>
                <option v-for="material in availableMaterials" :key="material" :value="material">{{ material }}</option>
              </select>
            </td>
        </tr>
          <tr class="material-corrediza" v-for="(n, index) in cantDoors" :key="n">
            <td>Puerta {{ n }}</td>
            <td>
              <select v-model="selectedElement.puerta.puertas[index].material" name="material" class="form-control form-control-sm" @change="onIndividualMaterialChange()">
                <option value=""></option>
                <option v-for="material in availableMaterials" :key="material" :value="material">{{ material }}</option>
              </select>
            </td>
          </tr>
        <tr v-if="this.isCorrediza">
            <td>Kit:</td>
            <td>
              <select id="kit" v-model="kit" name="kit" class="form-control form-control-sm">
                <option value=""></option>
                <option v-for="kit in availableKits" :key="kit" :value="kit">{{ kit }}</option>
              </select>
            </td>
        </tr>
        <tr v-if="this.isCorrediza && this.kit">
          <td style="color:grey">
            <div>descuento ancho: {{this.getKitObj(this.kit).descuento_ancho}}</div>
            <div>descuento alto: {{this.getKitObj(this.kit).descuento_alto}}</div>
          </td>
          <td style="color:grey">
            <div>espesor: {{this.getKitObj(this.kit).espesor}}</div>
          </td>
        </tr>
        <tr>
            <td>Espesor:</td>
            <td>
              <input type="number" v-model="size" class="form-control form-control-sm">
            </td>
        </tr>
        <tr v-if="this.isCorrediza">
            <td>Cruce entre puertas:</td>
            <td>
              <input type="number" v-model="cruceEntrePuertas" class="form-control form-control-sm">
            </td>
        </tr>        
        <tr v-if="!this.isCorrediza">
            <td>Encastre:</td>
            <td>
              <select v-model="encastre" class="form-control form-control-sm">
                  <option value="encastrado">Encastrado</option>
                  <option value="superpuesto">Superpuesto</option>
              </select>
            </td>
        </tr>
        <tr v-if="!this.isCorrediza">
            <td>Ubicacion de Apertura:</td>
            <td>
              <select v-model="aperturaUbicacion" class="form-control form-control-sm">
                <option v-for="ubicacion in ubicaciones" :key="ubicacion" :value="ubicacion">{{ ubicacion }}</option>
              </select>
            </td>
        </tr>
        <tr v-if="!this.isCorrediza">
            <td>Tipo de Bisagra:</td>
            <td>
              <select id="bisagra" v-model="bisagra" name="bisagra" class="form-control form-control-sm">
                <option value=""></option>
                <option v-for="herraje in availableHerrajes" :key="herraje" :value="herraje">{{ herraje }}</option>
              </select>
            </td>
        </tr>    
        <tr v-if="!this.isCorrediza">
            <td>Ubicacion de Bisagra:</td>
            <td>
              <select v-model="bisagraUbicacion" class="form-control form-control-sm">
                <option v-for="ubicacion in ubicacionesBisagra" :key="ubicacion" :value="ubicacion">{{ ubicacion }}</option>
              </select>
            </td>
        </tr>
        <tr v-if="!this.isCorrediza">
            <td colspan="2">
              <button class="btn btn-link btn-sm" @click="editBisagra()">Editar bisagras</button>
            </td>
        </tr>            
        <tr v-if="!this.isCorrediza">
            <td>Orientacion Manija:</td>
            <td>
              <select v-model="orientationManija" class="form-control form-control-sm">
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
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
        <tr v-if="!this.isCorrediza">
            <td>Sistema de Apertura:</td>
            <td>
              <select v-model="aperturaSistema" class="form-control form-control-sm">
                <option v-for="apertura in aperturas" :key="apertura.id" :value="apertura.name">{{ apertura.name }}</option>
              </select>
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
            <td>Visible en 3d</td>
            <td>
              <input type="checkbox" v-model="visibility">
            </td>
        </tr>    
        <tr v-if="this.isCustomDoor">
          <td>Comentario puerta</td>
          <td><input v-model="comentario"></td>
        </tr>
        <tr>
          <td colspan="2">
            <button @click="deleteDoor()">Eliminar Puerta</button>
          </td>
        </tr>    
    </table>

    <table class="table table-bordered" v-if="this.isCorrediza && this.selectedCruceEntrePuertas > -1">
      <tr>
        <td colspan="2"><b>Cruce entre puertas</b></td>
      </tr>
      <tr>
        <td>
          Mover cruce hacia la derecha
        </td>
        <td>
          <input type="number" v-model="right">
        </td>        
      </tr>
      <!-- <tr>
        <td>
          Mover cruce hacia la izquierda
        </td>        
        <td>
          <input type="number" v-model="left">
        </td>
      </tr> -->
    </table>

    <table class="table table-bordered" v-if="this.isCorrediza && this.selectedHojaCorrediza > -1">
      <tr>
        <td colspan="2"><b>Puerta corrediza</b></td>
      </tr>
      <tr>
        <td>Habilitada</td>
        <td>
          <input type="checkbox" v-model="enabled">
        </td>
      </tr>
    </table>

    <EditTapacantosPuerta
      v-if="tapacantos"
    />

    <div style="display:none" ref="configOptions">
      <div>
        <h3>Guardar Configuración</h3>
        <br/>
        <form style="text-align:left">
          <div class="form-group">
            <label for="puerta-name">Nombre de la configuración</label>
            <input type="text" class="form-control puerta-name" id="puerta-name">
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
              <!-- <th class="text-center">Acción</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(config, index) in configuraciones" :key="index">
              <td><a @click="configLoad(index)" class="config-elem config-elem-clickeable">{{ config.name }}</a></td>
              <td><a class="config-elem">{{ config.type }}</a></td>
							<!-- <td><button type="button" class="btn btn-sm btn-danger" @click="configDelete(index)">Eliminar</button></td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </b-modal>  

    <b-modal ref="editBisagraModal" hide-footer title="Editar Bisagras" size="editBisagra">
      <div class="d-block text-center">
        <span class="puerta-measures">Alto: {{puertaHeight}}mm <br> Ancho: {{puertaWidth}}mm</span>
        <div class="diagram-container" :class="selectedElement.puerta.bisagraUbicacion">
          <div class="diagram" v-if="isDividida">
            <div class="puerta-diagram puerta-dividida" :style="{ 'flex-direction': bisagraUbicacion === 'Inferior' || bisagraUbicacion === 'Superior' ? 'row' : 'column'  }">
              <div class="bisagra-container" :style="{'top': bisagraUbicacion === 'Inferior' || bisagraUbicacion === 'Superior' ? '0' : '190px', 'display':  bisagraUbicacion === 'Inferior' || bisagraUbicacion === 'Superior' ? 'flex' : 'block' }">
                <div class="bisagra bisagra-dividida" v-for="(bisagra, index) in cantidadBisagras" :key="index" :style="getBisagraDivididaStyle(index)">
                  <input @change="updateUbicacion(selectedElement)" class="bisagra-position" v-model="selectedElement.puerta.posicionBisagrasIzquierda[index]" type="number" :disabled="relativePosition" :style="{ 'top': (cantidadBisagras > 3) && (index % 2 === 0) && (bisagraUbicacion === 'Superior') ? '10px' : (cantidadBisagras > 3) && (index % 2 === 0) && (bisagraUbicacion === 'Inferior') ? '-20px' : ''}">
                </div>
              </div>
            </div>
          </div>
          <div class="diagram">
            <div class="puerta-diagram" :style="{ 'flex-direction': bisagraUbicacion === 'Inferior' || bisagraUbicacion === 'Superior' ? 'row' : 'column'  }">
              <div class="bisagra-container" :style="{'top': bisagraUbicacion === 'Inferior' || bisagraUbicacion === 'Superior' ? '0' : '190px', 'display':  bisagraUbicacion === 'Inferior' || bisagraUbicacion === 'Superior' ? 'flex' : 'block' }">
                <div class="bisagra bisagra-no-dividida" v-for="(bisagra, index) in cantidadBisagras" :key="index" :style="getBisagraStyle(index)">
                  <input @change="updateUbicacion(selectedElement)" class="bisagra-position" v-model="selectedElement.puerta.posicionBisagrasDerecha[index]" type="number" :disabled="relativePosition" :style="{ 'left': bisagraUbicacion === 'Izquierda/Derecha' ? '15px' : '', 'top': (cantidadBisagras > 3) && (index % 2 === 0) && (bisagraUbicacion === 'Superior') ? '10px' : (cantidadBisagras > 3) && (index % 2 === 0) && (bisagraUbicacion === 'Inferior') ? '-20px' : ''}">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="position-container">
        <label for="lock">Bloquear posicion de bisagras</label>
        <input type="checkbox" id="lock" name="lock" v-model="lockBisagra" :disabled="relativePosition">
        <br/>
        <label for="relative-val" v-if="cantidadBisagras === 2">Posicion relativa a los bordes</label>
        <input type="checkbox" id="relative-val" name="relative-val" v-model="relativePosition" v-if="cantidadBisagras === 2">
        <div v-if="relativePosition">
          Bisagras a <input type="number" v-model="margin" id="margin-input">mm del borde
        </div>
      </div>
      <div>
        <label for="cantidad">Cantidad de Bisagras:</label>
        <select id="cantidad" v-model="cantidadBisagras" @change="cantidadBisagrasChange()" name="cantidad" class="form-control form-control-sm">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
        <br>
        <label for="bisagra">Tipo de Bisagra:</label>
        <select id="bisagra" v-model="bisagra" name="bisagra" class="form-control form-control-sm">
          <option value=""></option>
          <option v-for="herraje in availableHerrajes" :key="herraje" :value="herraje">{{ herraje }}</option>
        </select>
        <br>
        <label for="ubicacion">Ubicacion de Bisagra:</label>
        <select id="ubicacion" name="ubicacion" v-model="bisagraUbicacion" class="form-control form-control-sm">
          <option v-for="ubicacion in ubicacionesBisagra" :key="ubicacion" :value="ubicacion">{{ ubicacion }}</option>
        </select>
      </div>
    </b-modal>  
</div>
</template>

<script>
import { AperturaSistema } from './models/enums'
import { HTTP } from '@/plugins/HTTP.js'

import EditTapacantosPuerta from './EditTapacantosPuerta'

export default {
  data () {
    return {
      customDoor: {},
      currentSide: 1,
      configuraciones: [],
      extras: {
        extraAlto: undefined,
        extraAbajo: undefined,
        extraIzquierda: undefined,
        extraDerecha: undefined
      }
    }
  },
  components:{
    EditTapacantosPuerta,
  },
  methods: {
    updateUbicacion (element) {
      this.$store.commit('setPosicionBisagras', element)
    },
    cantidadBisagrasChange () {
      this.cantidadBisagras = +this.cantidadBisagras
      if (this.cantidadBisagras !== 2) {
        this.relativePosition = false
      }
      this.$store.commit('updatePosicionBisagras')
    },
    getBisagraDivididaStyle (index) {
      let styles = {}
      const puerta = this.selectedElement.puerta
      const diagramSize = 198
      const bisagraHeight = 10
      const heightPercent = (((puerta.posicionBisagrasIzquierda[index] * 100) / this.puertaHeight) / 100)
      if (this.bisagraUbicacion === 'Izquierda/Derecha') {
        styles['bottom'] = (diagramSize * heightPercent) + (bisagraHeight * index) + 'px'
        styles['right'] = '6px'
        return styles
      } else {
        return this.getBisagraStyle(index, true)
      }
    },
    getBisagraStyle (index, izquierda = false) {
      let styles = {}
      const diagramSize = 200
      const bisagraHeight = 10
      const puerta = this.selectedElement.puerta
      const posicion = izquierda ? puerta.posicionBisagrasIzquierda[index] : puerta.posicionBisagrasDerecha[index]
      const heightPercent = (((posicion * 100) / this.puertaHeight) / 100)
      const widthPercent = (((posicion * 100) / this.puertaWidth) / 100)
      if (this.bisagraUbicacion === 'Derecha') {
        styles['bottom'] = (diagramSize * heightPercent) + (bisagraHeight * index) + 'px'
        styles['left'] = '193px'
      }
      if (this.bisagraUbicacion === 'Inferior') {
        styles['left'] = (diagramSize * widthPercent) - (bisagraHeight * index)
        if (index + 1 === this.cantidadBisagras) {
          styles['left'] += 11
        }
        styles['left'] += 'px'
        styles['top'] = '193px'
        styles['display'] = 'inline-block'
      }
      if (this.bisagraUbicacion === 'Superior') {
        styles['left'] = (diagramSize * widthPercent) - (bisagraHeight * index)
        if (index + 1 === this.cantidadBisagras) {
          styles['left'] += 11
        }
        styles['left'] += 'px'
        styles['top'] = '-6px'
        styles['display'] = 'inline-block'
      }
      if (this.bisagraUbicacion === 'Izquierda' || (this.isDividida && this.bisagraUbicacion === 'Izquierda/Derecha')) {
        styles['bottom'] = (diagramSize * heightPercent) + (bisagraHeight * (1 + index)) + 'px'
        styles['left'] = '193px'
      }
      if (!this.isDividida && this.bisagraUbicacion === 'Izquierda/Derecha') {
        styles.display = 'none'
      }
      return styles
    },
    editBisagra () {
      if (this.relativePosition) {
        this.$store.commit('updatePosicionBisagras')
      }
      this.$refs.editBisagraModal.show()
    },
    onIndividualMaterialChange () {
      this.$store.commit('setPuertaProperty', { key: 'puertas', value: this.selectedElement.puerta.puertas })
    },
    onMaterialChange () {
      if (this.selectedElement.puerta.corrediza) {
        for (var i = 0; i < this.cantDoors; i++) {
          this.selectedElement.puerta.puertas[i].material = this.material
        }
      }
    },
    getKitObj (kitName) {
      return this.$store.getters.getMetalesAdd.find(k => k.material === kitName)
    },
    updateArea () {
      this.$store.commit('setPuertaProperty', { key: 'extraAlto', value: this.extras.extraAlto === undefined ? this.extraAlto : this.extras.extraAlto })
      this.$store.commit('setPuertaProperty', { key: 'extraAbajo', value: this.extras.extraAbajo === undefined ? this.extraAbajo : this.extras.extraAbajo })
      this.$store.commit('setPuertaProperty', { key: 'extraDerecha', value: this.extras.extraDerecha === undefined ? this.extraDerecha : this.extras.extraDerecha })
      this.$store.commit('setPuertaProperty', { key: 'extraIzquierda', value: this.extras.extraIzquierda === undefined ? this.extraIzquierda : this.extras.extraIzquierda })
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
        const name = document.getElementsByClassName('puerta-name')[1].value
        if (result === 1 && name) {
          const config = {
            name,
            type: 'Puerta',
            values: [
              { name: 'tipo', value: this.tipo },
              { name: 'material', value: this.material },
              { name: 'size', value: this.size },
              { name: 'encastre', value: this.encastre },
              { name: 'aperturaUbicacion', value: this.aperturaUbicacion },
              { name: 'bisagraUbicacion', value: this.bisagraUbicacion },
              { name: 'bisagra', value: this.bisagra },
              { name: 'cantidadBisagras', value: this.cantidadBisagras },
              { name: 'orientationManija', value: this.orientationManija },
              { name: 'sentidoVeta', value: this.sentidoVeta },
              { name: 'extraAlto', value: this.extraAlto },
              { name: 'extraDerecha', value: this.extraDerecha },
              { name: 'extraIzquierda', value: this.extraIzquierda },
              { name: 'extraAbajo', value: this.extraAbajo },
              { name: 'comentario', value: this.comentario },
              { name: 'posicionBisagrasDerecha', value: this.selectedElement.puerta.posicionBisagrasDerecha },
              { name: 'posicionBisagrasIzquierda', value: this.selectedElement.puerta.posicionBisagrasIzquierda }
            ]
          }

          if (this.isCorrediza) {
            config.values.push({ name: 'cantDoors', value: this.cantDoors })
            config.values.push({ name: 'cruceEntrePuertas', value: this.cruceEntrePuertas })
          }

          if (document.getElementsByClassName('tapacantos-check')[1].checked) {
            config.values.push({ name: 'tapacantos', value: this.tapacantos })
          }

          if (this.aperturaSistema) {
            config.values.push({ name: 'aperturaSistema', value: this.aperturaSistema })
          }

          HTTP.post('/api/configuracion', config).then(result => {
            if (result.data.success) {
              this.$noty.success('¡Datos guardados correctamente!')
            }
          }).catch(result => {
            this.$noty.error('¡Error al guardar los datos!')
          })
        }
        document.getElementsByClassName('puerta-name')[1].value = ''
        document.getElementsByClassName('tapacantos-check')[1].checked = true
        this.$refs.configOptions.style.display = 'none'
      })
    },
    loadElementConfig () {
      let self = this
      HTTP.get('/api/configuracion/tipo/puerta').then(result => {
        self.configuraciones = result.data.configuraciones
        self.$refs.loadConfigModal.show()
      }).catch(result => {
        this.$noty.error('¡Error al cargar datos!')
      })
    },
    configLoad (index) {
      this.$noty.info('Cargando configuración...')
      HTTP.get(`/api/configuracion/${this.configuraciones[index].id}`).then((response) => {
        const config = response.data.configuracion.values
        let self = this
        const ubicacionBisagras = {}
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
          } else if (config.name === 'posicionBisagrasDerecha' || config.name === 'posicionBisagrasIzquierda') {
            ubicacionBisagras[config.name] = config.value
          } else {
            self[config.name] = config.value
          }
        })
        this.$noty.success('¡Configuración cargada con éxito!')
        this.updateArea()
        if (ubicacionBisagras['posicionBisagrasDerecha']) {
          this.selectedElement.puerta['posicionBisagrasDerecha'] = ubicacionBisagras['posicionBisagrasDerecha']
        }

        if (ubicacionBisagras['posicionBisagrasIzquierda']) {
          this.selectedElement.puerta['posicionBisagrasIzquierda'] = ubicacionBisagras['posicionBisagrasIzquierda']
        }
        this.updateUbicacion(this.selectedElement)
      })

      this.$refs.loadConfigModal.hide()
    },
    deshacerSolapar () {
      const puertaSides = Object.values(this.selectedElement.puerta.sides)
      if (this.kit) {
        // se deshace el solape que se hizo con el kit anterior
        puertaSides.forEach((sideId) => {
          this.$store.commit('aplicarSolapar', [ sideId, this.kit.espesor, 'frente', 'recortar' ])
        })
      }
    },
    deleteDoor () {
      this.deshacerSolapar()
      this.$store.commit('deleteDoor')
    },
    setHoveredElement (id) {
      this.$store.commit('setHoveredElement', { elementId: id })
    },
    addDoorElement (id) {
      this.setHoveredElement(null)
      this.customDoor[`side${this.currentSide}`] = id
      this.currentSide++
      if (this.currentSide === 4) {
        this.customDoor['side4'] = this.selectedElement.id
        this.$store.commit('addPuertaCustom', { doorSides: this.customDoor, corrediza: this.isCorrediza })
      }
    }
  },
  computed: {
    puertaHeight () {
      return this.$store.getters.getPuertaHeight(this.selectedElement.id)
    },
    puertaWidth () {
      return this.$store.getters.getPuertaWidth(this.selectedElement.id)
    },
    isDividida () {
      return this.selectedElement.puerta.tipo === 'Dividida'
    },
    isCorrediza () {
      return this.selectedElement.puerta.corrediza
    },
    relativePosition: {
      get () {
        return this.$store.state.layout.relativePosition
      },
      set (value) {
        this.$store.commit('setLayoutProperty', { key: 'relativePosition', value })
        this.$store.commit('updatePosicionBisagras')
        if (value) {
          this.lockBisagra = false
        }
      }
    },
    lockBisagra: {
      get () {
        return this.$store.state.layout.lockBisagra
      },
      set (value) {
        this.$store.commit('setLayoutProperty', { key: 'lockBisagra', value })
      }
    },
    margin: {
      get () {
        return this.$store.state.layout.margin
      },
      set (value) {
        this.$store.commit('setLayoutProperty', { key: 'margin', value })
        this.$store.commit('updatePosicionBisagras')
      }
    },
    visibility: {
      get () {
        return this.selectedElement.puerta.visible
      },
      set (value) {
        this.$store.commit('setDoorVisibility', value)
      }
    },
    comentario: {
      get () {
        if (this.isCustomDoor) {
          return this.selectedElement.puerta.comentario
        }
        return this.selectedElement.comentario
      },
      set (value) {
        this.$store.commit('setComentario', {value, isCustomDoor: this.isCustomDoor})
      }
    },
    enabled: {
      get () {
        if (this.selectedElement.puerta && this.selectedElement.puerta.puertas && this.selectedHojaCorrediza > -1) {
          return this.selectedElement.puerta.puertas[this.selectedHojaCorrediza].enabled
        }
        return null
      },
      set (value) {
        this.selectedElement.puerta.puertas[this.selectedHojaCorrediza].enabled = value
        this.$store.commit('updatePuertasCorredizas', { puertas: this.selectedElement.puerta.puertas })
      }
    },
    right: {
      get () {
        if (this.selectedElement.puerta && this.selectedElement.puerta.puertas && this.selectedCruceEntrePuertas > -1) {
          return this.selectedElement.puerta.puertas[this.selectedCruceEntrePuertas - 1].cruceEntrePuertasADerecha
        }
        return null
      },
      set (value) {
        const cruce = +value
        this.selectedElement.puerta.puertas[this.selectedCruceEntrePuertas - 1].extraWidth += cruce - this.selectedElement.puerta.puertas[this.selectedCruceEntrePuertas - 1].cruceEntrePuertasADerecha
        this.selectedElement.puerta.puertas[this.selectedCruceEntrePuertas].extraWidth -= cruce - this.selectedElement.puerta.puertas[this.selectedCruceEntrePuertas - 1].cruceEntrePuertasADerecha
        this.selectedElement.puerta.puertas[this.selectedCruceEntrePuertas - 1].cruceEntrePuertasADerecha = cruce
        this.$store.commit('updatePuertasCorredizas', { puertas: this.selectedElement.puerta.puertas })
      }
    },
    isCustomDoor () {
      return this.selectedElement.puerta && this.selectedElement.puerta.sides.length !== 0
    },
    doorIsCompleted () {
      if (this.isCustomDoor) {
        const customDoor = this.selectedElement.puerta.sides
        return customDoor.side1 && customDoor.side2 && customDoor.side3 && customDoor.side4
      }
      return false
    },
    firstStepText () {
      return this.isHorizontal ? '1er Lado' : '1era Parte inferior/superior'
    },
    secondStepText () {
      return this.isHorizontal ? '2do Lado' : '2da Parte inferior/superior'
    },
    thirdStepText () {
      return !this.isHorizontal ? 'Lado' : 'Parte inferior/superior'
    },
    stepOneIds () {
      const ids = []
      // HOTFIX: mostrar conexiones con espesor 0 no virtuales
      console.log(this.$store.getters.getPiecesThatConnectWithGivenElementId(this.selectedElement.id))
      // fin HOTFIX
      // this.selectedElement.conexionesAfter.forEach(conexion => {
      //   if (!conexion.separator.virtual && !conexion.separator.separadorCajon && !conexion.separator.cajon) {
      //     ids.push(conexion.separator.id)
      //   }
      // })

      // this.selectedElement.conexionesBefore.forEach(conexion => {
      //   if (!conexion.separator.virtual && !conexion.separator.separadorCajon && !conexion.separator.cajon) {
      //     ids.push(conexion.separator.id)
      //   }
      // })

      return ids.concat(this.piecesConnecting)
    },
    stepTwoIds () {
      this.stepOneIds.splice(this.stepOneIds.indexOf(this.customDoor['side1']), 1)
      return this.stepOneIds
    },
    stepThreeIds () {
      let result = this.$store.getters.getElementConnectingPiecesInCommon(this.customDoor['side1'], this.customDoor['side2']).map(connection => connection.separator.id || connection.id)
      return result.filter(id => id !== this.selectedElement.id)
    },
    isHorizontal () {
      return this.$store.getters.getElement(this.selectedElement.parent).layout === 'horizontal'
    },
    piecesConnecting () {
      return this.$store.getters.getPiecesThatConnectWithGivenElementId(this.selectedElement.id).map(piece => piece.id)
    },
    colors () {
      return this.$store.getters.colors
    },
    selectedElement () {
      return this.$store.getters.selectedElement
    },
    aperturas () {
      let herrajes = this.$store.getters.herrajes.map((herraje) => {
        return { name: herraje.material + ' ' + herraje.nombre, id: herraje.id }
      })
      const idMultiplier = this.$store.state.layout.ambienteEnabled ? this.$store.state.layout.idMultiplier.roomEditor : this.$store.state.layout.idMultiplier.modulo
      let result = [AperturaSistema.Angulo, AperturaSistema.Espacio25, AperturaSistema.Perfil35].map((apertura, index) => {
        return {name: apertura, id: index * idMultiplier}
      })
      herrajes.push(...result)
      herrajes.unshift({name: AperturaSistema.NoDefinido, id: -1})
      return herrajes
    },
    ubicaciones () {
      return this.$store.getters.ubicaciones
    },
    ubicacionesBisagra () {
      return this.$store.getters.ubicacionesBisagra
    },
    tapacantos: {
      get () {
        return this.selectedElement.puerta.tapacantos
      },
      set (value) {
        this.selectedElement.puerta.tapacantos = value
      }
    },
    cruceEntrePuertas: {
      get () {
        return this.selectedElement.puerta.cruceEntrePuertas
      },
      set (value) {
        this.$store.commit('setPuertaProperty', { key: 'cruceEntrePuertas', value: value })
      }
    },
    cantDoors: {
      get () {
        return this.selectedElement.puerta.puertas && this.selectedElement.puerta.puertas.length
      },
      set (value) {
        if (value > 0) {
          this.$store.commit('setPuertaProperty', { key: 'cantPuertas', value: value })
        }
      }
    },
    tipo: {
      get () {
        return this.selectedElement.puerta.tipo
      },
      set (value) {
        this.$store.commit('setPuertaProperty', { key: 'tipo', value: value })
      }
    },
    kit: {
      get () {
        return this.selectedElement.puerta.kit && this.selectedElement.puerta.kit.material
      },
      set (value) {
        this.deshacerSolapar()
        const kit = this.getKitObj(value)
        const puertaSides = Object.values(this.selectedElement.puerta.sides)
        if (kit) {
          puertaSides.forEach((sideId) => {
            // se aplica el nuevo solape
            this.$store.commit('aplicarSolapar', [ sideId, kit.espesor, 'frente', 'solapar' ])
          })
        }
        // se setean los tapacantos por default
        this.$store.commit('setTapacantoPuerta', { key: 'derecho', value: {nombre: value} })
        this.$store.commit('setTapacantoPuerta', { key: 'izquierdo', value: {nombre: value} })
        // se guarda el kit nuevo
        this.$store.commit('setPuertaKit', kit)
      }
    },
    size: {
      get () {
        return this.selectedElement.puerta.size
      },
      set (value) {
        this.$store.commit('setPuertaProperty', { key: 'size', value: Number(value) })
      }
    },
    encastre: {
      get () {
        return this.selectedElement.puerta.encastre
      },
      set (value) {
        this.$store.commit('setPuertaProperty', { key: 'encastre', value: value })
      }
    },
    aperturaUbicacion: {
      get () {
        return this.selectedElement.puerta.aperturaUbicacion
      },
      set (value) {
        this.$store.commit('setPuertaProperty', { key: 'aperturaUbicacion', value: value })
      }
    },
    bisagraUbicacion: {
      get () {
        return this.selectedElement.puerta.bisagraUbicacion
      },
      set (value) {
        this.$store.commit('setPuertaProperty', { key: 'bisagraUbicacion', value: value })
      }
    },
    cantidadBisagras: {
      get () {
        return this.selectedElement.puerta.cantidadBisagras
      },
      set (value) {
        this.$store.commit('setPuertaProperty', { key: 'cantidadBisagras', value: value })
      }
    },
    orientationManija: {
      get () {
        return this.selectedElement.puerta.orientationManija
      },
      set (value) {
        this.$store.commit('setPuertaProperty', { key: 'orientationManija', value: value })
      }
    },
    sentidoVeta: {
      get () {
        return this.selectedElement.puerta.sentidoVeta
      },
      set (value) {
        this.$store.commit('setPuertaProperty', { key: 'sentidoVeta', value: value })
      }
    },
    aperturaSistema: {
      get () {
        return this.selectedElement.puerta.aperturaSistema
      },
      set (value) {
        this.$store.commit('setPuertaProperty', { key: 'aperturaSistema', value: value })
      }
    },
    availableMaterials () {
      let materiales = []
      if (this.$store.state.general.materiales_add) {
        materiales = JSON.parse(this.$store.state.general.materiales_add).map(m => m.material)
      }
      if (typeof this.material !== 'string') {
        this.material = JSON.parse(this.$store.state.general.material_default)
      }
      return materiales
    },
    availableHerrajes () {
      let herrajes = []
      if (this.$store.state.general.herrajes_add) {
        herrajes = JSON.parse(this.$store.state.general.herrajes_add).map(m => m.nombre)
      }
      return herrajes
    },
    selectedHojaCorrediza: {
      get () {
        return this.$store.getters.hojaCorredizaSelected
      }
    },
    selectedCruceEntrePuertas: {
      get () {
        return this.$store.getters.cruceEntrePuertasSelected
      }
    },
    availableKits () {
      let kits = []
      if (this.$store.getters.getMetalesAdd) {
        kits = (this.$store.getters.getMetalesAdd).map(m => m.material)
      }
      return kits
    },
    material: {
      get () {
        return this.selectedElement.puerta.material
      },
      set (value) {
        this.$store.commit('setPuertaMaterial', value)
      }
    },
    bisagra: {
      get () {
        return this.selectedElement.puerta.bisagraTipo
      },
      set (value) {
        this.$store.commit('setPuertaBisagra', value)
      }
    },
    extraAlto: {
      get () {
        return this.selectedElement.puerta.extraAlto
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
        return this.selectedElement.puerta.extraDerecha
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
        return this.selectedElement.puerta.extraAbajo
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
        return this.selectedElement.puerta.extraIzquierda
      },
      set (value) {
        const number = Number(value)
        if (!isNaN(number)) {
          this.extras.extraIzquierda = number
        }
      }
    }
  },
  watch: {
    availableMaterials: function (newValue, oldValue) {
      if (typeof this.material !== 'string') {
        this.material = JSON.parse(this.$store.state.general.material_default)
      }
      return newValue
    },
    availableHerrajes: function (newValue, oldValue) {
      if (typeof this.herraje !== 'string') {
        this.herraje = JSON.parse(this.$store.state.general.herraje_default)
      }
      return newValue
    },
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

<style scoped>
.door-option:hover {
  cursor: pointer;
  background-color: #7b427b75;
}
.door-step-background {
  background-color: #efc5c5;
}
.config-elem {
  font-size: 16px;
  color: black !important;
}
.config-elem-clickeable {
  cursor: pointer;
  color: #007bff !important;
}
.diagram-container {
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
}
.diagram {
  display: inline-block;
  margin: 30px 15px;
}
.puerta-diagram {
  width: 200px;
  height: 200px;
  border: 1px solid black;
  margin: 0 auto;
  display: block;
}
.puerta-diagram > div {
  display: flex;
}
.bisagra {
  width: 10px;
  height: 10px;
  background-color: #8BC34A;
  position: relative;
}
.bisagra-position {
  position: relative;
  right: 50px;
  bottom: 3px;
  height: 18px;
  display: inline-block;
  width: 50px;
  border: none;
  border-bottom: 1px dotted;
  text-align: right;
}
.bisagra-container {
  position: relative;
  top: 190px;
}
.puerta-measures {
  position: relative;
  display: flex;
  text-align: left;
}
.Inferior input {
  top: 10px;
  right: 10px;
}
.Superior input {
  bottom: 21px;
  right: 13px;
}
.Izquierda .bisagra-dividida input {
  left: 15px;
}
.Derecha .bisagra-dividida input {
  left: 15px;
}
.bisagra-dividida input {
  color: green;
}
.bisagra-no-dividida {
  background-color: #2196f3
}
.bisagra-no-dividida input {
  color: blue;
}
.flex {
  display: flex;
}
.position-container {
  text-align: left;
}
#relative-val, #lock {
  position: relative;
  top: 2px;
  cursor: pointer;
}
#margin-input {
  width: 45px;
}

.modal-editBisagra {
   width: 650px;
 }
</style>