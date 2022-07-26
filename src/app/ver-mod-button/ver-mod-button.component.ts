import { GoogleApiService } from './../google-api.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ver-mod-button',
  templateUrl: './ver-mod-button.component.html'
})
export class VerModButtonComponent implements OnInit {

  @Input() sheetId: string;

  @Output() onModChanged = new EventEmitter<boolean>();

  mods = [ 'Mod 1', 'Mod 2', 'Mod 3', 'Mod 4', 'Mod 5', 'Mod 6',
           'Mod 7', 'Mod 8', 'Mod 9', 'Mod 10', 'Mod 11'];
  cell = 'VER-MOD!A1:A1';

  selectedMod: string;

  constructor(private googleApi: GoogleApiService) { }

  ngOnInit() {
    console.log('Init');
    this.googleApi.getRawCell(this.sheetId, this.cell).then(value => {
      this.selectedMod = value;
    });
  }

  onSelectMod(mod: string) {
    console.log('Selected mod: ' + mod);

    this.googleApi.writeCell(this.sheetId, this.cell, mod)
    .then(res => {
      this.onModChanged.emit(true);
    })
    .catch(res => {
      console.error('Hubo un error al escribir en la celda. Por favor intenta de nuevo');
      this.onModChanged.emit(false);
    });
  }

}
