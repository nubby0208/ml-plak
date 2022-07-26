import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgForm, NgModel, DefaultValueAccessor, NgControl } from '@angular/forms';
import { Router } from '@angular/router';
import { _window, _$ } from 'app/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { ProyectoService } from './../services/proyecto.service';

import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-proyecto-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.css']
})

export class ProyectoFormComponent implements OnInit {
	@Output() inputProyectoChange = new EventEmitter();

	public proyecto: any;

	constructor(private proyectoService: ProyectoService, private toastr: ToastrService) { }

	ngOnInit() {
		this.proyecto = {
			id: 0,
			proyecto: '',
			senia: '',
			valor_total: '',
			instalacion_fecha: '',
			instalacion_comentario: ''
		}
	}

	public setProyecto(proyecto: any) {
		this.proyecto = proyecto;
	}

	public getProyecto(): any {
		return this.proyecto;
	}

	public save() {
		let reqData = this.proyecto;
		console.log(reqData);

		if (this.proyecto.hasOwnProperty('id') && (this.proyecto.id > 0)) {
			this.toastr.info('Actualizando proyecto...');

			this.proyectoService.update(reqData).subscribe((response: any) => {
				if (response.status == true)
					this.toastr.success('¡Proyecto actualizado con éxito!');
				else if (response.status == false)
					this.toastr.error('¡Error al actualizar proyecto!');
			}, err => {
				console.log(err);
			});
		}
	}
}
