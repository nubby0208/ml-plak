<template>
  <div class="view-show">
    <template1 ref="template1" v-if="this.view.template_id == 1" :view="view" @canNext="viewCanNext" :design-mode="designMode"></template1>
    <template2 v-else-if="this.view.template_id == 2" :view="view" :dataShow="this.dataShow" @canNext="viewCanNext"></template2>
    <template3 v-else-if="this.view.template_id == 3" :view="view" :dataShow="this.dataShow" :base-url-files="this.baseUrlFiles" @canNext="viewCanNext"
    @fileErrorLength="fileError"></template3>
    <template4 v-else-if="this.view.template_id == 4" :view="view" @next="nextView"></template4>
    <template5 ref="template5" v-else-if="this.view.template_id == 5" :view="view" :dataShow="this.dataShow" @canNext="viewCanNext"></template5>
    <template6 v-else-if="this.view.template_id == 6" :view="view" :dataShow="this.dataShow" @canNext="viewCanNext"></template6>
    <template7 v-else-if="this.view.template_id == 7" :view="view" @nextUrl="nextUrl"></template7>
    <template8 ref="template8" v-else-if="this.view.template_id == 8" :view="view" @canNext="viewCanNext"></template8>
  </div>
</template>

<script>
import Template1 from '../Templates/Template1'
import Template2 from '../Templates/Template2'
import Template3 from '../Templates/Template3'
import Template4 from '../Templates/Template4'
import Template5 from '../Templates/Template5'
import Template6 from '../Templates/Template6'
import Template7 from '../Templates/Template7'
import Template8 from '../Templates/Template8'

export default {
  name: 'ClientViewViewShow',
  components: {
    Template1,
    Template2,
    Template3,
    Template4,
    Template5,
    Template6,
    Template7,
    Template8
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
    },
    baseUrlFiles: {
      type: String,
      default: ''
    },
    dataShow: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    viewCanNext (e) {
      this.$emit('cantNextSequence', e)
    },

    nextView (e) {
      this.$emit('next', e)
    },

    nextUrl (e) {
      this.$emit('nextUrl', e)
    },
    initMethod () {
      if (this.view.template_id === 1) {
        this.$refs.template1.initMethod()
      } else if (this.view.template_id === 5) {
        // this.$refs.template5.initMethod()
      } else if (this.view.template_id === 8) {
        this.$refs.template8.initMethod()
      }
    },
    fileError (e) {
      this.$emit('fileErrorLength', { fileName: e.fileName, length: e.length })
    }
  }
}
</script>

<style scoped>

  .view-show{
    height: 100vh;
  }

</style>
