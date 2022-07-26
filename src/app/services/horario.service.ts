import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HorarioService {
	private server = environment.API_URL;
	private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
	constructor(private http: HttpClient) { }

	public getDefault() {
		return this.http.get(`${this.server}/horarios`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public updateDefault(horario: any) {
		return this.http.put(`${this.server}/horarios`, horario, { headers: this.headers }).pipe(map((res: HttpResponse<any>
		) => res));
	}

	public updateUser(horario: any) {
		let user_id = horario.user_id;
		return this.http.put(`${this.server}/horarios/${user_id}`, horario, { headers: this.headers }).pipe(map((res: HttpResponse<any>
		) => res));
	}

}
