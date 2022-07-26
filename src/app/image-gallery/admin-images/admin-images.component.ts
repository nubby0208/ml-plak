import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminImagesService } from '../../services/admin-images.service';
import { ToastrService } from 'ngx-toastr';
import { _window, _$ } from 'app/common';
@Component({
	selector: 'app-admin-images',
	templateUrl: './admin-images.component.html',
	styleUrls: ['./admin-images.component.css']
})
export class AdminImagesComponent implements OnInit {
	public all_folders: any = [];
	public id_folder = '';
	public id_img = '';
	public file_url = '';
	public loader = false;
	public loadingThumbnails = true;
	public proyectos = [];
	public proyectosBkp = [];
	public proyectoImagenes: any = { imagenes: [], proyecto: {} };
	public imageShow: string = '';
	public proyecto2Remove: any = {};
	public imagen2Remove: number = null;
	public urlOrigin: string = '';
	public posCarousel: number = 0;
	public pagOptions: any = {};
	public Math: any;
	public sortByField: any = { icon: 'glyphicon-sort-by-alphabet', field: 'created_at', type: 1 };
	public sortMode: number = 1;
	public inputFiltered: string = '';
	public sortClass: any = {
		'glyphicon-sort-by-alphabet': ((this.sortByField.field === 'nombre_completo') && (this.sortByField.type === 1)),
		'glyphicon-sort-by-alphabet-alt': ((this.sortByField.field === 'nombre_completo') && (this.sortByField.type === -1)),
	};

	constructor(private adminImagesService: AdminImagesService, private toastr: ToastrService) { }

	ngOnInit() {
		this.Math = Math;
		this.urlOrigin = window.location.origin + window.location.pathname;
		this.loader = true
		this.pagOptions = {
			total: 10,
			active: 0,
			sections: 0,
		};

		this.adminImagesService.showAll().subscribe((response: any) => {
			this.proyectos = response.proyectos;
			this.loader = false
			this.pagOptions.sections = Math.round(this.proyectos.length / this.pagOptions.total);

			this.proyectos.map((item, index) => {
				item.show = (index < this.pagOptions.total);
			});
			this.proyectosBkp = this.proyectos;
		});
	}

	removeImage() {
		let explode = this.file_url.split("/");
		let project_file = explode[1] + '|' + explode[2];
		this.adminImagesService.delete_image(project_file).subscribe((response: any) => {
			if (response.result == 'success') {
				this.all_folders[this.id_folder].images.splice(this.id_img, 1)
				this.toastr.success('Imagen Borrada del Servidor.')
			} else {
				this.toastr.error('La imagen No existe en el Servidor')
			}
		});
	}

	removeAllImages() {
		let explode = this.all_folders[this.id_folder].folder.split("/");
		let project_folder = explode[0] + '|' + explode[1];
		this.adminImagesService.delete_AllImages(project_folder).subscribe((response: any) => {
			if (response.result == 'success') {
				this.all_folders.splice(this.id_folder, 1)
				this.toastr.success('Imagenes Borradas del Servidor.')
			} else {
				this.toastr.error('El Proyecto No existe en el Servidor')
			}
		});
	}

	/*se asignan la hacer click en la imagen que se desea eliminar*/
	public AsignarValores(id_folder, id_img, file) {
		this.id_folder = id_folder;
		this.id_img = id_img;
		this.file_url = file;
	}

	public handlerSwalImage(event): void {
		if (event.value === true) {
			this.removeImage();
		}
	}

	public handlerRemoveAllImages(event): void {
		if (event.value === true) {
			this.removeAllImages();
		}
	}

	public onChangeFilterProject(search: string): void {
		search = search.toLowerCase();
		let total = 0;

		if ((search.length > 0)) {
			this.proyectos = this.proyectosBkp.filter(item => {
				item.show = true;

				return (item.cliente.nombre_completo.toLowerCase().indexOf(search) != -1) || (item.proyecto.toLowerCase().indexOf(search) != -1);
			});

			this.pagOptions.sections = Math.round(this.proyectos.length / this.pagOptions.total);
			this.sortByVisible();
			this.proyectosToggle();
		} else {
			this.proyectos = this.proyectosBkp;

			// this.proyectos.map((item, index) => {
			// 	item.show = (index < this.pagOptions.total);
			// });

			this.proyectosToggle();
			this.pagOptions.sections = Math.round(this.proyectos.length / this.pagOptions.total);
			this.sortByField.field = 'created_at';
			this.sortByField.type = 1;
			this.onSortBy('created_at', 1);
		}
	}

	public showModalImagenes(event: any, proyecto: any, projectToken: string): void {
		this.imageShow = '';
		this.loadingThumbnails = true;
		_$('#modal-proyecto-imagenes').modal('show');

		if (projectToken.length > 0) {
			this.adminImagesService.getByToken(projectToken).subscribe(response => {
				this.proyectoImagenes.imagenes = response.response.imagenes;
				this.proyectoImagenes.proyecto = proyecto;
				this.loadingThumbnails = false;
			});
		}
	}

	public selectImage(pos: number): void {
		this.imageShow = this.proyectoImagenes.imagenes[pos];
		this.posCarousel = pos;
	}

	public hideImage(): void {
		this.imageShow = '';
	}

	public assign2Remove(item: any, option: string = 'proyecto'): any {
		if (option === 'imagen') {
			this.imagen2Remove = item; // Índice de imagen en `this.proyectoImagenes`
		} else {
			this.proyecto2Remove = item; // Objecto proyecto
		}
	}

	public handlerRemoveAll(event: any): any {
		if (event.value === true) {
			this.adminImagesService.deleteByProject(this.proyecto2Remove.token_project).subscribe(response => {
				if (response.success) {
					this.toastr.success('¡imágenes borradas con éxito!');
					this.proyectos = this.proyectos.filter(item => {
						return (item.id !== this.proyecto2Remove.id);
					});
				} else {
					this.toastr.error('¡Error! No se eliminaron las imágenes');
				}
			});
		}
	}

	public handlerRemoveOne(event: any): any {
		if (event.value === true) {
			const tokenProject = this.proyectoImagenes.proyecto.token_project;
			const filename = this.proyectoImagenes.imagenes[this.imagen2Remove].file;
			const tokenImage = filename.split('/')[2].split('.')[0]

			this.adminImagesService.deleteOne(tokenProject, tokenImage).subscribe(response => {
				if (response.success) {
					this.toastr.success('¡Imágen borrada con éxito!');
					this.proyectoImagenes.imagenes.splice(this.imagen2Remove, 1);
				} else {
					this.toastr.error('¡Error! No se eliminó la imágen');
				}
			});
		}
	}

	public proyectosPag(): Array<number> {
		let indexes = [];
		const cantidad = this.proyectos.length / 10;

		for (let i = 0; i < cantidad; i++) {
			indexes.push(i);
		}

		return indexes;
	}

	public pagChange(pos: number = 0): void {
		if (pos >= 0) {
			this.pagOptions.active = pos;

			this.proyectosToggle(pos);
		}
	}

	public pagNext(): void {
		if ((this.pagOptions.active + 1) <= this.pagOptions.sections) {
			this.pagOptions.active++;
			this.proyectosToggle(this.pagOptions.active + 1);
		}
	}

	public pagPrev(): void {
		if ((this.pagOptions.active - 1) >= 0) {
			this.pagOptions.active--;
			this.proyectosToggle(this.pagOptions.active + 1);
		}
	}

	private proyectosToggle(pos: number = 0) {
		this.proyectos.map((item, index) => {
			item.show = ((index >= (pos * this.pagOptions.total)) && (index < ((pos + 1) * this.pagOptions.total)));
		});
	}

	public onSortBy(field: string = '', mode: number = 1) {
		if (field.length > 0) {
			this.sortMode = mode;
			this.sortByField.field = field;
			this.sortByField.type = mode;

			this.proyectos.sort((a, b) => {
				let aField = '';
				let bField = '';

				if (field === 'created_at') {
					aField = a.created_at.toLowerCase().trim();
					bField = b.created_at.toLowerCase().trim();
				} else if (field === 'nombre_completo') {
					aField = a.cliente.nombre_completo.toLowerCase().trim();
					bField = b.cliente.nombre_completo.toLowerCase().trim();
				}

				if (aField < bField) {
					return 1 * mode;
				} else if (aField > bField) {
					return -1 * mode;
				} else {
					return 0;
				}
			});

			this.proyectosToggle();
		}
	}

	public fnSortClassNombreCliente() {
		let sortClass: any = {
			'glyphicon-sort-by-alphabet': ((this.sortByField.field === 'nombre_completo') && (this.sortByField.type === -1)),
			'glyphicon-sort-by-alphabet-alt': ((this.sortByField.field === 'nombre_completo') && (this.sortByField.type === 1)),
		};

		return sortClass;
	}

	public fnSortClassCreatedAt() {
		let sortClass: any = {
			'glyphicon-sort-by-order': ((this.sortByField.field === 'created_at') && (this.sortByField.type === -1)),
			'glyphicon-sort-by-order-alt': ((this.sortByField.field === 'created_at') && (this.sortByField.type === 1)),
		};

		return sortClass;
	}

	public sortByVisible() {
		this.proyectos.sort((a, b) => {
			if (a.show === true) {
				return -1;
			} else {
				return 1;
			}
		});
	}
}
