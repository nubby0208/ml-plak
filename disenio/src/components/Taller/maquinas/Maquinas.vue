<template>
    <div id="app-capacidad-produccion" class="container-fluid">
        <vue-toastr ref="toastr"></vue-toastr>

        <div class="col-sm-12 col-sm-offset-1">
            <div class="col-sm-12 text-center py-3">
            <h2>
                Maquinas
                <button type="button" class="btn btn-xs btn-success" @click="openAddEditMaquinaModal()">
                <span class="glyphicon glyphicon-plus"></span>
                Nuevo
                </button>
            </h2>
            <hr>
            </div>
            <!-- <div class="img-loader-spinner" v-if="loading">
            <div class="img-loader">
                <div>
                </div>
            </div>
            </div> -->

            <div id="maquinas" class="col-sm-12">
                <div id="material-listado" class="col-sm-12">
                    <div class="table-responsive">

                        <table class="table table-hover">
                        <thead>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Conexion</th>
                            <th style="text-align: right; min-width: 80px">Acciones</th>
                        </thead>

                        <tbody>
                            <template v-if="(maquinas && maquinas.length)">
                            <tr v-for="(maquina, i) in maquinas" :key="i">
                                <td>{{ i+1 }}</td>
                                <td>{{ maquina.nombre }}</td>
                                <td>{{ maquina.estado }}</td>
                                <td>{{ maquina.conexion}}</td>
                                <td style="text-align: right; min-width: 80px">
                                <button class="btn btn-xs btn-warning" @click="edit(i)"><font-awesome-icon icon="pencil-alt"></font-awesome-icon></button>
                                <button class="btn btn-xs btn-danger" @click="openDeleteMaquinaModal(i)"><font-awesome-icon icon="trash"></font-awesome-icon></button>
                                </td>
                            </tr>
                            </template>

                            <template v-else>
                            <tr>
                                <td class="text-center" colspan="17"><strong>No posee maquinas</strong></td>
                            </tr>
                            </template>
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <b-modal id="add-edit-maquina" hide-footer size="md">
            <template #modal-title>
                <h4 class="modal-title">{{editing>0 ? 'Editar Maquina' : ' Nueva Maquina' }}</h4>
            </template>
            <div class="modal-content">
                  <div class="modal-body">
                <div id="app-maquina-form" class="container-fluid">
                    <div class="col-sm-12">
                    <form id="form-maquina" class="form-horizontal" :formGroup="maquinaForm" autocomplete="off">
                        <div class="form-group row">
                        <label class="control-label col-sm-4" for="nombre">Nombre</label>
                        <div class="col-sm-8">
                            <input id="nombre" class="form-control" name="nombre" type="text" v-model="maquinaForm.nombre" formControlName="nombre">
                        </div>
                        </div>

                        <div class="form-group row">
                        <label class="control-label col-sm-4" for="estado">Estado</label>
                        <div class="col-sm-8">
                            <input id="estado" class="form-control" name="estado" type="text" formControlName="estado" v-model="maquinaForm.estado">
                        </div>
                        </div>

                        <div class="form-group row">
                        <label class="control-label col-sm-4" for="url">Conexion</label>
                        <div class="col-sm-8">
                            <input id="url" class="form-control" name="url" type="text" formControlName="conexion" v-model="maquinaForm.conexion">
                        </div>
                        </div>
                    </form>
                    </div>
                </div>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-default" @click="closeAddEditMaquinaModal()">Cancelar</button>
                <button type="button" class="btn btn-success" 
                    @click="saveMaquina()">Guardar</button>
                    <!-- :disabled="!maquinaForm.valid || !maquinaForm.dirty" -->
                </div>
            </div>            
        </b-modal>
    </div>
</template>

<script>
import { faDotCircle} from '@fortawesome/free-solid-svg-icons'
import { faPencilAlt} from '@fortawesome/free-solid-svg-icons'
import { faTrash} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import VueToastr from "vue-toastr";

import maquinaService from '../Services/maquinaService'

const MaquinaService = new maquinaService();

library.add(faDotCircle)
library.add(faPencilAlt)
library.add(faTrash)

export default {
    components:{
        FontAwesomeIcon,
        VueToastr,
    },
    data(){
        return{
            maquinas: [],
            Maquina:{
                id : 0, nombre:'', conexion:'', estado:''
            },
            maquinaToDelete: this.Maquina,
            editing: undefined,
            loading: true,
            maquinaForm : {
                nombre: '',
                conexion: '',
                estado: '',
            }
        }
    },
    mounted(){
        this.getMaquinas();
    },
    methods:{
        async getMaquinas() {
            this.loading = true;
            let maquinas = await MaquinaService.getAll()
            if(maquinas){
                console.log('maquinas form principal', maquinas)
                this.maquinas = maquinas;
            }
        },

        openAddEditMaquinaModal(maquina) {
            if (maquina) {
                console.log('openaddedit', maquina)
                //this.maquinaForm.patchValue({ nombre: maquina.nombre, conexion: maquina.conexion, estado: maquina.estado });
                this.maquinaForm = maquina
                this.editing = maquina.id;
            } else {
                this.editing = undefined;
                this.maquinaForm = {
                    nombre: '',
                    conexion: '',
                    estado: '',
                }
            }
            this.$bvModal.show('add-edit-maquina')
            //_$('#add-edit-maquina').modal('show');
        },

        closeAddEditMaquinaModal() {
            // this.maquinaForm.reset();
            this.maquinaForm = {
                nombre: '',
                conexion: '',
                estado: '',
            }            
            this.$bvModal.hide('add-edit-maquina')
        },

        saveMaquina() {
            const maquina = {
                nombre: this.maquinaForm.nombre,
                conexion: this.maquinaForm.conexion,
                estado: this.maquinaForm.estado
            };

            if (this.editing>0) {
                console.log('editando', this.editing)
                maquina.id = this.editing;
                this.updateMaquina(maquina);
            } else {
                this.createMaquina(maquina);
            }
        },

        openDeleteMaquinaModal(index) {
            this.maquinaToDelete = this.maquinas[index];
            this.del()
            // _$('#delete-maquina').modal('show');
        },

        closeDeleteMaquinaModal() {
            this.maquinaToDelete = undefined;
            //_$('#delete-maquina').modal('hide');
        },

        async updateMaquina(maquina) {
            console.log('maquina actualizando', maquina)
            let res = await MaquinaService.update(maquina)
            if(res){
                this.$refs.toastr.s('Maquina Actualizada');
                this.closeAddEditMaquinaModal();
                this.getMaquinas();
            }
        },

        async createMaquina(maquina) {
            let res = await MaquinaService.create(maquina)
            if(res){
                this.$refs.toastr.s('Maquina agregada');
                this.closeAddEditMaquinaModal();
                this.getMaquinas();
            }
        },

        edit(index) {
            this.openAddEditMaquinaModal(this.maquinas[index]);
        },

        async del() {
            this.$swal({ title: 'Borrar Maquina',
				 text: "¿Esta seguro que desea borrar la maquina?",
				 type: 'question',
				   buttons: true,
            })
            .then(async (result) => {
                if (result) {
                   //this.handlerSwalTapacantos()
                    //this.changeEstadoPiezaPost(pieza, estado_id, estado_key, etapa);
                    let result = await MaquinaService.delete(this.maquinaToDelete.id)
                    if (result){
                        this.closeDeleteMaquinaModal();
                        this.getMaquinas();
                        this.$refs.toastr.s('Maquina borrada');
                    }
                }
            });
            return
        }
    }
}
</script>

<style lang="scss">
    @keyframes img-loader {
        0% { transform: translate(-50%,-50%) rotate(0deg); }
        100% { transform: translate(-50%,-50%) rotate(360deg); }
    }
    .img-loader div {
        position: absolute;
        width: 120px;
        height: 120px;
        border: 20px solid #00bfa5;
        /* border: 20px solid #1d3f72; */
        border-top-color: transparent;
        border-radius: 50%;
    }
    .img-loader div {
        animation: img-loader 1s linear infinite;
        top: 100px;
        left: 100px
    }
    .img-loader-spinner {
        position: absolute;
        width: 100%;
        height: 240px;
        display: inline-block;
        overflow: hidden;
        left: 0;
        z-index: 99;
        background-color: rgba(0, 0, 0, 0.3);
    }
    .img-loader div { 
        position: absolute;
        top: 50%;
        left: 50%;
    }
</style>>

</style>