import { TapacantoEnum, AperturaSistema, UbicacionBisagra } from './../models/enums';
import { GeneralConfiguration, Modulo } from '../models/models';
import { CajonAperturaUbicacion, EnumToArray, ModulosExternosEnum, EspesorEnum, TipoDeBaseEnum } from '../models/enums';

export default {
    state: new GeneralConfiguration(),
    getters: {
        colors: (state: any, getters: any) => getters.getMaterialesAdd,
        materiales: (state: any) => (Object as any).entries(state)
            .filter((element: any[]) => element[0].startsWith('color') && element[1])
            .map((element: any[]) => element[1]),
        fondos: (state: any) => (Object as any).entries(state)
            .filter((element: any[]) => element[0].startsWith('fondo') && element[1])
            .map((element: any[]) => element[1]),
        metales: (state: any) => (Object as any).entries(state)
            .filter((element: any[]) => element[0].startsWith('metal') && element[1])
            .map((element: any[]) => element[1]),
        herrajes: (state: any) => {
            return JSON.parse(state.herrajes_add);
        },
        defaultHerrajes: (state: any) => {
            return JSON.parse(state.herrajes_default);
        },
        presupuestosConfig: (state: any) => {
            return state.presupuestosConfig;
        },
        projectInfo: (state: any, getters: any, ob: any) => {
            return ob.info;
        },
        // tapacantos default del modulo seleccionado
        tapacantos_default: (state: any, getters: any) => {
            const tapacantos = getters.isAmbienteSelected ? state.tapacantos_default_por_modulo_room_editor[getters.selectedModuleId + 1] : state.tapacantos_default_por_modulo[getters.selectedModuleId + 1];
            if (tapacantos) {
                return JSON.parse(tapacantos);
            }
        },
        // tapacantos default de todos los modulos
        all_tapacantos_default: (state: any, getters: any) => {
            const result = {} as any;

            state.tapacantos_default_por_modulo.forEach((t: any, index: number) => {
                if (t) {
                    result[index] = JSON.parse(t);
                }
            });

            state.tapacantos_default_por_modulo_room_editor.forEach((t: any, index: number) => {
                if (t) {
                    result[(index) * 100] = JSON.parse(t);
                }
            });

            return result;
        },
        aperturas: (state: any) => EnumToArray(AperturaSistema).map(elem => elem.value),
        ubicaciones: (state: any) => EnumToArray(CajonAperturaUbicacion).map(elem => elem.value),
        ubicacionesBisagra: (state: any) => EnumToArray(UbicacionBisagra).map(elem => elem.value),
        tapacantos: (state: any) => EnumToArray(TapacantoEnum).map(elem => elem.value),
        tapacantoGeneral: (state: any) => state.tapacantoGeneral,
        tapacantoFrente: (state: any) => state.tapacantoFrente,
        // material por defecto del modulo seleccionado
        defaultMaterial(state: any, getters: any) {
            const material = getters.isAmbienteSelected ? state.material_default_por_modulo_room_editor[getters.selectedModuleId] : state.material_default_por_modulo[getters.selectedModuleId];
            if (material) {
                return JSON.parse(material);
            }
        },
        all_material_default: (state: any, getters: any) => {
            const result = {} as any;
            state.material_default_por_modulo.forEach((m: any, index: number) => {
                if (m) {
                    result[index] = JSON.parse(m);
                }
            });

            state.material_default_por_modulo_room_editor.forEach((m: any, index: number) => {
                if (m) {
                    result[(index) * 100] = JSON.parse(m);
                }
            });
            return result;
        },
        defaultFondo: (state: any, getters: any) => JSON.parse(localStorage.getItem('fondo_default') || '{}'), //getters.fondos.length > 0 ? getters.fondos[0] : 0,
        modulosExternos: (state: any) => EnumToArray(ModulosExternosEnum).map(elem => elem.value),
        tipoDeBase: (state: any) => EnumToArray(TipoDeBaseEnum).map(elem => elem.value),
        espesor: (state: any) => EnumToArray(EspesorEnum).map(elem => elem.value),
        getMaterialesAdd(state: any) {
            return state.materiales_add.length > 2 ? JSON.parse(state.materiales_add) : []
        },
        getTapacantosAdd(state: any) {
            return state.tapacantos_add.length > 2 ? JSON.parse(state.tapacantos_add) : []
        },
        getHerrajesAdd(state: any) {
            return state.herrajes_add.length > 2 ? JSON.parse(state.herrajes_add) : []
        },
        getListLineasPremium(state: any) {
            return state.listLineasPremium.length > 2 ? JSON.parse(state.listLineasPremium) : []
        },
        getListLineasClasica(state: any) {
            return state.listLineasClasica.length > 2 ? JSON.parse(state.listLineasClasica) : []
        },
        getMetalesAdd(state: any) {
            return state.metales_add.length > 2 ? JSON.parse(state.metales_add) : []
        },
        getModuleInfo(state: any, getters: any) {
            let modulosExport: any = [];
            getters.getAllModules.forEach((modulo: any, index: number) => {
                const moduleIndex = modulo.isRoomEditor ? modulo.moduleId * 100 : modulo.moduleId;
                const modName = modulo.isRoomEditor ? 'Mod ' + (modulo.moduleId * 100) : modulo.moduleName;
                let m = {
                    'name': modName,
                    'displayName': modName,
                    'isRoomEditorModule': modulo.isRoomEditor,
                    'tapacantosDefault': getters.all_tapacantos_default[moduleIndex] ? getters.all_tapacantos_default[moduleIndex].nombre : undefined,
                    'materialDefault': getters.all_material_default[moduleIndex],

                }
                modulosExport.push(m)
            })
            return modulosExport
        }
    },
    mutations: {
        setGeneralProperty(state: any, payload: any) {
            state[payload.key] = payload.value
        },
        setDefaultMaterialForModule(state: any, payload: any) {
            if (payload.ambienteEnabled) {
                state.material_default_por_modulo_room_editor.splice(payload.module - 1, 1, JSON.stringify(payload.material))
            } else {
                state.material_default_por_modulo.splice(payload.module - 1, 1, JSON.stringify(payload.material))
            }
        },
        setDefaultMaterialForModuleGrupo(state: any, payload: any) {
            // console.log(state);
            if (payload.ambienteEnabled) {
            } else {
                if(payload.hasOwnProperty("allGrupos") && payload.allGrupos){
                    console.log(Modulo.getGrupoModules());
                    Modulo.getGrupoModules().forEach(moduloForeach=>{
                        state.material_default_por_modulo_grupo.splice(moduloForeach.moduleId - 1, 1, JSON.stringify(payload.material))
                    });
                }else{
                    state.material_default_por_modulo_grupo.splice(payload.module - 1, 1, JSON.stringify(payload.material))
                }
            }
        },
        setDefaultTapacantosForModule(state: any, payload: any) {
            if (payload.ambienteEnabled) {
                state.tapacantos_default_por_modulo_room_editor.splice(payload.module - 1, 1, JSON.stringify(payload.tapacantos))
            } else {
                state.tapacantos_default_por_modulo.splice(payload.module - 1, 1, JSON.stringify(payload.tapacantos))
            }
        },
        updateMultiplier(state: any, payload: any) {
            if (payload.isPremium) {
                state.premiumMultiplier = +payload.value;
            } else {
                state.classicMultiplier = +payload.value;
            }
        },
        updatePresupuestosConfig(state: any, payload: any) {
            state.presupuestosConfig[payload.field] = payload.value;
        },
        updateModulesGroup(state: any, payload: any) {
            state.moduleGroups = payload;
        }
    }
}
