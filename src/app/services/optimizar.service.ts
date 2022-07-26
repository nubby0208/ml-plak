import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class OptimizarService {

  private server = environment.API_URL;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(private http: HttpClient) { }


  public optimizarServis(data) {
    return this.http.post(`${this.server}/optimizacion`, { 'data': data }, { headers: this.headers })
      .pipe(map((res: HttpResponse<any>) => res));

  }

  public getOptimizacion(project_name: string): any {
    return this.http.get(`${this.server}/${project_name}/optimizacion`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
  }

  public download_pdf(project_name: string) {
    return this.http.get(`${this.server}/${project_name}/download_pdf`, {
      responseType: 'blob',
      //search: // query string if have
    }).pipe(map(res => {
      return {
        filename: project_name + '.pdf',
        data: res
      };
    }))
      .subscribe(res => {
        console.log('start download:', res);
        var url = window.URL.createObjectURL(res.data);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = res.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
      }, error => {
        console.log('download error:', JSON.stringify(error));
      }, () => {
        console.log('Completed file download.')
      });

  }


}
