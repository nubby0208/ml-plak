import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { _window, _$ } from 'app/common';

import { map } from 'rxjs/operators';


@Component({
	selector: 'app-seguridad-check',
	templateUrl: './check.component.html',
	styleUrls: ['./check.component.css']
})

export class SeguridadCheckComponent implements OnInit {
	@Input() inputCheck;
	@Output() inputCheckChange = new EventEmitter();

	public formData: any;
	private server = environment.API_URL;
	private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
	constructor(private http: HttpClient) { }

	ngOnInit() {
		this.formData = { codigo: '' };
	}

	public sendCheck() {
		this.http.post(`${this.server}/usuario/check-admin`, this.formData, { headers: this.headers }).pipe(map((res: HttpResponse<any>
		) => res)
		).subscribe((data: any) => {
			if (data.success === true) {
				this.inputCheck = true;
				this.inputCheckChange.emit(this.inputCheck);
			}
		});
	}
}
