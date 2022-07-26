import { UsuarioService } from './../services/usuario.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { _window, _$ } from 'app/common';
import { Grupo, Usuario } from './../models'

import { ToastrService } from 'ngx-toastr';
import { NgSelectComponent } from '@ng-select/ng-select';
import { GrupoService } from 'app/services/grupo.service';
import { GrupoListComponent } from './list.component';

@Component({
	selector: 'app-grupo-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.css']
})

export class GrupoFormComponent implements OnInit {

	constructor(private usuarioService: UsuarioService, private toastr: ToastrService, private grupoService: GrupoService) { }

	ngOnInit() {
	}

	
	/*public save() {
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
				this.usuarioService.update(reqData).subscribe(response => {
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
				this.usuarioService.store(reqData).subscribe(response => {
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
	}*/
}
