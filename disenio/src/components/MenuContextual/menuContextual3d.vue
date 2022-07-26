<template>
    <div>
        <componenteMenuContextual ref="menuContextualCompo" :opciones="opcionesComp" />
        <ventanaFlotante ref="ventada" zoom="0.80" max_height="500px" left="5%" @close="cerrarVentanas" :titulo="titulo_v1" :showVentana="showVentana" />
        <ventanaFlotante ref="ventada2" zoom="0.50" left="50%" max_width="50%" :titulo="titulo_v2" :showVentana="showVentana2" />
    </div>
</template>
<script>
import Vue from 'vue'
import { EventBus } from "@/index";
import componenteMenuContextual from '@/components/componenteMenuContextual.vue'
import objectMenuMixin from '@/components/objectMenu.mixin.js'
import EditCube from "@/components/DesignDashboard/Tools/EditCube.vue";
import EditSeparator from "@/components/DesignDashboard/Tools/EditSeparator";
import EditGeneral from "@/components/DesignDashboard/Tools/EditGeneral";
import EditSolapar from "@/components/DesignDashboard/Tools/EditSolapar";
import EditCajon from "@/components/DesignDashboard/Tools/EditCajon";
import EditDobleFondo from "@/components/DesignDashboard/Tools/EditDobleFondo";
import EditPuerta from "@/components/DesignDashboard/Tools/EditPuerta";
import EditBandeja from "@/components/DesignDashboard/Tools/EditBandeja";
import BootstrapVue from "bootstrap-vue";
import ventanaFlotante from "@/components/MenuContextual/ventanaFlotante.vue"
import ModElement from "@/components/DesignDashboard/Tools/ModElement";
Vue.use(BootstrapVue);

export default {
    mixins: [objectMenuMixin],
    data(){
        return {
            showVentana:false,
            titulo_v1:"",
            titulo_v2:"",
            showVentana2:false,
            showModulo:false,
            menu:null,
            opciones:[]
        }
    },
    mounted(){
        EventBus.$on('addDoorEvent', (data) => {
            this._puertaFn();
        });
        EventBus.$on('addDobleFondoManualEvent', (data) => {
            this._dobleFondoFn();
        });

        EventBus.$on('showMenuContextual', (data) => {
            this.showVentana = false;
            this.showVentana2 = false;
            this.showModulo = false;
            if(data.menu == "3d"){
                this.showModulo = true;
                data.menu = "modulo"
                var temp = this.selectedObjectMixer;
                if(temp.elementId !== null && temp.modulo_id !== null){
                    this.$store.commit('clearSelectionMod', null);
                    this.$store.commit("selectModule", Number(temp.modulo_id)-1);
                    this.$store.commit('selectCube', temp.elementId);
                    EventBus.$emit("eventoChangeModulo");
                } 
            }
            // EventBus.$emit('selectCalco', true);
            // console.log(this.$refs);
            this.$refs.menuContextualCompo.showMenu(data.event);
            this.menu = data.menu;
        });
    },
    computed:{
        opcionesComp(){

            // Todas las opciones disponibles se mostraran por defecto las que tengan el atributo show como true
            // Mas abajo estas opciones seran filtradas o modificadas dependiendo del caso
            var opciones = [
                {
                    text:"Ver calcos",
                    func:this._vercalcos,
                    show:true,
                    menu: this.showModulo ? "modulo|separador|cajon|cube|bandeja|dobleFondo|puerta":"", //establece los menus separados por | agrege aqui el tipo de menu pára que se muestre esta opcion dependiendo lo que envie en el evento showMenuContextual
                    class:"",
                    icon:"textarea"
                },
                {
                    text:"Deseleccionar",
                    func:this._deseleccionarAll,
                    show:false,
                    menu:"generar|3d",
                    class:"",
                    icon:"grid"
                },
                {
                    text:"Opc. Zona",
                    func:this._zona,
                    show:false,
                    menu:"modulo|cube",
                    class:"",
                    icon:"columns",
                },
                {
                    text:"Agregar Separador",
                    func:this._sepearador,
                    show:false,
                    menu:"modulo|cube",
                    class:"",
                    icon:"layout-split",
                },
                {
                    text:"Agregar Estante",
                    func:this._estante,
                    show:false,
                    menu:"modulo|cube",
                    class:"",
                    icon:"layout-split",
                    rotate:"90",
                },
                {
                    text:"Agregar Cajon",
                    func:this._cajones,
                    show:false,
                    menu:"modulo|cube",
                    class:"",
                    icon:"inboxes",
                },
                {
                    text:"Generar",
                    func:this._generalFn,
                    show:false,
                    menu:"modulo|separador|cajon|cube|bandeja|dobleFondo|puerta",
                    class:"",
                    icon:"window"
                },
                {
                    text:"Agr. dibujo a pieza",
                    func:this._agregarDibujo,
                    show:false,
                    menu:"modulo|separador",
                    class:"",
                    icon:"window"
                },
                {
                    text:"Separador",
                    func:this._seperadorOpcFn,
                    show:false,
                    menu:"modulo|separador",
                    class:"",
                    icon:"layout-split",
                    sub:[
                        {
                            text:"Opc. separador",
                            func:this._seperadorOpcFn,
                            show:false,
                            menu:"modulo|separador",
                            class:"",
                            icon:"layout-split",
                        },
                        {
                            text:"Eliminar",
                            func:this._deleteNext,
                            show:false,
                            menu:"modulo|separador",
                            class:"",
                            icon: this.isSeparadorVertical ? "chevron-compact-left" : "chevron-compact-up"
                        },
                        {
                            text:"Eliminar",
                            func:this._deletePrev,
                            show:false,
                            menu:"modulo|separador",
                            class:"",
                            icon: this.isSeparadorVertical ? "chevron-compact-right" : "chevron-compact-down"
                        }
                    ]
                },
                {
                    text:"Solapar & Dividir",
                    func:this._solaparFn,
                    show:false,
                    menu:"modulo|separador",
                    class:"",
                    icon:"list"
                },
                {
                    text:"Opc. Cajones",
                    func:this._cajonesFn,
                    show:false,
                    menu:"modulo|cajon",
                    class:"",
                    icon:"inboxes"
                },
                {
                    text:"Borrar cajon",
                    func:this._deleteCajonFn,
                    show:false,
                    menu:"modulo|cajon",
                    class:"",
                    icon:"trash"
                },
                {
                    text:"Opc. Doble fondo",
                    func:this._dobleFondoFn,
                    show:false,
                    menu:"modulo|dobleFondo",
                    class:"",
                    icon:"file-fill"
                },
                {
                    text:"Eliminar Doble fondo",
                    func:this._deleteDobleFondoFn,
                    show:false,
                    menu:"modulo|dobleFondo",
                    class:"",
                    icon:"trash"
                },
                {
                    text:"Opc. Puerta",
                    func:this._puertaFn,
                    show:false,
                    menu:"modulo|puerta",
                    class:"",
                    icon:"door-closed"
                },
                {
                    text:"Eliminar Puerta",
                    func:this._deletePuertaFn,
                    show:false,
                    menu:"modulo|puerta",
                    class:"",
                    icon:"trash"
                },
                {
                    text:"Opc. Bandeja",
                    func:this._bandejaFn,
                    show:false,
                    menu:"modulo|bandeja",
                    class:"",
                    icon:"list"
                },
            ];

            switch (this.menu) {
                case "3d":
                //    opciones = this.getOpciones3d(opciones);
                    opciones = this.getOpcionesModulo(opciones);
                break;
                case "modulo":
                    opciones = this.getOpcionesModulo(opciones);
                break;
            
                default:
                    return [];
                break;
            }

            return opciones.filter((opc)=>{
                var reg = RegExp(`^(${opc.menu})$`, "g");
                return (reg.test(this.menu) || reg.test("all"));
            });

        },
        isListonVertical () {
          return this.selectedElement.liston && (this.selectedElement.Orientacion === 4 || this.selectedElement.Orientacion === 1)
        },
        isListonHorizontal () {
            return this.selectedElement.liston && (this.selectedElement.Orientacion === 3 || this.selectedElement.Orientacion === 2)
        },
        isSeparadorVertical () {
            try {
                return this.$store.getters.getSelectedSeparadorOrientacion === 1 || this.$store.getters.getSelectedSeparadorOrientacion === 4
            } catch (error) {
                return false
            }
        },
        isSeparadorHorizontal () {
            return this.$store.getters.getSelectedSeparadorOrientacion === 2 || this.$store.getters.getSelectedSeparadorOrientacion === 3
        },
    },
    methods:{
        cerrarVentanas(){
            this.showVentana = false;
            this.showVentana2 = false;
            this.titulo_v1 = "";
            this.titulo_v2 = "";
            this.showModulo = false;
        },
        mostrarModulo(){
            var EditorModuleInstance = Vue.extend(ModElement);
            let ElementMountedModule = new EditorModuleInstance({
                store: this.$store,
                parent: this.$parent,
                id:null
            });
            
            ElementMountedModule.id = (Number(this.selectedObjectMixer.modulo_id)) * this.$store.state.layout.idMultiplier.modulo;
            ElementMountedModule.$mount(this.$refs.ventada2.$refs.contenidoVentana.children[0]);
            this.showVentana2 = true;
            this.titulo_v2 = "Calco";
        },
        _vercalcos(){
            EventBus.$emit('selectCalco', true);
            this.$root.$emit('mostrarModalCarcos3d', true);
        },
        _deseleccionarAll(){
            this.$store.commit('clearSelectionMod', null);
        },
        _sepearador(){
            this.$store.commit('splitVertical', { count: 2 });
        },
        _estante(){
            this.$store.commit('splitHorizontal', { count: 2});
        },
        _cajones(){
            this.$store.commit('addCajon', 1);
        },
        _zona(){
            var EditCubeInstance = Vue.extend(EditCube);
            let ElementMounted = new EditCubeInstance({
                store: this.$store,
                parent: this.$parent,
            });

            var generalElement = ElementMounted.$mount(this.$refs.ventada.$refs.contenidoVentana.children[0]);
            var element = generalElement.$el.querySelector(".flex");
            
            if(element){
               element.style.display = "none"; 
            }

            this.showVentana = true;
            this.titulo_v1 = "Zona";

            // this.$swal({
            //     content: ElementMounted.$mount().$el,
            //     buttons: false,
            // });

            // this.$store.commit('clearSelectionMod', null);
        },
        _seperadorOpcFn(){
            
            var EditSeparatorInstance = Vue.extend(EditSeparator);
            let ElementMounted = new EditSeparatorInstance({
                store: this.$store,
                parent: this.$parent,
            });
            
            
            var elementoMounted = ElementMounted.$mount(this.$refs.ventada.$refs.contenidoVentana.children[0]);
            var element = elementoMounted.$el.querySelector(".flex");
            
            if(element){
               element.style.display = "none"; 
            }

            this.showVentana = true;
            if(!this.$store.getters.selectedElement.virtual && !this.$store.getters.selectedElement.liston && !this.$store.getters.selectedElement.barral){
                this.titulo_v1 = "Separador";
            }else if(this.$store.getters.selectedElement.virtual){
                this.titulo_v1 = "Separador Virtual";
            }else if(this.$store.getters.selectedElement.liston){
                this.titulo_v1 = "Liston";
            }else if(this.$store.getters.selectedElement.barral){
                this.titulo_v1 = "Barral";
            }
            // console.log(ElementMounted.$mount().$el);

            // this.$swal({
            //     content: ElementMounted.$mount().$el,
            //     buttons: false,
            // });

            // this.$store.commit('clearSelectionMod', null);
        },
        _bandejaFn(){
            var EditBandejaInstance = Vue.extend(EditBandeja);
            let ElementMounted = new EditBandejaInstance({
                store: this.$store,
                parent: this.$parent,
            });

            var generalElement = ElementMounted.$mount(this.$refs.ventada.$refs.contenidoVentana.children[0]);
            var element = generalElement.$el.querySelector(".titulo");
            
            if(element){
               element.style.display = "none"; 
            }

            this.showVentana = true;
            this.titulo_v1 = "Bandeja"

        },
        _cajonesFn(){
            var EditCajonInstance = Vue.extend(EditCajon);
            let ElementMounted = new EditCajonInstance({
                store: this.$store,
                parent: this.$parent,
            });

            var generalElement = ElementMounted.$mount(this.$refs.ventada.$refs.contenidoVentana.children[0]);

            var element = generalElement.$el.querySelector(".title_cajon");
            
            if(element){
               element.style.display = "none"; 
            }
            
            this.showVentana = true;
            this.titulo_v1 = "Cajones";
            // this.$swal({
            //     content: ElementMounted.$mount().$el,
            //     buttons: false,
            // });

            // this.$store.commit('clearSelectionMod', null);
        },
        _dobleFondoFn(){
            var EditDobleFondoInstance = Vue.extend(EditDobleFondo);
            let ElementMounted = new EditDobleFondoInstance({
                store: this.$store,
                parent: this.$parent,
            });

        

            if(!ElementMounted.$mount(this.$refs.ventada.$refs.contenidoVentana.children[0]).dobleFondoIsCompleted && this.showModulo){
                this.mostrarModulo();
            }

            var generalElement = ElementMounted.$mount(this.$refs.ventada.$refs.contenidoVentana.children[0]);
            var element = generalElement.$el.querySelector(".titulo");
            
            if(element){
               element.style.display = "none"; 
            }

            this.showVentana = true;
            this.titulo_v1 = "Doble Fondo";

        },
        _deleteDobleFondoFn(){
            this.$store.commit('deleteDobleFondo');
        },
        _puertaFn(){
            var EditPuertaInstance = Vue.extend(EditPuerta);
            let ElementMounted = new EditPuertaInstance({
                store: this.$store,
                parent: this.$parent,
            });

            var generalElement = ElementMounted.$mount(this.$refs.ventada.$refs.contenidoVentana.children[0]);
            var element = generalElement.$el.querySelector(".titulo");
            
            if(element){
               element.style.display = "none"; 
            }

            if(!generalElement.doorIsCompleted && this.showModulo){
                this.mostrarModulo();
            }
            
            this.showVentana = true;
            this.titulo_v1 = generalElement.isCorrediza ? "Puerta Corrediza (grupo)":"Puerta";
        },
        _deletePuertaFn(){
            var EditPuertaInstance = Vue.extend(EditPuerta);
            let ElementMounted = new EditPuertaInstance({
                store: this.$store,
                parent: this.$parent,
            });

            ElementMounted.$mount().deleteDoor();

            // this.$store.commit('clearSelectionMod', null);
        },
        _deleteCajonFn(){
            this.$store.commit('removeCajon')
        },
        _deletePrev(){
            var EditSeparatorInstance = Vue.extend(EditSeparator);
            let ElementMounted = new EditSeparatorInstance({
                store: this.$store,
                parent: this.$parent,
            });

            ElementMounted.$mount().deletePrevious();

            // this.$store.commit('clearSelectionMod', null);
        },
        _deleteNext(){
            var EditSeparatorInstance = Vue.extend(EditSeparator);
            let ElementMounted = new EditSeparatorInstance({
                store: this.$store,
                parent: this.$parent,
            });

            ElementMounted.$mount().deleteNext();

            // this.$store.commit('clearSelectionMod', null);
        },
        _generalFn(){
            var EditGeneralInstance = Vue.extend(EditGeneral);
            let ElementMounted = new EditGeneralInstance({
                store: this.$store,
                parent: this.$parent,
                selected:null
            });

            ElementMounted.selected = this.$store.getters.selectedElement.id;

            var general = ElementMounted.$mount(this.$refs.ventada.$refs.contenidoVentana.children[0]);

            var element = general.$el.querySelector(".flex");
            
            if(element){
               element.style.display = "none"; 
            }

            if(((general.connectionsAfter && general.connectionsAfter.length > 0) || (general.connectionsBefore && general.connectionsBefore.length > 0)) && this.showModulo){
                this.mostrarModulo();
            }
            
            this.showVentana = true;
            this.titulo_v1 = "General";
        },
        _agregarDibujo(){
            var EditGeneralInstance = Vue.extend(EditGeneral);
            let ElementMounted = new EditGeneralInstance({
                store: this.$store,
                parent: this.$parent,
                selected:null
            });

            ElementMounted.selected = this.$store.getters.selectedElement.id;

            var general = ElementMounted.$mount();
            if(this.$store.getters.getSelectCara == "izquierda"){
                general.caraDibujo = "front";
            }else if(this.$store.getters.getSelectCara == "derecha"){
                general.caraDibujo = "back";
            }
            
            if(general.allowsDrawing){
                general.openDrawingModal();
            }
        },
        _solaparFn(){
            var EditSolaparInstance = Vue.extend(EditSolapar);
            let ElementMounted = new EditSolaparInstance({
                store: this.$store,
                parent: this.$parent,
            });

            var generalElement = ElementMounted.$mount(this.$refs.ventada.$refs.contenidoVentana.children[0]);
            var element = generalElement.$el.querySelector(".flex");
            
            if(element){
               element.style.display = "none"; 
            }

            this.showVentana = true;
            this.titulo_v1 = "Solapar";
            
        },
        getOpciones3d(opciones){

            // Verificamos si esta seleccionado un elemento para mostrar las opciones correspondiente

            console.log(this.selectedObjectMixer.elementId);
            // EventBus.$emit('selectCalco', true);
            // this.$store.commit('clearSelectionMod');
            // this.$store.commit('selectCube', this.selectedObjectMixer.elementId)
            
            if(this.$store.state.viewer3d.selection && this.selectedObjectMixer.type && this.selectedObjectMixer.type !== "module"){
                
                // console.log(this.$store.state.viewer3d.selection);
                // Si ya se encuetra seleccionado una pieza no hay necesidad de volver a seleccionar la calco por lo tanto solo se mostrara la modal con la calco ya seleccionada
                // Como ya la pieza esta seleccionada se miestra la opcion para deseleccionar todo
                if(this.$store.getters.selectedElement && this.$store.getters.selectedElement.id == this.selectedObjectMixer.elementId){

                    opciones.find(a=>a.text == "Ver calcos").func = ()=>{
                        this.$root.$emit('mostrarModalCarcos3d', true);
                    };
                    opciones.find(a=>a.text == "Deseleccionar").show = true;
                }
                // return 
            }else{
                // En este momento el clik que realizo no selecciono ninguna pieza por lo que no retornaremos ninguna opcion
                return [];
            }

            return opciones;
        },
        getOpcionesModulo(opciones){
            var opc_null = true;
            if(this.$store.getters.selectedElement){
                Object.keys(this.$store.getters.selectedElement).forEach(k=>{
                    if(k == "puerta" && this.$store.getters.selectedElement[k]){
                        if(this.$store.getters.selectedElement.separator){
                            opc_null = false;
    
                            opciones = opciones.map(map=>{
                                map.show = true;
                                return map;
                            }).filter((opc)=>{
                                var reg = RegExp(`^(${opc.menu})$`, "g");
                                return (reg.test("puerta") || reg.test("separador"));
                            });
                            
                        }else{
                            opc_null = false;
                            
                            opciones = opciones.map(map=>{
                                map.show = true;
                                return map;
                            }).filter((opc)=>{
                                var reg = RegExp(`^(${opc.menu})$`, "g");
                                return (reg.test("puerta"));
                            });
                        }
                    }
    
                    if(k == "dobleFondo" && this.$store.getters.selectedElement[k]){
                        if(this.$store.getters.selectedElement.separator){
                            opc_null = false;
                            
                            opciones = opciones.map(map=>{
                                map.show = true;
                                return map;
                            }).filter((opc)=>{
                                var reg = RegExp(`^(${opc.menu})$`, "g");
                                return (reg.test("dobleFondo") || reg.test("separador"));
                            });
                        }else{
                            opc_null = false;
                            
                            opciones = opciones.map(map=>{
                                map.show = true;
                                return map;
                            }).filter((opc)=>{
                                var reg = RegExp(`^(${opc.menu})$`, "g");
                                return (reg.test("dobleFondo"));
                            });
                        }
                    }
    
                    if(k == "barral" && this.$store.getters.selectedElement[k]){
                        if(this.$store.getters.selectedElement.separator){
                            opc_null = false;
    
                            opciones = opciones.map(a=>{
                            if(a.text == "Separador"){
                                    a.text = "Barral";
                                    if("sub" in a){
                                        a.sub[0].text = "Opc. Barral";
                                    }
                                }
                                return a;
                            });
    
                            opciones = opciones.map(map=>{
                                map.show = true;
                                return map;
                            }).filter((opc)=>{
                                var reg = RegExp(`^(${opc.menu})$`, "g");
                                return (reg.test("separador"));
                            });
                            
                        }else{
                            opc_null = false;
                        }
                    }
    
                    if(k == "virtual" && this.$store.getters.selectedElement[k]){
                        if(this.$store.getters.selectedElement.separator){
                            opc_null = false;
    
                            opciones = opciones.map(a=>{
                                if(a.text == "Separador"){
                                    a.text = "Separador virtual";
                                    if("sub" in a){
                                        a.sub[0].text = "Opc. Separador V.";
                                    }
                                }
                                return a;
                            });
    
                            opciones = opciones.map(map=>{
                                map.show = true;
                                return map;
                            }).filter((opc)=>{
                                var reg = RegExp(`^(${opc.menu})$`, "g");
                                return (reg.test("separador"));
                            });
                            
                        }else{
                            opc_null = false;
                        }
                    }
    
    
                    if(k == "bandeja" && this.$store.getters.selectedElement[k]){
                        if(this.$store.getters.selectedElement.separator){
                            opc_null = false;
    
                            opciones = opciones.map(map=>{
                                map.show = true;
                                return map;
                            }).filter((opc)=>{
                                var reg = RegExp(`^(${opc.menu})$`, "g");
                                return (reg.test("bandeja") || reg.test("separador"));
                            });
                            
                        }else{
                            opc_null = false;
                        }
                    }
    
                    if(k == "cajon" && this.$store.getters.selectedElement[k]){
                        if(this.$store.getters.selectedElement.separator){
                            opc_null = false;
                        }else{
                            opc_null = false;
    
                            opciones = opciones.map(map=>{
                                map.show = true;
                                return map;
                            }).filter((opc)=>{
                                var reg = RegExp(`^(${opc.menu})$`, "g");
                                return (reg.test("cajon"));
                            });
                        }
                    }
    
                });
    
                if(this.$store.getters.selectedElement.cube){
                    if(opc_null){
                        opc_null = false;
                        opciones = opciones.map(map=>{
                            map.show = true;
                            return map;
                        }).filter((opc)=>{
                            var reg = RegExp(`^(${opc.menu})$`, "g");
                            return (reg.test("cube"));
                        });
                    }
                }else if(this.$store.getters.selectedElement.separator){
                    if(opc_null){
                        opciones = opciones.map(map=>{
                           map.show = true;
                           return map;
                       }).filter((opc)=>{
                           var reg = RegExp(`^(${opc.menu})$`, "g");
                           return (reg.test("separador"));
                       });
                    }
                }
            }

            return opciones;
        }
    },
    destroyed(){
        this.showVentana = false;
    },
    components:{
        ventanaFlotante,
        componenteMenuContextual
    }
}
</script>

<style>
.menu {
  position: absolute;
  width: 200px;
  padding: 2px;
  margin: 0;
  border: 1px solid #bbb;
  background: #eee;
  background: -webkit-linear-gradient(to bottom, #fff 0%, #e5e5e5 100px, #e5e5e5 100%);
  background: linear-gradient(to bottom, #fff 0%, #e5e5e5 100px, #e5e5e5 100%);
  z-index: 100;
  border-radius: 3px;
  box-shadow: 1px 1px 4px rgba(0,0,0,.2);
  opacity: 0;
  -webkit-transform: translate(0, 15px) scale(.95);
  transform: translate(0, 15px) scale(.95);
  transition: transform 0.1s ease-out, opacity 0.1s ease-out;
  pointer-events: none;
}

.menu-item {
  display: block;
  position: relative;
  margin: 0;
  padding: 0;
  white-space: nowrap;
}

.menu-btn {
  background: none;
  line-height: normal;
  overflow: visible;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  display: block;
  width: 100%;
  color: #444;
  font-family: 'Roboto', sans-serif;
  font-size: 12pt;
  text-align: left;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  padding: 6px 8px;
  border-radius: 3px;
}
 .menu-btn::-moz-focus-inner, .menu-btn::-moz-focus-inner {
 border: 0;
 padding: 0;
}

.menu-text { margin-left: 10px; }

.menu-btn .fa {
  position: absolute;
  left: 8px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}

.menu-item:hover > .menu-btn {
  color: #fff;
  outline: none;
  background-color: #2E3940;
  background: -webkit-linear-gradient(to bottom, #5D6D79, #2E3940);
  background: linear-gradient(to bottom, #5D6D79, #2E3940);
  border: 1px solid #2E3940;
}

.menu-item.disabled {
  opacity: .5;
  pointer-events: none;
}

.menu-item.disabled .menu-btn { cursor: default; }

.menu-separator {
  display: block;
  margin: 7px 5px;
  height: 1px;
  border-bottom: 1px solid #fff;
  background-color: #aaa;
}

.menu-item.submenu::after {
  content: "";
  position: absolute;
  right: 6px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-left-color: #808080;
}

.menu-item.submenu:hover::after { border-left-color: #fff; }

.menu .menu {
  top: 4px;
  left: 99%;
}

.show-menu, .menu-item:hover > .menu {
  opacity: 1;
  -webkit-transform: translate(0, 0) scale(1);
  transform: translate(0, 0) scale(1);
  pointer-events: auto;
}

.menu-item:hover > .menu {
  -webkit-transition-delay: 100ms;
  transition-delay: 300ms;
}

.tooltip {
    z-index: 2147483647 !important;
}

</style>