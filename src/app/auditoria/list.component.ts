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
import { AuditoriaService } from './../services/auditoria.service';
import { Usuario } from './../models';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { fieldSorter } from './../utils';

@Component({
	selector: 'app-auditoria-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})

export class AuditoriaListComponent implements OnInit {
	@ViewChild(DaterangePickerComponent)
	private picker: DaterangePickerComponent;

	public usuarios: Array<Usuario> = [];
	public registros: Array<any> = [];
	public allRegistros: Array<any> = [];
	public form: any = { usuario_id: 0, fecha_inicio: moment().format('YYYY-MM-DD'), fecha_fin: moment().format('YYYY-MM-DD') };
	public dateRange: string = '';
	public cantidadOk: number = 0;
	public daterange: any;
	public searchTerm: string = ''
	public sortNewEstado: string = 'new_estado'
	public sortOldEstado: string = 'old_estado'
	public sortCliente: string = 'cliente'

	constructor(private usuarioService: UsuarioService, private zone: NgZone,
		private auditoriaService: AuditoriaService) { }

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

	public reloadRegistros() {
		this.auditoriaService.getByUsuarioFecha(parseInt(this.form.usuario_id), this.form.fecha_inicio, this.form.fecha_fin).
			subscribe((data: any) => {
				this.allRegistros = data.registros;
				this.cantidadOk = data.cantidad_ok;
				this.searchRegistros();
			});
	}

	public selectedDate(value: any, datepicker?: any) {
		// this.form.fecha_inicio = value.start.format('YYYY-MM-DD');
		// this.form.fecha_fin    = value.end.format('YYYY-MM-DD');
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

	public searchRegistros() {
		const searchTerm = this.searchTerm.trim()
		let registros: any[] = this.allRegistros

		if (searchTerm) {
			registros = this.allRegistros.filter(registro => {
				const regEx = new RegExp(searchTerm, 'gi')

				return regEx.test(registro.pieza)
			})
		}

		this.sortRegistros(registros)
	}

	public setSortProps(name = 'sortNewEstado', value = 'new_estado') {
		this[name] = value
		this.sortRegistros()
	}

	public sortRegistros(data?: any[]) {
		const registros = data ? data : this.registros
		const sortProps = [this.sortCliente, this.sortNewEstado, this.sortOldEstado]

		this.registros = registros.sort(fieldSorter(sortProps))
	}
}
