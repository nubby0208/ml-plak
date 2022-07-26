<template>
    <div id="app-usuario-list" class="container-fluid">
        <vue-toastr ref="toastr"></vue-toastr>
        <div class="row">
            <div class="col-sm-12 text-center py-3">
                <button type="button" class="btn btn-sm btn-success" 
                        style="margin:auto; float: right;"
                        @click="create()">
                        Nuevo Usuario
                </button>
                <button type="button" class="btn btn-sm btn-primary" 
                        style="margin:auto; float: right;"
                        @click="generarReporte()">
                        Generar Reporte
                </button> 
            </div>
        </div>    
        <div class="row">    
            <div id="usuario-listado" class="col-sm-12">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <th>#</th>
                            <th>Usuario</th>
                            <th>Rol</th>
                            <th>Sueldos</th>
                            <th>Cuenta Google</th>
                            <th>Rango</th>
                            <th>Nombre Completo</th>
                            <th>Fecha Ingreso</th>
                            <th>Cuit-Cuil</th>
                            <th>Afip</th>
                            <th>Visible en Planilla</th>
                            <th>Activo</th>
                            <th>Acciones</th>
                        </thead>

                        <tbody>
                            <template v-if="usuarios.length">
                                <tr v-for="(usuario, i) in usuarios" :key="i">
                                    <td>{{ i+1 }}</td>
                                    <td>{{ usuario.usuario }}</td>
                                    <td>{{ (usuario.rol_id == 1) ? 'Administrador' : 'Usuario' }}</td>
                                    <td>
                                        <b-form-checkbox
                                            :id="'checkbox'+i"
                                            v-model="usuario.permiso"
                                            :name="'checkbox'+i"
                                            :value="true"
                                            :unchecked-value="false"
                                            @change="onChangeSueldo($event, usuario)"
                                        >
                                        </b-form-checkbox>
                                    </td>
                                    <td>{{ usuario.correo_google }}</td>
                                     <td>
                                      <select  style="width:70px"
                                        id="rango_id"
                                        class="form-control"
                                        v-model="usuario.rango_id"
                                        @change="onChangeRango($event,usuario)"
                                      >
                                        <option
                                          v-for="(rango, ii) in rangos"
                                          :key="ii"
                                          :value="rango.id"
                                        >
                                          {{ rango.nombre }} - ($): {{ Number(rango.valor).toFixed(2) }}
                                        </option>
                                      </select>
                                    </td>
                                    <td>{{ usuario.nombre_completo }}</td>
                                    <td>{{ usuario.fecha_ingreso? $moment(usuario.fecha_ingreso).format("DD-MM-YYYY") : '' }}</td>
                                    <td>{{ usuario.cuit_cuil }}</td>
                                    <td>
                                        <b-form-checkbox
                                            :id="'checkbox2'+i"
                                            v-model="usuario.afip"
                                            :name="'checkbox2'+i"
                                            :value=1
                                            :unchecked-value=0
                                            @change="onChangeAfip($event,usuario)"
                                        >
                                        </b-form-checkbox>
                                    </td>
                                    <td>
                                      <select
                                        id="visible_en_planilla"
                                        class="form-control"
                                        v-model="usuario.visible_en_planilla"
                                        @change="onChangeVisible($event,usuario)"
                                      >
                                        <option
                                          v-for="(tipo, ii) in tipo_visible"
                                          :key="ii"
                                          :value="tipo.value"
                                        >
                                          {{ tipo.name }}
                                        </option>
                                      </select>
                                    </td>
                                    <!-- <td><span class="glyphicon glyphicon-record text-{{ (usuario.activo == '1') ? 'success' : 'danger' }}" data-toggle="tooltip" title="{{ (usuario.activo == '1') ? 'Activo' : 'Inactivo' }}"></span></td> -->
                                    <td :class="(usuario.activo == '1') ? 'text-success' : 'text-danger'"><font-awesome-icon icon="dot-circle"></font-awesome-icon></td>
                                    <td>
                                        <button class="btn btn-sm btn-warning" @click="edit(i)"><font-awesome-icon icon="pencil-alt"></font-awesome-icon></button>
                                        <button class="btn btn-sm btn-danger" @click="del(usuario)"><font-awesome-icon icon="trash"></font-awesome-icon></button>
                                    </td>
                                </tr>
                            </template>

                            <template v-if="!usuarios">
                                <tr>
                                    <td class="text-center" colspan="7"><strong>No posee usuarios registrados</strong></td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>

            <b-modal id="modal-usuario" hide-footer size="md">
                <template #modal-title>
                   Usuario
                </template>
                <form id="form-usuario" class="form-horizontal" action="#!" method="post">
                        <div class="form-group row">
                            <label class="control-label col-sm-4 text-right" for="nombre_completo">Nombre completo</label>
                            <div class="col-sm-8">
                                <input id="nombre_completo" class="form-control" name="nombre_completo" type="text" v-model="usuario.nombre_completo">
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="control-label col-sm-4 text-right" for="usuario">Usuario</label>
                            <div class="col-sm-8">
                                <input id="usuario" class="form-control" name="usuario" type="text" v-model="usuario.usuario">
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="control-label col-sm-4 text-right" for="password">Contraseña</label>
                            <div class="col-sm-8">
                                <input id="password" class="form-control" name="password" type="password" v-model="password.password">
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="control-label col-sm-4 text-right" for="password_confirmation">Confirmar contraseña</label>
                            <div class="col-sm-8">
                                <input id="password_confirmation" name="password_confirmation" class="form-control" type="password" v-model="password.password_confirmation">
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="control-label col-sm-4 text-right" for="cuit_cuil">Fecha Ingreso</label>
                            <div class="col-sm-8">
                                <input id="fecha_ingreso" class="form-control" name="fecha_ingreso" type="date" v-model="usuario.fecha_ingreso">
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="control-label col-sm-4 text-right" for="correo_google">Correo Google</label>
                            <div class="col-sm-8">
                                <input id="correo_google" class="form-control" name="correo_google" type="text" v-model="usuario.correo_google">
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="control-label col-sm-4 text-right" for="rango">Rango</label>
                            <div class="col-sm-8">
                                 <select
                                        id="rango_id"
                                        class="form-control"
                                        v-model="usuario.rango_id"
                                      >
                                        <option
                                          v-for="(rango, ii) in rangos"
                                          :key="ii"
                                          :value="rango.id"
                                        >
                                          {{ rango.nombre }} - ($): {{ Number(rango.valor).toFixed(2) }}
                                        </option>
                                      </select>
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="control-label col-sm-4 text-right" for="cuit_cuil">Cuit-Cuil</label>
                            <div class="col-sm-8">
                                <input id="cuit_cuil" class="form-control" name="cuit_cuil" type="text" v-model="usuario.cuit_cuil">
                            </div>
                        </div>

                         <div class="form-group row">
                            <label class="control-label col-sm-4 text-right" for="afip">Afip</label>
                            <div class="col-sm-8">
                                <input
                                    id="afip"
                                    v-model="usuario.afip"
                                    type="checkbox"
                                >        
                            </div>
                        </div>

                        <div class="form-group row">
                          <label class="control-label col-sm-4 text-right" for="visible_en_planilla">Visible en Planilla</label>
                          <div class="col-sm-8">
                          <select
                            id="visible_en_planilla"
                            class="form-control"
                            v-model="usuario.visible_en_planilla"
                          >
                            <option
                              v-for="(tipo, ii) in tipo_visible"
                              :key="ii"
                              :value="tipo.value"
                            >
                              {{ tipo.name }}
                            </option>
                          </select>
                          </div>
                        </div>

                        <div class="form-group row">
                            <label class="control-label col-sm-4 text-right" for="rol">Rol</label>
                            <div class="col-sm-8">
                                <select id="rol" class="form-control" name="rol" v-model="usuario.rol_id">
                                    <option v-for="rol in roles" :value="rol.id" :key="rol.id">{{ rol.rol }}</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="control-label col-sm-4 text-right" for="activo">Activo</label>
                            <div class="col-sm-8">
                                <select id="activo" class="form-control" name="activo" v-model="usuario.activo">
                                    <option v-for="(estado, i) in estados" :key="i" :value="estado.value">{{ estado.estado }}</option>
                                </select>
                            </div>
                        </div>
                    </form>
                    <button type="button" class="btn btn-success" @click="save()">Guardar</button>
					<button @click="$bvModal.hide('modal-usuario')" type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
            </b-modal>
           
            <b-modal size="lg" id="modal-reporte" hide-footer>
                <div class="row">
                    <div class="col-sm-12">
                    <button
                        type="button"
                        class="btn btn-primary"
                        style="margin:auto; float: right;"
                        @click="printpage()"
                        >
                        Imprimir
                    </button>
                    </div>
                </div>
                <div id="print" ref="print" class="row mt-5">
                  <div class="table-responsive">
                    <table style="width:100%;">
                        <tr>
                            <th colspan="2" style="text-align:center;"><h2>Listado de Usuarios</h2></th>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td align="left"><b>ML PLAK - La Plata AV 72 N868 e 12 y 13</b></td>
                            <td align="right"><b>Fecha: {{ fechaPlanilla }}</b></td>
                        </tr>
                    </table>
                    <table class="table table-hover">
                        <thead>
                            <th>#</th>
                            <th>Usuario</th>
                            <th>Rol</th>
                            <th>Sueldos</th>
                            <th>Cuenta Google</th>
                            <th>Rango</th>
                            <th>Nombre Completo</th>
                            <th>Fecha Ingreso</th>
                            <th>Cuit-Cuil</th>
                            <th>Activo</th>
                        </thead>
                        <tbody>
                            <template v-if="usuariosVisibles.length">
                                <tr v-for="(usuario, i) in usuariosVisibles" :key="i">
                                    <td>{{ i+1 }}</td>
                                    <td>{{ usuario.usuario }}</td>
                                    <td>{{ (usuario.rol_id == 1) ? 'Administrador' : 'Usuario' }}</td>
                                    <td style="text-align:center;">{{ (usuario.permiso == 1) ? 'Sí' : 'No' }}</td>
                                    <td>{{ usuario.correo_google }}</td>
                                    <td>{{ (usuario.rango!=null)? usuario.rango.nombre : '' }}</td>
                                    <td>{{ usuario.nombre_completo }}</td>
                                    <td>{{ usuario.fecha_ingreso? $moment(usuario.fecha_ingreso).format("DD-MM-YYYY") : '' }}</td>
                                    <td style="text-align:center;">{{ usuario.cuit_cuil }}</td>
                                    <td style="text-align:center;">{{ (usuario.activo == 1) ? 'Sí' : 'No' }}</td>
                                </tr>
                            </template>
                            <template v-if="!usuariosVisibles">
                                <tr>
                                    <td class="text-center" colspan="7"><strong>No posee usuarios registrados</strong></td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                  </div>
                </div>
				<button @click="$bvModal.hide('modal-reporte')" type="button" class="btn btn-danger" data-dismiss="modal" style="margin:auto; float: right;">Cerrar</button>
            </b-modal>
        </div>
    </div>
</template>

<script>
import { faDotCircle} from '@fortawesome/free-solid-svg-icons'
import { faPencilAlt} from '@fortawesome/free-solid-svg-icons'
import { faTrash} from '@fortawesome/free-solid-svg-icons'
// import { faDotCircle} from '@fortawesome/free-solid-svg-icons'
import swal from 'sweetalert2'
import { library } from '@fortawesome/fontawesome-svg-core'

import usuarioService from '../Services/usuarioService'
import rangoService from '../Services/rangoService'

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import VueToastr from "vue-toastr";
import { EventBus } from "@/index";

const UsuarioService = new usuarioService();
const RangoService = new rangoService();

library.add(faDotCircle)
library.add(faPencilAlt)
library.add(faTrash)

export default {
    components:{
        FontAwesomeIcon,
        VueToastr
    },
    data(){
        return{
            fechaPlanilla:"",
            tipo_visible: "",
            usuarios:[],
            usuariosVisibles:[],
            rangos:[],
            roles: '',
            usuario:{
                usuario : '',
                password: '',
                nombre_completo : '',
                activo : 1,
                rol_id : 0,

            },
            messages: [],
            roles: [],
            password:{},
            estados: [{ value: 1, estado: 'Sí' }, { value: 0, estado: 'No' }]
        }
    },
    mounted(){ 
        //this.usuario = usuario
    this.tipo_visible = [
      { name: "Sí", value: 1 },
      { name: "No", value: 0 },
    ];
		this.password = { password: '', password_confirmation: '' };
		this.messages = [];

        this.getAllRoles();
        this.getAllUsuarios();
        this.getAllRangos();
    },
    methods:{
        printpage() {
            let printContents = document.getElementById('print').innerHTML;
            let w = window.open();
            w.document.write(printContents);
            w.document.close(); // necessary for IE >= 10
            w.focus(); // necessary for IE >= 10
                w.print();
                w.close();
        },
        generarReporte() {
            this.fechaPlanilla = this.$moment().format("DD/MM/YYYY"); 
            this.getVisibleUsers()  
            this.$bvModal.show("modal-reporte");
        },
        async getAllRangos() {
            let data = await RangoService.getAll()
            if (data){
                this.rangos = data.data;
            }
        },
        async onChangeRango(rango,usuario) {
          let reqData = {
            rango_id: rango.target.value,
            id: usuario.id,
          };
          console.log("onchangerango---->", reqData);
          this.$refs.toastr.i("Actualizando rango del Usuario...");

          let response = await UsuarioService.changeRangoUsuario(reqData);
          if (response) {
            if (response.status == true)
              this.$refs.toastr.s("¡Usuario actualizado con éxito!");
            else if (response.status == false)
              this.$refs.toastr.e("¡Error al actualizar usuario!");
          }
        },
        async onChangeAfip(afip,usuario) {
          let reqData = {
            afip: afip,
            id: usuario.id,
          };
          console.log("onchangeafip---->", reqData);
          this.$refs.toastr.i("Actualizando Afip del Usuario...");

          let response = await UsuarioService.changeAfipUsuario(reqData);
          if (response) {
            if (response.status == true)
              this.$refs.toastr.s("¡Usuario actualizado con éxito!");
            else if (response.status == false)
              this.$refs.toastr.e("¡Error al actualizar usuario!");
          }
        },
        async onChangeVisible(visible,usuario) {
          let reqData = {
            visible_en_planilla: visible.target.value,
            id: usuario.id,
          };
          console.log("onchangeactive---->", reqData);
          this.$refs.toastr.i("Actualizando visibilidad del Usuario...");

          let response = await UsuarioService.changeVisiblePlanilla(reqData);
          if (response) {
            if (response.status == true)
              this.$refs.toastr.s("¡Usuario actualizado con éxito!");
            else if (response.status == false)
              this.$refs.toastr.e("¡Error al actualizar usuario!");
          }
        },

        async save() {
            let reqData = this.usuario;
            reqData = { ...reqData, ...this.password };
            this.messages = [];
            console.log(reqData);
            if ((this.password.password.length > 0))
                if ((this.password.password_confirmation.length > 0) && (this.password.password === this.password.password_confirmation)) {
                    reqData = { ...reqData, ...this.password };
                } else {
                    // this.messages.push({type: 'danger', message: '¡Contraseñas no coinciden!'});
                    this.$refs.toastr.e('¡Contraseñas no coinciden!');
                }

            if (this.messages.length === 0) {
                if (this.usuario.hasOwnProperty('id') && (this.usuario.id > 0)){
                    let response = await UsuarioService.update(reqData)
                    if (response.success === true) {
                        this.$refs.toastr.s('¡Usuario actualizado con éxito!');
                        this.$bvModal.hide('modal-usuario');
                    } else if (response.success == false) {
                        this.$refs.toastr.e('¡Error al actualizar usuario!');
                    }
                }
                else{
                    let response = await UsuarioService.store(reqData)
                    if (response.success === true) {
                        this.$refs.toastr.s('¡Usuario creado con éxito!');
                        this.usuarios.push(response.usuario);
                        this.$bvModal.hide('modal-usuario');
                    }
                    else if (response.success === false){
                        this.$refs.toastr.e('¡Error al crear usuario!');
                    }
                }
            }
        },

	    setMessages(messages = []){
		    this.messages = messages;
	    },
        async getAllRoles() {
            let data = await UsuarioService.getAllRoles()
            if(data){
                this.roles = data.roles;
            }
        },
        async getAllUsuarios() {
            let data = await UsuarioService.getAll()
            if(data){
                this.usuarios = data.usuarios;
            }
        },
        async getVisibleUsers() {
            let data = await UsuarioService.getVisibleUsers()
            if(data){
                this.usuariosVisibles = data.usuarios;
            }
        },
        edit(index) {
            this.setMessages()
            this.setUsuario(this.usuarios[index]);
            this.$bvModal.show("modal-usuario");

            // _$('#modal-usuario').modal('show');
        },
        setUsuario(usuario) {
            this.usuario = usuario;
        },
        create() {
            this.setMessages();
            let usuario={
                usuario : '',
                password: '',
                nombre_completo : '',
                activo : 1,
                rol_id : 0,

            }
            this.setUsuario(usuario);
            this.$bvModal.show("modal-usuario");
        },

        async del(usuario) {
            swal({
                title: `¿Desea eliminar el usuario: ${usuario.usuario}?`,
                text: 'No podrá ser recuperado',
                type: 'question',
                customClass: 'unfont-size',
                showCancelButton: true
            }).then(async selected => {
                if (selected.value) {
                    this.$refs.toastr.i('Eliminando usuario...');
                    let response = await UsuarioService.delete(parseInt(usuario.id))
                    // this.usuarioService.delete(parseInt(usuario.id)).subscribe(response => {
                    if (response.status === true) {
                        let index = 0;
                        for (let i = 0; i < this.usuarios.length; i++){
                            if (this.usuarios[i].id === usuario.id) {
                                index = i;
                                break;
                            }
                        }
                        this.usuarios.splice(index, 1);
                        this.$refs.toastr.s('¡Usuario eliminado con éxito!');
                    }
                    //});
                }
            })
        },
        async onChangeSueldo(e, usuario) {
            console.log(e, usuario)
            const { value: password } = await swal({
                title: 'Introduzca la contraseña',
                input: 'password',
                inputLabel: 'Contraseña',
                inputPlaceholder: 'Contraseña',
                inputAttributes: {
                    maxlength: 10,
                    autocapitalize: 'off',
                    autocorrect: 'off'
                }
            })
            if (!password) {
                usuario.permiso = !e
                return
            }
            let data = {
                id: usuario.id,
                permiso: e,
                password: password,
            }
            UsuarioService.changeSueldoPermission(data).then(response => {
                this.$noty.info("Actualizado");
                EventBus.$emit("changePermisoSueldo");
            }).catch(error => {
                usuario.permiso = !e
                if(error.response.data.success==false) {
                    this.$noty.error("Ha introducido una contraseña erronea");
                }
            })
        }
    }
}
</script>

<style>

</style>
