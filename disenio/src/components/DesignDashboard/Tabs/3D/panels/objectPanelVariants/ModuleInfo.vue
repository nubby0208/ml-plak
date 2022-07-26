<template>
  <div
    class="text-left"
    v-if="this.object"
  >
    <h5
      class="mt-3"
    >
      Modulo {{ this.object.tag.split('_')[1] }}</h5>
    <hr>
    <div
      class="row d-none"
    >
      <div
       class="col-12"
      >
        <strong>
          <font-awesome-icon
            icon="ruler"
          />
           Medidas
        </strong>
      </div>
      <div
       class="col-4 mx-0 px-1 pl-3"
      >
      <input
        class="form-control"
        type="text"
        @change="update('height', $event.target.value)"
        :value="parseInt(this.object.height)"
      />
      </div>
      <div
        class="col-4 mx-0 px-1"
      >
        <input
          class="form-control"
          type="text"
          @change="update('width', $event.target.value)"
          :value="parseInt(this.object.width)"
        />
      </div>
      <div
        class="col-4 mx-0 px-1 pr-3"
      >
        <input
          class="form-control"
          type="text"
          @change="update('depth', $event.target.value)"
          :value="parseInt(this.object.depth)"
        />
      </div>
    </div>
    <div
      class="row mt-1 d-none"
    >
      <div
        class="col-4 text-center"
      >
        <label
          for=""
        >
          Espesor
        </label>
      </div>
      <div
        class="col-4 text-center"
      >
        <label
          for=""
        >
          Ancho
        </label>
      </div>
      <div
        class="col-4 text-center"
      >
        <label
          for=""
        >
          Longitud
        </label>
      </div>
    </div>
    <div
     class="row"
    >
      <div
        class="col-12"
      >
        <strong>
          <font-awesome-icon icon="arrows-alt" /> Posición
        </strong>
      </div>
      <div
        class="col-12 d-flex flex-row justify-content-between"
      >
        <div
          class="ml-0 mr-1"
        >
          <input
            @change="$store.commit(
              'setAllAxis',
              {
                isRoomEditor: selectedModule.isRoomEditor,
                moduleName: object.tag.replace('_', ' '),
                x:$event.target.value
                }
              ); reloadIndicadorModule()"
              class="form-control"
              type="text"
              :value="parseInt(selectedModule._x)"
          />
        </div>
        <div
          class="mx-1"
        >
          <input
            class="form-control"
            type="text"
            @change="$store.commit(
              'setAllAxis',
              {
                isRoomEditor: selectedModule.isRoomEditor,
                moduleName: object.tag.replace('_', ' '),
                y: $event.target.value
              }
            );reloadIndicadorModule()"
            :value="parseInt(selectedModule._y)"
          />
        </div>
        <div
          class="mx-1"
        >
          <input
            class="form-control"
            type="text"
            @change="$store.commit(
              'setAllAxis',
              {
                isRoomEditor: selectedModule.isRoomEditor,
                moduleName: object.tag.replace('_', ' '),
                z:$event.target.value
              }
            ); reloadIndicadorModule()"
            :value="parseInt(selectedModule._z)"
          />


          
        </div>


          <!-- <div class="mr-0 ml-1">
            <button
              disabled
              @click="toggleDragging"
              class="btn btn-primary"
              :title="this.rotating ? 'Editar' : 'Guardar'"
            >
                <span class="float-right">
                  <font-awesome-icon :icon="this.dragging ? 'check' : 'edit'" />
                </span>
            </button>
          </div> -->
      </div>
    </div>
    <div
      class="row mt-1"
    >
      <div
        class="col-3 text-center"
      >
        <label
          for=""
        >
          X
        </label>
      </div>
      <div
        class="col-3 text-center"
      >
        <label
          for=""
        >
          Y
        </label>
      </div>
      <div
        class="col-3 text-center"
      >
        <label
          for=""
        >
          Z
        </label>
      </div>
    </div>
    <div
      class="row"
    >
      <div
        class="col-12"
      >
        <strong>
          <font-awesome-icon
            icon="sync-alt"
          />
           Rotación
        </strong>
      </div>
      <div
        class="col-12 d-flex flex-row justify-content-between"
      >
        <div
          class="ml-0 mr-1"
        >
          <input
            class="form-control"
            type="text"
            @change="$store.commit(
              'setAllAxis',
              {
                isRoomEditor: selectedModule.isRoomEditor,
                moduleName: object.tag.replace('_', ' '),
                rx:$event.target.value
              }
            );reloadIndicadorModule()"
            :value="parseInt(selectedModule._rx)"
          />
        </div>
        <div
          class="mx-1"
        >
          <input
            class="form-control"
            type="text"
            @change="$store.commit(
              'setAllAxis',
              {
                isRoomEditor: selectedModule.isRoomEditor,
                moduleName: object.tag.replace('_', ' '),
                ry:$event.target.value
              }
            );reloadIndicadorModule()"
            :value="parseInt(selectedModule._ry)"
          />
        </div>
        <div
          class="mx-1"
        >
          <input
            class="form-control"
            type="text"
            @change="$store.commit(
              'setAllAxis',
              {
                isRoomEditor: selectedModule.isRoomEditor,
                moduleName: object.tag.replace('_', ' '),
                rz:$event.target.value
              }
            );reloadIndicadorModule()"
            :value="parseInt(selectedModule._rz)"
          />
        </div>
        <!-- <div class="mr-0 ml-1">
          <button
            disabled
            @click="toggleRotating"
            class="btn btn-primary"
            :title="this.rotating ? 'Editar' : 'Guardar'"
          >
            <span class="float-right">
              <font-awesome-icon
                :icon="this.rotating ? 'check' : 'edit'"
              />
            </span>
          </button>
        </div> -->
      </div>
    </div>
    <div
      class="row mt-1"
    >
      <div
        class="col-3 text-center"
      >
        <label for=""
        >
          X
        </label>
      </div>
      <div
        class="col-3 text-center"
      >
        <label
          for=""
        >
          Y
        </label>
      </div>
      <div
        class="col-3 text-center"
      >
        <label
          for=""
        >
          Z
        </label>
      </div>
    </div>
    <div
      class="row"
    >
      <div
        class="col-12"
      >
        <b-form-checkbox
          v-model="selectedModuleVisibility"
          switch
        >
          Visible
        </b-form-checkbox>
        <b-form-checkbox
          id="checkboxEjesTraslation"
          v-model="selectedModuleTransformControls_Traslation"
          switch
        >
          <label 
            for="checkboxEjesTraslation"
            style="user-select: none"
          >
            Ver ejes de Traslación
          </label>          
        </b-form-checkbox>
        <b-form-checkbox
          id="checkboxEjesRotation"
          v-model="selectedModuleTransformControls_Rotation"
          switch
        >
          <label
            for="checkboxEjesRotation"
            style="user-select: none"
          >
            Ver ejes de Rotación
          </label>          
        </b-form-checkbox>        
      </div>
    </div>
    <div
      class="row mt-3"
    >
      <div
        class="col-12"
      >
        <strong style="user-select: none">
          Detalles
        </strong>
      </div>
      <div
        class="col-12"
      >
        <b-row
          class="pt-2"
        >
          <b-col
            class="text-size"
            cols="12"
          >

            <div> Alto: {{selectedModule.height}}mm </div>
            <div> Ancho: {{selectedModule.width}}mm </div>
            <div> Profundidad: {{selectedModule.z}}mm </div>
            
          </b-col>
          <b-col
            cols="12"
          >
            
          </b-col>
        </b-row>
        <b-row
          class="pt-2"
        >
          <b-col
            cols="12"
          >
            Material por defecto:
          </b-col>
          <b-col
            cols="12"
          >
            <b-form-select
              :value="defaultMaterial"
              @change="onMaterialChange"
              :options="availableMaterials"
              text-field="name"
              value-field="material"
            />
          </b-col>
        </b-row>
        <b-row
          class="pt-2"
        >
          <b-col
            cols="12"
          >
            Tapacantos por defecto:
          </b-col>
          <b-col
            cols="12"
          >
            <b-form-select
              :disabled="isRoomEditorModule"
              :value="defaultTapacanto"
              @change="onTapacantosChange"
              :options="availableTapacantos"
              value-field="nombre"
              text-field="nombre"
            />
          </b-col>
        </b-row>
        <b-row
          class="pt-2"
        >
          <b-col
            cols="12"
          >
            Material para fondo:
          </b-col>
          <b-col
            cols="12"
          >
            <b-form-select
              :value="selectedModule.fondo"
              @change="onMaterialFondoChange"
              :options="availableMaterials.concat({name: 'Sin Fondo', material: null})"
              text-field="name"
              value-field="material"
            />
          </b-col>
        </b-row>
        <b-row
          class="pt-2"
        >
          <b-col
            cols="12"
          >
            Descripción:
          </b-col>
          <b-col
            cols="12"
          >
            <b-form-textarea
              :value="selectedModule.settings.description"
              @change="onDescriptionChange"
            />
          </b-col>
        </b-row>
        <b-row
          class="pt-2"
        >
          <b-col
            cols="12"
          >
            Comentario:
          </b-col>
          <b-col
            cols="12"
          >
            <b-form-textarea
              :value="selectedModule.settings.comentario"
              @change="onCommentaryChange"
            />
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import { constrainPoint } from '../../../../../../../assets/js/fullcalendar'
import { ViewerStatesEnum } from '../../../../Tools/models/enums'
import { EventBus } from '../../utils/event-bus'

export default {
  name: 'Module',
  data () {
    return {
      dragging: false,
      rotating: false,

      material: null,
      tapacanto: null,
      materialFondo: null,

      moveWithTraslationAxe: false,
      moveWithRotationAxe: false,
    }
  },
  props:{
    object: {
      type: Object,
      default: null,
    },
  },
  computed: {
    isRoomEditorModule () {
      let selectionName = this.$store.state.viewer3d.selection
      let initialName = selectionName.split('_')[1]
      let isRoomEditorPrimitiveIdentifier = initialName.substring(initialName.length - 2)
      return Boolean(isRoomEditorPrimitiveIdentifier === '00')
    },
    selectedModule () {
      if (this.isRoomEditorModule) {
        let moduleName = `Mod ${this.selectedModuleNumber}`
        return  this.$store.state.layout.roomEditorModules.find((module) => module.moduleName === moduleName)
      } else {
        let moduleName = `Mod ${this.selectedModuleNumber}`
        return this.$store.state.layout.modules.find((module) => module.moduleName === moduleName)
      }
    },
    selectedModuleNumber () {
      let selectedModuleNumber = null
      let viewer3dSelection = this.$store.state.viewer3d.selection

      if (viewer3dSelection && !this.isRoomEditorModule) {
        selectedModuleNumber = Number(viewer3dSelection.split('_')[1]);
      } else if (viewer3dSelection && this.isRoomEditorModule) {
        let roomEditorModuleIndexWithHundred = String(viewer3dSelection.split('_')[1])
        let roomEditorRealModuleIndex = Number(roomEditorModuleIndexWithHundred.substring(0, roomEditorModuleIndexWithHundred.length - 2))

        selectedModuleNumber = roomEditorRealModuleIndex
      }

      return selectedModuleNumber
    },
    selectedModuleVisibility: {
      get () {
        return this.selectedModule._visible
      },
      set (value) {
        this.$store.commit(
          'toggleModuleVisibility',
          {
            isRoomEditor: this.selectedModule.isRoomEditor,
            moduleName: this.object.tag.replace('_', ' '),
            _visible: value,
          }
        )
      }
    },

    /**
     * Traslation Controls
     */
    selectedModuleTransformControls_Traslation: {
      get () {
        return this.moveWithTraslationAxe
      },
      set (value) {
        this.moveWithTraslationAxe = value

        if (value) {
          this.moveWithRotationAxe = !value
        }

        EventBus.$emit('updateTransformControlsStatus', {
          "traslationStatus": this.moveWithTraslationAxe,
          "rotationStatus": this.moveWithRotationAxe,
          "setAllAxisFN":this.setAllAxisFN,
          "toggleTranslacion":this.toggleTranslacion,
          "toggleRotate":this.toggleRotate
        })
        
      }
    },

    /**
     * Rotation Controls
     */
    selectedModuleTransformControls_Rotation: {
      get () {
        return this.moveWithRotationAxe
      },
      set (value) {
        this.moveWithRotationAxe = value

        if (value) {
          this.moveWithTraslationAxe = !value
        }

        EventBus.$emit('updateTransformControlsStatus', {
          "traslationStatus": this.moveWithTraslationAxe,
          "rotationStatus": this.moveWithRotationAxe,
          "setAllAxisFN":this.setAllAxisFN,
          "toggleTranslacion":this.toggleTranslacion,
          "toggleRotate":this.toggleRotate
        })
        
      }
    },

    availableTapacantos () {
      return this.$store.getters.getTapacantosAdd
    },
    availableMaterials () {
      const materiales = this.$store.state.general.materiales_add
      if (!materiales) {
        return []
      }
      return JSON.parse(materiales).map(m => {
        return {
          name: m.material,
          material: m.material,
        }
      })
    },
    defaultMaterial () {
      const material = this.$store.state.general[this.isRoomEditorModule ? 'material_default_por_modulo_room_editor' : 'material_default_por_modulo'][this.selectedModuleNumber - 1]
      const materialDoubleQuoteWorkaround = material.substring(1, material.length - 1)
      return materialDoubleQuoteWorkaround
    },
    defaultTapacanto () {
      if (!this.isRoomEditorModule) {
        const tapacanto = this.$store.state.general[this.isRoomEditorModule ? 'tapacantos_default_por_modulo_room_editor' : 'tapacantos_default_por_modulo'][this.selectedModuleNumber - 1]      
        return JSON.parse(tapacanto).nombre;
      } else {
        return null
      }
    },
  },
  methods: {
    toggleTranslacion(payload){
      this.selectedModuleTransformControls_Traslation = false;
      setTimeout(() => {
        this.selectedModuleTransformControls_Traslation = true;
      }, 50);
    },
    toggleRotate(payload){
      this.selectedModuleTransformControls_Rotation = false;
      setTimeout(() => {
        this.selectedModuleTransformControls_Rotation = true;
      }, 50);
    },
    setAllAxisFN(payload){
      // alert();

      console.log(payload);

      this.$store.commit(
      'setAllAxis',
      {
        isRoomEditor: this.selectedModule.isRoomEditor,
        moduleName: this.object.tag.replace('_', ' '),
        [payload.key]:payload.valor
      }
      );
      
      
      // this.reloadIndicadorModule();
    },
    onTapacantosChange (newTapacantoName) {
      let newTapacanto = this.availableTapacantos.find(tapacanto =>  tapacanto.nombre === newTapacantoName)
      if (this.$store.getters.selectedModule.elements.length > 0) {
        this.$swal('Esta acción aplicará sólo a este módulo', {
          title: 'Cambiar tapacantos por defecto',
          icon: 'warning',
          buttons: {
            default: {
              text: 'Solo las que ya tienen tapacantos',
              value: 0
            },
            empty: {
              text: 'Solo las que no tienen tapacantos',
              value: 1
            },
            all: {
              text: 'Cambiar a todas las piezas',
              value: 2
            }
          }
        }).then((result) => {
          this.$store.commit('setGeneralProperty', { key: 'tapacantos_default', value: JSON.stringify(newTapacanto) })
          this.$store.commit('updatePiecesTapacantos', { tapacanto: newTapacanto, update: result })
          this.$store.commit('setDefaultTapacantosForModule', { tapacantos: newTapacanto, module: this.selectedModuleNumber, ambienteEnabled: this.isRoomEditorModule })
        })
      } else {
        this.$store.commit('setGeneralProperty', { key: 'tapacantos_default', value: JSON.stringify(newTapacanto) })
        this.$store.commit('updatePiecesTapacantos', { tapacanto: newTapacanto, update: 0 })
        this.$store.commit('setDefaultTapacantosForModule', { tapacantos: newTapacanto, module: this.selectedModuleNumber, ambienteEnabled: this.isRoomEditorModule })
      }
    },
    onMaterialChange (newMaterial) {
      if (this.selectedModule.elements.length > 0) {
        this.$swal('Esta acción aplicará sólo a este módulo', {
          title: 'Cambiar el material por defecto',
          icon: 'warning',
          buttons: {
            default: {
              text: 'Solo las que ya tienen material',
              value: 0
            },
            empty: {
              text: 'Solo las que no tienen material',
              value: 1
            },
            all: {
              text: 'Cambiar a todas las piezas',
              value: 2
            }
          }
        }).then((result) => {
          this.$store.commit('setGeneralProperty', { key: 'material_default', value: JSON.stringify(newMaterial) })

          this.$store.commit(
            'updatePiecesMaterial',
            {
              material: newMaterial,
              update: result,
              existingModule: {
                isRoomEditor: this.selectedModule.isRoomEditor,
                moduleName: this.object.tag.replace('_', ' ')
              }
            }              
          )

          this.$store.commit('setDefaultMaterialForModule', { material: newMaterial, module: this.selectedModuleNumber, ambienteEnabled: this.isRoomEditorModule })
        })
      } else {
        this.$store.commit('setGeneralProperty', { key: 'material_default', value: JSON.stringify(newMaterial) })
        this.$store.commit('updatePiecesMaterial', { material: newMaterial, update: 0 })
        this.$store.commit('setDefaultMaterialForModule', { material: newMaterial, module: this.selectedModuleNumber, ambienteEnabled: this.isRoomEditorModule })
      }
    },
    onMaterialFondoChange (newMaterial) {
      this.$store.commit(
        'updateMaterialFondo',
        {
          material: newMaterial,
          existingModule: {
            isRoomEditor: this.selectedModule.isRoomEditor,
            moduleName: this.object.tag.replace('_', ' ')
          }
        }              
      )
    },
    onDescriptionChange (newDescription) {
      this.$store.commit(
        'updateDescription',
        {
          description: newDescription,
          existingModule: {
            isRoomEditor: this.selectedModule.isRoomEditor,
            moduleName: this.object.tag.replace('_', ' ')
          }
        }              
      )
    },
    onCommentaryChange (newCommentary) {
      this.$store.commit(
        'updateCommentary',
        {
          commentary: newCommentary,
          existingModule: {
            isRoomEditor: this.selectedModule.isRoomEditor,
            moduleName: this.object.tag.replace('_', ' ')
          }
        }              
      )
    },
    update: function (attr, value) {
      let payload = Object.assign({}, this.selectedModule)
      payload[`_${attr}`] = value

      this.$store.commit('updateObject', payload)
    },
    toggleDragging () {
      this.rotating = false
      if (this.$store.state.viewer3d.state === ViewerStatesEnum.DRAGGING) {
        this.$store.state.viewer3d.state = ViewerStatesEnum.NORMAL
        this.dragging = false
      } else {
        this.$store.state.viewer3d.state = ViewerStatesEnum.DRAGGING
        this.dragging = true
      }
    },
    toggleRotating () {
      this.dragging = false
      if (this.$store.state.viewer3d.state === ViewerStatesEnum.ROTATING) {
        this.$store.state.viewer3d.state = ViewerStatesEnum.NORMAL
        this.rotating = false
      } else {
        this.$store.state.viewer3d.state = ViewerStatesEnum.ROTATING
        this.rotating = true
      }
    },

    reloadIndicadorModule(){
      setTimeout(EventBus.$emit('reloadIndicadorModule'), 2500)      
    }

   

  },
  watch: {
    object (n, o) {
      if (n.id !== o.id && (this.rotating || this.dragging)) {
        this.$store.state.viewer3d.state = ViewerStatesEnum.NORMAL
        this.rotating = false
        this.dragging = false
      }
    }
  }
}
</script>

<style scoped>
.no-border{
  border: 0px;
}

.text-size{
  font-size: 11pt;
}

</style>
