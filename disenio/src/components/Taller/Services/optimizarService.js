import { HTTP } from '../../../index'

export default class optimizarService{

    // async getByIdAll(proyecto_id) {
    //     console.log('proyectosService')
    //     let result = await HTTP.get(`/api/proyectos/${proyecto_id}/all`)
    //     return result.data.proyecto
    // }

   
  async optimizarServis(data) {
    console.log('proyectosService')
    let result = await HTTP.post(`/api/optimizacion/`, { 'data': data })
    return result.data
  }

  async getOptimizacion(project_name) {
    let result = await HTTP.get(`/api/${project_name}/optimizacion`)
    return result.data      
  }

  async download_pdf(project_name) {
    return await HTTP.get(`/api/${project_name}/download_pdf`,{
        responseType: 'blob'
    }).then(res =>{
        return {
            filename: project_name + '.pdf',
            data: res
          };  
    }).then(res =>{
            console.log('start download:', res);
            var url = window.URL.createObjectURL(res.data);
            var a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = res.filename;
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove(); // remove the element
          }, error => {
            console.log('download error:', JSON.stringify(error));
          }, () => {
            console.log('Completed file download.')
          });
    }  
   
}

