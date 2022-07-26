import { HTTP } from '../../../index'

export default class ProyectoActividadService {


  async created(data) { 
      let result = await HTTP.post(`/api/proyectoActividad/`, data)
      return result.data
  }

  /*

  async getList (page = 1, total = 1, search = '') {
    let result = await HTTP.get(`api/proyectoActividad/views?total=${total}&page=${page}&search=${search}`)
    return result.data
  }  

  async getOne(id) {
    let result = await HTTP.get(`/api/proyectoActividad/show/${id}`)
    return result.data
  }

  async getAll() {
    let result = await HTTP.get(`/api/proyectoActividad/`)
    return result.data
  }

  async getNotUsuario(usuario= 0, path='' ) {
    // let result = await HTTP.get(`/api/proyectoActividad/notUsuario/usuario/${usuario}/path/${path}`)
    let result = await HTTP.get(`/api/proyectoActividad/notUsuario?usuario=${usuario}&path=${path}`)
    return result.data
  }

  async update(id, data) {
      let result = await HTTP.put(`/api/proyectoActividad/${id}`,data)
      return result.data
  }

  async delete(id) {
    let result = await HTTP.delete(`/api/proyectoActividad/${id}`)
    return result
  }
  */

}
