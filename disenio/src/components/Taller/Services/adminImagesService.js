import { HTTP } from '../../../index'

export default class adminImageService{

    async showAll() {
        let result = await HTTP.get(`/api/v2/images/all`)
        return result.data
    }
    
    async delete_image(filename) {
        let result = await HTTP.delete(`/api/v2/images/` + filename)
        return result.data
    }

    async delete_AllImages(project_folder) {
        let result = await HTTP.delete(`/api/v2/images/` + project_folder)
        return result.data
    }

    async getByToken(token) {
        let result = await HTTP.get(`/api/v2/images/${token}`)
        console.log('resultado getbytoken',result)
        return result.data
    }

    async deleteByProject(token) {
        let result = await HTTP.delete(`api/v2/images/proyecto/${token}`)
        return result.data
    }

    // async deleteOne(tokenProject, tokenImage) {
    //     let result = await HTTP.delete(`/api/v2/images/proyecto/${tokenProject}/${tokenImage}`)
    //     return result.data
    // }

    async deleteOne(tokenProject, tokenImage) {
        let result = await HTTP.post(`/api/v2/images/proyecto/${tokenProject}`, {
            tokenProject: tokenProject,
            filename: tokenImage
        })
        return result.data
    }

}