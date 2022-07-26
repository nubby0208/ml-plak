import { HTTP } from '../../../index'

export default class controlErroresProyectoService{
  async show(id) {
    let result = await HTTP.get(`/api/controlerrores/proyecto/${id}`);
    return result.data
  }

  async store(data) {
    let result = await HTTP.post(`/api/controlerrores/proyecto`, data);
    return result.data
  }

  async update(data) {
    let id = data.id;
    let result = await HTTP.put(`/api/controlerrores/proyecto/${id}`, data);
    return result.data
  }

  async delete(data) {
    let id = data.id;
    let result = await HTTP.delete(`/api/controlerrores/proyecto/${id}`);
    return result.data
  }

  async getControlErrorByArea(data) {
    let result = await HTTP.post(`/api/controlerrores/proyecto/get-control-by-area`, data);
    return result.data
  }
  
  async listControlErrorByPieza(data) {
    let result = await HTTP.post(`/api/controlerrores/proyecto/list-control-by-pieza`, data);
    return result.data
  }

  async listControlErrorByNota(data) {
    let result = await HTTP.post(`/api/controlerrores/proyecto/list-control-by-nota`, data);
    return result.data
  }

  async listControlErrorByModulo(data) {
    let result = await HTTP.post(`/api/controlerrores/proyecto/list-control-by-modulo`, data);
    return result.data
  }
}
