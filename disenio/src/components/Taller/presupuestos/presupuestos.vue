<template>
  <div id="app-asistencia-list" class="page-contents">
    <vue-toastr ref="toastr"></vue-toastr>
    <notification></notification>
    <b-overlay :show="loadingPage" opacity="0.6" spinner-variant="primary">
      <div class="row form-group">
        <div class="col-md-3 col-lg-2">
          <b-form-input v-model="searchParam" placeholder="Filtrar por nombre" type="text" debounce="500" @update="filterByName"></b-form-input>
        </div>
        <div class="col-md-3 col-lg-2">
          <b-form-select v-model="selectedUsuario"   @change="filterByUsuario"
             :options="usuarios"   value-field="usuario"     text-field="usuario">
            <template #first>
              <b-form-select-option value="">Filtrar por usuario</b-form-select-option>
            </template>
          </b-form-select>
        </div>

        <div class="col-md-3 col-lg-2">
          <b-form-select v-model="selectedSeguimiento"   @change="filterBySeguimiento"
             :options="listSeguimiento"  value-field="id" text-field="descripcion">
            <template #first>
              <b-form-select-option value="">Filtrar por seguimiento</b-form-select-option>
            </template>
          </b-form-select>
        </div>

        <div class="col-md-3 col-lg-2" v-if="selected.length">
          <button class="btn btn-danger" @click="deletePresuspuestos">Eliminar selecionados</button>
        </div>
        <div class="col-md-3 col-lg-2">
          <a class="btn btn-info" :href="$router.resolve({ name: 'Resultados Secuencia Clientes'}).href" >Resultados Secuencia Clientes</a>
        </div>
      </div>  

      <template>
      <div style="height: 450px;">
        
        <b-table  id="presupuestos"  ref="selectableTable"  :items="presupuestos" responsive  @row-selected="onRowSelected"
            striped  small :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :fields="fields" 
            style="background-color: white" no-local-sorting selectable no-select-on-click
            :select-mode="'multi'" :tbody-tr-class="rowClass" @sort-changed="$nextTick(() => traerPresupuestos())"> 

        <template #table-colgroup="scope">
          <col v-for="field in scope.fields"  :key="field.key" 
            :style="{ width: field.key === 'fecha' ? '120px' : '180px' }" >
        </template>

          <!-- 
            -- https://developpaper.com/bootstrap-vue-fixed-header/ 
         
          <b-table  id="presupuestos"  ref="selectableTable"  :items="presupuestos"   :fields="fields"
            responsive Small sticky-header="true"  selectable   striped    no-local-sorting 
              style="background-color: white" 
             @row-selected="onRowSelected"   :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
            :select-mode="'multi'" :tbody-tr-class="rowClass" @sort-changed="$nextTick(() => traerPresupuestos())" >
            --> 
          <template #cell(selected)="{ rowSelected, index }">
            <b-form-checkbox :v-model="rowSelected" @change="selectRow($event, index)">
            </b-form-checkbox>
          </template>
          <template #cell(nombre)="data">
            <b class="text-center">{{ data.item.nombre }}</b>
          </template>

          <template #cell(telefono)="data">
            <b class="text-center" @click="waMe(data.item.telefono)">{{ data.item.telefono }}</b>
          </template>

          <template #cell(direccion)="data">
            <b-button v-b-tooltip.hover.topright :title="data.item.direccion" size="sm" variant="outline-secondary">
              {{data.item.direccionLeng}}
            </b-button>
          </template>
          
          <template slot="cell(action)" slot-scope="data">
           <b class="text-center"><a @click="redirectLink(data.item.id, data.item)">Link</a></b>
          </template>
          <template #cell(usuario)="data">
            <b class="text-center">{{ data.item.usuario }}</b>
          </template>

          <template #cell(comentarioResumen)="data">
            <b-button v-b-tooltip.hover.topright :title="data.item.comentarioResumen" size="sm" variant="outline-secondary">
              {{data.item.contentarioResumenLeng}}
            </b-button>
          </template>

          <template #cell(nota)="data">
            
              <button class="btn btn-sm btn-primary" @click="verNota(data.item.nombre, data.item.token)">
                 <b-icon icon="card-text" aria-hidden="true"></b-icon>
              </button>
            </template>
        
           <template #cell(img)="data">
              <button class="btn btn-sm btn-primary" @click="verImg(data.item.project_id, data.item.token)">
             <b-icon icon="image" aria-hidden="true"></b-icon>
              </button>
          </template>

          <template #cell(monto)="data">
            <b class="text-right">${{data.item.precioFinalClasica }} / ${{data.item.precioFinalPremium}} </b>
          </template>


          <template #cell(asignado_id)="data">
              <b-form-select v-model="data.item.asignado_id" @change="updateCampo(data.item.pres_id,'asignado', data.item.asignado_id)" 
              :options="usuarios" value-field="id" text-field="nombre_completo" size="sm" >
              </b-form-select>          
          </template>

          <template #cell(dificultad_id)="data">
              <b-form-select v-model="data.item.dificultad_id" @change="updateCampo(data.item.pres_id,'dificultad', data.item.dificultad_id)"  
                 :options="listDificultad" value-field="id" text-field="descripcion" size="sm" >
              </b-form-select>          
          </template>

          <template #cell(prioridad_id)="data">
            <b-form-select v-model="data.item.prioridad_id"  @change="updateCampo(data.item.pres_id,'prioridad', data.item.prioridad_id)"  
              :options="listPrioridad" value-field="id" text-field="descripcion" size="sm">
            </b-form-select>
          </template>

          <template #cell(seguimiento_id)="data">
              <b-form-select v-model="data.item.seguimiento_id"  @change="updateCampo(data.item.pres_id,'seguimiento', data.item.seguimiento_id)"  
                :options="listSeguimiento" value-field="id" text-field="descripcion" size="sm" >
              </b-form-select>
           </template>
          
          <template #cell(economia_id)="data">
             <b-form-select v-model="data.item.economia_id"  @change="updateCampo(data.item.pres_id,'economia', data.item.economia_id)" 
                :options="listEconomia" value-field="id" text-field="descripcion" size="sm" >
              </b-form-select>
          </template>


          <template #cell(fecha)="data">            
            <b class="text-center">{{$moment(data.item.fecha).format("DD-MM-YYYY")}}</b>
          </template>
            
          <template #cell(fecha_cotizacion)="data">
            <b class="text-center" v-if="data.item.fecha_cotizacion != null">{{$moment(data.item.fecha_cotizacion).format("DD-MM-YYYY")}}</b>
          </template> 
     
          <template slot="cell(PDF)" slot-scope="data">
            <i class="fas fa-cloud-upload-alt"></i>
            <button class="btn btn-sm btn-primary" :disabled="!data.item.link" @click="verPdf(data.item.link)">
              <font-awesome-icon icon="file"></font-awesome-icon>
            </button>
          </template>
          
          <template slot="cell(PDFLink)" slot-scope="data">
            <button class="btn btn-sm btn-primary" :disabled="data.item.estado == 1" @click="CopyPDFURL(data.item)">
              <font-awesome-icon icon="link"></font-awesome-icon>
            </button>
          </template>

          <template #cell(enviar)="data">   
                
                <button class="btn btn-sm btn-primary"  @click="eventEnivar(data.item)" :disabled="(data.item.estado == 0  || data.item.estado == 3) ? false : true">
                  <font-awesome-icon icon="envelope"></font-awesome-icon>
                </button>
         
          </template> 
          
          <template #cell(estado)="data">
            <b-badge :class="'badge '+estadosClasses[data.item.estado]">
              {{ estadosNames[data.item.estado] }} {{(data.item.usuario_cotizando) ? 'por ' + data.item.usuario_cotizando : ''}}
            </b-badge>
            <!-- :class="data.item.estado == 1? 'badge-primary' : 'badge-success'" -->
          </template>
        </b-table>
  
        <div style="display: flex">
          <b-pagination v-model="currentPage"  :total-rows="pageLimit" :per-page="1"
              style="margin: auto; margin-top: 20px" aria-controls="presupuestos"
              @change="(page) => traerPresupuestos(page)">
          </b-pagination>
        </div>  
      </div>
      </template>
    </b-overlay>  
  
    <b-modal size="lg" ref="readMeModal" hide-footer title="Notas sobre este proyecto">
          <div class="overflow-auto">
            <mc-wysiwyg  v-model="readMe" :height="530"></mc-wysiwyg>
            <!--<div v-html="readMe" style="height:300px;"></div> -->  
            <div v-if="readMeObj" class="read-me-meta">
              <div class="created-at-meta">
                Creado: {{ readMeObj.createdAt }} por {{ readMeObj.createdBy }}
              </div>
              <div v-if="readMeObj.modifiedBy">
                Última modificación: {{ readMeObj.modifiedAt }} por
                {{ readMeObj.modifiedBy }}
              </div>
            </div>
            <div class="read-me-footer">  
              <button  type="button" class="btn-sm btn btn-success" @click="saveReadMe()">
                  Guardar
              </button>
              <button @click="closeReadMe()" type="button" class="btn btn-sm btn-default"  data-dismiss="modal">
                Cerrar
              </button>
              <!--
              <button type="button" class="btn btn-sm btn-danger eliminar-nota" @click="deleteReadMe()">
                Eliminar
              </button>            
              -->  
            </div>
          </div>
        </b-modal>





        <!-- IMAGENES  -->
        <b-modal size="lg" ref="imgModal" hide-footer title="Imagenes del Proyecto">
          <div class="overflow-auto">

          <div class="flex-1">               
            <div class="vue-lightbox modulo_scroll">
              <ul>
                <li :v-if="!noImages" v-for="i in images" :key="i.file" style="cursor:pointer;" class="mb-4">
                  
                  <div class="container">
                    <div class="row">
                      <div class="col align-self-start px-0 ">
                        <!--<img :id="i.file" @click="viewImg(i.src)"  width="250" height="150" :src="i.src" alt=""> -->
                        <img :id="i.file" width="300" height="200" :src="i.src" alt=""> 
                      </div>                    
                    </div>
                  </div>
                
                
                </li>
                <div v-if="noImages" class="spinner-wrapper">
                  <h3>El proyecto no posee imagenes.</h3>
                </div>

              </ul>

            </div>

              
              <div class="read-me-footer">            
                <button @click="closeImg()" type="button" class="btn btn-sm btn-default"  data-dismiss="modal">
                  Cerrar
                </button>              
              </div>

            </div>
          </div>  
        </b-modal>


  </div>
</template>

<script>
// import Vue from "vue";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import Vue from 'vue'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import presupuestoService from "./../Services/presupuestoService";
import usuarioService from '../Services/usuarioService'
import VueToastr from "vue-toastr";
import dJSON from "dirty-json";
import { count } from "rxjs/operators";
import VueNoty from 'vuejs-noty'
import swal from "sweetalert2";
import { McWysiwyg } from "@mycure/vue-wysiwyg";

import { HTTP } from '@/plugins/HTTP.js'
import { EventBus } from '@/components/DesignDashboard/Tabs/3D/utils/event-bus.js'

// disenio\src\components\DesignDashboard\Tabs\3D\utils\event-bus.js
// import { HTTP} from "./../../../index";
// fontawesome.library.add(brands, solid);
// Vue.component('FontAwesomeIcon', FontAwesomeIcon)
library.add(faFile);
library.add(faLink);
library.add(faEnvelope);



const PresupuestoService = new presupuestoService();
const UsuarioService = new usuarioService();

Vue.use(VueNoty, {
  theme: 'metroui'
})

export default {
  components: {
    VueToastr,
    FontAwesomeIcon,
    McWysiwyg,
  },
  data() {
    return {
      
      sortBy: "id",
      sortDesc: true,
      currentPage: 1,
      pageLimit: 1,
      presupuestosDb: [],
      presupuestos: [],
      isStaging: false,
      loadingPage: true,
      fields: [
        { key: "selected", label: "#", sortable: false },
        { key: "nombre", label: "Nombre", sortable: true },
        { key: "telefono", label: "Teléfono", sortable: false },
        { key: "direccion", label: "Dirección", sortable: false },
        { key: "action", label: "Link del Proyecto", sortable: false },
        { key: "usuario", label: "Usuario de recepción", sortable: true },
        { key: "comentarioResumen",label: "Comentario resumen", sortable: false},

        { key: "nota", label: "Nota", sortable: false },
        { key: "img", label: "IMG", sortable: false },       
        { key: "monto", label: "Monto Clásico/Premium", sortable: false },

        { key: "asignado_id", label: "Asignado", sortable: true },       
        { key: "dificultad_id",label: "Grado de Dificultad", sortable: true},
        { key: "prioridad_id",label: "Nivel de Prioridad", sortable: true},
        { key: "seguimiento_id",label: "Seguimiento", sortable: true},
        { key: "economia_id",label: "Economía", sortable: true},        

        { key: "fecha", label: "Fecha Presupuesto", sortable: true },
        { key: "fecha_cotizacion", label: "Fecha Cotización", sortable: true },
        { key: "PDF", label: "PDF", sortable: false },
        { key: "PDFLink", label: "PDF-Link", sortable: false },
        { key: "enviar", label: "Enviar", sortable: false },
        
        { key: "estado", label: "Estado", sortable: true },
      ],

      searchParam: "",
      usuarios: [],
      selectedUsuario: "",
      selectedSeguimiento: "",

      baseUrl: location.origin,
      selected: [],
      estadosClasses: [
        'badge-info',
        'badge-danger',
        'badge-warning',
        'badge-success',

      ],

      estadosNames: [
        "Listo para Enviar",
        "A cotizar",
        "Cotizando" ,
        "Envaido"
      ],

      listDificultad: [
        {id:0, descripcion:""},
        {id:1, descripcion:"Simple"},
        {id:2, descripcion:"Medio"},
        {id:3, descripcion:"Alto"},
        {id:4, descripcion:"Muy Alto"},
        
        ],

        listPrioridad: [
          {id:0, descripcion:""},
          {id:1, descripcion:"En espera de datos"},
          {id:2, descripcion:"Baja"},
          {id:3, descripcion:"Media"},
          {id:4, descripcion:"Alta"},
          {id:5, descripcion:"Muy Alta"},
        ],

        listSeguimiento: [
          {id:0, descripcion:""},
          {id:1, descripcion:"Perdido"},
          {id:2, descripcion:"Vendido"},
          {id:3, descripcion:"Interesado"},
        ],

        listEconomia: [
          {id:0, descripcion:""},
          {id:1, descripcion:"Modelo Económico"},
          {id:2, descripcion:"Nivel Medio"},
          {id:3, descripcion:"Estética, colores y herrajes"},
        ],

      // notas
      userAuthenticated: false,
      displayableUsername: "",
      readMe: undefined,
      readMeObj: undefined,
      
      imagesLoaded: false,
      noImages: true,
      images: [],
      imagesObj: [],

    };
  },
  mounted() {
    this.isStaging = window.location.href.includes("staging");
    //this._ngxUiService.start();
    this.traerPresupuestos();
    this.getUsers();
    this.initStore()
  },
  methods: {
    onRowSelected(items) {
      this.selected = items
    },
    newWindow(project) {
      const url = `/disenio/#/DesignCenter/0000000${project.project_id}00000`;
      window.open(
        !this.isStaging
          ? `http://staging.mlplak.com${url}`
          : `http://mlplak.com${url}`
      );
    },
    redirectLink(id, item){
      let user;
      try{
        user = JSON.parse(localStorage.getItem('usuario'))
      } catch (error) {
        console.log(error)
        return
      }
      const text = (item.usuario_cotizando) ? 'Ya hay un usuario cotizando' : ''
      swal({
        title: '¿Desea tomar esta cotización a su nombre?',
        text: text,
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      }).then((result) => {
        console.log(result)
        if (result.value == true) {
          // cambiar el estado
          PresupuestoService.update(item.pres_id, {
            usuario_cotizando: user.usuario,
            estado: 2,
          }).then(resp => {
            this.$noty.info('Se ha cambiado el estado del presupuesto')
            this.$router.push({ name: "DesignDashboard", params: { link: id  } });
            return
          })
        }
        if(result.dismiss == 'cancel')
          this.$router.push({ name: "DesignDashboard", params: { link: id  } });
      })
    },
    async traerPresupuestos(page = 1) {
      this.loadingPage = true;
      let result = await PresupuestoService.getAll(
        page,
        this.sortBy,
        this.sortDesc,
        this.searchParam,
        this.selectedUsuario,
        this.selectedSeguimiento,
        
      );

      // console.log(`Datos del Presupuestos: ${JSON.stringify(result.data)}`)
      let tmpPresupuestos = [];

      let m = 0;
      result.data.data.forEach((pres) => {
        try {

          //console.log(`Datos del Presupuestos: ${JSON.stringify(pres)}`)
          // console.log("contador ", m);
          //si i = -1 significa que no tiene comillas
          let i = pres.results.indexOf('"contacto":');
          let cliente;
          let comentarioResumen;
          let precioFinalClasica;
          let precioFinalPremium;  

          if (i == -1 && pres.results.indexOf('"contacto"') > 0) {
            console.log("if");
            let reemplazo = pres.results.substr(
              0,
              pres.results.indexOf('"contacto":')
            );
            reemplazo = pres.results.substr(0, pres.results.lastIndexOf(","));
            reemplazo = reemplazo + "}";
            let contacto = "";
            contacto = pres.results.substr(
              pres.results.indexOf('"contacto":') + 11,
              pres.results.length
            );
            pres.results = reemplazo;
            let resultado = JSON.parse(pres.results);
            resultado.contacto = contacto
              .toString()
              .substr(0, contacto.lastIndexOf("}"));
            cliente = resultado.cliente;
            comentarioResumen = resultado.comentarioResumen;
            precioFinalClasica = resultado.precioFinalClasica;
            precioFinalPremium = resultado.precioFinalPremium;  
          } else {
            //console.log("else");

            const resultado = JSON.parse(pres.results);
            // console.log(resultado)
            
            cliente = resultado.cliente;
            comentarioResumen = resultado.comentarioResumen;
            precioFinalClasica = resultado.precioFinalClasica;
            precioFinalPremium = resultado.precioFinalPremium;  
          }
          
          console.log(` FECHA : ${ pres.fecha}  FECHA COTIZACION: ${ pres.fecha_cotizacion}`)

          let presupuesto = {
            pres_id: pres.id,
            index: m,
            project_id: pres.project_id,
            token: pres.token,
            nombre: cliente.name,            
            telefono: cliente.phone,
            direccion: cliente.address,
            direccionLeng: cliente.address.substring(0, 10),
            mail: cliente.mail,
            comentarioResumen,
            contentarioResumenLeng : comentarioResumen.substring(0, 10),
            id: this.$store.getters.tokenize(pres.project_id),
            estado: pres.estado,
            fecha: pres.fecha,
            fecha_cotizacion: pres.fecha_cotizacion,
            pdf: pres.pdf,
            link:pres.pdflink,
            usuario: pres.usuario,
            usuario_cotizando: pres.usuario_cotizando,
            monto:0,
            precioFinalClasica,
            precioFinalPremium,  
            asignado_id :pres.asignado_id, 
            dificultad_id:pres.dificultad_id,
            prioridad_id: pres.prioridad_id,
            seguimiento_id: pres.seguimiento_id,
            economia_id: pres.economia_id     
          };
          tmpPresupuestos.push(presupuesto);
        } catch (error) {
          console.log("error", error);
          console.log("Error parsing: ", pres.results);
        }
        m++;
      });

      this.presupuestos = tmpPresupuestos;
      this.pageLimit = result.data.last_page;
      this.loadingPage = false;
      console.log(`DATOS DE PRESUPUESTO: ${JSON.stringify(tmpPresupuestos)}`)

    },
    
    
    initStore(){
      // el usuario esta autenticado si estos datos existen.
      // de igual manera cualquier llamado al api fallará si el token está inválidado.
      this.userAuthenticated =
        localStorage.getItem("token") &&
        localStorage.getItem("user-name") &&
        localStorage.getItem("user-id") &&
        localStorage.getItem("user-rol");

      if (this.userAuthenticated) {
        this.displayableUsername = localStorage.getItem("user-name");
      }

      EventBus.$on("userLoggedIn", (loginSuccesful) => {
        this.userAuthenticated = loginSuccesful;
        this.displayableUsername = localStorage.getItem("user-name");
      });

      EventBus.$on("userLoggedOut", () => {
        this.userAuthenticated = false;
        this.displayableUsername = "";
      });

    },
    verPdf(item) {

      if(item){
        window.open(item,'_blank')
      }
      
    },


      

    eventEnivar(item) {
      
      const text = `Proyecto ha enviar: ${item.project_id}, Nombre: ${item.nombre} `
      swal({
        title: '¿Desea cambiar el estado de la cotización a enviado ?',
        text: text,
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No', 
      }).then((result) => {
        console.log(result)
        if (result.value == true) {

           this.presupuestos[item.index].estado = 3
          // cambiar el estado
          PresupuestoService.updateEstado(item.pres_id, {
            estado: 3
          }).then(resp => {
            this.$noty.info('Se ha cambiado el estado del presupuesto')
            this.waMe(item.telefono)
            return
          })
        }
        if(result.dismiss == 'cancel')
          this.$noty.warning('No se realizo ningún estado');
      })
    },


    verNota(projectName, token_project) {
      // this.$noty.info(`load Nota -> verNota. Proyecto: ${project}, Token: ${token_project} `)          
    
      if (token_project) {

      HTTP.get("/api/configuracion/tipo/readme/all/readme")
        .then(({data}) => {
          this.readMe = undefined;
          this.readMeObj = undefined;

          if (!data.error && data.configuraciones) 
          {
            data.configuraciones.forEach((c) => {
              const idConfig = c.values.find(
                (config) => config.name === "project_id"
              );
              if (idConfig &&idConfig.value === token_project) {
                const contentConfig = c.values.find((config) => config.name === "content")
                const createdAtConfig = c.values.find((config) => config.name === "created_at")
                const createdByConfig = c.values.find((config) => config.name === "created_by")
                const modifiedByConfig = c.values.find((config) => config.name === "last_modified_by")
                const modifiedAtConfig = c.values.find((config) => config.name === "last_modified")
                this.readMe = contentConfig.value
                this.readMeObj = {                  
                  id: c.id,
                  projectId: idConfig.value,
                  createdAt: createdAtConfig && createdAtConfig.value,
                  createdBy: createdByConfig && createdByConfig.value,
                  modifiedBy: modifiedByConfig && modifiedByConfig.value,
                  modifiedAt: modifiedAtConfig && modifiedAtConfig.value,
                  evento: "edit"
                };
                this.$refs.readMeModal.show()
         
              }
            });

            if(this.readMe== undefined){
              this.$refs.readMeModal.show()
              this.$noty.error(`No existe nota para este proyecto: (${projectName}) `);    
            
            this.readMeObj = {
                  id: null,
                  projectId: token_project,
                  createdAt: null,
                  createdBy: null,
                  modifiedBy: null,
                  modifiedAt: null,
                  evento: "add"
                };

            }


          } else {
            this.readMe = undefined;
          }
        }).catch((result) => {
          this.$noty.error("¡Error al cargar datos!");
        });      
      }   
    
    },

    waMe(telefono){
      window.open(`https://wa.me/+54${telefono}`)
     }, 

    verImg(project, projectToken) {
      // this.$noty.info(`Load Imagen -> verImg. Proyecto: ${project}, Token: ${projectToken}`)     
      // carga la galeria
      this.imagesLoaded = false
      this.imgSelected = [].splice()

      HTTP.get(`/api/v2/images/${projectToken}/General`, {}
      ).then(result => {
        if (result && result.data) {
          const images = result.data.response.imagenes
          images.map(i=>i.selected=false)
          this.imagesObj = [...images]
          this.images = images
          this.noImages = this.images.length === 0
          this.general = result.data.response.imagenes.length
          this.$refs.imgModal.show()
        }
       
       //  console.log('Imagenes galeria: ', result)
      }).catch(result => {
        console.log('Imagenes galeria error: ', result)
      }).finally(() => {
        this.imagesLoaded = true
      })
    
    },

    saveReadMe() {

      const readMe = {
        name: "ReadMe",
        type: "readme",
        values: [
          { name: "content", value: this.readMe },
          { name: "project_id", value: this.readMeObj.projectId },
        ]
      };

      const today = new Date();
      // const now =  today.getDate() + "/" + (today.getMonth() + 1) +  "/" +today.getFullYear() + " " + today.getHours() +  ":" + today.getMinutes();
      const now =  `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}  ${today.getHours()}:${today.getMinutes()}`;
      if (this.readMeObj.evento == "edit") {
        readMe.id = this.readMeObj.id;
        readMe.values.push({name: "created_by",value: this.readMeObj.createdBy,});
        readMe.values.push({name: "created_at", value: this.readMeObj.createdAt, });
        readMe.values.push({name: "last_modified_by", value: this.displayableUsername,});
        readMe.values.push({ name: "last_modified", value: now });

        HTTP.put("/api/configuracion/" + this.readMeObj.id, readMe)
          .then((result) => {
            this.$noty.success("¡Notas actualizadas correctamente!");
            console.log("result", result, readMe, this.readMeObj);
            this.closeReadMe();
          })
          .catch((err) => {
            this.$noty.error("Error al actualizar las notas");
          });
      } else {
        readMe.values.push({name: "created_by", value: this.displayableUsername, });
        readMe.values.push({ name: "created_at", value: now });

        HTTP.post("/api/configuracion", readMe)
          .then((result) => {
            if (result.data.success) {
              this.$noty.success("¡Notas guardadas correctamente!");
              this.closeReadMe();
              this.readMeObj = {
                id: result.data.id,
                projectId: this.token_project,
                createdAt: 'createdAt' && now,
                createdBy: 'createdBy' && this.displayableUsername,
                modifiedBy: 'modifiedBy' && this.displayableUsername,
                modifiedAt: 'modifiedAt' && now,
              };

            }
          })
          .catch((result) => {
            alert(result)
            this.$noty.error("¡Error al guardar los datos!");
          });
      }
    },

     deleteReadMe() {
      HTTP.delete(`/api/configuracion/${this.readMeObj.id}`).then(
        (response) => {
          if (response.data.success) {
            this.$noty.success("Notas eliminadas con éxito!");
            this.readMeObj = undefined;
            this.readMe = undefined;
            this.closeReadMe();
          }
        }
      );
    },


    closeReadMe() {
      this.$refs.readMeModal.hide();
    },    


    closeImg() {
      this.$refs.imgModal.hide();
    },    


    updateCampo(id, campo, valor){
      console.log(`Actualizar Campo  id: ${id}, campo: ${campo}, valor: ${valor}`)
       //  this.$noty.info(`Actualizar Campo  id: ${id}, campo: ${campo}, valor: ${valor}`)
    
      PresupuestoService.updateCampo(id, {campo,campo_id:valor }).then(resp => {
            this.$noty.info(`Se Actualizo el registro Correctamente`)
            }).catch(()=>{
            this.$noty.error(`Error en Actualizar registro`)
          })
    },


    CopyPDFURL(item) {
      this.updateClipboard(item.link);
    },
    updateClipboard(newClip) {
      let self = this;
      let newVariable = "";
      newVariable = window.navigator;
      newVariable.clipboard.writeText(newClip).then(
         function () {
          //this.$refs.toastr.s("¡Link copiado correctamente!");
          //this.$noty.success('¡Link copiado correctamente!')
          alert('¡Link copiado correctamente!')
        },
        function () {
          //this.$refs.toastr.e("¡Error al obtener el link!");
          //this.$noty.error('El enlace no se pudo obtener')
          alert('El enlace no se pudo obtener')
        }
      );
    },

    filterByName() {
      console.log(this.searchParam)
      this.traerPresupuestos();
    },

    filterByUsuario() {
      console.log(this.selectedUsuario)
      this.traerPresupuestos();
    },

     filterBySeguimiento() {
      console.log(this.selectedSeguimiento)
      this.traerPresupuestos();
    },

    async getUsers() {
      let data = await UsuarioService.getAll()
      if(data){
        this.usuarios = data.usuarios;
      }
    },

    selectRow(e, row) {
      // Rows are indexed from 0, so the third row is index 2
      console.log(e)
      if(e)
        this.$refs.selectableTable.selectRow(row)
      else
        this.$refs.selectableTable.unselectRow(row)
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.estado === 0) return 'table-info'
      if (item.estado === 1) return 'table-danger'
      if (item.estado === 2) return 'table-warning'
      if (item.estado === 3) return 'table-success'
    },

    deletePresuspuestos(){
      const ids = this.selected.map(el => el.pres_id)
      console.log(ids)
      swal({
        title: '¿Esta seguro?',
        text: "Esta acción no se puede deshacer",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar'
      }).then((result) => {
        console.log(result)
        if (result.value == true) {
          PresupuestoService.deleteBulk({ids}).then(resp=>{
            this.$noty.info('Se ha eliminado correctamente')
            this.traerPresupuestos()
          }).catch(()=>{
            this.$noty.error('No se ha podido eliminar')
          })
        }
      })
    }

  },
};
</script>

<style  lang="scss" scoped>
.vue-lightbox ul {
  max-width: 1075px !important;
}
.vue-lightbox ul li {
  transition: 0.4s;
  margin-left: 8px;
  border: 3px solid transparent;
  list-style: none;
  display: inline-block;
  padding: 0 !important;
  height: 156px;
  &:hover {
    border-color: rgba(0, 157, 230, 0.2);
  }

  &.img-selected {
    border-color: #03a9f4;
  }
}

</style>

<style scoped>
.text-center{
  font-size: 11px;
  text-align: center;
}

.text-left{
  font-size: 11px;
  text-align: left;
}

.text-right{
  font-size: 12px;
  text-align:right;
}
</style>