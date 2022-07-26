import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MapOperator } from 'rxjs/internal/operators/map';

@Injectable()
export class ProyectoService {
	private server = environment.API_URL;
	private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
	private proyectosMeta = {};

	constructor(private http: HttpClient) { }

	public getAll() {
		return this.http.get(`${this.server}/proyectos`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public getByIdAll(proyecto_id: number) {
		if (proyecto_id > 0) {
			return this.http.get(`${this.server}/proyectos/${proyecto_id}/all`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
		}
	}

	public getImagesProject(proyecto_cliente: string) {
		if (proyecto_cliente) {
			return this.http.get(`${this.server}/v2/images/${proyecto_cliente}`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
		}
	}

	public update(proyecto: any) {
		let id = proyecto.id;
		this.proyectosMeta[id] = null;
		return this.http.put(`${this.server}/proyectos/only/${id}`, proyecto, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public setResponsible(proyecto: any, user: any) {
		let id = proyecto.id;
		let usuario = user.id;
		let data = { 'usuario': usuario, 'proyecto': id }
		return this.http.post(`${this.server}/proyectos/responsible/`, data, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public deleteResponsible(proyecto_id: number) {
		if (proyecto_id > 0) {
			return this.http.delete(`${this.server}/proyectos/responsible/${proyecto_id}`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
		}
	}


	public allProjects() {
		return this.http.get(`${this.server}/proyectos/allProyects`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public getById(proyecto_id: number) {
		if (proyecto_id > 0) {
			return this.http.get(`${this.server}/proyectos/${proyecto_id}`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
		}
	}

	public getCalcosMetadata(proyecto_id: number) {
		if (proyecto_id > 0) {
			return this.http.get(`${this.server}/proyectos/${proyecto_id}/calcos`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
		}
	}

	public delete(proyecto_id: number) {
		if (proyecto_id > 0) {
			return this.http.delete(`${this.server}/proyectos/${proyecto_id}`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
		}
	}

	public getProyectoMetadata(proyecto_id) {
		if (proyecto_id > 0) {
			return this.http.get(`${this.server}/projectMetadata/${proyecto_id}`, { headers: this.headers }).pipe(
				tap(r => { this.proyectosMeta[proyecto_id] = r; }),
				map((res: HttpResponse<any>) => res)
			);
		}
	}

	public metadataMaterialUpdate(metadata_material: any) {
		const id = metadata_material.id;
		return this.http.put(`${this.server}/metadata/material/${id}`, metadata_material, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public getCajaMetadata(proyecto_id: number) {
		if (this.proyectosMeta[proyecto_id]) {
			return of(this.getCajaFromProyectoMeta(this.proyectosMeta[proyecto_id].metadata));
		}

		return this.getProyectoMetadata(proyecto_id)
			.pipe(
				tap(r => { this.proyectosMeta[proyecto_id] = r; }),
				map(r => this.getCajaFromProyectoMeta(r['metadata']))
			);
	}

	private getCajaFromProyectoMeta(metadata) {
		const caja = metadata.find(m => m.key === 'caja');
		if (caja) {
			return caja.value;
		}
	}
}
