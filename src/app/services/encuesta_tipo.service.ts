import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class EncuestaTipoService {
	private server = environment.API_URL;
	private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
	constructor(private http: HttpClient) { }

	public getAll() {
		return this.http.get(`${this.server}/encuesta_pregunta`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public store(encuesta) {
		return this.http.post(`${this.server}/encuesta_pregunta`, encuesta, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public update(encuesta, id) {
		return this.http.put(`${this.server}/encuesta_pregunta/${id}`, encuesta, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}
}
