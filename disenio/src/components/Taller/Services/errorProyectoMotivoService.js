import { HTTP } from '../../../index'

export default class errorProyectoMotivoService{
  async index() {
    let result = await HTTP.get(`/api/proyectos/error_motivos`);
    return result.data
  }

}
