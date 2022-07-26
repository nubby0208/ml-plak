import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
//import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from  '@angular/common/http';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ImagenTareaUploadService {
  private server = environment.API_URL;
  private token_name = environment.TOKEN_NAME;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) { }
  //Observable<HttpEvent<any>> 

  public upload(imagen, idTarea): Observable<any> {
    let uploadURL = `${this.server}/eventimage/${idTarea}`;
    console.log('uploading image: ', imagen);
    return this.http.post(uploadURL, imagen);


    // return this.http.post(uploadURL, imagen, {
    //   reportProgress: true,
    //   observe: 'events'
    // }).pipe(map((event) => {
    //   console.log(event)
    //   /*
    //   switch (event.type) {

    //       case HttpEventType.UploadProgress:
    //         const progress = Math.round(100 * event.loaded / event.total);
    //         return { status: 'progress', message: progress };

    //       case HttpEventType.HttpResponse<any>
    //:
    //         return event.body;
    //       default:
    //         return `Unhandled event: ${event.type}`;
    //     }*/
    // })
    // );
  }


  /*
   public subirArchivo(archivo,idTarea){
    let uploadURL = `${this.server}/${idTarea}`;
  
   }*/

}
