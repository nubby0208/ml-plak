import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectorRef, NgZone, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgForm, NgModel, DefaultValueAccessor, NgControl } from '@angular/forms';
import { Router } from '@angular/router';
import { _window, _$ } from 'app/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { MaterialService } from './../services/material.service';
import { Material } from './../models'

import { ToastrService } from 'ngx-toastr';

@Component({
  selector:    'app-material-form',
  templateUrl: './form.component.html',
  styleUrls:   ['./form.component.css']
})

export class MaterialFormComponent implements OnInit {
	@Input() inputMateriales;
	@Output() inputMaterialesChange = new EventEmitter();

	public material: Material;
	public messages: Array<any>;
	public estados: Array<any> = [{value: 1, estado: 'Sí'}, {value: 0, estado: 'No'}];
	public preview: string = '';
  public tipo_materiales: Array<any>;
  public caracter: string = ''; //caracter_tipo_material 
	constructor(private materialService: MaterialService, private toastr: ToastrService) {}

	ngOnInit () {
		this.material = new Material;
		this.messages = [];
		this.materialService.getTipoMateriales().subscribe((response:any) => {
			this.tipo_materiales = response.tipo_materiales
    });
	}

	public setMaterial(material: Material) {
		this.material = material;
		this.preview = this.material.link_textura1;
    this.caracter = this.material.tipo_materiales ?  this.material.tipo_materiales.caracter : '';
	}

	public getMaterial(): Material {
		return this.material;
	}

	public save() {
		let reqData: any = this.material;
		reqData = {...reqData};
		reqData.default = reqData.default || false;
		this.messages = [];
		const hasImage = Boolean (this.material.link_textura1);

		if (this.messages.length === 0) {
			if (this.material.hasOwnProperty('id') && (this.material.id > 0))
				this.materialService.update(reqData).subscribe((response:any) => {
					if (response.success === true) {
						// this.messages.push({type: 'success', message: '¡Material actualizado con éxito!'});
						this.toastr.success('¡Material actualizado con éxito!');
						this.material.texture_exists = (this.material.texture_exists || hasImage);
						_$('#modal-material').modal('hide');
					}else if (response.success == false)
						// this.messages.push({type: 'danger', message: '¡Error al actualizar material!'});
						this.toastr.error('¡Error al actualizar material!');
				}, err => {
					console.log(err);
					this.toastr.error('¡Error al actualizar material!');
				});
			else
				this.materialService.store(reqData).subscribe((response:any) => {
					if (response.success === true) {
						// this.messages.push({type: 'success', message: '¡Material creado con éxito!'});
						this.toastr.success('¡Material creado con éxito!');
						this.inputMateriales.push(response.material);
						this.inputMaterialesChange.emit(this.inputMateriales);
						_$('#modal-material').modal('hide');
					}
					else if (response.success === false)
						// this.messages.push({type: 'danger', message: '¡Error al crear material!'});
						this.toastr.error('¡Error al crear material!');
				}, err => {
					console.log(err);
				});
		}
	}

	public setMessages(messages = []): void {
		this.messages = messages;
	}

	public  onChangeTextura( event ): void {
      let reader = new FileReader();
      if(event.target.files && event.target.files.length > 0) 
      {
        let file = event.target.files[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
      	  this.preview = reader.result;
      	  this.material.link_textura1 = reader.result; //reader.result.split(',')[1]
        }
    }
  }

  public  onChangeTipoMaterial( event ): void {
      
    this.caracter = this.tipo_materiales.filter(function(el) {
                       return el.id == event.target.value
                    })[0].caracter;
    this.material.caracter = this.caracter;
  }  
}