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
                </div>
              </div>
              <div class="col-sm-6 d-flex justify-content-end">
                <button type="button" class="btn btn-xs btn-info mr-1" @click="reload()">
                  <font-awesome-icon icon="sync"></font-awesome-icon>
                  Actualizar
                </button>
                <button type="button" class="btn btn-xs btn-success ml-1" @click="create()">
                  <font-awesome-icon icon="plus"></font-awesome-icon>
                  Nueva Secuencia
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
                  <th>Secuencias</th>
                  <th>Url</th>
                  <th>Acciones</th>
                  </thead>

                  <tbody>
                  <template v-if="viewsPaginator && viewsPaginator.data">
                    <tr v-for="(clientViewSequence, i) in viewsPaginator.data" :key="i">
                      <td>{{ clientViewSequence.name }}</td>
                      <td>
                        <a v-if="clientViewSequence.public"
                           :href="getFrontSequenceUrl(clientViewSequence.id)"
                           target='_blank'>
                            {{ getFrontSequenceUrl(clientViewSequence.id) }}
                        </a>
                      </td>
                      <td>
                        <button v-bind:class="[clientViewSequence.public ? 'btn-success' : 'btn-warning', 'btn btn-sm']"
                                @click="show(clientViewSequence)">
                          <font-awesome-icon icon="eye"></font-awesome-icon>
                        </button>
                        <button class="btn btn-sm btn-info" @click="edit(clientViewSequence)">
                          <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                        </button>
                        <button class="btn btn-sm btn-danger" @click="del(clientViewSequence)">
                          <font-awesome-icon icon="trash"></font-awesome-icon>
                        </button>
                      </td>
                    </tr>
                  </template>
                  <template v-if="!viewsPaginator || !viewsPaginator.data || viewsPaginator.data.length == 0">
                    <tr>
                      <td class="text-center" colspan="7"><strong>No posee secuencias creadas</strong></td>
                    </tr>
                  </template>
                  </tbody>
                </table>
              </div>
              <pagination ref="pagination" :data="viewsPaginator"
                          @pagination-change-page="getListClientViewSequence"
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
        <div class="col-lg-12" style="overflow-y:auto; max-height: 100vh">
          <b-overlay :show="loadingEdit" opacity="0.6" spinner-variant="primary">
            <form id="form-view" action="#!" method="post">
              <div class="form-group">
                <input id="name" class="form-control" name="name" placeholder="Nombre de la secuencia" type="text" v-model="selectViewSequence.name">
                <sequence-tree v-bind:views-sequence="this.selectViewSequence"  @emptied="emptiedTreeView"></sequence-tree>
              </div>

            </form>
            <button type="button" class="btn btn-success" @click="save()">Guardar</button>
            <button @click="$bvModal.hide('modal-edit')" type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
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

  import swal from 'sweetalert2'
  import VueToastr from 'vue-toastr'

  import pagination from 'laravel-vue-pagination'

  import ClientViewServiceClass from '../Services/clientViewService'
  import SequenceTree from './components/SequenceTree'

  const ClientViewService = new ClientViewServiceClass()

  library.add(faEye)
  library.add(faPencilAlt)
  library.add(faTrash)
  library.add(faPlus)
  library.add(faSync)
  library.add(faSearch)

  export default {
    name: 'ClientViewSequence',
    components: {
      FontAwesomeIcon,
      VueToastr,
      pagination,
      SequenceTree
    },
    data () {
      return {
        viewsPaginator: {},
        total: 15,
        loadingList: false,
        loadingEdit: false,
        paginatorProps: {
          align: 'center',
          size: 'default',
          limit: 1
        },
        baseUrl: undefined,
        searchText: '',
        templates: { },
        selectViewSequence: {
          name: '',
          sequenceTree: undefined,
          viewsUsed: {}
        }
      }
    },
    mounted () {
      this.getListClientViewSequence()
    },
    methods: {
      async save () {
        let save = false
        this.loadingEdit = true
        if (this.selectViewSequence.hasOwnProperty('id') && (this.selectViewSequence.id)) {
          try {
            this.removeTreeParentRelation(this.selectViewSequence.sequenceTree)
            await ClientViewService.updateSequence(this.selectViewSequence)
            save = true
            this.$refs.toastr.s('¡Secuencia actualizada con éxito!')
            this.$bvModal.hide('modal-edit')
            this.reload()
          } catch (e) {
            if (!save) this.$refs.toastr.e('¡Error al actualizar la secuencia!')
            console.log(e)
          }
        } else {
          try {
            this.removeTreeParentRelation(this.selectViewSequence.sequenceTree)
            await ClientViewService.storeSequence({ name: this.selectViewSequence.name,
              sequenceTree: this.selectViewSequence.sequenceTree })
            save = true
            this.$refs.toastr.s('¡Secuencia creada con éxito!')
            this.$bvModal.hide('modal-edit')
            this.reload()
          } catch (e) {
            if (!save) this.$refs.toastr.e('¡Error al crear la Secuencia!')
            console.log(e)
          }
        }
        this.loadingEdit = false
        return true
      },

      create () {
        this.selectViewSequence = {
          name: '',
          sequenceTree: undefined,
          viewsUsed: {}
        }
        this.$bvModal.show('modal-edit')
      },

      removeTreeParentRelation (tree) {
        if (tree) {
          for (let i = 0; i < tree.children.length; i++) {
            delete tree.children[i].parent
            this.removeTreeParentRelation(tree.children[i])
          }
        }
      },

      emptiedTreeView () {
        this.selectViewSequence.sequenceTree = undefined
        this.selectViewSequence.viewsUsed = {}
      },

      async reload () {
        this.getListClientViewSequence(this.$refs.pagination.current_page)
      },

      search (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
          this.reload()
        }
      },

      async getListClientViewSequence (page = 1) {
        this.loadingList = true
        try {
          let data = await ClientViewService.getSequenceList(page, this.total, this.searchText)
          if (data) {
            this.viewsPaginator = data
          }
        } catch (e) {
          this.$refs.toastr.e('¡Error al listar la Secuencia!')
          console.log(e)
        }
        this.loadingList = false
      },

      // getFileUrl (fileUrl, templateUrl) {
      //   if (templateUrl) {
      //     return `${process.env.BACKEND_BASE_URL}/${fileUrl}`
      //   } else {
      //     return this.selectView.urlBase + fileUrl
      //   }
      // },

      async edit (view) {
        this.loadingList = true
        try {
          let data = await ClientViewService.detailSequence(view.id)
          if (data) {
            this.selectViewSequence = data.sequence
            this.selectViewSequence.viewsUsed = data.views
            this.$bvModal.show('modal-edit')
          }
        } catch (e) {
          this.$refs.toastr.e('¡Error al obtener la Secuencia!')
          console.log(e)
        }

        this.loadingList = false
      },

      async show (secuence) {
        this.loadingList = true
        try {
          let data = await ClientViewService.publishSequence(secuence.id, {public: !secuence.public})
          if (data) {
            secuence.public = data.public
          }
        } catch (e) {
          this.$refs.toastr.e('¡Error al publicar u ocultar la Secuencia!')
          console.log(e)
        }

        this.loadingList = false
      },

      async del (view) {
        swal({
          title: `¿Desea eliminar la Secuencia : ${view.name}?`,
          text: 'No podrá ser recuperado',
          type: 'question',
          customClass: 'unfont-size',
          showCancelButton: true
        }).then(async selected => {
          if (selected.value) {
            this.loadingList = true
            try {
              let response = await ClientViewService.deleteSequence(view.id)
              if (response === true) {
                this.reload()
                this.$refs.toastr.s('¡La secuencia se ha eliminado con éxito!')
              }
            } catch (e) {
              this.$refs.toastr.e('¡Error al eliminar la Secuencia!')
              console.log(e)
            }
            this.loadingList = true
          }
        })
      },

      getBaseUrl () {
        if (!this.baseUrl) {
          let urlSplit = window.location.href.split('/')
          this.baseUrl = urlSplit[0] + '//' + urlSplit[2] + '/'
          for (let i = 3; i < urlSplit.length - 1; i++) {
            if (urlSplit[i] !== '#' && !urlSplit[i].includes('?')) {
              this.baseUrl = this.baseUrl + urlSplit[i] + '/'
            } else {
              return this.baseUrl
            }
          }
        }
        return this.baseUrl
      },

      getFrontSequenceUrl (sequenceId) {
        return `${process.env.FRONT_CLIENT_SEQUENCE_URL}/${sequenceId}`
      }
    }
  }
</script>

<style>

</style>
