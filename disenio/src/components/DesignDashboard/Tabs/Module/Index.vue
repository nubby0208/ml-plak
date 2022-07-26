<template>
  <div
    id="moduleIndex"
    v-shortkey="{ ctrl: ['ctrl', ','], alt: ['alt', ','] }"
    @shortkey="changeSelectedPiece(false)"
  >
    <div
      class="col text-left not-printable"
      v-shortkey="{ ctrl: ['ctrl', '.'], alt: ['alt', '.'] }"
      @shortkey="changeSelectedPiece(true)"
    >
      <span
        v-shortkey="['alt', n]"
        @shortkey="goToMod(n)"
        class="hidden"
        v-for="n in 9"
        :key="n"
        :value="n"
      ></span>
      <a v-if="projectName" :href="projectData" :download="projectName"
        >Descargar {{ projectName }}</a
      >
      <input
        id="inputFile"
        type="file"
        style="display: none"
        v-on:change="load"
      />
    </div>
    <div v-if="activatedModuleIndexes.length === 0">
      <span class="no-modules"> No hay modulos activados... </span>
    </div>
    <div v-if="activatedModuleIndexes.length > 0" class="row right-bar">
      <div class="col-md-8 pt-0" id="view-panel">
        <b-row align-v="start" align-h="between" class="text-center">
          <b-col cols="6" xl="5">
            <b-row align-v="start" class="pb-3">
              <b-col cols="6">
                <b-row align-v="start" class="pb-2">
                  <b-col sm="5">
                    <label for="textarea-small">Módulos:</label>
                  </b-col>
                  <b-col sm="7">
                    <b-form-select
                      v-model="selectedModuleId"
                      size="sm"
                      :options="activatedModules"
                      @change="onModuloChange"
                      text-field="moduleId"
                      value-field="moduleId"
                    />
                  </b-col>
                </b-row>
                <b-row align-v="start" class="pb-2" >
                  <b-col sm="12">
                    <button @click="openAddModuleModal()" class="btn btn-sm btn-block btn-primary">Agregar modulos</button>
                  </b-col>
                </b-row>
                <b-row align-v="start" class="pb-2" >
                  <b-col sm="5">
                    <label for="textarea-small">Armado:</label>
                  </b-col>
                  <b-col sm="7">
                    <b-form-select
                      v-model="armado"
                      size="sm"
                      :options="armadoOptions"
                      @change="onModuloSettingChange('armado', $event)"
                    />
                  </b-col>
                </b-row>
                <b-row align-v="start">
                  <b-col
                    cols="12"
                  >
                    <b-dropdown
                      block
                      class="py-0"
                      text="Acciones"
                    >
                      <b-button
                        variant="light"
                        squared
                        block
                        class="text-left"
                        @click="addCustomPart"
                      >
                        <b-icon-three-dots-vertical />
                        Piezas Manuales
                      </b-button>
                      <b-button
                        variant="light"
                        squared
                        block
                        class="text-left"
                        @click="addActionNote"
                      >
                        <b-icon icon="file-text"></b-icon>
                        Notas de Acción
                      </b-button>
                      <b-button
                        variant="light"
                        squared
                        block
                        class="text-left"
                        @click="cambiarEjes"
                      >
                        <b-icon-arrows-move />
                        Mover Ejes
                      </b-button>
                    </b-dropdown>
                  </b-col>
                </b-row>
              </b-col>
              <b-col cols="6">
                <b-row align-v="start" class="pb-2">
                  <b-col
                    class="pr-0"
                    sm="8"
                  >
                    <p
                      style="font-size: 0.78rem !important"
                      class="mb-0 font-weight-medium text-left"
                    >
                      Visible en 3D:
                    </p>
                  </b-col>
                  <b-col sm="4">
                    <b-form-checkbox
                      v-model="selectedModuleVisibility"
                      switch
                    />
                  </b-col>
                </b-row>
                <b-row align-v="center" class="pb-2" >
                  <b-col
                    class="pr-0"
                    sm="8"
                  >
                    <p
                      style="font-size: 0.78rem !important"
                      class="mb-0 font-weight-medium text-left"
                    >
                      Mostrar Puertas / Doble Fondo:
                    </p>
                  </b-col>
                  <b-col sm="4">
                    <b-form-checkbox
                      v-model="showPuertaDoblefondo"
                      name="mostrar-puertas-doble-fondo"
                      id="mostrar-puertas-doble-fondo"
                      switch
                    />
                  </b-col>
                </b-row>
                <b-row align-v="center">
                  <b-col
                    class="pr-0"
                    sm="8"
                  >
                    <p
                      style="font-size: 0.78rem !important"
                      class="mb-0 font-weight-medium text-left"
                    >
                      Mostrar Medidas:
                    </p>
                  </b-col>
                  <b-col sm="4">
                    <b-form-checkbox
                      v-model="showDimensions"
                      name="mostrar-medidas"
                      id="mostrar-medidas"
                      switch
                    />
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="6" xl="7">
            <b-row>
              <b-col cols="6" xl="5" class="text-left">
                <label for="textarea-small">Comentario:</label>
                <b-form-textarea
                  size="sm"
                  rows="3"
                  lazy
                  v-model="comentario"
                  placeholder="Escribe un comentario..."
                />
              </b-col>
              <b-col cols="6" xl="7" class="text-left">
                <label for="textarea-small">Descripción:</label>
                <b-form-textarea
                  size="sm"
                  rows="3"
                  lazy
                  v-model="description"
                  placeholder="Escribe una descripción..."
                />
              </b-col>
              <b-col cols="12">
                <div class="layers">
                    <div class="layer-panel">
                      <div>
                        <ul class="layer-list">
                          <li v-for="(layer, index) in layers" :key="index">
                            <input
                              type="checkbox"
                              :id="layer.name"
                              v-model="layer.visible"
                              @change="toggleLayer(layer, index)"
                            />
                            <label
                              class="layer-label"
                              :for="layer.name"
                              :class="{
                                'layer-selected': showingLayerInfo === index,
                              }"
                              >{{ layer.name }}</label
                            >
                            <span
                              v-if="showingLayerInfo !== index"
                              class="layer-chevron"
                              @click="filterLayer(index)"
                              >&#8250;</span
                            >
                            <span
                              v-else
                              class="layer-chevron layer-selected"
                              @click="filterLayer(index)"
                              >&#8249;</span
                            >
                          </li>
                        </ul>
                      </div>
                      <div class="layer-info" v-if="showingLayerInfo > -1">
                        <div v-if="layerElements.length === 0">
                          Esta capa no posee elementos
                        </div>
                        <div
                          v-for="(elem, index) in layerElements"
                          :key="index"
                          class="layer-element"
                        >
                          {{ elem.id }} - {{ elem.name }}
                        </div>
                      </div>
                    </div>
                  </div>
              </b-col>
            </b-row>
          </b-col>

          <!-- <div class="col-3 project-url-container" @click="copyProjectUrlToClipboard()" title="Click para copiar al portapapeles">
            <div>
              <span v-if="loadedProjectId" class="project-url">Copiar Enlace</span>
            </div>
          </div> -->
        </b-row>

        <div class="downloadable-image">
          <span class="downloadable-hidden">
            <strong>Módulo {{ selectedModuleId }}</strong>
          </span
          >
          <ModElement
            v-if="mounted && !isAmbienteSelected"
            ref="module"
            class="diagram"
            :id="selectedModuleId * idMultiplier"
          />
          <ul class="downloadable-hidden downloadable-details-list">
            <li>
              Alto: <strong>{{ selectedModule.height }}mm</strong>
            </li>
            <li>
              Ancho: <strong>{{ selectedModule.width }}mm</strong>
            </li>
            <li>
              Profundidad: <strong>{{ selectedModule.z }}mm</strong>
            </li>
            <br />
            <li>
              Material por defecto:
              <strong>{{
                getMaterialDefaultPorModulo(selectedModuleId)
              }}</strong>
            </li>
            <li>
              Tapacantos por defecto:
              <strong>{{
                getTapacantosDefaultPorModulo(selectedModuleId)
              }}</strong>
            </li>
            <li>
              Material para fondo:
              <strong>{{
                selectedModule.fondo ? selectedModule.fondo : "Sin fondo"
              }}</strong>
            </li>
          </ul>
        </div>
        <br />
        <PuertaCorredizaDiagram
          v-if="hasPuertaCorrediza()"
          class="not-printable"
          :separador="selectedElement"
          :puerta="selectedElement.puerta"
        />
        <br />
        <div class="not-printable">
          <CalcoContainer
            ref="calco"
            v-if="showCalco(selectedElement)"
            :id="selectedElement"
          />
        </div>
      </div>

      <div id="edit-panel" class="col-md-4">
        <!-- style="height:60vh; overflow:auto;" -->



        <div class="bordered-container">
          <div class="flex">
            <div
              class="container-title not-printable"
              @click="toggle3DViewer = !toggle3DViewer"
            >
              <span class="container-toggler more" v-if="toggle3DViewer"
                >▲</span
              >
              <span class="container-toggler less" v-else>▼</span>
              Mini Visor
            </div>
          </div>
          <div
            class="container"
            :class="`bordered-section ${toggle3DViewer ? '' : 'uncollapsed'}`"
          >
            <div style="font-size: 11pt;" class="not-printable flex justify-center mb-0 col-12">

              <OpcionMiniVisorExportar
                style="margin-right:10px;"
                @export-server-img="exportServerImg"
                @export-img="exportImg"
                @export-dae="exportDae" 
                @save-project="saveProject"
              />

              <OpcionMiniVisorTipoVista
                style="margin-right:10px;"
                :opciones="opcionesTiposDeVistas"
                v-model="viewerShowPieces"
              />
              
              <OpcionMiniVisorConfig
                :contentStyle="{'left': '-100px'}"
                style="margin-right:10px;"
                :opciones="configOpciones"
                :textDefaut="getConfigOpcionesMV"
                v-model="viewerConfigOpciones"
              />

            
              <div v-if="selectedObjectMixer" style="cursor:pointer;">
                  
                  <div 
                    v-if="selectedObjectMixer.type == 'module'"
                    @click="$store.commit('toggleModuleVisibility', {
                            _visible: !selectedModuleLocal._visible,
                            isRoomEditor: false,
                            moduleName: selectedModuleLocal.moduleName,
                        }
                    )"
                  >
                    
                  
                  <b-icon 
                    :icon="selectedModuleLocal._visible ? 'eye-slash' : 'eye'"
                    font-scale="1"
                    ></b-icon>
                    {{selectedModuleLocal && selectedModuleLocal._visible ? 'Ocultar' : 'Mostrar'}}

                  </div>

                  <div 
                    v-else-if="selectedObjectMixer.type == 'piece'"
                    @click="$store.commit('togglePieceVisibility', {
                        visible: objetoSeleccionado[0] ? !objetoSeleccionado[0].Visible:null,
                        moduleName: objetoSeleccionado[0] ? objetoSeleccionado[0].Module:null,
                        pieceId: objetoSeleccionado[0] ? objetoSeleccionado[0]._Id:null,
                        pieceName: objetoSeleccionado[0] ? objetoSeleccionado[0].Name:null,
                        isRoomEditor: false, 
                        elementId: objetoSeleccionado[0] ? objetoSeleccionado[0].elementId:null
                      }
                    )"
                  >

                  <b-icon 
                    :icon="objetoSeleccionado[0].Visible ? 'eye-slash' : 'eye'"
                    font-scale="1"
                    ></b-icon>
                  {{ objetoSeleccionado[0] && objetoSeleccionado[0].Visible ? 'Ocultar' : 'Mostrar'}}
                  </div>
              </div>

            </div>
            <div class="row" v-if="toggle3DViewer">
              <div class="col-12" style="height: 15rem">
                <Viewer3D ref="viewerContainer" :showPieces="viewerShowPieces" />
              </div>
              <div class="col-12">
                <div style="">
                  <div v-if="selectedObjectMixer">
                    {{selectedObjectMixer | getTextSelect}}
                    <div v-if="selectedObjectMixer.type == 'piece'">
                      Espesor:{{medidasSelect.h}}
                      Ancho:{{medidasSelect.w}}
                      Longitud:{{medidasSelect.l}}
                    </div>
                    <div v-else-if="selectedObjectMixer.type == 'module'">
                      Alto:{{medidasSelect.h}}
                      Ancho:{{medidasSelect.w}}
                      Profundidad:{{medidasSelect.l}}
                    </div>
                    <div v-else>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="edit-module">
          <EditModule />

          <div v-if="selectedElement" class="control-components not-printable">
            <EditGeneral
              :selected="selectedElement.id"
              :comentario="selectedElement.comentario"
            />

            <EditBandeja v-if="selectedElement.bandeja" />

            <EditCube
              v-if="
                !isAmbienteSelected &&
                (selectedElement.cube || !isElementLayerVisible)
              "
            />

            <EditPuerta v-if="selectedElement.puerta" />

            <EditSeparator
              v-if="
                !isAmbienteSelected &&
                selectedElement.separator &&
                isElementLayerVisible
              "
            />

            <EditDobleFondo v-if="selectedElement.dobleFondo" />

            <EditSolapar v-if="!selectedElement.cajon" />

            <EditTapacantos
              v-if="selectedElement.tapacantos && isElementLayerVisible"
            />

            <EditCajon v-if="selectedElement.cajon && isElementLayerVisible" />
          </div>
        </div>
      </div>
    </div>

    <b-modal
      ref="moduleCreationModal"
      hide-footer
      title="Crear Modulo"
      size="module-creation-modal"
      @shown="setFocus('addMods')"
    >
      <div class="overflow-auto">
        <div class="content">
          <div class="main-msg">
            El modulo {{ hotKeyModPressed }} no existe. ¿Desea agregarlo al
            proyecto?
          </div>
          <div class="note-msg" v-if="hotKeyModPressed - moduleCount === 1">
            Se agregara un modulo vacio
          </div>
          <span class="note-msg" v-if="hotKeyModPressed - moduleCount > 1"
            >Se agregaran en total {{ hotKeyModPressed - moduleCount }} modulos
            vacios</span
          >
        </div>
        <div class="buttons">
          <button class="btn btn-sm" @click="closeModuleCreationModal()">
            Cancelar
          </button>
          <button
            class="btn btn-primary btn-sm"
            @click="addModules()"
            ref="addMods"
          >
            Agregar
          </button>
        </div>
      </div>
    </b-modal>

    <b-modal
      ref="moduleActivationModal"
      hide-footer
      title="Activar Modulo"
      size="module-creation-modal"
      @shown="setFocus('addMods')"
    >
      <div class="overflow-auto">
        <div class="content">
          <div class="main-msg">
            El modulo {{ hotKeyModPressed }} no esta activo. ¿Desea activarlo?
          </div>
        </div>
        <div class="buttons">
          <button class="btn btn-sm" @click="closeActivationModal()">
            Cancelar
          </button>
          <button
            class="btn btn-primary btn-sm"
            @click="activateModule()"
            ref="addMods"
          >
            Activar
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import "vuejs-noty/dist/vuejs-noty.css";
import Vue from "vue";
import VueNoty from "vuejs-noty";
import BootstrapVue from "bootstrap-vue";
import VueClipboard from "vue-clipboard2";
import swal from 'sweetalert2'

import ModElement from "../../Tools/ModElement";
import PuertaCorredizaDiagram from "../../Tools/PuertaCorredizaDiagram";
import CalcoContainer from "../../Tools/CalcoContainer";
import EditCustomPart from "../../Tools/EditCustomPart.vue";
import EditActionNote from "../../Tools/EditActionNote.vue";
import MoverEjes from "../../Tools/MoverEjes.vue";

import Viewer3D from "../3D/Viewer";
import EditModule from "../../Tools/EditModule";
import EditGeneral from "../../Tools/EditGeneral";
import EditBandeja from "../../Tools/EditBandeja";
import EditCube from "../../Tools/EditCube";
import EditPuerta from "../../Tools/EditPuerta";
import EditSeparator from "../../Tools/EditSeparator";
import EditDobleFondo from "../../Tools/EditDobleFondo";
import EditSolapar from "../../Tools/EditSolapar";
import EditTapacantos from "../../Tools/EditTapacantos";
import EditCajon from "../../Tools/EditCajon";
import OpcionMiniVisorExportar from '@/components/DesignDashboard/Tabs/3D/menus/OpcionMiniVisorExportar.vue'
import OpcionMiniVisorTipoVista from '@/components/DesignDashboard/Tabs/3D/menus/OpcionMiniVisorTipoVista.vue'
import OpcionMiniVisorConfig from '@/components/DesignDashboard/Tabs/3D/menus/OpcionMiniVisorConfig.vue'
import objectMenuMixin from '@/components/objectMenu.mixin.js'
import { EventBus } from "@/index";


Vue.use(VueNoty, {
  theme: "metroui",
});
Vue.use(BootstrapVue);
Vue.use(VueClipboard);

export default {
  mixins: [objectMenuMixin],
  components: {
    ModElement,
    PuertaCorredizaDiagram,
    CalcoContainer,
    EditModule,
    EditGeneral,
    EditBandeja,
    EditCube,
    EditPuerta,
    EditSeparator,
    EditDobleFondo,
    EditSolapar,
    EditTapacantos,
    EditCajon,
    Viewer3D,
    OpcionMiniVisorExportar,
    OpcionMiniVisorTipoVista,
    OpcionMiniVisorConfig,
  },

  data() {
    return {
      viewerConfigOpciones: null,
      viewerShowPieces: "all",
      activatedModuleIndexes: [],
      isTrue: true,
      isFalse: false,
      projectName: null,
      projectData: null,
      showingLayerInfo: -1,
      layerElements: [],
      // pagOptions: {},
      hotKeyModPressed: -1,
      fields: [
        { key: "index", label: "#" },
        { key: "nombre", sortable: true },
        { key: "created_at", label: "Creado", sortable: true },
        "opcion",
      ],
      opcionesTiposDeVistas:[
        {text:"Ambiente + Mueble", valor:"all"},
        {text:"Solo Ambiente", valor:"room"},
        {text:"Solo Mueble", valor:"furniture"}
      ],

      // --------------------
      activatedModules: [],
      selectedModuleId: null,
      // moduleSettings: {
      //   armado: "",
      // },
      armadoOptions: ['','Sí', 'No', 'Evaluar'],
    }
  },

  mounted: function () {
    this.$store.dispatch('getConexionesDB');
    EventBus.$off("eventoChangeModulo");
    EventBus.$on("eventoChangeModulo", ()=>{
      this.populateInitialData();
    });

    this.populateInitialData()
    this.$store.dispatch('getConfig3dAll').then((a) => {
      console.log(a);
    });
  },

  created: function () {
    this.$store.commit("setLayoutProperty", {
      key: "ambienteEnabled",
      value: false,
    });
  },
  computed: {
    configOpciones(){
      return this.$store.getters.getOptionConfig3d.map(a=>{
        var temp = {};
        temp.text = a.name;
        temp.valor = a;
        return temp;
      });
    },
    configViewer(){
      return this.$store.getters.getConfig;
    },
    getConfigOpciones(){
      return this.$store.getters.getSelectionConfig;
    },
    getConfigOpcionesMV(){
      return this.$store.getters.getSelectionConfig;
    },
    projectUrl() {
      return "/disenio/#/DesignCenter/" + this.tokenize(this.loadedProjectId);
    },
    isAmbienteSelected() {
      return this.$store.state.layout.ambienteEnabled;
    },
    idMultiplier() {
      return this.$store.state.layout.idMultiplier.modulo;
    },
    layers: {
      get() {
        return this.$store.getters.selectedModule.layers;
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
    selectedModuleVisibility: {
      get () {
        return this.$store.getters.selectedModule._visible
      },
      set (value) {
        this.$store.commit(
          'toggleModuleVisibility',
          {
            isRoomEditor: this.isAmbienteSelected,
            moduleName: this.selectedModule.moduleName,
            _visible: value,
          }
        )
      }
    },
    selectedModule: {
      get () {
        return this.$store.getters.selectedModule
      }
    },
    mounted() {
      return this.selectedModule.elements.length > 0;
    },
    moduleCount: {
      get() {
        return this.$store.getters.moduleCount;
      },
      set(value) {
        this.$store.commit("setModuleCount", Number(value));
      },
    },
    description: {
      get() {
        return this.$store.getters.selectedModule.settings.description;
      },
      set(value) {
        this.$store.commit("setModuleSetting", {
          key: "description",
          value: value,
        });
      },
    },
    armado: {
      get() {
        return this.$store.getters.selectedModule.settings.armado;
      },
      set(value) {
        this.$store.commit("setModuleSetting", {
          key: "armado",
          value: value,
        });
      },
    },
    comentario: {
      get() {
        return this.$store.getters.selectedModule.settings.comentario;
      },
      set(value) {
        this.$store.commit("setModuleSetting", {
          key: "comentario",
          value: value,
        });
      },
    },
    showPuertaDoblefondo: {
      get() {
        return this.$store.state.layout.showPuertaDoblefondo;
      },
      set(value) {
        this.$store.commit("setShowPuertaDoblefondo", value);
      },
    },
    showDimensions: {
      get() {
        return this.$store.state.layout.showDimensions;
      },
      set(value) {
        this.$store.commit("setShowDimensions", value);
      },
    },
    width: {
      get() {
        return this.selectedModule.width;
      },
      set(value) {
        this.$store.commit("setModuleWidth", Number(value));
      },
    },
    height: {
      get() {
        return this.selectedModule.height;
      },
      set(value) {
        this.$store.commit("setModuleHeight", Number(value));
      },
    },
    selectedElement() {
      return this.$store.getters.selectedElement;
    },
    isElementLayerVisible() {
      const element = this.selectedElement;
      if (element.layerId != null && element.layerId > -1) {
        return this.$store.getters.selectedModule.layers[element.layerId]
          .visible;
      }
      return true;
    },
    toggle3DViewer: {
      get () {
        return this.$store.state.projectSettings.collapsibles.toggle3DViewer
      },
      set (value) {
        this.$store.commit('setProjectSettingsCollapsibles', {
          key: 'toggle3DViewer',
          value: value
        })
      }
    }
  },
  methods: {
    openAddModuleModal () {
      swal({
        title: 'Agregar Módulos',
        input: 'number'
      }).then((result) => {
        if (result.value && +result.value) {
          const newCount = +result.value + this.moduleCount
          if (newCount > 30) {
            this.$noty.error('La cantidad máxima de módulos es 30')
            return
          }

          if (newCount < 1) {
            this.$noty.error('Debe agregar al menos 1 módulo')
            return
          }

          this.$store.commit('setModuleCount', newCount)
          this.populateInitialData();
        }
      })
    },
    exportImg () {
      this.$refs.viewerContainer.viewer.exportImage('image')
    },
    exportDae () {
      this.$refs.viewerContainer.viewer.exportToObjDAE('model.dae')
    },
    exportServerImg () {
      this.$refs.viewerContainer.saveImg()
    },
    async saveProject () {
      // remover marcadores para permitir la exportacion
      this.$refs.viewerContainer.editor.mlPlakMarkers.detachMarkers()

      this.$refs.viewerContainer.viewer.exportToGLTF((glftContent) => {
        let editorExportedData = this.$refs.viewerContainer.editor.exportEditorData()
        editorExportedData.models = JSON.parse(JSON.stringify(this.$store.state.viewer3d.modules))
        let markersData = JSON.stringify(this.$refs.viewerContainer.editor.mlPlakMarkers.exportMarkers())
        let executeAfterGLTFParsing = function (gltf) {
          let d = { project_id: window.localStorage.getItem('projectID'),
            markers: markersData,
            editorData: JSON.stringify(editorExportedData),
            scene: gltf }

          fetch(URL_BASE + '/api/3dviewer/scene/create', {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(d)
          }).then(response => {
            this.$refs.viewerContainer.editor.mlPlakMarkers.attachMarkers()
          }).catch((error) => {
            console.log('error saving scene')
            console.log(error)
          })
        }
        this.$refs.viewerContainer.editor.viewer.exportToGLTF(executeAfterGLTFParsing)
      })
    },
    populateInitialData () {
      // this.moduleSettings = this.$store.getters.selectedModule.settings
      this.selectedModuleId = this.$store.getters.selectedModuleId + 1
      this.activatedModules = this.$store.getters.getActivatedModules
      this.activatedModuleIndexes = this.activatedModules.map(m => m.moduleId)
      // this.currentModuleVisibility = Boolean(this.selectedModule._visible)
    },
    activateModule() {
      console.log("this.hotKeyModPressed", this.hotKeyModPressed);
      this.$store.commit("activateModule", this.hotKeyModPressed);
      this.selectedModuleId = this.hotKeyModPressed;
      this.closeActivationModal();
    },
    closeActivationModal() {
      this.hotKeyModPressed = -1;
      this.$refs.moduleActivationModal.hide();
    },
    copyProjectUrlToClipboard() {
      const self = this;
      this.$copyText(this.projectUrl).then(
        function (e) {
          self.$noty.info("Url copiada al portapapeles...");
        },
        function (e) {
          alert("No se pudo copiar");
        }
      );
    },
    setErrorsIn3d(errors) {
      this.$store.commit("setErrorsIn3d", errors);
    },
    getMaterialDefaultPorModulo(id) {
      const material = this.$store.state.general[
        this.isAmbienteSelected
          ? "material_default_por_modulo_room_editor"
          : "material_default_por_modulo"
      ][id - 1];
      //console.log("Se cargó material");
      return material ? JSON.parse(material) : "";
    },
    getTapacantosDefaultPorModulo(id) {
      const tapacantos = this.$store.state.general[
        this.isAmbienteSelected
          ? "tapacantos_default_por_modulo_room_editor"
          : "tapacantos_default_por_modulo"
      ][id - 1];
      //console.log("Se cargó tapacantos");
      return tapacantos ? JSON.parse(tapacantos).nombre : "";
    },
    changeSelectedPiece(up) {
      this.$store.commit("changeSelection", up);
    },
    setFocus(ref) {
      this.$refs[ref].focus();
    },
    goToMod(n) {
      if (this.$store.state.layout.currentDesignSystemSection !== "modulo") {
        return;
      }

      this.hotKeyModPressed = n;
      if (n > this.moduleCount) {
        this.$refs.moduleCreationModal.show();
      } else {
        if (this.activatedModuleIndexes.indexOf(n) === -1) {
          // module is not active
          this.$refs.moduleActivationModal.show();
          return;
        }
        this.selectedModuleId = n;
      }
    },
    closeModuleCreationModal() {
      this.hotKeyModPressed = -1;
      this.$refs.moduleCreationModal.hide();
    },
    addModules() {
      this.moduleCount = this.hotKeyModPressed;
      this.selectedModuleId = this.hotKeyModPressed;
      this.closeModuleCreationModal();
    },
    hasPuertaCorrediza() {
      return (
        this.selectedElement &&
        this.selectedElement.puerta &&
        this.selectedElement.puerta.elementType === "puerta-corrediza"
      );
    },
    toggleLayer(layer, layerId) {
      this.$store.commit("toggleLayer", {
        layerId: layerId,
        value: layer.visible,
      });
    },
    filterLayer(layerId) {
      if (layerId === this.showingLayerInfo) {
        this.showingLayerInfo = -1;
        this.layerElements = [];
        return;
      }
      this.showingLayerInfo = layerId;
      let result = this.$store.getters.getElementsInLayer(layerId);
      this.layerElements = result.map((e) => ({ id: e.id, name: e.name }));
    },
    onModuloChange() {

      console.log(`onModuloChange --> selectModule --> layout.ts  **/DesignDashboard/Tabs/Module/Index.vue`)
      this.showingLayerInfo = -1;
      this.$store.commit("selectModule", Number(this.selectedModuleId) - 1);
    },
    onModuloSettingChange(key, value) {
      let payload = { key, value };
      this.$store.commit("setModuleSetting", payload);
    },
    load() {
      let file = document.getElementById("inputFile").files[0];
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (evt) {
        const project = JSON.parse(JSON.parse(evt.target.result));
        localStorage.vuex = JSON.stringify(project);
        location.reload();
      };
    },
    hasCalco(element) {
      return (
        element &&
        ((element.separator && element.size > 0) ||
          element.cajon ||
          element.puerta ||
          element.dobleFondo)
      );
    },
    showCalco(element) {
      return (
        !this.$store.state.layout.ambienteEnabled && this.hasCalco(element)
      );
    },
    addCustomPart() {
      let EditCustomPartInstance = Vue.extend(EditCustomPart);
      let ElementMounted = new EditCustomPartInstance({
        store: this.$store,
        parent: this.$parent,
      }).$mount().$el;
      this.$swal({
        content: ElementMounted,
        buttons: false,
      });
    },
    addActionNote() {
      //alert("Action Note");
      let EditActionNoteInstance = Vue.extend(EditActionNote);
      let ElementMounted = new EditActionNoteInstance({
        store: this.$store,
        parent: this.$parent,
      }).$mount().$el;
      this.$swal({
        content: ElementMounted,
        buttons: false,
      });
    },
    addCustomModule() {
      let EditModuloExternoInstance = Vue.extend(EditModuloExterno);
      let ElementMounted = new EditModuloExternoInstance({
        store: this.$store,
        parent: this.$parent,
      }).$mount().$el;
      this.$swal({
        content: ElementMounted,
        buttons: false,
      });
    },
    cambiarEjes() {
      let MoverEjesInstance = Vue.extend(MoverEjes);
      let ElementMounted = new MoverEjesInstance({
        store: this.$store,
        parent: this.$parent,
      }).$mount().$el;
      this.$swal({
        content: ElementMounted,
        buttons: false,
      });
    },
    setElementComentario(comentario) {
      let elemento = this.$store.getters.selectedElement;
      elemento.comentario = comentario;
    },
    tokenize(id) {
      return this.$store.getters.tokenize(id);
    },
    parseToken(token) {
      return this.$store.getters.parseToken(token);
    },
  },
  filters:{
    getTextSelect(data){
      try {
        return data.id.replace('_', ' ');
      } catch (error) {
        return "";
      }
    }
  },
  watch:{
    viewerConfigOpciones(newValue){
      this.$store.commit('setSelectOptionConfig3d', newValue);
    }
  }
};
</script>

<style lang="scss">
/** Utilizar id del componente porque se rompe la UI si se pone scoped
 * Al mismo tiempo no tiene que afectar todo el sitio, porque se rompe taller */

@mixin personalized-scroll {
  &::-webkit-scrollbar {
    width: 8px;     /* Tamaño del scroll en vertical */
    height: 8px;    /* Tamaño del scroll en horizontal */
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #b3b3b3;
    box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
  }

  &::-webkit-scrollbar-thumb:active {
    background-color: #999999;
  }
}

#moduleIndex #view-panel {
  height: 91vh;
  overflow-y: scroll;
  @include personalized-scroll;
}
#moduleIndex #edit-panel {
  font-size: 12px;
  h4 {
    font-size: 18px;
  }
  & .edit-module{
    height: 54vh;
    overflow-y: scroll;
    @include personalized-scroll;
  }
  & > .bordered-container:first-child {
    & > div:first-child{
      position: absolute;
      & > div {
        top: -15px;
      }
    }
  }
}

#moduleIndex .modal-body {
  max-height: calc(100vh - 130px);
  overflow-y: auto;
}

#moduleIndex .modal-dialog {
  max-width: 1200px !important;
}

#moduleIndex .modulo-actions-row {
  display: flex;
  position: relative;
  left: -15px;
  width: 100%;
}
#moduleIndex .modulo-actions-row button {
  height: 30px;
  margin: 0px 2px;
  font-size: 12px;
}
#moduleIndex .modulo-selector {
  margin-right: 10px;
}
#moduleIndex .flex {
  display: flex;
}
#moduleIndex .flex-1 {
  flex: 1;
}
#moduleIndex .align-items-center {
  align-items: center;
}
#moduleIndex .modulo-actions-label {
  font-size: 20px;
}
#moduleIndex.margin-right-10 {
  margin-right: 10px;
}
#moduleIndex.margin-right-20 {
  margin-right: 20px;
}
#moduleIndex.margin-top-10 {
  margin-top: 10px;
}
#moduleIndex .label-10 {
  font-size: 10px;
}
#moduleIndex .comment-description {
  width: 85px;
  display: inline-block;
}
#moduleIndex .btn.ml-plak-btn,
#moduleIndex
  .btn:not(.btn-outline-secondary):not(.btn-primary):not(.btn-success):not(.btn-info):not(.btn-danger):not(.btn-link):not(.btn-outline-primary):not(.btn-secondary):not(.btn-outline-danger) {
  background-color: rgb(239, 239, 239);
}
#moduleIndex .no-modules {
  font-size: 22px;
  margin-top: 10%;
  display: block;
}
#moduleIndex .project-url-container {
  max-width: 500px;

  div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
#moduleIndex .project-url {
  font-size: 12px;
  color: #ccc;
}
#moduleIndex .downloadable-image {
  background-color: white;
}
#moduleIndex .downloadable-hidden {
  display: none;
}
#moduleIndex .downloadable-details-list {
  background-color: white;
  text-align: left;
  padding: 15px 0px;
}
#moduleIndex .modal-module-creation-modal {
  width: 500px;
}
#moduleIndex .main-msg {
  font-weight: bold;
}
#moduleIndex .note-msg {
  font-size: 14px;
}
#moduleIndex .buttons {
  margin: 20px;
}
#moduleIndex .buttons button:last-child {
  margin-left: 10px;
}
#moduleIndex .hidden {
  visibility: none;
}
/*#moduleIndex .main-options {
  display: flex;
}*/
#moduleIndex .layers h6 {
  font-weight: bold;
  margin: 0px;
}
#moduleIndex .layer-list {
  list-style: none;
  padding: 0px;
  margin: 0px;
  gap:10px;
  display:flex;
}
#moduleIndex .layer-label {
  margin: 0px;
}
#moduleIndex label {
  margin-bottom: 0px;
}
#moduleIndex .layer-chevron {
  font-size: 20px;
  cursor: pointer;
}
#moduleIndex .layer-selected {
  color: #17a2b8;
  font-weight: bold;
}
#moduleIndex .layer-panel {
  display: flex;
}
#moduleIndex .layer-info {
  padding-left: 10px;
  padding-top: 5px;
  margin-left: 5px;
  padding-top: 5px;
  border-left: 1px solid;
  padding-left: 5px;
  border-color: #17a2b8;
  max-height: 90px;
  overflow-y: auto;
  width: 235px;
}
#moduleIndex .all-width {
  width: 100%;
}
#moduleIndex .load-save-container {
  font-size: 10pt;
}
#moduleIndex .diagram {
  /*padding-top: 30px;*/
  background-color: white;
}
#moduleIndex .diagram > table {
  margin: 0 auto;
}
#moduleIndex td {
  margin: 0;
  padding: 0 !important;
  /*border: 0 !important;*/
}
#moduleIndex .f1-step {
  position: relative;
  float: left;
  width: 25%;
  padding: 0 5px;
}

#moduleIndex .fancy-container {
  position: relative;
}

#moduleIndex .fancy {
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px;

  font-weight: bold;
}
#moduleIndex .swal-modal {
  width: 800px !important;
}
#moduleIndex .modal-header {
  background-color: inherit;
  color: inherit;
}
#moduleIndex .search-check {
  text-align: left;
  font-size: 14px;
  padding: 5px 0px;
}

@media print {
  #moduleIndex .not-printable {
    display: none;
  }

  #moduleIndex .right-bar {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    align-items: center;
  }
}

#moduleIndex .bordered-container {
  #moduleIndex .bordered-section {
    border: 1px solid #ccc;
    padding: 5px;
    padding-top: 13px;

    #moduleIndex &.uncollapsed {
      height: 0px;
      overflow: hidden;
      padding: 0;
    }
  }

  #moduleIndex .container-title {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    left: 25px;
    font-size: 19px;
    padding: 0px 10px;
    background: white;
    cursor: pointer;
    position: relative;
    top: 13px;
    cursor: pointer;

    #moduleIndex .container-toggler {
      font-size: 10px;
      position: relative;
      bottom: 3px;
    }
  }
}

.swal-modal{
    width:850px !important;
}
</style>
