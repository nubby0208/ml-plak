<template>
    <b-row  align-v="center" class="pb-2">
        <b-col class="px-0" cols="1">
            <font-awesome-icon    style="cursor: pointer"
                @click="isCollapsed = !isCollapsed"
                :icon="isCollapsed ? 'caret-right' : 'caret-down'"/>
        </b-col>
        <b-col class="px-0 text-left"  cols="6"  md="7" lg="8" style="cursor: pointer"
            @click="selectModule(module)">
            
            <p class="h6 m b-0">                
                <strong @click="selectModule(module)">      
                    <!-- {{ String(module.name).replace('_', ' ') }} -->
                    {{getModuleabbreviation(module.moduleId)}} (</strong> {{getModuleName(module.moduleId)}} <strong>) 
                </strong>
            </p>
        </b-col> 
        
        <b-col class="pl-0 pr-4" cols="1">
            <font-awesome-icon style="cursor: pointer" size="lg"
                    
                @click="$store.commit('toggleModuleVisibility', {
                        _visible: !module.visible,
                        isRoomEditor: module.isRoomEditor,
                        moduleName: module.moduleName,
                    }
                ),
                $emit('createFolder')
                "
                
                :icon="module.visible ? 'eye' : 'eye-slash'"
            />
        </b-col>
        <b-col
            class="px-0"
            cols="1"
        >  
            <input
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
            />
        </b-col>

        <b-container
            v-if="!isCollapsed"
            class="py-1"
        >
            
            <ToggleSubRow
                v-for="(piece, index) of module.pieces"
                :key="index"
                :piece=piece
                :module=module
            />   
        </b-container>
    </b-row>
</template>
<script>
import ToggleSubRow from './ToggleSubRow.vue'
export default {
    name: 'ToggleRow',
    components:{
        ToggleSubRow
    },
    props: {
        module: {
            type: Object,
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
        // Without using store & Vuex
        selectModule(modulo) {
            this.$emit('moduleClicked', modulo.name);
            this.$store.commit('updateSelectionById', String(modulo.name).replace(' ', '_'));
            console.log("ejecutar la funcion para calcular la carpeta. ");
        },

        getModuleName(id){
            // console.log(` getModuleName  id: ${id}   ** /3D/utils/ToggleRow.vue`)           
            let modulos = this.$store.getters.getModulesRotacion                
            let filter = modulos.filter(item => item.id === id)
            return filter[0].descripcion
        },


        getModuleabbreviation(id){
            // console.log(` getModuleName  id: ${id}   ** /3D/utils/ToggleRow.vue`)           
            let modulos = this.$store.getters.getModulesRotacion                
            let filter = modulos.filter(item => item.id === id)
            return filter[0].modAbreviatura
        },
      
    },

    computed:{
        description: {
        get() {

            console.log(`MODULOS  ${JSON.stringify(this.$store.getters.getModulesList)}`)

            
             // console.log(`MODULOS  ${JSON.stringify(this.$store.getters.getModulesList)}`)
            return this.$store.getters.selectedModule.settings.description;
        }


        // listModules : this.$store.getters.getModulesList || []
    },

    
    

    }


}
</script>