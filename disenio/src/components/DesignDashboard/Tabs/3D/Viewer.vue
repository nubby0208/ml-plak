<template>
  <b-container
    fluid
    class="card card-default px-0 h-100"
    style="overflow-x: hidden; overflow-y: hidden;"
    id="viewer-container"
  >
    <div  
      v-if="partList[0]"
      ref="viewer" 
      id="viewer-details"
      class="viewer"
    >
      <b-col
        style="position: absolute"
        cols="12"
      >
        <b-row
          align-h="between"
        >
          <b-col
            cols="7"
            class="text-left"
          >
            <span
              class="loading-text"
              v-if="this.loading"
            >
              Cargando...
            </span>
          </b-col>
          <b-col
            cols="5"
            class="text-right font-weight-bold"
          >
            <span>
              {{moduleActive}} {{ currentViewLabel }}
            </span>
          </b-col>
        </b-row>
      </b-col>
      <b-col
        v-if="allowLabelMessage && showCaption"
        style="position: absolute; bottom: 0"
        :style="labelMessageStyles"
        cols="12"
      >
        <b-col
          cols="12"
          class="text-center font-weight-bold"
        >
          <span>
            {{ caption.text }}
          </span>
        </b-col>
      </b-col>
    </div>
  </b-container>
</template>

<script>
import { VistaEnum, ViewerStatesEnum } from '../../Tools/models/enums.ts'
import { Viewer } from './classes/viewer.js'
import { Editor } from './classes/editor.js'
import { EventBus } from './utils/event-bus.js'
import Spinner from './utils/Spinner.vue'

const URL_BASE = process.env.BACKEND_BASE_URL

export default {
  name: 'Viewer',
  components: {
    Spinner
  },
  props:{
    zoom: {
      type: Number,
      default: 3,
    },
    showPieces: {
      type: String,
      default: 'all',
    },
    configViewer: {
      type: Object,
      default: null,
    },
    allowLabelMessage: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      idReq: 0,
      loading: true,
      modelsCache: {},
      loadViewer: true,
      moduleActive:'',
      currentModules: [],

      currentViewLabel: VistaEnum.perspective,
      viewer: null,
      editor: null,
      isPointAselected: false,
      isPointBselected: false,
      allModules: [],
      textures: {
        needsUpdate: false,
        query: null,
        data: [],
      },
    }
  },
  computed: {    
    caption () {
      return this.$store.state.viewer3d.captionInfo
    },

    showCaption () {
      if (this.caption) {
        return this.caption.showCaption
      } else {
        return false
      }
    },

    labelMessageStyles () {
      if (this.caption) {
        let fontSize = this.caption.fontSize
        let color = this.caption.fontColor
        let opacity = this.caption.opacity
        let marginBottom = this.caption.offset
        let backgroundColor = this.caption.backgroundColor
  
        return `font-size: ${fontSize}rem; color: ${color}; background-color: ${backgroundColor}; margin-bottom: ${marginBottom}rem; opacity: ${opacity};`
      } else {
        return ''
      }
    },


    partList () {
      return this.$store.getters.getPartList.concat(this.$store.getters.getRoomEditorPartList)
    },
    
    

   
  },
  watch: {
    showPieces () {
      this.createViewer()
    },

    '$store.state.layout.modules': {
      handler: function () {        
        if(this.$store.state.layout.eventSelectModule){
          return true;
        }

        this.createOrRefreshViewer()
        this.renderFrame()
      },
      deep: true,
    },
    '$store.state.layout.DesignObject': {
      handler: function () {        
         this.renderCad();
         this.renderFrame();
      },
      deep: true
    },

    '$store.state.layout.roomEditorModules': {
      handler: function () {
        this.createOrRefreshViewer()
      },
      deep: true
    },

    '$store.state.viewer3d.config': {
      handler: function () {
        this.createViewer() 
      },
      deep: true
    },
    
    'configViewer': {
      handler: function () {
        this.createViewer() 
      },
      deep: true
    },

    '$store.state.viewer3d.edgeColor': function (newColor, oldColor) {
      // console.log(`eggeColor : ${newColor} file: viewer.vue`)
      this.viewer.setEdgeColor(newColor)
    },

    '$store.state.viewer3d.currentActiveView': function (newVal, oldVal) {
      
      this.viewer.clearOrthographicCamera()
      this.currentViewLabel = VistaEnum[newVal]

      if (newVal === 'perspective') {
        this.viewer.cameraUserView()      
      }
      else {
        this.viewer.cameraOrthographic(newVal)
      }

      this.renderFrame()
    },

    '$store.state.viewer3d.selection': function (n, o) {     
      if (this.$store.state.viewer3d.state === ViewerStatesEnum.MEASURING) {
        this.$store.state.viewer3d.state = ViewerStatesEnum.NORMAL
        this.$store.state.viewer3d.stateDetails = null
        
      }      

      if (!n) {
        this.viewer.clearSelection()
      }else{
        this.viewer.selectItemById(n);
      }
      
      this.renderFrame()
    },
  
    '$store.state.viewer3d.state': function (n, o) {      


      this.editor.setState(n, this.$store.state.viewer3d.stateDetails)
   		this.isPointBselected = this.editor.getmlPlakDistanceController() 
	
      if (this.isPointBselected) {
        let radios = document.getElementsByName('ejes')
        radios.forEach(e => {
            e.checked = false
          });	
      }

      this.isPointBselected=false
      this.editor.setmlPlakDistanceController(false)

 
    },

  
    '$store.state.viewer3d.labelState': function (newValue) {
      switch (newValue) {
        case 'add':
          this.createEditorNewMarker(this.$store.state.viewer3d.newMarker)
          break
        case 'move':
          this.editor.mlPlakMarkers.activateMouseHelperDrag()
          break
        case 'delete':
          this.editor.mlPlakMarkers.beginMarkerDeletionProcess()
          break
        default:
          // console.log(`labelState not supported. ${newValue}`)
          break
      }
    },

 
  '$store.state.viewer3d.indicadorModule': function (n) {     

    // console.log(`se realizo un cambio : indicadorModule *-*Viewer.vue`);
    if(!this.loadViewer){
      this.refreshIndicadorModule()
    }else{
      this.loadViewer = false
    }

  },
  
  

  


  },
  mounted () {    
    this.createViewer()
  },

  

  beforeDestroy () {
    this.setCamera()
    this.removeEditorEventListeners()
    this.editor.removeAllDistances()
    this.$store.state.viewer3d.distances = []
  },



  
   methods: {
    createViewer() {
      this.initViewer()
      this.load3DModelWithTextures()
      this.initEditor()     
      this.loadDistance()
      this.loadMarks()
      this.activeModule()
      this.loadIndicadorModule()
      this.renderFrame()
    },

    refreshViewer(normalizedModels=false) {
      this.load3DModelWithTextures(normalizedModels)      
    },

    setupTransformControls(type) {
      this.viewer.showTransformControls(type)
    },
    
    async loadIndicadorModule(){
      let dataIndicadorModule =  this.$store.state.viewer3d.indicadorModule
      let layoutModuleRoom =  this.$store.state.layout.roomEditorModules
      let layoutModuleMod =  this.$store.state.layout.modules

        // enable or disable mark
        this.editor.mlPlakMarkers.toggleMarkerVisibility(this.$store.state.viewer3d.visibleMarks)

      // verificar que si existen si no los creas 
      // console.log('loadIndicadorModule  funcionalidad para precargar los indicadores de los modulos visibles   *-*/Tabs/3D/Viewer.vue')
      // console.log(` loadIndicadorModule() -> dataIndicadorModule: ${JSON.stringify(dataIndicadorModule)} *-*/Tabs/3D/Viewer.vue'`)
      
      this.editor.loadIndicadorModule(dataIndicadorModule, layoutModuleRoom, layoutModuleMod )

      this.editor.mlPlakIndicadorModuleController.indicatorModelVisibility(this.$store.state.viewer3d.configIndicator.visibleModule)
      this.editor.mlPlakIndicadorModuleController.indicatorEnvironmentVisibility(this.$store.state.viewer3d.configIndicator.visibleEnvironment)
      this.editor.mlPlakIndicadorModuleController.indicatorPartVisibility(this.$store.state.viewer3d.configIndicator.visiblePart)
        
    },

    async refreshIndicadorModule(){
     let dataIndicadorModule =  this.$store.state.viewer3d.indicadorModule
      let layoutModuleRoom =  this.$store.state.layout.roomEditorModules
      let layoutModuleMod =  this.$store.state.layout.modules

      // verificar que si existen si no los creas 
      // console.log('refreshIndicadorModule  funcionalidad para precargar los indicadores de los modulos visibles   *-*/Tabs/3D/Viewer.vue')
      // console.log(`dataIndicadorModule: ${JSON.stringify(dataIndicadorModule)}`)
      this.editor.refreshIndicadorModule(dataIndicadorModule,layoutModuleRoom, layoutModuleMod)

      this.editor.mlPlakIndicadorModuleController.indicatorModelVisibility(this.$store.state.viewer3d.configIndicator.visibleModule)
      this.editor.mlPlakIndicadorModuleController.indicatorEnvironmentVisibility(this.$store.state.viewer3d.configIndicator.visibleEnvironment)
      this.editor.mlPlakIndicadorModuleController.indicatorPartVisibility(this.$store.state.viewer3d.configIndicator.visiblePart)
      // this.viewer.renderFrame()
    },




    loadMarks(){
        let dataMarks =  this.$store.state.viewer3d.marks
        // console.log('loadMarks *-*/Tabs/3D/Viewer.vue')     
        // console.log(`loadMarks Marks: ${JSON.stringify(dataMarks)} *-*/Tabs/3D/Viewer.vue `)
        this.editor.mlPlakMarkers.loadMarkToViewer(dataMarks)

        // enable or disable mark
        this.editor.mlPlakMarkers.toggleMarkerVisibility(this.$store.state.viewer3d.visibleMarks)

    },

    loadDistance(){
      let dataDistance =  this.$store.state.viewer3d.distances    
      // console.log('loadDistance *-*/Tabs/3D/Viewer.vue')     
      // console.log(`loadDistance Distance: ${JSON.stringify(dataDistance)} *-*/Tabs/3D/Viewer.vue `)
      // se puede mejorar director 
      //this.editor.mlPlakMarkers.addMarks(newMarker) 
      this.editor.loadDistance(dataDistance)
    },

    async load3DModelWithTextures (normalizedModelsParametro=false) {
      this.loading = true
      const normalizedModels = normalizedModelsParametro ? normalizedModelsParametro:this.normalizeModels(this.build3dRepresentation());
      const modelTextureListToLoad = Array.from([...normalizedModels.uniqueTextures][0]).filter( t => t )
      this.viewer.loadAllModulesForRender(normalizedModels.modules)
      this.renderCad();
      this.renderFrame()
      await this.loadTextures(modelTextureListToLoad)   

      this.loading = false
      
    },
    renderCad(){
      this.viewer.renderCad(this.$store.state.layout.DesignObject, this.$store);
    },

    async fetchAndSetModelTexturesFromAPI (query) {

      return fetch(URL_BASE + '/api/materiales/lista/?' + query)
        .then( response => response.json() )
        .then( response => {         
          let output = []
          let materiales = response.materiales
            materiales.forEach( (material, id) => {
              if(material.tipo_material_id!=1){
                var name = material.nombre
              }else{
                var name = material.material
              }
              output.push({
                'name': name,
                'texture': material.link_textura1,
                'color': material.link_textura2
              })
            })
          return output
        })
        .then( response => {
          this.textures.data = response
          this.viewer.loadTextures(response)
        }) 
    },

    async loadTextures (modelTextureListToLoad) {
      this.buildTexturesQuery(modelTextureListToLoad)

      if (modelTextureListToLoad.length && this.textures.needsUpdate) {
        await this.fetchAndSetModelTexturesFromAPI(this.textures.query)
        this.textures.needsUpdate = false
      } else {
        this.viewer.loadTextures(this.textures.data)
      }
    },

    buildTexturesQuery (modelTextureListToLoad) {
      if (modelTextureListToLoad.length) {
        let query = ''
        modelTextureListToLoad.forEach((texture, i) => {
          query += 'names[' + i + ']=' + texture
          if (i !== modelTextureListToLoad.length -1) {
            query += '&'
          }
        })

        if(this.textures.query !== query){
          this.textures.needsUpdate = true
        }

        this.textures.query = query
      }
    },

    async saveImg () {
      let img = await this.viewer.getCurrentImage()
      let proyect  = this.$store.state.info.token_project
      let folderSetting = this.$store.getters.getSelectedFolder
      // console.log(`Folder saveImg: ${JSON.stringify(folderSetting)}`)
      this.uploadImage(folderSetting, proyect, img) 
   
},
    

    initViewer () {
      const currentCamera = this.getCurrentCamera()     
      
      let config = this.$store.state.viewer3d.config;
      if(this.configViewer){
        config = this.configViewer
      }
      
      let fireEvents = {
        clearLabelState: this.clearLabelState
      } 

      let viewerContainer = null
      let existsCanvas = false
      if (!this.$refs.viewer) {
        viewerContainer = document.getElementById("viewer-container")
      }
      else {
        viewerContainer = this.$refs.viewer
        existsCanvas = true
      }

      this.viewer = new Viewer(
        viewerContainer,
        existsCanvas,
        currentCamera,
        config,
        fireEvents,
      )
      this.viewer.camera.zoom =  this.zoom
    },

    initEditor () {
      this.editor = new Editor({
        viewer: this.viewer,
        onObjectEdited: this.updateObject,
        onObjectSelected: this.updateSelection,
        onObjectSelectedCad: this.updateSelectionCad,
        onMeasureStart: this.startMeasuring,
        onMeasureUpdated: this.updateMeasure,
        onPositionUpdated:  this.updatePositionMark

      })

      this.setEditorListeners()
      this.editor.setState(ViewerStatesEnum.Normal, null)

      // Save this.viewer data on $store from Vuex
      //this.$store.commit("setViewer", this.viewer)
    },


    setEditorListeners () {

      EventBus.$on('updateTransformControlsStatus', (data) => {
        this.viewer.updateTransformControlsStatus(data)
      })

      EventBus._events['updateTransformControlsStatus'] = [EventBus._events['updateTransformControlsStatus'][ EventBus._events['updateTransformControlsStatus'].length-1 ]]
     
      EventBus.$on('saveDistance', (distance) => {
        // console.log(` setEditorListeners  saveDistance:  distance: ${JSON.stringify(distance)} **/Tabs/3D/Viewer.vue  `)
        this.$store.commit('addDistance', distance)
        this.editor.saveCurrentDistance()
        this.$store.state.viewer3d.stateDetails = null
      })
      
      EventBus._events['saveDistance'] = [EventBus._events['saveDistance'][ EventBus._events['saveDistance'].length-1 ]]

      EventBus.$on('distanceColorUpdated', (color) => {        
        this.editor.mlPlakDistanceController.currentDistance.color = color
        this.editor.updateDistanceColor(color)
        this.renderFrame()
      })

      EventBus._events['distanceColorUpdated'] = [EventBus._events['distanceColorUpdated'][ EventBus._events['distanceColorUpdated'].length-1 ]]

      EventBus.$on('distanceAxisUpdated', (axis, value) => {
        this.editor['updateFixed' + axis](value)
      })

      EventBus._events['distanceAxisUpdated'] = [EventBus._events['distanceAxisUpdated'][ EventBus._events['distanceAxisUpdated'].length-1 ]]


     EventBus.$on('updateDistance', (params) => {
       // console.log(`updateDistance  parametros:${JSON.stringify(params.item)} **Tabs/3D/Viewer.vue `)
       //  let idDistance =  this.$store.getters('getDistancesId')        

        let distances =  this.$store.state.viewer3d.distances 
        // const result = distances.filter(item => item.distance  ===  params.item.distance);
        // console.log(`updateDistance  parametros:${JSON.stringify( result[0].id)} **Tabs/3D/Viewer.vue `)
        // f(result)   params.item.id = result[0].id // params.item.id = 'wuilmer'

        // seto todas las distancias para recrearlas
        params.items = distances
       
        // console.log(`updateDistance  parametros:${JSON.stringify(params.item.id)} **Tabs/3D/Viewer.vue `)
        this.$store.commit('setUpdateDistance', params)
         this.editor.updateDistance(params)

        this.renderFrame() 
       
      })

      EventBus.$on('deleteDistance', (distanceId) => {
        this.$store.commit('deleteDistance', distanceId)
        this.editor.removeDistance(distanceId)
        this.renderFrame()
      })

      EventBus._events['deleteDistance'] = [EventBus._events['deleteDistance'][ EventBus._events['deleteDistance'].length-1 ]]

      EventBus.$on('gridVisibilityChanged', (visible) => {
        this.viewer.toggleGrid(visible)
      })

      EventBus._events['gridVisibilityChanged'] = [EventBus._events['gridVisibilityChanged'][ EventBus._events['gridVisibilityChanged'].length-1 ]]

      EventBus.$on('onMarkersVisibilityChanged', (visible) => {
        this.editor.mlPlakMarkers.toggleMarkerVisibility(visible)
      })

      EventBus._events['onMarkersVisibilityChanged'] = [EventBus._events['onMarkersVisibilityChanged'][ EventBus._events['onMarkersVisibilityChanged'].length-1 ]]

      EventBus.$on('onDistanceVisibilityChanged', (visible) => {
        this.editor.mlPlakDistanceController.toggleDistanceVisibility(visible)
      //  console.log(`onDistanceVisibilityChanged valor: ${visible} **/Tabs/3D/Viewer.vue  `)
      
      })


      EventBus.$on('onIndicatorModuleVisibility', (visible) => {
        this.editor.mlPlakIndicadorModuleController.indicatorModelVisibility(visible)
      //  console.log(`onIndicatorModuleVisibility valor: ${visible} **/Tabs/3D/Viewer.vue  `)
      
      })
  
  
      EventBus.$on('onIndicatorEnvironmentVisibility', (visible) => {
        this.editor.mlPlakIndicadorModuleController.indicatorEnvironmentVisibility(visible)
      //  console.log(`onIndicatorEnvironmentVisibility valor: ${visible} **/Tabs/3D/Viewer.vue  `)
      
      })

      EventBus.$on('onIndicatorPartVisibility', (visible) => {          
          console.log(`onIndicatorPartVisibility EN CONSTRUCCION valor: ${visible} **/Tabs/3D/Viewer.vue  `)     
          this.editor.mlPlakIndicadorModuleController.indicatorPartVisibility(visible)            
      })



      EventBus.$on('reloadIndicadorModule', () => {          
          // console.log(`reloadIndicadorModule **/Tabs/3D/Viewer.vue  `)     
          this.activeModule()            
      })
     
      EventBus.$on('onMarkerBeforeAdd', () => {
        this.editor.mlPlakMarkers.beforeAddMarker()      
      })

      EventBus.$on('testEventBus', (valor) => {
        // console.log(`Entro en testEventBus valor: ${JSON.stringify(valor)} *-*Viewer.vue`)
        this.$store.state.viewer3d.currentPositionMark = valor
        // this.editor.mlPlakMarkers.beforeAddMarker()      
      })


     EventBus.$on('updateMarkPosition', (valor) => {
        // console.log(`Entro en updateCurrenPositionMark valor: ${JSON.stringify(valor)} *-*Viewer.vue`)
        // this.$store.state.viewer3d.currentPositionMark = valor

        // console.log(`REVISAR SI N DA ERROR  **** updateMark ***** : ${JSON.stringify(valor)} *-*Viewer.vue`)
        this.$store.commit('UpdateMarkPosition', valor)
           
      })

     EventBus.$on('updateCurrenPositionMark', (valor) => {
        // console.log(`Entro en updateCurrenPositionMark valor: ${JSON.stringify(valor)} *-*Viewer.vue`)
        this.$store.state.viewer3d.currentPositionMark = valor
    
      })

      EventBus.$on('updateCurrenPositionMark', (valor) => {
        // console.log(`Entro en updateCurrenPositionMark valor: ${JSON.stringify(valor)} *-*Viewer.vue`)
        this.$store.state.viewer3d.currentPositionMark = valor
    
      })


      EventBus.$on('saveMark', (valor) => {
          // console.log(`saveMark valor: ${JSON.stringify(valor)} *-*Viewer.vue`)
           this.createEditorNewMarker(valor)
      })


      EventBus.$on('deleteMark', (index) => {
        // console.log(`Entro en deleteMarker INDEX: ${JSON.stringify(index)} *-*Viewer.vue`)
        this.$store.commit('deleteMark', index)
      })
     
     
     


    },

    removeEditorEventListeners () {
      EventBus.$off('saveDistance')
      EventBus.$off('distanceColorUpdated')
      EventBus.$off('distanceAxisUpdated')
      EventBus.$off('deleteDistance')
      EventBus.$off('gridVisibilityChanged')
      EventBus.$off('onMarkersVisibilityChanged')
      EventBus.$off('onMarkerBeforeAdd')
      EventBus.$off('updateCurrenPositionMark')

      

    },


    //uploadImage (filename, img) {
    uploadImage(folderSetting, proyect, img){ 
      this.$root.$emit('EventUploadImagen', true);
      const details = {
        base64: img,
        project_name: proyect,
        folder: folderSetting.folder,
       description: folderSetting.description,
       folderGeneral:folderSetting.folderGeneral
       }

      let formBody = []
      for (let property in details) {
        let encodedKey = encodeURIComponent(property)
        let encodedValue = encodeURIComponent(details[property])
        formBody.push(encodedKey + '=' + encodedValue)
      }
      formBody = formBody.join('&')

      fetch(URL_BASE + '/api/v2/images', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: formBody
      }).then(response => {
        // console.log('Imagen Guardada con exito', response)
          this.$noty.success('¡Imagen Guardada correctamente!')
  
        this.$root.$emit('EventUploadImagen', false);
      }).catch(error => {
        this.$root.$emit('EventUploadImagen', false);
          this.$noty.success('Ocurrio un error al intentar enviar la imagen al servidor.')
          // console.error('Ocurrio un error al intentar enviar la imagen al servidor.', error)
      })
    },
    
    // Method for redraw the next frame on the 3D Viewer
    renderFrame () {
      this.viewer.renderFrame()
    },

    getViewer() {
      return this.viewer;
    },

    createOrRefreshViewer () {
      const normalizedModels = this.normalizeModels(this.build3dRepresentation())
    
      if(!normalizedModels.modules[0]) {
        this.createViewer()
      }
      else {
        this.refreshViewer(normalizedModels)
      } 
    },

    clearLabelState () {
      this.$store.commit('updateLabelState', null)
    },

    updateObject (object) {
      object.index = Number(this.$store.state.viewer3d.selection.split('_')[1]) - 1
      this.$store.commit('setAllAxis', object)
    },


     updateSelection (object, modelIntersects = null) {
      var cara = "";
      var carasArray = [];
      // 1 vertical 2 Horizontal
      /*  4 frente
          5 atras
          2 arriba
          3 abajo
          1 Izquierda
          0 Derecha
      */

      if(object.orientation == 1){
        carasArray = ["derecha", "izquierda", "arriba", "abajo", "frente", "atras"];
      }else if(object.orientation == 2){
        carasArray = ["abajo", "arriba", "izquierda", "derecha", "frente", "atras"];
      }else{
        carasArray = ["", "", "", "", "", ""];
      }

      cara = `${carasArray[modelIntersects[0].face.materialIndex]}`;
      // console.log(cara);
      // console.log(object.orientation);
      this.$store.commit('setCaraSeparador', cara || null)
      this.$store.commit('updateSelectionById', object.id || null)
      this.renderFrame()
    },
    updateSelectionCad (object, modelIntersects = null) {
      console.log(object);
      this.$store.commit('updateSelectionById', object.id || null)
      this.renderFrame()
    },

 

    updatePositionMark (position) {      
      // console.log(`Entro Aqui  updatePositionMark position : ${JSON.stringify(position)} *-*viewer.vue `)
       this.$store.state.viewer3d.currentPositionMark = position
    },


    updateMeasure (details) {  
      // console.log(`updateMeasure: ${JSON.stringify(details)} *-*Viewer.vue `)    
      this.$store.state.viewer3d.state = ViewerStatesEnum.Normal
      this.$store.state.viewer3d.stateDetails = details
    },

    normalizeModels (data) {
      const materiales = []
      const models = {}
      // Busca datos extras de los modulos en vuex para ser agregados a los datos de la api
      const modelsVuex = this.getModelsFromVuex()
      // Texturas usadas en este modelo
      const modelTextures = []

      Object
      .keys(data.modulos)
      .forEach( (t, index) => {
        const tagModulo = t.replace(/ /g, '_')

        const piezas = data.modulos[t]
        const parsedData = []
        let pieceData = {}
        let piezasLength = piezas.length

        for (let j = 0; j < piezasLength; j++) {

          let obj = piezas[j]

          if (obj.length !== 0) {
            materiales.push(obj.material_name)
            pieceData = {
              id: tagModulo + '-' + obj.pieza,
              type: 'piece',
              index: parsedData.length,
              visible: obj.visible,
              wireframe: true,
              name: obj.pieza,
              material: obj.material_name,
              l: parseFloat(obj.lveta),
              w: parseFloat(obj.aveta),
              h: parseFloat(obj.espesor),
              orientation: parseInt(obj.orientacion),
              color: obj.color || '0xF5F5F5',
              texture: obj.textura,
              y: parseFloat(obj.posicion_y),
              x: parseFloat(obj.posicion_x),
              z: parseFloat(obj.posicion_z),
              pattern: {
                frontWidth: 0.0
              },
              model: tagModulo,
              modulo_id: obj.modulo_id,
              needsUpdate: true
            }

            if (pieceData.w === 0 || pieceData.h === 0 || pieceData.l === 0) {
              continue
            }

            if (this.isPieceValid(pieceData)) {
              parsedData.push(pieceData)
              modelTextures.push(pieceData.material)
              // NOTA: lo ideal es que pieceData.material sea el id del material y no el nombre
              // por ahora se programara con el nombre
            }
          }
        } 
        
        this.modelsCache[pieceData.modulo_id] = piezas

        const moduleIsVisble = Boolean(this.moduleIsVisibleByName(tagModulo))


        var modeloVuex = Object.values(modelsVuex).find(a=>a.name == t);
  
        const model = Object.assign(
          {
            id: tagModulo,
            type: 'module',
            pieces: parsedData,
            guid: tagModulo,
            tag: tagModulo,
            x: 0,
            y: 0,
            z: 0,
            rx: 0,
            ry: 0,
            rz: 0,
            visible: moduleIsVisble,
            needsUpdate: true
          },
          modeloVuex
        )
        
        models[model.id] = model
        models[model.id].pieces = parsedData
      })
      
      const uniqueTextures = [new Set(modelTextures)]      
      const modules = Object.values(models)

      return {
        modules,
        uniqueTextures,
      }

    },

    moduleIsVisibleByName (tagModulo) {
      let initialName = tagModulo.split('_')[1]        
      let isRoomEditorPrimitiveIdentifier = initialName.substring(initialName.length - 2)        
      let isRoomEditorModule = isRoomEditorPrimitiveIdentifier === '00'

      if (isRoomEditorModule) {
        let roomEditorModuleIndexWithHundred = String(tagModulo.split('_')[1])
        let roomEditorRealModuleNumber = Number(roomEditorModuleIndexWithHundred.substring(0, roomEditorModuleIndexWithHundred.length - 2))
        let moduleName = `Mod ${roomEditorRealModuleNumber}`
        const module = this.$store.state.layout.roomEditorModules.find((module) => module.moduleName === moduleName)

        return (this.$store.state.layout.showOnlyItsActiveInModules === true || this.$store.state.layout.showOnlyItsActiveInRoomEditorModules === true)
        ? module._showOnly 
        : module._visible
      }
      else {
        let roomEditorModuleNumber = String(tagModulo.split('_')[1])
        let moduleName = `Mod ${roomEditorModuleNumber}`
        const module = this.$store.state.layout.modules.find((module) => module.moduleName === moduleName)
        
        return (this.$store.state.layout.showOnlyItsActiveInModules === true || this.$store.state.layout.showOnlyItsActiveInRoomEditorModules === true) 
        ? module._showOnly 
        : module._visible
      }
    },

    getPartsList () {
      if ( this.showPieces === 'all') {
        this.$store.state.layout.showCad3d = true;
        return this.$store.getters.getPartList.concat(this.$store.getters.getRoomEditorPartList)
      }
      else if (this.showPieces === 'room') {
        this.$store.state.layout.showCad3d = false;
        return this.$store.getters.getRoomEditorPartList
      }
      else if (this.showPieces === 'furniture') {        
        this.$store.state.layout.showCad3d = true;
        return this.$store.getters.getPartList
      }
    },

    build3dRepresentation () {
      const parts = this.getPartsList() || []      

      let modulos =  {}

      parts.forEach((oldPart) => {
        const moduleId = oldPart.Module.split(' ')[1] || null

        if (!modulos[`Modulo ${moduleId}`]) {
          modulos[`Modulo ${moduleId}`] = []
        }
          
        const newPart = {
          pieza: oldPart.Name,
          modulo_id: moduleId,
          cantidad: oldPart.Count,
          posicion_x: oldPart.X,
          posicion_y: oldPart.Y,
          posicion_z: oldPart.Z,
          rotacion_x: 0,
          rotacion_y: 0,
          rotacion_z: 0,
          lveta: oldPart.LVeta,
          aveta: oldPart.AVeta,
          espesor: oldPart.Espesor,
          orientacion: oldPart.Orientacion,
          material_name: oldPart.Material,
          color: "", // no encontrado
          estado_id: 1, // desde el back es 1
          prearmado_estado_id: 1, // desde el back es 1
          proyecto_name: this.$store.state.info.token_project,
          cliente_name: "default", // defaulteado en el back (a veces cambia)
          visible: oldPart.Visible
        }

        modulos[`Modulo ${moduleId}`].push(newPart)
      })
  
      const output = {
        modulos,
      }
      return output
    },
    getNameModule(moduleName, isRoomEditor){
      var name = "";
      if(isRoomEditor){
        name = moduleName.replace(/Mod.(.*?)$/, "Modulo $1");
        name = `${name}00`;
      }else{
        name = moduleName.replace(/Mod.(.*?)$/, "Modulo $1");
      }
      return name;
    },

    getModelsFromVuex () {
      let modelsVuex = this.$store.state
      let modelsVuexDict = {}
      let modulesArray = modelsVuex.layout.modules

      if (modelsVuex.layout.roomEditorModules) {
        modulesArray = modulesArray.concat(modelsVuex.layout.roomEditorModules)
      }

      modulesArray.forEach((module, index) => {
        let tc_default = modelsVuex.general.tapacantos_default_por_modulo[module.moduleId - 1]
        let tc = tc_default !== undefined ? JSON.parse(tc_default) : {}

        const material = tc_default

        var name = this.getNameModule(module.moduleName, module.isRoomEditor);

        let newModule = {
          type: 'module',
          moduleId: module.moduleId,
          moduleName: module.moduleName,
          name: name,
          isRoomEditor: module.isRoomEditor,
          depthMaterial: module.fondo,
          height: module.height,
          width: module.width,
          depth: module.z,
          description: module.settings.description,
          comment: module.settings.comentario,
          x: module._x,
          y: module._y,
          z: module._z,
          rx: module._rx,
          ry: module._ry,
          rz: module._rz,
          defaultMaterial: material ? JSON.parse(material) : '',
          defaultTapacantos: tc ? tc.nombre : ''
        }
        modelsVuexDict[index] = newModule
      })

      return modelsVuexDict
    },

    isPieceValid (d) {
      return !(isNaN(d.orientation) || isNaN(d.x) || isNaN(d.y) || isNaN(d.z) || d.visible === false)
    },
    
    getCurrentCamera () {
      let camera = null
      let viewer3dCamera = this.$store.state.viewer3d.camera
      let viewer = this.viewer

      if (viewer3dCamera && viewer3dCamera.position) {
        camera = viewer3dCamera
      }
      else if (viewer && viewer.camera) {
        camera = viewer.camera
      }

      return camera
    },

    setCamera () {
      this.$store.commit('setCamera', this.getCurrentCamera())
    },

    
    
    createEditorNewMarker (newMarker) {
      if (!isNaN(parseFloat(newMarker.size)) && isFinite(newMarker.size)) {
          newMarker.size = parseInt(newMarker.size, 10)
        }

        if (newMarker.size < 10 || newMarker.size > 100) {
          newMarker.size = 50
        }

        if (!newMarker.text || newMarker.text.trim().length === 0) {
          newMarker.text = 'No asignado'
        }

        newMarker.text = newMarker.text.trim()

        if (!newMarker.color || newMarker.color.trim().length === 0) {
          newMarker.color = '#00ff00'
        }
        else if (!(/^#[0-9A-F]{6}$/i.test('#aabbcc'))) {
          // solo se usan colores con 7 caracteres.
          newMarker.color = '#00ff00'
        }

          let mark = newMarker
          this.editor.mlPlakMarkers.addMarks(mark)  
        // OLD PROCCESO LIMPIAR LUEGO DE TESTEAR EN PRODUCCION 
        // this.editor.mlPlakMarkers.beginMarkerCreationProcess(newMarker.text, newMarker.size, newMarker.color)
    },

    selectItem(moduleGrouped) {
      this.viewer.selectItem(moduleGrouped)
    },

    getModuleByName(moduleName) {
      return this.viewer.getModuleByName(moduleName)
    },



    moduleIsVisibleByNameNew (oldPart) {
      // roomeditor modules are identified by looking at its "hundred" property 
      // eg. Module_200 (is roomEditor), Module_1(is not)
      let initialName = oldPart.Module.split(' ')[1]        
      let isRoomEditorPrimitiveIdentifier = initialName.substring(initialName.length - 2)        
      let isRoomEditorModule = isRoomEditorPrimitiveIdentifier === '00'

      if (isRoomEditorModule) {
        let roomEditorModuleIndexWithHundred = String(oldPart.Module.split(' ')[1])
        let roomEditorRealModuleNumber = Number(roomEditorModuleIndexWithHundred.substring(0, roomEditorModuleIndexWithHundred.length - 2))
        let moduleName = `Mod ${roomEditorRealModuleNumber}`

        return this.$store.state.layout.roomEditorModules.find((module) => module.moduleName === moduleName)
      } else {
        let roomEditorModuleNumber = String(oldPart.Module.split(' ')[1])
        let moduleName = `Mod ${roomEditorModuleNumber}`

        return this.$store.state.layout.modules.find((module) => module.moduleName === moduleName)
      }
    },

    moduleIsShowOnlyByNameNew (oldPart) {
      // roomeditor modules are identified by looking at its "hundred" property 
      // eg. Module_200 (is roomEditor), Module_1(is not)
      let initialName = oldPart.Module.split(' ')[1]        
      let isRoomEditorPrimitiveIdentifier = initialName.substring(initialName.length - 2)        
      let isRoomEditorModule = isRoomEditorPrimitiveIdentifier === '00'

      if (isRoomEditorModule) {
        let roomEditorModuleIndexWithHundred = String(oldPart.Module.split(' ')[1])
        let roomEditorRealModuleNumber = Number(roomEditorModuleIndexWithHundred.substring(0, roomEditorModuleIndexWithHundred.length - 2))
        let moduleName = `Mod ${roomEditorRealModuleNumber}`

        return this.$store.state.layout.roomEditorModules.find((module) => module.moduleName === moduleName)._showOnly
      } else {
        let roomEditorModuleNumber = String(oldPart.Module.split(' ')[1])
        let moduleName = `Mod ${roomEditorModuleNumber}`

        return this.$store.state.layout.modules.find((module) => module.moduleName === moduleName)._showOnly
      }
    },

  

activeModule () {
      let modulos =  {}
      const parts = this.$store.getters.getPartList || []
      const roomEditorParts = this.$store.getters.getRoomEditorPartList || []
      
      roomEditorParts.map(part => {
        part.isRoomEditor = true
        return part
      })

      const allParts = parts.concat(roomEditorParts)


      // console.log(` activeModuleName  allParts values : ${JSON.stringify(allParts)}  *-*Viewer.vue`)

      allParts.forEach((oldPart) => {
        const moduleId = oldPart.Module.split(' ')[1] || null
        const moduleIsVisible = Boolean(this.moduleIsVisibleByNameNew(oldPart)._visible)
        const moduleIsShowOnly = Boolean(this.moduleIsShowOnlyByNameNew(oldPart))

        if (!modulos[`Modulo ${moduleId}`]) {
            modulos[`Modulo ${moduleId}`] = {
                pieces: [],
                visible: moduleIsVisible,
                name: `Modulo ${moduleId}`,
                moduleId: Number(moduleId),
                isRoomEditor: Boolean(oldPart.isRoomEditor),
                moduleName: oldPart.Module,
                showOnly:moduleIsShowOnly,
            }
        }

        //if (oldPart.Visible === undefined) oldPart.Visible = true

        const newPart = {
          name: oldPart.Name,
          id: oldPart._Id,
          modulo_id: moduleId,
          cantidad: oldPart.Count,
          visible: oldPart.Visible,
          elementId: oldPart.elementId, 
          partes: oldPart

        }

        modulos[`Modulo ${moduleId}`].pieces.push(newPart)
      })

      // console.log(modulos)

       // console.log(` activeModuleName  Module values  ${JSON.stringify(modulos)} : *-*Viewer.vue`)
      // return modulos

       let modulosLoad = []      

        const allPartsLoad = modulos
        let indexM = 0  // index modulo
        let indexA = 0  // index modulo Ambiente

        for (var key in allPartsLoad) {
            let partesJSON =  allPartsLoad[key]
            // console.log('key :'+ key);
            // console.log(key + ' ' + allParts[key]);
            // console.log(` valores : ${JSON.stringify(allParts[key])}`)
            let moduloId   = parseInt(JSON.stringify(partesJSON.moduleId))
            let modName    = JSON.stringify(partesJSON.moduleName)
            let roomEditor = JSON.stringify(partesJSON.isRoomEditor)
            let showOnly   = JSON.stringify(partesJSON.showOnly)
            let visible    = JSON.stringify(partesJSON.visible)

           const allPieces = [] 

            // pieces y partes con posicion 
            partesJSON.pieces.forEach((pieces) => {

              let partes = {
                 "Count": pieces.partes.Count,
                "Name": pieces.partes.Name,
                "Module": pieces.partes.Module,
                 "Material":pieces.partes.Material,
                "Orientacion": pieces.partes.Orientacion,
                "X":pieces.partes.X,
                "Y": pieces.partes.Y,
                "Z":pieces.partes.Z,
                "_Id": pieces.partes._Id,
                "elementId": pieces.partes.elementId,
                "Visible":pieces.partes.Visible

              }

              let itemPieces = {
                  "name" : pieces.name,
                  "id": pieces.id,
                  "modulo_id": pieces.modulo_id,
                  "cantidad": pieces.cantidad,
                  "visible": pieces.visible,
                  "elementId": pieces.elementId,
                  partes: partes                
              }

              allPieces.push(itemPieces)
            
            })

            // console.log(` activeModuleName  ALL PARTES Y PIEZAS  JSON: values  ${JSON.stringify(allPieces)} : *-*Viewer.vue`)
            // console.log(` activeModuleName  ALL PARTES  index:${key} JSON: values  ${JSON.stringify(partesJSON)} : *-*Viewer.vue`)
 
            // allPartsLoad[key].partes.tapacantos = {}
            // let partes   = JSON.stringify(allPartsLoad[key].partes)

            // ////////////////////////////////////////////////////
            
           if (moduloId >= 100) {
              indexA++
           }else{
               indexM++
           }

            let modAbreviatura  = moduloId >= 100 ? 'A' + indexA :'M' + indexM            
            
            const newData = {

                    moduloId,
                    modName,                    
                    modAbreviatura,
                    roomEditor,
                    showOnly,
                    visible,
                    pieces:allPieces
                    
                    }

            modulosLoad.push(newData)
        }

      // return modulosLoad
      // console.log(` activeModuleName  ModuleLoad: values  ${JSON.stringify(modulosLoad)} : *-*Viewer.vue`)
    
      // la opcion de prioridad el el check 
        // la opcion secundaria el el eye si no hay check 
        let datos              = modulosLoad
        let visibleShowOnly    = ''
        let visibleEyes        = ''
        let countShowOnly      = 0 
        let allIndicadorModule = modulosLoad
        

        datos.forEach(element => {
           // console.log(` element.showOnly: ${JSON.stringify(element)}`)
          
          if(element.showOnly == 'true' && element.moduloId < 100){
              countShowOnly++          
              visibleShowOnly = visibleShowOnly.concat(element.modAbreviatura,' ')  
          }  
          
          if(element.visible == 'true' && element.moduloId < 100){
              visibleEyes = visibleEyes.concat(element.modAbreviatura,' ')            
          }  

        })

          // console.log(`END visibleShowOnly: ${visibleShowOnly}`)
          // console.log(`END visibleEyes: ${visibleEyes}`)
          // console.log(`Totlal de check  countShowOnly: ${countShowOnly}`)
          // let result = countShowOnly == 0  ? {folder:visibleEyes, description:descEyes, folderGeneral:this.folderGeneral} : {folder:visibleShowOnly, description:descShowOnly,folderGeneral:this.folderGeneral}   
          let result = countShowOnly == 0  ? visibleEyes :visibleShowOnly


            let viewCheck = countShowOnly == 0  ? false : true
            
            // crea indicadores para ambientes y modulos
             // this.$store.commit('setIndicadorModule', allIndicadorModule) // crea error al cargo los proyectos    
             
            // console.log(" Actualizar indicadorModule  activeModuleName() ->  (this.$store.state.viewer3d.indicadorModule) *-Viewer.vue")
            this.$store.state.viewer3d.indicadorModule =  {viewCheck,  allIndicadorModule}

            // crea los valores para los indicadores de part 
          this.moduleActive = result

         return result



    }




  }
}
</script>

<style scoped>
  .card {
    width: 100%;
  }
  .viewer {
    height: 100%;
  }
  .viewerDetails {
    position: absolute;
  }
  .loading-text {
    font-weight: 900;
    font-size: 2rem;
    color: #0062CC
  }
</style>

<style>
  canvas:focus {
    outline: none !important;
  }
</style>
