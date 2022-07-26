<template>
  <div class="row w-100 mx-0">
    <DesignToolbar
      :roomEditorEnabled="roomEditorEnabled"
      :disenio2dUrl="disenio2dUrl"
      :currentTab="currentTab"
      @select-tab="selectTab"
    />

    <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10 bhoechie-tab">

      <div
        v-if="currentTab === 'general'"
        class="bhoechie-tab-content"
        :class="currentTab === 'general' ? 'active' : ''"  
      >
        <TabGeneral/>
      </div>

      <div
        v-if="currentTab === 'modulo'"
        v-show="username"
        class="bhoechie-tab-content"
        :class="currentTab === 'modulo' ? 'active' : ''"        
      >      
        <TabModule />
      </div>

      <div
        v-if="currentTab === '3d'"
        class="bhoechie-tab-content"
        :class="currentTab === '3d' ? 'active' : ''" 
      >
        <Tab3D/>
      </div>      

      <div
        v-if="roomEditorEnabled && currentTab === 'ambiente'"
        class="bhoechie-tab-content"
        :class="currentTab === 'ambiente' ? 'active' : ''" 
      >
        <TabRoomEditor />
      </div>

      <div
        v-if="currentTab === 'mensajes'"
        class="bhoechie-tab-content"
        :class="currentTab === 'mensajes' ? 'active' : ''" 
      >
        <TabMessagesEditor />
      </div>

      <div
        v-if="currentTab === 'cad'"
        class="bhoechie-tab-content"
        :class="currentTab === 'cad' ? 'active' : ''" 
      >
        <TabDesignCAD />
      </div>

      <div
        v-if="currentTab === 'export'"
        :class="currentTab === 'export' ? 'active' : ''" 
        v-show="username"
        class="bhoechie-tab-content"
      >
        <TabFormExport />
      </div>

      <div
        v-if="currentTab === 'materiales'"
        :class="currentTab === 'materiales' ? 'active' : ''" 
        v-show="username"
        class="bhoechie-tab-content"
      >            
        <TabListadoMateriales />
      </div>

      <div
        v-if="currentTab === 'imagenes'"
        :class="currentTab === 'imagenes' ? 'active' : ''"
        v-show="username"
        class="bhoechie-tab-content"
      >
        <TabImagesAdmin />
      </div>

      <div
        v-if="currentTab === 'interactivePictures'"
        :class="currentTab === 'interactivePictures' ? 'active' : ''"
        v-show="username"
        class="bhoechie-tab-content"
      >
        <TabInteractivePicture />            
      </div>

      <div
        v-if="currentTab === 'sistema'"
        :class="currentTab === 'sistema' ? 'active' : ''"
        v-show="username"
        class="bhoechie-tab-content"
      >
        <TabFormAdvanced />
      </div>

    </div>
    <!--
      <Footer/>
    -->

  </div>
</template>

<script>
  import Vue from 'vue'
  import { HTTP } from '@/plugins/HTTP.js'
  import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

  import Footer from './layout/Footer'

  import DesignToolbar from './layout/DesignToolbar.vue'
  import TabGeneral from './Tabs/General/Index' 
  import TabModule from './Tabs/Module/Index'
  import Tab3D from './Tabs/3D/Index' 
  import TabRoomEditor from './Tabs/RoomEditor/Index'
  import TabDesignCAD from './Tabs/DesignCAD/Index'
  import TabMessagesEditor from './Tabs/MessagesEditor/Index'
  import TabListadoMateriales from './Tabs/ListadoMateriales/Index';
  import TabFormExport from './Tabs/FormExport/Index'    
  import TabImagesAdmin from './Tabs/ImagesAdmin/Index'
  import TabFormAdvanced from './Tabs/FormAdvanced/Index'
  import TabInteractivePicture from './Tabs/InteractivePicture/Index';
  import { EventBus } from "@/index";

  Vue.use(BootstrapVue)
  Vue.use(BootstrapVueIcons)

  export default {
    name: 'design',

    data () {
      return {
        roomEditorEnabled: true,
        currentTab: '3d',
        materiales: false,
        isloaded: false,
        token_project:null
      }
    },

    components: {
      Footer,
      DesignToolbar,
      TabGeneral,
      TabModule,
      Tab3D,
      TabRoomEditor,
      TabDesignCAD,
      TabMessagesEditor,
      TabListadoMateriales,
      TabFormExport,
      TabImagesAdmin,
      TabInteractivePicture,
      TabFormAdvanced,
    },
    computed: {
      in3d() {
        return this.$route.name === "3dviewer";
      },
      loadedProjectId: {
        get() {
          return localStorage.getItem("projectID") || undefined;
        },
        set(value) {
          localStorage.setItem("projectID", value);
        },
      },
      loadedProjectInfo() {
        return (
          "Proyecto: " +
          this.loadedProjectName +
          "\nCliente: " +
          this.$store.state.info.name +
          "\nMueble: " +
          this.$store.state.info.mueble +
          "\nCreado: " +
          localStorage.getItem("projectCreatedAt")
        );
      },
      loadedProjectName: {
        get() {
          return localStorage.getItem("projectName") || undefined;
        },
        set(value) {
          localStorage.setItem("projectName", value);
        },
      },
      showStatus3d() {
        return +localStorage.getItem("enable-status-3d");
      },
      status3d() {
        return this.$store.state.layout.errorsIn3d;
      },
    },
    methods: {
      selectTab (tab) {
        // console.log('tab:', tab)
        this.currentTab = tab
      },
      async fixVersions(){
         HTTP.post(`/api/proyecto-json/versions`,{
           token: this.token_project
         })
          .then((response) => {
            console.log(response.data.success)
          })
          .catch((response) => {
          console.log(response)
          });
      },
      createProject () {
        let data = {
          info: this.$store.state.info,
          rotacion: this.$store.getters.getModulesRotacion,
          moduleInfo: this.$store.getters.getModuleInfo,
          // parts: [
          //   ...JSON.parse(JSON.stringify(this.$store.getters.getPartList)),
          //   ...JSON.parse(JSON.stringify(this.$store.getters.getRoomEditorPartList))
          // ], 
          id_cliente: 21, // must be dynamic eventually
          id_proyecto: 18 // must be dynamic eventually
        }

        HTTP.post(`/api/3dviewer/save_parts`, {
          data
        }).then(result => {
          let resp = result.data.response

          this.$store.commit(
            'setGeneralInfo',
            {
              key: 'token_project',
              value: resp.token_project
            }
          )

        }).catch(result => {
          console.log(result)
        })
      },
      loadfrom(){
        localStorage.setItem("refreshLoad", true);
        this.$swal("Se perderán los cambios no guardados.", {
          title: "¿Desea cargar este proyecto?",
          icon: "warning",
          buttons: {
            cancel: "No",
            aceptar: {
              text: "Si",
              value: true,
            },
          },
        }).then((value) => {
          if (value) {
            const token = localStorage.getItem('token')
            const name = localStorage.getItem('user-name')
            const id = localStorage.getItem('user-id')
            const rol = localStorage.getItem('user-rol')
            const usuario = localStorage.getItem('usuario')
            const modulo = localStorage.getItem('modulo')
            localStorage.clear()
            localStorage.setItem('token', token)
            localStorage.setItem('user-name', name)
            localStorage.setItem('user-id', id)
            localStorage.setItem('user-rol', rol)
            localStorage.setItem('usuario', usuario)
            localStorage.getItem('modulo',modulo)
            this.proyectoLoad(this.$route.params.id);
          }
          this.$router.replace({
            params: { id: "" },
          });
        });
      },
      proyectoLoad(proyecto, template_loaded = true) {
        this.$noty.info("Cargando datos. Por favor, espere ...", {
          timeout: 3000,
        });
        const oldVuew = localStorage.vuex;
        localStorage.vuex = {};
        HTTP.get(`/api/proyecto-json/${proyecto}`)
          .then((response) => {
            if (response.data.proyecto) {
              this.setErrorsIn3d(undefined);
              localStorage.vuex = JSON.parse(response.data.proyecto.proyecto);
              this.loadedProjectName = response.data.proyecto.nombre;
              this.loadedProjectId = response.data.proyecto.id;
              localStorage.setItem(
                "projectCreatedAt",
                response.data.proyecto.created_at
              );

              localStorage.setItem("projectName", response.data.proyecto.nombre);
              localStorage.setItem("projectID", response.data.proyecto.id);
              localStorage.setItem("projectloaded", true);
              if (template_loaded) {
                window.localStorage.setItem("default_template_loaded", true);
              }
              this.isloaded = localStorage.getItem('projectloaded')

                location.reload();

            }
          })
          .catch((response) => {
            console.log(response)
            this.$noty.error("No se pudo cargar el proyecto");
            localStorage.vuew = oldVuew;
          });
      },
      setErrorsIn3d(errors) {
        this.$store.commit("setErrorsIn3d", errors);
      },
    },
    created () {
        this.$store.commit('configureElement')

        window.axios = HTTP

        HTTP.get(`/api/materiales/default`).then(async (response) => {
            const materiales = response.data.materiales
            if (!this.$store.state.general.materiales_add) {
            this.$store.commit('setGeneralProperty', { key: 'materiales_add', value: JSON.stringify(materiales.filter((m) => m.tipo_material_id === 1)) })
            }

            if (!this.$store.state.general.tapacantos_add) {
            this.$store.commit('setGeneralProperty', { key: 'tapacantos_add', value: JSON.stringify(materiales.filter((m) => m.tipo_material_id === 2)) })
            }

            if (!this.$store.state.general.herrajes_add) {
            this.$store.commit('setGeneralProperty', { key: 'herrajes_add', value: JSON.stringify(materiales.filter((m) => m.tipo_material_id === 3)) })
            }

            if (!this.$store.state.general.metales_add) {
            this.$store.commit('setGeneralProperty', { key: 'metales_add', value: JSON.stringify(materiales.filter((m) => m.tipo_material_id === 4)) })
            }
        })
    },
    mounted: function () {   

      EventBus.$on("loadfrom", (id)=>{
          var token = this.$store.getters.tokenize(id);
          this.$route.params.id = this.$store.getters.parseToken(token)
          this.loadfrom()
      });
      
      try {
        this.$store.dispatch("getColoresModuloDB").then((a)=>{
          this.$store.dispatch("getColorActivadoDB");
        });
      } catch (error) {
        
      }

      const params = this.$route.params
      if(params.link){
          var token = params.link
          this.$route.params.id = this.$store.getters.parseToken(token)
          this.loadfrom()
      }else{
        if(this.$route.params.id!=0 && localStorage.getItem('creating-project')!=1){
         
          var value =this.$route.params.id
              if(value==undefined){
                value= localStorage.getItem('projectID')
                if(value==undefined || value== null){
                  this.$router.push('/design-start');
                }else{
                  this.isloaded = localStorage.getItem('projectloaded')
                    if(!this.isloaded){
                      this.proyectoLoad(value)
                    }else{ 
                      var vuex = JSON.parse(localStorage.getItem('vuex'))
              this.token_project =vuex.info.token_project                
                      this.fixVersions()
                    }
                }
              }else{
                var proyectid= localStorage.getItem('projectID')
                if(proyectid==undefined || proyectid== null){
                  this.proyectoLoad(value)
                }
              }                  
          }else{
            //se verifica si se esta creando proyecto desde disenio 
            if(localStorage.getItem('creating-project')==1){
              // no hacer nada ya que entrara en el created del TopBarDisenioActions para generar el nuevo proyecto
            }else{
                if(this.$route.params.id==0){
                  this.createProject()
                }else{
                  this.$router.push('/design-start');
                }
            }
          }
      }
      
      


      console.log('___________DESIGN SYSTEM MOUNTED____________')
      this.$store.commit('setLayoutProperty', { key: 'ambienteEnabled', value: false })
      this.$store.commit('setLayoutProperty', { key: 'currentDesignSystemSection', value: 'modulo' })
    
      // verificar si el usuario ha hecho login  de no ser asi, enviarlo de vuelta al inicio
      if (!(localStorage.getItem('token') && localStorage.getItem('user-name'))) {
        this.$router.push('/')
        return
      }
    },
    computed: {
      username: {
        get () {
          return this.$store.state.info.username
        }
      },
      disenio2dUrl: {
        get () {
          return `${window.location.origin}/disenio2d/?user=${this.username}`
        }
      }
    }
}
</script>

<style scoped lang="scss">
/*  bhoechie tab */
div.bhoechie-tab-container{
  z-index: 10;
  background-color: #ffffff;
  padding: 0 !important;
  border-radius: 4px;
  -moz-border-radius: 4px;
  border:1px solid #ddd;
  margin-top: 20px;
  margin-left: 50px;
  -webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
  box-shadow: 0 6px 12px rgba(0,0,0,.175);
  -moz-box-shadow: 0 6px 12px rgba(0,0,0,.175);
  background-clip: padding-box;
  opacity: 0.97;
  filter: alpha(opacity=97);
}

div.bhoechie-tab-content{
  background-color: #ffffff;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
}

div.bhoechie-tab div.bhoechie-tab-content:not(.active){
  display: none;
}
.bhoechie-tab {
  max-width: 100%;
  width: 95vw;
  display: flex;
  flex: 1;
}
</style>
