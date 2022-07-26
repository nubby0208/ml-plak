import { HTTP } from '../../../index'
import { pluck, map, tap } from 'rxjs/operators'
import { of } from 'rxjs';

export default class proyectoService{
    proyectosMeta = {};

    //revisar
    async metadataMaterialUpdate(metadata_material) {
        const id = metadata_material.id;
        let result = await HTTP.put(`/api/metadata/material/${id}`, metadata_material)
        console.log('metadatamaterialupdate--->', result)
        return result.data
    }

    //revisar
    async getCalcosMetadata(proyecto_id) {
        console.log('getCalcosMetadata')
        let result = await HTTP.get(`/api/proyectos/${proyecto_id}/calcos`)
        return result.data
    }

    //revisar
    async getProyectoMetadata(proyecto_id) {
        if (proyecto_id > 0) {
            try{
                console.log('proyectosService')
                // return HTTP.get(`/api/projectMetadata/${proyecto_id}`).pipe(
                // 	tap(r => { this.proyectosMeta[proyecto_id] = r; }),
                // 	map((res) => res)
                // );
                console.log('proyecto_id', proyecto_id)
                let result = await HTTP.get(`/api/projectMetadata/${proyecto_id}`)
                console.log('restulado--->',result)
                this.proyectosMeta[proyecto_id] = result
                // return result.pipe( tap(r => { this.proyectosMeta[proyecto_id] = r; }),
                // map((res) => res))
               var data = result
                    
    
                return data
                
                // let result = await HTTP.get(`/api/projectMetadata/${proyecto_id}`)
                // return result.data
            }
            catch(error){
                console.log('error', error)
                return []
            }
        }
    }

    //revsar
    async getCajaMetadata(proyecto_id) {
        console.log(proyecto_id)
        console.log('aqui---->',this.proyectosMeta[proyecto_id])
        if (this.proyectosMeta[proyecto_id]) {
            console.log('entró... getcaja')
            //return getCajaFromProyectoMeta(this.proyectosMeta[proyecto_id].metadata);
            return of(this.getCajaFromProyectoMeta(this.proyectosMeta[proyecto_id].metadata));
        
        }

        //return this.getProyectoMetadata(proyecto_id)
        // .pipe(
        //     tap(r => { this.proyectosMeta[proyecto_id] = r; }),
        //     map(r => this.getCajaFromProyectoMeta(r['metadata']))
        // );

        function getCajaFromProyectoMeta(metadata) {
            console.log(106)
            console.log(metadata)
            const caja = metadata.find(m => m.key === 'caja');
            if (caja) {
                return caja.value;
            }
        }
    }


    GetAll() {
        console.log('GetAll')
        HTTP.post('/api/proyectos'
        ).then(result => {
            return result.data
            }).catch(result => {
                console.log(result)
                return result
        })			
    }

    async getByIdAllP(proyecto_id) {
        console.log('getByIdAllp')
        let result = await HTTP.get(`/api/proyectos/${proyecto_id}/all`)
        return result.data
    }

    async getByIdAll(proyecto_id) {
        console.log('getByIdAll')
        let result = await HTTP.get(`/api/proyectos/${proyecto_id}/all`)
        return result.data.proyecto
    }

    async update(proyecto) {
        let id = proyecto.id;
        let result = await HTTP.put(`/api/proyectos/only/${id}`, proyecto)
        return result.data
    }

    async getImagesProject(proyecto_cliente,folder) {
        if (proyecto_cliente) {
            let result = await HTTP.get(`/api/v2/images/${proyecto_cliente}/${folder}`)
            return result.data
        }
    }
   
    async getAllImagesProject(proyecto_cliente) {
        if (proyecto_cliente) {
            let result = await HTTP.get(`/api/v2/images/allFolder/${proyecto_cliente}`)
            return result.data
        }
    }

	async setResponsible(proyecto, user) {
		let id = proyecto.id;
		let usuario = user.id;
		let data = { 'usuario': usuario, 'proyecto': id }
        let result  = await HTTP.post(`/api/proyectos/responsible/`, data)
        return result.data
	}

	async deleteResponsible(proyecto_id) {
		if (proyecto_id > 0) {
            let result = await HTTP.delete(`/api/proyectos/responsible/${proyecto_id}`);
            return result.data
		}
	}


	async allProjects(page = 1, search = "") {
        let result = await HTTP.get(`/api/proyectos/allProyects?page=` + page + "&search=" + search);
        return result.data
	}

	async getById(proyecto_id) {
		if (proyecto_id > 0) {
            let result = await HTTP.get(`/api/proyectos/${proyecto_id}`);
            return result.data
		}
	}
	
	async delete(proyecto_id) {
        console.log('delete-->', proyecto_id)
		if (proyecto_id > 0) {
            let result = await HTTP.delete(`/api/proyectos/${proyecto_id}`);
            return result.data
		}
	}

    async desactivar(proyecto_id) {
        console.log('desactivar-->', proyecto_id)
		if (proyecto_id > 0) {
            let result = await HTTP.put(`/api/proyectos/desactivar/${proyecto_id}`)
            return result.data
        }   
    }
    
}