<template>
<div>

  <div style="display:none" ref="configOptions" class="save-module-modal">
    <div>
      <h3>Preguntas</h3>
      <br/>
      <form style="text-align:left">
        <div class="form-group">
          <div v-for="(p, i) in preguntas" :key="i">
            <label for="module-config-name">{{p.pregunta}}</label>
            <input v-model="p.respuesta" @keyup="updatePreguntas" type="text" class="form-control modulo-save-name" id="module-config-name">
          </div>
        </div>
      </form>
    </div>
  </div>

  <div style="display:none" ref="cometarioCorreciones" class="save-module-modal">
    <div>
      <h3>Detalles a corregir</h3>
      <br/>
      <form style="text-align:left">
        <div class="form-group">
          <textarea v-model="comentario" name="comentario" id="comentarioCorregir" cols="55" rows="10" placeholder="Detalla lo que se debe corregir"></textarea>
        </div>
      </form>
    </div>
  </div>


  <h1 class="no-print">Exportar Lista de Piezas</h1>

  <div class="row no-print">
    <div class="col-md-12 text-left">
      <!--<button @click="generateList()">Cargar Lista desde Diseño</button>-->
      <button :disabled="getPermitirExport" v-if="getStatusExportar == 'Sin estado'" @click="exportTaller()">Solicitar exportacion</button>
      <button :disabled="getPermitirExport" v-else-if="getStatusExportar == 'Peticion'" @click="confirmarRevicion()">Confirmar revicion</button>
      <button :disabled="getPermitirExport" v-else-if="getStatusExportar == 'Revisado'" @click="confirmarExportar()">Exportar a taller</button>
      <button :disabled="getPermitirExport" v-else-if="getStatusExportar == 'Corregir'" @click="confirmarCorrecciones()">Confirmar correcciones</button>
      <button :disabled="getPermitirExport" v-if="getStatusExportar == 'Peticion'" @click="corregir()">Solicitar corregir</button>
       <button id="sow_modal" @click="showModal" type="button" class="btn btn-primary">Optimizar</button>
    </div>
  </div>

  <table class="table export-table table-bordered no-print">
    <thead>
      <th class="text-center">Cantidad</th> <!-- B -->
      <th class="text-center">Nombre</th> <!-- C -->
      <th class="text-center">Modulo</th> <!-- E -->
      <th class="text-center">Espesor</th> <!-- G -->

      <th class="text-center">T/C Izq</th> <!-- S -->
      <th class="text-center">T/C Der</th> <!-- T -->
      <th class="text-center">T/C Sup</th> <!-- AH -->
      <th class="text-center">T/C Inf</th> <!-- AI -->

      <th class="text-center">L Veta</th> <!-- Y -->
      <th class="text-center">A Veta</th> <!-- AB -->

      <th class="text-center">Material</th> <!-- AQ -->
      <th class="text-center">Orientacion</th> <!-- CE -->

      <th class="text-center">X</th> <!-- CG -->
      <th class="text-center">Y</th> <!-- CH -->
      <th class="text-center">Z</th> <!-- CI -->
    </thead>
    <tbody>
      <tr v-for="part in partList" :key="part.name" v-if="!part.Only3d">
        <td>{{ part.Count }}</td>
        <td>{{ part.Name }}</td>
        <td>{{ part.Module }}</td>
        <td>{{ part.Espesor }}</td>

        <td>{{ part.tapacantos.izquierdo && part.tapacantos.izquierdo.nombre || part.tapacantos.izquierdo }}</td>
        <td>{{ part.tapacantos.derecho && part.tapacantos.derecho.nombre || part.tapacantos.derecho }}</td>
        <td>{{ part.tapacantos.superior && part.tapacantos.superior.nombre || part.tapacantos.superior }}</td>
        <td>{{ part.tapacantos.inferior && part.tapacantos.inferior.nombre || part.tapacantos.inferior }}</td>

        <td v-if="part.girarVeta">{{part.DisplayAVeta || part.AVeta}}</td>
        <td v-if="!part.girarVeta">{{part.DisplayLVeta || part.LVeta}}</td>

        <td v-if="part.girarVeta">{{part.DisplayLVeta || part.LVeta}}</td>
        <td v-if="!part.girarVeta">{{part.DisplayAVeta || part.AVeta}}</td>

        <td>{{ part.Material }}</td>
        <td><input class="form-input" v-model="part.Orientacion"></td>

        <td><input class="form-input" v-model="part.X"></td>
        <td><input class="form-input" v-model="part.Y"></td>
        <td><input class="form-input" v-model="part.Z"></td>
      </tr>
    </tbody>
  </table>

  <div class="no-print">
    <button @click="printPdf">Exportar Calcos a PDF</button>
  </div>

  <div ref="calcos" class="calco-list">
    <calco-container :data-id="part.id" :data-name="part.name" :data-module-index="part.moduleId" class="calco" v-for="part in elementList" :key="part.id" :id="part" v-if="showCalco(part)"></calco-container>
  </div>

</div>
</template>

<script>
import 'vuejs-noty/dist/vuejs-noty.css'
import Vue from 'vue'
import VueNoty from 'vuejs-noty'
import VueSwal from 'vue-swal'
import $ from 'jquery'

import { HTTP } from '@/plugins/HTTP.js'
import ModalOptimize from './ModalOptimize.vue'
import { Part } from '../../Tools/models/models'


Vue.use(VueNoty, {
  theme: 'metroui'
})

Vue.use(VueSwal)

export default {
  data () {
    return {
      comentario:"",
      countPreguntas:0,
      preguntas:[],
      preguntas_ventas:[],
      currentPart: new Part(),
      isTrue: true,
      isFalse: false,
      ready: true,
      errorsIn3d: false
    }
  },
  mounted: function () {
    this.currentPart = new Part()
    this.currentPart.Espesor = this.moduleSettings.EspesorGeneral
    this.currentPart.X = 0
    this.currentPart.Y = 0
    this.currentPart.Z = 0
    this.$store.dispatch("getListExportar");
    this.getPreguntas();
  },
  computed: {
    loadedProjectName: {
      get() {
        return localStorage.getItem("projectName") || undefined;
      },
      set(value) {
        localStorage.setItem("projectName", value);
      },
    },
    loadedProjectId: {
      get() {
        return localStorage.getItem("projectID") || undefined;
      },
      set(value) {
        localStorage.setItem("projectID", value);
      },
    },
    getStatusExportar(){
      return this.$store.getters.getStatusExportar;
    },
    getPermitirExport(){
      return this.$store.getters.getPermitirExport;
    },
    separators () {
      return this.$store.state.layout.elements.filter(element => element.separator).map(element => {
        return {
          id: element.id,
          x: this.$store.getters.getX(element.id),
          y: this.$store.getters.getY(element.id),
          size: element.size
        }
      })
    },
    partList () {
      const parts = JSON.parse(JSON.stringify(this.$store.getters.getPartList))
      return parts
    },
    roomEditorPartList () {
      return JSON.parse(JSON.stringify(this.$store.getters.getRoomEditorPartList))
    },
    modulesList () {
      return JSON.parse(JSON.stringify(this.$store.getters.getModulesList))
    },
    elementList () {
      return this.$store.getters.getFilteredElementList
    },
    customParts () {
      return this.$store.getters.getCustomParts
    },
    moduleSettings () {
      return this.$store.getters.selectedModule.settings
    }
  },
  methods: {
    confirmarCorrecciones(){

      this.$store.dispatch("getListExportar").then(a=>{
        if(this.getPermitirExport){
          this.$noty.error(`No se puede confirmar corrección`);
          return true;
        }

        if(this.getStatusExportar !== 'Corregir'){
          this.$noty.error(`No se puede confirmar corrección la solicitud cambio de estatus a (${this.getStatusExportar})`);
          return true;
        }
        this.exportTaller();
      });


    },
    confirmarRevicion(){
      this.$store.dispatch("getListExportar").then(a=>{
        if(this.getPermitirExport){
          this.$noty.error("No se puede confirmar revicion");
          return true;
        }

        if(this.getStatusExportar !== 'Peticion'){
          this.$noty.error(`No se puede confirmar revicion la solicitud cambio de estatus a (${this.getStatusExportar})`);
          return true;
        }

        this.$swal('Si confirmas la revicion cualquier otro usuario podrar exportar este proyecto a taller', {
          title: 'Estas seguro de confirmar revicion?',
          icon: 'warning',
          buttons: {
            cancel: 'Cancelar',
            aceptar: {
              text: 'Confirmar',
              value: 'aceptar'
            }
          }
        }).then((value) => {
          switch (value) {
            case 'aceptar':

              const projectInfo = JSON.parse(JSON.stringify(this.$store.state.info))
              const exportableParts = this.partList.filter(part => !part.Only3d)
              exportableParts.map((part) => {
                part.AVeta = part.DisplayAVeta || part.AVeta
                part.LVeta = part.DisplayLVeta || part.LVeta
              })
              projectInfo.fechaInstalacion = this.getFormattedDate(projectInfo.fechaInstalacion)
              projectInfo.horaInstalacion = this.getFormattedTime(projectInfo.horaInstalacion)
              projectInfo.total = '' + projectInfo.total
              projectInfo.senia = '0'

              HTTP.post(`/api/exportar/set-cofirmar-revicion`, {
                token_project: projectInfo.token_project,
                info: projectInfo,
                parts: exportableParts,
                modules: this.modulesList,
                preguntas: this.preguntas,
                preguntas_ventas: this.preguntas_ventas,
                usuario: localStorage.getItem('user-id'),
              }).then(result => {
                this.$noty.info("Confirmando...");

                const savingProjectName = `${this.$store.state.info.name} ${this.$store.state.info.mueble} REVISADO`;
                const projectName = savingProjectName;

                HTTP.put(`/api/proyecto-json`, {
                  id: this.loadedProjectId,
                  proyectojson_id: this.loadedProjectId,
                  actual_token_project: this.$store.state.info.token_project,
                  token_project: this.$store.state.info.token_project,
                  nombre: projectName,
                  mueble:  this.$store.state.info.mueble,
                  client_name: this.$store.state.info.name,
                  address: this.$store.state.info.address,
                  phone: this.$store.state.info.phone,
                  comentario: this.$store.state.info.comentarioInstalacion,
                  encargado_med: this.$store.state.info.encargadoMed,
                  encargado_inst: this.$store.state.info.encargadoInst,
                  estado: this.$store.state.info.estadoProyecto,
                  proyecto: JSON.stringify(localStorage.vuex),
                  settings: this.$store.state.projectSettings,
                })
                  .then((result) => {
                    console.log(result)
                    if (result.data.hasOwnProperty("id")) {
                      this.$noty.success("¡Confirmado!");
                      this.$noty.success("¡Proyecto guardado con éxito!");

                      this.$noty.info("Cargando datos. Por favor, espere ...", {
                          timeout: 3000,
                      });

                      const oldVuew = localStorage.vuex;
                      localStorage.vuex = {};
                      HTTP.get(`/api/proyecto-json/${result.data.id}`)
                      .then((response) => {
                          if (response.data.proyecto) {
                              this.setErrorsIn3d(undefined);
                              localStorage.vuex = JSON.parse(response.data.proyecto.proyecto);
                              this.loadedProjectName = response.data.proyecto.nombre;
                              this.loadedProjectId = response.data.proyecto.id;
                              localStorage.setItem("projectName", response.data.proyecto.nombre);
                              localStorage.setItem("projectID", response.data.proyecto.id);
                              localStorage.setItem("projectloaded", true);
                              localStorage.setItem(
                              "projectCreatedAt",
                              response.data.proyecto.created_at
                              );
                              if (true) {
                              window.localStorage.setItem("default_template_loaded", true);
                              }
                              location.reload();
                          }
                      })
                      .catch((response) => {
                          alert(response + "proyectoLoad")
                          this.$noty.error("No se pudo cargar el proyecto");
                          localStorage.vuew = oldVuew;
                      });

                    }
                  })
                  .catch((result) => {
                    alert(result)
                    this.$noty.error("Ups, ha ocurrido un problema");
                  });

              });

            break;
          }
        });
      });


    },
    updatePreguntas(a){
      // console.log(a, this.preguntas);
      this.$store.commit("setPreguntasExportarAll", this.preguntas);
    },
    getPreguntas(){
      this.$store.dispatch('getPreguntasExportar').then((a) => {
        this.preguntas = a;
      });

      this.$store.dispatch('getPreguntasVender').then((b) => {
        this.preguntas_ventas = b;
      });

    },
    setErrorsIn3d (errors) {
      this.$store.commit('setErrorsIn3d', errors)
    },
    getFormattedDate (d) {
      const date = new Date(d)
      let day = date.getDate()
      day = day < 10 ? '0' + day : day
      let month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      return `${day}/${month}/${date.getFullYear()}`
    },
    getFormattedTime (t) {
      const date = new Date(t)
      let minutes = date.getMinutes()
      minutes = minutes < 10 ? '0' + minutes : minutes
      let hours = date.getHours()
      hours = hours < 10 ? '0' + hours : hours
      return `${hours}:${minutes}`
    },
    showCalco (part) {
      return !this.$store.state.layout.ambienteEnabled && !part.only3d
    },
    deleteCustom (index) {
      this.$store.commit('deleteCustomPart', index)
    },
    addCustom () {
      this.$store.commit('addCustomPart', this.currentPart)
    },
    showModal () {
      let Md = Vue.extend(ModalOptimize)
      let ElementMounted = new Md({store: this.$store, parent: this.$parent}).$mount().$el
      this.$swal({
        content: ElementMounted,
        buttons: false
      })
    },
    createProjectMetadata () {
      return this.$store.getters.createProjectMetadata()
    },
    createCalcosMetadata () {
      let piezas = []
      let calcosHTML = document.getElementsByClassName('calco')
      let calcosHTMLLength = calcosHTML.length

      for (let i = 0; i < calcosHTMLLength; i++) {
        const piece = calcosHTML[i]
        const calcosParts = piece.childNodes
        let pieza = {
          name: piece.getAttribute('data-name'),
          id: piece.getAttribute('data-id'),
          moduleIndex: piece.getAttribute('data-module-index'),
          calcos: []
        }

        // HOTFIX para piezas divididas
        if ($(piece).children().hasClass('division')) {
          // piezas divididas se manejan diferente...
          const children = $(piece).children()
          let calcosPartsLengthDiv2 = calcosParts.length / 2

          for (let j = 0; j < calcosPartsLengthDiv2; j++) {
            pieza.calcos.push(($(calcosParts[j].outerHTML).find('.table').removeClass('table'))[0].outerHTML)
          }
          pieza.name += ' Division 1'
          pieza.id = $(children[0]).attr('data-id') // el id no es mas el id original de la pieza, sino que se genera un id nuevo para cada division
          piezas.push(pieza)

          let piezaDividida = {
            name: piece.getAttribute('data-name') + ' Division 2',
            id: $(children[children.length - 1]).attr('data-id'),
            moduleIndex: piece.getAttribute('data-module-index'),
            calcos: []
          }

          let calcosPartsLength = calcosParts.length

          for (let j = calcosPartsLengthDiv2; j < calcosPartsLength; j++) {
            const index = j < 1 ? 0 : j
            piezaDividida.calcos.push(($(calcosParts[index].outerHTML).find('.table').removeClass('table'))[0].outerHTML)
          }
          piezas.push(piezaDividida)
        }
        else {
          let calcosPartsLength = calcosParts.length
          // resto de las piezas
          for (let j = 0; j < calcosPartsLength; j++) {
            pieza.calcos.push(($(calcosParts[j].outerHTML).find('.table').removeClass('table'))[0].outerHTML)
          }
          piezas.push(pieza)
        }
      }
      return piezas
    },
    exportTaller () {

      const projectInfo = JSON.parse(JSON.stringify(this.$store.state.info))
      const estadoPrevio = projectInfo.estadoProyecto
      const exportableParts = this.partList.filter(part => !part.Only3d)
      exportableParts.map((part) => {
        part.AVeta = part.DisplayAVeta || part.AVeta
        part.LVeta = part.DisplayLVeta || part.LVeta
      })
      projectInfo.fechaInstalacion = this.getFormattedDate(projectInfo.fechaInstalacion)
      projectInfo.horaInstalacion = this.getFormattedTime(projectInfo.horaInstalacion)
      projectInfo.total = '' + projectInfo.total
      projectInfo.senia = '0'

      HTTP.post(`/api/exportar/validar`, {
        info: projectInfo,
        parts: exportableParts,
        modules: this.modulesList,
      }).then(result => {

        this.$refs.configOptions.style.display = 'block';
        this.$swal({
          content: this.$refs.configOptions,
          buttons: {
            cancelar: {
              text: 'Cancelar',
              value: "0"
            },
            save: {
              text: 'Solicitar revisión',
              value: "1"
            }
          }
        }).then(a=>{
          switch (a) {
            case '1':

              HTTP.post(`/api/exportar/set-revision`, {
                token_project: projectInfo.token_project,
                info: projectInfo,
                usuario: localStorage.getItem('user-id'),
                preguntas: this.preguntas,
                preguntas_ventas: this.preguntas_ventas,
              }).then(asd => {

                let result = {};
                const savingProjectName = `${this.$store.state.info.name} ${this.$store.state.info.mueble} REVICION`;



                const projectName = savingProjectName;


                if(this.$store.state.info.token_project!=""){
                    if (projectName) {
                    this.$noty.info("Guardando proyecto...");
                    HTTP.put(`/api/proyecto-json`, {
                      id: this.loadedProjectId,
                      proyectojson_id: this.loadedProjectId,
                      actual_token_project: this.$store.state.info.token_project,
                      token_project: this.$store.state.info.token_project,
                      nombre: projectName,
                      mueble:  this.$store.state.info.mueble,
                      client_name: this.$store.state.info.name,
                      address: this.$store.state.info.address,
                      phone: this.$store.state.info.phone,
                      comentario: this.$store.state.info.comentarioInstalacion,
                      encargado_med: this.$store.state.info.encargadoMed,
                      encargado_inst: this.$store.state.info.encargadoInst,
                      estado: this.$store.state.info.estadoProyecto,
                      proyecto: JSON.stringify(localStorage.vuex),
                      settings: this.$store.state.projectSettings,
                    })
                      .then((result) => {
                        console.log(result)
                        if (result.data.hasOwnProperty("id")) {
                          this.$noty.success("¡Proyecto guardado con éxito!");

                          this.$noty.info("Cargando datos. Por favor, espere ...", {
                              timeout: 3000,
                          });

                          const oldVuew = localStorage.vuex;
                          localStorage.vuex = {};
                          HTTP.get(`/api/proyecto-json/${result.data.id}`)
                          .then((response) => {
                              if (response.data.proyecto) {
                                  this.setErrorsIn3d(undefined);
                                  localStorage.vuex = JSON.parse(response.data.proyecto.proyecto);
                                  this.loadedProjectName = response.data.proyecto.nombre;
                                  this.loadedProjectId = response.data.proyecto.id;
                                  localStorage.setItem("projectName", response.data.proyecto.nombre);
                                  localStorage.setItem("projectID", response.data.proyecto.id);
                                  localStorage.setItem("projectloaded", true);
                                  localStorage.setItem(
                                  "projectCreatedAt",
                                  response.data.proyecto.created_at
                                  );
                                  if (true) {
                                  window.localStorage.setItem("default_template_loaded", true);
                                  }
                                  location.reload();
                              }
                          })
                          .catch((response) => {
                              alert(response + "proyectoLoad")
                              this.$noty.error("No se pudo cargar el proyecto");
                              localStorage.vuew = oldVuew;
                          });

                        }
                      })
                      .catch((result) => {
                        alert(result)
                        this.$noty.error("Ups, ha ocurrido un problema");
                      });
                  }
                }


              });
            break;
          }
        });

        return true;

        this.$swal('El centro de diseño se reiniciara y no se podra modificar el proyecto', {
          title: 'Confirma Exportar el Diseño al Taller?',
          icon: 'warning',
          buttons: {
            cancel: 'Cancelar',
            aceptar: {
              text: 'Confirmar',
              value: 'aceptar'
            }
          }
        }).then((value) => {
          switch (value) {
            case 'aceptar':
          }
        })

      }).catch(result => {
        this.$noty.error('¡Error al exportar el proyecto!')
        let errors = result.response.data
        let errorHtml = '<ul>'
        console.log(errors)

        for (let key in errors) {
          errorHtml += `<li>${errors[key]}</li>`
        }

        errorHtml += '</ul>'
        this.$noty.error(errorHtml)
        console.log('error:', result.response.data)
      });

    },
    corregir(){

      this.$refs.cometarioCorreciones.style.display = 'block';
      this.$swal({
        content: this.$refs.cometarioCorreciones,
        buttons: {
          cancelar: {
            text: 'Cancelar',
            value: "0"
          },
          save: {
            text: 'Solicitar corrección',
            value: "1"
          }
        }
      }).then(a=>{
        switch (a) {
          case '1':

            const projectInfo = JSON.parse(JSON.stringify(this.$store.state.info))
            const exportableParts = this.partList.filter(part => !part.Only3d)
            exportableParts.map((part) => {
              part.AVeta = part.DisplayAVeta || part.AVeta
              part.LVeta = part.DisplayLVeta || part.LVeta
            })
            projectInfo.fechaInstalacion = this.getFormattedDate(projectInfo.fechaInstalacion)
            projectInfo.horaInstalacion = this.getFormattedTime(projectInfo.horaInstalacion)
            projectInfo.total = '' + projectInfo.total
            projectInfo.senia = '0'

            HTTP.post(`/api/exportar/set-corregir`, {
              token_project: projectInfo.token_project,
              info: projectInfo,
              parts: exportableParts,
              modules: this.modulesList,
              preguntas: this.preguntas,
              preguntas_ventas: this.preguntas_ventas,
              usuario: localStorage.getItem('user-id'),
              comentario: this.comentario,
            }).then(result => {
              this.$noty.info("Confirmando...");

              const savingProjectName = `${this.$store.state.info.name} ${this.$store.state.info.mueble} REVISADO`;
              const projectName = savingProjectName;

              HTTP.put(`/api/proyecto-json`, {
                id: this.loadedProjectId,
                proyectojson_id: this.loadedProjectId,
                actual_token_project: this.$store.state.info.token_project,
                token_project: this.$store.state.info.token_project,
                nombre: projectName,
                mueble:  this.$store.state.info.mueble,
                client_name: this.$store.state.info.name,
                address: this.$store.state.info.address,
                phone: this.$store.state.info.phone,
                comentario: this.$store.state.info.comentarioInstalacion,
                encargado_med: this.$store.state.info.encargadoMed,
                encargado_inst: this.$store.state.info.encargadoInst,
                estado: this.$store.state.info.estadoProyecto,
                proyecto: JSON.stringify(localStorage.vuex),
                settings: this.$store.state.projectSettings,
              })
                .then((result) => {
                  console.log(result)
                  if (result.data.hasOwnProperty("id")) {
                    this.$noty.success("¡Confirmado!");
                    this.$noty.success("¡Proyecto guardado con éxito!");

                    this.$noty.info("Cargando datos. Por favor, espere ...", {
                        timeout: 3000,
                    });

                    const oldVuew = localStorage.vuex;
                    localStorage.vuex = {};
                    HTTP.get(`/api/proyecto-json/${result.data.id}`)
                    .then((response) => {
                        if (response.data.proyecto) {
                            this.setErrorsIn3d(undefined);
                            localStorage.vuex = JSON.parse(response.data.proyecto.proyecto);
                            this.loadedProjectName = response.data.proyecto.nombre;
                            this.loadedProjectId = response.data.proyecto.id;
                            localStorage.setItem("projectName", response.data.proyecto.nombre);
                            localStorage.setItem("projectID", response.data.proyecto.id);
                            localStorage.setItem("projectloaded", true);
                            localStorage.setItem(
                            "projectCreatedAt",
                            response.data.proyecto.created_at
                            );
                            if (true) {
                            window.localStorage.setItem("default_template_loaded", true);
                            }
                            location.reload();
                        }
                    })
                    .catch((response) => {
                        alert(response + "proyectoLoad")
                        this.$noty.error("No se pudo cargar el proyecto");
                        localStorage.vuew = oldVuew;
                    });

                  }
                })
                .catch((result) => {
                  alert(result)
                  this.$noty.error("Ups, ha ocurrido un problema");
                });

            });

          break;
        }
      });

    },
    confirmarExportar(){
       const projectInfo = JSON.parse(JSON.stringify(this.$store.state.info))
        const estadoPrevio = projectInfo.estadoProyecto
        this.$store.commit('setGeneralInfo', { key: 'estadoProyecto', value: 'Exportado' })
        const exportableParts = this.partList.filter(part => !part.Only3d)
        exportableParts.map((part) => {
          try{
            var AVeta;
            var LVeta;
            
            if(!part.girarVeta){
              AVeta = part.DisplayAVeta || part.AVeta
              LVeta = part.DisplayLVeta || part.LVeta
            }else{
              AVeta = part.DisplayLVeta || part.LVeta;
              LVeta = part.DisplayAVeta || part.AVeta;
            }

            part.AVeta = AVeta;
            part.LVeta = LVeta;
         }catch(error){
            console.log(error);
            part.AVeta = part.DisplayAVeta || part.AVeta
            part.LVeta = part.DisplayLVeta || part.LVeta
         }
        })
        projectInfo.fechaInstalacion = this.getFormattedDate(projectInfo.fechaInstalacion)
        projectInfo.horaInstalacion = this.getFormattedTime(projectInfo.horaInstalacion)
        projectInfo.total = '' + projectInfo.total
        projectInfo.senia = '0'
        const metadata = this.createProjectMetadata()
        HTTP.get(`/api/proyecto-json`).then(result => {
          const projectId = result.data.proyectos[0].id + 1
          console.log('el id es: '+projectId)
          metadata.push({ key: 'project_id', value: projectId })
          HTTP.post(`/api/proyectos/save-all`, {
            info: projectInfo,
            parts: exportableParts,
            modules: this.modulesList,
            metadata: metadata,
            calcos: this.createCalcosMetadata(),
            proyectoid: localStorage.getItem("projectID")
          }).then(result => {

            HTTP.post(`/api/exportar/set-confirma-exportar`, {
              token_project: projectInfo.token_project,
              info: projectInfo,
              usuario: localStorage.getItem('user-id'),
              preguntas: this.preguntas,
              preguntas_ventas: this.preguntas_ventas,
            });

            this.$noty.success('Guardando proyecto...')
            HTTP.post(`/api/proyecto-json`, {
              nombre: this.$store.state.info.name + ' ' + this.$store.state.info.mueble + ' EXPORTADO AUTO',
              proyecto: JSON.stringify(localStorage.vuex)
            }).then(result => {
              if (result.data.success === true) {
                this.$noty.success('¡Proyecto guardado con éxito!')
                const avanzado = localStorage.getItem('avanzado')
                const modulo = localStorage.getItem('modulo')
                const fondos = localStorage.getItem('fondos')
                const status3d = localStorage.getItem('enable-status-3d')
                const roomEditor = localStorage.getItem('enable-room-editor')
                const token = localStorage.getItem('token')
                const name = localStorage.getItem('user-name')
                const id = localStorage.getItem('user-id')
                const rol = localStorage.getItem('user-rol')
                const usuario = localStorage.getItem('usuario')
                const jwtToken = localStorage.getItem('jwt-token')
                localStorage.clear()
                localStorage.setItem('avanzado', avanzado)
                localStorage.setItem('modulo', modulo)
                localStorage.setItem('fondos', fondos)
                localStorage.setItem('token', token)
                localStorage.setItem('user-name', name)
                localStorage.setItem('user-id', id)
                localStorage.setItem('user-rol', rol)
                localStorage.setItem('enable-status-3d', status3d)
                localStorage.setItem('enable-room-editor', roomEditor)
                localStorage.setItem('usuario', usuario)
                localStorage.setItem('jwt-token', jwtToken)

                setInterval(function () { window.location.reload() }, 2000)
                console.log('suscess: ', result)
              }
            }).catch(result => {
              this.$noty.error('Error al guardar el proyecto. Es posible que el nombre del proyecto ya este registrado')
            })
          }).catch(result => {
            this.$store.commit('setGeneralInfo', { key: 'estadoProyecto', value: estadoPrevio })
            this.$noty.error('¡Error al exportar el proyecto!')
            let errors = result.response.data
            let errorHtml = '<ul>'
            console.log(errors)

            for (let key in errors) {
              errorHtml += `<li>${errors[key]}</li>`
            }

            errorHtml += '</ul>'
            this.$noty.error(errorHtml)
            console.log('error:', result.response.data)
          })
        }).catch(result => {
          console.log(result)
        })
    },
    getConnections (element) {
      // Separator.CalcularConexiones(element)
      return element.conexiones
    },
    printPdf () {
      window.print()
    }
  },
  watch: {
    moduleSettings (newValue, oldValue) {
      this.currentPart.Espesor = newValue.EspesorGeneral
    },
    partList (n, o) {
      if (!this.errorsIn3d) {
        // this.exportList()
      }
    },
    getinfo (n, o) {
      // this.exportList()
    }
  }
}
</script>

<style scoped>
  td{
    padding: 0;
  }
  .export-table {
    table-layout: fixed;
  }
  .nowrap {
    white-space: nowrap;
  }
  .form-input {
    max-width: 100px;
    width: 5vw;
  }
  .calco-list {
    width: 1100px;
  }
  .swal-title {
    margin: 0px;
    font-size: 16px;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.21);
    margin-bottom: 28px;
  }

  @media print
  {
    .calco-list {
      width: 1500px !important;
    }
  }
</style>
