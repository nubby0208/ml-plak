import { HTTP } from '../../../index'

export default class materialService{
   
    async getMaterialesPorTipo(caracter_tipo, textures = false) {
        const partUrl = (textures) ? '_textures' : '';
        console.log('url',partUrl)
        let result = await HTTP.get(`/api/materiales/materials_for_type${partUrl}/${caracter_tipo}`)
        console.log('materials_for_type..........................>', result.data)
        return result.data
    }


	async getTipoMateriales() {
        let result = await HTTP.get(`/api/materiales/tipo_materiales`)
        return result.data
	}

	async getAll() {
        let result = await HTTP.get(`/api/materiales`)
        return result.data
	}

	async store(material) {
        let result = await HTTP.post(`/api/materiales`, material)
        return result.data
	}

	async update(material) {
		let id = material.id;
        let result = await HTTP.put(`/api/materiales/${id}`, material)
        return result.data
	}

	async delete(id) {
		let result = await HTTP.delete(`/api/materiales/${id}`)
        return result.data
	}

	async showTextures(material_name) {
		console.log(material_name)
        let result = await HTTP.get(`/api/materiales/${material_name}`)
        return result.data
	}

	async getAllRaw() {
		let result = await HTTP.get(`/api/materiales/raw`)
        return result.data
	}

	async getTexture(id,tipo_id) {
		let result = await HTTP.get(`/api/materiales/${id}/textura/${tipo_id}`)
		return result.data
	}

}
