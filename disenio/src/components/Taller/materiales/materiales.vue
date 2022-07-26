<template>
    <div id="app-material-list" class="container-fluid">
        <vue-toastr ref="toastr"></vue-toastr>
        <div class="col-sm-12 col-sm-offset-1">
<div class="col-sm-12 text-center py-3" style="display: flex">

    <div class="panel-body "> 
                        <div class="form-group row">
                            <label class="control-label col-sm-4" for="tipo_materiales">
                                Filtrar por Tipo Material
                            </label>
                            <div class="col-sm-8">
                                <select @change="onChangeTipoMaterial($event)" id="tipo_materiales" class="form-control" name="tipo_materiales" v-model="tipoMaterialSelected">
                                    <option value="0" selected="selected" disabled="disabled">Seleccione un tipo de material</option>
                                    <option v-for="(tipo_material, i) in tipo_materiales" :key="i" :value=tipo_material.id>{{ tipo_material.tipo }}</option>
                                </select>
                            </div>
                        </div>
                    </div> 

               <button type="button" class="btn btn-xs btn-success" style="margin:auto; margin-right: 0px" @click="create()">
                        <span class="glyphicon glyphicon-plus"></span>
                        Nuevo Material
                    </button>
            </div>

            <div id="material-listado" class="col-sm-12">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <th>#</th>
                            <th v-if="tipoMaterialSelected != 1">Nombre</th>
                            <th>Material</th>
                            <th>Alto</th>
                            <th>Ancho Veta</th>
                            <th>Desc. Alto</th>
                            <th>Desc. Ancho</th>
                            <th>Espesor</th>
                            <th>Textura</th>
                            <th>Color HTML</th>
                            <th>Precio mt<sup>2</sup></th>
                            <th>Precio placa</th>
                            <th>Veta</th>
                            <th>LV</th>
                            <th>Tipo</th>
                            <th>Default</th>
                            <th style="text-align: right; min-width: 80px">Acciones</th>
                        </thead>

                        <tbody>
                            <template v-if="(materiales && materiales.length)">
                                <tr v-for="(material, i) in materiales" :key="i">
                                    <td>{{ i+1 }}</td>
                                    <td v-if="tipoMaterialSelected != 1">{{ material.nombre }}</td>
                                    <td>{{ material.material }}</td>
                                    <td>{{ material.alto }}</td>
                                    <td>{{ material.ancho_veta || 0}}</td>
                                    <td>{{ material.descuento_alto || 0}}</td>
                                    <td>{{ material.descuento_ancho || 0}}</td>
                                    <td>{{ material.espesor || 0 }}</td>
                                    <td>
                                        <button type="button" class="btn btn-sm btn-primary" :disabled="!material.texture_exists" @click="showTexture(material)" :title="(material.texture_exists) ? 'Mostrar textura' : 'Textura no disponible'">
                                            <font-awesome-icon icon="image"></font-awesome-icon>
                                        </button>
                                    </td>
                                    <td style="text-align: center; vertical-align: middle !important;"><input  v-if="material.link_textura2" type="color" disabled="true" :value="material.link_textura2"></td>
                                    <td>${{ material.precio_mt2 || 0.00}}</td>
                                    <td>${{ material.precio_placa || 0.00}}</td>
                                    <td><span v-if="material.veta==1">Si</span><span v-if="material.veta==0">No</span></td>
                                    <td>{{ material.largo_veta || 0}}</td>
                                    <td>{{ material.tipo_materiales.tipo }}</td>
                                    <td><input type="checkbox" @change="toggleDefault(i)" title="Default" v-model="material.default"/></td>
                                    <td style="text-align: right; min-width: 80px">
                                        <button class="btn btn-sm btn-warning" @click="edit(i)"><font-awesome-icon icon="pencil-alt"></font-awesome-icon></button>
                                        <button class="btn btn-sm btn-danger" @click="del(material.id)"><font-awesome-icon icon="trash"></font-awesome-icon></button>
                                    </td>
                                </tr>
                            </template>

                            <template v-else>
                                <tr>
                                    <td class="text-center" colspan="17"><strong>No posee materiales registrados</strong></td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>

            <b-modal id="modal-material" hide-header hide-footer size="lg">
                        <div class="modal-header">
                            <h4 class="modal-title">Material</h4>
                            <button @click="$bvModal.hide('modal-material')" type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        </div>


                        <div id="app-material-form" class="container-fluid">
                            <div id="" class="col-sm-12">
                                <template v-if="messages.length > 0">
                                    <div v-for="(message, i) in messages" :key="i" :class="'alert alert-' + message.type">
                                        <button v-if="!message.keep" type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                        {{ message.message }}
                                    </div>
                                </template>

                                <form id="form-material" class="form-horizontal" action="#!" method="post">

                                    <div class="form-group">
                                        <label class="control-label col-sm-4" for="tipo_materiales">Tipo Material</label>
                                        <div class="col-sm-8">
                                            <select @change="onChangeTipoMaterialForm($event)" id="tipo_materiales" class="form-control" name="tipo_materiales" v-model="material.tipo_material_id">
                                                <option v-for="(tipo_material, i) in tipo_materiales" :key="i" :value=tipo_material.id>{{ tipo_material.tipo }}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <template v-if="material.tipo_material_id ? true : false">
                                        <div class="form-group" v-if="caracter !== 'P'">
                                            <label class="control-label col-sm-4" for="nombre">Nombre</label>
                                            <div class="col-sm-8">
                                                <input id="nombre" class="form-control" name="nombre" type="text" v-model="material.nombre">
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="control-label col-sm-4" for="material">Material</label>
                                            <div class="col-sm-8">
                                                <input id="material" class="form-control" name="material" type="text" v-model="material.material">
                                            </div>
                                        </div>

                                        <div class="form-group" v-if="caracter == 'H' || caracter == 'M'">
                                            <label class="control-label col-sm-4" for="descuento_alto">Descuento Alto</label>
                                            <div class="col-sm-8">
                                                <input id="descuento_alto" class="form-control" name="descuento_alto" type="text" v-model="material.descuento_alto">
                                            </div>
                                        </div>

                                        <div class="form-group" v-if="caracter == 'H' || caracter == 'M'">
                                            <label class="control-label col-sm-4" for="descuento_ancho">Descuento Ancho</label>
                                            <div class="col-sm-8">
                                                <input id="descuento_ancho" class="form-control" name="descuento_ancho" type="text" v-model="material.descuento_ancho">
                                            </div>
                                        </div>
                                        
                                        <div class="form-group" v-if="caracter !== 'P'">
                                            <label class="control-label col-sm-4" for="alto">Alto</label>
                                            <div class="col-sm-8">
                                                <input id="alto" class="form-control" name="alto" type="text" v-model="material.alto">
                                            </div>
                                        </div>
                                
                                        <div class="form-group" v-if="caracter == 'P'">
                                            <label class="control-label col-sm-4" for="veta">Veta</label>
                                            <div class="col-sm-8">
                                                <select id="veta" class="form-control" name="veta" v-model="material.veta">
                                                    <option v-for="(estado, i) in estados" :key="i" :value="estado.value">{{ estado.estado }}</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="form-group" v-if="caracter !== 'T'">
                                            <label v-if="caracter == 'P' || caracter == ''" class="control-label col-sm-4" for="ancho_veta">
                                            Ancho veta</label>
                                            <template v-else>
                                                <label v-if="caracter && caracter == 'H' || caracter == 'M'" class="control-label col-sm-4" for="ancho_veta">
                                            Ancho</label>
                                            </template>
                                            <div class="col-sm-8">
                                                <input id="ancho_veta" class="form-control" name="ancho_veta" type="number" v-model="material.ancho_veta">
                                            </div>
                                        </div>

                                        <div class="form-group" v-if="caracter == 'P'">
                                            <label class="control-label col-sm-4" for="largo_veta">Largo veta</label>
                                            <div class="col-sm-8">
                                                <input id="largo_veta" class="form-control" name="largo_veta" type="number" v-model="material.largo_veta">
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="control-label col-sm-4" for="espesor">Espesor</label>
                                            <div class="col-sm-8">
                                                <input id="espesor" class="form-control" name="espesor" type="number" v-model="material.espesor">
                                            </div>
                                        </div>
                                        <!-- aqui revisar -->
                                        <div class="form-group">
                                            <label class="control-label col-sm-4" for="textura">Textura</label>
                                            <div class="col-sm-8">
                                                <input  class="form-control" name="textura" type="file" @change="onChangeTextura($event)">
                                                <img  v-if="preview" id="preview" :src="preview" width="100" height="100">
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="control-label col-sm-4" for="link_textura2">Color HTML</label>
                                            <div class="col-sm-8">
                                                <input  v-model="material.link_textura2"  id="link_textura2" class="form-control" name="link_textura2" type="color">
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="control-label col-sm-4" for="precio_mt2">Precio mt<sup>2</sup></label>
                                            <div class="col-sm-8">
                                                <input id="precio_mt2" class="form-control" name="precio_mt2" type="number" v-model="material.precio_mt2">
                                            </div>
                                        </div>

                                        <div class="form-group" v-if="caracter == 'P'">
                                            <label class="control-label col-sm-4" for="precio_placa">Precio placa</label>
                                            <div class="col-sm-8">
                                                <input id="precio_placa" class="form-control" name="precio_placa" type="number" v-model="material.precio_placa">
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="control-label col-sm-4" for="extra">Extra</label>
                                            <div class="col-sm-8">
                                                <input id="extra" class="form-control" name="extra" type="text" v-model="material.extra">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label col-sm-4" for="default">Default</label>
                                            <div class="col-sm-8" style="padding-top:6px;">
                                                <input id="default" name="default" type="checkbox" v-model="material.default">
                                            </div>
                                        </div>
                                    </template>	

                                </form>
                            </div>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success" @click="saveMaterial()">Guardar</button>
                            <button @click="$bvModal.hide('modal-material')" type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                        </div>
            </b-modal>


        </div>
        
        <b-modal id="modal-textura" hide-header size="lg">
            <!-- <div class="modal fade" id="modal-textura" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"> -->
            <div class="modal-header">
                <h4 class="modal-title" id="exampleModalLabel">{{ modalTextura.material}}</h4>
                <button @click="$bvModal.hide('modal-textura')" type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                <div class="panel panel-default" >
                    <div class="panel-body">
                        <!-- <div class="loading-area" v-if="modalTextura.textura.length == 0">
                            <div><img :src="urlOrigin+'assets/img/spinner.gif'"/></div>
                        </div> -->

                        <div>
                            <img class="img-responsive image" :src="modalTextura.textura">
                        </div>
                    </div>
                </div>

            </div>
            <template #modal-footer>
                <b-button variant="light" @click="$bvModal.hide('modal-textura')">
                <!-- <button @click="$bvModal.hide('modal-textura')" type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button> -->
                    Cerrar
                </b-button>
            </template>
        </b-modal>
    </div>



</template>

<script>
import materialService from "../Services/materialService";

import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueToastr from "vue-toastr";

const MaterialService = new materialService();

library.add(faPencilAlt);
library.add(faTrash);
library.add(faPlus);
library.add(faCog);
library.add(faImage);

export default {
    components: {
        FontAwesomeIcon,
        VueToastr,
    },
    data(){
        return{
            materiales: [],
	        material: this.Material,
	        material_select: 'P',
	        tipoMaterialSelected: 0,
	        roles: '',
	        textura1: '',
	        textura2: '',
	        tipo_materiales: [],
	        modalTextura: { nombre: '', textura: '' },
            urlOrigin: window.location.origin + window.location.pathname,
            Material : {
                id: 0,
                material: '',
                espesor: 0,
                link_textura1: '',
                link_textura2: '',
                precio_mt2: 0,
                precio_placa: 0,
                veta: false,
                ancho_veta: 0,
                largo_veta: 0,
                nombre: '',
                alto: 0,
                descuento_alto: 0,
                descuento_ancho: 0,
                tipo_material_id: 0,
                extra: '',
                tipo_materiales: 0,
                caracter: '',
                texture_exists: false
            },
            ////////////////
	        messages: [],
	        estados: [{value: 1, estado: 'Sí'}, {value: 0, estado: 'No'}],
	        preview: '',
            tipo_materiales: [],
            caracter: ''
        }
    },
    async mounted(){
        this.material = this.Material;
        let response = await MaterialService.getTipoMateriales()
        if(response) {
            console.log('materiales---->', response)
			this.tipo_materiales = response.tipo_materiales
        }
        //////
		this.messages = [];
        // let responseT = await MaterialService.getTipoMateriales()
        // if(responseT) {
		// 	this.tipo_materiales = response.tipo_materiales
        // }
    },
    methods:{

        async getMaterialesPorTipo(caracter) {
            let data = await MaterialService.getMaterialesPorTipo(caracter)
            if(data){
                console.log('datamateriales', data)
                this.materiales = data.materiales;
            }
        },

        edit(index) {
            try {
                this.setMessages();
                let material = this.materiales[index];
                let material_name = material.material;
                this.setMaterial(material);
                this.$bvModal.show('modal-material')
                // _$('#modal-material').modal('show');
            } catch (error) {
                console.log('error en edit', error)
            }
        },

        create() {
            this.setMessages();
            this.setMaterial(this.Material);
            this.$bvModal.show('modal-material')
        },

        async del(index) {
            let response = await MaterialService.delete(index)
            if(response) {
                console.log('response delete',response)
                if (response.success === true) {
                    this.materiales.splice(this.materiales.findIndex(e => e.id == index), 1);
                    this.$refs.toastr.s('¡Material eliminado con éxito!');
                } else if (response.success == false) {
                    this.$refs.toastr.e('¡Error al eliminar material!');
                }
            }
            else {
                this.$refs.toastr.e('¡Error al eliminar material!');
                console.log(err);
            }
        },

        async showTextures(material_name) {
            this.textura1 = '';
            this.textura2 = '';
            this.material_select = '';
            let response = await MaterialService.showTextures(material_name.material)
            if (response) {
                console.log('response showtextura', respose)
                if (response.result == 'Ok') {
                    if (response.response.textura1)
                        this.textura1 = response.response.textura1

                    if (response.response.textura2)
                        this.textura2 = response.response.textura2

                    // _$('#modal_texturas').modal('show');
                    this.$bvModal.show('modal-textura')
                    this.material_select = material_name;
                } else {
                    this.$refs.toastr.i('¡El Material no tiene texturas Asociadas!');
                }

            }
        },
        onChangeTipoMaterialForm( event ) {
            this.caracter = this.tipo_materiales.filter(function(el) {
                return el.id == event.target.value
                })[0].caracter;
            this.material.caracter = this.caracter;
        },

        onChangeTipoMaterial(event) {
            console.log('onchangetipomaterial',event.target.value)
            this.material_select = this.tipo_materiales.filter(function (el) {
                return el.id == event.target.value
            })[0].caracter;

            this.getMaterialesPorTipo(this.material_select)
        },

        async toggleDefault(index) {
            let response = await MaterialService.update(this.materiales[index])
            if(response) {
                if (response.success === true) {
                    this.toastr.success('¡Material actualizado con éxito!');
                    // _$('#modal-material').modal('hide');
                } else if (response.success == false)
                    this.$refs.toastr.e('¡Error al actualizar material!');
            }
            else {
                console.log(err);
                this.$refs.toastr.e('¡Error al actualizar material!');
            }
        },

        async showTexture(material) {
            console.log(material)
            var mat_title = ""
            if(material.tipo_material_id!=1 ){
             mat_title = material.nombre
            }else{
             mat_title = material.material
            } 
            this.modalTextura.material = mat_title;
            this.modalTextura.textura = '';
            this.$bvModal.show('modal-textura')
            // _$('#modal-textura').modal('show');

            if (material.id > 0) {
                let response = await MaterialService.getTexture(material.id,material.tipo_material_id)
                if (response) {
                    this.modalTextura.textura = response.textura;
                }
            }
        },

///////////////////////////////////

        setMaterial(material) {
            this.material = material;
            this.preview = this.material.link_textura1;
        this.caracter = this.material.tipo_materiales ?  this.material.tipo_materiales.caracter : '';
        },

        getMaterial() {
            return this.material;
        },

        async saveMaterial() {
            let reqData = this.material;
            reqData = {...reqData};
            reqData.default = reqData.default || false;
            this.messages = [];
            const hasImage = Boolean (this.material.link_textura1);

            if (this.messages.length === 0) {
                if (this.material.hasOwnProperty('id') && (this.material.id > 0)){
                    let response = await MaterialService.update(reqData)
                    if(response) {
                        if (response.success === true) {
                            // this.messages.push({type: 'success', message: '¡Material actualizado con éxito!'});
                            this.$refs.toastr.s('¡Material actualizado con éxito!');
                            this.material.texture_exists = (this.material.texture_exists || hasImage);
                            this.$bvModal.hide('modal-material')
                        }else{
                            // (response.success == false)
                            // this.messages.push({type: 'danger', message: '¡Error al actualizar material!'});
                            this.$refs.toastr.e('¡Error al actualizar material!');
                        } 
                    }
                    else{
                        console.log(err);
                        this.$refs.toastr.e('¡Error al actualizar material!');
                    }
                }
                else{
                    let response = await MaterialService.store(reqData)
                    if(response) {
                        if (response.success === true) {
                            // this.messages.push({type: 'success', message: '¡Material creado con éxito!'});
                            this.$refs.toastr.s('¡Material creado con éxito!');
                            // this.inputMateriales.push(response.material);
                            this.tipo_materiales.push(response.material);
                            //this.inputMaterialesChange.emit(this.inputMateriales);
                            this.$bvModal.hide('modal-material')
                        }
                        else if (response.success === false)
                            // this.messages.push({type: 'danger', message: '¡Error al crear material!'});
                            this.$refs.toastr.e('¡Error al crear material!');
                    }
                    else{
                        console.log(err);
                    }
                }
            }
        },

        setMessages(messages = []) {
            this.messages = messages;
        },

        onChangeTextura( event ) {
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
        },

    }
}
</script>

<style>
    .modal-body {
        max-height: calc(100vh - 183px);
    overflow-y: auto;
    }

    .img-responsive {
        max-height: calc(100vh - 250px);
        width: max-content;
    }

    .btn.disabled, .btn[disabled], fieldset[disabled] .btn {
        background-color: gray;
        border-color: gray;
    }

    .loading-area {
        float: left;
        /*position: absolute;*/
        height: 200px;
        width: 90%;
        z-index: 9;
        /*background: rgba(0,0,0,0.3);*/
    }

    .loading-area div {
        position: absolute;
        left: 50%;
        top: 10%;
        margin-top: 9%;
    }

    .loading-area div img {
        position: relative;
        left: -50%;
    }
</style>