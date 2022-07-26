import { HTTP } from '../../../index'

export class RecibpService{
    prefix = 'recibos'

    async getAll() {
        let result = await HTTP.get(`/api/${this.prefix}`)
        return result.data
    }

    async get(usuario_id, anio,  mes) {
        let result = await HTTP.post(`/api/${this.prefix}/get_by_usuario_fecha`, {
            usuario_id, anio, mes })
        return result.data
    }

    async save(data) {
        if(data.recibo_id) {
            return await this.update(data.recibo_id, data)
        }
        return await this.store(data)
    }

    async store(data) {
        let result = await HTTP.post(`/api/${this.prefix}/`, data)
        return result.data
    }

    async update(id, data) {
        let result = await HTTP.put(`/api/${this.prefix}/${id}`, data)
        return result.data
    }
}

export default new RecibpService()
