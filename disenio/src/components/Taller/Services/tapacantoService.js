import { HTTP } from '../../../index'

export default class tapacantoService{
	
	async update(tapacanto) {
		console.log(tapacanto)
		let result = await HTTP.put(`/api/tapacantos/${tapacanto.id}`, tapacanto)
        return result.data		
	}
}