import { HTTP } from '../../../index'

export default class usuarioService {
  async getAll (activo = null) {
    console.log('getall usuarios service')
    let result = await HTTP.get(`/api/usuario${activo ? '?activo=' + activo : ''}`)
    return result.data
  }
  async getOnlyAfip () {
    console.log('getOnlyAfip usuarios service')
    let result = await HTTP.get(`/api/usuario/listAfipUsers`)
    return result.data
  }
  async getActiveUsers () {
    console.log('getActive usuarios service')
    let result = await HTTP.get(`/api/usuario/listActiveUsers`)
    return result.data
  }
  async getVisibleUsers () {
    console.log('getVisible usuarios service')
    let result = await HTTP.get(`/api/usuario/listVisibleUsers`)
    return result.data
  }
  async getVisibleHorarioUsers () {
    console.log('getVisible usuarios service')
    let result = await HTTP.get(`/api/usuario/listVisibleHorarioUsers`)
    return result.data
  }
  async getById (id) {
    console.log('getById usurios service')
    let result = await HTTP.get(`/api/usuario/${id}`)
    return result.data
  }
  async store (usuario) {
    console.log('store usuario service')
    let result = await HTTP.post(`/api/usuario`, usuario)
    return result.data
  }
  async update (usuario) {
    let id = usuario.id
    console.log('update usuarios service')
    let result = await HTTP.put(`/api/usuario/${id}`, usuario)
    return result.data
  }
  async auth (usuario) {
    let id = usuario.id
    console.log('auth usuario service')
    let result = await HTTP.post(`/api/usuario/auth`, usuario)
    return result.data
  }
  checkAuth () {
    let user_session = JSON.parse(window.localStorage.getItem('user_session'))
    return (user_session && (user_session.hasOwnProperty('token')) && (user_session.token.length > 0))
  }
  async getByGoogle (correo_google) {
    let result = await HTTP.post(`/api/usuario/correo-google`, { correo_google })
    return result.data
  }
  async getAllRoles () {
    let result = await HTTP.get(`/api/rol`)
    return result.data
  }
  async delete (id) {
    let result = await HTTP.delete(`/api/usuario/${id}`)
    return result.data
  }
  async changeSueldoPermission (usuario) {
    let result = await HTTP.post(`/api/usuario/changePermission`, usuario)
    return result
  }
  async getPermiso (id) {
    let result = await HTTP.get(`/api/usuario/getPermiso/${id}`)
    return result
  }
  async getLogs (page = 1, sortBy = '', sortDesc = true, searchParam = '') {
    let result = await HTTP.get('/api/loginlogs?page=' + page +
                '&sortBy=' + sortBy +
                '&sortDesc=' + (sortDesc ? '1' : '0') +
                '&searchParam=' + searchParam
    )
    return result.data
  }
  async changeVisiblePlanilla (usuario) {
    let id = usuario.id
    let result = await HTTP.put(`/api/usuario/change-visible-planilla/${id}`, usuario)
    return result.data
  }
  async changeRangoUsuario (usuario) {
    let id = usuario.id
    let result = await HTTP.put(`/api/usuario/change-rango-usuario/${id}`, usuario)
    return result.data
  }

  async changeAfipUsuario (usuario) {
    let id = usuario.id
    let result = await HTTP.put(`/api/usuario/change-afip-usuario/${id}`, usuario)
    return result.data
  }

}
