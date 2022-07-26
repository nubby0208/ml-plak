import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { NgForm, NgModel, DefaultValueAccessor, NgControl } from '@angular/forms';
import { Router } from '@angular/router';
import { _window, _$ } from 'app/common';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { RespaldoService } from './../services/respaldo.service';
import { AuditoriaService } from './../services/auditoria.service';
import { Usuario } from './../models';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { fieldSorter } from './../utils';

@Component({
  selector:    'app-respaldo-list',
  templateUrl: './list.component.html',
  styleUrls:   ['./list.component.css']
})

export class RespaldoListComponent implements OnInit {
	public respaldos: any = [];
	private server = environment.API_URL;

	constructor(private respaldoService: RespaldoService, private zone: NgZone) {}

	ngOnInit() {
		this.zone.run(() => {
			this.respaldoService.getAll().subscribe((data:any) => {
				this.respaldos = data.respaldos;
			});
		});
	}

	public getUrl(name, option = 'database') {
		return this.server+'/respaldo/download/'+name+'/'+option;
	}
}
