import { HTTP } from '../../../index'

export class PedidoService{
    prefix = 'pedidos'

    async getAll(params) {
        let result = await HTTP.get(`/api/${this.prefix}`, {
            params: params
        })
        return result.data
    }

    async getProducts(query) {
        let result = await HTTP.get(`/api/materiales/search`, {
            params: {
                query: query
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

    async deleteBulk(ids) {
        let result = await HTTP.post(`/api/${this.prefix}/deletebulk`, ids);
        return result.data
    }
}

export default new PedidoService()
