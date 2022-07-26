<template>
  <div id="app-taller" class="page-contents">
    <vue-toastr ref="toastr"></vue-toastr>
    <notification></notification>
    <div>
      <div>
        <div
          class="row"
          style="margin-bottom: 10px; max-width: 100vw !important"
        >
          <div class="col-xs-4" style="display: flex">
            <div style="margin: auto; display: flex; width: 100%">
              <div style="margin: auto; margin-right: 10px">
                <b>Proyecto</b>
              </div>
              <select
                style="min-width: 100px; margin-right: 10px"
                ref="cliente"
                id="cliente"
                :disabled="loadingPage"
                class="form-control"
                name="cliente"
                v-model="proyectoSelected"
                @change="onChangeProyecto($event)"
              >
                <option value="0">Seleccione un cliente</option>
                <template v-for="cliente in clientes">
                  <template v-for="proyecto in cliente.proyectos">
                    <option
                      v-if="
                        cliente.has_projects_active &&
                        (proyecto.activo == 1 || proyecto.activo == null)
                      "
                      :value="proyecto.id"
                      :key="proyecto.id"
                    >
                      {{ cliente.nombre_completo }} -
                      {{ proyecto.proyecto }}
                    </option>
                  </template>
                </template>
              </select>
              <button
                class="btn btn-sm btn-primary"
                style="min-width: 50px"
                @click="viewGallery()"
                :disabled="!images_project || loadingPage"
              >
                <b-icon icon="image"></b-icon>
              </button>
            </div>
          </div>

          <div
            class="col-xs-5 contenedor-finalizar-proyecto"
            style="display: flex"
          >
            <div style="margin: auto; display: flex">
              <div style="margin: auto; margin-right: 10px; margin-left: 10px">
                <button
                class="btn btn-info"
                 v-if="this.redirectoken"
                 @click="redirectlink()" >
                  Abrir en Diseño
                </button>
              </div>

              <button
                class="btn btn-success"
                style="margin-right: 10px"
                :disabled="loadingPage || reportes.length == 0"
                @click="finalizarProyectoSwal()"
                v-if="!proyectoInfo.finalizado"
              >
                Finalizar Proyecto
              </button>

              <!-- pendiente verificar -->
              <template v-if="userRol === 'Administrador'">
                <button
                  class="btn btn-success"
                  :disabled="loadingPage"
                  @click="reabrirProyecto()"
                  v-if="proyectoInfo.finalizado"
                >
                  Reabrir Proyecto
                </button>
              </template>
            </div>
          </div>
          <div class="col-xs-3">
            <div for="cnc-conectado" style="display: flex">
              <div style="margin: auto; margin-right: 10px">
                <b>CNC</b>
              </div>
              <div style="margin: auto; width: 70%">
                <select
                  class="form-control"
                  id="cnc-conectado"
                  v-model="connectedCNC"
                  :disabled="loadingPage"
                >
                  <option value="-1">-- No Conectado --</option>
                  <option value="1">CNC 1</option>
                  <option value="2">CNC 2</option>
                  <option value="3">CNC 3</option>
                  <option value="4">CNC 4</option>
                  <option value="5">CNC 5</option>
                  <option value="6">CNC 6</option>
                  <option value="7">CNC 7</option>
                  <option value="8">CNC 8</option>
                  <option value="9">CNC 9</option>
                  <option value="10">CNC 10</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <span v-if="test">{{proyectoInfo}}</span>
        <div>
          <hr style="margin: 0; border-color: black; margin-bottom: 10px" />
        </div>

        <b-overlay :show="loadingPage" opacity="0.6" spinner-variant="primary">
          <b-tabs v-model="step" content-class="taller-tab">
            <b-tab title="General" active>
              <div class="table-responsive">
                <table
                  class="table table-hover table-bordered one-column text-left"
                  style="border: none"
                >
                  <tbody>
                    <tr>
                      <th>Nombre</th>
                      <td>{{ clienteInfo.nombre_completo }}</td>
                      <th>Proyecto</th>
                      <td>{{ proyectoInfo.proyecto }}</td>
                    </tr>
                    <tr>
                      <th>Exportado por</th>
                      <td>{{ exportedBy }}</td>
                      <th>Nota Instalación
                        <button type="button" class="btn btn-sm btn-danger"
                            @click="openNota()">
                            <b-icon  icon="clipboard" font-scale="1" class="white"></b-icon>
                        </button>
                      </th>
                      <td>
                        <button
                          v-if="forzarControl==0"
                          style="margin-right: 10px"
                          class="btn btn-danger float-right"
                          @click="setForzarControl()"
                        >
                          Forzar Control
                        </button>
                        <button
                          v-if="forzarControl==1"
                          style="margin-right: 10px"
                          class="btn btn-danger float-right"
                          @click="setForzarControl()"
                        >
                          Deshacer Forzar Control
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <th>Encargado de proyecto</th>
                      <td style="min-height: 50px">
                        {{
                          proyectoInfo
                            ? proyectoInfo.responsible
                              ? proyectoInfo.responsible.usuario
                                ? proyectoInfo.responsible.usuario
                                    .nombre_completo
                                : ""
                              : ""
                            : ""
                        }}
                        <span v-if="!haveResponsible"
                          ><button
                            @click="GoResponsible()"
                            class="btn btn-sm btn-warning float-right"
                          >
                            <b-icon
                              font-scale="0.8"
                              class="white"
                              icon="pencil-fill"
                            ></b-icon></button
                        ></span>
                        <span v-if="userRol === 'Administrador'"
                          ><button
                            v-if="haveResponsible"
                            @click="
                              deleteResponsible(
                                proyectoInfo ? proyectoInfo.id.id : 0
                              )
                            "
                            type="button"
                            class="btn btn-sm btn-danger float-right"
                          >
                            <b-icon font-scale="0.8" icon="x"></b-icon></button
                        ></span>
                      </td>
                      <th v-if="userRol === 'Administrador'">Total</th>
                      <td v-if="userRol === 'Administrador'">
                        <div
                          style="
                            display: flex;
                            padding-left: 3px;
                            padding-right: 0px;
                          "
                        >
                          <span style="flex: 1">{{
                            cajaInfo.total > 0
                              ? cajaInfo.total
                              : proyectoInfo.valor_total
                          }}</span>
                          <button
                            @click="openCajaDetails()"
                            v-if="cajaInfo.total > 0"
                            type="button"
                            class="btn btn-sm btn-success float-right"
                          >
                            <b-icon
                              font-scale="0.8"
                              icon="info-circle-fill"
                              class="white"
                            ></b-icon>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>Dirección</th>
                      <td style="min-height: 50px">
                        <!-- v-if="editInfo.direccion; else elseEditDireccion"> -->
                        <div class="row no-padding" v-if="editInfo.direccion">
                          <div class="col-sm-10 no-padding">
                            <input
                              v-model="newInfo.direccion.value"
                              type="text"
                              class="form-control"
                              style="height: 27px"
                            />
                          </div>
                          <div
                            class="col-sm-2"
                            style="padding-left: 3px; padding-right: 0px"
                          >
                            <button
                              @click="onOkEditInfo('direccion')"
                              type="button"
                              class="btn btn-sm btn-success"
                            >
                              <b-icon
                                font-scale="0.8"
                                icon="check"
                                class="white"
                              ></b-icon>
                            </button>
                            <button
                              @click="onCancelEditInfo('direccion')"
                              type="button"
                              class="btn btn-sm btn-danger"
                            >
                              <b-icon
                                font-scale="0.8"
                                icon="x"
                                class="white"
                              ></b-icon>
                            </button>
                          </div>
                        </div>
                        <template
                          v-else-if="!editInfo.direccion"
                          id="elseEditDireccion"
                          >{{ clienteInfo.direccion }}</template
                        >
                        <span v-if="userRol === 'Administrador'">
                          <button
                            v-if="clienteInfo.direccion && !editInfo.direccion"
                            @click="onEditInfo('direccion')"
                            class="btn btn-warning btn-sm float-right"
                          >
                            <b-icon
                              font-scale="0.8"
                              icon="pencil-fill"
                              class="white"
                            ></b-icon>
                          </button>
                        </span>
                      </td>
                      <th v-if="cajaInfo.saldo">Saldo Pendiente</th>
                      <td v-if="cajaInfo.saldo">
                        <div class="row no-padding" v-if="editInfo.saldo">
                          <div class="col-sm-10 no-padding">
                            <input
                              v-model="newInfo.saldo.value"
                              type="text"
                              class="form-control"
                              style="height: 27px"
                            />
                          </div>
                          <div
                            class="col-sm-2"
                            style="padding-left: 3px; padding-right: 0px"
                          >
                            <button
                              @click="onOkEditInfo('saldo')"
                              type="button"
                              class="btn btn-sm btn-success"
                            >
                              <b-icon
                                font-scale="0.8"
                                icon="check"
                                class="white"
                              ></b-icon>
                            </button>
                            <button
                              @click="onCancelEditInfo('saldo')"
                              type="button"
                              class="btn btn-sm btn-danger glyphicon glyphicon-remove"
                            >
                              <b-icon
                                font-scale="0.8"
                                icon="x"
                                class="white"
                              ></b-icon>
                            </button>
                          </div>
                        </div>
                        <template
                          v-else-if="!editInfo.saldo"
                          id="elseEditValor"
                          >{{ cajaInfo.saldo }}</template
                        >
                        <span v-if="userRol === 'Administrador'">
                          <button
                            v-if="cajaInfo.saldo && !editInfo.saldo"
                            @click="onEditInfo('saldo')"
                            class="btn btn-sm btn-warning float-right"
                          >
                            <b-icon
                              font-scale="0.8"
                              icon="pencil-fill"
                              class="white"
                            ></b-icon>
                          </button>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>Teléfono</th>
                      <td style="min-height: 50px">
                        <!-- v-if="editInfo.telefono ? editInfo.telefono : elseEditTelefono"> -->
                        <div class="row no-padding" v-if="editInfo.telefono">
                          <div class="col-sm-10 no-padding">
                            <input
                              v-model="newInfo.telefono.value"
                              type="text"
                              class="form-control"
                              style="height: 27px"
                            />
                          </div>
                          <div
                            class="col-sm-2"
                            style="padding-left: 3px; padding-right: 0px"
                          >
                            <button
                              @click="onOkEditInfo('telefono')"
                              type="button"
                              class="btn btn-sm btn-success"
                            >
                              <b-icon
                                font-scale="0.8"
                                icon="check"
                                class="white"
                              ></b-icon>
                            </button>
                            <button
                              @click="onCancelEditInfo('telefono')"
                              type="button"
                              class="btn btn-sm btn-danger"
                            >
                              <b-icon
                                font-scale="0.8"
                                icon="x"
                                class="white"
                              ></b-icon>
                            </button>
                          </div>
                        </div>
                        <template
                          v-else-if="!editInfo.telefono"
                          id="elseEditTelefono"
                          >{{
                            clienteInfo ? clienteInfo.telefono : ""
                          }}</template
                        >
                        <button
                          v-if="clienteInfo.telefono && !editInfo.telefono"
                          @click="onEditInfo('telefono')"
                          class="btn btn-sm btn-warning float-right"
                        >
                          <b-icon
                            font-scale="0.8"
                            icon="pencil-fill"
                            class="white"
                          ></b-icon>
                        </button>
                      </td>

                      <th v-if="userRol === 'Administrador'">Seña</th>
                      <td v-if="userRol === 'Administrador'">
                        <!-- v-if="editInfo.senia ? editInfo.senia : elseEditSenia"> -->
                        <div class="col-sm-12 no-padding" v-if="editInfo.senia">
                          <div class="col-sm-10 no-padding">
                            <input
                              v-model="newInfo.senia.value"
                              type="text"
                              class="form-control"
                              style="height: 27px"
                            />
                          </div>
                          <div
                            class="col-sm-2"
                            style="padding-left: 3px; padding-right: 0px"
                          >
                            <button
                              @click="onOkEditInfo('senia')"
                              type="button"
                              class="btn btn-sm btn-success"
                            >
                              <b-icon
                                font-scale="0.8"
                                icon="check"
                                class="white"
                              ></b-icon>
                            </button>
                            <button
                              @click="onCancelEditInfo('senia')"
                              type="button"
                              class="btn btn-sm btn-danger"
                            >
                              <b-icon
                                font-scale="0.8"
                                icon="x"
                                class="white"
                              ></b-icon>
                            </button>
                          </div>
                        </div>
                        <template
                          v-else-if="!editInfo.senia"
                          id="elseEditSenia"
                          >{{
                            proyectoInfo ? proyectoInfo.senia : ""
                          }}</template
                        >
                        <span v-if="userRol == 'Administrador'">
                          <button
                            v-if="proyectoInfo.senia && !editInfo.senia"
                            @click="onEditInfo('senia')"
                            class="btn btn-sm btn-warning float-right"
                          >
                            <b-icon
                              font-scale="0.8"
                              icon="pencil-fill"
                              class="white"
                            ></b-icon>
                          </button>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>Comentario General</th>
                      <td style="min-height: 50px">
                        <div
                          class="row no-padding"
                          v-if="editInfo.instalacion_comentario"
                        >
                          <div class="col-sm-10 no-padding">
                            <input
                              v-model="newInfo.instalacion_comentario.value"
                              type="text"
                              class="form-control"
                              style="height: 27px"
                            />
                          </div>
                          <div
                            class="col-sm-2"
                            style="padding-left: 3px; padding-right: 0px"
                          >
                            <button
                              @click="onOkEditInfo('instalacion_comentario')"
                              type="button"
                              class="btn btn-sm btn-success"
                            >
                              <b-icon
                                font-scale="0.8"
                                icon="check"
                                class="white"
                              ></b-icon>
                            </button>
                            <button
                              @click="
                                onCancelEditInfo('instalacion_comentario')
                              "
                              type="button"
                              class="btn btn-sm btn-danger"
                            >
                              <b-icon
                                font-scale="0.8"
                                icon="x"
                                class="white"
                              ></b-icon>
                            </button>
                          </div>
                        </div>
                        <template
                          v-else-if="!editInfo.instalacion_comentario"
                          id="elseEditComentario"
                          >{{
                            proyectoInfo
                              ? proyectoInfo.instalacion_comentario
                              : ""
                          }}
                        </template>
                        <span v-if="userRol === 'Administrador'"
                          ><button
                            v-if="
                              (proyectoInfo
                                ? proyectoInfo.instalacion_comentario
                                : false) && !editInfo.instalacion_comentario
                            "
                            @click="onEditInfo('instalacion_comentario')"
                            class="btn btn-sm btn-warning float-right"
                          >
                            <b-icon
                              font-scale="0.8"
                              icon="pencil-fill"
                              class="white"
                            ></b-icon></button
                        ></span>
                      </td>
                      <th>Cantidad de Módulos</th>
                      <td>
                        {{ proyectoInfo ? proyectoInfo.modulos.length : 0 }}
                      </td>
                    </tr>
                    <tr>
                      <th>Comentario adicional</th>
                      <td style="min-height: 50px">
                        <div class="row" v-if="editInfo.comentario_adicional">
                          <div class="col-sm-10">
                            <textarea
                              class="form-control"
                              v-model="newInfo.comentario_adicional.value"
                            ></textarea>
                          </div>
                          <div class="col-sm-2">
                            <button
                              @click="onOkEditInfo('comentario_adicional')"
                              type="button"
                              class="btn btn-sm btn-success"
                            >
                              <b-icon
                                font-scale="0.8"
                                icon="check"
                                class="white"
                              ></b-icon>
                            </button>
                            <button
                              @click="onCancelEditInfo('comentario_adicional')"
                              type="button"
                              class="btn btn-sm btn-danger"
                            >
                              <b-icon
                                font-scale="0.8"
                                icon="x"
                                class="white"
                              ></b-icon>
                            </button>
                          </div>
                        </div>

                        <template
                          v-else-if="!editInfo.comentario_adicional"
                          id="elseEditComentarioAdicional"
                        >
                          {{
                            proyectoInfo
                              ? proyectoInfo.comentario_adicional
                              : ""
                          }}</template
                        >
                        <span
                          ><button
                            v-if="!editInfo.comentario_adicional"
                            @click="onEditInfo('comentario_adicional')"
                            class="btn btn-sm btn-warning float-right"
                          >
                            <b-icon
                              font-scale="0.8"
                              icon="pencil-fill"
                              class="white"
                            ></b-icon></button
                        ></span>
                      </td>
                      <th>Cantidad de cajones</th>
                      <td>{{ getModulosCajones().length }}</td>
                    </tr>
                    <tr>
                      <td colspan="2">
                      <div class="form-group row">
                        <div class="col-md-12" align="left">
                          <b>Medición</b>
                          <button v-if="!oper_med" type="button" title ="Agregar" class="btn btn-sm ml-btn-sm btn-success" v-on:click="operMedicion(1)">
                          +</button>
                        </div>
                      </div>
                      <div class="form-group row" v-if="oper_med">
                        <label class="col-md-2 control-label" for="fecha_medinst">Fecha</label>
                        <div class="col-md-4">
                              <span><input style="width: 130px" v-model="medicion.fecha_medinst" name="fecha_medinst" title="Click en el día del Calendario" readonly v-on:click="showCalendar(0)">
                              &#128197;</span>
                        </div>
                        <label class="col-md-2 control-label" for="hora_medinst">Hora</label>
                        <div class="col-md-4">
                            <datetime style="width: 100px" v-model="medicion.hora_medinst" :phrases="{ok: 'Seleccionar', cancel: 'Cancelar'}"
                              class="datetime-picker" type="time" title="Hora de medición" format="HH:mm"
                              value-zone="America/Buenos_Aires">
                            </datetime>
                        </div>
                      </div>
                      <div class="form-group row" v-if="oper_med">
                          <label class="col-md-2 control-label" for="comentario">Comentario</label>
                          <div class="col-md-8">
                            <textarea rows="1" maxlength="150" v-model="medicion.comentario" name="comentario" placeholder="" class="form-control form-control-sm"></textarea>
                          </div>
                          <div class="col-md-2">
                            <button v-if="oper_med === 1" type="button" title ="Guardar" class="btn btn-sm ml-btn-sm btn-primary" v-on:click="addFechaMedicion()">
                            <font-awesome-icon icon="check"></font-awesome-icon></button>
                            <button v-if="oper_med === 2" type="button" title ="Guardar" class="btn btn-sm ml-btn-sm btn-primary" v-on:click="updateFechaMedicion()">
                            <font-awesome-icon icon="check"></font-awesome-icon></button>
                            <button type="button" title ="Cancelar" class="btn btn-sm ml-btn-sm btn-danger" v-on:click="operMedicion(0)">
                            <b>X</b></button>
                          </div>
                      </div>
                      <table class="table">
                        <tbody>
                          <template v-if="mediciones.length > 0">
                            <tr v-for="(med, i) in mediciones" :key="i">
                              <td align="left" style="font-size: 14px">
                              <div class="row">
                                <div class="col-md-3" style="height:20px">{{ i + 1 }} Fecha</div>
                                <div class="col-md-3" style="height:20px;border: gray 1px solid;">{{ $moment(med.fecha_medinst).format("DD-MM-YYYY") }}</div>
                                <div class="col-md-3" style="height:20px">Hora</div>
                                <div class="col-md-3" style="height:20px;border: gray 1px solid;">{{ $moment(med.fecha_medinst).format("h:mm") }}</div>
                              </div>
                              <div class="row" style="margin-top: 5px;">
                                <div class="col-md-3" style="height:20px">Comentario</div>
                                <div class="col-md-9" style="border: gray 1px solid;">{{ med.comentario }}</div>
                              </div>
                              </td>
                              <td>
                                <button class="btn btn-sm ml-btn-sm btn-warning"
                                  @click="editFechaMedicion(med)"
                                >
                                  <b-icon font-scale="0.8" class="white" icon="pencil-fill"></b-icon>
                                </button>
                                <button class="btn btn-sm ml-btn-sm btn-danger"
                                  @click="deleteFechaMedInst(med.id,$event)"
                                >
                                  <font-awesome-icon icon="trash"></font-awesome-icon>
                                </button>
                              </td>
                            </tr>
                          </template>
                        </tbody>
                      </table>
                      </td>
                      <td  colspan="2">
                       <div class="form-group row">
                          <div class="col-md-12" align="left">
                            <b>Instalación</b>
                            <button v-if="!oper_inst" type="button" title ="Agregar" class="btn btn-sm ml-btn-sm btn-success" v-on:click="operInstalacion(1)">
                            +</button>
                          </div>
                       </div>
                       <template v-if="!instalaciones.length">
                        <template v-if="!editInfo.instalacion_fecha && !oper_inst" id="elseEditFecha">
                          <br>Fecha &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                            proyectoInfo ? proyectoInfo.instalacion_fecha : ""}}
                        </template>
                      </template>
                      <div class="form-group row" v-if="oper_inst">
                        <label class="col-md-2 control-label" for="fecha_medinst">Fecha</label>
                        <div class="col-md-4">
                              <span><input style="width: 130px" v-model="instalacion.fecha_medinst" name="fecha_medinst"  title="Click en el día del Calendario" readonly v-on:click="showCalendar(1)">
                              &#128197;</span>
                        </div>
                        <label class="col-md-2 control-label" for="hora_medinst">Hora</label>
                        <div class="col-md-4">
                            <datetime style="width: 100px" v-model="instalacion.hora_medinst" :phrases="{ok: 'Seleccionar', cancel: 'Cancelar'}"
                              class="datetime-picker" type="time" title="Hora de instalación" format="HH:mm"
                              value-zone="America/Buenos_Aires">
                            </datetime>
                        </div>
                      </div>
                      <div class="form-group row" v-if="oper_inst">
                          <label class="col-md-2 control-label" for="comentario">Comentario</label>
                          <div class="col-md-8">
                            <textarea rows="1" maxlength="150" v-model="instalacion.comentario" name="comentario" placeholder="" class="form-control form-control-sm"></textarea>
                          </div>
                          <div class="col-md-2">
                            <button v-if="oper_inst === 1" type="button" title ="Guardar" class="btn btn-sm ml-btn-sm btn-primary" v-on:click="addFechaInstalacion()">
                            <font-awesome-icon icon="check"></font-awesome-icon></button>
                            <button v-if="oper_inst === 2" type="button" title ="Guardar" class="btn btn-sm ml-btn-sm btn-primary" v-on:click="updateFechaInstalacion()">
                            <font-awesome-icon icon="check"></font-awesome-icon></button>
                            <button type="button" title ="Cancelar" class="btn btn-sm ml-btn-sm btn-danger" v-on:click="operInstalacion(0)">
                            <b>X</b></button>
                          </div>
                      </div>
                      <table class="table" align="right">
                        <tbody>
                          <template v-if="instalaciones.length > 0">
                            <tr v-for="(inst, i) in instalaciones" :key="i">
                              <td align="left" style="font-size: 14px">
                              <div class="row">
                                <div class="col-md-3" style="height:20px">{{ i + 1 }} Fecha</div>
                                <div class="col-md-3" style="height:20px;border: gray 1px solid;">{{ $moment(inst.fecha_medinst).format("DD-MM-YYYY") }}</div>
                                <div class="col-md-3" style="height:20px">Hora</div>
                                <div class="col-md-3" style="height:20px;border: gray 1px solid;">{{ $moment(inst.fecha_medinst).format("h:mm") }}</div>
                              </div>
                              <div class="row" style="margin-top: 5px;">
                                <div class="col-md-3" style="height:20px">Comentario</div>
                                <div class="col-md-9" style="border: gray 1px solid;">{{ inst.comentario }}</div>
                              </div>
                              </td>
                              <td>
                                <button v-if="!oper_inst" class="btn btn-sm ml-btn-sm btn-warning"
                                  @click="editFechaInstalacion(inst)"
                                >
                                  <b-icon font-scale="0.8" class="white" icon="pencil-fill"></b-icon>
                                </button>
                                <button v-if="estadoProyecto!='Exportado'"
                                  class="btn btn-sm ml-btn-sm btn-danger"
                                  @click="deleteFechaMedInst(inst.id,$event)"
                                >
                                  <font-awesome-icon icon="trash"></font-awesome-icon>
                                </button>
                              </td>
                            </tr>
                          </template>
                        </tbody>
                      </table>
                      </td>
                    </tr>
                    <tr
                      v-if="
                        externalProjectLinks && externalProjectLinks.length > 0
                      "
                    >
                      <th>Links externos</th>
                      <td colspan="3">
                        <ul>
                          <li v-for="(link, index_link) in externalProjectLinks" :key="link">
                            <a
                              target="_blank"
                              style="cursor: pointer"
                              @click="openLink(link)"
                              ><b>{{getDescripcionLink(index_link)}}</b>: {{ link }}</a
                            >
                          </li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <th>Stock</th>
                      <td colspan="3">
                        <div class="progress">
                          <div
                            class="progress-bar"
                            :style="{
                              'background-color': colorProgreso(
                                totalEstadoOk(materialesDisenio)
                              ),
                              width: totalEstadoOk(materialesDisenio) + '%',
                              'min-width': '2em',
                            }"
                            role="progressbar"
                          >
                            {{ totalEstadoOk(materialesDisenio) }}%
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>General</th>
                      <td colspan="3">
                        <div class="progress">
                          <div
                            class="progress-bar"
                            :style="{
                              'background-color': colorProgreso(
                                getProgresoGeneral()
                              ),
                              width: getProgresoGeneral() + '%',
                              'min-width': '2em',
                            }"
                            role="progressbar"
                          >
                            {{ getProgresoGeneral() }}%
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>Cortes</th>
                      <td>
                        <div class="progress">
                          <div
                            class="progress-bar"
                            :style="{
                              'background-color': colorProgreso(
                                totalEstadoOk(piezas)
                              ),
                              width: totalEstadoOk(piezas) + '%',
                              'min-width': '2em',
                            }"
                            role="progressbar"
                          >
                            {{ totalEstadoOk(piezas) }}%
                          </div>
                        </div>
                      </td>
                      <th>Prearmados</th>
                      <td>
                        <div class="progress">
                          <div
                            class="progress-bar"
                            :style="{
                              'background-color': colorProgreso(
                                totalEstadoOk(piezas, 'prearmado_estado_id')
                              ),
                              width:
                                totalEstadoOk(piezas, 'prearmado_estado_id') +
                                '%',
                              'min-width': '2em',
                            }"
                            role="progressbar"
                          >
                            {{ totalEstadoOk(piezas, "prearmado_estado_id") }}%
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>Tapacantos</th>
                      <td>
                        <div class="progress">
                          <div
                            class="progress-bar"
                            :style="{
                              'background-color': colorProgreso(
                                (
                                  (totalEstadoOkTapacantos() / wTapacantos()) *
                                  100
                                ).toFixed(2)
                              ),
                              width:
                                (
                                  (totalEstadoOkTapacantos() / wTapacantos()) *
                                  100
                                ).toFixed(2) + '%',
                              'min-width': '2em',
                            }"
                            role="progressbar"
                          >
                            {{
                              totalEstadoOkTapacantos() === 0 &&
                              wTapacantos() === 0
                                ? 0
                                : (
                                    (totalEstadoOkTapacantos() /
                                      wTapacantos()) *
                                    100
                                  ).toFixed(2)
                            }}%
                          </div>
                        </div>
                      </td>
                      <th>Modulos</th>
                      <td>
                        <div class="progress">
                          <div
                            class="progress-bar"
                            :style="{
                              'background-color': colorProgreso(
                                totalEstadoOk(getModulosCajones('modulos'))
                              ),
                              width:
                                totalEstadoOk(getModulosCajones('modulos')) +
                                '%',
                              'min-width': '2em',
                            }"
                            role="progressbar"
                          >
                            {{ totalEstadoOk(getModulosCajones("modulos")) }}%
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>Cajones</th>
                      <td>
                        <div
                          v-if="getModulosCajones().length > 0"
                          class="progress"
                        >
                          <div
                            class="progress-bar"
                            :style="{
                              'background-color': colorProgreso(
                                totalEstadoOk(getModulosCajones('cajones'))
                              ),
                              width:
                                totalEstadoOk(getModulosCajones('cajones')) +
                                '%',
                              'min-width': '2em',
                            }"
                            role="progressbar"
                          >
                            {{ totalEstadoOk(getModulosCajones("cajones")) }}%
                          </div>
                        </div>
                        <template
                          v-else-if="getModulosCajones().length == 0"
                          id="elseCajonesGeneral"
                        >
                          <span title="No posee cajones"
                            ><strong>N/A</strong></span
                          >
                        </template>
                      </td>
                      <th>Notas de Acción</th>
                      <td>
                        <div v-if="actionNotes.length > 0" class="progress">
                          <div
                            class="progress-bar"
                            :style="{
                              'background-color': colorProgreso(
                                totalEstadoOk(actionNotes)
                              ),
                              width:
                                totalEstadoOk(actionNotes) +
                                '%',
                              'min-width': '2em',
                            }"
                            role="progressbar"
                          >
                            {{ totalEstadoOk(actionNotes) }}%
                          </div>
                        </div>
                        <template v-else>
                          <span title="No posee notas de acción"
                            ><strong>N/A</strong></span>
                        </template>
                      </td>
                    </tr>
                    <tr v-if="getProgresoGeneral() > 99 || forzarControl==1">
                      <th>Control</th>
                      <td colspan="3">
                        <div class="progress">
                          <div
                            class="progress-bar"
                            :style="{
                              'background-color': colorProgreso(
                                controlTaller
                              ),
                              width:  controlTaller + '%',
                              'min-width': '2em',
                            }"
                            role="progressbar"
                          >
                            {{ controlTaller }}%
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4">
                        <div align="left"><b>Capacidad de Producción</b></div>
                        <b-form  @submit="storeCP" autocomplete="off">
                          <div class="row">
                                <div v-if="updateIndex!==0" class="form-group col-md-2" align="center">
                                    <label for="item" class="control-label">Item</label>
                                    <b-form-input style="text-align:center" :disabled="parseInt(capacidad)==0"
                                    readonly
                                    class="form-control"
                                    id="tiempo_disenio"
                                    v-model="form2.item"
                                  />
                                </div>
                                <div v-if="updateIndex===0" class="form-group col-md-2" align="center">
                                  <label for="item" class="control-label">Item</label><br>
                                  <b-form-select
                                    :disabled="proyectoID==0"
                                    ref="item"
                                    id="item"
                                    name="item"
                                    v-model="capacidad"
                                    @change="onChangeItem(capacidad)"
                                  >
                                    <b-form-select-option value=0>Seleccione...</b-form-select-option>
                                      <template v-for="capacidad in capacidadProduccion">
                                        <b-form-select-option
                                          :value="capacidad"
                                          :key="capacidad.id"
                                        >
                                          {{ capacidad.item }}
                                        </b-form-select-option>
                                      </template>
                                  </b-form-select>
                                </div>
                                <div class="form-group col-md-2" align="center">
                                  <label for="tiempoDisenio" class="control-label">Tiempo de Diseño</label>
                                  <b-form-input style="text-align:center" :disabled="parseInt(capacidad)==0"
                                    readonly
                                    title="Haga click para seleccionar el tiempo"
                                    class="form-control"
                                    id="tiempo_disenio"
                                    v-model="form2.tiempo_disenio"
                                    @click="loadTimes(1)"
                                  />
                                </div>
                                <div class="form-group col-md-2" align="center">
                                  <label for="tiempoProduccion" class="control-label">Tiempo de Producción</label>
                                  <b-form-input style="text-align:center" :disabled="parseInt(capacidad)==0"
                                    readonly
                                    title="Haga click para seleccionar el tiempo"
                                    class="form-control"
                                    id="tiempo_produccion"
                                    v-model="form2.tiempo_produccion"
                                    @click="loadTimes(2)"
                                  />
                                </div>
                                <div class="form-group col-md-2" align="center">
                                  <label for="tiempoMedicion" class="control-label">Tiempo de Medición</label>
                                  <b-form-input style="text-align:center" :disabled="parseInt(capacidad)==0"
                                    readonly
                                    title="Haga click para seleccionar el tiempo"
                                    class="form-control"
                                    id="tiempo_medicion"
                                    v-model="form2.tiempo_medicion"
                                    @click="loadTimes(3)"
                                  />
                                </div>
                                <div class="form-group col-md-2" align="center">
                                  <label for="tiempoInstalacion" class="control-label">Tiempo de Instalación</label>
                                  <b-form-input style="text-align:center" :disabled="parseInt(capacidad)==0"
                                    readonly
                                    title="Haga click para seleccionar el tiempo"
                                    class="form-control"
                                    id="tiempo_instalacion"
                                    v-model="form2.tiempo_instalacion"
                                    @click="loadTimes(4)"
                                  />
                                </div>
                                <div class="form-group col-md-2" align="center">
                                  <label for="coeficiente" class="control-label">Coeficiente Multiplicador</label>
                                  <b-form-input style="text-align:center" :disabled="parseInt(capacidad)==0"
                                    :state="inputCoeficienteMultiplicadorValidity()"
                                    type="number"
                                    step="0.01"
                                    min=0
                                    title="Haga click para seleccionar el tiempo"
                                    class="form-control"
                                    id="coeficiente_multiplicador"
                                    v-model="form2.coeficiente_multiplicador"

                                  />
                                </div>
                          </div>
                        </b-form>
                        <div class="row">
                          <div class="col-md-12" align="center">
                            <button v-if="updateIndex" type="button" @click="updateCP()" class="btn btn-sm btn-primary">Guardar</button>
                            <button v-if="!updateIndex && capacidad && proyectoID" type="button" @click="storeCP()" class="btn btn-sm btn-primary">Agregar</button>
                            <button v-if="(capacidad || updateIndex)" type="button" @click="setearItem()" class="btn btn-sm btn-danger">Cancelar</button>
                          </div>
                        </div>
                        <br>
                        <div class="table-responsive">
                        <table class="table table-hover">
                          <thead>
                            <th style="text-align:center">#</th>
                            <th style="text-align:center">Item</th>
                            <th style="text-align:center">Tiempo Diseño</th>
                            <th style="text-align:center">Tiempo Producción</th>
                            <th style="text-align:center">Tiempo Medición</th>
                            <th style="text-align:center">Tiempo Instalación</th>
                            <th style="text-align:center">Coeficiente Multiplicador</th>
                            <th></th>
                          </thead>
                          <tbody>
                            <template v-if="capacidadProduccionProy.length > 0">
                              <tr v-for="(item, i) in capacidadProduccionProy" :key="i">
                                <td align="center">{{ i + 1 }}</td>
                                <td align="center">{{ item.item }}</td>
                                <td align="center">{{ item.tiempo_disenio }}</td>
                                <td align="center">{{ item.tiempo_produccion }}</td>
                                <td align="center">{{ item.tiempo_medicion }}</td>
                                <td align="center">{{ item.tiempo_instalacion }}</td>
                                <td align="center">{{ item.coeficiente_multiplicador }}</td>
                                <td>
                                  <button
                                    class="btn btn-sm btn-success"
                                    @click="editItem(item)"
                                  >
                                    <font-awesome-icon icon="edit"></font-awesome-icon>
                                  </button>
                                  <button
                                    class="btn btn-sm btn-danger"
                                    @click="deleteItem(item.id)"
                                  >
                                    <font-awesome-icon icon="trash"></font-awesome-icon>
                                  </button>
                                </td>
                              </tr>
                            </template>
                            <template v-else>
                              <tr>
                                <td class="text-center" colspan="12">
                                  <strong>No hay ningún elemento.</strong>
                                </td>
                              </tr>
                            </template>
                          </tbody>
                        </table>
                      </div>
                      </td>
                    </tr>
                    <!--Tiempo de Traslado ------------------------------>
                    <tr>
                      <td colspan="4">
                        <div align="left"><b>Tiempo de Traslado</b></div>
                        <b-form  @submit="storeCP" autocomplete="off">
                          <div class="row">
                                <div v-if="updateIndex!==0" class="form-group col-md-10" align="center">
                                    <label for="item" class="control-label">Descripción</label>
                                    <b-form-input style="text-align:center" :disabled="parseInt(traslado)==0"
                                    readonly
                                    class="form-control"
                                    id="tiempo_traslado"
                                    v-model="formTTP.descripcion"
                                  />
                                </div>
                                <div v-if="updateIndex===0" class="form-group col-md-10" align="center">
                                  <label for="item" class="control-label">Descripción</label><br>
                                  <b-form-select
                                    :disabled="proyectoID==0"
                                    ref="descripcion"
                                    id="descripcion"
                                    name="descripcion"
                                    v-model="traslado"
                                    @change="onChangeItemTTP(traslado)"
                                  >
                                    <b-form-select-option value=0>Seleccione...</b-form-select-option>
                                      <template v-for="traslado in tiempoTraslado">
                                        <b-form-select-option
                                          :value="traslado"
                                          :key="traslado.id"
                                        >
                                          {{ traslado.descripcion }}
                                        </b-form-select-option>
                                      </template>
                                  </b-form-select>
                                </div>
                                <div class="form-group col-md-2" align="center">
                                  <label for="tiempoDisenio" class="control-label">Tiempo de Traslado</label>
                                  <b-form-input style="text-align:center" :disabled="parseInt(traslado)==0"
                                    readonly
                                    title="Haga click para seleccionar el tiempo"
                                    class="form-control"
                                    id="tiempo_traslado"
                                    v-model="formTTP.tiempo_traslado"
                                    @click="loadTimesTTP()"
                                  />
                                </div>
                          </div>
                        </b-form>
                        <div class="row">
                          <div class="col-md-12" align="center">
                            <button v-if="updateIndex" type="button" @click="updateTTP()" class="btn btn-sm btn-primary">Guardar</button>
                            <button v-if="!updateIndex && traslado && proyectoID" type="button" @click="storeTTP()" class="btn btn-sm btn-primary">Agregar</button>
                            <button v-if="(traslado || updateIndex)" type="button" @click="setearItemTTP()" class="btn btn-sm btn-danger">Cancelar</button>
                          </div>
                        </div>
                        <br>
                        <div class="table-responsive">
                        <table class="table table-hover">
                          <thead>
                            <th style="text-align:center">#</th>
                            <th style="text-align:center">Descripción</th>
                            <th style="text-align:center">Tiempo de Traslado</th>
                            <th></th>
                          </thead>
                          <tbody>
                            <template v-if="tiempoTrasladoProy.length > 0">
                              <tr v-for="(item, i) in tiempoTrasladoProy" :key="i">
                                <td align="center">{{ i + 1 }}</td>
                                <td align="center">{{ item.descripcion }}</td>
                                <td align="center">{{ item.tiempo_traslado }}</td>
                                <td>
                                  <button
                                    class="btn btn-sm btn-success"
                                    @click="editItemTTP(item)"
                                  >
                                    <font-awesome-icon icon="edit"></font-awesome-icon>
                                  </button>
                                  <button
                                    class="btn btn-sm btn-danger"
                                    @click="deleteItemTTP(item.id)"
                                  >
                                    <font-awesome-icon icon="trash"></font-awesome-icon>
                                  </button>
                                </td>
                              </tr>
                            </template>
                            <template v-else>
                              <tr>
                                <td class="text-center" colspan="12">
                                  <strong>No hay ningún elemento.</strong>
                                </td>
                              </tr>
                            </template>
                          </tbody>
                        </table>
                      </div>
                      </td>
                    </tr>
                    <!-- ------------------------------------------------>
                  </tbody>
                </table>

                <div v-if="proyectoInfo.hasOwnProperty('detalles_exportacion') && proyectoInfo.detalles_exportacion.hasOwnProperty('id')">

                  <br>
                  <center>
                    <h2>Detalles de exportación</h2>
                  </center>

                  <table
                    class="table table-hover table-bordered one-column text-left"
                    style="border: none"
                  >
                    <tbody>

                      <tr>
                        <th>Usuario</th>
                        <th>Estado de exportacion</th>
                        <th>Comentario Corrección</th>
                      </tr>

                      <tr v-for="(usr, indx) in proyectoInfo.detalles_exportacion.usuarios" :key="indx">
                        <td>{{usr.usuario}}</td>
                        <td>{{
                            usr.operacion == "Peticion" && indx == 0 ? "Solicitado exportación" :
                            usr.operacion == "Peticion" ? "Confirmo corrección" :
                            usr.operacion == "Revisado" ? "Confirmo solicitud" :
                            usr.operacion == "Corregir" ? "Solicito corrección" :
                            usr.operacion == "Confirmado" ? "Exporto a taller":""
                          }}
                        </td>
                        <td>{{usr.hasOwnProperty("comentario") ? usr.comentario:""}}</td>
                      </tr>
                    </tbody>
                  </table>
                  <br>
                  <center>
                    <h2>Preguntas al exportar</h2>
                  </center>
                  <div class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <th style="text-align:center">#</th>
                        <th style="text-align:center">Preguntas</th>
                        <th style="text-align:center">Respuestas</th>
                      </thead>
                      <tbody>
                        <template v-if="proyectoInfo.detalles_exportacion.hasOwnProperty('preguntas')">
                          <tr v-for="(item, i) in proyectoInfo.detalles_exportacion.preguntas" :key="i">
                            <td align="center">{{ i + 1 }}</td>
                            <td align="center">{{ item.pregunta }}</td>
                            <td align="center">{{ item.respuesta }}</td>
                          </tr>
                        </template>
                        <template v-else>
                          <tr>
                            <td class="text-center" colspan="12">
                              <strong>No hay ningún elemento.</strong>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>


                  <br>
                  <center>
                    <h2>Preguntas al vender</h2>
                  </center>
                  <div class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <th style="text-align:center">#</th>
                        <th style="text-align:center">Preguntas</th>
                        <th style="text-align:center">Respuestas</th>
                      </thead>
                      <tbody>
                        <template v-if="proyectoInfo.detalles_exportacion.hasOwnProperty('preguntas_ventas')">
                          <tr v-for="(item, i) in proyectoInfo.detalles_exportacion.preguntas_ventas" :key="i">
                            <td align="center">{{ i + 1 }}</td>
                            <td align="center">{{ item.pregunta }}</td>
                            <td align="center">{{ item.respuesta }}</td>
                          </tr>
                        </template>
                        <template v-else>
                          <tr>
                            <td class="text-center" colspan="12">
                              <strong>No hay ningún elemento.</strong>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </b-tab>
            <b-tab title="Stock">
              <div class="">
                <table
                  class="table table-hover table-bordered materiales-table table-responsive"
                >
                  <thead>
                    <th class="cantidad-row">Cantidad</th>
                    <th class="cantidad-manual-row">Cantidad Manual</th>
                    <th class="nombre-row">Nombre</th>
                    <th class="detalle-row hide-sm">Detalle</th>
                    <th class="desperdicio desperdicio-row">
                      Desperdicio (en cms)
                    </th>
                    <th class="extra-1-row">Extra 1</th>
                    <th class="extra-2-row">Extra 2</th>
                    <th class="estado-row">Estado</th>
                  </thead>

                  <tbody>
                    <template v-if="materialesDisenio.length">
                      <tr
                        class="table-title-row"
                        v-for="materiales in materialesDisenio"
                        :style="{
                          'background-color': getStockTableRowBackgroundColor(
                            materiales.estado_id
                          ),
                        }"
                        :key="materiales.id"
                      >
                        <td>
                          <span v-if="!getPlacas(materiales)">{{
                            round(materiales.cantidad) + materiales.unidad
                          }}</span>
                          <span v-if="getPlacas(materiales)"
                            >{{ round(getPlacas(materiales)) }} placas</span
                          >
                        </td>
                        <td>
                          {{ materiales.cantidadManual }}
                        </td>
                        <td>
                            <b class="text-center" @click="verHistorialTaller(2, materiales.nombre, materiales.id)"> {{ materiales.nombre }}</b>                          
                        </td>
                        <td class="hide-sm">
                          {{ materiales.detalle }}
                        </td>
                        <td>
                          {{ materiales.desperdicio }}
                        </td>
                        <td>
                          {{ materiales.extra1 }}
                        </td>
                        <td>
                          {{ materiales.extra2 }}
                        </td>
                        <td>
                          <select
                            class="form-control"
                            v-model="materiales.estado_id"
                            @change="
                              onChangeMetadataMaterialEstado($event, materiales, 'stock')
                            "
                          >

                          
                            <option value="9">Seleccione un estado</option>
                            <option value="3">Ok</option>
                            <option value="6">Stock</option>
                            <option value="4">Pedido</option>
                            <option value="1">Falta</option>
                          </select>
                        </td>
                      </tr>
                    </template>
                    <tr v-else>
                      <td colspan="8" class="text-center">
                        <strong>¡No existen materiales registrados!</strong>
                      </td>
                    </tr>
                  </tbody>
                  <div class="muted waste-note">
                    Se utilizo un desperdicio del
                    <span class="bold">{{ waste }}%</span> para calcular la
                    cantidad de placas
                  </div>
                </table>

                <div class="metadata-container" v-if="modInfo.length">
                  <table
                    class="table-meta table table-hover table-bordered one-column modules-table col-sm-6 table-card-stock"
                    v-for="mod in modInfo"
                    :key="mod.id"
                  >
                    <tbody>
                      <tr class="table-title-row">
                        <td colspan="2" class="table-title">
                          {{ mod.moduleName }}
                        </td>
                      </tr>
                      <tr>
                        <td class="row-label">Alto</td>
                        <td>{{ mod.height }}</td>
                      </tr>
                      <tr>
                        <td class="row-label">Ancho</td>
                        <td>{{ mod.width }}</td>
                      </tr>
                      <tr>
                        <td class="row-label">Armado</td>
                        <td>{{ mod.armado ? mod.armado : "No" }}</td>
                      </tr>
                      <tr v-if="!!mod.comentario">
                        <td class="row-label">Comentario</td>
                        <td>{{ mod.comentario }}</td>
                      </tr>
                      <tr v-if="!!mod.descripcion">
                        <td class="row-label">Descripcion</td>
                        <td>{{ mod.descripcion }}</td>
                      </tr>
                      <tr>
                        <td class="row-label">Material fondo</td>
                        <td>
                          {{
                            mod.materialFondo ? mod.materialFondo : "Sin Fondo"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td class="row-label">Material por Defecto</td>
                        <td>{{ mod.materialPorDefecto }}</td>
                      </tr>
                      <tr>
                        <td class="row-label">Tapacantos por Defecto</td>
                        <td>{{ mod.tapacantosPorDefecto }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </b-tab>
            <!-- <b-tab title="Disabled" disabled> -->
            <b-tab title="Cortes">
              <div class="row" style="padding-bottom: 10px">
                <div class="col-xs-6 col-md-3" style="text-align: left">
                  <span style="font-size: 11px">Material</span>
                  <select
                    style="min-width: 100px"
                    ref="material"
                    id="material"
                    class="form-control"
                    name="material"
                    v-model="materialSelected"
                    @change="onChangeMaterial($event.target.value)"
                  >
                    <option
                      v-for="material in materialesFiltered"
                      :value="material.id"
                      :key="material.material"
                    >
                      {{ material.material }}
                    </option>
                  </select>
                </div>
                <div class="col-xs-6 col-md-2" style="text-align: left">
                  <span style="font-size: 11px">Filtrar</span>
                  <input
                    id="filter-pieza"
                    class="form-control"
                    type="text"
                    name="filter-pieza"
                    v-model="filterPieza"
                    @change="onChangeFilterPieza($event.target.value)"
                  />
                </div>

                <div class="col-xs-6 col-md-2" style="text-align: left">
                  <span style="font-size: 11px">LVeta</span>
                  <input
                    id="filter-lveta"
                    class="form-control"
                    type="number"
                    name="filter-lveta"
                    v-model="filterLVeta"
                    @change="onChangeFilterLVeta($event.target.value)"
                  />
                </div>
                <div class="col-xs-6 col-md-2" style="text-align: left">
                  <span style="font-size: 11px">AVeta</span>
                  <input
                    id="filter-aveta"
                    class="form-control"
                    type="number"
                    name="filter-aveta"
                    v-model="filterAVeta"
                    @change="onChangeFilterAVeta($event.target.value)"
                  />
                </div>

                <div class="col-xs-12 col-md-3 columna-botones-cortes">
                  <div style="display: flex; height: 100%">
                    <b-button
                      style="width: 100%"
                      size="sm"
                      @click="optimizarTodo()"
                      variant="primary"
                    >
                      Faltante a Optimizar
                    </b-button>
                    <b-button
                      style="margin-left: 10px; width: 100%"
                      size="sm"
                      @click="modalOptimizar()"
                      variant="primary"
                    >
                      Optimizar
                    </b-button>
                  </div>
                </div>
              </div>

              <div class="">
                <table
                  class="materiales-table table table-hover table-bordered table-responsive"
                  ref="tablacortes"
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th></th>
                      <th style="width: 20%">Estado</th>
                      <th style="max-width: 75px">Cantidad</th>
                      <th style="width: 50%">Pieza</th>
                      <th style="width: 30%">Inf. Error</th>
                      <th style="width: 30%">Comentario</th>
                      <th>LVeta</th>
                      <th>AVeta</th>
                      <th>Módulo</th>
                      <th>Material</th>
                      <th>Espesor</th>
                      <th>Rotable</th>
                      <th style="min-width: 100px"></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(pieza, index) in piezas">
                      <tr
                        v-if="pieza.show"
                        :style="{
                          'border-left':
                            'solid 5px' + colorEstado[pieza.estado.estado],
                          'background-color':
                            colorEstadoBackground[pieza.estado.estado],
                        }"
                        :key="index"
                      >

                        <td>
                          <b class="text-center" @click="verHistorialPieza(pieza)">{{ pieza.id_aux }}</b> 
                        </td>

                        <td>
                          <button
                            class="btn btn-xs btn-primary"
                            @click="changeEstadoPieza(pieza, 3, 'estado_id')"
                            type="button"
                          >
                            Cortar
                          </button>
                        </td>
                        <td>
                          <select
                            style="min-width: 70px; width: 100%"
                            id="pieza-estado pz_estado"
                            class="input-sm form-control"
                            name="pieza-estado"
                            @change="
                              onChangeEstadoPieza(
                                $event,
                                pieza,
                                'estado_id',
                                'corte'
                              )
                            "
                            v-model="pieza.estado_id"
                          >
                            <option
                              v-for="estado in estados"
                              :value="estado.id"
                              :key="estado.id"
                            >
                              {{ estado.estado }}
                            </option>
                          </select>
                        </td>
                        <td>{{ pieza.cantidad }}</td>
                        <td>{{ pieza.pieza | nombreFrenteDeCajonPieza }}</td>
                        <td v-if="pieza.hay_info_error==false">
                          <button
                            class="btn btn-xs btn-secondary"
                            @click="showControlErrorPieza(1, pieza)"
                            type="button"
                          >
                            X
                          </button>
                        </td>
                        <td v-if="pieza.hay_info_error==true">
                          <button
                            class="btn btn-xs btn-success"
                            @click="showControlErrorPieza(1, pieza)"
                            type="button"
                          >
                            X
                          </button>
                        </td>
                        <td>
                          <button
                            v-if="pieza.comentario"
                            type="button"
                            class="btn btn-xs btn-link btn-primary"
                            @click="modalComentario($event, pieza.comentario)"
                          >
                            Ver info
                          </button>
                        </td>
                        <td>{{ pieza.lveta }}</td>
                        <td>{{ pieza.aveta }}</td>
                        <td>{{ pieza.modulo.modulo | nombreFrenteDeCajonPieza}}</td>
                        <td>{{ pieza.material? pieza.material.material : '' }}</td>
                        <td>{{ pieza.espesor }}</td>
                        <td>
                          <select
                            v-model="pieza.rotable"
                            style="min-width: 70px; max-width: 70px"
                            name="rotable"
                            class="input-sm form-control rotable"
                          >
                            <option index="">-Seleccione-</option>
                            <option index="YES">SI</option>
                            <option index="NO">NO</option>
                          </select>
                        </td>
                        <td>
                          <button
                            class="btn btn-sm btn-secondary"
                            @click="seeCalco(pieza)"
                            type="button"
                          >
                            Ver calco
                          </button>
                        </td>
                        <td>
                          <button
                            class="btn btn-sm btn-secondary"
                            @click="printCalco(pieza)"
                            type="button"
                          >
                            Imprimir
                          </button>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </b-tab>

            <b-tab title="Tapacantos">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th></th>
                      <th>Pieza</th>
                      <th>Inf. Error</th>
                      <th>Material</th>
                      <th>Módulo</th>
                      <th>Completos</th>
                      <th>Comentario</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(pieza, index) in piezas">
                      <tr
                        v-if="pieza.estado_id == 3"
                        :class="classTapacantos(pieza.tapacantos, pieza)"
                        :key="index"
                      >
                        <td><b class="text-center" @click="verHistorialPieza(pieza)">{{ pieza.id_aux }}</b></td>
                        <td>
                          <button
                            class="btn btn-primary"
                            @click="
                              pieza.tapacantos.length === 0
                                ? onChangeEstadoPieza(
                                    3,
                                    pieza,
                                    'tapacantos_estado_id',
                                    'tapacantos'
                                  )
                                : terminarTodosLosTapacantos(pieza)
                            "
                            type="button"
                          >
                            Terminar
                          </button>
                        </td>
                        <td>{{ pieza.pieza }}</td>
                        <td v-if="pieza.hay_info_error_tapacanto==false">
                          <button
                            class="btn btn-xs btn-secondary"
                            @click="showControlErrorPieza(2, pieza)"
                            type="button"
                          >
                            X
                          </button>
                        </td>
                        <td v-if="pieza.hay_info_error_tapacanto==true">
                          <button
                            class="btn btn-xs btn-success"
                            @click="showControlErrorPieza(2, pieza)"
                            type="button"
                          >
                            X
                          </button>
                        </td>
                        <td>{{ pieza.material? pieza.material.material : '' }}</td>
                        <td>{{ pieza.modulo.modulo }}</td>
                        <td>
                          <button
                            class="btn btn-primary"
                            :disabled="pieza.tapacantos.length === 0"
                            @click="changeTapacantos($event, pieza)"
                          >
                            {{
                              tapacantosOk(pieza.tapacantos) +
                              "/" +
                              pieza.tapacantos.length
                            }}
                          </button>
                        </td>
                        <td>
                          <button
                            v-if="pieza.comentario"
                            type="button"
                            class="btn btn-link btn-primary"
                            @click="modalComentario($event, pieza.comentario)"
                          >
                            Ver info
                          </button>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </b-tab>

            <b-tab
              title="Prearmado"
              :disabled="!haveResponsible ? true : false"
              @click="alert()"
            >
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th></th>
                      <th>Pieza</th>
                      <th>Inf. Error</th>
                      <th>Material</th>
                      <th>Módulo</th>
                      <th>Estado</th>
                      <th>Comentario</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(pieza, index) in piezas">
                      <tr
                        v-if="
                          pieza.estado_id == 3 &&
                          ((pieza.tapacantos.length > 0 &&
                            tapacantosOk(pieza.tapacantos) ==
                              pieza.tapacantos.length) ||
                            pieza.tapacantos.length == 0)
                        "
                        :style="{
                          'border-left':
                            'solid 5px' + colorEstado[pieza.prearmado.estado],
                          'background-color':
                            '' + colorEstadoBackground[pieza.prearmado.estado],
                        }"
                        :key="index"
                      >
                        <td> <b class="text-center" @click="verHistorialPieza(pieza)">{{ pieza.id_aux }}</b></td>
                        <td>
                          <button
                            class="btn btn-primary"
                            @click="prearmar(pieza)"
                            type="button"
                          >
                            Prearmar
                          </button>
                        </td>
                        <td>{{ pieza.pieza }}</td>
                        <td v-if="pieza.hay_info_error_prearmado==false">
                          <button
                            class="btn btn-xs btn-secondary"
                            @click="showControlErrorPieza(3, pieza)"
                            type="button"
                          >
                            X
                          </button>
                        </td>
                        <td v-if="pieza.hay_info_error_prearmado==true">
                          <button
                            class="btn btn-xs btn-success"
                            @click="showControlErrorPieza(3, pieza)"
                            type="button"
                          >
                            X
                          </button>
                        </td>
                        <td>{{ pieza.material? pieza.material.material : '' }}</td>
                        <td>{{ pieza.modulo.modulo }}</td>
                        <td>
                          <select
                            style="min-width: 100px"
                            id="pieza-prearmado"
                            class="form-control"
                            name="pieza-prearmado"
                            v-model="pieza.prearmado_estado_id"
                            @change="
                              onChangeEstadoPieza(
                                $event,
                                pieza,
                                'prearmado_estado_id',
                                'prearmado'
                              )
                            "
                          >
                            <option
                              v-for="(estado, index) in estados"
                              :value="estado.id"
                              :key="index"
                            >
                              {{ estado.estado }}
                            </option>
                          </select>
                        </td>
                        <td>
                          <button
                            v-if="pieza.comentario"
                            type="button"
                            class="btn btn-link btn-primary"
                            @click="modalComentario($event, pieza.comentario)"
                          >
                            Ver info
                          </button>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </b-tab>
             <!-- -------------------------------------------------------- -->
            <b-tab
              title="Notas de Acción"
              :disabled="!haveResponsible ? true : false"
              @click="alert()"
            >
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th style="width: 20%">Estado</th>
                      <th>Nombre</th>
                      <th>Inf. Error</th>
                      <th>Descripción</th>
                      <th>Módulo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(nota, index) in actionNotes">
                      <tr
                          :style="{
                          'border-left':
                            'solid 5px' + colorEstado[getNameEstado[nota.estado_id]],
                          'background-color':
                            colorEstadoBackground[getNameEstado[nota.estado_id]],
                        }"
                        :key="index"
                        >
                        <td><button :disabled="nota.estado_id == 3"
                            class="btn btn-primary"
                            @click="onChangeActionNote(3,nota)"
                            type="button"
                          >
                            Hecho
                          </button></td>
                        <td>
                          <select
                            style="min-width: 70px; width: 100%"
                            id="pieza-estado pz_estado"
                            class="input-sm form-control"
                            name="actionnote-estado"
                            @change="
                              onChangeActionNote(
                                nota.estado_id,
                                nota
                              )
                            "
                            v-model="nota.estado_id"
                          >
                            <option
                              v-for="estado in estados"
                              :value="estado.id"
                              :key="estado.id"
                            >
                              {{ estado.estado }}
                            </option>
                          </select>
                        </td>
                        <td>{{ nota.name }}</td>
                        <td v-if="nota.hay_info_error==false">
                          <button
                            class="btn btn-xs btn-secondary"
                            @click="showControlErrorNota(4, nota)"
                            type="button"
                          >
                            X
                          </button>
                        </td>
                        <td v-if="nota.hay_info_error==true">
                          <button
                            class="btn btn-xs btn-success"
                            @click="showControlErrorNota(4, nota)"
                            type="button"
                          >
                            X
                          </button>
                        </td>
                        <td>{{ nota.description }}</td>
                        <td>{{ (nota.orig_modulo_id)? nota.orig_modulo_id : 'Todos' }}</td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </b-tab>
           <!-- -------------------------------------------------------- -->
            <b-tab
              title="Cajones"
              :disabled="!haveResponsible ? true : false"
              @click="alert()"
            >
              <!-- <div id="cajones" class="tab-pane" role="tabpanel"> -->
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th></th>
                      <th>Cajón</th>
                      <th>Inf. Error</th>
                      <th>Módulo</th>
                      <th>Estado</th>
                      <th>Piezas</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="getModulosCajones().length > 0">
                      <!--  Se sustituye modulofiltrados por modulos -->
                      <template v-for="(modulo, index) in cajonesFiltrados">
                        <tr
                          v-if="modulo.is_cajon == 1"
                          :key="index"
                          :style="{
                            'border-left':
                              'solid 5px' + colorEstado[modulo.estado.estado],
                            'background-color':
                              '' + colorEstadoBackground[modulo.estado.estado],
                          }"
                        >
                          <td> <b class="text-center" @click="verHistorialTaller(7, modulo.modulo, modulo.id)"> {{ modulo.id_aux}}</b></td>
                          <td>  
                            <button
                              class="btn btn-primary"
                              @click="changeEstadoModulo(modulo, 'cajones', 3, true)"
                              type="button"
                            >
                              Armar
                            </button>
                          </td>
                          <td>{{ modulo | nombreFrenteCajon }}</td>
                          <td v-if="modulo.hay_info_error_cajon==false">
                          <button
                            class="btn btn-xs btn-secondary"
                            @click="showControlErrorModulo(5, modulo)"
                            type="button"
                          >
                            X
                          </button>
                        </td>
                        <td v-if="modulo.hay_info_error_cajon==true">
                          <button
                            class="btn btn-xs btn-success"
                            @click="showControlErrorModulo(5, modulo)"
                            type="button"
                          >
                            X
                          </button>
                        </td>
                          <td>{{ modulo.modulo_parent.modulo }}</td>
                          <td>
                            <select
                              style="min-width: 100px"
                              id="modulo-estado"
                              class="form-control"
                              name="modulo-estado"
                              v-model="modulo.estado_id"
                              @change="onChangeEstadoModulo($event, 'cajones', modulo, index)"
                            > 
                              <option
                                v-for="(estado, index) of estados"
                                :value="estado.id"
                                :key="index"
                              >
                                {{ estado.estado }}
                              </option>
                            </select>
                          </td>
                          <td>
                            <button
                              class="btn btn-primary"
                              @click="showModalPiezas($event, modulo, true)"
                            >
                              Piezas
                            </button>
                          </td>
                        </tr>
                      </template>
                    </template>
                    <template v-else>
                      <tr>
                        <td class="text-center" colspan="6">
                          <strong>El proyecto no posee cajones</strong>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </b-tab>
            <b-tab
              title="Módulos"
              :disabled="!haveResponsible ? true : false"
              @click="alert()"
            >
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Módulo</th>
                      <th></th>
                      <th></th>
                      <th>Estado</th>
                      <th>Armar</th>
                      <th>Inf. Error</th>
                      <th>Comentario</th>
                      <th>Descripción</th>
                      <th>Piezas</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!--  Se sustituye modulofiltrados por modulos -->
                    <template v-for="(modulo, index) in proyectoInfo.modulos">
                      <tr
                        v-if="modulo.is_cajon == 0"
                        :style="{
                          'border-left':
                            'solid 5px' + colorEstado[modulo.estado.estado],
                          'background-color':
                            '' + colorEstadoBackground[modulo.estado.estado],
                        }"
                        :key="index"
                      >
                        <td><b class="text-center" @click="verHistorialTaller(8, modulo.modulo, modulo.id)"> {{ modulo.modulo}}</b></td>

                        <td>
                          <button class="btn btn-primary" type="button" @click="loadImagen(modulo)">
                            <b-icon icon="image"></b-icon>
                          </button>
                        </td>

                        <td>
                          <button
                            class="btn btn-primary"
                            @click="changeEstadoModulo(modulo, 'modulos', 3, false)"
                            type="button"
                          >
                            Armar
                          </button>
                        </td>
                        <td>
                          <select
                            style="min-width: 100px"
                            id="modulo-estado"
                            class="form-control"
                            name="modulo-estado"
                            v-model="modulo.estado_id"
                            @change="
                              onChangeEstadoModulo($event, 'modulos', modulo, index)
                            "
                          >
                            <option
                              v-for="estado in estados"
                              :value="estado.id"
                              :key="estado.id"
                            >
                              {{ estado.estado }}
                            </option>
                          </select>
                        </td>
                        <td>
                          <select
                            style="min-width: 100px"
                            id="modulo-armado"
                            class="form-control"
                            name="modulo-armado"
                            v-model="modulo.armado"
                            @change="
                              onChangeModuloArmado($event, modulo)
                            "
                          >
                            <option value=""></option>
                            <option value="Si">Si</option>
                            <option value="No">No</option>
                            <option value="Evaluar">Evaluar</option>
                          </select>
                        </td>
                        <td v-if="modulo.hay_info_error==false">
                          <button
                            class="btn btn-xs btn-secondary"
                            @click="showControlErrorModulo(6, modulo)"
                            type="button"
                          >
                            X
                          </button>
                        </td>
                        <td v-if="modulo.hay_info_error==true">
                          <button
                            class="btn btn-xs btn-success"
                            @click="showControlErrorModulo(6, modulo)"
                            type="button"
                          >
                            X
                          </button>
                        </td>
                        <td>
                          <button
                            v-if="modulo.comentario"
                            type="button"
                            class="btn btn-primary"
                            @click="modalComentario($event, modulo.comentario)"
                          >
                            Ver info
                          </button>
                        </td>
                        <td>
                          <button
                            v-if="modulo.descripcion"
                            type="button"
                            class="btn btn-primary"
                            @click="modalComentario($event, modulo.descripcion)"
                          >
                            Ver info
                          </button>
                        </td>
                        <td>
                          <button
                            class="btn btn-primary"
                            @click="showModalPiezas($event, modulo,false)"
                          >
                            Piezas
                          </button>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </b-tab>
            <b-tab
              title="Control"
              :disabled="!haveResponsible ? true : false"
              @click="alert(9)"
            >
            <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th colspan="5">Módulos Armados</th>
                    </tr>
                    <tr>
                      <th>Módulo</th>
                      <th></th>
                      <th>Nro. piezas</th>
                      <th></th>
                      <th>Nro. piezas sueltas</th>
                      <th></th>
                      <th></th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(modulo, index) in modulosArmados">
                      <tr :style="{
                          'border-left':
                            'solid 5px' + colorEstado[modulo.control_estado.estado],
                          'background-color':
                            '' + colorEstadoBackground[modulo.control_estado.estado],
                        }"
                        :key="index">
                        <td><b class="text-center" @click="verHistorialTaller(9, modulo.modulo, modulo.id)"> {{ modulo.modulo}}</b></td>  
                        <td> 
                            <button class="btn btn-primary" type="button" @click="loadImagen(modulo)">
                            <b-icon icon="image"></b-icon>
                          </button>
                        </td>
                        <td>{{ modulo.piezas.length }}</td>
                        <td>
                          <button
                            class="btn btn-primary"
                            @click="showModalPiezasOnly(modulo)"
                          >
                            Piezas
                          </button>
                        </td>
                        <td v-if="modulo.piezasueltas.length == 0">{{ modulo.piezasueltas.length }}</td>
                        <td v-if="modulo.piezasueltas.length > 0" style="background-color: #f1948a33">{{ modulo.piezasueltas.length }}</td>
                        <td>
                          <button
                            class="btn btn-primary"
                            @click="showModalPiezasSueltas(modulo.id)"
                          >
                            Controlar Piezas
                          </button>
                        </td>
                        <td>
                          <button
                            class="btn btn-primary"
                            @click="changeControlEstadoModulo(modulo, 3)"
                            type="button"
                          >
                            Controlar
                          </button>
                        </td>
                        <td>
                          <select
                            style="min-width: 100px"
                            id="modulo-estado"
                            class="form-control"
                            name="modulo-estado"
                            v-model="modulo.control_estado_id"
                            @change="onChangeControlEstadoModulo($event, 'control', modulo, index)"
                          >
                            <option
                              v-for="estado in estados"
                              :value="estado.id"
                              :key="estado.id"
                            >
                              {{ estado.estado }}
                            </option>
                          </select>
                        </td>
                      </tr>
                    </template>
                    <template v-if="modulosArmados.length ==0">
                      <tr>
                        <td colspan="5">No hay información disponible..</td>
                      </tr>
                    </template>
                  </tbody>
                </table>
                <table class="table">
                  <thead>
                    <tr>
                      <th colspan="4">Módulos No Armados</th>
                    </tr>
                    <tr>
                      <th>Módulo</th>
                      <th>Nro. piezas sueltas</th>
                      <th></th>
                      <th></th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(modulo, index) in modulosNoArmados">
                      <tr :style="{
                          'border-left':
                            'solid 5px' + colorEstado[modulo.control_estado.estado],
                          'background-color':
                            '' + colorEstadoBackground[modulo.control_estado.estado],
                        }"
                        :key="index">
                        <td>{{ modulo.modulo }}</td>
                        <td>{{ modulo.piezas.length }}</td>
                        <td>
                          <button
                            class="btn btn-primary"
                            @click="showModalPiezasSueltas(modulo.id)"
                          >
                            Controlar Piezas
                          </button>
                        </td>
                        <td>
                          <button
                            class="btn btn-primary"
                            @click="changeControlEstadoModulo(modulo, 3)"
                            type="button"
                          >
                            Controlar
                          </button>
                        </td>
                        <td>
                          <select
                            style="min-width: 100px"
                            id="modulo-estado"
                            class="form-control"
                            name="modulo-estado"
                            v-model="modulo.control_estado_id"
                            @change="
                              onChangeControlEstadoModulo($event, 'control', modulo)
                            "
                          >
                            <option
                              v-for="estado in estados"
                              :value="estado.id"
                              :key="estado.id"
                            >
                              {{ estado.estado }}
                            </option>
                          </select>
                        </td>
                      </tr>
                    </template>
                     <template v-if="modulosNoArmados.length ==0">
                      <tr>
                        <td colspan="4">No hay información disponible..</td>
                      </tr>
                    </template>
                  </tbody>
                </table>

              </div>
            </b-tab>
            <b-tab title="Encuesta" id="encuesta" :disabled="activeClass">
              <div
                class="alert alert-info"
                style="margin-top: 15px"
                role="alert"
              >
                <strong>¡Atención!</strong> Para finalizar el proyecto debe
                completar la encuesta sino permancerá abierto.
              </div>
              <table class="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Pregunta</th>
                    <th>Respuesta</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(reporte, index) in reportes" :key="index">
                    <td width="75%">{{ reporte.nombre }}</td>
                    <td v-if="reporte.esTexto">
                      <textarea
                        class="form-control"
                        v-model="reporte.descripcion"
                        placeholder="Describa aquí"
                        id="exampleFormControlTextarea1"
                        rows="3"
                      ></textarea>
                    </td>
                    <td v-if="reporte.esEstrella">
                      <star-rating
                        v-model="reporte.descripcion"
                        :star-size="20"
                        :show-rating="false"
                      />
                    </td>
                    <td v-if="reporte.esPregunta">
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          v-model="reporte.descripcion"
                          :id="'inlineRadio1' + index"
                          value="si"
                        />
                        <label class="form-check-label" for="inlineRadio1"
                          >Sí</label
                        >

                        <input
                          class="form-check-input"
                          v-model="reporte.descripcion"
                          style="margin-left: 15px"
                          type="radio"
                          :id="'inlineRadio2' + index"
                          value="no"
                        />
                        <label class="form-check-label" for="inlineRadio2"
                          >No</label
                        >
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="col-md-12" style="padding: 0">
                <button
                  class="btn btn-success pull-right"
                  @click="enviarReporte()"
                >
                  Enviar reporte
                </button>
              </div>
            </b-tab>
          </b-tabs>
        </b-overlay>
      </div>
    </div>

    <b-modal id="list-piezas" size="lg" hide-header hide-footer>
      <div class="modal-content">
        <div class="modal-header" style="color: blue;">
          <b>
            <span v-if="esCajon===false && moduloModal.armado ==='Si'" style="font-size: large">¿Alguna pieza no se ensambló en el módulo y va suelta? Por favor responde si esa pieza "va suelta": Sí o No.</span>
            <span v-if="esCajon===true || moduloModal.armado !=='Si'" style="font-size: large">Piezas</span>
          </b>
          <button
            type="button"
            @click="$bvModal.hide('list-piezas')"
            class="btn btn-default"
            data-dismiss="modal"
            >
            &times;
          </button>
        </div>

        <div class="modal-body">
          <table class="table" id="piezas_proyecto">
            <thead>
              <tr>
                <th>#</th>
                <th>Pieza</th>
                <th>¿Va suelta?</th>
                <th>Material</th>
                <th>Cantidad</th>
                <th>LVeta</th>
                <th>AVeta</th>
                <th>Espesor</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(pieza, index) in listPiezasByModulo">
              <tr
                  :style="{
                    'border-left':'solid 5px' + colorPiezaSuelta[pieza.va_suelta],
                    'background-color': '' + colorPiezaSueltaBg[pieza.va_suelta],
                  }"
                  :key="index"
                >
                <td>{{ pieza.id_aux }}</td>
                <td>{{ pieza.pieza }}</td>
                <td style="width: 100px" v-if="pieza.modulo.armado==='Si' && esCajon===false"><select
                      id="va_suelta"
                      class="form-control"
                      v-model="pieza.va_suelta"
                      @change="onChangeVaSuelta($event,pieza)"
                    >
                      <option
                        v-for="(tipo, ii) in va_suelta"
                        :key="ii"
                        :value="tipo.value"
                      >
                        {{ tipo.name }}
                      </option>
                    </select>
                </td>
                <td v-if="pieza.modulo.armado!=='Si' || esCajon===true">No aplica</td>
                <td>{{ pieza.material? pieza.material.material : '' }}</td>
                <td>{{ pieza.cantidad }}</td>
                <td>{{ pieza.lveta }}</td>
                <td>{{ pieza.aveta }}</td>
                <td>{{ pieza.espesor }}</td>
                <td>{{ getEstado(pieza.estado_id) }}</td>
              </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            @click="$bvModal.hide('list-piezas')"
            class="btn btn-default"
            data-dismiss="modal"
          >
            Cerrar
          </button>
        </div>
      </div>
    </b-modal>

    <b-modal id="list-piezas-sueltas" size="lg" hide-header hide-footer>
      <div class="modal-content">
        <div class="modal-header">
          <b>Piezas sueltas</b>
          <button
            type="button"
            @click="$bvModal.hide('list-piezas-sueltas')"
            class="btn btn-default"
            data-dismiss="modal"
            >
            &times;
          </button>
        </div>

        <div class="modal-body">
          <table class="table" id="piezas_sueltas_proyecto">
            <thead>
              <tr>
                <th>#</th>
                <th>Pieza</th>
                <th></th>
                <th>Estado</th>
                <th>Material</th>
                <th>Cantidad</th>
                <th>LVeta</th>
                <th>AVeta</th>
                <th>Espesor</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(pieza, index) in listPiezasSueltasByModulo">
              <tr
                  :style="{
                  'border-left':
                    'solid 5px' + colorEstado[pieza.sueltaestado.estado],
                  'background-color':
                    '' + colorEstadoBackground[pieza.sueltaestado.estado],
                }"
                :key="index"
                >
                <td>{{ pieza.id_aux }}</td>
                <td>{{ pieza.pieza }}</td>
                <td>
                  <button
                    class="btn btn-primary"
                    @click="changeControlPiezaSueltaEstado(pieza, 3)"
                    type="button"
                  >
                    Controlar
                  </button>
                </td>
                <td>
                  <select
                    style="min-width: 100px"
                    id="pieza-estado"
                    class="form-control"
                    name="pieza-estado"
                    v-model="pieza.suelta_estado_id"
                    @change="onChangeControlPiezaSueltaEstado($event, pieza)"
                  >
                    <option
                      v-for="estado in estados"
                      :value="estado.id"
                      :key="estado.id"
                    >
                      {{ estado.estado }}
                    </option>
                  </select>
                </td>
                <td>{{ pieza.material? pieza.material.material : '' }}</td>
                <td>{{ pieza.cantidad }}</td>
                <td>{{ pieza.lveta }}</td>
                <td>{{ pieza.aveta }}</td>
                <td>{{ pieza.espesor }}</td>
              </tr>
              </template>
              <tr v-if="listPiezasSueltasByModulo.length==0">  
                 <td><b>No hay piezas disponibles...</b></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            @click="$bvModal.hide('list-piezas-sueltas')"
            class="btn btn-default"
            data-dismiss="modal"
          >
            Cerrar
          </button>
        </div>
      </div>
    </b-modal>

    <b-modal id="list-piezas-only" size="lg" hide-header hide-footer>
      <div class="modal-content">
        <div class="modal-header">
          <b>Piezas sueltas</b>
          <button
            type="button"
            @click="$bvModal.hide('list-piezas-only')"
            class="btn btn-default"
            data-dismiss="modal"
            >
            &times;
          </button>
        </div>

        <div class="modal-body">
          <table class="table" id="piezas_sueltas_only">
            <thead>
              <tr>
                <th>#</th>
                <th>Pieza</th>
                <th>Estado</th>
                <th>Material</th>
                <th>Cantidad</th>
                <th>LVeta</th>
                <th>AVeta</th>
                <th>Espesor</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(pieza, index) in listPiezasOnlyByModulo">
              <tr
                  :style="{
                    'border-left':'solid 5px' + colorPiezaSuelta[pieza.va_suelta],
                    'background-color': '' + colorPiezaSueltaBg[pieza.va_suelta],
                  }"
                  :key="index"
                >
                <td>{{ pieza.id_aux }}</td>
                <td>{{ pieza.pieza }}</td>
                <td>{{ pieza.estado.estado }}</td>
                <td>{{ pieza.material? pieza.material.material : '' }}</td>
                <td>{{ pieza.cantidad }}</td>
                <td>{{ pieza.lveta }}</td>
                <td>{{ pieza.aveta }}</td>
                <td>{{ pieza.espesor }}</td>
              </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            @click="$bvModal.hide('list-piezas-only')"
            class="btn btn-default"
            data-dismiss="modal"
          >
            Cerrar
          </button>
        </div>
      </div>
    </b-modal>


    <b-modal id="change-tapacantos" title="Tapacantos">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
          <h4 class="modal-title">Tapacantos:</h4>
        </div>

        <div class="modal-body">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Posición</th>
                <th>Nombre</th>
                <th>Material</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(tapacanto, index) in tapacantos2Change"
                :style="{
                  'border-left':
                    'solid 5px' + colorEstado[tapacanto.estado.estado],
                  'background-color':
                    '' + colorEstadoBackground[tapacanto.estado.estado],
                }"
                :key="index"
              >
                <td>{{ tapacanto.id_aux }}</td>
                <td>{{ tapacanto.posicion_tapacanto.posicion }}</td>
                <td>{{ tapacanto.material.nombre }}</td>
                <td>{{ tapacanto.material.material }}</td>
                <td>
                  <select
                    style="min-width: 100px"
                    id="tapacanto-estado"
                    class="form-control"
                    name="tapacanto-estado"
                    v-model="tapacanto.estado_id"
                    @change="onChangeEstadoTapacanto($event, tapacanto, index)"
                  >
                    <option
                      v-for="estado in estados"
                      :value="estado.id"
                      :key="estado.id"
                    >
                      {{ estado.estado }}
                    </option>
                  </select>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3">¿Desea marcar todos los tapacantos Ok?</td>
                <td colspan="1">
                  <button
                    class="btn btn-primary"
                    @click="confirmationAllTapacantos"
                  >
                    Todos OK
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- <div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
				</div> -->
      </div>

      <template #modal-footer>
        <b-button variant="light" @click="$bvModal.hide('change-tapacantos')">
          Cerrar
        </b-button>
      </template>
    </b-modal>

    <!-- Modal Para crear la Optimizacion -->
    <b-modal id="modal_optimizacion" size="lg" hide-header hide-footer>
      <div class="">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            PARAMETROS OPTIMIZACION
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="">
          <div class="row" style="margin-left: 50px">
            <div class="col-xs-6 col-md-offset-3">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">
                    Opciones de Rotacion de las Piezas
                  </h3>
                </div>
                <div class="panel-body">
                  <label class="radio-inline" title="Rotar Todas Las Piezas">
                    <input
                      type="radio"
                      value="todas"
                      v-model="rotacion"
                      name="rotacion"
                    />Todas </label
                  >&nbsp;&nbsp;&nbsp;
                  <label class="radio-inline" title="No Rotar Ninguna Pieza">
                    <input
                      type="radio"
                      value="ninguna"
                      v-model="rotacion"
                      name="rotacion"
                    />Ninguna </label
                  >&nbsp;&nbsp;&nbsp;
                  <label
                    class="radio-inline"
                    title="Rotar Solo Las Piezas Seleccionadas"
                  >
                    <input
                      type="radio"
                      value="seleccionadas"
                      v-model="rotacion"
                      name="rotacion"
                      checked="checked"
                    />Seleccionadas
                  </label>
                </div>
              </div>
            </div>
          </div>

          <form class="">
            <table class="table">
              <tr>
                <th>Nombre</th>
                <th>Largo[mm]</th>
                <th>Ancho[mm]</th>
                <th>Cantidad</th>
                <th>Accion</th>
              </tr>
              <tr>
                <td>
                  <input
                    v-model="newPanel.nombre"
                    style="width: 100%"
                    type="text"
                    name="nombre"
                    class="input-sm"
                  />
                </td>
                <td>
                  <input
                    v-model="newPanel.largo"
                    style="width: 80px"
                    type="text"
                    name="largo"
                    class="input-sm"
                  />
                </td>
                <td>
                  <input
                    v-model="newPanel.ancho"
                    style="width: 80px"
                    type="text"
                    name="ancho"
                    class="input-sm"
                  />
                </td>
                <td>
                  <input
                    v-model="newPanel.cantidad"
                    style="width: 80px"
                    type="number"
                    name="cantidad"
                    class="input-sm"
                  />
                </td>
                <td>
                  <button
                    @click="addPanel()"
                    title="Agregar Panel"
                    class="btn btn-success btn-sm glyphicons glyphicons-plus-add"
                    type="button"
                  >
                    add
                  </button>
                </td>
              </tr>
              <tr v-for="(panel, index) in data.panels" :key="index">
                <td>{{ panel.nombre }}</td>
                <td>{{ panel.largo }}</td>
                <td>{{ panel.ancho }}</td>
                <td>{{ panel.cantidad }}</td>
                <td>
                  <span
                    title="Quitar Panel"
                    class="cancel-panel"
                    @click="removePanel(index)"
                    >❌</span
                  >
                </td>
              </tr>
            </table>
            <p
              style="text-align: center; color: tomato"
              v-if="!data.panels || data.panels.length == 0"
            >
              No ha Agregado Ningun Panel
            </p>
            <div class="row">
              <label for="nombre_proyecto" class="col-sm-2 col-md-offset-2"
                >Nombre Proyecto:</label
              >
              <div class="col-sm-6">
                <input
                  type="text"
                  class="form-control"
                  name="nombre_proyecto"
                  id="nombre_proyecto"
                  v-model="data.infoProject.projectName"
                />
              </div>
            </div>
            <div class="row">
              <label for="saw_kert" class="col-sm-2 col-md-offset-2"
                >Saw Kert:</label
              >
              <div class="col-sm-6">
                <input
                  type="text"
                  class="form-control"
                  name="saw_kert"
                  id="saw_kert"
                  v-model="data.infoProject.sawKerf"
                />
              </div>
            </div>
            <div class="row py-3">
              <label for="trim" class="col-sm-2 col-md-offset-2">Trim:</label>
              <div class="col-sm-6">
                <input
                  type="text"
                  class="form-control"
                  name="trim"
                  id="trim"
                  v-model="data.infoProject.trim"
                />
              </div>
            </div>

            <div class="row py-2">
              <label for="trim" class="col-sm-2 col-md-offset-2"
                >Cut Level:</label
              >
              <div class="col-sm-6">
                <select
                  id="cut_level"
                  class="form-control"
                  name="cut_level"
                  v-model="data.infoProject.cut_level"
                  @change="onChangeCut($event)"
                >
                  <option value="0">-Seleccione--</option>
                  <option value="2">XY-Cut (Level 2)</option>
                  <option value="3">Two-Stage XY (Level 3)</option>
                  <option value="4">XYZ-cut (Level 4)</option>
                  <option value="5">XYZW-cut (Level 5)</option>
                  <option value="5">Standard-cut (Level 6)</option>
                </select>
              </div>
            </div>
          </form>

          <div class="text-center">
            <p v-if="inProgress">
              <b>Optimizando. Por favor espere unos segundos...</b>
            </p>
            <div v-if="optimalonError">
              <p class="error-font">
                Se ha producido el siguiente error en Optimización:
              </p>
            </div>
            <div v-if="optimizado">
              <button
                type="button"
                @click="verOptimizacion()"
                class="btn btn-primary glyphicon glyphicon-eye-open"
              >
                Ver Optimización
              </button>
              <button
                type="button"
                @click="download_pdf()"
                class="glyphicon glyphicon-download-alt btn btn-primary"
              >
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            @click="$bvModal.hide('modal_optimizacion')"
            class="btn btn-secondary"
            data-dismiss="modal"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="enviarOptimizacion()"
            v-if="data.panels.length > 0"
            class="btn btn-primary"
          >
            Optimizar
          </button>
        </div>
        <pdf-viewer ref="pdfviewer" />
      </div>
    </b-modal>

    <!-- end Modal Para crear la Optimizacion -->

    <!-- Modal detalle pago -->

    <b-modal id="modaldetallepago" title="Detalle">
      <div class="modal-content">
        <div class="modal-body">
          <div>
            <h4>Detalle</h4>
            <div class="detalle-grid">
              <div class="labels">
                <div>
                  Cantidad de items:<span class="values">{{
                    cajaInfo.items ? cajaInfo.items.length : 0
                  }}</span>
                </div>
                <div>
                  Total:<span
                    class="values"
                    v-if="cajaInfo ? cajaInfo.total : 0"
                    >${{ cajaInfo.total }}</span
                  ><span
                    class="values"
                    v-if="cajaInfo ? cajaInfo.totalDescripcion : ''"
                    >({{ cajaInfo ? cajaInfo.totalDescripcion : "" }})</span
                  >
                </div>
                <div>
                  Saldo:<span
                    class="values"
                    v-if="cajaInfo ? cajaInfo.saldo : 0"
                    >${{ cajaInfo.saldo }}</span
                  >
                </div>
                <div>
                  Seña:<span class="values" v-if="cajaInfo ? cajaInfo.senia : 0"
                    >${{ cajaInfo.senia }}
                    <span
                      class="values"
                      v-if="cajaInfo ? cajaInfo.seniaDescripcion : ''"
                      >({{ cajaInfo ? cajaInfo.seniaDescripcion : "" }})</span
                    ></span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="items-table">
            <h4>Items</h4>
            <table class="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Valor</th>
                  <th>Creado por</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in cajaInfo.items" :key="index">
                  <td>{{ item.descripcion }}</td>
                  <td>${{ item.monto }}</td>
                  <td>{{ item.createdBy }}</td>
                  <td>{{ item.date }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td class="table-total"><b>Total</b></td>
                  <td
                    class="table-total"
                    colspan="3"
                    v-if="cajaInfo ? cajaInfo.total : 0"
                  >
                    <b>${{ cajaInfo.total }}</b>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div class="pagos-table">
            <h4>Pagos</h4>
            <table class="table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Creado por</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(pago, index) in cajaInfo.pagos" :key="index">
                  <template v-if="pago">
                    <td v-if="pago.tipo !== -1">{{ pago.tipo }}</td>
                    <td v-if="pago.tipo === -1">
                      Otro
                      <span v-if="pago.tipoPago">: {{ pago.tipoPago }}</span>
                    </td>
                    <td>{{ pago.descripcion ? pago.descripcion : "" }}</td>
                    <td>${{ pago.monto }}</td>
                    <td>{{ pago.createdBy }}</td>
                    <td>{{ pago.date }}</td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- <div class="modal-footer">
						<button type="button" class="btn btn-primary" data-dismiss="modal">Cerrar</button>
					</div> -->
      </div>
      <!-- </div> -->

      <!-- </div> -->
      <template #modal-footer>
        <b-button variant="light" @click="$bvModal.hide('modaldetallepago')">
          Cerrar
        </b-button>
      </template>
    </b-modal>

    <!-- Modal nota taller -->

         <b-modal id="modalNota" hide-footer size="lg">
        <template #modal-title>
         Nota Instalación
        </template>


         <form  @submit="saveNota(proyectoInfo.instalacion_nota)" @submit.stop.prevent>
          <b-overlay :show="loadingNota" opacity="0.6" spinner-variant="primary">
           <div class="row">

            <div class="col-lg-12"><div class="form-group">
                  <label class="control-label col-12" for="contenido">Descripción:</label>
                 <!-- <mc-wysiwyg id="contenido" v-model="notaInstalacion" :height="200" required></mc-wysiwyg> -->

                  <mc-wysiwyg id="contenido"  v-model="proyectoInfo.instalacion_nota" :height="200" required></mc-wysiwyg>

              </div>
            </div>


            <div class="col-lg-12 d-flex justify-content-end">
              <button type="submit" class="btn btn-success mr-2">Guardar</button>
              <button type="button" @click="$bvModal.hide('modalNota')"  class="btn btn-danger mr-2" data-dismiss="modal">Cerrar</button>
            </div>

          </div>
        </b-overlay>
       </form>

      </b-modal>

    <b-modal id="vercalco" hide-header size="md">
      <div v-html="legacySystemHTML"></div>

      <template #modal-footer> </template>
    </b-modal>
    <!-- Modal Tiempo de CP -->
    <b-modal
        ref="time"
        id="time"
        title="Seleccione el Tiempo"
        size="sm"
        hide-footer
      >
      <b-form @submit="setTimeUp"
              autocomplete="off"
      >
      <table>
          <tr style="height: 30px">
            <td>
              <input style="width: 100px"
                          v-model="time.hour"
                          placeholder="Horas"
                          class="form-control"
                          type="number"
                          min="0"
                          max="99"
               />
            </td>
            <td>:</td>
            <td>
              <input style="width: 100px"
                          v-model="time.min"
                          placeholder="Minutos"
                          class="form-control"
                          type="number"
                          min="0"
                          max="59"
               />
            </td>
            <td> horas</td>
          </tr>
        </table>
        </b-form>
        <div align="right">
          <button type="button" @click="setTimeUp()" class="btn btn-primary">Agregar</button>
        </div>
    </b-modal>
    <!--<image-gallery ref="ImgGallery"></image-gallery>-->
    <gallery-modal
    :token_project="this.proyectoInfo.token_project"
    :images_project="this.images_project"
    v-if="showmodal"
    @toggle-modal="ToggleModal()">
    </gallery-modal>
    <!-- Modal Calendario -->
    <b-modal
      ref="myModalCalendar"
      id="myModalCalendar"
      hide-footer
      title="Calendario"
      size="lg"
    >
    <Calendarselect
    :fechaindex="fechaindex"
    @set-fecha="setFecha"
    ></Calendarselect>
    </b-modal>

    <!-- ----------------- -->
  <!-- Modal Historial de Piezas -->

    <b-modal id="modalHistorialPieza" size="lg" title="Historial de Pieza">
      <div class="modal-content">
        <div class="modal-body">
          <div>

            <div class="detalle-grid">
              <div class="labels">

                <div>
                   <b-row>
                      <b-col cols="6" md="6">
                        <b>Id: </b><span class="values">{{listHistorialPieza[0].id_aux}}</span>
                      </b-col>
                      <b-col cols="6" md="6">
                           <b>Pieza: </b><span class="values">{{listHistorialPieza[0].pieza}}</span>                        
                      </b-col>


                  </b-row>
                  </div>


              </div>
            </div>
          </div>

            <table class="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Etapa</th>
                  <th>Estado</th>
                  <th>Usuario</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, index) in listHistorialPieza" :key="index">
                  <td>{{ item.created_at}}</td>
                  <td>{{ item.etapa }}</td>
                  <td>{{ item.estado }}</td>
                  <td>{{ item.nombre_completo }}</td>
                 </tr>
              </tbody>

            </table>
         
        </div>  

      </div>
      

      <template #modal-footer>
        <b-button variant="light" @click="$bvModal.hide('modalHistorialPieza')">
          Cerrar
        </b-button>
      </template>
    </b-modal>
    <!-- ----------------- -->


      <!-- Modal Historial de Piezas -->

    <b-modal id="modalHistorialTaller" size="lg" title="Historial de Taller">
      <div class="modal-content">
        <div class="modal-body">
          <div>
         
            <div class="detalle-grid">
              <div class="labels">

                <div>
                   <b-row>
                      <b-col cols="6" md="6">
                        <b>Id: </b><span class="values">{{listHistorialTaller[0].campo_id}}</span>
                      </b-col>  
                      <b-col cols="6" md="6">
                           <b>Descripción: </b><span class="values">{{listHistorialTaller[0].desc_campo}}</span>                        
                      </b-col>

                    
                  </b-row>
                  </div>

                                
              </div>
            </div>
          </div>
       
            <table class="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Etapa</th>
                  <th>Estado</th>                  
                  <th>Usuario</th>
                </tr>
              </thead>

              <tbody>  
                <tr v-for="(item, index) in listHistorialTaller" :key="index">
                  <td>{{ item.created_at}}</td>
                  <td>{{ item.etapa }}</td>
                  <td>{{ item.estado }}</td>
                  <td>{{ item.nombre_completo }}</td>
                 </tr>
              </tbody>
              
            </table>
         
        </div>  

      </div>
      
      <template #modal-footer>
        <b-button variant="light" @click="$bvModal.hide('modalHistorialTaller')">
          Cerrar
        </b-button>
      </template> 
    </b-modal>
    <!-- ----------------- -->


  <viewImgModal :estadoComp="estadoComp" :dataSrcImg="dataImage"
                    @close="closeComp"></viewImgModal>
  <!-- Modal Imagenes para los modulos -->

    <b-modal id="modalImagenesModulo" size="xl" :title="titleImagenes">
      <div class="modal-content">
        <div class="modal-body">

          <div v-if="imagesLoaded" class="flex-1">

                    <!-- lista de imagenes  -->

              <div class="vue-lightbox modulo_scroll">
                <ul>
                  <li :v-if="!noImages" v-for="i in images" :key="i.file" style="cursor:pointer;" class="mb-4">

                    <div class="container">
                      <div class="row">
                        <div class="col align-self-start px-0 ">
                          <img :id="i.file" @click="viewImg(i)" width="250" height="150" :src="i.src" alt="">
                        </div>
                      </div>
                    </div>


                  </li>
                  <div v-if="noImages" class="spinner-wrapper">
                    <h3>El proyecto no posee imagenes.</h3>
                  </div>
                </ul>

              </div>

          </div>


        </div>
      </div>

      <template #modal-footer>
        <b-button variant="light" @click="$bvModal.hide('modalImagenesModulo')">
          Cerrar
        </b-button>
      </template>
    </b-modal>







    <b-modal id="control-errores-pieza" size="lg" hide-header hide-footer>
      <div class="modal-content">
        <div class="modal-header">
          <b>Control de Errores del Proyecto de la Pieza: {{controlErrores.area_name}}</b>
          <button
            type="button"
            @click="$bvModal.hide('control-errores-pieza')"
            class="btn btn-default"
            data-dismiss="modal"
            >
            &times;
          </button>
        </div>

        <div class="modal-body">
          <table class="table">
            <tbody>
              <tr>
                <td><b>Area: </b></td>
                <td>
                  <select
                    style="min-width: 100px"
                    id="control-errores-area"
                    class="form-control"
                    name="control-errores-area"
                    v-model="controlErrores.proyecto_area_type"
                    disabled
                  >
                    <option
                      v-for="reg in listProyectoArea"
                      :value="reg.id"
                      :key="reg.id"
                    >
                      {{ reg.name }}
                    </option>
                  </select>
                </td>
              </tr>  
              <tr>  
                <td><b>Origen: </b></td>
                <td>
                  <select
                    style="min-width: 100px"
                    id="control-errores-etapa"
                    class="form-control"
                    name="control-errores-etapa"
                    v-model="controlErrores.proyecto_etapa_id"
                  >
                    <option
                      v-for="reg in listProyectoEtapa"
                      :value="reg.id"
                      :key="reg.id"
                    >
                      {{ reg.name }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td><b>¿Cuál fue el problema?: </b></td>
                <td>
                  <select
                    style="min-width: 100px"
                    id="control-errores-motivo"
                    class="form-control"
                    name="control-errores-motivo"
                    v-model="controlErrores.error_proyecto_motivo_id"
                  >
                    <option
                      v-for="reg in listErrorProyectoMotivo"
                      :value="reg.id"
                      :key="reg.id"
                    >
                      {{ reg.name }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td colspan="2"><b>Comentarios: </b></td>
              </tr> 
              <tr> 
                 <td colspan="2">
                    <textarea 
                    rows="2" maxlength="150" 
                      v-model="controlErrores.comentario" 
                      name="comentario" placeholder="" 
                      class="form-control form-control-sm">
                    </textarea>
                 </td>
              </tr>
            </tbody>
          </table>
          <table class="table table-hover">
              <thead>
                  <th>#</th>
                  <th>Area</th>
                  <th>Origen</th>
                  <th>¿Cuál fue el problema?</th>
                  <th>Comentarios</th>
                  <th>Acción</th>
              </thead>
              <tbody>
                  <template v-if="listControlErrorByPieza.length">
                      <tr v-for="(control, i) in listControlErrorByPieza" :key="i">
                          <td>{{ i+1 }}</td>
                          <td>{{ control.proyecto_area.name }}</td>
                          <td>{{ control.proyecto_etapa.name }}</td>
                          <td>{{ control.error_proyecto_motivo.name }}</td>
                          <td>{{ control.comentario }}</td>
                          <td>
                              <button class="btn btn-sm btn-danger" @click="delControlErrorPieza(control, controlErrores)"><font-awesome-icon icon="trash"></font-awesome-icon></button>
                          </td>
                      </tr>
                  </template>
                  <template v-if="listControlErrorByPieza.length==0">
                      <tr>
                          <td class="text-center" colspan="5"><strong>No posee errores registrados</strong></td>
                      </tr>
                  </template>
              </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            @click="saveControlErrorPieza(controlErrores)"
            class="btn btn-primary"
          >
            Guardar
          </button>
          <button
            type="button"
            @click="$bvModal.hide('control-errores-pieza')"
            class="btn btn-secondary"
            data-dismiss="modal"
          >
            Cerrar
          </button>
        </div>
      </div>
    </b-modal>

    <b-modal id="control-errores-modulo" size="lg" hide-header hide-footer>
      <div class="modal-content">
        <div class="modal-header">
          <b>Control de Errores del Proyecto del Módulo: {{controlErrores.area_name}}</b>
          <button
            type="button"
            @click="$bvModal.hide('control-errores-modulo')"
            class="btn btn-default"
            data-dismiss="modal"
            >
            &times;
          </button>
        </div>

        <div class="modal-body">
          <table class="table">
            <tbody>
              <tr>
                <td><b>Area: </b></td>
                <td>
                  <select
                    style="min-width: 100px"
                    id="control-errores-area"
                    class="form-control"
                    name="control-errores-area"
                    v-model="controlErrores.proyecto_area_type"
                    disabled
                  >
                    <option
                      v-for="reg in listProyectoArea"
                      :value="reg.id"
                      :key="reg.id"
                    >
                      {{ reg.name }}
                    </option>
                  </select>
                </td>
              </tr>  
              <tr>  
                <td><b>Origen: </b></td>
                <td>
                  <select
                    style="min-width: 100px"
                    id="control-errores-etapa"
                    class="form-control"
                    name="control-errores-etapa"
                    v-model="controlErrores.proyecto_etapa_id"
                  >
                    <option
                      v-for="reg in listProyectoEtapa"
                      :value="reg.id"
                      :key="reg.id"
                    >
                      {{ reg.name }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td><b>¿Cuál fue el problema?: </b></td>
                <td>
                  <select
                    style="min-width: 100px"
                    id="control-errores-motivo"
                    class="form-control"
                    name="control-errores-motivo"
                    v-model="controlErrores.error_proyecto_motivo_id"
                  >
                    <option
                      v-for="reg in listErrorProyectoMotivo"
                      :value="reg.id"
                      :key="reg.id"
                    >
                      {{ reg.name }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td colspan="2"><b>Comentarios: </b></td>
              </tr> 
              <tr> 
                 <td colspan="2">
                    <textarea 
                    rows="2" maxlength="150" 
                      v-model="controlErrores.comentario" 
                      name="comentario" placeholder="" 
                      class="form-control form-control-sm">
                    </textarea>
                 </td>
              </tr>
            </tbody>
          </table>
          <table class="table table-hover">
              <thead>
                  <th>#</th>
                  <th>Area</th>
                  <th>Origen</th>
                  <th>¿Cuál fue el problema?</th>
                  <th>Comentarios</th>
                  <th>Acción</th>
              </thead>
              <tbody>
                  <template v-if="listControlErrorByModulo.length">
                      <tr v-for="(control, i) in listControlErrorByModulo" :key="i">
                          <td>{{ i+1 }}</td>
                          <td>{{ control.proyecto_area.name }}</td>
                          <td>{{ control.proyecto_etapa.name }}</td>
                          <td>{{ control.error_proyecto_motivo.name }}</td>
                          <td>{{ control.comentario }}</td>
                          <td>
                              <button class="btn btn-sm btn-danger" @click="delControlErrorPieza(control, controlErrores)"><font-awesome-icon icon="trash"></font-awesome-icon></button>
                          </td>
                      </tr>
                  </template>
                  <template v-if="listControlErrorByModulo.length==0">
                      <tr>
                          <td class="text-center" colspan="5"><strong>No posee errores registrados</strong></td>
                      </tr>
                  </template>
              </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            @click="saveControlErrorModulo(controlErrores)"
            class="btn btn-primary"
          >
            Guardar
          </button>
          <button
            type="button"
            @click="$bvModal.hide('control-errores-modulo')"
            class="btn btn-secondary"
            data-dismiss="modal"
          >
            Cerrar
          </button>
        </div>
      </div>
    </b-modal>

    <b-modal id="control-errores-nota" size="lg" hide-header hide-footer>
      <div class="modal-content">
        <div class="modal-header">
          <b>Control de Errores del Proyecto sobre La Nota de Acción: {{controlErrores.area_name}}</b>
          <button
            type="button"
            @click="$bvModal.hide('control-errores-nota')"
            class="btn btn-default"
            data-dismiss="modal"
            >
            &times;
          </button>
        </div>

        <div class="modal-body">
          <table class="table">
            <tbody>
              <tr>
                <td><b>Area: </b></td>
                <td>
                  <select
                    style="min-width: 100px"
                    id="control-errores-area"
                    class="form-control"
                    name="control-errores-area"
                    v-model="controlErrores.proyecto_area_type"
                    disabled
                  >
                    <option
                      v-for="reg in listProyectoArea"
                      :value="reg.id"
                      :key="reg.id"
                    >
                      {{ reg.name }}
                    </option>
                  </select>
                </td>
              </tr>  
              <tr>  
                <td><b>Origen: </b></td>
                <td>
                  <select
                    style="min-width: 100px"
                    id="control-errores-etapa"
                    class="form-control"
                    name="control-errores-etapa"
                    v-model="controlErrores.proyecto_etapa_id"
                  >
                    <option
                      v-for="reg in listProyectoEtapa"
                      :value="reg.id"
                      :key="reg.id"
                    >
                      {{ reg.name }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td><b>¿Cuál fue el problema?: </b></td>
                <td>
                  <select
                    style="min-width: 100px"
                    id="control-errores-motivo"
                    class="form-control"
                    name="control-errores-motivo"
                    v-model="controlErrores.error_proyecto_motivo_id"
                  >
                    <option
                      v-for="reg in listErrorProyectoMotivo"
                      :value="reg.id"
                      :key="reg.id"
                    >
                      {{ reg.name }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td colspan="2"><b>Comentarios: </b></td>
              </tr> 
              <tr> 
                 <td colspan="2">
                    <textarea 
                    rows="2" maxlength="150" 
                      v-model="controlErrores.comentario" 
                      name="comentario" placeholder="" 
                      class="form-control form-control-sm">
                    </textarea>
                 </td>
              </tr>
            </tbody>
          </table>
          <table class="table table-hover">
              <thead>
                  <th>#</th>
                  <th>Area</th>
                  <th>Origen</th>
                  <th>¿Cuál fue el problema?</th>
                  <th>Comentarios</th>
                  <th>Acción</th>
              </thead>
              <tbody>
                  <template v-if="listControlErrorByNota.length">
                      <tr v-for="(control, i) in listControlErrorByNota" :key="i">
                          <td>{{ i+1 }}</td>
                          <td>{{ control.proyecto_area.name }}</td>
                          <td>{{ control.proyecto_etapa.name }}</td>
                          <td>{{ control.error_proyecto_motivo.name }}</td>
                          <td>{{ control.comentario }}</td>
                          <td>
                              <button class="btn btn-sm btn-danger" @click="delControlErrorNota(control, controlErrores)"><font-awesome-icon icon="trash"></font-awesome-icon></button>
                          </td>
                      </tr>
                  </template>
                  <template v-if="listControlErrorByNota.length==0">
                      <tr>
                          <td class="text-center" colspan="5"><strong>No posee errores registrados</strong></td>
                      </tr>
                  </template>
              </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            @click="saveControlErrorNota(controlErrores)"
            class="btn btn-primary"
          >
            Guardar
          </button>
          <button
            type="button"
            @click="$bvModal.hide('control-errores-nota')"
            class="btn btn-secondary"
            data-dismiss="modal"
          >
            Cerrar
          </button>
        </div>
      </div>
    </b-modal>

  </div>
</template>

<script>
import { HTTP } from "../../index";
import action_noteService from "./Services/action_noteService";
import proyectoService from "./Services/proyectosService";
import proyectoEtapaService from "./Services/proyectoEtapaService";
import proyectoAreaService from "./Services/proyectoAreaService";
import errorProyectoMotivoService from "./Services/errorProyectoMotivoService";
import controlErroresProyectoService from "./Services/controlErroresProyectoService";
import clienteService from "./Services/clienteService";
import cncService from "./Services/cncService";
import materialService from "./Services/materialService";
import piezaService from "./Services/piezaService";
import optimizarService from "./Services/optimizarService";
import codigoGService from "./Services/codigoGService";
import tapacantoService from "./Services/tapacantoService";
import moduloService from "./Services/moduloService";
import encuesta_tipoService from "./Services/encuesta_tipoService";
import encuestaRespuestaService from "./Services/encuestaRespuestaService";
import tallerHistorialService from "./Services/tallerHistorialService";

// import Vue from "vue";
import { environment } from "./Services/environment";
import PdfViewer from "./../pdf-view/Pdf-View.vue";
import StarRating from "vue-star-rating";

import ImageGallery from "./image-gallery.vue";
  import { McWysiwyg } from "@mycure/vue-wysiwyg";
import VueToastr from "vue-toastr";
import GalleryModal from './galleryWithFolder'
import Calendarselect from '../Taller/calendar/Calendarselect.vue'
import viewImgModal from '@/components/DesignDashboard/Tabs/ImagesAdmin/modal/ViewImage'

require("@/assets/css/calcos.css");

const CNCService = new cncService();
const ProyectoService = new proyectoService();
const ClienteService = new clienteService();
const MaterialService = new materialService();
const PiezaService = new piezaService();
const CodigoGService = new codigoGService();
const OptimizarService = new optimizarService();
const TapacantoService = new tapacantoService();
const ModuloService = new moduloService();
const Encuesta_tipoService = new encuesta_tipoService();
const EncuestaRespuestaService = new encuestaRespuestaService();
const ActionNoteService = new action_noteService();
const TallerHistorialService = new tallerHistorialService()
 

const ProyectoAreaService = new proyectoAreaService();
const ProyectoEtapaService = new proyectoEtapaService();
const ErrorProyectoMotivoService = new errorProyectoMotivoService();
const ControlErroresProyectoService = new controlErroresProyectoService();

export default {
  components: {
    PdfViewer,
    VueToastr,
    ImageGallery,
    StarRating,
    GalleryModal,
    Calendarselect,
    McWysiwyg,
    viewImgModal
  },
  data() {
    return {
      controlTaller: 0,
      esCajon: null,
      modulosArmados: [],
      modulosNoArmados: [],
      piezasSueltas: [],
      listPiezasByModulo: [],
      listPiezasOnlyByModulo: [],
      listPiezasSueltasByModulo: [],
      listErrorProyectoMotivo: [],
      listControlErrorByPieza: [],
      listControlErrorByNota: [],
      listControlErrorByModulo: [],
      listProyectoArea: [],
      listProyectoEtapa: [],
      listControlByArea: [],
      listHistorialPieza: [
          { id_aux: null, pieza: "" },
      ],

      listHistorialTaller:[{ id_aux: null, pieza: "" }],

      controlErrores: 
      { 
        id: 0,
        proyecto_area_type: 0, 
        proyecto_area_id: 0,
        proyecto_etapa_id:0,
        error_proyecto_motivo_id:0,
        comentario:""
      },
      time: {},
      timeTTP: {},
      capacidad: 0,
      cap: 0,
      updateIndex: 0,
      traslado: 0,
      capacidadProduccion: [],
      capacidadProduccionProy: [],
      tiempoTraslado:[],
      tiempoTrasladoProy:[],
      resetFormFields: true,
      form2: {},
      formTTP: {},
      instalaciones:[],
      mediciones:[],
      instalacion:{},
      medicion:{},
      fechaindex: -1,
      oper_inst: 0,
      oper_med: 0,
      fechatipo: 1,
      optimizado: "",
      inProgress: false,
      selectedTable: "",
      iframeHeight: "500px",
      clientes: [],
      proyectos: [],
      clienteSelected: 0,
      proyectoSelected: 0,
      proyectoInfo: "",
      calcos: [],
      clienteInfo: [],
      piezas: [],
      carasPrearmadas: {},
      piezasMaterial: [],
      images_project: [],
      user: "",
      estados: "",
      tapacantos2Change: "",
      materiales: "",
      materialSelected: 0,
      filterPieza: "",
      moduloModal: {},
      colorEstado: {},
      colorEstadoBackground: {},
      colorPiezaSuelta: {},
      colorPiezaSueltaBg: {},
      getNameEstado: {},
      cliente_proyecto: "",
      comentarioActual: "",
      array_levels_cut: [],
      array_info_levels_cut: [],
      newPanel: {},
      rotacion: "",
      data: {
        panels: [],
        parts: [],
        infoProject: [
          { projectName: "Cliente", sawKerf: 4, trim: 7, cut_level: "" },
        ],
      },
      saw_kert: 0,
      trim: 0,
      dpConfig: null,
      newInfo: {
        direccion: { value: "", type: "cliente" },
        telefono: { value: "", type: "cliente" },
        valor_total: { value: "", type: "proyecto" },
        saldo: { value: "", type: "proyecto" },
        senia: { value: "", type: "proyecto" },
        instalacion_fecha: { value: "", type: "proyecto" },
        instalacion_comentario: { value: "", type: "proyecto" },
        comentario_adicional: { value: "", type: "proyecto" },
        instalacion_nota: { value: "", type: "proyecto" }

      },
      editInfo: {
        direccion: false,
        telefono: false,
        valor_total: false,
        saldo: false,
        senia: false,
        instalacion_fecha: false,
        instalacion_comentario: false,
        comentario_adicional: false,
        instalacion_nota: false
      },
      filterLVeta: undefined,
      filterAVeta: undefined,
      materialesFiltered: [],
      materialesDictionary: {},
      waste: 0,
      loading: false,
      materialesDisenio: [],
      modInfo: [],
      showMeta: false,
      urlOrigin: "",
      usedWaste: false,
      responsible: "",
      haveResponsible: false,
      currentRate: 3,
      reportes: [
        {
          id: 0,
          nombre: "",
          esTexto: false,
          esPregunta: false,
          esEstrella: false,
          estado: false,
          descripcion: "",
          id_proyecto: 0,
          created_at: "",
          updated_at: "",
        },
      ],
      optimalonError: null,
      exportedBy: "",
      projectUrl: "",
      cajaInfo: {},
      externalProjectLinks: [],
      externalProjectLinksDescripcion: [],
      userRol: "",
      finalizado: false,
      legacySystemHTML: "",

      project_name: "",
      download: false,
      reload: 0,
      activeClass: true,
      step: 0,

      loadingPage: false,
      showmodal:false,
      actionNotes: [],
      proyectoID:0,
      redirectoken:null,
      estadoProyecto:null,

      loadingNota:false,
      notaInstalacion: "",
      test: false,
      va_suelta: "",
      forzarControl: 0,


      titleImagenes:'Imagenes',
      imagesLoaded: false,
      noImages: true,
      images: [],
      imagesObj: [],
      imgSrc: 1,
      imgSelected: [],

      estadoComp:false,
      dataImage: ""


    };
  },
  async mounted() {
    try {
      // document.getElementsByClassName('tab-pane active')[0].classList.remove('active');
      // document.getElementById('encuesta').classList.add('active');

      //this._ngxLoader.start();
      if (localStorage.getItem("forzar-control") !== null) {
        this.forzarControl = localStorage.getItem("forzar-control")
      }
      this.va_suelta = [
      { name: "Sí", value: 1 },
      { name: "No", value: 0 },
      ];
      this.userRol = localStorage.getItem("user-rol");
      this.urlOrigin = window.location.origin + window.location.pathname;
      this.dpConfig = {
        format: "YYYY/MM/DD HH:mm",
      };
      // this.zone.run(() => {
      let currentProject = parseInt(localStorage.getItem("currentProject"));
      if (currentProject > 0)
         this.proyectoID = currentProject;
      console.log("Proyecto Actual", currentProject);
      if (isNaN(currentProject)) {
        currentProject = 0;
        this.loadingPage = false
      }
      console.log("Proyecto Actual2", currentProject);
      if (currentProject > 0) {
        this.proyectoSelected = currentProject;
        try {
          await this.onChangeProyecto(currentProject);
        } catch (error) {
          //alert('Error', error)
        }
      }
      this.setearItem(),
      this.time = {
        hour: 0,
        min: 0,
      },
      this.form2 = {
      item: "",
      tiempo_disenio: "00:00",
      tiempo_produccion: "00:00",
      tiempo_medicion: "00:00",
      tiempo_instalacion: "00:00",
      coeficiente_multiplicador: "00:00",
      token_project: this.proyectoInfo.token_project,
      proyecto_id: this.proyectoID,
      exported: 1,
      };
      this.setearItemTTP(),
      this.formTTP = {
        descripcion: "",
        tiempo_traslado: "00:00",
        token_project: this.proyectoInfo.token_project,
        proyecto_id: this.proyectoID,
        exported: 1,
      };
      let res = await ClienteService.getAll();
      this.clientes = res.clientes;
      this.estados = await this.estadoGetAll();
      this.medicion = {
        id:0,
        fecha_medinst:"",
        hora_medinst:"",
        tipo_medinst: 0,
        comentario:"",
        token_project: this.proyectoInfo.token_project,
        proyecto_id: this.proyectoID,
        exported: 1,
        };
        this.instalacion = {
        id:0,
        fecha_medinst:"",
        hora_medinst:"",
        tipo_medinst: 1,
        comentario:"",
        token_project: this.proyectoInfo.token_project,
        proyecto_id: this.proyectoID,
        exported: 1,
        };
        this.getMedAll();
        this.getInstAll();
        this.getTTAll();
        this.getTTPAll();
        this.oper_med=0;
        this.oper_inst=0;
      // });
     /**
       * TODO Pasar como campo de tabla estados. Solo lo utiliza ActionNote temporalmente
     */
     this.getNameEstado = {
        0: "",
        1: "Falta",
        2: "Suspendido",
        3: "OK",
        4: "Pedido",
        5: "En proceso",
        6: "Stock",
        7: "Tira",
        8: "Optimizar",
        9: "Seleccione un estado",
      };
      /**
       * TODO Pasar como campo de tabla estados. Ya que se utiliza para todos los estados
       */
      this.colorEstado = {
        "Seleccione un estado": "#FFFFFF",
        Falta: "#F1948A",
        Suspendido: "#ABB2B9",
        OK: "#7DCEA0",
        Pedido: "#85C1E9",
        "En proceso": "#F9E79F",
        Stock: "#C39BD3",
        Tira: "#C39BD3",
        Optimizar: "#2987c5",
      };
      /**
       * TODO Pasar como campo de tabla estados. Ya que se utiliza para todos los estados
       */
      // 'OK': '#7dcea033',
      // 'Optimizar': '#2987c533'
      this.colorEstadoBackground = {
        "Seleccione un estado": "#FFFFFF",
        Falta: "#f1948a33",
        Suspendido: "#abb2b933",
        OK: "#c3e6cb",
        Pedido: "#85c1e91a",
        "En proceso": "#f9e79f1a",
        Stock: "#c39bd31a",
        Tira: "#c39bd31a",
        Optimizar: "#bee5eb",
      };

      this.colorPiezaSuelta [0] = "#FFFFFF"
      this.colorPiezaSuelta [1] = "#F1948A"
      this.colorPiezaSueltaBg [0] = "#FFFFFF"
      this.colorPiezaSueltaBg [1] = "#f1948a33"

      this.array_info_levels_cut[2] =
        "XY-Cut (Level 2): La forma más simple de cortar paneles, pero la peor utilización del material.";
      this.array_info_levels_cut[3] =
        "Two-Stage XY (Level 3): La versión mejorada del corte XY";
      this.array_info_levels_cut[4] =
        "XYZ-cut (Level 4): Un nivel más de corte en dirección horizontal";
      this.array_info_levels_cut[5] =
        "XYZW-cut (Level 5): Mejor utilización del material";
      this.array_info_levels_cut[6] =
        "Standard-cut (Level 6): Produce la mayor tasa de utilización del material y la menor cantidad de residuos";

      let self = this;
      this.newPanel = {
        nombre: "",
        largo: "",
        ancho: "",
        cantidad: 0,
      };

      this.data = {
        panels: [],
        parts: [],
        infoProject: [],
      };

      this.data.infoProject = {
        projectName: "Cliente",
        sawKerf: 4,
        trim: 7,
        cut_level: "",
      };

      // let tmp= localStorage.getItem('panels') ||
      // if(tmp){
      this.data.panels = JSON.parse(localStorage.getItem("panels")) || [];
      // }
      this.traerEncuesta();
      this.getCPAll();
      this.getCPPAll();
      this.setearItem();
      this.getControl();
      this.getProyectoAreas();
      this.getProyectoEtapas();
      this.getErrorProyectoMotivos();
    } catch (error) {
      console.log("error nuevo try", error);
    }
  },
  methods: {
    async showControlErrorNota (areaType, area) {
        this.controlErrores = 
          { 
            id: 0,
            proyecto_area_type: areaType, 
            proyecto_area_id: area.id,
            proyecto_etapa_id:0,
            error_proyecto_motivo_id:0,
            comentario:"",
            area_name: area.name,
            area: area
          }
        let query =  {
          proyecto_area_id: area.id
        }
        ControlErroresProyectoService.listControlErrorByNota(query).then((response) => {
          if (response.success && response.data != null) {    
              this.listControlErrorByNota = response.data
          }  
        });
        this.$bvModal.show("control-errores-nota");
    },

    async saveControlErrorNota(control) {
      let query =  {
          proyecto_area_id: control.proyecto_area_id
      }
      if (control.id == 0) {
          await ControlErroresProyectoService.store(control).then((result) => {
            if (result.success) {
              this.controlErrores = result.data
              ControlErroresProyectoService.listControlErrorByNota(query).then((response) => {
                  if (response.success && response.data != null) {    
                     this.listControlErrorByNota = response.data
                  }  
              });
              this.controlErrores = 
              { 
                id: 0,
                proyecto_area_type: control.proyecto_area_type, 
                proyecto_area_id: control.proyecto_area_id,
                proyecto_etapa_id:0,
                error_proyecto_motivo_id:0,
                comentario:"",
                area_name: control.area_name,
                area: control.area
              }
              control.area.hay_info_error = true
              this.$swal({
                title: "¡Enhorabuena!",
                text: "¡Control de error agregado con éxito!",
                type: "success",
              });
            }
          }).catch(e => {
              console.log(e);
              this.$swal({
                title: "!Error¡",
                text: "Imposible agregar el control de error." + e,
                type: "danger",
              });
          });
      }
      if (control.id > 0) {
        await ControlErroresProyectoService.update(control).then((result) => {
            if (result.success) {
              this.controlErrores = result.data
              ControlErroresProyectoService.listControlErrorByNota(query).then((response) => {
                  if (response.success && response.data != null) {    
                     this.listControlErrorByNota = response.data
                  }  
              });
              this.$swal({
                title: "¡Enhorabuena!",
                text: "¡Control de error actualizado con éxito!",
                type: "success",
              });
            }
          }).catch(e => {
              console.log(e);
              this.$swal({
                title: "!Error¡",
                text: "Imposible actualizar el control de error." + e,
                type: "danger",
              });
          });
      }  
    },
    async delControlErrorNota(control, controlError) {
            let query =  {
                proyecto_area_id: control.proyecto_area_id
            }
            swal({
                title: `¿Desea eliminar el Control de Error del Proyecto referente a la Nota de Acción: ${controlError.area.name}?`,
                text: 'No podrá ser recuperado',
                type: 'question',
                customClass: 'unfont-size',
                buttons: {
                    cancel: "Cancelar",
                    aceptar: {
                      text: "Confirmar",
                      value: true,
                    },
               },
            }).then(async (value) => {
              if (value) {
                  this.$refs.toastr.i('Eliminando control...');
                  ControlErroresProyectoService.delete(control).then((result) => {
                    if (result.success && result.data != null) {    
                      controlError.area.hay_info_error = result.data
                      ControlErroresProyectoService.listControlErrorByNota(query).then((response) => {
                        if (response.success && response.data != null) {    
                          this.listControlErrorByNota = response.data
                        }  
                      });
                      this.$refs.toastr.s('¡Control de Error eliminado con éxito!');
                    }  
                  });
              }
            })
    },
    async showControlErrorModulo (areaType, area) {
        this.controlErrores = 
          { 
            id: 0,
            proyecto_area_type: areaType, 
            proyecto_area_id: area.id,
            proyecto_etapa_id:0,
            error_proyecto_motivo_id:0,
            comentario:"",
            area_name: area.modulo,
            area: area
          }
        let query =  {
          proyecto_area_id: area.id
        }
        ControlErroresProyectoService.listControlErrorByModulo(query).then((response) => {
          if (response.success && response.data != null) {    
              this.listControlErrorByModulo = response.data
          }  
        });
        this.$bvModal.show("control-errores-modulo");
    },

    async saveControlErrorModulo(control) {
      let query =  {
          proyecto_area_id: control.proyecto_area_id
      }
      if (control.id == 0) {
          await ControlErroresProyectoService.store(control).then((result) => {
            if (result.success) {
              this.controlErrores = result.data
              ControlErroresProyectoService.listControlErrorByModulo(query).then((response) => {
                  if (response.success && response.data != null) {    
                     this.listControlErrorByModulo = response.data
                  }  
              });
              this.controlErrores = 
              { 
                id: 0,
                proyecto_area_type: control.proyecto_area_type, 
                proyecto_area_id: control.proyecto_area_id,
                proyecto_etapa_id:0,
                error_proyecto_motivo_id:0,
                comentario:"",
                area_name: control.area_name,
                area: control.area
              }
              if (control.proyecto_area_type == 6) {
                control.area.hay_info_error = true
              }
              if (control.proyecto_area_type == 5) {
                control.area.hay_info_error_cajon = true
              }
              this.$swal({
                title: "¡Enhorabuena!",
                text: "¡Control de error agregado con éxito!",
                type: "success",
              });
            }
          }).catch(e => {
              console.log(e);
              this.$swal({
                title: "!Error¡",
                text: "Imposible agregar el control de error." + e,
                type: "danger",
              });
          });
      }
      if (control.id > 0) {
        await ControlErroresProyectoService.update(control).then((result) => {
            if (result.success) {
              this.controlErrores = result.data
              ControlErroresProyectoService.listControlErrorByModulo(query).then((response) => {
                  if (response.success && response.data != null) {    
                     this.listControlErrorByModulo = response.data
                  }  
              });
              this.$swal({
                title: "¡Enhorabuena!",
                text: "¡Control de error actualizado con éxito!",
                type: "success",
              });
            }
          }).catch(e => {
              console.log(e);
              this.$swal({
                title: "!Error¡",
                text: "Imposible actualizar el control de error." + e,
                type: "danger",
              });
          });
      }  
    },
    
    async delControlErrorModulo(control, controlError) {
            let query =  {
                proyecto_area_id: control.proyecto_area_id
            }
            swal({
                title: `¿Desea eliminar el Control de Error del Proyecto del Módulo: ${controlError.area.modulo}?`,
                text: 'No podrá ser recuperado',
                type: 'question',
                customClass: 'unfont-size',
                buttons: {
                    cancel: "Cancelar",
                    aceptar: {
                      text: "Confirmar",
                      value: true,
                    },
               },
            }).then(async (value) => {
              if (value) {
                  this.$refs.toastr.i('Eliminando control...');
                  ControlErroresProyectoService.delete(control).then((result) => {
                    if (result.success && result.data != null) {    
                      if (controlError.proyecto_area_type == 6) {
                        controlError.area.hay_info_error = result.data
                      }
                      if (controlError.proyecto_area_type == 5) {
                        controlError.area.hay_info_error_cajon = result.data
                      }
                      ControlErroresProyectoService.listControlErrorByModulo(query).then((response) => {
                        if (response.success && response.data != null) {    
                          this.listControlErrorByModulo = response.data
                        }  
                      });
                      this.$refs.toastr.s('¡Control de Error eliminado con éxito!');
                    }  
                  });
              }
            })
    },

    async showControlErrorPieza (areaType, area) {
        this.controlErrores = 
          { 
            id: 0,
            proyecto_area_type: areaType, 
            proyecto_area_id: area.id,
            proyecto_etapa_id:0,
            error_proyecto_motivo_id:0,
            comentario:"",
            area_name: area.pieza,
            area: area
          }
        let query =  {
          proyecto_area_id: area.id
        }
        ControlErroresProyectoService.listControlErrorByPieza(query).then((response) => {
          if (response.success && response.data != null) {    
              this.listControlErrorByPieza = response.data
          }  
        });
        this.$bvModal.show("control-errores-pieza");
    },
    async saveControlErrorPieza(control) {
      let query =  {
          proyecto_area_id: control.proyecto_area_id
      }
      if (control.id == 0) {
          await ControlErroresProyectoService.store(control).then((result) => {
            if (result.success) {
              this.controlErrores = result.data
              ControlErroresProyectoService.listControlErrorByPieza(query).then((response) => {
                  if (response.success && response.data != null) {    
                     this.listControlErrorByPieza = response.data
                  }  
              });
              this.controlErrores = 
              { 
                id: 0,
                proyecto_area_type: control.proyecto_area_type, 
                proyecto_area_id: control.proyecto_area_id,
                proyecto_etapa_id:0,
                error_proyecto_motivo_id:0,
                comentario:"",
                area_name: control.area_name,
                area: control.area
              }
              if (control.proyecto_area_type == 1) {
                control.area.hay_info_error = true
              }
              if (control.proyecto_area_type == 2) {
                control.area.hay_info_error_tapacanto = true
              }
              if (control.proyecto_area_type == 3) {
                control.area.hay_info_error_prearmado = true
              }
              this.$swal({
                title: "¡Enhorabuena!",
                text: "¡Control de error agregado con éxito!",
                type: "success",
              });
            }
          }).catch(e => {
              console.log(e);
              this.$swal({
                title: "!Error¡",
                text: "Imposible agregar el control de error." + e,
                type: "danger",
              });
          });
      }
      if (control.id > 0) {
        await ControlErroresProyectoService.update(control).then((result) => {
            if (result.success) {
              this.controlErrores = result.data
              ControlErroresProyectoService.listControlErrorByPieza(query).then((response) => {
                  if (response.success && response.data != null) {    
                     this.listControlErrorByPieza = response.data
                  }  
              });
              this.$swal({
                title: "¡Enhorabuena!",
                text: "¡Control de error actualizado con éxito!",
                type: "success",
              });
            }
          }).catch(e => {
              console.log(e);
              this.$swal({
                title: "!Error¡",
                text: "Imposible actualizar el control de error." + e,
                type: "danger",
              });
          });
      }  
    },
    
    async delControlErrorPieza(control, controlError) {
            let query =  {
                proyecto_area_id: control.proyecto_area_id
            }
            swal({
                title: `¿Desea eliminar el Control de Error del Proyecto de la Pieza: ${controlError.area.pieza}?`,
                text: 'No podrá ser recuperado',
                type: 'question',
                customClass: 'unfont-size',
                buttons: {
                    cancel: "Cancelar",
                    aceptar: {
                      text: "Confirmar",
                      value: true,
                    },
               },
            }).then(async (value) => {
              if (value) {
                  this.$refs.toastr.i('Eliminando control...');
                  ControlErroresProyectoService.delete(control).then((result) => {
                    if (result.success && result.data != null) {    
                      if (controlError.proyecto_area_type == 1) {
                        controlError.area.hay_info_error = result.data
                      }
                      if (controlError.proyecto_area_type == 2) {
                        controlError.area.hay_info_error_tapacanto = result.data
                      }
                      if (controlError.proyecto_area_type == 3) {
                        controlError.area.hay_info_error_prearmado = result.data
                      }
                      ControlErroresProyectoService.listControlErrorByPieza(query).then((response) => {
                        if (response.success && response.data != null) {    
                          this.listControlErrorByPieza = response.data
                        }  
                      });
                      this.$refs.toastr.s('¡Control de Error eliminado con éxito!');
                    }  
                  });
              }
            })
    },

    async getProyectoAreas() {
      let data = await ProyectoAreaService.index();
      if (data ==undefined || data ==null || data.data == null) {
        this.listProyectoArea = []
        return
      }
      if (data != null && data.data != null)
        {
          this.listProyectoArea = data.data
        }
    },

    async getProyectoEtapas() {
      let data = await ProyectoEtapaService.index();
      if (data ==undefined || data ==null || data.data == null) {
        this.listProyectoEtapa = []
        return
      }
      if (data != null && data.data != null)
        {
          this.listProyectoEtapa = data.data
        }
    },

    async getErrorProyectoMotivos() {
      let data = await ErrorProyectoMotivoService.index();
      if (data ==undefined || data ==null || data.data == null) {
        this.listErrorProyectoMotivo = []
        return
      }
      if (data != null && data.data != null)
        {
          this.listErrorProyectoMotivo = data.data
        }
    },


    // Historia de pieza y taller
   
    async verHistorialPieza(item){
        // this.$refs.toastr.s(`Historial ID PIEZA: ${id_pieza}`);

        let response = await PiezaService.getHistorialPieza(item.id);

        if (response.success == true && response.data.length > 0){
          this.$bvModal.show("modalHistorialPieza");
          this.listHistorialPieza = response.data
        } else if(response.success == true && response.data.length == 0) {
          this.$refs.toastr.e(`No existe Historial para la pieza seleccionada: (${item.id_aux} - ${item.pieza} )`)
        } else{
          this.$refs.toastr.e("¡Error en Historial de pieza")
        }

    },

    async createHistorialPieza(pieza_id, estado_id, etapa){

      let etapa_id = null
      let usuario_id = localStorage.getItem("user-id");
      //let usuario = JSON.parse(localStorage.getItem("usuario")).id;
       
      if(etapa == "corte") {
        etapa_id = 1
      }

      if(etapa == "tapacantos") {
        etapa_id = 2
      }

      if(etapa == "prearmado") {
        etapa_id = 3
      }

      let data = { pieza_id,  estado_id, etapa_id, usuario_id};
      console.log(`createHistorialPieza()  (Taller) -> DATA: ${JSON.stringify(data)}`)
      let response = await PiezaService.createHistorialPieza(data);
      console.log(response)

    },



    
   // async verHistorialTaller(etapa_id,  item){
    async verHistorialTaller(etapa_id, id, campo_id){
        console.log( `verHistorialTaller  Etapa: ${etapa_id},   id ó auxiliar:${id} campo_id :  ${campo_id}  `)
        
        let response = await PiezaService.getHistorialTaller(etapa_id, campo_id);

        if (response.success == true && response.data.length > 0){
          this.$bvModal.show("modalHistorialTaller");
          this.listHistorialTaller = response.data
        } else if(response.success == true && response.data.length == 0) {
          this.$refs.toastr.e(`No existe Historial para el campo seleccionado: (${id} )`)
        } else{
          this.$refs.toastr.e("¡Error en Historial de pieza")
        }
        
    },


    async createHistorialTaller(estado_id, etapa, campo_id, desc_campo){

        let etapa_id = null
        let usuario_id = localStorage.getItem("user-id");
        //let usuario = JSON.parse(localStorage.getItem("usuario")).id;

         if(etapa == "stock") {
          // Nota de acciones
          etapa_id =  2   
        }

        if(etapa == "notas") {
          // Nota de acciones
          etapa_id =  6   
        }

        if(etapa == "cajones") {
          etapa_id = 7
        }

        if(etapa == "modulos") {
          etapa_id = 8
          desc_campo = `Módulo ${desc_campo}`
        }

        if(etapa == "control") {
          etapa_id = 9
          desc_campo = `Módulo ${desc_campo}`
        }


        let data = { estado_id, etapa_id, usuario_id, campo_id, desc_campo };
        console.log(`createHistorialTaller()  (Taller) -> DATA: ${JSON.stringify(data)}`)
        // let response = await TallerHistorialService.create(data); 
         let response = await PiezaService.createHistorialTaller(data);
        console.log(response)

    },

    loadImagen(modulo){
        // this.$refs.toastr.e(`Cargar Imagenes: (${JSON.stringify(modulo)} )`)
      console.log(`loadImagen  , Proyecto Id: ${modulo.proyecto_id}, Proyecto Token: ${this.proyectoInfo.token_project} , modulo: ${JSON.stringify(modulo.modulo)}`)
      let projectToken = this.proyectoInfo.token_project
      // projectToken =  "9a5b029cd1d6bb67b410d057c1ca7137"
      let currentfold = `M${modulo.modulo}`
      this.imagesLoaded = false
   // HTTP.get('/api/v2/images/' + this.projectToken+'/'+this.currentfold, {}
   HTTP.get('/api/v2/images/' + projectToken+'/'+currentfold, {}
      ).then(result => {
        if (result && result.data) {
          const images = result.data.response.imagenes
          //this.imagesObj = [...result.data.response.imagenes]
          // console.log("debe existir el objeto para poderlo editar")
          // images.map(i=>i.selected=false)
          // this.imagesObj = [...images]
        {}
          if (images.length > 0){

            this.$bvModal.show("modalImagenesModulo")
            this.titleImagenes = `Imagenes de Modulo ${modulo.modulo} (${currentfold})`
            this.images = images
            this.noImages = this.images.length === 0

          }else if(images.length == 0) {
            this.$refs.toastr.e(`No existe Imagenes para el modulo seleccionado: (${currentfold} )`)
          }
         // this.general = result.data.response.imagenes.length
        }
       //  console.log('Imagenes galeria: ', result)
      }).catch(result => {
        console.log('Imagenes galeria error: ', result)
         this.$refs.toastr.e(`No existe Imagenes para el modulo seleccionado: (${currentfold} )`)
      }).finally(() => {
        this.imagesLoaded = true
        // this.loadFolders()
      })
      

     },


    viewImg(imgSelected){
      // alert(`Selecciono la siguiente Imagen ${imgSelected}`)
      // this.dataImage = imgSelected
      this.dataImage = {img:imgSelected.file, items:this.images }
      this.estadoComp = true

    },

    closeComp(){
      this.estadoComp=false

    },



      /*
     this.imagesLoaded = false
      this.imgSelected = [].splice()

      HTTP.get('/api/v2/images/' + this.projectToken+'/'+this.currentfold, {}
      ).then(result => {
        if (result && result.data) {
          const images = result.data.response.imagenes
          //this.imagesObj = [...result.data.response.imagenes]
          // console.log("debe existir el objeto para poderlo editar")
          images.map(i=>i.selected=false)
          this.imagesObj = [...images]
          this.images = images
          this.noImages = this.images.length === 0
          this.general = result.data.response.imagenes.length
        }
       //  console.log('Imagenes galeria: ', result)
      }).catch(result => {
        console.log('Imagenes galeria error: ', result)
      }).finally(() => {
        this.imagesLoaded = true
        this.loadFolders()
      })
    },
    loadFolders(){
      var folder_des = {}
      this.des_folders = []
      HTTP.post('/api/v2/images/loadfolder', {token:this.projectToken}
      ).then(result => {
        // console.log('loadFolder respuesta: ', result.data.folders)
        const container = document.getElementById('fold_container')
        container.innerHTML = "";
         for (let folder of result.data.folders){
            var content = '<div  class="seccion-folder flex mt-2">'+
                    '<div id="'+folder.folder_name+'" style="width:90%">'+
                      folder.folder_name+
                    '</div>'+
                    '<div class="flex-1">'+
                      folder.files+
                    '</div>'+
                '</div>'
              container.innerHTML += content
            folder_des =
              {name:folder.folder_name,
              value:folder.folder_des}

           //console.log(this.des_folders);
            this.des_folders.push(folder_des)
         }

      }).catch(result => {
        console.log('respuesta: ', result)
      }).finally(() => {
        this.refreshfolders()
      })
    },
    */



    setForzarControl() {
      if (this.forzarControl == 0) {
        this.forzarControl = 1
        localStorage.setItem("forzar-control", 1)
        this.$refs.toastr.i("Forzado de Control Activado...")
        return
      }
      if (this.forzarControl == 1) {
        this.forzarControl = 0
        localStorage.setItem("forzar-control", 0)
        this.$refs.toastr.i("Forzado de Control Desactivado...");
      }
    },

    async getControl() {
      let data = await ModuloService.getControlByProy(this.proyectoID);
      if (data ==undefined || data ==null) {
        this.modulosArmados = []
        this.modulosNoArmados = []
        this.piezasSueltas = []
        this.controlTaller = 0
        return
      }
      if (data) {
        if (data.armados != null)
        {
          this.modulosArmados = data.armados
        }
        if (data.noarmados != null)
        {
          this.modulosNoArmados = data.noarmados
        }
        if (data.vansueltas != null)
        {
          this.piezasSueltas = data.vansueltas
        }
        if (data.control != null) {
          this.controlTaller = parseFloat(data.control)
        }
      }
    },

    async onChangeVaSuelta(suelta,pieza) {
          let reqData = {
            va_suelta: suelta.target.value,
            id: pieza.id,
          };
          console.log("onchangeVaSuelta---->", reqData);
          this.$refs.toastr.i("Actualizando Pieza...");

          let response = await PiezaService.changeVaSuelta(reqData);
          if (response) {
            if (response.status == true)
              this.$refs.toastr.s("¡Pieza actualizada con éxito!");
            else if (response.status == false)
              this.$refs.toastr.e("¡Error al actualizar pieza!");
          }
    },
    //Metodos de Teimpo de Traslado
    getDescripcionLink(i){
      try {
        return this.externalProjectLinksDescripcion[i] ? this.externalProjectLinksDescripcion[i]:"";
      } catch (error) {
        return "";
      }
    },
    loadTimesTTP() {
      let data;
      data = this.formTTP.tiempo_traslado.split(":");
      this.time.hour=parseInt(data[0]);
      this.time.min=parseInt(data[1]);
      this.oper = 2;
      this.$bvModal.show('time');
    },
    setTimeUpTTP(){
      this.oper = 0;
      this.$bvModal.hide('time');
      let timeUp = (this.time.hour > 9) ? this.time.hour.toString() : "0" + this.time.hour.toString();
      timeUp = (this.time.min > 9) ? timeUp + ":" + this.time.min.toString() : timeUp + ":" + "0" + this.time.min.toString();
      this.time.hour = 0;
      this.time.min = 0;
      this.formTTP.tiempo_traslado = timeUp;
    },
    onChangeItemTTP(traslado){
      this.formTTP.descripcion = traslado.descripcion;
      this.formTTP.tiempo_traslado = traslado.tiempo_traslado;
      this.formTTP.token_project = this.proyectoInfo.token_project;
      this.formTTP.exported = 1;
      this.formTTP.proyecto_id = this.proyectoID;
    },
    setearItemTTP(){
      this.updateIndex = 0;
      this.traslado = 0;
      this.formTTP.descripcion = "";
      this.formTTP.tiempo_traslado = "00:00";
      this.formTTP.token_project = this.proyectoInfo.token_project;
      this.formTTP.exported = 1;
      this.formTTP.proyecto_id = this.proyectoID;
    },

    editItemTTP(traslado) {
      this.updateIndex = traslado.id;
      this.traslado = traslado.descripcion;
      this.formTTP = {
        descripcion: traslado.descripcion,
        tiempo_traslado: traslado.tiempo_traslado,
        proyecto_id: this.proyectoID,
        exported: 1,
        token_project: this.proyectoInfo.token_project,
      };
    },

    storeTTP() {
      this.loadingPage = true;
      HTTP.post("/api/tiempo_traslado/proyecto", this.formTTP).then((result) => {
        if (result.data.success) {
          this.loadingPage = false;
          this.$swal({
            title: "¡Enhorabuena!",
            text: "¡Tiempo de Traslado agregado con éxito!",
            type: "success",
          });
          this.getTTPAll();
          this.setearItemTTP();
        }
      }).catch(e => {
          console.log(e);
          this.$swal({
            title: "!Error¡",
            text: "Imposible actualizar el Tiempo de Traslado. " + e,
            type: "danger",
          });
      });
    },
    updateTTP() {
      HTTP.put("/api/tiempo_traslado/proyecto/" + this.updateIndex, this.formTTP).then((result) => {
        this.loadingPage = false;
        if (result.data) {
          this.$swal({
            title: "¡Enhorabuena!",
            text: "¡Tiempo de Traslado actualizada con éxito!",
            type: "success",
          });
          this.updateIndex = 0;
          this.setearItemTTP();
          this.getTTPAll();
        }
      });
    },
    deleteItemTTP(id) {
      this.loadingPage = true;
      HTTP.delete("/api/tiempo_traslado/proyecto/" + id).then((result) => {
        this.loadingPage = false;
        if (result.data) {
          //this.successSwal.show();
          this.$swal({
            title: "¡Enhorabuena!",
            text: "¡Tiempo de Traslado borrado con éxito!",
            type: "success",
          });
          this.getTTPAll();
        }
      })
      .catch((error) => {
          console.log(error);
          this.$swal({
            title: "!Error¡",
            text: "Imposible eliminar el Tiempo de Traslado: " + error,
            type: "danger",
          });
      });
    },
    getTTAll() {
      //this.loadingPage = true;
      HTTP.get("/api/tiempo_traslado")
        .then((result) => {
          if (result.data != null) {
            this.tiempoTraslado = result.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
        this.loadingPage = false;
    },
    getTTPAll() {
      //this.loadingPage = true;
      HTTP.get("/api/tiempo_traslado/proyecto/" + this.proyectoID)
        .then((result) => {
          if (result.data != null) {
            this.tiempoTrasladoProy = result.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
        this.loadingPage = false;
    },
     //Métodos de Capacidad Produccion
    loadTimes(cap) {
     this.cap = cap;
     let data;

     switch (cap) {
        case 1:
          data = this.form2.tiempo_disenio.split(":");
          this.time.hour=parseInt(data[0]);
          this.time.min=parseInt(data[1]);
          break;
        case 2:
          data = this.form2.tiempo_produccion.split(":");
          this.time.hour=parseInt(data[0]);
          this.time.min=parseInt(data[1]);
          break;
        case 3:
          data = this.form2.tiempo_medicion.split(":");
          this.time.hour=parseInt(data[0]);
          this.time.min=parseInt(data[1]);
          break;
        case 4:
          data = this.form2.tiempo_instalacion.split(":");
          this.time.hour=parseInt(data[0]);
          this.time.min=parseInt(data[1]);
          break;
     }
     this.oper = 1;
     this.$bvModal.show('time');
    },
    setTimeUp(){
      if (this.oper === 1)
        this.setTimeUpCPP();
      if (this.oper ===2)
        this.setTimeUpTTP();
    },
    setTimeUpCPP(){
      this.oper = 0;
      this.$bvModal.hide('time');
      let timeUp = (this.time.hour > 9) ? this.time.hour.toString() : "0" + this.time.hour.toString();
      timeUp = (this.time.min > 9) ? timeUp + ":" + this.time.min.toString() : timeUp + ":" + "0" + this.time.min.toString();
      this.time.hour = 0;
      this.time.min = 0;

      switch (this.cap) {
        case 1:
          this.form2.tiempo_disenio = timeUp;
          break;
        case 2:
          this.form2.tiempo_produccion = timeUp;
          break;
        case 3:
          this.form2.tiempo_medicion = timeUp;
          break;
        case 4:
          this.form2.tiempo_instalacion = timeUp;
          break;
      }
    },
    onChangeItem(capacidad){
      this.form2.item = capacidad.item;
      this.form2.tiempo_disenio = capacidad.tiempo_disenio;
      this.form2.tiempo_produccion = capacidad.tiempo_produccion;
      this.form2.tiempo_medicion = capacidad.tiempo_medicion;
      this.form2.tiempo_instalacion = capacidad.tiempo_instalacion;
      this.form2.coeficiente_multiplicador = capacidad.coeficiente_multiplicador;
      this.form2.token_project = this.proyectoInfo.token_project;
      this.form2.proyecto_id = this.proyectoID;
      this.form2.exported = 1;
      //alert(this.loadedProjectId);
    },
    setearItem(){
      this.updateIndex = 0;
      this.capacidad = 0;
      this.form2.item = "";
      this.form2.tiempo_disenio = "";
      this.form2.tiempo_produccion = "";
      this.form2.tiempo_medicion = "";
      this.form2.tiempo_instalacion = "";
      this.form2.coeficiente_multiplicador = "";
      this.form2.token_project = this.proyectoInfo.token_project;
      this.form2.proyecto_id = this.proyectoID;
      this.form2.exported = 1;
      //alert(this.loadedProjectId);
    },
    inputItemValidity() {
      return this.resetFormFields ? null : this.form2.item != "";
    },
    inputTiempoDisenioValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form2.tiempo_disenio) &&
            this.form2.tiempo_disenio != "" &&
            Number.isInteger(parseFloat(this.form2.tiempo_disenio));
    },
    inputTiempoProduccionValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form2.tiempo_produccion) &&
            this.form2.tiempo_produccion != "" &&
            Number.isInteger(parseFloat(this.form2.tiempo_produccion));
    },
    inputTiempoMedicionValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form2.tiempo_medicion) &&
            this.form2.tiempo_medicion != "" &&
            Number.isInteger(parseFloat(this.form2.tiempo_medicion));
    },
    inputTiempoInstalacionValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form2.tiempo_instalacion) &&
            this.form2.tiempo_instalacion != "" &&
            Number.isInteger(parseFloat(this.form2.tiempo_instalacion));
    },
    inputCoeficienteMultiplicadorValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form2.coeficiente_multiplicador) &&
            this.form2.coeficiente_multiplicador != "";
    },
    editItem(capacidad) {
      this.updateIndex = capacidad.id;
      this.capacidad = capacidad.item;
      this.form2 = {
        item: capacidad.item,
        tiempo_disenio: capacidad.tiempo_disenio,
        tiempo_produccion: capacidad.tiempo_produccion,
        tiempo_medicion: capacidad.tiempo_medicion,
        tiempo_instalacion: capacidad.tiempo_instalacion,
        coeficiente_multiplicador: capacidad.coeficiente_multiplicador,
        token_project: this.proyectoInfo.token_project,
        proyecto_id: this.proyectoID,
        exported: 1,
      };
    },
    storeCP() {
      //verificar inputs
      let valido = true;
      this.resetFormFields = false;

      if (!this.inputCoeficienteMultiplicadorValidity()) {
        valido = false;
      }

      if (!valido) {
        return;
      }
      this.resetFormFields = true;
      this.loadingPage = true;
      HTTP.post("/api/capacidad_produccion/proyecto", this.form2).then((result) => {
        if (result.data.success) {
          this.loadingPage = false;
          this.$swal({
            title: "¡Enhorabuena!",
            text: "¡Capacidad de producción agregado con éxito!",
            type: "success",
          });
          this.getCPPAll();
          this.setearItem();
        }
      }).catch(e => {
          console.log(e);
          this.$swal({
            title: "!Error¡",
            text: "Imposible actualizar la capacidad de producción. " + e,
            type: "danger",
          });
      });
    },
    updateCP() {
      //verificar inputs
      let valido = true;
      this.resetFormFields = false;

      if (!this.inputCoeficienteMultiplicadorValidity()) {
        valido = false;
      }

      if (!valido) {
        return;
      }
      this.resetFormFields = true;
      this.loadingPage = true;

      HTTP.put("/api/capacidad_produccion/proyecto/" + this.updateIndex, this.form2).then((result) => {
        this.loadingPage = false;
        if (result.data) {
          this.$swal({
            title: "¡Enhorabuena!",
            text: "¡Capacidad de Producción actualizada con éxito!",
            type: "success",
          });
          this.updateIndex = 0;
          this.setearItem();
          this.getCPPAll();
        }
      });
    },
    deleteItem(id) {
      this.loadingPage = true;
      HTTP.delete("/api/capacidad_produccion/proyecto/" + id).then((result) => {
        this.loadingPage = false;
        if (result.data) {
          //this.successSwal.show();
          this.$swal({
            title: "¡Enhorabuena!",
            text: "¡Capacidad de producción borrado con éxito!",
            type: "success",
          });
          this.getCPPAll();
        }
      })
      .catch((error) => {
          console.log(error);
          this.$swal({
            title: "!Error¡",
            text: "Imposible eliminar la capacidad de producción: " + error,
            type: "danger",
          });
      });
    },
    getCPAll() {
      //this.loadingPage = true;
      HTTP.get("/api/capacidad_produccion")
        .then((result) => {
          if (result.data != null) {
            this.capacidadProduccion = result.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
       // this.loadingPage = false;
    },
    getCPPAll() {
      //this.loadingPage = true;
      HTTP.get("/api/capacidad_produccion/proyecto/" + this.proyectoID)
        .then((result) => {
          if (result.data != null) {
            this.capacidadProduccionProy = result.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
       // this.loadingPage = false;
    },
    //------------------------------------------
    showCalendar (fechatipo) {
      this.fechatipo = fechatipo;
      this.$bvModal.show("myModalCalendar");
    },
    setFecha (fecha) {
      //alert(index);
      if (this.fechatipo == 0)
         this.medicion.fecha_medinst = fecha;
      if (this.fechatipo == 1)
         this.instalacion.fecha_medinst = fecha;
      this.$forceUpdate();
      this.$bvModal.hide("myModalCalendar");
    },
    //Métodos de Medicion Instalacion
    setearMedInst(tipo) {
      if (tipo) {
        this.instalacion.id = 0;
        this.instalacion.fecha_medinst = "";
        this.instalacion.hora_medinst = "";
        this.instalacion.tipo_medinst = 1;
        this.instalacion.comentario = "";
        this.instalacion.token_project = this.proyectoInfo.token_project;
        this.instalacion.proyecto_id = this.proyectoID;
        this.instalacion.exported = 1;
      }
      else
      {
        this.medicion.id = 0;
        this.medicion.fecha_medinst = "";
        this.medicion.hora_medinst = "";
        this.medicion.tipo_medinst = 0;
        this.medicion.comentario = "";
        this.medicion.token_project = this.proyectoInfo.token_project;
        this.medicion.proyecto_id = this.proyectoID;
        this.medicion.exported = 1;
      }
    },
    getMedAll() {
      //this.loadingPage = true;
      this.mediciones = [];
      HTTP.get("/api/medicion_instalacion/medtaller/" + this.proyectoID)
        .then((result) => {
          //alert('entre');
          if (result.data != null) {
            this.mediciones = result.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
       // this.loadingPage = false;
    },
    getInstAll() {
      //this.loadingPage = true;
      this.instalaciones = [];
      HTTP.get("/api/medicion_instalacion/installer/" + this.proyectoID)
        .then((result) => {
          if (result.data != null) {
            this.instalaciones = result.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
        //this.loadingPage = false;
    },
    operInstalacion(valor) {
      if (valor)
        this.setearMedInst(valor);
      this.oper_inst=valor;
    },
    addFechaInstalacion() {
      //verificar inputs
      if (this.instalacion.fecha_medinst == "")
      {
        this.$swal({
            title: "!Error¡",
            text: "La fecha no puede estar vacia.",
            type: "danger",
          });
        return;
      }
      if (this.instalacion.hora_medinst == "")
      {
        this.$swal({
            title: "!Error¡",
            text: "La hora no puede estar vacia.",
            type: "danger",
          });
        return;
      }
      this.loadingPage = true;
      HTTP.post("/api/medicion_instalacion", this.instalacion).then((result) => {
        this.loadingPage = false;
        //alert(result.data.success);
          if (result.data.success) {
            this.$swal({
              title: "¡Enhorabuena!",
              text: "¡Fecha de Instalación agregada con éxito!",
              type: "success",
            });
            this.getInstAll();
            this.setearMedInst(1);
            this.oper_inst=0;
          }
      })
      .catch((error) => {
          console.log(error);
          this.$swal({
            title: "!Error¡",
            text: "Imposible actualizar Fecha de Instalación: " + error,
            type: "danger",
          });
      });
    },
    operMedicion(valor) {
      if (valor ==0)
        this.setearMedInst(valor);
      this.oper_med=valor;
    },
    addFechaMedicion() {
      //verificar inputs
      if (this.medicion.fecha_medinst == "")
      {
        this.$swal({
            title: "!Error¡",
            text: "La fecha no puede estar vacia.",
            type: "danger",
          });
        return;
      }
      if (this.medicion.hora_medinst == "")
      {
        this.$swal({
            title: "!Error¡",
            text: "La hora no puede estar vacia.",
            type: "danger",
          });
        return;
      }
      this.loadingPage = true;
      console.log(this.medicion);
      HTTP.post("/api/medicion_instalacion", this.medicion).then((result) => {
        this.loadingPage = false;
        //alert(result.data.success);
          if (result.data.success) {
            this.$swal({
              title: "¡Enhorabuena!",
              text: "¡Fecha de Medición agregada con éxito!",
              type: "success",
            });
            this.getMedAll();
            this.setearMedInst(0);
            this.oper_med=0;
          }
      })
      .catch((error) => {
          console.log(error);
          this.$swal({
            title: "!Error¡",
            text: "Imposible actualizar Fecha de Medición: " + error,
            type: "danger",
          });
      });
    },
    editFechaInstalacion(inst) {
      this.operInstalacion(2);
      this.instalacion.id = inst.id;
      this.instalacion.fecha_medinst = this.$moment(inst.fecha_medinst).format("DD/MM/YYYY");
      this.instalacion.hora_medinst = this.$moment(inst.fecha_medinst).format("hh:mm");
      this.instalacion.comentario = inst.comentario;
    },
     editFechaMedicion(med) {
      this.operMedicion(2);
      this.medicion.id = med.id;
      this.medicion.fecha_medinst = this.$moment(med.fecha_medinst).format("DD/MM/YYYY");
      this.medicion.hora_medinst = this.$moment(med.fecha_medinst).format("hh:mm");
      this.medicion.comentario = med.comentario;
    },
    updateFechaInstalacion() {
      //verificar inputs
      if (this.instalacion.fecha_medinst == "")
      {
        this.$swal({
            title: "!Error¡",
            text: "La fecha no puede estar vacia.",
            type: "danger",
          });
        return;
      }
      if (this.instalacion.hora_medinst == "")
      {
        this.$swal({
            title: "!Error¡",
            text: "La hora no puede estar vacia.",
            type: "danger",
          });
        return;
      }
      this.loadingPage = true;
      HTTP.put("/api/medicion_instalacion/"+ this.instalacion.id, this.instalacion).then((result) => {
        this.loadingPage = false;
        //alert(result.data.success);
          if (result.data.success) {
            this.$swal({
              title: "¡Enhorabuena!",
              text: "¡Fecha de Instalación actualizada con éxito!",
              type: "success",
            });
            this.getInstAll();
            this.setearMedInst(1);
            this.oper_inst=0;
          }
      })
      .catch((error) => {
          this.loadingPage = false;
          console.log(error);
          this.$swal({
            title: "!Error¡",
            text: "Imposible actualizar Fecha de Instalación: " + error,
            type: "danger",
          });
      });
    },
    operMedicion(valor) {
      this.oper_med=valor;
    },
    updateFechaMedicion() {
      //verificar inputs
      if (this.medicion.fecha_medinst == "")
      {
        this.$swal({
            title: "!Error¡",
            text: "La fecha no puede estar vacia.",
            type: "danger",
          });
        return;
      }
      if (this.medicion.hora_medinst == "")
      {
        this.$swal({
            title: "!Error¡",
            text: "La hora no puede estar vacia.",
            type: "danger",
          });
        return;
      }
      this.loadingPage = true;
      console.log(this.medicion);
      HTTP.put("/api/medicion_instalacion/"+ this.medicion.id, this.medicion).then((result) => {
        this.loadingPage = false;
        //alert(result.data.success);
          if (result.data.success) {
            this.$swal({
              title: "¡Enhorabuena!",
              text: "¡Fecha de Medición actualizada con éxito!",
              type: "success",
            });
            this.getMedAll();
            this.setearMedInst(0);
            this.oper_med=0;
          }
      })
      .catch((error) => {
          this.loadingPage = false;
          console.log(error);
          this.$swal({
            title: "!Error¡",
            text: "Imposible actualizar Fecha de Medición: " + error,
            type: "danger",
          });
      });
    },
    deleteFechaMedInst(id, e) {
      e.preventDefault();
      this.loadingPage = true;
      HTTP.delete("/api/medicion_instalacion/" + id).then((result) => {
        this.loadingPage = false;
        if (result.data) {
          //this.successSwal.show();
          this.$swal({
            title: "¡Enhorabuena!",
            text: "¡Fecha borrada con éxito!",
            type: "success",
          });
         this.getMedAll();
         this.getInstAll();
        }
      })
      .catch((error) => {
          console.log(error);
          this.$swal({
            title: "!Error¡",
            text: "Imposible eliminar la Fecha: " + error,
            type: "danger",
          });
      });
    },
    //-------------------------------
    async enviarReporte() {
      let usuario = JSON.parse(localStorage.getItem("usuario")).id;

      let sinCompletar = this.reportes.filter(
        (x) => x.descripcion == "" || x.descripcion == 0
      );

      if (sinCompletar.length == 0) {
        let obj = {
          reportes: this.reportes,
          id: this.proyectoInfo.id,
          usuario,
        };

        let data = await EncuestaRespuestaService.store(obj);
        if (data) {
          this.$refs.toastr.s("Gracias por tomar su tiempo");
          this.activeClass = true;
          this.onChangeProyecto(obj.id);
          this.traerEncuesta();
          //document.getElementsByClassName('tab-pane active')[0].classList.remove('active');
          this.step = 0;
          //document.getElementById('general').classList.add('active');
        }
      } else this.$refs.toastr.i("Complete la encuesta");
    },
    finalizarProyectoSwal() {
      this.$swal({
        title: "Finalizar",
        text: "¿Finalizó la instalación?",
        type: "question",
        buttons: ["No", "Si"],
      }).then((result) => {
        console.log(result)
        if (result) {
          console.log("dialogo");
          this.finalizarProyecto();
        } else {
          this.$router.push({
            name: "Calendario",
            params: { id: this.proyectoInfo.id, instfecha:this.proyectoInfo.instalacion_fecha },
          });
        }
      });
    },
    async confirmationAllTapacantos() {
      this.$swal({
        title: "¿Desea completar todos los tapcantos?",
        text: "Todos los tapacantos tendrán estado Ok",
        type: "question",
        buttons: true,
      }).then((result) => {
        if (result) {
          this.handlerSwalTapacantos();
          //this.changeEstadoPiezaPost(pieza, estado_id, estado_key, etapa);
        }
      });
    },
    async handlerSwalTapacantos() {
      // console.log(event);
      for await (let item of this.tapacantos2Change) {
        item.estado_id = 3;
        this.onChangeEstadoTapacantoSwall(3, item);
      }
      // this.tapacantos2Change.map(item => {
      // });
    },
    getEstado(estado_id = 0) {
      for (var i = 0; i < this.estados.length; i++) {
        if (this.estados[i].id == estado_id) {
          return this.estados[i].estado;
        }
      }
    },
    async getPiezasModulo() {
      /*let piezas = [];
      if (this.piezas && modulo_id === 0) {
        piezas = this.piezas.filter((item) => {
          return item.modulo_id === this.moduloModal;
        });
      }
      return piezas;*/
      this.listPiezasByModulo = []
      this.listPiezasOnlyByModulo = []
      let data = await PiezaService.listByModulo(this.moduloModal.id);
      if (data !=undefined && data !=null) {
        this.listPiezasByModulo = data.piezas
        this.listPiezasOnlyByModulo = data.piezas
        console.log('ListPiezasByModulo: ', this.listPiezasByModulo)
      }
    },
    showModalPiezas(modulo_id, modulo,esCajon,armado=false) {
      this.moduloModal = modulo;
      this.getPiezasModulo()
      this.esCajon = esCajon
      this.$bvModal.show("list-piezas");
    },
    showModalPiezasOnly(modulo) {
      this.moduloModal = modulo;
      this.getPiezasModulo()
      this.$bvModal.show("list-piezas-only");
    },
    async getPiezasSueltasModulo(moduloId) {
      let data = await PiezaService.listSueltasByModulo(moduloId);
      if (data ==undefined || data ==null) {
        this.listPiezasSueltasByModulo = []
        return
      }
      if (data !=undefined && data !=null) {
        this.listPiezasSueltasByModulo = data.piezas
        console.log('ListPiezasSueltasByModulo: ', this.listPiezasSueltasByModulo)
      }
    },
    showModalPiezasSueltas(moduloId) {
      this.getPiezasSueltasModulo(moduloId)
      this.$bvModal.show("list-piezas-sueltas");

    },
    async changeEstadoModuloPost(modulo, estado_id, esCajon) {
      this.$refs.toastr.i("Actualizando estado de módulo...");
      var user = JSON.parse(localStorage.getItem('usuario'))
      console.log('changeEstadoModuloPost: ', modulo.armado)
      if (esCajon === false && modulo.armado !== "No" && modulo.armado !== "Si") {
        this.$swal({
            title: "Módulo",
            text: "¿Finalmente, el  módulo viaja armado?",
            type: "question",
            buttons: ["No", "Si"],
          }).then(async (result) => {
            modulo.armado="No"
            if (result == true) {
              modulo.armado="Si"
            }
            let data = { id: modulo.id, estado_id: parseInt(estado_id),userid:user.id, armado:modulo.armado };
            let response = await ModuloService.update(data);
            if (response.modulo) {
              modulo.estado = response.modulo.estado;
              modulo.estado_id = response.modulo.estado_id;
              this.$refs.toastr.s("¡Módulo actualizado!");
            }
            if (modulo.armado =="Si") {
               this.showModalPiezas(modulo.id,modulo,esCajon)
            }
          });
      }
      else {
          let data = {}
          if ((esCajon == true) && (modulo.armado=="Si")){
            data = { id: modulo.id, estado_id: parseInt(estado_id),userid:user.id, armado:modulo.armado };
          }
          else {
            data = { id: modulo.id, estado_id: parseInt(estado_id),userid:user.id };
          }
          let response = await ModuloService.update(data);
          if (response.modulo) {
            modulo.estado = response.modulo.estado;
            modulo.estado_id = response.modulo.estado_id;
            this.$refs.toastr.s("¡Módulo actualizado!");
          }
          if ((modulo.armado =="Si") && (esCajon == false)) {
               this.showModalPiezas(modulo.id,modulo,esCajon)
          }
      }
    },
    changeEstadoModulo(modulo, etapa, estado_id, esCajon) {     
    
       this.createHistorialTaller(3, etapa, modulo.id,  modulo.modulo)
      if (modulo.comentario != undefined && modulo.comentario != null) {
        this.$swal({
          title: "Comentarios",
          text: modulo.comentario,
          type: "question",
          showCancelButton: true,
        }).then((result) => {
          if (result) {
            if (esCajon == true) {
              modulo.armado="Si"
            }
            this.changeEstadoModuloPost(modulo, estado_id, esCajon);      
          }
        });
      } else {
        if (esCajon == true) {
            modulo.armado="Si"
        }
        this.changeEstadoModuloPost(modulo, estado_id, esCajon);       
      }
      
    },
    async changeControlEstadoModulo(modulo, estado_id) {
        this.createHistorialTaller(3, 'control', modulo.id,  modulo.modulo)
        this.getPiezasSueltasModulo(modulo.id).then(r=>{
          var user = JSON.parse(localStorage.getItem('usuario'))
          let data = { id: modulo.id, control_estado_id: parseInt(estado_id),userid:user.id }
          if (modulo.piezas_sueltas_controladas == 0 && this.listPiezasSueltasByModulo.length > 0){
            this.showModalPiezasSueltas(modulo.id)
            return
          }
          if ((modulo.piezas_sueltas_controladas ==1) || (this.listPiezasSueltasByModulo.length == 0)) {
            data = { id: modulo.id, control_estado_id: parseInt(estado_id),userid:user.id, piezas_sueltas_controladas: 1 }
            this.updateModulo(data, modulo)
          }
        }).catch(r=>{
          this.$noty.error(r.response.data.error);
        });  
    },

    async onChangeControlEstadoModulo(estado_id, etapa, modulo) {
        this.getPiezasSueltasModulo(modulo.id).then(r=>{
          var user = JSON.parse(localStorage.getItem('usuario'))
          var estado =  parseInt(estado_id.target.value)
          let data = { id: modulo.id, control_estado_id: estado,userid:user.id };
          if (estado ==3) {
            if (modulo.piezas_sueltas_controladas ==0 && this.listPiezasSueltasByModulo.length > 0) {
              this.showModalPiezasSueltas(modulo.id)
              this.getControl()
              return
            }
            if ((modulo.piezas_sueltas_controladas ==1) || (this.listPiezasSueltasByModulo.length == 0)) {
              data = { id: modulo.id, control_estado_id: estado,userid:user.id, piezas_sueltas_controladas: 1 };
              this.updateModulo(data, modulo)
              this.createHistorialTaller(parseInt(estado_id.target.value), etapa, modulo.id,  modulo.modulo)
            }
          }
          if (estado !=3) {
            this.updateModulo(data, modulo)
            this.createHistorialTaller(parseInt(estado_id.target.value), etapa, modulo.id,  modulo.modulo)
          }
        }).catch(r=>{
          this.$noty.error(r.response.data.error);
        });  
    },

    async updateModulo(data, modulo) {
      this.$refs.toastr.i("Actualizando control estado del módulo...");
      let response = await ModuloService.update(data);
      if (response.modulo) {
        this.getControl()
        this.$refs.toastr.s("¡Módulo actualizado!");
      }
    },
    changeControlPiezaSueltaEstado(pieza, estado_id) {
        var user = JSON.parse(localStorage.getItem('usuario'))
        let data = { id: pieza.id, suelta_estado_id: parseInt(estado_id),userid:user.id }
        this.updatePieza(data, pieza)
    },
    async onChangeControlPiezaSueltaEstado(estado_id, pieza) {
        var user = JSON.parse(localStorage.getItem('usuario'))
        let data = { id: pieza.id, suelta_estado_id: parseInt(estado_id.target.value),userid:user.id };
        this.updatePieza(data, pieza)
    },
    changeControlEstadoPieza(pieza, estado_id) {
        var user = JSON.parse(localStorage.getItem('usuario'))
        let data = { id: pieza.id, control_estado_id: parseInt(estado_id),userid:user.id }
        this.updatePieza(data, pieza)
    },
    async onChangeControlEstadoPieza(estado_id, pieza) {
        var user = JSON.parse(localStorage.getItem('usuario'))
        let data = { id: pieza.id, control_estado_id: parseInt(estado_id.target.value),userid:user.id };
        this.updatePieza(data, pieza)
    },
    async updatePieza(data, pieza) {
      this.$refs.toastr.i("Actualizando la pieza...");
      let response = await PiezaService.changeVaSuelta(data);
      if (response.pieza) {
        //pieza.control_estado_id = response.pieza.control_estado_id
        //pieza.suelta_estado_id = response.pieza.suelta_estado_id
        //pieza.sueltaestado = response.pieza.sueltaestado
        this.getControl()
        this.getPiezasSueltasModulo(pieza.modulo_id)
        this.$refs.toastr.s("¡Pieza actualizada!");
      }
    },
    async onChangeEstadoModulo(estado_id, etapa, modulo) {
      // console.log(`Histoiral Modulos xxx: ${JSON.stringify(modulo)}`)
  
      this.$refs.toastr.i("Actualizando estado de módulo...");
      var user = JSON.parse(localStorage.getItem('usuario'))
      let data = {
        id: modulo.id,
        estado_id: parseInt(estado_id.target.value),
        armar: modulo.armado,
        userid: user.id
      };

      let response = await ModuloService.update(data);
      if (response.modulo) {
        modulo.estado = response.modulo.estado;
        this.$refs.toastr.s("¡Módulo actualizado!");

        this.createHistorialTaller(parseInt(estado_id.target.value), etapa, modulo.id,  modulo.modulo)
      
        //  async createHistorialTaller(estado_id, etapa, campo_id, desc_campo){
      }
    },
    async onChangeModuloArmado(armado, modulo) {
      this.$refs.toastr.i("Actualizando Armado del módulo...");
      var user = JSON.parse(localStorage.getItem('usuario'))
      let data = {
        id: modulo.id,
        armado: armado.target.value,
        userid: user.id
      };

      let response = await ModuloService.updateArmado(data);
      if (response.success) {
        this.$refs.toastr.s("¡Módulo actualizado!")
      }
    },
    async onChangeEstadoTapacantoSwall(estado_id, tapacanto) {
      console.log(`onChangeEstadoTapacantoSwall (Taller) ${estado_id}`);
      let data = {
        id: tapacanto.id,
        usuario: "",
        estado_id: parseInt(estado_id),
      };
      this.$refs.toastr.i("Actualizando estado de tapacanto...");
      data.usuario = localStorage.getItem("user-id");
      let response = await TapacantoService.update(data);


      if (response.tapacanto) {
        this.$refs.toastr.s("¡Tapacanto actualizado!");
        this.createHistorialPieza(tapacanto.id, parseInt(estado_id), "tapacantos")
      }
    },
    async onChangeEstadoTapacanto(estado_id, tapacanto) {
      //this.$refs.toastr.i('Actualizando estado de tapacanto...');
      // this.$refs.toastr.Add({
      // 		msg: "You cant click close, auto closed 8 sec.. with timeout options",
      // 		title: "Sticky2",
      // 		clickClose: false,
      // 		timeout: 8000,
      // 		position: "toast-top-center",
      // 		type: "error"
      // 	});
      let data = {
        id: tapacanto.id,
        usuario: "",
        estado_id: parseInt(estado_id.target.value),
      };
      this.$refs.toastr.i("Actualizando estado de tapacanto...");
      data.usuario = JSON.parse(localStorage.getItem("usuario"));
      let response = await TapacantoService.update(data).then(a=>{
        return a;
      }).catch(a=>{
        this.$noty.error(a.response.data.error);
      });

      if (response.tapacanto) {
        this.$refs.toastr.s("¡Tapacanto actualizado!");
        this.createHistorialPieza(tapacanto.id, parseInt(estado_id.target.value), "tapacantos")
      }
    },
    async enviarOptimizacion() {
      this.optimalonError = undefined;
      this.data.parts = [];
      let rotable = "";
      let self = this;
      this.piezasMaterial.map((item) => {
        if (item.estado.estado === "Optimizar") {
          if (self.rotacion === "seleccionadas" || !self.rotacion) {
            rotable = item.rotable === "SI" ? "YES" : "NO";
          } else {
            rotable = self.rotacion === "todas" ? "YES" : "NO";
          }

          self.data.parts.push({
            estado: "Yes",
            nombre: item.pieza,
            lveta: item.lveta,
            aveta: item.aveta,
            cantidad: item.cantidad,
            rotable: rotable,
          });
        }
      });

      if (this.inProgress) {
        return;
      }

      this.inProgress = true;
      HTTP.post(environment.OPTIMIZATION_URL, { data: this.data })
        .then((response) => {
          this.inProgress = false;
          self.optimizado = "ok";
          this.$refs.toastr.s(
            "¡EL Proceso de Optimizacion Finalizo con Exito!"
          );
        })
        .catch((response) => {
          this.$refs.toastr.e("Se ha producido un error en optimalon");
          this.inProgress = false;
          this.optimalonError =
            response.error &&
            $($($.parseHTML(response.error.vue)).find("p")[0]).html();
        });
    },
    download_pdf() {
      // this.pdf.onFileSelected(this.data.infoProject.projectName, true);
      //this.onFileSelected(this.data.infoProject.projectName, true);
      this.$refs.pdfviewer.onFileSelected(
        this.data.infoProject.projectName,
        true
      );
      this.project_name = this.data.infoProject.projectName;
      this.download = true;
    },
    verOptimizacion() {
      // this.pdf.onFileSelected(this.data.infoProject.projectName, false);
      //this.PdfViewer.onFileSelected(this.data.infoProject.projectName, false);
      this.$refs.pdfviewer.onFileSelected(
        this.data.infoProject.projectName,
        false
      );
    },
    onChangeCut($event) {
      this.$refs.toastr.i(
        this.array_info_levels_cut[this.data.infoProject.cut_level]
      );
    },
    removePanel(index) {
      //let self = this;
      this.data.panels.splice(index, 1);
      localStorage.removeItem("panels");
      localStorage.setItem("panels", JSON.stringify(this.data.panels));
    },
    redirectlink(){
      this.$router.push({ name: "DesignDashboard", params: { link: this.redirectoken  } });
    },
    addPanel() {
      if (
        !this.newPanel.nombre ||
        !this.newPanel.largo ||
        !this.newPanel.ancho ||
        !this.newPanel.cantidad
      ) {
        this.$refs.toastr.e("Completa la informacion del panel");
      } else {
        this.data.panels.push({
          nombre: this.newPanel.nombre,
          largo: this.newPanel.largo,
          ancho: this.newPanel.ancho,
          cantidad: this.newPanel.cantidad,
        });
        //let self = this;
        //this.localStorage.setItem('panels', JSON.stringify(this.data.panels)).subscribe(() => { });
        //this.localStorage.setItem('panels', this.data.panels).subscribe(() => {});
        localStorage.setItem("panels", JSON.stringify(this.data.panels));
        this.newPanel.nombre = this.piezasMaterial[0].material.material;
        this.newPanel.largo = "";
        this.newPanel.ancho = "";
        this.newPanel.cantidad = 0;
      }
    },
    changeTapacantos($event, pieza) {
      this.tapacantos2Change = pieza.tapacantos;
      this.$bvModal.show("change-tapacantos");

      //_$('#change-tapacantos').modal('show');
    },
    async onChangeMetadataMaterialEstado(estado_id, material, etapa ) {

      //let
      this.$refs.toastr.i("Actualizando estado de material de stock...");
      const data = { id: material.id, estado_id: estado_id.target.value };
      let res = await ProyectoService.metadataMaterialUpdate(data);

      if (res.success) {
        material.estado_id = res.material.estado_id;
        this.$refs.toastr.s("¡Material de stock actualizado!");
        this.createHistorialTaller(estado_id.target.value, etapa, material.id, material.nombre)
      } else {
        this.$refs.toastr.e(res.error);
      }
    },
    terminarTodosLosTapacantos(pieza) {
      if (pieza.comentario != undefined && pieza.comentario != null) {
        this.$swal({
          title: "Comentarios",
          text: pieza.comentario,
          type: "question",
          showCancelButton: true,
        }).then((result) => {
          if (result) {
            this.terminarTodosLosTapacantosPost(pieza);
          }
        });
      } else {
        this.terminarTodosLosTapacantosPost(pieza);
      }
    },
    async terminarTodosLosTapacantosPost(pieza) {
      var errores = [];
      this.$refs.toastr.i("Actualizando estado de tapacanto...");

      let usuario = localStorage.getItem("user-id");

      this.createHistorialPieza(pieza.id,  parseInt(3), 'tapacantos')

      pieza.tapacantos.map(async (item) => {
        let data = { id: item.id, estado_id: parseInt(3) , usuario};
        await TapacantoService.update(data).then(a=>{
          item.estado_id = 3;
        }).catch(a=>{
          this.$noty.error(a.response.data.error);
        });


      });

      this.$refs.toastr.s("¡Tapacanto actualizado!");

    },


    classTapacantos(tapacantos, pieza) {
      let cant = 0;
      if (tapacantos.length === 0) {
        cant = pieza.tapacantos_estado_id === 3 ? 100 : 0;
      } else {
        cant = (this.tapacantosOk(tapacantos) / tapacantos.length) * 100;
      }

      if (cant === 0) return "table-info";
      else if (cant >= 0 && cant < 61) return "table-danger";
      else if (cant >= 61 && cant < 100) return "table-warning";
      else if (cant === 100) return "table-success";
    },
    seeCalco(pieza) {
      const calcoMeta = this.getCalcoMetaFromPieza(pieza);
      if (!calcoMeta) {
        return;
      }
      // icon: "success",
      // console.log('html---->',  `<div class="calco-view" style="padding:20px">${calcoMeta.calcos.join('<div class="page-break"></div>')}</div>`)
      this.legacySystemHTML = `<div class="calco-view" style="padding:20px">${calcoMeta.calcos.join(
        '<div class="page-break"></div>'
      )}</div>`;
      this.$bvModal.show("vercalco");
      // this.$swal({
      // 	title: `${pieza.pieza}`,
      // 	text: `<div class="calco-view" style="padding:20px">${calcoMeta.calcos.join('<div class="page-break"></div>')}</div>`,

      // 	showCloseButton: true,
      // 	focusConfirm: true
      // })
    },
    printCalco(pieza) {
      const calcoMeta = this.getCalcoMetaFromPieza(pieza);
      if (!calcoMeta) {
        return;
      }
      this.doPrint(calcoMeta.calcos.join('<div class="page-break"></div>'));
    },
    modalComentario($event, comentario) {
      this.comentarioActual = comentario;
      _$("#modal-comentario").modal("show");
    },
    calcoMetaToObj(calcoMetadata) {
      const getData = function (str) {
        const rows = str.split("<tr");
        const data = [];

        rows.forEach((row) => {
          const metadataRow = row.indexOf("separator-name") > -1;
          if (metadataRow) {
            const rowData = [];
            let tipo;
            row.split("<td").forEach((td) => {
              const tdI = td.indexOf("</td>");
              if (tdI > -1) {
                let d = td.substring(0, tdI);
                d = d.substring(d.indexOf(">") + 1, d.length);
                rowData.push(d);
              }

              const tipoI = td.indexOf("data-tipo");
              if (tipoI > -1) {
                const rawTipo = td.split('data-tipo="')[1];
                tipo = rawTipo.substring(0, rawTipo.indexOf('"'));
              }
            });

            data.push({
              altura1: +rowData[0],
              altura2: +rowData[1],
              tipo: tipo,
              subtipo: rowData[2],
              prof1: +rowData[3],
              prof2: +rowData[4],
              prof3: +rowData[5],
              ext: rowData[6],
            });
          }
        });

        return data;
      };

      const calco = {
        caraOpuesta: getData(calcoMetadata.calcos[0]),
        caraEnContacto: [],
      };

      if (calcoMetadata.calcos.length > 1) {
        calco.caraEnContacto = getData(calcoMetadata.calcos[1]);
      }

      return calco;
    },
    async prearmar(pieza) {
      if (this.connectedCNC > -1) {
        const calco = this.calcoMetaToObj(this.getCalcoMetaFromPieza(pieza));
        this.$swal("", {
          title: "Seleccione cara a prearmar",
          icon: "",
          buttons: {
            cancel: "Cancelar",
            aceptar: {
              text: "Cara en Contacto",
              value: 1,
            },
            op: {
              text: "Cara Opuesta",
              value: 2,
            },
          },
        }).then(async (value) => {
          if (!value) {
            return;
          }

          if (!this.carasPrearmadas[pieza.id]) {
            this.carasPrearmadas[pieza.id] = {
              1: false,
              2: false,
            };
          }
          this.carasPrearmadas[pieza.id][value] = true;

          const data = {
            id: pieza.id,
            modulo: "MOD" + pieza.modulo.modulo,
            pieza: pieza.pieza,
            ar: pieza.modulo.armado || "",
            mueble: this.proyectoInfo.proyecto,
            nombre: this.proyectoInfo.cliente.nombre_completo,
          };
          if (value === 1) {
            data.gcode = await CodigoGService.getGCode(calco.caraEnContacto, pieza.aveta, value);
            data.cara = "Cara Contacto";
          } else if (value === 2) {
            data.gcode = await CodigoGService.getGCode(calco.caraOpuesta, pieza.aveta, value);
            data.cara = "Cara Opuesta";
          }
          console.log("data: ", data);
          console.log("gcode: ", data.gcode);
          const result = await CNCService.send(this.connectedCNC, data);
          console.log("CNC Result: ", result);

          if (
            this.carasPrearmadas[pieza.id][1] &&
            this.carasPrearmadas[pieza.id][2]
          ) {
            this.changeEstadoPieza(
              pieza,
              3,
              "prearmado_estado_id",
              "prearmado"
            );
          } else {
            this.changeEstadoPieza(
              pieza,
              5,
              "prearmado_estado_id",
              "prearmado"
            );
          }
        });
      } else {
        this.changeEstadoPieza(pieza, 3, "prearmado_estado_id", "prearmado");
      }
    },
    changeEstadoPieza(
      pieza,
      estado_id,
      estado_key = "estado_id",
      etapa = "corte"
    ) {
      if (pieza.comentario != undefined && pieza.comentario != null) {
        this.$swal({
          title: "Comentarios",
          text: pieza.comentario,
          type: "question",
          showCancelButton: true,
        }).then((result) => {
          if (result) {
            this.changeEstadoPiezaPost(pieza, estado_id, estado_key, etapa);
          }
        });
      } else {
        this.changeEstadoPiezaPost(pieza, estado_id, estado_key, etapa);
      }
    },
    async changeEstadoPiezaPost(
      pieza,
      estado_id,
      estado_key = "estado_id",
      etapa
    ) {
      this.$refs.toastr.i("Actualizando estado de pieza...");
      let data = { id: pieza.id, usuario: "", etapa: etapa };
      data[estado_key] = parseInt(estado_id);
      data.usuario = JSON.parse(localStorage.getItem("usuario")); //this.authService.getUsuario().usuario;

      //this.piezaService.update(data).subscribe(

      console.log(`changeEstadoPiezaPost() -> Usuario: ${JSON.stringify(data.usuario)}`)
      let response = await PiezaService.update(data);
      if (response) {
        if (response.pieza) {
          switch (estado_key) {
            case "estado_id": {
              pieza.estado = response.pieza.estado;
              pieza.estado_id = response.pieza.estado.id;
              this.createHistorialPieza(pieza.id, estado_id, 'corte')
              break;
            }
            case "prearmado_estado_id": {
              pieza.prearmado = response.pieza.prearmado;
              pieza.prearmado_estado_id = response.pieza.prearmado.id;
              this.createHistorialPieza(pieza.id, estado_id, 'prearmado')
              break;
            }
          }
          if (response.pieza.estado_id === 3 && estado_key === "estado_id") {
            this.printCalco(response.pieza);
          }

          this.$refs.toastr.s("¡Pieza actualizada!");
        }
      } else {
        console.log(error);
      }
    },
    onChangeFilterLVeta(lveta) {
      let piezasFiltered = this.proyectoInfo.piezas;
      this.filterLVeta = lveta ? +lveta : undefined;
      if (!this.filterLVeta && !this.filterAVeta) {
        this.onChangeMaterial(this.materialSelected);
      } else {
        piezasFiltered.map((item) => {
          const filterAVeta = this.filterAVeta
            ? item.aveta == this.filterAVeta
            : true;
          const filterLVeta = this.filterLVeta
            ? item.lveta == this.filterLVeta
            : true;
          item.show = item.estado_id !== 3 && filterAVeta && filterLVeta;
        });
        this.piezas = piezasFiltered;
      }
    },

    onChangeFilterAVeta(aveta) {
        this.filterAVeta = aveta ? +aveta : undefined;
        this.onChangeFilterLVeta(this.filterLVeta);
    },

    async onChangeActionNote(estado_id,nota,mostrarMensajes = true)
    {
      console.log('onChangeActionNote-------#', estado_id, nota);
      if (mostrarMensajes) {
        this.$refs.toastr.i("Actualizando estado de la nota de acción...");
      }
      let data = { id: nota.id, updated_by: "", estado_id: 9};
      //parseInt(estado_id.target.value) cuando estado id es un evento
      data.estado_id = parseInt(estado_id);
      data.updated_by = localStorage.getItem("user-name");
      let response = await ActionNoteService.update(data);
      console.log('response', response)
      if (response) {
        nota.estado_id = estado_id;
        if (mostrarMensajes) {
            this.$refs.toastr.s("¡Nota de acción actualizada!");
        }
      } else {
        console.log(response);
      }
    },

    async onChangeEstadoPieza(
      estado_id,
      pieza,
      estado_key = "estado_id",
      etapa,
      mostrarMensajes = true
    ) {
      // console.log('onChangeEstadoPieza-------#', estado_id, pieza)
      if (estado_id > 0) {
      } else {
        estado_id = estado_id.target.value;
      }
      // console.log('estado_id.target.value ----->',estado_id)

      if (mostrarMensajes) {
        this.$refs.toastr.i("Actualizando estado de pieza...");
      }


      // console.log('la pieza----->',pieza)
      let data = { id: pieza.id, usuario: "", etapa: etapa };
      data[estado_key] = parseInt(estado_id);
      data.usuario = JSON.parse(localStorage.getItem("usuario"));
      //this.authService.getUsuario().usuario;
      console.log(`changeEstadoPieza() -> DATA: ${JSON.stringify(data)}`)
      let response = await PiezaService.update(data);

      this.createHistorialPieza(pieza.id, estado_id, etapa)

      // console.log('response', response)
      if (response) {

        if (response.pieza) {
          switch (estado_key) {
            case "estado_id": {
              pieza.estado = response.pieza.estado;
              break;
            }
            case "prearmado_estado_id": {
              pieza.prearmado = response.pieza.prearmado;
              break;
            }
            case "tapacantos_estado_id": {
              pieza.tapacantos_estado_id = response.pieza.tapacantos_estado_id;
            }
          }

          if (mostrarMensajes) {
            this.$refs.toastr.s("¡Pieza actualizada!");
          }
        }
      } else {
        console.log(response);
      }
    },

    
    async createHistorialPieza(pieza_id, estado_id, etapa){

      let usuario_id = localStorage.getItem("user-id");
      //let usuario = JSON.parse(localStorage.getItem("usuario")).id;

      let etapa_id = null

      if(etapa == "corte") {
        etapa_id = 1
      }
      if(etapa == "tapacantos") {
        etapa_id = 2
      }


      if(etapa == "prearmado") {
        etapa_id = 3
      }

      let data = { pieza_id,  estado_id, etapa_id, usuario_id};
      console.log(`createHistorialPieza()  (Taller) -> DATA: ${JSON.stringify(data)}`)
      let response = await PiezaService.createHistorialPieza(data);
      console.log(response)


    },

    optimizarTodo() {
      let counter = 0;
      this.piezas.forEach((pieza) => {
        if (+pieza.estado_id === 9) {
          pieza.estado_id = 8;
          this.onChangeEstadoPieza(
            pieza.estado_id,
            pieza,
            "estado_id",
            "corte",
            false
          );
          counter++;
        }
      });
      if (counter > 0) {
        this.$refs.toastr.s(counter + " piezas actualizadas");
      } else {
        this.$refs.toastr.i("No se actualizo ninguna pieza");
      }
    },
    async getOptimization() {
      let self = this;
      //pendiente
      let response = await OptimizarService.getOptimizacion(
        self.data.infoProject.projectName
      );
      this.optimizado = response.optimizado;
    },
    modalOptimizar() {
      if (this.$refs.cliente.value <= 0) {
        this.$refs.toastr.e(
          "¡Primero debe Seleccionar un Cliente y luego un Proyecto!"
        );
      } else {
        if (this.$refs.material.value <= 0)
          this.$refs.toastr.e("¡No ha Seleccionado ningun Material!");
        else {
          this.optimalonError = undefined;
          this.inProgress = false;
          this.$bvModal.show("modal_optimizacion");

          this.getOptimization();
        } //end else
      }
    },
    onChangeFilterPieza(search) {
      let piezasFiltered = this.proyectoInfo.piezas;
      search = search.toLowerCase();
      if (search.length > 0) {
        piezasFiltered.map((item) => {
          item.show =
            item.pieza.toLowerCase().indexOf(search) != -1 ||
            item.material.material.toLowerCase().indexOf(search) != -1;
        });
      }
      this.piezas = piezasFiltered;
    },
    onChangeMaterial(e) {
      let material_id = e;
      let piezasFiltered = []; //this.proyectoInfo.piezas;
      this.piezas.map((item) => {
        if (
          parseInt(material_id) === 0 ||
          item.material_id == parseInt(material_id)
        ) {
          piezasFiltered.push(item);
          item.show = true; // ( (material_id == 0) ? true : (item.material_id == parseInt(material_id) ) );
        } else {
          item.show = false;
        }
      });

      this.piezasMaterial = piezasFiltered;
      this.newPanel.nombre = this.piezasMaterial[0].material.material;
    },
    copyObj(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    getCalcoMetaFromPieza(pieza) {
      const meta = this.copyObj(this.calcos[pieza.id]);
      console.log(meta);
      return meta;
    },
    printCalco(pieza) {
      const calcoMeta = this.getCalcoMetaFromPieza(pieza);
      if (!calcoMeta) {
        return;
      }
      this.doPrint(calcoMeta.calcos.join('<div class="page-break"></div>'));
    },
    doPrint(elem) {
      const popupWin = window.open(
        "",
        "Imprimir calcomania",
        "width=600,height=600"
      );
      popupWin.document.open();
      popupWin.document.write(`<html>
					<head>
						<link rel="stylesheet" type="text/css" href="static/assets/css/bootstrap.min.css" />
						<link rel="stylesheet" type="text/css" href="static/assets/css/calcos.css" />
					</head>
					<body onload="window.print()">
						<div class="calco-view"> ${elem}</div>
					</body>
					</html>`);
      popupWin.document.close();
      return true;
    },
    round(n, decimals = 2) {
      let negative = false;
      if (n < 0) {
        negative = true;
        n = n * -1;
      }
      var multiplicator = Math.pow(10, decimals);
      n = parseFloat((n * multiplicator).toFixed(11));
      n = (Math.round(n) / multiplicator).toFixed(decimals);
      if (negative) {
        n = (n * -1).toFixed(decimals);
      }
      return n;
    },
    getPlacas(material) {
      const mat = this.materialesDictionary[material.nombre];
      if (mat) {
        const available = (100 - this.waste) / 100;
        const placa = (mat.ancho_veta * mat.largo_veta) / 1000000;
        const placaAvailable = material.cantidad / (placa * available);
        return placaAvailable;
      }
    },
    getStockTableRowBackgroundColor(stateId) {
      switch (+stateId) {
        case 1:
          return this.colorEstadoBackground["Falta"];
        case 3:
          return this.colorEstadoBackground["OK"];
        case 4:
          return this.colorEstadoBackground["Pedido"];
        case 6:
          return this.colorEstadoBackground["Stock"];
        default:
          return this.colorEstadoBackground["Seleccione un estado"];
      }
    },
    wTapacantos(items = this.piezas) {
      let data = items.filter((item) => {
        return item.tapacantos && item.tapacantos.length > 0;
      });

      return data.length || 0;
    },
    tapacantosOk(tapacantos) {
      let count = 0;
      tapacantos.map((item) => {
        if (item.estado_id == 3) count += 1;
      });
      return count;
    },
    totalEstadoOkTapacantos(items = this.piezas) {
      let data = items.filter((item) => {
        return (
          item.tapacantos &&
          item.tapacantos.length > 0 &&
          item.tapacantos.length === this.tapacantosOk(item.tapacantos)
        );
      });

      return data.length || 0;
    },

    getProgresoGeneral() {
      let cant =
        parseFloat(this.totalEstadoOk(this.piezas)) +
        parseFloat(
          ((this.totalEstadoOkTapacantos() / this.wTapacantos()) * 100).toFixed(
            2
          )
        ) +
        parseFloat(this.totalEstadoOk(this.piezas, "prearmado_estado_id")) +
        parseFloat(
          this.totalEstadoOk(this.proyectoInfo ? this.proyectoInfo.modulos : 0)
        ) +
        parseFloat(this.totalEstadoOk(this.actionNotes));

      let div =  this.actionNotes.length ? 5 : 4;
      return isNaN(cant) ? 0 : (cant / div).toFixed(2);
    },
    /*
    totalEstadoOk(items, property = "estado_id") {
      if (!items || items.length <= 0) return "0";

      return ((this.wEstadoOk(items, property) / items.length) * 100).toFixed(
        2
      );
    },*/
    colorProgreso(progreso) {
      const cantidad = parseInt(progreso);

      if (cantidad == 0) return "#337ab7";
      else if (cantidad < 60) return "#dadc02";
      else if (cantidad < 100) return "#f4f566";
      else if (cantidad == 100) return "#5cb85c";
    },
    wEstadoOk(items, property = "estado_id") {
      if (!items || items.length <= 0) return 0;

      let count = 0;

      items.map((item) => {
        if (item[property] == 3) {
          count += 1;
        }
      });

      return count;
    },
    totalEstadoOk(items, property = "estado_id") {
      if (!items || items.length <= 0) return "0";
      return ((this.wEstadoOk(items, property) / items.length) * 100).toFixed(
        2
      );
    },
    openLink(link) {
      window.open(
        link.indexOf("http://") === -1 ? "http://" + link : link,
        "_blank"
      );
    },
    parseCajaInfo(response) {
      const cajaInfoMeta = response.data.metadata.find((m) => m.key === "caja") || {
        value: 0,
      };
      return cajaInfoMeta.value;
    },
    processMetadata(projectMetadata) {

      try {

        const metadata = projectMetadata.data.metadata;
        const materiales = metadata.find((el) => el.key === "materiales");
        this.materialesDisenio = [];
        const projectInfo = metadata.find((el) => el.key === "project_info");
        if (materiales && materiales.value) {
          Object.keys(materiales.value).forEach((material) => {
            this.materialesDisenio.push(materiales.value[material]);
          });
        }

        if (projectInfo && projectInfo.value) {
          this.externalProjectLinks = projectInfo && projectInfo.value.links;
          this.externalProjectLinksDescripcion = projectInfo && projectInfo.value.linksDescripcion;
        }
        this.modInfo = metadata
          .filter((el) => el.key.indexOf("Mod ") > -1)
          .map((mod) => mod.value);
        const wasteMeta = metadata.find((el) => el.key === "placa_waste");
        this.waste = wasteMeta ? +wasteMeta.value : this.waste;
        const exportadoPor = metadata.find((el) => el.key === "exportado_por");
        this.exportedBy = exportadoPor ? exportadoPor.value : "No disponible";
        const idMeta = metadata.find((el) => el.key === "project_id");
        console.log(this.proyectoInfo)
        this.updateProjectLink(idMeta ? idMeta.value : this.proyectoInfo.id);
      } catch (error) {
        console.log("error en processmetadata", error);
      }
    },
    updateProjectLink(token) {
      if (token) {
        this.redirectoken = this.$store.getters.tokenize(token)
      } else {
        this.projectUrl = undefined;
      }
    },
    async estadoGetAll() {
      //return this.http.get(`${this.server}/clientes`, {headers: this.headers}).pipe(map((res: HttpResponse<any>) => res));
      let result = await HTTP.get("/api/estados");
      try {
        return result.data.estados;
      } catch (error) {
        return error;
      }
    },
    async getAll() {
      //return this.http.get(`${this.server}/clientes`, {headers: this.headers}).pipe(map((res: HttpResponse<any>) => res));
      let result = await HTTP.get("/api/clientes");

      try {
        return result.data;
      } catch (error) {
        return error;
      }
    },
    async traerEncuesta() {
      let result = await Encuesta_tipoService.getAll();
      if (result) {
        console.log("Esta es traer encuesta: ", result);
        let data = result.filter((x) => x.estado == true);
        console.log(data.length);
        if (data.length > 0)
          data.forEach((x) => {
            let result;
            if (x.esEstrella) result = 0;
            else result = "";
            x.descripcion = result;
          });
        this.reportes = data;
      }
    },
    parseCalcoMetadataResponse(response) {
      let calcoMap = {};
      response.forEach((element) => {
        const index = element.pieza_id;
        if (!calcoMap[index]) {
          calcoMap[index] = {
            id: element.pieza_id,
            name: element.pieza,
            calcos: [],
          };
        }

        let pieza
        if(element.pieza.indexOf('Lat. Izq. Cajon') > -1 || element.pieza.indexOf('Lat. Der. Cajon') > -1){
          const id = element.pieza.split("Cajon ")[1]
          pieza = (element.pieza.indexOf('Lat. Izq. Cajon') > -1) ? `Lat. Cajon ${id}` : ((element.pieza.indexOf('Lat. Der. Cajon') > -1) ? `Lat. Cajon ${id} (2)` :"");
        }else{
          pieza = element.pieza
        }
        if (
          element.calco.indexOf(pieza) > -1 &&
          !(element.calco.indexOf(pieza + " (") > -1)
        ) {
          calcoMap[index].calcos.push(element.calco);
        }
      });
      return calcoMap;
    },
    async onChangeProyecto(proyecto_id) {
      this.loadingPage = true;

      if (proyecto_id > 0) {
      } else proyecto_id = Number(proyecto_id.target.value);
      //alert("Entreee");
      this.proyectoID = proyecto_id;
      this.getMedAll();
      this.getInstAll();
      this.getCPAll();
      this.getCPPAll();
      this.setearItem();
      console.log("proyecto-->", proyecto_id);
      this.haveResponsible = false;
      this.waste = 0;
      this.images_project = [];
      let resImg = undefined;
      let res1 = undefined;
      let res2 = undefined;
      let res3 = undefined;
      console.log("Proyecto_Id: ",proyecto_id);
      if (proyecto_id > 0) {
        console.log("proyecto >0");
        localStorage.setItem("currentProject", "" + proyecto_id);

        try {
          this.proyectoInfo = await ProyectoService.getByIdAll(proyecto_id);
          console.log("ProyectoInfo: ",this.proyectoInfo);
        } catch (error) {
          console.log("Error Fatal Cargando Informacion del proyecto: ", error);
          //this.loadingPage = false;
        }

        try {
          res1 = await ProyectoService.getCalcosMetadata(proyecto_id);
          this.calcos = this.parseCalcoMetadataResponse(res1.calcos);
        } catch (error) {
          console.log("Error Cargando Calcos Metadata: ", error);
        }

        try {
          res2 = await ProyectoService.getProyectoMetadata(proyecto_id);
          console.log("-------------> res2", res2);
          this.processMetadata(res2);
          this.cajaInfo = this.parseCajaInfo(res2);
          setTimeout(() => {

          }, 1000);
        } catch (error) {
          console.log("Error Cargando Proyecto Metadata: ", error);
        }

        try {
          res3 = await MaterialService.getMaterialesPorTipo("P");
        } catch (error) {
          res3 = undefined;
          console.log("Error Cargando Materiales por tipo: ", error);
        }

        console.log("2393", this.proyectoInfo.token_project);
        try {

            resImg = await ProyectoService.getAllImagesProject(
            this.proyectoInfo.token_project
          );
        } catch (error) {
          resImg = undefined;
          console.log("Error Cargando Imagenes del proyecto: ", error);
        }

        // this.materialService.getMaterialesPorTipo('P')
        // 	this._ngxLoader.stop();
        // 	this.loading = false;
        //console.log("2395");
        this.materialesFiltered = [
          { id: 0, material: "Seleccione un material" },
        ];
        let materiales = {};
        try {
          if  (res3 != undefined)
            materiales = res3.materiales;
        } catch (error) {
          console.log("error", error);
        }

        if (this.proyectoInfo.responsible != null) {
          this.haveResponsible = true;
        }
        try {
          this.clienteInfo = this.proyectoInfo.cliente;
          this.piezas = [];
          for (let i = 0; i < this.proyectoInfo.modulos.length; i++) {
            let piezas = this.proyectoInfo.modulos[i]["piezas"];
            this.piezas = this.piezas.concat(piezas);
          }
          let filtered = [];
          this.piezas.map((item) => {
            let tmp = [];
            item.show = true;
            item.rotable = "NO";

            tmp = this.materialesFiltered.filter(
              (material) => material.id == item.material_id
            );
            if (tmp.length === 0) {
              if (item.material != null) {
                this.materialesFiltered.push(item.material);
                this.materialesDictionary[item.material.material] = materiales.find(
                  (mat) => mat.material === item.material.material
                );
              }
            }
          });
          this.piezas = this.piezas.sort((valueA, valueB) => {
            if (valueA.id_aux < valueB.id_aux) return -1;
            else if (valueA.id_aux > valueB.id_aux) return 1;

            return 0;
          });
          this.proyectoInfo.piezas = this.piezas;
          //pendiente corregir
          this.data.infoProject.projectName =
            this.clienteInfo.nombre_completo + " " + this.proyectoInfo.proyecto;
          if (this.proyectoInfo.token_project) {
            if (resImg != undefined)
              this.images_project = await resImg.response.imagenes;
          }
          console.log("Piezas cargadas...");
        } catch (error) {
          console.log("Error Cargando Piezas: ", error);
        }
        //Procesar Cargar Notas de Action ------------------------------
        this.actionNotes = [];
        try {
          let resNote= await ActionNoteService.getAll(proyecto_id);
          this.actionNotes = resNote.actionnotes;
          console.log("Notas de Acción Cargadas...");
        } catch (error) {
          console.log("Error Cargando Notas de Acion: ", error);
        }
        //---------------------------------------------------------------

      }
      this.loadingPage = false;
    },
    viewGallery() {
      //this.$refs.ImgGallery.openGallery(this.images_project);

      this.showmodal = !this.showmodal
    },
    observacionesCalendario() {
      this._router.navigate(["/Calendario", { id: this.proyectoInfo.id }]);
    },
    async reabrirProyecto() {
      this.loadingPage = true;

      try {
        console.log("proyectoinfo...>", this.proyectoInfo.id);
        let response = await EncuestaRespuestaService.update(
          this.proyectoInfo,
          this.proyectoInfo.id
        );
        if (response) {
          console.log("respuesta---", response);
          this.onChangeProyecto(response.id);
        }
      } catch (error) {
        this.$refs.toastr.e(error);
      }

      this.loadingPage = false;
    },
    finalizarProyecto() {
      this.activeClass = false;
      setTimeout(() => {
        this.step = 8;
      }, 500);
    },
    alert(tab=0) {
      if (tab==9) {
       this.getControl()
      }
      if (!this.haveResponsible) {
        this.$swal({
          text:
            "Este proyecto aun no tiene un encargado, designese como encargado, o póngase en contacto con el encargado de proyecto",
          type: "info",
          showCancelButton: false,
        });
      }
    },
    async GoResponsible() {
      this.$swal({
        title: "Encargado de proyecto",
        text: "¿Quiere ser el encargado de este proyecto?",
        type: "question",
        buttons: true,
      }).then(async (result) => {
        if (result) {
          let user = JSON.parse(localStorage.getItem("usuario"));
          let res = await ProyectoService.setResponsible(
            this.proyectoInfo,
            user
          );
          if (res.success == 1) {
            this.onChangeProyecto(this.proyectoInfo.id);
          }
        }
      });
    },
    async deleteResponsible() {
      this.$swal({
        title: "Encargado de proyecto",
        text: "¿Quiere remover al encargado de este proyecto?",
        type: "question",
        buttons: true,
      }).then(async (result) => {
        this.loadingPage = true;

        console.log("resultado--->", result);
        if (result) {
          console.log("ok");
          let res = await ProyectoService.deleteResponsible(
            this.proyectoInfo.id
          );
          if (res.status == "success") {
            this.$swal({
              text: "Proceso realizado correctamente",
              type: "success",
              showCancelButton: false,
            });
            this.haveResponsible = false;
            this.onChangeProyecto(this.proyectoInfo.id);
          }
        }

        this.loadingPage = false;
      });
    },


    openCajaDetails() {
      this.$bvModal.show("modaldetallepago");
      //_$('#modal-detalle-pago').modal('show');
    },
    async onOkEditInfo(property) {
      this.loadingPage = true;

      try {
        let data = { id: 0 };
        data[property] = this.newInfo[property].value;

        if (this.newInfo[property].type === "cliente") {
          this.$refs.toastr.i("Actualizando cliente...");
          data.id = this.clienteInfo.id;
          let resCl = await ClienteService.update(data);
          if (resCl) {
            this.$refs.toastr.s("Cliente actualizado con éxito");
            this.editInfo[property] = !this.editInfo[property];
            this.clienteInfo[property] = data[property];
          }
        } else {
          this.$refs.toastr.i("Actualizando proyecto...");
          data.id = this.proyectoInfo.id;
          let resPl = await ProyectoService.update(data);
          if (resPl) {
            //alert('Proyecto actualizado con éxito')
            this.$refs.toastr.s("Proyecto actualizado con éxito");
            this.editInfo[property] = !this.editInfo[property];
            this.proyectoInfo[property] = data[property];
          }
        }
      } catch (error) {
        console.log("Error!", error);
      }

      this.loadingPage = false;
    },
    onCancelEditInfo(property) {
      console.log("si");
      this.editInfo[property] = !this.editInfo[property];
      console.log(this.editInfo[property]);
    },
    onEditInfo(property) {
      if (this.newInfo[property].type === "cliente")
        this.newInfo[property].value = this.clienteInfo[property];
      else this.newInfo[property].value = this.proyectoInfo[property];

      this.editInfo[property] = !this.editInfo[property];
    },
    ToggleModal(){
            this.showmodal = !this.showmodal
    },
    getModulosCajones(option = "cajones", items = []) {
      if (items.length == 0) {
        //Se sustituye modulosfiltrados por modulos
        if (this.proyectoInfo) items = this.proyectoInfo.modulos;
        else return [];
      }

      let condition = option === "cajones" ? 1 : 0;

      let data = items.filter((item) => {
        if(condition == 1){
          return (item.is_cajon == condition && !/(\(\d\))/i.test(item.modulo));
        }

        return item.is_cajon == condition;
      });

      return data;
    },


    openNota() {
      this.$bvModal.show("modalNota");
    },

    async saveNota(nota){

      console.log(` SaveNota: ${nota} `)
      this.loadingPage = true

      try {
        let data = { id: 0 };
        data['instalacion_nota'] = nota;
        this.$refs.toastr.i("Actualizando proyecto...")
        data.id = this.proyectoInfo.id;
        let resPl = await ProyectoService.update(data)
        if (resPl) {
           this.$refs.toastr.s("Proyecto actualizado con éxito")
            this.loadingPage = false
            this.$bvModal.hide("modalNota")

          }

      } catch (e) {
        console.log("Error!", e);
        this.loadingPage = false;
          return false
      }


    },




  },
  filters:{
    nombreFrenteCajon(data){
      try {
        return data.modulo;

        if(data.is_cajon == 1){
        return data.modulo.replace(/(\(\d\))/i, 'F');
      }else{
        return data.modulo;
      }

      } catch (error) {
        return data.modulo;
      }
    },
    nombreFrenteDeCajonPieza(data){
      try {
        return data;

        if(/cajon/i.test(data)){
        return data.replace(/(\(\d\))/i, 'F');
      }else{
        return data;
      }

      } catch (error) {
        return data;
      }
    }
  },
  computed: {
    cajonesFiltrados:{
      get(){
        return this.proyectoInfo.modulos.filter(a=>{
            if(a.is_cajon == 1){
              return !/(\(\d\))/i.test(a.modulo);
            }else{
              return true;
            }
        });
        // var temp = JSON.parse(JSON.stringify(this.proyectoInfo.modulos));
        // return temp.map(a=>{
        //   return a;
        // });
      }
    },
    connectedCNC: {
      get() {
        return this.$store.state.info.connectedCNC;
      },
      set(value) {
        this.$store.commit("setGeneralInfo", {
          key: "connectedCNC",
          value: value,
        });
      },
    },
  },
};
</script>

<style>
.taller-tab {
  background-color: white;
  padding: 10px;
  padding-top: 20px;
}
</style>

<style scoped>
.white {
  color: white !important;
}

/* .btn.ml-plak-btn, .btn:not(.btn-outline-secondary):not(.btn-primary):not(.btn-success):not(.btn-info):not(.btn-danger):not(.btn-link):not(.btn-outline-primary):not(.btn-secondary):not(.btn-outline-danger) {
    background-color: rgb(239, 239, 239);
  } */

.btn-warning {
  background-color: #eea236 !important;
  color: white !important;
}
* {
  font-size: 14px;
}

#form-container {
  padding: 5px 0;
}

textarea {
  resize: none;
}

.star {
  font-size: 2rem !important;
  color: #b0c4de;
}

.table-total {
  font-weight: 600;
}

.detalle-grid {
  display: flex;
}

.detalle-grid .labels {
  /* width: 250px; */
}

#modal-detalle-pago h4 {
  margin-top: 25px;
}

.detalle-grid .values {
  font-weight: 600;
}

.project-options {
  display: flex;
  align-items: center;
}

.optimizar-todo-container {
  position: relative;
  right: 45px;
}

.filled {
  color: orange;
}

.error-font {
  color: red;
  font-weight: bold;
}

.optimalon-error {
  color: red;
}

#navbar-menu {
  margin-left: 0px;
  margin-right: 0px;
}

.space-around {
  display: flex;
  justify-content: space-around;
}

.col-sm-12 {
  margin-bottom: 7px;
  margin-top: 7px;
}

.cancel-panel {
  cursor: pointer;
}

.radio-inline {
  font-weight: bold;
}

/* ::ng-deep .door-sketch .bisagra {
	width: 7px;
	height: 7px;
	background-color: #8BC34A;
}

::ng-deep .door-sketch .bisagra-position {
	position: relative;
	display: inline-block;
	left: 8px;
	bottom: 5px;
}

::ng-deep .door-sketch [class="Izquierda/Derecha"] .bisagra-position {
	left: 10px;
	bottom: 5px;
}

::ng-deep .door-sketch .Inferior .bisagra-position {
	transform: rotate(310deg);
	left: -5px;
	bottom: 24px;
}

::ng-deep .door-sketch .Derecha .bisagra-position {
	left: 8px;
	bottom: 5px;
}

::ng-deep .door-sketch .Izquierda .bisagra-position {
	right: 36px;
	bottom: 5px;
}

::ng-deep .door-sketch .Superior .bisagra-position {
	transform: rotate(310deg);
	left: -25px;
	top: 15px;
}

::ng-deep .door-sketch {
	width: 98px;
	height: 98px;
	border: 1px solid black;
	margin: 0 auto;
	margin-top: 10px;
	display: flex;
	justify-content: center;
} */

.nav-tabs li.disabled a {
  pointer-events: none;
}
@media all and (max-width: 500px) {
  table.one-column {
    width: 100%;
  }

  table.one-column td,
  table.one-column th {
    display: block;
    width: 100%;
    padding: 10px;
  }

  table.one-column tr {
    display: block;
  }
}

.no-padding {
  padding-left: 0px;
  padding-right: 0px;
}

.btn-edit-info {
  display: block-inline;
  float: right;
}

.loading-area {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 9;
  background: rgba(0, 0, 0, 0.3);
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

.table-meta {
  width: 500px;
}

.materiales-table {
  min-width: 750px;
  border: 0;
}

.materiales-table th {
  height: 40px;
  text-align: center;
}

.materiales-table th.desperdicio {
  width: 90px;
}
.waste-note {
  position: relative;
  bottom: 20px;
}
.muted {
  color: #9a9a9a;
  font-size: 12px;
}
.bold {
  font-weight: bold;
}

.row-label {
  width: 200px;
  text-align: center;
}

.table-title {
  text-transform: capitalize;
  text-align: center;
  font-size: 18px;
}

.table-meta.table-hover > tbody > tr.table-title-row:hover {
  background-color: transparent;
}

.toggle-meta-label {
  font-weight: initial;
  cursor: pointer;
}

.table-card-stock {
  margin: 5px;
}

.cantidad-row {
  width: 200px;
}

.estado-row {
  width: 100%;
}

.nombre-row {
  width: 70%;
}

.cantidad-manual-row {
  width: 60px;
}

.contenedor-finalizar-proyecto {
  border-left: 1px solid black;
  border-right: 1px solid black;
}

@media (max-width: 750px) {
  .columna-botones-cortes {
    margin-top: 10px;
  }
  .contenedor-finalizar-proyecto {
    border-left: 0;
    border-right: 0;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .materiales-table {
    min-width: initial;
    width: initial;
    margin: 0 auto;
  }

  .estado-row {
    min-width: 135px;
  }

  .hide-sm {
    display: none;
  }
}



.vue-lightbox ul {
  max-width: 1075px !important;
}
.vue-lightbox ul li {
  transition: 0.4s;
  margin-left: 8px;
  border: 3px solid transparent;
  list-style: none;
  display: inline-block;
  padding: 0 !important;
  height: 156px;
  &:hover {
    border-color: rgba(0, 157, 230, 0.2);
  }

  &.img-selected {
    border-color: #03a9f4;
  }
}

.seccion-box{
  width:35%;
  height: auto;
  border: 1px solid rgb(194, 194, 194);
  text-align: left;
}

.seccion-folder{
  width: 96%;
  height: 45px;
  padding: 0px;
  border:#ccd5dd;
  background-color: aliceblue;
  color:#4e8abe;
  font-weight: 700;
  z-index: 100;
}
.seccion-folder-active{
  transform: scale(1.03);
  box-shadow: 1px 3px 3px 1px gray;
}
.box-seccion-menu{
  padding: 10px;
}
.title_folder{
  font-size: 16px;
  text-decoration: underline;
  color: #03a9f4;

}
.flex{
  display: flex;
}
</style>
