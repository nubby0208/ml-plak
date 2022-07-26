import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgForm, NgModel, DefaultValueAccessor, NgControl } from '@angular/forms';
import { Router } from '@angular/router';
import { _window, _$ } from 'app/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { ClienteService } from './../services/cliente.service';
import { ProyectoService } from './../services/proyecto.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector:    'app-edit-info',
  templateUrl: './edit_info.component.html',
  styleUrls:   ['./edit_info.component.css']
})

export class EditInfoComponent implements OnInit {
	@Input() typeInput;
	@Input() keyInput;
	@Input() dataInput;
	// @Output() inputUsuariosChange = new EventEmitter();

	public newInfo: any = {value: '', property: '', type: ''};
	public editInfo: boolean = false;

	constructor(private clienteService: ClienteService, private proyectoService: ProyectoService, private toastr: ToastrService) {}

	ngOnInit () {
		// this.keyInput = '';
		// this.dataInput = '';
	}

}
