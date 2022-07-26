import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { NgForm, NgModel, DefaultValueAccessor, NgControl } from '@angular/forms';
import { Router } from '@angular/router';
import { _window, _$ } from 'app/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { ProyectoService } from './../services/proyecto.service';
import { ProyectoFormComponent } from './form.component';
import { AdminPiezasComponent } from './admin-piezas/admin-piezas.component';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-proyecto-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})

export class ProyectoListComponent implements OnInit {
	@ViewChild(ProyectoFormComponent)
	public formComponent: ProyectoFormComponent;
	@ViewChild(AdminPiezasComponent)
	public adminPiezasComponent: AdminPiezasComponent;

	public proyectos;
	public tipos_activos: any;
	public titulo_modal_edit_piezas: string;
	public filtro: string = '';

	constructor(private proyectoService: ProyectoService, private zone: NgZone, private toastr: ToastrService) { }

	ngOnInit() {
		this.titulo_modal_edit_piezas = 'Administrar Piezas del Proyecto'
		this.proyectoService.allProjects().subscribe((data: any) => {
			this.proyectos = data.proyectos;

			this.proyectos.map(item => {
				item.show = true;
			});

			console.log(this.proyectos);
		});

		this.tipos_activos = [
			{ name: 'Sí', value: 1 },
			{ name: 'No', value: 0 },
			{ name: 'Automático', value: null },
		];
	}

	public edit(index: number) {
		this.formComponent.setProyecto(this.proyectos[index]);
		_$('#modal-proyecto-form').modal('show');
	}

	public showPiezas(proyecto_id: number, index: number) {
		this.adminPiezasComponent.setProyecto(this.proyectos[index]);
		this.adminPiezasComponent.infoProject(proyecto_id);
		_$('#modal_admin_piezas').modal('show');
	}

	public delete(proyecto: any) {
		swal({
			title: `¿Desea eliminar el proyecto: ${proyecto.proyecto}?`,
			text: 'No podrá ser recuperado',
			type: 'question',
			customClass: 'unfont-size',
			showCancelButton: true
		}).then(selected => {
			if (selected.value) {
				this.toastr.info('Eliminando proyecto...');

				this.proyectoService.delete(proyecto.id).subscribe((response: any) => {
					if (response.status == true) {
						let index = 0;

						for (let i = 0; i < this.proyectos.length; i++)
							if (this.proyectos[i].id === proyecto.id) {
								index = i;
								break;
							}

						this.proyectos.splice(index, 1);

						this.toastr.success('¡Proyecto eliminado con éxito!');
					}
				});
			}
		})
	}

	public onChangeActive(activo, proyecto) {
		console.log(activo)
		let reqData = {
			activo: activo,
			id: proyecto.id
		};
		this.toastr.info('Actualizando estado de proyecto...');

		this.proyectoService.update(reqData).subscribe((response: any) => {
			if (response.status == true)
				this.toastr.success('¡Proyecto actualizado con éxito!');
			else if (response.status == false)
				this.toastr.error('¡Error al actualizar proyecto!');
		}, err => {
			console.log(err);
		});
	}

	public setTituloModalEditPiezas(titulo: string) {
		this.titulo_modal_edit_piezas = titulo
	}

	public onChangeFiltro(event: string = '') {
		const search = event.trim();

		this.proyectos.map(item => {
			item.show = true;
		});

		if (search.length > 0) {
			this.proyectos.map(item => {
				item.show = (item.proyecto.toLowerCase().indexOf(search) !== -1);
			});
		}
	}
}
