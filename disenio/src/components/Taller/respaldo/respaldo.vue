<template>
    <div id="app-respaldo-list" class="container-fluid">
        <div class="col-sm-12 col-sm-offset-1">
            <div class="col-sm-12 text-center py-3">
                <h2>
                    Listado de respaldos
                </h2>
                <hr>
            </div>

            <div id="respaldo-listado" class="col-sm-12 row">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Fecha</th>
                                <th>Base de datos</th>
                                <th>Documentos</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="(respaldos.length > 0)">
                                <tr v-for="(respaldo, i) in respaldos" :key="i">
                                    <td>{{ i+1 }}</td>
                                    <td>{{ respaldo.date }}</td>
                                    <td><span class="btn btn-sm btn-primary" @click="download(respaldo.urlDb)">Descargar</span></td>
                                    <td><span class="btn btn-sm btn-danger"  @click="download(respaldo.urlStorage)">Descargar</span></td>
                                </tr>
                            </template>

                            <template v-else>
                                <tr>
                                    <td class="text-center" colspan="4"><strong>No posee respaldos realizados</strong></td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
        
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import respaldoService from '../Services/respaldoService'

import {BACKEND_BASE_URL} from '../../../../config/dev-stage.env'


const RespaldoService = new respaldoService();

export default {
    data(){
        return{
            respaldos: [],
        }
    },
    async mounted(){
        let data = await RespaldoService.getAll()
        if(data){
            this.respaldos = data.respaldos
            for await (let item of this.respaldos){
                let urlDb = BACKEND_BASE_URL.replace(/"/g,'') +'api/respaldo/download/'+item.name+'/database'
                item.urlDb = urlDb
                let urlSt = BACKEND_BASE_URL.replace(/"/g,'')  +'api/respaldo/download/'+item.name+'/storage'
                item.urlStorage = urlSt
            }
        }
        console.log('data', this.respaldos)

    },
    methods:{
        async download(url){
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'ok')
            document.body.appendChild(link)
            link.click()
        }
    }
}
</script>

<style>

</style>