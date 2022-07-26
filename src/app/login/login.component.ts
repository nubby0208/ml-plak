import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { NgForm, NgModel, DefaultValueAccessor, NgControl } from '@angular/forms';
import { _window, _$ } from 'app/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { JwtHelperService } from "@auth0/angular-jwt";
import { Location } from '@angular/common';
import { AuthRequestOptions } from './../auth-request'
import { NgxPermissionsService } from 'ngx-permissions';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../services/auth.service';
import { MensajeService } from './../services/mensaje.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	public form: any = {};

	constructor(private authService: AuthService, private toastr: ToastrService,
		private jwtHelper: JwtHelperService, private router: Router, private authRequest: AuthRequestOptions,
		private location: Location, private permissionService: NgxPermissionsService,
		private mensajeService: MensajeService) {}

	ngOnInit() {
		this.form = { user: '', password: '' };
	}

	public onSubmit(): void {
		let data = { username: this.form.user, password: this.form.password };

		if (data.username && data.password) {
			this.authService.login(data).subscribe((response: any) => {
				if (response.success && response.data.token) {

					// console.log(this.jwtHelper.decodeToken(response.data.token));
					this.authService.setToken(response.data.token);
					window.localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
					this.mensajeService.wsSubject.next({type: 'new_connection', message: '', data: response.data.usuario});

					this.permissionService.loadPermissions([response.data.usuario.rol]);
					console.log('perm', this.permissionService.getPermissions());
					// this.authRequest.update();

					// this.location.replaceState('/');
					this.toastr.success('¡Bienvenido!');
					if (response.data.yet_login_today) {
						this.router.navigate(['/']);
					} else {
						this.router.navigate(['/asistencia'], { queryParams: { goToTask: true } });
					}

				} else if (response.error) {
					this.toastr.error(response.error);
				}
			});
		} else {
			this.toastr.error('¡Los campos Usuario/Contraseña son obligatorios!');
		}
	}

	public onReset(): void {
		this.form.user = '';
		this.form.password = '';
	}
}
