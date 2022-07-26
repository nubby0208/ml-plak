import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class PuntajeService {
	private server = environment.API_URL;
	private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
	constructor(private http: HttpClient) { }

	public getPuntaje(pieza) {
		return this.http.post(`${this.server}/mispuntajes`, pieza, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public updateNivel(nivel) {
		return this.http.put(`${this.server}/niveles/` + nivel.id, nivel, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}
	public getPuntajeDate(date) {
		return this.http.post(`${this.server}/mispuntajesfecha`, date, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public get_prod_by_date(usuario_id: number, fecha_inicio: string, fecha_fin: string) {
		return this.http.post(`${this.server}/prod_by_dates`, { usuario_id, fecha_inicio, fecha_fin }, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}
}
