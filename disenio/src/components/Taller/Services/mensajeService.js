import { HTTP } from '../../../index'

export default class mensajeService{

    messages= '';
    wsSubject= ''

    // public send(data){
    //     this.sockets.send(data)
    //   }
    
    /* USUARIOS */
    async getusuariosAll() {
    let result = await HTTP.get(`/api/usuario`)
    return result.data
    }

    async usuariosOrderLasMessages() {
    let result = await HTTP.get(`/api/usuario/order-last-messages`)
    return result.data
    }

    /* CHAT MENSAJES */
    async listachatmensaje(chatmensajes) {
    let result = await HTTP.post(`/api/chatmensajesl`,chatmensajes)
    return result.data
    }

    async listachatmjcountmsj(data) {
    let result = await HTTP.post(`/api/listachatmjcountmsj`, data)
    return result.data
    }

    /* GRUPOS */
    async gettemasgrupo() {
    let result = await HTTP.get(`/api/grupo`)
    return result.data
    }

    async gruposOrderLasMessages(userId) {
    const data = {user_id: userId};
    let result = await HTTP.post(`/api/grupo/order-last-messages`, data)
    return result.data
    }

    // public creategrupo(grupo: any) {
    // 	return this.http.post(`${this.server}/grupo`,grupo, {headers: this.headers}).pipe(map((res: HttpResponse<any>) => res));
    // }

    /* GRUPOS MENSAJES */
    async listagrupomensaje(grupo_id) {
    if (grupo_id > 0) {
        let result = await HTTP.post(`/api/grupo/listagrupomensaje/${grupo_id}`)
        return result.data
    }
    }

    async creategrupomensaje(grupomensaje) {
    let result = await HTTP.post(`/api/grupo/grupomensaje`,grupomensaje)
    return result.data
    }

    /* TAREAS */
    async getlistatareas(userid) {
    if (userid > 0) {
        let result = await HTTP.post(`/api/tarea/getlistatareas/${userid}`)
        return result.data
    }
    }

    async agregartarea(data) {
    let result = await HTTP.post(`/api/tarea/agregartarea`, data)
    return result.data
    }

    async tarearealizada(tareaid) {
    let result = await HTTP.post(`/api/tarea/tarearealizada/${tareaid}`)
    return result.data
    }

    /* MENU CONTAR MENSAJES NO LEIDOS */
    async getmensajesnoleidos(userid) {
    let result = await HTTP.post(`/api/getmensajesnoleidos/${userid}`)
    return result.data
    }

    async getMessagesChatGrupo(data) {
    let result = await HTTP.post(`/api/chat-grupo/messages`, data)
    return result.data
    }

}