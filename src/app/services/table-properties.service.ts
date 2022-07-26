import { Injectable } from '@angular/core';
import { TableProperties } from 'app/models';

@Injectable()
export class TablePropertiesService {

  private tablesData: Map<string, TableProperties> = new Map<string, TableProperties>();

  constructor() {
    this.configTables();
  }

  private configTables() {
    this.tablesData.set('PremodYcompras', {
      name: 'PremodYcompras',
      rawRange: '!A3:H13',
      lastColumn: 'H',
      rowRanges: [
        { name: 'Partes', begin: 1, end: 10 },
      ],
      columnValidator: 2,
      columns: [0, 1, 2, 4, 5, 6, 7],
      columnData: [
        { field: '0', title: '', halign: 'center', class: 'table-ok'},
        { field: '1', title: 'CANT', halign: 'center', class: 'table-ok'},
        { field: '2', title: 'CAJONES', halign: 'center', class: 'table-ok'},
        { field: '3', title: 'LISTOS', halign: 'center', class: 'table-ok', formatter: 'format_premodcompras_OK' },
        { field: '4', title: 'FALTAN', halign: 'center', class: 'table-ok'},
        { field: '5', title: '', halign: 'center', class: 'table-ok'},
        { field: '6', title: '', halign: 'center', class: 'table-ok'},
      ],
    });

    this.tablesData.set('PremodYcompras2', {
      name: 'PremodYcompras2',
      rawRange: '!A16:F36',
      lastColumn: 'F',
      rowRanges: [
        { name: 'Ensambles', begin: 1, end: 20 },
      ],
      columnValidator: 2,
      columns: [1, 2, 4],
      columnData: [
        { field: '0', title: '', halign: 'center', class: 'table-ok', formatter: 'format_premodcompras_COR', cellStyle: 'cellStyle'},
        { field: '1', title: 'Ensambles', halign: 'center', class: 'table-ok'},
        { field: '2', title: '', halign: 'center', class: 'table-ok'},
      ],
    });

    this.tablesData.set('PCyPre', {
      name: 'PCyPre',
      rawRange: '!A3:X134',
      lastColumn: 'X',
      rowRanges: [
        { name: 'Muebles', begin: 0, end: 99 },
        { name: 'Cajones', begin: 102, end: 131 },
      ],
      columnValidator: 5,
      columns: [0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 13, 14, 16, 17, 18, 21, 22, 23],
      columnData: [
        { field: '0', title: 'COR', halign: 'center', cellStyle: 'cellStyle'},
        { field: '1', title: 'Nº', halign: 'center', cellStyle: 'cellStyle'},
        { field: '2', title: 'P.C.', halign: 'center', formatter: 'format_PCyPre_PC', cellStyle: 'cellStyle'},
        { field: '3', title: 'PRE', halign: 'center', formatter: 'format_PCyPre_PRE', cellStyle: 'cellStyle'},
        { field: '4', title: 'U', halign: 'center', cellStyle: 'cellStyle'},
        { field: '5', title: 'PIEZA', halign: 'center', cellStyle: 'cellStyle'},
        { field: '6', title: 'MD', halign: 'center', cellStyle: 'cellStyle'},
        { field: '7', title: 'T', halign: 'center', cellStyle: 'cellStyle'},
        { field: '8', title: 'T', halign: 'center', cellStyle: 'cellStyle'},
        { field: '9', title: 'L VETA', halign: 'center', cellStyle: 'cellStyle'},
        { field: '10', title: '', halign: 'center', cellStyle: 'cellStyle'},
        { field: '11', title: 'A VETA', halign: 'center', cellStyle: 'cellStyle'},
        { field: '12', title: 'T', halign: 'center', cellStyle: 'cellStyle'},
        { field: '13', title: 'T', halign: 'center', cellStyle: 'cellStyle'},
        { field: '14', title: 'MATERIAL', halign: 'center', cellStyle: 'cellStyle'},
        { field: '15', title: 'OK', halign: 'center', formatter: 'format_PCyPre_OK', cellStyle: 'cellStyle' },
        { field: '16', title: 'FALTAN', halign: 'center', cellStyle: 'cellStyle'},
        { field: '17', title: 'BOX', halign: 'center', formatter: 'format_PCyPre_BOX', cellStyle: 'cellStyle'}
      ],
    });

    this.tablesData.set('VER-MOD', {
      name: 'VER-MOD',
      rawRange: '!A3:T134',
      lastColumn: 'T',
      rowRanges: [
        { name: 'Muebles', begin: 0, end: 99 },
        { name: 'Cajones', begin: 102, end: 131 },
      ],
      columnValidator: 5,
      columns: [0, 1, 2, 3, 4, 5, 8, 9, 11, 12, 14, 17, 18, 19],
      columnData: [
        { field: '0', title: 'Nº', halign: 'center', cellStyle: 'cellStyle'},
        { field: '1', title: 'COR', halign: 'center', cellStyle: 'cellStyle'},
        { field: '2', title: 'P.C.', halign: 'center', cellStyle: 'cellStyle'},
        { field: '3', title: 'PRE', halign: 'center', cellStyle: 'cellStyle'},
        { field: '4', title: 'U', halign: 'center', cellStyle: 'cellStyle'},
        { field: '5', title: 'PIEZA', halign: 'center', cellStyle: 'cellStyle'},
        { field: '6', title: 'MD', halign: 'center', cellStyle: 'cellStyle'},
        { field: '7', title: 'L VETA', halign: 'center', cellStyle: 'cellStyle'},
        { field: '8', title: '', halign: 'center', cellStyle: 'cellStyle'},
        { field: '9', title: 'A VETA', halign: 'center', cellStyle: 'cellStyle'},
        { field: '10', title: 'MATERIAL', halign: 'center', cellStyle: 'cellStyle'},
        { field: '11', title: 'OK', halign: 'center', class: 'table-ok', formatter: 'format_VERMOD_OK', cellStyle: 'cellStyle' },
        { field: '12', title: 'FALTAN', halign: 'center', class: 'table-remaining', cellStyle: 'cellStyle'},
        { field: '13', title: 'BOX', halign: 'center', formatter: 'format_VERMOD_BOX', cellStyle: 'cellStyle' }
      ],
    });

    this.tablesData.set('C1', {
      name: 'C1',
      rawRange: '!A3:R134',
      lastColumn: 'R',
      rowRanges: [
        { name: 'Muebles', begin: 0, end: 99 },
        { name: 'Cajones', begin: 102, end: 131 },
      ],
      columnValidator: 3,
      columns: [0, 1, 2, 3, 6, 7, 9, 10, 12, 15, 16, 17],
      columnData: [
        { field: '0', title: 'Nº', halign: 'center', cellStyle: 'cellStyle'},
        { field: '1', title: 'COR', halign: 'center', formatter: 'format_C1_COR', cellStyle: 'cellStyle'},
        { field: '2', title: 'U', halign: 'center', cellStyle: 'cellStyle'},
        { field: '3', title: 'PIEZA', halign: 'center', cellStyle: 'cellStyle'},
        { field: '4', title: 'MD', halign: 'center', cellStyle: 'cellStyle'},
        { field: '5', title: 'L VETA', halign: 'center', cellStyle: 'cellStyle'},
        { field: '6', title: '', halign: 'center', cellStyle: 'cellStyle'},
        { field: '7', title: 'A VETA', halign: 'center', cellStyle: 'cellStyle'},
        { field: '8', title: 'MATERIAL', halign: 'center', cellStyle: 'cellStyle'},
        { field: '9', title: 'OK', halign: 'center', class: 'table-ok', formatter: 'format_C1_OK', cellStyle: 'cellStyle' },
        { field: '10', title: 'FALTAN', halign: 'center', class: 'table-remaining', cellStyle: 'cellStyle'},
        { field: '11', title: 'BOX', halign: 'center', formatter: 'format_C1_BOX', cellStyle: 'cellStyle' }
      ],
    });
  }

  public getTableData(name: string) {
    return this.tablesData.get(name);
  }

}
