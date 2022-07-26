import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { NgForm, NgModel, DefaultValueAccessor, NgControl } from '@angular/forms';
import { Router } from '@angular/router';
import { _window, _$ } from 'app/common';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { UsuarioService } from './../services/usuario.service';
import { AsistenciaService } from './../services/asistencia.service';
import { Usuario } from './../models';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { fieldSorter } from './../utils';

@Component({
	selector: 'app-asistencia-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})

export class AsistenciaListComponent implements OnInit {
	@ViewChild(DaterangePickerComponent)
	private picker: DaterangePickerComponent;

	public usuarios: Array<Usuario> = [];
	public asistencias: Array<any> = [];
	public ingresos: any = 0;
	public salidas: any = 0;
	public form: any = { usuario_id: 0, fecha_inicio: moment().format('YYYY-MM-DD'), fecha_fin: moment().format('YYYY-MM-DD') };
	public calculadora: any = { dias_trabajados: this.ingresos, sueldo_dia: 0, horas_extras: 0, valor_horas_extras: 0, total_sueldo: 0, total_horas_extras: 0, pcd: 0, observacion: '', compensacion: 0, descuento: 0 }
	public dateRange: string = '';
	public dataPdf: any = {
		asistencias: this.asistencias,
		calculadora: this.calculadora,
		path: ''
	}
	public daterange: any;
	public sortCausaSalida = 'causaSalida'

	constructor(private usuarioService: UsuarioService, private zone: NgZone,
		private asistenciaService: AsistenciaService) { }

	ngOnInit() {
		this.usuarios.push(new Usuario);
		this.usuarios[0].usuario = 'Todos';
		this.usuarios[0].id = 0;

		this.zone.run(() => {
			this.usuarioService.getAll().subscribe((data: any) => {
				this.usuarios = this.usuarios.concat(data.usuarios);
			});
		});
	}

	public reloadAsistencias() {
		console.log(this.form);
		this.asistenciaService.getByUsuarioFecha(parseInt(this.form.usuario_id), this.form.fecha_inicio, this.form.fecha_fin).
			subscribe((data: any) => {
				if (data.asistencias.length) {
					data.asistencias.forEach(asistencia => {
						asistencia.causaSalida = (
							asistencia.tipo_asistencia_id == 3 || asistencia.tipo_asistencia_id == 4
						) ? asistencia.tipo_salida.tipo : asistencia.asistencia_causa
								? asistencia.asistencia_causa.causa : 'N/A'
					})
				}

				this.asistencias = data.asistencias
				this.ingresos = data.ingresos
				this.calculadora.dias_trabajados = data.ingresos
				this.salidas = data.salidas
				this.calculadora.horas_extras = data.horas_extras
			});
	}

	public selectedDate(value: any, datepicker?: any) {
		this.form.fecha_inicio = value.start._d;
		this.form.fecha_fin = value.end._d;
	}

	public resetForm() {
		this.form = { usuario_id: 0, fecha_inicio: moment().format('YYYY-MM-DD'), fecha_fin: moment().format('YYYY-MM-DD') };
		this.picker.datePicker.setStartDate(moment());
		this.picker.datePicker.setEndDate(moment());
	}

	public calendarApplied(event: any) {
		this.form.fecha_inicio = event.picker.startDate.format('YYYY-MM-DD');
		this.form.fecha_fin = event.picker.endDate.format('YYYY-MM-DD');
	}

	public setSortProps(value = 'causaSalida') {
		this.sortCausaSalida = value
		this.sortAsistencias()
	}

	public sortAsistencias() {
		this.asistencias = this.asistencias.sort(fieldSorter([this.sortCausaSalida]))
	}

	public calcularSueldo() {
		this.calculadora.total_sueldo = this.calculadora.dias_trabajados * this.calculadora.sueldo_dia;
		this.calculadora.total_horas_extras = this.calculadora.horas_extras * this.calculadora.valor_horas_extras;

	}

	public reportePDF(e) {
		this.dataPdf.asistencias = this.asistencias
		this.dataPdf.calculadora = this.calculadora

		e.textContent = 'Generando reporte...';
		e.disabled = true;

		this.asistenciaService.pdf(this.dataPdf).subscribe((data: any) => {
			this.dataPdf.path = data.path;
			console.log(data);
		})
	}

	public redirectPdf() {
		//location.href = this.dataPdf.path;
		window.open(this.dataPdf.path, '_blank');
	}
}
