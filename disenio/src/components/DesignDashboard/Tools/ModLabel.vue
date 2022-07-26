<template>
<div>
    <div
      v-if="showDimensions && (!element.childs || (isElementLayerVisible && element.layerId != -1 && element.childs)) && !element.separator"
      class="fancy-container"
    >
      <span class="fancy">
        {{ element.id }}
      </span>
    </div>
</div>
</template>

<script>
export default {
  props: [ 'id' ],
  data () {
    return {
    }
  },
  computed: {
    showDimensions () {
      return this.$store.state.layout.showDimensions
    },
    element () {
      return this.$store.getters.getElement(this.id)
    },
    isElementLayerVisible () {
      const element = this.element
      if (element.layerId != null && element.layerId > -1) {
        return this.$store.getters.selectedModule.layers[element.layerId].visible
      }

      return true
    }
  }
}
</script>