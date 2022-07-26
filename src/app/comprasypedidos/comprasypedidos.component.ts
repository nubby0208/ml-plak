import { environment } from './../../environments/environment';
import { ModalOptimizeComponent } from './../modal-optimize/modal-optimize.component';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CellInfo } from './../models';
import { ModalSelectComponent, SelectTypeEnum } from './../modal-select/modal-select.component';
import { ModalAlertComponent } from './../modal-alert/modal-alert.component';
import { TablePropertiesService } from './../services/table-properties.service';
import { GoogleApiEventService } from './../google-api-event.service';
import { GoogleApiService } from './../google-api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { Client, Sheet, TableProperties } from 'app/models';
import { _window, _$ } from 'app/common';
import * as moment from 'moment';
import { NgForm, NgModel, DefaultValueAccessor, NgControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'


@Component({
  selector: 'app-comprasypedidos',
  templateUrl: './comprasypedidos.component.html',
  styleUrls: ['./comprasypedidos.component.css']
})
export class ComprasypedidosComponent implements OnInit {
  public cantidad
  public producto
  public descripcion
  public urgencia
  public pqcliente
  public llegoprodu
  public pedidopor
  @ViewChild('ComprasYpedidos') public ComprasYpedidos: NgForm;
  @ViewChild(ModalAlertComponent)
  private modalAlertComponent: ModalAlertComponent;

  @ViewChild(ModalSelectComponent)
  private modalSelectComponent: ModalSelectComponent;

  @ViewChild(ModalOptimizeComponent)
  private modalOptimizeComponent: ModalOptimizeComponent;

  selectClientList: object[];

  clients: Client[];
  sheets: Sheet[];
  selectedClient: Client;
  selectedSheet: Sheet; // this.selectedSheet.name = 'C1' https://mlplak.herokuapp.com/api/agregar-compra
  sheetId = 0;
  spreadSheetUrl;
  logged: boolean;
  displaydata: boolean = false
  displaydataerr: boolean = false
  public items = []
  public datacliente: any = []
  public formClientes
  public inClientes
  public dataituser
  public formUsers = []
  public itemsss = {
    title: '',
    start: '',
  }


  public itemsData
  public datait
  public isertdata
  public dataittems = []
  public mensaje
  public allcompras
  public estadoCompra
  selectedTable: string;
  iframeHeight = '500px';

  constructor(private sanitizer: DomSanitizer,
    public googleApi: GoogleApiService,
    private googleApiEvent: GoogleApiEventService,
    private tableProperties: TablePropertiesService,
    private ref: ChangeDetectorRef,
    private zone: NgZone, private _http: HttpClient) { }

  ngOnInit() {
    //localStorage.setItem('Clientes',  '');
    this.displaydata = false
    this.vercompra()

    //	console.log('data')
    this.googleApi.getClients().then(clients => {
      this.datait = JSON.stringify(clients);
      this.clients = clients;
      localStorage.setItem('Clientes', this.datait);
      // console.log('->',this.datait)

    });
    if (localStorage.getItem("Clientes")) {
      // code...


      this.formClientes = localStorage.getItem("Clientes");
      this.inClientes = JSON.parse(this.formClientes);
      this.formUsers = [{ usuario: 'Alvarez' },
      { usuario: 'Trebec' },
      { usuario: 'Grondona' },
      { usuario: 'Ben' },
      { usuario: 'Lorenzo' },
      { usuario: 'Aguero' },
      { usuario: 'Invitado' }
      ]
    }


  }
  guardarDtaa() {


    this.isertdata = { cantidad: this.cantidad, producto: this.producto, descripcion: this.descripcion, urgencia: this.urgencia, pqcliente: this.pqcliente, llegoprodu: 'NO', pedidopor: localStorage.getItem("Usuario") }

    //console.log(this.isertdata)

    if (this.isertdata.cantidad == '' || this.isertdata.cantidad == undefined) {
      this.displaydata = false
      this.displaydataerr = true
      // code...
    } else {
      this._http.post('https://mlplak.herokuapp.com/api/agregar-compra', this.isertdata).pipe(
        map((res: HttpResponse<any>) => res))
        .subscribe((data: any) => {

          this.mensaje = data.mensaje
          this.displaydata = true
          this.displaydataerr = false
          // console.log(data)
          this.cantidad = ''
          this.producto = ''
          this.descripcion = ''
          this.urgencia = ''
          this.pqcliente = ''
          this.llegoprodu = ''
          this.pedidopor = ''
          this.vercompra()
        });

    }
  }

  postlisto(idcompra) {
    console.log(idcompra)

  }

  vercompra() {

    this.pedidopor = localStorage.getItem("Usuario")
    this.formUsers = [{ usuario: 'Alvarez' },
    { usuario: 'Trebec' },
    { usuario: 'Grondona' },
    { usuario: 'Ben' },
    { usuario: 'Lorenzo' },
    { usuario: 'Aguero' },
    { usuario: 'Invitado' }
    ]
    this.googleApi.getClients().then(clients => {
      this.datait = JSON.stringify(clients);
      this.clients = clients;
      localStorage.setItem('Clientes', this.datait);
      this.formClientes = localStorage.getItem("Clientes");
      this.inClientes = JSON.parse(this.formClientes);
      console.log('->', this.inClientes)

    });

    this._http.get('https://mlplak.herokuapp.com/api/compras').pipe(
      map((res: HttpResponse<any>) => res))
      .subscribe(data => {
        this.allcompras = data
        // console.log(data.pedidopor.split("*"))



      });
  }

  checkCompra(idcompra, estado) {
    console.log(idcompra, estado)
    if (estado == '' || estado == 'NO') {
      this.estadoCompra = { id: idcompra, llegoprodu: 'SI' }
      document.getElementById(idcompra).classList.remove('NO');
      document.getElementById(idcompra).classList.add('SI');
      document.getElementById(idcompra).classList.remove('btn-primary');
      document.getElementById(idcompra).classList.add('btn-success');
      console.log(this.estadoCompra)
      this._http.put('https://mlplak.herokuapp.com/api/estado-compra/' + idcompra, this.estadoCompra)
        .pipe(
          map((res: HttpResponse<any>) => res))
        .subscribe(data => {
          this.vercompra()
          console.log(this.estadoCompra, data)
          //this.Callmensajeuser()

        });
    }

  }

}
