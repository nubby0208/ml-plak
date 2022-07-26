import { HTTP } from '../../../index'

export default class asistenciaService{


    async store(data) {
        console.log('store asistencia service')
        let result = await HTTP.post(`/api/asistencia/store`, data)
        return result.data
    
    }

    async checkToday(usuario) {
        console.log('getall grupo service')
        let result = await HTTP.post(`/api/asistencia/checks-today`, { usuario })
        return result.data
    
    }

    async getCauses() {
        console.log('getall grupo service')
        let result = await HTTP.get(`/api/asistencia/causes`)
        return result.data
    
    }

    async checkTime(data) {
        console.log('getall grupo service')
        let result = await HTTP.get(`/api/asistencia/check-time`, data)
        return result.data
    
    }

    async getAll() {
        console.log('getall grupo service')
        let result = await HTTP.get(`/api/asistencia`)
        return result.data
    
    }

    async getByUsuarioId(usuario_id) {
        console.log('getall grupo service')
        let result = await HTTP.get(`/api/asistencia/usuario_id/${usuario_id}`)
        return result.data
    
    }
    async getByUsuarioFecha(form){
        console.log('getall grupo service')
        let result = await HTTP.post(`/api/asistencia/usuario-fecha`, form)
        return result.data
    
    }

	async getTiposAsistencias() {
        let result = await HTTP.get(`/api/asistencia/tipo-asistencia`)
        return result
	}

	async getTiposSalidas() {
        let result = await HTTP.get(`/api/asistencia/tipo-salida`)
        return result
	}

	async pdf(data) {
        let result = await HTTP.post(`/api/asistencia/pdf`, { data })
        return result
    }

    async update(data, id) {
        let result = await HTTP.put(`/api/asistencia/${id}`, data)
        return result.data
    }

    async destroy(id) {
        let result = await HTTP.delete(`/api/asistencia/${id}`)
        return result.data
    }

    async justify(data) {
        let result = await HTTP.post(`/api/asistencia/justify`, data)
        return result
    }

    async force(data) {
        let result = await HTTP.post(`/api/asistencia/force`, data)
        return result
    }


}