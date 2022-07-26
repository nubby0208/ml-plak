import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgForm, NgModel, DefaultValueAccessor, NgControl } from '@angular/forms';
import { Router } from '@angular/router';
import { _window, _$ } from 'app/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { FeriadoService } from './../services/feriado.service';
import { Feriado } from './../models'

import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-feriado-form',
	templateUrl: './feriado.component.html',
	styleUrls: ['./feriado.component.css']
})

export class FeriadoComponent implements OnInit {
	@Input() inputFeriados;
	@Output() inputFeriadosChange = new EventEmitter();
	public feriado: Feriado;
	public messages: Array<any>;

	constructor(private feriadoService: FeriadoService, private toastr: ToastrService) { }

	ngOnInit() {
		this.feriado = new Feriado;
		this.messages = [];
	}

	public setFeriado(feriado: Feriado) {
		this.feriado = feriado;
	}

	public getFeriado(): Feriado {
		return this.feriado;
	}

	public save() {
		let reqData = this.feriado;
		reqData = { ...reqData };
		this.messages = [];

		if (this.messages.length === 0) {
			this.feriadoService.store(reqData).subscribe((response: any) => {
				if (response.success === true) {
					// this.messages.push({type: 'success', message: '¡Feriado creado con éxito!'});
					this.toastr.success('¡Feriado creado con éxito!');
					this.inputFeriados.push(response.feriado);
					this.inputFeriadosChange.emit(this.inputFeriados);
					_$('#modal-feriado').modal('hide');
				}
				else if (response.success === false)
					// this.messages.push({type: 'danger', message: '¡Error al crear feriado!'});
					this.toastr.error('¡Error al crear feriado!');
			}, err => {
				console.log(err);
			});
		}
	}

	public setMessages(messages = []): void {
		this.messages = messages;
	}
}
