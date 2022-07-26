import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class GrupoService {
	private server = environment.API_URL;
	private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

	constructor(private http: HttpClient) { }

	public getAll() {
		return this.http.get(`${this.server}/grupos`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public getById(id: number) {
		return this.http.get(`${this.server}/grupos/${id}`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public store(grupo: any) {
		return this.http.post(`${this.server}/grupos`, grupo, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public update(id, grupo: any) {
		return this.http.put(`${this.server}/grupos/${id}`, grupo, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}
}
