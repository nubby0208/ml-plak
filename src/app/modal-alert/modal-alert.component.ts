import { _$ } from 'app/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html'
})
export class ModalAlertComponent {

  title: string;
  content: string;

  showModal(title: string, content: string) {
    this.title = title;
    this.content = content;
    _$('#myModal').modal();
  }

}
