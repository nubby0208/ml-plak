import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";
import { Maquina } from "../maquinas/maquina.model";
import { Observable } from "rxjs";

@Injectable()
export class MaquinaService {
    private server = environment.API_URL;

    constructor(private http: HttpClient) { }


    public getAll(): Observable<Maquina[]> {
        return this.http.get(`${this.server}/configuracion/tipo/Maquina/all`)
            .pipe(
                map((res: any) => {
                    if (res.error || !res.configuraciones) {
                        return [];
                    }
                    return res.configuraciones;
                }),
                map(maquinas => maquinas.map(m => {
                    const maquina = new Maquina(m.id);
                    const nombrePair = m.values.find(v => v.name === 'nombre')
                    const conexionPair = m.values.find(v => v.name === 'conexion')
                    const estadoPair = m.values.find(v => v.name === 'estado')
                    maquina.nombre = nombrePair && nombrePair.value;
                    maquina.conexion = conexionPair && conexionPair.value;
                    maquina.estado = estadoPair && estadoPair.value;
                    return maquina;
                }))
            )
    }

    public create(maquina: Maquina) {
        return this.http.post(`${this.server}/configuracion`, this.buildSaveObj(maquina));
    }

    public update(maquina: Maquina) {
        console.log('maquina', maquina)
        return this.http.put(`${this.server}/configuracion/${maquina.id}`, this.buildSaveObj(maquina));
    }

    public delete(id: number) {
        return this.http.delete(`${this.server}/configuracion/${id}`);
    }

    private buildSaveObj(maquina: Maquina) {
        const obj = {
            name: maquina.nombre,
            type: "Maquina",
            values: [
                { name: "nombre", value: maquina.nombre },
                { name: "estado", value: maquina.estado },
                { name: "conexion", value: maquina.conexion }
            ]
        };

        if (maquina.id) {
            obj['id'] = maquina.id
        }

        return obj;
    }
}