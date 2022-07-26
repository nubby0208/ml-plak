<template>
  <div>
    <div>
          <div style="display:none" ref="preguntasVentas" class="save-module-modal">
        <div>
          <h3>Preguntas</h3>
          <br/>
          <form style="text-align:left">
            <div class="form-group">
              <div v-for="(p, i) in preguntasVentas" :key="i">
                <label for="module-config-name">{{p.pregunta}}</label>
                <input v-model="p.respuesta" @keyup="updatePreguntas" type="text" class="form-control modulo-save-name" id="module-config-name">
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <form autocomplete="off" class="caja form-horizontal">

      <b-card v-show="username" no-body class="datos-de-cliente-card" header-class="text-center" align="left">
        <b-card-header>
          Datos de Cliente
          <span v-on:click="toggleContainer('datosCliente')" class="cursor-pointer">
              <span class="container-toggler more" v-if="containerExpanded['datosCliente']">▼</span>
              <span class="container-toggler less" v-if="!containerExpanded['datosCliente']">▲</span>
          </span>
          <button title ="Imprimir" type="button" class="btn btn-sm ml-btn-sm btn-primary" @click="imprimir($event)">
            Imprimir
          </button>
        </b-card-header>

        <b-card-body :class="{'uncollapsed': containerExpanded['datosCliente']}">
          <div class="flex-1">
            <div class="form-group row">
              <div class="col-md-9" align="right">
                <button title ="Actualizar Proyecto" type="button" class="btn btn-sm ml-btn-sm btn-primary" v-on:click="updateProject()">
                  Actualizar...
                </button>
              </div>
            </div>
            <!-- Select input-->
            <div class="form-group row">
              <label class="col-md-3 control-label" style="text-align:left !important;" for="estado-proyecto">Estado del Proyecto</label>
              <div class="col-md-6">
                <select v-model="estadoProyecto" name="estado-proyecto" class="form-control form-control-sm">
                  <option :key="'Presupuesto'" :value="'Presupuesto'">Presupuesto</option>
                  <option :key="'Proyecto en Curso'" :value="'Proyecto en Curso'">Proyecto en Curso</option>
                  <option :key="'Exportado'" :value="'Exportado'">Exportado</option>
                </select>
              </div>
            </div>

            <!-- Text input-->
            <div class="form-group row">
              <label class="col-md-3 control-label" for="name">Nombre y Apellido</label>
              <div class="col-md-6">
                <input v-model="name" @keyup="maskSinEspeciales($event, 'name')" name="name" type="text" placeholder="" class="form-control form-control-sm" required="">
              </div>
            </div>

            <!-- Text input-->
            <div class="form-group row">
              <label class="col-md-3 control-label" for="address">Dirección</label>
              <div class="col-md-6">
                <textarea v-model="address" name="address" type="text" placeholder="" class="form-control form-control-sm"></textarea>
              </div>
            </div>

            <!-- Text input-->
            <div class="form-group row">
              <label class="col-md-3 control-label" for="phone">Teléfono</label>
              <div class="col-md-6">
                <input v-model="phone" name="phone" type="text" placeholder="" class="form-control form-control-sm">
              </div>
            </div>

            <!-- Text input-->
            <div class="form-group row">
              <label class="col-md-3 control-label" for="mueble">Mueble</label>
              <div class="col-md-6">
                <input v-model="mueble" @keyup="maskSinEspeciales($event, 'mueble')" name="mueble" type="text" placeholder="" class="form-control form-control-sm">
              </div>
            </div>

            <!-- Text input-->
            <div class="form-group row">
              <label class="col-md-3 control-label" for="comentarioInstalacion">Comentario General</label>
              <div class="col-md-6">
                <textarea v-model="comentarioInstalacion" name="comentarioInstalacion" placeholder="" class="form-control form-control-sm"></textarea>
              </div>
            </div>

            <div class="form-group row">
              <label class="col-md-3 control-label" for="comentarioInstalacion">Comentario Resumen</label>
              <div class="col-md-6">
                <textarea v-model="comentarioResumen" name="comentarioInstalacion" placeholder="" class="form-control form-control-sm"></textarea>
              </div>
            </div>
            <!-- Text input-->
            <div class="form-group row">
              <label class="col-md-3 control-label" for="encargadoMed">Encargado de la Medición</label>
              <div class="col-md-6">
                <select v-model="encargadoMed" class="form-control form-control-sm">
                    <option :value="u.id"  v-for="u in usuarios" v-bind:key="u.id">{{u.nombre_completo}}</option>
                </select>
              </div>
            </div>
            <!-- Text input-->
            <div class="form-group row">
              <label class="col-md-3 control-label" for="encargadoInst">Encargado del Diseño</label>
              <div class="col-md-6">
                <select v-model="encargadoInst" class="form-control form-control-sm">
                    <option :value="u.id"  v-for="u in usuarios" v-bind:key="u.id">{{u.nombre_completo}}</option>
                </select>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-md-9">
                <button title ="Agregar Link Externo" type="button" class="btn btn-sm ml-btn-sm btn-primary" v-on:click="addExternalLink()">
                  + Link Externo
                </button>
              </div>
            </div>
            <div class="form-group row" v-for="(n, index) in links" :key="index">
              <label class="col-md-3 control-label" for="link">Link externo {{index + 1}}</label>
              <div class="col-md-6" style="display: flex;">
                <input style="margin-right: 5px;" type="text" @change="updateStoreEvent" v-model="linksDescipcion[index]" name="link" placeholder="Descripcion link" class="form-control form-control-sm">
                <input type="text" v-model="links[index]" @change="updateStoreEvent" name="link" placeholder="Link" class="form-control form-control-sm">
              </div>
              <button title ="Eliminar" type="button" class="btn btn-sm ml-btn-sm btn-danger" v-on:click="removeExternalLink(index)">
                X
              </button>
            </div>
          </div>
          <div class="flex-1">
            <template v-if="estadoProyecto!='Presupuesto' && loadedProjectId!=undefined">
            <!-- Date input-->
              <div class="form-group row">
                  <div class="col-md-12" align="left">
                    <b>Medición</b>
                    <button v-if="!oper_med && estadoProyecto!='Exportado'" type="button" title ="Agregar" class="btn btn-sm ml-btn-sm btn-success" v-on:click="operMedicion(1)">
                    +</button>
                  </div>
              </div>
              <div class="form-group row" v-if="oper_med">
                <label class="col-md-2 control-label" for="fecha_medinst">Fecha</label>
                <div class="col-md-4">
                      <span><input style="width: 130px" v-model="medicion.fecha_medinst" name="fecha_medinst"  title="Click en el día del Calendario" readonly v-on:click="showCalendar(0)">
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
                    <button type="button" title ="Guardar" class="btn btn-sm ml-btn-sm btn-primary" v-on:click="addFechaMedicion()">
                    <font-awesome-icon icon="check"></font-awesome-icon></button>
                    <button type="button" title ="Cancelar" class="btn btn-sm ml-btn-sm btn-danger" v-on:click="operMedicion(0)">
                    <b>X</b></button>
                  </div>
              </div>
              <div class="form-group row">
                <div class="col-md-12">
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
                              <button v-if="estadoProyecto!='Exportado'"
                                class="btn btn-sm ml-btn-sm btn-danger"
                                @click="deleteFechaMedInst(med.id,$event)"
                              >
                                <font-awesome-icon icon="trash"></font-awesome-icon>
                              </button>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                </div>
              </div>
              <div class="form-group row">
                  <div class="col-md-12" align="left">
                    <b>Instalación</b>
                    <button v-if="!oper_inst && estadoProyecto!='Exportado'" type="button" title ="Agregar" class="btn btn-sm ml-btn-sm btn-success" v-on:click="operInstalacion(1)">
                    +</button>
                  </div>
              </div>
              <div class="form-group row" v-if="oper_inst">
                <label class="col-md-2 control-label" for="fecha_medinst">Fecha</label>
                <div class="col-md-4">
                      <span><input style="width: 130px" v-model="instalacion.fecha_medinst" name="fecha_medinst" title="Click en el día del Calendario" v-on:click="showCalendar(1)">
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
                    <button type="button" title ="Guardar" class="btn btn-sm ml-btn-sm btn-primary" v-on:click="addFechaInstalacion()">
                    <font-awesome-icon icon="check"></font-awesome-icon></button>
                    <button type="button" title ="Cancelar" class="btn btn-sm ml-btn-sm btn-danger" v-on:click="operInstalacion(0)">
                    <b>X</b></button>
                  </div>
              </div>
              <div class="form-group row">
                <div class="col-md-12">
                    <table class="table">
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
                </div>
              </div>
            </template>

            <!-- div v-if="estadoProyecto=='Proyecto en Curso'">
              <div v-for="(f, index) in fechaMedicion" :key="index">
                <div class="form-group row">
                  <label class="col-md-3 control-label" for="fechaMedicion">Fecha Medición {{index + 1}}
                  <button v-if="index == 0" type="button" title ="Agregar" class="btn btn-sm ml-btn-sm btn-primary" v-on:click="addFechaMedicion()">
                  +</button></label>
                  <div class="col-md-4">
                    <input style="width: 170px" v-model="fechaMedicion[index]" name="fechaMedicion" type="date" title="Click en el día del Calendario" readonly v-on:click="showCalendar(index,1)">
                    <span>&#128197;</span>
                  </div>
                  <button v-if="index > 0" title="Eliminar" type="button" class="btn btn-sm ml-btn-sm btn-danger" v-on:click="removeFechaMedicion(index)">
                    X
                  </button>
                </div>
                <div class="form-group row">
                  <label class="col-md-3 control-label" for="horaMedicion">Hora Medición {{index + 1}}</label>
                  <div class="col-md-4">
                    <datetime v-model="horaMedicion[index]" :phrases="{ok: 'Seleccionar', cancel: 'Cancelar'}"
                    class="datetime-picker" type="time" title="Hora de medición" format="HH:mm"
                    value-zone="America/Buenos_Aires"
                    ></datetime>
                  </div>
                </div>
              </div-->
              <!-- Date input-->
              <!--div class="form-group row">
                <label class="col-md-3 control-label" for="fechaInstalacion">Fecha Instalación 1
                  <button title ="Agregar" type="button" class="btn btn-sm ml-btn-sm btn-primary" v-on:click="addOtrasFechaInstalacion()">
                  + </button></label>
                <div class="col-md-4">
                  <input style="width: 170px" v-model="fechaInstalacion" name="fechaMedicion" type="date" title="Click en el día del Calendario"  readonly v-on:click="showCalendar(0,-1)">
                  <span>&#128197;</span>
                </div>
              </div>
              <div class="form-group row">
                <label class="col-md-3 control-label" for="horaInstalacion">Hora Instalación 1</label>
                <div class="col-md-4">
                  <datetime v-model="horaInstalacion" :phrases="{ok: 'Seleccionar', cancel: 'Cancelar'}"
                  class="datetime-picker" type="time" title="Hora de instalación" format="HH:mm"
                  value-zone="America/Buenos_Aires"
                  ></datetime>
                </div>
              </div>
              <div v-for="(f, index) in otrasFechaInstalacion" :key="index">
                <div class="form-group row">
                  <label class="col-md-3 control-label" for="otrasFechaInstalacion">Fecha Instalación {{index + 2}}</label>
                  <div class="col-md-4">
                    <input style="width: 170px" v-model="otrasFechaInstalacion[index]" name="otrasFechaInstalacion" type="date" title="Click en el día del Calendario" readonly v-on:click="showCalendar(index,2)">
                    <span>&#128197;</span>
                  </div>
                  <button title="Eliminar" type="button" class="btn btn-sm ml-btn-sm btn-danger" v-on:click="removeOtrasFechaInstalacion(index)">
                  X</button>
                </div>
                <div class="form-group row">
                  <label class="col-md-3 control-label" for="otrasHoraInstalacion">Hora Instalación {{index + 2}}</label>
                  <div class="col-md-4">
                    <datetime v-model="otrasHoraInstalacion[index]" :phrases="{ok: 'Seleccionar', cancel: 'Cancelar'}"
                    class="datetime-picker" type="time" title="Hora de instalación" format="HH:mm"
                    value-zone="America/Buenos_Aires"
                    ></datetime>
                  </div>
                </div>


              </div>


            </div-->

          </div>
        </b-card-body>

      </b-card>

      <br>
      <b-card v-if="$store.getters.getDetalleExportar" no-body class="datos-de-cliente-card" header-class="text-center" align="left">
        <b-card-header>
          Detalles al exportar
          <span v-on:click="toggleContainer('datellesExportar')" class="cursor-pointer">
              <span class="container-toggler more" v-if="containerExpanded['datellesExportar']">▼</span>
              <span class="container-toggler less" v-if="!containerExpanded['datellesExportar']">▲</span>
          </span>
        </b-card-header>

        <b-card-body style="display:block;" :class="{'uncollapsed': containerExpanded['datellesExportar']}">

            <center>
              <h3>Historial de exportación</h3>
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

              <tr v-for="(usr, indx) in $store.getters.getDetalleExportar.usuarios" :key="indx">
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
          <div>

            <center>
              <h3>Preguntas al exportar</h3>
            </center>

            <table class="table table-hover">
              <thead>
                <th style="text-align:center">#</th>
                <th style="text-align:center">Preguntas</th>
                <th style="text-align:center">Respuestas</th>
              </thead>
              <tbody>
                <template v-if="$store.getters.getDetalleExportar.hasOwnProperty('preguntas')">
                  <tr v-for="(item, i) in $store.getters.getDetalleExportar.preguntas" :key="i">
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
        </b-card-body>
      </b-card>

      <b-card no-body class="datos-de-cliente-card" header-class="text-center" align="left">
        <b-card-header>
          Preguntas ventas
          <span v-on:click="toggleContainer('preguntasVentas')" class="cursor-pointer">
              <span class="container-toggler more" v-if="containerExpanded['preguntasVentas']">▼</span>
              <span class="container-toggler less" v-if="!containerExpanded['preguntasVentas']">▲</span>
          </span>
        </b-card-header>

        <b-card-body style="display:block;" :class="{'uncollapsed': containerExpanded['preguntasVentas']}">

            <table class="table table-hover">
              <thead>
                <th style="text-align:center">#</th>
                <th style="text-align:center">Preguntas</th>
                <th style="text-align:center">Respuestas</th>
              </thead>
              <tbody>
                <template v-if="$store.getters.statusPreguntas">
                  <tr v-for="(item, i) in $store.state.exportar.preguntasVender" :key="i">
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

            <button title ="Actualizar preguntas" type="button" class="btn btn-sm ml-btn-sm btn-primary" v-on:click="custionarVentas">
              Modificar preguntas
            </button>

        </b-card-body>
      </b-card>

      <br>

      <span style="opacity:0">
        {{updateCount}}
      </span>
      <br>
      <b-card v-if="estadoProyecto!='Presupuesto' && loadedProjectId!=undefined" no-body v-show="username" header-class="text-center" align="left">
        <b-card-header>
          Capacidad de Producción
          <span v-on:click="toggleContainer('capacidadProd')" class="cursor-pointer">
              <span class="container-toggler more" v-if="containerExpanded['capacidadProd']">▼</span>
              <span class="container-toggler less" v-if="!containerExpanded['capacidadProd']">▲</span>
          </span>
        </b-card-header>
        <b-card-body :class="{'uncollapsed': containerExpanded['capacidadProd']}">
            <b-form  @submit="storeCP" autocomplete="off">
              <div class="row">
                    <div v-if="updateIndex!==0" class="form-group col-md-2" align="center">
                        <label for="item" class="control-label">Item</label>
                        <b-form-input style="text-align:center" :disabled="parseInt(capacidad)==0"
                        readonly
                        class="form-control"
                        id="tiempo_disenio"
                        v-model="form.item"
                      />
                    </div>
                    <div v-if="updateIndex===0" class="form-group col-md-2" align="center">
                      <label for="item" class="control-label">Item</label><br>
                      <b-form-select
                        :disabled="estadoProyecto=='Exportado'"
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
                        v-model="form.tiempo_disenio"
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
                        v-model="form.tiempo_produccion"
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
                        v-model="form.tiempo_medicion"
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
                        v-model="form.tiempo_instalacion"
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
                        class="form-control"
                        id="coeficiente_multiplicador"
                        v-model="form.coeficiente_multiplicador"
                      />
                    </div>
              </div>
            </b-form>
            <div class="row">
              <div class="col-md-12" align="center">
                <button v-if="estadoProyecto!='Exportado' && updateIndex" type="button" @click="updateCP()" class="btn btn-sm btn-primary">Guardar</button>
                <button v-if="estadoProyecto!='Exportado' && !updateIndex && capacidad" type="button" @click="storeCP()" class="btn btn-sm btn-primary">Agregar</button>
                <button v-if="estadoProyecto!='Exportado' && (capacidad || updateIndex)" type="button" @click="setearItem()" class="btn btn-sm btn-danger">Cancelar</button>
              </div>
            </div>
            <br />
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
                        <button v-if="estadoProyecto!='Exportado'"
                          class="btn btn-sm btn-success"
                          @click="editItem(item)"
                        >
                          <font-awesome-icon icon="edit"></font-awesome-icon>
                        </button>
                        <button v-if="estadoProyecto!='Exportado'"
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
        </b-card-body>
      </b-card>
      <!----- Tiempo Traslado ----------------------------------------------->
       <br>
      <b-card v-if="estadoProyecto!='Presupuesto' && loadedProjectId!=undefined" no-body v-show="username" header-class="text-center" align="left">
        <b-card-header>
          Tiempo de Traslado
          <span v-on:click="toggleContainer('tiempoTP')" class="cursor-pointer">
              <span class="container-toggler more" v-if="containerExpanded['tiempoTP']">▼</span>
              <span class="container-toggler less" v-if="!containerExpanded['tiempoTP']">▲</span>
          </span>
        </b-card-header>
        <b-card-body :class="{'uncollapsed': containerExpanded['tiempoTP']}">
            <b-form  @submit="storeTTP" autocomplete="off">
              <div class="row">
                    <div v-if="updateIndex!==0" class="form-group col-md-10" align="center">
                        <label for="item" class="control-label">Descripcion</label>
                        <b-form-input style="text-align:center" :disabled="parseInt(traslado)==0"
                        readonly
                        class="form-control"
                        id="descripcion"
                        v-model="formTTP.descripcion"
                      />
                    </div>
                    <div v-if="updateIndex===0" class="form-group col-md-10" align="center">
                      <label for="item" class="control-label">Descripción</label><br>
                      <b-form-select
                        :disabled="estadoProyecto=='Exportado'"
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
                <button v-if="estadoProyecto!='Exportado' && updateIndex" type="button" @click="updateTTP()" class="btn btn-sm btn-primary">Guardar</button>
                <button v-if="estadoProyecto!='Exportado' && !updateIndex && traslado" type="button" @click="storeTTP()" class="btn btn-sm btn-primary">Agregar</button>
                <button v-if="estadoProyecto!='Exportado' && (traslado || updateIndex)" type="button" @click="setearItemTTP()" class="btn btn-sm btn-danger">Cancelar</button>
              </div>
            </div>
            <br />
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <th style="text-align:center">#</th>
                  <th style="text-align:center">Descripción</th>
                  <th style="text-align:center">Tiempo Traslado</th>
                  <th></th>
                </thead>
                <tbody>
                  <template v-if="tiempoTrasladoProy.length > 0">
                    <tr v-for="(item, i) in tiempoTrasladoProy" :key="i">
                      <td align="center">{{ i + 1 }}</td>
                      <td align="center">{{ item.descripcion }}</td>
                      <td align="center">{{ item.tiempo_traslado }}</td>
                      <td>
                        <button v-if="estadoProyecto!='Exportado'"
                          class="btn btn-sm btn-success"
                          @click="editItemTTP(item)"
                        >
                          <font-awesome-icon icon="edit"></font-awesome-icon>
                        </button>
                        <button v-if="estadoProyecto!='Exportado'"
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
        </b-card-body>
      </b-card>
      <!-- ------------------------------------------------------------------>
      <br>
      <b-card no-body v-show="username" header-class="text-center" align="left">
        <b-card-header>
          Pago
          <span v-on:click="toggleContainer('pago')" class="cursor-pointer">
              <span class="container-toggler more" v-if="containerExpanded['pago']">▼</span>
              <span class="container-toggler less" v-if="!containerExpanded['pago']">▲</span>
          </span>
        </b-card-header>

        <b-card-body :class="{'uncollapsed': containerExpanded['pago']}">
          <div v-if="isAdmin">
            <table class="productos-table">
              <tbody>
                <tr class="striped" v-for="(n, index) in items" :key="index" :class="{even: index % 2 === 1, odd: index % 2 === 0 }">
                  <td class="first-col">
                    <span>${{items[index].monto}}</span>
                  </td>
                  <td class="middle-col">
                    <span>{{items[index].descripcion}}</span>
                  </td>
                  <td class="left-border">
                    <span class="fecha-creacion">{{toReadableDate(items[index].date)}}</span>
                    <span class="created-by">{{items[index].createdBy}}</span>
                  </td>
                </tr>
                <tr class="unsaved-row" v-for="(n, index) in unsavedItems" :key="index" :class="{even: index % 2 === 1, odd: index % 2 === 0 }">
                  <td>
                    <input v-model="unsavedItems[index].monto" @input="unsavedItems[index].monto = maskNumero(unsavedItems[index].monto)" v-on:blur="unsavedItems[index].monto = validarPuntoDecimal(unsavedItems[index].monto)" name="saldo" type="text" placeholder="Monto" class="form-control form-control-sm saldo-control" @blur="updateTotal()">
                  </td>
                  <td class="middle-col">
                    <input v-model="unsavedItems[index].descripcion" name="descripcion" type="text" placeholder="Producto" class="form-control form-control-sm" v-on:keyup.enter="savePaymentItem(index)">
                  </td>
                  <td class="left-border">
                    <button type="button" class="btn btn-sm ml-btn-sm btn-link" :disabled="!unsavedItems[index].monto" v-on:click="savePaymentItem(index)">
                      Guardar Item
                    </button>
                    <button type="button" class="btn btn-sm ml-btn-sm btn-link" v-on:click="removeItem(index)">
                      Eliminar Item
                    </button>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td class="middle-col">
                    <button type="button" class="btn btn-sm ml-btn-sm btn-link" v-on:click="addPaymentItem()" :disabled="unsavedItems.length > 0">
                      Agregar Producto
                    </button>
                  </td>
                  <td class="left-border"></td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td>${{total}}</td>
                  <td colspan="2">Total cargos por productos</td>
                </tr>
              </tfoot>
            </table>

            <table class="pago-table">
              <tbody>
                <tr class="striped" v-for="(n, index) in pagos" :key="index" :class="{even: index % 2 === 1, odd: index % 2 === 0 }">
                  <td class="first-col" style="width: 15%">
                    <span>${{pagos[index].monto}}</span>
                  </td>
                  <td class="" style="width: 30%">
                    <span>{{pagos[index].descripcion}}</span>
                  </td>
                  <td class="" style="width: 30%">
                    <span v-if="pagos[index].tipo !== -1">{{pagos[index].tipo}}</span>
                    <span v-if="pagos[index].tipo === -1">{{pagos[index].tipoPago}}</span>
                  </td>
                  <td class="left-border">
                    <span class="fecha-creacion">{{toReadableDate(pagos[index].date)}}</span>
                    <span class="created-by">{{pagos[index].createdBy}}</span>
                  </td>
                </tr>
                <tr class="unsaved-row" v-for="(n, index) in unsavedPagos" :key="index" :class="{even: index % 2 === 1, odd: index % 2 === 0 }">
                  <td>
                    <input v-model="unsavedPagos[index].monto" @input="unsavedPagos[index].monto = maskNumero(unsavedPagos[index].monto)" v-on:blur="unsavedPagos[index].monto = validarPuntoDecimal(unsavedPagos[index].monto)" name="saldo" type="text" placeholder="Monto" class="form-control form-control-sm saldo-control" @blur="updateSaldo()">
                  </td>
                  <td class="">
                    <input v-model="unsavedPagos[index].descripcion" name="descripcion" type="text" placeholder="Descripcion" class="form-control form-control-sm" v-on:keyup.enter="saveInstallment(index)">
                  </td>

                  <td>
                    <select v-model="unsavedPagos[index].tipo" placeholder="Tipo de Pago" class="form-control form-control-sm" @change="onPaymentChanged(index)">
                      <option :value="'efectivo'">Efectivo</option>
                      <option :value="'transferencia'">Transferencia</option>
                      <option :value="'debito'">Debito</option>
                      <option :value="'3 cuotas'">3 Cuotas</option>
                      <option :value="'6 cuotas'">6 Cuotas</option>
                      <option :value="'9 cuotas'">9 Cuotas</option>
                      <option :value="'12 cuotas'">12 Cuotas</option>
                      <option :value="'18 cuotas'">18 Cuotas</option>
                      <option :value="-1">Otra</option>
                    </select>

                    <input v-if="unsavedPagos[index].tipo === -1" v-model="unsavedPagos[index].tipoPago" name="payment" type="text" placeholder="Tipo de Pago" class="form-control form-control-sm">
                  </td>

                  <td class="left-border">
                    <button type="button" class="btn btn-sm ml-btn-sm btn-link" :disabled="!unsavedPagos[index].monto" v-on:click="saveInstallment(index)">
                      Guardar Pago
                    </button>
                    <button type="button" class="btn btn-sm ml-btn-sm btn-link" v-on:click="removeInstallment(index)">
                      Eliminar Pago
                    </button>
                  </td>
                </tr>

                <tr>
                  <td></td>
                  <td colspan="2">
                    <button type="button" class="btn btn-sm ml-btn-sm btn-link" v-on:click="addInstallments()" :disabled="unsavedPagos.length > 0">
                      Agregar Pago
                    </button>
                  </td>
                  <td class="left-border"></td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td>${{totalPagos}}</td>
                  <td colspan="3">Total de pagos recibidos</td>
                </tr>
              </tfoot>
            </table>

            <table class="total-table">
              <tfoot>
                <tr>
                  <td style="width: 15%;">${{total - totalPagos}}</td>
                  <td>Total Saldo Pendiente</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </b-card-body>
      </b-card>

      <br>

      <b-card no-body v-show="username" header-class="text-center" align="left">
        <b-card-header>
          Datos del Mueble
          <span v-on:click="toggleContainer('datosMueble')" class="cursor-pointer">
              <span class="container-toggler more" v-if="containerExpanded['datosMueble']">▼</span>
              <span class="container-toggler less" v-if="!containerExpanded['datosMueble']">▲</span>
          </span>
        </b-card-header>

        <b-card-body :class="{'uncollapsed': containerExpanded['datosMueble']}">
          <!-- Select Basic -->
          <div class="form-group row">
            <label class="col-md-2 control-label" style="text-align:left !important;" for="modules">Cantidad de Modulos</label>
            <div class="col-md-3">
              <select v-model="moduleCount" name="modules" class="form-control form-control-sm" @change="updateModuleCount()">
                <option v-for="n in 30" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>

            <div class="col-md-5 flex" style="margin-bottom: 20px; flex-direction: row-reverse">
              <b-button variant="outline-primary" @click="updateMaterials()">Actualizar materiales</b-button>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-md-2 control-label" style="text-align:left !important;" for="groups">Grupos</label>
            <div class="col-md-4 flex">
              <div class="module-selector-container">
                <b-form-select v-model="selectedActivatedModules" :options="activatedModules" multiple :select-size="4" class="module-selector"></b-form-select>
                <span class="low-visibility">Módulos activos</span>
              </div>
              <div class="toggle-activation-btns">
                <button type="button" class="btn btn-sm ml-btn-sm" v-on:click="activateModules()">
                </button>
                <button type="button" class="btn btn-sm ml-btn-sm" v-on:click="deactivateModules()">
                  >
                </button>
              </div>
              <div  class="module-selector-container">
                <b-form-select v-model="selectedDeactivatedModules" multiple :options="deactivatedModules" :select-size="4" class="module-selector"></b-form-select>
                <span class="low-visibility">Módulos inactivos</span>
              </div>
            </div>
          </div>

          <b-card  header="MATERIALES" header-class="text-center" align="left">
            <!-- SECCION DONDE SE AGREGARAN LOS MATERIALES DE FORMA DINAMICA -->
            <div class="form-group row">
              <table class="table materiales_add">
                <tr v-show="!materiales_add.length">
                  <th colspan="7" class="no-material">No ha Agregado Ningun Material</th>
                </tr>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Precio M2</th>
                  <th>Precio Placa</th>
                  <th>Ancho Veta</th>
                  <th>Largo Veta</th>
                  <th>Accion <span title="Agragar Materiales" @click="showMateriales" class="add_material">+</span></th>
                </tr>
                <tr
                  :key="id"
                  v-for="(material, id) in materialesAdd"
                >
                  <td>Material {{ id + 1  }}</td>
                  <td>{{ material.material }}</td>
                  <td>{{ material.precio_mt2 }}</td>
                  <td>{{ material.precio_placa }}</td>
                  <td>{{ material.ancho_veta }}</td>
                  <td>{{ material.largo_veta }}</td>
                  <td><span title="Quitar Material" class="cancel-material" @click="removeMaterial(id)"><font-awesome-icon icon="trash"></font-awesome-icon></span></td>
                </tr>
              </table>
            </div>
            <!-- END SECCION DONDE SE AGREGARAN LOS MATERIALES DE FORMA DINAMICA -->
          </b-card>

          <br>

          <b-card  header="TAPACANTOS" header-class="text-center" align="left">
            <!-- SECCION DONDE SE AGREGARAN LOS TAPACANTOS DE FORMA DINAMICA -->
            <div class="form-group row">
              <table class="table materiales_add">
                <tr v-show="!tapacantos_add.length">
                  <th colspan="7" class="no-material">No ha Agregado Ningun Tapacantos</th>
                </tr>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Material</th>
                  <th>Alto</th>
                  <th>Espesor</th>
                  <th>Precio M2</th>
                  <th>Accion <span @click='showTapacantos' title='Agragar Tapacantos' class='add_material'>+</span></th>
                </tr>
                <tr
                  :key="id"
                  v-for="(tapacantos, id) in tapacantosAdd"
                >
                  <td>Tapacantos {{ id + 1  }}</td>
                  <td>{{ tapacantos.nombre }}</td>
                  <td>{{ tapacantos.material }}</td>
                  <td>{{ tapacantos.alto }}</td>
                  <td>{{ tapacantos.espesor }}</td>
                  <td>{{ tapacantos.precio_mt2 }}</td>
                  <td><span title="Quitar Tapacantos" class="cancel-material" @click="removeTapacantos(id)"><font-awesome-icon icon="trash"></font-awesome-icon></span></td>
                </tr>
              </table>
            </div>
            <!-- END SECCION DONDE SE AGREGARAN LOS TAPACANTOS DE FORMA DINAMICA -->
          </b-card>

          <br>

          <b-card  header="HERRAJES" header-class="text-center" align="left">
            <!-- SECCION DONDE SE AGREGARAN LOS HERRAJES DE FORMA DINAMICA -->
            <div class="form-group row">
              <table class="table materiales_add">
                <tr v-show="!herrajes_add.length">
                  <th colspan="10" class="no-material">No ha Agregado Ningun Herraje</th>
                </tr>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Material</th>
                  <th>Desc. Alto</th>
                  <th>Desc. Ancho</th>
                  <th>Alto</th>
                  <th>Ancho</th>
                  <th>Espesor</th>
                  <th>Precio M2</th>
                  <th>Accion <span @click="showHerrajes" title='Agragar Herrajes' class='add_material'>+</span></th>
                </tr>
                <tr
                  :key="id"
                  v-for="(herraje, id) in herrajesAdd"
                >
                  <td>Herraje {{ id + 1  }}</td>
                  <td>{{ herraje.nombre }}</td>
                  <td>{{ herraje.material }}</td>
                  <td>{{ herraje.descuento_alto }}</td>
                  <td>{{ herraje.descuento_ancho }}</td>
                  <td>{{ herraje.alto }}</td>
                  <td>{{ herraje.ancho_veta }}</td>
                  <td>{{ herraje.espesor }}</td>
                  <td>{{ herraje.precio_mt2 }}</td>
                  <td><span title="Quitar Herraje" class="cancel-material" @click="removeHerraje(id)"><font-awesome-icon icon="trash"></font-awesome-icon></span></td>
                </tr>
              </table>
            </div>
            <!-- END SECCION DONDE SE AGREGARAN LOS HERRAJES DE FORMA DINAMICA -->
          </b-card>

          <br>

          <b-card  header="METALES Y KITS" header-class="text-center" align="left">
            <!-- SECCION DONDE SE AGREGARAN LOS METALES DE FORMA DINAMICA -->
            <div class="form-group row">
              <table class="table materiales_add">
                <tr v-show="!metales_add.length">
                  <th colspan="10" class="no-material">No ha Agregado Ningun Metal</th>
                </tr>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Material</th>
                  <th>Descuento Alto</th>
                  <th>Descuento Ancho</th>
                  <th>Alto</th>
                  <th>Ancho</th>
                  <th>Espesor</th>
                  <th>Precio M2</th>
                  <th>Accion <span @click="showMetales" title='Agragar Metales y Kits' class='add_material'>+</span></th>
                </tr>
                <tr
                  :key="id"
                  v-for="(metal, id) in metalesAdd"
                >
                  <td>Metal {{ id + 1  }}</td>
                  <td>{{ metal.nombre }}</td>
                  <td>{{ metal.material }}</td>
                  <td>{{ metal.descuento_alto }}</td>
                  <td>{{ metal.descuento_ancho }}</td>
                  <td>{{ metal.alto }}</td>
                  <td>{{ metal.ancho_veta }}</td>
                  <td>{{ metal.espesor }}</td>
                  <td>{{ metal.precio_mt2 }}</td>
                  <td><span title="Quitar Metal" class="cancel-material" @click="removeMetal(id)"><font-awesome-icon icon="trash"></font-awesome-icon></span></td>
                </tr>
              </table>
            </div>
            <!-- END SECCION DONDE SE AGREGARAN LOS METALES DE FORMA DINAMICA -->
          </b-card>
        </b-card-body>

      </b-card>
      <!-- Modales -->
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
    </form>
  </div>
</template>

<script>
import Vue from 'vue'
import { HTTP } from '@/plugins/HTTP.js'

import HerrajesList from './Materiales/HerrajesList.vue'
import MaterialesList from './Materiales/MaterialesList.vue'
import MetalesKitsList from './Materiales/MetalesKitsList.vue'
import TapacantosList from './Materiales/TapacantosList.vue'
import Calendarselect from '../../../Taller/calendar/Calendarselect.vue'

export default {
  name: 'form-general',
  components: {
    Calendarselect,
  },
  data () {
    return {
      oper: 0,
      usuarios:[],
      preguntasVentas:[],
      time: {},
      timeTTP: {},
      capacidad: 0,
      traslado: 0,
      cap: 0,
      updateIndex: 0,
      capacidadProduccion: [],
      capacidadProduccionProy: [],
      tiempoTraslado:[],
      tiempoTrasladoProy:[],
      oper_inst: 0,
      oper_med: 0,
      instalaciones:[],
      mediciones:[],
      instalacion:{},
      medicion:{},
      resetFormFields: true,
      form: {},
      formTTP: {},
      fechaindex: -1,
      fechatipo: 1,
      selectedActivatedModules: [],
      selectedDeactivatedModules: [],
      activatedModules: [],
      deactivatedModules: [],
      msg: 'FormGeneral component',
      materiales_add: [],
      tapacantos_add: [],
      herrajes_add: [],
      metales_add: [],
      unsavedPagos: [],
      unsavedItems: [],
      containerExpanded: {
        datosCliente: false,
        pago: false,
        datosMueble: false,
        capacidadProd: false,
        tiempoTP: false,
        datellesExportar: false,
        preguntasVentas: false
      }
    }
  },
  mounted: function () {
    this.setearItem(),
    this.time = {
      hour: 0,
      min: 0,
    },
    this.form = {
      item: "",
      tiempo_disenio: "00:00",
      tiempo_produccion: "00:00",
      tiempo_medicion: "00:00",
      tiempo_instalacion: "00:00",
      coeficiente_multiplicador: "0",
      token_project: this.$store.state.info.token_project,
      exported: 0,
    },
    this.setearItemTTP(),
    this.formTTP = {
      descripcion: "",
      tiempo_traslado: "00:00",
      token_project: this.$store.state.info.token_project,
      exported: 0,
    };
    this.medicion = {
    fecha_medinst:"",
    hora_medinst:"",
    tipo_medinst: 0,
    comentario:"",
    token_project: this.$store.state.info.token_project,
    proyecto_json_id: this.loadedProjectId,
    };
    this.instalacion = {
    fecha_medinst:"",
    hora_medinst:"",
    tipo_medinst: 1,
    comentario:"",
    token_project: this.$store.state.info.token_project,
    proyecto_json_id: this.loadedProjectId,
    };
    console.log("Proyecto: " + this.loadedProjectId);
    if (localStorage.getItem('user-name')) {
      this.username = localStorage.getItem('user-name')
    }

    this.metales_add = this.$store.getters.getMetalesAdd
    this.herrajes_add = this.$store.getters.getHerrajesAdd
    this.tapacantos_add = this.$store.getters.getTapacantosAdd
    this.materiales_add = this.$store.getters.getMaterialesAdd

    const paymentTypes = [
      'efectivo',
      'transferencia',
      'debito',
      '3 cuotas',
      '6 cuotas',
      '9 cuotas',
      '12 cuotas',
      '18 cuotas',
      ''
    ]

    this.payment = this.$store.state.info.paymentType
    if (paymentTypes.indexOf(this.payment) === -1) {
      this.payment = -1
    }

    /*if (!this.fechaMedicion.length)
      this.addFechaMedicion()

    if (!this.horaMedicion.length)
      this.addHoraMedicion()*/
    this.getCPAll()
    this.getCPPAll()
    this.getTTAll()
    this.getTTPAll()
    this.getMedAll()
    this.getInstAll()
    this.getPreguntas()
    this.oper_med=0
    this.oper_inst=0
    this.getUsuarios()
  },
  computed: {
    loadedProjectId: {
      get() {
        return localStorage.getItem("projectID") || undefined;
      },
      set(value) {
        localStorage.setItem("projectID", value);
      },
    },
    updateCount() {
      // TODO: fix
      this.updateModuleCount();
      return;
    },
    isAdmin () {
      return localStorage.getItem('user-rol') === 'Administrador'
    },
    today () {
      return new Date().toISOString()
    },
    staging () {
      return process.env.NODE_ENV === 'development-stage'
    },
    materialesAdd () {
      this.materiales_add = this.$store.getters.getMaterialesAdd
      return this.materiales_add
    },
    tapacantosAdd () {
      this.tapacantos_add = this.$store.getters.getTapacantosAdd
      return this.tapacantos_add
    },
    herrajesAdd () {
      this.herrajes_add = this.$store.getters.getHerrajesAdd
      return this.herrajes_add
    },
    metalesAdd () {
      this.metales_add = this.$store.getters.getMetalesAdd
      return this.metales_add
    },
    username: {
      get () {
        return this.$store.state.info.username
      },
      set (value) {
        this.$store.commit('setGeneralInfo', { key: 'username', value: value })
      }
    },
    name: {
      get () {
        return this.$store.state.info.name
      },
      set (value) {
        this.$store.commit('setGeneralInfo', { key: 'name', value: value })
      }
    },
    address: {
      get () {
        return this.$store.state.info.address
      },
      set (value) {
        this.$store.commit('setGeneralInfo', { key: 'address', value: value })
      }
    },
    saldo: {
      get () {
        return this.$store.state.info.saldo
      },
      set (value) {
        this.$store.commit('setGeneralInfo', { key: 'saldo', value: value })
      }
    },
    seniaDescripcion: {
      get () {
        return this.$store.state.info.seniaDescripcion
      },
      set (value) {
        this.$store.commit('setGeneralInfo', { key: 'seniaDescripcion', value: value })
      }
    },
    totalDescripcion: {
      get () {
        return this.$store.state.info.totalDescripcion
      },
      set (value) {
        this.$store.commit('setGeneralInfo', { key: 'totalDescripcion', value: value })
      }
    },
    items: {
      get () {
        return this.$store.state.info.items
      },
      set (value) {
        this.$store.commit('setGeneralInfo', { key: 'items', value: value })
      }
    },
    pagos: {
      get () {
        return this.$store.state.info.pagos
      },
      set (value) {
        this.$store.commit('setGeneralInfo', { key: 'pagos', value: value })
      }
    },
    phone: {
      get () {
        return this.$store.state.info.phone
      },
      set (value) {
        this.$store.commit('setGeneralInfo', { key: 'phone', value: value })
      }
    },
    mueble: {
      get () {
        return this.$store.state.info.mueble
      },
      set (value) {
        this.$store.commit('setGeneralInfo', { key: 'mueble', value: value })
      }
    },
    total: {
      get () {
        return this.$store.state.info.total || 0
      },
      set (value) {
        this.$store.commit('setGeneralInfo', { key: 'total', value: value })
      }
    },
    totalPagos: {
      get () {
        let totalPagos = 0
        this.pagos.forEach(p => totalPagos += +p.monto)
        return totalPagos
      }
    },
    senia: {
      get () {
        return this.$store.state.info.senia
      },
      set (value) {
        this.$store.commit('setGeneralInfo', { key: 'senia', value: value })
      }
    },
    comentarioInstalacion: {
      get () {
        return this.$store.state.info.comentarioInstalacion
      },
      set (value) {
        this.$store.commit('setGeneralInfo', { key: 'comentarioInstalacion', value: value })
      }
    },
    comentarioResumen: {
      get () {
        return this.$store.state.info.comentarioResumenPresupuestoMaterial
      },
      set (value) {
        this.$store.commit('setGeneralInfo', { key: 'comentarioResumenPresupuestoMaterial', value: value })
      }
    },
    encargadoInst: {
      get () {
        return this.$store.state.info.encargadoInst
      },
      set (value) {
        this.$store.commit('setGeneralInfo', { key: 'encargadoInst', value: value })
      }
    },
    encargadoMed: {
      get () {
        return this.$store.state.info.encargadoMed
      },
      set (value) {
        this.$store.commit('setGeneralInfo', { key: 'encargadoMed', value: value })
      }
    },
    links: {
      get() {
        return this.$store.state.info.links || []
      },
      set(value) {
        this.$store.commit('setGeneralInfo', { key: 'links', value: value })
      }
    },
    linksDescipcion() {
      return this.$store.state.info.linksDescripcion || []
    },
    estadoProyecto: {
      get () {
        return this.$store.state.info.estadoProyecto
      },
      set (value) {
        this.$store.commit('setGeneralInfo', { key: 'estadoProyecto', value: value });
        console.log(this.$store.state.exportar.statusCopiaPresupuesto);
        if(value == "Proyecto en Curso" && !this.$store.state.exportar.statusCopiaPresupuesto){
          this.generarCopiaPresupuesto();
        }
      }
    },
    moduleCount: {
      get () {
        return this.$store.getters.moduleCount
      },
      set (value) {
        this.$store.commit('setModuleCount', Number(value))
      }
    },
    tapacantos () {
      return this.$store.getters.tapacantos
    },
    tapacantoGeneral: {
      get () {
        return this.$store.state.general.tapacantoGeneral
      },
      set (value) {
        this.$store.commit('setGeneralProperty', { key: 'tapacantoGeneral', value: value })
      }
    },
    tapacantoFrente: {
      get () {
        return this.$store.state.general.tapacantoFrente
      },
      set (value) {
        this.$store.commit('setGeneralProperty', { key: 'tapacantoFrente', value: value })
      }
    }
  },
  methods: {
    updateStoreEvent(){
      this.$store.commit('setGeneralInfo', { key: 'linksDescripcion', value: this.$store.state.info.linksDescripcion })
    },
    getUsuarios() {
      //this.loadingPage = true;
      HTTP.get("/api/usuario")
        .then((result) => {
          if (result.data != null) {
            this.usuarios = result.data.usuarios;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    maskSinEspeciales(event, model){
      var valor = event.target.value;

      if(!this[model].match(/^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ]+$/u)){
        this[model] = this[model].slice(0, -1);
      }
    },
    maskNumero(valor){
      if(!valor.match(/^\d*\.?\d*$/)){
        return  valor.slice(0, -1);
      }
      return  valor;
    },
    validarPuntoDecimal(valor){
      if(valor.match(/^\d*\.$/)){
        return  valor.slice(0, -1);
      }
      return  valor;
    },
    custionarVentas(){
      this.$refs.preguntasVentas.style.display = 'block';
        this.$swal({
          content: this.$refs.preguntasVentas,
          buttons: {
            cancelar: {
              text: 'Cancelar',
              value: "0"
            },
            save: {
              text: 'Listo',
              value: "1"
            }
          }
        }).then(a=>{
          switch (a) {
            case '1':
              this.updateProject();
            break;
          }
        });
    },
    updatePreguntas(a){
      this.$store.commit("setPreguntasVenderAll", this.preguntasVentas);
    },
    getPreguntas(){
      this.$store.dispatch('getPreguntasVender').then((a) => {
        this.containerExpanded["preguntasVentas"] = !this.$store.getters.statusPreguntas;
        this.preguntasVentas = a;
      });
    },
    imprimir(e){
      e.preventDefault();
      this.$noty.info("Generando PDF");

       HTTP.post(`/api/imprimir/datos-generales`, {
		      id: this.loadedProjectId,
          token_project: this.$store.state.info.token_project,
          mediciones: this.mediciones,
          instalaciones: this.instalaciones,
          preguntas: this.preguntasVentas,
          proyecto: JSON.stringify(localStorage.vuex)
      }).then(res => {

        if (res.data.ok) {

          this.$noty.success("PDF generado correctamente");

          // base64 string
          var base64str = res.data.pdf;

          var binary = atob(base64str.replace(/\s/g, ''));
          var len = binary.length;
          var buffer = new ArrayBuffer(len);
          var view = new Uint8Array(buffer);
          for (var i = 0; i < len; i++) {
              view[i] = binary.charCodeAt(i);
          }

          var file = new Blob([view], {type: 'application/pdf'});
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL, '_blank');

        }

      }).catch(result => {
        this.$noty.error("Error al generar PDF");
      })

    },
    generarCopiaPresupuesto(){

      var nameProyect = localStorage.getItem("projectName");

      this.$noty.success('Guardando proyecto...')
      HTTP.post(`/api/proyecto-json`, {
        nombre: `${nameProyect} Presupuesto`,
        proyecto: JSON.stringify(localStorage.vuex)
      }).then(result => {
        if (result.data.success === true) {
          this.$noty.success('¡Proyecto guardado con éxito!')
          this.$store.commit('setStatusCopiaPresupuesto', true);
        }

        this.custionarVentas();

      }).catch(result => {
        this.$noty.error('Error al guardar el proyecto. Es posible que el nombre del proyecto ya este registrado')
      })

    },
    updateProject()
    {
        this.$noty.info("Actualizando proyecto...");
        HTTP.put(`/api/proyecto-json`, {
		      id: this.loadedProjectId,
          token_project: this.$store.state.info.token_project,
          mueble:  this.$store.state.info.mueble,
          client_name: this.$store.state.info.name,
          address: this.$store.state.info.address,
          phone: this.$store.state.info.phone,
          comentario: this.$store.state.info.comentarioInstalacion,
          estado: this.$store.state.info.estadoProyecto,
          encargado_inst: this.$store.state.info.encargadoInst,
          encargado_med: this.$store.state.info.encargadoMed,
          proyecto: JSON.stringify(localStorage.vuex),
        })
        .then((result) => {
            if (result.data.success === true) {
              this.$noty.success("¡Proyecto actualizado con éxito!");
            }
        })
        .catch((result) => {
            this.$noty.error("Ups, ha ocurrido un problema");
        });
    },
    //Métodos de Tiempo Traslado
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
      this.formTTP.token_project = this.$store.state.info.token_project;
      this.formTTP.exported = 0;
    },
    setearItemTTP(){
      this.updateIndex = 0;
      this.traslado = 0;
      this.formTTP.descripcion = "";
      this.formTTP.tiempo_traslado = "00:00";
      this.formTTP.token_project = this.$store.state.info.token_project;
      this.formTTP.exported = 0;
    },

    editItemTTP(traslado) {
      this.updateIndex = traslado.id;
      this.traslado = traslado.descripcion;
      this.formTTP = {
        descripcion: traslado.descripcion,
        tiempo_traslado: traslado.tiempo_traslado,
        token_project: this.$store.state.info.token_project,
        exported: 0,
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
      HTTP.get("/api/tiempo_traslado/proyectotoken/" + this.$store.state.info.token_project)
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
          data = this.form.tiempo_disenio.split(":");
          this.time.hour=parseInt(data[0]);
          this.time.min=parseInt(data[1]);
          break;
        case 2:
          data = this.form.tiempo_produccion.split(":");
          this.time.hour=parseInt(data[0]);
          this.time.min=parseInt(data[1]);
          break;
        case 3:
          data = this.form.tiempo_medicion.split(":");
          this.time.hour=parseInt(data[0]);
          this.time.min=parseInt(data[1]);
          break;
        case 4:
          data = this.form.tiempo_instalacion.split(":");
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
          this.form.tiempo_disenio = timeUp;
          break;
        case 2:
          this.form.tiempo_produccion = timeUp;
          break;
        case 3:
          this.form.tiempo_medicion = timeUp;
          break;
        case 4:
          this.form.tiempo_instalacion = timeUp;
          break;
      }
    },
    onChangeItem(capacidad){
      this.form.item = capacidad.item;
      this.form.tiempo_disenio = capacidad.tiempo_disenio;
      this.form.tiempo_produccion = capacidad.tiempo_produccion;
      this.form.tiempo_medicion = capacidad.tiempo_medicion;
      this.form.tiempo_instalacion = capacidad.tiempo_instalacion;
      this.form.coeficiente_multiplicador = capacidad.coeficiente_multiplicador;
      this.form.token_project = this.$store.state.info.token_project;
      this.form.exported = 0;
    },
    setearItem(){
      this.updateIndex = 0;
      this.capacidad = 0;
      this.form.item = "";
      this.form.tiempo_disenio = "00:00";
      this.form.tiempo_produccion = "00:00";
      this.form.tiempo_medicion = "00:00";
      this.form.tiempo_instalacion = "00:00";
      this.form.coeficiente_multiplicador = "0";
      this.form.token_project = this.$store.state.info.token_project;
      this.form.exported = 0;
    },
    inputItemValidity() {
      return this.resetFormFields ? null : this.form.item != "";
    },
    inputTiempoDisenioValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form.tiempo_disenio) &&
            this.form.tiempo_disenio != "" &&
            Number.isInteger(parseFloat(this.form.tiempo_disenio));
    },
    inputTiempoProduccionValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form.tiempo_produccion) &&
            this.form.tiempo_produccion != "" &&
            Number.isInteger(parseFloat(this.form.tiempo_produccion));
    },
    inputTiempoMedicionValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form.tiempo_medicion) &&
            this.form.tiempo_medicion != "" &&
            Number.isInteger(parseFloat(this.form.tiempo_medicion));
    },
    inputTiempoInstalacionValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form.tiempo_instalacion) &&
            this.form.tiempo_instalacion != "" &&
            Number.isInteger(parseFloat(this.form.tiempo_instalacion));
    },
    inputCoeficienteMultiplicadorValidity() {
      return this.resetFormFields
        ? null
        : !isNaN(this.form.coeficiente_multiplicador) &&
            this.form.coeficiente_multiplicador != "";
    },
    editItem(capacidad) {
      this.updateIndex = capacidad.id;
      this.capacidad = capacidad.item;
      this.form = {
        item: capacidad.item,
        tiempo_disenio: capacidad.tiempo_disenio,
        tiempo_produccion: capacidad.tiempo_produccion,
        tiempo_medicion: capacidad.tiempo_medicion,
        tiempo_instalacion: capacidad.tiempo_instalacion,
        coeficiente_multiplicador: capacidad.coeficiente_multiplicador,
        token_project: this.$store.state.info.token_project,
        exported: 0,
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
      HTTP.post("/api/capacidad_produccion/proyecto", this.form).then((result) => {
        if (result.data.success) {
          this.loadingPage = false;
          this.$swal({
            title: "¡Enhorabuena!",
            text: "¡Capacidad de Producción agregado con éxito!",
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

      HTTP.put("/api/capacidad_produccion/proyecto/" + this.updateIndex, this.form).then((result) => {
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
        this.loadingPage = false;
    },
    getCPPAll() {
      //this.loadingPage = true;
      HTTP.get("/api/capacidad_produccion/proyectojson/" + this.$store.state.info.token_project)
        .then((result) => {
          if (result.data != null) {
            this.capacidadProduccionProy = result.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
        this.loadingPage = false;
    },
    //Métodos de Medicion Instalacion
    setearMedInst(tipo) {
      if (tipo) {
        this.instalacion.fecha_medinst = "";
        this.instalacion.hora_medinst = "";
        this.instalacion.tipo_medinst = 1;
        this.instalacion.comentario = "";
        this.instalacion.proyecto_json_id = this.loadedProjectId;
      }
      else
      {
        this.medicion.fecha_medinst = "";
        this.medicion.hora_medinst = "";
        this.medicion.tipo_medinst = 0;
        this.medicion.comentario = "";
        this.medicion.proyecto_json_id = this.loadedProjectId;
      }
    },
    getMedAll() {
      this.loadingPage = true;
      HTTP.get("/api/medicion_instalacion/med/" + this.$store.state.info.token_project)
        .then((result) => {
          //alert('entre');
          if (result.data != null) {
            this.mediciones = result.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
        this.loadingPage = false;
    },
    getInstAll() {
      this.loadingPage = true;
      HTTP.get("/api/medicion_instalacion/inst/" + this.$store.state.info.token_project)
        .then((result) => {
          if (result.data != null) {
            this.instalaciones = result.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
        this.loadingPage = false;
    },
    operInstalacion(valor) {
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
    deactivateModules () {
      this.deactivatedModules = [...this.deactivatedModules, ...this.selectedActivatedModules.map(m => this.asModuleOption(m))];
      this.activatedModules = [ ...this.activatedModules.filter(m => this.selectedActivatedModules.indexOf(m.value) === -1) ];
      this.selectedActivatedModules.length = 0;
      this.$store.commit('updateDeactivatedModules', this.deactivatedModules.map(v => v.value));
    },
    activateModules () {
      this.activatedModules = [...this.activatedModules, ...this.selectedDeactivatedModules.map(m => this.asModuleOption(m))];
      this.deactivatedModules = [ ...this.deactivatedModules.filter(m => this.selectedDeactivatedModules.indexOf(m.value) === -1) ];
      this.selectedDeactivatedModules.length = 0;
      this.$store.commit('updateDeactivatedModules', this.deactivatedModules.map(v => v.value));
    },
    updateModuleCount () {
      this.activatedModules.length = 0;
      this.deactivatedModules.length = 0;

      const modulos = this.$store.getters.getModules;
      for (let index = 0; index < this.moduleCount; index++) {
        if (modulos[index].activated) {
          this.activatedModules.push(this.asModuleOption(index + 1));
        } else {
          this.deactivatedModules.push(this.asModuleOption(index + 1));
        }
      }
    },
    asModuleOption (index) {
      return { value: index, text: 'Modulo ' + index }
    },
    toggleContainer (containerId) {
      this.containerExpanded[containerId] = !this.containerExpanded[containerId]
    },
    saveInstallment (index) {
      const pago = this.unsavedPagos.splice(index, 1)[0]
      this.pagos.push(pago)
      this.updateSaldo()
    },
    toReadableDate (dateString) {
      if (!dateString) {
        return ''
      }
      const date = new Date(dateString)
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    },
    updateTotal () {
      let total = 0
      this.items.forEach(i => {
        total += +i.monto
      })
      this.total = total
      this.updateSaldo()
    },
    addExternalLink () {
      this.links.push('')
      this.linksDescipcion.push('')
    },
    removeExternalLink (index) {
      this.links.splice(index, 1)
      this.linksDescipcion.splice(index, 1)
    },
    /*addFechaMedicion () {
      this.fechaMedicion.push('')
      this.addHoraMedicion()
    },
    removeFechaMedicion (index) {
      this.fechaMedicion.splice(index, 1)
      this.removeHoraMedicion()
    },
    addHoraMedicion () {
      this.horaMedicion.push('')
    },
    removeHoraMedicion (index) {
      this.horaMedicion.splice(index, 1)
    },
    addOtrasFechaInstalacion () {
      this.otrasFechaInstalacion.push('')
      this.addOtrasHoraInstalacion()
    },
    removeOtrasFechaInstalacion (index) {
      this.otrasFechaInstalacion.splice(index, 1)
      this.removeOtrasHoraInstalacion()
    },
    addOtrasHoraInstalacion () {
      this.otrasHoraInstalacion.push('')
    },
    removeOtrasHoraInstalacion (index) {
      this.otrasHoraInstalacion.splice(index, 1)
    },*/
    addPaymentItem () {
      const monto = ''
      this.unsavedItems.push({ monto, descripcion: '', date: new Date(), createdBy: localStorage.getItem('user-name') })
    },
    removeItem (index) {
      this.unsavedItems.splice(index, 1)
    },
    savePaymentItem (index) {
      if (!this.unsavedItems[index].descripcion) {
        return
      }
      const item = this.unsavedItems.splice(index, 1)[0]
      this.items.push(item)
      this.updateTotal()
    },
    removeInstallment (index) {
      this.unsavedPagos.splice(index, 1)
    },
    addInstallments () {
      const pago = { monto: '', descripcion: '', tipo: '', date: new Date(), createdBy: localStorage.getItem('user-name'), isNew: true }
      this.unsavedPagos.push(pago)
    },
    updateSaldo () {
      if (this.total) {
        let pagos = 0
        this.pagos.forEach(p => { pagos += +p.monto })
        this.saldo = +this.total - +this.senia - pagos
      } else {
        this.saldo = undefined
      }
    },
    onPaymentChanged (index) {
      if (this.pagos[index].tipo !== -1) {
        this.pagos[index].paymentType = this.pagos[index].tipo
      } else {
        this.paymentType = ''
      }
    },
    setErrorsIn3d (errors) {
      this.$store.commit('setErrorsIn3d', errors)
    },
    updateMaterials () {
      // Materiales & Kits
      HTTP.get(`/api/materiales/materials_for_type/M`, {
      }).then(result => {
        const elements = this.$store.getters.getMetalesAdd
        const allElements = result.data.materiales
        this.metales_add = []
        elements.forEach((m) => {
          this.metales_add.push(allElements.find((mat) => mat.id === m.id))
        })
        this.$store.commit('setGeneralProperty', { key: 'metales_add', value: JSON.stringify(this.metales_add) })
        this.$store.commit('setGeneralProperty', { key: 'metal_default', value: JSON.stringify(this.metales_add.length ? this.metales_add[0].material : '') })
        this.$noty.success('Materiales actualizados')
      }).catch(result => {
        console.log(result)
      })

      // Herrajes
      HTTP.get(`/api/materiales/materials_for_type/H`, {
      }).then(result => {
        const elements = this.$store.getters.getHerrajesAdd
        const allElements = result.data.materiales
        this.herrajes_add = []
        elements.forEach((m) => {
          this.herrajes_add.push(allElements.find((mat) => mat.id === m.id))
        })
        this.$store.commit('setGeneralProperty', { key: 'herrajes_add', value: JSON.stringify(this.herrajes_add) })
        this.$store.commit('setGeneralProperty', { key: 'herrajes_default', value: this.herrajes_add.length ? this.herrajes_add[0].material : '' })
        this.$noty.success('Herrajes actualizados')
      }).catch(result => {
        console.log(result)
      })

      // Tapacantos
      HTTP.get(`/api/materiales/materials_for_type/T`, {
      }).then(result => {
        const elements = this.$store.getters.getTapacantosAdd
        const allElements = result.data.materiales
        this.tapacantos_add = []
        elements.forEach((m) => {
          this.tapacantos_add.push(allElements.find((mat) => mat.id === m.id))
        })
        this.$store.commit('setGeneralProperty', { key: 'tapacantos_add', value: JSON.stringify(this.tapacantos_add) })
        this.$store.commit('setGeneralProperty', { key: 'tapacantos_default', value: this.tapacantos_add.length ? this.tapacantos_add[0] : '' })
        this.$noty.success('Tapacantos actualizados')
      }).catch(result => {
        console.log(result)
      })

      // Materiales
      HTTP.get(`/api/materiales/materials_for_type/P`, {
      }).then(result => {
        const elements = this.$store.getters.getMaterialesAdd
        const allElements = result.data.materiales
        this.materiales_add = []
        elements.forEach((m) => {
          this.materiales_add.push(allElements.find((mat) => mat.id === m.id))
        })
        this.$store.commit('setGeneralProperty', { key: 'materiales_add', value: JSON.stringify(this.materiales_add) })
        this.$store.commit('setGeneralProperty', { key: 'material_default', value: JSON.stringify(this.materiales_add.length ? this.materiales_add[0].material : '') })
        this.$noty.success('Metales y Kits actualizados')
      }).catch(result => {
        console.log(result)
      })
    },
    fillData () {
      const date = new Date()
      const dateString = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
      this.name = 'debug name ' + dateString
      this.address = 'debug address'
      this.comentarioInstalacion = 'debug comment'
      this.horaInstalacion = '10:00'
      this.phone = '99999999'
      this.mueble = 'debug mueble ' + dateString
      this.total = '2000'
      this.senia = '1500'
      //this.fechaInstalacion = '10/10/2029'
    },
    removeMaterial (index) {
      this.materiales_add.splice(index, 1)
      this.$store.commit('setGeneralProperty', { key: 'materiales_add', value: JSON.stringify(this.materiales_add) })
      this.$store.commit('setGeneralProperty', { key: 'material_default', value: this.materiales_add.length ? JSON.stringify(this.materiales_add[0].material) : '' })
    },
    removeTapacantos (index) {
      this.tapacantos_add.splice(index, 1)
      this.$store.commit('setGeneralProperty', { key: 'tapacantos_add', value: JSON.stringify(this.tapacantos_add) })
      this.$store.commit('setGeneralProperty', { key: 'tapacantos_default', value: this.tapacantos_add.length ? JSON.stringify(this.tapacantos_add[0].material) : '' })
    },
    removeHerraje (index) {
      this.herrajes_add.splice(index, 1)
      this.$store.commit('setGeneralProperty', { key: 'herrajes_add', value: JSON.stringify(this.herrajes_add) })
      this.$store.commit('setGeneralProperty', { key: 'herraje_default', value: this.herrajes_add.length ? JSON.stringify(this.herrajes_add[0].material) : '' })
    },
    removeMetal (index) {
      this.metales_add.splice(index, 1)
      this.$store.commit('setGeneralProperty', { key: 'metales_add', value: JSON.stringify(this.metales_add) })
      this.$store.commit('setGeneralProperty', { key: 'metal_default', value: this.metales_add.length ? JSON.stringify(this.metales_add[0].material) : '' })
    },
    showMateriales () {
      let Md = Vue.extend(MaterialesList)
      let ElementMounted = new Md({store: this.$store, parent: this.$parent}).$mount().$el
      this.$swal({
        content: ElementMounted,
        buttons: false
      })
    },
    showTapacantos () {
      let Md = Vue.extend(TapacantosList)
      let ElementMounted = new Md({store: this.$store, parent: this.$parent}).$mount().$el
      this.$swal({
        content: ElementMounted,
        buttons: false
      })
    },
    showHerrajes () {
      let Md = Vue.extend(HerrajesList)
      let ElementMounted = new Md({store: this.$store, parent: this.$parent}).$mount().$el
      this.$swal({
        content: ElementMounted,
        buttons: false
      })
    },
    showMetales () {
      let Md = Vue.extend(MetalesKitsList)
      let ElementMounted = new Md({store: this.$store, parent: this.$parent}).$mount().$el
      this.$swal({
        content: ElementMounted,
        buttons: false
      })
    },
  },
  watch:{
    "$store.state.info.linksDescripcion": function(valor) {
      console.log(valor);
      this.$store.commit('setGeneralInfo', { key: 'linksDescripcion', value: valor});
    }
  }
}
</script>

<style scoped lang="scss">
  .toggle-activation-btns {
    margin-top: 70px;
    text-align: center;
  }
  .module-selector-container {
    text-align: center;
  }
  .low-visibility {
    color: #a0a0a0;
    font-size: 14px;
  }
  .module-selector {
    width: 200px;
    min-height: 200px;
  }
  table.pago-table, table.productos-table, table.total-table {
    width: 100%;
    max-width: 1000px;
    border: 1px solid;

    tr td {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      font-size: 14px;
      padding: 5px 5px 0px 5px !important;

      &.first-col {
        text-align: end;
        padding-right: 15px !important;
      }

      &.middle-col {
        width: 60%;
      }

      &.left-border {
        border-left: 1px solid;
      }
    }

    .unsaved-row {
      td {
        padding: 0px !important;

        &:last-of-type {
          text-align: center;
        }
      }

      button, input, select {
        font-size: 12px;
        height: 24px;
      }

      button {
        padding: 0px !important;
      }
    }

    tfoot tr td {
      background-color: #717375;
      color: white;
      font-weight: 600;
      padding: 5px !important;
      border-top: 1px solid black;
      text-align: end;
      padding-right: 15px !important;

      &:last-of-type {
        text-align: center;
      }
    }

    .saldo-control {
      max-width: 75px;
      float: right;
    }
  }

  .pago-table, .total-table {
    margin-top: 20px;
  }

 .cancel-material {
     cursor: pointer;
     color: red;
  }

  .add_material {
    font-weight: bold;
    color: #3aa051;
    font-size: 25px;
    margin-left: 25px;
    cursor: pointer;
  }

  .add_material:hover {
    font-weight: bold;
    color: red;
  }

  .materiales_add {
    width: 100%;
    border-bottom: 1px solid rgb(120, 130, 139);
  }

  .materiales_add th {
    padding: 0px !important;
    border-bottom: 1px solid rgb(87, 136, 185);
    vertical-align: top;
  }
  .materiales_add td {
    padding: 0px !important;
  }

  .no-material {
    text-align: center;
    color: tomato;
  }
  .datetime-picker .vdatetime-input {
    width: 70%;
    height: calc(1.8125rem + 2px);
    padding: .25rem .5rem;
    font-size: .875rem;
    line-height: 1.5;
    border-radius: .2rem;
    border: 1px solid #ced4da;
  }
  .pago {
    font-size: 14px;
  }
  .saldo-row {
    background: #fde3e3;
    display: flex;
    align-items: center;
  }
  .saldo-row.saldado {
    background: #c7e8cf;
  }
  .valor-total-row, .senia-row {
    display: flex;
    align-items: center;
    background: #80808066;
  }
  .striped.even {
    background: #8080801f;
  }
  .striped.odd {
    background: #8080800d;
  }
  .item-row, .senia-row, .pago-row {
    display: flex;
    align-items: center;
    margin-bottom: 0px;
  }
  .valor-total-input {
    font-size: 16px;
    font-weight: bold;
  }
  .row-extras {
    display: flex;
    align-items: center;
  }
  .unsaved.unsaved-item-row, .unsaved.unsaved-pago-row {
    background: #3b9aff1a
  }
  .created-by, .fecha-creacion {
    font-size: 12px;
    color: grey;
  }
  .created-by {
    margin-left: 10px;
  }
  .caja .form-control[readonly] {
    background-color: #e9ecef00;
    opacity: 1;
    cursor: default;
  }
  .datos-de-cliente-card .card-body {
    display: flex;
  }
  .caja .form-group {
    margin-bottom: 5px;
  }
  .caja .control-label {
    font-size: 14px;
  }
  .card-body.uncollapsed  {
    height: 0px;
    overflow: hidden;
    padding: 0;
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>
