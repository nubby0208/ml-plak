import { HTTP } from '../../../index'

export default class presupuestoService{

    async getAll(page = 1, sortBy = "", sortDesc = true, searchParam = "", usuario = "" , seguimiento = "") {
        let result = await HTTP.get(`/api/presupuesto?page=` + page + 
            "&sortBy=" + sortBy + 
            "&sortDesc=" + (sortDesc ? "1" : "0") +
            "&searchParam=" + searchParam +
            "&usuario=" + usuario +
            "&seguimiento=" + seguimiento 
            
        );
        
        return result.data
    }
    
    // "&seguimiento=" + seguimiento
    async deleteBulk(ids) {
        let result = await HTTP.post(`/api/presupuesto/deletebulk`, ids);
        return result.data
    }
    
    async update(id, data) {
        let result = await HTTP.put(`/api/presupuesto/${id}`, data);
        return result.data
    }

    async updateEstado(id, data) {
        let result = await HTTP.put(`/api/presupuesto/estado/${id}`, data);
        return result.data
    }

    async updateCampo(id, data) {
        let result = await HTTP.put(`/api/presupuesto/campo/${id}`, data);
        return result.data
    }

    
}