<template>
    <div id="app-clientView-list" class="container-fluid">
      <vue-toastr ref="toastr"></vue-toastr>
      
          <div class="row py-3">
            <div class="col-sm-6 text-center">
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
                Nueva Ayuda
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
                            <th>Categoria</th>
                            <th>Contenido</th>
                            <th>Situación</th>                            
                            <th>Acciones</th>
                        </thead>

                        <tbody>
                            <template v-if="listData">
                                <tr v-for="(Datos, i) in listData" :key="i">
                                    <td>{{ Datos.titulo}}</td>
                                    <td>{{ Datos.desc_categoria}}</td>           
                                    <td><span v-html="Datos.contenido"></span></td>                         
                                    <td v-if="Datos.activo===1"> <b-badge variant="info">Activo</b-badge></td>
                                    <td v-else> <b-badge variant="danger">Inactivo</b-badge></td>
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

                <notification></notification>
                <span v-if="test">Data:<code>{{listData}}</code> </span>
              </b-overlay>
            </div>
          </div>
       


      <!--<b-modal id="modal-edit" hide-footer size="xl" header-bg-variant="dark"   header-text-variant="light"> -->
        <b-modal id="modal-edit" hide-footer size="xl"> 
        <template #modal-title>
         {{title}} Ayuda
        </template>

         <form   @submit="save()" @submit.stop.prevent>
          <!-- <form id="form-view" action="#!" method="post">  -->
          <div class="row">
            
            <div class="col-lg-6" style="overflow-y:auto; max-height: 100vh">
              <b-overlay :show="loadingEdit" opacity="0.6" spinner-variant="primary">
                
                  
                  <div class="col-12 form-group">
                      <label class="control-label col-12" for="titulo">Titulo</label>    
                      <b-form-input  type="text" v-model="data.titulo"  id="titulo"  name="titulo" required class="form-control">
                      </b-form-input>                      
                  </div>

                  <div class="col-12 form-group">
                      <label class="control-label col-12" for="sector">Categoria</label>                  
                      <div class="input-group mb-3"> 
                        <b-form-select  v-model="data.categoria_id"  :options="listCategoria" id="sector"
                          class="form-control"  value-field="id" required text-field="desc_categoria">
                        </b-form-select>
                        <div class="input-group-append"> 
                          <button type="button" class="btn btn-xs btn-success" @click="addCategoria()">
                              <font-awesome-icon icon="plus"></font-awesome-icon>
                              AGREGAR
                          </button>
                           </div>                      
                      </div>  
                  </div>

                  <div class="col-12 form-group">
                      <label class="control-label col-12" for="sector">Imagenes</label>  
                      <b-form-file v-model="data.ruta_img" class="mt-3"   
                        placeholder="Ingrese Una Imagen ..."  drop-placeholder="Drop file here 2222 ...">
                      </b-form-file>                   
                  </div>


                  <div class="col-12 form-group">
                      <label class="control-label col-12" for="sector">Archivo</label>                
                      <b-form-file v-model="data.ruta_archivo" class="mt-3"   placeholder="Ingrese Un  Archivo."
                        drop-placeholder="Borre Archivo aqui ..."></b-form-file> 
                  </div>  
 

                  <div class="col-12 form-group">
                      <label class="control-label col-12" for="sector">Situación</label>  
                      <b-form-radio-group v-model="data.activo" :options="listActivo"
                                      value-field="id"  text-field="descripcion" class="mb-3" disabled-field="notEnabled">
                    </b-form-radio-group>

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

      <!-- modal categoria  -->
      <b-modal id="modal-categoria" hide-footer size="lg"> 
        <template #modal-title> Categorias</template>
          <b-overlay :show="loadingCategoria" opacity="0.6" spinner-variant="primary">

         <div class="table-responsive">
                    <table class="table table-hover">
                        
                        <thead>
                            <th>Descripción de Categoria</th>
                            <th>Situación</th>                            
                            <th>Acciones</th>
                        </thead>

                        <tbody>
                              <tr>
                                  <td> <b-form-input  type="text" v-model="categoria.desc_categoria" name="descripcion" required class="form-control"></b-form-input></td>
                                  <td><b-form-select  v-model="categoria.activo"  :options="listActivo" class="form-control" value-field="id" required text-field="descripcion">
                                      </b-form-select>
                                  </td>           
                                  <td> 
                                    <button type="button" class="btn btn-xs btn-success" @click="saveCategoria('add', categoria)">
                                      <font-awesome-icon icon="plus"></font-awesome-icon>
                                        Agregar
                                    </button>
                                  </td>
                              </tr>
                           
                            <template v-if="listCategoria">
                                <tr v-for="(item, i) in listCategoria" :key="i">
                                    <td> <b-form-input  type="text" v-model="item.desc_categoria"   name="desc_categoria" required class="form-control"></b-form-input></td>
                                    <td><b-form-select  v-model="item.activo"  :options="listActivo" class="form-control" value-field="id" required text-field="descripcion">
                                        </b-form-select>
                                    </td>           
                                    <td>
                                      <button class="btn btn-sm btn-warning" @click="saveCategoria('edit', item)"><font-awesome-icon icon="pencil-alt"></font-awesome-icon></button>
                                      <button class="btn btn-sm btn-danger" @click="removeCategoria(item)"><font-awesome-icon icon="trash"></font-awesome-icon></button>
                                        
                                    </td>
                                </tr>
                            </template>
                            <template v-if="!listCategoria">
                                <tr>
                                    <td class="text-center" colspan="7"><strong>No existen Categoria</strong></td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
              </b-overlay>
            <div class="col-lg-12 d-flex justify-content-end">           

              <button type="button" @click="$bvModal.hide('modal-categoria')"  class="btn btn-danger mr-2" data-dismiss="modal">Cerrar</button>
            </div>
            <span v-if="test">Data:<code>{{data}}</code> </span>
        

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
 
  import HelpServiceClass from '../Services/helpService'
  import HelpCategoryServiceClass from '../Services/helpCategoryService'
 

  const HelpService = new HelpServiceClass()
  const HelpCategoryService = new HelpCategoryServiceClass()

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

        listData : [],
        listCategoria:[],
        
        tempData : [],
        data : [],
        categoria:{id:null, desc_categoria:null, activo:-1},
        loadingCategoria :false,
         
        listActivo: [
          { id: 1 , descripcion: 'Activo' },
          { id: 0, descripcion: 'Inactivo' }
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
      
      edit (view) {
        this.evento = "edit"
        this.title   =  "Editar" 
        this.data = view        
        this.$bvModal.show('modal-edit')
        this.getViewCategory()        
      },

      show (view) {
        this.evento   =  "show"
        this.title   =  "Visualizar" 
        this.data = view
        this.$bvModal.show('modal-show')
      },


      create () {
        this.limpForm()
        this.evento   = "add"
        this.title     = "Agregar" 
        this.$bvModal.show('modal-edit')
        this.getViewCategory()
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
        this.listData = this.tempData.filter(item =>{ 
         return (item.titulo.toLowerCase().includes(searchText.toLowerCase()) || item.desc_categoria.toLowerCase().includes(searchText.toLowerCase()) )   
        })
      },

      async getView (search) {
        try{

          this.loadingList = true
          let resp = await HelpService.getAll(search)
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



      async save(){

          try {  

            if(this.evento == "add"){
              let resp = await HelpService.store(this.data)
              if(resp.status){
                this.loadingEdit = false
                this.$bvModal.hide('modal-edit')
                this.loadMain()
                this.$refs.toastr.s('Registro Guardado con éxito')                
                console.log(`Save: evento:${this.evento},  datos: ${resp}`)
              }
  

            }

            if(this.evento == "edit"){ 

              let resp = await HelpService.update(this.data.id, this.data)
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

      },


      async remove (data) {
        swal({
          title: `¿Desea eliminar la vista : ${data.desc_categoria}?`,
          text: 'No podrá ser recuperado',
          type: 'question',
          customClass: 'unfont-size',
          showCancelButton: true
        }).then(async selected => {
          if (selected.value) {
            this.loadingList = true
            let response = await HelpService.delete(data.id)
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
              id:'',
              titulo: '',
              contenido: '',
              categoria_id: '',
              ruta_img:'',
              ruta_archivo:'',
              activo: 1
            }
      },



      addCategoria () {

        this.$refs.toastr.s('¡Listar Categoria!')
        this.$bvModal.show('modal-categoria')
        this.getViewCategory()
      
      },
   
      async getViewCategory () {
        try{

          this.loadingCategoria = true
          let resp = await HelpCategoryService.getAll()
          if (resp) {

            console.log(`getViewCategory data: ${resp.data}`)
            
            this.listCategoria = resp.data
            this.loadingCategoria = false
 
          }

        }catch(e){
          this.loadingCategoria = false
          console.log(`getViewCategory Error: ${e}`)
        }
   
      },




      async saveCategoria(evento, datos){
      
        // this.$refs.toastr.s(`Categoria Evento: ${evento}`)                    
          
          try {  
            this.loadingCategoria = true

            if(evento === "add"){
              let resp = await HelpCategoryService.store(datos)
              if(resp.status){
                this.loadingCategoria = false                
                this.getViewCategory()
                this.categoria = {id:null, desc_categoria:null, activo:-1},

                this.$refs.toastr.s('Registro Guardado con éxito')                
                console.log(`Save: evento:${this.evento},  datos: ${JSON.stringify(resp)}`)
              }
            }

            if(evento === "edit"){ 
              console.log(`Editar Categoria: ${JSON.stringify(datos)}`)
              let resp = await HelpCategoryService.update(datos.id, datos)
              if(resp.status){
                  this.loadingCategoria = false
                  this.getViewCategory()
                  this.$refs.toastr.s('Registro Actualizado con éxito')                
                  console.log(`Save: evento:${this.evento},  datos: ${resp}`)
                }
            }
            
          } catch (e) { 
              this.loadingCategoria = false
              return false
          }
          
      },


      async removeCategoria (data) {
        swal({
          title: `¿Desea eliminar la vista : ${data.desc_categoria}?`,
          text: 'No podrá ser recuperado',
          type: 'question',
          customClass: 'unfont-size',
          showCancelButton: true
        }).then(async selected => {
          if (selected.value) {
            this.loadingCategoria = true
            let response = await HelpCategoryService.delete(data.id)
            this.lloadingCategoria = false
            console.log(`Delete response: ${JSON.stringify(response)}`)
            if (response.data.status === true) {
              this.getViewCategory()
              this.$refs.toastr.s('¡Registro eliminado con éxito!')
            }
            
          }
        })
      },






    }
  }
</script>

<style>

</style>
