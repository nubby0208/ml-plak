import { HTTP } from '../../../index'

export class PagoService{
    prefix = 'pagos'

    async getAll() {
        let result = await HTTP.get(`/api/${this.prefix}`)
        return result.data
    }

    async get(params) {
        let result = await HTTP.get(`/api/${this.prefix}`, {
            params: params
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
}

export default new PagoService()
