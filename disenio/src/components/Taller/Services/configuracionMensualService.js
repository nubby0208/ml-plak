import { HTTP } from '../../../index'

export class configuracionMensualService{
    prefix = 'configuracionmensual'

    async getAll() {
        let result = await HTTP.get(`/api/${this.prefix}`)
        return result.data
    }

    async get({usuario_id, mes, anio}) {
        let result = await HTTP.get(`/api/${this.prefix}`, {
            params: {
                usuario_id: usuario_id,
                mes: mes,
                anio: anio,
            }
          })
        return result.data
    }

    async getConfigAnt({usuario_id, mes, anio}) {
        let result = await HTTP.get(`/api/${this.prefix}/configanterior`, {
            params: {
                usuario_id: usuario_id,
                mes: mes,
                anio: anio,
            }
          })
        return result.data
    }

    async store(data) {
        let result = await HTTP.post(`/api/${this.prefix}/`, data)
        return result.data
    }

    async update(id, data) {
        let result = await HTTP.put(`/api/${this.prefix}/${id}`, data)
        return result.data
    }

    async updateStatus(id, data) {
        let result = await HTTP.put(`/api/${this.prefix}/updatestatus/${id}`, data)
        return result.data
    }
}

export default new configuracionMensualService()
