import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { NgForm, NgModel, DefaultValueAccessor, NgControl } from '@angular/forms';
import { _window, _$ } from 'app/common';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { UsuarioService } from './../services/usuario.service';
import { AsistenciaService } from './../services/asistencia.service';
import { ToastrService } from 'ngx-toastr';
import { SwalComponent } from '@toverux/ngsweetalert2'
import { AuthService } from './../services/auth.service'
import { ClienteService } from './../services/cliente.service'
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'app-asistencia',
	templateUrl: './asistencia.component.html',
	styleUrls: ['./asistencia.component.css']
})

export class AsistenciaComponent implements OnInit {
	@ViewChild('successSwal') private successSwal: SwalComponent;

	// Attributes
	public observation: string;
	public late: boolean;
	public showTable: boolean;
	public causes: any;
	public types: any;
	public formData: any;
	public messageAlert: any;
	public checks: any = [];
	public checkUser: boolean;
	public reqAuth: any;
	public userLogged: any;
	public user: any;
	public tipos_salidas: any;
	private checkedTime: boolean;
	private googleUser: any;
	private server: string = environment.API_URL;
	public clientes: any;
	public sendingButton: boolean = false;

	// Constructor
	constructor(private _http: HttpClient, private _zone: NgZone, private usuario: UsuarioService,
		private asistenciaService: AsistenciaService, private toastr: ToastrService, private router: Router,
		private authService: AuthService, private clienteService: ClienteService, private activatedRoute: ActivatedRoute) { }

	// Methods
	ngOnInit() {
		this.observation = '';
		this.late = false;
		this.showTable = true;
		this.types = [];
		// this.types       = [{value: 'in', name: 'Entrada'}, {value: 'out', name: 'Salida'}];
		this.formData = {
			type: 1,
			observation: '',
			cause: 0,
			cliente: '0',
			tipo_salida: 0
		};
		this.messageAlert = { msg: '', type: 'in' };
		this.causes = [];
		this.messageAlert = [];
		this.reqAuth = { username: '', password: '' };

		// Request to api for all causes
		// this.checkUser  = this.usuario.checkAuth();
		// this.userLogged = JSON.parse(window.localStorage.getItem('Usuario'));
		this.getCauses();

		this.asistenciaService.getTiposAsistencias().subscribe((data: any) => {
			this.types = data.tipos_asistencias
			console.log(this.types);
		});

		this.asistenciaService.getTiposSalidas().subscribe((data: any) => {
			this.tipos_salidas = data.tipos_salidas
		});

		this.clienteService.getAll().subscribe((data: any) => {
			this.clientes = [{ id: 0, nombre_completo: 'Seleccione un cliente' }];
			this.clientes = this.clientes.concat(data.clientes);
		});
		this.checkTime();
		this.checksToday();
	}

	public store() {
		let reqData = {
			usuario: this.authService.getUsuario().usuario,
			type: this.formData.type,
			cause: this.formData.cause,
			observation: this.formData.observation,
			tipo_salida: ''
		};

		console.log(reqData);

		if ((this.formData.type == 2) && this.late) {
			if (this.formData.cause.length === 0 || this.formData.observation.length === 0) {
				let message = {
					type: 'danger',
					msg: '¡Causa y Observación son obligarios!',
					keep: false
				};

				this.messageAlert.push(message);
				return;
			}
		}

		if (reqData.type == 3 || reqData.type == 4 || reqData.type == 5) {
			reqData.tipo_salida = this.formData.tipo_salida;
			reqData.observation = 'Cliente: ' + this.formData.cliente;
		}

		this.sendingButton = true;
		this.asistenciaService.store(reqData).subscribe((data: any) => {
			if (data.result === true) {
				let message = {
					type: 'success',
					msg: '¡Hora de entrada agregada con éxito!',
					keep: false
				};

				// this.messageAlert.push(message);
				// this.toastr.success('Marca agregada con éxito', '', {
				// 	positionClass: 'toast-top-center'
				// });
				this.successSwal.show();
				this.checkTime();
				this.checksToday();

				let goToTask = this.activatedRoute.snapshot.queryParams["goToTask"];
				if (goToTask) {
					this.router.navigate(['/tareas']);
				}
			}

			this.sendingButton = false;
		});
	}

	public checksToday() {
		let usuario = this.authService.getUsuario().usuario;

		this.asistenciaService.checkToday(usuario).subscribe((data: any) => {
			this.checks = data.checks
		});
	}

	private getCauses() {
		this.causes.push({ id: 0, causa: 'Seleccione una causa' });
		this.asistenciaService.getCauses().subscribe((data: any) => {
			this.causes = this.causes.concat(data.causes)
		});
	}

	private checkTime() {
		let reqData = {
			'usuario': this.authService.getUsuario().usuario
		};

		this.asistenciaService.checkTime(reqData)
			.subscribe((data: any) => {
				this.checkedTime = true;
				this.late = data.late;
				this.formData.type = data.type;

				if (this.late && (this.formData.type == 2)) {
					let message = {
						type: 'warning',
						msg: '¡El tiempo para marcar la salida es antes del horario vigente! Deberá justificarlo', // '¡Ha pasado el tiempo de entrada del horario vigente! Deberá justicarlo'
						keep: true
					};

					for (let i = 0; i < this.messageAlert.length; i++)
						if (this.messageAlert[i].keep === true) {
							this.messageAlert[i].type = message.type;
							this.messageAlert[i].msg = message.msg;
							return;
						}

					this.messageAlert.push(message);
					console.log(this.checks);
				}
			});
	}

	public sendAuth() {
		this.usuario.auth(this.reqAuth).subscribe((response:any) => {
			let data = response.data;
		});
	}

	public onSelectedUser(user: string) {
		this.user = user;
		localStorage.setItem('Usuario', JSON.stringify(this.user));
		//localStorage.getItem("Usuario");
		console.log('USER ===>', this.user);
		this.checkTime();
		this.checksToday();
	}

	public cancelAction(): void {
		this.toastr.info('Acción cancelada');
	}
}
