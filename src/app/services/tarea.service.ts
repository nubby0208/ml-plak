import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class TareaService {
    private server = environment.API_URL;
    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    constructor(private http: HttpClient) { }

    public getAll() {
        return this.http.get(`${this.server}/tareas`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
    }

    public store(tarea: any) {
        return this.http.post(`${this.server}/tareas`, tarea, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
    }

    public update(id: number, tarea: any) {
        return this.http.put(`${this.server}/tareas/${id}`, tarea, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
    }

}
