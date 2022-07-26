import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AsistenciaService {
	private server = environment.API_URL;
	private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
	constructor(private http: HttpClient) { }


	public store(data) {
		return this.http.post(`${this.server}/asistencia/store`, data, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>) => res));
	}

	public checkToday(usuario) {
		return this.http.post(`${this.server}/asistencia/checks-today`, { usuario }, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>) => res));
	}

	public getCauses() {
		return this.http.get(`${this.server}/asistencia/causes`)
			.pipe(map((res: HttpResponse<any>) => res));
	}

	public checkTime(data) {
		return this.http.post(`${this.server}/asistencia/check-time`, data, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>) => res));
	}

	public getAll() {
		return this.http.get(`${this.server}/asistencia`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public getByUsuarioId(usuario_id) {
		return this.http.get(`${this.server}/asistencia/usuario_id/${usuario_id}`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public getByUsuarioFecha(usuario_id: number, fecha_inicio: string, fecha_fin: string) {
		return this.http.post(`${this.server}/asistencia/usuario-fecha`, { usuario_id, fecha_inicio, fecha_fin }, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>) => res));
	}

	public getTiposAsistencias() {
		return this.http.get(`${this.server}/asistencia/tipo-asistencia`, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>) => res));
	}

	public getTiposSalidas() {
		return this.http.get(`${this.server}/asistencia/tipo-salida`, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>) => res));
	}

	public pdf(data) {
		return this.http.post(`${this.server}/asistencia/pdf`, { data }, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>) => res));
	}
}
