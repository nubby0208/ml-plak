import { CellInfo } from './../models';
import { element } from 'protractor';
import { _$ } from 'app/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

export enum SelectTypeEnum {
  Cor, Ok, Box
}

@Component({
  selector: 'app-modal-select',
  templateUrl: './modal-select.component.html'
})
export class ModalSelectComponent implements OnInit {

  @Output()
  onSelected = new EventEmitter<CellInfo>();

  private ITEMS_OK = [];
  private ITEMS_BOX = [];
  private ITEMS_COR = []
  private cellInfo: CellInfo;

  items: string[];

  ngOnInit(): void {
    this.ITEMS_OK.push('');
    for (let i = 1; i <= 20; i++) {
      this.ITEMS_OK.push(i);
    }

    this.ITEMS_BOX.push('');
    for (let i = 1; i <= 50; i++) {
      this.ITEMS_BOX.push('BOX ' + i);
    }
  }

  showModal(cellInfo: CellInfo) {
    this.cellInfo = cellInfo;

    switch (cellInfo.selectType) {
      case SelectTypeEnum.Ok:
        this.items = this.ITEMS_OK;
        break;
      case SelectTypeEnum.Box:
        this.items = this.ITEMS_BOX;
        break;
      case SelectTypeEnum.Cor:
        this.items = this.ITEMS_COR;
        break;
      default:
        console.error('Incorrect modal type: ' + cellInfo.selectType);
    }
    _$('#myModalSelect').modal();
  }

  public setCorItems(items: string[]) {
    this.ITEMS_COR = items;
  }

  selectedElement(element: string) {
    _$('#myModalSelect').modal('hide');

    this.cellInfo.value = element;
    this.onSelected.emit(this.cellInfo);
  }

}
