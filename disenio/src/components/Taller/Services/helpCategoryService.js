import { HTTP } from '../../../index'

export default class HelpCategoryService {

  async getList (page = 1, total = 1, search = '') {
    let result = await HTTP.get(`api/helpCategory/views?total=${total}&page=${page}&search=${search}`)
    return result.data
  }  

  async getOne(id) {
    let result = await HTTP.get(`/api/helpCategory/show/${id}`)
    return result.data
  }

  async getAll() {
    let result = await HTTP.get(`/api/helpCategory/`)
    return result.data
  }


  async store(data) {
      let result = await HTTP.post(`/api/helpCategory/`, data)
      return result.data
  }

  async update(id, data) {
      let result = await HTTP.put(`/api/helpCategory/${id}`,data)
      return result.data
  }

  async delete(id) {
    let result = await HTTP.delete(`/api/helpCategory/${id}`)
    return result
  }


}
