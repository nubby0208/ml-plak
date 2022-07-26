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
import { Usuario } from './../models'
import { UsuarioFormComponent } from './form.component'
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-usuario-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})

export class UsuarioListComponent implements OnInit {
	@ViewChild(UsuarioFormComponent)
	public usuarioFormComponent: UsuarioFormComponent;

	public usuarios: Array<Usuario>;
	public usuario: Usuario;
	public roles: any;

	constructor(private usuarioService: UsuarioService, private zone: NgZone, private toastr: ToastrService) { }

	ngOnInit() {
		this.usuario = new Usuario();
		this.usuario.usuario = '';
		this.usuario.password = '';
		this.usuario.nombre_completo = '';
		this.usuario.activo = 1;
		this.usuario.rol_id = 0;

		this.zone.run(() => {
			this.getAllUsuarios();
		});
	}



	public getAllUsuarios() {
		this.usuarioService.getAll().subscribe((data: any) => {
			this.usuarios = data.usuarios;
		});
	}

	public edit(index) {
		this.usuarioFormComponent.setMessages();
		this.usuarioFormComponent.setUsuario(this.usuarios[index]);
		_$('#modal-usuario').modal('show');
	}

	public create() {
		this.usuarioFormComponent.setMessages();
		this.usuarioFormComponent.setUsuario(new Usuario);
		_$('#modal-usuario').modal('show');
	}

	public delete(usuario: any) {
		swal({
			title: `¿Desea eliminar el usuario: ${usuario.usuario}?`,
			text: 'No podrá ser recuperado',
			type: 'question',
			customClass: 'unfont-size',
			showCancelButton: true
		}).then(selected => {
			if (selected.value) {
				this.toastr.info('Eliminando usuario...');

				this.usuarioService.delete(parseInt(usuario.id)).subscribe(response => {
					if (response.status === true) {
						let index = 0;

						for (let i = 0; i < this.usuarios.length; i++)
							if (this.usuarios[i].id === usuario.id) {
								index = i;
								break;
							}

						this.usuarios.splice(index, 1);

						this.toastr.success('¡Usuario eliminado con éxito!');
					}
				});
			}
		})
	}
}
