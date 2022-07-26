import { HTTP } from '../../../index'

export default class proyectoAreaService{
  async index() {
    let result = await HTTP.get(`/api/proyectos/areas`);
    return result.data
  }

}
