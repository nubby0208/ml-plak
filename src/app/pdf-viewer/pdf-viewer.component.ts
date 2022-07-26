import { Component, OnInit } from '@angular/core';
import { OptimizarService } from './../services/optimizar.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-pdf-viewer',
  template: `
	  <pdf-viewer [src]="pdfSrc" 
	              [render-text]="true"
	              [page]="page"
	              [show-all]="true"
	              style="display: block;"
	  ></pdf-viewer>
  `
})

export class PdfViewerComponent implements OnInit {

  pdfSrc: string = '';
  page: number = 1;
  src: any = '';

  constructor(private optimizarService: OptimizarService, private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit() {

  }

  public onFileSelected(project_name: string, download: boolean) {

    this.http.get(`${environment.API_URL}/${project_name}/download_pdf`, {
      responseType: 'blob',
      //search: // query string if have
    })
      .pipe(map((res: Blob) => {

        if (typeof (FileReader) !== 'undefined') {
          let reader = new FileReader();
          reader.onload = (e: any) => {
            this.pdfSrc = e.target.result;
          }

          reader.readAsArrayBuffer(res);

        }
        //if( download )
        //{
        return {
          filename: project_name + '.pdf',
          target: '_blank',
          data: res
        };
        //}else
        //this.toastr.success('¡Optimizacion Cargada!');    
      }))
      .subscribe(res => {
        if (download) {
          console.log('start download:', res);
          var url = window.URL.createObjectURL(res.data);
          var a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.target = res.target;
          a.download = res.filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove(); // remove the element
          this.toastr.success('¡PDF Optimizacion Descargado!');
        } else {
          var url = window.URL.createObjectURL(res.data);
          var a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.target = res.target;
          //a.download = res.filename;
          a.click();
          //window.URL.revokeObjectURL(url);
          a.remove(); // remove the element
        }
      }, error => {
        console.log('download error:', JSON.stringify(error));
      }, () => {
        console.log('Completed file download.')
      });
  }

}

