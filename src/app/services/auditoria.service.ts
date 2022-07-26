import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuditoriaService {
	private server = environment.API_URL;
	private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
	constructor(private http: HttpClient) { }

	public storeSheet(hoja_calculo: string, solapa: string, pieza: string, usuario_id: string, valor: string, valor_anterior: string) {
		return this.http.post(`${this.server}/auditoria/sheet/store`, { hoja_calculo, solapa, usuario_id, valor, pieza, valor_anterior }, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>
			) => res));
	}

	public getByUsuarioFecha(usuario_id: number, fecha_inicio: string, fecha_fin: string) {
		return this.http.post(`${this.server}/auditoria/usuario-fecha`, { usuario_id, fecha_inicio, fecha_fin }, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>
			) => res));
	}

	public getSheetByUsuarioFecha(usuario_id: number, fecha_inicio: string, fecha_fin: string) {
		return this.http.post(`${this.server}/auditoria/sheet/usuario-fecha`, { usuario_id, fecha_inicio, fecha_fin }, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>
			) => res.body.json));
	}
}
