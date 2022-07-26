import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { NgForm, NgModel, DefaultValueAccessor, NgControl } from '@angular/forms';
import { Router } from '@angular/router';
import { _window, _$ } from 'app/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { MaterialService } from './../services/material.service';
import { Material } from './../models'
import { MaterialFormComponent } from './form.component'

import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-material-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})

export class MaterialListComponent implements OnInit {
	@ViewChild(MaterialFormComponent)
	public materialFormComponent: MaterialFormComponent;

	public materiales: Array<Material> = [];
	public material: Material;
	public material_select: string = 'P';
	public tipoMaterialSelected: number = 0;
	public roles: any;
	public textura1: string = '';
	public textura2: string = '';
	public tipo_materiales: Array<any>;
	public modalTextura: any = { nombre: '', textura: '' };
	public urlOrigin: string = window.location.origin + window.location.pathname;

	constructor(private materialService: MaterialService, private zone: NgZone, private toastr: ToastrService) { }

	ngOnInit() {
		this.material = new Material();
		this.materialService.getTipoMateriales().subscribe((response: any) => {
			this.tipo_materiales = response.tipo_materiales
		});

		this.zone.run(() => {
			// this.getMaterialesPorTipo('P');//por defecto los tipo placa
		});
	}

	/*public getAllMateriales() {
		this.materialService.getAll().subscribe(data => {
			this.materiales = data.materiales;
		});
	}*/

	public getMaterialesPorTipo(caracter: string) {
		this.materialService.getMaterialesPorTipo(caracter).subscribe((data: any) => {
			this.materiales = data.materiales;
		});
	}

	public edit(index) {
		this.materialFormComponent.setMessages();
		let material = this.materiales[index];
		let material_name = material.material;
		this.materialFormComponent.setMaterial(material);
		_$('#modal-material').modal('show');
	}

	public create() {
		this.materialFormComponent.setMessages();
		this.materialFormComponent.setMaterial(new Material);
		_$('#modal-material').modal('show');
	}

	public delete(index) {
		this.materialService.delete(index).subscribe((response: any) => {
			if (response.success === true) {
				// this.messages.push({type: 'success', message: '¡Material eliminado con éxito!'});
				this.materiales.splice(this.materiales.findIndex(e => e.id == index), 1);
				this.toastr.success('¡Material eliminado con éxito!');
			} else if (response.success == false) {
				// this.messages.push({type: 'danger', message: '¡Error al eliminar material!'});
				this.toastr.error('¡Error al eliminar material!');
			}
		}, err => {
			this.toastr.error('¡Error al eliminar material!');
			console.log(err);
		});
	}

	public showTextures(material_name) {
		this.textura1 = '';
		this.textura2 = '';
		this.material_select = '';
		this.materialService.showTextures(material_name).subscribe((response: any) => {
			if (response.result == 'Ok') {
				if (response.response.textura1)
					this.textura1 = response.response.textura1

				if (response.response.textura2)
					this.textura2 = response.response.textura2

				_$('#modal_texturas').modal('show');
				this.material_select = material_name;
			} else {
				this.toastr.info('¡El Material no tiene texturas Asociadas!');
			}

		}, err => {
			console.log(err);
		});
	}

	public onChangeTipoMaterial(event): void {
		this.material_select = this.tipo_materiales.filter(function (el) {
			return el.id == event.target.value
		})[0].caracter;

		this.getMaterialesPorTipo(this.material_select)
	}

	public toggleDefault(index): void {
		this.materialService.update(this.materiales[index]).subscribe((response: any) => {
			if (response.success === true) {
				// this.messages.push({type: 'success', message: '¡Material actualizado con éxito!'});
				this.toastr.success('¡Material actualizado con éxito!');
				_$('#modal-material').modal('hide');
			} else if (response.success == false)
				// this.messages.push({type: 'danger', message: '¡Error al actualizar material!'});
				this.toastr.error('¡Error al actualizar material!');
		}, err => {
			console.log(err);
			this.toastr.error('¡Error al actualizar material!');
		});
	}

	public showTexture(material: any): void {
		this.modalTextura.material = material.material;
		this.modalTextura.textura = '';
		_$('#modal-textura').modal('show');

		if (material.id > 0) {
			this.materialService.getTexture(material.id).subscribe((response: any) => {
				// this.modalTextura.material = material.material;
				this.modalTextura.textura = response.textura;

				// _$('#modal-textura').modal('show');
			});
		}
	}
}
