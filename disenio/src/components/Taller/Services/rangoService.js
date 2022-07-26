import { HTTP } from '../../../index'

export default class feriadoService{

        async getAll() {
                let result = await HTTP.get(`/api/rangos`);
                return result.data
        }

	async update(rango) {
                let id = rango.id;
                let result = await HTTP.put(`/api/rangos/${id}`, rango);
                return result
	}

	async store(rango) {
                let result = await HTTP.post(`/api/rangos`, rango)
		return result
	}

	async delete(rango) {
		let id = rango.id;
                let result = await HTTP.delete(`/api/rangos/${id}`);
                return result
	}
}
