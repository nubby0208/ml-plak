<template>
  <div id="roomEditorIndex" v-shortkey="{ctrl: ['ctrl', ','], alt: ['alt', ',']}" @shortkey="changeSelectedPiece(false)" >
    <div class="row right-bar">

      <div class="col-md-8" id="view-panel">
        <b-row align-v="start" align-h="between" class="text-left main-options w-100">
          <b-col cols="4" class="px-2">
            <label class="main-options__field ">
              Modulo
              <button @click="openAddModuleModal()" class="btn btn-sm btn-primary">+</button>
              <select v-model="selectedModuleId" class="form-control form-control-sm" @change="onModuloChange()">
                <option v-for="n in moduleCount" :key="n" :value="n">{{ n }}</option>
              </select>
            </label>
            
            <label class="main-options__field ">
              Descripción:
              <input v-model="description" class="input">
            </label>
            
            

            <label class="main-options__field ">
              Comentario:
              <input v-model="comentario" class="input">
            </label>
            
            

            <label class="main-options__field ">
              Espesor en 3d
              <input type="number" class="roomEditorEspesor" v-model="roomEditorEspesor">
            </label>

            

          </b-col>
          <b-col cols="8" class="px-2">
            <b-row>
              <b-col cols="6" class="px-2 checkbox-adicionales" >
              
                <label for="mostrar-puertas-doble-fondo">
                  <input type="checkbox" v-model="showPuertaDoblefondo" id="mostrar-puertas-doble-fondo" name="mostrar-puertas-doble-fondo">
                  Mostrar Superficies
                </label>

                
                <label for="mostrar-medidas">
                  <input type="checkbox" v-model="showDimensions" name="mostrar-medidas" id="mostrar-medidas">
                  Mostrar Medidas
                </label>


              </b-col>
              <b-col cols="6" class="px-2">
                <div class="layers">
                  <h6>Capas</h6>
                  <div class="layer-panel">
                    <div>
                      <ul class="layer-list">
                        <li v-for="(layer, index) in layers" :key="index">
                          <input type="checkbox" :id="layer.name" v-model="layer.visible"  @change="toggleLayer(layer, index)">
                          <label class="layer-label" :for="layer.name" :class="{'layer-selected': showingLayerInfo === index}">{{layer.name}}</label>
                          <span v-if="showingLayerInfo !== index" class="layer-chevron" @click="filterLayer(index)">&#8250;</span>
                          <span v-else class="layer-chevron layer-selected" @click="filterLayer(index)">&#8249;</span>
                        </li>
                      </ul>
                    </div>
                    <div class="layer-info" v-if="showingLayerInfo > -1">
                      <div v-if="layerElements.length === 0">Esta capa no posee elementos</div>
                      <div v-for="(elem, index) in layerElements" :key="index" class="layer-element">{{elem.id}} - {{elem.name}}</div>
                    </div>
                  </div>
                </div>  
              </b-col>
              <b-col>
                <button @click="addCustomPart" class="btn btn-sm">Piezas Manuales</button>
                <button @click="cambiarEjes" class="btn btn-sm">Mover Ejes</button>
                <button @click="convertirEnPlanta" class="btn btn-primary btn-sm">Convertir en planta</button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <div
          @click="tester = !tester"
        >
          {{ !tester ? 'Abre' : 'Cierra'}} plano
        </div>
        <div
        >
          <ModElement
            v-if="mounted && isAmbienteSelected"
            ref="module"
            class="diagram"
            :id="(selectedModuleId * idMultiplier)" 
          />
        </div>


        <br>
        <br>

      </div>

      <div id="edit-panel" class="col-md-4">
        <div class="bordered-container">
          <div class="flex">
            <div class="container-title not-printable"  @click="toggle3DViewer = !toggle3DViewer">
              <span class="container-toggler more" v-if="toggle3DViewer">▲</span>
              <span class="container-toggler less" v-else>▼</span>
              Mini Visor
            </div>
          </div>
          <div
            :class="`bordered-section ${toggle3DViewer ? '' : 'uncollapsed' }`"
          >
            <div
              v-if="toggle3DViewer"
              style="height: 13rem"
            >
              <Viewer3D
                :zoom="3.5"
                showPieces="room"
              />
            </div> 
          </div>
        </div>
        <div class="edit-module">
          <EditModule />

          <div v-if="selectedElement" class="control-components not-printable">
            <EditGeneral
              :selected="selectedElement.id"
              :comentario="selectedElement.comentario"
            />      

            <EditBandeja
              v-if="selectedElement.bandeja"
            />

            <EditCube
              v-if="isAmbienteSelected && (selectedElement.cube || !isElementLayerVisible)"
            />

            <EditPuerta
              v-if="selectedElement.puerta"
            />

            <EditSeparator
              v-if="isAmbienteSelected && selectedElement.separator && isElementLayerVisible"
            />

            <EditDobleFondo
              v-if="selectedElement.dobleFondo"
            />

            <EditSolapar
              v-if="!selectedElement.cajon"
            />
            
            <EditCajon
              v-if="selectedElement.cajon && isElementLayerVisible"
            />
          </div>
        </div>
      </div>
    </div>

    <div id="modal-list-load" style="display: none">
      <fieldset>
        <table class="table table-bordered" style="width: 100% !important;">
          <thead class="thead-light">
            <tr>
              <th class="text-center">#</th>
              <th class="text-center">Nombre</th>
              <th class="text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(proyecto, index) in proyectos" :key="index">
              <td>{{ index + 1  }}</td>
              <td><a href="#" @click="proyectoLoad(index)">{{ proyecto.nombre }}</a></td>
              <td><button type="button" class="btn btn-sm btn-danger" @click="proyectoDelete(index)">Eliminar</button></td>
            </tr>
          </tbody>
        </table>
      </fieldset>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import 'vuejs-noty/dist/vuejs-noty.css'
import { HTTP } from '@/plugins/HTTP.js'
import swal from 'sweetalert2'
import VueNoty from 'vuejs-noty'
import BootstrapVue from 'bootstrap-vue'

import EditCustomPart from '../../Tools/EditCustomPart.vue'
import EditModuloExterno from '../../Tools/EditModuloExterno.vue'
import MoverEjes from '../../Tools/MoverEjes.vue'

import Viewer3D from '../3D/Viewer'
import ModElement from '../../Tools/ModElement'
import EditModule from '../../Tools/EditModule'
import EditGeneral from '../../Tools/EditGeneral'
import EditBandeja from '../../Tools/EditBandeja'
import EditCube from '../../Tools/EditCube'
import EditPuerta from '../../Tools/EditPuerta'
import EditSeparator from '../../Tools/EditSeparator'
import EditDobleFondo from '../../Tools/EditDobleFondo'
import EditSolapar from '../../Tools/EditSolapar'
import EditCajon from '../../Tools/EditCajon'

Vue.use(VueNoty, {
  theme: 'metroui'
})

Vue.use(BootstrapVue)

export default {
  data () {
    return {
      toggle3DViewer: true,
      tester: false,
      timer: null,
      isTrue: true,
      isFalse: false,
      projectName: null,
      projectData: null,
      proyectos: [],
      proyectosFiltered: [],
      filterQuery: '',
      showingLayerInfo: -1,
      layerElements: [],
      strictSearch: false,
      pagOptions: {
        total: 15,
        active: 0,
        sections: 0
      },
      sortBy: 'created_at',
      sortDesc: true,
      hotKeyModPressed: -1,
      fields: [
        {key: 'index', label: '#'},
        {key: 'nombre', sortable: true},
        {key: 'created_at', label: 'Creado', sortable: true},
        'opcion'
      ]
    }
  },
  components:{
    ModElement,
    EditModule,
    EditGeneral,
    EditBandeja,
    EditCube,
    EditPuerta,
    EditSeparator,
    EditDobleFondo,
    EditSolapar,
    EditCajon,
    Viewer3D,
  },
  created: function () {
    this.setAmbienteEnabled(true)
  },
  beforeDestroy: function () {
    this.setAmbienteEnabled(false)
  },
  computed: {
    layers: {
      get () {
        return this.$store.getters.selectedModule.layers
      }
    },
    idMultiplier () {
      return this.$store.state.layout.idMultiplier.roomEditor
    },
    loadedProjectName () {
      return localStorage.getItem('projectName') || undefined
    },
    loadedProjectInfo () {
      return 'Proyecto: ' + localStorage.getItem('projectName') + '\nCliente: ' + this.$store.state.info.name + '\nMueble: ' + this.$store.state.info.mueble + '\nCreado: ' + localStorage.getItem('projectCreatedAt')
    },
    selectedModule () {
      return this.$store.getters.selectedModule
    },
    mounted () {
      return this.selectedModule.elements.length > 0
    },
    moduleCount: {
      get () {
        return this.$store.getters.moduleCount
      },
      set (value) {
        this.$store.commit('setModuleCount', Number(value))
      }
    },
    moduleSettings () {
      return this.$store.getters.selectedModule.settings
    },
    description: {
      get () {
        return this.moduleSettings.description
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'description', value: value })
      }
    },
    comentario: {
      get () {
        return this.moduleSettings.comentario
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'comentario', value: value })
      }
    },
    armado: {
      get () {
        return this.moduleSettings.armado
      },
      set (value) {
        this.$store.commit('setModuleSetting', { key: 'armado', value: value })
      }
    },
    selectedModuleId: {
      get () {
        return this.$store.getters.selectedModuleId + 1
      },
      set (value) {
        this.$store.commit('selectModule', Number(value - 1))
      }
    },
    showPuertaDoblefondo: {
      get () {
        return this.$store.state.layout.showPuertaDoblefondo
      },
      set (value) {
        this.$store.commit('setShowPuertaDoblefondo', value)
      }
    },
    roomEditorLineWidth: {
      get () {
        return this.$store.state.layout.roomEditorLineWidth
      },
      set (value) {
        this.timedUpdate(() => this.$store.commit('setRoomEditorLineWidth', Number(value)))
      }
    },
    roomEditorEspesor: {
      get () {
        return this.$store.state.layout.roomEditorEspesor
      },
      set (value) {
        this.timedUpdate(() => {
          this.$store.commit('setRoomEditorEspesor', Number(value))
        })
      }
    },
    showDimensions: {
      get () {
        return this.$store.state.layout.showDimensions
      },
      set (value) {
        this.$store.commit('setShowDimensions', value)
      }
    },
    width: {
      get () {
        return this.selectedModule.width
      },
      set (value) {
        this.$store.commit('setModuleWidth', Number(value))
      }
    },
    height: {
      get () {
        return this.selectedModule.height
      },
      set (value) {
        this.$store.commit('setModuleHeight', Number(value))
      }
    },
    selectedElement () {
      return this.$store.getters.selectedElement
    },
    isElementLayerVisible () {
      const element = this.selectedElement
      if (element.layerId != null && element.layerId > -1) {
        return this.$store.getters.selectedModule.layers[element.layerId].visible
      }

      return true
    },
    isAmbienteSelected () {
      return this.$store.state.layout.ambienteEnabled
    }
  },
  methods: {
    setAmbienteEnabled(value){
      this.$store.state.layout.ambienteEnabled = value
    },
    setErrorsIn3d (errors) {
      this.$store.commit('setErrorsIn3d', errors)
    },
    timedUpdate (callback) {
      clearTimeout(this.timer)
      this.timer = setTimeout(callback, 250)
    },
    openAddModuleModal () {
      swal({
        title: 'Agregar Módulos',
        input: 'number'
      }).then((result) => {
        if (result.value && +result.value) {
          const newCount = +result.value + this.moduleCount
          if (newCount > 30) {
            this.$noty.error('La cantidad máxima de módulos es 30')
            return
          }

          if (newCount < 1) {
            this.$noty.error('Debe agregar al menos 1 módulo')
            return
          }

          this.$store.commit('setModuleCount', newCount)
        }
      })
    },
    changeSelectedPiece (up) {
      this.$store.commit('changeSelection', up)
    },
    setFocus (ref) {
      this.$refs[ref].focus()
    },
    goToMod (n) {
      if (n > this.moduleCount) {
        this.hotKeyModPressed = n
        this.$refs.moduleCreationModal.show()
      } else {
        this.selectedModuleId = n
      }
    },
    closeModuleCreationModal () {
      this.hotKeyModPressed = -1
      this.$refs.moduleCreationModal.hide()
    },
    addModules () {
      this.moduleCount = this.hotKeyModPressed
      this.closeModuleCreationModal()
      this.goToMod(this.moduleCount)
    },
    hasPuertaCorrediza () {
      return this.selectedElement && this.selectedElement.puerta && this.selectedElement.puerta.elementType === 'puerta-corrediza'
    },
    toggleLayer (layer, layerId) {
      this.$store.commit('toggleLayer', { layerId: layerId, value: layer.visible })
    },
    filterLayer (layerId) {
      if (layerId === this.showingLayerInfo) {
        this.showingLayerInfo = -1
        this.layerElements = []
        return
      }
      this.showingLayerInfo = layerId
      let result = this.$store.getters.getElementsInLayer(layerId)
      this.layerElements = result.map(e => ({id: e.id, name: e.name}))
    },
    onModuloChange () {
      console.log('onModuloChange:', this.selectedModuleId)
      this.showingLayerInfo = -1
    },
    async save (cb) {
      let result = await swal({
        title: 'Guardar como',
        input: 'text',
        inputPlaceholder: 'Nombre del proyecto'
      })

      if (result.value) {
        this.$noty.info('Guardando proyecto...')
        // this.projectName = result.value + '.json'
        // this.projectData = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(localStorage.vuex))
        HTTP.post('/api/proyecto-json', {
          nombre: result.value,
          proyecto: JSON.stringify(localStorage.vuex)
        }).then(result => {
          if (result.data.success === true) {
            this.$noty.success('¡Proyecto guardado con éxito!')
            if (cb && typeof cb === 'function') {
              cb()
            }
          }
        }).catch(result => {
          this.$noty.error('Oops, ha ocurrido un problema')
        })
      }
    },
    filtrar () {
      if (!this.filterQuery) {
        this.proyectosFiltered = this.proyectos
      }
      this.proyectosFiltered = []
      if (this.strictSearch) {
        this.proyectosFiltered = this.proyectosFiltered.concat(this.proyectosFiltered, this.proyectos.filter((proy) => {
          return proy.nombre.toUpperCase().indexOf(this.filterQuery.toUpperCase()) > -1
        }))
      } else {
        this.filterQuery.split(' ').forEach((q) => {
          if (q) {
            this.proyectosFiltered = this.proyectosFiltered.concat(this.proyectosFiltered, this.proyectos.filter((proy) => {
              return proy.nombre.toUpperCase().indexOf(q.trim().toUpperCase()) > -1
            }))
          }
        })
      }
      if (!this.filterQuery) {
        this.proyectosFiltered = this.proyectos
      }
    },
    load () {
      let file = document.getElementById('inputFile').files[0]
      let reader = new FileReader()
      reader.readAsText(file, 'UTF-8')
      reader.onload = function (evt) {
        const project = JSON.parse(JSON.parse(evt.target.result))
        localStorage.vuex = JSON.stringify(project)
        location.reload()
      }
    },
    list2Load () {
      let self = this
      HTTP.get('/api/proyecto-json').then(result => {
        self.proyectosFiltered = result.data.proyectos
        self.proyectos = result.data.proyectos
        self.$refs.myModalRef.show()
      }).catch(result => {
      })
    },
    newProject () {
      let reloadAndReset = function () {
        localStorage.clear()
        location.reload()
      }
      swal({
        title: '¿Desea guardar el proyecto actual?',
        text: 'La información que no sea guardada se perderá.',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        confirmButtonText: 'Si'
      }).then(async (result) => {
        if (result.dismiss === 'overlay') {
          return
        }

        if (result.value) {
          await this.save(reloadAndReset)
        } else {
          reloadAndReset()
        }
      })
    },
    proyectoLoad (proyecto) {
      this.$noty.info('Cargando datos. Por favor, espere ...', {
        timeout: false
      })

      HTTP.get(`/api/proyecto-json/${proyecto.id}`)
        .then((response) => {
          if (response.data.proyecto) {
            localStorage.vuex = JSON.parse(response.data.proyecto.proyecto)
            localStorage.setItem('projectName', response.data.proyecto.nombre)
            localStorage.setItem('projectCreatedAt', response.data.proyecto.created_at)
            localStorage.setItem('projectID', response.data.proyecto.id)
            location.reload()
          }
        })
        .catch((response) => {
        })
    },
    proyectoDelete (proyecto) {
      let proyectoId = proyecto.id
      let self = this
      this.$swal('No podrá volver a acceder a dicho proyecto', {
        title: '¿Seguro de eliminar proyecto?',
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
          this.$noty.info('Eliminando proyecto...')
          HTTP.delete(`/api/proyecto-json/${proyectoId}`)
            .then((response) => {
              if (response.data.success === true) {
                this.$noty.success('¡Proyecto eliminado con éxito!')

                for (let i = 0; i < self.proyectosFiltered.length; i++) {
                  if (self.proyectosFiltered[i].id === proyectoId) {
                    self.proyectosFiltered.splice(i, 1)
                    break
                  }
                }
              }
            })
            .catch((response) => {
            })
        } else {
          this.close()
        }
      })
    },
    hasCalco (element) {
      return element && ((element.separator && element.size > 0) || element.cajon || element.puerta || element.dobleFondo)
    },
    addCustomPart () {
      let EditCustomPartInstance = Vue.extend(EditCustomPart)
      let ElementMounted = new EditCustomPartInstance({store: this.$store, parent: this.$parent}).$mount().$el
      this.$swal({
        content: ElementMounted,
        buttons: false
      })
    },
    addCustomModule () {
      let EditModuloExternoInstance = Vue.extend(EditModuloExterno)
      let ElementMounted = new EditModuloExternoInstance({store: this.$store, parent: this.$parent}).$mount().$el
      this.$swal({
        content: ElementMounted,
        buttons: false
      })
    },
    convertirEnPlanta () {
      this.$store.commit('setEjeY', this.$store.getters.selectedModule.height * -1)
      this.$store.commit('setEjeRX', -90)
      this.$store.commit('setEjeZ', 0)
      this.$noty.info('Ejes de modulo actualizados')
    },
    cambiarEjes () {
      let MoverEjesInstance = Vue.extend(MoverEjes)
      let ElementMounted = new MoverEjesInstance({store: this.$store, parent: this.$parent}).$mount().$el
      this.$swal({
        content: ElementMounted,
        buttons: false
      })
    },
    borrarModulos () {
      swal({
        title: '¿Estás seguro de que deseás borrar todos los módulos?',
        text: 'Esto eliminará las piezas de cada módulo.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        confirmButtonText: 'Si'
      }).then((result) => {
        if (result.value) {
          this.$store.commit('resetAll')
        }
      })
    },
    setElementComentario (comentario) {
      let elemento = this.$store.getters.selectedElement
      elemento.comentario = comentario
    },
  },
  watch: {
  }
}
</script>

<style lang="scss">
  @mixin personalized-scroll {
    &::-webkit-scrollbar {
      width: 8px;     /* Tamaño del scroll en vertical */
      height: 8px;    /* Tamaño del scroll en horizontal */
    }
    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #b3b3b3;
      box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
    }

    &::-webkit-scrollbar-thumb:active {
      background-color: #999999;
    }
  }
  #roomEditorIndex {
    & #view-panel {
      & .checkbox-adicionales{
        text-align: center;
      }
      height: 91vh;
      overflow-y: scroll;
      @include personalized-scroll;
    }
    & #edit-panel {
      font-size: 12px;
      h4 {
        font-size: 18px;
      }
      & .edit-module{
        height: 54vh;
        overflow-y: scroll;
        @include personalized-scroll;
      }
      & > .bordered-container:first-child {
        & > div:first-child{
          position: absolute;
          & > div {
            top: -15px;
          }
        }
      }
    }

    & .modal-body {
      max-height: calc(100vh - 130px);
      overflow-y: auto;
    }
    
    & .modal-dialog {
      max-width: 1200px !important;
    }
    & .roomEditorLineWidth, .roomEditorEspesor {
      width: 55px;
    }
    & .modulo-row {
      display: flex;    
    }
    & .modulo-row select {
      margin-right: 10px;
      width: 203px;
    }
    & .modulo-row button {
      margin-right: 10px;
      height: 25px;
      line-height: 2px;
      margin-top: 3px;
      font-size: 12px;
    }
    & .modal-module-creation-modal {
      width: 500px;
    }
    & .main-msg {
      font-weight: bold;
    }
    & .note-msg {
      font-size: 14px;
    }
    & .buttons {
      margin: 20px;
    }
    & .buttons button:last-child {
      margin-left: 10px;
    }
    & .hidden {
      visibility: none;
    }
    & .main-options {
      /*display: flex;*/
      &__field {
        display: flex;
        gap: 5px;
        & > .input {
          width: 100%;
        }
      }
    }
    & .layers h6 {
      font-weight: bold;
      margin: 0px;
    }
    & .layer-list {
      list-style: none;
      padding: 0px;
      margin: 0px;
      display: flex;
      column-gap: 12px;
      row-gap: 0px
    }
    & .layer-label {
      margin: 0px;
    }
    & .layer-chevron {
      font-size: 20px;
      cursor: pointer;
    }
    & .layer-selected {
      color: #17a2b8;
      font-weight: bold;
    }
    & .layer-panel {
      display: flex;
    }
    & .layer-info {
      padding-left: 10px;
      padding-top: 5px;
      margin-left: 5px;
      padding-top: 5px;
      border-left: 1px solid;
      padding-left: 5px;
      border-color: #17a2b8;
      max-height: 90px;
      overflow-y: auto;
      width: 235px;
    }
    & .all-width {
      width: 100%;
    }
    & .load-save-container {
      font-size: 10pt;
    }
    & .diagram {
      /*padding-top: 30px;*/
      background-color: white;
    }
    & .diagram > table {
      margin: 0 auto;
    }
    & .diagram  td {
      margin: 0;
      padding: 0 !important;
      /*border: 0 !important;*/
    }
    & .f1-step {
      position: relative;
      float: left;
      width: 25%;
      padding: 0 5px;
    }

    & .fancy-container {
      position: relative;
    }

    & .fancy {
      position: absolute;
      top: 0;
      left: 0;
      padding: 5px;

      font-weight: bold;
    }
    & .swal-modal {
      width: 800px !important;
    }
    & .modal-header {
      background-color: inherit;
      color: inherit;
    }
    & .search-check {
      text-align: left;
      font-size: 14px;
      padding: 5px 0px;
    }
  }
  @media print {
    .not-printable {
      display: none;
    }

    .right-bar {
      display: flex;
      flex-direction: column;
      margin: 0 auto;
      align-items: center;
    }
  }
</style>
