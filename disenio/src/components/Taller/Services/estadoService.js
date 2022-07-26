import { HTTP } from '../../../index'

export default class estadoService{

    async getAll() {
        let result = await HTTP.get(`/api/estados`)
        return result.data
	}
}