import { HTTP } from '../../../index'

export default class maquinaService{

    // async getAll() {
    //     console.log('getall grupo service')
    //     let result = await HTTP.get(`/api/grupos`)
    //     return result.data
    
    // }


    async getAll(){
        let result =  await HTTP.get(`/api/configuracion/tipo/Maquina/all`)
        if (result){
            let res 
            if (result.error || !result.data.configuraciones) {
                res = []
            }
            else{
                res = result.data.configuraciones;
            }
            let maquinas = res.map((m) => { 
                let maquina = m
                let nombre = m.values.find(v=>v.name==='nombre')
                nombre ? maquina.nombre = nombre.value : maquina.nombre = null
                let estado = m.values.find(v=>v.name==='estado')
                let conexion = m.values.find(v=>v.name==='conexion')
                estado ? maquina.estado = estado.value : maquina.estado = null
                conexion ? maquina.conexion = conexion.value : maquina.conexion = null
                delete(maquina.name)
                delete(maquina.values)
                delete(maquina.type)
                return maquina
            })
            return maquinas
        }
    }

    async create(maquina) {
        let data = await this.buildSaveObj(maquina)
        let result = await HTTP.post(`/api/configuracion`, data);
        return result.data
    }

    async update(maquina) {
        let data= await this.buildSaveObj(maquina)
        let result = await HTTP.put(`/api/configuracion/${maquina.id}`, data);
        return result.data
    }

    async delete(id) {
        let result = await HTTP.delete(`/api/configuracion/${id}`);
        return result.data
    }

    async buildSaveObj(maquina) {
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