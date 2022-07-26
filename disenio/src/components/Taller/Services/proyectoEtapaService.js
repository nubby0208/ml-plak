import { HTTP } from '../../../index'

export default class proyectoEtapaService{
  async index() {
    let result = await HTTP.get(`/api/proyectos/etapas`);
    return result.data
  }

}
