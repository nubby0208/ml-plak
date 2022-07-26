import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PiezaService {
	private server = environment.API_URL;
	private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
	constructor(private http: HttpClient) { }

	public create(data) {
		return this.http.post(`${this.server}/piezas_admin`, data, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>) => res));
	}

	public update(pieza) {
		return this.http.put(`${this.server}/piezas/${pieza.id}`, pieza, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>) => res));
	}

	public delete(pieza_id) {
		return this.http.delete(`${this.server}/piezas_admin/${pieza_id}`, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>) => res));
	}

}
