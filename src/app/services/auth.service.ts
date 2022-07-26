import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";

const moment = require('moment');

@Injectable()
export class AuthService {
	private server = environment.API_URL;
	private token_name = environment.TOKEN_NAME;
	private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
	constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

	public login(data) {
		return this.http.post(`${this.server}/login`, data, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>) => res));
	}

	public getToken(): string {
		return localStorage.getItem(this.token_name);
	}

	public setToken(token: string): void {
		localStorage.setItem(this.token_name, token);
	}

	public getTokenExpirationDate(token: string): any {
		const decoded = this.jwtHelper.decodeToken(token);

		if (decoded.exp === undefined)
			return null;

		const date = new Date(0);
		date.setUTCSeconds(decoded.exp);

		return date;
	}

	public isTokenExpired(token?: string): boolean {
		if (!token)
			token = this.getToken();

		if (!token)
			return true;

		const date = this.getTokenExpirationDate(token);

		if (date === undefined)
			return false;

		return !(date.valueOf() > new Date().valueOf());
	}

	public logout(): any {
		return this.http.get(`${this.server}/logout`, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>
			) => res));
	}

	public getUsuario(): any {
		return JSON.parse(window.localStorage.getItem('usuario'));
	}

	public getRol(): any {
		return this.http.get(`${this.server}/auth/rol`, { headers: this.headers }).pipe(map((res: HttpResponse<any>
		) => res));
	}
}
