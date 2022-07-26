import { HTTP } from '../../../index'

export default class puntajeService{
    async getPuntaje(pieza) {
        console.log('getall tareas service')
        let result = await HTTP.post(`/api/mispuntajes`, pieza)
        return result.data
    }
    async updateNivel(nivel) {
        console.log('updateNivel tareas service')
        let result = await HTTP.put(`/api/niveles/`+ nivel.id, nivel)
        return result.data
    }
    async getPuntajeDate(date){
        console.log('updateNivel tareas service')
        let result = await HTTP.post(`/api/mispuntajesfecha`, date)
        return result.data
    }
    async get_prod_by_date(usuario_id, fecha_inicio, fecha_fin){
        console.log('updateNivel tareas service')
        let result = await HTTP.post(`/api/prod_by_dates`, { usuario_id, fecha_inicio, fecha_fin })
        return result.data
    }
}
