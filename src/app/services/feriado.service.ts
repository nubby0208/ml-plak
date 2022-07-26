import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class FeriadoService {
	private server = environment.API_URL;
	private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
	constructor(private http: HttpClient) { }

	public getAll() {
		return this.http.get(`${this.server}/feriados`, { headers: this.headers }).pipe(map((res: HttpResponse<any>
		) => res));
	}

	public update(feriado: any) {
		let id = feriado.id;
		return this.http.put(`${this.server}/feriados/${id}`, feriado, { headers: this.headers }).pipe(map((res: HttpResponse<any>
		) => res));
	}

	public store(feriado: any) {
		return this.http.post(`${this.server}/feriados`, feriado, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>
			) => res));
	}

	public delete(feriado: any) {
		let id = feriado.id;
		return this.http.delete(`${this.server}/feriados/${id}`, { headers: this.headers }).pipe(map((res: HttpResponse<any>
		) => res));
	}

}
