<template>
  <div id="app-respaldo-list" class="container-fluid row">
    <vue-toastr ref="toastr"></vue-toastr>
    <div class="col-sm-12 col-md-12 col-lg-12 mt-3">
      <div class="col-sm-12 text-center">
        <h3>
          Reportes Finalizados
        </h3>
        <hr>
      </div>
      <div class="col-sm-12 text-center py-3" style="display: flex">
        <div class="panel-body">
          <div class="form-group row" style="font-size: small;">
            <label class="control-label col-sm-4" for="tipo_materiales">
              Búsqueda
            </label>
            <div class="col-sm-8" style="font-size: small;">
              <input
                type="text"
                name="filtro"
                id="filtro"
                class="form-control"
                v-model="filtro"
                v-on:input="onChangeFiltro"
              />
            </div>
          </div>
        </div>
      </div>
      <b-overlay :show="loadingPage" opacity="0.6" spinner-variant="primary">
      <div id="reportes-listado" class="col-sm-12">
        <div class="table-responsive">
          <table class="table table-striped table-bordered">
            <thead> 
              <tr style="font-size: small;">
                <th>Encuesta</th>
                <th>Proyecto</th>
                <th>Cliente</th>
                <th>Taller</th>
                <th>Imágenes</th>
                <th>Nota Instalacion</th>
                <th>Nota Presup. Proyecto</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(reporte) in reportesFinalizados">
                <tr style="font-size: small;">
                  <td>
                    <button type="button" class="btn btn-sm btn-success" @click="cambiarDetalleReporte(reporte)">
                      {{(reporte.detalle_reporte == 0)? 'Ver' : 'Ocultar'}}
                    </button>
                  </td>
                  <td>{{reporte.proyecto}}</td>
                  <td>{{reporte.cliente? reporte.cliente.nombre_completo : ''}} </td>
                  <td>
                    <button title="Ir al taller" class="btn btn-sm btn-info" @click="goToTallerWithProjectId(reporte.id)">
                      Ir...
                    </button>
                  </td>  
                  <td>
                    <button
                          type="button" 
                          title="Ver imágenes"
                          class="btn btn-sm btn-primary"
                          style="min-width: 50px"
                          @click="viewGallery(reporte.token_project)"
                          :disabled="!images_project"
                        >
                          <b-icon icon="image"></b-icon>
                    </button>
                  </td>  
                  <td>
                    <button type="button" class="btn btn-sm btn-danger"
                      @click="openNota(reporte.id,reporte.instalacion_nota)">
                      <b-icon  icon="clipboard" class="white"></b-icon>
                    </button>
                  </td>  
                   <td>
                     <button type="button" class="btn btn-sm btn-primary"
                      @click="verNota(reporte.proyecto,reporte.token_project)">
                      <b-icon  icon="clipboard" class="white"></b-icon>
                    </button>
                  </td> 
                </tr>
                <tr v-if="reporte.detalle_reporte==1">
                  <td colspan="4">
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th colspan="5">E N C U E S T A</th>
                        </tr> 
                        <tr style="font-size: small;">
                          <th>#</th>
                          <th>Tipo pregunta</th>
                          <th>Pregunta</th>
                          <th>Respuesta</th>
                          <th>Usuario</th>
                        </tr>
                      </thead>
                      <tbody>
                          <tr style="font-size: small;" v-for="(item, index2) in reporte.encuestarespuesta" :key="item.id">
                            <td>
                              {{index2 + 1}}
                            </td>  
                            <td>
                                {{item.encuestapregunta.esPregunta ? '¿Sí / No?' : item.encuestapregunta.esTexto ? 'Campo de texto' : 'Calificación'}}
                            </td>
                            <td class="text-left">
                                {{item.encuestapregunta.nombre}}
                            </td>
                            <td>
                                {{item.respuesta}}
                            </td>
                            <td>
                                {{(index2 == 0)? item.usuario.usuario : ''}}
                            </td>
                          </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>  
              </template>
            </tbody>                                      
          </table>
          <div class="overflow-auto">
            <div class="mt-12">
              <b-pagination 
              v-model="pagination.current_page" pills 
              :total-rows="pagination.total" 
              :per-page="pagination.per_page"
              @change="changePage"
              align="center">
              </b-pagination>
            </div>
          </div>
        </div>
      </div>
      </b-overlay>
    </div>
    <gallery-modal style="z-index:2;"
        :token_project="this.galleryTokenProject"
        :images_project="this.images_project"
        v-if="showmodal"
        @toggle-modal="ToggleModal()">
    </gallery-modal>
    <!-- Modal nota taller -->
    <b-modal id="modalNota" hide-footer size="lg"> 
        <template #modal-title>
         Nota Instalación 
        </template>   
         <form  @submit="saveNota()" @submit.stop.prevent>
           <div class="row">  
              <div class="col-lg-12"><div class="form-group">
                  <label class="control-label col-12" for="contenido">Descripción:</label>
                  <mc-wysiwyg id="contenido"  v-model="nota.instalacion_nota" :height="200" required></mc-wysiwyg> 
              </div>
            </div>
            <div class="col-lg-12 d-flex justify-content-end">
              <button type="submit" class="btn btn-success mr-2">Guardar</button>
              <button type="button" @click="$bvModal.hide('modalNota')"  class="btn btn-danger mr-2" data-dismiss="modal">Cerrar</button>
            </div>  
          </div>
       </form>
    </b-modal>
    <b-modal size="lg" ref="readMeModal" hide-footer title="Notas sobre este proyecto">
          <div class="overflow-auto">
            <mc-wysiwyg  v-model="readMe" :height="530"></mc-wysiwyg>
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
            </div>
          </div>
        </b-modal>

  </div> 
</template>

<script>
import { forkJoin } from 'rxjs'

import encuesta_tipoService from "../Services/encuesta_tipoService";
import encuestaRespuestaService from "../Services/encuestaRespuestaService";
import proyectoService from "./../Services/proyectosService";
import ImageGallery from "./../image-gallery.vue";
import GalleryModal from './../galleryWithFolder';
import { McWysiwyg } from "@mycure/vue-wysiwyg";
import VueToastr from "vue-toastr";
import { HTTP } from '@/plugins/HTTP.js'

const Encuesta_tipoService = new encuesta_tipoService();
const EncuestaRespuestaService = new encuestaRespuestaService();
const ProyectoService = new proyectoService();

export default {
    components: {
      VueToastr,
      GalleryModal,
      ImageGallery,
      McWysiwyg,
    },
    data(){
      return{
        loadingPage: true,
        readMe: undefined,
        readMeObj: undefined,
        nota: {
          id: 0,
          instalacion_nota:'',
        },
        showmodal:false,
        galleryTokenProject: "",
        images_project: [],
        EncuestaTipo: {
          id: 0,
          nombre: '',
          esTexto: false,
          esPregunta: false,
          esEstrella: false,
          estado: false,
          descripcion: "",
          id_proyecto: 0,
          created_at: new Date(),
          updated_at: new Date()
        },
        detalleReporte: [],
        encuesta: {
          id: 0,
          nombre: '',
          esTexto: false,
          esPregunta: false,
          esEstrella: false,
          estado: false,
          descripcion: "",
          id_proyecto: 0,
          created_at: new Date(),
          updated_at: new Date()
        },
        reportes: [],
        reportesFinalizados: [],
        filtro: "",
        idTipoEncuesta: 0,
        editar: false,
        table:{},
        fields: ['v','proyecto', 'usuario'],
        mostrarDatos: false,
        pagination: {
          'total': 0,
          'current_page': 0,
          'per_page': 0,
          'last_page': 0,
          'from': 0,
          'to': 0
        },
        offset: 3,
      }
    },
    mounted(){
      console.log('esta es la encuesta', this.encuesta)
      let i
      for (i=0;i<=15;i++) {
        this.detalleReporte[i] = 0
      }
		  this.traerEncuestasFinal();
    },
    computed: {
      isActived: function() {
        return this.pagination.current_page
      },
      pagesNumber: function() {
        if(!this.pagination.to){
          return [];
        }

        var from = this.pagination.current_page - this.offset; 
        if(from < 1){
          from = 1;
        }

        var to = from + (this.offset * 2); 
        if(to >= this.pagination.last_page){
          to = this.pagination.last_page;
        }

        var pagesArray = [];
        while(from <= to){
          pagesArray.push(from);
          from++;
        }
			  return pagesArray;
		  }
    },
    methods:{
      verNota(projectName, token_project) {          
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
      closeReadMe() {
        this.$refs.readMeModal.hide();
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
            this.$noty.error("¡Error al guardar los datos!");
          });
        }
      },

      openNota(proyectoId, instalacionNota) {
        this.nota.id = proyectoId
        this.nota.instalacion_nota = instalacionNota
        this.$bvModal.show("modalNota");
      },
    
      async saveNota(){    
        this.loadingPage = true
        try {
          this.$refs.toastr.i("Actualizando proyecto...")
          let resPl = await ProyectoService.update(this.nota)
          if (resPl) {
            this.$refs.toastr.s("Proyecto actualizado con éxito")
              this.loadingPage = false
              this.$bvModal.hide("modalNota")
              this.traerEncuestasFinal(this.pagination.current_page)
            }   
        } catch (e) { 
          console.log("Error!", e);
          this.loadingPage = false;
            return false
        } 
      },
      async viewGallery(token_project) {
        console.log("Cargando Imagenes del proyecto: ", token_project);
        this.$refs.toastr.s("Cargando imágenes. Espere por favor...");
        this.galleryTokenProject = token_project;
        this.images_project = [];
        try {
            let resImg = await ProyectoService.getImagesProject(token_project,'General');
            if (resImg != undefined)
                this.images_project = await resImg.response.imagenes;
        } catch (error) {
            console.log("Error Cargando Imagenes del proyecto: ", error);
        }
        this.showmodal = !this.showmodal
      },
      ToggleModal(){
        this.galleryTokenProject = ""
        this.showmodal = !this.showmodal
      },
      goToTallerWithProjectId(projectId) {
      localStorage.setItem("currentProject", projectId);
      this.$router.push("/taller");
      },
      onChangeFiltro() {
        this.traerEncuestasFinal(1);
      },
      changePage: function(page) {
        this.pagination.current_page = page;
        this.traerEncuestasFinal(page);
		  },
      cambiarDetalleReporte(reporte) {
        if (reporte.detalle_reporte == 0) {
          reporte.detalle_reporte = 1
          return
        }
        if (reporte.detalle_reporte == 1) {
          reporte.detalle_reporte = 0
        }
      },
      rows() {
        this.totalrows = this.reportesFinalizados.length
      },      
      cambiarMostrarDatos(){
        this.mostrarDatos = !this.mostrarDatos
        console.log(this.reportesFinalizados)
      },
      async traerEncuestasFinal(page=1) {
        this.loadingPage = true
        let responseOne
        try {
          responseOne = await EncuestaRespuestaService.getAll(page, this.filtro)
        } catch (error) {
          console.log('error ln 163', error)
          responseOne = {}
        }
        if(responseOne){
          this.reportesFinalizados = [];
          if (responseOne.data !== null) {
            this.reportesFinalizados = responseOne.data.data
            this.pagination.total = responseOne.data.total
            this.pagination.current_page = responseOne.data.current_page
            this.pagination.per_page = responseOne.data.per_page
            this.pagination.last_page = responseOne.data.last_page
            this.pagination.from = responseOne.data.from
            this.pagination.to = responseOne.data.to
            console.log('proyectos-->',this.reportesFinalizados)
            console.log('paginacion-->',this.pagination)
          }
        }
        this.loadingPage = false
      },
    }
}
</script>

<style>
textarea {
    resize: none;
  }

  .badge-success{
    background: green;
}

.badge-danger {
    background: orange;
}

.datatable-pager a{
  color: black !important;
}

.salto-linea{
  white-space: break-spaces;
}


</style>