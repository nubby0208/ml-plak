import { HTTP } from '../../../index'

export default class NotificationService {

  async getList (page = 1, total = 1, search = '') {
    let result = await HTTP.get(`api/notification/views?total=${total}&page=${page}&search=${search}`)
    return result.data
  }  

  async getOne(id) {
    let result = await HTTP.get(`/api/notification/show/${id}`)
    return result.data
  }

  async getAll() {
    let result = await HTTP.get(`/api/notification/`)
    return result.data
  }


  async getNotUsuario(usuario= 0, path='' ) {
    // let result = await HTTP.get(`/api/notification/notUsuario/usuario/${usuario}/path/${path}`)
    let result = await HTTP.get(`/api/notification/notUsuario?usuario=${usuario}&path=${path}`)
    return result.data
  }

  async store(data) {
      let result = await HTTP.post(`/api/notification/`, data)
      return result.data
  }

  async update(id, data) {
      let result = await HTTP.put(`/api/notification/${id}`,data)
      return result.data
  }

  async delete(id) {
    let result = await HTTP.delete(`/api/notification/${id}`)
    return result
  }


}
