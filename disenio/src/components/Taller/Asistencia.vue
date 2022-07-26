<template>
  <div id="app-asistencia" class="page-contents">
    <div class="row">
      <notification></notification>
      <div class="col-sm-6">
        <div class="col-sm-12 text-center">
          <h4>Registro de asistencia</h4>
          <hr>
        </div>

        <div id="form-asistencia" class="col-sm-12">

          <div v-if="messageAlert.length > 0">
            <!-- <div v-if="message in messageAlert" :class="alert alert - {{ message.type }}"> -->
            <div v-if="message in messageAlert">
              <button v-if="!message.keep" type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              {{ message.msg }}
            </div>
          </div>

          <form action="post" class="form-horizontal">
            <div class="form-group row">
              <label for="type" class="control-label col-sm-3">Tipo</label>
              <div class="col-sm-9">
                <select id="type" class="form-control" name="type" v-model="formData.type">
                    <option v-for="type of types" :value="type.id" :key="type.id">{{ type.tipo }}</option>
                </select>
              </div>
            </div>

            <!-- <div v-if="late && (formData.type == 2)">
              <hr>
              <div class="form-group row">
                <label for="cause" class="control-label col-sm-3">Causa</label>
                <div class="col-sm-9">
                  <select id="cause" class="form-control" name="cause" v-model="formData.cause">
                    <option v-for="cause of causes" :key="cause.id">{{ cause.causa }}</option>
                  </select>
                </div>
              </div>
            </div> -->

            <!-- <div v-if="(late && (formData.type == 2)) || formData.type == 6"> -->
            <div>
              <hr>
              <div class="form-group row">
                <label for="observation" class="control-label col-sm-3">Observación</label>
                <div class="col-sm-9">
                  <textarea id="observation" class="form-control" name="observation" cols="30" rows="5" v-model="formData.observation"></textarea>
                </div>
              </div>
            </div>

            <div v-if="formData.type == 3 || formData.type == 4 || formData.type == 5">
              <hr>
              <div class="form-group row">
                <label for="tipo_salida" class="control-label col-sm-3">Tipo salida</label>
                <div class="col-sm-9">
                  <select id="cause" class="form-control" name="tipo_salida" v-model="formData.tipo_salida">
                    <option v-for="salida of tipos_salidas" :value="salida.id" :key="salida.id">{{ salida.tipo }}</option>
                  </select>
                </div>
              </div>

              <div class="form-group row">
                <label for="cliente" class="control-label col-sm-3">Cliente</label>
                <div class="col-sm-9">
                <select id="cliente" class="form-control" name="cliente" v-model="formData.cliente">
                  <option v-for="cliente of clientes" :value="cliente.nombre_completo" :key="cliente.id">{{ cliente.nombre_completo }}</option>
                </select>
                </div>
              </div>
            </div>

            <div class="form-group text-center">
              <button type="button" class="btn btn-success" @click="store()" :disabled="sendingButton">Enviar</button>
            </div>
          </form>
        </div> 
      </div>

      <div class="col-sm-6">
        <div class="row">
          <div class="col-sm-12 text-center">
            <h4>Listado de asistencia</h4>
            <hr>
          </div>

          <div class="table-responsive">
            <b-overlay :show="loadingListaAsistencia" opacity="0.6" spinner-variant="primary">

            <table class="table">
              <thead class="">
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <!-- <th>Causa/Salida</th> -->
                  <th>Observación</th>
                </tr>
              </thead>
              <tbody v-if="checks.length > 0">
                
                  <tr v-for="(check, i) in checks" :key="check.i">
                    <td data-title="#">{{ i+1 }}</td>
                    <td data-title="Fecha">{{ check.fecha }}</td>
                    <td data-title="Tipo">{{ check.tipo_asistencia.tipo  }}</td>
                    <!-- <td data-title="Causa/Salida">{{ (check.tipo_asistencia_id == 3 || check.tipo_asistencia_id == 4 || check.tipo_asistencia_id == 5)
                      ? (check.tipo_salida.tipo)
                      : (check.check_causa) ? check.check_causa.causa : 'N/A' }}</td> -->
                    <td data-title="observación">{{ (check.observacion) ? check.observacion : 'N/A' }}</td>
                  </tr>

              </tbody>
              <div v-if="emptyTodayAsistencias">
                <tr>
                  <td class="text-center" colspan="5"><strong>No posee ningún registro para el día de hoy</strong></td>
                </tr>
              </div> 
            </table>

            </b-overlay>
          </div>
        </div>
      </div> 

      <div v-if="showTable" id="table-asistencia" class="col-sm-12"></div>

      <div id="modal-observation" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title">Motivo</h4>
            </div>
            <div class="modal-body">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
              <button type="button" class="btn btn-primary">Guardar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import  AsistenciaService  from '../../../'
//  './../services/asistencia.service';
import { HTTP } from '../../index'

export default {
  data () {
    return{
      types: [],
      formData:{},
      late: true,
      causes: [],
      tipos_salidas: [],
      clientes: [],
      sendingButton: false,
      checks: [],
      usuario: null,
      emptyTodayAsistencias: null,
      messageAlert: [],
      checkedTime: false,
      showTable: false,
      loadingListaAsistencia: true,
    }
  },
  async mounted(){
    console.log(localStorage.getItem('usuario'))
    this.usuario = JSON.parse(localStorage.getItem('usuario'))
    console.log('USUARIO--->', this.usuario)
		this.formData = {
			type: 1,
			observation: '',
			cause: 0,
			cliente: '0',
			tipo_salida: 0
		};    
    this.getCauses();
    this.getTiposAsistencias();
    this.getTiposSalidas();
    //this.getAll();
    this.checkTime();
		this.checksToday();
  },
  methods:{
    checksToday() {
      this.loadingListaAsistencia = true;

      let usuario = this.usuario
      HTTP.post('/api/asistencia/checks-today', usuario, 
        ).then(result => {
          if (result.data) {
            if ((result.data.checks) && (result.data.checks !== undefined)) {
                this.checks = result.data.checks
            }
          }
          else {
            console.log('no')
          }
          this.sendingButton = false;
            this.loadingListaAsistencia = false;
          }).catch(result => {
            console.log(result)
            this.loadingListaAsistencia = false;
        })

    },
    checkTime() {
      console.log('entrando a checktime')
      console.log(this.usuario.usuario)
      let reqData = {
        'usuario': this.usuario.usuario
      };

      HTTP.post('/api/asistencia/check-time', reqData
        ).then(result => {
          if (result.data) {
            let data = result.data
            this.checkedTime = true;
            this.late = data.late;
            this.formData.type = data.type;

            if (this.late && (this.formData.type == 2)) {
              let message = {
                type: 'warning',
                msg: '¡El tiempo para marcar la salida es antes del horario vigente! Deberá justificarlo', // '¡Ha pasado el tiempo de entrada del horario vigente! Deberá justicarlo'
                keep: true
              };

              for (let i = 0; i < this.messageAlert.length; i++)
                if (this.messageAlert[i].keep === true) {
                  this.messageAlert[i].type = message.type;
                  this.messageAlert[i].msg = message.msg;
                  return;
                }

              this.messageAlert.push(message);
              console.log(this.checks);
            }
          }
          else {
            console.log('no')
          }
          this.sendingButton = false;
          }).catch(result => {
            console.log(result)
        })
    },
    store() {
      let reqData = {
        usuario: this.usuario.usuario,
        type: this.formData.type,
        cause: this.formData.cause,
        observation: this.formData.observation,
        tipo_salida: ''
      };

      console.log(reqData);
      // if ((this.formData.type == 2) && this.late) {
      if ((this.formData.type >1 ) && this.late) {
        // if (this.formData.type == 2 && (this.formData.cause.length === 0 || this.formData.observation.length === 0)) {
        //   let message = {
        //     type: 'danger',
        //     msg: '¡Causa y Observación son obligatorios!',
        //     keep: false
        //   };
        //   this.messageAlert.push(message);
        //   return;
        // }
        if (this.formData.type != 2 && this.formData.observation.length === 0) {
          let message = {
            type: 'danger',
            msg: 'Observación es obligatoria!',
            keep: false
          };
          this.messageAlert.push(message);
          return;
        }
      }

      if (reqData.type == 3 || reqData.type == 4 || reqData.type == 5) {
        reqData.tipo_salida = this.formData.tipo_salida;
        reqData.observation = 'Cliente: ' + this.formData.cliente;
      }
      this.sendingButton = true;
		  // return this.http.post(`${this.server}/asistencia/store`, data, { headers: this.headers })
			// .pipe(map((res: HttpResponse<any>) => res));
    	//}
    ///////
      HTTP.post('/api/asistencia/store', reqData
      ).then(result => {
        if (result.data) {
          let message = {
            type: 'success',
            msg: '¡Hora de entrada agregada con éxito!',
            keep: false
          };
          //this.successSwal.show();
          this.$swal({
            title:"¡Enhorabuena!",
            text:"¡Hora de entrada agregada con éxito!",
            type:"success"
          })
          this.checkTime();
          this.checksToday();

          let goToTask = this.activatedRoute.snapshot.queryParams["goToTask"];
          if (goToTask) {
            this.router.navigate(['/tareas']);
          }
        }
        else {
          console.log('no')
        }
        this.sendingButton = false;
      }).catch(result => {
        if ((result.response) &&  (result.response.data)) {
          if(result.response.status==422 && result.response.data.message)
              this.$swal({
                title:"Error!",
                text:"Ya existe ese tipo de asistencia registrada hoy",
                type:"error"
              })
        }    
        this.sendingButton = false;
      })
    },
    getAll(){
        HTTP.get('/api/clientes'      
        ).then(result => {
          if (result.data) {
            if ((result.data.clientes) && (result.data.clientes !== undefined)) {
              this.clientes = result.data.clientes
              console.log('Correcto!', result.data)
            }
          }
          else {
            console.log('no')
          }
          }).catch(result => {
            console.log(result)
        })
    },
    getTiposSalidas(){
        HTTP.get('/api/asistencia/tipo-salida'      
        ).then(result => {
          if (result.data) {
            if ((result.data.tipos_salidas) && (result.data.tipos_salidas !== undefined)) {
                this.tipos_salidas = result.data.tipos_salidas
                console.log('Correcto!', result.data)
            }
          }
          else {
            console.log('no')
          }
          }).catch(result => {
            console.log(result)
        })
    },
	  getCauses() {
      this.causes.push({ id: 0, causa: 'Seleccione una causa' });
        HTTP.get('/api/asistencia/causes'      
        ).then(result => {
          if (result.data) {         
            if ((result.data.causes) && (result.data.causes !== undefined)) {
                this.causes = result.data.causes
                console.log('Correcto!', result.data)
            }
          }
          else {
            console.log('no')
          }
          }).catch(result => {
            console.log(result)
        })
	  },
    getTiposAsistencias() {
      console.log('inicio gettipoasistencias')
      HTTP.get('/api/asistencia/tipo-asistencia'      
      ).then(result => {
        if (result.data) {          
          if ((result.data.tipos_asistencias) && (result.data.tipos_asistencias !== undefined)) {
              this.types = result.data.tipos_asistencias
              console.log('Correcto!', result.data)
          }
        }
        else {
          console.log('no')
        }
        }).catch(result => {
          console.log(result)
      })
    },
  }
}
</script>

<style>
  #app-asistencia {
    margin-top: 30px;
  }


/*

      this.$swal({
        content: this.$refs.configOptions,
        buttons: {
          cancelar: {
            text: 'Cancelar',
            value: 0
          },
          save: {
            text: 'Guardar',
            value: 1
          }
        }
      }).then((result) => {
        const name = document.getElementsByClassName('config-name')[1].value
        if (result === 1 && name) {
          const config = {
            name,
            type: 'Cajon',
            values: [
              { name: 'frenteEncastre', value: this.frenteEncastre },
              { name: 'profundidad', value: this.profundidad },
              { name: 'corredera', value: this.corredera },
              { name: 'frenteMaterial', value: this.frenteMaterial },
              { name: 'material', value: this.material },
              { name: 'fondoMaterial', value: this.fondoMaterial },
              { name: 'fondoEncastre', value: this.fondoEncastre },
              { name: 'aperturaSistema', value: this.aperturaSistema },
              { name: 'aperturaUbicacion', value: this.aperturaUbicacion },
              { name: 'luz', value: this.luz },
              { name: 'extraAlto', value: this.extraAlto },
              { name: 'extraAbajo', value: this.extraAbajo },
              { name: 'extraDerecha', value: this.extraDerecha },
              { name: 'extraIzquierda', value: this.extraIzquierda },
              { name: 'extraAltoLatYCF', value: this.extraAltoLatYCF },
              { name: 'sentidoVeta', value: this.sentidoVeta }
            ]
          }

          if (document.getElementsByClassName('tapacantos-check')[1].checked) {
            config.values.push({ name: 'tapacantos', value: { izquierdo: this.selectedElement.izquierdo, derecho: this.selectedElement.derecho, superior: this.selectedElement.superior, inferior: this.selectedElement.inferior } })
          }

          HTTP.post('/api/configuracion', config).then(result => {
            if (result.data.success) {
              this.$noty.success('¡Datos guardados correctamente!')
            }
          }).catch(result => {
            this.$noty.error('¡Error al guardar los datos!')
          })
        }
        document.getElementsByClassName('config-name')[1].value = ''
        document.getElementsByClassName('tapacantos-check')[1].checked = true
        this.$refs.configOptions.style.display = 'none'
      })


 */


/* import { environment } from '../'
//'./../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AsistenciaService {
	private server = environment.API_URL;
	private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
	constructor(private http: HttpClient) { }


	public store(data) {
		return this.http.post(`${this.server}/asistencia/store`, data, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>) => res));
	}

	public checkToday(usuario) {
		return this.http.post(`${this.server}/asistencia/checks-today`, { usuario }, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>) => res));
	}

	public getCauses() {
		return this.http.get(`${this.server}/asistencia/causes`)
			.pipe(map((res: HttpResponse<any>) => res));
	}

	public checkTime(data) {
		return this.http.post(`${this.server}/asistencia/check-time`, data, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>) => res));
	}

	public getAll() {
		return this.http.get(`${this.server}/asistencia`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public getByUsuarioId(usuario_id) {
		return this.http.get(`${this.server}/asistencia/usuario_id/${usuario_id}`, { headers: this.headers }).pipe(map((res: HttpResponse<any>) => res));
	}

	public getByUsuarioFecha(usuario_id: number, fecha_inicio: string, fecha_fin: string) {
		return this.http.post(`${this.server}/asistencia/usuario-fecha`, { usuario_id, fecha_inicio, fecha_fin }, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>) => res));
	}

	public getTiposAsistencias() {
		return this.http.get(`${this.server}/asistencia/tipo-asistencia`, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>) => res));
	}

	public getTiposSalidas() {
		return this.http.get(`${this.server}/asistencia/tipo-salida`, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>) => res));
	}

	public pdf(data) {
		return this.http.post(`${this.server}/asistencia/pdf`, { data }, { headers: this.headers })
			.pipe(map((res: HttpResponse<any>) => res));
	}
} */


</style>