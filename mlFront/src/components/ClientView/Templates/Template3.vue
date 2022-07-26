<template>
  <div class="home img d-flex justify-content-center flex-column" :style="backgroundImage()">
    <div class="text-box ">
      <h1 v-html="view.fieldsValues.texto.value"/>
    </div>
    <div class="bd-example">
      <form>
        <div class="form-group">
          <label >{{ view.fieldsValues.label.value }}</label>
          <client-view-file-input :limit="3" @removedUrl="filesChanged" @addFile="filesChanged"
                                  @removedFile="filesChanged" :file-url="filesUrl"
                                  @fileErrorLength="fileErrorLength"></client-view-file-input>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import ClientViewFileInput from '../components/ClientViewFileInput'
export default {
  name: 'Template3',
  components: {ClientViewFileInput},
  data: function () {
    return {
      files: []
    }
  },
  props: {
    view: {
      type: Object,
      default: () => {
        return {
          name: 'Plantilla dos',
          fieldsValues: {
            backGround: {
              type: 'file',
              value: 'images/templates/img1.jpg',
              templateUrl: true,
              name: 'Imagen de fondo'
            },
            texto: {
              type: 'text',
              value: 'Le estamos agradecidos por solicitar nuestros servicios. Introduzca el motivo de su visita.'
            },
            label: {
              type: 'string',
              value: 'Entre el motivo'
            }
          },
          template_id: 1,
          id: '6d99a4fd-a499-42d8-8461-5d4051327f46',
          urlBase: 'http://localhost:8181/storage/media/views/6d99a4fd-a499-42d8-8461-5d4051327f46/'
        }
      }
    },
    dataShow: {
      type: Array,
      default: () => {
        return []
      }
    },
    baseUrlFiles: {
      type: String,
      default: ''
    }
  },
  computed: {
    filesUrl: function () {
      let filesU = ['']
      for (let i = 0; i < this.dataShow.length; i++) {
        if (this.dataShow[i].type === 'file') {
          filesU[i] = this.baseUrlFiles === '' ? this.dataShow[i].value : this.baseUrlFiles + this.dataShow[i].value
        }
      }
      return filesU
    }
  },
  methods: {
    backgroundImage () {
      return {
        backgroundImage: `url(${this.backgroudUrl()})`
      }
    },
    backgroudUrl () {
      if (this.view.fieldsValues.backGround.templateUrl) {
        return `${process.env.BACKEND_BASE_URL}/${this.view.fieldsValues.backGround.value}`
      } else {
        return this.view.urlBase + this.view.fieldsValues.backGround.value
      }
    },
    filesChanged (e) {
      this.files = e.files
      let length = e.files.length + e.urls.length
      if (length > 0) {
        this.$emit('canNext', {
          canNext: true,
          data: this.getData(e),
          files: this.files
        })
      } else {
        this.$emit('canNext', {
          canNext: false,
          data: undefined,
          files: undefined
        })
      }
    },
    fileErrorLength (e) {
      this.$emit('fileErrorLength', { fileName: e.file.name, length: e.length })
    },
    getData (e) {
      if (e.hasOwnProperty('url')) {
        let split = e.url.split('/')
        let fileName = split[split.length - 1]
        for (let i = 0; i < this.dataShow.length; i++) {
          if (this.dataShow[i].type === 'file' && this.dataShow[i].value === fileName) {
            this.dataShow.splice(i, 1)
            return this.dataShow
          }
        }
      }
      return this.dataShow
    }
  }
}
</script>

<style lang="scss" scoped>
  .text-box {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: white;
    margin-top: 60px;
    width:350px;
    margin: 0 auto;
    font-size:10px;
    text-shadow: black 30px 0 10px;
  }

  h1, h2 {
    font-weight: normal;
    font-size: 2em;
  }

  .img{
    margin:0 auto;
    background-repeat: no-repeat;
    background-size: cover;
    min-height: 100%;
  }

  .bd-example {
    padding: 1.5rem;
    margin-right: 0;
    margin-left: 0;
    border-width: .2rem;
    color: white;
  }

  .bd-example label{
    background-color: #00000078;
  }
</style>
