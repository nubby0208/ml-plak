import { Component, OnInit } from '@angular/core';

function _window() {
  return (window as any);
}

function _$(str: string) {
  return (window as any).$(str);
}

const mapColors: Map<string, string> = new Map();
mapColors.set('_', '#00ff00'); // '0 255 0'
mapColors.set('.', '#cccccc'); // '204 204 204'
mapColors.set('-', '#ff0000'); // '255 0 0'
mapColors.set(',', '#b7e1cd'); // '183 225 205'
mapColors.set(':', '#6fa8dc'); // '111 168 220'
mapColors.set(';', '#ffff00'); // '255 255 0'
mapColors.set('"', '#ff00ff'); // '255 0 255'
mapColors.set('°', '#7f6000'); // '127 96 0'
mapColors.set('{', '#f6b26b'); // '246 178 107'
mapColors.set(')', '#000000'); // '0 0 0'
mapColors.set('/', '#0000ff'); // '0 0 255'
mapColors.set('[', '#8e7cc3'); // '142 124 195'

mapColors.set(' ', '#ff7f27'); // '255 127 39'

function cellStyle(value, row, index, field) {
  const lastChar = (value as string).charAt((value as string).length - 1);
  const selColor = mapColors.get(lastChar);

  if (selColor == null) {
    return {};
  }

  return {
    css: {'background-color': selColor}
  };
}
(window as any).cellStyle = cellStyle;

function boxSelectFormatter(value, row, index, column, btColumn) {
  if (value === ' ') {
    return ' ';
  }

  return '<button (click)="cellClicked(' + index + ', ' + index + ')" type="button" class="btn btn-block"'
    + 'id="Box_' + index + '_' + column + '_' + btColumn + '">' + value
    + '<span class="caret"></span></button>';
}
(window as any).boxSelectFormatter = boxSelectFormatter;

function numberSelectFormatter(value, row, index, column, btColumn) {
  if (value === ' ') {
    return ' ';
  }

  return '<button (click)="cellClicked(' + index + ', ' + index + ')" type="button" class="btn btn-block"'
    + 'id="Ok_' + index + '_' + column + '_' + btColumn + '">' + value
    + '<span class="caret"></span></button>';
}
(window as any).numberSelectFormatter = numberSelectFormatter;

function format_PCyPre_OK(value, row, index) {
  return numberSelectFormatter(value, row, index, 'V', 15);
}
(window as any).format_PCyPre_OK = format_PCyPre_OK;

function format_PCyPre_BOX(value, row, index) {
  return boxSelectFormatter(value, row, index, 'X', 17);
}
(window as any).format_PCyPre_BOX = format_PCyPre_BOX;

function format_VERMOD_OK(value, row, index) {
  return numberSelectFormatter(value, row, index, 'R', 11);
}
(window as any).format_VERMOD_OK = format_VERMOD_OK;

function format_VERMOD_BOX(value, row, index) {
  return boxSelectFormatter(value, row, index, 'T', 13);
}
(window as any).format_VERMOD_BOX = format_VERMOD_BOX;

function format_C1_OK(value, row, index) {
  return numberSelectFormatter(value, row, index, 'P', 9);
}
(window as any).format_C1_OK = format_C1_OK;

function format_C1_BOX(value, row, index) {
  return boxSelectFormatter(value, row, index, 'R', 11);
}
(window as any).format_C1_BOX = format_C1_BOX;

function format_premodcompras_OK(value, row, index) {
  return numberSelectFormatter(value, row, index, 'E', 3);
}
(window as any).format_premodcompras_OK = format_premodcompras_OK;

@Component({
  selector: 'app-tabla-material',
  templateUrl: './tabla-material.component.html',
  styleUrls: ['tabla-material.component.css']
})
export class TablaMaterialComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    _$('.selectpicker').selectpicker({
      noneSelectedText: ''
    });

    _$(_window()).on('load.bs.select.data-api', function () {
      console.log('loaded');
      _$('#table').bootstrapTable('resetWidth');
    });
  }

}
