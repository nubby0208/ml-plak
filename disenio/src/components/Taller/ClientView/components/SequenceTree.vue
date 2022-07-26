<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 tree-panel scrollbox">
        <drop @dragenter="this.outside" @drop="this.drop" class="outside-drop" @dragleave="this.dragleave" >
          <div class="org-tree-container">
            <div class="org-tree horizontal collapsable">
              <tree-node v-bind:node="this.viewsSequence.sequenceTree" v-bind:visible="this.visibleNews"
                         @emptied="emptiedTreeView" v-if="this.viewsSequence.sequenceTree"
                         :key="this.viewsSequence.sequenceTree.key" v-bind:views="this.viewsSequence.viewsUsed"></tree-node>
            </div>
          </div>
          <template v-slot:drag-image="{data}">
            <span class="org-tree-node-btn"></span>
          </template>
        </drop>
      </div>

      <div id="app-clientView-list" class="col-md-4 views-list-panel scrollbox">
        <div class="row" >
          <div class="col-sm-12 text-center">
            <h3> Vistas </h3>
          </div>
        </div>

        <div class="row mb-1">
          <div class="col-sm-12">
            <div class="input-group rounded">
              <input type="search" class="form-control rounded" placeholder="Buscar" aria-label="Buscar" v-model="searchText" v-on:change="reload()">
            </div>
          </div>
        </div>

        <div class="row">
          <div id="clientView-listado" class="col-sm-12">
            <b-overlay :show="loadingList" opacity="0.6" spinner-variant="primary">
              <b-list-group v-if="viewsPaginator && viewsPaginator.data && viewsPaginator.data.length > 0">

                <drag :key="i" :data="clientView" v-for="(clientView, i) in viewsPaginator.data">
                  <b-list-group-item  >
                    {{ clientView.name }}
                  </b-list-group-item>
                  <template v-slot:drag-image="{data}">
                    <span class="out-area org-tree-node-btn"></span>
                  </template>
                </drag>

              </b-list-group>

              <div v-else>
                <strong>No hay resultados</strong>
              </div>

              <pagination class="mt-5" ref="pagination" :data="viewsPaginator"
                          @pagination-change-page="getListClientView"
                          :align="paginatorProps.align"
                          :size="paginatorProps.size">
              </pagination>
            </b-overlay>
          </div>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
  import { Drag, Drop } from 'vue-easy-dnd'
  import VueToastr from 'vue-toastr'
  import pagination from 'laravel-vue-pagination'
  import ClientViewServiceClass from '../../Services/clientViewService'
  import TreeNode from './TreeNode'

  const ClientViewService = new ClientViewServiceClass()

  export default {
    name: 'SequenceTree',
    components: {
      Drag,
      Drop,
      VueToastr,
      pagination,
      TreeNode
    },
    data: function () {
      return {
        viewsPaginator: {},
        total: 30,
        loadingList: false,
        searchText: '',
        paginatorProps: {
          align: 'center',
          size: 'default'
        },
        visibleNews: false,
      }
    },
    props: {
      viewsSequence: {
        type: Object,
        default: () => {
          return {
            sequenceTree: undefined,
            viewsUsed: {}
          }
        }
      }
    },
    mounted () {
      this.getListClientView()
    },
    methods: {
      outside (e) {
        this.visibleNews = true
      },

      dragleave (e) {
        this.visibleNews = false
      },

      drop (e) {
        this.visibleNews = false
        if (!this.viewsSequence.sequenceTree) {
          this.viewsSequence.viewsUsed[e.data.id] = e.data
          this.viewsSequence.sequenceTree = {
            viewId: e.data.id,
            key: 'r',
            children: [],
            parent: undefined
          }
        }
      },

      async reload () {
        this.getListClientView(this.$refs.pagination.current_page)
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

      emptiedTreeView () {
        this.$emit('emptied')
      }
    },
    model:{

    }
  }
</script>

<style>

  .scrollbox {
    overflow-x: scroll;
    overflow-y: scroll;
    height: 50vh;
  }

  .views-list-panel, .tree-panel{
    border: solid 1px #007bff;
    border-radius: 4px;
    margin-top: 10px;
    padding-top: 15px;
  }

  .tree-panel{
    background-color: #fff;
  }

  .list-group-item{
    background-color: #007bff;
    border: 1px solid rgba(0,0,0,.125);
    margin: 10px;
    border-radius: 3px !important;
    color: #fff;
    box-shadow: 0 1px 5px rgb(0, 123, 255);
  }

  .org-tree-container {
    display: block;
    padding: 15px;
    background-color: #fff;
    min-height: 100%;
  }

  .org-tree {
    display: table;
    text-align: center
  }

  .org-tree:after, .org-tree:before {
    content: "";
    display: table
  }

  .org-tree:after {
    clear: both
  }

  .org-tree-node, .org-tree-node-children {
    position: relative;
    margin: 0;
    padding: 0;
    list-style-type: none
  }

  .org-tree-node-children:after, .org-tree-node-children:before, .org-tree-node:after, .org-tree-node:before {
    -webkit-transition: all .35s;
    transition: all .35s
  }

  .org-tree-node-label {
    position: relative;
    display: inline-block
  }

  .org-tree-node-label .org-tree-node-label-inner {
    padding: 10px 15px;
    text-align: center;
    border-radius: 3px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, .15)
  }

  .org-tree-node-btn {
    position: absolute;
    top: 100%;
    left: 50%;
    width: 25px;
    height: 25px;
    z-index: 9;
    margin-left: -11px;
    margin-top: 9px;
    background-color: #fff;
    border: 1px solid #007bff;
    border-radius: 50%;
    box-shadow: 0 0 2px rgb(0, 123, 255);
    cursor: pointer;
    -webkit-transition: all .35s ease;
    transition: all .35s ease
  }

  .org-tree-node-btn:hover {
    background-color: #e7e8e9;
    -webkit-transform: scale(1.15);
    transform: scale(1.15)
  }

  .org-tree-node-btn:after, .org-tree-node-btn:before {
    content: "";
    position: absolute
  }

  .org-tree-node-btn:before {
    top: 50%;
    left: 4px;
    right: 4px;
    height: 0;
    border-top: 1px solid #007bff
  }

  .org-tree-node-btn:after {
    top: 4px;
    left: 50%;
    bottom: 4px;
    width: 0;
    border-left: 1px solid #007bff
  }



  .out-area.org-tree-node-btn:before {
    border-top-color: #b21f2d;
  }

  .out-area.org-tree-node-btn:after {
    border-left-color: #b21f2d;
  }

  .out-area.org-tree-node-btn {
    border-color: #b21f2d;
    box-shadow: 0 0 2px rgba(225, 83, 97, 0.5);
  }

  .int-area.org-tree-node-btn:before {
    border-top-color: #28a745;
  }

  .int-area.org-tree-node-btn:after {
    border-left-color: #28a745;
  }

  .int-area.org-tree-node-btn {
    border-color: #28a745;
    box-shadow: 0 0 2px rgba(72, 180, 97, 0.5);
  }



  .org-tree-node-btn.expanded:after {
    border: none
  }

  .org-tree-node {
    padding-top: 20px;
    display: table-cell;
    vertical-align: top
  }

  .org-tree-node.collapsed, .org-tree-node.is-leaf {
    padding-left: 10px;
    padding-right: 10px
  }

  .org-tree-node:after, .org-tree-node:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 19px
  }

  .org-tree-node:after {
    left: 50%;
    border-left: 1px solid #ddd
  }

  .org-tree-node:not(:first-child):before, .org-tree-node:not(:last-child):after {
    border-top: 1px solid #ddd
  }

  .collapsable .org-tree-node.collapsed {
    padding-bottom: 30px
  }

  .collapsable .org-tree-node.collapsed .org-tree-node-label:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 0;
    width: 50%;
    height: 20px;
    border-right: 1px solid #ddd
  }

  .org-tree > .org-tree-node {
    padding-top: 0
  }

  .org-tree > .org-tree-node:after {
    border-left: 0
  }

  .org-tree-node-children {
    padding-top: 20px;
    display: table
  }

  .org-tree-node-children:before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    width: 0;
    height: 20px;
    border-left: 1px solid #ddd
  }

  .org-tree-node-children:after {
    content: "";
    display: table;
    clear: both
  }

  .horizontal .org-tree-node {
    display: table-cell;
    float: none;
    padding-top: 0;
    padding-left: 20px
  }

  .horizontal .org-tree-node.collapsed, .horizontal .org-tree-node.is-leaf {
    padding-top: 10px;
    padding-bottom: 10px
  }

  .horizontal .org-tree-node:after, .horizontal .org-tree-node:before {
    width: 19px;
    height: 50%
  }

  .horizontal .org-tree-node:after {
    top: 50%;
    left: 0;
    border-left: 0
  }

  .horizontal .org-tree-node:only-child:before {
    top: 1px;
    border-bottom: 1px solid #ddd
  }

  .horizontal .org-tree-node:not(:first-child):before, .horizontal .org-tree-node:not(:last-child):after {
    border-top: 0;
    border-left: 1px solid #ddd
  }

  .horizontal .org-tree-node:not(:only-child):after {
    border-top: 1px solid #ddd
  }

  .horizontal .org-tree-node .org-tree-node-inner {
    display: table
  }

  .horizontal .org-tree-node-label {
    display: table-cell;
    vertical-align: middle
  }

  .horizontal.collapsable .org-tree-node.collapsed {
    padding-right: 30px
  }

  .horizontal.collapsable .org-tree-node.collapsed .org-tree-node-label:after {
    top: 0;
    left: 100%;
    width: 20px;
    height: 50%;
    border-right: 0;
    border-bottom: 1px solid #ddd
  }

  .horizontal .org-tree-node-btn {
    top: 50%;
    left: 100%;
    margin-top: -11px;
    margin-left: 9px
  }

  .horizontal > .org-tree-node:only-child:before {
    border-bottom: 0
  }

  .horizontal .org-tree-node-children {
    display: table-cell;
    padding-top: 0;
    padding-left: 20px
  }

  .horizontal .org-tree-node-children:before {
    top: 50%;
    left: 0;
    width: 20px;
    height: 0;
    border-left: 0;
    border-top: 1px solid #ddd
  }

  .horizontal .org-tree-node-children:after {
    display: none
  }

  .horizontal .org-tree-node-children > .org-tree-node {
    display: block
  }

  .outside-drop{
    margin: -15px;
    height: 100%;
  }

</style>
