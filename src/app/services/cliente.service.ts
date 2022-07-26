import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ClienteService {
	private server  = environment.API_URL;
	private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
	constructor(private http: HttpClient) {}

	public getAll() {
		return this.http.get(`${this.server}/clientes`, {headers: this.headers}).pipe(map((res: HttpResponse<any>) => res));
	}

	public getProyectos(cliente_id: number) {
		if (cliente_id > 0) {
			return this.http.get(`${this.server}/clientes/${cliente_id}/proyectos`, {headers: this.headers}).pipe(map((res: HttpResponse<any>) => res));
		}
	}

	public update(cliente: any) {
		let id = cliente.id;
		return this.http.put(`${this.server}/clientes/${id}`, cliente, {headers: this.headers}).pipe(map((res:HttpResponse<any>
) => res));
	}
}
