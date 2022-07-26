import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AuthService } from './../services/auth.service';
import { _window, _$ } from 'app/common';
import { PuntajeService } from './../services/puntaje.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-mi-produccion',
  templateUrl: './miproduccion.component.html',
  styleUrls: ['miproduccion.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MiProduccionComponent implements OnInit, AfterViewInit {
  @ViewChild(DaterangePickerComponent)
  private picker: DaterangePickerComponent;
  private server = environment.API_URL;
  private headers = new Headers({
    'Content-Type': 'application/json'
  });
  public mispuntosmes: any;
  public form: any = { usuario_id: 0, fecha: moment().format('YYYY-MM') };
  public niveles: any[] = [];
  public cajones: any = [];
  public modulos: any[] = [];
  public mispuntos: any = {};
  public mispuntosfecha: any = {
    'piezas': 0,
    'puntos': 0,
    'horas': '00:00',
    'horas_total': 1,
  };
  public config2Change: any;
  public is_admin: string = '';
  public fecha: any = '';
  public fecha_prod: any = moment().format('YYYY-MM');
  public limits = [10, 25, 50, 100]
  public limit = this.limits[0]
  public punto: any = { usuario: { usuario: null, usuario_id: null } }
  public months: any = { Enero: '' }
  constructor(private http: HttpClient, private authService: AuthService, private toastr: ToastrService, private puntajeService: PuntajeService) { }


  public getNiveles() {
    this.http.get(`${this.server}/niveles`).pipe(map((res: HttpResponse<any>) => res)).subscribe((response:any) => {
      let res = response;
      let niveles = res.niveles;
      let nuevo2: any = [];

      if (niveles.length) {
        nuevo2 = [
          [
            niveles[0],
            niveles[1],
            niveles[2],
          ],
          [
            niveles[3],
            niveles[4],
            niveles[5],
          ],
          [
            niveles[6],
            niveles[7],
            niveles[8],
          ]
        ];

        this.modulos = [
          niveles[10],
          niveles[11],
          niveles[12],
        ]

        this.cajones = niveles[9];
      }

      this.niveles = nuevo2
      //console.log('estos son los niveles', niveles)
      //console.log(this.modulos[0])
    })
  }

  ngOnInit() {
    // this.permissionService.loadPermissions(['Usuario']);
    this.getNiveles();
    this.getPuntos();
    this.is_admin = this.authService.getUsuario().rol
    console.log(this.is_admin)
    console.log('usuario', this.authService.getUsuario())
  }

  ngAfterViewInit() {

  }
  getPuntos() {
    let data = {
      usuario: this.authService.getUsuario().usuario,
      limit: this.limit,
      fecha: this.fecha_prod
    }
    this.puntajeService.getPuntaje(data).subscribe(response => {
      this.mispuntos = response;
      console.log(this.mispuntos);
    }, (err) => {
      console.log('ERROR');
    });
  }

  public changeConfig(event, nivel): void {
    console.log(nivel);
    this.config2Change = nivel;
    _$('#change-config').modal('show');

  }

  public onChangeConfig(nivel): void {
    let data = nivel;
    console.log(nivel);
    this.toastr.info('Actualizando...');

    this.puntajeService.updateNivel(data).subscribe((response:any) => {
      if (response.nivel) {
        this.toastr.success('Nivel de Complejidad actualizado!');
        this.getNiveles();
      }
    });
  }

  public onChangeDate(date): void {
    this.puntajeService.getPuntajeDate({ fecha: date }).subscribe(response => {
      this.mispuntosfecha = response;
      console.log(this.mispuntosfecha)
    })
  }

  public onChangeDateProd(date): void {
    this.puntajeService.getPuntajeDate({fecha:date}).subscribe(response => {
      this.mispuntosfecha =response;
      console.log(this.mispuntosfecha)
    })
  }

  public selectedDate(value: any, datepicker?: any) {

    this.form.fecha_inicio = value.start._d;
    this.form.fecha_fin = value.end._d;

  }

  public selectedDateProd(value: any, datepicker?: any) {
    return value;
  }

  public calendarApplied(event: any) {
    this.form.fecha = event.picker.startDate.format('YYYY-MM');

    this.puntajeService.getPuntajeDate({ fecha: this.form.fecha, month: true }).subscribe(response => {
      this.mispuntosmes = response;
      console.log(this.mispuntosmes)
    })
  }

  public calendarAppliedProd(event: any) {
    this.fecha_prod = event.picker.startDate.format('YYYY-MM');
    console.log(this.fecha_prod);
    this.getPuntos();
  }

}
