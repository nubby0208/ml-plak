import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';

const AUTH_HEADER_KEY = 'Authorization';
const AUTH_PREFIX = 'Bearer';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class Interceptor implements HttpInterceptor {
	public token: string;
	constructor(
		private _router: Router,
		private _authService: AuthService,
		private _toastr: ToastrService,
	) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
		req = req.clone({ headers: req.headers.set('Accept', 'application/json') });

		if (this._authService.isTokenExpired()) {
			window.localStorage.removeItem('usuario');
			window.localStorage.removeItem('jwt-token');
			this._toastr.error('¡No se ha logueado!');
			this._router.navigate(['/login']);
		}

		if (this._authService.getToken() != null)
			req = req.clone({ headers: req.headers.set(AUTH_HEADER_KEY, `${AUTH_PREFIX} ${this._authService.getToken()}`) });

		return next.handle(req).pipe(
			tap(event => {
				if (event instanceof HttpResponse) {
					if (event.status == 200) {
						if (event.body.success == 0) {
						}
					} else {
						if (event.status == 404) {
						}
					}
				}
			}, (err: any) => {
				if (err instanceof HttpErrorResponse) {
					if (err.status === 401) {
						sessionStorage.setItem("caducidad", "1");
						this._router.navigate(['auth/login']);
					}
				}
			}
			));
	}
}


export class AuthRequestOptions {

	headers: HttpHeaders;

	constructor() {
		// console.log('auth-request');
		this.update();
	}

	merge(options) {
		alert('a');
		let header = new HttpHeaders();
		const token = window.localStorage.getItem(environment.TOKEN_NAME);

		// header.append('Authorization', `Bearer ${token}`);
		header.append(AUTH_HEADER_KEY, `${AUTH_PREFIX} ${token}`);

		options.headers = header;
		var result = options;
		result.merge = this.merge;

		return result;
	}

	public update() {

		const token = window.localStorage.getItem(environment.TOKEN_NAME);

		if (token) {
			this.headers.append(AUTH_HEADER_KEY, `${AUTH_PREFIX} ${token}`);
		}
	}

}
