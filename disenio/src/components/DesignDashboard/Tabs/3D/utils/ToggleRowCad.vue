<template>
    <b-row @click="selectCadUpdate(count)"  align-v="center" class="pb-2">
        <b-col class="px-0" cols="1">
            <font-awesome-icon    style="cursor: pointer"
                @click="isCollapsed = !isCollapsed"
                :icon="isCollapsed ? 'caret-right' : 'caret-down'"/>
        </b-col>
        <b-col class="px-0 text-left"  cols="6"  md="7" lg="8" style="cursor: pointer">
            <p class="h6 m b-0">                
                <strong>      
                    {{grupo.name}}
                </strong>
            </p>
        </b-col> 
        
        <b-col class="pl-0 pr-4" cols="1">
                <!-- @click="s" -->
            <font-awesome-icon style="cursor: pointer" size="lg"
                @click="setShowGrupoCad3d(count)"
                :icon="showGrupoCad ? 'eye' : 'eye-slash'"
            />
        </b-col>
        <b-col
            class="px-0"
            cols="1"
        >  
            <!-- <input
                type="checkbox"
                class="form-control"
                style="cursor:pointer;"
                v-model="module.showOnly"
                @click="$store.commit('toggleModuleVisibility', {
                        _showOnly: !module.showOnly,
                        isRoomEditor: module.isRoomEditor,
                        moduleName: module.moduleName,
                    }
                ), $emit('createFolder')"
            /> -->
        </b-col>

        <b-container
            v-if="!isCollapsed"
            class="py-1"
        >
            
            <template v-if="grupo.Squares.length > 0">
                <ToggleSubRowCad
                    v-for="(square, index) of grupo.Squares"
                    :key="`Cuadro_${index}`"
                    :geometria=square
                    tipo="Cuadro"
                    :count=index
                    @setShowCad3d="setShowCad3dSqueare"
                />
            </template>
            <template v-if="filtrarLineas.length > 0">
                <ToggleSubRowCad
                    v-for="(lineas, index) of filtrarLineas"
                    :key="`Linea_${index}`"
                    tipo="Linea"
                    :geometria=lineas
                    :count=index
                    @setShowCad3d="setShowCad3dLine"
                />
            </template>
            <template v-if="grupo.Circles.length > 0">
                <ToggleSubRowCad
                    v-for="(circles, index) of grupo.Circles"
                    :key="`Circulo_${index}`"
                    tipo="Circulo"
                    :geometria=circles
                    :count=index
                    @setShowCad3d="setShowCad3dCircles"
                />
            </template>
        </b-container>
    </b-row>
</template>
<script>
import ToggleSubRowCad from './ToggleSubRowCad.vue'
export default {
    name: 'ToggleRow',
    components:{
        ToggleSubRowCad
    },
    props: {
        grupo: {
            type: Object,
            default: null,
        },
        count: {
            type: Number,
            default: null,
        },
    },
    
    // methods:{
    //     selectModule(modulo){
    //         this.$store.commit('updateSelectionById', String(modulo.name).replace(' ', '_'));
    //     }
    // },
    data: () => {
        return {
            isCollapsed: true,
            
        }
    },
    methods: {
        selectCadUpdate(index){
            // alert(`Grupo: ${this.count} Cuadro: ${index}`);
            this.$store.commit('updateSelectionById', `grupo_cad_${index}`);
        },
        setShowCad3dSqueare(index){
            // alert(`Grupo: ${this.count} Cuadro: ${index}`);
            this.$store.commit('setShowGeometriaCad3d', {grupo:this.count, geometria:index, tipo:"Squares", show:!this.showGeometriaCad(this.count, index, "Squares")});
        },
        setShowCad3dLine(index){
            // alert(`Grupo: ${this.count} Linea: ${index}`);
            this.$store.commit('setShowGeometriaCad3d', {grupo:this.count, geometria:index, tipo:"lineas", show:!this.showGeometriaCad(this.count, index, "lineas")});
            // this.$store.commit('setShowGeometriaCad3d', {grupo:this.count, geometria:index, tipo:"linea", show:!this.showGeometriaCad});
        },
        setShowCad3dCircles(index){
            // alert(`Grupo: ${this.count} Linea: ${index}`);
            this.$store.commit('setShowGeometriaCad3d', {grupo:this.count, geometria:index, tipo:"Circles", show:!this.showGeometriaCad(this.count, index, "Circles")});
            // this.$store.commit('setShowGeometriaCad3d', {grupo:this.count, geometria:index, tipo:"linea", show:!this.showGeometriaCad});
        },
        setShowGrupoCad3d(index){
            this.$store.commit('setShowGrupoCad3d', {index:index, show:!this.showGrupoCad});
            // alert("Grupo: "+index);
        },
        showGeometriaCad(grupo, geometria, tipo){
            var allGrupo = this.$store.getters.getCadGrupos3D.grupos;
            // debugger;
            if(allGrupo[grupo][tipo][geometria].show3d === false){
                return false;
            }
            return true;
        }
    },

    computed:{
        showGrupoCad(){
            if(this.grupo.show3d === false){
                return false;
            }
            return true;
        },
        filtrarLineas(){
            // return [];
            // return this.grupo.lineas;
            // debugger;
            return this.grupo.lineas.filter(a=>a.hasOwnProperty("PointStart"));
        }
    },


}

</script>