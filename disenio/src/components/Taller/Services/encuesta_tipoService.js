import { HTTP } from '../../../index'

export default class encuesta_tipoService{

    async getAll() {
        let result = await HTTP.get(`/api/encuesta_pregunta`);
        return result.data
    }
       
    async update(encuesta, id) {
        let result = await HTTP.put(`/api/encuesta_pregunta/${id}`, encuesta);
        return result.data
	}


	async store(encuesta) {
        let result = await HTTP.post(`/api/encuesta_pregunta`, encuesta);
        return result.data
	}


}
