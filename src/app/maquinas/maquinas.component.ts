import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MaquinaService } from '../services/maquina.service';
import { _window, _$ } from 'app/common';
import { Maquina } from './maquina.model';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-maquinas',
    templateUrl: './maquinas.component.html',
    styleUrls: ['./maquinas.component.scss']
})
export class MaquinasComponent implements OnInit {
    public maquinas: Maquina[] = [];
    public maquinaToDelete: Maquina;
    public editing;
    public loading: boolean = true;
    public maquinaForm = new FormGroup({
        nombre: new FormControl('', Validators.required),
        conexion: new FormControl('', Validators.required),
        estado: new FormControl(''),
    });

    constructor(
        private maquinaService: MaquinaService,
        private toastr: ToastrService) { }


    ngOnInit() {
        this.getMaquinas();
    }

    public getMaquinas() {
        this.loading = true;
        this.maquinaService.getAll().subscribe(maquinas => {
            this.maquinas = maquinas;
        }, () => { }, () => this.loading = false);
    }

    public openAddEditMaquinaModal(maquina?: Maquina) {
        if (maquina) {
            this.maquinaForm.patchValue({ nombre: maquina.nombre, conexion: maquina.conexion, estado: maquina.estado });
            this.editing = maquina.id;
        } else {
            this.editing = undefined;
            this.maquinaForm.reset();
        }
        _$('#add-edit-maquina').modal('show');
    }

    public closeAddEditMaquinaModal() {
        this.maquinaForm.reset();
        _$('#add-edit-maquina').modal('hide');
    }

    public saveMaquina() {
        const maquina: Maquina = {
            nombre: this.maquinaForm.get('nombre').value,
            conexion: this.maquinaForm.get('conexion').value,
            estado: this.maquinaForm.get('estado').value
        };

        if (this.editing) {
            maquina.id = this.editing;
            this.updateMaquina(maquina);
        } else {
            this.createMaquina(maquina);
        }
    }

    public openDeleteMaquinaModal(index: number) {
        this.maquinaToDelete = this.maquinas[index];
        _$('#delete-maquina').modal('show');
    }

    public closeDeleteMaquinaModal() {
        this.maquinaToDelete = undefined;
        _$('#delete-maquina').modal('hide');
    }

    public updateMaquina(maquina: Maquina) {
        this.maquinaService.update(maquina).subscribe(res => {
            this.toastr.success('Maquina Actualizada');
            this.closeAddEditMaquinaModal();
            this.getMaquinas();
        });
    }

    public createMaquina(maquina: Maquina) {
        this.maquinaService.create(maquina).subscribe(res => {
            this.toastr.success('Maquina agregada');
            this.closeAddEditMaquinaModal();
            this.getMaquinas();
        });
    }

    public edit(index: number) {
        this.openAddEditMaquinaModal(this.maquinas[index]);
    }

    public delete() {
        this.maquinaService.delete(this.maquinaToDelete.id).subscribe(res => {
            this.closeDeleteMaquinaModal();
            this.getMaquinas();
            this.toastr.success('Maquina borrada');
        });
    }
}
