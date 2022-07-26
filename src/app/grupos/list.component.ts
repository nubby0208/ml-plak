import { UsuarioService } from './../services/usuario.service';
import { GrupoService } from './../services/grupo.service';
import { Component, OnInit, NgZone, ViewChild, ViewEncapsulation } from '@angular/core';
import { _window, _$ } from 'app/common';
import { Grupo, Usuario } from './../models'
import { GrupoFormComponent } from './form.component'
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
	selector: 'app-grupo-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})

export class GrupoListComponent implements OnInit {
	@ViewChild(GrupoFormComponent)
	public grupoFormComponent: GrupoFormComponent;
	@ViewChild('tablaGrupo') table: any;

	public grupos: Array<Grupo> = Array<Grupo>();
	public grupo: Grupo;
	public roles: any;
	public boolEditar = false;
	public usuarios: Usuario[] = []
	loadingIndicator = true;

	constructor(private grupoService: GrupoService, private usuarioService: UsuarioService, private zone: NgZone, private toastr: ToastrService, private _ngxUiService: NgxUiLoaderService) { }

	ngOnInit() {
		this._ngxUiService.start();
		this.getAllUsuarios();
		this.getAllGrupos();
		this.setearGrupo();
	}

	getAllGrupos() {
		this.grupoService.getAll().subscribe((data: any) => {
			data.forEach(element => {
				element.grupo_usuarios = element.grupo_usuarios.filter(x => x.activo);
			});

			this.grupos = data;

			setTimeout(() => {
				this._ngxUiService.stop();
			}, 500);
		});

	}

	async getAllUsuarios() {
		this.usuarioService.getAll().subscribe((data: any) => {
			this.usuarios = data.usuarios;
		});

	}


	cambiarEstado(grupo: Grupo) {
		let obj = { ...grupo };
		obj.activo = !obj.activo;
		this.grupoService.update(obj.id, obj).subscribe(data => {
			this.getAllGrupos();
		})
	}

	expandirFila(grupo) {
		this.table.rowDetail.toggleExpandRow(grupo);
	}

	seleccionarGrupo(grupo) {
		let newGrupo = { ...grupo };
		newGrupo.integrantes = [];
		newGrupo.grupo_usuarios.forEach(element => {
			newGrupo.integrantes.push(element.usuario_id);
		});

		delete newGrupo.grupo_usuarios;
		this.grupo = newGrupo;
		this.boolEditar = true;
		_$('#modal-grupo').modal('show');
	}

	editarGrupo() {
		let grupoEditar = this.grupos.filter(x => x.id == this.grupo.id);
		if (grupoEditar != null) {
			let comparasionGrupos = { ...grupoEditar[0] };
			comparasionGrupos.integrantes = [];
			comparasionGrupos.grupo_usuarios.forEach(element => {
				comparasionGrupos.integrantes.push(element.usuario_id);
			});
			delete comparasionGrupos.grupo_usuarios;
			if (JSON.stringify(comparasionGrupos) === JSON.stringify(this.grupo))
				this.toastr.info("No hay datos para modificar");
			else {
				this.grupoService.update(this.grupo.id, this.grupo).subscribe(data => {
					_$('#modal-grupo').modal('hide');
					this.toastr.success("Grupo editado");
					this.getAllGrupos();
				})
			}
		}
	}

	setearGrupo() {
		this.grupo = new Grupo();
		this.grupo.nombre_grupo = '';
		this.grupo.integrantes = [];
		this.grupo.activo = true;
	}

	nuevoGrupo() {
		this.grupoService.store(this.grupo).subscribe(data => {
			_$('#modal-grupo').modal('hide');
			this.toastr.success("Grupo agregado");
			this.getAllGrupos();
		}, (err) => this.toastr.error(err.error));
	}

	modalGrupo() {
		this.setearGrupo();
		this.boolEditar = false;
		_$('#modal-grupo').modal('show');
	}
}
	/*	public delete(usuario: any) {
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
}*/