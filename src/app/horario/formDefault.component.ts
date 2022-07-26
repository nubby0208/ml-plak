import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgForm, NgModel, DefaultValueAccessor, NgControl } from '@angular/forms';
import { Router } from '@angular/router';
import { _window, _$ } from 'app/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { HorarioService } from './../services/horario.service';
import { Horario } from './../models'

import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-horario-default-form',
	templateUrl: './formDefault.component.html',
	styleUrls: ['./formDefault.component.css']
})

export class HorarioDefaultFormComponent implements OnInit {
	@Input() inputHorario;
	@Output() inputHorarioChange = new EventEmitter();

	public horario: Horario;
	public messages: Array<any>;

	constructor(private horarioService: HorarioService, private toastr: ToastrService) { }

	ngOnInit() {
		this.messages = [];
		this.horario = new Horario;
	}

	public setHorario(horario: Horario) {
		this.horario = horario;
	}

	public save() {
		this.messages = [];
		let reqData = { is_default: 1, ...this.horario };
		this.horarioService.updateDefault(reqData).subscribe((response: any) => {
			if (response.success === true) {
				this.toastr.success('¡Horario modificado con éxito!');
				this.inputHorarioChange.emit(this.inputHorario);
				_$('#modal-horario-default').modal('hide');
			}
			else if (response.success === false)
				// this.messages.push({type: 'danger', message: '¡Error al modificar el horario!'});
				this.toastr.error('¡Error al modificar el horario!');
		}, err => {
			console.log(err);
		});
	}
}
