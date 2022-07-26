<template>
    <div id="app-clientView-list" class="container-fluid">
      <vue-toastr ref="toastr"></vue-toastr>

            <div class="row py-3 text-center ">
              <div class="col-sm-6">
                <div class="input-group">
                  <input type="search" id="form1" class="form-control" placeholder="Buscar" v-model="searchText"
                          @keyup="search"/>
                  <button type="button" class="btn btn-xs btn-info" @click="filter(searchText)">
                    <font-awesome-icon icon="search"></font-awesome-icon>
                  </button>
                </div>
              </div>
              <div class="col-sm-6 d-flex justify-content-end">
                <button type="button" class="btn btn-xs btn-info mr-1" @click="reload('')">
                  <font-awesome-icon icon="sync"></font-awesome-icon>
                  Actualizar
                </button>
                <button type="button" class="btn btn-xs btn-success ml-1" @click="create()">
                  <font-awesome-icon icon="plus"></font-awesome-icon>
                  Nueva Notificación
                </button>
              </div>
            </div>
         
          <div class="row">
            <div id="clientView-listado" class="col-sm-12">
              <b-overlay :show="loadingList" opacity="0.6" spinner-variant="primary">
                <div class="table-responsive">
                    <table class="table table-hover">

                        <thead>
                            <!--   <th>id</th>-->
                            <th>Título</th>
                            <!-- <th>Contenido</th> -->
                            <th>Sector</th>
                            <th>Nº Repeticiones</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>                            
                            <th>Acciones</th>
                        </thead>



                        <tbody>
                            <template v-if="listData">
                                <tr v-for="(Datos, i) in listData" :key="i">
                                    <!--
                                            <td>{{ clientView.id }}</td>
                                    -->
                                    <td>{{ Datos.titulo}}</td>
                                    <!--
                                    <td> <span v-html="rawHtml"></span>{{ Datos.contenido}}</td>
                                    -->
                                    <td>{{ Datos.sector_id}}</td>
                                    <td>{{ Datos.num_repeticion}}</td>
                                    <td>{{ Datos.fecha_inicio}}</td>
                                    <td>{{ Datos.fecha_fin}}</td>
                                    <td>
                                        <!--
                                          <button class="btn btn-sm btn-success" @click="show(Datos)"><font-awesome-icon icon="eye"></font-awesome-icon></button>
                                        -->
                                        <button class="btn btn-sm btn-warning" @click="edit(Datos)"><font-awesome-icon icon="pencil-alt"></font-awesome-icon></button>
                                        <button class="btn btn-sm btn-danger" @click="remove(Datos)"><font-awesome-icon icon="trash"></font-awesome-icon></button>
                                        
                                    </td>
                                </tr>
                            </template>
                            <template v-if="!viewsPaginator">
                                <tr>
                                    <td class="text-center" colspan="7"><strong>No posee vistas creadas</strong></td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
                <!--
                <pagination ref="pagination" :data="viewsPaginator"
                            @pagination-change-page="getListView"
                            :align="paginatorProps.align"
                            :size="paginatorProps.size"
                            :limit="paginatorProps.limit">
                </pagination>
                -->
                <notification></notification>
                <span v-if="test">Data:<code>{{listData}}</code> </span>
              </b-overlay>
            </div>
          </div>
        
      


      <!--<b-modal id="modal-edit" hide-footer size="xl" header-bg-variant="dark"   header-text-variant="light"> -->
        <b-modal id="modal-edit" hide-footer size="xl"> 
        <template #modal-title>
         {{title}} Notificaciones
        </template>

         <form   @submit="save()" @submit.stop.prevent>
          <!-- <form id="form-view" action="#!" method="post">  -->
          <div class="row">
            
            <div class="col-lg-6" style="overflow-y:auto; max-height: 100vh">
              <b-overlay :show="loadingEdit" opacity="0.6" spinner-variant="primary">
                
                  
                  <div class="col-12">
                    <div class="form-group">
                      <label class="control-label col-12" for="titulo">Titulo</label>                       
                      <b-form-input  type="text" v-model="data.titulo"  id="titulo"  name="titulo" required class="form-control">
                      </b-form-input>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="form-group">
                      <label class="control-label col-12" for="sector">Sector</label>                  
                       <b-form-select  v-model="data.sector_id"  :options="listSectores" id="sector"
                           class="form-control"  value-field="id" required text-field="descripcion">
                        </b-form-select>
                      
                        <!-- 
                        <select id="template" class="form-control" name="template" @change="onChangeTemplate($event)" v-model="data.sector_id">
                          <option v-bind:value="view.id" v-for="view in templates.data">{{ view.name }}</option>
                        </select>

                        -->
                    </div>
                  </div>

                  

                  <div class="col-12">
                    <div class="form-group">
                      <label class="control-label col-12" for="repeticion">Número de Repeticiones</label>                  
                      <b-form-input type="number" v-model="data.num_repeticion"    id="repeticion"  required
                             class="form-control" placeholder="Escriba numero de repeticiones de las notificaciones" >
                      </b-form-input> 
                   </div>
                  </div>

                  <div class="col-12">
                    <div class="form-group">
                      <label class="control-label col-12" for="fecha">Fecha inicio Publicación</label>
                      <input type="date" v-model="data.fecha_inicio" class="form-control" id="fecha" required>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="form-group">
                      <label class="control-label col-12" for="fecha2">Fecha fin Publicación</label>
                      <input type="date" v-model="data.fecha_fin" class="form-control" id="fecha2" required>
                    </div>
                  </div>
                
              </b-overlay>
            </div>
            <div class="col-lg-6">

              <div class="form-group">
                  <label class="control-label col-12" for="contenido">Contenido</label>
                  <mc-wysiwyg id="contenido" v-model="data.contenido" :height="200" required></mc-wysiwyg>
              </div>


                <!-- <client-view-show :view="this.data" :design-mode="true"></client-view-show>  -->
            </div>


            <div class="col-lg-12 d-flex justify-content-end">
              <!--
                <b-button type="submit" variant="primary">Submit</b-button>
              <button type="submit" @click="save()" class="btn btn-success mr-2">Guardar</button> -->
       

              <button type="submit"  v-if="evento=='add'" class="btn btn-success mr-2">Guardar</button>
              <button type="submit" v-if="evento=='edit'" class="btn btn-success mr-2">Actualizar</button>

              <button type="button" @click="$bvModal.hide('modal-edit')"  class="btn btn-danger mr-2" data-dismiss="modal">Cerrar</button>
            </div>
            <span v-if="test">Data:<code>{{data}}</code> </span>
            

            

          </div>

       </form>

      </b-modal>

      
    </div>
</template>

<script>
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
  import { faEye, faPencilAlt, faTrash, faPlus, faSync } from '@fortawesome/free-solid-svg-icons'
  import { library } from '@fortawesome/fontawesome-svg-core'

  import swal from 'sweetalert2'
  import VueToastr from 'vue-toastr'

  import pagination from 'laravel-vue-pagination'
  import { McWysiwyg } from "@mycure/vue-wysiwyg";
 
  import NotificactionServiceClass from '../Services/notificationService'
 

  const NotificationService = new NotificactionServiceClass()

  library.add(faEye)
  library.add(faPencilAlt)
  library.add(faTrash)
  library.add(faPlus)
  library.add(faSync)

  export default {
    components: {
      FontAwesomeIcon,
      VueToastr,
      pagination,
      McWysiwyg
    },
    data () {
      return {
        viewsPaginator: {},
        total: 15,
        loadingList: false,
        loadingEdit: false,
        searchText: '',
        paginatorProps: {
          align: 'center',
          size: 'default',
          limit: 1
        },

        headerBgVariant: 'dark',
        headerTextVariant: 'light',
        evento:null,
        title: null,
        test:false,

        listData : {},
        tempData : {},
        data : {},

        listSectores:[
          {id: "/design-dashboard", descripcion:"Vista de Diseño"},
          {id: "/taller", descripcion:"Taller"},
          {id: "/presupuestos", descripcion:"Presupuestos"},
          {id: "/compras", descripcion:"Compras"},
          {id: "/calendar", descripcion:"Calendario"},
          {id: "/tareacalendar", descripcion:"Tareas"},
          {id: "/asistencia", descripcion:"Asistencia"},
          {id: "/MiProduccion", descripcion:"Mi Producción"},
          {id: "/produccion", descripcion:"Informacion de Producción"},   
          {id: "/estados", descripcion:"Estados"},
          {id: "/Lasistencia", descripcion:"Mi Sueldo"}
        ],
        
      }

    },
    mounted () {

      this.loadMain()

    },
    methods: {
      loadMain(){
        this.limpForm()
        this.getView(this.searchText)
      },

    
      onReset(event) {
        event.preventDefault()
        // Reset our form values
        this.form.email = ''
        this.form.name = ''
        this.form.food = null
        this.form.checked = []
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      },


      async save(){

          try {  

            if(this.evento == "add"){
              let resp = await NotificationService.store(this.data)
              if(resp.status){
                this.loadingEdit = false
                this.$bvModal.hide('modal-edit')
                this.loadMain()
                this.$refs.toastr.s('Registro Guardado con éxito')                
                console.log(`Save: evento:${this.evento},  datos: ${resp}`)
              }
  

            }

            if(this.evento == "edit"){ 
              console.log(`num_repeticion : ${this.data.num_repeticion}`) 
              let resp = await NotificationService.update(this.data.id, this.data)
              if(resp.status){
                  this.loadingEdit = false
                  this.$bvModal.hide('modal-edit')
                  this.loadMain()
                  this.$refs.toastr.s('Registro Actualizado con éxito')                
                  console.log(`Save: evento:${this.evento},  datos: ${resp}`)
                }

            }
            

          } catch (e) {
 
              this.loadingEdit = false
              return false
          }

        /*
        }else{

            this.$refs.toastr.e('¡Debe de Ingresar todos los Datos!')
            return false
            // this.disabledButton = false
            // this.loading =false
        }
        */


      },



      create () {

        this.limpForm()
         this.evento   = "add"
        this.title     = "Agregar" 
        this.$bvModal.show('modal-edit')
      },

      async reload (search) {
        this.getView(search)
       },

      search (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
          this.filter(this.searchText)
        }
      },

      filter (searchText){
        
        this.listData = this.tempData.filter(item => item.titulo.toLowerCase().includes(searchText.toLowerCase()))

        

        // this.listData = (filter.this.listData > 0) ? filter :
        /*
        this.listData = this.filterListResults.resultName
        ? this.response.data.filter(item => item.mensaje.toLowerCase().includes(this.filterListResults.resultName.toLowerCase()))
        : this.response.data; 

        */



      },


   



      async getView (search) {
        try{


          this.loadingList = true
          let resp = await NotificationService.getAll(search)
          if (resp) {

            console.log(`getView data: ${resp.data}`)
            //this.viewsPaginator = resp.data
            // this.viewsPaginator ={}
            this.listData = resp.data
            this.tempData = resp.data
            this.loadingList = false
 
          }


        }catch(e){
          this.loadingList = false
          console.log(`getView Error: ${e}`)
        }
   
      },


    

      async getListView (page = 1) {
        this.loadingList = true
        let resp = await NotificationService.getList(page, this.total, this.searchText)
        if (data) {
          this.viewsPaginator = resp.data
        }
        this.loadingList = false
      },


      edit (view) {

        this.evento = "edit"
        this.title   =  "Editar" 
        this.data = view
        this.$bvModal.show('modal-edit')

        /*
        this.data = {
          name: view.name,
          fieldsValues: view.fieldsValues,
          template_id: view.template_id,
          id: view.id,
          urlBase: view.urlBase
        }
        */
        },

      show (view) {
        this.evento   =  "show"
        this.title   =  "Visualizar" 
        this.data = view
        this.$bvModal.show('modal-show')
},

      async remove (data) {
        swal({
          title: `¿Desea eliminar la vista : ${data.titulo}?`,
          text: 'No podrá ser recuperado',
          type: 'question',
          customClass: 'unfont-size',
          showCancelButton: true
        }).then(async selected => {
          if (selected.value) {
            this.loadingList = true
            let response = await NotificationService.delete(data.id)
            this.loadingList = false
            console.log(`Delete response: ${JSON.stringify(response)}`)
            if (response.data.status === true) {
              this.reload("")
              this.$refs.toastr.s('¡Registro eliminado con éxito!')
            }
            
          }
        })
      },


      limpForm(){

        this.searchText = ''

        this.data = {
              titulo: '',
              contenido: '',
              sector_id: '',
              periodo_repeticion_id: 1,
              num_repeticion: 1,
              fecha_inicio: null,
              fecha_fin:null,
              activo: 1
            }
      }



    }
  }
</script>

<style>

</style>
