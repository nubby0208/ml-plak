<template>
    <div id="app-clientView-list" class="container-fluid">
      <vue-toastr ref="toastr"></vue-toastr>
      <div class="row">
        <div class="col-sm-12">
          <div class="row">
            <div class="col-sm-12 text-center py-3">
              <div class="row">
                <div class="col-sm-6">
                  <div class="input-group">
                    <input type="search" id="form1" class="form-control" placeholder="Buscar" v-model="searchText"
                           @keyup="search"/>
                    <button type="button" class="btn btn-xs btn-info" @click="reload()">
                      <font-awesome-icon icon="search"></font-awesome-icon>
                    </button>
                  </div>
                </div>
                <div class="col-sm-6 d-flex justify-content-end">
                  <button type="button" class="btn btn-xs btn-info mr-1" @click="reload()">
                    <font-awesome-icon icon="sync"></font-awesome-icon>
                    Actualizar
                  </button>
                  <button type="button" class="btn btn-xs btn-success ml-1" @click="create()">
                    <font-awesome-icon icon="plus"></font-awesome-icon>
                    Nueva Vista
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
<!--                            <th>id</th>-->
                            <th>Plantilla</th>
                            <th>Vista</th>
                            <th>Acciones</th>
                        </thead>

                        <tbody>
                            <template v-if="viewsPaginator && viewsPaginator.data">
                                <tr v-for="(clientView, i) in viewsPaginator.data" :key="i">
<!--                                    <td>{{ clientView.id }}</td>-->
                                    <td>{{ clientView.clientTemplate.name }}</td>
                                    <td>{{ clientView.name}}</td>
                                    <td>
                                        <button class="btn btn-sm btn-success" @click="show(clientView)"><font-awesome-icon icon="eye"></font-awesome-icon></button>
                                        <button class="btn btn-sm btn-warning" @click="edit(clientView)"><font-awesome-icon icon="pencil-alt"></font-awesome-icon></button>
<!--                                        <button class="btn btn-sm btn-danger" @click="del(clientView)"><font-awesome-icon icon="trash"></font-awesome-icon></button>-->
                                    </td>
                                </tr>
                            </template>
                            <template v-if="!viewsPaginator && viewsPaginator.data">
                                <tr>
                                    <td class="text-center" colspan="7"><strong>No posee vistas creadas</strong></td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
                <pagination ref="pagination" :data="viewsPaginator"
                            @pagination-change-page="getListClientView"
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
          Vista de cliente
        </template>
        <div class="row">
          <div class="col-lg-6">
            <client-view-show :view="this.selectView" :design-mode="true"></client-view-show>
          </div>
          <div class="col-lg-6" style="overflow-y:auto; max-height: 100vh">
            <b-overlay :show="loadingEdit" opacity="0.6" spinner-variant="primary">
              <form id="form-view" action="#!" method="post">
                <div class="form-group">
                  <label class="control-label col-12" for="name">Nombre de la vista</label>
                  <div class="col-12">
                    <input id="name" class="form-control" name="name" type="text" v-model="selectView.name">
                  </div>
                </div>

                <div class="form-group">
                  <label class="control-label col-12" for="template">Plantilla</label>
                  <div class="col-12">
                    <select id="template" class="form-control" name="template" @change="onChangeTemplate($event)" v-model="selectView.template_id">
                      <option v-bind:value="view.id" v-for="view in templates.data">{{ view.name }}</option>
                    </select>
                  </div>
                </div>

                <div v-if="selectView.fieldsValues !== null">
                  <div class="form-group" v-for="(field, key) in this.selectView.fieldsValues">
                    <label class="control-label col-12" v-bind:for="key">{{field.name}}</label>
                    <div class="col-12">

                      <client-view-file-input
                        v-if="field.type === 'file'"
                        :limit="1"
                        :fileUrl="[getFileUrl(field.value, field.templateUrl)]"
                        :file="field">
                      </client-view-file-input>

                      <textarea v-if="field.type === 'text'" v-bind:id="key" class="form-control" v-bind:name="key" v-model="field.value"></textarea>
                      <input v-if="field.type === 'string'" v-bind:id="key" class="form-control" v-bind:name="key" v-model="field.value">

                      <select v-if="field.type === 'numberLink'" v-bind:id="key" class="form-control" v-bind:name="key" v-model="field.value">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                      </select>

                      <div v-if="field.type === 'typeMultiFileAndText'">
                        <div v-for="(multiFileAndText, keyVal) in field.value ">
                          <client-view-file-input
                            :limit="1"
                            :fileUrl="[getFileUrl(multiFileAndText.url, multiFileAndText.templateUrl)]"
                            v-on:addFile="multiFileChange($event, multiFileAndText)"
                            v-on:removedFile="multiFileChange($event, multiFileAndText)"
                            v-on:removedUrl="multiFileRemoveUrl($event, multiFileAndText)"
                            >
                          </client-view-file-input>
                          <textarea v-bind:id="keyVal" class="form-control" v-bind:name="keyVal" v-model="multiFileAndText.text"></textarea>
                          <button type="button" class="btn btn-danger" v-on:click="removeMultiFileAndTextElement(field, keyVal)" >Eliminar</button>
                        </div>

                        <button type="button" class="btn btn-success mt-3" v-on:click="addMultiFileAndTextElement(field)" >Adicionar</button>
                      </div>

                    </div>
                  </div>
                </div>
              </form>
              <button type="button" class="btn btn-success" @click="save()">Guardar</button>
              <button @click="$bvModal.hide('modal-edit')" type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
            </b-overlay>
          </div>
        </div>

      </b-modal>

      <b-modal id="modal-show" hide-footer hide-header centered>
        <div style="margin: -15px;">
          <client-view-show :view="this.selectView"></client-view-show>
        </div>
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

  import ClientViewFileInput from './components/ClientViewFileInput'
  import ClientViewShow from './components/ClientViewViewShow'
  import ClientViewServiceClass from '../Services/clientViewService'

  const ClientViewService = new ClientViewServiceClass()

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
      ClientViewFileInput,
      ClientViewShow
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
        templates: { },
        selectView: {
          name: '',
          fieldsValues: null,
          template_id: null
        }
      }
    },
    mounted () {
      this.getListClientTemplates()
      this.getListClientView()
    },
    methods: {
      async save () {
        let save = false
        let upload = null
        this.loadingEdit = true
        try {
          upload = await ClientViewService.uploadFieldsValues(this.selectView)
        } catch (e) {
          this.$refs.toastr.e('¡Error al subir archivos!')
          this.loadingEdit = false
          return false
        }
        if (upload) {
          for (let key in upload) {
            if (this.selectView.fieldsValues[key].type === 'typeMultiFileAndText') {
              for (let subKey in upload[key]) {
                this.selectView.fieldsValues[key].value[subKey].url = upload[key][subKey]
                this.selectView.fieldsValues[key].value[subKey].uploadTempFile = true
              }
            } else {
              this.selectView.fieldsValues[key].value = upload[key][0]
              this.selectView.fieldsValues[key].uploadTempFile = true
            }
          }
        }
        if (this.selectView.hasOwnProperty('id') && (this.selectView.id)) {
          try {
            await ClientViewService.update(this.selectView)
            save = true
            this.$refs.toastr.s('¡Vista actualizada con éxito!')
            this.$bvModal.hide('modal-edit')
            this.reload()
          } catch (e) {
            if (!save) this.$refs.toastr.e('¡Error al actualizar la vista!')
          }
        } else {
          try {
            await ClientViewService.store(this.selectView)
            save = true
            this.$refs.toastr.s('¡Vista creada con éxito!')
            this.$bvModal.hide('modal-edit')
            this.reload()
            this.loadingList = false
          } catch (e) {
            if (!save) this.$refs.toastr.e('¡Error al crear la vista!')
          }
        }
        this.loadingEdit = false
        return true
      },

      create () {
        this.selectView = {
          name: '',
          fieldsValues: null,
          template_id: null
        }
        this.$bvModal.show('modal-edit')
      },

      async reload () {
        this.getListClientView(this.$refs.pagination.current_page)
      },

      search (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
          this.reload()
        }
      },

      async getListClientTemplates () {
        this.templates = await ClientViewService.getTemplateList()
      },

      async getListClientView (page = 1) {
        this.loadingList = true
        let data = await ClientViewService.getList(page, this.total, this.searchText)
        if (data) {
          this.viewsPaginator = data
        }
        this.loadingList = false
      },

      onChangeTemplate (event) {
        let template = this.getTemplate(this.selectView.template_id)
        if (template) {
          this.selectView.fieldsValues = JSON.parse(JSON.stringify(template.fields))
        } else {
          this.selectView.fieldsValues = null
        }
      },

      getTemplate (id) {
        return this.templates.data.find(element => element.id === id)
      },

      getFileUrl (fileUrl, templateUrl) {
        if (!fileUrl) {
          return ''
        }
        if (fileUrl.indexOf('https://') === 0 || fileUrl.indexOf('http://') === 0) {
          return fileUrl
        }
        if (templateUrl) {
          return `${process.env.BACKEND_BASE_URL}/${fileUrl}`
        } else {
          return this.selectView.urlBase + fileUrl
        }
      },

      edit (view) {
        this.selectView = {
          name: view.name,
          fieldsValues: view.fieldsValues,
          template_id: view.template_id,
          id: view.id,
          urlBase: view.urlBase
        }
        this.$bvModal.show('modal-edit')
      },

      show (view) {
        this.selectView = view
        this.$bvModal.show('modal-show')
      },

      async del (view) {
        swal({
          title: `¿Desea eliminar la vista : ${view.name}?`,
          text: 'No podrá ser recuperado',
          type: 'question',
          customClass: 'unfont-size',
          showCancelButton: true
        }).then(async selected => {
          if (selected.value) {
            this.loadingList = true
            let response = await ClientViewService.delete(view.id)
            if (response === true) {
              this.reload()
              this.$refs.toastr.s('¡La vista se ha eliminado con éxito!')
            }
            this.loadingList = true
          }
        })
      },

      multiFileChange (event, element) {
        if (event.files.length > 0) {
          element.url = URL.createObjectURL(event.files[0])
          element.file = event.files[0]
        } else {
          element.url = null
          element.file = null
        }
      },

      multiFileRemoveUrl (event, element) {
        if (event.urls.length === 0) {
          element.url = null
        } else element.url = event.urls[0]
      },

      removeMultiFileAndTextElement (field, keyVal) {
        field.value.splice(keyVal, 1)
      },

      addMultiFileAndTextElement (field) {
        field.value.push({
          url: null,
          text: null,
          templateUrl: false
        })
      }

    }
  }
</script>

<style>

</style>
