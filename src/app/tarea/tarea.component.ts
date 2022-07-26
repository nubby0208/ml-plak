import { environment } from './../../environments/environment';
import { ModalOptimizeComponent } from './../modal-optimize/modal-optimize.component';
import { CellInfo } from './../models';
import { ModalSelectComponent, SelectTypeEnum } from './../modal-select/modal-select.component';
import { ModalAlertComponent } from './../modal-alert/modal-alert.component';
import { TablePropertiesService } from './../services/table-properties.service';
// import { GoogleApiEventService } from './../google-api-event.service';
// import { GoogleApiService } from './../google-api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild, NgModule, NgModuleFactory, Compiler, Input } from '@angular/core';
import { Client, Sheet, TableProperties } from 'app/models';
import { _window, _$ } from 'app/common';
import * as moment from 'moment';
import { HttpClient } from "@angular/common/http";


declare var $: any;
declare var funcs: any;



@Component({
    selector: 'app-tarea',
    templateUrl: 'tarea.component.html',
    styleUrls: ['tarea.component.css']
})
// tslint:disable-next-line: component-class-suffix
export class TareaComponents implements OnInit {

    clients: Client[];
    sheets: Sheet[];
    sheetId = 0;
    logged: boolean;
    public items = [];
    private totalItems = 0;
    public dynamicModule: NgModuleFactory<any>;
    @Input()
    text: string;
    public resuHtml;
    public showAll;
    public myCarrouselPosition = 0;
    public myCarrouselPositionFirst = 0;
    public itemsToShowFirst = [];
    public users = [];
    public isFirst = true;


    constructor(
        private _http: HttpClient,
        private sanitizer: DomSanitizer,
        private tableProperties: TablePropertiesService,
        private ref: ChangeDetectorRef,
        private zone: NgZone,
        private compiler: Compiler) {

    }

    ngOnInit() {
        this.getUsers();
        this.getproyectos();
        setInterval(() => { this.getproyectos(); }, 30000);
    }

    getproyectos() {
        var dataOrdered = Array();
        var dataUser = JSON.parse(localStorage.getItem("usuario"));
        var resEvents = this._http.get(`${environment.API_URL}/event/today/` + dataUser.rol).subscribe(
            (dataEvents: any) => {
                var responseEvents = dataEvents.json();

                for (var i = 0; i < responseEvents.events.length; i++) {
                    var theDate = responseEvents.events[i].dia.split(" ");
                    if (!dataOrdered[theDate[0]]) {
                        dataOrdered[theDate[0]] = Array();
                    }
                    responseEvents.events[i].dia = theDate[0];
                    responseEvents.events[i].dia_original = responseEvents.events[i].dia;
                    responseEvents.events[i].dia = moment(responseEvents.events[i].dia + " " + responseEvents.events[i].hora_inicio).lang("es").format('LLLL');
                    dataOrdered[theDate[0]].push(responseEvents.events[i]);
                }

                var comp = this.compiler;
                var create = this;
                var mod = this.dynamicModule;
                var res = this._http.get(`${environment.API_URL}/proyectos/allProyectsOpen`).subscribe(
                    (data: any) => {
                        var response = data.json();

                        for (var i = 0; i < response.proyectos.length; i++) {
                            var theDate = response.proyectos[i].instalacion_fecha.split(" ");
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
                    });
            });
    }

    getUsers() {
        var resEvents = this._http.get(`${environment.API_URL}/usuario`).subscribe(
            (dataUsers: any) => {
                var theData = dataUsers.json();

                for (var i = 0; i < theData.usuarios[theData.usuarios.length - 1].id; i++) {
                    this.users.splice(i, 0, "");
                }

                for (var i = 0; i < theData.usuarios.length; i++) {
                    this.users.splice(theData.usuarios[i].id, 0, theData.usuarios[i]);
                }
            });
    }

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
    };

    showpagesFirst(hide, show) {
        var count = 0;
        var exists = true;
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
            var paras = document.getElementsByClassName('modal-backdrop fade in') as HTMLCollectionOf<HTMLElement>;
            for (var i = 0; i < paras.length; i++) {
                paras[i].style.display = "none";
            }
            document.getElementById("proyectoFirstOpen-" + show).click();
            this.myCarrouselPositionFirst = show;
        } else {
            this.showAll = true;
            this.showpagesFirst(-1, this.itemsToShowFirst.length - 1);
            this.myCarrouselPositionFirst = this.itemsToShowFirst.length - 1;
            var paras = document.getElementsByClassName('modal-backdrop fade in') as HTMLCollectionOf<HTMLElement>;
            for (var i = 0; i < paras.length; i++) {
                paras[i].style.display = "none";
            }
        }
    };

    tomarEvento(id, index) {
        var dataUser = JSON.parse(localStorage.getItem("usuario"));

        var res = this._http.get(`${environment.API_URL}/usuario/` + dataUser.usuario).subscribe(
            (data: any) => {
                var response = data.json();
                var dataToSend = { assignTask: response.usuario.id };
                var res = this._http.patch(`${environment.API_URL}/event/` + id + `assign`, dataToSend).subscribe(
                    dataProyecto => {
                        this.resuHtml[index].assignTask = response.usuario.id;
                        this.resuHtml[index].assign_task = { usuario: dataUser.usuario };
                    });
            });
    }

    tomarModulo(id, index) {
        var dataUser = JSON.parse(localStorage.getItem("usuario"));

        var res = this._http.get(`${environment.API_URL}/usuario/` + dataUser.usuario).subscribe(
            (data: any) => {
                var response = data.json();
                var dataToSend = { assignModulos: response.usuario.id, assignModulosDate: moment().format('YYYY-MM-DD') };
                var res = this._http.patch(`${environment.API_URL}/proyectos/` + id, dataToSend).subscribe(
                    dataProyecto => {
                        this.resuHtml[index].assignModulos = response.usuario.id;
                        this.resuHtml[index].assign_modulos = { usuario: dataUser.usuario };
                        this.resuHtml[index].assignModulosDate = moment().format('YYYY-MM-DD');
                        this.resuHtml[index].actualDate = moment().format('YYYY-MM-DD');
                    });
            });
    }
    tomarCajon(id, index) {
        var dataUser = JSON.parse(localStorage.getItem("usuario"));

        var res = this._http.get(`${environment.API_URL}/usuario/` + dataUser.usuario).subscribe(
            (data: any) => {
                var response = data.json();
                var dataToSend = { assignCajones: response.usuario.id, assignCajonesDate: moment().format('YYYY-MM-DD') };
                var res = this._http.patch(`${environment.API_URL}/proyectos/` + id, dataToSend).subscribe(
                    dataProyecto => {
                        this.resuHtml[index].assignCajones = response.usuario.id;
                        this.resuHtml[index].assign_cajones = { usuario: dataUser.usuario };
                        this.resuHtml[index].assignCajonesDate = moment().format('YYYY-MM-DD');
                        this.resuHtml[index].actualDate = moment().format('YYYY-MM-DD');
                    });
            });
    }
    tomarPrearmado(id, index) {
        var dataUser = JSON.parse(localStorage.getItem("usuario"));

        var res = this._http.get(`${environment.API_URL}/usuario/` + dataUser.usuario).subscribe(
            (data: any) => {
                data.json();
                var response = data.json();
                var dataToSend = { assignPrearmado: response.usuario.id, assignPrearmadoDate: moment().format('YYYY-MM-DD') };
                var res = this._http.patch(`${environment.API_URL}/proyectos/` + id, dataToSend).subscribe(
                    dataProyecto => {
                        var responseProyecto = dataProyecto;
                        this.resuHtml[index].assignPrearmado = response.usuario.id;
                        this.resuHtml[index].assign_prearmado = { usuario: dataUser.usuario };
                        this.resuHtml[index].assignPrearmadoDate = moment().format('YYYY-MM-DD');
                        this.resuHtml[index].actualDate = moment().format('YYYY-MM-DD');
                    });
            });
    }
    tomarTapacantos(id, index) {
        var dataUser = JSON.parse(localStorage.getItem("usuario"));

        var res = this._http.get(`${environment.API_URL}/usuario/` + dataUser.usuario).subscribe(
            (data: any) => {
                var response = data;
                var dataToSend = { assignTapacantos: response.usuario.id, assignTapacantosDate: moment().format('YYYY-MM-DD') };
                var res = this._http.patch(`${environment.API_URL}/proyectos/` + id, dataToSend).subscribe(
                    dataProyecto => {
                        this.resuHtml[index].assignTapacantos = response.usuario.id;
                        this.resuHtml[index].assign_tapacantos = { usuario: dataUser.usuario };
                        this.resuHtml[index].assignTapacantosDate = moment().format('YYYY-MM-DD');
                        this.resuHtml[index].actualDate = moment().format('YYYY-MM-DD');
                    });
            });
    }
    tomarPiezas(id, index) {
        var dataUser = JSON.parse(localStorage.getItem("usuario"));
        var res = this._http.get(`${environment.API_URL}/usuario/` + dataUser.usuario).subscribe(
            (data: any) => {
                var response = data
                var dataToSend = { assignPiezas: response.usuario.id, assignPiezasDate: moment().format('YYYY-MM-DD') };
                var res = this._http.patch(`${environment.API_URL}/proyectos/` + id, dataToSend).subscribe(
                    dataProyecto => {
                        var responseProyecto = dataProyecto;
                        this.resuHtml[index].assignPiezas = response.usuario.id;
                        this.resuHtml[index].assign_piezas = { usuario: dataUser.usuario };
                        this.resuHtml[index].assignPiezasDate = moment().format('YYYY-MM-DD');
                        this.resuHtml[index].actualDate = moment().format('YYYY-MM-DD');
                    });
            });
    }

    colorProgreso(progreso: string): string {
        const cantidad = parseInt(progreso);

        if (cantidad == 0)
            return '#337ab7';
        else if (cantidad < 60)
            return '#dadc02';
        else if (cantidad < 100)
            return '#f4f566';
        else if (cantidad == 100)
            return '#5cb85c';
    }
}
