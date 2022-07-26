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
import { Usuario } from './../models'

import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-usuario-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.css']
})

export class UsuarioFormComponent implements OnInit {
	@Input() inputUsuarios;
	@Output() inputUsuariosChange = new EventEmitter();

	public usuario: Usuario;
	public password: any;
	public messages: Array<any>;
	public roles: Array<any>;
	public estados: Array<any> = [{ value: 1, estado: 'Sí' }, { value: 0, estado: 'No' }];

	constructor(private usuarioService: UsuarioService, private toastr: ToastrService) { }

	ngOnInit() {
		this.usuario = new Usuario;
		this.password = { password: '', password_confirmation: '' };
		this.messages = [];

		this.getAllRoles();
	}

	public getAllRoles() {
		this.usuarioService.getAllRoles().subscribe(data => {
			this.roles = data.roles;
		});
	}

	public setUsuario(usuario: Usuario) {
		this.usuario = usuario;
	}

	public getUsuario(): Usuario {
		return this.usuario;
	}

	public save() {
		let reqData = this.usuario;
		reqData = { ...reqData, ...this.password };
		this.messages = [];

		console.log(reqData);

		if ((this.password.password.length > 0))
			if ((this.password.password_confirmation.length > 0) && (this.password.password === this.password.password_confirmation)) {
				reqData = { ...reqData, ...this.password };
			} else {
				// this.messages.push({type: 'danger', message: '¡Contraseñas no coinciden!'});
				this.toastr.error('¡Contraseñas no coinciden!');
			}

		if (this.messages.length === 0) {
			if (this.usuario.hasOwnProperty('id') && (this.usuario.id > 0))
				this.usuarioService.update(reqData).subscribe((response: any) => {
					if (response.success === true) {
						// this.messages.push({type: 'success', message: '¡Usuario actualizado con éxito!'});
						this.toastr.success('¡Usuario actualizado con éxito!');
						_$('#modal-usuario').modal('hide');
					} else if (response.success == false) {
						// this.messages.push({type: 'danger', message: '¡Error al actualizar usuario!'});
						this.toastr.error('¡Error al actualizar usuario!');
					}
				}, err => {
					console.log(err);
				});
			else
				this.usuarioService.store(reqData).subscribe((response: any) => {
					if (response.success === true) {
						// this.messages.push({type: 'success', message: '¡Usuario creado con éxito!'});
						this.toastr.success('¡Usuario creado con éxito!');
						this.inputUsuarios.push(response.usuario);
						this.inputUsuariosChange.emit(this.inputUsuarios);
						_$('#modal-usuario').modal('hide');
					} else if (response.success === false)
						// this.messages.push({type: 'danger', message: '¡Error al crear usuario!'});
						this.toastr.error('¡Error al crear usuario!');
				}, err => {
					console.log(err);
				});
		}
	}

	public setMessages(messages = []): void {
		this.messages = messages;
	}
}
