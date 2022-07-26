<template>
    <div id="app-tarea" class="container-fluid">
        <vue-toastr ref="toastr"></vue-toastr>
        <div class="col-sm-10 col-sm-offset-1">
            <div class="col-sm-12 text-center">
            <h3>Próximas Tareas</h3>
            </div>
            <div v-for="(item, myIndex) in resuHtml" :key="myIndex">
            <div :id="'proyecto-'+myIndex" :hidden="myIndex>0">
                <table>
                <tr>
                    <td><button :disabled="(myIndex == 0)" class='btn btn-default' @click='showpages(myIndex, myIndex-1);'>Anterior</button></td>
                    <td><button :disabled="myIndex == resuHtml.length - 1" class='btn btn-default' @click='showpages(myIndex, myIndex+1);'>Proximo</button></td>
                </tr>
                </table>
                <hr>
                <table v-if="resuHtml[myIndex].hasOwnProperty('cliente')">
                <tr>
                    <td colspan="2"><p><b>Proyecto: </b>{{resuHtml[myIndex].cliente.nombre_completo}} - {{resuHtml[myIndex].proyecto}}</p></td>
                </tr>
                <tr>
                    <td colspan="2"><p><b>Fecha Instalación: </b>{{resuHtml[myIndex].instalacion_fecha}}</p></td>
                </tr>
                </table>
                <table v-if="resuHtml[myIndex].hasOwnProperty('cliente')" style="width: 100%;">
                <tr style="height: 30px;" v-if="(resuHtml[myIndex].assignPiezasDate != resuHtml[myIndex].actualDate) && resuHtml[myIndex].porcejPiezas < 100">
                    <td><b>Piezas:</b><td :id="'pieza-'+myIndex"><button class='btn btn-default' @click='tomarPiezas(resuHtml[myIndex].id, myIndex);'>Tomar tarea</button></td>
                    <td class="progress-bar" :style="{'background-color': colorProgreso(resuHtml[myIndex].porcejPiezas), 'width': resuHtml[myIndex].porcejPiezas + '%', 'min-width': '2em', 'border-radius': '4px'}">{{resuHtml[myIndex].porcejPiezas.toFixed(2)}}%</td>
                </tr>
                <tr style="height: 30px;" v-if="resuHtml[myIndex].assignPiezas != null && resuHtml[myIndex].assignPiezasDate == resuHtml[myIndex].actualDate && resuHtml[myIndex].porcejPiezas < 100">
                    <td><b>Piezas:</b><td>Tarea tomada por: {{resuHtml[myIndex].assign_piezas? resuHtml[myIndex].assign_piezas.usuario : ''}}</td>
                    <td class="progress-bar" :style="{'background-color': colorProgreso(resuHtml[myIndex].porcejPiezas), 'width': resuHtml[myIndex].porcejPiezas + '%', 'min-width': '2em', 'border-radius': '4px'}">{{resuHtml[myIndex].porcejPiezas.toFixed(2)}}%</td>
                </tr>
                <tr style="height: 30px;" v-if="resuHtml[myIndex].porcejPiezas == 100">
                    <td><b>Piezas:</b><td>Finalizado</td>
                    <td class="progress-bar" :style="{'background-color': colorProgreso(resuHtml[myIndex].porcejPiezas), 'width': resuHtml[myIndex].porcejPiezas + '%', 'min-width': '2em', 'border-radius': '4px'}">{{resuHtml[myIndex].porcejPiezas.toFixed(2)}}%</td>
                </tr>

                <tr style="height: 30px;" v-if="(resuHtml[myIndex].assignTapacantosDate != resuHtml[myIndex].actualDate) && resuHtml[myIndex].porcejTapacantos < 100">
                    <td><b>Tapacantos:</b><td :id="'tapacanto-'+myIndex"><button class='btn btn-default' @click='tomarTapacantos(resuHtml[myIndex].id, myIndex);'>Tomar tarea</button></td>
                    <td class="progress-bar" :style="{'background-color': colorProgreso(resuHtml[myIndex].porcejTapacantos), 'width': resuHtml[myIndex].porcejTapacantos + '%', 'min-width': '2em', 'border-radius': '4px'}">{{resuHtml[myIndex].porcejTapacantos.toFixed(2)}}%</td>
                </tr>
                <tr style="height: 30px;" v-if="resuHtml[myIndex].assignTapacantos != null && resuHtml[myIndex].assignTapacantosDate == resuHtml[myIndex].actualDate && resuHtml[myIndex].porcejTapacantos < 100">
                    <td><b>Tapacantos:</b><td :id="'tapacanto-'+myIndex">Tarea tomada por: {{resuHtml[myIndex].assign_tapacantos? resuHtml[myIndex].assign_tapacantos.usuario : ''}}</td>
                    <td class="progress-bar" :style="{'background-color': colorProgreso(resuHtml[myIndex].porcejTapacantos), 'width': resuHtml[myIndex].porcejTapacantos + '%', 'min-width': '2em', 'border-radius': '4px'}">{{resuHtml[myIndex].porcejTapacantos.toFixed(2)}}%</td>
                </tr>
                <tr style="height: 30px;" v-if="resuHtml[myIndex].porcejTapacantos == 100">
                    <td><b>Tapacantos:</b><td>Finalizado</td>
                    <td class="progress-bar" :style="{'background-color': colorProgreso(resuHtml[myIndex].porcejTapacantos), 'width': resuHtml[myIndex].porcejTapacantos + '%', 'min-width': '2em', 'border-radius': '4px'}">{{resuHtml[myIndex].porcejTapacantos.toFixed(2)}}%</td>
                </tr>

                <tr style="height: 30px;" v-if="(resuHtml[myIndex].assignPrearmadoDate != resuHtml[myIndex].actualDate) && resuHtml[myIndex].porcejPrearmado < 100">
                    <td><b>Prearmado:</b><td :id="'prearmado-'+myIndex"><button class='btn btn-default' @click='tomarPrearmado(resuHtml[myIndex].id, myIndex);'>Tomar tarea</button></td>
                    <td class="progress-bar" :style="{'background-color': colorProgreso(resuHtml[myIndex].porcejPrearmado), 'width': resuHtml[myIndex].porcejPrearmado + '%', 'min-width': '2em', 'border-radius': '4px'}">{{resuHtml[myIndex].porcejPrearmado.toFixed(2)}}%</td>
                </tr>
                <tr style="height: 30px;" v-if="resuHtml[myIndex].assignPrearmado != null && resuHtml[myIndex].assignPrearmadoDate == resuHtml[myIndex].actualDate && resuHtml[myIndex].porcejPrearmado < 100">
                    <td><b>Prearmado:</b><td :id="'prearmado-'+myIndex">Tarea tomada por: {{resuHtml[myIndex].assign_prearmado? resuHtml[myIndex].assign_prearmado.usuario : ''}}</td>
                    <td class="progress-bar" :style="{'background-color': colorProgreso(resuHtml[myIndex].porcejPrearmado), 'width': resuHtml[myIndex].porcejPrearmado + '%', 'min-width': '2em', 'border-radius': '4px'}">{{resuHtml[myIndex].porcejPrearmado.toFixed(2)}}%</td>
                </tr>
                <tr style="height: 30px;" v-if="resuHtml[myIndex].porcejPrearmado == 100">
                    <td><b>Prearmado:</b><td>Finalizado</td>
                    <td class="progress-bar" :style="{'background-color': colorProgreso(resuHtml[myIndex].porcejPrearmado), 'width': resuHtml[myIndex].porcejPrearmado + '%', 'min-width': '2em', 'border-radius': '4px'}">{{resuHtml[myIndex].porcejPrearmado.toFixed(2)}}%</td>
                </tr>

                <tr style="height: 30px;" v-if="(resuHtml[myIndex].assignCajonesDate != resuHtml[myIndex].actualDate) && resuHtml[myIndex].porcejCajones < 100">
                    <td style="width: 10%;"><b>Cajones:</b><td style="width: 10%;" :id="'cajon-'+myIndex"><button class='btn btn-default' @click='tomarCajon(resuHtml[myIndex].id, myIndex);'>Tomar tarea</button></td>
                    <td class="progress-bar" :style="{'background-color': colorProgreso(resuHtml[myIndex].porcejCajones), 'width': resuHtml[myIndex].porcejCajones + '%', 'min-width': '2em', 'border-radius': '4px'}">{{resuHtml[myIndex].porcejCajones.toFixed(2)}}%</td>
                </tr>
                <tr style="height: 30px;" v-if="resuHtml[myIndex].assignCajones != null && resuHtml[myIndex].assignCajonesDate == resuHtml[myIndex].actualDate && resuHtml[myIndex].porcejCajones < 100">
                    <td style="width: 10%;"><b>Cajones:</b><td style="width: 10%;" :id="'cajon-'+myIndex">Tarea tomada por: {{resuHtml[myIndex].assign_cajones? resuHtml[myIndex].assign_cajones.usuario : ''}}</td>
                    <td class="progress-bar" :style="{'background-color': colorProgreso(resuHtml[myIndex].porcejCajones), 'width': resuHtml[myIndex].porcejCajones + '%', 'min-width': '2em', 'border-radius': '4px'}">{{resuHtml[myIndex].porcejCajones.toFixed(2)}}%</td>
                </tr>
                <tr style="height: 30px;" v-if="resuHtml[myIndex].porcejCajones == 100">
                    <td style="width: 10%;"><b>Cajones:</b><td style="width: 10%;">Finalizado</td>
                    <td class="progress-bar" :style="{'background-color': colorProgreso(resuHtml[myIndex].porcejCajones), 'width': resuHtml[myIndex].porcejCajones + '%', 'min-width': '2em', 'border-radius': '4px'}">{{resuHtml[myIndex].porcejCajones.toFixed(2)}}%</td>
                </tr>

                <tr style="height: 30px;" v-if="(resuHtml[myIndex].assignModulosDate != resuHtml[myIndex].actualDate) && resuHtml[myIndex].porcejModulos < 100">
                    <td><b>Modulos:</b><td :id="'modulo-'+myIndex"><button class='btn btn-default' @click='tomarModulo(resuHtml[myIndex].id, myIndex);'>Tomar tarea</button></td>
                    <td class="progress-bar" :style="{'background-color': colorProgreso(resuHtml[myIndex].porcejModulos), 'width': resuHtml[myIndex].porcejModulos + '%', 'min-width': '2em', 'border-radius': '4px'}">{{resuHtml[myIndex].porcejModulos.toFixed(2)}}%</td>
                </tr>
                <tr style="height: 30px;" v-if="resuHtml[myIndex].assignModulos != null && resuHtml[myIndex].assignModulosDate == resuHtml[myIndex].actualDate && resuHtml[myIndex].porcejModulos < 100">
                    <td><b>Modulos:</b><td :id="'modulo-'+myIndex">Tarea tomada por: {{resuHtml[myIndex].assign_modulos? resuHtml[myIndex].assign_modulos.usuario: ''}}</td>
                    <td class="progress-bar" :style="{'background-color': colorProgreso(resuHtml[myIndex].porcejModulos), 'width': resuHtml[myIndex].porcejModulos + '%', 'min-width': '2em', 'border-radius': '4px'}">{{resuHtml[myIndex].porcejModulos.toFixed(2)}}%</td>
                </tr>
                <tr style="height: 30px;" v-if="resuHtml[myIndex].porcejModulos == 100">
                    <td><b>Modulos:</b><td>Finalizado</td>
                    <td class="progress-bar" :style="{'background-color': colorProgreso(resuHtml[myIndex].porcejModulos), 'width': resuHtml[myIndex].porcejModulos + '%', 'min-width': '2em', 'border-radius': '4px'}">{{resuHtml[myIndex].porcejModulos.toFixed(2)}}%</td>
                </tr>
                </table>
                <table v-if="!resuHtml[myIndex].hasOwnProperty('cliente')">
                <tr>
                    <td colspan="2"><p><b>Tarea: </b>{{resuHtml[myIndex].tarea}}</p></td>
                </tr>
                <tr>
                    <td colspan="2"><p><b>Descripción: </b>{{resuHtml[myIndex].descripcion}}</p></td>
                </tr>
                <tr>
                    <td colspan="2"><p><b>Dia: </b>{{resuHtml[myIndex].dia}}</p></td>
                </tr>
                <tr>
                    <td colspan="2"><p><b>Dirección: </b>{{resuHtml[myIndex].direccion}}</p></td>
                </tr>
                <tr>
                    <td><b>Quien asistira: </b></td>
                    <td v-for="(assit, assistIndex) in resuHtml[myIndex].assistants" :key="assistIndex">{{users[resuHtml[myIndex].assistants[assistIndex]].nombre_completo}}-</td>
                </tr>
                <tr v-if="resuHtml[myIndex].assignTask == null">
                    <td :id="'evento-'+myIndex"><button class='btn btn-default' @click='tomarEvento(resuHtml[myIndex].id, myIndex);'>Tomar tarea</button></td>
                </tr>
                <tr v-if="resuHtml[myIndex].assignTask != null">
                    <td :id="'evento-'+myIndex"><b>Tarea tomada por: </b>{{resuHtml[myIndex].assign_task? resuHtml[myIndex].assign_task.usuario: ''}}</td>
                </tr>
                </table>
                <hr>
            </div>
            </div>
            <div v-for="(item, myIndex) in itemsToShowFirst" :hidden="showAll" :key="myIndex">
            <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" :id="'proyectoFirst-'+myIndex" :hidden="myIndex>0">
                <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                    <table align="center">
                        <tr>
                        <td style="font-size: 18px; text-align: center; font-weight: bold;">
                            {{itemsToShowFirst[myIndex].fancyHeader}}
                        </td>
                        </tr>
                    </table>
                    <table v-if="itemsToShowFirst[myIndex].hasOwnProperty('cliente')">
                        <tr>
                        <td colspan="2"><p><b>Proyecto: </b>{{itemsToShowFirst[myIndex].cliente.nombre_completo}} - {{itemsToShowFirst[myIndex].proyecto}}</p></td>
                        </tr>
                        <tr>
                        <td colspan="2"><p><b>Fecha Instalación: </b>{{itemsToShowFirst[myIndex].instalacion_fecha}}</p></td>
                        </tr>
                        <tr>
                        <td><b>Quien asistira: </b><p v-for="(assit, assistIndex) in itemsToShowFirst[myIndex].assistants" :key="assistIndex">{{users[itemsToShowFirst[myIndex].assistants[assistIndex]].nombre_completo}}</p></td>
                        </tr>
                    </table>
                    <table v-if="itemsToShowFirst[myIndex].hasOwnProperty('cliente')">
                        <tr style="height: 30px;">
                        <td style="width: 7%;"><b>Progreso:</b></td>
                        <td class="progress-bar" :style="{'background-color': colorProgreso(itemsToShowFirst[myIndex].totalPorcej), 'width': itemsToShowFirst[myIndex].totalPorcej + '%', 'min-width': '2em', 'border-radius': '4px'}">{{itemsToShowFirst[myIndex].totalPorcej.toFixed(2)}}%</td>
                        </tr>
                    </table>
                    <table v-if="!itemsToShowFirst[myIndex].hasOwnProperty('cliente')">
                        <tr>
                        <td colspan="2"><p><b>Tarea: </b>{{itemsToShowFirst[myIndex].tarea}}</p></td>
                        </tr>
                        <tr>
                        <td colspan="2"><p><b>Descripción: </b>{{itemsToShowFirst[myIndex].descripcion}}</p></td>
                        </tr>
                        <tr>
                        <td colspan="2"><p><b>Dia: </b>{{itemsToShowFirst[myIndex].dia}}</p></td>
                        </tr>
                        <tr>
                        <td colspan="2"><p><b>Dirección: </b>{{itemsToShowFirst[myIndex].direccion}}</p></td>
                        </tr>
                        <tr>
                        <td><b>Quien asistira: </b><p v-for="(assit, assistIndex) in itemsToShowFirst[myIndex].assistants" :key="assistIndex">{{users[itemsToShowFirst[myIndex].assistants[assistIndex]].nombre_completo}}</p></td>
                        </tr>
                    </table>
                    <table>
                        <tr>
                        <td><button class='btn btn-default' @click='showpagesFirst(myIndex, myIndex+1);'>OK</button></td>
                        </tr>
                    </table>
                    </div>
                </div>
                </div>
            </div>
            <a style="display:none;" :id="'proyectoFirstOpen-'+myIndex" data-toggle="modal" :href="'#proyectoFirst-'+myIndex">Open Modal</a>
            </div>
        </div>
    </div>
</template>

<script>
	import { HTTP } from '../../../index'
	import VueToastr from "vue-toastr";
	import Vue from "vue";
    import { environment } from './../Services/environment'
    // './Services/environment';
    
    export default {
		components:{
			VueToastr,
		},        
        data(){
            return{
                // clients: Client[],
                // sheets: Sheet[],
                sheetId: 0,
                logged: false,
                items: [],
                totalItems: 0,
                // dynamicModule: NgModuleFactory<any>,
                text: '',
                resuHtml: '',
                showAll: '',
                myCarrouselPosition: 0,
                myCarrouselPositionFirst: 0,
                itemsToShowFirst: [],
                users: [],
                isFirst: true,
            }
        },
        mounted(){
            this.getUsers();
            this.getproyectos();
            setInterval(() => { this.getproyectos(); }, 30000);
        },
        methods:{
            async getproyectos() {
                let dataOrdered =[];
                let dataUser = JSON.parse(localStorage.getItem("usuario"));
                let dataEvents = await HTTP.get(`/api/event/today/` + dataUser.rol)
                dataEvents = dataEvents.data
                    if(dataEvents){
                        // let responseEvents = dataEvents.json();
                        let responseEvents = dataEvents;

                        for (let i = 0; i < responseEvents.events.length; i++) {
                            let theDate = responseEvents.events[i].dia.split(" ");
                            if (!dataOrdered[theDate[0]]) {
                                dataOrdered[theDate[0]] = Array();
                            }
                            responseEvents.events[i].dia = theDate[0];
                            responseEvents.events[i].dia_original = responseEvents.events[i].dia;
                            responseEvents.events[i].dia = moment(responseEvents.events[i].dia + " " + responseEvents.events[i].hora_inicio).lang("es").format('LLLL');
                            dataOrdered[theDate[0]].push(responseEvents.events[i]);
                        }

                        let comp = this.compiler;
                        let create = this;
                        let mod = this.dynamicModule;
                        let res = await HTTP.get(`/api/proyectos/allProyectsOpen`)
                        let data = res.data
                            if(data) {
                                // let response = data.json();
                                let response = data;
                                for (let i = 0; i < response.proyectos.length; i++) {
                                    let theDate = response.proyectos[i].instalacion_fecha.split(" ");
                                    if (!dataOrdered[theDate[0]]) {
                                        dataOrdered[theDate[0]] = Array();
                                    }
                                    dataOrdered[theDate[0]].push(response.proyectos[i]);
                                }

                                var dataOrderedDates = Array();
                                var myCount = 0;
                                for (var key in dataOrdered) {
                                    if (Object.keys(dataOrderedDates).length == 0) {
                                        dataOrderedDates[myCount] = key;
                                        myCount++;
                                    } else {
                                        var thisDate = new Date(key);
                                        for (var i = 0; i < dataOrderedDates.length; i++) {
                                            var dateToAnalyze = new Date(dataOrderedDates[i]);
                                            if (thisDate < dateToAnalyze) {
                                                var myLength = dataOrderedDates.length;
                                                for (var j = myLength - 1; j >= i; j--) {
                                                    dataOrderedDates[j + 1] = dataOrderedDates[j];
                                                }
                                                dataOrderedDates[i] = key;
                                                break;
                                            }
                                            if (thisDate > dateToAnalyze && !dataOrderedDates[i + 1]) {
                                                dataOrderedDates[i + 1] = key;
                                                break;
                                            }
                                        }
                                        myCount++;
                                    }
                                }

                                response.proyectos = Array();
                                var count = 0;
                                for (var i = 0; i < dataOrderedDates.length; i++) {
                                    for (var key in dataOrdered) {
                                        if (key == dataOrderedDates[i]) {
                                            for (var j = 0; j < dataOrdered[key].length; j++) {
                                                response.proyectos[count] = dataOrdered[key][j];
                                                count++;
                                            }
                                        }
                                    }
                                }

                                this.totalItems = 0;
                                var resultHtml = "";
                                var itemsToBeRemoved = [];
                                this.itemsToShowFirst = [];

                                for (var i = 0; i < response.proyectos.length; i++) {
                                    response.proyectos[i].actualDate = moment().format('YYYY-MM-DD');
                                    if (response.proyectos[i].cliente) {
                                        var cantModulosOk = 0;
                                        var cantModulosFa = 0;
                                        var cantCajonesOk = 0;
                                        var cantCajonesFa = 0;
                                        var cantPiezasOk = 0;
                                        var cantPiezasFa = 0;
                                        var cantTapacantosOk = 0;
                                        var cantTapacantosFa = 0;
                                        var cantPrearmadoOk = 0;
                                        var cantPrearmadoFa = 0;

                                        //Modulos
                                        for (var j = 0; j < response.proyectos[i].modulos.length; j++) {
                                            if (response.proyectos[i].modulos[j].estado_id == 3) {
                                                if (response.proyectos[i].modulos[j].is_cajon == 0) {
                                                    cantModulosOk++;
                                                } else {
                                                    cantCajonesOk++;
                                                }
                                            } else {
                                                if (response.proyectos[i].modulos[j].is_cajon == 0) {
                                                    cantModulosFa++;
                                                } else {
                                                    cantCajonesFa++;
                                                }
                                            }
                                            //Piezas
                                            if (response.proyectos[i].modulos[j].piezas.length > 0) {
                                                for (var p = 0; p < response.proyectos[i].modulos[j].piezas.length; p++) {
                                                    if (response.proyectos[i].modulos[j].piezas[p].estado_id == 3) {
                                                        cantPiezasOk++;
                                                    } else {
                                                        cantPiezasFa++;
                                                    }
                                                    //Tapacantos
                                                    if (response.proyectos[i].modulos[j].piezas[p].tapacantos.length > 0) {
                                                        for (var t = 0; t < response.proyectos[i].modulos[j].piezas[p].tapacantos.length; t++) {
                                                            if (response.proyectos[i].modulos[j].piezas[p].tapacantos[t].estado_id == 3) {
                                                                cantTapacantosOk++;
                                                            } else {
                                                                cantTapacantosFa++;
                                                            }
                                                        }
                                                    }
                                                    //Prearmado
                                                    if (response.proyectos[i].modulos[j].piezas[p].prearmado.id == 3) {
                                                        cantPrearmadoOk++;
                                                    } else {
                                                        cantPrearmadoFa++;
                                                    }
                                                }
                                            }
                                        }
                                        var porcejPiezas = (cantPiezasOk / (cantPiezasOk + cantPiezasFa)) * 100;
                                        var porcejTapacantos = (cantTapacantosOk / (cantTapacantosOk + cantTapacantosFa)) * 100;
                                        var porcejPrearmado = (cantPrearmadoOk / (cantPrearmadoOk + cantPrearmadoFa)) * 100;
                                        var porcejModulos = (cantModulosOk / (cantModulosOk + cantModulosFa)) * 100;
                                        if (cantCajonesFa == 0 && cantCajonesOk == 0) {
                                            var porcejCajones = 100;
                                            var total = (porcejPiezas + porcejTapacantos + porcejPrearmado + porcejModulos) / 4;
                                        } else {
                                            var porcejCajones = (cantCajonesOk / (cantCajonesOk + cantCajonesFa)) * 100;
                                            var total = (porcejPiezas + porcejTapacantos + porcejPrearmado + porcejModulos + porcejCajones) / 5;
                                        }
                                        response.proyectos[i].porcejPiezas = porcejPiezas;
                                        response.proyectos[i].porcejTapacantos = porcejTapacantos;
                                        response.proyectos[i].porcejPrearmado = porcejPrearmado;
                                        response.proyectos[i].porcejModulos = porcejModulos;
                                        response.proyectos[i].porcejCajones = porcejCajones;
                                        response.proyectos[i].totalPorcej = total;
                                        response.proyectos[i].horaOriginal = moment(response.proyectos[i].instalacion_fecha).format("h:mm");
                                        response.proyectos[i].instalacion_fecha_original = response.proyectos[i].instalacion_fecha;
                                        response.proyectos[i].fecha_corta = moment(response.proyectos[i].instalacion_fecha).format("YYYY-MM-DD");
                                        response.proyectos[i].instalacion_fecha = moment(response.proyectos[i].instalacion_fecha).lang("es").format('LLLL');

                                        if (response.proyectos[i].assignPiezasDate != null) {
                                            var piezasDate = response.proyectos[i].assignPiezasDate.split(" ");
                                            response.proyectos[i].assignPiezasDate = piezasDate[0];
                                        }
                                        if (response.proyectos[i].assignPrearmadoDate != null) {
                                            var piezasDate = response.proyectos[i].assignPrearmadoDate.split(" ");
                                            response.proyectos[i].assignPrearmadoDate = piezasDate[0];
                                        }
                                        if (response.proyectos[i].assignCajonesDate != null) {
                                            var piezasDate = response.proyectos[i].assignCajonesDate.split(" ");
                                            response.proyectos[i].assignCajonesDate = piezasDate[0];
                                        }
                                        if (response.proyectos[i].assignTapacantosDate != null) {
                                            var piezasDate = response.proyectos[i].assignTapacantosDate.split(" ");
                                            response.proyectos[i].assignTapacantosDate = piezasDate[0];
                                        }
                                        if (response.proyectos[i].assignModulosDate != null) {
                                            var piezasDate = response.proyectos[i].assignModulosDate.split(" ");
                                            response.proyectos[i].assignModulosDate = piezasDate[0];
                                        }
                                        if (total == 100) {
                                            itemsToBeRemoved.push(i);
                                        }
                                    } else {
                                        response.proyectos[i].fecha_corta = moment(response.proyectos[i].dia_original).format("YYYY-MM-DD");
                                        response.proyectos[i].horaOriginal = response.proyectos[i].hora_inicio;
                                    }
                                    if (response.proyectos[i].assistants !== null && response.proyectos[i].assistants !== "") {
                                        response.proyectos[i].assistants = response.proyectos[i].assistants.split(",");
                                    }
                                    //alert(moment(response.proyectos[i].actualDate).add(1, 'days').format("YYYY-MM-DD") + " " + moment(response.proyectos[i].fecha_corta).add(1, 'days').format("YYYY-MM-DD"));
                                    if (response.proyectos[i].actualDate == response.proyectos[i].fecha_corta ||
                                        moment(response.proyectos[i].actualDate).add(1, 'days').format("YYYY-MM-DD") ==
                                        response.proyectos[i].fecha_corta) {
                                        this.itemsToShowFirst.push(response.proyectos[i]);
                                        if (!itemsToBeRemoved[i]) {
                                            itemsToBeRemoved.push(i);
                                        }
                                        if (response.proyectos[i].actualDate == response.proyectos[i].fecha_corta) {
                                            response.proyectos[i].fancyHeader = "Hoy - " + response.proyectos[i].horaOriginal + "hs";
                                        } else {
                                            response.proyectos[i].fancyHeader = "Mañana - " + response.proyectos[i].horaOriginal + "hs";
                                        }
                                    }
                                }
                                for (var i = itemsToBeRemoved.length - 1; i >= 0; i--) {
                                    response.proyectos.splice(itemsToBeRemoved[i], 1);
                                }
                                if (this.itemsToShowFirst.length == 0) {
                                    this.showAll = true;
                                }
                                this.resuHtml = response.proyectos;
                                setTimeout(() => {    //<<<---    using ()=> syntax
                                    this.showpages(-1, this.myCarrouselPosition);
                                    if (this.isFirst) {
                                        this.showpagesFirst(-1, this.myCarrouselPositionFirst);
                                        this.isFirst = false;
                                    }
                                }, 100);
                            }
                    };
            },
            async getUsers() {
                let dataUsers = await HTTP.get(`/api/usuario`)
                dataUsers= dataUsers.data
                console.log('datausers---', dataUsers)
                    if(dataUsers){
                        // let theData = dataUsers.json();
                        let theData = dataUsers;

                        for (let i = 0; i < theData.usuarios[theData.usuarios.length - 1].id; i++) {
                            this.users.splice(i, 0, "");
                        }

                        for (let i = 0; i < theData.usuarios.length; i++) {
                            this.users.splice(theData.usuarios[i].id, 0, theData.usuarios[i]);
                        }
                    }
            },
            showpages(){

            },
            colorProgreso(progreso) {
                const cantidad = parseInt(progreso);

                if (cantidad == 0)
                    return '#337ab7';
                else if (cantidad < 60)
                    return '#dadc02';
                else if (cantidad < 100)
                    return '#f4f566';
                else if (cantidad == 100)
                    return '#5cb85c';
            },
            showpages(hide, show) {
                var count = 0;
                var exists = true;
                while (exists) {
                    if (document.getElementById("proyecto-" + count.toString())) {
                        document.getElementById("proyecto-" + count.toString()).style.display = 'none';
                    } else {
                        exists = false;
                    }
                    count++;
                }
                if (document.getElementById("proyecto-" + show)) {
                    document.getElementById("proyecto-" + show).style.display = 'block';
                    this.myCarrouselPosition = show;
                } else {
                    this.showAll = false;
                    this.showpages(-1, 0);
                    this.myCarrouselPosition = 0;
                    this.showpagesFirst(-1, this.myCarrouselPositionFirst);
                }
            },
            async showpagesFirst(hide, show) {
                let count = 0;
                let exists = true;
                while (exists) {
                    if (document.getElementById("proyectoFirst-" + count.toString())) {
                        document.getElementById("proyectoFirst-" + count.toString()).style.display = 'none';
                    } else {
                        exists = false;
                    }
                    count++;
                }
                if (document.getElementById("proyectoFirst-" + show)) {
                    document.getElementById("proyectoFirst-" + show).style.display = 'block';
                    let paras = document.getElementsByClassName('modal-backdrop fade in') //as HTMLCollectionOf<HTMLElement>;
                    for (let i = 0; i < paras.length; i++) {
                        paras[i].style.display = "none";
                    }
                    document.getElementById("proyectoFirstOpen-" + show).click();
                    this.myCarrouselPositionFirst = show;
                } else {
                    this.showAll = true;
                    this.showpagesFirst(-1, this.itemsToShowFirst.length - 1);
                    this.myCarrouselPositionFirst = this.itemsToShowFirst.length - 1;
                    let paras = document.getElementsByClassName('modal-backdrop fade in') //as HTMLCollectionOf<HTMLElement>;
                    for (var i = 0; i < paras.length; i++) {
                        paras[i].style.display = "none";
                    }
                }
            },

            async tomarEvento(id, index) {
                let dataUser = JSON.parse(localStorage.getItem("usuario"));

                let res = await HTTP.get(`/api/usuario/` + dataUser.usuario)
                let data = res.data
                if (data) {
                    let response = data.json();
                    let dataToSend = { assignTask: response.usuario.id };
                    let res = await HTTP.patch(`/api/event/` + id + `assign`, dataToSend)
                    let dataProyecto = res.data
                    dataProyecto => {
                        this.resuHtml[index].assignTask = response.usuario.id;
                        this.resuHtml[index].assign_task = { usuario: dataUser.usuario };
                    };
                };
            },

            async tomarModulo(id, index) {
                let dataUser = JSON.parse(localStorage.getItem("usuario"));

                let res = await HTTP.get(`/api/usuario/` + dataUser.usuario)
                let data = res.data
                    if(data){
                        let response = data.json();
                        let dataToSend = { assignModulos: response.usuario.id, assignModulosDate: moment().format('YYYY-MM-DD') };
                        let resProyecto = await HTTP.patch(`/api/proyectos/` + id, dataToSend)
                        let dataProyecto = resProyecto.data
                            if(dataProyecto) {
                                this.resuHtml[index].assignModulos = response.usuario.id;
                                this.resuHtml[index].assign_modulos = { usuario: dataUser.usuario };
                                this.resuHtml[index].assignModulosDate = moment().format('YYYY-MM-DD');
                                this.resuHtml[index].actualDate = moment().format('YYYY-MM-DD');
                            };
                    };
            },
                tomarCajon(id, index) {
                    // let dataUser = JSON.parse(localStorage.getItem("usuario"));

                    // let res = this._http.get(`${environment.API_URL}/usuario/` + dataUser.usuario).subscribe(
                    //     (data: any) => {
                    //         let response = data.json();
                    //         let dataToSend = { assignCajones: response.usuario.id, assignCajonesDate: moment().format('YYYY-MM-DD') };
                    //         let res = this._http.patch(`${environment.API_URL}/proyectos/` + id, dataToSend).subscribe(
                    //             dataProyecto => {
                    //                 this.resuHtml[index].assignCajones = response.usuario.id;
                    //                 this.resuHtml[index].assign_cajones = { usuario: dataUser.usuario };
                    //                 this.resuHtml[index].assignCajonesDate = moment().format('YYYY-MM-DD');
                    //                 this.resuHtml[index].actualDate = moment().format('YYYY-MM-DD');
                    //             });
                    //     });
                },
                tomarPrearmado(id, index) {
                    // var dataUser = JSON.parse(localStorage.getItem("usuario"));

                    // var res = this._http.get(`${environment.API_URL}/usuario/` + dataUser.usuario).subscribe(
                    //     (data: any) => {
                    //         data.json();
                    //         var response = data.json();
                    //         var dataToSend = { assignPrearmado: response.usuario.id, assignPrearmadoDate: moment().format('YYYY-MM-DD') };
                    //         var res = this._http.patch(`${environment.API_URL}/proyectos/` + id, dataToSend).subscribe(
                    //             dataProyecto => {
                    //                 var responseProyecto = dataProyecto;
                    //                 this.resuHtml[index].assignPrearmado = response.usuario.id;
                    //                 this.resuHtml[index].assign_prearmado = { usuario: dataUser.usuario };
                    //                 this.resuHtml[index].assignPrearmadoDate = moment().format('YYYY-MM-DD');
                    //                 this.resuHtml[index].actualDate = moment().format('YYYY-MM-DD');
                    //             });
                    //     });
                },
                tomarTapacantos(id, index) {
                    // var dataUser = JSON.parse(localStorage.getItem("usuario"));

                    // var res = this._http.get(`${environment.API_URL}/usuario/` + dataUser.usuario).subscribe(
                    //     (data: any) => {
                    //         var response = data;
                    //         var dataToSend = { assignTapacantos: response.usuario.id, assignTapacantosDate: moment().format('YYYY-MM-DD') };
                    //         var res = this._http.patch(`${environment.API_URL}/proyectos/` + id, dataToSend).subscribe(
                    //             dataProyecto => {
                    //                 this.resuHtml[index].assignTapacantos = response.usuario.id;
                    //                 this.resuHtml[index].assign_tapacantos = { usuario: dataUser.usuario };
                    //                 this.resuHtml[index].assignTapacantosDate = moment().format('YYYY-MM-DD');
                    //                 this.resuHtml[index].actualDate = moment().format('YYYY-MM-DD');
                    //             });
                    //     });
                },
                tomarPiezas(id, index) {
                    // var dataUser = JSON.parse(localStorage.getItem("usuario"));
                    // var res = this._http.get(`${environment.API_URL}/usuario/` + dataUser.usuario).subscribe(
                    //     (data: any) => {
                    //         var response = data
                    //         var dataToSend = { assignPiezas: response.usuario.id, assignPiezasDate: moment().format('YYYY-MM-DD') };
                    //         var res = this._http.patch(`${environment.API_URL}/proyectos/` + id, dataToSend).subscribe(
                    //             dataProyecto => {
                    //                 var responseProyecto = dataProyecto;
                    //                 this.resuHtml[index].assignPiezas = response.usuario.id;
                    //                 this.resuHtml[index].assign_piezas = { usuario: dataUser.usuario };
                    //                 this.resuHtml[index].assignPiezasDate = moment().format('YYYY-MM-DD');
                    //                 this.resuHtml[index].actualDate = moment().format('YYYY-MM-DD');
                    //             });
                    //     });
                }            
        }
    }
</script>

<style scoped>
    body {
        margin: 40px 10px;
        padding: 0;
        font-family: "Lucida Grande",Helvetica,Arial,Verdana,sans-serif;
        font-size: 14px;
    }

    #calendar {
        max-width: 900px;
        margin: 0 auto;
        text-transform: uppercase;

        /* font-size: 11px;*/
    }

    .fc-title {
        font-size: 11px !important;
    }
</style>