<template>
<div class="row" style="width: 100% !important;"  role="document">
  <div role="document" style="width: 100% !important;">
    <div>
        
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">PARAMETROS OPTIMIZACION</h5>
      </div>

      <div style="width: 100% !important;" class="modal-body">
        
        <div  class="row">
          <table class="table" width="100%">
            <tr>
              <th style="text-align: center;">Material</th>
              <th style="text-align: center;">Modulos</th>
            </tr>
            <tr>
              <td>
                <select v-model="material_select" v-on:change="onChange">
                  <option value="">-Seleccionar-</option>
                  <option
                    :key="id"
                    v-for="(material, id) in materiales"
                  >{{ material }}</option>
                </select>
              </td>
              <td class="modules">
                <span
                  style="margin: 5px"
                  :key="id"
                  v-for="(modulo, id) in modulos"
                >
                  <label :for=id>{{modulo}}
                    <input type="checkbox" :id=id :value=modulo v-model="modulos_select">
                  </label>
                </span>
              </td>
            </tr>
          </table>
        </div>

        <div class="row">
          <div style="margin-left: 17%" class="col-8" v-show="material_select">
            <div style="text-align: center;">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">Opciones de Rotacion de las Piezas</h3>
                </div>
                <div class="panel-body">
                  <label class="radio-inline" title="Rotar Todas Las Piezas">
                    <input type="radio" value="todas" v-model="rotacion" name="rotacion">Todas
                  </label>&nbsp;&nbsp;&nbsp;
                  <label class="radio-inline" title="No Rotar Ninguna Pieza">
                    <input type="radio" value="ninguna" v-model="rotacion" name="rotacion">Ninguna
                  </label>&nbsp;&nbsp;&nbsp;
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <form class="form-horizontal" v-show="modulos_select.length">
          <div id="paneles_adicionales">
            <table class="table">
              <tr>
                <th>Nombre</th>
                <th>Largo[mm]</th>
                <th>Ancho[mm]</th>
                <th>Cantidad</th>
                <th>Accion</th>
              </tr>
              <tr>
                <td><input v-model="newPanel.nombre" style="width: 100%;" type="text" name="nombre" class="input-sm"></td>
                <td><input v-model="newPanel.largo" style="width: 80px;" type="text" name="largo" class="input-sm"></td>
                <td><input v-model="newPanel.ancho" style="width: 80px;" type="text" name="ancho" class="input-sm"></td>
                <td><input v-model="newPanel.cantidad" style="width: 80px;" type="number" name="cantidad" class="input-sm"></td>
                <td><button :disabled="!modulos_select.length" @click="addPanel()" title="Agregar Panel" class="btn btn-success btn-sm glyphicons glyphicons-plus-add" type="button">add</button></td>
              </tr>
              <tr
                :key="id"
                v-for="(panel, id) in data.panels"
              >
                <td>{{ panel.nombre }}</td>
                <td>{{ panel.largo }}</td>
                <td>{{ panel.ancho }}</td>
                <td>{{ panel.cantidad }}</td>
                <td><span title="Quitar Panel" class="cancel-panel" @click="removePanel(id)">❌</span></td>
              </tr>
              
            </table>
            <p style="color: tomato;" v-show="!data.panels.length">No ha Agregado NIngun Panel</p>
          </div>

          <hr>
          
          <div class="row">
            <hr>
            <table width="100%">
              <tr>
                <td width="10%">
                </td>
                <td width="40%" style="display: inline-block; margin-bottom: 5px; font-weight: 700; text-align: center;">Nombre Proyecto
                </td>  
                <td style="text-align: center;" width="50%">
                  <div class="col-12">
                    <input type="text" v-model="nombre_proyecto" class="form-control" name="nombre_proyecto" id="nombre_proyecto" >
                  </div>
                </td>
              </tr>

              <tr>
                <td width="10%">
                </td>
                <td width="40%" style="display: inline-block; margin-bottom: 5px; font-weight: 700; text-align: center;">Saw Kert
                </td>  
                <td style="text-align: center;" width="50%">
                  <div class="col-12">
                    <input type="text" v-model="saw_kert" class="form-control" name="saw_kert" id="saw_kert" >
                  </div>
                </td>
              </tr>

              <tr>
                <td width="10%">
                </td>
                <td width="40%" style="display: inline-block; margin-bottom: 5px; font-weight: 700; text-align: center;">Trim
                </td>  
                <td style="text-align: center;" width="50%">
                  <div class="col-12">
                    <input type="text" v-model="trim" class="form-control" name="trim" id="trim" >
                  </div>
                </td>
              </tr>

              <tr>
                <td width="10%">
                </td>
                <td width="40%" style="display: inline-block; margin-bottom: 5px; font-weight: 700; text-align: center;">Cut Level
                </td>  
                <td style="text-align: center;" width="50%">
                  <div class="col-12">
                    <select id="cut_level" class="form-control" name="cut_level" v-model="cut_level" v-on:change="onChangeCut">
                      <option value="0">-Seleccione-</option>
                      <option
                        :key="id"
                        v-for="(level, id) in array_levels_cut"
                        :value="id"
                      >{{level}}</option>
                    </select>
                  </div>
                </td>
              </tr>
            </table>

          </div>

        </form>
      </div>


      <div class="text-center">
        <p v-if="inProgress"><b>Optimizando. Por favor espere unos segundos...</b></p>
        <div v-if="optimizado">
          <button type="button" @click="download_pdf(false)" class="btn btn-primary glyphicon glyphicon-eye-open">Ver Optimizacion
          </button>
          <button type="button" @click="download_pdf(true)" class="glyphicon glyphicon-download-alt
btn btn-primary">Descargar PDF
          </button>
        </div>
      </div>

      <div class="modal-footer">
        <button :disabled="!data.panels.length" type="button" @click="enviarOpimizacion()" class="btn btn-primary">Optimizar</button>
      </div>

    </div>
  </div>
</div>  

</template>

<script>
import uniq from 'lodash/uniq'
import { HTTP } from '@/plugins/HTTP.js'

export default {
  data () {
    return {
      materiales: [],
      modulos: [],
      modulos_select: [],
      array_levels_cut: {
        2: 'XY-Cut (Level 2)',
        3: 'Two-Stage XY (Level 3)',
        4: 'XYZ-cut (Level 4)',
        5: 'XYZW-cut (Level 5)',
        6: 'Standard-cut (Level 6)'
      },
      array_info_levels_cut: {
        2: 'XY-Cut (Level 2): La forma más simple de cortar paneles, pero la peor utilización del material.',
        3: 'Two-Stage XY (Level 3): La versión mejorada del corte XY',
        4: 'XYZ-cut (Level 4): Un nivel más de corte en dirección horizontal',
        5: 'XYZW-cut (Level 5): Mejor utilización del material',
        6: 'Standard-cut (Level 6): Produce la mayor tasa de utilización del material y la menor cantidad de residuos'
      },
      newPanel: {
        nombre: '',
        largo: '',
        ancho: '',
        cantidad: 0
      },
      data: {
        panels: [],
        parts: [],
        infoProject: []
      },
      material_select: '',
      nombre_proyecto: '',
      saw_kert: '4',
      trim: '7',
      cut_level: '0',
      rotacion: '',
      inProgress: false,
      optimizado: false
    }
  },
  created () {
    this.data.panels = JSON.parse(localStorage.getItem('panels')) || []
    this.nombre_proyecto = this.$store.state.info.name + ' ' + this.$store.state.info.mueble
    this.getOptimization()
  },
  mounted: function () {
    this.materiales = JSON.parse(this.$store.state.general.materiales_add).map(m => m.material)
  },
  methods: {
    enviarOpimizacion () {
      let self = this
      this.data.infoProject = []
      this.data.infoProject = {
        projectName: this.nombre_proyecto,
        sawKerf: this.saw_kert,
        trim: this.trim,
        cut_level: this.cut_level
      }
      this.filtrarParts()
      this.inProgress = true
      HTTP.post('/api/optimizacion', {
        data: this.data
      }).then(result => {
        this.$noty.success('¡La Optimizacion se realizo correctamente!')
        self.inProgress = false
        self.optimizado = true
      }).catch(result => {
        this.$noty.error('¡Error al guardar los datos: ' + result.response.data.vue)
        let errors = result.response.data
        if (errors.hasOwnProperty('parts') || errors.hasOwnProperty('infog')) {
          for (let key in errors) {
            this.$noty.error(errors[key])
          }
        }
        console.log('error:', result.response.data)
        this.inProgress = false
      })
    },
    getOptimization () {
      let self = this
      HTTP.get('/api/' + this.nombre_proyecto + '/optimizacion').then(function (result) {
        self.optimizado = result.data.optimizado
      })
    },
    download_pdf (download) {
      HTTP({
        method: 'get',
        url: '/api/' + this.nombre_proyecto + '/download_pdf',
        responseType: 'arraybuffer'

      }).then(function (response) {
        let blob = new Blob([response.data], { type: 'application/pdf' })
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        if (download) {
          link.setAttribute('download', 'file.pdf')
        } else {
          link.setAttribute('target', '_blank')
        }
        // link.setAttribute('download', 'file.pdf')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blob)
      })
    },
    onChange: function () {
      console.log(this.material_select)
      this.modulos = []
      this.$store.getters.getPartList.forEach(p => {
        if (p.Material === this.material_select) {
          this.modulos.push({ modulo: p.Module })
        }
      })
      this.modulos = uniq(this.modulos.map(p => p.modulo))
      this.newPanel.nombre = this.material_select
    },
    onChangeCut: function () {
      this.$noty.info(this.array_info_levels_cut[this.cut_level])
    },
    addPanel () {
      if (!this.newPanel.nombre || !this.newPanel.largo || !this.newPanel.ancho || !this.newPanel.cantidad) {
        this.$noty.error('Completa la informacion del panel')
      } else {
        this.data.panels.push({
          nombre: this.newPanel.nombre,
          largo: this.newPanel.largo,
          ancho: this.newPanel.ancho,
          cantidad: this.newPanel.cantidad
        })

        localStorage.setItem('panels', JSON.stringify(this.data.panels))

        this.newPanel.nombre = this.material_select
        this.newPanel.largo = ''
        this.newPanel.ancho = ''
        this.newPanel.cantidad = 0
      }
    },
    removePanel (index) {
      this.data.panels.splice(index, 1)
      localStorage.setItem('panels', JSON.stringify(this.data.panels))
    },
    filtrarParts () {
      this.data.parts = []
      this.$store.getters.getPartList.map(item => {
        if (item.Material === this.material_select && this.modulos_select.some(x => x === item.Module)) {
          this.data.parts.push({
            estado: 'Yes',
            nombre: item.Name,
            lveta: item.LVeta,
            aveta: item.AVeta,
            cantidad: item.Count,
            rotable: this.rotacion === 'todas' ? 'YES' : 'NO'
          })
        }
      })
    }
  },
  computed: {
  }
}
</script>

<style>
  .swal-modal {
    width: 60% !important;
  }
  .panel {
    margin-bottom: 20px;
    background-color: #fff;
    border: 1px solid transparent;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05);
    box-shadow: 0 1px 1px rgba(0,0,0,.05);
  }
  .panel-default {
    border-color: #ddd;
  }
  .panel-default>.panel-heading {
    color: #333;
    background-color: #f5f5f5;
    border-color: #ddd;
  }
  .panel-heading {
    padding: 10px 15px;
    border-bottom: 1px solid transparent;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }

  .panel-body {
    padding: 15px;
  }

  label {
    display: inline-block;
    max-width: 100%;
    margin-bottom: 5px;
    font-weight: 700;
  }

  .form-horizontal .form-group {
    margin-right: -15px;
    margin-left: -15px;
  }
  
  .form-horizontal .control-label {
    padding-top: 7px;
    margin-bottom: 0;
    text-align: right !important;
  }

  .form-group {
      margin-bottom: 15px !important;
  }

  .form-control {
    width: 100%;
    height: 34px;
    padding: 6px 12px;
    margin: 5px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .cancel-panel {
     cursor: pointer;
  }
  
</style>
  