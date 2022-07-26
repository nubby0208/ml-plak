import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { NgForm, NgModel, DefaultValueAccessor, NgControl } from '@angular/forms';
import { Router } from '@angular/router';
import { _window, _$ } from 'app/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { UsuarioService } from './../services/usuario.service';
import { HorarioService } from './../services/horario.service';
import { FeriadoService } from './../services/feriado.service';
import { Usuario } from './../models';
import { Horario } from './../models';
import { Feriado } from './../models';
import { HorarioFormComponent } from './form.component'
import { HorarioDefaultFormComponent } from './formDefault.component'
import { FeriadoComponent } from './feriado.component'

import { ToastrService } from 'ngx-toastr';


@Component({
	selector: 'app-usuario-horario-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})

export class HorarioListComponent implements OnInit {
	@ViewChild(HorarioFormComponent)
	public horarioFormComponent: HorarioFormComponent;
	@ViewChild(HorarioDefaultFormComponent)
	public horarioDefaultFormComponent: HorarioDefaultFormComponent;
	@ViewChild(FeriadoComponent)
	public feriadoComponent: FeriadoComponent;
	public usuarios: Array<Usuario>;
	public usuario: Usuario;
	public roles: any;
	public horarioDefault;
	public feriados: Array<Feriado>;

	constructor(private usuarioService: UsuarioService, private horarioService: HorarioService, private feriadoService: FeriadoService, private zone: NgZone, private toastr: ToastrService) { }

	ngOnInit() {
		this.usuario = new Usuario();
		this.usuario.usuario = '';
		this.usuario.password = '';
		this.usuario.nombre_completo = '';
		this.usuario.activo = 1;
		this.usuario.rol_id = 0;

		this.horarioDefault = new Horario();
		this.horarioDefault.hora_inicio = '';
		this.horarioDefault.hora_fin = '';

		this.zone.run(() => {
			this.getAllUsuarios();
			this.getAllFeriados();
		});
	}

	public getAllUsuarios() {
		this.usuarioService.getAll().subscribe((data: any) => {
			this.usuarios = data.usuarios;
			this.horarioService.getDefault().subscribe((data: any) => {
				this.horarioDefault = data.horario;
			});
		});
	}

	public getAllFeriados() {
		this.feriadoService.getAll().subscribe((data: any) => {
			let feriados = data.feriados.sort(function (a, b) {
				if (a.fecha < b.fecha)
					return -1;
				if (a.fecha > b.fecha)
					return 1;
				return 0;
			});
			this.feriados = feriados;
		});
	}


	public edit(index) {
		let usuario = this.usuarios[index];
		if (usuario.horario == null) {
			usuario.horario = new Horario();
			usuario.horario.hora_inicio_lunes = this.horarioDefault.hora_inicio_lunes;
			usuario.horario.hora_fin_lunes = this.horarioDefault.hora_fin_lunes;
			usuario.horario.hora_inicio_martes = this.horarioDefault.hora_inicio_martes;
			usuario.horario.hora_fin_martes = this.horarioDefault.hora_fin_martes;
			usuario.horario.hora_inicio_miercoles = this.horarioDefault.hora_inicio_miercoles;
			usuario.horario.hora_fin_miercoles = this.horarioDefault.hora_fin_miercoles;
			usuario.horario.hora_inicio_jueves = this.horarioDefault.hora_inicio_jueves;
			usuario.horario.hora_fin_jueves = this.horarioDefault.hora_fin_jueves;
			usuario.horario.hora_inicio_viernes = this.horarioDefault.hora_inicio_viernes;
			usuario.horario.hora_fin_viernes = this.horarioDefault.hora_fin_viernes;
			usuario.horario.hora_inicio_sabado = this.horarioDefault.hora_inicio_sabado;
			usuario.horario.hora_fin_sabado = this.horarioDefault.hora_fin_sabado;
			usuario.horario.habilitado_lunes = this.horarioDefault.habilitado_lunes;
			usuario.horario.habilitado_martes = this.horarioDefault.habilitado_martes;
			usuario.horario.habilitado_miercoles = this.horarioDefault.habilitado_miercoles;
			usuario.horario.habilitado_jueves = this.horarioDefault.habilitado_jueves;
			usuario.horario.habilitado_viernes = this.horarioDefault.habilitado_viernes;
			usuario.horario.habilitado_sabado = this.horarioDefault.habilitado_sabado;
			usuario.horario.is_default = this.horarioDefault.is_default;
		}
		this.horarioFormComponent.setUsuario(usuario);
		_$('#modal-horario').modal('show');
	}

	public editDefault() {
		this.horarioDefaultFormComponent.setHorario(this.horarioDefault);
		_$('#modal-horario-default').modal('show');
	}

	public newFeriado() {
		var feriadoDump = new Feriado();
		this.feriadoComponent.setFeriado(feriadoDump);
		_$('#modal-feriado').modal('show');
	}

	public deleteFeriado(index) {
		let feriado = this.feriados[index];
		this.feriadoService.delete(feriado).subscribe(data => {
			this.feriados.splice(index, 1);
			this.toastr.success('Feriado eliminado con éxito!');
		});;

	}

	public delete(index) { }
}
