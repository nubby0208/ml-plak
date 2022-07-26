<template>
    <div>
        <div v-if="!loading">
            <div class="dropdown">
                <div style="diplay:flex; cursor:pointer;"> <b-icon icon="gear" font-scale="1"></b-icon> <span>{{textDefaut}}</span></div>
                <div class="dropdown-content" :style="contentStyle">
                    <a href="#" @click="selectValor(item.valor)" v-for="(item, index) in opciones" :key="index">{{item.text}}</a>
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
import customvmodelMixin from '@/components/custom.vmodel.mixin.js'


export default {
  name: 'OpcionMiniVisorConfig',
  mixins: [customvmodelMixin],
  props: {
    opciones: {
      type: Array,
      default: [],
    },
    contentStyle: {
      type: Object,
      default: null,
    },
    textDefaut: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      edgeColor: '#ffffff',
      gridEnabled: false,
      loading:false,
      textSelect:""
    }
  },
  mounted(){
      this.textSelect = this.getText(this.localValue);
  },
  methods: {
    selectValor(a){
        this.localValue = a;
    },
    getText(a){
        try {
            var text;
            text = this.opciones.find(b => b.valor == a);
            if(text){
                return text.text;
            }

            return "";
        } catch (error) {
            return "";
        }
    }
  },
  watch: {
    localValue(a) {
        var texto = this.getText(a);
        if(texto !== null && texto !== "" && texto !== " "){
            this.textSelect = texto;
        }else{
            this.textSelect = this.textDefaut;
        }
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
    z-index: 99999999;
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
