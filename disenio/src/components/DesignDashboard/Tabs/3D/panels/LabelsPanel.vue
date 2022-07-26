<template>
  <div class="h-100 text-left justify-content-center pr-2">
    <span v-if="test">
        <code>selected:{{selected}}</code> <br>
        <code>current Position Market:{{currentPositionMark}}</code> <br>
        <code>marks:{{marks}}</code> <br>
    </span>
 

          <div class="row mb-2" style="background-color: #EFEFEF ; border-radius: 0.5rem">
            <div class="col-8  my-2 justify-content: space-between;">
                  <h2 class="mb-2 h6">
                    <strong>
                      Marcadores
                    </strong>
                  </h2>
                </div>
                  <div class="col-4 iconos">

                    <a @click="onBeforeAdd" class="pr-1" v-b-tooltip.hover.bottomright title="Agregar" href="#"  >
                        <b-icon class="rounded bg-primary"  icon="plus" font-scale="1.8" variant="light"/>
                    </a>

                    <a @click="onMoveClick" class="pr-1" v-b-tooltip.hover.bottomright title="Mover" href="#"  >
                        <b-icon class="rounded bg-primary p-1"  icon="arrows-move" font-scale="1.8" variant="light"/>
                    </a>

                      <a @click="onDeleteClick" class="pr-1" v-b-tooltip.hover.bottomright title="Eliminar" href="#"  >
                        <b-icon class="rounded bg-primary p-1"  icon="trash" font-scale="1.8" variant="light"/>
                    </a>
                      
                      <b-form-checkbox @change="updateVisibility" :checked="this.visibleMarks" name="check-button" switch/>
                  </div>

            
          </div>
      
          <div class="row mb-2" style="background-color: #EFEFEF ; border-radius: 0.5rem">
              <div class="col-10  my-2 justify-content: space-between;">
                <h2 class="mb-2 h6">
                  <strong>
                   Indicador De Modulo
                  </strong>
                </h2>
              </div>
              <div class="col-2 iconos">                  
                  <b-form-checkbox @change="updateVisibilityM" :checked="this.visibleM" v-model="visibleM"
                                      id="check-buttonM" name="check-buttonM" switch />
              </div>
          </div>      

      <!-- ambiente -->

          <div class="row mb-2" style="background-color: #EFEFEF ; border-radius: 0.5rem">
              <div class="col-10  my-2 justify-content: space-between;">
                <h2 class="mb-2 h6">
                  <strong>
                     Ind. De Ambientes
                  </strong>
                </h2>
              </div>
              <div class="col-2 iconos">                  
                 <b-form-checkbox @change="updateVisibilityA" v-model="visibleA" :checked="this.visibleA" 
                                    id="check-buttonA"  name="check-buttonA"  switch />
              </div>
          </div> 


      <!-- part -->

         <div class="row mb-2" style="background-color: #EFEFEF ; border-radius: 0.5rem">
              <div class="col-10  my-2 justify-content: space-between;">
                <h2 class="mb-2 h6">
                  <strong>
                      Ind. De Partes
                  </strong>
                </h2>
              </div>
              <div class="col-2 iconos">
                  <b-form-checkbox   @change="updateVisibilityP" v-model="visibleP" :checked="this.visibleP" switch
                    id="check-buttonP"  name="check-buttonA"  class="pointer" title="Habilitar o Deshabilitar"   />
              </div>
          </div> 
      


          <div class="row  mt-2">
            <div class="col-9">
                <strong>
                  Texto Inferior
                </strong>

            </div>
            <div class="col-3 text-end">
              <b-form-checkbox v-model="caption.showCaption" name="check-button" switch />
            </div>
          </div>
       

          <div class="row mt-3">
            <div class="col-9">              
              <label for="caption-opacity"><strong>Tamaño de la fuente</strong> </label>  
            </div>
            <div class="col-3 text-end">
              <b-form-input v-model="caption.fontSize" id="caption-offset"  type="range" max="5" step="0.1" min="0" />
            </div>
          </div>



          <div class="row mt-2">
            <div class="col-9">              
              <label for="caption-font-color"><strong>Color del texto</strong></label>  
            </div>
            <div class="col-3 text-end">
              <b-form-input v-model="caption.fontColor" type="color" lazy id="caption-font-color" />
            </div>
          </div>




          <div class="row mt-2">
            <div class="col-9">              
              <label for="caption-background-color"><strong>Color de fondo</strong></label>
            </div>
            <div class="col-3 text-end">
              <b-form-input v-model="caption.backgroundColor" type="color" id="caption-color" lazy />
            </div>
          </div>



          <div class="row mt-2">
            <div class="col-9">              
                <label for="caption-opacity"><strong>Opacidad</strong></label>
          </div>
            <div class="col-3 text-end">
              <b-form-input v-model="caption.opacity" id="caption-opacity" type="range"  max="1" step="0.1" min="0"/>
            </div>
          </div>          



          <div class="row mt-2">
            <div class="col-9">              
                <label for="caption-offset"><strong>Margen inferior</strong> </label>
          </div>
            <div class="col-3 text-end">
              <b-form-input v-model="caption.offset" type="range" id="caption-offset" max="50" step="0.1" min="0"/>
            </div>
          </div>
          
          
        <div class="row mt-2">  
          <div class="col-12">
            <label for="caption-textarea">
              <strong>Texto al pie del visor</strong>
            </label>
            <b-form-textarea  v-model="caption.text" id="caption-textarea"  placeholder="Texto..." rows="2"  max-rows="6">
            </b-form-textarea>
          </div>
        </div>



    <b-modal size="sm" @ok="saveMark()" @hidden="resetMark"
        ok-title="Guardar" cancel-title="Cancelar" id="new-marker-modal" title="Nuevo marcador">
      <div class="row">
        <div class="col-12">
          <b-form-group  label="Texto" label-for="input-marker-text">
            <b-form-input id="input-marker-text" v-model="newMark.text" type="text"
              required placeholder="Texto"/>
          </b-form-group>
        </div>
        <div class="col-6">
          <b-form-group  label="Tamaño" label-for="input-marker-size" >
            <b-form-input id="input-marker-size" v-model="newMark.size"  type="number"
                step="1" min="1" required placeholder="Tamaño" />
          </b-form-group>
        </div>
        <div class="col-6">
          <b-form-group label="Color"  label-for="input-marker-color">
            <b-form-input  id="input-marker-color" v-model="newMark.color" type="color" 
                          required  placeholder="Color"  />
          </b-form-group>
          
        </div>
      </div>
    </b-modal>


  </div>
</template>
<script>

// import { ViewerStatesEnum } from '../../../models/enums'
import { EventBus } from '../utils/event-bus.js'

export default {
  name: 'LabelsPanel',
  components: {
  },
  data () {
    return {
      
      evento : null,
      test:false,
      caption: {
        fontSize: 1.5,
        text: '',
        fontColor: '#000000',
        backgroundColor: '#e3e3e3',
        opacity: 1,
        offset: 0,
        showCaption: false,
      },
      newMark: {},
      actions: [
        { text: 'Agregar', value: 'add' },
        { text: 'Mover', value: 'move' },
        { text: 'Eliminar', value: 'delete' }
      ],

      visibleM : this.$store.state.viewer3d.configIndicator.visibleModule,
      visibleA : this.$store.state.viewer3d.configIndicator.visibleEnvironment,
      visibleP : this.$store.state.viewer3d.configIndicator.visiblePart
    }
  },



  mounted: function () {

    this.limpiarForm()
    if (this.$store.state.viewer3d.captionInfo) {
      this.caption = this.$store.state.viewer3d.captionInfo
    }

  },

  computed: {
    selected () {
      console.log(`selected  *-* MlPlakMarkers.js`)
      return this.$store.state.viewer3d.labelState  
    },
    marks () {
      console.log(`marks  *-* MlPlakMarkers.js`)
      return this.$store.state.viewer3d.marks
    
    },
    selection () {
      console.log(`selection  *-* MlPlakMarkers.js`)
      return this.$store.state.viewer3d.selection      
    },

    
    currentPositionMark(){
      return this.$store.state.viewer3d.currentPositionMark
    },


    visibleMarks(){
      return this.$store.state.viewer3d.visibleMarks
    }


  },
  
  methods: {
    
    onMoveClick () {
      this.$store.commit('updateLabelState', 'move')
      this.$noty.info("Seleccione marcador a mover", {
        timeout: 3000,
      })
    },

    onDeleteClick () {
      
      this.$store.commit('updateLabelState', 'delete')
      this.$noty.info("Seleccione marcador a eliminar", {
              timeout: 3000,
            })
    },

    onBeforeAdd(){
      EventBus.$emit('onMarkerBeforeAdd', null)
      this.$noty.info("Seleccione un punto para agregar marcador", {
        timeout: 3000,
      })
      this.evento = 'beforeAdd'
    },

    saveMark () {
        console.log(`saveMark: ${JSON.stringify(this.newMark)}`)
        const returnedObj =  this.newMark
        this.$store.commit('addMark', returnedObj)
        EventBus.$emit('saveMark', returnedObj)
        this.limpiarForm()      
    },

    resetMark (){
        console.log(`updateCurrenPositionMark *-*LabelsPanel.vue`)
        EventBus.$emit('updateCurrenPositionMark', {})
        this.limpiarForm()
    },


    movePart(){
      alert("Mover Partes")   
    },

   
    updateVisibility (value) {
      // this.visible = value
      //EventBus.$emit('onMarkersVisibilityChanged', this.visible)
      EventBus.$emit('onMarkersVisibilityChanged', value)
      this.$store.commit('setVisibleMark', value)
      // this.$store.state.viewer3d.visibleMarks  = value
      // visibleMarks
    },
 
    updateVisibilityM (value) {
      this.$store.commit('setConfigIndicatorModule', value)
      EventBus.$emit('onIndicatorModuleVisibility', value)
    },

    updateVisibilityA (value) {
      this.$store.commit('setConfigIndicatorEnvironment', value)
      EventBus.$emit('onIndicatorEnvironmentVisibility', value)
    },


    updateVisibilityP (value) {
      this.$store.commit('setConfigIndicatorPart', value)
      EventBus.$emit('onIndicatorPartVisibility', value)
    },


    limpiarForm(){
        this.newMark = {
          text: 'Pieza ...',
          size: '10',
          color: '#000000',
          point:'',
          module:'',
          normal :''
        }

        this.evento = null

    },

 
  
  },


  watch: {
    caption: {
      handler (newValue, oldValue) {
        this.$store.commit('updateCaption', newValue)        
        EventBus.$emit('captionUpdated', newValue)
      },
      deep: true
    },

    currentPositionMark() { 
        
        // console.log(`valor   selected: ${this.$store.state.viewer3d.labelState}`)        
        console.log(`valor open Modal ${JSON.stringify(this.currentPositionMark)}  selected: ${this.selected}`)
        if (this.currentPositionMark.active == true  && this.evento == 'beforeAdd') {
            
            this.$bvModal.show('new-marker-modal')          
            this.evento = 'add'
            let mark = JSON.parse(JSON.stringify(this.$store.state.viewer3d.currentPositionMark))
            this.newMark.point  =  mark.point
            this.newMark.module =  mark.module
            this.newMark.normal =  mark.normal

        }
    }

    
  }

  
}
</script>

<style scoped>
.card{
  width: 100%;
}

.iconos{

  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.pointer{
    cursor: pointer;
}
</style>
