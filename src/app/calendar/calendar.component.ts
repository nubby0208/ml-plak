import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone, AfterViewInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FileUploader } from "ng2-file-upload";
import { CalendarEvent, CalendarView, CalendarDateFormatter, CalendarMonthViewDay, DAYS_OF_WEEK } from 'angular-calendar';

import { Grupo } from './../models';
import { Client, Sheet } from 'app/models';
import { GrupoService } from 'app/services/grupo.service';

import { TareaService } from './../services/tarea.service';
import { environment } from './../../environments/environment';
import { ImagenTareaUploadService } from './../services/imagen-tarea-upload.service';

import * as moment from 'moment';
import { Subject } from 'rxjs';
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    startOfDay,
    endOfDay,
    format,
    addDays,
    subDays,
} from 'date-fns';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { NgxPermissionsService } from "ngx-permissions";
import { Lightbox } from "ngx-lightbox";
import { ProyectoService } from "../services/proyecto.service";

declare let $: any;

moment.updateLocale('es', {
    week: {
        dow: DAYS_OF_WEEK.MONDAY,
        doy: 0,
    },
});


@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css'],
    providers: [{
        provide: CalendarDateFormatter,
        useClass: CalendarDateFormatter
    }]
})

export class CalendarComponents implements OnInit, AfterViewInit {
    @ViewChild('inputArchivoImagen') inputArchivoImagenVariable: ElementRef;
    refresh: Subject<any> = new Subject();
    view: CalendarView = CalendarView.Month;
    tarea: any = {};
    viewDate: Date = new Date();
    locale: string = 'es';
    events: CalendarEvent[] = [];
    eventsAux: CalendarEvent[] = [];
    proyectos: any[] = [];
    clients: Client[];
    sheets: Sheet[];
    sheetId = 0;
    logged: boolean;
    public items = [];
    public users;
    public itemsToShowFirst = [];
    public itemsToShowFirstFinal = [];
    public isFirst = true;
    public myCarrouselPositionFirst = 0;
    private server = environment.API_URL;
    fileToUpload: File = null;
    form: FormGroup;
    error: string;
    userId: number = 166;
    uploadResponse = { status: '', message: '', filePath: '' };
    currentEventImages = [];
    currentEventImagePath = "";
    rol: string;
    modalDetalleSaldo;

    tareaPersonal = {
        realizado: false,
        descripcion: '',
        usuario_id: null,
        grupo_id: null,
    };

    weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

    public gruposSeleccionados: any;
    public observacionesProyecto: any;
    public eventoSeleccionado: any;

    public grupos: Array<Grupo> = Array<Grupo>();
    public tareas: any[] = [];
    public cargandoCalendario: boolean = true;
    public proyectoTerminado: boolean = false;

    public filtroGrupo: any = 0;
    public idTraidoTaller: any = null;


    uploader: FileUploader;

    latitud: number;
    longitud: number;
    direccion: string;
    private geoCoder;

    @ViewChild('search')
    public searchElementRef: ElementRef;

    idEvento: string = "";
    public cargandoEvento: boolean = false;
    public circleRadius: number = 5000;

    constructor(
        private proyectoService: ProyectoService,
        private _http: HttpClient,
        private ref: ChangeDetectorRef,
        public _toastr: ToastrService,
        private router: Router,
        private formBuilder: FormBuilder,
        private imagenTareaUploadService: ImagenTareaUploadService,
        private _tareaService: TareaService,
        private _grupoService: GrupoService,
        private _ngxUiService: NgxUiLoaderService,
        private _route: ActivatedRoute,
        private _permissionService: NgxPermissionsService,
        private _mapsAPILoader: MapsAPILoader,
        private _ngZone: NgZone,
        private _lightBox: Lightbox
    ) { }

    ngOnInit() {
        this.uploader = new FileUploader({
            url: `${this.server}/eventimage`,
            autoUpload: false,
            allowedMimeType: ['image/png', 'image/jpeg']
        });

        this.uploader.onBeforeUploadItem = (item) => item.withCredentials = false;
        this.uploader.onErrorItem = (item, response, status, headers) => {
            this._toastr.error(`${item.file.name} error al subir`);
            if (this.uploader.progress == 100) {
                this.cargandoEvento = false;
                $('#myModalHorizontal').modal('hide');
                this.uploader.clearQueue();

            };
        };
        this.uploader.onSuccessItem = (item, response, status, headers) => {
            this._toastr.success(`${item.file.name} subido correctamente`);
            if (this.uploader.progress == 100) {
                this.cargandoEvento = false;
                $('#myModalHorizontal').modal('hide');
                this.uploader.clearQueue();
            };
        };

        this.uploader.onBuildItemForm = (filteItem: any, form: any) => form.append('id', this.idEvento);

        this._route.params.subscribe(params => {
            if (params.hasOwnProperty('id'))
                this.idTraidoTaller = params.id;
        });

        this._ngxUiService.start();
        this.rol = JSON.parse(localStorage.getItem('usuario')).rol;
        this.traerGrupos();
        this.traerTareas();
        this.fetchEvents();
        this.form = this.formBuilder.group({
            imagen: ['']
        });
    }

    ngAfterViewInit(): void {
        this.buscarDireccion();
    }

    buscarDireccion() {
        this._mapsAPILoader.load().then(() => {
            let form = document.getElementById("eventForm");
            let autocomplete = new google.maps.places.Autocomplete(form["direccion"], {
                types: ['address'],
                componentRestrictions: {
                    country: 'AR'
                },
            });

            this._ngZone.run(() => {
                autocomplete.addListener("place_changed", () => {
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    this.direccion = place.formatted_address;
                    this.latitud = place.geometry.location.lat();
                    this.longitud = place.geometry.location.lng();
                    this.obtenerDireccion(this.latitud, this.longitud);
                });
            })
        });
    }

    ubicacionActual() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitud = position.coords.latitude;
                this.longitud = position.coords.longitude;
                this.obtenerDireccion(this.latitud, this.longitud);
            });
        }
    }

    obtenerDireccion(latitud, longitud) {
        let geoCoder = new google.maps.Geocoder();
        if (geoCoder) {
            geoCoder.geocode({ 'location': { lat: latitud, lng: longitud } }, (results, status) => {
                if (status === 'OK') {
                    if (results[0]) {
                        this.direccion = results[0].formatted_address;
                    }
                }
            });
        }
    }

    verificarDireccion(latitud, longitud) {
        let geoCoder = new google.maps.Geocoder();
        if (geoCoder) {
            geoCoder.geocode({ 'location': { lat: latitud, lng: longitud } }, (results, status) => {
                if (status === 'OK') {
                    if (results[0]) {
                        let form = document.getElementById("eventForm");
                        form["direccion"].value = results[0].formatted_address;
                    }
                }
            });
        }
    }

    beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
        if (this.eventoSeleccionado != null) {
            body.forEach(day => {
                let elUpdate = day.events.filter(f => f.meta.id == this.eventoSeleccionado.id);
                if (elUpdate.length == 1) {
                    if (elUpdate[0].meta.hasOwnProperty('tarea')) {
                        elUpdate[0].meta = this.eventoSeleccionado;
                        elUpdate[0].title = this.eventoSeleccionado.tarea + " - " + this.eventoSeleccionado.hora_inicio + "HS";
                        elUpdate[0].cssClass = this.tareaClase(this.eventoSeleccionado.tarea)
                    } else {
                        elUpdate[0].meta.grupos = this.eventoSeleccionado.grupos;
                        elUpdate[0].meta.observaciones = this.eventoSeleccionado.observaciones;
                    }
                }
            });
        }
    }

    tareaClase(tarea) {
        let stockClass: string = '';

        if (tarea == "visita")
            stockClass = "red";
        else if (tarea == "pago")
            stockClass = "orange";
        else if (tarea == "medidas")
            stockClass = "grey";
        else if (tarea == "servicio")
            stockClass = "black";
        else if (tarea == "nota")
            stockClass = "white";
        else if (tarea == "tarea")
            stockClass = "violet";

        return stockClass;
    }

    verificoProyecto(data) {
        if (data.hasOwnProperty('proyecto')) return true;
        return false;
    }

    traerTareas() {
        this._tareaService.getAll().subscribe((data: any) => {
            this.tareas = data;
        })
    }

    traerProyectos(inicio, fin) {
        this._http.get(`${this.server}/proyectos/dates/${inicio}/${fin}`).subscribe(
            (dataUsers: any) => {
                if (dataUsers.proyectos.length > 0) {
                    dataUsers.proyectos.forEach((element, index) => {

                        let total = element.progreso_total.total;
                        let stockPorcentaje = element.progreso_total.porcentaje_stock;
                        let stockClass: string = '';

                        element.bolitas = []

                        if (stockPorcentaje > 1 && stockPorcentaje < 70)
                            element.bolitas.push('#9E9E1F');
                        else if (stockPorcentaje > 70 && stockPorcentaje < 100)
                            element.bolitas.push('#CFCF26');
                        else if (stockPorcentaje > 99)
                            element.bolitas.push('#05A730');
                        else
                            element.bolitas.push('#337ab7');


                        if (total > 1 && total < 70)
                            element.bolitas.push('#9E9E1F');
                        else if (total > 70 && total < 100)
                            element.bolitas.push('#CFCF26');
                        else if (total > 99)
                            element.bolitas.push('#05A730');
                        else
                            element.bolitas.push('#337ab7');

                        stockClass = 'proyecto';

                        let arrayGrupos = [];

                        if (element.grupos != null) {

                            if (element.grupos.length != 0) {
                                let arr = element.grupos.split(',');
                                arr.forEach(id => {
                                    arrayGrupos.push(+id);
                                });
                            };
                            element.grupos = arrayGrupos;
                        }
                        this.events.push({
                            title: `${element.cliente.nombre_completo} - ${element.proyecto}`,
                            start: new Date(element.instalacion_fecha.toString().replace(/-/g, "/")),
                            meta: element,
                            cssClass: stockClass,
                            allDay: true
                        });

                        this.eventsAux = this.events;

                        if (this.idTraidoTaller == null) {

                            let actualDate = moment().format('YYYY-MM-DD');
                            let fecha_corta = moment(element.instalacion_fecha).format("YYYY-MM-DD");

                            if (((element.grupos == "" || element.grupos == null || element.grupos == 'null')
                                && (actualDate == fecha_corta ||
                                    moment(actualDate).add(1, 'days').format("YYYY-MM-DD") == fecha_corta)) ||
                                moment(actualDate).add(2, 'days').format("YYYY-MM-DD") == fecha_corta ||
                                moment(actualDate).add(3, 'days').format("YYYY-MM-DD") == fecha_corta ||
                                moment(actualDate).add(4, 'days').format("YYYY-MM-DD") == fecha_corta ||
                                moment(actualDate).add(5, 'days').format("YYYY-MM-DD") == fecha_corta ||
                                moment(actualDate).add(6, 'days').format("YYYY-MM-DD") == fecha_corta ||
                                moment(actualDate).add(7, 'days').format("YYYY-MM-DD") == fecha_corta) {

                                let day = moment(element.fecha_corta).lang("es").format("dddd");
                                element.horaOriginal = moment(element.instalacion_fecha).format("h:mm");
                                element.fancyHeader = day.charAt(0).toUpperCase() + day.slice(1) + " - " + element.horaOriginal + "hs";

                                this.itemsToShowFirst.push(element);
                            }

                            if (this.isFirst) {
                                let dataOrdered = Array();

                                for (let z = 0; z < this.itemsToShowFirst.length; z++) {
                                    if (!dataOrdered[this.itemsToShowFirst[z].fecha_corta]) {
                                        dataOrdered[this.itemsToShowFirst[z].fecha_corta] = Array();
                                    }
                                    dataOrdered[this.itemsToShowFirst[z].fecha_corta].push(this.itemsToShowFirst[z]);
                                }
                                let dataOrderedDates = Array();
                                let myCount = 0;

                                for (let key in dataOrdered) {
                                    if (Object.keys(dataOrderedDates).length == 0) {
                                        dataOrderedDates[myCount] = key;
                                        myCount++;
                                    } else {
                                        let thisDate = new Date(key);
                                        for (let i = 0; i < dataOrderedDates.length; i++) {
                                            let dateToAnalyze = new Date(dataOrderedDates[i]);
                                            if (thisDate < dateToAnalyze) {
                                                let myLength = dataOrderedDates.length;
                                                for (let j = myLength - 1; j >= i; j--) {
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
                                let count = 0;

                                for (let i = 0; i < dataOrderedDates.length; i++) {
                                    for (let key in dataOrdered) {
                                        if (key == dataOrderedDates[i]) {
                                            for (let j = 0; j < dataOrdered[key].length; j++) {
                                                this.itemsToShowFirstFinal[count] = dataOrdered[key][j];
                                                count++;
                                            }
                                        }
                                    }
                                }

                                setTimeout(() => {    //<<<---    using ()=> syntax
                                    if (this.isFirst) {
                                        this.showpagesFirst(-1, this.myCarrouselPositionFirst);
                                        this.isFirst = false;
                                    }
                                }, 100);
                            }
                        } else {
                            let traerProyecto = this.events.filter(x => x.meta.id == this.idTraidoTaller);
                            if (traerProyecto.length > 0)
                                this.detalleCalendario(traerProyecto[0].meta);
                        }

                    });

                }
                this.cargandoCalendario = false;
                this._ngxUiService.stop();
            });
    }


    fetchEvents(): void {
        this.filtroGrupo = 0;
        const getStart: any = {
            month: startOfMonth,
            week: startOfWeek,
            day: startOfDay,
        }[this.view];

        const getEnd: any = {
            month: endOfMonth,
            week: endOfWeek,
            day: endOfDay,
        }[this.view];

        let inicio = format(subDays(getStart(this.viewDate), 8), 'yyyy-MM-dd');
        let fin = format(addDays(getEnd(this.viewDate), 8), 'yyyy-MM-dd');

        this.traerEventos(inicio, fin);
    }



    traerEventos(inicio, fin) {
        this._ngxUiService.start();
        this.events = [];
        this.cargandoCalendario = true;
        this._http.get(`${environment.API_URL}/event/dates/${inicio}/${fin}`).subscribe(
            (dataUsers: any) => {
                if (dataUsers.events.length > 0) {
                    dataUsers.events = dataUsers.events.sort((a, b) => b.hora_inicio - a.hora_inicio)
                    dataUsers.events.forEach((element, index) => {
                        this.agregarEventoCalendario(element);

                        if (this.idTraidoTaller == null) {
                            let actualDate = moment().format('YYYY/MM/DD');
                            let fecha_corta = moment(element.instalacion_fecha).format("YYYY/MM/DD");

                            if ((element.grupos == "" || element.grupos == null)
                                && (actualDate == fecha_corta ||
                                    moment(actualDate).add(1, 'days').format("YYYY/MM/DD") == fecha_corta ||
                                    moment(actualDate).add(2, 'days').format("YYYY/MM/DD") == fecha_corta ||
                                    moment(actualDate).add(3, 'days').format("YYYY/MM/DD") == fecha_corta ||
                                    moment(actualDate).add(4, 'days').format("YYYY/MM/DD") == fecha_corta ||
                                    moment(actualDate).add(5, 'days').format("YYYY/MM/DD") == fecha_corta ||
                                    moment(actualDate).add(6, 'days').format("YYYY/MM/DD") == fecha_corta ||
                                    moment(actualDate).add(7, 'days').format("YYYY/MM/DD") == fecha_corta)) {
                                element.dia_original = element.dia;
                                element.horaOriginal = element.hora_inicio;
                                let day = moment(element.fecha_corta).lang("es").format("dddd");
                                element.fancyHeader = day.charAt(0).toUpperCase() + day.slice(1) + " - " + element.horaOriginal + "hs";

                                this.itemsToShowFirst.push(element);
                            }
                        }
                    });
                }
                this.traerProyectos(inicio, fin);
            });
    }

    traerGrupos() {
        if (this.rol == 'Administrador') {

            this._grupoService.getAll().subscribe((data: any) => {
                this.grupos = data.filter(x => x.activo);
            });
        } else {
            let idUsuario = JSON.parse(localStorage.getItem('usuario')).id;

            this._grupoService.getById(idUsuario).subscribe((data: any) => {
                this.grupos = data.filter(x => x.activo);
            });
        }
    }

    agregarTarea(tarea, proceso) {
        let { id } = JSON.parse(localStorage.getItem('usuario'));

        this.tareaPersonal = tarea;

        if (proceso == 0) {
            this.tareaPersonal.usuario_id = id;
            this.tareaPersonal.grupo_id = null;
        } else if (proceso == 1) {
            this.tareaPersonal.usuario_id = null;
            if (this.tareaPersonal.grupo_id == null) return this._toastr.info('Seleccione un grupo');
        }
        else {
            this.tareaPersonal.usuario_id = null;
            this.tareaPersonal.grupo_id = null;
        }

        if (this.tareaPersonal.usuario_id == null && this.tareaPersonal.grupo_id == null)
            if (this.rol != 'Administrador') return false;

        if (tarea.descripcion != '') {
            this._tareaService.store(this.tareaPersonal).subscribe(data => {
                this._toastr.success('Tarea agregada');
                this.tareaPersonal.descripcion = '';
                this.traerTareas();
            }, (err => this._toastr.error(err.error)));
        } else this._toastr.info("Complete la descripción");
    }

    actualizarEvento() {

        let that = this;
        let form = document.getElementById("eventForm");
        let day = form["dia"].value.substring(0, 2);
        let month = form["dia"].value.substring(3, 5);
        let year = form["dia"].value.substring(6);

        let obj = {
            tarea: form["tarea"].value,
            descripcion: form["desc"].value,
            nombre: form["nombre"].value,
            telefono: form["telefono"].value,
            direccion: form["direccion"].value,
            hora_inicio: form["horario"].value,
            dia: moment(year + "-" + month + "-" + day).format('YYYY-MM-DD'),
            grupos: this.gruposSeleccionados.toString(),
            assistants: null,
            latitud: this.latitud,
            longitud: this.longitud
        };

        if (obj.tarea == "" || obj.descripcion == "" || obj.nombre == "" || obj.telefono == "" || obj.hora_inicio == "" || obj.direccion == "" || obj.dia == "") this._toastr.info("Faltan completar datos");
        else {
            $.ajax({
                url: `${environment.API_URL}/event/` + form["eventId"].value,
                type: "PATCH",
                data: obj
            }).done(function (response) {

                if (that.uploader.queue.length > 0) {
                    that.cargandoEvento = true;
                    that.idEvento = form["eventId"].value;
                    that.uploader.queue.forEach(item => {
                        that.uploader.uploadItem(item);
                    })
                } else {
                    let evento: any = that.events.filter(x => x.meta.id == form["eventId"].value && x.meta.hasOwnProperty('tarea'));
                    evento[0].meta.id = form["eventId"].value;
                    evento[0].meta.tarea = obj.tarea;
                    evento[0].meta.descripcion = obj.descripcion;
                    evento[0].meta.nombre = obj.nombre;
                    evento[0].meta.telefono = obj.telefono;
                    evento[0].meta.direccion = obj.direccion;
                    evento[0].meta.hora_inicio = obj.hora_inicio;
                    evento[0].meta.dia = obj.dia;
                    evento[0].meta.assistants = obj.assistants;

                    let arrayGrupos = [];

                    if (obj.grupos.length != 0) {
                        let arr = obj.grupos.split(',');
                        arr.forEach(id => {
                            arrayGrupos.push(+id);
                        });
                    };

                    evento[0].meta.grupos = arrayGrupos;

                    that.eventoSeleccionado = evento[0].meta;
                    that.refresh.next();

                    if (that.uploader.queue.length == 0)
                        $('#myModalHorizontal').modal('hide');
                }

            });
        }
        //  this.traerCalendario();
    }

    realizarTarea(tarea) {
        this._tareaService.update(tarea.id, tarea).subscribe(data => {
            this.tarea = data;
            this.traerTareas();
        })
    }

    filtrarPorGrupo(event) {
        let eventos = [];

        if (this.eventsAux.length == 0)
            this.eventsAux = [...this.events];

        if (event != 0) {
            this.eventsAux.forEach(element => {
                if (element.meta.grupos != null) {
                    let filtrosEncontrados = element.meta.grupos.find(number => number == +event);
                    if (filtrosEncontrados != undefined) eventos.push(element);
                }
            });
        }

        if (eventos.length > 0)
            this.events = eventos;
        else {
            if (event != 0) this._toastr.info("No hay proyectos/eventos a cargo del grupo");
            this.events = this.eventsAux;
        }
    }

    placeMarker($event) {
        this.latitud = $event.coords.lat;
        this.longitud = $event.coords.lng;
        this.obtenerDireccion($event.coords.lat, $event.coords.lng);
        this.verificarDireccion($event.coords.lat, $event.coords.lng);
    }

    detalleCalendario(detalle) {
        this.modalDetalleSaldo = null;
        this.proyectoService.getCajaMetadata(detalle.id).subscribe(response => {
            this.modalDetalleSaldo = response.saldo;
        });

        document.getElementById("updateEvent").style.display = "block";
        if (this.rol == "Administrador")
            document.getElementById("deleteEvent").style.display = "block";
        document.getElementById("saveEvent").style.display = "none";

        this.proyectoTerminado = detalle.finalizado;
        this.gruposSeleccionados = detalle.grupos;

        if (detalle.hasOwnProperty('tarea')) {
            document.getElementById("openMod").click();
            this.currentEventImages = [];

            this.gruposSeleccionados = detalle.grupos;

            //  this.buscarDireccion();

            if (detalle.latitud != "") {
                this.latitud = +detalle.latitud;
                this.longitud = +detalle.longitud;
                this.obtenerDireccion(+detalle.latitud, +detalle.longitud);
            }

            let form = document.getElementById("eventForm");
            form["tarea"].value = detalle.tarea;
            form["desc"].value = detalle.descripcion;
            form["nombre"].value = detalle.nombre;
            form["telefono"].value = detalle.telefono;
            form["direccion"].value = detalle.direccion;
            form["horario"].value = detalle.hora_inicio;
            form["dia"].value = moment(detalle.dia).format('DD-MM-YYYY');;
            form["eventId"].value = detalle.id;

            this.cargarImagenesEvento(detalle.id);
            //form["assistants"].value = detalle.id;
        } else {
            let title = `${detalle.cliente.nombre_completo} - ${detalle.proyecto}`;

            $('#Calendarmodal').modal('show');
            $('.modal-title').html('Detalle');

            let idPro = (<HTMLInputElement>document.getElementById("proyectId"));
            idPro.value = detalle.id;

            this.observacionesProyecto = detalle.observaciones;
            let porcejPiezas = detalle.progreso_total.porcentaje_piezas.toFixed(2);
            let porcejStock = detalle.progreso_total.porcentaje_stock.toFixed(2);
            let porcejTapacantos = detalle.progreso_total.porcentaje_tapacantos.toFixed(2);
            let porcejPrearmado = detalle.progreso_total.porcentaje_prearmados.toFixed(2);
            let porcejModulos = detalle.progreso_total.porcentaje_modulos.toFixed(2);
            let porcejCajones = detalle.progreso_total.porcentaje_cajones.toFixed(2);

            let total = detalle.progreso_total.total.toFixed(2);

            document.getElementById("clientePlace").innerHTML = `<b>${title}</b>`;
            document.getElementById("datePlace").innerHTML = moment(detalle.instalacion_fecha).format("DD-MM-YYYY");
            document.getElementById("hourPlace").innerHTML = `${moment(detalle.instalacion_fecha).format("hh:mm")}hs`;
            document.getElementById("tipoTrabajo").innerHTML = detalle.proyecto;
            document.getElementById("comment").innerHTML = detalle.instalacion_comentario;
            document.getElementById("phone").innerHTML = detalle.cliente.telefono;
            document.getElementById("address").innerHTML = detalle.cliente.direccion;
            document.getElementById("piezasPorcej").innerHTML = porcejPiezas + "%";
            document.getElementById("piezasPorcej").style.width = porcejPiezas + "%";

            if (parseFloat(porcejPiezas) > 1 && parseFloat(porcejPiezas) < 70)
                document.getElementById("piezasPorcej").style.backgroundColor = '#9E9E1F';
            else if (parseFloat(porcejPiezas) > 70 && parseFloat(porcejPiezas) < 100)
                document.getElementById("piezasPorcej").style.backgroundColor = '#CFCF26';
            else if (parseFloat(porcejPiezas) > 99)
                document.getElementById("piezasPorcej").style.backgroundColor = '#05A730';
            else
                document.getElementById("piezasPorcej").style.backgroundColor = '#337ab7';

            document.getElementById("tapacantosPorcej").innerHTML = porcejTapacantos + "%";
            document.getElementById("tapacantosPorcej").style.width = porcejTapacantos + "%";

            if (parseFloat(porcejTapacantos) > 1 && parseFloat(porcejTapacantos) < 70)
                document.getElementById("tapacantosPorcej").style.backgroundColor = '#9E9E1F';
            else if (parseFloat(porcejTapacantos) > 70 && parseFloat(porcejTapacantos) < 100)
                document.getElementById("tapacantosPorcej").style.backgroundColor = '#CFCF26';
            else if (parseFloat(porcejTapacantos) > 99)
                document.getElementById("tapacantosPorcej").style.backgroundColor = '#05A730';
            else
                document.getElementById("tapacantosPorcej").style.backgroundColor = '#337ab7';

            document.getElementById("prearmadoPorcej").innerHTML = porcejPrearmado + "%";
            document.getElementById("prearmadoPorcej").style.width = porcejPrearmado + "%";

            if (parseFloat(porcejPrearmado) > 1 && parseFloat(porcejPrearmado) < 70)
                document.getElementById("prearmadoPorcej").style.backgroundColor = '#9E9E1F';
            else if (parseFloat(porcejPrearmado) > 70 && parseFloat(porcejPrearmado) < 100)
                document.getElementById("prearmadoPorcej").style.backgroundColor = '#CFCF26';
            else if (parseFloat(porcejPrearmado) > 99)
                document.getElementById("prearmadoPorcej").style.backgroundColor = '#05A730';
            else
                document.getElementById("prearmadoPorcej").style.backgroundColor = '#337ab7';

            document.getElementById("cajonesPorcej").innerHTML = porcejCajones + "%";
            document.getElementById("cajonesPorcej").style.width = porcejCajones + "%";

            if (parseFloat(porcejCajones) > 1 && parseFloat(porcejCajones) < 70)
                document.getElementById("cajonesPorcej").style.backgroundColor = '#9E9E1F';
            else if (parseFloat(porcejCajones) > 70 && parseFloat(porcejCajones) < 100)
                document.getElementById("cajonesPorcej").style.backgroundColor = '#CFCF26';
            else if (parseFloat(porcejCajones) > 99)
                document.getElementById("cajonesPorcej").style.backgroundColor = '#05A730';
            else
                document.getElementById("cajonesPorcej").style.backgroundColor = '#337ab7';

            document.getElementById("modulosPorcej").innerHTML = porcejModulos + "%";
            document.getElementById("modulosPorcej").style.width = porcejModulos + "%";

            if (parseFloat(porcejModulos) > 1 && parseFloat(porcejModulos) < 70)
                document.getElementById("modulosPorcej").style.backgroundColor = '#9E9E1F';
            else if (parseFloat(porcejModulos) > 70 && parseFloat(porcejModulos) < 100)
                document.getElementById("modulosPorcej").style.backgroundColor = '#CFCF26';
            else if (parseFloat(porcejModulos) > 99)
                document.getElementById("modulosPorcej").style.backgroundColor = '#05A730';
            else
                document.getElementById("modulosPorcej").style.backgroundColor = '#337ab7';

            document.getElementById("totalPorcej").innerHTML = "<u><b>" + total + "%</b></u>";
            document.getElementById("totalPorcej").style.width = total + "%";

            if (parseFloat(total) > 1 && parseFloat(total) < 70)
                document.getElementById("totalPorcej").style.backgroundColor = '#9E9E1F';
            else if (parseFloat(total) > 70 && parseFloat(total) < 100)
                document.getElementById("totalPorcej").style.backgroundColor = '#CFCF26';
            else if (parseFloat(total) > 99)
                document.getElementById("totalPorcej").style.backgroundColor = '#05A730';
            else
                document.getElementById("totalPorcej").style.backgroundColor = '#337ab7';

            document.getElementById("stockPorcej").innerHTML = porcejStock + "%";
            document.getElementById("stockPorcej").style.width = porcejStock + "%";

            if (parseFloat(porcejStock) > 1 && parseFloat(porcejStock) < 70)
                document.getElementById("stockPorcej").style.backgroundColor = '#9E9E1F';
            else if (parseFloat(porcejStock) > 70 && parseFloat(porcejStock) < 100)
                document.getElementById("stockPorcej").style.backgroundColor = '#CFCF26';
            else if (parseFloat(porcejStock) > 99)
                document.getElementById("stockPorcej").style.backgroundColor = '#05A730';
            else
                document.getElementById("stockPorcej").style.backgroundColor = '#337ab7';
        }
    }

    abrirGoogleMaps() {
        window.open(` https://www.google.com/maps/?q=${this.latitud},${this.longitud}`)
    }

    nuevoEvento(dia) {
        this.uploader.clearQueue();
        this.currentEventImages = [];
        document.getElementById("openMod").click();
        document.getElementById("updateEvent").style.display = "none";
        document.getElementById("deleteEvent").style.display = "none";
        document.getElementById("saveEvent").style.display = "block";

        this.ubicacionActual();
        setTimeout(() => {
            this.verificarDireccion(+this.latitud, +this.longitud);
        }, 250);

        let form = document.getElementById("eventForm");
        form["tarea"].value = "";
        form["desc"].value = "";
        form["nombre"].value = "";
        form["telefono"].value = "";
        //   form["direccion"].value = "";
        form["horario"].value = moment().format('HH:mm');
        form["dia"].value = moment(dia.date).format('DD-MM-YYYY');
        this.gruposSeleccionados = "";
    }

    agregarEventoCalendario(data) {
        let stockClass: string = '';

        if (data.tarea == "visita")
            stockClass = "red";
        else if (data.tarea == "pago")
            stockClass = "orange";
        else if (data.tarea == "medidas")
            stockClass = "grey";
        else if (data.tarea == "servicio")
            stockClass = "black";
        else if (data.tarea == "nota")
            stockClass = "white";
        else if (data.tarea == "tarea")
            stockClass = "violet";

        let arrayGrupos = [];

        if (data.grupos != null) {
            let arr = data.grupos.split(',');
            arr.forEach(id => {
                arrayGrupos.push(+id);
            });
        };

        data.grupos = arrayGrupos;
        this.events = [
            ...this.events,
            {
                title: data.tarea + " - " + data.hora_inicio,
                start: new Date(data.dia.toString().replace(/-/g, "/")),
                meta: data,
                cssClass: stockClass,
                allDay: true

            },
        ];
    }

    crearEvento() {
        let that = this;
        let form = document.getElementById("eventForm");

        let day = form["dia"].value.substring(0, 2);
        let month = form["dia"].value.substring(3, 5);
        let year = form["dia"].value.substring(6);
        let assistants = this.gruposSeleccionados.toString();;

        let obj = {
            tarea: form["tarea"].value,
            descripcion: form["desc"].value,
            nombre: form["nombre"].value,
            telefono: form["telefono"].value,
            direccion: form["direccion"].value,
            hora_inicio: form["horario"].value,
            dia: moment(year + "-" + month + "-" + day).format('YYYY-MM-DD'),
            grupos: assistants,
            latitud: this.latitud,
            longitud: this.longitud
        };

        if (obj.tarea == "" || obj.descripcion == "" || obj.nombre == "" || obj.telefono == "" || obj.hora_inicio == "" || obj.direccion == "" || obj.dia == "") this._toastr.info("Faltan completar datos");

        else {
            $.ajax({
                url: `${environment.API_URL}/event`,
                type: "POST",
                data: obj
            }).done(function (response) {
                that._toastr.success("Evento creado");
                let hora = moment(obj.dia).add("00", 'seconds')
                    .add("00", 'minutes')
                    .add("00", "hours").toString();
                response.dia = hora;
                that.agregarEventoCalendario(response);
                that.refresh.next();
                if (that.uploader.queue.length > 0) {
                    that.idEvento = response.id;
                    that.uploader.uploadAll();
                }

                $('#myModalHorizontal').modal('hide');
            })
        }
    }

    actualizarProyecto() {
        let that = this;

        let grupos = (this.gruposSeleccionados == null) ? null : this.gruposSeleccionados.toString();

        let obj = {
            grupos,
            observaciones: this.observacionesProyecto
        };

        let theId = (<HTMLInputElement>document.getElementById("proyectId"));
        $.ajax({
            url: `${environment.API_URL}/proyectos/` + theId.value,
            type: "PATCH",
            data: obj
        }).done(function (response) {
            that.gruposSeleccionados = "";

            let arrayGrupos = [];

            if (response.grupos.length != 0) {
                let arr = response.grupos.split(',');
                arr.forEach(id => {
                    arrayGrupos.push(+id);
                });
            };

            response.grupos = arrayGrupos;

            that.eventoSeleccionado = response;
            that.refresh.next();
        });
        $('#Calendarmodal').modal('hide');
        //  this.getevents();
        //this.getevents();
    }

    eliminarEvento() {
        let id = document.getElementById("eventForm")["eventId"].value;

        $.ajax({
            url: `${environment.API_URL}/event/` + id,
            type: "DELETE"
        }).done(function (response) {
        });

        this._toastr.success("Evento eliminado");
        document.getElementById("openMod").click();
        this.events = this.events.filter(x => x.meta.id != id);
    }

    showpagesFirst(hide, show) {
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
            let paras = document.getElementsByClassName('modal-backdrop fade in') as HTMLCollectionOf<HTMLElement>;
            for (let i = 0; i < paras.length; i++) {
                paras[i].style.display = "none";
            }
            document.getElementById("proyectoFirstOpen-" + show).click();
            this.myCarrouselPositionFirst = show;
        } else {
            // if (this.itemsToShowFirstFinal.length > 0) {
            this.showpagesFirst(-1, this.itemsToShowFirstFinal.length - 1);
            this.myCarrouselPositionFirst = this.itemsToShowFirstFinal.length - 1;
            let paras = document.getElementsByClassName('modal-backdrop fade in') as HTMLCollectionOf<HTMLElement>;
            for (let i = 0; i < paras.length; i++) {
                paras[i].style.display = "none";
            }
            // }
        }
    };

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

    goToTallerWithProkectId(): void {
        let projectId = (<HTMLInputElement>document.getElementById("proyectId")).value;
        localStorage.setItem('currentProject', projectId);

        //por algun motivo estos overlays se quedaban activos al ir a taller
        let paras = document.getElementsByClassName('modal-backdrop fade in') as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < paras.length; i++) {
            paras[i].style.display = "none";
        }

        $("#Calendarmodal").modal("hide");

        this.router.navigateByUrl('/taller');
    }


    cargarImagenesEvento(id) {
        this.cargandoEvento = true;
        this._http.get(`${environment.API_URL}/eventimage/thumbs/${id}`).subscribe(
            (dataImagenes: any) => {
                this.currentEventImagePath = dataImagenes.path + "/";
                this.currentEventImages = [];
                dataImagenes.imagenes.forEach((item, index) => {
                    this.currentEventImages.push(item);
                });
                this.ref.detectChanges();
                this.cargandoEvento = false;
            });
    }

    mostrarImagenEvento(imagen) {
        $('#imagenEventoPrevisualizacion').attr('src', imagen);
        $('#imagenEventoModal').modal('show');
    }

    visualizarImagen(imagen) {
        this._lightBox.open([{ src: imagen, thumb: imagen }], 0)
    }

    eliminarFotoEvento(imagen) {
        let eventId = (<HTMLInputElement>document.getElementById("eventId")).value;
        this._http.delete(`${environment.API_URL}/eventimage/${imagen}`).subscribe(
            (dataResponse: any) => {
                this.cargarImagenesEvento(eventId);
            });
    }

}
