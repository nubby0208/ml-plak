import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgForm, NgModel, DefaultValueAccessor, NgControl } from '@angular/forms';
import { Router } from '@angular/router';
import { _window, _$ } from 'app/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { ProyectoService } from './../../services/proyecto.service';
import { MaterialService } from './../../services/material.service';
import { EstadoService } from './../../services/estado.service';
import { PiezaService } from './../../services/pieza.service';

import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-piezas',
  templateUrl: './admin-piezas.component.html',
  styleUrls: ['./admin-piezas.component.css']
})
export class AdminPiezasComponent implements OnInit {
  @Output() public change_title = new EventEmitter();
  public proyecto: any;
  public proyectoInfo: any;
  public piezas: any = [];
  public materiales: any = [];
  public estados: any = [];
  public modulos: any = [];
  public show_form: boolean = false;
  public newPieza: any = {};
  public pieza_id: number =  0;

  constructor(private proyectoService: ProyectoService, private toastr: ToastrService, private materialService: MaterialService, private estadoService: EstadoService, private piezasService: PiezaService ) {}

  ngOnInit() {
    this.change_title.emit( 'Piezas del Proyecto' )
    this.InitModel()
    this.materialService.getAllRaw().subscribe( (response:any) => {
      this.materiales = response.materiales
    });
    this.estadoService.getAll().subscribe((response:any) => {
      this.estados = response.estados;
    });
  }
  
  public setProyecto( proyecto: any )
  {
    this.proyecto = proyecto;
  }
  
  public setShowForm(status: boolean)
  {
    this.show_form = status
    this.change_title.emit( 'Piezas del Proyecto '+this.proyectoInfo.cliente.nombre_completo+' - ' +this.proyectoInfo.proyecto );
  }

  public infoProject(proyecto_id: number): void {
    this.show_form = false
    let self = this
    if (proyecto_id > 0) {
      this.proyectoService.getByIdAll(proyecto_id).subscribe((response:any) => {
        this.proyectoInfo = response.proyecto;
        this.modulos = response.proyecto.modulos
        self.change_title.emit( 'Piezas del Proyecto '+this.proyectoInfo.cliente.nombre_completo+' - ' +this.proyectoInfo.proyecto );
        self.piezas = [];
        for (let i = 0; i < this.proyectoInfo.modulos.length; i++) {
            let piezas = this.proyectoInfo.modulos[i]['piezas'];
            self.piezas = self.piezas.concat(piezas);
        }
      });//end this.proyectoService
    }//end if
  }

  public new(): void {
    this.show_form = true
    this.InitModel()
    this.change_title.emit( 'Agregar Nueva Pieza')
  }

  private save(): void {
    let self = this
    this.piezasService.create(this.newPieza).subscribe((response:any) => {
        self.newPieza = response.pieza
        this.show_form = false
        this.InitModel()
        this.toastr.success('Pieza Guardada...');
      }, response => {
        let errors = JSON.parse(response._body);
        
        for (let key in errors) {
          this.toastr.error(errors[key])
        }
      }
    );
  }

  private edit(index : number): void {
    this.show_form = true
    this.newPieza = this.piezas[index]
    this.change_title.emit( 'Editando la Pieza '+this.newPieza.pieza )
  }

  private delete( index: number): void 
  {
    let pieza = this.piezas[index]
    swal({ 
      title: 'Confirma Eliminar La Pieza'+pieza.pieza+' del Proyecto '+this.proyectoInfo.cliente.nombre_completo+' - ' +this.proyectoInfo.proyecto,
      text: 'La Pieza Sera Borrada de manera Permanente',
      type:'question',
      showCancelButton:true 
    }).then((result) => {
      if (result.value) {
        this.piezasService.delete(pieza.id).subscribe(response => {
            this.piezas.splice(index, 1)
            this.toastr.info('Pieza Borrada...');

          }, error => {
            console.log(error._body);
          }
        );
     }
   });
  }

  public update()
  {
    this.piezasService.update(this.newPieza).subscribe(response => {
        console.log( response )
        this.toastr.success('Pieza Actualizada...');
      }, error => {
        console.log(error._body);
      }
    );
  } 

  private InitModel()
  {
    this.newPieza = {
      pieza                : '',
      modulo_id            : '',
      cantidad             : '',
      posicion_x           : '',
      posicion_y           : '',
      posicion_z           : '',
      lveta                : '',
      aveta                : '',
      espesor              : '',
      orientacion          : '',
      proyecto_id          : '',
      material_id          : '',
      estado_id            : '',
      prearmado_estado_id  : '',
    } 
  }
}
