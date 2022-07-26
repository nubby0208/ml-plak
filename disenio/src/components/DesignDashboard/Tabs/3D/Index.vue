<template>
  <b-container
    fluid
  >
    <b-row>
      <b-col
        cols="12"
        class="px-0 pt-0"
      >
        <MenuBar 
          @export-server-img="exportServerImg"
          @export-img="exportImg"
          @export-dae="exportDae" 
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col
        class="pl-0"
        cols="2"
      >
        <ObjectsMenu
          @moduleClicked="selectModule"
        />
      </b-col>
      <b-col
        cols="7"
        style="height: 75vh; top:-23.75px;"
      >

        <OpcionMiniVisorConfig
          :opciones="configOpciones"
          :textDefaut="getConfigOpciones"
          v-model="viewerConfigOpciones"
        />
        
        <Viewer
          ref="viewerContainer"
          :zoom="3"
          :allowLabelMessage="true"
        />
      </b-col>
      <b-col
        class="pr-0"
        cols="3"
      >
        <ObjectMenu />        
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import MenuBar from './menus/MenuBar.vue'
import ObjectsMenu from './menus/ObjectsMenu.vue'
import ObjectMenu from './menus/ObjectMenu.vue'
import Viewer from './Viewer.vue'
import OpcionMiniVisorConfig from '@/components/DesignDashboard/Tabs/3D/menus/OpcionMiniVisorConfig.vue'

const URL_BASE = process.env.BACKEND_BASE_URL

export default {
  name: 'App3DViewer',
  data(){
    return {
      viewerConfigOpciones: null,
    }
  },
  components: {
    ObjectsMenu,
    ObjectMenu,
    MenuBar,
    Viewer,
    OpcionMiniVisorConfig
  },
  mounted() {
    //console.log(">> Viewer 3D:")    
    //console.log(this.$store.state.viewer3d.viewer)
  },
  computed:{
    configOpciones(){
      return this.$store.getters.getOptionConfig3d.map(a=>{
        var temp = {};
        temp.text = a.name;
        temp.valor = a;
        return temp;
      });
    },
    getConfigOpciones(){
      return this.$store.getters.getSelectionConfig;
    },
  },
  watch:{
    viewerConfigOpciones(newValue){
      this.$store.commit('setSelectOptionConfig3d', newValue);
    }
  },
  methods: {
    exportImg () {
      this.$refs.viewerContainer.viewer.exportImage('image')
    },
    exportDae () {
      this.$refs.viewerContainer.viewer.exportToObjDAE('model.dae')
    },
    exportServerImg () {
      this.$refs.viewerContainer.saveImg()
       console.log('exportServerImg -> saveImg')
    },
    async saveProject () {
      // remover marcadores para permitir la exportacion
      this.$refs.viewerContainer.editor.mlPlakMarkers.detachMarkers()

      this.$refs.viewerContainer.viewer.exportToGLTF((glftContent) => {
        let editorExportedData = this.$refs.viewerContainer.editor.exportEditorData()
        editorExportedData.models = JSON.parse(JSON.stringify(this.$store.state.viewer3d.modules))
        let markersData = JSON.stringify(this.$refs.viewerContainer.editor.mlPlakMarkers.exportMarkers())
        let executeAfterGLTFParsing = function (gltf) {
          let d = { project_id: window.localStorage.getItem('projectID'),
            markers: markersData,
            editorData: JSON.stringify(editorExportedData),
            scene: gltf }

          fetch(URL_BASE + '/api/3dviewer/scene/create', {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(d)
          }).then(response => {
            this.$refs.viewerContainer.editor.mlPlakMarkers.attachMarkers()
          }).catch((error) => {
            console.log('error saving scene')
            console.log(error)
          })
        }
        this.$refs.viewerContainer.editor.viewer.exportToGLTF(executeAfterGLTFParsing)
      })
    },
    selectModule(value) {
      try {        
        this.$refs.viewerContainer.editor.selector.selectById(value.replace(' ','_'))
      }
      catch(err) {
        // nothing
      }      
    },    
  }
}
</script>

<style scoped>
.main-container {
  /* 56 pixel for the header*/
  height: calc(100vh - 96px);
}
#menu{
  height: 40px;
}
</style>
