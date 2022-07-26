<template>
  <div id="app-auditoria-list" class="container">
  <vue-toastr ref="toastr"></vue-toastr>
	<div class="col-sm-12 col-sm-offset-1" style="margin-top: 20px">
		<div id="usuario-listado" class="col-sm-12">
			<div class="form-horizontal">
        <div class="row">
          <div class="col-sm-4 form-group row">
            <label class="control-label col-sm-4">Usuario: </label>
            <div class="col-sm-8">
              <select class="form-control" name="usuario" v-model="form.usuario_id">
                <option v-for="usuario in usuarios" :value="usuario.id" :key="usuario.id">{{ usuario.usuario }}</option>
              </select>
            </div>
          </div>

          <div class="col-sm-6 form-group row">
            <label class="control-label col-sm-4"><span>Rango fecha:</span></label>
            <div class="col-sm-3"> 
                <input style="width:120px"
                    type="text"
                    id="datepicker-trigger"
                    v-model="form.fecha_inicio"
                    placeholder="Desde"
                    title="Seleccione rango de fecha..."
                    readonly
                >
                <AirbnbStyleDatepicker class="AirbnbStyleDatepicker"
                    :trigger-element-id="'datepicker-trigger'"
                    :mode="'range'"
                    :fullscreen-mobile="true"
                    :date-one="form.fecha_inicio"
                    :date-two="form.fecha_fin"
                    @date-one-selected="val => { form.fecha_inicio = val }"
                    @date-two-selected="val => { form.fecha_fin = val }"
                />           
            </div> 
            <div class="col-sm-1">&#128197;</div>
            <div class="col-sm-3">   
                <input style="width:120px"
                    type="text"
                    id="datepicker-trigger-2"
                    v-model="form.fecha_fin"
                    placeholder="Hasta"
                    title="Seleccione rango de fecha..."
                    readonly
                >						
                <AirbnbStyleDatepicker class="AirbnbStyleDatepicker"
                    :trigger-element-id="'datepicker-trigger-2'"
                    :mode="'range'"
                    :fullscreen-mobile="true"
                    :date-one="form.fecha_inicio"
                    :date-two="form.fecha_fin"
                    @date-one-selected="val => { form.fecha_inicio = val }"
                    @date-two-selected="val => { form.fecha_fin = val }"
                />                
            </div>
            <div class="col-sm-1">&#128197;</div>
          </div>
          <div class="col-sm-2 form-group row">
            <button :disabled="loadingPage" class="btn btn-sm btn-success" @click="actualizarData()">
                <font-awesome-icon icon="check"></font-awesome-icon>
            </button>

            <button :disabled="loadingPage" class="btn btn-sm btn-secondary" @click="resetForm()">
                <font-awesome-icon icon="redo"></font-awesome-icon>
            </button>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-4 form-group row">
            <label class="control-label col-sm-4"><span>Area: </span></label>
            <div class="col-sm-8">
              <select class="form-control" name="area" v-model="form.area">
                <option v-for="reg in areas" :value="reg" :key="reg">{{ reg }}</option>
              </select>
            </div>
          </div>
          <div class="col-sm-4 form-group row">
            <label class="control-label col-sm-4">Estado: </label>
            <div class="col-sm-8">
              <select class="form-control" name="estado" v-model="estado">
                <option v-for="reg in estados" :value="reg.id" :key="reg.id">{{ reg.estado }}</option>
              </select>
            </div>
          </div>
          <div class="col-sm-4 form-group row">
            <label class="control-label col-sm-4">Cliente: </label>
            <div class="col-sm-8">
              <select class="form-control" name="estado" v-model="form.cliente_id">
                <option v-for="reg in clientes" :value="reg.id" :key="reg.id">{{ reg.nombre_completo.trim() }}</option>
              </select>
            </div>
          </div>
        </div>
			</div>
      <br>
      <b-overlay :show="loadingPage" opacity="0.6" spinner-variant="primary">
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <th colspan="5" >Totales x Área</th>
          </thead>
          <tbody>
            <tr v-if="cargandoResumen == false">
              <td>Cortes: {{ estadisticas.cortes !== null? estadisticas.cortes : 0 }}</td>
              <td>Prearmados: {{ estadisticas.prearmados !== null? estadisticas.prearmados : 0 }}</td>
              <td>Tapacantos: {{ estadisticas.tapacantos !== null? estadisticas.tapacantos : 0 }}</td>
              <td>Cajones: {{ estadisticas.cajones !== null? estadisticas.cajones : 0 }}</td>
              <td>Módulos: {{ estadisticas.modulos !== null? estadisticas.modulos : 0 }}</td>
            </tr>
            <tr v-if="cargandoResumen == false">
              <td colspan="5" style="text-align: right"><b>Total General: {{ (estadisticas.cortes + estadisticas.prearmados + estadisticas.tapacantos + estadisticas.cajones + estadisticas.modulos) !==null ? estadisticas.cortes + estadisticas.prearmados + estadisticas.tapacantos + estadisticas.cajones + estadisticas.modulos : 0 }}</b></td>
            </tr>  
            <tr v-if="cargandoResumen == true">
              <td colspan="5" style="text-align: center"><b>Cargando resumen...</b></td>
            </tr>
          </tbody>  
        </table> 
        <br> 
        <table class="table table-hover">
          <thead>
            <th>#</th>
            <th>Usuario</th>
            <th>Evento</th>
            <th v-if="sortNewEstado==='new_estado'" @click="setSortProps('sortNewEstado', '-new_estado')">
              Valor <span class="glyphicon glyphicon-sort-by-alphabet"></span>
            </th>
            <th v-if="sortNewEstado==='-new_estado'" @click="setSortProps('sortNewEstado', 'new_estado')">
              Valor <span class="glyphicon glyphicon-sort-by-alphabet-alt"></span>
            </th>
            <th v-if="sortOldEstado==='old_estado'" @click="setSortProps('sortOldEstado', '-old_estado')">
              Valor anterior <span class="glyphicon glyphicon-sort-by-alphabet"></span>
            </th>
            <th v-if="sortOldEstado==='-old_estado'" @click="setSortProps('sortOldEstado', 'old_estado')">
              Valor anterior <span class="glyphicon glyphicon-sort-by-alphabet-alt"></span>
            </th>
            <th>Area</th>
            <th>Cod. Area</th>
            <th>Corte</th>
            <th>Tapacanto</th>
            <th>Módulo</th>
            <th>Proyecto</th>
            <th v-if="sortCliente==='cliente'" @click="setSortProps('sortCliente', '-cliente')">
              Cliente <span class="glyphicon glyphicon-sort-by-alphabet"></span>
            </th>
            <th v-if="sortCliente==='-cliente'" @click="setSortProps('sortCliente', 'cliente')">
              Cliente <span class="glyphicon glyphicon-sort-by-alphabet-alt"></span>
            </th>
            <th>Fecha</th>
          </thead>
          <tbody>
            <template v-if="(registros.length > 0)">
              <tr v-for="(registro, i) in registros" :key="i">
                  <td>{{ i+1 }}</td>
                  <td>{{ registro.usuario }}</td>
                  <td>{{ registro.event }}</td>
                  <td>{{ registro.new_estado }}</td>
                  <td>{{ registro.old_estado }}</td>
                  <td>{{ registro.area }}</td>
                  <td>{{ registro.auditable_id }}</td>
                  <td>{{ (registro.pieza === null) ? 'N/A' : registro.pieza }}</td>
                  <td>{{ (registro.posicion_tapacanto === null) ? 'N/A' : registro.posicion_tapacanto }}</td>
                  <td>{{ (registro.modulo === null) ? 'N/A' : registro.modulo }}</td>
                  <td>{{ registro.proyecto }}</td>
                  <td>{{ registro.cliente }}</td>
                  <td>{{ registro.created_at }}</td>
              </tr>
            </template>
            <template v-if="registros.length == 0">
              <tr>
                <td class="text-center" colspan="12"><strong>No posee registro de cambios registrados</strong></td>
              </tr>
            </template>
          </tbody>
        </table>
        <div class="overflow-auto" v-if="registros.length > 0">
            <div class="mt-12">
              <b-pagination 
              v-model="pagination.current_page" pills 
              :total-rows="pagination.total" 
              :per-page="pagination.per_page"
              @change="changePage"
              align="center">
              </b-pagination>
            </div>
        </div>
      </div>
      </b-overlay>
		</div>  
	</div>
</div>

</template>

<script>
import usuarioService from '../Services/usuarioService'
import clienteService from '../Services/clienteService'
import auditoriaService from '../Services/auditoriaService'
import estadoService from '../Services/estadoService'
import { library } from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker'
import 'vue-airbnb-style-datepicker/dist/vue-airbnb-style-datepicker.min.css'
import VueToastr from "vue-toastr";
import Vue from "vue";

library.add(faCheck)
library.add(faRedo)

const UsuarioService = new usuarioService();
const ClienteService = new clienteService();
const AuditoriaService = new auditoriaService();
const EstadoService = new  estadoService();

Vue.use(AirbnbStyleDatepicker,
 {
  sundayFirst: false,
  placeHolder:'Seleccionar Rango',
  dateLabelFormat: 'dddd, MMMM D, YYYY',
  days: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
  daysShort: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  colors: {
    selected: '#00a699',
    inRange: '#66e2da',
    selectedText: '#fff',
    text: '#565a5c',
    inRangeBorder: '#33dacd',
    disabled: '#fff',
    hoveredInRange: '#67f6ee'
  },
  texts: {
    apply: 'Aplicar',
    cancel: 'Cancelar',
    keyboardShortcuts: 'Keyboard Shortcuts',
   },
})


export default {
    components:{
		FontAwesomeIcon,
    VueToastr,
    },
    data(){
        return{
            cargandoResumen: false,
            loadingPage: false,
            pagination: {
              'total': 0,
              'current_page': 0,
              'per_page': 0,
              'last_page': 0,
              'from': 0,
              'to': 0
            },
            estadisticas: {
              cortes: 0,
              prearmados: 0,
              tapacantos: 0,
              cajones: 0,
              modulos: 0,
              clientes:[]
            },
            clientes: [],
            estados: [],
            usuarios: [],            
            registros: [],
            allRegistros:  [],
            estado: 3,
            areas :[],
            form: { 
              area: 'Todas',
              corte: '',
              estado: '',
              usuario_id:-1, 
              cliente_id:0,
              fecha_inicio: this.$moment().format('YYYY-MM-DD'), 
              fecha_fin: this.$moment().format('YYYY-MM-DD')
            },
            dateRange: '',
            cantidadOk: 0,
            daterange: '',
            searchTerm: '',
            sortNewEstado: 'new_estado',
            sortOldEstado: 'old_estado',
            sortCliente: 'cliente',
            cliente:{
                id: 0,
                nombre_completo: 'Todos',
                direccion: '',
                telefono: ''
            },
            usuario:{
                id: 0,
                correo_google: '',
                nombre_completo: '',
                usuario: 'Todos',
                password: '',
                activo: 0,
                rol_id: 0,
                horario: this.Horario
            },
            usuarioTodos:{
                id: -1,
                correo_google: '',
                nombre_completo: '',
                usuario: 'Todos',
                password: '',
                activo: 0,
                rol_id: 0,
                horario: this.Horario
            },
            estadoTodos: {
              id: 0,
              estado: 'Todos'
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
        }
    },
    async mounted(){
        this.areas[0] = 'Todas'
        this.areas[1] = 'Corte'
        this.areas[2] = 'Prearmado'
        this.areas[3] = 'Tapacanto'
        this.areas[4] = 'Cajon'
        this.areas[5] = 'Modulo'
    
        //this.usuarios.push(this.usuario);
        this.usuarios.push(this.usuarioTodos);
		    this.estados.push( this.estadoTodos);
        this.clientes.push(this.cliente)
        try {
            //let data = await UsuarioService.getAll()
            let data = await UsuarioService.getActiveUsers()
            if(data){
                this.usuarios = this.usuarios.concat(data.usuarios);
            }
            let data2 = await EstadoService.getAll()
            if(data2){
                this.estados = this.estados.concat(data2.estados);
            }
            let data3 = await ClienteService.getAll()
            if(data3){
                this.clientes = this.clientes.concat(data3.clientes);
            }
        } catch (e) { 
              console.log("Error!", e)
              this.$refs.toastr.e("Error: " + e)
        } 
    },
    methods:{
        changePage: function(page) {
          this.pagination.current_page = page;
          this.reloadRegistros(page);
        },
        async actualizarData() {
          await this.reloadRegistros()
          this.reloadResumen()
        },
        async getClientes(clientes) {
          if (clientes == null || clientes =="") {
            return
          }
          let data = await ClienteService.getAuditCliente(clientes) 
          console.log('data registros clientes--->',data)
          if(data){
            this.clientes = []
            this.clientes.push(this.cliente)
            this.clientes = this.clientes.concat(data.clientes);
          }
        },
        async reloadResumen() {
            try {
              this.cargandoResumen = true
              this.$refs.toastr.i("Cargando resumen...")
              this.form.corte = this.searchTerm.trim()
              //this.form.estado = '{"estado_id":' + this.estado + '}'
              this.form.estado = '"estado_id":' + this.estado
              this.form.cliente_id = parseInt(this.form.cliente_id)
              this.form.usuario_id = parseInt(this.form.usuario_id)
              let data = await AuditoriaService.getEstadisticaByUsuarioFecha(this.form)
              if (data) {
                this.estadisticas = data.resumen
                this.$refs.toastr.s("Resumen cargado con éxito!")   
              }    
            } catch (e) {
                this.estadisticas = [] 
                this.$refs.toastr.w("El resumen ha consumido mucho tiempo. Por favor, mejorar los filtros de la consulta!")
            } 
            this.cargandoResumen = false
    	  },
        async reloadRegistros(page=1) {
            this.loadingPage = true
            try {
              this.$refs.toastr.i("Cargando datos...")
              this.form.page = page
              this.form.corte = this.searchTerm.trim()
              //this.form.estado = '{"estado_id":' + this.estado + '}'
              this.form.estado = '"estado_id":' + this.estado
              this.form.cliente_id = parseInt(this.form.cliente_id)
              this.form.usuario_id = parseInt(this.form.usuario_id)
              /*if (this.form.usuario_id == 0) {
                this.$refs.toastr.e("Debe seleccionar un usuario.")
                this.loadingPage = false;
                return
              }*/
              let data = await AuditoriaService.getByUsuarioFecha(this.form)
              if (data) {
                this.loadingPage = false
                console.log('data registros--->',data)
                this.registros = data.registros.data;
                this.pagination.total = data.registros.total
                this.pagination.current_page = data.registros.current_page
                this.pagination.per_page = data.registros.per_page
                this.pagination.last_page = data.registros.last_page
                this.pagination.from = data.registros.from
                this.pagination.to = data.registros.to
                this.getClientes(this.estadisticas.clientes)
                this.$refs.toastr.s("Datos cargados con éxito")
              }    
            } catch (e) { 
                console.log("Error cargando reporte!", e);
                this.registros = []
                this.loadingPage = false;
                this.$refs.toastr.w("La carga de los datos ha consumido mucho tiempo. Por favor, mejorar los filtros de la consulta.")
            } 
    	  },
        async resetForm() {
            this.form = { corte:'', area:'Todas', cliente_id:0, usuario_id: 0, fecha_inicio: this.$moment().format('YYYY-MM-DD'), fecha_fin: this.$moment().format('YYYY-MM-DD') }
            this.registros = []
            this.estadisticas = {
              cortes: 0,
              prearmados: 0,
              tapacantos: 0,
              cajones: 0,
              modulos: 0
            }
        },
        async calendarApplied(event) {
            this.form.fecha_inicio = event.picker.startDate.format('YYYY-MM-DD');
            this.form.fecha_fin = event.picker.endDate.format('YYYY-MM-DD');
        },
        searchRegistros() {
           this.reloadRegistros(1);
        },
    }
}
</script>

<style>
	@media only screen and (min-width: 769px) {
		.asd__wrapper {
			margin-left:-300px;
			position: sticky !important;
			left:-600px !important
			/* margin-left:-100% !important  */
		}
	}
</style>