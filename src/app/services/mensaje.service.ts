import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { map, retryWhen, tap, delay, repeatWhen } from "rxjs/operators";
import { Observable } from 'rxjs/Rx';
import { LocalStorage } from '@ngx-pwa/local-storage';

import { sockets } from './../services/sockets.service';

const CHAT_URL = 'ws://localhost:7778';

export interface Message {
  type: string,
  message: string,
  data: any
}

@Injectable()
export class MensajeService {
  private server    = environment.API_URL;
  private socketUrl = environment.SOCKET_URL;
  private headers   = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  public messages: Subject<Message>;
  wsSubject: any;

  constructor(private http: HttpClient, private sockets:sockets) {
    let user = (localStorage.hasOwnProperty('usuario'))
      ? Object.assign({}, JSON.parse(localStorage.getItem('usuario')))
      : null;

    /* WEB SOCKET */
    /*
    this.messages = <Subject<Message>>sockets
    .connect(this.socketUrl)
    .map((response: MessageEvent): Message => {
      let data = JSON.parse(response.data);

      return {
        type: data.type || '',
        message: data.message || '',
        data: data.data || {}
      }
    });
    */
    
    this.wsSubject = <Subject<any>>new WebSocketSubject({
      url: environment.SOCKET_URL,
      openObserver: {
        next: (value) => {
          if (value.type === 'open' && user) {
            this.wsSubject.next({type: 'new_connection', message: '', data: user});
          }
        }
      }
     });
  }

  public send(data){
    this.sockets.send(data)
  }

  /* USUARIOS */
  public getusuariosAll() {
    return this.http.get(`${this.server}/usuario`, {headers: this.headers})
    .pipe(map((res: HttpResponse<any>) => res));
  }

  public usuariosOrderLasMessages() {
    return this.http.get(`${this.server}/usuario/order-last-messages`, {headers: this.headers})
    .pipe(map((res: HttpResponse<any>) => res));
  }

  /* CHAT MENSAJES */
  public listachatmensaje(chatmensajes:any) {
    return this.http.post(`${this.server}/chatmensajesl`,chatmensajes, {headers: this.headers})
    .pipe(map((res: HttpResponse<any>) => res));
  }

  public listachatmjcountmsj(data:any) {
    return this.http.post(`${this.server}/listachatmjcountmsj`, data, {headers: this.headers})
    .pipe(map((res: HttpResponse<any>) => res));
  }

  /* GRUPOS */
  public gettemasgrupo() {
    return this.http.get(`${this.server}/grupo`, {headers: this.headers})
    .pipe(map((res: HttpResponse<any>) => res));
  }

  public gruposOrderLasMessages(userId = null) {
    const data = {user_id: userId};

    return this.http.post(`${this.server}/grupo/order-last-messages`, data, {headers: this.headers})
    .pipe(map((res: HttpResponse<any>) => res));
  }

  // public creategrupo(grupo: any) {
  // 	return this.http.post(`${this.server}/grupo`,grupo, {headers: this.headers}).pipe(map((res: HttpResponse<any>) => res));
  // }

  /* GRUPOS MENSAJES */
  public listagrupomensaje(grupo_id: number) {
    if (grupo_id > 0) {
      return this.http.post(`${this.server}/grupo/listagrupomensaje/${grupo_id}`, {headers: this.headers})
      .pipe(map((res: HttpResponse<any>) => res));
    }
  }

  public creategrupomensaje(grupomensaje: any) {
    return this.http.post(`${this.server}/grupo/grupomensaje`,grupomensaje, {headers: this.headers})
    .pipe(map((res: HttpResponse<any>) => res));
  }

  /* TAREAS */
  public getlistatareas(userid: any) {
    if (userid > 0) {
      return this.http.post(`${this.server}/tarea/getlistatareas/${userid}`, {headers: this.headers})
      .pipe(map((res: HttpResponse<any>) => res));
    }
  }

  public agregartarea(data: any) {
    return this.http.post(`${this.server}/tarea/agregartarea`, data, {headers: this.headers})
    .pipe(map((res: HttpResponse<any>) => res));
  }

  public tarearealizada(tareaid: any) {
    return this.http.post(`${this.server}/tarea/tarearealizada/${tareaid}`, {headers: this.headers})
    .pipe(map((res: HttpResponse<any>) => res));
  }

  /* MENU CONTAR MENSAJES NO LEIDOS */
  public getmensajesnoleidos(userid: any) {
    return this.http.post(`${this.server}/getmensajesnoleidos/${userid}`, {headers: this.headers})
    .pipe(map((res: HttpResponse<any>) => res));
  }

  public getMessagesChatGrupo(data: any) {
    return this.http.post(`${this.server}/chat-grupo/messages`, data, {headers: this.headers})
    .pipe(map((res: HttpResponse<any>) => res));
  }
}
