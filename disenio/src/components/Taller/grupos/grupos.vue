<template>
    <div id="app-grupo-list" class="container-fluid">
        <vue-toastr ref="toastr"></vue-toastr>
        <div class="col-sm-12 col-sm-offset-1">
            <div class="col-sm-12 text-center py-3" style="display: flex">
               <button type="button" class="btn btn-xs btn-success" style="margin:auto; margin-right: 0px" @click="modalGrupo()">
                        <span class="glyphicon glyphicon-plus"></span>
                        Nuevo Grupo
                    </button>
            </div>
            <div id="grupo-listado" class="col-sm-12">

                <b-table :items="grupos" :fields="fields" striped responsive="sm">
                    <template #cell(D)="row">
                        <b-form-checkbox v-model="row.detailsShowing" @change="row.toggleDetails">
                            Ver
                        </b-form-checkbox>
                    </template>
                    <template #row-details="row">
                        <b-card>
                            <b-row class="">
                                <b-col  class="text-left"><b>Usuarios del grupo:</b><br>
                                    <p style="margin-left: 10px;" v-for="(usuario , i) in row.item.grupo_usuarios"
                                        class="primeraLetraMayuscula" :key="i">
                                        <span v-if="usuario.usuario">- {{usuario.usuario.nombre_completo ? usuario.usuario.nombre_completo : ''}}</span>
                                    </p>
                                </b-col>
                            </b-row>
                        </b-card>
                    </template>
                    <template #cell(estado)="row">
                            <span class="badge" @click="cambiarEstado(row.item)"
                                :class="row.item.activo ? 'badge-success' : 'badge-danger'">{{row.item.activo ? 'Activo' : 'Inactivo'}}
                            </span>
                    </template>                    
                    <template #cell(editar)="row">
                        <button @click="seleccionarGrupo(row)" class="btn btn-info btn-sm">
                            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                        </button>

                    </template>                    
                </b-table>
            </div>

            <b-modal id="modal-grupo" hide-footer size="md">
                <template #modal-title>
                   Grupo
                </template>
                <div class="modal-body">
                    <div id="app-grupo-form" class="container-fluid">
                        <div id="" class="col-sm-12">
                            <form id="form-grupo" class="form-horizontal" action="#!" method="post">
                                <div class="form-group row">
                                    <label class="control-label col-sm-4" for="nombre_grupo">Nombre del grupo</label>
                                    <div class="col-sm-8">
                                        <input id="nombre_grupo" class="form-control" name="nombre_grupo"
                                            type="text" v-model="grupo.nombre_grupo ">
                                    </div>
                                </div>

                                <div class="form-group mt-2 row">
                                    <label class="control-label col-sm-4" for="integrantes">Integrantes</label>
                                    <div class="col-sm-8">
                                        <template v-if="usuarios.length > 0">
                                            <!-- <multiselect placeholder="Seleccionar Integrantes" label="nombre_completo" track-by="id" v-model="grupo.integrantes" :options="usuarios" :multiple="true" > -->
                                            <multiselect placeholder="Seleccionar Integrantes" label="nombre_completo" track-by="id" v-model="grupo.listaIntegrantes" :options="usuarios" :multiple="true" >
                                            </multiselect>
                                        </template>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success"
                        :disabled="(grupo.integrantes.length == 0 || grupo.nombre_grupo.length == 0)"
                        v-if="!boolEditar" @click="nuevoGrupo()">Guardar</button>
                    <button type="button" class="btn btn-success"
                        :disabled="(grupo.integrantes.length == 0 || grupo.nombre_grupo.length == 0)"
                        v-if="boolEditar" @click="editarGrupo(grupo)">Editar</button>
                    <button type="button" @click="$bvModal.hide('modal-grupo')" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                </div>
            </b-modal>
        </div>
    </div>
</template>

<script>
import swal from 'sweetalert2'
import grupoService from '../Services/grupoService'
import usuarioService from '../Services/usuarioService'
import { faPencilAlt} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import VueToastr from "vue-toastr";
import Multiselect from 'vue-multiselect'


const GrupoService = new grupoService();
const UsuarioService = new usuarioService();
library.add(faPencilAlt)

export default {
    components:{
        FontAwesomeIcon,
        VueToastr,
        Multiselect,

    },    
    data(){
        return{
            fields: ['D','nombre_grupo', 'estado', 'editar'],
            grupos: [],
            grupo: {
                id: 0,
                nombre_grupo: '',
                activo: false,
                integrantes: [],
                listaIntegrantes: [],
                created_at: new Date,
                updated_at: new Date,
                grupo_usuarios: []
            },
            roles: '',
            boolEditar: false,
            usuario:{
                id: 0,
                correo_google: '',
                nombre_completo: '',
                usuario: '',
                password: '',
                activo: 0,
                rol_id: 0,
                horario: this.Horario
            },
            Horario: {
                user_id: 0,
                hora_inicio_lunes: '',
                hora_fin_lunes: '',
                hora_inicio_martes: '',
                hora_fin_martes: '',
                hora_inicio_miercoles: '',
                hora_fin_miercoles: '',
                hora_inicio_jueves: '',
                hora_fin_jueves: '',
                hora_inicio_viernes: '',
                hora_fin_viernes: '',
                hora_inicio_sabado: '',
                hora_fin_sabado: '',
                habilitado_lunes: false,
                habilitado_martes: false,
                habilitado_miercoles: false,
                habilitado_jueves: false,
                habilitado_viernes: false,
                habilitado_sabado: false,
                is_default: false
            },
            usuarios: []
        }
    },
    mounted(){
        this.getAllUsuarios();
		this.getAllGrupos();
		this.setearGrupo();
    },
    methods:{
        async getAllGrupos() {
            let data = await GrupoService.getAll()
            console.log('000--->',this.grupos)
            data.forEach(element => {
                element.grupo_usuarios = element.grupo_usuarios.filter(x => x.activo);
            });
            this.grupos = data;
            console.log('------------------------------->',this.grupos)
        },
        async getAllUsuarios() {
            let data = await UsuarioService.getAll()
            this.usuarios = data.usuarios;
        },

        async cambiarEstado(grupo) {
            let obj = { ...grupo };
            obj.activo = !obj.activo;
            let data = await GrupoService.update(obj.id, obj)
            this.getAllGrupos();
        },

        expandirFila(grupo) {
            this.table.rowDetail.toggleExpandRow(grupo);
        },

        async seleccionarGrupo(grupoTmp) {
            let grupo = grupoTmp.item
            let newGrupo = { ...grupo };
            newGrupo.integrantes = [];
            newGrupo.listaIntegrantes= [];
            newGrupo.grupo_usuarios.forEach(element => {
                if(element.usuario_id){
                    console.log('element###', element)
                    newGrupo.integrantes.push(element.usuario_id);
                }
            });
            for await (let itemGrupo of newGrupo.integrantes){
                for await (let item of this.usuarios){
                    console.log('-----',item)
                    if (itemGrupo == item.id){
                        newGrupo.listaIntegrantes.push({'id': item.id, 'nombre_completo': item.nombre_completo})
                    }
                }
            }

            console.log('---->',newGrupo)
            delete newGrupo.grupo_usuarios;
            this.grupo = newGrupo;
            this.boolEditar = true;
            // console.log('this.grupo----->', this.grupo)
            // console.log('this.usuarios----->', this.usuarios)
            // for await (let itemGrupo of this.grupo.integrantes){
            //     console.log('itemgrupo',  itemGrupo)
            //     this.grupo.integrantes.listaIntegrantes=[]
            //     for await (let item of this.usuarios){
            //         console.log('-----',item)
            //         if (itemGrupo == item.id){
            //             //itemGrupo.listaIntegrantes.push({'id': Number(item), 'nombre': item.nombre_completo})
            //         }
            //     }
            // }
            // console.log(this.grupo)

            this.$bvModal.show('modal-grupo')

            // _$('#modal-grupo').modal('show');
        },

        async editarGrupo(grupo) {
            console.log('.....', grupo)
            let grupoEditar = this.grupos.filter(x => x.id == this.grupo.id);
            console.log('grupoeditar',grupoEditar)
           
            if (grupoEditar != null) {
                let comparasionGrupos = { ...grupoEditar[0] };
                comparasionGrupos.integrantes = [];
                comparasionGrupos.grupo_usuarios.forEach(element => {
                    comparasionGrupos.integrantes.push(element.usuario_id);
                });
                this.grupo.integrantes=[]
                this.grupo.listaIntegrantes.forEach(element => {
                    this.grupo.integrantes.push(element.id);
                });
                delete this.grupo.listaIntegrantes;
                delete comparasionGrupos.grupo_usuarios;
                console.log('this.grupo',this.grupo)

                if (JSON.stringify(comparasionGrupos) === JSON.stringify(this.grupo))
                    this.toastr.info("No hay datos para modificar");
                else {
                    let data = await GrupoService.update(this.grupo.id, this.grupo)
                    if (data){
                        //_$('#modal-grupo').modal('hide');
                        this.$bvModal.hide('modal-grupo')
                        this.$refs.toastr.s("Grupo editado");
                        this.getAllGrupos();
                    }
                }
            }
        },

        setearGrupo() {
            this.grupo = {
                id: 0,
                nombre_grupo: '',
                activo: false,
                integrantes: [],
                created_at: new Date,
                updated_at: new Date,
                grupo_usuarios: []
            };
            //this.grupo.nombre_grupo = '';
            //this.grupo.integrantes = [];
            this.grupo.activo = true;
        },

        // nuevoGrupo() {
        //     this.grupoService.store(this.grupo).subscribe(data => {
        //         _$('#modal-grupo').modal('hide');
        //         this.toastr.success("Grupo agregado");
        //         this.getAllGrupos();
        //     }, (err) => this.toastr.error(err.error));
        // },

        modalGrupo() {
            this.setearGrupo();
            this.boolEditar = false;
            this.$bvModal.show('modal-grupo')

        }
    }
}
</script>

<style>

</style>