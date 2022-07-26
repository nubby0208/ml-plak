<template>
  <div id="app-asistencia-list" class="container">
    <vue-toastr ref="toastr"></vue-toastr>
    <notification></notification>
    <b-overlay :show="loadingPage" opacity="0.6" spinner-variant="primary">
    <div class="col-sm-12 col-sm-offset-1 py-3" style="margin-top: 20px">
      <div id="usuario-listado" class="col-sm-12">  
        <div class="form-horizontal row">
          <div class="col-sm-6">
            <div class="row">    
              <div class="col-sm-4 form-group row">
                <label class="control-label"><b>Usuario: </b></label>
              </div>  
              <div class="col-sm-8 form-group row">
                  <select v-if="hasPermiso" class="form-control" name="usuario" v-model="form.usuario_id" @change="reloadAsistencias()">
                    <option :value="0" disabled selected>Seleccione</option>
                    <option v-for="(usuario, i) in usuarios" :value="usuario.id" :key="i">
                      {{ usuario.nombre_completo | wordsCapitalize}}
                    </option>
                  </select>
                  <input v-if="!hasPermiso"
                    class="form-control" readonly :value="usuario.nombre_completo | wordsCapitalize">
              </div>
            </div>  
            <div class="row">
              <div class="col-sm-4 form-group row">
                <label class="control-label"><b>Rango fecha: </b></label>
              </div>  
              <div class="col-sm-4">
              <input type="number" class="form-control" v-model="form.anio" :max="actualYear" @change="reloadAsistencias()">
              </div>
              <div class="col-md-4">
                <select class="form-control" v-model="form.mes" @change="reloadAsistencias()">
                  <option :value="i+1" v-for="(monthName, i) in monthNames" :key="i">{{monthName}}</option>
                </select>
              </div>
            </div> 
          </div>
          <div class="col-sm-6 form-group row">
            <div class="row">  
              <div class="col-sm-12">
                <button class="btn btn-sm btn-dark" @click="updateUsuarioAfip(1)" v-if="usuarioAfip==0 && hasPermiso">
                   Todos los Usuarios
                </button>
                <button class="btn btn-sm btn-dark" @click="updateUsuarioAfip(0)" v-if="usuarioAfip==1 && hasPermiso">
                   Usuarios Afip
                </button>
              </div>  
            </div>    
            <div class="row">  
              <div class="col-sm-6">
                <button v-if="configMonth.status==1"
                    type="button" class="btn btn-sm btn-secondary" 
                    style="margin:auto; float: right;"
                    @click="generarReporte()">
                    Generar Reporte
                  </button> 
              </div>
              <div class="col-sm-6">
                  <button v-if="configMonth.id"
                  :class="{
                    'btn btn-sm btn-outline-danger ml-2': configMonth.status==0,
                    'btn btn-sm btn-outline-primary ml-2': configMonth.status==1
                  }"
                  style="margin:auto; float: right;"
                  @click="finalizar"
                  >
                  {{ configMonth.status==1 ? 'Reabrir' : 'Finalizar' }} liquidación
                  </button>
              </div>
            </div>    
          </div>
        </div>
        <div class="row" v-if="usuario.id>0">
          <div class="col-md-8 border border-1 border-dark pt-2">
             <table class="table table-responsive">
                <thead>
                  <tr>
                    <th style="text-align:center;font-size: small;">NOMBRE Y APELLIDO DEL TRABAJADOR</th>
                    <th style="text-align:center;font-size: small;">CATEGORIA</th>
                    <th style="text-align:center;font-size: small;">BASICO</th>
                    <th style="text-align:center;font-size: small;">FECHA INGRESO</th>
                    <th style="text-align:center;font-size: small;">PERIODO</th>
                    <th style="text-align:center;font-size: small;">HORAS DEBIDAS</th>
                  </tr>
                </thead> 
                <tbody>
                  <tr>
                    <td style="font-size:small;">{{usuario.nombre_completo | toUpperCase}} | CUIT: {{usuario.cuit_cuil | toUpperCase}}</td>
                    <td style="font-size:small;">{{ configMonth.rango? configMonth.rango.nombre : '' }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.valor_x_hora ? Number(configMonth.valor_x_hora).toFixed(2) : 0 }}</td> 
                    <td style="text-align:center; font-size:small;">{{ usuario.fecha_ingreso ? $moment(usuario.fecha_ingreso).format('DD/MM/YYYY') : '' }}</td>
                    <td style="text-align:center; font-size:small;">{{ monthNames[form.mes-1] + "-" + form.anio  | toUpperCase }}</td>
                    <td style="text-align:right; font-size:small;">{{ calculadora.horas_debidas }}</td>
                   </tr>  
                   <tr>
                    <td colspan="2" style="font-size:small;"><b>HORAS REALES CALCULADAS POR SISTEMA</b></td>
                    <td style="text-align:right; font-size:small;">{{ calculadora.hora_mas_falta_justificadas? calculadora.hora_mas_falta_justificadas : 0 }}</td>
                    <td colspan="2" style="font-size:small;"><b>FERIADOS POR SISTEMA</b></td> 
                    <td style="text-align:right; font-size:small;">{{ calculadora.horas_feriadas }}</td>
                   </tr>  
                </tbody>   
             </table> 
             <table class="table table-responsive">
                <thead>
                  <tr>
                    <th style="text-align:center;font-size: small;">CONCEPTO</th>
                    <th style="text-align:center;font-size: small;">UNIDADES</th>
                    <th style="text-align:center;font-size: small;">VALOR UNITARIO</th>
                    <th style="text-align:center;font-size: small;">REMUNERATIVOS</th>
                    <th style="text-align:center;font-size: small;">NO REMUNERATIVOS</th>
                    <th style="text-align:center;font-size: small;">DESCUENTOS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="font-size:small;">HORAS TRABAJADAS</td>
                    <td style="font-size:small;">{{ calculadora.horas_trabajadas }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.valor_x_hora ? Number(configMonth.valor_x_hora).toFixed(2) : 0 }}</td> 
                    <td style="text-align:right; font-size:small;">{{ calculadora.valor_hora ? Number(calculadora.valor_hora).toFixed(2) : 0 }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>
                   <tr>
                    <td style="font-size:small;">INASISTENCIAS JUSTIFICADAS</td>
                    <td style="font-size:small;">{{ calculadora.faltas_justificadas }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.valor_x_hora ? Number(configMonth.valor_x_hora).toFixed(2) : 0 }}</td> 
                    <td style="text-align:right; font-size:small;">{{ calculadora.hora_x_falta_justificadas ? Number(calculadora.hora_x_falta_justificadas).toFixed(2) : 0 }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">INASISTENCIAS INJUSTIFICADAS</td>
                    <td style="font-size:small;">{{ calculadora.faltas_injustificadas }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.valor_x_hora ? Number(configMonth.valor_x_hora).toFixed(2) : 0 }}</td> 
                    <td style="text-align:right; font-size:small;">{{ calculadora.hora_x_falta_injustificadas ? -1 * Number(calculadora.hora_x_falta_injustificadas).toFixed(2) : 0 }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">HORAS EXTRAS</td>
                    <td style="font-size:small;">{{ calculadora.horas_extras }}</td>
                    <td style="text-align:right; font-size:small;">{{ ((Number(configMonth.hora_extra)/100)*Number(configMonth.valor_x_hora)).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;">{{ Number(calculadora.valor_hora_extra).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">HORA SABADO INGLES</td>
                    <td style="font-size:small;">{{ calculadora.horas_sabado_ingles }}</td>
                    <td style="text-align:right; font-size:small;">{{ ((Number(configMonth.sabado_ingles)/100)*Number(configMonth.valor_x_hora)).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;">{{ Number(calculadora.valor_hora_sabado_ingles).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">ANTIGÜEDAD</td>
                    <td style="font-size:small;">{{ Number(configMonth.antiguedad).toFixed(2) }}%</td>
                    <td style="text-align:right; font-size:small;"></td> 
                    <td style="text-align:right; font-size:small;">{{ Number(calculadora.antiguedad).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">ASIGNACION EXTRAORDINARIA</td>
                    <td style="font-size:small;">{{ Number(calculadora.hora_mas_falta_justificadas).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.asignacion_extraordinaria ? Number(configMonth.asignacion_extraordinaria).toFixed(2) : 0 }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ Number(calculadora.valor_asignacion_extraordinaria).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">SUMA NO REMUNERATIVA</td>
                    <td style="font-size:small;">{{ Number(calculadora.hora_mas_falta_justificadas).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.suma_no_remunerativa ? Number(configMonth.suma_no_remunerativa).toFixed(2) : '' }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ Number(calculadora.valor_suma_no_remunerativa).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">AJUSTE MES ANTERIOR</td>
                    <td style="font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td> 
                    <td style="text-align:right; font-size:small;">{{ configMonth.remu_descuento ==1 ? -1 * Number(calculadora.valor_descuento).toFixed(2) : '' }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.remu_descuento ==0 ? -1 * Number(calculadora.valor_descuento).toFixed(2) : '' }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr> 
                   <tr>
                    <td style="font-size:small;">PLUS MES</td>
                    <td style="font-size:small;">{{ configMonth.valor_plus_mes }}</td>
                    <td style="text-align:right; font-size:small;"></td> 
                    <td style="text-align:right; font-size:small;">{{ configMonth.remu_plus_mes ==1 ? Number(calculadora.valor_plus_mes).toFixed(2) : '' }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.remu_plus_mes ==0 ? Number(calculadora.valor_plus_mes).toFixed(2) : '' }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr> 
                   <tr>
                    <td style="font-size:small;">JUBILACION</td>
                    <td style="font-size:small;">{{ configMonth.jubilacion? Number(configMonth.jubilacion).toFixed(2) : 0 }}%</td>
                    <td style="text-align:right; font-size:small;">{{ Number(calculadora.subtotal_remunerativo).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ -1 * Number(calculadora.valor_jubilacion).toFixed(2) }}</td>
                   </tr> 
                   <tr>
                    <td style="font-size:small;">INNSLP (LEY 19032)</td>
                    <td style="font-size:small;">{{ configMonth.innslp? Number(configMonth.innslp).toFixed(2) : 0 }}%</td>
                    <td style="text-align:right; font-size:small;">{{ Number(calculadora.subtotal_remunerativo).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ -1 * Number(calculadora.valor_innslp).toFixed(2) }}</td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">OBRA SOCIAL</td>
                    <td style="font-size:small;">{{ configMonth.obra_social? Number(configMonth.obra_social).toFixed(2) : 0 }}%</td>
                    <td style="text-align:right; font-size:small;">{{ Number(calculadora.subtotal_remunerativo).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ -1 * Number(calculadora.valor_obra_social).toFixed(2) }}</td>
                   </tr> 
                   <tr>
                    <td style="font-size:small;">SINDICATO</td>
                    <td style="font-size:small;">{{ configMonth.sindicato? Number(configMonth.sindicato).toFixed(2) : 0 }}%</td>
                    <td style="text-align:right; font-size:small;">{{ Number(calculadora.subtotal_remunerativo).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ -1 * Number(calculadora.valor_sindicato).toFixed(2) }}</td>
                   </tr> 
                   <tr>
                    <td style="font-size:small;">SEGURO DE VIDA</td>
                    <td style="font-size:small;">{{ configMonth.seguro_vida? Number(configMonth.seguro_vida).toFixed(2) : 0 }}%</td>
                    <td style="text-align:right; font-size:small;">{{ Number(calculadora.subtotal_remunerativo).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ -1 * Number(calculadora.valor_seguro_vida).toFixed(2) }}</td>
                   </tr> 
                   <tr>
                    <td style="font-size:small;">PRESENTISMO</td>
                    <td style="font-size:small;"> {{ Number(configMonth.presentismo).toFixed(2) }}%</td>
                    <td style="text-align:right; font-size:small;"></td> 
                    <td style="text-align:right; font-size:small;">{{ Number(calculadora.presentismo).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr> 
                   <tr>
                    <td style="font-size:small;"><b>SUBTOTAL</b></td>
                    <td style="font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td> 
                    <td style="text-align:right; font-size:small;"><b>{{ Number(calculadora.subtotal_remunerativo).toFixed(2) }}</b></td>
                    <td style="text-align:right; font-size:small;"><b>{{ Number(calculadora.subtotal_noremunerativo).toFixed(2) }}</b></td>
                    <td style="text-align:right; font-size:small;"><b>{{ -1 * Number(calculadora.subtotal_descuento).toFixed(2) }}</b></td>
                   </tr>
                   <tr>
                    <td style="font-size:small;"><b>TOTAL</b></td>
                    <td style="font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"><b>{{ Number(calculadora.total).toFixed(2) }}</b></td>
                   </tr>        
                </tbody>   
             </table>   
          </div>  
            <div class="col-md-4 border border-1 border-dark d-flex flex-column justify-content-between">
              <div class="row">
                <div class="col-12 form-group" style="font-size:small;">
                  <br><b>PAGOS RECIBIDOS</b>
                </div>
                <div class="col-12">
                  <div class="row" v-for="pago in pagos.pagos" :key="pago.id">
                    <div class="col-4" style="font-size:small;">
                      {{ pago.monto }}
                    </div>
                    <div class="col-4" style="font-size:small;">
                      {{ pago.comentario }}
                    </div>
                    <div class="col-4" style="font-size:small;">
                      {{ $moment(pago.created_at).format('DD/MM/YYYY') }}
                    </div>
                    <div class="col-sm-12">
                       <hr />
                    </div>
                  </div>
                  <div class="col-12 mt-3">
                    <button
                      class="btn btn-sm btn-primary"
                      v-b-modal.modal-prevent-closing
                    >
                      + Ingresar nuevo pago
                    </button>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-sm-12">
                  <hr />
                </div>
                <div class="col-12">
                  <div class="row">
                    <div class="col-4" style="font-size:small;">
                      {{ pagos.total }}
                    </div>
                    <div class="col-8" style="font-size:small;">
                      Total pagos recibidos
                    </div>
                  </div>
                </div>
                <div class="col-sm-12">
                  <hr />
                </div>
                <div class="col-12">
                  <div class="row">
                    <div class="col-4" style="font-size:small;">
                      {{ saldo }}
                    </div>
                    <dd class="col-8" style="font-size:small;">
                      Pendiente
                    </dd>
                  </div>
                </div>
              </div>
            </div>
        </div>
          <div class="row pt-2 border border-success" v-if="usuario.id>0">
            <div class="col-md-4 mb-3">
              <b>Configuración de {{monthNames[configMonth.mes-1]}} de {{usuario.nombre_completo | wordsCapitalize}}</b>
            </div>
            <div class="col-md-2 mb-3">
              Rango del usuario: {{usuario.rango.nombre}}
            </div>
            <div class="col-md-2 mb-3">
              Rango Actual: 
            </div>
            <div class="col-md-2 mb-3" style="text-align: center">
             <select  style="width:150px"
                id="rango_id"
                class="form-control"
                v-model="configMonthRango"
                :disabled="readonlyConfig"
                @change="onChangeRango($event)"
              >
                 <option
                  v-for="(rango, i) in rangos"
                  :key="i"
                  :value="rango.id + '-' + Number(rango.valor).toFixed(2) + '-' + Number(rango.suma_no_remunerativa).toFixed(2)"
                >
                  {{ rango.nombre }}
                </option>
              </select> 
            </div>  
            <div class="col-md-2 mb-3">
              Rango del mes anterior: {{rangoAnterior}}
            </div>
            <div class="col-md-12">
              <div class="row">
                <div class="col-6 col-md-2 form-group">
                  <label for="">Valor hora</label>
                  <input type="text" min="0" step="0.01" class="form-control" readonly v-model="configMonth.valor_x_hora">
                </div>

                <div class="col-6 col-md-2 form-group">
                  <label for="">Antiguedad</label>
                  <div class="input-group">
                    <input type="text" class="form-control" readonly v-model="configMonth.antiguedad">
                    <div class="input-group-append">
                      <span class="input-group-text" id="basic-addon2">%</span>
                    </div>
                  </div>
                </div>

                <div class="col-6 col-md-4 form-group">
                  <label for="">Suma no remunerativa</label>
                  <div class="input-group">
                    <input type="text" min="0" class="form-control" readonly v-model="configMonth.suma_no_remunerativa">
                  </div>
                </div>

                <div class="col-6 col-md-4 d-flex align-items-end form-group" v-if="!readonlyConfig">
                  <button class="btn btn-success" @click="guardarConfiguracion">Guardar</button>
                </div>

                <div class="col-6 col-md-2 form-group">
                  <label for="">Hora extra</label>
                  <div class="input-group">
                    <input type="number" min="0" max="100" class="form-control" :readonly="readonlyConfig" v-model="configMonth.hora_extra">
                    <div class="input-group-append">
                      <span class="input-group-text" id="basic-addon2">%</span>
                    </div>
                  </div>
                </div>

                <div class="col-6 col-md-2 form-group">
                  <label for="">Hora sábado ingles</label>
                  <div class="input-group">
                    <input type="number" min="0" max="100" class="form-control" :readonly="readonlyConfig" v-model="configMonth.sabado_ingles">
                    <div class="input-group-append">
                      <span class="input-group-text" id="basic-addon2">%</span>
                    </div>
                  </div>
                </div>

                <div class="col-6 col-md-2 form-group">
                  <label for="">Plus mes</label>
                  <div class="input-group">
                    <input type="number" min="0" max="100" class="form-control" :readonly="readonlyConfig" v-model="configMonth.valor_plus_mes">
                    <input type="checkbox" name="lenguaje" v-model="configMonth.remu_plus_mes" 
                    :disabled="readonlyConfig"
                    :checked="configMonth.remu_plus_mes==1? 'checked' : '' "
                    :title="configMonth.remu_plus_mes==1? 'Remunerativo' : 'No remunerativo'">
                  </div>
                </div>

                <div class="col-6 col-md-2 form-group">
                  <label for="">Ajuste mes anterior</label>
                  <div class="input-group">
                    <input type="number" min="0" max="100" class="form-control" :readonly="readonlyConfig" v-model="configMonth.descuento">
                    <input type="checkbox" name="lenguaje" v-model="configMonth.remu_descuento" 
                    :disabled="readonlyConfig"
                    :checked="configMonth.remu_descuento==1? 'checked' : '' "
                    :title="configMonth.remu_descuento==1? 'Remunerativo' : 'No remunerativo'">
                  </div>
                </div>
                <div class="col-6 col-md-2 form-group">
                  <label for="">Presentismo</label>
                  <div class="input-group">
                    <input type="number" min="0" max="100" class="form-control" :readonly="readonlyConfig" v-model="configMonth.presentismo">
                    <div class="input-group-append">
                      <span class="input-group-text" id="basic-addon2">%</span>
                    </div>
                  </div>
                </div>
                
                <div class="col-6 col-md-2 form-group">
                  <label for="">Forzar Presentismo</label>
                  <select class="form-control" :disabled="readonlyConfig" v-model="configMonth.forzar_presentismo" @change="forzarPresentismo()">
                    <option value="0">Auto</option>
                    <option value="1">Si</option>
                    <option value="2">No</option>
                  </select>
                </div>

                <div class="col-6 col-md-2 form-group">
                  <label for="">Asig. extraordinaria</label>
                  <div class="input-group">
                    <input type="number" min="0" class="form-control" :readonly="readonlyConfig" v-model="configMonth.asignacion_extraordinaria">
                  </div>
                </div>

                <div class="col-6 col-md-2 form-group">
                  <label for="">Jubilación</label>
                  <div class="input-group">
                    <input type="number" min="0" max="100" class="form-control" :readonly="readonlyConfig" v-model="configMonth.jubilacion">
                    <div class="input-group-append">
                      <span class="input-group-text" id="basic-addon2">%</span>
                    </div>
                  </div>
                </div>

                <div class="col-6 col-md-2 form-group">
                  <label for="">Innslp</label>
                  <div class="input-group">
                    <input type="number" min="0" max="100" class="form-control" :readonly="readonlyConfig" v-model="configMonth.innslp">
                    <div class="input-group-append">
                      <span class="input-group-text" id="basic-addon2">%</span>
                    </div>
                  </div>
                </div>

                <div class="col-6 col-md-2 form-group">
                  <label for="">Obra social</label>
                  <div class="input-group">
                    <input type="number" min="0" max="100" class="form-control" :readonly="readonlyConfig" v-model="configMonth.obra_social">
                    <div class="input-group-append">
                      <span class="input-group-text" id="basic-addon2">%</span>
                    </div>
                  </div>
                </div>

                <div class="col-6 col-md-2 form-group">
                  <label for="">Sindicato</label>
                  <div class="input-group">
                    <input type="number" min="0" max="100" class="form-control" :readonly="readonlyConfig" v-model="configMonth.sindicato">
                    <div class="input-group-append">
                      <span class="input-group-text" id="basic-addon2">%</span>
                    </div>
                  </div>
                </div>

                <div class="col-6 col-md-2 form-group">
                  <label for="">Seguro de vida</label>
                  <div class="input-group">
                    <input type="number" min="0" max="100" class="form-control" :readonly="readonlyConfig" v-model="configMonth.seguro_vida">
                    <div class="input-group-append">
                      <span class="input-group-text" id="basic-addon2">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>      
        </div>
      </div>
    <div class="table-responsive w-100">
      <table class="table table-hover">
        <thead class="text-center">
          <th style="text-align: center;">Dia</th>
          <th style="text-align: center;">Usuario</th>
          <th style="text-align: center;">Cert. Médico</th>
          <th style="text-align: center;" colspan="2">Marca (ingreso/salida)</th>
          <th style="text-align: center;">Observación</th>
          <th style="text-align: center;">Hs. trabajadas</th>
          <th style="text-align: center;">
            Justificación
          </th>
          <th style="text-align: center;">
            Ajuste hora
          </th>
          <th style="text-align: center;">Forzar (ingreso/salida)</th>
        </thead>
        <tbody>
          <template v-if="asistencias.length > 0">
            <tr v-for="(asistencia, i) in asistencias" :class="{
              'bg-success' : asistencia.id != null && !asistencia.justificacion,
              'bg-info' : asistencia.justificacion == true
            }" :key="i">
              <td>{{ asistencia.dia }} {{ $moment(asistencia.fechaDia).format('DD') }}</td>
              <td>{{ asistencia.usuario.usuario }}</td>
              <td>
                <span v-if="asistencia.cert_medico==1 && asistencia.heading">
                  <button class="btn btn-sm btn-danger"  :disabled="!(asistencia.heading)" @click="showInasistencia(usuario.id,asistencia.fechaDia)" title="Actualizar/visualizar documento">
                    <font-awesome-icon icon="plus"></font-awesome-icon>
                  </button>
                </span>
                <span v-if="asistencia.cert_medico==0 && asistencia.heading">
                  <button class="btn btn-sm btn-secondary" :disabled="!(asistencia.heading && configMonth.status==0)" @click="showInasistencia(usuario.id,asistencia.fechaDia)" title="Anexar documento">
                    <font-awesome-icon icon="plus"></font-awesome-icon>
                  </button>
                </span>
              </td>
              <td><span>
                  {{ asistencia.markIn }}
                </span></td>
              <td><span>
                  {{ asistencia.markOut }}
                </span></td>
              <td>
                {{ asistencia.obs.length ? asistencia.obs.join(' / ') : "N/A" }}
              </td>
              <td>
                {{ asistencia.horas_trabajadas_diarias? asistencia.horas_trabajadas_diarias : '' }}
              </td>
              <td class="py-0">
                <template v-if="asistencia.heading&&canEdit">
                  <button class="btn btn-default" @click="justificar(asistencia)"
                    v-if="!asistencia.id&&asistencia.usuario_id" title="Justificar">
                    Justificar
                  </button>
                  <button class="btn btn-default" v-if="asistencia.justificacion" @click="injustificar(asistencia)"
                    title="Cancelar justificación">Sí</button>
                </template>
              </td>
              <td>
                <div class="input-group" v-if="!asistencia.justificacion&&asistencia.id&&canEdit">
                  <input class="form-control form-control-sm" type="number" @keydown.enter="addHours(asistencia)"
                    v-model="asistencia.ajuste_hora">
                  <div class="input-group-append">
                    <button class="btn btn-outline-secondary btn-sm" type="button" @click="addHours(asistencia)">
                      <b-icon icon="check"></b-icon>
                    </button>
                  </div>
                </div>
                <template v-else>
                  {{asistencia.ajuste_hora}}
                </template>
              </td>
              <td>
                <template v-if="asistencia.heading&&canEdit">
                  <button class="btn btn-default btn-sm" @click="force(asistencia)" title="Forzar ingreso o salida"
                    v-if="asistencia.tipo.length<2&&!asistencia.justificacion&&asistencia.usuario_id">
                    Forzar
                  </button>
                  <button
                  class="btn btn-outline-danger btn-sm float-right" @click="quitar(asistencia)" title="Quitar asistencia"
                    v-if="asistencia.tipo.length>0&&!asistencia.justificacion&&asistencia.usuario_id">
                    x
                  </button>
                </template>
              </td>
            </tr>
          </template>
          <template v-if="asistencias.length == 0">
            <tr>
              <td class="text-center" colspan="12">
                <strong>No posee asistencias registradas</strong>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    </b-overlay>
    <b-modal
        id="modal-prevent-closing"
        ref="modal"
        title="Agregar pago"
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk"
      >
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group
            label="Monto"
            label-for="monto-input"
            invalid-feedback="El Monto debe ser mayor a 0 y menor o igual que el Saldo"
            :state="pagoState.monto"
          >
            <b-form-input
              id="monto-input"
              placeholder="Escriba el monto"
              type="number"
              :min="0"
              step="0.01"
              v-model="formPago.monto"
              :state="pagoState.monto"
              required
            ></b-form-input>
            Saldo: {{ saldo }}
          </b-form-group>
          <b-form-group
            label="Comentario"
            label-for="comentario"
          >
            <b-form-textarea
              id="comentario"
              v-model="formPago.comentario"
              placeholder="Escriba un comentario"
              rows="3"
            ></b-form-textarea>
          </b-form-group>
        </form>
      </b-modal>
    <!-- Modal Inasistencias Médicas    --->
    <b-modal size="lg" ref="myModalInasistencia" id="myModalInasistencia" hide-footer title="Inasistencias Médicas">
      <form @submit.prevent="agregarInasistencia" enctype="multipart/form-data">
          <b-form-group
            label="Establezca el Rango de Días: "
          > 
            <div class="row">
              <div class="col-5">
                <label><b>Desde:</b></label>
                <b-form-input 
                  :disabled="!(configMonth.status==0)"
                  id="formInasistencia.fecha1"
                  type="date"
                  v-model="formInasistencia.fecha1"
                  required
                ></b-form-input>
              </div>
              <div class="col-5">
                <label><b>Hasta:</b></label>
                <b-form-input
                  :disabled="!(configMonth.status==0)"
                  id="formInasistencia.fecha2"
                  type="date"
                  v-model="formInasistencia.fecha2"
                  required
                ></b-form-input>
              </div>
              <div class="col-2">
                <button 
                  :disabled="!(configMonth.status==0)"
                  v-if="formInasistencia.id > 0" class="btn btn-sm btn-success"
                  @click="actualizarInasistencia()"
                  title="Actualizar rango de días"
                  style="float: right;"
                >
                  <font-awesome-icon icon="check"></font-awesome-icon>
                </button>
              </div>  
            </div>  
          </b-form-group>
          <b-form-group
            label="Anexar documentos: "
          > 
            <div class="row">
              <div class="col-6">
                <label><b>Descripción:</b></label>
                <b-form-input
                  :disabled="!(configMonth.status==0)"
                  id="formInasistencia.descripcion"
                  type="text"
                  v-model="formInasistencia.descripcion"
                  required
                ></b-form-input>
              </div>
              <div class="col-6">
                <label><b>Subir documento:</b></label>
                <input
                  :disabled="!(configMonth.status==0)"
                  id="formInasistenciaDoc"
                  ref="formInasistenciaDoc" 
                  type="file"
                  v-on:change="getFileInasistenciaDoc($event)"
                  required
                >
              </div>
            </div>
            <div class="row">  
              <div class="col-12" >
                <input :disabled="!(configMonth.status==0)" type="submit" class="btn btn-sm btn-primary" value="Guardar documento" style="float: right;">
              </div>
            </div>  
          </b-form-group>
      </form>
      <p>Documentos anexados: </p>   
      <table class="table table-striped "> 
        <thead class="thead-light">
          <tr>
            <th>
              Descripción
            </th>
            <th style="width: 20%; text-align: center">
              Visualizar
            </th>
            <th style="width: 20%; text-align: center">
              Acción
            </th>
          </tr>
        </thead>
        <tbody>  
          <tr v-if="inasistenciaDocs.length == 0">
            <td class="text-center" colspan="3">
              No hay documentos anexados...
            </td>
          </tr>
          <template v-if="inasistenciaDocs.length > 0">
            <tr
              v-for="(doc, i) in inasistenciaDocs"
              :key="i"
            >
              <td>
                {{ doc.descripcion }}
              </td>
              <td style="text-align: center">
                <button
                  class="btn btn-sm btn-primary"
                  @click="viewInasistenciaDoc(doc.doc_url)"
                  title="Ver documento"
                 >
                  <font-awesome-icon icon="file"></font-awesome-icon>
                </button>
              </td>
              <td style="width: 20%; text-align: center">
                <button :disabled="!(configMonth.status==0)" class="btn btn-sm btn-danger"
                  @click="deleteInasistencia(doc.id)"
                  title="Eliminar documento"
                >
                  <font-awesome-icon icon="trash"></font-awesome-icon>
                </button>
              </td>
            </tr>  
          </template>
        </tbody>  
      </table>              
      <div class="overflow-auto">
        <div class="read-me-footer">
          <button
            type="button"
            class="btn btn-sm btn-secondary"
            data-dismiss="modal"
           @click="closeInasistencia()"
          >
            Cerrar
          </button>
        </div>
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
            <div class="table-responsive">
              <table style="width:100%;">
                  <tr>
                     <td style="text-align:left;font-size: x-large;">
                        <b>ML PLAK</b>
                      </td>
                      <th style="text-align:left;">
                        ALVAREZ MARIANO HERNAN
                      </th>
                      <th style="text-align:right;">
                        CUIT: 20-28765117-2 | CUIL: 27-34906887-2
                      </th>  
                  </tr>
                   <tr>
                     <th colspan="3" style="text-align:left;">
                        LA PLATA AV 72 N868 E 12 y 13
                      </th>
                    </tr>  
              </table>
              <table class="table table-responsive">
                <thead>
                  <tr>
                    <th style="text-align:center;font-size: small;">NOMBRE Y APELLIDO DEL TRABAJADOR</th>
                    <th style="text-align:center;font-size: small;">CATEGORIA</th>
                    <th style="text-align:center;font-size: small;">BASICO</th>
                    <th style="text-align:center;font-size: small;">FECHA INGRESO</th>
                    <th style="text-align:center;font-size: small;">PERIODO</th>
                    <th style="text-align:center;font-size: small;">HORAS DEBIDAS</th>
                  </tr>
                </thead> 
                <tbody>
                  <tr>
                    <td style="font-size:small;">{{usuario.nombre_completo | toUpperCase}} | CUIT: {{usuario.cuit_cuil | toUpperCase}}</td>
                    <td style="font-size:small;">{{ usuario.rango? usuario.rango.nombre : '' }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.valor_x_hora ? Number(configMonth.valor_x_hora).toFixed(2) : 0 }}</td> 
                    <td style="text-align:center; font-size:small;">{{ usuario.fecha_ingreso ? $moment(usuario.fecha_ingreso).format('DD/MM/YYYY') : '' }}</td>
                    <td style="text-align:center; font-size:small;">{{ monthNames[form.mes-1] + "-" + form.anio  | toUpperCase }}</td>
                    <td style="text-align:right; font-size:small;">{{ recibo.horas_debidas }}</td>
                   </tr>  
                </tbody>   
             </table> 
             <table border="1" width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr>
                    <th style="text-align:center;font-size: small;">CONCEPTO</th>
                    <th style="text-align:center;font-size: small;">UNIDADES</th>
                    <th style="text-align:center;font-size: small;">VALOR UNITARIO</th>
                    <th style="text-align:center;font-size: small;">REMUNERATIVOS</th>
                    <th style="text-align:center;font-size: small;">NO REMUNERATIVOS</th>
                    <th style="text-align:center;font-size: small;">DESCUENTOS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="font-size:small;">HORAS TRABAJADAS</td>
                    <td style="text-align:right; font-size:small;">{{ recibo.horas_trabajadas }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.valor_x_hora ? Number(configMonth.valor_x_hora).toFixed(2) : 0 }}</td> 
                    <td style="text-align:right; font-size:small;">{{ recibo.valor_hora ? Number(recibo.valor_hora).toFixed(2) : 0 }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>
                   <tr>
                    <td style="font-size:small;">INASISTENCIAS JUSTIFICADAS</td>
                    <td style="text-align:right; font-size:small;">{{ recibo.faltas_justificadas }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.valor_x_hora ? Number(configMonth.valor_x_hora).toFixed(2) : 0 }}</td> 
                    <td style="text-align:right; font-size:small;">{{ recibo.hora_x_falta_justificadas ? Number(recibo.hora_x_falta_justificadas).toFixed(2) : 0 }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">INASISTENCIAS INJUSTIFICADAS</td>
                    <td style="text-align:right; font-size:small;">{{ recibo.faltas_injustificadas }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.valor_x_hora ? Number(configMonth.valor_x_hora).toFixed(2) : 0 }}</td> 
                    <td style="text-align:right; font-size:small;">{{ recibo.hora_x_falta_injustificadas ? -1 * Number(recibo.hora_x_falta_injustificadas).toFixed(2) : 0 }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">HORAS EXTRAS</td>
                    <td style="text-align:right; font-size:small;">{{ recibo.horas_extras }}</td>
                    <td style="text-align:right; font-size:small;">{{ ((Number(configMonth.hora_extra)/100)*Number(configMonth.valor_x_hora)).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.valor_hora_extra).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">HORA SABADO INGLES</td>
                    <td style="text-align:right; font-size:small;">{{ recibo.horas_sabado_ingles }}</td>
                    <td style="text-align:right; font-size:small;">{{ ((Number(configMonth.sabado_ingles)/100)*Number(configMonth.valor_x_hora)).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.valor_hora_sabado_ingles).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">ANTIGÜEDAD</td>
                    <td style="text-align:right; font-size:small;">{{ Number(configMonth.antiguedad).toFixed(2) }}%</td>
                    <td style="text-align:right; font-size:small;"></td> 
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.antiguedad).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">ASIGNACION EXTRAORDINARIA</td>
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.hora_mas_falta_justificadas).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.asignacion_extraordinaria ? Number(configMonth.asignacion_extraordinaria).toFixed(2) : 0 }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.valor_asignacion_extraordinaria).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">SUMA NO REMUNERATIVA</td>
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.hora_mas_falta_justificadas).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.suma_no_remunerativa ? Number(configMonth.suma_no_remunerativa).toFixed(2) : '' }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.valor_suma_no_remunerativa).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">AJUSTE MES ANTERIOR</td>
                    <td style="font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td> 
                    <td style="text-align:right; font-size:small;">{{ configMonth.remu_descuento ==1 ? -1 *  Number(recibo.valor_descuento).toFixed(2) : '' }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.remu_descuento ==0 ? -1 *  Number(recibo.valor_descuento).toFixed(2) : '' }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr> 
                   <tr>
                    <td style="font-size:small;">PLUS MES</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.valor_plus_mes }}</td>
                    <td style="text-align:right; font-size:small;"></td> 
                    <td style="text-align:right; font-size:small;">{{ configMonth.remu_plus_mes ==1 ? Number(recibo.valor_plus_mes).toFixed(2) : '' }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.remu_plus_mes ==0 ? Number(recibo.valor_plus_mes).toFixed(2) : '' }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr> 
                   <tr>
                    <td style="font-size:small;">JUBILACION</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.jubilacion? Number(configMonth.jubilacion).toFixed(2) : 0 }}%</td>
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.subtotal_remunerativo).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ -1 * Number(recibo.valor_jubilacion).toFixed(2) }}</td>
                   </tr> 
                   <tr>
                    <td style="font-size:small;">INNSLP (LEY 19032)</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.innslp? Number(configMonth.innslp).toFixed(2) : 0 }}%</td>
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.subtotal_remunerativo).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ -1 * Number(recibo.valor_innslp).toFixed(2) }}</td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">OBRA SOCIAL</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.obra_social? Number(configMonth.obra_social).toFixed(2) : 0 }}%</td>
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.subtotal_remunerativo).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ -1 * Number(recibo.valor_obra_social).toFixed(2) }}</td>
                   </tr> 
                   <tr>
                    <td style="font-size:small;">SINDICATO</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.sindicato? Number(configMonth.sindicato).toFixed(2) : 0 }}%</td>
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.subtotal_remunerativo).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ -1 * Number(recibo.valor_sindicato).toFixed(2) }}</td>
                   </tr> 
                   <tr>
                    <td style="font-size:small;">SEGURO DE VIDA</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.seguro_vida? Number(configMonth.seguro_vida).toFixed(2) : 0 }}%</td>
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.subtotal_remunerativo).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ -1 *  Number(recibo.valor_seguro_vida).toFixed(2) }}</td>
                   </tr> 
                   <tr>
                    <td style="font-size:small;">PRESENTISMO</td>
                    <td style="text-align:right; font-size:small;"> {{ Number(configMonth.presentismo).toFixed(2) }}%</td>
                    <td style="text-align:right; font-size:small;"></td> 
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.presentismo).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr> 
                   <tr>
                    <td rowspan="2" colspan="2" style="text-align:center; font-size:small;">
                      <br><br>
                      <p>_______________________________________</p>
                      <p><b>FIRMA EMPLEADOR</b></p>
                    </td>
                    <td style="text-align:right; font-size:small;"><b>SUBTOTAL</b></td> 
                    <td style="text-align:right; font-size:small;"><b>{{ Number(recibo.subtotal_remunerativo).toFixed(2) }}</b></td>
                    <td style="text-align:right; font-size:small;"><b>{{ Number(recibo.subtotal_noremunerativo).toFixed(2) }}</b></td>
                    <td style="text-align:right; font-size:small;"><b>{{ -1 * Number(recibo.subtotal_descuento).toFixed(2) }}</b></td>
                   </tr>
                   <tr> 
                    <td colspan="3" style="text-align:right; font-size:small;"><b>TOTAL NETO</b></td>
                    <td style="text-align:right; font-size:small;"><b>{{ Number(recibo.total).toFixed(2) }}</b></td>
                   </tr>        
                </tbody>   
             </table>
            </div>
          
            <div style="text-align:center;">--------------------------------------------------------------------------------</div>
          
            <div class="table-responsive">
              <table style="width:100%;">
                  <tr>
                     <td style="text-align:left;font-size: x-large;">
                        <b>ML PLAK</b>
                      </td>
                      <th style="text-align:left;">
                        ALVAREZ MARIANO HERNAN
                      </th>
                      <th style="text-align:right;">
                        CUIT: 20-28765117-2 | CUIL: 27-34906887-2
                      </th>  
                  </tr>
                   <tr>
                     <th colspan="3" style="text-align:left;">
                        LA PLATA AV 72 N868 E 12 y 13
                      </th>
                    </tr>  
              </table>
              <table class="table table-responsive">
                <thead>
                  <tr>
                    <th style="text-align:center;font-size: small;">NOMBRE Y APELLIDO DEL TRABAJADOR</th>
                    <th style="text-align:center;font-size: small;">CATEGORIA</th>
                    <th style="text-align:center;font-size: small;">BASICO</th>
                    <th style="text-align:center;font-size: small;">FECHA INGRESO</th>
                    <th style="text-align:center;font-size: small;">PERIODO</th>
                    <th style="text-align:center;font-size: small;">HORAS DEBIDAS</th>
                  </tr>
                </thead> 
                <tbody>
                  <tr>
                    <td style="font-size:small;">{{usuario.nombre_completo | toUpperCase}} | CUIT: {{usuario.cuit_cuil | toUpperCase}}</td>
                    <td style="font-size:small;">{{ usuario.rango? usuario.rango.nombre : '' }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.valor_x_hora ? Number(configMonth.valor_x_hora).toFixed(2) : 0 }}</td> 
                    <td style="text-align:center; font-size:small;">{{ usuario.fecha_ingreso ? $moment(usuario.fecha_ingreso).format('DD/MM/YYYY') : '' }}</td>
                    <td style="text-align:center; font-size:small;">{{ monthNames[form.mes-1] + "-" + form.anio  | toUpperCase }}</td>
                    <td style="text-align:right; font-size:small;">{{ recibo.horas_debidas }}</td>
                   </tr>  
                </tbody>   
             </table> 
             <table border="1" width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr>
                    <th style="text-align:center;font-size: small;">CONCEPTO</th>
                    <th style="text-align:center;font-size: small;">UNIDADES</th>
                    <th style="text-align:center;font-size: small;">VALOR UNITARIO</th>
                    <th style="text-align:center;font-size: small;">REMUNERATIVOS</th>
                    <th style="text-align:center;font-size: small;">NO REMUNERATIVOS</th>
                    <th style="text-align:center;font-size: small;">DESCUENTOS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="font-size:small;">HORAS TRABAJADAS</td>
                    <td style="text-align:right; font-size:small;">{{ recibo.horas_trabajadas }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.valor_x_hora ? Number(configMonth.valor_x_hora).toFixed(2) : 0 }}</td> 
                    <td style="text-align:right; font-size:small;">{{ recibo.valor_hora ? Number(recibo.valor_hora).toFixed(2) : 0 }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>
                   <tr>
                    <td style="font-size:small;">INASISTENCIAS JUSTIFICADAS</td>
                    <td style="text-align:right; font-size:small;">{{ recibo.faltas_justificadas }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.valor_x_hora ? Number(configMonth.valor_x_hora).toFixed(2) : 0 }}</td> 
                    <td style="text-align:right; font-size:small;">{{ recibo.hora_x_falta_justificadas ? Number(recibo.hora_x_falta_justificadas).toFixed(2) : 0 }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">INASISTENCIAS INJUSTIFICADAS</td>
                    <td style="text-align:right; font-size:small;">{{ recibo.faltas_injustificadas }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.valor_x_hora ? Number(configMonth.valor_x_hora).toFixed(2) : 0 }}</td> 
                    <td style="text-align:right; font-size:small;">{{ recibo.hora_x_falta_injustificadas ? -1 * Number(recibo.hora_x_falta_injustificadas).toFixed(2) : 0 }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">HORAS EXTRAS</td>
                    <td style="text-align:right; font-size:small;">{{ recibo.horas_extras }}</td>
                    <td style="text-align:right; font-size:small;">{{ ((Number(configMonth.hora_extra)/100)*Number(configMonth.valor_x_hora)).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.valor_hora_extra).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">HORA SABADO INGLES</td>
                    <td style="text-align:right; font-size:small;">{{ recibo.horas_sabado_ingles }}</td>
                    <td style="text-align:right; font-size:small;">{{ ((Number(configMonth.sabado_ingles)/100)*Number(configMonth.valor_x_hora)).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.valor_hora_sabado_ingles).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">ANTIGÜEDAD</td>
                    <td style="text-align:right; font-size:small;">{{ Number(configMonth.antiguedad).toFixed(2) }}%</td>
                    <td style="text-align:right; font-size:small;"></td> 
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.antiguedad).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">ASIGNACION EXTRAORDINARIA</td>
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.hora_mas_falta_justificadas).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.asignacion_extraordinaria ? Number(configMonth.asignacion_extraordinaria).toFixed(2) : 0 }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.valor_asignacion_extraordinaria).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">SUMA NO REMUNERATIVA</td>
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.hora_mas_falta_justificadas).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.suma_no_remunerativa ? Number(configMonth.suma_no_remunerativa).toFixed(2) : '' }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.valor_suma_no_remunerativa).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">AJUSTE MES ANTERIOR</td>
                    <td style="font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td> 
                    <td style="text-align:right; font-size:small;">{{ configMonth.remu_descuento ==1 ? -1 *  Number(recibo.valor_descuento).toFixed(2) : '' }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.remu_descuento ==0 ? -1 *  Number(recibo.valor_descuento).toFixed(2) : '' }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr> 
                   <tr>
                    <td style="font-size:small;">PLUS MES</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.valor_plus_mes }}</td>
                    <td style="text-align:right; font-size:small;"></td> 
                    <td style="text-align:right; font-size:small;">{{ configMonth.remu_plus_mes ==1 ? Number(recibo.valor_plus_mes).toFixed(2) : '' }}</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.remu_plus_mes ==0 ? Number(recibo.valor_plus_mes).toFixed(2) : '' }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr> 
                   <tr>
                    <td style="font-size:small;">JUBILACION</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.jubilacion? Number(configMonth.jubilacion).toFixed(2) : 0 }}%</td>
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.subtotal_remunerativo).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ -1 * Number(recibo.valor_jubilacion).toFixed(2) }}</td>
                   </tr> 
                   <tr>
                    <td style="font-size:small;">INNSLP (LEY 19032)</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.innslp? Number(configMonth.innslp).toFixed(2) : 0 }}%</td>
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.subtotal_remunerativo).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ -1 * Number(recibo.valor_innslp).toFixed(2) }}</td>
                   </tr>  
                   <tr>
                    <td style="font-size:small;">OBRA SOCIAL</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.obra_social? Number(configMonth.obra_social).toFixed(2) : 0 }}%</td>
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.subtotal_remunerativo).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ -1 * Number(recibo.valor_obra_social).toFixed(2) }}</td>
                   </tr> 
                   <tr>
                    <td style="font-size:small;">SINDICATO</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.sindicato? Number(configMonth.sindicato).toFixed(2) : 0 }}%</td>
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.subtotal_remunerativo).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ -1 * Number(recibo.valor_sindicato).toFixed(2) }}</td>
                   </tr> 
                   <tr>
                    <td style="font-size:small;">SEGURO DE VIDA</td>
                    <td style="text-align:right; font-size:small;">{{ configMonth.seguro_vida? Number(configMonth.seguro_vida).toFixed(2) : 0 }}%</td>
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.subtotal_remunerativo).toFixed(2) }}</td> 
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;">{{ -1 *  Number(recibo.valor_seguro_vida).toFixed(2) }}</td>
                   </tr> 
                   <tr>
                    <td style="font-size:small;">PRESENTISMO</td>
                    <td style="text-align:right; font-size:small;"> {{ Number(configMonth.presentismo).toFixed(2) }}%</td>
                    <td style="text-align:right; font-size:small;"></td> 
                    <td style="text-align:right; font-size:small;">{{ Number(recibo.presentismo).toFixed(2) }}</td>
                    <td style="text-align:right; font-size:small;"></td>
                    <td style="text-align:right; font-size:small;"></td>
                   </tr> 
                   <tr>
                    <td rowspan="2" colspan="2" style="text-align:center; font-size:small;">
                      <br><br>
                      <p>_______________________________________</p>
                      <p><b>FIRMA DEL EMPLEADO</b></p>
                    </td>
                    <td style="text-align:right; font-size:small;"><b>SUBTOTAL</b></td> 
                    <td style="text-align:right; font-size:small;"><b>{{ Number(recibo.subtotal_remunerativo).toFixed(2) }}</b></td>
                    <td style="text-align:right; font-size:small;"><b>{{ Number(recibo.subtotal_noremunerativo).toFixed(2) }}</b></td>
                    <td style="text-align:right; font-size:small;"><b>{{ -1 * Number(recibo.subtotal_descuento).toFixed(2) }}</b></td>
                   </tr>
                   <tr> 
                    <td colspan="3" style="text-align:right; font-size:small;"><b>TOTAL NETO</b></td>
                    <td style="text-align:right; font-size:small;"><b>{{ Number(recibo.total).toFixed(2) }}</b></td>
                   </tr>        
                </tbody>   
             </table>
            </div>
          </div>
          <button @click="$bvModal.hide('modal-reporte')" type="button" class="btn btn-danger" data-dismiss="modal" style="margin:auto; float: right;">Cerrar</button>
    </b-modal>  
    </div>
    
</template>

<script>
import { HTTP } from "../../../index";
import usuarioService from "../Services/usuarioService";
import rangoService from '../Services/rangoService'
import asistenciaService from "../Services/asistenciaService";
import configuracionMensualService from "../Services/configuracionMensualService";
import pagoService from "../Services/pagoService";
import reciboService from "../Services/reciboService";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert2";
import VueToastr from "vue-toastr";

const UsuarioService = new usuarioService();
const RangoService = new rangoService();
const AsistenciaService = new asistenciaService();
library.add(faCheck);
library.add(faRedo);

export default {
  components: {
    FontAwesomeIcon,
    VueToastr,
    // AirbnbStyleDatepicker
  },
  data() {
    return {
      usuarioAfip: 0,
      loadingPage: false,
      recibo: {},
      rangoAnterior: '',
      usuarios: [],
      rangos:[],
      asistencias: [],
      inasistenciaDocs:[],
      ingresos: 0,
      salidas: 0,
      form: {
        usuario_id: 0,
        fecha_inicio: this.$moment().format("YYYY-MM-DD"),
        fecha_fin: this.$moment().format("YYYY-MM-DD"),
        anio: this.$moment().format("YYYY"),
        mes: this.$moment().format('M'),
      },
      actualYear: this.$moment().format("YYYY"),
      actualMonth: this.$moment().month(),
      monthNames: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
      calculadora: {
        recibo_id: 0,
        dias_trabajados: this.ingresos,
        sueldo_dia: 0,
        horas_extras: 0,
        valor_horas_extras: 0,
        total_sueldo: 0,
        total_horas_extras: 0,
        pcd: 0,
        observacion: "",
        compensacion: 0,
        descuento: 0,
        valor_jubilacion: 0,
        valor_innslp:0 , 
        valor_obra_social: 0,
        valor_sindicato: 0,
        valor_seguro_vida: 0,
        valor_asignacion_extraordinaria: 0,
        valor_suma_no_remunerativa: 0,
        hora_x_falta_justificadas: 0,
        hora_x_falta_injustificadas: 0,
        hora_mas_falta_justificadas: 0,
        subtotal_remunerativo: 0,
        subtotal_noremunerativo: 0,
        subtotal_descuento: 0
      },
      dateRange: "",
      dataPdf: {
        asistencias: this.asistencias,
        calculadora: this.calculadora,
        path: "",
      },
      daterange: "",
      sortCausaSalida: "causaSalida",
      usuario: {
        id: 0,
        correo_google: "",
        nombre_completo: "",
        usuario: "",
        password: "",
        activo: 0,
        rol_id: 0,
      },
      configMonthRango: 0,
      configMonth: {
        id: 0,
        rango_id: 0,
        valor_x_hora: '',
        hora_extra: 50,
        sabado_ingles: 100,
        valor_plus_mes: 0,
        valor_plus: 0,
        descuento: 0,
        presentismo: 0,
        forzar_presentismo: 0,
        forzar_presentismo_porcentaje: 0,
        sistema_horario: 0,
        antiguedad: 0,
        jubilacion: 0,
        innslp: 0, 
        obra_social: 0,
        sindicato: 0,
        seguro_vida: 0,
        asignacion_extraordinaria: 0,
        remu_descuento: 1,
        remu_plus_mes: 1 
      },
      totalHoras: 0,
      totalHorasTrabajadas: 0,
      totalHorasSabadoIngles: 0,
      totalhorasExtras: 0,
      hasPermiso: false,
      paid: false,
      pagos: [],
      formPago: {
        monto: 0,
        comentario: ''
      },
      formInasistencia: {
        id: 0,
        usuario_id: 0,
        fecha1: '',
        fecha2: '',
        descripcion: '',
        doc: '',
      },
      pagoState: {
        monto: null
      },
    };
  },
  async mounted() {
    this.usuarioAfip = 0
    this.getAllRangos()
    this.cargarUsuarios()
    this.getPermisoByUser()
  },
  filters: {
    capitalize(value){
        if (!value || value === undefined){
          return '';
        }

        value = value.toString ();
        return value.charAt (0) .toUpperCase () + value.slice (1);
    },

    wordsCapitalize(value) {
        if (!value || value === undefined){
          return '';
        }

        return value.replace(/(?:^|\s)\S/g, function(v) { return v.toUpperCase(); }); 
    },

    toUpperCase(value) {
        if (!value || value === undefined){
          return '';
        }
 
        return value.toUpperCase();
    },
  },
  methods: {
    updateUsuarioAfip(value) {
      this.usuarioAfip = value
      this.cargarUsuarios()
    },
    async cargarUsuarios() {
      let data = null
      if (this.usuarioAfip == 1) {
          data = await UsuarioService.getAll(1);
      }    
      if (this.usuarioAfip == 0) {
          data = await UsuarioService.getOnlyAfip();
      } 
      if (data) {
        if (data.usuarios) {
          this.usuarios = data.usuarios
        }           
      }
    },
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
        this.getReciboUser()  
        this.$bvModal.show("modal-reporte");
    },

    async getReciboUser() {
        this.recibo = {};
        let data = await reciboService.get(parseInt(this.form.usuario_id), parseInt(this.form.anio), parseInt(this.form.mes));
        if (data) {
          if ((data.recibo !== null) && (data.recibo !== undefined))
            this.recibo = data.recibo
        }
        console.log("Recibo: ", this.recibo);
    },

    onChangeRango(eventoRango) {
        let rango = eventoRango.target.value;
        console.log("configMonth: ", rango);
        rango = rango.split("-");
        this.configMonth.rango_id = parseInt( rango[0]);
        this.configMonth.valor_x_hora = parseFloat( rango[1]);
        this.configMonth.suma_no_remunerativa = parseFloat( rango[2]);
        console.log("configMonth: ", this.configMonth.rango_id);
        console.log("configMonth: ", this.configMonth.valor_x_hora);
    },

    async getAllRangos() {
        let data = await RangoService.getAll()
        if (data){
          if ((data.data !== null) && (data.data !== undefined))
            this.rangos = data.data;
        }
    },

    async viewInasistenciaDoc(docUrl) {
      if(docUrl){
        window.open(docUrl,'_blank');
      }
    },

    getFileInasistenciaDoc(event) {
      this.formInasistencia.doc = event.target.files[0];
    },

    async showInasistencia(usuario_id,fecha) {
      this.formInasistencia.id = 0;
      this.formInasistencia.usuario_id = usuario_id;
      this.formInasistencia.descripcion = "";
      this.formInasistencia.doc = "";
      this.formInasistencia.fecha1 = fecha;
      this.formInasistencia.fecha2 = "";
      this.inasistenciaDocs = [];
      let result = await HTTP.get("/api/inasistencias/" + usuario_id + "/" + fecha);
      if (result) {
        console.log("show_result: ", result);
        if (result.data.data != null) {
          let inasistencia = result.data.data;
          this.inasistenciaDocs = inasistencia.inasistencia_doc;
          this.formInasistencia.id =  inasistencia.id;
          this.formInasistencia.fecha1 = inasistencia.fecha1;
          this.formInasistencia.fecha2 = inasistencia.fecha2;
          console.log("show_formInasistencia: ", this.formInasistencia);
        }
      }    
      this.$refs.myModalInasistencia.show();
    },
    
    async loadInasistenciaDoc(usuario_id,fecha) { 
      this.formInasistencia.id = 0;
      this.inasistenciaDocs = [];
      let result = await HTTP.get("/api/inasistencias/" + usuario_id + "/" + fecha);
      if (result) {
        if (result.data.data != null) {
          let inasistencia = result.data.data;
          this.inasistenciaDocs = inasistencia.inasistencia_doc;
          this.formInasistencia.id =  inasistencia.id;
        }
      }    
    },

    async agregarInasistencia() {
      console.log("Agregar formInasistencia: ", this.formInasistencia);
      let formInasistencia = new FormData();
      for (let key in this.formInasistencia) {
        formInasistencia.append(key, this.formInasistencia[key]);  
      }
      try{
        let result = await HTTP.post("/api/inasistencias",formInasistencia);
        if (result) {
          this.loadInasistenciaDoc(this.formInasistencia.usuario_id, this.formInasistencia.fecha1);
          this.reloadAsistencias()
          if (this.formInasistencia.id > 0){
            this.$refs.toastr.s("Documento cargado.");
          }   
          if (this.formInasistencia.id == 0) {  
            this.$refs.toastr.s("Inasistencia registrada."); 
          }
          this.formInasistencia.descripcion = "";
          this.formInasistencia.doc = null;
        }
        else {
          this.$refs.toastr.e("ERROR: Verifique por favor...");  
        }
      } catch (error) {
        if (typeof error.response != "undefined") {
          if (typeof error.response.data.errors != "undefined") {
              if (typeof error.response.data.errors.fecha1 != "undefined") {
                this.$refs.toastr.e("ERROR: " + error.response.data.errors.fecha1[0]);
                return;
              }
              if (typeof error.response.data.errors.fecha2 != "undefined") {
                this.$refs.toastr.e("ERROR: " + error.response.data.errors.fecha2[0]);
                return;
              }
              if (typeof error.response.data.errors.descripcion != "undefined") {
                this.$refs.toastr.e("ERROR: " + error.response.data.errors.descripcion[0]);
                return;
              }
              if (typeof error.response.data.errors.doc != "undefined") {
                this.$refs.toastr.e("ERROR: " + error.response.data.errors.doc[0]);
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

    async actualizarInasistencia() {
      console.log("Actualizar formInasistencia: ", this.formInasistencia);
      try{
        let result = await HTTP.put("/api/inasistencias/" +  this.formInasistencia.id, this.formInasistencia);
        if (result) {
           this.reloadAsistencias() 
           this.$refs.toastr.s("Inasistencia actualizada.");
        }
       } catch (error) {
          if (typeof error.response != "undefined") {
          
            if (typeof error.response.data.errors.doc != "undefined") {
              console.log(error.response.data.errors.doc[0]);
              this.$refs.toastr.e("ERROR: " + error.response.data.errors.doc[0]);
              return;
            }
            console.log(error.response.data.errors);
            this.$refs.toastr.e("ERROR: " + error.response.data.errors);
            return;
          }
          console.log(error);
          this.$refs.toastr.e(error);
      }  
    },    

    async deleteInasistencia(inasistenciaDocIid) {
      try{
        let result = await HTTP.delete("/api/inasistencias/" + inasistenciaDocIid);
        if (result) {
          this.$refs.toastr.s("Documento eliminado.");
          this.reloadAsistencias() 
          this.loadInasistenciaDoc(this.formInasistencia.usuario_id, this.formInasistencia.fecha1);
          this.formInasistencia.descripcion = "";
          this.formInasistencia.doc = "";
        }  
      } catch (error) {
        console.log(error)
        this.$refs.toastr.e("ERROR: " + error);
      }   
    },

    closeInasistencia() {
      this.$refs.myModalInasistencia.hide();
    },
    async reloadAsistencias() {
      if (this.form.usuario_id < 1) {
        this.$noty.warning("Debe seleccinar un usuario.");
        return
      }
      this.loadingPage = true
      let {asistencias, ...data} = await AsistenciaService.getByUsuarioFecha(
        this.form
      );
      console.log("Loaded asistencias: ", asistencias);
      console.log("Loaded data: ", data);
      this.usuario = this.usuarios.find(el => el.id == this.form.usuario_id)
      //Llamar calcular el rango anterior
      //this.form.usuario_id | this.form.anio | this.form.mes
      console.log("Config. Mensual Ant por Cargar");   
      let response = await configuracionMensualService.getConfigAnt(this.form);
      console.log("Config. Mensual Ant reponse: ", response.data);
      this.rangoAnterior = '';
      if (response.data) {
        if (response.data.rango) {
            this.rangoAnterior = response.data.rango.nombre;
        }    
      } 
      console.log("Config. Mensual Ant Cargada");   
      //---------------------------------
      let self = this
      console.log("Asistencia 1: ", this.asistencias)
      this.asistencias = Object.values(asistencias.reduce(function(groups, item, i, array) {
        let there = item.id ? 'si' : 'no'
        var val = item['fecha'].split(' ')[0] + there;
        groups[val] = groups[val] || {
          ...item,
          cert_medico:[],
          tipo: [],
          obs: [],
          date: [],
          ids: [],
          heading: true
          // dia: self.$moment(item['fecha'].split(' ')[0]).locale('es').format('dddd')
        };
        if(item.tipo_asistencia.id==0) {
          let another = array.filter(el => item['fecha'].split(' ')[0] == el.fecha.split(' ')[0])
          if(another.length>1) {
            groups[val].heading = false
          }
        }
        if(item.tipo_asistencia.tipo!='---')
          groups[val].tipo.push(item.tipo_asistencia.tipo);

        if(item.id)
          groups[val].ids.push(item.id);

        if(item.tipo_asistencia) {
          const mark = self.$moment(item.fecha).format('HH:mm:ss')
          if(item.tipo_asistencia.tipo=="Ingreso") {
            groups[val].markIn = mark
          }
          if(item.tipo_asistencia.tipo=="Salida") {
            groups[val].markOut = mark
          }
        }
        if(item.observacion)
          groups[val].obs.push(item.observacion ? item.observacion : "N/A");
        groups[val].date.push(item.fecha);
        //let workedHoursToday = data.horas_dias[self.$moment(groups[val].fecha).format('ddd')]
        if (item.cert_medico)
          groups[val].cert_medico.push(item.cert_medico ? 1 : 0);
        /*
        if(groups[val].date.length>1) {
          const dif = self.$moment(groups[val].date[1]).diff(groups[val].date[0])
          const duration = self.$moment.duration(dif).add(groups[val].ajuste_hora,'h')
          groups[val].workedHours = self.padLeft(duration.hours()) +':'+
          self.padLeft(duration.minutes()) +':'+
          self.padLeft(duration.seconds());
          let hoursToday = duration.hours() + duration.minutes()/60
          self.totalHoras += hoursToday
          if(self.$moment(groups[val].fecha).format('ddd') == 'Sat'){
            let sabado = 0
            if(hoursToday>workedHoursToday) {
              sabado = hoursToday - workedHoursToday
            }
            self.totalHorasSabadoIngles += sabado
            hoursToday = workedHoursToday
          }
          self.totalHorasTrabajadas += hoursToday
        }
        if(item.justificacion){
          groups[val].workedHours = self.$moment().startOf('day').add(workedHoursToday, 'h').format('HH:mm:ss')
          if(self.$moment(groups[val].fecha).format('ddd') == 'Sat'){
            // self.totalHorasSabadoIngles += workedHoursToday
          }
          self.totalHorasTrabajadas += workedHoursToday
          
          self.totalHoras += workedHoursToday
        }*/
        return groups;
      }, {}));
      this.ingresos = data.ingresos;
      console.log("Asistencia 2: ", this.asistencias)
      if(this.form.usuario_id > 0){
        this.configMonth = await configuracionMensualService.get(this.form);
        console.log("configMonthXXX: ", this.configMonth)
        if (this.configMonth != null) {      
         /* if (this.configMonth.status===0) {
            this.configMonthRango = this.usuario.rango.id + "-" + Number(this.usuario.rango.valor).toFixed(2) + "-" + Number(this.usuario.rango.suma_no_remunerativa).toFixed(2);
          }  */
         // if (this.configMonth.status===1) {
            this.configMonthRango = this.configMonth.rango_id + "-" + Number(this.configMonth.valor_x_hora).toFixed(2) + "-" + Number(this.configMonth.suma_no_remunerativa).toFixed(2); 
         // }
          console.log("configMonthRango: ", this.configMonthRango)
        }
        this.pagos = await pagoService.get(this.form);
        this.calcularSueldo(data)
      }
      this.loadingPage = false
    },
    resetForm() {
      this.form = {
        usuario_id: 0,
        anio: this.$moment().format("YYYY"),
        mes: this.$moment().format('M'),
      };
    },
    calendarApplied(event) {
      this.form.fecha_inicio = event.picker.startDate.format("YYYY-MM-DD");
      this.form.fecha_fin = event.picker.endDate.format("YYYY-MM-DD");
    },
    setSortProps(value = "causaSalida") {
      this.sortCausaSalida = value;
      this.sortAsistencias();
    },
    sortAsistencias() {
      this.asistencias = this.asistencias.sort(
        fieldSorter([this.sortCausaSalida])
      );
    },
    calcularSueldo(data) {
      this.calculadora = {
        ...data,
        valor_plus_mes: parseFloat(this.configMonth.valor_plus_mes),
        valor_plus_encargado: parseFloat(this.configMonth.valor_plus),
      }
        
      this.calculadora['valor_hora'] = parseFloat(this.calculadora.horas_trabajadas) * parseFloat(this.configMonth.valor_x_hora)
      this.calculadora['valor_hora_extra'] = parseFloat(this.calculadora.horas_extras).toFixed(2) * ((parseFloat(this.configMonth.hora_extra)/100)*parseFloat(this.configMonth.valor_x_hora))
      this.calculadora['valor_hora_sabado_ingles'] = parseFloat(this.calculadora.horas_sabado_ingles) * ((parseFloat(this.configMonth.sabado_ingles)/100)*parseFloat(this.configMonth.valor_x_hora))
      this.calculadora['valor_hora_total'] = parseFloat(this.calculadora['valor_hora']) +
        parseFloat(this.calculadora['valor_hora_extra']) +
        parseFloat(this.calculadora['valor_hora_sabado_ingles'])
      this.calculadora['antiguedad'] = parseFloat(this.calculadora['valor_hora_total']) *
        (parseFloat(this.configMonth.antiguedad)/100)

      if (this.configMonth.asignacion_extraordinaria !== null) {
        this.calculadora['valor_asignacion_extraordinaria'] = (parseFloat(this.calculadora.faltas_justificadas) + parseFloat(this.calculadora.horas_trabajadas)) * parseFloat(this.configMonth.asignacion_extraordinaria);
      }
      if (this.configMonth.asignacion_extraordinaria == null) {
        this.calculadora['valor_asignacion_extraordinaria'] = 0.00;
      }  
      if (this.configMonth.suma_no_remunerativa !== null) {
        this.calculadora['valor_suma_no_remunerativa'] = (parseFloat(this.calculadora.faltas_justificadas) + parseFloat(this.calculadora.horas_trabajadas)) * parseFloat(this.configMonth.suma_no_remunerativa);
      }
      if (this.configMonth.suma_no_remunerativa == null) {
        this.calculadora['valor_suma_no_remunerativa'] = 0.00
      }
     this.forzarPresentismo()
     this.calculadora['valor_descuento'] = parseFloat(this.configMonth.descuento)
     this.calculadora['hora_x_falta_justificadas'] = parseFloat(this.configMonth.valor_x_hora) * parseFloat(this.calculadora.faltas_justificadas)
     this.calculadora['hora_x_falta_injustificadas'] = parseFloat(this.configMonth.valor_x_hora) * parseFloat(this.calculadora.faltas_injustificadas)
     this.calculadora['hora_mas_falta_justificadas'] = parseFloat(this.calculadora.faltas_justificadas) + parseFloat(this.calculadora.horas_trabajadas)
     //this.calculadora['hora_mas_falta_justificadas'] = parseFloat(this.calculadora.horas_trabajadas_reales)
     //Calculo de las sumas remunerativas 
     this.calculadora['subtotal_remunerativo']= parseFloat(this.calculadora['valor_hora']) +
        parseFloat(this.calculadora['hora_x_falta_justificadas']) -
        parseFloat(this.calculadora['hora_x_falta_injustificadas']) +
        parseFloat(this.calculadora['valor_hora_extra']) +
        parseFloat(this.calculadora['valor_hora_sabado_ingles']) +
        parseFloat(this.calculadora['antiguedad']) + 
        parseFloat(this.calculadora['presentismo'])

     if (this.configMonth.remu_descuento == 1) {
        this.calculadora['subtotal_remunerativo'] -= parseFloat(this.calculadora['valor_descuento'])
     }   
     if (this.configMonth.remu_plus_mes == 1) {
        this.calculadora['subtotal_remunerativo'] += parseFloat(this.calculadora.valor_plus_mes)
     }  
     
     //Calculo de las sumas noremunerativas 
     this.calculadora['subtotal_noremunerativo'] = parseFloat(this.calculadora['valor_asignacion_extraordinaria']) +
        parseFloat(this.calculadora['valor_suma_no_remunerativa'])
     if (this.configMonth.remu_descuento == 0) {
        this.calculadora['subtotal_noremunerativo'] -= parseFloat(this.configMonth.descuento)
     }   
     if (this.configMonth.remu_plus_mes == 0) {
        this.calculadora['subtotal_noremunerativo'] += parseFloat(this.calculadora.valor_plus_mes)
     }   
     
    //Calculo de descuentos
    this.calculadora['valor_jubilacion'] = (parseFloat(this.configMonth.jubilacion)/100) * parseFloat(this.calculadora['subtotal_remunerativo'])
    this.calculadora['valor_innslp'] =  (parseFloat(this.configMonth.innslp)/100) * parseFloat(this.calculadora['subtotal_remunerativo']) 
    this.calculadora['valor_obra_social'] = (parseFloat(this.configMonth.obra_social)/100) * parseFloat(this.calculadora['subtotal_remunerativo'])
    this.calculadora['valor_sindicato'] = (parseFloat(this.configMonth.sindicato)/100) * parseFloat(this.calculadora['subtotal_remunerativo'])
    this.calculadora['valor_seguro_vida'] = (parseFloat(this.configMonth.seguro_vida)/100) * parseFloat(this.calculadora['subtotal_remunerativo'])
    this.calculadora['subtotal_descuento'] = parseFloat(this.calculadora.valor_jubilacion) +
        parseFloat(this.calculadora.valor_innslp) +
        parseFloat(this.calculadora.valor_obra_social) +
        parseFloat(this.calculadora.valor_sindicato) +
        parseFloat(this.calculadora.valor_seguro_vida)

    this.calculadora['total'] =  parseFloat(this.calculadora['subtotal_remunerativo']) +  parseFloat(this.calculadora['subtotal_noremunerativo']) - parseFloat(this.calculadora['subtotal_descuento'])

    console.log('Calculadora: ', this.calculadora)
    },
    forzarPresentismo(){
      this.calculadora['presentismo'] = 0;
      if(this.configMonth.forzar_presentismo==1) {
        this.calculadora['presentismo'] = this.calcPresentismo()
      }
      if(this.configMonth.forzar_presentismo==0) {
        if(this.calculadora.faltas_injustificadas == 0 && this.calculadora.faltas_justificadas == 0) {
          this.calculadora['presentismo'] = this.calcPresentismo()
        }
      }
    },

    calcPresentismo() {
        return (parseFloat(this.calculadora['valor_hora_total'])+
          parseFloat(this.calculadora['antiguedad'])) *
          (parseFloat(this.configMonth.presentismo)/100)
    },

    async reportePDF(e) {
      this.dataPdf.asistencias = this.asistencias;
      this.dataPdf.calculadora = this.calculadora;

      e.textContent = "Generando reporte...";
      e.disabled = true;
      let data = await AsistenciaService.pdf(this.dataPdf);
      if (data) {
        this.dataPdf.path = data.path;
        console.log(data);
      }
    },
    redirectPdf() {
      //location.href = this.dataPdf.path;
      window.open(this.dataPdf.path, "_blank");
    },
    padLeft(value, length = 2) {
      return (value.toString().length < length) ? this.padLeft("0" + value, length) :
      value;
    },
    async force(asistencia){
      let results = await AsistenciaService.force(asistencia);
      console.log(results)
      await this.reloadAsistencias()
      this.$noty.info("Actualizadas las horas");
    },
    async addHours(asistencia){
      console.log('horas', asistencia)
      let ajuste_hora = asistencia.ajuste_hora
      let results = await AsistenciaService.update({ajuste_hora}, asistencia.id);
      await this.reloadAsistencias()
      this.$noty.info("Horas ajustadas");
    },
    async justificar(asistencia) {
      console.log('justificar', asistencia)
      let data = {
        fecha: asistencia.fecha,
        usuario_id: asistencia.usuario_id,
        horario_id: asistencia.horario_id,
      }
      this.$swal("Justificar", {
        title: "¿Seguro de justificar inasistencia este día?",
        icon: "warning",

        buttons: {
          cancel: "Cancelar",
          aceptar: {
            text: "Confirmar",
            value: true,
          },
        },
      }).then(async (value) => {
        if (value === true) {
          this.$noty.info("Guardando justificacion");
          let results = await AsistenciaService.justify(data);
          await this.reloadAsistencias()
        }
      });
    },
    async injustificar(asistencia) {
      let self = this;
      this.$swal("Eliminar justificación", {
        title: "¿Seguro de eliminar justificación?",
        icon: "warning",
        buttons: {
          cancel: "Cancelar",
          aceptar: {
            text: "Confirmar",
            value: true,
          },
        },
      }).then(async (value) => {
        if (value === true) {
          this.$noty.info("Quitando justificacion");
          let results = await AsistenciaService.destroy(asistencia.id);
          await this.reloadAsistencias()
        }
      });

    },
    getPermisoByUser() {
      let user;
      try{
        user = JSON.parse(localStorage.getItem('usuario'))
      } catch (error) {
        console.log(error)
        return
      }
      UsuarioService.getPermiso(user.id).then(response => {
        this.hasPermiso = response.data.permiso
        if(!response.data.permiso){
          this.updateUsuarioAfip(1)
          this.form.usuario_id = response.data.id
          this.usuario = response.data
          this.reloadAsistencias()
        }
      }).catch(error => {
        console.log(error)
        this.usuario = user
        this.form.usuario_id = user.id
        this.$noty.error('Ha ocurrido un error obteniendo los datos del usuario')
      })
    },
    async guardarConfiguracion(){
      let data = {
        ...this.configMonth,
        mes: this.form.mes,
        anio: this.form.anio,
        usuario_id: this.form.usuario_id,
      }
      console.log("Config: ", this.configMonth)
      console.log("Data: ", data)
      ///alert(this.configMonth.id)
      if ((this.configMonth !=null) && (this.configMonth.id != undefined) && (this.configMonth.id>0)){
        await configuracionMensualService.update(this.configMonth.id, this.configMonth).then((result) => {
          this.reloadAsistencias()
          return this.$noty.info('Se ha actualizado la configuración.')
         }).catch(e => {
          this.reloadAsistencias()
          return this.$noty.error('Error en la configuración: ' + e)
         }); 
      }
      //new
      if ((this.configMonth ==null) || (this.configMonth.id == undefined) || (this.configMonth.id ==0)){
        this.configMonth = await configuracionMensualService.store(data).then((result) => {
            this.reloadAsistencias()
            return this.$noty.info('Se ha agregado la configuración.')
          }).catch(e => {
            this.reloadAsistencias()
            return this.$noty.error('Error en la configuración: ' + e)
          }); 
      }   
    },
    async finalizar(){
      if(this.configMonth.id){
        if (this.configMonth.status==1) {
           this.configMonth.status = 0
           await configuracionMensualService.updateStatus(this.configMonth.id, this.configMonth).then((result) => {
              this.configMonth = result
              this.$noty.info('Se ha reaperturado la liquidación.')
            }).catch(e => {
              return this.$noty.error('Error en la reapertura: ' + e)
            }); 
           
        }   
        else {
            this.configMonth.status = 1
            await configuracionMensualService.update(this.configMonth.id, this.configMonth).then((result) => {
              this.configMonth = result
              this.$noty.info('Se ha agregado la configuración.')
            }).catch(e => {
              this.reloadAsistencias()
              return this.$noty.error('Error en la configuración: ' + e)
            }); 

            await reciboService.save({...this.calculadora, ...this.form}).then((result) => {
              this.calculadora.recibo_id = result.id
              return this.$noty.info('Se ha agregado el recibo.')
            }).catch(e => {
              this.reloadAsistencias()
              return this.$noty.error('Error actualizando el recibo: ' + e)
            }); 
        }    
      }
    },
    checkFormValidity() {
      let valid = this.$refs.form.checkValidity()
      valid = valid /*&& this.formPago.monto <= (this.calculadora.total - this.pagos.total)*/ && this.formPago.monto > 0
      console.log(valid)
      this.pagoState.monto = valid
      return valid
    },
    resetModal() {
      this.formPago = {
        monto: '',
        comentario: ''
      }
      this.pagoState = {
        monto: null
      }
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      // Push the name to submitted names
      let data = {
        ...this.formPago,
        ...this.form
      }
      pagoService.store(data).then(async resp => {
        this.$noty.info('Se ha agregado el pago')
        this.pagos = await pagoService.get(this.form)
      })
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing')
      })
    },
    quitar(asistencia) {
      let self = this;
      this.$swal("Quitar asistencia", {
        title: "¿Seguro de eliminar asistencia?",
        icon: "warning",
        buttons: {
          cancel: "Cancelar",
          aceptar: {
            text: "Confirmar",
            value: true,
          },
        },
      }).then(async (value) => {
        console.log(asistencia.ids)
        if (value === true) {
          this.$noty.info("Quitando asistencia");
          for(const id of asistencia.ids) {
            let results = await AsistenciaService.destroy(id);
          }
          this.$noty.info("Asistencia eliminada");
          await this.reloadAsistencias()
        }
      });
    }
  },
  computed: {
    saldo(){
      return parseFloat((this.calculadora.total - this.pagos.total).toFixed(2))
    },
    canEdit(){
      return this.hasPermiso && (this.configMonth.status==0)
    },
    readonlyConfig(){
      return !this.hasPermiso || (this.configMonth.status==1)
    }
  }
};
</script>

<style scoped>
.bg-info {
  background-color: #ccefff!important;
}
.bg-success {
  background-color: #caf2d3!important;
}
</style>

<style>
/** Utilizar id del componente porque se rompe la UI si se pone scoped
 * Al mismo tiempo no tiene que afectar todo el sitio, porque se rompe taller */

@media only screen and (min-width: 769px) {
  #app-asistencia-list .asd__wrapper {
    margin-left: -300px;
    position: sticky !important;
    left: -600px !important;
    /* margin-left:-100% !important  */
  }
}

/* test */

#app-asistencia-list * {
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}

#app-asistencia-list .table__wrapper {
  width: 100%;
}

#app-asistencia-list .table__wrapper .table {
  width: 100%;
  max-width: 100%;
}

/* ------- Presentational Formatting --------- */
#app-asistencia-list h1 {
  text-align: center;
}

#app-asistencia-list .center {
  margin: 0 auto;
  width: 80%;
}

#app-asistencia-list .table {
  border: 1px solid #f0f0f0;
  border-collapse: collapse;
}

#app-asistencia-list .table tr {
  border-bottom: 1px solid #f0f0f0;
}

#app-asistencia-list .table thead tr {
  border-bottom: 2px solid #f0f0f0;
}

#app-asistencia-list .table td,
#app-asistencia-list .table th {
  padding: 0.5em;
}

#app-asistencia-list .table th {
  text-align: left;
}
/* 
@media screen and (max-width: 991px) {
  #app-asistencia-list .table {
    margin: 0 auto;
    width: 100%;
    border-spacing: 0;
  }
  #app-asistencia-list .table thead {
    position: absolute;
    clip: rect(1px, 1px, 1px, 1px);
    padding: 0;
    border: 0;
    height: 1px;
    width: 1px;
    overflow: hidden;
  }
  #app-asistencia-list .table tbody,
  #app-asistencia-list .table tr,
  #app-asistencia-list .table th,
  #app-asistencia-list .table td {
    display: block;
    padding: 0;
    text-align: left;
    white-space: normal;
  }
  #app-asistencia-list .table tr td,
  #app-asistencia-list .table tr th {
    padding: 1em 1em;
    vertical-align: middle;
    overflow: hidden;
    position: relative;
    vertical-align: top;
    border: 1px solid #edf0f1;
    border-top: none;
    width: 100%;
    white-space: normal;
  }
  #app-asistencia-list .table th[scope="row"] {
    width: 100%;
    text-align: center;
    display: block;
    background-color: #b3bfc6;
    margin: 0 auto;
    padding: 0.5em 0;
  }
  #app-asistencia-list .table td[data-header]:before {
    content: attr(data-header);
    display: block;
    float: left;
    width: 50%;
    color: #ffffff;
    font-weight: bold;
    text-align: left;
  }
  #app-asistencia-list .table td[data-header] > * {
    display: block;
    width: 50%;
    float: right;
    clear: right;
    padding-left: 1em;
    margin-top: 0;
  }
  #app-asistencia-list .table td[data-header]:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 50%;
    border-right: 1px solid #edf0f1;
    padding-bottom: 200%;
    display: block;
  }
} */

@media screen and (max-width: 600px) {
  #app-asistencia-list .center {
    width: 100%;
  }
}
</style>
