<template>
    <calco-fondo v-if="isCalcoFondo" :id="id"></calco-fondo>
    <calco-double v-else-if="isPresetTwo" :id="id"></calco-double>
    <calco-tres v-else-if="isPresetThree" :id="id"></calco-tres>
    <calco-four v-else-if="isPresetFour" :id="id"></calco-four>
</template>

<script>
export default {
  props: [ 'id' ],
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
