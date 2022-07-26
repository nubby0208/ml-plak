<template>
  <div class="Template8">
    <slider ref="slider" :images="images"></slider>
  </div>
</template>

<script>
import Slider from '../components/Slider'

export default {
  name: 'Template8',
  components: {
    Slider
  },
  data: function () {
    return {
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
    }
  },
  updated () {
    this.$emit('canNext', {canNext: true, data: undefined})
  },
  mounted () {
    this.$emit('canNext', {canNext: true, data: undefined})
  },
  methods: {
    getFileUrl (fileUrl, templateUrl) {
      if (!fileUrl) {
        return ''
      }
      if (fileUrl.indexOf('https://') !== -1 || fileUrl.indexOf('http://') !== -1) {
        return fileUrl
      }
      if (templateUrl) {
        return `${process.env.BACKEND_BASE_URL}/${fileUrl}`
      } else {
        return this.view.urlBase + fileUrl
      }
    },
    initMethod () {
      this.$refs.slider.initMethod()
      this.$emit('canNext', {canNext: true, data: undefined})
    }
  },
  computed: {
    images () {
      let result = []
      if (this.view.fieldsValues.images) {
        for (let i = 0; i < this.view.fieldsValues.images.value.length; i++) {
          result.push({
            url: this.getFileUrl(this.view.fieldsValues.images.value[i].url,
              this.view.fieldsValues.images.value[i].templateUrl),
            text: this.view.fieldsValues.images.value[i].text
          })
        }
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
  .Template8{
    padding-top: 15px;
    height: 100%;
    width: 100%;
    background-color: #f1f1f3;
    display: flex;
    justify-content: center;
  }

  @media (max-width: 540px) {
    .Template8{
      background-color: #ffffff;
    }
  }

</style>
