<template>
  <div id="app-asistencia-list" class="page-contents">
    <div class="row form-group">
      <div class="col-md-3">
        <b-form-input v-model="searchParam" placeholder="Filtrar por usuario" type="text" debounce="500"
          @update="filterByName"></b-form-input>
      </div>
    </div>
    <div>
        <b-table
          id="logs"
          striped
          responsive
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :fields="fields"
          :items="logs"
          :busy="isBusy"
          style="background-color: white"
          no-local-sorting
          no-select-on-click
          @sort-changed="$nextTick(() => traerlogs())"
        >
            <template #table-busy>
                <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Buscando datos...</strong>
                </div>
            </template>
          <template #cell(usuario)="data">
            <b class="text-dark">{{ data.item.usuario }}</b>
          </template>

          <template #cell(action)="data">
             <div v-if="data.item.action=='login'">
                 <div style="width:20%;margin:auto;" class="text-center">
                     <b-alert variant="success" show>IN</b-alert>
                 </div>
             </div>
             <div v-else>
                 <div style="width:20%;margin:auto;" class="text-center">
                    <b-alert variant="danger" show>OUT</b-alert>
                </div>
             </div>
          </template>

          <template #cell(date)="data">
            <b class="text-dark">
                {{$moment(data.item.date).format("DD-MM-YYYY")}}
            </b>
          </template>

          <template #cell(hora)="data">
            <b class="text-dark">{{ data.item.time }}</b>
          </template>
        </b-table>
        <div style="display: flex">
          <b-pagination
            style="margin: auto; margin-top: 20px"
            v-model="currentPage"
            :total-rows="pageLimit"
            :per-page="1"
            aria-controls="presupuestos"
            @change="(page) => traerlogs(page)"
          ></b-pagination>
        </div>
      </div>
  </div>
</template>
<script>
    import usuarioService from "./../Services/usuarioService.js";

    const UsuarioServices = new usuarioService();
    export default {
        data(){
            return{
               sortBy: "date",
               sortDesc: true,
               currentPage:1,
               pageLimit:1,
               isBusy:false,
               searchParam: '',
               fields: [
                        { key: "user", label: "Usuario", sortable: true },
                        { key: "action", label: "Accion", sortable: true },
                        { key: "date", label: "Fecha", sortable: true },
                        { key: "time", label: "Hora", sortable: true },
                ],
                logs:[],

            }
        },
        mounted(){
            this.traerlogs()
        },
        methods:{
            async traerlogs(page = 1){
                this.logs = []
                this.isBusy = true
                let results = await UsuarioServices.getLogs(
                    page,
                    this.sortBy,
                    this.sortDesc,
                    this.searchParam
                )

                results.data.data.forEach((log) => {
                    let eachlog = {
                        'user': log.user,
                        'action': log.action,
                        'date':log.date,
                        'time':log.time
                    }
                    this.logs.push(eachlog)
                });
                this.pageLimit = results.data.last_page;
                this.isBusy = false
            },
            filterByName() {
                this.logs=[]
                console.log(this.searchParam)
                this.traerlogs();
            },
        },

    }
</script>
<style>
.alert{
    padding:0;
    margin-bottom: 0;
}
</style>
