import { HTTP } from '../../../index'

export default class tallerHistorialService{

    /*
    async create(data) {
        let result = await HTTP.post(`/api/piezas_admin`, data)
        return result.data
    }
    // 
    */
    async create(data) {
        let result = await HTTP.post(`/api/tallerHistorial/histoiral`, data)
        return result.data
    }
 
    async listByModulo (moduloId) {
        let result = await HTTP.get(`/api/tallerHistorial/list-by-modulo/${moduloId}`)
        return result.data
    }  

    async view  (etapaId, campoId) {
        let result = await HTTP.get(`/api/tallerHistorial/view/${etapaId}/${campoId}`)
        console.log(`View Taller Historial ${result}`)
        return result.data
    }

        
}