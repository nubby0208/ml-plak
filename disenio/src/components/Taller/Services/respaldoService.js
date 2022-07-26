import { HTTP } from '../../../index'

export default class respaldoService{

    async getAll() {
        let result = await HTTP.get(`/api/respaldo`)
        return result.data
    }
}
