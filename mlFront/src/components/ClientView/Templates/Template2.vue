<template>
  <div class="home img d-flex justify-content-center flex-column" :style="backgroundImage()">
    <div class="text-box ">
      <h1 v-html="view.fieldsValues.texto.value"/>
    </div>
    <div class="bd-example">
      <form>
        <div class="form-group">
          <label for="exampleFormControlTextarea1">{{ view.fieldsValues.label.value }}</label>
          <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" @change="textAreaChange" :value="text"></textarea>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Template2',
  data: function () {
    return {
      msg: ''
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
    }
  },
  computed: {
    text: function () {
      return this.dataShow.length === 1 && this.dataShow[0].type === 'text' ? this.dataShow[0].value : ''
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
    textAreaChange (e) {
      if (e.target.value.length > 0) {
        this.$emit('canNext', {
          canNext: true,
          data: [{
            type: 'text',
            value: e.target.value,
            name: this.view.fieldsValues.label.value
          }]
        })
      } else {
        this.$emit('canNext', {
          canNext: false,
          data: undefined
        })
      }
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
