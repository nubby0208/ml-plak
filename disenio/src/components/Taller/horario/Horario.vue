<template>
    <div id="app-usuario-horario-list" class="container-fluid">
        <vue-toastr ref="toastr"></vue-toastr>
        <div class="col-sm-12 col-sm-offset-1">
            <div class="col-sm-12 text-center py-3">
                <h1>
                    Horarios por Usuario, Feriados y Rangos
                </h1>
                 <h2>
                    Listado de Horarios por Usuario
                </h2>
                <button type="button" class="btn btn-sm btn-primary" 
                        @click="generarReporte()">
                        Generar Reporte
                </button> 
                <button type="button" class="btn btn-sm btn-success" @click="editDefault()">
                    <span class="glyphicon glyphicon-pencil"></span>
                    Editar Horario y Sueldo Default
                </button>
                <hr>
            </div>

            <div id="usuario-listado" class="col-sm-12">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <th>#</th>
                            <th>Usuario</th>
                            <th>Nombre completo</th>
                            <th>Valor Hora</th>
                            <th>Valor Plus</th>
                            <th>Sistema</th>
                            <th class="text-center">L</th>
                            <th class="text-center">M</th>
                            <th class="text-center">X</th>
                            <th class="text-center">J</th>
                            <th class="text-center">V</th>
                            <th class="text-center">S</th>
                            <th class="text-center">D</th>
                            <th>Default</th>
                            <th>Acciones</th>
                        </thead>
                        <tbody>
                            <template v-if="usuarios">
                                <tr v-for="(usuario, i) in usuarios" :key="i">
                                    <td>{{ i+1 }}</td>
                                    <td >{{ usuario.usuario }}</td>
                                    <td class="text-capitalize">{{ usuario.nombre_completo }}</td>
                                    <td class="text-center">
                                        <span v-if="usuario.horario && usuario.horario.valor_x_hora">
                                            ${{usuario.horario.valor_x_hora}}
                                        </span>
                                        <span v-if="horarioDefault && horarioDefault.valor_x_hora && !usuario.horario">
                                            ${{horarioDefault.valor_x_hora}}
                                        </span>
                                        <span v-if="(usuario.horario && !usuario.horario.valor_x_hora) || (horarioDefault && !horarioDefault.valor_x_hora && !usuario.horario)"> $0.00 </span>
                                    </td>
                                    <td class="text-center">
                                        <span v-if="usuario.horario && usuario.horario.valor_plus">
                                            ${{usuario.horario.valor_plus}}
                                        </span>
                                        <span v-if="horarioDefault && horarioDefault.valor_plus && !usuario.horario">
                                            ${{horarioDefault.valor_plus}}
                                        </span>
                                        <span v-if="(usuario.horario && !usuario.horario.valor_plus) || (horarioDefault && !horarioDefault.valor_plus && !usuario.horario)"> $0.00 </span>
                                    </td>
                                    <td class="text-center">
                                        <span v-if="usuario.horario && usuario.horario.sistema">
                                            {{usuario.horario.sistema? 'Normal':'Compensatorio'}}
                                        </span>
                                        <span v-if="horarioDefault && horarioDefault.sistema && !usuario.horario">
                                            {{horarioDefault.sistema? 'Normal':'Compensatorio'}}
                                        </span>
                                        <span v-if="(usuario.horario && !usuario.horario.sistema) || (horarioDefault && !horarioDefault.sistema && !usuario.horario)">Normal</span>
                                    </td>
                                    <td class="text-center">
                                        <span v-if="usuario.horario && usuario.horario.habilitado_lunes">
                                            {{usuario.horario.hora_inicio_lunes}} <br>
                                            {{usuario.horario.hora_fin_lunes}}
                                        </span>
                                        <span v-if="horarioDefault && horarioDefault.habilitado_lunes && !usuario.horario">
                                            {{horarioDefault.hora_inicio_lunes}} <br>
                                            {{horarioDefault.hora_fin_lunes}}
                                        </span>
                                        <span v-if="(usuario.horario && !usuario.horario.habilitado_lunes) || (horarioDefault && !horarioDefault.habilitado_lunes && !usuario.horario)"> - </span>
                                    </td>
                                    <td class="text-center">
                                        <span v-if="usuario.horario && usuario.horario.habilitado_martes">
                                            {{usuario.horario.hora_inicio_martes}} <br>
                                            {{usuario.horario.hora_fin_martes}}
                                        </span>
                                        <span v-if="horarioDefault && horarioDefault.habilitado_martes && !usuario.horario">
                                            {{horarioDefault.hora_inicio_martes}} <br>
                                            {{horarioDefault.hora_fin_martes}}
                                        </span>
                                        <span v-if="(usuario.horario && !usuario.horario.habilitado_martes) || (horarioDefault && !horarioDefault.habilitado_martes && !usuario.horario)"> - </span>
                                    </td>
                                    <td class="text-center">
                                        <span v-if="usuario.horario && usuario.horario.habilitado_miercoles">
                                            {{usuario.horario.hora_inicio_miercoles}} <br>
                                            {{usuario.horario.hora_fin_miercoles}}
                                        </span>
                                        <span v-if="horarioDefault && horarioDefault.habilitado_miercoles && !usuario.horario">
                                            {{horarioDefault.hora_inicio_miercoles}} <br>
                                            {{horarioDefault.hora_fin_miercoles}}
                                        </span>
                                        <span v-if="(usuario.horario && !usuario.horario.habilitado_miercoles) || (horarioDefault && !horarioDefault.habilitado_miercoles && !usuario.horario)"> - </span>
                                    </td>
                                    <td class="text-center">
                                        <span v-if="usuario.horario && usuario.horario.habilitado_jueves">
                                            {{usuario.horario.hora_inicio_jueves}} <br>
                                            {{usuario.horario.hora_fin_jueves}}
                                        </span>
                                        <span v-if="horarioDefault && horarioDefault.habilitado_jueves && !usuario.horario">
                                            {{horarioDefault.hora_inicio_jueves}} <br>
                                            {{horarioDefault.hora_fin_jueves}}
                                        </span>
                                        <span v-if="(usuario.horario && !usuario.horario.habilitado_jueves) || (horarioDefault && !horarioDefault.habilitado_jueves && !usuario.horario)"> - </span>
                                    </td>
                                    <td class="text-center">
                                        <span v-if="usuario.horario && usuario.horario.habilitado_viernes">
                                            {{usuario.horario.hora_inicio_viernes}} <br>
                                            {{usuario.horario.hora_fin_viernes}}
                                        </span>
                                        <span v-if="horarioDefault && horarioDefault.habilitado_viernes && !usuario.horario">
                                            {{horarioDefault.hora_inicio_viernes}} <br>
                                            {{horarioDefault.hora_fin_viernes}}
                                        </span>
                                        <span v-if="(usuario.horario && !usuario.horario.habilitado_viernes) || (horarioDefault && !horarioDefault.habilitado_viernes && !usuario.horario)"> - </span>
                                    </td>
                                    <td class="text-center">
                                        <span v-if="usuario.horario && usuario.horario.habilitado_sabado">
                                            {{usuario.horario.hora_inicio_sabado}} <br>
                                            {{usuario.horario.hora_fin_sabado}}
                                        </span>
                                        <span v-if="horarioDefault && horarioDefault.habilitado_sabado && !usuario.horario">
                                            {{horarioDefault.hora_inicio_sabado}} <br>
                                            {{horarioDefault.hora_fin_sabado}}
                                        </span>
                                        <span v-if="(usuario.horario && !usuario.horario.habilitado_sabado) || (horarioDefault && !horarioDefault.habilitado_sabado && !usuario.horario)"> - </span>
                                    </td>
                                    <td class="text-center">
                                        <span v-if="usuario.horario && usuario.horario.habilitado_domingo">
                                            {{usuario.horario.hora_inicio_domingo}} <br>
                                            {{usuario.horario.hora_fin_domingo}}
                                        </span>
                                        <span v-if="horarioDefault && horarioDefault.habilitado_domingo && !usuario.horario">
                                            {{horarioDefault.hora_inicio_domingo}} <br>
                                            {{horarioDefault.hora_fin_domingo}}
                                        </span>
                                        <span v-if="(usuario.horario && !usuario.horario.habilitado_domingo) || (horarioDefault && !horarioDefault.habilitado_domingo && !usuario.horario)"> - </span>
                                    </td>
                                    <td><font-awesome-icon v-bind:class=" (usuario.horario && !usuario.horario.is_default) ? 'text-danger' : 'text-success'" data-toggle="tooltip" :title=" (usuario.horario && !usuario.horario.is_default) ? 'Inactivo' : 'Activo'" icon="dot-circle"></font-awesome-icon></td>

                                    <!-- <td><span :class="glyphicon 'glyphicon-record' text-{{ ((usuario.horario && !usuario.horario.is_default)) ? 'danger' : 'success'}}" data-toggle="tooltip" title="{{ ((usuario.horario && !usuario.horario.is_default)) ? 'Inactivo' : 'Activo' }}"></span></td> -->
                                    <td>
                                        <button class="btn btn-sm btn-warning" @click="edit(i)"><font-awesome-icon icon="pencil-alt"></font-awesome-icon></button>
                                        <button class="btn btn-sm btn-danger" @click="del(i)"><font-awesome-icon icon="trash"></font-awesome-icon></button>
                                    </td>
                                </tr>
                            </template>

                            <template v-if="!usuarios">
                                <tr>
                                    <td class="text-center" colspan="6"><strong>No posee usuarios registrados</strong></td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- modal feriado -->
            <b-modal id="modal-feriado" hide-footer size="md">
                <template #modal-title>
                   Feriados
                </template>
                <div class="modal-content">
                    <div class="modal-body">
                        <div id="" class="col-sm-12">
                            <template v-if="messages.length > 0">
                                <div v-for="(message, i) in messages" :class="'alert alert-' + message.type " :key="i">
                                    <button v-if="!message.keep" type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    {{ message.message }}
                                </div>
                            </template>

                            <form id="form-feriado" class="form-horizontal" action="#!" method="post">
                                <div class="form-group row">
                                    <label class="control-label col-sm-4" for="fecha">Fecha</label>
                                    <div class="col-sm-8">
                                        <input id="fecha" class="form-control" name="fecha" type="date" v-model="feriado.fecha" required>
                                    </div>
                                </div>

                            </form>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" @click="saveFeriado()">Guardar</button>
                        <button type="button" class="btn btn-danger" @click="$bvModal.hide('modal-feriado')" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>

            </b-modal>

            <!-- modal rango -->
            <b-modal id="modal-rango" hide-footer size="md">
                <template #modal-title>
                   Rangos
                </template>
                <div class="modal-content">
                    <div class="modal-body">
                        <div id="" class="col-sm-12">
                            <form @submit.prevent enctype="multipart/form-data">
                                <div class="form-group row">
                                    <label class="control-label col-sm-4" for="fecha">Nombre </label>
                                    <div class="col-sm-8">
                                        <b-form-input id="rango.nombre" 
                                        class="form-control" 
                                        name="nombre" 
                                        type="text" 
                                        v-model="rango.nombre" 
                                        required></b-form-input>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="control-label col-sm-4" for="fecha">Valor ($)</label>
                                    <div class="col-sm-8">
                                        <b-form-input id="rango.valor" 
                                        class="form-control" 
                                        name="valor" 
                                        type="number"
                                        step="0.01"
                                        min=0 
                                        v-model="rango.valor" 
                                        required></b-form-input>
                                    </div>
                                </div>
                                 <div class="form-group row">
                                    <label class="control-label col-sm-4" for="fecha">Suma No Renumerativa ($)</label>
                                    <div class="col-sm-8">
                                        <b-form-input id="rango.suma_no_remunerativa" 
                                        class="form-control" 
                                        name="suma_no_remunerativa" 
                                        type="number"
                                        step="0.01"
                                        min=0 
                                        v-model="rango.suma_no_remunerativa" 
                                        required></b-form-input>
                                    </div>
                                </div>
                                <div class="form-group row" style="float: right;">
                                    <button type="button" class="btn btn-success" @click="saveRango()" style="float: right;">Guardar</button>
                                    <button type="button" class="btn btn-danger" @click="$bvModal.hide('modal-rango')" data-dismiss="modal" style="float: right;">Cerrar</button>
                                </div>    
                            </form>
                        </div>
                    </div>
                </div>
            </b-modal>
        </div>

        <div class="col-sm-12 col-sm-offset-1">
            <div class="col-sm-12 text-center">
                <h2>
                    Listado de Feriados
                </h2>
                <button type="button" class="btn btn-sm btn-success" @click="newFeriado()">
                    <span class="glyphicon glyphicon-pencil"></span>
                    Nuevo feriado
                </button>
                <hr>
            </div>

            <div id="usuario-listado" class="col-sm-12">
                <table class="table table-hover">
                    <thead>
                        <th >#</th>
                        <th >Fecha</th>
                        <th ></th>

                    </thead>
                    <tbody>
                        <template v-if="feriados">
                            <tr v-for="(feriado, i) in feriados" :key="i">
                                <td >{{ i+1 }}</td>
                                <td >{{ $moment(feriado.fecha).format("DD/MM/YYYY") }}</td>
                                <td >
                                    <button class="btn btn-sm btn-danger" @click="deleteFeriado(i)"><font-awesome-icon icon="trash"></font-awesome-icon></button>
                                </td>
                            </tr>
                        </template>

                        <template v-if="!feriados">
                            <tr>
                                <td colspan="6"><strong>No posee feriados registrados</strong></td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <!-- Rangos -->
            <div class="col-sm-12 text-center">
                <h2>
                    Listado de Rangos
                </h2>
                <button type="button" class="btn btn-sm btn-success" @click="newRango()">
                    <span class="glyphicon glyphicon-pencil"></span>
                    Nuevo rango
                </button>
                <hr>
            </div>

            <div id="rango-listado" class="col-sm-12">
                <table class="table table-hover">
                    <thead>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Valor ($)</th>
                        <th>Suma No Remunerativa ($)</th>
                        <th></th>
                    </thead>
                    <tbody>
                        <template v-if="rangos">
                            <tr v-for="(rango, i) in rangos" :key="i">
                                <td>{{ i+1 }}</td>
                                <td>{{ rango.nombre }}</td>
                                <td>{{ Number(rango.valor).toFixed(2) }}</td>
                                <td>{{ Number(rango.suma_no_remunerativa).toFixed(2) }}</td>
                                <td>
                                    <button class="btn btn-sm btn-warning" @click="editRango(i)">
                                        <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                                    </button>
                                    <button class="btn btn-sm btn-danger" @click="deleteRango(i)">
                                        <font-awesome-icon icon="trash"></font-awesome-icon>
                                    </button>
                                </td>
                            </tr>
                        </template>
                        <template v-if="!rangos">
                            <tr>
                                <td colspan="6"><strong>No posee rangos registrados</strong></td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
            <!-- ok funcionando -->
            <b-modal id="modal-horario-default" hide-footer size="lg">
                <template #modal-title>
                   Horario y Sueldo Default
                </template>

                <div class="modal-body">
                    <div id="app-horario-default-form" class="container-fluid">
                        <div id="" class="col-sm-12">
                            <template v-if="messages.length > 0">
                                <div v-for="(message, i) in messages" :key="i" :class="['alert', 'alert-'+ message.type ]">
                                    <button v-if="!message.keep" type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    {{ message.message }}
                                </div>
                            </template>

                            <form id="form-usuario" class="form-horizontal" action="#!" method="post">
                                <template>
                                  <b>Horario</b>
                                </template>
                                <hr>
                                <div class="row" style="margin-bottom:20px;">
                                    <div class="col-md-3 text-capitalize"><strong>Día</strong></div>
                                    <div class="col-md-3"><strong>Habilitado</strong></div>
                                    <div class="col-md-3"><strong>Hora entrada</strong></div>
                                    <div class="col-md-3"><strong>Hora salida</strong></div>
                                </div>
                                <div class="row" style="margin-bottom:10px;">
                                    <div class="col-md-3 text-capitalize">lunes</div>
                                    <div class="col-md-3">
                                        <input id="habilitado_lunes" name="habilitado_lunes" type="checkbox" v-model="horarioDefault.habilitado_lunes">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_inicio_lunes" class="form-control" name="hora_inicio_lunes" type="text" v-model="horarioDefault.hora_inicio_lunes">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_fin_lunes" class="form-control" name="hora_fin_lunes" type="text" v-model="horarioDefault.hora_fin_lunes">
                                    </div>
                                </div>
                                <div class="row" style="margin-bottom:10px;">
                                    <div class="col-md-3 text-capitalize">martes</div>
                                    <div class="col-md-3">
                                        <input id="habilitado_martes" name="habilitado_martes" type="checkbox" v-model="horarioDefault.habilitado_martes">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_inicio_martes" class="form-control" name="hora_inicio_martes" type="text" v-model="horarioDefault.hora_inicio_martes">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_fin_martes" class="form-control" name="hora_fin_martes" type="text" v-model="horarioDefault.hora_fin_martes">
                                    </div>
                                </div>
                                <div class="row" style="margin-bottom:10px;">
                                    <div class="col-md-3 text-capitalize">miercoles</div>
                                    <div class="col-md-3">
                                        <input id="habilitado_miercoles" name="habilitado_miercoles" type="checkbox" v-model="horarioDefault.habilitado_miercoles">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_inicio_miercoles" class="form-control" name="hora_inicio_miercoles" type="text" v-model="horarioDefault.hora_inicio_miercoles">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_fin_miercoles" class="form-control" name="hora_fin_miercoles" type="text" v-model="horarioDefault.hora_fin_miercoles">
                                    </div>
                                </div>
                                <div class="row" style="margin-bottom:10px;">
                                    <div class="col-md-3 text-capitalize">jueves</div>
                                    <div class="col-md-3">
                                        <input id="habilitado_jueves" name="habilitado_jueves" type="checkbox" v-model="horarioDefault.habilitado_jueves">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_inicio_jueves" class="form-control" name="hora_inicio_jueves" type="text" v-model="horarioDefault.hora_inicio_jueves">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_fin_jueves" class="form-control" name="hora_fin_jueves" type="text" v-model="horarioDefault.hora_fin_jueves">
                                    </div>
                                </div>
                                <div class="row" style="margin-bottom:10px;">
                                    <div class="col-md-3 text-capitalize">viernes</div>
                                    <div class="col-md-3">
                                        <input id="habilitado_viernes" name="habilitado_viernes" type="checkbox" v-model="horarioDefault.habilitado_viernes">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_inicio_viernes" class="form-control" name="hora_inicio_viernes" type="text" v-model="horarioDefault.hora_inicio_viernes">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_fin_viernes" class="form-control" name="hora_fin_viernes" type="text" v-model="horarioDefault.hora_fin_viernes">
                                    </div>
                                </div>
                                <div class="row" style="margin-bottom:10px;">
                                    <div class="col-md-3 text-capitalize">sábado</div>
                                    <div class="col-md-3">
                                        <input id="habilitado_sabado" name="habilitado_sabado" type="checkbox" v-model="horarioDefault.habilitado_sabado">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_inicio_sabado" class="form-control" name="hora_inicio_sabado" type="text" v-model="horarioDefault.hora_inicio_sabado">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_fin_sabado" class="form-control" name="hora_fin_sabado" type="text" v-model="horarioDefault.hora_fin_sabado">
                                    </div>
                                </div>
                                <div class="row" style="margin-bottom:10px;">
                                    <div class="col-md-3 text-capitalize">domingo</div>
                                    <div class="col-md-3">
                                        <input id="habilitado_domingo" name="habilitado_domingo" type="checkbox" v-model="horarioDefault.habilitado_domingo">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_inicio_domingo" class="form-control" name="hora_inicio_domingo" type="text" v-model="horarioDefault.hora_inicio_domingo">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_fin_domingo" class="form-control" name="hora_fin_domingo" type="text" v-model="horarioDefault.hora_fin_domingo">
                                    </div>
                                </div>
                                 <template>
                                  <b>Sueldo</b>
                                </template>
                                <hr>
                                <div class="row" style="margin-bottom:10px;">
                                    <div class="col-md-3 text-capitalize">Valor Hora</div>
                                    <div class="col-md-3">
                                        <input id="valor_x_hora" class="form-control" name="valor_x_hora" type="number" v-model="horarioDefault.valor_x_hora">
                                    </div>
                                    <div class="col-md-3 text-capitalize">Valor Plus</div>
                                    <div class="col-md-3">
                                        <input id="valor_plus" class="form-control" name="valor_plus" type="number" v-model="horarioDefault.valor_plus">
                                    </div>
                                </div>
                                <div class="row" style="margin-bottom:10px;">
                                    <div class="col-md-3 text-capitalize">Sistema Horario</div>
                                    <div class="col-md-9">
                                        <select v-model="horarioDefault.sistema">
                                          <option value=1 selected>Normal</option>
                                          <option value=2>Compensatorio</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" @click="saveDefault()">Guardar</button>
                    <button @click="$bvModal.hide('modal-horario-default')" type="button" class="btn btn-danger" data-dismiss="modal">Cerrar</button>
                </div>
            </b-modal>
            <!-- funcional -->
            <b-modal id="modal-horario" hide-footer size="lg">
                <template #modal-title>
                   Usuario: {{usuario.nombre_completo}}
                </template>
                <div class="modal-body">

                    <div id="app-horario-default-form" class="container-fluid">
                        <div id="" class="col-sm-12">
                            <template v-if="messages.length > 0">
                                <div v-for="(message, i) in messages" :key="i" :class="['alert', 'alert-'+ message.type ]">
                                    <button v-if="!message.keep" type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    {{ message.message }}
                                </div>
                            </template>

                            <form id="form-usuario" class="form-horizontal" action="#!" method="post">
                                <template>
                                  <b>Horario</b>
                                </template>
                                <hr>
                                <div class="row" style="margin-bottom:20px;">
                                    <div class="col-md-3 text-capitalize"><strong>Día</strong></div>
                                    <div class="col-md-3"><strong>Habilitado</strong></div>
                                    <div class="col-md-3"><strong>Hora entrada</strong></div>
                                    <div class="col-md-3"><strong>Hora salida</strong></div>
                                </div>
                                <div class="row" style="margin-bottom:10px;">
                                    <div class="col-md-3 text-capitalize">Lunes</div>
                                    <div class="col-md-3">
                                        <input id="habilitado_lunes" name="habilitado_lunes" type="checkbox" v-model="usuario.horario.habilitado_lunes">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_inicio_lunes" class="form-control" name="hora_inicio_lunes" type="text" v-model="usuario.horario.hora_inicio_lunes">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_fin_lunes" class="form-control" name="hora_fin_lunes" type="text" v-model="usuario.horario.hora_fin_lunes">
                                    </div>
                                </div>
                                <div class="row" style="margin-bottom:10px;">
                                    <div class="col-md-3 text-capitalize">martes</div>
                                    <div class="col-md-3">
                                        <input id="habilitado_martes" name="habilitado_martes" type="checkbox" v-model="usuario.horario.habilitado_martes">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_inicio_martes" class="form-control" name="hora_inicio_martes" type="text" v-model="usuario.horario.hora_inicio_martes">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_fin_martes" class="form-control" name="hora_fin_martes" type="text" v-model="usuario.horario.hora_fin_martes">
                                    </div>
                                </div>
                                <div class="row" style="margin-bottom:10px;">
                                    <div class="col-md-3 text-capitalize">miercoles</div>
                                    <div class="col-md-3">
                                        <input id="habilitado_miercoles" name="habilitado_miercoles" type="checkbox" v-model="usuario.horario.habilitado_miercoles">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_inicio_miercoles" class="form-control" name="hora_inicio_miercoles" type="text" v-model="usuario.horario.hora_inicio_miercoles">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_fin_miercoles" class="form-control" name="hora_fin_miercoles" type="text" v-model="usuario.horario.hora_fin_miercoles">
                                    </div>
                                </div>
                                <div class="row" style="margin-bottom:10px;">
                                    <div class="col-md-3 text-capitalize">jueves</div>
                                    <div class="col-md-3">
                                        <input id="habilitado_jueves" name="habilitado_jueves" type="checkbox" v-model="usuario.horario.habilitado_jueves">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_inicio_jueves" class="form-control" name="hora_inicio_jueves" type="text" v-model="usuario.horario.hora_inicio_jueves">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_fin_jueves" class="form-control" name="hora_fin_jueves" type="text" v-model="usuario.horario.hora_fin_jueves">
                                    </div>
                                </div>
                                <div class="row" style="margin-bottom:10px;">
                                    <div class="col-md-3 text-capitalize">viernes</div>
                                    <div class="col-md-3">
                                        <input id="habilitado_viernes" name="habilitado_viernes" type="checkbox" v-model="usuario.horario.habilitado_viernes">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_inicio_viernes" class="form-control" name="hora_inicio_viernes" type="text" v-model="usuario.horario.hora_inicio_viernes">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_fin_viernes" class="form-control" name="hora_fin_viernes" type="text" v-model="usuario.horario.hora_fin_viernes">
                                    </div>
                                </div>
                                <div class="row" style="margin-bottom:10px;">
                                    <div class="col-md-3 text-capitalize">sábado</div>
                                    <div class="col-md-3">
                                        <input id="habilitado_sabado" name="habilitado_sabado" type="checkbox" v-model="usuario.horario.habilitado_sabado">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_inicio_sabado" class="form-control" name="hora_inicio_sabado" type="text" v-model="usuario.horario.hora_inicio_sabado">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_fin_sabado" class="form-control" name="hora_fin_sabado" type="text" v-model="usuario.horario.hora_fin_sabado">
                                    </div>
                                </div>
                                <div class="row" style="margin-bottom:10px;">
                                    <div class="col-md-3 text-capitalize">domingo</div>
                                    <div class="col-md-3">
                                        <input id="habilitado_domingo" name="habilitado_domingo" type="checkbox" v-model="usuario.horario.habilitado_domingo">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_inicio_domingo" class="form-control" name="hora_inicio_domingo" type="text" v-model="usuario.horario.hora_inicio_domingo">
                                    </div>
                                    <div class="col-md-3">
                                        <input id="hora_fin_domingo" class="form-control" name="hora_fin_domingo" type="text" v-model="usuario.horario.hora_fin_domingo">
                                    </div>
                                </div>
                                <template>
                                  <b>Sueldo</b>
                                </template>
                                <hr>
                                <div class="row" style="margin-bottom:10px;">
                                    <div class="col-md-3 text-capitalize">Valor Hora</div>
                                    <div class="col-md-3">
                                        <input id="valor_x_hora" class="form-control" name="valor_x_hora" type="number" v-model="usuario.horario.valor_x_hora">
                                    </div>
                                    <div class="col-md-3 text-capitalize">Valor Plus</div>
                                    <div class="col-md-3">
                                        <input id="valor_plus" class="form-control" name="valor_plus" type="number" v-model="usuario.horario.valor_plus">
                                    </div>
                                </div>
                                <div class="row" style="margin-bottom:10px;">
                                    <div class="col-md-3 text-capitalize">Sistema Horario</div>
                                    <div class="col-md-9">
                                        <select v-model="usuario.horario.sistema">
                                          <option value=1 selected>Normal</option>
                                          <option value=2>Compensatorio</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>


                </div>
                <div class="modal-footer">
						<button type="button" class="btn btn-success" @click="save()">Guardar</button>
						<button type="button" class="btn btn-danger" @click="$bvModal.hide('modal-horario')" data-dismiss="modal">Cerrar</button>
                </div>
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
                    <table style="width:100%;">
                        <tr>
                            <th colspan="2" style="text-align:center;"><h2>Horarios por Usuario</h2></th>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td align="left"><b>ML PLAK - La Plata AV 72 N868 e 12 y 13</b></td>
                            <td align="right"><b>Fecha: {{ fechaPlanilla }}</b></td>
                        </tr>
                    </table>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <th>#</th>
                                <th width="300" nowrap>Nombre completo</th>
                                <th class="text-center">Cuit-Cuil</th>
                                <th class="text-center">Rango</th>
                                <th class="text-center">L</th>
                                <th class="text-center">M</th>
                                <th class="text-center">X</th>
                                <th class="text-center">J</th>
                                <th class="text-center">V</th>
                                <th class="text-center">S</th>
                                <th class="text-center">D</th>
                            </thead>
                            <tbody>
                                <template v-if="usuariosVisibles">
                                    <tr v-for="(usuario, i) in usuariosVisibles" :key="i">
                                        <td>{{ i+1 }}</td>
                                        <td class="text-capitalize">{{ usuario.nombre_completo }}</td>
                                        <td class="text-center">{{usuario.cuit_cuil}}</td>
                                        <td class="text-center">{{ (usuario.rango!=null)? usuario.rango.nombre : '' }}</td>
                                        <td class="text-center">
                                            <span v-if="usuario.horario && usuario.horario.habilitado_lunes">
                                                {{usuario.horario.hora_inicio_lunes}} <br>
                                                {{usuario.horario.hora_fin_lunes}}
                                            </span>
                                            <span v-if="horarioDefault && horarioDefault.habilitado_lunes && !usuario.horario">
                                                {{horarioDefault.hora_inicio_lunes}} <br>
                                                {{horarioDefault.hora_fin_lunes}}
                                            </span>
                                            <span v-if="(usuario.horario && !usuario.horario.habilitado_lunes) || (horarioDefault && !horarioDefault.habilitado_lunes && !usuario.horario)"> - </span>
                                        </td>
                                        <td class="text-center">
                                            <span v-if="usuario.horario && usuario.horario.habilitado_martes">
                                                {{usuario.horario.hora_inicio_martes}} <br>
                                                {{usuario.horario.hora_fin_martes}}
                                            </span>
                                            <span v-if="horarioDefault && horarioDefault.habilitado_martes && !usuario.horario">
                                                {{horarioDefault.hora_inicio_martes}} <br>
                                                {{horarioDefault.hora_fin_martes}}
                                            </span>
                                            <span v-if="(usuario.horario && !usuario.horario.habilitado_martes) || (horarioDefault && !horarioDefault.habilitado_martes && !usuario.horario)"> - </span>
                                        </td>
                                        <td class="text-center">
                                            <span v-if="usuario.horario && usuario.horario.habilitado_miercoles">
                                                {{usuario.horario.hora_inicio_miercoles}} <br>
                                                {{usuario.horario.hora_fin_miercoles}}
                                            </span>
                                            <span v-if="horarioDefault && horarioDefault.habilitado_miercoles && !usuario.horario">
                                                {{horarioDefault.hora_inicio_miercoles}} <br>
                                                {{horarioDefault.hora_fin_miercoles}}
                                            </span>
                                            <span v-if="(usuario.horario && !usuario.horario.habilitado_miercoles) || (horarioDefault && !horarioDefault.habilitado_miercoles && !usuario.horario)"> - </span>
                                        </td>
                                        <td class="text-center">
                                            <span v-if="usuario.horario && usuario.horario.habilitado_jueves">
                                                {{usuario.horario.hora_inicio_jueves}} <br>
                                                {{usuario.horario.hora_fin_jueves}}
                                            </span>
                                            <span v-if="horarioDefault && horarioDefault.habilitado_jueves && !usuario.horario">
                                                {{horarioDefault.hora_inicio_jueves}} <br>
                                                {{horarioDefault.hora_fin_jueves}}
                                            </span>
                                            <span v-if="(usuario.horario && !usuario.horario.habilitado_jueves) || (horarioDefault && !horarioDefault.habilitado_jueves && !usuario.horario)"> - </span>
                                        </td>
                                        <td class="text-center">
                                            <span v-if="usuario.horario && usuario.horario.habilitado_viernes">
                                                {{usuario.horario.hora_inicio_viernes}} <br>
                                                {{usuario.horario.hora_fin_viernes}}
                                            </span>
                                            <span v-if="horarioDefault && horarioDefault.habilitado_viernes && !usuario.horario">
                                                {{horarioDefault.hora_inicio_viernes}} <br>
                                                {{horarioDefault.hora_fin_viernes}}
                                            </span>
                                            <span v-if="(usuario.horario && !usuario.horario.habilitado_viernes) || (horarioDefault && !horarioDefault.habilitado_viernes && !usuario.horario)"> - </span>
                                        </td>
                                        <td class="text-center">
                                            <span v-if="usuario.horario && usuario.horario.habilitado_sabado">
                                                {{usuario.horario.hora_inicio_sabado}} <br>
                                                {{usuario.horario.hora_fin_sabado}}
                                            </span>
                                            <span v-if="horarioDefault && horarioDefault.habilitado_sabado && !usuario.horario">
                                                {{horarioDefault.hora_inicio_sabado}} <br>
                                                {{horarioDefault.hora_fin_sabado}}
                                            </span>
                                            <span v-if="(usuario.horario && !usuario.horario.habilitado_sabado) || (horarioDefault && !horarioDefault.habilitado_sabado && !usuario.horario)"> - </span>
                                        </td>
                                        <td class="text-center">
                                            <span v-if="usuario.horario && usuario.horario.habilitado_domingo">
                                                {{usuario.horario.hora_inicio_domingo}} <br>
                                                {{usuario.horario.hora_fin_domingo}}
                                            </span>
                                            <span v-if="horarioDefault && horarioDefault.habilitado_domingo && !usuario.horario">
                                                {{horarioDefault.hora_inicio_domingo}} <br>
                                                {{horarioDefault.hora_fin_domingo}}
                                            </span>
                                            <span v-if="(usuario.horario && !usuario.horario.habilitado_domingo) || (horarioDefault && !horarioDefault.habilitado_domingo && !usuario.horario)"> - </span>
                                        </td>
                                    </tr>
                                </template>
                                <template v-if="!usuariosVisibles">
                                    <tr>
                                        <td class="text-center" colspan="6"><strong>No posee usuarios registrados</strong></td>
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
import { library } from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

import usuarioService from '../Services/usuarioService'
import horarioService from '../Services/horarioService'
import feriadoService from '../Services/feriadoService'
import rangoService from '../Services/rangoService'
import VueToastr from "vue-toastr";
import swal from "sweetalert2";

const UsuarioService = new usuarioService();
const HorarioService = new horarioService();
const FeriadoService = new feriadoService();
const RangoService = new rangoService();

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
            fechaPlanilla:"",
            operRango: 0,
            usuarios: [],
            usuariosVisibles:[],
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
                hora_inicio_domingo: '',
                hora_fin_domingo: '',
                habilitado_lunes: false,
                habilitado_martes: false,
                habilitado_miercoles: false,
                habilitado_jueves: false,
                habilitado_viernes: false,
                habilitado_sabado: false,
                habilitado_domingo: false,
                valor_x_hora: 0,
                valor_plus: 0,
                sistema: 1,
                is_default: false
            },
            usuario:{
                id: 0,
                correo_google: '',
                nombre_completo: '',
                usuario: '',
                password: '',
                activo: 0,
                rol_id: 0,
                horario: {
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
                    hora_inicio_damingo: '',
                    hora_fin_damingo: '',
                    habilitado_lunes: false,
                    habilitado_martes: false,
                    habilitado_miercoles: false,
                    habilitado_jueves: false,
                    habilitado_viernes: false,
                    habilitado_sabado: false,
                    habilitado_domingo: false,
                    valor_x_hora: 0,
                    valor_plus: 0,
                    sistema: 1,
                    is_default: false
                }
            },
            roles: '',
            horarioDefault:{},
            feriados: [],
            horario: this.Horario,
            messages: [],
            usuarioTmp:{},
            feriado:{},
            Feriado: {
                id:0,
                fecha:'dd/mm/aaaa'
            },
            rangos: [],
            rango:{},
            Rango: {
                id:0,
                nombre:'',
                valor:0.00
            },
        }
    },
    mounted(){
        try {
            //this.usuario = new Usuario();
            this.usuario.usuario = '';
            this.usuario.password = '';
            this.usuario.nombre_completo = '';
            this.usuario.activo = 1;
            this.usuario.rol_id = 0;
            this.messages = [];
            this.horario = this.Horario;
            this.horarioDefault = this.horario;
            this.horarioDefault.hora_inicio = '';
            this.horarioDefault.hora_fin = '';
            this.getAllUsuarios();
            this.getAllFeriados();
            this.getAllRangos();

        } catch (error) {
            console.log('error----------->', error)
        }
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
            this.getVisibleHorarioUsers()  
            this.$bvModal.show("modal-reporte");
        },
        async getVisibleHorarioUsers() {
            let data = await UsuarioService.getVisibleHorarioUsers()
            if(data){
                this.usuariosVisibles = data.usuarios;
                /*let dt = await HorarioService.getDefault()
                console.log('horario service', dt)
                if(dt){
                    this.horarioDefault = dt.horario;
                    console.log('horario', this.horarioDefault)
                }*/
            }
        },
        formatPrice(value) {
            return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        },
        async getAllRangos() {
            let data = await RangoService.getAll()
            if (data){
                this.rangos = data.data;
            }
        },
         newRango() {
            this.operRango = 1 
            this.$bvModal.show('modal-rango')
        },
        async deleteRango(index) {
            let rango = this.rangos[index];
            let confirm = false
            await swal({
                title: '¿Desea eliminar este registro?',
                text: 'Se perderán los cambios guardados',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No',
              }).then((result) => {
                  if (result.value == true)
                    confirm = true
            });
            if (confirm == true) {
                let response = await RangoService.delete(rango)
                if(response.data.success){
                    this.rangos.splice(index, 1);
                    this.$refs.toastr.s('Rango eliminado con éxito!');
                    //this.getAllRangos()
                }
            } 
        },
        editRango(index) {
            this.operRango = 2
            this.rango = this.rangos[index];
            console.log('rango          index', this.rango)
            this.$bvModal.show('modal-rango')     
        },
        async saveRango() {
            let reqData = this.rango;
            reqData = { ...reqData };
            try{
                let response = null
                if (this.operRango == 1) //Agregar
                    response = await RangoService.store(reqData)
                if (this.operRango == 2) //Actualizar
                    response = await RangoService.update(reqData)
                if (response.data.success === true) {
                    this.operRango = 0
                    this.$refs.toastr.s('¡Rango creado con éxito!');
                    this.$bvModal.hide('modal-rango')
                    this.rango = this.Rango
                    this.getAllRangos();
                }
                else {
                    this.$refs.toastr.e('¡Error al procesar Rango!');
                }
            } catch (error) {
                if (typeof error.response != "undefined") {
                    if (typeof error.response.data.errors != "undefined") {
                        if (typeof error.response.data.errors.nombre != "undefined") {
                            this.$refs.toastr.e("ERROR: " + error.response.data.errors.nombre[0]);
                            return;
                        } 
                        if (typeof error.response.data.errors.valor != "undefined") {
                            this.$refs.toastr.e("ERROR: " + error.response.data.errors.valor[0]);
                            return;
                        }  
                        this.$refs.toastr.e("ERROR: " + error.response.data.errors);
                        return;   
                    }   
                }
                console.log(error);
                this.$refs.toastr.e(error);
            }      
        },
        async saveFeriado() {
            let reqData = this.feriado;
            reqData = { ...reqData };
            try{
                let response = await FeriadoService.store(reqData)
                if (response.success === true) {
                    this.$refs.toastr.s('¡Feriado creado con éxito!');
                    this.$bvModal.hide('modal-feriado')
                    this.feriado = this.Feriado
                    this.getAllFeriados();
                }
                else {
                    this.$refs.toastr.e('¡Error al crear feriado!');
                }
            } catch (error) {
                if (typeof error.response != "undefined") {
                    if (typeof error.response.data.errors != "undefined") {
                        if (typeof error.response.data.errors.fecha != "undefined") {
                            this.$refs.toastr.e("ERROR: " + error.response.data.errors.fecha[0]);
                            return;
                        }   
                        this.$refs.toastr.e("ERROR: " + error.response.data.errors);
                        return; 
                    }
                }
                console.log("Error: ", error);
                this.$refs.toastr.e(error);
            }      
        },
        async save() {
            this.messages = [];
            let reqData = this.usuario.horario;
            reqData.user_id = this.usuario.id;
            let response = await HorarioService.updateUser(reqData)
            console.log(response)
            if (response.success == 1) {
                this.usuario.horario.is_default = false;
                this.$refs.toastr.s('¡Horario modificado con éxito!');
                this.$bvModal.hide('modal-horario')
            }
            else{
                this.$refs.toastr.e('¡Error al modificar el horario!');
            }
        },
        setHorario(horario) {
            this.horario = horario;
        },
        async saveDefault() {
            this.messages = [];
            let reqData = { is_default: 1, ...this.horarioDefault };
            console.log(' reqdata!',reqData)
            let response = await HorarioService.updateDefault(reqData)
            if (response.success === true) {
                this.$refs.toastr.s('¡Horario modificado con éxito!');
                this.$bvModal.hide('modal-horario-default')
                this.getAllUsuarios();
                this.getAllFeriados();
                // this.inputHorarioChange.emit(this.inputHorario);
                //_$('#modal-horario-default').modal('hide');
            }
            else if (response.success === false){
                // this.messages.push({type: 'danger', message: '¡Error al modificar el horario!'});
                this.$refs.toastr.e('¡Error al modificar el horario!');
            }
        },
        async getAllUsuarios() {
            let data = await UsuarioService.getAll()
            if(data){
                this.usuarios = data.usuarios;
                console.log('data', data.usuarios)
                let dt = await HorarioService.getDefault()
                console.log('horario service', dt)
                if(dt){
                    this.horarioDefault = dt.horario;
                    console.log('horario', this.horarioDefault)
                }
            }
        },
        async getAllFeriados() {
            let data = await FeriadoService.getAll()

            if (data){
                let feriados = data.feriados.sort(function (a, b) {
                    if (a.fecha < b.fecha)
                        return -1;
                    if (a.fecha > b.fecha)
                        return 1;
                    return 0;
                });
                this.feriados = feriados;
            }
        },
        edit(index) {
            let usuario = this.usuarios[index];
            console.log('usuario          index', usuario)
            if (usuario.horario == null) {
                usuario.horario = this.horario;
                usuario.horario.hora_inicio_lunes = this.horarioDefault.hora_inicio_lunes;
                usuario.horario.hora_fin_lunes = this.horarioDefault.hora_fin_lunes;
                usuario.horario.hora_inicio_martes = this.horarioDefault.hora_inicio_martes;
                usuario.horario.hora_fin_martes = this.horarioDefault.hora_fin_martes;
                usuario.horario.hora_inicio_miercoles = this.horarioDefault.hora_inicio_miercoles;
                usuario.horario.hora_fin_miercoles = this.horarioDefault.hora_fin_miercoles;
                usuario.horario.hora_inicio_jueves = this.horarioDefault.hora_inicio_jueves;
                usuario.horario.hora_fin_jueves = this.horarioDefault.hora_fin_jueves;
                usuario.horario.hora_inicio_viernes = this.horarioDefault.hora_inicio_viernes;
                usuario.horario.hora_fin_viernes = this.horarioDefault.hora_fin_viernes;
                usuario.horario.hora_inicio_sabado = this.horarioDefault.hora_inicio_sabado;
                usuario.horario.hora_fin_sabado = this.horarioDefault.hora_fin_sabado;
                usuario.horario.hora_inicio_domingo = this.horarioDefault.hora_inicio_domingo;
                usuario.horario.hora_fin_domingo = this.horarioDefault.hora_fin_domingo;
                usuario.horario.habilitado_lunes = this.horarioDefault.habilitado_lunes;
                usuario.horario.habilitado_martes = this.horarioDefault.habilitado_martes;
                usuario.horario.habilitado_miercoles = this.horarioDefault.habilitado_miercoles;
                usuario.horario.habilitado_jueves = this.horarioDefault.habilitado_jueves;
                usuario.horario.habilitado_viernes = this.horarioDefault.habilitado_viernes;
                usuario.horario.habilitado_sabado = this.horarioDefault.habilitado_sabado;
                usuario.horario.habilitado_domingo = this.horarioDefault.habilitado_domingo;
                usuario.horario.valor_x_hora = this.horarioDefault.valor_x_hora;
                usuario.horario.valor_plus = this.horarioDefault.valor_plus;
                usuario.horario.sistema = this.horarioDefault.sistema;
                usuario.horario.is_default = this.horarioDefault.is_default;
            }
            else
            {
              if (usuario.horario.habilitado_domingo == null)
                usuario.horario.habilitado_domingo = this.horarioDefault.habilitado_domingo;
              if (usuario.horario.hora_inicio_domingo == null)
                usuario.horario.hora_inicio_domingo = this.horarioDefault.hora_inicio_domingo;
              if (usuario.horario.hora_fin_domingo == null)
                usuario.horario.hora_fin_domingo = this.horarioDefault.hora_fin_domingo;
              if (usuario.horario.valor_x_hora == null)
                usuario.horario.valor_x_hora = this.horarioDefault.valor_x_hora;
              if (usuario.horario.valor_plus == null)
                usuario.horario.valor_plus = this.horarioDefault.valor_plus;
              if (usuario.horario.sistema == null)
                usuario.horario.sistema = this.horarioDefault.sistema;
            }
            //this.usuarioTmp = usuario
            this.usuario = usuario
            console.log('usuario.horario', this.usuarioTmp)
            //this.horarioFormComponent.setUsuario(usuario);
            this.$bvModal.show('modal-horario')
        },

        editDefault() {
            // this.horarioDefaultFormComponent.setHorario(this.horarioDefault);
            this.$bvModal.show('modal-horario-default')
            //form-usuario
            // _$('#modal-horario-default').modal('show');
        },

        newFeriado() {
            //var feriadoDump = new Feriado();
            this.feriado = this.Feriado
            this.$bvModal.show('modal-feriado')
        },

        async deleteFeriado(index) {
            let feriado = this.feriados[index];
            let confirm = false
            await swal({
                title: '¿Desea eliminar este registro?',
                text: 'Se perderán los cambios guardados',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No',
              }).then((result) => {
                  if (result.value == true)
                     confirm = true
            });
            if (confirm == true) {
                let data = await FeriadoService.delete(feriado)
                if(data){
                    this.feriados.splice(index, 1);
                    this.$refs.toastr.s('Feriado eliminado con éxito!');
                    //this.getAllFeriados()
                }
            }    
        },
        del(index) {

        }
    }
}

</script>

<style>

</style>
