import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormControl } from '@angular/forms';


export interface Item {
    nombre: string;
    tiempoDisenio: string;
    tiempoProduccion: string;
    tiempoInstalacion: string;
    coeficiente: number;
}

@Component({
    selector: 'app-capacidad-produccion',
    templateUrl: './capacidad-produccion.component.html',
    styleUrls: ['./capacidad-produccion.component.css']
})

export class CapacidadProduccionComponent implements OnInit {
    public items: Item[] = [];
    public newItem: Item;
    public itemForm: FormGroup;

    constructor() {
        this.itemForm = new FormGroup({
            nombre: new FormControl('', [Validators.required]),
            tiempoDisenio: new FormControl('', [Validators.required]),
            tiempoProduccion: new FormControl('', [Validators.required]),
            tiempoInstalacion: new FormControl('', [Validators.required]),
            coeficiente: new FormControl('', [Validators.required, Validators.pattern(/^\s*-?[1-9]\d*(\.\d{1,2})?\s*$/)]),
        });

        this.itemForm.valueChanges.subscribe(value => {
            this.newItem = value;
        });
    }

    ngOnInit() {

    }

    addItem() {
        this.items.push(this.newItem);
        this.newItem = null;
        this.itemForm.reset();
    }

    deleteItem(index: number) {
        this.items.splice(index, 1);
    }


    
}
