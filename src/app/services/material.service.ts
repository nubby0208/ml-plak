import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MaterialService {
	private server = environment.API_URL;
	private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
	constructor(private http: HttpClient) { }

	public getTipoMateriales() {
		return this.http.get(`${this.server}/materiales/tipo_materiales`, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>
) => res));
	}

	// /api/materiales/materials_for_type/P
	public getMaterialesPorTipo(caracter_tipo: string, textures: boolean = false) {
		const partUrl = (textures) ? '_textures' : '';

		return this.http.get(`${this.server}/materiales/materials_for_type${partUrl}/${caracter_tipo}`, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>
) => res));
	}

	public getAll() {
		return this.http.get(`${this.server}/materiales`, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>
) => res));
	}

	public store(material: any) {
		return this.http.post(`${this.server}/materiales`, material, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>
) => res));
	}

	public update(material: any) {
		let id = material.id;
		return this.http.put(`${this.server}/materiales/${id}`, material, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>
) => res));
	}

	public delete(id: number) {
		return this.http.delete(`${this.server}/materiales/${id}`, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>
) => res));
	}

	public showTextures(material_name: string) {
		return this.http.get(`${this.server}/materiales/${material_name}`, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>
) => res));
	}

	public getAllRaw() {
		return this.http.get(`${this.server}/materiales/raw`, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>
) => res));
	}

	public getTexture(id: number) {
		return this.http.get(`${this.server}/materiales/${id}/textura`, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>
) => res));
	}
}
