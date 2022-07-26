import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Usuario } from './../models';
import { UsuarioService } from './../services/usuario.service';
import * as moment from 'moment';
import { PuntajeService } from '../services/puntaje.service';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
@Component({
  selector: 'app-produccion-admin',
  templateUrl: './produccion-admin.component.html',
  styleUrls: ['./produccion-admin.component.css']
})
export class ProduccionAdminComponent implements OnInit {
  @ViewChild(DaterangePickerComponent)
  private picker: DaterangePickerComponent;
  public daterange: any;
  public usuarios: Array<Usuario> = [];
  public asistencias: Array<any> = [];
  public form: any = { usuario_id: 0, fecha_inicio: moment().format('YYYY-MM-DD'), fecha_fin: moment().format('YYYY-MM-DD') };
  public data: any = { usuario: "", puntaje: 0, piezas: 0, horas_totales: 0, horas_taller: 0 };
  constructor(private usuarioService: UsuarioService, private zone: NgZone, private puntajeService: PuntajeService) { }

  ngOnInit() {
    this.usuarios.push(new Usuario);
    this.usuarios[0].usuario = 'Todos';
    this.usuarios[0].id = 0;

    this.zone.run(() => {
      this.usuarioService.getAll().subscribe((data:any) => {
        this.usuarios = this.usuarios.concat(data.usuarios);
      });
    });
  }

  public selectedDate(value: any, datepicker?: any) {
    console.log(value);

    this.form.fecha_inicio = value.start._d;
    this.form.fecha_fin = value.end._d;
  }

  public reloadAsistencias() {
    console.log(this.form);
    this.puntajeService.get_prod_by_date(parseInt(this.form.usuario_id), this.form.fecha_inicio, this.form.fecha_fin)
      .subscribe((data: any) => {
        this.data.usuario = data.usuario
        this.data.puntos = data.puntos
        this.data.piezas = data.piezas
        this.data.horas_totales = data.horas_totales
        this.data.horas_taller = data.horas_taller
      });

  }

  public calendarApplied(event: any) {
    this.form.fecha_inicio = event.picker.startDate.format('YYYY-MM-DD');
    this.form.fecha_fin = event.picker.endDate.format('YYYY-MM-DD');
  }

  public resetForm() {
    this.form = { usuario_id: 0, fecha_inicio: moment().format('YYYY-MM-DD'), fecha_fin: moment().format('YYYY-MM-DD') };
    this.picker.datePicker.setStartDate(moment());
    this.picker.datePicker.setEndDate(moment());
  }

}
