import { HTTP } from '../../../index'

export default class ConexionesService {

    async get() {
        const conexiones = []
        const result = await HTTP.get(
            "/api/configuracion/tipo/ConexionesConfig/all"
        );

        const data = result.data
        if (!data.error && data.configuraciones) {
            data.configuraciones.forEach((config) => {
                const object = this.buildFromJson(config.values);
                object.id = config.id;
                if (object.tipo === "conexion") {
                    conexiones.push(JSON.parse(object.conexion));
                }
            });
        }



        return conexiones;
    }

    buildFromJson(values) {
        const obj = {};
        values.forEach((value) => {
            obj[value.name] = value.value;
        });
        return obj;
    }
}
