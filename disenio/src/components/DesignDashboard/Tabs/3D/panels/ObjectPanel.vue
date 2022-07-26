<template>
  <div
    class="h-100"
  >
    <div
      v-if="selectedObject || selectedObjectCad"
    >
      <b-button
        block
        @click="clearSelection"
      >
        Deseleccionar
      </b-button>

      <GrupoCadInfo
        :object="selectedObjectCad"
        v-if="selectedObjectCad"
      />

      <ModuleInfo
        :object="selectedObject"
        v-else-if="selectedObject.type=='module'"
      />

      <PieceInfo
        :object="selectedObject"
        v-else-if="selectedObject.type=='piece'"
      />
    </div>

    <div
      v-else
    >
      <p
        class="mb-2 pt-3"
        style="color: #c2c2c2; font-size: 5.5rem"
      >
        <b-icon
          icon="exclamation-circle-fill"
        />
      </p>
        <span
          style="color: #6C757D"
        >
          Selecciona una pieza para ver su información.
        </span>
    </div>
  </div>
</template>

<script>
import ModuleInfo from './objectPanelVariants/ModuleInfo.vue'
import GrupoCadInfo from './objectPanelVariants/GrupoCadInfo.vue'
import PieceInfo from './objectPanelVariants/PieceInfo.vue'
import viewer from '@/components/DesignDashboard/Tabs/3D/classes/viewer.js'
import {RotacionCad, PosicionCad} from "@/models/models.ts";

export default {
  name: 'ObjectPanel',
  components: {
    ModuleInfo,
    PieceInfo,
    GrupoCadInfo
  },
  data () {
    return {
      modelsCache: {},
    }
  },
  computed: {
    partList () {
      const builded3DRepresentation = this.build3dRepresentation()
      const normalizedModels = this.normalizeModels(builded3DRepresentation)
      return normalizedModels.modules
    },
    selectedObjectCad(){
      var nombre = this.$store.state.viewer3d.selection;
      // return nombre;
      if(/^grupo_/i.test(nombre)){
        var indiceGrupo = nombre.match(/(?!grupo_cad_)(\d+)/ig);
        // return `${nombre}:${indiceGrupo[0]}`;
        var cads = JSON.parse(this.$store.state.layout.DesignObject);

        if(indiceGrupo[0]){
          cads.grupos[indiceGrupo[0]].indexGrupo = indiceGrupo[0];
          var rotacion = new RotacionCad(cads.grupos[indiceGrupo[0]].rotacion);
          cads.grupos[indiceGrupo[0]].rotacion = rotacion;

          var posicion = new PosicionCad(cads.grupos[indiceGrupo[0]].posicion);
          cads.grupos[indiceGrupo[0]].posicion = posicion;
          return cads.grupos[indiceGrupo[0]];
        }
        
      }

      if(/^cad_/i.test(nombre)){
        // return "Cad";
        return false;
      }

      return false;
    },
    selectedObject () {
      let viewer3dSelection = this.$store.state.viewer3d.selection

      if (viewer3dSelection) {
        let partListLength = this.partList.length

        for (let i = 0; i < partListLength; i++) {
          if (this.partList[i].id === viewer3dSelection) {
            return this.partList[i]
          }

          let piecesLength = this.partList[i].pieces.length

          for (let j = 0; j < piecesLength; j++) {
            if (this.partList[i].pieces[j].id === viewer3dSelection) {
              return this.partList[i].pieces[j]
            }
          }
        }
      }
      else {
        return null
      }
    }
  },
  mounted: function () {
    this.clearSelection()
  },
  methods: {
    setRotacion(){
      this.$store.commit('setRotacionGrupoCad', {index:this.count, rotacion:{ x:90 }});
    },
    clearSelection () {
      this.$store.commit('updateSelection', null)
    },
    build3dRepresentation () {
      const parts = this.$store.getters.getPartList.concat(this.$store.getters.getRoomEditorPartList) || []      
  
      let modulos =  {}  

      parts.forEach((oldPart) => {
        const moduleId = oldPart.Module.split(' ')[1] || null

        if (!modulos[`Modulo ${moduleId}`]) {
          modulos[`Modulo ${moduleId}`] = []
        }

        const newPart = {
          pieza: oldPart.Name,
          modulo_id: moduleId,
          cantidad: oldPart.Count,
          posicion_x: oldPart.X,
          posicion_y: oldPart.Y,
          posicion_z: oldPart.Z,
          rotacion_x: 0,
          rotacion_y: 0,
          rotacion_z: 0,
          lveta: oldPart.LVeta,
          aveta: oldPart.AVeta,
          espesor: oldPart.Espesor,
          orientacion: oldPart.Orientacion,
          material_name: oldPart.Material,
          color: "", // no encontrado
          estado_id: 1, // desde el back es 1
          prearmado_estado_id: 1, // desde el back es 1
          proyecto_name: this.$store.state.info.token_project,
          cliente_name: "default", // defaulteado en el back (a veces cambia)
          // visible: false
          visible: oldPart.Visible !== undefined && oldPart.Visible === false ? oldPart.Visible : true // All pieces start visible
        }

        modulos[`Modulo ${moduleId}`].push(newPart)
      })
  
      const output = {
        modulos,
      }
      return output
    },
    normalizeModels (data) {

      const materiales = []
      const models = {}
      const modelsVuex = []// busca datos extras de los modulos en vuex para ser agregados a los datos de la api
      const modelTextures = [] // texturas usadas en este modelo

      Object
      .keys(data.modulos)
      .forEach( (t, index) => {
        const tagModulo = t.replace(/ /g, '_')

        const piezas = data.modulos[t]
        const parsedData = []
        let pieceData = {}
        let piezasLength = piezas.length

        for (let j = 0; j < piezasLength; j++) {

          let obj = piezas[j]

          if (obj.length !== 0) {
            materiales.push(obj.material_name)
            pieceData = {
              id: tagModulo + '-' + obj.pieza,
              type: 'piece',
              index: parsedData.length,
              visible: obj.visible,
              wireframe: true,
              name: obj.pieza,
              material: obj.material_name,
              l: parseFloat(obj.lveta),
              w: parseFloat(obj.aveta),
              h: parseFloat(obj.espesor),
              orientation: parseInt(obj.orientacion),
              color: obj.color || '0xF5F5F5',
              texture: obj.textura,
              y: parseFloat(obj.posicion_y),
              x: parseFloat(obj.posicion_x),
              z: parseFloat(obj.posicion_z),
              pattern: {
                frontWidth: 0.0
              },
              model: tagModulo,
              modulo_id: obj.modulo_id,
              needsUpdate: true
            }

            if (pieceData.w === 0 || pieceData.h === 0 || pieceData.l === 0) {
              continue
            }

            if (this.isPieceValid(pieceData)) {
              parsedData.push(pieceData)
              modelTextures.push(pieceData.material)
              // NOTA: lo ideal es que pieceData.material sea el id del material y no el nombre
              // por ahora se programara con el nombre
            }
          }
        } 
        
        this.modelsCache[pieceData.modulo_id] = piezas

        const current = this.$store.state.viewer3d.modules.find(d => d.id === tagModulo)
        // const current = false

        let model = Object.assign(
          {
            id: tagModulo,
            type: 'module',
            pieces: parsedData,
            guid: tagModulo,
            tag: tagModulo,
            x: 0,
            y: 0,
            z: 0,
            rx: 0,
            ry: 0,
            rz: 0,
            visible: current ? current.visible : true,
            needsUpdate: true
          },
          modelsVuex[index]
        )
        
        models[model.id] = model
        models[model.id].pieces = parsedData
      })
      
      const uniqueTextures = [new Set(modelTextures)]      
      const modules = Object.values(models)

      return {
        modules,
        uniqueTextures,
      }

    },
    isPieceValid (d) {
      return !(isNaN(d.orientation) || isNaN(d.x) || isNaN(d.y) || isNaN(d.z))
    },
  }
}
</script>

<style scoped>
.card{
  width: 100%;
}
</style>
