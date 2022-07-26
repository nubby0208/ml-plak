<template>
  <div
    class="text-left" 
    v-if="this.object"
  >
    <h5
      class="mt-3"
    >
      Pieza {{this.object.name}}
    </h5>
    <div
      class="row"
    >
      <div
        class="col-12"
      >
        {{this.object.model.replace(/\_/g, ' ')}}
      </div>
    </div>
    <hr>
    <div
      class="row"
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
            :readonly="selectedPieceName === 'Fondo'"
            class="form-control"
            type="text"
            v-model="selectedPieceThickness"
          />
        </div>
        <div
          class="col-4 mx-0 px-1"
        >
          <input
            readonly
            class="form-control"
            type="text"
            :value="selectedPiece.AVeta"
          />
        </div>
        <div
          class="col-4 mx-0 px-1 pr-3"
        >
          <input
            readonly
            class="form-control"
            type="text"
            :value="selectedPiece.LVeta"
          />
        </div>
    </div>
    <div
      class="row mt-1"
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
            <font-awesome-icon
              icon="arrows-alt" 
            /> 
            Posición
          </strong>
        </div>
        <div
          class="col-12 d-flex flex-row justify-content-between"
        >
          <div
            class="ml-0 mr-1"
          >
            <input
              readonly
              class="form-control"
              type="text"
              :value="selectedPiece.X"
            />
          </div>
          <div
            class="mx-1"
          >
          <input 
            readonly
            class="form-control" 
            type="text"
            :value="selectedPiece.Y"
          />
          </div>
          <div
            class="mx-1"
          >
          <input
            readonly
            class="form-control"
            type="text"
            :value="selectedPiece.Z"
          />
          </div>
        </div>
    </div>
    <div 
      class="row mt-1"
    >
        <div 
          class="col-4 text-center"
        >
          <label
            for=""
          >
            X
          </label>
        </div>
        <div
         class="col-4 text-center"
        >
          <label
            for=""
          >
            Y
          </label>
        </div>
        <div 
          class="col-4 text-center"
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
        <!-- selectedPieceName.includes('Puerta') -->
        <b-form-checkbox
          v-model="selectedPieceVisibility"
          switch
          @change="$store.commit('togglePieceVisibility',
              {
                visible: !selectedPiece.visible,
                moduleName: selectedModule.moduleName,
                pieceId: selectedPieceNumber,
                pieceName: selectedPiece.name,
                isRoomEditor: selectedModule.isRoomEditor,
                elementId: selectedPiece.elementId
              }
            )"
        >
          Visible
        </b-form-checkbox>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PieceInfo',

  props:{
    object: {
      type: Object,
      default: null,
    },
  },

  computed: {
    modules () {
      let modulos =  {}      
      const parts = this.$store.getters.getPartList || []      
      const roomEditorParts = this.$store.getters.getRoomEditorPartList || []
      
      roomEditorParts.map(part => {
        part.isRoomEditor = true
        return part
      })

      const allParts = parts.concat(roomEditorParts)

      allParts.forEach((oldPart) => {
        const moduleId = oldPart.Module.split(' ')[1] || null
        const moduleIsVisble = Boolean(this.moduleIsVisibleByName(oldPart)._visible)

        if (!modulos[`Modulo ${moduleId}`]) {
          modulos[`Modulo ${moduleId}`] = {
            pieces: [],
            visible: moduleIsVisble,
            name: `Modulo ${moduleId}`,
            moduleId: Number(moduleId),
            isRoomEditor: Boolean(oldPart.isRoomEditor),
            moduleName: oldPart.Module,
          }
        }

        const newPart = {
          name: oldPart.Name,
          modulo_id: moduleId,
          cantidad: oldPart.Count,
          thickness: oldPart.Espesor,
          AVeta: oldPart.AVeta,
          LVeta: oldPart.LVeta,
          X: oldPart.X,
          Y: oldPart.Y,
          Z: oldPart.Z,
          visible: oldPart.Visible,
          elementId: oldPart.elementId
        }

        modulos[`Modulo ${moduleId}`].pieces.push(newPart)
      })

      return modulos
    },
    selectedModule () {
      return this.modules[this.object.model.replace(/\_/g, ' ')]
    }, 
    selectedPieceName () {
      let selectedPieceName = null
      if (this.$store.state.viewer3d.selection) {
        selectedPieceName = this.$store.state.viewer3d.selection.split('-')[1];
      }      
      return selectedPieceName
    },    
    selectedPieceNumber () {
      let selectedPieceNumber = null
      if (this.$store.state.viewer3d.selection) {
        selectedPieceNumber = Number(this.selectedPieceName.split(' ')[1])
      }      
      return selectedPieceNumber
    },   
    selectedPiece () {
      let selectedPiece = null
      if (this.selectedPieceName) {
        selectedPiece = this.selectedModule.pieces.find(element => element.name === this.selectedPieceName);
      }
      return selectedPiece
    },
    selectedPieceVisibility: {
      get () {
        return this.selectedPiece.visible
      },
      set () {
      }
    },
    selectedPieceThickness: {
      get () {
        return this.selectedPiece.thickness
      },
      set (value) {
        this.$store.commit(
          'setPieceThickness',
          {
            thickness: value,
            moduleName: this.selectedModule.moduleName,
            pieceName: this.selectedPiece.name,
            isRoomEditor: this.selectedModule.isRoomEditor
          }
        )
      }
    },    
  },
  methods: {
    moduleIsVisibleByName (oldPart) {
      // roomeditor modules are identified by looking at its "hundred" property 
      // eg. Module_200 (is roomEditor), Module_1(is not)
      let initialName = oldPart.Module.split(' ')[1]        
      let isRoomEditorPrimitiveIdentifier = initialName.substring(initialName.length - 2)        
      let isRoomEditorModule = isRoomEditorPrimitiveIdentifier === '00'

      if (isRoomEditorModule) {
        let roomEditorModuleIndexWithHundred = String(oldPart.Module.split(' ')[1])
        let roomEditorRealModuleNumber = Number(roomEditorModuleIndexWithHundred.substring(0, roomEditorModuleIndexWithHundred.length - 2))
        let moduleName = `Mod ${roomEditorRealModuleNumber}`

        return this.$store.state.layout.roomEditorModules.find((module) => module.moduleName === moduleName)
      } else {
        let roomEditorModuleNumber = String(oldPart.Module.split(' ')[1])
        let moduleName = `Mod ${roomEditorModuleNumber}`

        return this.$store.state.layout.modules.find((module) => module.moduleName === moduleName)
      }
    }
  }
}
</script>
