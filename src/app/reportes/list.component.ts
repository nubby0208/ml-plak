import { EncuestaRespuestaService } from './../services/encuesta_respuesta.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { _window, _$ } from 'app/common';
import { EncuestaTipoService } from 'app/services/encuesta_tipo.service';
import { EncuestaTipo } from 'app/models';
import { forkJoin } from 'rxjs';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { dataflow } from 'googleapis/build/src/apis/dataflow';

@Component({
	selector: 'app-reportes-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})

export class ReportesListComponent implements OnInit {
	@ViewChild('tablaReportesRespondido') table: any;

	public reportes: any = [];
	public reportesFinalizados: any = [];
	public tipo_encuesta = [
		{ id: 1, descripcion: 'Texto libre' },
		{ id: 2, descripcion: 'Si / No' },
		{ id: 3, descripcion: 'Calificación' }
	];

	public encuesta: EncuestaTipo = new EncuestaTipo();
	public idTipoEncuesta: number;
	public editar: boolean = false;

	constructor(private _encuestaTipoService: EncuestaTipoService, private _encuestaRespuesta: EncuestaRespuestaService, private zone: NgZone, private _ngxUiService: NgxUiLoaderService, private _toastr: ToastrService) { }

	ngOnInit() {
		this._ngxUiService.start();
		this.traerEncuestasFinal();
	}

	traerEncuestasFinal() {
		forkJoin([
			this._encuestaRespuesta.getAll(),
			this._encuestaTipoService.getAll()
		]).subscribe((response: any) => {

			if (response[0].length > 0) {

				let arrayFiltrado = [];
				response[0].forEach(element => {
					let filtrado = arrayFiltrado.filter(x => x.proyecto == element.proyecto.proyecto);
					if (filtrado.length == 0) {
						let object = { 'proyecto': element.proyecto.proyecto, 'usuario': element.usuario.usuario, 'data': [] };
						object.data.push({
							'encuesta': element.encuesta,
							'respuesta': element.respuesta
						});
						arrayFiltrado.push(object);
					} else {
						filtrado[0].data.push({
							'encuesta': element.encuesta,
							'respuesta': element.respuesta
						})
					}
					this.reportesFinalizados = arrayFiltrado;
				});
			}

			this.reportes = response[1];
			this._ngxUiService.stop();
		});
	}

	traerEncuesta() {
		this._encuestaTipoService.getAll().subscribe(data => {
			this.reportes = data;
		});
	}

	expandirFila(grupo) {
		this.table.rowDetail.toggleExpandRow(grupo);
	}

	crearEncuesta() {
		if (this.idTipoEncuesta == null || this.encuesta.nombre == '' || this.encuesta.nombre == null) this._toastr.info('Datos incompletos');

		if (this.idTipoEncuesta == 1) this.encuesta.esTexto = true
		else if (this.idTipoEncuesta == 2) this.encuesta.esPregunta = true;
		else this.encuesta.esEstrella = true;

		this._encuestaTipoService.store(this.encuesta).subscribe(data => {
			this._toastr.success("Reporte creado");
			this.traerEncuesta();
			_$('#modal-reporte').modal('hide');
		})
	}

	cambiarEstado(encuesta) {
		encuesta.estado = +(!encuesta.estado);

		this._encuestaTipoService.update(encuesta, encuesta.id).subscribe(data => {
			this._toastr.success("Reporte editado");
			this.traerEncuesta();
			_$('#modal-reporte').modal('hide');
		})
	}

	editarEncuesta() {

		let encuesta = { ...this.encuesta };

		encuesta.esTexto = false;
		encuesta.esPregunta = false;
		encuesta.esEstrella = false;

		if (this.idTipoEncuesta == 1) encuesta.esTexto = true
		else if (this.idTipoEncuesta == 2) encuesta.esPregunta = true;
		else encuesta.esEstrella = true;

		this._encuestaTipoService.update(encuesta, encuesta.id).subscribe(data => {
			this._toastr.success("Reporte editado");
			this.traerEncuesta();
			_$('#modal-reporte').modal('hide');
		})
	}

	seleccionarEncuesta(encuesta: EncuestaTipo) {
		this.editar = true;
		this.encuesta = { ...encuesta };
		this.idTipoEncuesta = (encuesta.esPregunta ? 2 : (encuesta.esTexto) ? 1 : 3);
		_$('#modal-reporte').modal('show');
	}

	modalReporte() {
		this.encuesta = new EncuestaTipo();
		this.idTipoEncuesta = null;
		this.editar = false;
		_$('#modal-reporte').modal('show');
	}

}
