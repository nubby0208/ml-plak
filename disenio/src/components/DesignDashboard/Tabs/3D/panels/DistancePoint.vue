<template>
    <div 
      class="row"
    >
      <div
        class="col-12"
      >
        Pieza: {{ this.details.pieceTag }}
      </div>
      <div
        class="col-12"
      >
        {{ parseInt(this.details.position.x) }}, {{ parseInt(this.details.position.y) }}, {{ parseInt(this.details.position.z) }}
      </div>
    </div>
</template>
<script>

export default {
  name: 'DistancePoint',
  components: {
    },
  props: [
    'details'
  ],
  data () {
    return {
    }
  },
  computed: {
  },
  created () {    
  },
  mounted: function () {
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
