<template>
    <div class="home img d-flex" :style="backgroundImage()">
      <div class="text-box d-flex align-items-center">
        <h1 v-html="this.view.fieldsValues.texto.value" v-if="designMode"/>
        <h1 class="effect" v-html="effect" v-else/>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'Template1',
    data: function () {
      return {
        text: 'Hola! ,Espero estés muy bien! Me presento  soy ML, el Sistema que nos va a ayudar a  recopilar la información que necesitamos parapoder realizar tu presupuesto',
        normal: '',
        effect: '',
        tInterval: null,
        msg: ''

      }
    },
    props: {
      view: {
        type: Object,
        default: () => {
          return {
            name: 'Plantilla uno',
            fieldsValues: {
              backGround: {
                type: 'file',
                value: 'images/templates/img1.jpg',
                templateUrl: true,
                name: 'Imagen de fondo'
              },
              texto: {
                type: 'text',
                value: 'Hola! ,Espero estés muy bien! Me presento  soy ML, el Sistema que nos va a ayudar a  recopilar la información que necesitamos parapoder realizar tu presupuesto","name":"Texto Principal'
              }
            },
            template_id: 1,
            id: '6d99a4fd-a499-42d8-8461-5d4051327f46',
            urlBase: 'http://localhost:8181/storage/media/views/6d99a4fd-a499-42d8-8461-5d4051327f46/'
          }
        }
      },
      designMode: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      this.initMethod()
    },
    methods: {
      typeWriter: function () {
        let i = -2
        let splitText = this.view.fieldsValues.texto.value.split(' ')
        this.normal = ''
        this.tInterval = setInterval(() => {
          i++
          if (i >= 0 && i < splitText.length) {
            const v = i % splitText.length
            this.effect += splitText[v] + ' '
          } else if (i >= splitText.length) {
            clearInterval(this.tInterval)
            this.$emit('canNext', {canNext: true, data: undefined})
          }
          this.normal = ''
        }, 350)
        // time tricky setting
      },
      stopType: function () {
        this.normal = ''
        this.effect = ''
        clearInterval(this.tInterval)
      },
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
      initMethod () {
        this.effect = ''
        if (!this.designMode) {
          this.typeWriter()
        }
      }
    },
    watch: {
      view: function () {
        this.initMethod()
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
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
  .img{
    /*width: 100%;*/
    /*min-height: 100vh;*/
    margin:0 auto;
    background-repeat: no-repeat;
    background-size: cover;
    min-height: 100%;
  }
</style>
