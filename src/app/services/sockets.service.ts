import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import * as Rx from 'rxjs/Rx';
import { webSocket } from "rxjs/webSocket";

@Injectable()
export class sockets {
  private subject: Rx.Subject<MessageEvent>;

  constructor() { 
    //this.ws = new WebSocket('ws://localhost:7778');
  }

  // private ws: WebSocket;
  public connect(url): Rx.Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);

      console.log("Successfully connected: " + url);
    } 

    return this.subject;
  }

  private create(url): Rx.Subject<MessageEvent> {
    let ws = new WebSocket(url);
    const user = Object.assign({}, JSON.parse(localStorage.getItem('usuario')));

    let observable = Rx.Observable.create(
      (obs: Rx.Observer<MessageEvent>) => {
        ws.onopen = () => {
          ws.send(JSON.stringify({type: 'new_connection', message: '', data: user}));
        };
        ws.onmessage = obs.next.bind(obs);
        ws.onerror = obs.error.bind(obs);
        ws.onclose = obs.complete.bind(obs);
        return ws.close.bind(ws);
      }).share();

      let observer = {
        next: (data: Object) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
          }
        }
      }

      return Rx.Subject.create(observer, observable);
  }

  public send(data){
    //this.ws.send(JSON.stringify(data))
  }
}
