import Vue from 'vue'
import SelectorTapacanto from "@/components/DesignDashboard/Tools/SelectorTapacanto.vue"
import SelectorTapacantoDF from "@/components/DesignDashboard/Tools/SelectorTapacantoDF.vue"
import SelectorTapacantoPuerta from "@/components/DesignDashboard/Tools/SelectorTapacantoPuerta.vue"

export default {
  methods: {
    withDivision () {
        return this.selectedElementThis.separator &&
            this.selectedElementThis.childs !== undefined &&
            this.selectedElementThis.childs !== null &&
            this.selectedElementThis.childs.length > 0
    },
    selectTapacantoLado(index, o, lado){
        console.log(o);
        let SelectorTapacantoInstance = null;
  
        if(this.selectedElementThis.cajon && `${o.separator.name}`.match(/cajon/i)){
          // TAPACANTO CAJON
          var isFrenteCajon = false;
          if (o.separator) {
            if (o.separator.cajon) {
              if(this.isFrenteCajon(o.separator)){
                isFrenteCajon = true;
              }
            }
          }
          
          if(isFrenteCajon){
            if(lado == "derecho"){
              lado = `izquierdo${this.withDivision() ? 'T':''}`;
            }else if(lado == "izquierdo"){
              lado = `derecho${this.withDivision() ? 'T':''}`;
            }else{
              lado = `${lado}${this.withDivision() ? 'T':''}`;
            }
          }else if(o.separator.cajon){
            return true;
          }else{
            
          }

          SelectorTapacantoInstance = Vue.extend(SelectorTapacanto);
          // TAPACANTO CAJON FIN
        }else if(this.selectedElementThis.dobleFondo && `${o.separator.name}`.match(/Doble Fondo/i)){
          // TAPACANTO DOBLE FONDO
          // alert("Doble fondo");
          // return true;
          SelectorTapacantoInstance = Vue.extend(SelectorTapacantoDF);
          // TAPACANTO DOBLE FONDO FIN
        }else if(this.selectedElementThis.puerta && `${o.separator.name}`.match(/Puerta/i)){
          // TAPACANTO PUERTA
          // alert("Puerta");
          // return true;
          var puertaUbicacion = `${o.separator.name}`.replace(/Puerta.* (.*)/ig, '$1');
          if(puertaUbicacion == "I"){
            if(lado == "derecho"){
              lado = `izquierdo${this.withDivision() ? 'T':''}`;
            }else if(lado == "izquierdo"){
              lado = `derecho${this.withDivision() ? 'T':''}`;
            }else{
              lado = `${lado}${this.withDivision() ? 'T':''}`;
            }
          }else if(puertaUbicacion == "D"){
            if(lado == "derecho"){
              lado = `derecho${this.withDivision() ? 'T':''}`;
            }else if(lado == "izquierdo"){
              lado = `izquierdo${this.withDivision() ? 'T':''}`;
            }else{
              lado = `${lado}${this.withDivision() ? 'T':''}`;
            }
          }else{
            if(lado == "derecho"){
              lado = `izquierdo${this.withDivision() ? 'T':''}`;
            }else if(lado == "izquierdo"){
              lado = `derecho${this.withDivision() ? 'T':''}`;
            }else{
              lado = `${lado}${this.withDivision() ? 'T':''}`;
            }
          }

          console.log(lado);
          SelectorTapacantoInstance = Vue.extend(SelectorTapacantoPuerta);
          // TAPACANTO PUERTA FIN
        }else if(this.selectedElementThis.tapacantos){
          // TAPACANTO
          // alert("Pieza normal");
          // return true;
          switch (index) {
            case 0:
              if(lado == "derecho"){
                lado = `derecho${this.withDivision() ? 'T':''}`;
              }else if(lado == "izquierdo"){
                lado = `izquierdo${this.withDivision() ? 'T':''}`;
              }else{
                lado = `${lado}${this.withDivision() ? 'T':''}`;
              }
  
            break;
  
            case 1:
              if(lado == "derecho"){
                lado = `izquierdo${this.withDivision() ? 'T':''}`;
              }else if(lado == "izquierdo"){
                lado = `derecho${this.withDivision() ? 'T':''}`;
              }else{
                lado = `${lado}${this.withDivision() ? 'T':''}`;
              }
  
            break;
  
            case 2:
              if(lado == "derecho"){
                lado = `derecho${this.withDivision() ? 'D':''}`;
              }else if(lado == "izquierdo"){
                lado = `izquierdo${this.withDivision() ? 'D':''}`;
              }else{
                lado = `${lado}${this.withDivision() ? 'D':''}`;
              }
  
              
            break;
  
            case 3:
              if(lado == "derecho"){
                lado = `izquierdo${this.withDivision() ? 'D':''}`;
              }else if(lado == "izquierdo"){
                lado = `derecho${this.withDivision() ? 'D':''}`;
              }else{
                lado = `${lado}${this.withDivision() ? 'D':''}`;
              }
              
            break;
          
            default:
              lado = "sin lados";
            break;
          }
          
          SelectorTapacantoInstance = Vue.extend(SelectorTapacanto);
          // TAPACANTO FIN
        }else{
          // alert("Sin definir");
          return true;
        }
  
        let ElementMounted = new SelectorTapacantoInstance({
          store: this.$store,
          parent: this.$parent,
        });
        
        ElementMounted.lado = lado;
  
        var titulo = lado;
        if(lado.match(/(^.*T$)|(^.*D$)/g)){
          titulo = titulo.replace(/^(.*?)T$/g, 'Tapacanto trasero $1');
          titulo = titulo.replace(/^(.*?)D$/g, 'Tapacanto delantero $1');
        }else{
          titulo = `Tapacanto ${lado}`
        }
        
        this.$swal({
          title: titulo,
          content: ElementMounted.$mount().$el,
          buttons: false,
        });
        
        // console.log(ETIntance.tapacantos);
      }
  },
  computed:{
    selectedElementThis () {
        return this.$store.getters.selectedElement
    },
  }
}