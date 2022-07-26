<template>
  <div id="app-clientViewSequence-list" class="container">
    <vue-toastr ref="toastr"></vue-toastr>
    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-sm-12 py-3">
            <div class="row">
              <div class="col-sm-6">
                <div class="input-group">
                  <input type="search" id="form1" class="form-control" placeholder="Buscar" v-model="searchText"
                         @keyup="search"/>
                  <button type="button" class="btn btn-xs btn-info" @click="reload()">
                    <font-awesome-icon icon="search"></font-awesome-icon>
                  </button>

                  <select class="ml-3" id="searchStatus" @change="reload()" v-model="searchStatus">
                    <option v-bind:value="key" v-for="(value, key) in this.statusList">{{ value }}</option>
                    <option value="todos" >Todos</option>
                  </select>

                </div>
              </div>
              <div class="col-sm-6 d-flex justify-content-end">

                <a class="btn btn-xs btn-info mr-2" :href="$router.resolve({ name: 'Presupuestos'}).href" >Presupuestos</a>

                <button type="button" class="btn btn-xs btn-info" @click="reload()">
                  <font-awesome-icon icon="sync"></font-awesome-icon>
                  Actualizar
                </button>

                <button type="button" class="btn btn-xs btn-success ml-1" @click="showCreateForm()">
                  <font-awesome-icon icon="plus"></font-awesome-icon>
                  Crear Resultado
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div id="clientView-listado" class="col-sm-12">
            <b-overlay :show="loadingList" opacity="0.6" spinner-variant="primary">
              <div class="table-responsive">
                <table class="table table-hover">

                  <thead>
                  <th>Secuencia</th>
                  <th>Datos</th>
                  <th>Info</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                  <th>
                    Estado
                    <span class="badge badge-pill badge-danger mr-2 ml-2"> {{ newsCount }} </span>
                    <span class="badge badge-pill badge-warning"> {{ informationMissingCount }} </span>
                  </th>
                  </thead>

                  <tbody>
                  <template v-if="viewsPaginator && viewsPaginator.data">
                    <tr v-for="(clientViewStorage, i) in viewsPaginator.data" :key="i" :class="clientViewStorage.read ? '' : 'font-weight-bold'">
                      <td>{{ clientViewStorage.sequence.name }}</td>
                      <td>{{ abstract(clientViewStorage) }}</td>
                      <td>
                        <button class="btn btn-sm btn-info" @click="infoForm(clientViewStorage)">
                          Info
                        </button>
                      </td>
                      <td>
                        {{ clientViewStorage.updated_at }}
                      </td>
                      <td>
                        <button class="btn btn-sm btn-success" @click="edit(clientViewStorage)">
                          <font-awesome-icon icon="eye"></font-awesome-icon>
                        </button>
                      </td>
                      <td>
                        <span class="badge badge-pill"
                              :class="clientViewStorage.status === 'procesado'?
                                'badge-success'  :
                                clientViewStorage.status === 'faltaInfo'?
                                  'badge-warning' :
                                  'badge-danger'">
                          {{ statusList.hasOwnProperty(clientViewStorage.status) ? statusList[clientViewStorage.status] : 'Nuevo' }}
                        </span>

                      </td>
                    </tr>
                  </template>
                  <template v-if="!viewsPaginator || !viewsPaginator.data || viewsPaginator.data.length == 0">
                    <tr>
                      <td class="text-center" colspan="7"><strong>No posee secuencias realizadas.</strong></td>
                    </tr>
                  </template>
                  </tbody>
                </table>
              </div>
              <pagination ref="pagination" :data="viewsPaginator"
                          @pagination-change-page="getListClientViewStorage"
                          :align="paginatorProps.align"
                          :size="paginatorProps.size"
                          :limit="paginatorProps.limit">
              </pagination>
            </b-overlay>
          </div>
        </div>
      </div>
    </div>


    <b-modal id="modal-edit" hide-footer size="xl">
      <template #modal-title>
        Secuencia de cliente
      </template>
      <div class="row">
      <div class="col-lg-12" >  <!--    style="overflow-y:auto; max-height: 100vh">-->
        <div class="form-group">
          <label class="control-label col-12" for="status">Estado</label>
          <div class="col-12">
            <select id="status2" class="form-control" name="status" @change="sendStatus" v-model="selectClientViewStorage.status">
              <option v-bind:value="key" v-for="(value, key) in this.statusList">{{ value }}</option>
            </select>
          </div>
        </div>
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
              <th>Nombre del campo</th>
              <th>Valor</th>

              </thead>

              <tbody>
              <tr>
                <td>Scuencia </td>
                <td>
                  {{ selectClientViewStorage.sequence.name }}
                </td>
              </tr>
              <tr>
                <td>Fecha de Creación </td>
                <td>
                  {{ selectClientViewStorage.created_at }}
                </td>
              </tr>
              <tr>
                <td>Fecha de Modificación </td>
                <td>
                  {{ selectClientViewStorage.updated_at }}
                </td>
              </tr>

              <tr v-for="(dataStorage, i) in selectClientViewStorage.dataStorage" :key="i">
                <td>{{ dataStorage.name }}</td>
                <td v-if="dataStorage.type === 'text' || dataStorage.type === 'string'">
                  {{ dataStorage.value }}
                </td>
                <td v-else-if="dataStorage.type === 'file'">
                  <a :href="selectClientViewStorage.urlBase + dataStorage.value" target="_blank" > {{ selectClientViewStorage.urlBase}}{{ dataStorage.value }} </a>
                </td>
              </tr>
              <tr>
                <td> Ingreso Manual</td>
                <td>
                  <mc-wysiwyg name="info" v-model="selectClientViewStorage.info"> </mc-wysiwyg>
                </td>
              </tr>
              <tr v-for="(attach, i) in selectClientViewStorage.attach" :key="i + '_manual'">
                <td>

                </td>
                <td>
                  <a :href="selectClientViewStorage.urlBase + attach" target="_blank"> {{
                    selectClientViewStorage.urlBase}}{{ attach }} </a>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <button @click="$bvModal.hide('modal-edit')" type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
        </div>
      </div>

    </b-modal>

    <b-modal id="modal-info" hide-footer size="xl">
      <template #modal-title>
        Formulario de la empresa
      </template>
      <div class="row">
        <div class="col-lg-12" >  <!--    style="overflow-y:auto; max-height: 100vh">-->
          <b-overlay :show="loadingEdit" opacity="0.6" spinner-variant="primary">
            <form id="form-info" action="#!" method="post">

              <div v-if="errors" class="alert alert-danger" role="alert">
                <ul>
                  <li v-for="error in getErrosList()">{{ error }}</li>
                </ul>
              </div>

              <div class="form-group">
                <label class="control-label col-12" :class="errors && errors.info ? 'text-danger' :''" >Texto de información</label>
                <div class="col-12">
                  <mc-wysiwyg name="info" v-model="selectClientViewStorage.info">
                  </mc-wysiwyg>
<!--                  <textarea class="form-control" name="info" v-model="selectClientViewStorage.info"-->
<!--                            :class="errors && errors.info ? 'is-invalid' :''">-->
<!--                  </textarea>-->
                </div>
              </div>

              <div class="form-group">
                <label class="control-label col-12" for="status">Estado</label>
                <div class="col-12">
                  <select id="status" class="form-control" :class="errors && errors.status ? 'is-invalid' :''" name="status" v-model="selectClientViewStorage.status">
                    <option v-bind:value="key" v-for="(value, key) in this.statusList">{{ value }}</option>
                  </select>
                </div>
              </div>

              <div class="form-group" v-if="selectClientViewStorage.id">
                <label class="control-label col-12">Adjuntos</label>
                <input ref="file" type="file" id="file" class="file-input" @change="sendFile">
                <b-button variant="outline-primary" size="sm" @click="browseFiles">Explorar</b-button>
                <span class="browser-text">Selecione un Archivo</span>
              </div>

              <div class="table-responsive" v-if="selectClientViewStorage.id">
                <table class="table table-hover">
                  <thead>
                  <th>Archivo</th>
<!--                  <th>Accion</th>-->
                  </thead>
                  <tbody>
                  <tr v-for="(attach, i) in selectClientViewStorage.attach" :key="i">
                    <td>
                      <a :href="selectClientViewStorage.urlBase + attach" target="_blank" > {{ selectClientViewStorage.urlBase}}{{ attach }} </a>
                    </td>
<!--                    <td>-->
<!--                      <button class="btn btn-sm btn-danger" @click="deleteFile()"><font-awesome-icon icon="trash"></font-awesome-icon></button>-->
<!--                    </td>-->
                  </tr>
                  </tbody>
                </table>
              </div>

            </form>
            <button type="button" class="btn btn-success" @click="infoSave()">Guardar</button>
            <button @click="$bvModal.hide('modal-info')" type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
          </b-overlay>
        </div>
      </div>

    </b-modal>

  </div>
</template>

<script>
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
  import { faEye, faPencilAlt, faTrash, faPlus, faSync, faSearch } from '@fortawesome/free-solid-svg-icons'
  import { library } from '@fortawesome/fontawesome-svg-core'

  import { McWysiwyg } from '@mycure/vue-wysiwyg'

  import VueToastr from 'vue-toastr'
  import swal from 'sweetalert2'

  import pagination from 'laravel-vue-pagination'

  import ClientViewServiceClass from '../Services/clientViewService'

  const ClientViewService = new ClientViewServiceClass()

  library.add(faEye)
  library.add(faPencilAlt)
  library.add(faTrash)
  library.add(faPlus)
  library.add(faSync)
  library.add(faSearch)

  export default {
    name: 'ClientViewStorage',
    components: {
      FontAwesomeIcon,
      VueToastr,
      pagination,
      McWysiwyg
    },
    data () {
      return {
        viewsPaginator: {},
        newsCount: 0,
        informationMissingCount: 0,
        total: 15,
        loadingList: false,
        loadingEdit: false,
        paginatorProps: {
          align: 'center',
          size: 'default',
          limit: 1
        },
        searchText: '',
        selectClientViewStorage: {
          sequence: {},
          dataStorage: [],
          info: ''
        },
        statusList: {
          nuevo: 'Nuevo',
          faltaInfo: 'Falta información',
          procesado: 'Procesado'
        },
        errors: undefined,
        searchStatus: 'todos'
      }
    },
    mounted () {
      this.getListClientViewStorage()
    },
    methods: {

      async reload () {
        this.getListClientViewStorage(this.$refs.pagination.current_page)
      },

      search (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
          this.reload()
        }
      },

      async getListClientViewStorage (page = 1) {
        this.loadingList = true
        try {
          let data = await ClientViewService.getDataList(page, this.total, this.searchText,
            this.searchStatus !== 'todos' ? this.searchStatus : '')
          if (data) {
            this.viewsPaginator = data.listPaginator
            this.newsCount = data.newsCount
            this.informationMissingCount = data.informationMissingCount
          }
        } catch (e) {
          this.$refs.toastr.e('¡Error al listar los datos de la secuencias recorridas por el cliente!')
          console.log(e)
        }
        this.loadingList = false
      },

      getDataStorage (clientViewStorage) {
        let result = []
        for (const [key, value] of Object.entries(clientViewStorage)) {
          if (typeof value === 'object' && value !== null) {
            if ('type' in value && 'value' in value && 'name' in value) {
              result.push(value)
            }
          }
          if (Array.isArray(value) && key) {
            for (let i = 0; i < value.length; i++) {
              let obj = value[i]
              if (typeof obj === 'object' && obj !== null && 'type' in obj && 'value' in obj && 'name' in obj) {
                result.push(obj)
              }
            }
          }
        }
        return result
      },

      async edit (view) {
        this.loadingList = true
        try {
          let data = await ClientViewService.detailData(view.id, true)
          if (data) {
            this.selectClientViewStorage = data
            this.selectClientViewStorage.dataStorage = this.getDataStorage(this.selectClientViewStorage.data)
            this.$bvModal.show('modal-edit')
            view.read = true
          }
        } catch (e) {
          this.$refs.toastr.e('¡Error al obtener los datos de la secuencia recorrida por el cliente!')
          console.log(e)
        }

        this.loadingList = false
      },

      async infoForm (view) {
        this.loadingList = true
        try {
          let data = await ClientViewService.detailData(view.id)
          if (data) {
            this.selectClientViewStorage = data
            this.selectClientViewStorage.dataStorage = this.getDataStorage(this.selectClientViewStorage.data)
            this.errors = undefined
            this.$bvModal.show('modal-info')
          }
        } catch (e) {
          this.$refs.toastr.e('¡Error al obtener la información los datos de la secuencia recorrida por el cliente!')
          console.log(e)
        }

        this.loadingList = false
      },

      async infoSave () {
        this.loadingEdit = true
        let data
        try {
          if (this.selectClientViewStorage.id){
            data = await ClientViewService.updateDataInfo(this.selectClientViewStorage.id,
              this.selectClientViewStorage.info, this.selectClientViewStorage.status)
          } else {
            data = await ClientViewService.createManualData(this.selectClientViewStorage)
          }
          if (data) {
            this.$bvModal.hide('modal-info')
            this.reload()
          }
        } catch (e) {
          if (e.response && e.response.status === 422) {
            this.$refs.toastr.e('¡Error de validación!')
            this.errors = e.response.data
          } else {
            this.$refs.toastr.e('¡Error al guardar la información los datos de la secuencia recorrida por el cliente!')
            console.log(e)
          }
        }
        this.loadingEdit = false
      },

      async sendStatus (event) {
        console.log('event', event)
        this.loadingEdit = true
        try {
          let data = await ClientViewService.updateDataStatus(this.selectClientViewStorage.id, this.selectClientViewStorage.status)
          if (data) {
            this.reload()
          }
        } catch (e) {
          this.$refs.toastr.e('¡Error al intentar cambiar el estado!')
          console.log(e)
        }
        this.loadingEdit = false
      },

      abstract (clientViewStorage) {
        let result = ''
        let decision = ''
        let data = this.getDataStorage(clientViewStorage.data)
        for (let i = 0; i < data.length; i++) {
          if (data[i].type === 'string') {
            if (data[i].name === 'Decidió') {
              decision = decision.length === 0 ? data[i].value : decision + '/' + data[i].value
            } else {
              result = result.length === 0 ? data[i].value : result + '/' + data[i].value
            }
          }
        }
        result = result.length === 0 ? decision : result
        if (result.length > 0) {
          return result
        }
        if (clientViewStorage.info) {
          return this.stripWYSIWYG(clientViewStorage.info).substring(0, 15)
        }
        return ''
      },

      getErrosList () {
        let result = []
        if (this.errors) {
          for (let property in this.errors) {
            for (let i = 0; i < this.errors[property].length; i++) {
              result.push(this.errors[property][i])
            }
          }
        }
        return result
      },

      async sendFile (event) {
        this.loadingEdit = true
        try {
          let data = await ClientViewService.uploadFile(this.selectClientViewStorage.id, event.target.files)
          if (data) {
            this.selectClientViewStorage.attach = data.attach ? data.attach : this.selectClientViewStorage.attach
          }
        } catch (e) {
          this.$refs.toastr.e('¡Error al adjuntar archivo!')
          console.log(e)
        }
        this.loadingEdit = false
      },

      showCreateForm () {
        this.selectClientViewStorage = {
          sequence: {
            id: '31351eb9-7ec0-4165-9249-6901767ed371'
          },
          dataStorage: [],
          info: ''
        }
        this.errors = undefined
        this.$bvModal.show('modal-info')
      },

      stripWYSIWYG (text) {
        return text.replace(/(<([^>]+)>)/ig,'')
      },

      browseFiles () {
        this.$refs.file.click()
      }
      // async deleteFile () {
      // swal({
      //   title: `¿Desea eliminar el adjunto : ${filename}?`,
      //   text: 'No podrá ser recuperado',
      //   type: 'question',
      //   customClass: 'unfont-size',
      //   showCancelButton: true
      // }).then(async selected => {
      //   if (selected.value) {
      // this.loadingEdit = true
      // try {
      //   let data = await ClientViewService.delteFile(this.selectClientViewStorage.id, filename)
      //   if (data) {
      //     this.selectClientViewStorage.attach = data.attach ? data.attach : this.selectClientViewStorage.attach
      //   }
      // } catch (e) {
      //   this.$refs.toastr.e('¡Error al eliminar archivo!')
      //   console.log(e)
      // }
      // this.loadingEdit = false
      //   }
      // })
      // }
    }
  }
</script>

<style scoped>

  .file-input {
    display: none;
  }

</style>
