import { HTTP } from '../../../index'

export default class grupoService{

    async getAll() {
        console.log('getall grupo service')
        let result = await HTTP.get(`/api/grupos`)
        return result.data
    
    }
    async getById(id) {
        console.log('getallbyid grupo service')
        let result = await HTTP.get(`/api/grupos/${id}`)
        return result.data
    }
    
    async store(grupo) {
        console.log('proyectosService')
        let result = await HTTP.post(`/api/grupos/`, grupo)
        return result.data
    }

    async update(id, grupo) {
        let result = await HTTP.put(`/api/grupos/${id}`, grupo)
        return result.data
    }



}


