import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgForm, NgModel, DefaultValueAccessor, NgControl } from '@angular/forms';
import { Router } from '@angular/router';
import { _window, _$ } from 'app/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { UsuarioService } from './../services/usuario.service';
import { HorarioService } from './../services/horario.service';
import { FeriadoService } from './../services/feriado.service';
import { Usuario } from './../models'
import { Horario } from './../models'
import { Feriado } from './../models'

import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-usuario-horario-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.css']
})

export class HorarioFormComponent implements OnInit {

	public usuario: Usuario;
	public horario: Horario;
	public messages: Array<any>;

	constructor(private usuarioService: UsuarioService, private horarioService: HorarioService, private feriadoService: FeriadoService, private toastr: ToastrService) { }

	ngOnInit() {
		this.usuario = new Usuario;
		this.usuario.horario = new Horario;
		this.messages = [];
	}

	public setUsuario(usuario: Usuario) {
		this.usuario = usuario;
	}

	public save() {
		this.messages = [];
		let reqData = this.usuario.horario;
		reqData.user_id = this.usuario.id;
		this.horarioService.updateUser(reqData).subscribe((response: any) => {
			if (response.success == 1) {
				this.usuario.horario.is_default = false;
				this.toastr.success('¡Horario modificado con éxito!');
				_$('#modal-horario').modal('hide');
			}
			else if (response.success == 1)
				// this.messages.push({type: 'danger', message: '¡Error al modificar el horario!'});
				this.toastr.error('¡Error al modificar el horario!');
		}, err => {
			console.log(err);
		});
	}

}
