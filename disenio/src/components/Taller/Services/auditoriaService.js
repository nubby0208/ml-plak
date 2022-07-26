import { HTTP } from '../../../index'

export default class auditoriaService{

    async storeSheet(hoja_calculo, solapa, pieza, usuario_id, valor, valor_anterior) {
        let result = await HTTP.post(`${this.server}/auditoria/sheet/store`, { hoja_calculo, solapa, usuario_id, valor, pieza, valor_anterior })
        return result.data
    }

    async getByUsuarioFecha(form) {
        let result = await HTTP.post(`/api/auditoria/usuario-fecha`, form)
        return result.data
    }

    async getEstadisticaByUsuarioFecha(form) {
        let result = await HTTP.post(`/api/auditoria/estadistica-usuario-fecha`, form)
        return result.data
    }

    async getSheetByUsuarioFecha(usuario_id, fecha_inicio, fecha_fin) {
        let result = await HTTP.post(`/api/auditoria/sheet/usuario-fecha`, { usuario_id, fecha_inicio, fecha_fin })
        return result.data
    }
}