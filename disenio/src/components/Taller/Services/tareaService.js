import { HTTP } from '../../../index'

export default class tareaService{

    async getAll(user) {
        let result = await HTTP.get(`/api/tareas/`+user)
        return result.data

    }

    async store(tarea) {
        let result = await HTTP.post(`/api/tareas/`, tarea)
        return result.data
    }

    async update(id, tarea) {
        let result = await HTTP.put(`/api/tareas/${id}`, tarea)
        return result.data
    }

    async delete(id) {
      let result = await HTTP.delete(`/api/tareas/${id}`)
      return result
  }
}
