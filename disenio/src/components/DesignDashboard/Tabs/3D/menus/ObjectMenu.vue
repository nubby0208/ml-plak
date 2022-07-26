<template>
  <div class="h-100 card card-default">
    <b-modal hide-footer :t="selectedObjectMixer" size="xl" v-model="showCalcos">
      <div class="calco-list">
        <CalcoContainer
          ref="calco"
          class="calco calco-unidad"
          style="margin: auto !important;"
          v-if="showCalco(selectedElement)"
          :id="selectedElement"
        />
      </div>
    </b-modal>
    <div class="card-body">
        <b-tabs content-class="mt-3">
            <b-tab title="Modelo" active>
              <b-container class="modulo_scroll">
                <ObjectPanel/>
              </b-container>
              
            </b-tab>
            <b-tab title="Distancia">
              <b-container class="modulo_scroll">
                <DistancePanel/>
              </b-container>              
            </b-tab>

            <b-tab title="Indicador">
              <b-container class="modulo_scroll">
                <LabelsPanel/>
              </b-container>
            </b-tab>
            
        </b-tabs>
    </div>
  </div>
</template>
<script>
import ObjectPanel from '../panels/ObjectPanel.vue'
import DistancePanel from '../panels/DistancePanel.vue'
import LabelsPanel from '../panels/LabelsPanel.vue'
import CalcoContainer from "@/components/DesignDashboard/Tools/CalcoContainer.vue";
import objectMenuMixin from '@/components/objectMenu.mixin.js'


export default {
  name: 'ObjectMenu',
  mixins: [objectMenuMixin],
  data(){
    return {
      showCalcos:false
    }
  },
  components: {
    ObjectPanel,
    DistancePanel,
    LabelsPanel,
    CalcoContainer
  },
  mounted(){
    this.$root.$on("mostrarModalCarcos3d", (data)=>{
      this.showCalcos = data;
    });
  },
  methods:{
    hasCalco(element) {
      return (
        element &&
        ((element.separator && element.size > 0) ||
          element.cajon ||
          element.puerta ||
          element.dobleFondo)
      );
    },
    showCalco(element) {
      return (
        !this.$store.state.layout.ambienteEnabled && this.hasCalco(element)
      );
    }
  },
  computed:{
    selectedElement() {
      return this.$store.getters.selectedElement;
    },
  },
  watch:{
    showCalcos(val){
      if(val){
        setTimeout(()=>{
          var calcosId = document.querySelectorAll(".calco-unidad");
          if(calcosId[0].children.length){
            console.log(calcosId[0]);
          }
        }, 50);
      }
    }
  }
}
</script>

<style>
.card{
  /* width: 100%; */
}

.calco-list{
  display:flex;
  /* overflow-x: auto; */
  /* white-space: nowrap; */
}
.calco-list td{
  margin: 0;
  padding: 0 !important;
}

 .modulo_scroll{
      height: 60vh;
      overflow-y: scroll;
  }

  .modulo_scroll::-webkit-scrollbar {
      width: 8px;     /* Tamaño del scroll en vertical */
      height: 8px;    /* Tamaño del scroll en horizontal */
    }

     .modulo_scroll::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 4px;
    }
    .modulo_scroll::-webkit-scrollbar-thumb:hover {
      background: #b3b3b3;
      box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
    }

    .modulo_scroll::-webkit-scrollbar-thumb:active {
      background-color: #999999;
    }
</style>
