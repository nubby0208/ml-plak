import { HTTP } from '../../../index'

export default class horarioService{

    async getDefault() {
        let result = await HTTP.get(`/api/horarios`);
        return result.data
	}

	async updateDefault(horario) {
        let result = await HTTP.put(`/api/horarios`, horario);
        return result.data
    	}

    async updateUser(horario) {
        let user_id = horario.user_id;
        let result = await HTTP.put(`/api/horarios/${user_id}`, horario);
        return result.data
	}



}