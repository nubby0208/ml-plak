import { EventBus } from "@/index";
export default {
    data () {
      return {
        modelsCache: {},
        elementId:null,
        moduleId:null,
        modulo_id:null
      }
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
  
        let allParts = parts.concat(roomEditorParts)

        if(this.selection){
          var objeto = [];
          var elementos = this.selection.split("-");
          var primerElemento, segundoElemento;
    
          return allParts.filter(a => (a.Module == `Mod ${elementos[0].split("_")[1]}` && a.Name == elementos[1]) );
        }
        return [];
      },
      selection () {
        return this.$store.state.viewer3d.selection
      },
      medidasSelect(){
          var w,h,l;
          try {
              if(this.selectedObjectMixer.type == "module"){
                  w = this.selectedModuleLocal.width;
                  h = this.selectedModuleLocal.height;
                  l = this.selectedModuleLocal.z;
              }else{
                  w = this.selectedObjectMixer.w;
                  h = this.selectedObjectMixer.h;
                  l = this.selectedObjectMixer.l;
              }
  
              return {
                  w:w,
                  h:h,
                  l:l,
              };
          } catch (error) {
              return {
                  w:w,
                  h:h,
                  l:l,
              };
          }
      },
      isRoomEditorModule () {
          let selectionName = this.$store.state.viewer3d.selection
          let initialName = selectionName.split('_')[1]
          let isRoomEditorPrimitiveIdentifier = initialName.substring(initialName.length - 2)
          return Boolean(isRoomEditorPrimitiveIdentifier === '00')
      },
      selectedModuleLocal() {
          if(this.$store.state.viewer3d.selection){
              if (this.isRoomEditorModule) {
                  let moduleName = `Mod ${this.selectedModuleNumber}`
                  return  this.$store.state.layout.roomEditorModules.find((module) => module.moduleName === moduleName)
              } else {
                  let moduleName = `Mod ${this.selectedModuleNumber}`
                  return this.$store.state.layout.modules.find((module) => module.moduleName === moduleName)
              }
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
      partList () {
        const builded3DRepresentation = this.build3dRepresentation()
        const normalizedModels = this.normalizeModels(builded3DRepresentation)
        return normalizedModels.modules
      },
      objetoSeleccionado(){
        return this.modules;
      },
      selectedObjectMixer() {
        let viewer3dSelection = this.$store.state.viewer3d.selection
        // console.log(viewer3dSelection);
  
        if (viewer3dSelection) {
          let partListLength = this.partList.length
  
          for (let i = 0; i < partListLength; i++) {
            if (this.partList[i].id === viewer3dSelection) {
              console.log(this.partList[i]);
              return this.partList[i]
            }
  
            let piecesLength = this.partList[i].pieces.length
  
            for (let j = 0; j < piecesLength; j++) {
              if (this.partList[i].pieces[j].id === viewer3dSelection) {
                this.elementId = this.partList[i].pieces[j].elementId;
                this.modulo_id = Number(this.partList[i].pieces[j].modulo_id) - 1;
                if(this.elementId !== this.partList[i].pieces[j].elementId){
                }
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
      EventBus.$off("selectCalco");
      EventBus.$on("selectCalco", ()=>{
        if(this.elementId !== null && this.modulo_id !== null){
          this.$store.commit('clearSelectionMod', null);
          this.$store.commit("selectModule", this.modulo_id);
          this.$store.commit('selectCube', this.elementId);
          EventBus.$emit("eventoChangeModulo");
        }
      });
    },
    methods: {
      isPuerta(name){
        return (
          name.startsWith('Puerta') && 
          !this.isPartOfPuerta(name)
        )
      },
      isPartOfPuerta(name,puertaName){
        return (
          (
            name.startsWith('Puerta') && 
            (
              (name.includes('(') 
              && name.includes(')')) || name.includes('I') || name.includes('D')
            )
          )
          ||
          (
            name.includes("puerta") || name.includes("Puerta")
            && (
              (
                name.startsWith("tapacantos") || name.startsWith("Tapacantos")
              )
              ||
              (
                name.startsWith("Riel") || name.startsWith("riel")
              )
            )
          )
          &&
          name.includes(puertaName)
          &&
          name.includes(puertaName.toLowerCase())
  
        )
      },
      isTapacantosOfPuerta(name,puertaName){
        return (
          name.includes(puertaName.toLowerCase())
        )
      },
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
      },
      moduleIsShowOnlyByName (oldPart) {
        // roomeditor modules are identified by looking at its "hundred" property 
        // eg. Module_200 (is roomEditor), Module_1(is not)
        let initialName = oldPart.Module.split(' ')[1]        
        let isRoomEditorPrimitiveIdentifier = initialName.substring(initialName.length - 2)        
        let isRoomEditorModule = isRoomEditorPrimitiveIdentifier === '00'
  
        if (isRoomEditorModule) {
          let roomEditorModuleIndexWithHundred = String(oldPart.Module.split(' ')[1])
          let roomEditorRealModuleNumber = Number(roomEditorModuleIndexWithHundred.substring(0, roomEditorModuleIndexWithHundred.length - 2))
          let moduleName = `Mod ${roomEditorRealModuleNumber}`
  
          return this.$store.state.layout.roomEditorModules.find((module) => module.moduleName === moduleName)._showOnly
        } else {
          let roomEditorModuleNumber = String(oldPart.Module.split(' ')[1])
          let moduleName = `Mod ${roomEditorModuleNumber}`
  
          return this.$store.state.layout.modules.find((module) => module.moduleName === moduleName)._showOnly
        }
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
            elementId: oldPart.elementId, // defaulteado en el back (a veces cambia)
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
                needsUpdate: true,
                elementId:obj.elementId
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