import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormControl } from '@angular/forms';


export interface TiempoTraslado {
    nombre: string;
    valor: string;
}

@Component({
    selector: 'app-tiempo-traslados',
    templateUrl: './tiempo-traslados.component.html',
    styleUrls: ['./tiempo-traslados.component.css']
})

export class TiempoTrasladosComponent implements OnInit {
    public items: TiempoTraslado[] = [];
    public newItem: TiempoTraslado;
    public form: FormGroup;

    constructor() {
        this.form = new FormGroup({
            nombre: new FormControl('', [Validators.required]),
            valor: new FormControl('', [Validators.required])
        });

        this.form.valueChanges.subscribe(value => {
            this.newItem = value;
        });
    }

    ngOnInit() {

    }

    addItem() {
        this.items.push(this.newItem);
        this.newItem = null;
        this.form.reset();
    }

    deleteItem(index: number) {
        this.items.splice(index, 1);
    }
}
