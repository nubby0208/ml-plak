<template>
  <div class="container">
    <vue-toastr ref="toastr"></vue-toastr>
    <b-overlay 
      :show="loading"
      opacity="0.9"
      variant="light"
      blur="5px"
     >
      <div class="row" v-if="sequence">
        <div class="col-12">
          <div class="nextButton" v-if="this.cantNext">
            <a class="btn btn-primary btn-next" @click="changeView"> >> </a>
          </div>
          <div class="nextButton" v-if="this.cantEnd">
            <a class="btn btn-primary btn-next btn-end" @click="endSequence"> Finalizar </a>
<!--            <a class="btn btn-primary btn-next btn-end" @click="loading = true"> Finalizar </a>-->
          </div>
          <div class="previosButton" v-if="this.cantPrevious">
            <a class="btn btn-primary btn-next" @click="previousView"> << </a>
          </div>
          <client-view-show ref="show"
                            :view="this.views[this.currentTreeView.viewId]"
                            :dataShow = "this.dataShow"
                            :base-url-files="this.dataStorage ? this.dataStorage.urlBase : ''"
                            v-if="this.currentTreeView"
                            @cantNextSequence="cantNextSequence"
                            @next="nextSequence"
                            @nextUrl="nextSequenceUrl"
                            @fileErrorLength="fileErrorLength">
          </client-view-show>
        </div>
      </div>
      <div class="row" v-else>
        <div class="col-12">
          <div id="main404">
            <div class="fof">
              <h1 v-if="ready" >La secuencia no existe o no es pública</h1>
            </div>
          </div>
        </div>
      </div>
      <template #overlay>
        <div class="text-center">
          <b-icon icon="stopwatch" font-scale="4" animation="throb" variant="info"></b-icon>
          <h1 class="text-info">Enviando sus datos ...</h1>
          <div v-if="fliesSend && fliesSendingInfo.total > 0">
            <h5 class="text-info" >{{ bytesToSize(fliesSendingInfo.send) }} / {{ bytesToSize(fliesSendingInfo.total) }}</h5>
            <b-progress :max="100" height="1rem">
              <b-progress-bar :value="fliesSendingInfo.percent">
                <strong> {{ fliesSendingInfo.percent }} % </strong>
              </b-progress-bar>
            </b-progress>
          </div>
        </div>
      </template>
    </b-overlay>
  </div>

</template>

<script>
  import ClientViewShow from './components/ClientViewViewShow'
  import ClientViewServiceClass from '../Services/clientViewService'

  import VueToastr from 'vue-toastr'

  const ClientViewService = new ClientViewServiceClass()

  export default {
    name: 'ClientViewExecutor',
    components: {
      ClientViewShow,
      VueToastr
    },
    data () {
      return {
        sequenceId: this.$route.params.id,
        sequence: undefined,
        views: [],
        currentTreeView: undefined,
        currentKey: 'r',
        cantNext: false,
        cantPrevious: false,
        dataStorage: undefined,
        dataSend: undefined,
        loading: false,
        ready: false,
        fliesSend: undefined,
        fliesSendingInfo: {
          total: 0,
          send: 0,
          percent: 0
        },
        dataShow: []
      }
    },
    async created () {
      if (localStorage.clientView) {
        let clientView = JSON.parse(localStorage.getItem('clientView'))
        if (clientView[this.sequenceId]) {
          try {
            let data = await ClientViewService.detailData(clientView[this.sequenceId])
            if (data) {
              this.dataStorage = data
              this.currentKey = data.state
              if (this.dataStorage.data.hasOwnProperty(this.currentKey)) {
                this.dataShow = this.dataStorage.data[this.currentKey]
                this.dataSend = this.dataShow
              }
            }
          } catch (e) {
            console.log(e)
          }
        }
      }
      try {
        let data = await ClientViewService.detailSequence(this.sequenceId)
        if (data && data.sequence.public) {
          this.sequence = data.sequence
          this.views = data.views
          this.currentTreeView = ClientViewService.getTreeByKey(this.sequence.sequenceTree, this.currentKey)
          if (this.dataStorage && this.dataStorage.data.hasOwnProperty(this.currentKey)) {
            this.activeNextButton()
          }
        }
        this.ready = true
      } catch (e) {
        console.log(e)
      }
      this.activePreviousButton()
    },
    computed: {
      cantEnd: function () {
        return this.currentTreeView && this.currentTreeView.children.length === 0
      }
    },
    methods: {
      cantNextSequence (e) {
        if (e.canNext) {
          if (this.currentTreeView.children.length > 0) {
            this.activeNextButton()
            this.dataSend = e.data ? e.data : []
            this.fliesSend = e.files ? e.files : undefined
          }
        } else {
          this.cantNext = false
          this.dataSend = undefined
          this.fliesSend = undefined
        }
      },
      changeView (e) {
        this.nextSequenceFunction()
      },
      previousView (e) {
        this.previousViewFunction()
      },
      endSequence (e) {
        let clientView = {}
        if (localStorage.clientView) {
          clientView = JSON.parse(localStorage.getItem('clientView'))
          delete clientView[this.sequenceId]
          localStorage.setItem('clientView', JSON.stringify(clientView))
        }
        this.$refs.toastr.s({msg: '¡Sequencia finalizada!', timeout: 4500})
        setTimeout(() => window.location.reload(), 5000)
      },
      nextSequence (e) {
        if (this.currentTreeView.children.length > e.child) {
          this.dataSend = e.data ? e.data : []
          this.nextSequenceFunction(e.child)
        }
      },
      nextSequenceUrl (e) {
        this.nextSequence(e)
        // window.location.href = e.data.url
        // window.location.assign(e.data.url)
        window.location.replace(e.data[0].url)
        // window.open(e.data.url, '_blank').focus()
      },
      async previousViewFunction () {
        if (this.currentTreeView.parent) {
          let previosViewId = this.currentTreeView.viewId
          let newViewId = this.currentTreeView.parent.viewId
          this.currentTreeView = this.currentTreeView.parent
          this.currentKey = this.currentTreeView.key
          this.dataShow = this.dataStorage.data[this.currentKey]
          this.dataSend = this.dataShow
          this.activeNextButton()
          if (previosViewId === newViewId) {
            this.$refs.show.initMethod()
          }
        }
        this.activePreviousButton()
      },
      async nextSequenceFunction (chailPost = 0) {
        if (this.currentTreeView.children.length > chailPost) {
          let nextTreeView = this.currentTreeView.children[chailPost]
          let nextTreeKey = nextTreeView.key
          let previosViewId = this.currentTreeView.viewId
          let newViewId = nextTreeView.viewId
          let data
          this.fliesSendingInfo = {
            total: 0,
            send: 0,
            percent: 0
          }
          this.loading = true
          try {
            if (this.fliesSend) {
              data = await ClientViewService.uploadTempFiles(this.fliesSend, this.fliesSendingInfo)
              if (data && data.uploadFile) {
                // console.log('data.uploadFile', data.uploadFile)
                for (let i = 0; i < data.uploadFile.length; i++) {
                  this.dataSend.push({
                    type: 'file',
                    value: data.uploadFile[i],
                    name: 'Fichero Adjunto'
                  })
                }
              }
            }
            // console.log('datasen', this.dataSend)
            if (this.dataStorage) {
              this.dataStorage.data[this.currentKey] = this.dataSend ? this.dataSend : []
              data = await ClientViewService.updateData({id: this.dataStorage.id, state: nextTreeKey, data: this.dataStorage.data})
            } else {
              let dataSendAux = {}
              dataSendAux[this.currentKey] = this.dataSend ? this.dataSend : []
              data = await ClientViewService.storeData({state: nextTreeKey, sequence_id: this.sequence.id, data: dataSendAux})
              if (data) {
                let clientView = {}
                if (localStorage.clientView) {
                  clientView = JSON.parse(localStorage.getItem('clientView'))
                }
                clientView[this.sequenceId] = data.id
                localStorage.setItem('clientView', JSON.stringify(clientView))
              }
            }
            this.dataStorage = data
            this.currentTreeView = nextTreeView
            this.currentKey = nextTreeKey
            if (previosViewId === newViewId) {
              this.$refs.show.initMethod()
            }
            if (this.dataStorage.data.hasOwnProperty(this.currentKey)) {
              this.dataShow = this.dataStorage.data[this.currentKey]
              this.dataSend = this.dataShow
              this.activeNextButton()
            } else {
              this.cantNext = false
              this.dataSend = undefined
              this.fliesSend = undefined
              this.dataShow = []
            }
          } catch (e) {
            console.log(e)
          }
          this.loading = false
          this.activePreviousButton()
        }
      },
      activePreviousButton () {
        if (this.currentTreeView && this.currentTreeView.parent) {
          this.cantPrevious = true
        } else {
          this.cantPrevious = false
        }
      },
      activeNextButton () {
        if (this.currentTreeView.children.length > 0) {
          this.cantNext = true
        } else {
          this.cantNext = false
        }
      },
      fileErrorLength (e) {
        this.$refs.toastr.e('¡Error el archivo ' + e.fileName + ' es mayor de ' + this.bytesToSize(e.length))
      },
      bytesToSize (bytes) {
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        if (bytes === 0) return '0 Byte'
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
      }
    }
  }
</script>

<style scoped>
  .nextButton {
    position: fixed;
    z-index: 9;
    left: 75%;
    top: 0;
  }

  .previosButton {
    position: fixed;
    z-index: 9;
    left: 15%;
    top: 0;
  }

  .btn-next{
    border-radius: 50%;
    font-size: 3rem;
    /*padding: 0.5rem;*/
    font-weight: bolder;
  }

  .btn-next.btn-end{
    font-size: 1rem;
  }

  #main404{
    display: table;
    width: 100%;
    height: 100vh;
    text-align: center;
  }

  .fof{
    display: table-cell;
    vertical-align: middle;
  }

  .fof h1{
    font-size: 50px;
    display: inline-block;
    padding-right: 12px;
    animation: type .5s alternate infinite;
  }
</style>
