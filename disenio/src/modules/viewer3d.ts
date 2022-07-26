import Vue from "vue";
import { AmbientLight } from "three";
import {HTTP} from "../index";
import { Element } from "../models/models";


const varDefaulConfig = {
    enablePieces: true,
    enableWireframe: true,
    enableTextures: true,
    renderPassType: 'SSAARenderPass',
    shaderPassType: 'SAOPass',
    enableLights: true,
    showGrid: false
};

export default {
    state: {
        lastUpdate: 1,
        modules: [],
        textures: [],
        edgeColor: '#fc035a',    //  edgeColor: '#ffffff'  wg
        state: -1,
        labelState: null,
        captionInfo: null,

        selectedFolder:{},

        newMarker: {
            text: 'Pieza ...',
            size: '50',
            color: '#000000'
        },

        currentPositionMark:{},
       
        currentActiveView: 'perspective',
        eventDistance:'',
        newDistance:{},        
        distances: [],
        marks: [],
        stateDetails: null,
        visibleMarks: true,
       
        indicadorModule:[],
        configIndicator:{
            visibleModule: false,
            visibleEnvironment:false,
            visiblePart:false 
        },
        mainLight: new AmbientLight( 0xffffff ),
        viewerEditor: {
            lights: {},
            scene: {},
            room: {}
        },
        viewer: {},
        config: varDefaulConfig,
        configMV: varDefaulConfig,
        configOpciones:[],
        defaultConfig:{
            id: 1,
            name: "default",
            select:false,
            config:varDefaulConfig
        },
        selectionOpcion:{
            token:null,
            idsConfig: {
                idConfig3d: 1,
                idConfigMv: 1
            }
        },
        selection: null,
        camera: null,
        selectCara:null
    },
    getters: {
        getSelectCara(state: any, payload: any){
            return state.selectCara;
        },
        getSelectionConfig(state: any, payload: any){
            var selectOpcion = state.configOpciones.find((a:any) => a.id === state.selectionOpcion.idsConfig.idConfig3d);
            if(selectOpcion){
                return selectOpcion.name;
            }
        },
        getSelectionConfigMV(state: any, payload: any){
            var selectOpcion = state.configOpciones.find((a:any) => a.id === state.selectionOpcion.idsConfig.idConfigMv);
            if(selectOpcion){
                return selectOpcion.name;
            }
        },
        getOptionConfig3d(state: any, payload: any){
            return state.configOpciones;
        }
        ,
        getConfigMV(state: any, payload: any){
            return state.configMV;
        },

        getDistancesId(state: any, payload: any){
            return  state.distances;         
        },

        getSelectedFolder(state: any, payload: any){
            return  state.selectedFolder;         
        },

        getIndicadorModule(state: any, payload: any){
            return  state.indicadorModule;         
        },    

        getConfigIndicator(state: any, payload: any){
            return  state.indicadorModule;         
        },       

    },

    mutations: {
        setCaraSeparador(state: any, payload: any){
            state.selectCara = payload;
        },
        setTokenProyecto(state: any, payload: any){
            var vuex = JSON.parse(localStorage.getItem('vuex'))
            state.selectionOpcion.token = vuex.info.token_project;
        },

        setIndicadorModule(state: { indicadorModule: any }, newIndicadorModule: any) {
            state.indicadorModule = newIndicadorModule
        },

        setSelectedFolder(state: { selectedFolder: any }, newSelectedFolder: any) {
            state.selectedFolder = newSelectedFolder
        },


        setConfigIndicatorModule(state: { configIndicator: any }, newCondition: any) {
            state.configIndicator.visibleModule = newCondition
        },

        setConfigIndicatorEnvironment(state: { configIndicator: any }, newCondition: any) {
            state.configIndicator.visibleEnvironment = newCondition
        },


        setConfigIndicatorPart(state: { configIndicator: any }, newCondition: any) {
            state.configIndicator.visiblePart = newCondition
        },

        setVisibleMark(state: { visibleMarks: any }, newCondition: any) {
            state.visibleMarks = newCondition
        },


        defaultOption(state: any, payload: any) {
            state.configOpciones = [];
            state.configOpciones.push(state.defaultConfig);
            state.selectionOpcion.idsConfig.idConfig3d = state.defaultConfig.id;
            state.config = {...state.defaultConfig.config};
        },

        setConfig (state: any, payload: any) {
            let keys = Object.keys(payload)
            keys.forEach(key => {
                state.config[key] = payload[key]
            })
        },
        addConfigActual(state: any, name: any){
            state.configOpciones = state.configOpciones.map((a:any)=>{
                a.select = false;
                return a;
            });

            var newConfig: any = { ...{
                id: Math.floor(Math.random() * (100000 - 2 + 1)) + 2,
                name: name,
                select:true,
                config:state.config
            }};


            HTTP.post('/api/configuracion', {
                name:name,
                type:"config3D",
                values:newConfig,
            }).then(result => {
                newConfig.id = result.data.id;
                state.configOpciones.push(newConfig);
                state.selectionOpcion.idsConfig.idConfig3d = result.data.id;
            }).catch(result => {
            });
            
        },
        addConfigDataName(state: any, payload: any){
            state.configOpciones = state.configOpciones.map((a:any)=>{
                a.select = false;
                return a;
            });

            
            
            var newConfig = { ...payload.config };

            if(!payload.id){
                payload.id = Math.floor(Math.random() * (100000 - 2 + 1)) + 2;
            }

            state.configOpciones.push({
                id: payload.id,
                name: payload.name,
                select:true,
                config:newConfig
            });
            
        },
        clearOption(state: any, data: any){
            state.configOpciones = [];
        },
        setConfig3dOption(state: any, data: any){
            state.configOpciones = [];
            state.configOpciones = data.map((a:any)=>{

                var select = false;
                var b = {
                    id:a.id,
                    name:a.name,
                    select:select,
                    config:a.values.config,
                };

                return b;
                
            });
            
            state.configOpciones.push(state.defaultConfig);

            state.configOpciones = state.configOpciones.map((a:any) =>{
                if(a.id == state.selectionOpcion.idsConfig.idConfig3d){
                    a.select = true;
                }else{
                    a.select = false;
                }

                return a;
            });

            try {
                var configTemp = state.configOpciones.find((a:any)=>a.id == state.selectionOpcion.idsConfig.idConfig3d);
                if(configTemp){
                    state.config = {...configTemp.config};
                }else{
                    state.selectionOpcion.idsConfig.idConfig3d = state.defaultConfig.id;
                    state.config = {...state.defaultConfig.config};
                }
            } catch (error) {
                state.selectionOpcion.idsConfig.idConfig3d = state.defaultConfig.id;
                state.config = {...state.defaultConfig.config};
            }
            
            
        },
        setSelectOptionConfig3d(state: any, payload: any){

            state.configOpciones = state.configOpciones.map((a:any)=>{
                a.select = false;
                return a;
            });

            state.configOpciones.find((a: any) => a.id == payload.id).select = true;
            
            state.selectionOpcion.idsConfig.idConfig3d = payload.id;
            state.config = {...payload.config};

            let keys = Object.keys(payload.config)
            keys.forEach(key => {
            })
        },
        setSelectOptionConfigMV(state: any, payload: any){

            state.configOpciones = state.configOpciones.map((a:any)=>{
                a.select = false;
                return a;
            });

            state.configOpciones.find((a: any) => a.id == payload.id).select = true;
            
            state.selectionOpcion.idsConfig.idConfigMv = payload.id;
            state.configMV = {...payload.config};
        },
        setLightIntensity (state: { mainLight: any }, light: any) {
            state.mainLight.intensity = light
        },
      
        updateEdgeColor (state: { edgeColor: any }, color: any) {
            state.edgeColor = color.replace('#', '0x')
            console.log(`updateEdgeColor  state.edgeColor :  ${state.edgeColor} ** viewer3d.ts`) 
        },
        updateCurrentActiveView (state: { currentActiveView: string}, view: string) {
            state.currentActiveView = view
        },
        updateAll (state: any, modules?: any) {
            const mod = modules || state.modules
            for (let index = 0; index < mod.length; index++) {
                mod[index].needsUpdate = true
                for (let j = 0; j < mod[index].pieces.length; j++) {
                    mod[index].pieces[j].needsUpdate = true
                }
            }
            Vue.set(state, 'modules', mod)
        },
        updateModule (state: any, module: any) {
            console.log('updateModule')
            for (let index = 0; index < state.modules.length; index++) {
                const element = state.modules[index];
                if (element.id === module.id) {
                    module.needsUpdate = true
                    module = (<any>Object).assign(state.modules[index], module)
                    Vue.set(state.modules, index, module)
                    break
                }
            }
        },
        updatePiece (state: any, piece: any) {
            console.log('update piece')
            for (let i = 0; i < state.modules.length; i++) {
                for (let j = 0; j < state.modules[i].pieces.length; j++) {
                    if (piece.name === state.modules[i].pieces[j].name) {
                        let m = state.modules[i]
                        piece.needsUpdate = true
                        m.pieces[j] = piece
                        piece = (<any>Object).assign(m.pieces[j], piece)
                        Vue.set(state.modules, i, m)
                        break
                    }
                }
                break
            }
        },
        updateTextures (state: any, textures: any) {
            Vue.set(state, 'textures', textures)
        },
        updateSelection (state: { selection: any; }, object: any) {
            // console.log('updateSelection')
            state.selection = object
            // Vue.set(state, 'selection', piece)
        },
        updateSelectionById (state: any, id: any) {

            if (id === null) {
                console.log('dentro de null')
                state.selection = null
                return
            }
            
            state.selection = id

            // commented, because modules are no longer in use
            // ///////////////////////////////////////////////
            // for (let i = 0; i < state.modules.length; i++) {
            //     console.log('!dentro de null')
            //     if (state.modules[i].id === id) {
            //         state.selection = state.modules[i]
            //         return
            //     }
            //     for (let j = 0; j < state.modules[i].pieces.length; j++) {
            //         if (state.modules[i].pieces[j].id === id) {
            //             state.selection = state.modules[i].pieces[j]
            //             return
            //         }
            //     }
            // }
        },
        updateObject (state: any, object: any) {
            console.log('updateObject', object)
            for (let i = 0; i < state.modules.length; i++) {
                if (state.modules[i].id === object.id) {
                    console.log('updateObject', state.modules[i].id)

                    object.needsUpdate = true
                    object = (<any>Object).assign(state.modules[i], object)
                    Vue.set(state.modules, i, object)
                    if (state.selection.id === object.id) {
                        state.selection = state.modules[i]
                    }
                    break
                }
                for (let j = 0; j < state.modules[i].pieces.length; j++) {
                    if (object.id === state.modules[i].pieces[j].id) {
                        let m = state.modules[i]
                        object.needsUpdate = true
                        object = (<any>Object).assign(m.pieces[j], object)
                        m.pieces[j] = object
                        Vue.set(state.modules, i, m)
                        if (state.selection.id === object.id) {
                            state.selection = state.modules[i].pieces[j]
                        }
                        break
                    }
                }
            }
        },


        updateCaption (state: { captionInfo: any }, newCaption: any) {
            state.captionInfo = newCaption
        },

        updateLabelState (state: { labelState: any }, newLabelState: string) {
            state.labelState = newLabelState
        },
        /*

        updateNewMarker (state: { newMarker: any }, newMarker: any) {
            state.newMarker = newMarker
        }, */

        addMark(state: any, mark: any) {
            // pendiente por crear hay que modificar parte del codigo.
            state.marks.push(mark)
            console.log(`addMark, datos: ${JSON.stringify(mark)} , ##/src/modules/viewer3d.ts` )
            // state.eventMarker = "add"
            state.newMarker = mark
            // state.labelState = 'add'
        },

        // actulizacion de todo los datos en el store
        UpdateMarkPosition (state: any,   params:  any) {
            console.log(`UpdateMarkPosition  Index: ${params.index} , Position: ${params.position} ##/src/modules/viewer3d.ts`)
            state.marks[params.index].positionEnd = params.position
            state.marks[params.index].matrix      = params.matrix 

            
            // Vue.set(state.marks, params.index, params.item)            
        },
        
        // deleteMark (state: any, markId: string) {
        deleteMark (state: any, markObj:any) {
            // console.log(`deleteDistance  STORE  ##/src/modules/viewer3d.ts `)
            state.eventMarker = "delete"            
            // console.log(`deleteMark. Markerts:   ${JSON.stringify(state.marks)}  ##/src/modules/viewer3d.ts `)           
            console.log(`deleteMark  STORE   markObj:   ${JSON.stringify(markObj)}  ##/src/modules/viewer3d.ts `)
           

            let found = state.marks
            // console.log(`deleteMark() ITEMS:${JSON.stringify(found)}  ##/src/modules/viewer3d.ts `)
            let foundIndex = found.findIndex((element: { point: any; text: any; })   => element.point.x == markObj.position.x && element.text == markObj.userData.text && element.text == 3  )
                // && element.point.z == markObj.position.z 
                            
            if(foundIndex != -1){
                state.newMarker = state.marks[foundIndex]
                state.marks.splice(foundIndex, 1)
            
            }else{
                foundIndex = found.findIndex((element: { point: any; text: any; })   => element.text == markObj.userData.text)

                if(foundIndex != -1){
                    state.newMarker = state.marks[foundIndex]
                    state.marks.splice(foundIndex, 1)
                }else{
                    console.log(`deleteMArk() STORE No se encontro el Objeto : ${markObj}  ##/src/modules/viewer3d.ts `)    
                }

            }
            
            
            
            



           // state.newMarker = state.marks[markId]
           // state.marks.splice(markId, 1)
        },


        addDistance (state: any, distance: any) {
            state.distances.push(distance)
            console.log(`addDistance, datos: ${JSON.stringify(distance)} , ##/src/modules/viewer3d.ts` )
            state.eventDistance = "add"
            state.newDistance = distance
        },

        // actulizacion de todo los datos en el store
        setUpdateDistance (state: any,   params:  any) {
            console.log(`setUpdateDistance  ${params.index} STORE UPDATE ALL ITEM INDEX ${params.index} /modules/viewer3d.ts  ##/src/modules/viewer3d.ts` )
            Vue.set(state.distances, params.index, params.item)            
        },
        
        deleteDistance (state: any, distanceId: string) {
            console.log(`deleteDistance  STORE  ##/src/modules/viewer3d.ts `)
            let index = state.distances.map((d: { id: any; }) => d.id).indexOf(distanceId)
            state.eventDistance = "delete"
            state.newDistance = index
            state.distances.splice(index, 1)
        },

        setViewerEditor (state: any, viewerEditor: any) {
            state.viewerEditor.room = viewerEditor.room
            state.viewerEditor.scene = viewerEditor.scene
            state.viewerEditor.lights = viewerEditor.lights
        },
        setCamera (state: any, camera: any) {
            state.camera = camera
        },
        setViewer(state: any, viewer: any) {
            state.viewer = viewer;
        }
    },
    actions:{
        addConfig3d({commit, getters}: any){
        },
        async getConfig3dAll({commit, getters}: any){
            commit("setTokenProyecto");
            return HTTP.get("/api/configuracion/tipo/config3d/all").then(a=>{
                if ((a.data.configuraciones !=undefined) && (a.data.configuraciones.length > 0)){

                    commit("setConfig3dOption", a.data.configuraciones);
                    return a.data.configuraciones;
                }else{
                    commit("defaultOption");
                    return getters.getOptionConfig3d;
                }
            });
        }
    }
}
