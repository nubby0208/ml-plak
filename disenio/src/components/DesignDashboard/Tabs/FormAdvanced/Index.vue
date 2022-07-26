<template>
  <div>
    <vue-toastr ref="toastr"></vue-toastr>
    <div style="display:none" ref="configOptions" class="save-module-modal">
      <div>
        <h3>Guardar configuración</h3>
        <br/>
        <form style="text-align:left">
          <div class="form-group">
            <label for="module-config-name">Nombre del módulo</label>
            <input v-model="nameNewConfig" type="text" class="form-control modulo-save-name" id="module-config-name">
          </div>
        </form>
      </div>
    </div>

    <b-modal ref="loadConfig3DModal" hide-footer title="Listado de preajustes configuración">
      <div class="d-block text-center">
        <table class="table table-bordered" style="width: 100% !important;">
          <thead class="thead-light">
            <tr>
              <th class="text-center">Nombre</th>
              <th class="text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in configOpciones" :key="index">
              <td><a @click="setConfigOpcion(item)" class="config-elem config-elem-clickeable">{{ item.name }}</a></td>
              <td><button type="button" class="btn btn-sm btn-danger" @click="configDelete(item.id)">&#10006;</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-modal>
    
    <h1 class="pb-4">Configuración de Sistema</h1>
    <div 
      class="row justify-content-between"
    >
      <div
        class="col-5 col-md-offset-3 text-left"
      >
        <div class="row">
          <div class="col-md-6">
            <b-button style="width: 100%;" variant="outline-success" @click="descargarProyecto()">Descargar Proyecto</b-button>
          </div>
          <div class="col-md-6">
            <b-button style="width: 100%;" variant="outline-success" @click="subirProyecto()">Subir Proyecto</b-button>
          </div>
        </div>   
        <b-card class="text-left">
          <template #header>
            <h4 class="mb-0">Render 3D</h4>
          </template>
          <div
            class="row pb-2"
          >
            <div
              class="col-8"
            >
              Habilitar Wireframe (Bordes):
            </div>
            <div
              class="col-4"
            >
              <b-form-checkbox
                v-model="viewer3DConfig.enableWireframe"
                name="check-button"
                switch
                @change="update3dViewerConfig"
              />
            </div>
          </div>
          <div
            class="row pb-2"
          >
            <div
              class="col-8"
            >
              Habilitar Piezas:
            </div>
            <div
              class="col-4"
            >
              <b-form-checkbox            
                v-model="viewer3DConfig.enablePieces"
                name="check-button"
                switch
                @change="update3dViewerConfig"
              />
            </div>
          </div>
          <div
            class="row pb-2"
          >
            <div
              class="col-8"
            >
              Habilitar Materiales:
            </div>
            <div
              class="col-4"
            >
              <b-form-checkbox
              
                v-model="viewer3DConfig.enableTextures"
                name="check-button"
                switch
                @change="update3dViewerConfig"
              />
            </div>
          </div>
          <div
            class="row pb-2"
          >
            <div
              class="col-8"
            >
              Habilitar Iluminacion:
            </div>
            <div
              class="col-4"
            >
              <b-form-checkbox
                v-model="viewer3DConfig.enableLights"
                name="check-button"
                switch
                @change="update3dViewerConfig"
              />
            </div>
          </div>
          <div
            class="row pb-2"
          >
            <div
              class="col-8"
            >
              Habilitar Grid de Piso:
            </div>
            <div
              class="col-4"
            >
              <b-form-checkbox
                v-model="viewer3DConfig.showGrid"
                name="check-button"
                switch
                @change="update3dViewerConfig"
              />
            </div>
          </div>
          <div
            class="row pb-2"
          >
            <div
              class="col-8"
            >
              Tipo de Render Pass:
            </div>
            <div
              class="col-4 text-center"
            >
              <b-form-select
                v-model="viewer3DConfig.renderPassType"
                :options="renderPassOptions"
                @change="update3dViewerConfig"
              />

            </div>
          </div>        
          <div
            class="row pb-2"
          >
            <div
              class="col-8"
            >
              Tipo de Shader Pass:
            </div>
            <div
              class="col-4"
            >
              <b-form-select
                v-model="viewer3DConfig.shaderPassType"
                :options="shaderPassOptions"
                @change="update3dViewerConfig"
              />
            </div>
          </div>
        </b-card>
        <br>
        <b-button style="width: 100%;" variant="outline-success" @click="guardarConfig">Guardar configuración</b-button>
      </div>
      <div
        class="col-md-6 col-md-offset-3"
      >
        <div class="d-block text-center">
          <h3>Listado de preajustes configuración</h3>
        <table class="table table-bordered" style="width: 100% !important;">
          <thead class="thead-light">
            <tr>
              <th class="text-center">Nombre</th>
              <th class="text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in configOpciones" :key="index">
              <td><a @click="setConfigOpcion(item)" class="config-elem config-elem-clickeable">{{ item.name }} </a>{{item.id == $store.state.viewer3d.selectionOpcion.idsConfig.idConfig3d ? "(ACTIVADO)":""}}</td>
              <td><button type="button" class="btn btn-sm btn-danger" @click="configDelete(item.id)">&#10006;</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
    </div>

    <br>
    <br>

    <div class="row justify-content-between">
      <div class="col-md-6 col-md-offset-3">
        <b-card class="text-left">
          <template #header>
            <h4 class="mb-0">Colores modulo</h4>
          </template>
          <div class="row pb-2">
            <div class="col-8">
              separator:
            </div>
            <div class="col-4">
              <input type="color" id="favcolor" name="favcolor" v-model="coloresComp.separator">
            </div>
            <br>
          </div>

          <div class="row pb-2">
            <div class="col-8">
              Bandeja:
            </div>
            <div class="col-4">
              <input type="color" id="favcolor" name="favcolor" v-model="coloresComp.bandeja">
            </div>
            <br>
          </div>
          <div class="row pb-2">
            <div class="col-8">
              Barral:
            </div>
            <div class="col-4">
              <input type="color" id="favcolor" name="favcolor" v-model="coloresComp.barral">
            </div>
            <br>
          </div>
          <div class="row pb-2">
            <div class="col-8">
              Cajon:
            </div>
            <div class="col-4">
              <input type="color" id="favcolor" name="favcolor" v-model="coloresComp.cajon">
            </div>
            <br>
          </div>
          <div class="row pb-2">
            <div class="col-8">
              Puerta:
            </div>
            <div class="col-4">
              <input type="color" id="favcolor" name="favcolor" v-model="coloresComp.puerta">
            </div>
            <br>
          </div>
          <div class="row pb-2">
            <div class="col-8">
              Doble Fondo:
            </div>
            <div class="col-4">
              <input type="color" id="favcolor" name="favcolor" v-model="coloresComp.dobleFondo">
            </div>
            <br>
          </div>
          <div class="row pb-2">
            <div class="col-8">
              Fondo Manual:
            </div>
            <div class="col-4">
              <input type="color" id="favcolor" name="favcolor" v-model="coloresComp.fondo_manual">
            </div>
            <br>
          </div>
          <div class="row pb-2">
            <div class="col-8">
              Fondo Manual:
            </div>
            <div class="col-4">
              <input type="color" id="favcolor" name="favcolor" v-model="coloresComp.dobleFondo_fondo_manual">
            </div>
            <br>
          </div>
          <div class="row pb-2">
            <div class="col-8">
              Puerta Corrediza:
            </div>
            <div class="col-4">
              <input type="color" id="favcolor" name="favcolor" v-model="coloresComp.puerta_corrediza">
            </div>
            <br>
          </div>
          <div class="row pb-2">
            <div class="col-8">
              Puerta Manual:
            </div>
            <div class="col-4">
              <input type="color" id="favcolor" name="favcolor" v-model="coloresComp.puerta_manual">
            </div>
            <br>
          </div>
        </b-card>
        <br>
        <br>
        <b-button style="width: 100%;" variant="outline-success" @click="guardarColores">Guardar configuración color</b-button>
      </div>

      <div
        class="col-md-6 col-md-offset-3"
      >
        <b-card class="text-left">
          <template #header>
            <h4 class="mb-0">Listado de preajustes colores</h4>
          </template>
          <div class="d-block text-center">
            <table class="table table-bordered" style="width: 100% !important;">
              <thead class="thead-light">
                <tr>
                  <th class="text-center">Nombre</th>
                  <th class="text-center">Proyecto</th>
                  <th class="text-center">Global</th>
                  <th class="text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in coloresList" :key="index">
                  <td>{{ item.name }}</td>
                  <td><b-button block  @click="setColorOpcionProyecto(item)" :variant="item.id == $store.state.layout.coloresModule.id ? 'primary':'outline-primary'">{{item.id == $store.state.layout.coloresModule.id ? "Seleccionado":"Seleccionar"}}</b-button></td>
                  <td><b-button block  @click="setColorOpcion(item)" :variant="item.id == colorPorDefecto ? 'primary':'outline-primary'">{{item.id == colorPorDefecto ? "Seleccionado":"Seleccionar"}}</b-button> </td>
                  <td><button type="button" class="btn btn-sm btn-danger" @click="colorDelete(item.id)">&#10006;</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-card>
      </div>
      
    </div>

    <br>
    <br>
    <br>
    <br>
    <!-- Modal Descargar Proyectos    --->
    <b-modal size="lg" ref="myModalEnviarProy" id="myModalEnviarProy" hide-footer title="Descargar Proyecto">
      <div style="text-align: right">
        <button
            class="btn btn-sm btn-success"
            @click="procesarDescargaProy()"
            title="Procesar..."
            >
            Procesar...
        </button> 
      </div>
      <table class="table table-striped "> 
        <thead class="thead-light">
          <tr>
            <th>
              Descripción
            </th>
            <th style="width: 20%; text-align: center">
              Descargar
            </th>
          </tr>
        </thead>
        <tbody>  
          <tr v-if="urls == null">
            <td class="text-center" colspan="3">
              No hay archivos disponibles para descargar...
            </td>
          </tr>
          <template v-if="urls != null">
            <tr>
              <td class="text-center">
                Proyecto {{proyName}}
              </td>
              <td class="text-center">
                <button
                    class="btn btn-sm btn-primary"
                    @click="downLoad(urls['proy'])"
                    title="Ver documento"
                  >
                    <font-awesome-icon icon="file"></font-awesome-icon>
                  </button>
              </td>
            </tr>
            <tr>
              <td class="text-center">
                Action Notes
              </td>
              <td class="text-center">
                <button
                    class="btn btn-sm btn-primary"
                    @click="downLoad(urls['action_notes'])"
                    title="Ver documento"
                  >
                    <font-awesome-icon icon="file"></font-awesome-icon>
                  </button>
              </td>
            </tr>
            <tr>
              <td class="text-center">
                Medición Instalación
              </td>
              <td class="text-center">
                <button
                    class="btn btn-sm btn-primary"
                    @click="downLoad(urls['medicion_instalacion'])"
                    title="Ver documento"
                  >
                    <font-awesome-icon icon="file"></font-awesome-icon>
                  </button>
              </td>
            </tr>
            <tr>
              <td class="text-center">
                Capacidad Producción Proyecto
              </td>
              <td class="text-center">
                <button
                    class="btn btn-sm btn-primary"
                    @click="downLoad(urls['capacidad_produccion'])"
                    title="Ver documento"
                  >
                    <font-awesome-icon icon="file"></font-awesome-icon>
                  </button>
              </td>
            </tr>
          </template>
        </tbody>  
      </table>              
      <div class="overflow-auto">
        <div class="read-me-footer">
          <button
            type="button"
            class="btn btn-sm btn-secondary"
            data-dismiss="modal"
           @click="closeProyXDescargar()"
          >
            Cerrar
          </button>
        </div>
      </div>
    </b-modal>
    <!-- Modal Subir Proyectos    --->
    <b-modal size="lg" ref="myModalSubirProy" id="myModalSubirProy" hide-footer title="Subir Proyecto">
      <form @submit.prevent="procesarSubirProyecto" enctype="multipart/form-data">
      <div style="text-align: right">
        <input type="submit" class="btn btn-sm btn-primary" value="Procesar...">
      </div>
      <table class="table table-striped "> 
        <thead class="thead-light">
          <tr>
            <th>
              Descripción
            </th>
            <th style="width: 20%; text-align: center">
              Subir
            </th>
          </tr>
        </thead>
        <tbody>  
            <tr>
              <td class="text-center">
                <label><b>Proyecto:</b></label>
                <b-form-input
                  id="formLoad.proyname"
                  type="text"
                  v-model="formLoad.proyname"
                  placeholder="Nuevo Nombre del Proyecto (Opcional)."
                ></b-form-input>
              </td>
              <td class="text-center">
                <input
                  id="formProy"
                  ref="formProy" 
                  type="file"
                  v-on:change="getFileProy($event)"
                  required
                >
              </td>
            </tr>
            <tr>
              <td class="text-center">
                Action Notes
              </td>
              <td class="text-center">
                <input
                  id="formNotes"
                  ref="formNotes" 
                  type="file"
                  v-on:change="getFileNotes($event)"
                >
              </td>
            </tr>
            <tr>
              <td class="text-center">
                Medición Instalación
              </td>
              <td class="text-center">
                <input
                  id="formMedInst"
                  ref="formMedInst" 
                  type="file"
                  v-on:change="getFileMedInst($event)"
                >
              </td>
            </tr>
            <tr>
              <td class="text-center">
                Capacidad Producción Proyecto
              </td>
              <td class="text-center">
                <input
                  id="formProd"
                  ref="formProd" 
                  type="file"
                  v-on:change="getFileProd($event)"
                >
              </td>
            </tr>
        </tbody>  
      </table>              
      <div class="overflow-auto">
        <div class="read-me-footer">
          <button
            type="button"
            class="btn btn-sm btn-secondary"
            data-dismiss="modal"
           @click="closeProyXSubir()"
          >
            Cerrar
          </button>
        </div>
      </div>
      </form>
    </b-modal>
  </div>
</template>
<script>
import { getShaderPassOptions, getRenderPassOptions } from '../3D/classes/viewer.js'
import VueToastr from "vue-toastr";
import { HTTP } from "@/index.ts";
export default {
  components: {
    VueToastr,
  },
  data () {
    return {
      proyName: '',
      urls:null,
      nameNewConfig:null,
      viewer3DConfig: {
        // enablePieces: true,
        // enableWireframe: true,
        // enableTextures: true,
        // renderPassType: 'SSAARenderPass',
        // shaderPassType: 'SAOPass',
        // enableLights: true,
        // showGrid: false
      },
      formLoad: {
        id: 0,
        proyname:'',
        proyfile:'',
        prodfile:'',
        medinstfile:'',
        notesfile:'',
      },
    }
  },
  mounted: function () {
    this.$store.dispatch('getColoresModuloDB').then((a) => {
      console.log(a);
    });
    this.$store.dispatch('getConfig3dAll').then((a) => {
      console.log(a);
    });
    this.getProyName()
  },
  methods: {
    getFileProd(event) {
      this.formLoad.prodfile = event.target.files[0];
    },

    getFileMedInst(event) {
      this.formLoad.medinstfile = event.target.files[0];
    },
    
    getFileNotes(event) {
      this.formLoad.notesfile = event.target.files[0];
    },

    getFileProy(event) {
      this.formLoad.proyfile = event.target.files[0];
    },

    async procesarSubirProyecto() {
      this.$noty.success('¡Iniciando carga!');
      console.log("Procesar Subir Proyecto: ", this.formLoad);
      let formLoadProyecto = new FormData();
      for (let key in this.formLoad) {
        formLoadProyecto.append(key, this.formLoad[key]);  
      }
      try{
        let result = await HTTP.post("/api/proyecto-json/subirproy",formLoadProyecto);
        if (result) {   
            this.$refs.toastr.s("Proyecto cargado.");
        }
        else {
          this.$refs.toastr.e("ERROR: Verifique por favor...");  
        }
      } catch (error) {
        /*if (typeof error.response != "undefined") {
          if (typeof error.response.data.errors != "undefined") {
              if (typeof error.response.data.errors.proyfile != "undefined") {
                this.$refs.toastr.e("ERROR: " + error.response.data.errors.proyfile[0]);
                return;
              }
              if (typeof error.response.data.errors.proyname != "undefined") {
                this.$refs.toastr.e("ERROR: " + error.response.data.errors.proyname[0]);
                return;
              }
              if (typeof error.response.data.errors.notesfile != "undefined") {
                this.$refs.toastr.e("ERROR: " + error.response.data.errors.notesfile[0]);
                return;
              }
              if (typeof error.response.data.errors.prodfile != "undefined") {
                this.$refs.toastr.e("ERROR: " + error.response.data.errors.prodfile[0]);
                return;
              }
              if (typeof error.response.data.errors.medinstfile != "undefined") {
                this.$refs.toastr.e("ERROR: " + error.response.data.errors.medinstfile[0]);
                return;
              }
          }
        } */     
        console.log(error);
        this.$refs.toastr.e(error);
      }  
    },

    getProyName() {
      HTTP.get("/api/proyecto-json/" + this.proyId)
        .then((result) => {
          if (result.data != null) {
            this.proyName = result.data.proyecto.nombre;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async subirProyecto() {
      this.formLoad.proyname = ""
      this.formLoad.proyfile = ""
      this.formLoad.prodfile = ""
      this.formLoad.notesfile = ""
      this.formLoad.medinstfile = ""
      this.$refs.myModalSubirProy.show();
    },
    closeProyXSubir() {
      this.$refs.myModalSubirProy.hide();
    },
    async descargarProyecto() {
      this.urls = null
      this.$refs.myModalEnviarProy.show();
    },
    closeProyXDescargar() {
      this.$refs.myModalEnviarProy.hide();
    },
    async procesarDescargaProy(){
        this.$noty.success('¡Iniciando descarga!');
        this.urls = null
        await HTTP.get("/api/proyecto-json/descargarproy/" + this.proyId)
        .then((result) => {
          if (result!== null) {
             if (result.data.urls != null) {
                 this.urls = []
                 this.urls['proy'] = result.data.urls.proy
                 this.urls['action_notes'] = result.data.urls.action_notes
                 this.urls['medicion_instalacion'] = result.data.urls.medicion_instalacion
                 this.urls['capacidad_produccion'] = result.data.urls.capacidad_produccion
             }    
             console.log("Urls: ",this.urls);
             this.$noty.success('¡Descarga generada!');
          }
        })
        .catch((error) => {
          console.log(error);
          this.$noty.error('¡Error en la descarga!');
        });
    },
    async downLoad(docUrl) {
      if(docUrl){
        window.open(docUrl,'_blank');
      }
    },
    guardarColores(){
      this.$refs.configOptions.style.display = 'block';
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
      }).then(a=>{

        if(a == a && this.nameNewConfig){
          this.$store.dispatch("addColoresModuloDB", {
            nombre: this.nameNewConfig,
            colores: this.coloresComp,
          }).then(ab=>{
            this.$store.dispatch('getColoresModuloDB');
          });
          
          this.nameNewConfig = null;
        }
        
      });
    },
    setColorOpcion(valor){
      // console.log(valor);
      this.$store.commit("setColores", valor);
    },
    setColorOpcionProyecto(valor){
      this.$store.commit("setColoresProyecto", valor);
    },
    guardarConfig(){
      this.$refs.configOptions.style.display = 'block';
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
      }).then(a=>{

        if(a == a && this.nameNewConfig){
          this.$store.commit('addConfigActual', this.nameNewConfig);
          this.nameNewConfig = null;
        }
        
      });
    },
    configDelete (id) {
      let self = this

      this.$swal('No podrá volver a acceder a dicha configuración, y los proyectos establecidos con este ajuste cambiaran a default', {
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
        if(id == 1){
          
        }
        if (value === true) {
          self.$noty.info('Eliminando configuración...')
          HTTP.delete(`/api/configuracion/${id}`).then((response) => {
            if (response.data.success) {
              this.$store.dispatch('getConfig3dAll');
              self.$noty.success('¡Configuración eliminada con éxito!')
            }
          })
        } else {
          this.close()
        }
      })
    },
    colorDelete (id) {
      let self = this

      this.$swal('No podrá volver a acceder a dicha configuración, y los proyectos establecidos con este ajuste cambiaran a default', {
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
        if(id == 1){
          
        }
        if (value === true) {
          self.$noty.info('Eliminando configuración...')
          HTTP.delete(`/api/configuracion/${id}`).then((response) => {
            if (response.data.success) {
              try {
                this.$store.dispatch("getColoresModuloDB").then((a)=>{
                  this.$store.dispatch("getColorActivadoDB");
                });
              } catch (error) {
                
              }
              self.$noty.success('¡Configuración eliminada con éxito!')
            }
          })
        } else {
          this.close()
        }
      })
    },
    cargarConfig(){
      this.$refs.loadConfig3DModal.show();
    },
    update3dViewerConfig (){
      this.$store.commit('setConfig', this.viewer3DConfig)
    },
    initRoomEditor: function () {
      localStorage.setItem('enable-room-editor', 1)
      // location.reload()
    },
    setConfigOpcion(item){
      this.$refs.loadConfig3DModal.hide();
      this.$store.commit('setSelectOptionConfig3d', item);
    },
    addConfig(){
      this.$store.commit('addConfigActual', this.nameNewConfig);
    }
  },
  computed: {
    proyId: {
      get() {
        return localStorage.getItem("projectID") || undefined;
      },
      set(value) {
        localStorage.setItem("projectID", value);
      },
    },
    coloresComp:{
      get(){
        return this.$store.getters.getColoresModulo;
      },
      set(value){
      }
    },
    coloresList(){
      return this.$store.getters.getListColores;
    },
    colorPorDefecto(){
      return this.$store.getters.getColorPorDefecto;
    },
    configOpciones(){
      return this.$store.getters.getOptionConfig3d;
    },
    getConfigOpciones(){
      return this.$store.getters.getSelectionConfig;
    },
    shaderPassOptions () {
      return getShaderPassOptions()
    },
    renderPassOptions () {
      return getRenderPassOptions()
    },
    moduleCount () {
      return this.$store.getters.moduleCount
    },
    moduleSettings () {
      return this.$store.getters.selectedModule.settings
    },
    roomEditor: {
      get () {
        const value = localStorage.getItem('enable-room-editor')
        if (value === null) {
          this.initRoomEditor()
          return true
        }
        return +value === 1
      },
      set (value) {
        localStorage.setItem('enable-room-editor', value ? 1 : 0)
        if (!value) {
          this.$store.commit('resetAll', true)
        }
        // location.reload()
      }
    },
    status3d: {
      get () {
        const value = localStorage.getItem('enable-status-3d')
        if (value === null) {
          return 1
        }
        return +value
      },
      set (value) {
        localStorage.setItem('enable-status-3d', value)
        // location.reload()
      }
    },
    selectedModuleId: {
      get () {
        return this.$store.getters.selectedModuleId + 1
      },
      set (value) {
        this.$store.commit('selectModule', Number(value - 1))
      }
    }
  },
  watch:{
    "$store.state.viewer3d.config":function(newValue) {
      this.viewer3DConfig = newValue;
    }
  }
}
</script>
<style scoped lang="scss">
  td {
    text-align: left;
  }
  .label {
    cursor: pointer;
  }
  input[type="checkbox"] {
    position: relative;
    top: 1px;
  }
  .separator-row {
    height: 40px;
    font-weight: bold;
  }
</style>