// import { SelectTypeEnum } from 'app/modal-select/modal-select.component';

export class Sheet {
  public id: number;
  public name: string;
}

export class Client {
  public id: number;
  public name: string;
  public imageFolderLink: string;
  public clientDetailLink: string;
  public clientDetailId: string;
}

export class Range {
  public name: string;
  public begin: number;
  public end: number;
}

export class TableProperties {
  public name: string;
  public rawRange: string;
  public lastColumn: string;
  public rowRanges: Range[];
  public columns: number[];
  public columnData: any[];
  public columnValidator: number;
}

export class CellInfo {
//   public selectType: SelectTypeEnum;

  // Google Spreadsheet
  public sheetId: string;

  public cellRange: string;
  public rowRange: string;
  public validColumns: number[];
  public metadataRange: string;

  // Bootstrap Table
  public tableId: string;
  public row: string;
  public col: string;
  public value: string;
}

export class SpreadsheetCell {
  public value: string;
  public name: string;
  public editable: boolean;
}

export class SpreadsheetTable {
  public data: SpreadsheetCell[][];

  // Filtrar filas dada una funcion particular
  public filterRows(filter: any): void {
    this.data = this.data.filter(filter);
  }

  // Seleccionar una lista de columnas y filtrarlas
  public selectColumns(columns: any) {
    // this.filterColumns((cellData, colIndex) => {
    //   return columns.includes(colIndex);
    // });
    return columns
  }

  public setEditableColumns(columns: any) {
    //this.data = this.data.map(row => {
      // return row.map((cell, colIndex) => {
      //   cell.editable = columns.includes(colIndex);
      //   return cell;
      // });
    //});
    return columns    
  }

  // Filtrar columnas dada una funcion particular
  private filterColumns(filter: any): void {
    this.data = this.data.map(row => {
      return row.filter(filter);
    });
  }
}

export class SpreadsheetRange {
  public sheet: string;
  public colStart: string;
  public rowStart: number;
  public colEnd: string;
  public rowEnd: number;

  public toGoogleRange(): string {
    return `${this.sheet}!${this.colStart}${this.rowStart}:${this.colEnd}${this.rowEnd}`;
  }
}


export class Horario {
  public user_id: number;
  public hora_inicio_lunes: string;
  public hora_fin_lunes: string;
  public hora_inicio_martes: string;
  public hora_fin_martes: string;
  public hora_inicio_miercoles: string;
  public hora_fin_miercoles: string;
  public hora_inicio_jueves: string;
  public hora_fin_jueves: string;
  public hora_inicio_viernes: string;
  public hora_fin_viernes: string;
  public hora_inicio_sabado: string;
  public hora_fin_sabado: string;
  public habilitado_lunes: boolean;
  public habilitado_martes: boolean;
  public habilitado_miercoles: boolean;
  public habilitado_jueves: boolean;
  public habilitado_viernes: boolean;
  public habilitado_sabado: boolean;
  public is_default: boolean;
}

export class Feriado {
  public id: number;
  public fecha: string;
}

export class Grupo {
  public id: number;
  public nombre_grupo: string;
  public activo: boolean;
  public integrantes?: number[] = [];
  public created_at?: Date;
  public updated_at?: Date;
  public grupo_usuarios?: any;
}


export class EncuestaTipo {
  public id: number;
  public nombre: string = '';
  public esTexto: boolean = false;
  public esPregunta: boolean = false;
  public esEstrella: boolean = false;
  public estado: boolean;
  public descripcion: string = "";
  public id_proyecto: number;
  public created_at?: Date;
  public updated_at?: Date;
}

export class Presupuesto {
  public id: number;
  public estado: boolean = false;
  public imagen1: string;
  public imagen2: string;
  public imagen3: string;
  public imagen4: string;
  public results: string;
  public token: string;
  public fecha: Date;
  public pdf: string;
  public usuario: string;
  public project_id: number;
  
}


export class Usuario {
  public id: number;
  public correo_google: string;
  public nombre_completo: string;
  public usuario: string;
  public password: string;
  public activo: number;
  public rol_id: number;
  public horario: Horario;
}

export class Material {
  public id: number;
  public material: string;
  public espesor: number;
  public link_textura1: string;
  public link_textura2: string;
  public precio_mt2: number;
  public precio_placa: number;
  public veta: boolean;
  public ancho_veta: number;
  public largo_veta: number;
  public nombre: string;
  public alto: number;
  public descuento_alto: number;
  public descuento_ancho: number;
  public tipo_material_id: number;
  public extra: string;
  public tipo_materiales: any;
  public caracter: string;
  public texture_exists: boolean;
}
