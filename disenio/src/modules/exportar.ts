import {HTTP} from '../index';

export default {
    state: {
        preguntasExportar:[],
        preguntasVender:[],
        listExportar:[],
        statusCopiaPresupuesto: false
    },
    getters: {
        getListExportar(state: any){
            return state.listExportar;
        },
        statusPreguntas(state: any){
            if(state.preguntasVender.length < 1){
                return false;
            }

            var P = state.preguntasVender.filter((element:any) => {
                if(element.respuesta !== "" && element.respuesta !== null){
                    return element;
                }
            });

            if(P.length > 0){
                return true;
            }else{
                return false;
            }
            
        },
        getDetalleExportar(state: any){
            var vuex = JSON.parse(localStorage.getItem('vuex'));
            var token_project = vuex.info.token_project;
            return state.listExportar.find((a:any)=>{
                return a.token_proyect == token_project;
            });
        },
        getPermitirExport(state: any){
            var vuex = JSON.parse(localStorage.getItem('vuex'));
            var token_project = vuex.info.token_project;
            var exporta = state.listExportar.find((a:any)=>{
                return a.token_proyect == token_project;
            });
            var user_id = localStorage.getItem("user-id");
            var disabled = false;

            if(exporta){
                if(exporta.usuario_solicitador == user_id && exporta.estado == "Peticion"){
                    disabled = true;
                }
                
                if(exporta.usuario_confirmador == user_id && exporta.estado == "Revisado"){
                    disabled = true;
                }

                if(exporta.usuarios.find((usr:any)=>usr.id == user_id && usr.operacion == "Corregir") && exporta.estado == "Corregir"){
                    disabled = true;
                }
                
            }
            return disabled;
        },
        getStatusExportar(state: any){

            try {
                var vuex = JSON.parse(localStorage.getItem('vuex'));
                var token_project = vuex.info.token_project;
                var exportStatus = state.listExportar.find((a:any)=>{
                    return a.token_proyect == token_project;
                });
    
                return exportStatus.estado;
            } catch (error) {
                return "Sin estado";
            }

        },
    },
    mutations: {
        setPreguntasExportarAll(state: any, payload: any) {
            state.preguntasExportar = payload;
        },
        setStatusCopiaPresupuesto(state: any, payload: any) {
            state.statusCopiaPresupuesto = payload;
        },
        setPreguntasVenderAll(state: any, payload: any) {
            state.preguntasVender = payload;
        },
        setListExportar(state: any, payload: any) {
            state.listExportar = payload;
        },
    },
    actions:{
        async getPreguntasExportar({commit, state}: any){
            return HTTP.get("/api/configuracion/tipo/preguntaExportar/all").then(a=>{
                if(a.data.configuraciones.length > 0){
    
                    var preguntas = a.data.configuraciones.map(function(abc:any) {
                        return {
                            id: abc.id,
                            pregunta: abc.values.pregunta,
                            respuesta: "",
                            estatus: abc.values.estatus,
                            completa: false
                        };
                    });
    
                    if(state.preguntasExportar.length !== preguntas.length){
                      commit("setPreguntasExportarAll", preguntas);
                      return preguntas;
                    }else{
                      return state.preguntasExportar;
                    }
    
                }
            });
        },
        async getPreguntasVender({commit, state}: any){
            return HTTP.get("/api/configuracion/tipo/preguntaVender/all").then(a=>{
                if(a.data.configuraciones.length > 0){
    
                    var preguntas = a.data.configuraciones.map(function(abc:any) {
                        return {
                            id: abc.id,
                            pregunta: abc.values.pregunta,
                            respuesta: "",
                            estatus: abc.values.estatus,
                            completa: false
                        };
                    });
    
                    if(state.preguntasVender.length !== preguntas.length){
                      commit("setPreguntasVenderAll", preguntas);
                      return preguntas;
                    }else{
                      return state.preguntasVender;
                    }
    
                }
            });
        },
        async getListExportar({commit, state}: any){
            return HTTP.get("/api/exportar/get-exportar").then(a=>{
                if(a.status == 200){
                    var list = a.data.map((abc:any)=>{
                        var show = true;
                        
                        var user_id = localStorage.getItem("user-id");
                        if(abc.usuario_solicitador == user_id && abc.estado == "Peticion"){
                            show = false;
                        }
                        
                        if(abc.usuario_confirmador == user_id && abc.estado == "Revisado"){
                            show = false;
                        }

                        if(abc.estado == "Confirmado"){
                            show = false;
                        }

                        if(JSON.parse(abc.usuarios).find((usr:any)=>usr.id == user_id && usr.operacion == "Corregir") && abc.estado == "Corregir"){
                            show = false;
                        }

                        if(abc.mostrar == "0"){
                            show = false;
                        }

                        var nombreCompleto = "";

                        try {
                            nombreCompleto = JSON.parse(abc.usuarios).pop().nombre_completo;
                        } catch (error) {
                            nombreCompleto = JSON.parse(abc.usuarios)[0].nombre_completo;
                        }
                        
                        return {
                            id: abc.id,
                            token_proyect: abc.token_proyect,
                            nombre_completo: nombreCompleto,
                            usuarios: JSON.parse(abc.usuarios),
                            data: JSON.parse(abc.data),
                            usuario_solicitador: abc.usuario_solicitador,
                            usuario_confirmador: abc.usuario_confirmador,
                            proyect_id: abc.proyect_id,
                            estado: abc.estado,
                            comentario: abc.cometarios,
                            preguntas: JSON.parse(abc.preguntas),
                            show:show
                        };
                    });

                    commit("setListExportar", list);
                    return a.data;
                }
            });
        }
    }
}
