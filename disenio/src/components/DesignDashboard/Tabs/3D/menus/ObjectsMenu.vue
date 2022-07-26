<template>
  <div class="card container-objects">
    <div class="card-body">
        <b-tabs content-class="mt-3">
            <b-tab title="Piezas">
              <b-container  fluid class="modulo_scroll">
                <div class="ma-0 pa-0 col-12"
                        style="background-color: #EFEFEF ; border-radius: 0.5rem">

                      <div class="row">
                          <div class="col-9 ma-0 pa-0">
                              <h6>
                                Enviar imagen a general
                              </h6>
                          </div>
                          <div class="col-3 text-end ma-0 pa-0">
                              <b-form-checkbox v-model="folderGeneral" @change="createFolder"  :checked="this.folderGeneral"
                                  name="check-button" switch />
                          </div>
                      </div>
                  </div>


                <ToggleRow
                  v-for="(module, index) of modules"
                  :key="index"
                  :module="module"
                  @moduleClicked="selectModule"
                  @createFolder="createFolder"
                />
                <ToggleRowCad
                  v-for="(grupo, index) of listCad"
                  :key="index"
                  :count="index"
                  :grupo="grupo"
                  @moduleClicked="selectModule"
                  @createFolder="createFolder"
                />
                <span v-if="test">
                  <!-- 
                    / modules List : <code>{{moduleList}}</code>                   
                    modules List : <code>this.$store.getters.getModulesList</code>
                    modules: <code>{{modules}}</code>
                     loadModule: <code>{{loadModule}}</code> -->
                </span>
              </b-container>
            </b-tab>
            <b-tab title="Habitacion">
                <b-container class="modulo_scroll">
                  <PanelRoom />
                </b-container>
            </b-tab>
        </b-tabs>
    </div>    
  </div>
</template>
<script>
import PanelRoom from '../panels/PanelRoom.vue'
import ObjectMenu from './ObjectMenu.vue'
import ObjectPanel from '../panels/ObjectPanel.vue'
import ToggleRow from '../utils/ToggleRow.vue'
import ToggleRowCad from '../utils/ToggleRowCad.vue'
import { EventBus } from '../utils/event-bus.js'

export default {
  name: 'ObjectsMenu',
  components: {
    PanelRoom,
    ObjectMenu,
    ObjectPanel,
    ToggleRow,
    ToggleRowCad,
  },
  data () {
    return {
      test:false,
      folderGeneral:false,
      visible: true,
      expanded: false,
      object: null,      
    }
  },

  created() {
    this.createFolder()
  },

  computed: {
   
    listCad:{
      get(){
        var data = this.$store.getters.getCadGrupos3D;
        if(data.grupos){
          return data.grupos;
        }else{
          return [];
        }
      }
    },
    loadModule(){
        let modulos = []      

        const allParts =this.modules
        let indexM = 0  // index modulo
        let indexA = 0  // index modulo Ambiente

        for (var key in allParts) {
            //  console.log('key :'+ key);
            // console.log(key + ' ' + allParts[key]);
            // console.log(` valores : ${JSON.stringify(allParts[key])}`)
            let moduloId   = parseInt(JSON.stringify(allParts[key].moduleId))
            let modName    = JSON.stringify(allParts[key].moduleName)
            let roomEditor = JSON.stringify(allParts[key].isRoomEditor)
            let showOnly   = JSON.stringify(allParts[key].showOnly)
            let visible    = JSON.stringify(allParts[key].visible)
            //  return this.$store.getters.selectedModule.settings.description;
            // console.log(` valores  Modulo ID: ${moduloId}`)   
            // console.log(` valores showOnly: ${showOnly}`)
            // console.log(` valores roomEditor: ${roomEditor}`)
            
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
                    visible
                    }

            modulos.push(newData)
        }

      return modulos
    },


   
   // modulos de ambientes y modulos normales para las descripciones
    moduleList(){
        return this.$store.getters.getModulesRotacion
    },

    modules () {
      let modulos =  {}
      const parts = this.$store.getters.getPartList || []
      const roomEditorParts = this.$store.getters.getRoomEditorPartList || []
      
      roomEditorParts.map(part => {
        part.isRoomEditor = true
        return part
      })

      const allParts = parts.concat(roomEditorParts)

      // console.log(allParts)

      allParts.forEach((oldPart) => {
        const moduleId = oldPart.Module.split(' ')[1] || null
        const moduleIsVisible = Boolean(this.moduleIsVisibleByName(oldPart)._visible)
        const moduleIsShowOnly = Boolean(this.moduleIsShowOnlyByName(oldPart))

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
          elementId: oldPart.elementId
        }

        modulos[`Modulo ${moduleId}`].pieces.push(newPart)
      })

      //console.log(modulos)

      for(const prop in modulos){
        let cajones = []
        let puertas = []

        let indexCajon = 0, indexPuerta
        modulos[prop].pieces = modulos[prop].pieces.filter( (piece) => {
          
          if (piece.name.startsWith('Cajon')){
            indexCajon = cajones.push(piece) - 1
            return false
          } 
          if (this.isPuerta(piece.name)){
            indexPuerta = puertas.push(piece) - 1
            return false
          } 
                   
      
          if(piece.name.includes('Base Cajon')
              || piece.name.includes('Frente Cajon')
              || piece.name.includes('Lat. Izq. Cajon')
              || piece.name.includes('Lat. Der. Cajon')
              || piece.name.includes('C/F Cajon')){
            if(!cajones[indexCajon].pieces) cajones[indexCajon].pieces = []
            cajones[indexCajon].pieces.push(piece)
            return false
          } 
          const cajon = cajones.find(c=>{
            
            return piece.name.includes(c.name)
          })
          if(cajon){
            cajon.pieces.push(piece)
            return false
          } 
          if(puertas[indexPuerta] && this.isPartOfPuerta(piece.name,puertas[indexPuerta].name)){
            if(!puertas[indexPuerta].pieces) puertas[indexPuerta].pieces = []
            puertas[indexPuerta].pieces.push(piece)
            return false
          } 
          puertas.map(p=>{
            
            if(piece.name.includes(p.name) || piece.name.includes(p.name.toLowerCase()) || this.isTapacantosOfPuerta(piece.name,p.name)){
              if(!p.pieces) p.pieces = []
              p.pieces.push(piece)
              return false
            }
          })
          
            
          return true
          

        })
        modulos[prop].pieces = cajones.concat(puertas,modulos[prop].pieces)
      }

      return modulos
    },
    selection () {
      return this.$store.state.viewer3d.selection
    }
  },
  methods: {
    isPuerta(name){
      return (
        name.startsWith('Puerta') && 
        !this.isPartOfPuerta(name)
      )
    },
    isPartOfPuerta(name,puertaName){
      return (
        (
          name.startsWith('Puerta') && 
          (
            (name.includes('(') 
            && name.includes(')')) || name.includes('I') || name.includes('D')
          )
        )
        ||
        (
          name.includes("puerta") || name.includes("Puerta")
          && (
            (
              name.startsWith("tapacantos") || name.startsWith("Tapacantos")
            )
            ||
            (
              name.startsWith("Riel") || name.startsWith("riel")
            )
          )
        )
        &&
        name.includes(puertaName)
        &&
        name.includes(puertaName.toLowerCase())

      )
    },
    isTapacantosOfPuerta(name,puertaName){
      return (
        name.includes(puertaName.toLowerCase())
      )
    },
    moduleIsVisibleByName (oldPart) {
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

    moduleIsShowOnlyByName (oldPart) {
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
    selectModule(value) {
        console.log(`selectModule --->moduleClicked`)        
        this.$emit('moduleClicked', value);
    },



    createFolder(){

        // la opcion de prioridad el el check 
        // la opcion secundaria el el eye si no hay check 
        let datos            = this.loadModule 
        let visibleShowOnly  = ''
        let descShowOnly     = ''
        let visibleEyes      = ''
        let descEyes         = ''
        let countShowOnly    = 0 
        
        datos.forEach(element => {

          if(element.showOnly == 'true' && element.moduloId < 100){
              countShowOnly++          
              visibleShowOnly = visibleShowOnly.concat(element.modAbreviatura,' ')  
              const listMaterial = this.moduleList.find(e => e.id ==   element.moduloId)
              descShowOnly  =  descShowOnly.concat(element.modAbreviatura, ' (',listMaterial.descripcion,') ')
             
          }
          
          if(element.visible == 'true' && element.moduloId < 100){
              visibleEyes = visibleEyes.concat(element.modAbreviatura,' ')            
              const listMaterial = this.moduleList.find(e => e.id ==   element.moduloId)             
              descEyes  =  descEyes.concat(element.modAbreviatura, ' (',listMaterial.descripcion,') ')
          }  

        })

          let result = countShowOnly == 0  ? {folder:visibleEyes, description:descEyes, folderGeneral:this.folderGeneral} : {folder:visibleShowOnly, description:descShowOnly,folderGeneral:this.folderGeneral}   
          console.log(`Folde: ${JSON.stringify(result)} *-*disenio/src/components/DesignDashboard/Tabs/3D/menus/ObjectsMenu.vue`)
          this.$store.commit('setSelectedFolder', result)  

          EventBus.$emit('reloadIndicadorModule')
   
         return result

    },


  }
}
</script>

<style>
.container-objects {
  height: 100%;
  font-size: 0.8rem;
}
.container-objects .card-body {
  padding: 0px;
}
td {
  cursor: pointer;
}
.subtable thead {
  display: none;
}

 .modulo_scroll{
      height: 60vh;
      overflow-y: scroll;
  }

  .modulo_scroll::-webkit-scrollbar {
      width: 8px;     /* Tamaño del scroll en vertical */
      height: 8px;    /* Tamaño del scroll en horizontal */
    }

     .modulo_scroll::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 4px;
    }
    .modulo_scroll::-webkit-scrollbar-thumb:hover {
      background: #b3b3b3;
      box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
    }

    .modulo_scroll::-webkit-scrollbar-thumb:active {
      background-color: #999999;
    }

</style>
