import { Component, OnInit } from '@angular/core';
import { PresupuestoService } from 'app/services/presupuesto.service';
import { Presupuesto } from 'app/models';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-presupuestos',
  templateUrl: './presupuestos.component.html',
  styleUrls: ['./presupuestos.component.css']
})
export class PresupuestosComponent implements OnInit {

  public presupuestosDb: Array<Presupuesto> = new Array<Presupuesto>();
  public presupuestos = [];
  public isStaging: boolean;

  constructor(private _presupuestoService: PresupuestoService, private _ngxUiService: NgxUiLoaderService,
    private toastr: ToastrService,) { }

  ngOnInit() {
    this.isStaging = window.location.href.includes("staging");
    this._ngxUiService.start();
    this.traerPresupuestos();
  }

  newWindow(project: Presupuesto) {
    const url = `/disenio/#/DesignCenter/0000000${project.project_id}00000`;
    window.open((!this.isStaging) ? `http://staging.mlplak.com${url}` : `http://mlplak.com${url}`);
  }

  traerPresupuestos() {
    this._presupuestoService.getAll().subscribe(data => {
      this.presupuestosDb = data;
        this.presupuestosDb.map(pres => {
          try {
            const { cliente, comentarioResumen } = JSON.parse(pres.results);
            let presupuesto = {
              nombre: cliente.name,
              telefono: cliente.phone,
              direccion: cliente.address,
              mail: cliente.mail,
              comentarioResumen,
              estado: pres.estado,
              fecha: pres.fecha,
              pdf: pres.pdf,
              usuario: pres.usuario
            }
            this.presupuestos.unshift(presupuesto);
          } catch (error) {
           console.log('Error parsing: ', pres.results) 
          }
        })
      })
      this._ngxUiService.stop();
  }

  verPdf(item) {
    let pdfWindow = window.open("")
    pdfWindow.document.write(
      "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
      encodeURI(item.pdf) + "'></iframe>"
    )
  }

  CopyPDFURL(item) {
    this.updateClipboard(item.pdf)
  }
  updateClipboard(newClip) {
    let self = this
    let newVariable: any;
    newVariable = window.navigator;
    newVariable.clipboard.writeText(newClip).then(function() {
      self.toastr.success('¡Link copiado correctamente!');
    }, function() {
      self.toastr.error('¡Error al obtener el link!');
    });
  }
}
