<template>
    <div>
        <div v-if="!loading">
            <div class="dropdown">
                <div style="diplay:flex; cursor:pointer;"> <b-icon icon="camera" font-scale="1"></b-icon><span>Exportar</span></div>
                <div class="dropdown-content" style="z-index: 99999999;">
                    <a href="#" @click="exportViewer('dae')">Exportar a DAE</a>
                    <a href="#" @click="exportViewer('img')">Exportar imagen</a>
                    <a href="#" @click="exportViewer('server-img')">Enviar imagen a servidor</a>
                </div>
            </div>
        </div>
        <div v-else>
            <b-spinner small label="Small Spinner"></b-spinner>
        </div>
    </div>
</template>
<script>
import { EventBus } from '../utils/event-bus.js'

export default {
  name: 'OpcionMiniVisorExportar',
  data () {
    return {
      edgeColor: '#ffffff',
      gridEnabled: false,
      loading:false
    }
  },
  beforeDestroy()  {
    this.$store.commit('updateCurrentActiveView', 'perspective')
  },
  mounted(){
      this.$root.$on("EventUploadImagen", (a) => {
          this.loading = a;
      });
  },
  methods: {
    updateEdgeColor (e) {
      this.edgeColor = e.target.value
      this.$store.commit('updateEdgeColor', e.target.value)
    },
    Ilumina (event) {
      this.$store.commit('setLightIntensity', event.target.value)
      console.log(this.$store.state.viewer3d.mainLight)
    },
    updateCurrentActiveView (e) {      
      this.$store.commit('updateCurrentActiveView', e.target.value)
    },
    exportViewer (value) {
      this.$emit('export-' + value);
    },
  },
  watch: {
    gridEnabled (newValue) {
      EventBus.$emit('gridVisibilityChanged', newValue)
    }
  }
}
</script>

<style scoped>
.export-actions input, .camera-options input{
  display: none;
}
.camera-options label{
  margin-bottom: 0px;
}


.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
}

.dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
}

.dropdown-content a:hover {background-color: #f1f1f1}

.dropdown:hover .dropdown-content {
    display: block;
}

.dropdown:hover .dropbtn {
    background-color: #3e8e41;
}
</style>
