import { element } from 'protractor';
import { environment } from './../../environments/environment';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

// import { GoogleApiService } from 'app/google-api.service';
import { UsuarioService } from 'app/services/usuario.service';
import { _$ } from 'app/common';

@Component({
  selector: 'app-user-selector',
  templateUrl: './user-selector.component.html'
})
export class UserSelectorComponent implements OnInit {

  @Output()
  onSelected = new EventEmitter<string>();

  items: string[];

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.getUserList();
  }

  getUserList() {
    // Obtener lista de usuarios
    // this.googleApi.getRawCells(environment.MONITOR_GENERAL_SHEET_ID, 'VAL!C3:C8')
    // .then(result => {
    //   this.items = [];
    //   for (let i = 0; i < result.length; i++) {
    //     if (result[i][0]) {
    //       this.items.push(result[i][0]);
    //     }
    //   }
    //   _$('#userModalSelect').modal();
    // })
    // .catch(reason => {
    // 	console.log('getUserlist.catch: ', reason);
    // });
    this.usuarioService.getAll().subscribe((data: any) => {
      this.items = data.usuarios;
      console.log(this.items);
      _$('#userModalSelect').modal();
    });
  }

  selectedElement(element: string) {
    _$('#userModalSelect').modal('hide');
    this.onSelected.emit(element);
  }
}
