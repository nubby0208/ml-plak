import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class AdminImagesService {

  private server = environment.API_URL;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(private http: HttpClient) { }

  /*leer todos las images de los proyectos*/
  public showAll() {
    return this.http.get(`${this.server}/v2/images/all`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
  }

  public delete_image(filename) {
    return this.http.delete(`${this.server}/v2/images/` + filename, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
  }

  public delete_AllImages(project_folder) {
    return this.http.delete(`${this.server}/v2/images/` + project_folder, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
  }

  public getByToken(token: string): any {
    return this.http.get(`${this.server}/v2/images/${token}`).pipe(map((res: HttpResponse<any>) => res));
  }

  public deleteByProject(token: string): any {
    return this.http.delete(`${this.server}/v2/images/proyecto/${token}`).pipe(map((res: HttpResponse<any>) => res));
  }

  public deleteOne(tokenProject: string, tokenImage: string): any {
    return this.http.delete(`${this.server}/v2/images/proyecto/${tokenProject}/${tokenImage}`).pipe(map((res: HttpResponse<any>) => res));
  }
}
