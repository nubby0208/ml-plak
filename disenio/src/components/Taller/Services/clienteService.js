import { HTTP } from '../../../index'

export default class clienteService{

    async getAll() {
        console.log('clienteService getAll')
        let result = await HTTP.get('/api/clientes')
        return result.data
    }
   
    async getAuditCliente(clientes) {
        console.log('clienteService getAuditCliente')
        let result = await HTTP.get(`/api/clientes/getAuditCliente/${clientes}`)
        return result.data
    }

    async update(cliente) {
		let id = cliente.id;
        let result =  await HTTP.put(`/api/clientes/${id}`, cliente)
        return result.data
    }

    // async getByIdAll(proyecto_id) {
    //     console.log('proyectosService')
    //     let result = await HTTP.get(`/api/clientes/${proyecto_id}/all`)
    //     return result.data.proyecto
    // }

}
