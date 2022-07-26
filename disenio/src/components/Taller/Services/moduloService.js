import { HTTP } from '../../../index'

export default class moduloService{
	
	async update(modulo) {
		console.log(modulo)
		let result = await HTTP.put(`/api/modulos/${modulo.id}`, modulo)
        return result.data		
	}

	async updateArmado(modulo) {
		console.log(modulo)
		let result = await HTTP.put(`/api/modulos/update-armado/${modulo.id}`, modulo)
        return result.data		
	}

	async getControlByProy(proyectoId) {
		let result = await HTTP.get(`/api/modulos/get-control-by-proy/${proyectoId}`)
        return result.data
	}
}
