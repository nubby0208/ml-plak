import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TapacantoService {
	private server  = environment.API_URL;
	private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
	constructor(private http: HttpClient) {}

	public update(tapacanto) {
		return this.http.put(`${this.server}/tapacantos/${tapacanto.id}`, tapacanto, {headers: this.headers})
		.pipe(map((res:HttpResponse<any>
) => res));
	}

}
