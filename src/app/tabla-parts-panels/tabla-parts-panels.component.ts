import { environment } from './../../environments/environment';
import { SpreadsheetTable, SpreadsheetCell, SpreadsheetRange } from './../models';
import { Component, OnInit, NgZone } from '@angular/core';
import { GoogleApiEventService } from 'app/google-api-event.service';
import { GoogleApiService } from 'app/google-api.service';

const PARTS_PANELS_SHEET_RANGE = new SpreadsheetRange();
PARTS_PANELS_SHEET_RANGE.sheet = 'Panels';
PARTS_PANELS_SHEET_RANGE.colStart = 'A';
PARTS_PANELS_SHEET_RANGE.rowStart = 5;
PARTS_PANELS_SHEET_RANGE.colEnd = 'F';
PARTS_PANELS_SHEET_RANGE.rowEnd = 16;

@Component({
  selector: 'app-tabla-parts-panels',
  templateUrl: './tabla-parts-panels.component.html'
})
export class TablaPartsPanelsComponent implements OnInit {
  // Indica si esta inicializado GoogleSpreadsheets
  logged: boolean;

  // Permite filtrar los datos de la tabla de google mostrando solo las filas vacias
  filterData = true;

  // Tabla con los datos filtrados si filterData esta activado
  table: SpreadsheetCell[][];

  // Tabla con todos los datos de Google
  private rawTable: SpreadsheetTable;

  constructor(
    public googleApi: GoogleApiService,
    private googleApiEvent: GoogleApiEventService,
    private zone: NgZone) { }

  ngOnInit() {
    // Subscribe Signin Event
    this.subscribeGoogleLoginEvent();
  }

  public onFilterDataChange() {
    this.filterData = !this.filterData;
    this.filterTable();
  }

  public updateCell(oldCell: SpreadsheetCell, newCell: SpreadsheetCell) {
    if (oldCell.value === newCell.value) {
      return;
    }

    // Update model
    oldCell.value = newCell.value;

    // Update in Google Spreadsheet
    this.googleApi.writeCell(
      environment.MONITOR_GENERAL_SHEET_ID,
      PARTS_PANELS_SHEET_RANGE.sheet + '!' + oldCell.name + ':' + oldCell.name,
      newCell.value)
    .then(result => {})
    .catch(error => {});

    // Update table filter
    this.filterTable();
  }

  // Subscribe Signin Event
  private subscribeGoogleLoginEvent(): void {
    this.googleApiEvent.notifierSigninStatus.subscribe(data => {
      // Actualizar UI
      this.zone.run(() => {
        this.logged = true;
      });

      // Obtener datos de la tabla
      this.getPartsPanelsTable();
    });
  }

  private getPartsPanelsTable(): void {
    this.googleApi.getRawCells(environment.MONITOR_GENERAL_SHEET_ID, PARTS_PANELS_SHEET_RANGE.toGoogleRange())
    .then(result => {
      // Convertir a SpreadsheetTable
      const table = this.toSpreadsheetTable(
        PARTS_PANELS_SHEET_RANGE.rowStart,
        this.toNumberedColumn(PARTS_PANELS_SHEET_RANGE.colStart),
        this.toNumberedColumn(PARTS_PANELS_SHEET_RANGE.colEnd),
        result
      );

      // Filtrar filas que contengan 'YES' en la primera columna ('Active')
      table.filterRows((rowData, rowIndex) => {
        return rowData[0].value === 'YES';
      });

      // Excluir la primera columna
      table.selectColumns([1, 2, 3, 4, 5]);

      // Establecer columnas editables
      table.setEditableColumns([1, 2, 3]);

      // Actualizar UI
      this.zone.run(() => {
        this.rawTable = table;
        this.filterTable();
      });
    });
  }

  public toSpreadsheetTable(rowInit: number, colInit: number, colEnd: number, rawData: string[][]): SpreadsheetTable {
    const table = new SpreadsheetTable();

    // Rellenar filas que tienen valores en null con la cadena vacia
    const columns = colEnd - colInit + 1;
    rawData = rawData.map(row => {
      return row.concat(Array(columns - row.length).fill(''));
    });

    // Mapear cada dato a una SpreadsheetCell
    table.data = rawData.map((row, rIndex) => {
      return row.map((cell, cIndex) => {
        const sc: SpreadsheetCell = {
          value: cell,
          name: this.toNamedColumn(colInit + cIndex) + (rowInit + rIndex),
          editable: false
        };
        return sc;
      });
    });

    return table;
  }

  public toNamedColumn(column: number): string {
    if (column < 26) {
      return String.fromCharCode(column + 96).toLocaleUpperCase();
    }

    throw new Error('2 chars columns not implemented.');
  }

  public toNumberedColumn(column: string): number {
    column = column.toLocaleLowerCase();
    if (column.length === 1) {
      return column.charCodeAt(0) - 96;
    }

    throw new Error('2 chars columns not implemented.');
  }

  private filterTable() {
    let emptyRow = false;
    let rowCount = 0;
    this.table = this.filterData ? this.rawTable.data.filter(value => {
      const empty = value[1].value === '' || value[2].value === '' ||
        value[3].value === '' || value[3].value === '0';

      rowCount++;

      if (!empty) {
        return true;
      }

      if (!emptyRow) {
        emptyRow = true;
        return true;
      }
      return rowCount <= 3;
    }) : this.rawTable.data;
  }
}
