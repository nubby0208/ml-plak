import { environment } from './../../environments/environment';
import { _$ } from 'app/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { PdfViewerComponent } from './../pdf-viewer/pdf-viewer.component';

import 'rxjs/add/operator/toPromise';

export class OptimizationData {
  projectName: string;
  sheetName: string;
  sawKerf: number;
  trim: number;
}

@Component({
  selector: 'app-modal-optimize',
  templateUrl: './modal-optimize.component.html'
})
export class ModalOptimizeComponent implements OnInit {
  formData: OptimizationData; // Form a enviar al optimizador
  optimizedUrl: string; // Url del ultimo documento pdf optimizado
  inProgress: boolean; // Optimizacion en progreso

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.formData = { projectName: 'Project Name', sheetName: 'Sheet Name', sawKerf: 7, trim: 7 };
  }

  showModal(projectName: string, sheetName: string) {
    // Configure project name
    this.formData.projectName = projectName;
    this.formData.sheetName = sheetName;

    // Get optimization url
    this.getOptimization();

    // Show modal
    _$('#myModalOptimize').modal();
  }

  // Obtener ultima optimizacion del proyecto
  getOptimization() {
    /*this.optimizedUrl = null;
    this.http.get(environment.OPTIMIZATION_URL, {
      params: {
        projectName: this.formData.projectName,
        sheetName: this.formData.sheetName
      }
    })
    .toPromise()
    .then(response => {
      const r = response.json();
      this.inProgress = false;
      this.optimizedUrl = r.success ? r.response.url : null;
    })
    .catch(response => {
      console.log(response);
      this.inProgress = false
    });*/
  }

  optimize() {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;

    this.http.post(environment.OPTIMIZATION_URL, this.formData)
      .toPromise()
      .then((response: any) => {
        this.inProgress = false;
        this.optimizedUrl = response.response.url
      })
      .catch(response => {
        window.alert('Error durante la optimización: ' + response._body);
        console.log(response);
        this.inProgress = false
      });
  }


}
