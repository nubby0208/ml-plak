<template>

  <div class="home img d-flex justify-content-center flex-column" :style="backgroundImage()">
      <div class="text-box ">
        <h1 v-html="view.fieldsValues.texto.value"/>
      </div>
      <div class="bd-example">

          <div class="form-group">
            <button class="btn btn-primary" @click="nextView(0)">{{ view.fieldsValues.btn1.value}}</button>
          </div>
          <div class="form-group" v-if="this.view.fieldsValues.linkUrlNumber.value >= 2">
            <button class="btn btn-primary" @click="nextView(1)">{{ view.fieldsValues.btn2.value}}</button>
          </div>
          <div class="form-group" v-if="this.view.fieldsValues.linkUrlNumber.value >= 3">
            <button class="btn btn-primary" @click="nextView(2)">{{ view.fieldsValues.btn3.value}}</button>
          </div>
          <div class="form-group" v-if="this.view.fieldsValues.linkUrlNumber.value == 4">
            <button class="btn btn-primary" @click="nextView(3)">{{ view.fieldsValues.btn4.value}}</button>
          </div>

      </div>
    </div>

</template>

<script>
export default {
  name: 'Template7',
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

    nextView (e) {
      let text = ''
      let url = ''
      switch (e) {
        case 0:
          text = this.view.fieldsValues.btn1.value
          url = this.view.fieldsValues.btn1Url.value
          break
        case 1:
          text = this.view.fieldsValues.btn2.value
          url = this.view.fieldsValues.btn2Url.value
          break
        case 2:
          text = this.view.fieldsValues.btn3.value
          url = this.view.fieldsValues.btn3Url.value
          break
        case 3:
          text = this.view.fieldsValues.btn4.value
          url = this.view.fieldsValues.btn4Url.value
          break
        default:
          text = ''
      }
      this.$emit('nextUrl', {
        child: 0,
        view: this.view,
        data: [{
          type: 'string',
          value: text,
          url: url,
          name: 'Decidió'
        }]
      })
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

  .form-group{
    padding: 15px;
  }
</style>
