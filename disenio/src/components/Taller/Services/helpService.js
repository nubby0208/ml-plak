import { HTTP } from '../../../index'

export default class HelpService {

  async getList (page = 1, total = 1, search = '') {
    let result = await HTTP.get(`api/help/views?total=${total}&page=${page}&search=${search}`)
    return result.data
  }  

  async getOne(id) {
    let result = await HTTP.get(`/api/help/show/${id}`)
    return result.data
  }

  async getAll() {
    let result = await HTTP.get(`/api/help/`)
    return result.data
  }

  async getView() {
    let result = await HTTP.get(`/api/help/view`)
    return result.data
  }


  async getNotUsuario(usuario= 0, path='' ) {
    // let result = await HTTP.get(`/api/help/notUsuario/usuario/${usuario}/path/${path}`)
    let result = await HTTP.get(`/api/help/notUsuario?usuario=${usuario}&path=${path}`)
    return result.data
  }

  async store(data) {
      let result = await HTTP.post(`/api/help/`, data)
      return result.data
  }

  async update(id, data) {
      let result = await HTTP.put(`/api/help/${id}`,data)
      return result.data
  }

  async delete(id) {
    let result = await HTTP.delete(`/api/help/${id}`)
    return result
  }


}
