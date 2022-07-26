import { environment } from './../environments/environment';
import { Component } from '@angular/core';
import { Injectable, ViewChild, EventEmitter, Output, NgZone } from "@angular/core";
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { map, retryWhen, tap, delay, retry, repeatWhen } from "rxjs/operators";

import { MensajeService } from './services/mensaje.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	public usuario;
	public coundmensaje
	public scoundmensaje
	public datacount = []
	public privados = []
	public publicos = []
	public iduseractual: any = 0
	private mensajessus: any;
  public countmennovistos: number = 0
  public countmenchat: number = 0;
  public countmengruo: number = 0;

	constructor(private authService: AuthService, private router: Router,
		private toastr: ToastrService, private location: Location, private zone: NgZone,
		private permissionService: NgxPermissionsService, private mensajeService: MensajeService) {

    let userid = Object.assign({}, JSON.parse(localStorage.getItem('usuario')));
    this.iduseractual = userid.id;

    // this.mensajessus = this.mensajeService.messages.subscribe(message => {
      this.mensajeService.wsSubject
      .pipe(retryWhen(errors => {
          delay(1000);
          return errors;
      }))
      .pipe(repeatWhen(complete => {
          delay(1000);
          return complete;
      }))
      .subscribe(
        message => {
          if (!this.iduseractual) {
            const user = Object.assign({}, JSON.parse(localStorage.getItem('usuario')));
            this.iduseractual = user.id;
          }

          const resp_message = {...message};
          console.log('respuesta app.component', resp_message);

          switch (resp_message.type) {
            case "resp_new_connection":
              if (!resp_message.data.saved) {
                this.mensajeService.wsSubject.next({type: 'new_connection', message: '', data: userid});
              } else {
                console.log(resp_message.data);
                this.countmenchat = resp_message.data.mensajes_no_leidos.mensajes_chat;
                this.countmengruo = resp_message.data.mensajes_no_leidos.mensajes_grupo;
                this.countmennovistos = this.countmenchat + this.countmengruo;
              }
              break;
            case "resp_chatmen_mensajenuevo":
              if (resp_message.data.to == this.iduseractual) {
                this.countmenchat = resp_message.data.mensajes_no_leidos.mensajes_chat;
                this.countmengruo = resp_message.data.mensajes_no_leidos.mensajes_grupo;
                this.countmennovistos = this.countmenchat + this.countmengruo;
              }
              break;
            case "resp_marcarvisto_mensajechat":
              if (resp_message.data.from == this.iduseractual) {
                this.countmenchat = resp_message.data.mensajes_no_leidos.mensajes_chat;
                this.countmengruo = resp_message.data.mensajes_no_leidos.mensajes_grupo;
                this.countmennovistos = this.countmenchat + this.countmengruo;
              }
              break;
            case "resp_activogrupo_user":
              if (resp_message.data.activo.user_id == this.iduseractual) {
                this.countmenchat = resp_message.data.mensajes_no_leidos.mensajes_chat;
                this.countmengruo = resp_message.data.mensajes_no_leidos.mensajes_grupo;
                this.countmennovistos = this.countmenchat + this.countmengruo;
              }
              break;
            case "resp_grumen_mensajenuevo":
              if (resp_message.data.from != this.iduseractual) {
                this.countmengruo++;
                this.countmennovistos = this.countmenchat + this.countmengruo;
              }
              break;
            case "resp_chat_grupo_mensaje":
              if (resp_message.message.usuario_id != this.iduseractual) {
                this.countmenchat++;
                this.countmennovistos = this.countmenchat + this.countmengruo;
              }
              break;
            case "resp_chat_grupo_activo":
              if (resp_message.data.from == this.iduseractual) {
                this.countmenchat = resp_message.data.mensajes_no_leidos.mensajes_chat;
                this.countmengruo = resp_message.data.mensajes_no_leidos.mensajes_grupo;
                this.countmennovistos = this.countmenchat + this.countmengruo;
              }
              break;
            default:
              break;
          }
      },
      (error) => {
        console.log(error);
      },
      () => { console.log('complete'); },
    );
	}

	ngOnInit() {
		this.usuario = { usuario: '', nombre_completo: '' };

		this.zone.run(() => {
			if (this.logged()) {
				this.authService.getRol().subscribe(data => {
					this.permissionService.loadPermissions([data.rol]);
				});
			}
		});
	}

	generamensaje() {

		if (this.iduseractual != undefined) {
			this.mensajeService.getmensajesnoleidos(this.iduseractual).subscribe((data: any) => {
				if (data != undefined) {
					this.countmenchat = data.listachatmensajes
					this.countmengruo = data.listagruposmensajes
					this.countmennovistos = data.listachatmensajes + data.listagruposmensajes
				}
			});
		}
	}

	public onLogout(): void {
		this.authService.logout().subscribe(response => {
			if (response.success) {
				window.localStorage.removeItem(environment.TOKEN_NAME);
				window.localStorage.removeItem('usuario');
				this.permissionService.flushPermissions();
				this.toastr.success('¡Ha cerrado sesión con éxito!');
				this.location.replaceState('/');
				this.router.navigate(['/login']);
			}
		});
	}

	public logged(): boolean {
		return (!this.authService.isTokenExpired());
	}
}
