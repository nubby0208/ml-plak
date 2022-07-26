import { Presupuesto } from './../models';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class PresupuestoService {
  private server = environment.API_URL;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) { }

  public getAll() {
    return this.http.get(`${this.server}/presupuesto`, { headers: this.headers }).pipe(map((res: Presupuesto[]) => res));
  }

}
