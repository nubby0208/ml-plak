import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class UsuarioService {
	private server = environment.API_URL;
	private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

	constructor(private http: HttpClient) { }

	public getAll() {
		return this.http.get(`${this.server}/usuario`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public getById(id: number) {
		return this.http.get(`${this.server}/usuario/${id}`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}


	public store(usuario: any) {
		return this.http.post(`${this.server}/usuario`, usuario, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public update(usuario: any) {
		let id = usuario.id;
		return this.http.put(`${this.server}/usuario/${id}`, usuario, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public auth(usuario: any): any {
		return this.http.post(`${this.server}/usuario/auth`, usuario, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public checkAuth(): boolean {
		let user_session = JSON.parse(window.localStorage.getItem('user_session'));

		return (user_session && (user_session.hasOwnProperty('token')) && (user_session.token.length > 0));
	}

	public getByGoogle(correo_google: string) {
		return this.http.post(`${this.server}/usuario/correo-google`, { correo_google }, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public getAllRoles(): any {
		return this.http.get(`${this.server}/rol`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public delete(id: number): any {
		return this.http.delete(`${this.server}/usuario/${id}`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}
}
