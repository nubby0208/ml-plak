import { HTTP } from '../../../index'

export default class encuestaRespuestaService{

    async getAll(page = 1, search = "") {
        let result = await HTTP.get(`/api/encuesta_respuesta?page=` + page + "&search=" + search);
        return result.data
	}

    async store(encuesta) {
        let result = await HTTP.post(`/api/encuesta_respuesta`, encuesta);
        return result.data
    }

    async update(encuesta, id) {
        let result = await HTTP.put(`/api/encuesta_respuesta/${id}`, encuesta);
        return result.data
    }

}
