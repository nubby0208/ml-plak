import { HTTP } from '../../../index'

export default class proyectoService{

    async create(data) {
        let result = await HTTP.post(`/api/piezas_admin`, data)
        return result.data
    }

    async update(pieza) {
        let result = await HTTP.put(`/api/piezas/${pieza.id}`, pieza)
        console.log('result pieza', result)
        return result.data
    }

    async delete(pieza_id) {
        let result = await HTTP.delete(`/api/piezas_admin/${pieza_id}`)
        return result.data
    }

    async changeVaSuelta (pieza) {
        let result = await HTTP.put(`/api/piezas/change-va-suelta/${pieza.id}`, pieza)
        return result.data
    }
    
    async listByModulo (moduloId) {
        let result = await HTTP.get(`/api/piezas/list-by-modulo/${moduloId}`)
        return result.data
    }  

    async listSueltasByModulo (moduloId) {
        let result = await HTTP.get(`/api/piezas/list-sueltas-by-modulo/${moduloId}`)
        console.log('list-sueltas-by-modulo', result)
        return result.data
    }



    
    async createHistorialPieza(data) {
        let result = await HTTP.post(`/api/piezas/historialPieza`, data)
        return result.data
    }

    async getHistorialPieza (piezaId) {
        let result = await HTTP.get(`/api/piezas/historialPieza/${piezaId}`)
        // console.log('historialPieza', result)
        return result.data
    }


    async createHistorialTaller(data) {
        let result = await HTTP.post(`/api/piezas/historialTaller`, data)
        return result.data
    }

    
    async getHistorialTaller(etapa_id, campo_id) {
        let result = await HTTP.get(`/api/piezas/historialTaller/${etapa_id}/${campo_id}`)
        // console.log('historialPieza', result)
        return result.data
    }
}