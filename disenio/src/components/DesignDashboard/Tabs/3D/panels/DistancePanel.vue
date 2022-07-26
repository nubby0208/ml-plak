<template>
  <div class="h-100">

  <div class="my-2 pt-2 pb-3 col-12"
        style="background-color: #EFEFEF ; border-radius: 0.5rem">

      <div class="row">
          <div class="col-8">
              <h2 class="mb-0 h5">
                <strong> Distancia</strong>
              </h2>
          </div>
          <div class="col-4 text-end">
              <b-form-checkbox v-model="visible" @change="updateVisibility(visible)"  :checked="this.visible"
                  name="check-button" switch />
          </div>
      </div>
  </div>


    <div class="row text-left mt-3">
      <div class="col-12">
        <label for="selectPointA">
          Punto A
        </label>        
        <button
          id="selectPointA"
          @click="toggleDistanceMeasure('A')"
          data-point='A' size="sm"
          class="btn btn-primary"
          :title="this.currentMeasure.current && this.currentMeasure.current.pointA ? 'Editar' : 'Definir'"
        >
          <span
            class="float-right"
          >
            <font-awesome-icon
              :icon="this.measuring && this.currentMeasure.type === 'A' ? 'check' : 'edit'"
            />
          </span>
        </button>
      </div>
      <div
        class="col-12"
        v-if="this.pointA != null"
      >
        <DistancePoint
          :details="this.pointA"
        ></DistancePoint>
      </div>
    </div>
    <div
      class="row text-left mt-3"
    >
      <div class="col-12">
        <label for="selectPointB">
          Punto B
        </label>
          <button
            id="selectPointB"
            @click="toggleDistanceMeasure('B')"
            data-point='B' size="sm"
            class="btn btn-primary"
            :title="this.currentMeasure.current && this.currentMeasure.current.pointB !== null ? 'Editar' : 'Definir'"
            >
            <span class="float-right">
              <font-awesome-icon
                :icon="this.measuring && this.currentMeasure.type === 'B' ? 'check' : 'edit'" />
            </span>
          </button>
        </div>
        <div class="col-12" v-if="this.pointB != null">
            <DistancePoint :details="this.pointB">
            </DistancePoint>
        </div>
        <div class="col-12 mt-3">
          <label for="color_selector"> 
            Color 
          </label>
          <input id="color_selector" @change="updateColor" type="color" value="#006CAA"/>
          <label for="distancia_eje_x" class="ml-3" style="user-select: none">
            Eje X
          </label>
          <input id="distancia_eje_x" @change="fixAxis('X', $event.target.checked)" name="ejes" type="checkbox"/>
          <label for="distancia_eje_y" class="ml-3" style="user-select: none">
            Eje Y
          </label>
          <input id="distancia_eje_y" @change="fixAxis('Y', $event.target.checked)" name="ejes" type="checkbox"/>
          <label for="distancia_eje_z" class="ml-3" style="user-select: none">
            Eje Z
          </label>
          <input id="distancia_eje_z" @change="fixAxis('Z', $event.target.checked)" name="ejes" type="checkbox"/>
        </div>
        <!--
        <div class="col-12">
          <button @click="saveDistance" class="btn btn-primary mt-3 btn-block">
            Guardar distancia
          </button>
        </div> -->
    </div>
    <div class="row text-left mt-3">
      <div  class="col-12">
        <strong>
          <font-awesome-icon icon="ruler" /> Listado de distancias
        </strong>
      </div>
      <div class="col-12">
        <table class="table table-sm">
          <thead>
            <tr>
              <td>Color</td>
              <td>Distancia</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr
              :key="index"
              v-for="(item, index) in this.distances"
              :data-id="item.id"
            >
              <td>
                <font-awesome-icon icon="circle" :style="{ color: item.color }" />
              </td>
              <td>
                {{ item.distance  }}
              </td>
                
                <td>                  
                    <b-button size="sm" class="btn btn-primary"  @click="updateEvent(index, item)" v-b-modal.conf-distance-modal block>
                        <font-awesome-icon icon="cog" />
                    </b-button>
                </td>
 
                
              <td>
                  <b-button size="sm" class="btn btn-primary" @click="deleteDistance(item.id)" block>
                      <font-awesome-icon icon="times" />
                  </b-button>
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    </div>

  


      <b-modal size="md" @ok="updateDistance('all', index, Datos)" ok-title="Guardar" cancel-title="Cancelar" 
        id="conf-distance-modal" title="Configuración de Distancia">
      <div class="row">
        <div class="col-12">
            <b-row>
                <b-col sm="3">
                    <label>Distancia :</label>
                </b-col>
                <b-col sm="9">
                  {{Datos.distance}}
                  
               </b-col>
            </b-row>
        </div>
        

      <div class="col-12">
          <b-row>
              <b-col sm="3">
                  <label>Pieza A :</label>
              </b-col>
              <b-col sm="9">
                    <!-- {{Datos.pointA.pieceTag}} // da error -->
                    {{descPointA }}
              </b-col>
          </b-row>
      </div>
       
             <div class="col-12">
          <b-row>
              <b-col sm="3">
                  <label >Pieza B :</label>
              </b-col>
              <b-col sm="9">
                {{descPointB}}
              </b-col>
          </b-row>
      </div>


        <div class="col-4">
          <b-form-group label="Eje X" label-for="input-distance-size" >
            <b-form-input  type="number" v-model="Datos.pEjeX"  id="input-distance-size" 
                  @keyup="updateDistance('ejeX', index, Datos)" @change="updateDistance('ejeX', index, Datos)"
              step="1"  min="1" required  placeholder="Eje X" />
          </b-form-group>
        </div>
    
        <div class="col-4">
          <b-form-group label="Eje Y" label-for="input-distance-size" >
            <b-form-input  type="number" v-model="Datos.pEjeY"  id="input-distance-size" 
              @keyup="updateDistance('ejeY', index, Datos)" @change="updateDistance('ejeY', index, Datos)"
              step="1"  min="1" required  placeholder="Eje Y" />
          </b-form-group>
        </div>
                  
        <div class="col-4">
          <b-form-group label="Eje Z" label-for="input-distance-size" >
            <b-form-input  type="number" v-model="Datos.pEjeZ"  id="input-distance-size" 
              @keyup="updateDistance('ejeZ', index, Datos)" @change="updateDistance('ejeZ', index, Datos)"
              step="1"  min="1" required  placeholder="Eje Z" />
          </b-form-group>
        </div>

        <div class="col-6">
          <b-form-group label="Tamaño de Letra" label-for="input-distance-fontSize" >
            <b-form-input  type="number" v-model="Datos.fontSize"  id="input-distance-fontSize" 
              @keyup="updateDistance('fontSize', index, Datos)" @change="updateDistance('fontSize', index, Datos)"
              step="1"  min="1" required  placeholder="Tamaño de Letra" />
          </b-form-group>
        </div>

        <div class="col-6">
          <b-form-group label="Color" label-for="input-distance-color">
            <b-form-input  type="color" v-model="Datos.color"  id="input-distance-color" 
                @change="updateDistance('color', index, Datos)"  placeholder="Color"/>
          </b-form-group>
        </div>

       
      </div>
    </b-modal>





   </div>
</template>

<script>

import DistancePoint from './DistancePoint.vue'
import { ViewerStatesEnum } from '../../../Tools/models/enums'
import { EventBus } from '../utils/event-bus.js'

export default {
  name: 'DistancePanel',
  components: {
    DistancePoint
  },
  data () {
    return {
      test:true,
      visible: true,
      pointA: null,
      pointB: null,
      color: '',
      isPointASelected: false,
      ejeX:null,
      ejeY:null,
      ejeZ: null,
      
      size:null,

      Datos:{},
      descPointA:null,
      descPointB:null,
      index:null,


    }
  },

  
  computed: {
  
    distances () {      
      return this.$store.state.viewer3d.distances
    },
    
    currentMeasure () {
      return this.$store.state.viewer3d.stateDetails || {}
    },
    
    selection () {
      return this.$store.state.viewer3d.selection
    },

    measuring () {      
      return this.$store.state.viewer3d.state === ViewerStatesEnum.MEASURING
    }
  },



  methods: {
    fixAxis (axis, value) {
      switch (axis) {
        case 'X':
          document.getElementById("distancia_eje_y").checked = false
          document.getElementById("distancia_eje_z").checked = false
          break;
        case 'Y':
          document.getElementById("distancia_eje_x").checked = false
          document.getElementById("distancia_eje_z").checked = false
          break;
        case 'Z':
          document.getElementById("distancia_eje_x").checked = false
          document.getElementById("distancia_eje_y").checked = false
          break;
      }

      EventBus.$emit('distanceAxisUpdated', axis, value)
    },

    updateColor (event) {
      this.color = event.target.value      
      EventBus.$emit('distanceColorUpdated', this.color)
    },

    updateVisibility (value) {
        EventBus.$emit('onDistanceVisibilityChanged', this.visible)
        console.log(`updateVisibility valor: ${value}  **DistancePanel `)
    },





      updateEvent (index, item){
     
        this.index = index

        item.pEjeX =Math.round(parseInt(item.pEjeX))
        item.pEjeY =Math.round(parseInt(item.pEjeY))
        item.pEjeZ =Math.round(parseInt(item.pEjeZ))
     
     this.Datos = item 

        this.descPointA=item.pointA.pieceTag
        this.descPointB=item.pointB.pieceTag
 

      },


    updateDistance (tipo, index, item) {         
        // console.log (`updateDistance  tipo:${tipo}, index:${index}, item:${JSON.stringify(item)} **DistancePanel.vue`)
        
        if(tipo ==='ejeX' ){
            item.pEjeX =Math.round(parseInt(item.pEjeX) )
        }

        if(tipo ==='ejeY' ){
            item.pEjeY =Math.round(parseInt(item.pEjeY))
        }

        if(tipo ==='ejeZ' ){
            item.pEjeZ =Math.round(parseInt(item.pEjeZ))
        }




        

        let params = {tipo, index, item}
        

        
        

        setTimeout(function(){  EventBus.$emit('updateDistance', params) }, 300)
       
        //  this.$store.commit('setEjeX', value))
        /*
        //let viewer = this.$store.state.viewer3d.viewer
          // viewer.renderFrame()
        */
    },


    deleteDistance (distanceId) {
        EventBus.$emit('deleteDistance', distanceId)
    },





    saveDistance (event) {      
      if ( Object.keys(this.currentMeasure).length !== 0 ) {        
        if (this.currentMeasure.current.pointA && this.currentMeasure.current.pointB) {  
          
          // console.log(`saveDistance  ${JSON.stringify(this.currentMeasure.current)}  **/Tabs/3D/panels/DistancePanel.vue `)
          EventBus.$emit('saveDistance', this.currentMeasure.current)

        }

        this.$store.state.viewer3d.stateDetails=null
      }
    },
    
    toggleDistanceMeasure (type) {

      if (this.selection && this.selection.indexOf('-') >= 0) {

        if (!this.isPointASelected && type !== 'A') {
          alert("Seleccione el Punto A para comenzar")
        }
        else {
          this.initStateDetails()

          this.$store.state.viewer3d.state = ViewerStatesEnum.MEASURING
          this.$store.state.viewer3d.stateDetails.type = type

          if (type === 'A') {
            this.isPointASelected = true
          }
          else {
            this.isPointASelected = false
          }

        }
      }
      else {
        alert('Por favor seleccione una pieza')
      }
      
    },

    initStateDetails () {
      if (!this.$store.state.viewer3d.stateDetails) this.$store.state.viewer3d.stateDetails = {}
    },
  },  
  
  watch: {

       /*   
       '$store.state.viewer3d.distances' () {      
            this.distances = this.$store.state.viewer3d.distances
        },
        */
        selection(valueNew, valueOld){
        
        if(valueNew!=valueOld &&  valueNew  && valueNew.indexOf('-') >= 0){

          // console.log(`activar medidas : punto selección: ${this.isPointASelected} ` )
           
          
          if(!this.isPointASelected){
            // console.log(`Punto: A`)
            this.isPointASelected = true
            this.initStateDetails()

            
            this.$store.state.viewer3d.stateDetails.type = 'A'
             this.$store.state.viewer3d.state = ViewerStatesEnum.MEASURING

          }else{
            // console.log(`Punto: B`)
             this.isPointASelected = false
             this.$store.state.viewer3d.stateDetails.type = 'B'
              this.$store.state.viewer3d.state = ViewerStatesEnum.MEASURING
          }  
          
               
         // console.log(`Save automatico, Punto a: ${JSON.stringify(this.currentMeasure.current)}  `)
        //  console.log(`currentMeasure: ${JSON.stringify(this.currentMeasure)}`)        

        }

 
    },
    
  
    
    currentMeasure (n) {
        //console.log(`currentMeasure: ${JSON.stringify(this.currentMeasure)} **DistancePanel.vue`)   
      
       
        if (n.current) {
          this.pointA = n.current.pointA
          this.pointB = n.current.pointB

            if(n.current.pointA != null && n.current.pointB !=null ){

              //  console.log(`currenrMesure: ${JSON.stringify(this.currentMeasure)}  **DistancePanel.vue `)                 
              // guardar distancia automatica
              this.saveDistance()

            }
        } else {
          this.pointA = null
          this.pointB = null
        }
      
     


    }
  
  
  }
}
</script>

<style scoped>
.card{
  width: 100%;
}
</style>
