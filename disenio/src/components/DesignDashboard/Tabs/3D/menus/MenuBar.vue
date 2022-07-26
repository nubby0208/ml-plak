<template>
    <div>
        <div
          class="col-12 d-flex flex-row justify-content-around px-0 pt-2 pb-3"
        >
          <div
            class="flex-grow-1 ml-0 mr-1 justify-content-start d-flex flex-row"
          >
            <b-button-group>
              <b-button
                @click="$emit('save-project')"
                id="btn-save-scene"
                type="button"
                class="btn btn-primary"
              >
                Guardar
              </b-button>
            </b-button-group>
           <div> 
	         <b-dropdown
            text="Exportar"
            class="mx-1"
           >
              <b-dropdown-item @click="exportViewer('dae')">
                  Exportar a DAE
              </b-dropdown-item>
              <b-dropdown-item @click="exportViewer('img')">
                  Exportar imagen
              </b-dropdown-item>
              <b-dropdown-item @click="exportViewer('server-img')">
                 Enviar imagen a servidor
              </b-dropdown-item>
            </b-dropdown>
           </div> 
          </div>

          <b-dropdown
            text='Iluminacion'
          >
				  <b-input-group
           prepend="-"
           append="+"
           class="mt-3">
    				<input
              id='input-main-light'
              @change='Ilumina'
              type="range"
              min="0"
              max="100"
            />
  					</b-input-group>
          </b-dropdown>

          <b-dropdown
            text="Cámara
            "
            class="camera-options mx-1"
          >
            <div
              class="dropdown-item"
            >
              <input
                type="checkbox"
                :value="'front'"
                @change="updateCurrentActiveView"
                data-view="front"
                id="camera-view-front"
                class="camera-view-option"
              /><label for="camera-view-front"> Frontal</label>
            </div>
            <div
              class="dropdown-item"
            >
              <input
                type="checkbox"
                :value="'back'"
                @change="updateCurrentActiveView"
                id="camera-view-back"
                class="camera-view-option"
              /><label for="camera-view-back"> Posterior</label>
            </div>
            <div
              class="dropdown-item"
            >
              <input
                type="checkbox"
                :value="'left'"
                @change="updateCurrentActiveView"
                id="camera-view-left"
                class="camera-view-option"
              /><label for="camera-view-left"> Izquierda</label>
            </div>
            <div
              class="dropdown-item"
            >
              <input
                type="checkbox"
                :value="'right'"
                @change="updateCurrentActiveView"
                id="camera-view-right"
                class="camera-view-option"
              /><label for="camera-view-right"> Derecha</label>
            </div>
            <div
              class="dropdown-item"
            >
              <input
                type="checkbox"
                :value="'top'"
                @change="updateCurrentActiveView"
                id="camera-view-top"
                class="camera-view-option"
              /><label for="camera-view-top"> Superior</label>
            </div>

            <div
              class="dropdown-item"
            >
              <input
                type="checkbox"
                :value="'bottom'"
                @change="updateCurrentActiveView"
                id="camera-view-bottom"
                class="camera-view-option"
              /><label for="camera-view-bottom"> Inferior</label>
            </div>

            <div
              class="dropdown-item"
            >
              <input
                type="checkbox"
                :value="'perspective'"
                @change="updateCurrentActiveView"
                id="camera-view-free"
                class="camera-view-option"
              /><label for="camera-view-free"> Perspectiva</label>
            </div>
          </b-dropdown>
          
          <b-button
            @click="$store.commit(
              'setConfig',
              { showGrid: !$store.state.viewer3d.config.showGrid }
            )"
            :pressed="$store.state.viewer3d.config.showGrid"
            :variant="$store.state.viewer3d.config.showGrid ? 'primary' : 'outline-secondary'"
            title="Mostrar/Ocultar rejilla"
          >
            <font-awesome-icon
              icon="border-all"
            />
          </b-button>

          <div
            class="viewer-options btn-group mx-1"
          >
            <b-dropdown
              primary text="Bordes"
            >
              <div
                class="dropdown-item"
              >
                <input
                  type="color"
                  :value="edgeColor"
                  @input="updateEdgeColor"
                  name="color"
                />
              </div>
            </b-dropdown>
          </div>
      </div>
    </div>   
</template>
<script>
import { EventBus } from '../utils/event-bus.js'

export default {
  name: 'MenuBar',
  data () {
    return {
      edgeColor: '#ffffff',
      gridEnabled: false
    }
  },
  beforeDestroy()  {
    this.$store.commit('updateCurrentActiveView', 'perspective')
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
      let valor = 'export-' + value  
      console.log(`exportViewer --> values = ${valor} `)
      this.$emit(valor)
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
</style>
