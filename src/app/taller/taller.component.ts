import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EncuestaRespuestaService } from './../services/encuesta_respuesta.service';
import { EncuestaTipo } from './../models';
import { environment } from './../../environments/environment';
import { PdfViewerComponent } from './../pdf-viewer/pdf-viewer.component';
import { ImageGalleryComponent } from './../image-gallery/image-gallery.component';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { _window, _$ } from 'app/common';
// Services
import { AuditoriaService } from './../services/auditoria.service';
import { ClienteService } from './../services/cliente.service';
import { ProyectoService } from './../services/proyecto.service';
import { OptimizarService } from './../services/optimizar.service';
import { EstadoService } from './../services/estado.service';
import { PiezaService } from './../services/pieza.service';
import { TapacantoService } from './../services/tapacanto.service';
import { MaterialService } from './../services/material.service';
import { ModuloService } from './../services/modulo.service';
import { AuthService } from './../services/auth.service';

import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { LocalStorage } from '@ngx-pwa/local-storage';
import swal from 'sweetalert2';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { EncuestaTipoService } from 'app/services/encuesta_tipo.service';
import { Router } from '@angular/router';

const moment = require('moment');

(window as any).moment = moment;

@Component({
    selector: 'app-taller',
    templateUrl: './taller.component.html',
    styleUrls: ['./taller.component.css']
})
export class TallerComponent implements OnInit {
    @ViewChild(PdfViewerComponent) pdf: PdfViewerComponent;
    @ViewChild(ImageGalleryComponent) imgGallery: ImageGalleryComponent;

    // logged: boolean;
    optimizado: string; // Url del ultimo documento pdf optimizado
    inProgress: boolean; // Optimizacion en progreso
    selectedTable: string;
    iframeHeight = '500px';
    public clientes: any = [];
    public proyectos: any = [];
    public clienteSelected: number = 0;
    public proyectoSelected: number = 0;
    public proyectoInfo: any;
    public calcos: any;
    public clienteInfo: any;
    public piezas: any = [];
    public piezasMaterial: any = [];
    public images_project: any = [];
    public user: string;
    public estados: any;
    public tapacantos2Change: any;
    public materiales: any;
    public materialSelected: number = 0;
    public filterPieza: string;
    public moduloModal: number = 0;
    public colorEstado: any = {};
    public colorEstadoBackground: any = {};
    public cliente_proyecto: string = '';
    public comentarioActual: string = '';
    public array_levels_cut: any = [];
    public array_info_levels_cut: any = [];
    public newPanel: any = {};
    public rotacion: string = '';
    public data: any = {};
    public saw_kert: number = 0;
    public trim: number = 0;
    public dpConfig: any;
    public newInfo: any = {
        direccion: { value: '', type: 'cliente' },
        telefono: { value: '', type: 'cliente' },
        valor_total: { value: '', type: 'proyecto' },
        saldo: { value: '', type: 'proyecto' },
        senia: { value: '', type: 'proyecto' },
        instalacion_fecha: { value: '', type: 'proyecto' },
        instalacion_comentario: { value: '', type: 'proyecto' },
        comentario_adicional: { value: '', type: 'proyecto' }
    };
    public editInfo: any = {
        direccion: false,
        telefono: false,
        valor_total: false,
        saldo: false,
        senia: false,
        instalacion_fecha: false,
        instalacion_comentario: false,
        comentario_adicional: false
    };
    public _moment = moment;
    public filterLVeta: any = undefined;
    public filterAVeta: any = undefined;
    public materialesFiltered: any = [];
    public materialesDictionary: any = {};
    public waste: number = 0;
    public loading: boolean = false;
    public materialesDisenio: any = [];
    public modInfo: any = [];
    public showMeta = false;
    public urlOrigin: string = '';
    public usedWaste: boolean = false;
    public responsible: string;
    public haveResponsible: boolean = false;
    public reportes: Array<EncuestaTipo> = Array<EncuestaTipo>();
    public currentRate = 3;
    public optimalonError: any;
    public exportedBy: string;
    public projectUrl: string;
    public cajaInfo: any;
    public externalProjectLinks: any = [];

    constructor(private sanitizer: DomSanitizer, private ref: ChangeDetectorRef, private zone: NgZone,
        private _http: HttpClient, private auditoriaService: AuditoriaService,
        private clienteService: ClienteService, private proyectoService: ProyectoService,
        private estadoService: EstadoService, private piezaService: PiezaService,
        private tapacantoService: TapacantoService, private toastr: ToastrService,
        private materialService: MaterialService, private moduloService: ModuloService,
        private permissionService: NgxPermissionsService, private authService: AuthService,
        private optimizarService: OptimizarService, private localStorage: LocalStorage, private _encuesta: EncuestaTipoService,
        private _encuestaRespuestaService: EncuestaRespuestaService, private _ngxLoader: NgxUiLoaderService,
        public _router: Router) { }

    ngOnInit() {
        this._ngxLoader.start();
        this.urlOrigin = window.location.origin + window.location.pathname;
        this.dpConfig = {
            format: 'YYYY/MM/DD HH:mm'
        };

        // this.permissionService.loadPermissions(['Usuario']);
        this.zone.run(() => {
            let currentProject = parseInt(localStorage.getItem('currentProject'));
            if (currentProject > 0) {
                this.proyectoSelected = currentProject;
                this.onChangeProyecto(currentProject);
            }

            // console.log('pmierssion', this.permissionService.getPermissions());
            // if (!this.authService.isTokenExpired()) {
            this.clienteService.getAll().subscribe((response: any) => {
                this.clientes = [{ id: 0, nombre_completo: 'Seleccione un cliente' }];
                this.clientes = this.clientes.concat(response.clientes);
                this._ngxLoader.stop();

            });

            this.estadoService.getAll().subscribe((response: any) => {
                this.estados = response.estados;
            });

            // this.materialService.getAll().subscribe(response => {
            //     this.materiales = [{id: 0, material: 'Seleccione un material'}];
            //     this.materiales = this.materiales.concat(response.materiales);
            // });
        });

        /**
         * TODO Pasar como campo de tabla estados. Ya que se utiliza para todos los estados
         */
        this.colorEstado = {
            'Seleccione un estado': '#FFFFFF',
            'Falta': '#F1948A',
            'Suspendido': '#ABB2B9',
            'OK': '#7DCEA0',
            'Pedido': '#85C1E9',
            'En proceso': '#F9E79F',
            'Stock': '#C39BD3',
            'Tira': '#C39BD3',
            'Optimizar': '#2987c5'
        };
        /**
         * TODO Pasar como campo de tabla estados. Ya que se utiliza para todos los estados
         */
        this.colorEstadoBackground = {
            'Seleccione un estado': '#FFFFFF',
            'Falta': '#f1948a33',
            'Suspendido': '#abb2b933',
            'OK': '#7dcea033',
            'Pedido': '#85c1e91a',
            'En proceso': '#f9e79f1a',
            'Stock': '#c39bd31a',
            'Tira': '#c39bd31a',
            'Optimizar': '#2987c533'
        };

        this.array_info_levels_cut[2] = 'XY-Cut (Level 2): La forma más simple de cortar paneles, pero la peor utilización del material.';
        this.array_info_levels_cut[3] = 'Two-Stage XY (Level 3): La versión mejorada del corte XY';
        this.array_info_levels_cut[4] = 'XYZ-cut (Level 4): Un nivel más de corte en dirección horizontal';
        this.array_info_levels_cut[5] = 'XYZW-cut (Level 5): Mejor utilización del material';
        this.array_info_levels_cut[6] = 'Standard-cut (Level 6): Produce la mayor tasa de utilización del material y la menor cantidad de residuos';

        let self = this;
        this.newPanel = {
            nombre: '',
            largo: '',
            ancho: '',
            cantidad: 0
        }

        this.data = {
            panels: [],
            parts: [],
            infoProject: [],
        };

        this.data.infoProject = { projectName: 'Cliente', sawKerf: 4, trim: 7, cut_level: '' };
        this.localStorage.getItem('panels').subscribe((panels) => {
            self.data.panels = JSON.parse(panels) || [];
        })
        // this.data.panels = this.localStorage.getItem('panels');
        //this.data.panels = JSON.parse(localStorage.getItem('panels')) || {};
        /*this.data.panels = this.localStorage.getItem('panels').subscribe((panels) => {
          return JSON.stringify(panels);
        });*/

        this.traerEncuesta();
    }

    public updateProjectLink(id) {
        if (id) {
            let sid = '' + id
            while (sid.length < 5) {
                sid = '0' + sid;
            }
            this.projectUrl = '/disenio/#/DesignCenter/' + Math.floor(Math.random() * 100000) + sid + Math.floor(Math.random() * 100000);
        } else {
            this.projectUrl = undefined;
        }
    }

    public observacionesCalendario() {
        this._router.navigate(['/Calendario', { id: this.proyectoInfo.id }]);
    }

    public finalizarProyecto() {
        document.getElementsByClassName('tab-pane active')[0].classList.remove('active');
        document.getElementById('encuesta').classList.add('active');
    }

    public enviarReporte() {
        let usuario = JSON.parse(localStorage.getItem('usuario')).id;

        let sinCompletar = this.reportes.filter(x => x.descripcion == "");

        if (sinCompletar.length == 0) {
            let obj = {
                reportes: this.reportes,
                id: this.proyectoInfo.id,
                usuario
            };

            this._encuestaRespuestaService.store(obj).subscribe(data => {
                this.toastr.success('Gracias por tomar su tiempo');
                this.onChangeProyecto(obj.id);
                this.traerEncuesta();
                document.getElementsByClassName('tab-pane active')[0].classList.remove('active');
                document.getElementById('general').classList.add('active');
            })
        }
        else this.toastr.info("Complete la encuesta");
    }

    public reabrirProyecto() {
        this._encuestaRespuestaService.update(this.proyectoInfo, this.proyectoInfo.id).subscribe((data: any) => {
            this.onChangeProyecto(data.id);
        }, (err) => this.toastr.error(err.error))
    }

    public traerEncuesta() {
        this._encuesta.getAll().subscribe((data: any) => {
            data = data.filter(x => x.estado == true);
            console.log(data.length);
            if (data.length > 0)
                data.forEach(x => x.descripcion = "");

            this.reportes = data;
        })
    }

    public onChangeCliente(cliente_id: number): void {
        if (cliente_id !== 0) {
            this.clienteService.getProyectos(cliente_id).subscribe((response: any) => {
                this.proyectos = [];
                // this.proyectos = [{id: 0, proyecto: 'Seleccione un proyecto'}];
                this.proyectos = this.proyectos.concat(response.proyectos);
                // console.log(response.proyectos);
            });
        }
    }

    public round(n, decimals = 2) {
        let negative = false
        if (n < 0) {
            negative = true
            n = n * -1
        }
        var multiplicator = Math.pow(10, decimals)
        n = parseFloat((n * multiplicator).toFixed(11))
        n = (Math.round(n) / multiplicator).toFixed(decimals)
        if (negative) {
            n = (n * -1).toFixed(decimals)
        }
        return n
    }

    public getPlacas(material) {
        const mat = this.materialesDictionary[material.nombre];
        if (mat) {
            const available = (100 - this.waste) / 100
            const placa = (mat.ancho_veta * mat.largo_veta) / 1000000
            const placaAvailable = material.cantidad / (placa * available)
            return placaAvailable
        }
    }

    public getStockTableRowBackgroundColor(stateId: number): string {
        switch (+stateId) {
            case 1:
                return this.colorEstadoBackground['Falta'];
            case 3:
                return this.colorEstadoBackground['OK'];
            case 4:
                return this.colorEstadoBackground['Pedido'];
            case 6:
                return this.colorEstadoBackground['Stock'];
            default:
                return this.colorEstadoBackground['Seleccione un estado'];
        }
    }

    public openLink(link: string) {
        window.open(link.indexOf('http://') === -1 ? 'http://' + link : link, "_blank");
    }

    public processMetadata(projectMetadata: any) {
        try {
            const metadata = projectMetadata.metadata;
            const materiales = metadata.find((el: any) => el.key === 'materiales');
            this.materialesDisenio = [];
            const projectInfo = metadata.find((el: any) => el.key === 'project_info');
            if (materiales && materiales.value) {
                // materiales.value.forEach(material => {
                // 	this.materialesDisenio.push(material);
                // });
                Object.keys(materiales.value).forEach(material => {
                    this.materialesDisenio.push(materiales.value[material]);
                });
            }

            if (projectInfo && projectInfo.value) {
                this.externalProjectLinks = projectInfo && projectInfo.value.links;
            }
            this.modInfo = metadata.filter((el: any) => el.key.indexOf('Mod ') > -1).map(mod => mod.value);
            const wasteMeta = metadata.find((el: any) => el.key === 'placa_waste');
            this.waste = wasteMeta ? +wasteMeta.value : this.waste;
            const exportadoPor = metadata.find((el: any) => el.key === 'exportado_por');
            this.exportedBy = exportadoPor ? exportadoPor.value : 'No disponible';
            const idMeta = metadata.find((el: any) => el.key === 'project_id');
            this.updateProjectLink(idMeta ? idMeta.value : undefined);
        } catch (error) {
            console.log('error', error)
        }
    }

    public onChangeProyecto(proyecto_id: number): void {
        console.log(proyecto_id);
        this._ngxLoader.start();
        this.haveResponsible = false;
        this.waste = 0;
        this.images_project = [];
        if (proyecto_id > 0) {
            localStorage.setItem('currentProject', '' + proyecto_id);
            forkJoin([
                this.proyectoService.getByIdAll(proyecto_id),
                this.proyectoService.getCalcosMetadata(proyecto_id),
                this.proyectoService.getProyectoMetadata(proyecto_id),
                this.materialService.getMaterialesPorTipo('P')
            ]).subscribe((response: any) => {
                this.processMetadata(response[2]);
                this._ngxLoader.stop();
                this.loading = false;
                this.proyectoInfo = response[0].proyecto;
                this.cajaInfo = this.parseCajaInfo(response[2]);
                this.calcos = this.parseCalcoMetadataResponse(response[1].calcos);
                this.materialesFiltered = [{ id: 0, material: 'Seleccione un material' }];
                const materiales = response[3].materiales;

                if (response[0].proyecto.responsible != null) {
                    this.haveResponsible = true;
                }

                this.clienteInfo = this.proyectoInfo.cliente;
                this.piezas = [];

                for (let i = 0; i < this.proyectoInfo.modulos.length; i++) {
                    let piezas = this.proyectoInfo.modulos[i]['piezas'];
                    this.piezas = this.piezas.concat(piezas);
                }
                let filtered = [];
                this.piezas.map(item => {
                    let tmp = [];
                    item.show = true;
                    item.rotable = 'NO';

                    tmp = this.materialesFiltered.filter(material => material.id == item.material_id);

                    if (tmp.length === 0) {
                        this.materialesFiltered.push(item.material);
                        this.materialesDictionary[item.material.material] = materiales.find(mat => mat.material === item.material.material)
                    }
                });

                this.piezas = this.piezas.sort((valueA, valueB) => {
                    if (valueA.id_aux < valueB.id_aux)
                        return -1;
                    else if (valueA.id_aux > valueB.id_aux)
                        return 1;

                    return 0;
                });

                this.proyectoInfo.piezas = this.piezas;
                this.data.infoProject.projectName = this.clienteInfo.nombre_completo + ' ' + this.proyectoInfo.proyecto;
                if (this.proyectoInfo.token_project)
                    this.proyectoService.getImagesProject(this.proyectoInfo.token_project).subscribe((response: any) => {
                        this.images_project = response.response.imagenes;
                    });
            });
        }
    }

    public doPrint(elem) {
        const popupWin = window.open('', 'Imprimir calcomania', 'width=600,height=600');
        popupWin.document.open();
        popupWin.document.write(`<html>
            <head>
                <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css" />
                <link rel="stylesheet" type="text/css" href="assets/css/calcos.css" />
            </head>
            <body onload="window.print()">
                <div class="calco-view"> ${elem}</div>
            </body>
            </html>`
        );
        popupWin.document.close();
        return true;
    }

    public seeCalco(pieza) {
        const calcoMeta = this.getCalcoMetaFromPieza(pieza);
        if (!calcoMeta) {
            return;
        }
        swal({
            title: `${pieza.pieza}`,
            html: `<div class="calco-view" style="padding:20px">${calcoMeta.calcos.join('<div class="page-break"></div>')}</div>`,
            showCloseButton: true,
            focusConfirm: true
        })
    }

    public printCalco(pieza) {
        const calcoMeta = this.getCalcoMetaFromPieza(pieza);
        if (!calcoMeta) {
            return;
        }
        this.doPrint(calcoMeta.calcos.join('<div class="page-break"></div>'))
    }

    private copyObj(obj) {
        return JSON.parse(JSON.stringify(obj));
    }


    private getCalcoMetaFromPieza(pieza) {
        const meta = this.copyObj(this.calcos[pieza.id]);
        return meta;
    }

    public changeEstadoPieza(pieza, estado_id, estado_key = 'estado_id', etapa = 'corte'): void {
        if (pieza.comentario != undefined && pieza.comentario != null) {
            swal({ title: 'Comentarios', text: pieza.comentario, type: 'question', showCancelButton: true })
                .then((result) => {
                    if (result.value) {
                        this.changeEstadoPiezaPost(pieza, estado_id, estado_key, etapa);
                    }
                });
        } else {
            this.changeEstadoPiezaPost(pieza, estado_id, estado_key, etapa);
        }
    }

    public optimizarTodo() {
        let counter = 0;
        this.piezas.forEach(pieza => {
            if (+pieza.estado_id === 9) {
                pieza.estado_id = 8;
                this.onChangeEstadoPieza(pieza.estado_id, pieza, 'estado_id', 'corte', false);
                counter++;
            }
        });
        if (counter > 0) {
            this.toastr.success(counter + ' piezas actualizadas');
        } else {
            this.toastr.info('No se actualizo ninguna pieza');
        }
    }

    public onChangeEstadoPieza(estado_id, pieza, estado_key = 'estado_id', etapa, mostrarMensajes = true): void {
        if (mostrarMensajes) {
            this.toastr.info('Actualizando estado de pieza...');
        }

        let data = { id: pieza.id, usuario: '', etapa: etapa };
        data[estado_key] = parseInt(estado_id);
        data.usuario = this.authService.getUsuario().usuario;

        this.piezaService.update(data).subscribe(
            (response: any) => {
                if (response.pieza) {
                    switch (estado_key) {
                        case 'estado_id': {
                            pieza.estado = response.pieza.estado;
                            break;
                        }
                        case 'prearmado_estado_id': {
                            pieza.prearmado = response.pieza.prearmado;
                            break;
                        }
                        case 'tapacantos_estado_id': {
                            pieza.tapacantos_estado_id = response.pieza.tapacantos_estado_id;
                        }
                    }

                    if (mostrarMensajes) {
                        this.toastr.success('¡Pieza actualizada!');
                    }
                }
            }, error => {
                console.log(error);
            });
    }

    public changeEstadoPiezaPost(pieza, estado_id, estado_key = 'estado_id', etapa): void {
        this.toastr.info('Actualizando estado de pieza...');
        let data = { id: pieza.id, usuario: '', etapa: etapa };
        data[estado_key] = parseInt(estado_id);
        data.usuario = this.authService.getUsuario().usuario;

        this.piezaService.update(data).subscribe(
            (response: any) => {
                if (response.pieza) {
                    switch (estado_key) {
                        case 'estado_id': {
                            pieza.estado = response.pieza.estado;
                            pieza.estado_id = response.pieza.estado.id;
                            break;
                        }
                        case 'prearmado_estado_id': {
                            pieza.prearmado = response.pieza.prearmado;
                            pieza.prearmado_estado_id = response.pieza.prearmado.id;
                            break;
                        }
                    }
                    if (response.pieza.estado_id === 3 && estado_key === 'estado_id') {
                        this.printCalco(response.pieza);
                    }

                    this.toastr.success('¡Pieza actualizada!');
                }
            }, error => {
                console.log(error);
            }
        );
    }

    public applyEstado(event, pieza, index): void {
        this.piezaService.update(pieza).subscribe((response: any) => {
            this.piezas[index] = response.pieza;
            if (response.pieza) {
                this.toastr.success('¡Pieza actualizada!');
            }
        });
    }

    public changeTapacantos($event, pieza): void {
        this.tapacantos2Change = pieza.tapacantos;
        _$('#change-tapacantos').modal('show');
    }

    public modalComentario($event, comentario): void {
        this.comentarioActual = comentario;
        _$('#modal-comentario').modal('show');
    }

    public applyEstadoTapacanto(event, tapacanto, index): void {
        this.tapacantoService.update(tapacanto).subscribe((response: any) => {
            if (response.tapacanto) {
                this.toastr.success('¡Tapacanto actualizado!');
            }
        });
    }

    public onChangeMaterial(material_id): void {

        let piezasFiltered: any = []; //this.proyectoInfo.piezas;

        this.piezas.map(item => {
            if ((parseInt(material_id) === 0) || (item.material_id == parseInt(material_id))) {
                piezasFiltered.push(item);
                item.show = true // ( (material_id == 0) ? true : (item.material_id == parseInt(material_id) ) );
            } else {
                item.show = false;
            }
        });

        this.piezasMaterial = piezasFiltered;
        this.newPanel.nombre = this.piezasMaterial[0].material.material;
        /*this.piezas.map(item => {
            item.show = (material_id == 0) ? true : (item.material_id == material_id);
        });*/

        // this.piezas = piezasFiltered;
    }

    public onChangeFilterLVeta(lveta: string): void {
        let piezasFiltered = this.proyectoInfo.piezas;
        this.filterLVeta = lveta ? +lveta : undefined;

        if (!this.filterLVeta && !this.filterAVeta) {
            this.onChangeMaterial(this.materialSelected);
        } else {
            piezasFiltered.map(item => {
                const filterAVeta = this.filterAVeta ? item.aveta === this.filterAVeta : true;
                const filterLVeta = this.filterLVeta ? item.lveta === this.filterLVeta : true;
                item.show = (item.estado_id !== 3) && filterAVeta && filterLVeta;
            });

            this.piezas = piezasFiltered;
        }
    }

    public onChangeFilterAVeta(aveta: string): void {
        let piezasFiltered = this.proyectoInfo.piezas;
        this.filterAVeta = aveta ? +aveta : undefined;

        piezasFiltered.map(item => {
            const filterAVeta = this.filterAVeta ? item.aveta === this.filterAVeta : true;
            const filterLVeta = this.filterLVeta ? item.lveta === this.filterLVeta : true;
            item.show = item.estado_id !== 3 && filterAVeta && filterLVeta
        });

        this.piezas = piezasFiltered;
    }

    public onChangeFilterPieza(search: string): void {
        let piezasFiltered = this.proyectoInfo.piezas;
        search = search.toLowerCase();

        if ((search.length > 0)) {
            piezasFiltered.map(item => {
                item.show = ((item.pieza.toLowerCase().indexOf(search) != -1) || (item.material.material.toLowerCase().indexOf(search) != -1));
            });
        }

        this.piezas = piezasFiltered;
    }

    public tapacantosOk(tapacantos: any): number {
        let count = 0;
        tapacantos.map(item => {
            if (item.estado_id == 3)
                count += 1;
        });

        return count;
    }

    public wEstadoOk(items, property = 'estado_id'): number {
        if (!items || items.length <= 0)
            return 0;

        let count = 0;

        items.map(item => {
            if (item[property] == 3) {
                count += 1;
            }
        });

        return count;
    }

    public totalEstadoOk(items, property = 'estado_id'): string {
        if (!items || items.length <= 0)
            return '0';

        return (this.wEstadoOk(items, property) / items.length * 100).toFixed(2);
    }

    public totalEstadoOkTapacantos(items = this.piezas): any {
        let data = items.filter(item => {
            return ((item.tapacantos) && (item.tapacantos.length > 0)
                && (item.tapacantos.length === this.tapacantosOk(item.tapacantos)));
        });
        // console.log('t ', data);

        return data.length || 0;
    }

    public wTapacantos(items = this.piezas): any {
        let data = items.filter(item => {
            return item.tapacantos && (item.tapacantos.length > 0);
        });

        // console.log('w ', data);

        return data.length || 0;
    }

    public onChangeEstadoTapacanto(estado_id, tapacanto): void {
        let data = { id: tapacanto.id, usuario: '', estado_id: parseInt(estado_id) };
        this.toastr.info('Actualizando estado de tapacanto...');
        data.usuario = this.authService.getUsuario().usuario;
        this.tapacantoService.update(data).subscribe((response: any) => {
            if (response.tapacanto) {
                this.toastr.success('¡Tapacanto actualizado!');
            }
        });
    }

    public filterMaterialExist(material_id): boolean {
        for (var i = 0; i < this.piezas.length; i++) {
            if ((this.piezas[i].material_id === material_id) || (material_id == 0)) {
                return true;
            }
        }

        return false;
    }

    public terminarTodosLosTapacantos(pieza): void {
        if (pieza.comentario != undefined && pieza.comentario != null) {
            swal({ title: 'Comentarios', text: pieza.comentario, type: 'question', showCancelButton: true })
                .then((result) => {
                    if (result.value) {
                        this.terminarTodosLosTapacantosPost(pieza);
                    }
                });
        } else {
            this.terminarTodosLosTapacantosPost(pieza);
        }
    }

    public terminarTodosLosTapacantosPost(pieza): void {
        this.toastr.info('Actualizando estado de tapacanto...');
        pieza.tapacantos.map(item => {
            item.estado_id = 3;
            let data = { id: item.id, estado_id: parseInt(item.estado_id) };
            this.tapacantoService.update(data).subscribe(response => { });
        });
        this.toastr.success('¡Tapacanto actualizado!');
    }

    public handlerSwalTapacantos(event): void {
        // console.log(event);
        if (event.value === true) {
            this.tapacantos2Change.map(item => {
                // console.log('all-tapacantos');
                item.estado_id = 3;
                this.onChangeEstadoTapacanto(3, item);

                _$('#change-tapacantos').modal('hide');
            });
        } else if (event.dismiss && event.dismiss.length > 0) {
            this.toastr.info('Acción cancelada');
        }
    }

    public showModalPiezas(modulo_id, modulo): void {
        this.moduloModal = modulo.id;
        _$('#list-piezas').modal('show');
    }

    public getPiezasModulo(modulo_id: number = 0): any {
        let piezas = [];

        if ((this.piezas) && modulo_id === 0) {
            piezas = this.piezas.filter(item => {
                return (item.modulo_id === this.moduloModal);
            });
        }

        return piezas;
    }

    public getEstado(estado_id: number = 0): string {
        for (var i = 0; i < this.estados.length; i++) {
            if (this.estados[i].id == estado_id) {
                return this.estados[i].estado;
            }
        }
    }

    public changeEstadoModuloPost(modulo, estado_id): void {
        this.toastr.info('Actualizando estado de módulo...');
        let data = { id: modulo.id, estado_id: parseInt(estado_id) };

        this.moduloService.update(data).subscribe((response: any) => {
            if (response.modulo) {
                modulo.estado = response.modulo.estado;
                modulo.estado_id = response.modulo.estado_id;
                this.toastr.success('¡Módulo actualizado!');
            }
        });
    }

    public changeEstadoModulo(modulo, estado_id): void {
        if (modulo.comentario != undefined && modulo.comentario != null) {
            swal({ title: 'Comentarios', text: modulo.comentario, type: 'question', showCancelButton: true })
                .then((result) => {
                    if (result.value) {
                        this.changeEstadoModuloPost(modulo, estado_id);
                    }
                });
        } else {
            this.changeEstadoModuloPost(modulo, estado_id);
        }
    }

    public onChangeEstadoModulo(estado_id, modulo): void {
        this.toastr.info('Actualizando estado de módulo...');
        let data = { id: modulo.id, estado_id: parseInt(estado_id), armar: modulo.armado };

        this.moduloService.update(data).subscribe((response: any) => {
            if (response.modulo) {
                modulo.estado = response.modulo.estado;
                this.toastr.success('¡Módulo actualizado!');
            }
        });
    }

    public classTapacantos(tapacantos, pieza): string {
        let cant = 0;

        if (tapacantos.length === 0) {
            cant = (pieza.tapacantos_estado_id === 3) ? 100 : 0;
        } else {
            cant = (this.tapacantosOk(tapacantos) / tapacantos.length) * 100;
        }
        // console.log(cant);

        if (cant === 0)
            return 'info';
        else if (cant >= 0 && cant < 61)
            return 'danger';
        else if (cant >= 61 && cant < 100)
            return 'warning';
        else if (cant === 100)
            return 'success';
    }

    public colorProgreso(progreso: string): string {
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

    public getProgresoGeneral(): any {
        let cant = (parseFloat(this.totalEstadoOk(this.piezas))
            + parseFloat((this.totalEstadoOkTapacantos() / this.wTapacantos() * 100).toFixed(2))
            + parseFloat(this.totalEstadoOk(this.piezas, 'prearmado_estado_id'))
            + parseFloat(this.totalEstadoOk(this.proyectoInfo ? this.proyectoInfo.modulos : 0)));

        // console.log('piezas', this.totalEstadoOk(this.piezas));
        // console.log('tapacantos: ', (this.totalEstadoOkTapacantos()/this.wTapacantos()*100).toFixed(2));
        // console.log('prearmado: ', this.totalEstadoOk(this.piezas, 'prearmado_estado_id'));
        // console.log('modulos: ', this.totalEstadoOk(this.proyectoInfo ? this.proyectoInfo.modulos : 0));
        // console.log('total: ', cant);
        // console.log('total/4: ', (cant)/4);
        return isNaN(cant) ? 0 : ((cant) / 4).toFixed(2);
    }

    public getModulosCajones(option: string = 'cajones', items = []): any {
        if (items.length == 0) {
            if (this.proyectoInfo)
                items = this.proyectoInfo.modulos;
            else
                return [];
        }

        let condition = (option === 'cajones') ? 1 : 0;

        let data = items.filter(item => {
            return (item.is_cajon == condition);
        });

        return data;
    }

    viewGallery() {
        this.imgGallery.openGallery(this.images_project);
    }

    private parseCajaInfo(response) {
        const cajaInfoMeta = response.metadata.find(m => m.key === 'caja') || {};
        return cajaInfoMeta.value;
    }

    private parseCalcoMetadataResponse(response) {
        let calcoMap = {};
        response.forEach(element => {
            const index = element.pieza_id;
            if (!calcoMap[index]) {
                calcoMap[index] = { id: element.pieza_id, name: element.pieza, calcos: [] };
            }

            if ((element.calco.indexOf(element.pieza) > -1) && !(element.calco.indexOf(element.pieza + ' (') > -1)) {
                calcoMap[index].calcos.push(element.calco);
            }
        });
        return calcoMap;
    }

    private getBloque(): number {
        const now = moment();

        if (now.isBetween(moment('06:00', 'HH:mm'), moment('09:00', 'HH:mm'))) {
            return 0;
        }

        if (now.isBetween(moment('09:00', 'HH:mm'), moment('10:45', 'HH:mm'))) {
            return 1;
        }

        if (now.isBetween(moment('10:45', 'HH:mm'), moment('13:00', 'HH:mm'))) {
            return 2;
        }

        if (now.isBetween(moment('13:00', 'HH:mm'), moment('14:45', 'HH:mm'))) {
            return 3;
        }

        if (now.isBetween(moment('14:45', 'HH:mm'), moment('16:10', 'HH:mm'))) {
            return 4;
        }

        if (now.isBetween(moment('16:10', 'HH:mm'), moment('17:00', 'HH:mm'))) {
            return 5;
        }

        return 6;
    }

    modalOptimizar() {

        if (_$('#proyecto').val() <= 0 || _$('#cliente').val() <= 0)
            this.toastr.error('¡Primero debe Seleccionar un Cliente y luego un Proyecto!');
        else if (_$('#material').val() <= 0)
            this.toastr.error('¡No ha Seleccionado ningun Material!');
        else {
            this.optimalonError = undefined;
            this.inProgress = false;
            _$('#modal_optimizacion').modal('show');
            //$('#material_optimizar').empty().append(this.piezasMaterial[0].material.material);
            this.getOptimization();

        }//end else

    }

    enviarOptimizacion() {
        this.optimalonError = undefined;
        this.data.parts = [];
        let rotable = '';
        let self = this;
        this.piezasMaterial.map(item => {
            if (item.estado.estado === 'Optimizar') {
                if (self.rotacion === 'seleccionadas' || !self.rotacion) {
                    rotable = item.rotable === 'SI' ? 'YES' : 'NO';
                } else {
                    rotable = self.rotacion === 'todas' ? 'YES' : 'NO';
                }

                self.data.parts.push({
                    "estado": 'Yes',
                    "nombre": item.pieza,
                    "lveta": item.lveta,
                    "aveta": item.aveta,
                    "cantidad": item.cantidad,
                    "rotable": rotable,
                });
            }

        });

        if (this.inProgress) {
            return;
        }

        this.inProgress = true;
        this._http.post(environment.OPTIMIZATION_URL, { 'data': this.data })
            .toPromise()
            .then(response => {
                this.inProgress = false;
                self.optimizado = 'ok';
                this.toastr.success('¡EL Proceso de Optimizacion Finalizo con Exito!');
            })
            .catch(response => {
                this.toastr.error('Se ha producido un error en optimalon');
                this.inProgress = false;
                this.optimalonError = response.error && $($($.parseHTML(response.error.vue)).find('p')[0]).html();
            });
    }

    // Obtener ultima optimizacion del proyecto
    getOptimization() {
        let self = this;
        this.optimizarService.getOptimizacion(self.data.infoProject.projectName).subscribe(response => {
            self.optimizado = response.optimizado;
        })
    }

    download_pdf() {
        this.pdf.onFileSelected(this.data.infoProject.projectName, true);
    }

    verOptimizacion() {
        this.pdf.onFileSelected(this.data.infoProject.projectName, false);
    }

    onChangeCut($event): void {
        this.toastr.info(this.array_info_levels_cut[this.data.infoProject.cut_level])
    }

    addPanel() {
        if (!this.newPanel.nombre || !this.newPanel.largo || !this.newPanel.ancho || !this.newPanel.cantidad) {
            this.toastr.error('Completa la informacion del panel')
        } else {
            this.data.panels.push({
                nombre: this.newPanel.nombre,
                largo: this.newPanel.largo,
                ancho: this.newPanel.ancho,
                cantidad: this.newPanel.cantidad
            })
            let self = this;
            this.localStorage.setItem('panels', JSON.stringify(this.data.panels)).subscribe(() => { });
            //this.localStorage.setItem('panels', this.data.panels).subscribe(() => {});
            this.newPanel.nombre = this.piezasMaterial[0].material.material;
            this.newPanel.largo = ''
            this.newPanel.ancho = ''
            this.newPanel.cantidad = 0
        }
    }

    removePanel(index) {
        let self = this;
        this.data.panels.splice(index, 1);
        this.localStorage.removeItem('panels').subscribe(() => { });
        this.localStorage.setItem('panels', JSON.stringify(self.data.panels)).subscribe(() => { });
    }

    validacionesEnvio(data) {
        let errors: boolean = false;
        let array_errores: any = [];
        if (data.parts.length == 0) {
            this.toastr.error('!No ha seleccionado Piezas para Optimizar');
            errors = true;
        }


        if (data.panels.length == 0) {
            this.toastr.error('!No ha Cargado Ningun Panel Optimizar');
            errors = true;
        }


        $('#parametros_material_optimizar input').each(function (id, input) {
            if ($(input).val() == '') {
                array_errores.push('!Faltan Campos Por Agregar al  panel del material');
                errors = true;
                return false;
            }

        });

        $('.panel_adicional input').each(function (id, input) {
            if ($(input).val() == '') {
                array_errores.push('!Faltan Campos Por Agregar al panel adicional');
                errors = true;
                return false;
            }

        });
        if (array_errores.length > 0)
            this.toastr.error(array_errores);


        //validar que se seleccione la rotacion
        /*let rotables = 0;
        let ckeck = $('input:radio[name=rotacion]:checked').attr('id');
        $( ".rotable").each(function(id, select ){
        if( $( select ).val() == 'SI' )
            rotables++;
        });*/

        /*if( ckeck == 'seleccionadas' && rotables <=0 )
        {
        this.toastr.error( '!No ha Selecionado ninguna pieza para Rotar,  ' );
            errors = true;

        }*/


        return errors;
    }

    public onEditInfo(property: string = '') {
        if (this.newInfo[property].type === 'cliente')
            this.newInfo[property].value = this.clienteInfo[property];
        else
            this.newInfo[property].value = this.proyectoInfo[property];

        this.editInfo[property] = !this.editInfo[property];
    }

    public onOkEditInfo(property: string = '') {
        let data = { id: 0 };
        data[property] = this.newInfo[property].value;

        if (this.newInfo[property].type === 'cliente') {
            this.toastr.info('Actualizando cliente...');
            data.id = this.clienteInfo.id;

            this.clienteService.update(data).subscribe((response: any) => {
                if (response.status == true) {
                    this.toastr.success('Cliente actualizado con éxito');
                    this.editInfo[property] = !this.editInfo[property];
                    this.clienteInfo[property] = data[property];
                }
            });
        } else {
            this.toastr.info('Actualizando proyecto...');
            data.id = this.proyectoInfo.id;

            this.proyectoService.update(data).subscribe((response: any) => {
                if (response.status == true) {
                    this.toastr.success('Proyecto actualizado con éxito');
                    this.editInfo[property] = !this.editInfo[property];
                    this.proyectoInfo[property] = data[property];
                }
            });
        }
    }

    public onCancelEditInfo(property: string = '') {
        this.editInfo[property] = !this.editInfo[property];
    }

    public onChangeMetadataMaterialEstado(estado_id: number, material: any) {
        this.toastr.info('Actualizando estado de material de stock...');
        const data = { id: material.id, estado_id: estado_id };

        this.proyectoService.metadataMaterialUpdate(data).subscribe((response: any) => {
            if (response.success) {
                material.estado_id = response.material.estado_id;
                this.toastr.success('¡Material de stock actualizado!');
            }
        });
    }

    public GoResponsible() {

        swal({ title: 'Encargado de proyecto', text: '¿Quiere ser el encarngado de este proyecto?', type: 'question', showCancelButton: true })
            .then((result) => {
                if (result.value) {
                    let user = JSON.parse(localStorage.getItem('usuario'))
                    this.proyectoService.setResponsible(this.proyectoInfo, user).subscribe((res: any) => {
                        if (res.success == 1) {
                            this.onChangeProyecto(this.proyectoInfo.id);
                        }
                    });

                }
            });
    }

    public openCajaDetails() {
        _$('#modal-detalle-pago').modal('show');
    }

    public deleteResponsible() {
        swal({ title: 'Encargado de proyecto', text: '¿Quiere remover al encargado de este proyecto?', type: 'question', showCancelButton: true })
            .then((result) => {
                if (result.value) {
                    this.proyectoService.deleteResponsible(this.proyectoInfo.id).subscribe((res: any) => {
                        if (res.status == 'success') {
                            swal({
                                text: 'Proceso realizado correctamente',
                                type: 'success',
                                showCancelButton: false
                            })
                            this.haveResponsible = false;
                            this.onChangeProyecto(this.proyectoInfo.id);
                        }
                    });
                }
            });
    }

    public alert() {
        if (!this.haveResponsible) {
            swal({
                text: 'Este proyecto aun no tiene un encargado, designese como encargado, o póngase en contacto con el encargado de proyecto',
                type: 'info',
                showCancelButton: false
            })
        }
    }
}
