import { HTTP } from '../../../index'

export default class feriadoService{

  async getAll() {
          let result = await HTTP.get(`/api/feriados`);
          return result.data
  }

  async getDate(inicio,fin) {
    let result = await HTTP.get(`/api/feriados/${inicio}/${fin}`);
    return result.data
}

	async update(feriado) {
                let id = feriado.id;
                let result = await HTTP.put(`/api/feriados/${id}`, feriado);
                return result.data
	}

	async store(feriado) {
                let result = await HTTP.post(`/api/feriados`, feriado)
		return result.data
	}

	async delete(feriado) {
		let id = feriado.id;
                let result = await HTTP.delete(`/api/feriados/${id}`);
                return result.data
	}
}
