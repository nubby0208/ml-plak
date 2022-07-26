import { HTTP } from '../../../index';
import {
    COORDENADAS_ABSOLUTAS,
    HERRAMIENTA_1,
    SELECCION_PLANO_XY,
    VALORES_EN_MILIMETROS,
    SENTIDO_HORARIO,
    VELOCIDAD_DE_GIRO,
    AVANCE_LINEAL_ALTA_VELOCIDAD,
    AVANCE_LINEAL_VELOCIDAD_PERFORACION,
    APAGO_HUSILLO,
    FINALIZAR_PROGRAMA
} from '../../../g-code-constants';


export default class CodigoGService {
    conexiones = [];
    lado = 1 // 1 contacto, 2 opuesto
    ancho = 0 // 1 contacto, 2 opuesto

    estrategias = {
        Perforado: (caraConexion, conexion) => this._estrategiaPerforado(caraConexion, conexion),
        Dibujo: (caraConexion, conexion) => this._estrategiaDibujo(caraConexion, conexion),
        Calado: (caraConexion, conexion) => this._estrategiaCalado(caraConexion, conexion),
        Rebaje: (caraConexion, conexion) => this._estrategiaRebaje(caraConexion, conexion)
    }

    async getGCode(caraPieza, ancho, value = 1) {
        if (caraPieza.length === 0) {
            return '';
        }
        this.lado = value
        this.ancho = ancho

        const conexiones = await this.getConexiones();

        let GCode = `
        ${HERRAMIENTA_1}
        ${SELECCION_PLANO_XY}
        ${VALORES_EN_MILIMETROS}
        ${COORDENADAS_ABSOLUTAS}
        ${AVANCE_LINEAL_ALTA_VELOCIDAD}Z20.000
        ${AVANCE_LINEAL_ALTA_VELOCIDAD}X0.000Y0.000
        ${VELOCIDAD_DE_GIRO}12000${SENTIDO_HORARIO}
        ${AVANCE_LINEAL_ALTA_VELOCIDAD}
        `;

        // cara pieza es la cara anterior o cara posterior de una calco
        caraPieza.forEach(conexion => {
            // conexion es cada uno de los renglones de conexion de la calco

            // tipo conexion es "2 Tornillos", "PITUTO", etc
            const tipoConexion = conexiones.find(c => c.nombre === conexion.tipo);
            if (!tipoConexion) {
                return '';
            }

            // subtipo es "LE", "TO", etc
            const caraConexion = tipoConexion.anterior && tipoConexion.anterior.tipo === conexion.subtipo ? tipoConexion.anterior : tipoConexion.posterior;
            GCode += this.estrategias[caraConexion.tipoEstrategia](caraConexion, conexion) + '\n';
        });

        GCode +=
            `
        ${APAGO_HUSILLO}
        G0Z20.000
        G0X0Y2500F15000
        M1S25
        G0X0.000Y0.000F15000
        ${FINALIZAR_PROGRAMA}
        `

        return GCode;
    }


    async getConexiones() {
        if (this.conexiones.length === 0) {
            const result = await HTTP.get(
                '/api/configuracion/tipo/ConexionesConfig/all'
            );

            const data = result.data
            const herramientas = {};
            if (!data.error && data.configuraciones) {
                data.configuraciones.forEach((config) => {
                    const object = this._buildFromJson(config.values);
                    object.id = config.id;
                    if (object.tipo === 'conexion') {
                        this.conexiones.push(JSON.parse(object.conexion));
                    }
                    if (object.tipo === 'herramienta') {
                        herramientas[object.nombre] = object;
                    }
                });

                this.conexiones.forEach(c => {
                    c.posterior.herramienta = herramientas[c.posterior.herramienta];
                    c.anterior.herramienta = herramientas[c.anterior.herramienta];
                });
            }
        }

        return this.conexiones;
    }

    _buildFromJson(values) {
        const obj = {};
        values.forEach((value) => {
            obj[value.name] = value.value;
        });
        return obj;
    }

    f_ir_a = (x, y, z=0, offsetX=0, extra=0, vel = 0) => {
        let newX = x + offsetX - extra
        if(this.lado == 1){
            newX = this.ancho - x + offsetX + extra
        }
        return `${AVANCE_LINEAL_ALTA_VELOCIDAD}X${newX}Y${y}${vel?'F'+vel:''}` + '\n'
    }

    _estrategiaPerforado(caraConexion, conexion) {
        console.log('**ESTRATEGIA PERFORADO**', conexion)
        const l_perforar = `${AVANCE_LINEAL_VELOCIDAD_PERFORACION}Z-${caraConexion.profPerforacion}F${caraConexion.herramienta.velBajada}`
        const l_subir_mecha = `${AVANCE_LINEAL_ALTA_VELOCIDAD}Z${caraConexion.herramienta.zonaSeguraZ}F${caraConexion.herramienta.velBajada}`;
        
        let GCode = ``;

        if (conexion.altura1 > 0) {
            if (conexion.prof1 > 0) {
                GCode += this.f_ir_a(conexion.prof1, conexion.altura1, caraConexion.herramienta.zonaSeguraZ, 0, 0, caraConexion.herramienta.velMovimiento);
                GCode += l_perforar + '\n';
                GCode += l_subir_mecha + '\n';
            }
            if (conexion.prof2 > 0) {
                GCode += this.f_ir_a(conexion.prof2, conexion.altura1, caraConexion.herramienta.zonaSeguraZ, 0, 0, caraConexion.herramienta.velMovimiento);
                GCode += l_perforar + '\n';
                GCode += l_subir_mecha + '\n';
            }
            if (conexion.prof3 > 0) {
                GCode += this.f_ir_a(conexion.prof3, conexion.altura1, caraConexion.herramienta.zonaSeguraZ, 0, 0, caraConexion.herramienta.velMovimiento);
                GCode += l_perforar + '\n';
                GCode += l_subir_mecha + '\n';
            }
        }

        if (conexion.altura2 > 0) {
            if (conexion.altura1 > 0) {
                GCode += '\n';
            }
            if (conexion.prof1 > 0) {
                GCode += this.f_ir_a(conexion.prof1, conexion.altura2, caraConexion.herramienta.zonaSeguraZ, 0, 0, caraConexion.herramienta.velMovimiento);
                GCode += l_perforar + '\n';
                GCode += l_subir_mecha + '\n';
            }
            if (conexion.prof2 > 0) {
                GCode += this.f_ir_a(conexion.prof2, conexion.altura2, caraConexion.herramienta.zonaSeguraZ, 0, 0, caraConexion.herramienta.velMovimiento);
                GCode += l_perforar + '\n';
                GCode += l_subir_mecha + '\n';
            }
            if (conexion.prof3 > 0) {
                GCode += this.f_ir_a(conexion.prof3, conexion.altura2, caraConexion.herramienta.zonaSeguraZ, 0, 0, caraConexion.herramienta.velMovimiento);
                GCode += l_perforar + '\n';
                GCode += l_subir_mecha + '\n';
            }
        }

        return GCode;
    }

    generateLineCode(conexion, prof, altura, encenderLaser, apagarLaser, offset = {x: 0, y:0}, extra=0, herramienta) {
        let GCode = ``;
        GCode += this.f_ir_a(conexion[prof], conexion[altura]+offset.y, 0, offset.x, 0, herramienta.velMovimiento); // vel de movimiento
        GCode += encenderLaser + '\n';
        GCode += this.f_ir_a(conexion[prof], conexion[altura]+offset.y, 0, offset.x, extra, herramienta.velAvance); // vel de avance
        GCode += apagarLaser + '\n';
        return GCode
    }

    _estrategiaDibujo(caraConexion, conexion) {
        console.log('**ESTRATEGIA DIBUJO**')
        console.log(caraConexion, conexion)
        const encenderLaser = (caraConexion.herramienta)?caraConexion.herramienta.velHusillo : 'M3 255'
        const extra = parseInt((caraConexion.herramienta)?caraConexion.herramienta.extra2:0)
        const apagarLaser = 'M5'
        const ajusteX = (caraConexion.herramienta)?caraConexion.herramienta.ajuste_x:100
        const ajusteY = (caraConexion.herramienta)?caraConexion.herramienta.ajuste_y:100
        const offset = {
            x: parseInt(ajusteX),
            y: parseInt(ajusteY)
        }

        let GCode = ``;

        if (conexion.altura1 > 0) {
            if (conexion.prof1 > 0) {
                GCode += this.generateLineCode(conexion, 'prof1', 'altura1', encenderLaser, apagarLaser, offset, extra, caraConexion.herramienta)
            }
            if (conexion.prof2 > 0) {
                GCode += this.generateLineCode(conexion, 'prof2', 'altura1', encenderLaser, apagarLaser, offset, extra, caraConexion.herramienta)
            }
            if (conexion.prof3 > 0) {
                GCode += this.generateLineCode(conexion, 'prof3', 'altura1', encenderLaser, apagarLaser, offset, extra, caraConexion.herramienta)
            }
        }

        if (conexion.altura2 > 0) {
            if (conexion.altura1 > 0) {
                GCode += '\n';
            }
            console.log(conexion, 'conexion.altura2')
            if (conexion.prof1 > 0) {
                GCode += this.generateLineCode(conexion, 'prof1', 'altura2', encenderLaser, apagarLaser, offset, extra, caraConexion.herramienta)
            }
            if (conexion.prof2 > 0) {
                GCode += this.generateLineCode(conexion, 'prof2', 'altura2', encenderLaser, apagarLaser, offset, extra, caraConexion.herramienta)
            }
            if (conexion.prof3 > 0) {
                GCode += this.generateLineCode(conexion, 'prof3', 'altura2', encenderLaser, apagarLaser, offset, extra, caraConexion.herramienta)
            }
            console.log(GCode)
        }
        return GCode;
    }

    _estrategiaCalado(conexion) {
        console.log('**ESTRATEGIA CALADO**')
        return '';
    }

    _estrategiaRebaje(conexion) {
        console.log('**ESTRATEGIA REBAJE**')
        return '';
    }
}