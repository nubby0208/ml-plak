<template>
    <CalcoFondo
      v-if="isCalcoFondo"
      :id="id"
    />
    <CalcoDouble
      v-else-if="isPresetTwo"
      :id="id"
    />
    <CalcoTres
      v-else-if="isPresetThree"
      :id="id"
    />
    <CalcoFour
      v-else-if="isPresetFour"
      :id="id"
    />
</template>

<script>
import CalcoFondo from './CalcoFondo'
import CalcoDouble from './CalcoDouble'
import CalcoTres from './CalcoTres'
import CalcoFour from './CalcoFour'

export default {
  props: [ 'id' ],
  components: {
    CalcoFondo,
    CalcoDouble,
    CalcoTres,
    CalcoFour,
  },
  computed: {
    /* hasCalco () {
      return this.id && ((this.id.separator && this.id.size > 0) || this.id.cajon || this.id.puerta || this.id.dobleFondo)
    }, */
    calcoInfo () {
      const el = this.id.id > 0 ? this.id.id : this.id
      return this.$store.getters.getCalcoObject(el)
    },
    isCalcoFondo () {
      return this.id.id < 0 || this.id.id >= 100000
    },
    isPresetTwo () {
      return !this.isCalcoFondo && !(this.calcoInfo.LVeta < 58 || this.calcoInfo.AVeta < 58)
    },
    isPresetThree () {
      return !this.isPresetTwo && this.calcoInfo.AVeta < 58 && this.calcoInfo.LVeta > 58
    },
    isPresetFour () {
      return !this.isPresetThree && this.calcoInfo.LVeta < 58
    },
    elementSelected () {
      return !!this.$store.getters.selectedModule.selected
    }
  }
}
</script>
