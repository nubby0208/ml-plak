import { CajonTipo, PuertaTipo, ModulosExternosEnum, PiezasporModulosExternosEnum, EspesorEnum, ElementType, ModuleLType, TapacantoEnum } from './../models/enums';
import {
  Element, Separator, SeparatorDividido, Cube, Cajon, ModuleConfiguration,
  Part, Barral, Bandeja, DobleFondo, Puerta, PuertaCorrediza, Modulo, TapacantoSetting, PiezaManual, ModuloExterno, Liston, Riel, RotacionCad, PosicionCad
} from './../models/models';
import { ModuleLayout, TipoDeBaseEnum, EstanteFlotanteEnum } from '../models/enums';
import PLACEHOLDERS from '../assets/placeholders';
import Vue from 'vue'
import { getParseTreeNode } from 'typescript';
import { getPartsOfModulo, setPieceVisibility } from './utils'
import {HTTP} from "../index";

let errorsIn3dCache: any = [];
/**
 * 
 */
let getParts = function (state: any, getters: any, isRoomEditorParts: boolean) {
  
  let modulosExport: any = []
  let parts: Part[] = []
  const modules = Modulo.getActivatedModules(isRoomEditorParts);
  modules.forEach((modulo: Modulo, index: number) => {
    const modName = isRoomEditorParts ? 'Mod ' + (index + 1) * 100 : 'Mod ' + (index + 1);
    modulosExport[modName] = {
      'rx': modulo._rx,
      'ry': modulo._ry,
      'rz': modulo._rz
    };
    
    // Recorrer cajones
    
    //console.log(getPartsOfModulo(state, getters, modulo, modName, isRoomEditorParts))
    parts = parts .concat( getPartsOfModulo(state, getters, modulo, modName, isRoomEditorParts))
    
  });  
  
  return parts;
}

/**
 * Devuelve el precio de un material, herraje, kit, tapacanto, etc
 */
let getPrice = function (itemName: string) {
  const materiales = Element.getters.getMaterialesAdd;
  const material = materiales.find((m: any) => m.material === itemName);
  if (material) {
    return material.precio_mt2 || material.precio_placa;
  }

  const tapacantos = Element.getters.getTapacantosAdd;
  const tapacanto = tapacantos.find((t: any) => t.nombre + ' - ' + t.material === itemName);
  if (tapacanto) {
    return tapacanto.precio_mt2;
  }


  const herrajes = Element.getters.getHerrajesAdd;
  const herraje = herrajes.find((h: any) => h.nombre === itemName || (h.material + ' - ' + h.nombre) === itemName || (h.material + ' ' + h.nombre) === itemName);
  if (herraje) {
    return herraje.precio_mt2;
  }


  const metalesYKits = Element.getters.getMetalesAdd;
  const metalOKit = metalesYKits.find((m: any) => m.material === itemName);
  if (metalOKit) {
    return metalOKit.precio_mt2;
  }

  return 0;
}

/**
 * Crea la lista de los materiales que se estan usando en el proyecto. 
 * Incluye la cantidad, descripcion y extras
 */
let crearListaMateriales = function () {
  let materials: any = {};
  let parts = Element.getters.getPartList.filter((part: any) => !part.Only3d);
  const initMaterial = function (materials: any, mat: string, isTapacanto: boolean, unidad: string, type: string) {
    if (!materials[mat]) {
      materials[mat] = {
        nombreOriginal: mat,
        tipo: type,
        cantidad: 0,
        cantidadManual: 0,
        value: getPrice(mat),
        unidad,
        nombre: mat,
        desperdicio: isTapacanto ? 50 : 0,
        tapacanto: isTapacanto,
        detalle: undefined,
        extra1: undefined,
        extra2: undefined,
        estado: undefined
      };
    }
  };
  const addTapacanto = function (materials: any, tapacanto: string, part: any) {
    if (part.tapacantos[tapacanto] && part.tapacantos[tapacanto].material) {
      const name = part.tapacantos[tapacanto].nombre + ' - ' + part.tapacantos[tapacanto].material;
      if (name !== 'NO') {
        initMaterial(materials, name, true, 'mts', 'tapacanto');
        const pieza = (Element.GetElement(part._Id) as any);
        let length;
        const vetaVertical = pieza.cajon && pieza.sentidoVeta === 'vertical';
        if (pieza.cajon || pieza.puerta) {
          if (!vetaVertical) {
            length = tapacanto === 'inferior' || tapacanto === 'superior' ? part.LVeta : part.AVeta;
          } else {
            length = tapacanto === 'inferior' || tapacanto === 'superior' ? part.AVeta : part.LVeta;
          }
        } else {
          length = tapacanto === 'inferior' || tapacanto === 'superior' ? part.AVeta : part.LVeta;
        }

        if (Element.state.materials[name] && Element.state.materials[name].desperdicio >= 0) {
          length += +(Element.state.materials[name] && Element.state.materials[name].desperdicio); // el desperdicio persistido
        } else {
          length += 50;  // nunca fue seteado, el desperdicio default
        }
        materials[name].cantidad += length / 1000;
      }
    }
  };

  parts.forEach((part: any) => {
    const p = Element.GetElement(part._Id);

    // material
    const name = part.Name;
    if (name.indexOf('Barral') > -1) {
      // barral
      initMaterial(materials, part.Material, false, 'mts', 'material');
      materials[part.Material].cantidad += part.LVeta / 1000;
    } else if (name.indexOf('Cajon') > -1) {
      // cajones
      if ((name.indexOf('Frente Cajon') > -1)) {
        const cajon = (Element.GetElement(part._Id) as any);
        initMaterial(materials, cajon.frenteMaterial, false, 'mts2', 'material');
        materials[cajon.frenteMaterial].cantidad += (part.LVeta * part.AVeta) / 1000000;
        const corredera = cajon.corredera;
        if (corredera) {
          //corredera
          initMaterial(materials, corredera, false, '', 'herraje');
          materials[corredera].cantidad += 1;
        }
      }

      if (name.indexOf('Base Cajon') > -1) {
        initMaterial(materials, part.Material, false, 'mts2', 'material');
        materials[part.Material].cantidad += (part.LVeta * part.AVeta) / 1000000;
      }

      if ((name.indexOf('Lat. Cajon') > -1) || (name.indexOf('C/F Cajon') > -1)) {
        initMaterial(materials, part.Material, false, 'mts2', 'material');
        materials[part.Material].cantidad += /*2 **/ (part.LVeta * part.AVeta) / 1000000;
      }
    } else if ((name.indexOf('Puerta') > -1) && (!(p as any).piezaManual)) {
      // puertas
      const puerta = (Element.GetElement(part._Id) as any).puerta;
      if (puerta.corrediza) {
        initMaterial(materials, puerta.puertas[part['puerta_index']].material, false, 'mts2', 'material');
        materials[puerta.puertas[part['puerta_index']].material].cantidad += (part.LVeta * part.AVeta) / 1000000;
      } else {
        initMaterial(materials, puerta.material, false, 'mts2', 'material');
        materials[puerta.material].cantidad += (part.LVeta * part.AVeta) / 1000000;
      }

      if (!puerta.corrediza && puerta.bisagraTipo) {
        // bisagras
        const h = Element.getters.getHerrajesAdd.find((h: any) => h.nombre === puerta.bisagraTipo);
        const name = h.material + ' ' + puerta.bisagraTipo;
        initMaterial(materials, name, false, '', 'herraje');
        materials[name].cantidad += 2;
      }
    } else if (name.indexOf('Riel') > -1) {
      // puertas corredizas
      initMaterial(materials, part.Material, false, '', 'metal');
      materials[part.Material].cantidad += 0.5; // sumo solo 0.5 para que con el riel superior y el inferior la suma de 1
    } else if (name.indexOf('Bandeja') > -1) {
      // bandeja
      const bandeja = (Element.GetElement(part._Id) as Bandeja);
      initMaterial(materials, part.Material, false, 'mts2', 'material');
      materials[part.Material].cantidad += (part.LVeta * part.AVeta) / 1000000;
      const corredera = bandeja.corredera;
      if (corredera) {
        //corredera
        initMaterial(materials, corredera, false, '', 'herraje');
        materials[corredera].cantidad += 1;
      }
    } else {
      const material = part.Material || '**Sin material**'
      initMaterial(materials, material, false, 'mts2', 'material');
      materials[material].cantidad += (part.LVeta * part.AVeta) / 1000000;
    }

    // tapacantos
    if (part.tapacantos) {
      for (let i = 0; i < part.Count; i++) {
        addTapacanto(materials, 'derecho', part);
        addTapacanto(materials, 'izquierdo', part);
        addTapacanto(materials, 'superior', part);
        addTapacanto(materials, 'inferior', part);
      }
    }
  });

  // actualizo el listado de materiales
  const persistedMaterials = Element.state.materials;
  Object.keys(materials).forEach(key => {
    const m = persistedMaterials[key];
    if (m) {
      (Object as any).assign(materials[key], {
        detalle: m.detalle,
        extra1: m.extra1,
        extra2: m.extra2,
        cantidadManual: m.cantidadManual,
        desperdicio: m.desperdicio,
        estado: m.estado
      });
    }
  });
  Element.state.materials = materials;
  return materials;
}

/**
 * Crea los rieles para una puerta
 * @param material material
 * @param index indice de la puerta
 */
let crearRielesPuertaCorrediza = function (material: any, childIndex: number) {
  // agrego los rieles
  const modulo = Modulo.Selected();
  const elements = modulo.elements;
  const parent = new Cube(null, modulo);
  // const childIndex = Modulo.SelectedIndex();

  parent.childs = [];
  parent.layout = ModuleLayout.Horizontal;
  const leftMostSide = PuertaCorrediza.getLeftMostSide(elements[childIndex]);
  const upperMostSide = PuertaCorrediza.getUpperMostSide(elements[childIndex]);
  const bottomMostSide = PuertaCorrediza.getBottomMostSide(elements[childIndex]);

  // riel inferior
  const rInferior = new Riel(parent, modulo, elements[childIndex].id);
  rInferior.name = 'Riel Inferior puerta ' + elements[childIndex].id;
  rInferior.size = 4;
  rInferior.LVeta = PuertaCorrediza.GetInternalSpaceWidth(elements[childIndex]);
  rInferior.AVeta = 35;
  rInferior.material = material;
  rInferior.Orientacion = 2;
  rInferior.X = Element.GetX(leftMostSide) + leftMostSide.size;
  rInferior.Y = Element.GetY(bottomMostSide) + bottomMostSide.size;
  rInferior.Z = ((bottomMostSide as any).anchoVeta > 0 ? (bottomMostSide as any).anchoVeta - rInferior.AVeta : modulo.z - rInferior.AVeta);

  // riel superior
  const rSuperior = new Riel(parent, modulo, elements[childIndex].id);
  rSuperior.name = 'Riel Superior puerta ' + elements[childIndex].id;
  rSuperior.size = 36;
  rSuperior.LVeta = PuertaCorrediza.GetInternalSpaceWidth(elements[childIndex]);
  rSuperior.AVeta = 85;
  rSuperior.material = material;
  rSuperior.Orientacion = 2;
  rSuperior.X = Element.GetX(leftMostSide) + leftMostSide.size;
  rSuperior.Y = Element.GetY(upperMostSide) - rSuperior.size;
  rSuperior.Z = ((upperMostSide as any).anchoVeta > 0 ? (upperMostSide as any).anchoVeta - rSuperior.AVeta : modulo.z - rSuperior.AVeta);
}

const buildFromJson = function(values: any) {
  const obj: any = {};
  values.forEach((value:any) => {
    obj[value.name] = value.value;
  });
  return obj;
};

export default {
  state: {
    proyectoSinColor:true,
    idColorActive:null,
    idColorPorDefecto:null,
    conexionesDb: [],
    listColores: [],
    coloresModule: {
      "name": null,
      "type": "coloresmodulo",
      "values": {
          "separator": null,
          "separator_virtual": null,
          "imaginary": null,
          "bandeja": null,
          "barral": null,
          "cajon": null,
          "selected": null,
          "separator_selected": null,
          "puerta": null,
          "dobleFondo": null,
          "fondo_manual": null,
          "dobleFondo_fondo_manual": null,
          "puerta_corrediza": null,
          "puerta_manual": null,
      },
      "id": "default"
    },
    showCad3d:false,
    coloresModuleDefaul: {
      separator:"#87ceeb", //--color-separador
      separator_virtual:"#009688", //--color-separador-virtual
      imaginary:"#808080", //--color-imaginary
      bandeja:"#ffa500", //--color-bandeja
      barral:"#a52a2a", //--color-barral
      cajon:"#deb887", //--color-cajon
      selected:"#dbdbdb", //--color-selected
      separator_selected:"#32cd32", //--color-separator-selected
      puerta:"#4e5ea0", //--color-puerta
      dobleFondo:"#f0680d", //--color-dobleFondo
      fondo_manual:"#ecc13f", //--color-fondo-manual
      dobleFondo_fondo_manual:"#e8aeae", //--color-dobleFondo-fondo-manual
      puerta_corrediza:"#2196f3", //--color-puerta-corrediza
      puerta_manual:"#0d90a0", //--color-puerta-manual
    },
    modules: [new Modulo()],
    roomEditorModules: [new Modulo(true)],
    selectedRoomEditorModule: 0,
    selectedModule: 0,
    showPuertaDoblefondo: true,
    roomEditorLineWidth: 1,
    roomEditorEspesor: 0,
    showDimensions: true,
    errorsIn3d: false,
    relativePosition: false, // posicion de las bisagras relativa al borde de la puerta
    margin: 100, // la distancia en milimetros de las bisagras hasta el borde de la puerta
    lockBisagra: false, // bloquear la ubicacion de las bisagras
    ambienteEnabled: false, // si estamos actualmente en la seccion de ambiente de instalacion
    idMultiplier: {
      'roomEditor': 100000,
      'modulo': 1000
    },
    currentDesignSystemSection: 'modulo', // seccion actual de diseño
    selectedFondo: null,
    hoveredElement: null,
    hojaCorredizaSelected: -1,
    cruceEntrePuertasSelected: -1,
    zeroWidth: false,
    materials: {},
    alternativeMaterials: {}, // materiales alternativos para presupuestos
    materialValue: {}, // diccionario donde la clave es el nombre del material y el valor el precio del mismo
    cuotas: [], // lista de cuotas para financiacion
    placeholders: PLACEHOLDERS, // lista de placeholders (o etiquetas) que estan disponibles en el editor de mensajes
    presupuesto: null,
    services: [
      {
        nombre: 'Instalacion',
        value: 500,
        count: 1
      },
      {
        nombre: 'Horas mano de obra',
        value: 200,
        count: 5
      }
    ],
    DesignObject: '',
    CadGrupos3d:[],
    StatusCanvasCAD: '',
  },
  mutations: {
    setShowGrupoCad3d(state: any, payload: any){
      var data = (this as any).getters.getCadGrupos3D;
      data.grupos[payload.index].show3d = payload.show;
      state.DesignObject = JSON.stringify(data);
    },
    setRotacionGrupoCad(state: any, payload: any){
      var data = (this as any).getters.getCadGrupos3D;
      if(data.grupos[payload.index].rotacion){
        Object.assign(data.grupos[payload.index].rotacion, payload.rotacion);
      }else{
        var rotacion = new RotacionCad(payload.rotacion);
        data.grupos[payload.index].rotacion = rotacion;
      }
      console.log(data.grupos[payload.index].rotacion);

      state.DesignObject = JSON.stringify(data);
    },
    setPosicionGrupoCad(state: any, payload: any){
      var data = (this as any).getters.getCadGrupos3D;
      if(data.grupos[payload.index].posicion){
        Object.assign(data.grupos[payload.index].posicion, payload.posicion);
      }else{
        var posicion = new PosicionCad(payload.posicion);
        data.grupos[payload.index].posicion = posicion;
      }
      console.log(data.grupos[payload.index].posicion);

      state.DesignObject = JSON.stringify(data);
    },
    setShowGeometriaCad3d(state: any, payload: any){
      var data = (this as any).getters.getCadGrupos3D;
      data.grupos[payload.grupo][payload.tipo][payload.geometria].show3d = payload.show;
      state.DesignObject = JSON.stringify(data);
      
    },
    configureElement(state: any) {
      Element.state = state
      Element.getters = (this as any).getters
    },
    // CAD CENTER
    SetDesignObject(state: any, payload: any) {
      state.DesignObject = payload
    },
    setColores(state: any, payload: any) {
      // state.proyectoSinColor = false;
      // state.coloresModule = payload;
      state.idColorPorDefecto = payload.id;
      (this as any).dispatch("activarColoresModuloDB", payload);
    },
    setColoresProyecto(state: any, payload: any) {
      state.proyectoSinColor = false;
      state.coloresModule = payload;
    },
    SetStatusCanvasCAD(state: any, payload: any) {
      state.StatusCanvasCAD = payload
    },
    setFondoExtraArea(state: any, payload: any) {
      const modulo = Modulo.Selected();
      if (modulo.customFondos.length > 0) {
        const fondos = modulo.customFondos.slice();
        const index = fondos.findIndex((f: any) => f.Name === payload.fondo);
        const fondo = {} as any;
        fondo[payload.key] = payload.value || 0;
        fondos.splice(index, 1, (Object as any).assign(fondos[index], fondo));
        Vue.set(modulo, 'customFondos', fondos);
      } else {
        Vue.set(modulo, payload.key, payload.value);
      }
    },
    divideFondo(state: any, payload: any) {
      if (!state.selectedFondo) {
        Modulo.Selected().ExtraAlto = 0;
        Modulo.Selected().ExtraAbajo = 0;
        Modulo.Selected().ExtraDerecha = 0;
        Modulo.Selected().ExtraIzquierda = 0;
        Modulo.Selected().drawing = undefined;
      }
      const selectedModuleName = Modulo.Selected().moduleName;
      const fondos = Element.getters.getPartList.filter((elem: Part) => {
        return (elem.ElementType === ElementType.fondo) && (selectedModuleName === elem.Module);
      });

      let fondo = state.selectedFondo ? fondos.find((elem: any) => elem.Name === state.selectedFondo.Name) : fondos[0];
      let newFondo = JSON.parse(JSON.stringify(fondo));
      newFondo.history = { parentFondo: JSON.stringify(fondo) };
      fondo.history = { parentFondo: JSON.stringify(fondo) };
      const halfSeparatorSize = (payload.size / 2);
      // Vertical
      if (Separator.GetOrientacion(payload) === 1) {
        fondo.AVeta = fondo.AVeta - ((fondo.AVeta + fondo.X - Modulo.Selected()._x) - Element.GetX(payload) - halfSeparatorSize);
        newFondo.AVeta = newFondo.AVeta - fondo.AVeta;
        newFondo.X = Element.GetX(payload) + halfSeparatorSize;
        newFondo.Y -= Modulo.Selected()._y;
      } else {
        // Horizontal
        fondo.LVeta = fondo.LVeta - ((fondo.LVeta + fondo.Y - Modulo.Selected()._y) - Element.GetY(payload) - halfSeparatorSize);
        newFondo.LVeta = newFondo.LVeta - fondo.LVeta;
        newFondo.Y = Element.GetY(payload) + halfSeparatorSize;
        newFondo.X -= Modulo.Selected()._x;
      }
      fondo.X -= Modulo.Selected()._x;
      fondo.Y -= Modulo.Selected()._y;

      const originalFondoIndex = Modulo.Selected().customFondos.findIndex((elem: any) => elem.Name === fondo.Name);
      if (originalFondoIndex > -1) {
        Modulo.Selected().customFondos.splice(originalFondoIndex, 1);
      }
      fondo.Name = 'Fondo ' + (state.selectedModule + 1) + '-' + Modulo.GetNextIndex();
      newFondo.Name = 'Fondo ' + (state.selectedModule + 1) + '-' + Modulo.GetNextIndex();
      newFondo.ExtraAncho = newFondo.ExtraAlto = newFondo.ExtraIzquierda = newFondo.ExtraDerecha = 0;
      newFondo.Exportable = fondo.Exportable = true;
      Modulo.Selected().customFondos.push(fondo);
      Modulo.Selected().customFondos.push(newFondo);
      Modulo.Selected().drawing = undefined;
      state.selectedFondo = null;
      fondo.drawing = undefined;
      newFondo.drawing = undefined;

      newFondo.history.siblingName = fondo.Name;
      fondo.history.siblingName = newFondo.Name;
    },
    revertDivideFondo(state: any, payload: any) {
      const modulo = Modulo.Selected();
      const customFondos = modulo.customFondos.filter((m: any) => m.Name !== payload.Name && m.Name !== payload.history.siblingName);
      const parentFondo = JSON.parse(payload.history.parentFondo);

      if (parentFondo.Name !== 'Fondo') {
        parentFondo.Exportable = true;
        customFondos.push(parentFondo);
      }

      Vue.set(modulo, 'customFondos', customFondos);
      state.selectedFondo = null;
    },
    resetModule(state: any) {
      const modulo = Modulo.Selected()
      modulo.layers = [
        { name: 'Capa 1', visible: true },
        { name: 'Capa 2', visible: true },
        { name: 'Capa 3', visible: true }
      ];
      modulo.elements = []
      modulo.customFondos = []
      modulo.selected = null
      Vue.set(modulo, 'drawing', {});
      modulo._rx = 0
      modulo._ry = 0
      modulo._rz = 0
      modulo.ExtraAbajo = 0;
      modulo.ExtraAlto = 0;
      modulo.ExtraDerecha = 0;
      modulo.ExtraIzquierda = 0;
      state.selectedFondo = state.hoveredElement = null
      state.hojaCorredizaSelected = -1;
      state.cruceEntrePuertasSelected = -1;
      modulo.LType = undefined;
    },
    /**
     * Resetea todos los modulos disponibles
     */
    resetAll(state: any, payload?: boolean) {
      const modules = Modulo.GetSectionModules(payload);
      modules.forEach((modulo: any) => {
        modulo.elements = [];
        modulo.customFondos = [];
        modulo.selected = null;
        modulo._rx = modulo._ry = modulo._rz = 0;
      });
      if (!payload) {
        state.selectedFondo = state.hoveredElement = null;
        state.materials = {};
        state.alternativeMaterials = {};
      }
    },
    /**
     * Clona el modulo seleccionado
     * current: el numero de modulo (empezando desde 0) que va a ser clonado
     * new: el numero de modulo (empezando desde 0) que va a ser sobreescrito con la copia
     * mod (opcional): el modulo que se va a copiar. Si no se recibe nada, es el modulo seleccionado
     */
    cloneModule(state: any, payload: any) {
      const idMultiplier = state.ambienteEnabled ? state.idMultiplier.roomEditor : state.idMultiplier.modulo;
      const fromId = payload.current;
      const toId = payload.new;
      const mod = payload.mod || Modulo.Selected();
      const getUpdatedIdFn = (currentId: any): number => {
        const newBaseIndex = +newModuleIndex * idMultiplier; // 1000, 2000, 3000, 4000, ...
        let newIdNum = currentId % idMultiplier;
        return newIdNum + newBaseIndex;
      }
      const newModuleIndex = '' + ((+toId) + 1);
      const newElements = JSON.parse(JSON.stringify(mod.elements));
      newElements.forEach((element: any) => {
        let newIdNum = element.id % idMultiplier;
        let newId = (newIdNum + (+newModuleIndex * idMultiplier)) + '';
        element.moduleId = +toId + 1;
        element.moduleName = 'Mod ' + (+toId + 1);
        if (element.piezaManual) {

          if (element.tipo === 'tapacanto-manual') {
            const oldRelated = element.extra.related;
            element.extra.related = (element.extra.related % idMultiplier) + (+newModuleIndex * idMultiplier) + '';
            element.name = element.name.replace(oldRelated, element.extra.related);
          } else {
            element.name = element.name += ' (' + element.moduleName + ')';
          }
        } else {
          element.name = element.name.replace(element.id + '', newId);
        }
        if (element.parent) {
          element.parent = getUpdatedIdFn(element.parent)
        }
        if (element.childs) {
          let newChilds = [];
          for (let index = 0; index < element.childs.length; index++) {
            let el = element.childs[index];
            let childId = el + '';
            newChilds.push(getUpdatedIdFn(childId));
          }
          element.childs = newChilds;
        }
        if (element.conexionesAfter) {
          element.conexionesAfter.forEach((con: any) => {
            con.separator.id = getUpdatedIdFn(con.separator.id)
            con.separator.parent = getUpdatedIdFn(con.separator.parent);
            const parsedName = con.separator.name.split(' ');
            parsedName.pop();
            con.separator.name = parsedName.join(' ') + ' ' + con.separator.id;
          });
        }
        if (element.conexionesBefore) {
          element.conexionesBefore.forEach((con: any) => {
            con.separator.id = getUpdatedIdFn(con.separator.id);
            con.separator.parent = getUpdatedIdFn(con.separator.parent);
            const parsedName = con.separator.name.split(' ');
            parsedName.pop();
            con.separator.name = parsedName.join(' ') + ' ' + con.separator.id;
          })
        }
        if (element.puerta) {
          const parsedName = element.puerta.name.split(' ');
          parsedName.pop();
          element.puerta.name = parsedName.join(' ') + ' ' + newId;
          element.puerta.sides.side1 = getUpdatedIdFn(element.puerta.sides.side1);
          element.puerta.sides.side2 = getUpdatedIdFn(element.puerta.sides.side2);
          element.puerta.sides.side3 = getUpdatedIdFn(element.puerta.sides.side3);
          element.puerta.sides.side4 = getUpdatedIdFn(element.puerta.sides.side4);
          element.id = +newId;
        }
        if (element.riel) {
          let parsedName = element.name.split(' ');
          let doorIndex = parsedName[parsedName.length - 1];
          doorIndex = doorIndex.replace(doorIndex[0], newId[0]);
          parsedName[parsedName.length - 1] = doorIndex;
          element.name = parsedName.join(' ')
          element.id = +newId;
        }
        element.id = getUpdatedIdFn(element.id);
      });
      Modulo.GetModuleByIndex(toId).elements = newElements;
      Modulo.GetModuleByIndex(toId).height = mod.height;
      Modulo.GetModuleByIndex(toId).width = mod.width;
      Modulo.GetModuleByIndex(toId).settings = JSON.parse(JSON.stringify(mod.settings));
      Modulo.GetModuleByIndex(toId).fondo = mod.fondo;
      Modulo.GetModuleByIndex(toId).z = mod.z;
      Modulo.GetModuleByIndex(toId).customFondos = JSON.parse(JSON.stringify(mod.customFondos));
      Modulo.GetModuleByIndex(toId).customFondos.forEach((fondo: any) => {
        let moduleIndex = fondo.Module.split(' ')[1];
        fondo.Module = fondo.Module.replace(moduleIndex, newModuleIndex);
        fondo.Name = fondo.Name.replace((fromId + 1) + '-', ((+toId) + 1) + '-');
      });
      Modulo.GetModuleByIndex(toId).selected = getUpdatedIdFn(Modulo.GetModuleByIndex(toId).selected);
      Modulo.GetModuleByIndex(toId).moduleId = (+toId + 1);
      Modulo.GetModuleByIndex(toId).moduleName = 'Mod ' + (+toId + 1);
      console.log('***********Modulo clonado:******************');
      console.log('mod ' + (payload.current + 1) + ' -> mod ' + ((+payload.new) + 1));
      console.log(Modulo.GetModuleByIndex(toId));
    },
    setShowPuertaDoblefondo(state: any, payload: boolean) {
      state.showPuertaDoblefondo = payload
    },
    setShowDimensions(state: any, payload: boolean) {
      state.showDimensions = payload
    },
    setErrorsIn3d(state: any, payload: any) {
      state.errorsIn3d = payload
    },
    setRoomEditorLineWidth(state: any, payload: boolean) {
      state.roomEditorLineWidth = payload;
    },
    setRoomEditorEspesor(state: any, payload: boolean) {
      state.roomEditorEspesor = payload;
    },
    setLayoutProperty(state: any, payload: any) {
      state[payload.key] = payload.value;
    },
    /**
     * Construye un modulo en L
     */
    setupLModule(state: any, payload: any) {
      const lIzq = payload.lType === ModuleLType.izquierdo;
      if (lIzq && payload.z <= payload.latDerZ) {
        alert('Modulo L izquierdo: La profundidad total debe ser mayor que la profundidad del lateral derecho');
        return;
      }
      if (!lIzq && payload.z <= payload.latIzqZ) {
        alert('Modulo L derecho: La profundidad total debe ser mayor que la profundidad del lateral izquierdo');
        return;
      }

      const modulo = Modulo.Selected();
      const separatorSize = state.zeroWidth || state.ambienteEnabled ? 0 : modulo.settings.EspesorGeneral;
      modulo.isTypeL = true;
      modulo.LType = payload.lType;
      modulo.width = lIzq ? payload.width - separatorSize : payload.width;
      modulo.displayWidth = payload.width;
      modulo.height = payload.height;
      modulo.z = lIzq ? payload.latDerZ : payload.latIzqZ;
      modulo.LLength = payload.z;
      modulo.latDerZ = payload.latDerZ;
      modulo.latIzqZ = payload.latIzqZ;

      modulo._x = modulo._y = modulo._z = 0;
      modulo.fondo = payload.material || (this as any).getters.defaultMaterial

      const root = new Cube(null, Modulo.SelectedModuleIndex())
      root.childs = []
      root.layout = 'vertical'

      // Crear Layout Vertical
      // - Izquierdo
      const x = lIzq ? -18 : 0;
      let sep = new Separator(root, separatorSize, { x: x, y: 0 }, Modulo.SelectedModuleIndex())
      sep.name = 'Lat. Izquierdo'
      sep.tapacantos.izquierdo = payload.tapacantos || (this as any).getters.tapacantos_default
      sep.tapacantos.superior = payload.tapacantos || (this as any).getters.tapacantos_default
      sep.tapacantos.inferior = payload.tapacantos || (this as any).getters.tapacantos_default
      sep.material = payload.material || (this as any).getters.defaultMaterial
      sep.full = true;
      sep.diagramWidth = sep.lTypeZ = lIzq ? payload.latIzqZ : 0;
      sep.visible = !lIzq;
      sep.anchoVeta = lIzq ? payload.latIzqZ : -1;
      modulo.latIzqId = sep.id;


      // - Middle
      const middle = new Cube(root, Modulo.SelectedModuleIndex())
      middle.childs = []
      middle.layout = 'horizontal'

      // - Derecho
      sep = new Separator(root, separatorSize, { x: modulo.width, y: 0 }, Modulo.SelectedModuleIndex())
      sep.name = 'Lat. Derecho'
      sep.tapacantos.izquierdo = payload.tapacantos || (this as any).getters.tapacantos_default
      sep.tapacantos.superior = payload.tapacantos || (this as any).getters.tapacantos_default
      sep.tapacantos.inferior = payload.tapacantos || (this as any).getters.tapacantos_default
      sep.material = payload.material || (this as any).getters.defaultMaterial
      sep.full = true
      sep.diagramWidth = sep.lTypeZ = lIzq ? 0 : payload.latDerZ;
      sep.visible = lIzq;
      sep.anchoVeta = !lIzq ? payload.latDerZ : -1;
      modulo.latDerId = sep.id;

      // Crear horizontal
      const techo = new Separator(middle, separatorSize, { x: 0, y: modulo.height - separatorSize }, Modulo.SelectedModuleIndex())
      techo.name = 'Techo'
      techo.isL = true;
      techo.tapacantos.izquierdo = payload.tapacantos || (this as any).getters.tapacantos_default
      techo.material = payload.material || (this as any).getters.defaultMaterial
      techo.full = false
      techo.techoPisoL = true;
      techo.displayAVeta = Separator.GetLargoVeta(techo);
      techo.displayLVeta = payload.z - sep.size;
      const m2 = new Cube(middle, Modulo.SelectedModuleIndex());
      modulo.techoId = techo.id;

      const piso = new Separator(middle, separatorSize, { x: 0, y: 0 }, Modulo.SelectedModuleIndex())
      piso.name = 'Piso'
      piso.isL = true;
      piso.tapacantos.izquierdo = payload.tapacantos || (this as any).getters.tapacantos_default
      piso.material = payload.material || (this as any).getters.defaultMaterial
      piso.displayAVeta = Separator.GetLargoVeta(piso);
      piso.displayLVeta = payload.z - sep.size;
      piso.techoPisoL = true;
      piso.full = false;


      // - parte en L
      // fondo
      // let l1 = new PiezaManual(null, separatorSize, Modulo.SelectedModuleIndex());
      // l1.name = 'L 1';
      // l1.material = payload.material || (this as any).getters.defaultMaterial;
      // l1.size = separatorSize;
      // l1.Count = 0;
      // l1.LVeta = payload.height;
      // l1.AVeta = payload.z; // extension
      // l1.Orientacion = 1;
      // l1.X = lIzq ? 0 : modulo.width - separatorSize;
      // l1.Y = 0;
      // l1.Z = 0;
      // l1.only3d = true;

      // pieza vertical L
      let l2 = new PiezaManual(null, separatorSize, Modulo.SelectedModuleIndex());
      l2.name = 'L 2';
      l2.material = payload.material || (this as any).getters.defaultMaterial;
      l2.size = separatorSize;
      l2.Count = 0;
      l2.LVeta = payload.height;
      l2.AVeta = lIzq ? payload.latIzqZ : payload.latDerZ;
      l2.Orientacion = 4;
      l2.X = lIzq ? 0 : modulo.width - payload.latDerZ;
      l2.Y = 0;
      l2.Z = payload.z - separatorSize;
      l2.only3d = true;

      // techo L
      let l3 = new PiezaManual(null, separatorSize, Modulo.SelectedModuleIndex());
      l3.name = 'L techo';
      l3.material = payload.material || (this as any).getters.defaultMaterial;
      l3.size = separatorSize;
      l3.Count = 0;
      l3.LVeta = lIzq ? payload.latIzqZ : payload.latDerZ;
      l3.AVeta = lIzq ? payload.z - payload.latDerZ : payload.z - payload.latIzqZ;
      l3.AVeta -= separatorSize;
      l3.Orientacion = 2;
      l3.X = lIzq ? 0 : modulo.width - payload.latDerZ;
      l3.Y = payload.height - 18;
      l3.Z = lIzq ? payload.latDerZ : payload.latIzqZ;
      l3.only3d = true;
      techo.lPartId = l3.id;

      // piso L
      let l4 = new PiezaManual(null, separatorSize, Modulo.SelectedModuleIndex());
      l4.name = 'L piso';
      l4.material = payload.material || (this as any).getters.defaultMaterial;
      l4.size = separatorSize;
      l4.Count = 0;
      l4.LVeta = lIzq ? payload.latIzqZ : payload.latDerZ;
      l4.AVeta = lIzq ? payload.z - payload.latDerZ : payload.z - payload.latIzqZ;
      l4.AVeta -= separatorSize;
      l4.Orientacion = 2;
      l4.X = lIzq ? 0 : modulo.width - payload.latDerZ;
      l4.Y = 0;
      l4.Z = lIzq ? payload.latDerZ : payload.latIzqZ;
      l4.only3d = true;
      piso.lPartId = l4.id;

      Modulo.Selected().elements.forEach(elem => Separator.CalcularConexiones(elem as any));
    },
    setupModule(state: any, payload: ModuleConfiguration) {
      const modulo = Modulo.Selected()
      const separatorSize = state.zeroWidth || state.ambienteEnabled ? 0 : modulo.settings.EspesorGeneral;
      modulo.width = payload.width
      modulo.height = payload.height
      modulo.z = payload.z

      modulo._x = 0
      modulo._y = 0
      modulo._z = 0

      if (payload.mainLayout === ModuleLayout.Horizontal) {
        const root = new Cube(null, Modulo.SelectedModuleIndex());
        root.childs = [];
        root.layout = 'horizontal';

        // Crear Layout Horizontal
        // - Superior
        let sep = new Separator(root, separatorSize, { x: 0, y: modulo.height - separatorSize }, Modulo.SelectedModuleIndex())
        sep.name = 'Techo'
        sep.tapacantos.izquierdo = payload.tapacantos || (this as any).getters.tapacantos_default
        sep.tapacantos.superior = payload.tapacantos || (this as any).getters.tapacantos_default
        sep.tapacantos.inferior = payload.tapacantos || (this as any).getters.tapacantos_default
        sep.material = payload.material || (this as any).getters.defaultMaterial
        sep.full = true

        // - Middle
        const middle = new Cube(root, Modulo.SelectedModuleIndex())
        middle.childs = []
        middle.layout = 'vertical'

        // - Inferior
        sep = new Separator(root, separatorSize, { x: 0, y: 0 }, Modulo.SelectedModuleIndex())
        sep.name = 'Piso'
        sep.tapacantos.izquierdo = payload.tapacantos || (this as any).getters.tapacantos_default
        sep.tapacantos.superior = payload.tapacantos || (this as any).getters.tapacantos_default
        sep.tapacantos.inferior = payload.tapacantos || (this as any).getters.tapacantos_default
        sep.material = payload.material || (this as any).getters.defaultMaterial
        sep.full = true

        // Crear vertical
        sep = new Separator(middle, separatorSize, { x: 0, y: 0 }, Modulo.SelectedModuleIndex())
        sep.tapacantos.izquierdo = payload.tapacantos || (this as any).getters.tapacantos_default
        sep.name = 'Lat. Izquierdo'
        sep.material = payload.material || (this as any).getters.defaultMaterial
        sep.full = false
        const m2 = new Cube(middle, Modulo.SelectedModuleIndex())


        sep = new Separator(middle, separatorSize, { x: modulo.width - separatorSize, y: 0 }, Modulo.SelectedModuleIndex())
        sep.name = 'Lat. Derecho'
        sep.tapacantos.izquierdo = payload.tapacantos || (this as any).getters.tapacantos_default
        sep.full = false
        sep.material = payload.material || (this as any).getters.defaultMaterial
      } else {
        const root = new Cube(null, Modulo.SelectedModuleIndex())
        root.childs = []
        root.layout = 'vertical'

        // Crear Layout Vertical
        // - Izquierdo
        let sep = new Separator(root, separatorSize, { x: 0, y: 0 }, Modulo.SelectedModuleIndex())
        sep.name = 'Lat. Izquierdo'
        sep.tapacantos.izquierdo = payload.tapacantos || (this as any).getters.tapacantos_default
        sep.tapacantos.superior = payload.tapacantos || (this as any).getters.tapacantos_default
        sep.tapacantos.inferior = payload.tapacantos || (this as any).getters.tapacantos_default
        sep.material = payload.material || (this as any).getters.defaultMaterial
        sep.full = true

        // - Middle
        const middle = new Cube(root, Modulo.SelectedModuleIndex())
        middle.childs = []
        middle.layout = 'horizontal'

        // - Derecho
        sep = new Separator(root, separatorSize, { x: modulo.width - separatorSize, y: 0 }, Modulo.SelectedModuleIndex())
        sep.name = 'Lat. Derecho'
        sep.tapacantos.izquierdo = payload.tapacantos || (this as any).getters.tapacantos_default
        sep.tapacantos.superior = payload.tapacantos || (this as any).getters.tapacantos_default
        sep.tapacantos.inferior = payload.tapacantos || (this as any).getters.tapacantos_default
        sep.material = payload.material || (this as any).getters.defaultMaterial
        sep.full = true

        // Crear horizontal
        sep = new Separator(middle, separatorSize, { x: 0, y: modulo.height - separatorSize }, Modulo.SelectedModuleIndex())
        sep.name = 'Techo'
        sep.tapacantos.izquierdo = payload.tapacantos || (this as any).getters.tapacantos_default
        sep.material = payload.material || (this as any).getters.defaultMaterial
        sep.full = false
        const m2 = new Cube(middle, Modulo.SelectedModuleIndex())

        sep = new Separator(middle, separatorSize, { x: 0, y: 0 }, Modulo.SelectedModuleIndex())
        sep.name = 'Piso'
        sep.tapacantos.izquierdo = payload.tapacantos || (this as any).getters.tapacantos_default
        sep.material = payload.material || (this as any).getters.defaultMaterial
        sep.full = false
      }
      Modulo.Selected().elements.forEach(elem => Separator.CalcularConexiones(elem as any))
    },
    setModuleZ(state: any, payload: any) {
      Modulo.Selected().z = payload
    },

    /**
     * Actualiza el material de las piezas
     * Puede actualizar solo el de aquellas piezas que no tengan material,
     * el de todas las piezas,
     * o solo el de las que ya tengan material.
     * 
     * Edit: Payload may contain a givenCurrentModule
     * identifier as an object for cases 
     * in which global "ambienteEnabled" can't
     * be updated, due to rendering purpose.
     */
    updatePiecesMaterial(state: any, payload: any) {
      let givenCurrentModule = null
      if (
        payload.existingModule &&
        payload.existingModule.hasOwnProperty("moduleName") &&
        payload.existingModule.hasOwnProperty("isRoomEditor")
      ){
        if (!payload.existingModule.isRoomEditor) {
          let normalizedName = `Mod ${String(payload.existingModule.moduleName.split(' ')[1])}`
          givenCurrentModule = state.modules.find((module: any) => module.moduleName === normalizedName)
        } else {
          let roomEditorModuleIndexWithHundred = String(payload.existingModule.moduleName.split(' ')[1])
          let roomEditorRealModuleNumber = Number(roomEditorModuleIndexWithHundred.substring(0, roomEditorModuleIndexWithHundred.length - 2))
          let moduleName = `Mod ${roomEditorRealModuleNumber}`
          givenCurrentModule = state.roomEditorModules.find((module: any) => module.moduleName === moduleName)
        }
      }

      let updateDefault = payload.update === 0;
      let updateNoMaterial = payload.update === 1;
      let updateAll = payload.update === 2;
      let elements: any = givenCurrentModule ? givenCurrentModule.elements : Modulo.Selected().elements;

      elements.forEach((piece: any) => {
        if(!piece.hasOwnProperty("grupoMaterial") || !piece.grupoMaterial){
          if ((!piece.cube || piece.puerta) && !piece.barral) { // todas las piezas menos barrales y cubos
            if (piece.puerta && ((!piece.puerta.material && updateNoMaterial) || (piece.puerta.material && updateDefault) || updateAll)) {
              piece.puerta.corrediza ? PuertaCorrediza.UpdateMaterial(piece.puerta, payload.material) : piece.puerta.material = payload.material;
              piece.material = payload.material;
            } else if (piece.dobleFondo && ((!piece.dobleFondo.material && updateNoMaterial) || (piece.dobleFondo.material && updateDefault) || updateAll)) {
              piece.dobleFondo.material = payload.material;
              piece.material = payload.material;
            } else if ((!piece.material && updateNoMaterial) || (piece.material && updateDefault) || updateAll) {
              piece.material = payload.material;
            }
          }
        }
      });
      
      // sets the element on master module stor a.k.a. "state.modules"
      if (givenCurrentModule) {
        givenCurrentModule.elements = elements.slice()
      } else {
        Modulo.Selected().elements = elements.slice()
      }
    },
    updatePiecesMaterialGrupo(state: any, payload: any) {
      if(payload.hasOwnProperty("allGrupos")){
        // alert("allGrupos");
        
        Modulo.getGrupoModules().forEach((moduloForeach, index)=>{
          let givenCurrentModule = null
    
          let updateDefault = payload.update === 0;
          let updateNoMaterial = payload.update === 1;
          let updateAll = payload.update === 2;
          let elements: any = moduloForeach.elements;

          elements.forEach((piece: any, index:any) => {
            
            if(piece.hasOwnProperty("grupoMaterial") && piece.grupoMaterial){
              if(piece.cajon){
                // piece.frenteMaterial = payload.material;
                // console.log(piece, index);
                (this as any).commit('setCajonPropertyIndex', { data:{frenteMaterial: payload.material}, childIndex: index, elements:elements});
              }
              if ((!piece.cube || piece.puerta) && !piece.barral) { // todas las piezas menos barrales y cubos
                if (piece.puerta && ((!piece.puerta.material && updateNoMaterial) || (piece.puerta.material && updateDefault) || updateAll)) {
                  piece.puerta.corrediza ? PuertaCorrediza.UpdateMaterial(piece.puerta, payload.material) : piece.puerta.material = payload.material;
                  piece.material = payload.material;
                } else if (piece.dobleFondo && ((!piece.dobleFondo.material && updateNoMaterial) || (piece.dobleFondo.material && updateDefault) || updateAll)) {
                  piece.dobleFondo.material = payload.material;
                  piece.material = payload.material;
                } else if ((!piece.material && updateNoMaterial) || (piece.material && updateDefault) || updateAll) {
                  piece.material = payload.material;
                }
              }
            }
          });
        });

      }else{

        let givenCurrentModule = null
      
          let updateDefault = payload.update === 0;
          let updateNoMaterial = payload.update === 1;
          let updateAll = payload.update === 2;
          let elements: any = Modulo.Selected().elements;

        if(payload.hasOwnProperty("elementSelect")){
          elements = Modulo.Selected().elements
          const childIndex = Modulo.SelectedIndex()
          console.log(elements[childIndex]);

          var piece:any = elements[childIndex];

          if(piece.cajon){
            // piece.frenteMaterial = payload.material;
            // console.log(piece, index);
            (this as any).commit('setCajonPropertyIndex', { data:{frenteMaterial: payload.material}, childIndex: childIndex, elements:elements});
          }

          if ((!piece.cube || piece.puerta) && !piece.barral) { // todas las piezas menos barrales y cubos
            if (piece.puerta && ((!piece.puerta.material && updateNoMaterial) || (piece.puerta.material && updateDefault) || updateAll)) {
              piece.puerta.corrediza ? PuertaCorrediza.UpdateMaterial(piece.puerta, payload.material) : piece.puerta.material = payload.material;
              piece.material = payload.material;
            } else if (piece.dobleFondo && ((!piece.dobleFondo.material && updateNoMaterial) || (piece.dobleFondo.material && updateDefault) || updateAll)) {
              piece.dobleFondo.material = payload.material;
              piece.material = payload.material;
            } else if ((!piece.material && updateNoMaterial) || (piece.material && updateDefault) || updateAll) {
              piece.material = payload.material;
            }
          }
          
        }else{
          elements.forEach((piece: any) => {
            if(piece.hasOwnProperty("grupoMaterial") && piece.grupoMaterial){
              (this as any).commit('setCajonProperty', { frenteMaterial: payload.material });
              if ((!piece.cube || piece.puerta) && !piece.barral) { // todas las piezas menos barrales y cubos
                  if (piece.puerta && ((!piece.puerta.material && updateNoMaterial) || (piece.puerta.material && updateDefault) || updateAll)) {
                  piece.puerta.corrediza ? PuertaCorrediza.UpdateMaterial(piece.puerta, payload.material) : piece.puerta.material = payload.material;
                  piece.material = payload.material;
                } else if (piece.dobleFondo && ((!piece.dobleFondo.material && updateNoMaterial) || (piece.dobleFondo.material && updateDefault) || updateAll)) {
                  piece.dobleFondo.material = payload.material;
                  piece.material = payload.material;
                } else if ((!piece.material && updateNoMaterial) || (piece.material && updateDefault) || updateAll) {
                  piece.material = payload.material;
                }
              }
            }
          });
        }
        

        
      }
      
      
      
      // // sets the element on master module stor a.k.a. "state.modules"
      // if (givenCurrentModule) {
      //   givenCurrentModule.elements = elements.slice()
      // } else {
      //   Modulo.Selected().elements = elements.slice()
      // }
    },

    /**
     * Actualiza el tapacantos de las piezas
     * Puede atualizar solo el de aquellas piezas que no tengan tapacantos,
     * el de todas las piezas,
     * o solo el de las que ya tengan tapacantos.
     */
    updatePiecesTapacantos(state: any, payload: any) {
      let updateDefault = payload.update === 0;
      let updateNoTapacantos = payload.update === 1;
      let updateAll = payload.update === 2;
      let elements: any = Modulo.Selected().elements;
      // state.modules.forEach((modulo: any) => {
      elements.forEach((piece: any) => {
        if ((!piece.cube || piece.puerta) && !piece.barral) { // todas las piezas menos barrales y cubos
          if (piece.puerta && piece.puerta.tapacantos) {
            if ((!piece.puerta.tapacantos.derecho && updateNoTapacantos) || (piece.puerta.tapacantos.derecho && updateDefault) || updateAll) {
              piece.puerta.tapacantos.derecho = payload.tapacanto;
            }

            if ((!piece.puerta.tapacantos.izquierdo && updateNoTapacantos) || (piece.puerta.tapacantos.izquierdo && updateDefault) || updateAll) {
              piece.puerta.tapacantos.izquierdo = payload.tapacanto;
            }

            if ((!piece.puerta.tapacantos.inferior && updateNoTapacantos) || (piece.puerta.tapacantos.inferior && updateDefault) || updateAll) {
              piece.puerta.tapacantos.inferior = payload.tapacanto;
            }

            if ((!piece.puerta.tapacantos.superior && updateNoTapacantos) || (piece.puerta.tapacantos.superior && updateDefault) || updateAll) {
              piece.puerta.tapacantos.superior = payload.tapacanto;
            }
          } else if (piece.tapacantos) {
            if ((!piece.tapacantos.derecho && updateNoTapacantos) || (piece.tapacantos.derecho && updateDefault) || updateAll) {
              piece.tapacantos.derecho = payload.tapacanto;
            }

            if ((!piece.tapacantos.izquierdo && updateNoTapacantos) || (piece.tapacantos.izquierdo && updateDefault) || updateAll) {
              piece.tapacantos.izquierdo = payload.tapacanto;
            }

            if ((!piece.tapacantos.inferior && updateNoTapacantos) || (piece.tapacantos.inferior && updateDefault) || updateAll) {
              piece.tapacantos.inferior = payload.tapacanto;
            }

            if ((!piece.tapacantos.superior && updateNoTapacantos) || (piece.tapacantos.superior && updateDefault) || updateAll) {
              piece.tapacantos.superior = payload.tapacanto;
            }
          }
        }
      });

      // });
      // fix
      Modulo.Selected().elements = elements.slice();
    },
    updateZeroWidth(state: any, payload: any) {
      state.zeroWidth = payload;
    },
    splitVertical(state: any, payload: any) {
      const count = payload.count as number;
      const parent = (this as any).getters.selectedElement;
      const separatorSize = state.zeroWidth || state.ambienteEnabled ? 0 : Modulo.Selected().settings.EspesorGeneral;
      const tc = (this as any).state.general[state.ambienteEnabled ? 'tapacantos_default_por_modulo_room_editor' : 'tapacantos_default_por_modulo'][Modulo.Selected().moduleId - 1];
      const tcDefault = tc ? JSON.parse(tc) : (this as any).getters.tapacantos_default;
      const mat = (this as any).state.general[state.ambienteEnabled ? 'material_default_por_modulo_room_editor' : 'material_default_por_modulo'][Modulo.Selected().moduleId - 1];
      const mDefault = tc ? JSON.parse(mat) : (this as any).getters.defaultMaterial;
      let selected = null;
      // Si queda seleccionado un nodo padre no hacer nada
      if (parent.childs) {
        return
      }

      parent.childs = []
      parent.layout = 'vertical'

      const cubeSize = ((this as any).getters.getWidth(parent.id) - separatorSize * (count - 1)) / count

      for (let i = 0; i < count; i++) {
        // Agregar espacio
        const cube = new Cube(parent, Modulo.SelectedModuleIndex());
        // Agregar separador
        if (i < count - 1) {
          if (payload.type === 'liston') {
            const liston = new Liston(parent, separatorSize, { x: cubeSize * (i + 1) + separatorSize * i, y: 0 }, Modulo.SelectedModuleIndex(), payload.ancho, payload.z, payload.orientacion);
            liston.material = mDefault;
            selected = liston.id;
          } else {
            const separator = new Separator(parent, separatorSize, { x: cubeSize * (i + 1) + separatorSize * i, y: 0 }, Modulo.SelectedModuleIndex())
            separator.name = 'Sep. Vertical ' + separator.id
            separator.tapacantos.izquierdo = tcDefault;
            separator.material = mDefault;
            selected = separator.id;
          }
        }
      }

      Modulo.Selected().elements.forEach(elem => Separator.CalcularConexiones(elem as any))
      Modulo.Selected().selected = selected;
    },
    splitHorizontal(state: any, payload: any) {
      const count = payload.count as number
      const parent = (this as any).getters.selectedElement
      const settings = Modulo.Selected().settings
      const tc = (this as any).state.general[state.ambienteEnabled ? 'tapacantos_default_por_modulo_room_editor' : 'tapacantos_default_por_modulo'][Modulo.Selected().moduleId - 1];
      const tcDefault = tc ? JSON.parse(tc) : (this as any).getters.tapacantos_default;
      const mat = (this as any).state.general[state.ambienteEnabled ? 'material_default_por_modulo_room_editor' : 'material_default_por_modulo'][Modulo.Selected().moduleId - 1];
      const mDefault = tc ? JSON.parse(mat) : (this as any).getters.defaultMaterial;

      let separatorSize = payload.type === 'barral' ? settings.EspesorBarral : settings.EspesorGeneral
      if (state.zeroWidth || state.ambienteEnabled) {
        separatorSize = 0;
      }

      if (parent.childs) {
        return
      }

      const h = (this as any).getters.getHeight(parent.id)
      const cubeSize = (h - separatorSize * (count - 1)) / count

      parent.childs = []
      parent.layout = 'horizontal'
      let selected = null;

      for (let i = 0; i < count; i++) {
        const cube = new Cube(parent, Modulo.SelectedModuleIndex())
        // Agregar separador
        if (i < count - 1) {
          const pos = { x: 0, y: h - (cubeSize + separatorSize) * (i + 1) }
          if (payload.type === 'barral') {
            const barral = new Barral(parent, separatorSize, pos, Modulo.SelectedModuleIndex())
            barral.name = 'Barral ' + barral.id
            barral.material = null
            selected = barral.id;
          } else if (payload.type === 'bandeja') {
            const bandeja = new Bandeja(parent, separatorSize, pos, Modulo.SelectedModuleIndex())
            bandeja.corredera = payload.extra;
            bandeja.name = 'Bandeja ' + bandeja.id
            bandeja.tapacantos.izquierdo = tcDefault;
            bandeja.tapacantos.superior = tcDefault;
            bandeja.tapacantos.inferior = tcDefault;
            bandeja.material = mDefault
            selected = bandeja.id;
          } else if (payload.type === 'liston') {
            const modulo = state.modules[Modulo.SelectedModuleIndex()];
            const liston = new Liston(parent, separatorSize, pos, Modulo.SelectedModuleIndex(), payload.ancho, payload.z, payload.orientacion, payload.isL);
            liston.material = mDefault;
            selected = liston.id;
            if (modulo.isTypeL && (payload.orientacion === 3 || payload.orientacion === 2)) {
              const lTypeDerecho = Modulo.Selected().LType === 'derecho';
              const pieza = new PiezaManual(null, separatorSize, modulo);
              pieza.size = separatorSize;
              pieza.LVeta = payload.ancho;
              pieza.AVeta = modulo.LLength - separatorSize - payload.z;
              if (payload.orientacion === 3) {
                // liston horizontal
                pieza.AVeta -= separatorSize;
                pieza.Z = payload.z + separatorSize;
                pieza.displayAVeta = payload.ancho;
                pieza.displayLVeta = pieza.AVeta - separatorSize;
                pieza.Orientacion = 1;
              } else {
                // liston horizontal de corte
                pieza.AVeta -= payload.ancho;
                pieza.Orientacion = 2;
                pieza.Z = payload.z + payload.ancho;
              }
              pieza.name = `Liston L (con ${liston.id})`;
              pieza.material = mDefault;
              pieza.X = payload.z + separatorSize;
              if (lTypeDerecho) {
                pieza.X += Modulo.Selected().width - Modulo.Selected().latDerZ;
                liston.largoVeta = Separator.GetLargoVeta(liston) - (Modulo.Selected().width - pieza.X) + (payload.orientacion === 3 ? pieza.size : pieza.LVeta);
              } else {
                liston.largoVeta = Separator.GetLargoVeta(liston) - payload.z - separatorSize;
              }
              pieza.Y = Element.GetY(liston);
              pieza.isL = true;
              pieza.Count = 1;
              pieza.only3d = false;
              liston.lPartId = pieza.id;
            }
          } else {
            const separator = new Separator(parent, separatorSize, pos, Modulo.SelectedModuleIndex(), payload.virtual)
            separator.name = 'Estante ' + separator.id
            separator.tapacantos.izquierdo = tcDefault;
            separator.material = mDefault
            selected = separator.id;
          }
        }
      }
      Modulo.Selected().elements.forEach(elem => Separator.CalcularConexiones(elem as any))
      Modulo.Selected().selected = selected
    },
    addCajon(state: any, count: number) {
      const parent = (this as any).getters.selectedElement

      // Si queda seleccionado un nodo padre no hacer nada
      if (parent.childs) {
        return
      }

      parent.childs = []
      parent.layout = 'horizontal'
      parent.cajonGroup = true

      const h = (this as any).getters.getHeight(parent.id)
      const cubeSize = h / count
      let selected = null;
      const tc = (this as any).state.general[state.ambienteEnabled ? 'tapacantos_default_por_modulo_room_editor' : 'tapacantos_default_por_modulo'][Modulo.Selected().moduleId - 1];
      const tcCajon = tc ? JSON.parse(tc) : (this as any).getters.tapacantos_default;
      const cajones = [] as any;
      for (let i = 0; i < count; i++) {
        // Agregar espacio
        const cajon = new Cajon(parent, state.selectedModule)
        // cajon.frenteMaterial = (this as any).state.general[state.ambienteEnabled ? 'material_default_por_modulo_room_editor' : 'material_default_por_modulo_grupo'][Modulo.Selected().moduleId - 1];
        cajones.push(cajon);
        selected = selected || cajon.id;
        cajon.tapacantos = { superior: tcCajon, inferior: tcCajon, izquierdo: tcCajon, derecho: tcCajon }

        // Agregar separador imaginario
        if (i < count - 1) {
          const separator = new Separator(parent, 0, { x: 0, y: h - cubeSize * (i + 1) }, state.selectedModule) as any
          separator.separadorCajon = true
        }
      }

      // una vez creados los cajones y separadores, se crean los tapacantos
      for (let i = 0; i < count; i++) {
        Cajon.AgregarPiezasTapacantos(cajones[i], cajones[i].tapacantos);
      }

      Modulo.Selected().elements.forEach(elem => Separator.CalcularConexiones(elem as any))
      Modulo.Selected().selected = selected;
      var materialPorDefectoGrupo = (this as any).state.general[state.ambienteEnabled ? 'material_default_por_modulo_room_editor' : 'material_default_por_modulo_grupo'][Modulo.Selected().moduleId - 1];
      materialPorDefectoGrupo = JSON.parse(materialPorDefectoGrupo);
      (this as any).commit('setCajonProperty', { frenteMaterial: materialPorDefectoGrupo, grupoMaterial:true });
    },
    selectCube(state: any, payload: any) {
      const modulo = Modulo.Selected()
      const elements = Modulo.Selected().elements as any;
      const element = elements.find((e: any) => e.id === payload);
      const parent = elements.find((e: any) => e.id === element.parent);
      if (modulo.selected === payload) {
        modulo.selected = null
        return
      }

      if (parent.cajon && modulo.layers[parent.layerId].visible) {
        modulo.selected = parent.id;
        return;
      }

      modulo.selected = payload
    },
    setProfBarral(state: any, payload: any) {
      const elements = Modulo.Selected().elements
      const childIndex = Modulo.SelectedIndex()
      const e = elements[childIndex] as Separator
      let position = { x: e.position.x, y: e.position.y + 1 }
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], { position: position }))
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], { prof2: payload }))
      position = { x: e.position.x, y: e.position.y - 1 }
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], { position: position }))
    },
    setProfCube(state: any, paylaod: any) {

    },
    setListonEjeZ(state: any, payload: any) {
      const elements = Modulo.Selected().elements as any;
      const childIndex = Modulo.SelectedIndex();
      const liston = elements[childIndex] as any;
      const modulo = Modulo.Selected();
      const lTypeIzq = Modulo.Selected().LType === 'izquierdo';

      let lPart = Liston.getLPart(liston);
      if (lPart) {
        const lPartIndex = Liston.getLPartIndex(liston);
        liston.largoVeta = -1; // reseteo el largo
        liston.largoVeta = Separator.GetLargoVeta(liston) - payload;
        if (lTypeIzq) {
          // liston.largoVeta -= 18;
          lPart.X = +payload;
        } else if (liston.Orientacion === 2) {
          lPart.X = modulo.width - lPart.LVeta - payload;
        } else {
          // lPart.AVeta += 18;
          lPart.X = modulo.width - lPart.size - payload;
        }

        if (liston.Orientacion === 2) {
          // horizontal de corte
          lPart.AVeta = Modulo.Selected().LLength - (+payload + liston.anchoListon) - 18;
          lPart.Z = +payload + liston.anchoListon;
        } else {
          // horizontal
          lPart.AVeta = Modulo.Selected().LLength - (+payload + liston.espesorListon) - 18;
          if (lTypeIzq) {
            lPart.displayLVeta = lPart.AVeta - 18;
          }
          lPart.Z = +payload + liston.espesorListon;
        }
        elements.splice(lPartIndex, 1, (Object as any).assign(elements[lPartIndex], lPart));
      }

      elements.splice(childIndex, 1, (Object as any).assign(liston, { ejeZ: +payload }));

      if (liston.liston && liston.compound) {
        liston.compound.forEach((id: any) => {
          const listonIndex = elements.findIndex((el: any) => el.id === id);
          elements.splice(listonIndex, 1, (Object as any).assign(elements[listonIndex], { ejeZ: liston.ejeZ }))
        });
      }
    },
    setListonEjeX(state: any, payload: any) {
      const elements = Modulo.Selected().elements;
      const childIndex = Modulo.SelectedIndex();
      const liston = elements[childIndex] as any;
      let lPart = Liston.getLPart(liston);
      lPart.X = +payload;
      liston.largoVeta = -1; // reseteo el largo
      if (Modulo.Selected().LType === 'izquierdo') {
        liston.largoVeta = Separator.GetLargoVeta(liston) - payload;
      } else if (liston.Orientacion === 2) {
        liston.largoVeta = lPart.X + lPart.LVeta - Separator.GetX(liston);
        lPart.AVeta = Modulo.Selected().LLength - liston.anchoVeta - liston.ejeZ - 18;
      } else {
        lPart.AVeta = Modulo.Selected().LLength - liston.anchoVeta - liston.ejeZ - 18;
        liston.largoVeta = lPart.X + lPart.size - Separator.GetX(liston);
      }
      const lPartIndex = Liston.getLPartIndex(liston);
      elements.splice(lPartIndex, 1, (Object as any).assign(elements[lPartIndex], lPart));
    },
    setListonAncho(state: any, payload: any) {
      const elements = Modulo.Selected().elements as any;
      const childIndex = Modulo.SelectedIndex()
      const liston: any = elements[childIndex];
      let ancho: any = { anchoListon: +payload };

      if (liston.lPartId) {
        let lPart = Liston.getLPart(liston);
        lPart.LVeta = +payload;
        if (liston.Orientacion === 2) {
          // horizontal de corte
          lPart.Z = +payload + liston.ejeZ;
          lPart.AVeta = Modulo.Selected().LLength - (+payload + liston.ejeZ);
          if (Modulo.Selected().LType === 'derecho') {
            liston.largoVeta = -1;
            liston.largoVeta = +payload + Separator.GetLargoVeta(liston) - (Modulo.Selected().width - Liston.getLPart(liston).X);
          }
        } else {
          // horizontal
          lPart.Z = liston.espesorListon + liston.ejeZ;
          lPart.displayAVeta = +payload;
          lPart.AVeta = Modulo.Selected().LLength - liston.ejeZ - liston.size;
        }
        const lPartIndex = Liston.getLPartIndex(liston);
        elements.splice(lPartIndex, 1, (Object as any).assign(elements[lPartIndex], lPart));
      }
      if (liston.Orientacion === 3 || liston.Orientacion === 4) {
        ancho.diagramWidth = ancho.size = +payload;
      } else {
        ancho.anchoVeta = +payload;
      }

      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], ancho));

      if (liston.liston && liston.compound) {
        liston.compound.forEach((id: any) => {
          const listonIndex = elements.findIndex((el: any) => el.id === id);
          elements.splice(listonIndex, 1, (Object as any).assign(elements[listonIndex], ancho));
        });
      }
    },
    setListonEspesor(state: any, payload: any) {
      const elements = Modulo.Selected().elements as any;
      const childIndex = Modulo.SelectedIndex()
      const liston: any = elements[childIndex];
      let ancho: any = { espesorListon: +payload };

      if (liston.Orientacion === 1 || liston.Orientacion === 2) {
        ancho.diagramWidth = ancho.size = +payload;
      } else {
        ancho.anchoVeta = +payload;
      }

      if (liston.lPartId) {
        let lPart = Liston.getLPart(liston);
        lPart.size = +payload;
        if (liston.Orientacion === 3 || liston.Orientacion === 4) {
          lPart.Z = +payload + liston.ejeZ;
          lPart.AVeta = Modulo.Selected().LLength - (+payload + liston.ejeZ);
        }
        const lPartIndex = Liston.getLPartIndex(liston);
        elements.splice(lPartIndex, 1, (Object as any).assign(elements[lPartIndex], lPart));
      }

      elements.splice(childIndex, 1, (Object as any).assign(liston, ancho));

      if (liston.liston && liston.compound) {
        liston.compound.forEach((id: any) => {
          const listonIndex = elements.findIndex((el: any) => el.id === id);
          elements.splice(listonIndex, 1, (Object as any).assign(elements[listonIndex], ancho));
        });
      }
    },
    setSeparatorSize(state: any, payload: any) {
      const elements = Modulo.Selected().elements;
      const childIndex = Modulo.SelectedIndex();
      const element = elements[childIndex] as any;

      if (element.techoPisoL) {
        let lPart = Separator.getLPart(element);
        if (element.name === 'Techo') {
          // las piezas manuales crecen para arriba, pero el techo crece para abajo. Se compensa esto.
          lPart.Y -= (payload - lPart.size);
        }
        lPart.size = payload;
        const lPartIndex = Separator.getLPartIndex(element);
        elements.splice(lPartIndex, 1, (Object as any).assign(elements[lPartIndex], lPart));
      }
      elements.splice(childIndex, 1, (Object as any).assign(element, { size: payload }));

      const el = Element.Selected() as Separator
      const parent = Element.GetParent(el) as Cube
      if (!parent) {
        return
      }
      if (parent.layout === 'horizontal' && !Element.GetBeforeSibling(el)) {
        // Ajustar posicion del separador superior
        (this as any).commit('setSeparatorY', { x: el.position.x, y: Element.GetHeight(parent) - payload })
      }
      if (parent.layout === 'vertical' && !Element.GetAfterSibling(el)) {
        // Ajustar posicion del separador derecho
        (this as any).commit('setSeparatorX', { x: Element.GetWidth(parent) - payload, y: el.position.y })
      }
      Modulo.Selected().elements.forEach(elem => Separator.CalcularConexiones(elem as any))
    },
    setSeparatorLeft(state: any, payload: any) {
      const elements = Modulo.Selected().elements as any;
      const childIndex = Modulo.SelectedIndex()

      
      const e = elements[childIndex] as any
      const left = Element.GetBeforeSibling(e) as Element

      
      const position = { x: e.position.x - Element.GetWidth(left) + payload, y: e.position.y }
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], { position: position }))

      if (e.liston && e.compound) {
        e.compound.forEach((id: any) => {
          const listonIndex = elements.findIndex((el: any) => el.id === id);
          elements.splice(listonIndex, 1, (Object as any).assign(elements[listonIndex], { position: position }))
        });
      }

      Modulo.Selected().elements.forEach((elem: any) => {
        Separator.CalcularConexiones(elem);
        if (elem.cajon) {
          Cajon.AgregarPiezasTapacantos(elem, elem.tapacantos);
        }
        if (elem.puerta) {
          Puerta.AgregarPiezasTapacantos(elem, elem.puerta.tapacantos);
        }
      });
    },

    setSeparatorLeftRoot(state: any, payload: any) {
      const elements = Modulo.Selected().elements as any;
      const childIndex = Modulo.SelectedIndex()

      
      const e = elements[childIndex] as any
      const left = Element.GetBeforeSibling(e) as Element
      let min = 0;
      var total = (this as any).getters.getWidthRoot(e.id);
      min = total-Element.GetWidth(left);

      if(payload <= min){
        // alert(`Minimo ${min}`);
        // return
      }

      payload = payload-min;
      
      const position = { x: e.position.x - Element.GetWidth(left) + payload, y: e.position.y }
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], { position: position }))

      if (e.liston && e.compound) {
        e.compound.forEach((id: any) => {
          const listonIndex = elements.findIndex((el: any) => el.id === id);
          elements.splice(listonIndex, 1, (Object as any).assign(elements[listonIndex], { position: position }))
        });
      }

      Modulo.Selected().elements.forEach((elem: any) => {
        Separator.CalcularConexiones(elem);
        if (elem.cajon) {
          Cajon.AgregarPiezasTapacantos(elem, elem.tapacantos);
        }
        if (elem.puerta) {
          Puerta.AgregarPiezasTapacantos(elem, elem.puerta.tapacantos);
        }
      });
    },
    
    setSeparatorRight(state: any, payload: any) {
      const elements = Modulo.Selected().elements as any;
      const childIndex = Modulo.SelectedIndex();

      const e = elements[childIndex] as any;
      const right = Element.GetAfterSibling(e) as Element
      const position = { x: e.position.x + Element.GetWidth(right) - payload, y: e.position.y }

      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], { position: position }))

      if (e.liston && e.compound) {
        e.compound.forEach((id: any) => {
          const liston = Element.GetElement(id) as any;
          const listonIndex = elements.findIndex((el: any) => el.id === id);
          elements.splice(listonIndex, 1, (Object as any).assign(elements[listonIndex], { position: position }))
        });
      }

      Modulo.Selected().elements.forEach((elem: any) => {
        Separator.CalcularConexiones(elem);
        if (elem.cajon) {
          Cajon.AgregarPiezasTapacantos(elem, elem.tapacantos);
        }
        if (elem.puerta) {
          Puerta.AgregarPiezasTapacantos(elem, elem.puerta.tapacantos);
        }
      });
    },
    setSeparatorRightRoot(state: any, payload: any) {
      const elements = Modulo.Selected().elements as any;
      const childIndex = Modulo.SelectedIndex();

      const e = elements[childIndex] as any;
      const right = Element.GetAfterSibling(e) as Element

      // return 0

      let min = 0;
      var total = (this as any).getters.getWidthRootD(e.id);
      min = total-Element.GetWidth(right);
      
      payload = payload-min;
      const position = { x: e.position.x + Element.GetWidth(right) - payload, y: e.position.y }

      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], { position: position }))

      if (e.liston && e.compound) {
        e.compound.forEach((id: any) => {
          const liston = Element.GetElement(id) as any;
          const listonIndex = elements.findIndex((el: any) => el.id === id);
          elements.splice(listonIndex, 1, (Object as any).assign(elements[listonIndex], { position: position }))
        });
      }

      Modulo.Selected().elements.forEach((elem: any) => {
        Separator.CalcularConexiones(elem);
        if (elem.cajon) {
          Cajon.AgregarPiezasTapacantos(elem, elem.tapacantos);
        }
        if (elem.puerta) {
          Puerta.AgregarPiezasTapacantos(elem, elem.puerta.tapacantos);
        }
      });
    },
    setSeparatorTop(state: any, payload: any) {
      const elements = Modulo.Selected().elements as any;
      const childIndex = Modulo.SelectedIndex()
      const e = elements[childIndex] as any;
      const top = Element.GetBeforeSibling(e) as Element
      const position = { x: e.position.x, y: e.position.y + Element.GetHeight(top) - payload }
      const element = (Object as any).assign(elements[childIndex], { position: position });

      if (Modulo.Selected().isTypeL && element.liston && element.lPartId) {
        // es un modulo en L y es un liston horizontal
        Separator.getLPart(element).Y = Element.GetY(element);
      }

      elements.splice(childIndex, 1, element);

      if (e.liston && e.compound) {
        e.compound.forEach((id: any) => {
          const liston = Element.GetElement(id) as any;
          const listonIndex = elements.findIndex((el: any) => el.id === id);
          elements.splice(listonIndex, 1, (Object as any).assign(elements[listonIndex], { position: position }))
        });
      }

      Modulo.Selected().elements.forEach((elem: any) => {
        Separator.CalcularConexiones(elem);
        if (elem.cajon) {
          Cajon.AgregarPiezasTapacantos(elem, elem.tapacantos);
        }
        if (elem.puerta) {
          Puerta.AgregarPiezasTapacantos(elem, elem.puerta.tapacantos);
        }
      });
    },
    setSeparatorTopRoot(state: any, payload: any) {
      const elements = Modulo.Selected().elements as any;
      const childIndex = Modulo.SelectedIndex()
      const e = elements[childIndex] as any;
      const top = Element.GetBeforeSibling(e) as Element

      let min = 0;
      var total = (this as any).getters.getHeightRootA(e.id);
      min = total-Element.GetHeight(top);
      payload = payload-min;
      
      const position = { x: e.position.x, y: e.position.y + Element.GetHeight(top) - payload }
      const element = (Object as any).assign(elements[childIndex], { position: position });

      if (Modulo.Selected().isTypeL && element.liston && element.lPartId) {
        // es un modulo en L y es un liston horizontal
        Separator.getLPart(element).Y = Element.GetY(element);
      }

      elements.splice(childIndex, 1, element);

      if (e.liston && e.compound) {
        e.compound.forEach((id: any) => {
          const liston = Element.GetElement(id) as any;
          const listonIndex = elements.findIndex((el: any) => el.id === id);
          elements.splice(listonIndex, 1, (Object as any).assign(elements[listonIndex], { position: position }))
        });
      }

      Modulo.Selected().elements.forEach((elem: any) => {
        Separator.CalcularConexiones(elem);
        if (elem.cajon) {
          Cajon.AgregarPiezasTapacantos(elem, elem.tapacantos);
        }
        if (elem.puerta) {
          Puerta.AgregarPiezasTapacantos(elem, elem.puerta.tapacantos);
        }
      });
    },
    setSeparatorBottom(state: any, payload: any) {
      const elements = Modulo.Selected().elements as any;
      const childIndex = Modulo.SelectedIndex();
      const e = elements[childIndex] as any;
      const bottom = Element.GetAfterSibling(e) as Element;
      const position = { x: e.position.x, y: e.position.y - Element.GetHeight(bottom) + payload }
      const element = (Object as any).assign(elements[childIndex], { position: position });

      if (Modulo.Selected().isTypeL && element.liston && element.lPartId) {
        // es un modulo en el y es un liston horizontal
        Separator.getLPart(element).Y = Element.GetY(element);
      }

      elements.splice(childIndex, 1, element);

      if (e.liston && e.compound) {
        e.compound.forEach((id: any) => {
          const liston = Element.GetElement(id) as any;
          const listonIndex = elements.findIndex((el: any) => el.id === id);
          elements.splice(listonIndex, 1, (Object as any).assign(elements[listonIndex], { position: position }))
        });
      }

      Modulo.Selected().elements.forEach((elem: any) => {
        Separator.CalcularConexiones(elem);
        if (elem.cajon) {
          Cajon.AgregarPiezasTapacantos(elem, elem.tapacantos);
        }
        if (elem.puerta) {
          Puerta.AgregarPiezasTapacantos(elem, elem.puerta.tapacantos);
        }
      });
    },
    setSeparatorBottomRoot(state: any, payload: any) {
      const elements = Modulo.Selected().elements as any;
      const childIndex = Modulo.SelectedIndex();
      const e = elements[childIndex] as any;
      const bottom = Element.GetAfterSibling(e) as Element;

      let min = 0;
      var total = Element.getAbsoluteY(e);
      min = total-Element.GetHeight(bottom);
      payload = payload-min;
      // return true;
      const position = { x: e.position.x, y: e.position.y - Element.GetHeight(bottom) + payload }
      const element = (Object as any).assign(elements[childIndex], { position: position });

      if (Modulo.Selected().isTypeL && element.liston && element.lPartId) {
        // es un modulo en el y es un liston horizontal
        Separator.getLPart(element).Y = Element.GetY(element);
      }

      elements.splice(childIndex, 1, element);

      if (e.liston && e.compound) {
        e.compound.forEach((id: any) => {
          const liston = Element.GetElement(id) as any;
          const listonIndex = elements.findIndex((el: any) => el.id === id);
          elements.splice(listonIndex, 1, (Object as any).assign(elements[listonIndex], { position: position }))
        });
      }

      Modulo.Selected().elements.forEach((elem: any) => {
        Separator.CalcularConexiones(elem);
        if (elem.cajon) {
          Cajon.AgregarPiezasTapacantos(elem, elem.tapacantos);
        }
        if (elem.puerta) {
          Puerta.AgregarPiezasTapacantos(elem, elem.puerta.tapacantos);
        }
      });
    },
    setSepartorExtraArea(state: any, payload: any) {
      const elements = Modulo.Selected().elements;
      const childIndex = Modulo.SelectedIndex();
      const elemento = elements[childIndex] as any;
      elemento[payload.key] = payload.value;
      elements.splice(childIndex, 1, elemento);
    },
    setSeparatorX(state: any, payload: any) {
      console.log('X:')
      console.log(payload)
      const elements = Modulo.Selected().elements
      const childIndex = Modulo.SelectedIndex()

      const e = elements[childIndex] as Separator
      payload.x = payload.x - (this as any).getters.getX(e.id) + e.position.x
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], { position: payload }))
    },
    setSeparatorY(state: any, payload: any) {
      const elements = Modulo.Selected().elements
      const childIndex = Modulo.SelectedIndex()

      const e = elements[childIndex] as Separator
      payload.y = payload.y - (this as any).getters.getY(e.id) + e.position.y
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], { position: payload }))
    },
    setSeparatorMaterial(state: any, payload: any) {
      const elements = Modulo.Selected().elements
      const childIndex = Modulo.SelectedIndex()
      const element = (Object as any).assign(elements[childIndex], { material: payload });
      if (element.lPartId) {
        let lPart = Separator.getLPart(element);
        lPart.material = payload;
        const lPartIndex = Separator.getLPartIndex(element);
        elements.splice(lPartIndex, 1, (Object as any).assign(elements[lPartIndex], lPart));
      }
      elements.splice(childIndex, 1, element);
    },
    setPuertaMaterial(state: any, payload: any) {
      const elements = Modulo.Selected().elements
      const childIndex = Modulo.SelectedIndex();
      const element = (elements[childIndex] as any);
      element.puerta.material = payload;
      elements.splice(childIndex, 1, element);
    },
    setPuertaBisagra(state: any, payload: any) {
      const elements = Modulo.Selected().elements
      const childIndex = Modulo.SelectedIndex();
      const element = (elements[childIndex] as any);
      element.puerta.bisagraTipo = payload;
      elements.splice(childIndex, 1, element);
    },
    dividirSeparador(state: any, payload: any) {
      const parent = (this as any).getters.selectedElement
      parent.childs = []
      parent.layout === 'horizontal'
      parent.division = payload[1]

      // Se crean dos SeparatorDividido
      // El AVETA de cada uno es: (AVETA(padre) - espacio) / 2
      // Ej: (500 - 300) / 2 = 100

      // SeparatorDividido#1
      let sep1 = new SeparatorDividido(parent, { x: Element.GetX(parent), y: Element.GetY(parent), z: Number(Separator.GetFrenteZ(parent)) }, Separator.GetOrientacion(parent), state.selectedModule)

      // SeparatorDividido#2
      // El segundo separador tiene un Z diferente (más adelante) y se calcula:
      // Z padre + Ancho separador#1 + Espacio entre separadores
      let coordenadaZ = SeparatorDividido.GetAnchoVeta(sep1) + Number(sep1.division) + Number(Separator.GetFrenteZ(parent))
      let sep2 = new SeparatorDividido(parent, { x: Element.GetX(parent), y: Element.GetY(parent), z: coordenadaZ }, Separator.GetOrientacion(parent), state.selectedModule)
      Modulo.Selected().elements.forEach(elem => Separator.CalcularConexiones(elem as any));
    },
    deleteDividir(state: any, payload: any) {
      const parent = (this as any).getters.selectedElement
      parent.childs = []
      parent.layout === 'horizontal'
    },
    aplicarSolapar(state: any, payload: any) {
      const elements = Modulo.Selected().elements
      let element = elements.filter((element: any) => element.id == payload[0])
      let separador = (element[0] as Separator)
      let value = parseInt(payload[1])
      let orientacion = payload[2]
      let accion = payload[3]

      // Si el separador tiene divisiones no se puede solapar o recortar
      if (separador.separator && separador.childs != undefined && separador.childs != null && separador.childs.length > 0) {
        return
      }

      if (accion != null && orientacion != value && value != null) {
        console.log(accion + ' hacia ' + orientacion + ': ' + value + ' pixeles')
        // Derecha
        if (orientacion == 'derecha' || orientacion == 'izquierda') {
          if (accion == 'solapar') {
            separador.largoVeta = Separator.GetLargoVeta(separador) + value
          } else {
            separador.largoVeta = Separator.GetLargoVeta(separador) - value
          }
          // Solo aplica a la dirección izquierda
          if (orientacion == 'izquierda') {
            if (accion == 'solapar') {
              separador.position.x = separador.position.x - value
            } else {
              separador.position.x = separador.position.x + value
            }
            console.log(separador.position.x)
          }
        }

        // Arriba
        if (orientacion == 'arriba') {
          if (accion == 'solapar') {
            separador.largoVeta = Separator.GetLargoVeta(separador) + value
          } else {
            separador.largoVeta = Separator.GetLargoVeta(separador) - value
          }
        }

        // Arriba
        if (orientacion == 'frente') {
          if (accion == 'solapar') {
            separador.anchoVeta = Separator.GetAnchoVeta(separador) + value
          } else {
            separador.anchoVeta = Separator.GetAnchoVeta(separador) - value
          }
        }

        // Recortar de atras
        if (orientacion === 'atras') {
          separador.anchoVeta = Separator.GetAnchoVeta(separador) - value;
          separador.ejeZ += value;
        }
        elements.splice((elements as any).findIndex((e: any) => e.id === separador.id), 1, separador);
        Modulo.Selected().elements.forEach(elem => Separator.CalcularConexiones(elem as any));
      } else {
        console.log('No se paso algun valor')
      }
    },
    deleteDivided(state: any, payload: Element) {
      Vue.set(payload, 'division', 0);
    },
    deleteElements(state: any, payload: Number[]) {
      const modulo = Modulo.Selected();
      const getIds = function (id: number, ids: number[]) {
        let element = Element.GetElement(id) as any;
        if (element && element.childs && element.childs.length > 0) {
          element.childs.forEach((i: any) => getIds(i, ids));
        } else if (element && ids.indexOf(id) === -1) {
          ids.push(id);
        }

        return ids
      }

      let ids: any = [].concat(payload);
      payload.forEach((id: any) => {
        // obtengo los id de todos los descendientes del elemento que tengo que borrar
        ids = getIds(id, [id]);

        ids.forEach((id: any) => {
          // Eliminar referencia del padre
          const parent = (this as any).getters.getParent(id) as Cube
          if (parent && parent.childs) {
            parent.childs = parent.childs.filter((child: any) => child !== id)

            if (parent.childs.length === 0) {
              parent.childs = null
            }
          }

          // Si es modulo en L y tiene pieza en L, la elimino tambien
          const element = (modulo.elements as any).find((element: any) => element.id === id);
          if (element.lPartId) {
            modulo.elements = modulo.elements.filter((el: any) => el.id !== element.lPartId);
          }

          if (element.liston && element.compound.length > 0) {
            // Saco al elemento que estoy borrando de la lista de listones compuestos
            element.compound.forEach((id: any) => {
              const elements = modulo.elements as any;
              const index = elements.findIndex((el: any) => el.id === id);
              elements.splice(index, 1, (Object as any).assign(elements[index], { compound: elements[index].compound.filter((idx: any) => idx !== element.id) }));
            });
          }

          // Eliminar elemento de la lista de elementos
          modulo.elements = modulo.elements.filter((element: any) => element.id !== id);
          Modulo.Selected().elements.forEach((elem: any) => {
            if (elem.conexionesAfter) {
              elem.conexionesAfter = elem.conexionesAfter.filter((element: any) => element.separator.id !== id)
            }
            if (elem.conexionesBefore) {
              elem.conexionesBefore = elem.conexionesBefore.filter((element: any) => element.separator.id !== id)
            }
          });
        });
      });

      // Quitar seleccion
      modulo.selected = null
      Modulo.Selected().elements.forEach(elem => Separator.CalcularConexiones(elem as any));
    },
    setComentario(state: any, payload: any) {
      const isCustomDoor = typeof payload !== 'string';
      const elements = Modulo.Selected().elements;
      const childIndex = Modulo.SelectedIndex();
      if (isCustomDoor) {
        const puerta = (elements[childIndex] as any).puerta;
        puerta.comentario = payload.value;
        elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], { puerta: puerta }))
      } else {
        elements[childIndex].comentario = payload;
      }
    },
    /**
     * Cambia el estado de una capa. Oculta o muestra los elementos pertenecientes a esa capa.
     * layerId: id de la capa (la capa numero 1 tiene id 0)
     * value: true/false
     */
    toggleLayer(state: any, { layerId, value }: any) {
      const modulo = Modulo.Selected();
      modulo.layers[layerId].visible = value;
      modulo.selected = undefined;
    },
    setVisibility(state: any, payload: boolean) {
      const elements = Modulo.Selected().elements;
      const childIndex = Modulo.SelectedIndex();
      const element = elements[childIndex] as any;
      if (element.cajon) {
        Cajon.setCajonVisibility(element, payload);
        return;
      }

      if (element.lPartId && element.lPartId >= 0) {
        Separator.getLPart(element).visible = payload;
      }

      if (element.liston && element.compound.length > 0) {
        element.compound.forEach((id: number) => {
          Separator.GetElement(id).visible = payload;
        });
      }

      element.visible = payload;
    },
    setDoorVisibility(state: any, payload: boolean) {
      const elements = Modulo.Selected().elements;
      const childIndex = Modulo.SelectedIndex();
      const element = (elements[childIndex] as any);
      Puerta.setDoorVisibility(element, payload);
    },
    setCajonProperty(state: any, payload: any) {
      const elements = Modulo.Selected().elements
      const childIndex = Modulo.SelectedIndex()
      console.log(childIndex);
      const elemento = elements[childIndex];
      elements.forEach((el: any) => {
        if (el.parent === elemento.parent && el.cajon) {
          (Object as any).assign(el, payload);
          Cajon.AgregarPiezasTapacantos(el, el.tapacantos);
        }
      });
      elements.splice(childIndex, 1, (Object as any).assign(elemento, payload))
      Modulo.Selected().elements.forEach(elem => Separator.CalcularConexiones(elem as any));
    },
    setCajonPropertyIndex(state: any, payload: any) {
      // alert(payload.childIndex);
      const elements = payload.elements
      const childIndex = payload.childIndex ? payload.childIndex:Modulo.SelectedIndex();
      console.log(payload.data);
      // return true;
      const elemento = elements[childIndex];
      elements.forEach((el: any) => {
        if (el.parent === elemento.parent && el.cajon) {
          (Object as any).assign(el, payload.data);
          Cajon.AgregarPiezasTapacantos(el, el.tapacantos);
        }
      });
      elements.splice(childIndex, 1, (Object as any).assign(elemento, payload.data))
      Modulo.Selected().elements.forEach(elem => Separator.CalcularConexiones(elem as any));
    },
    setBandejaProperty(state: any, payload: any) {
      const elements = Modulo.Selected().elements
      const childIndex = Modulo.SelectedIndex()
      const elemento = elements[childIndex] as Bandeja;
      elements.splice(childIndex, 1, (Object as any).assign(elemento, payload))
      Modulo.Selected().elements.forEach(elem => Separator.CalcularConexiones(elem as any));
    },
    /**
     * Cambia la dimension del modulo
     */
    setSelectedModuleDimension(state: any, payload: any) {
      let elements = Modulo.Selected().elements as any;
      Modulo.Selected().customFondos = [];

      const latDerIndex = elements.findIndex((el: any) => el.name === 'Lat. Derecho');
      const latDer = elements.find((el: any) => el.name === 'Lat. Derecho');
      const latDerPosition = { y: latDer.y, x: payload.width - latDer.size };
      elements.splice(latDerIndex, 1, (Object as any).assign(elements[latDerIndex], { position: latDerPosition }));
      const techo = elements.find((el: any) => el.name === 'Techo');
      const techoIndex = elements.findIndex((el: any) => el.name === 'Techo');
      const techoPosition = { x: techo.x, y: payload.height - techo.size };
      elements.splice(techoIndex, 1, (Object as any).assign(elements[techoIndex], { position: techoPosition }));

      (Object as any).assign(Modulo.Selected(), payload);

      elements.forEach((elem: any, index: number) => {
        // actualizo el tamaño de los rieles
        if (elem.riel) {
          let puertaIndex = elements.findIndex((e: any) => e.id === elem.puertaCorredizaId);
          const indexRiel = elements.findIndex((elem: any) => elem.puertaCorredizaId === elements[puertaIndex].id);
          const materialRiel = elements[indexRiel].material;
          // Borro los rieles
          elements.splice(indexRiel, 1);
          elements.splice(elements.findIndex((elem: any) => elem.puertaCorredizaId === elements[puertaIndex].id), 1);
          crearRielesPuertaCorrediza(materialRiel, puertaIndex);

        }
        // actualizo piezas-tapacantos de cajones
        if (elem.cajon) {
          Cajon.AgregarPiezasTapacantos(elem, elem.tapacantos);
        }

        // actualizo piezas-tapacantos de puertas
        if (elem.puerta) {
          Puerta.AgregarPiezasTapacantos(elem, elem.puerta.tapacantos);
        }

        // console.log(elem);
        try {
          Separator.CalcularConexiones(elem as any);
        } catch (error) {
          console.log(error);
        }

        if (elem.separatorDivision && elem.ejeZ !== 0) {
          const newGap = Separator.GetAnchoVeta(elem.separadorPadre) * elem.proportionDivision;
          let newWidth = (Separator.GetAnchoVeta(elem.separadorPadre) - newGap) / 2;
          Vue.set(elem, 'ejeZ', newWidth + newGap);
        }
      });
    },
    setTapacanto(state: any, payload: any) {
      const elements = Modulo.Selected().elements
      const childIndex = Modulo.SelectedIndex()
      let elemento = (elements[childIndex] as any)
      const tc = elemento.tapacantos
      tc[payload.key] = payload.value
      if (elemento.cajon) {
        const modulo = Modulo.Selected();
        const ubicacion = payload.key;
        const tapacanto = payload.value;
        const elements = modulo.elements as any;
        const oldTapacantos = elemento.tapacantos;
        const newTapacantos: any = { ...oldTapacantos };
        newTapacantos[ubicacion] = tapacanto;

        elements.forEach((el: any) => {
          if (el.parent === elemento.parent && el.cajon) {
            el.tapacantos[payload.key] = payload.value;
            Cajon.AgregarPiezasTapacantos(el, newTapacantos);
          }
        });
      }
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], tc))
    },
    /**
     * Utilizado para cargar las configuraciones guardadas (por ejemplo, el preset de un cajon).
     * Setea los tapacantos por ID
     */
    setTapacantoById(state: any, payload: any) {
      const elements = Modulo.Selected().elements
      const childIndex = Modulo.SelectedIndex()
      let elemento = (elements[childIndex] as any)
      const tc = elemento.puerta ? elemento.puerta.tapacantos : elemento.tapacantos
      tc[payload.key] = payload.value
      const tapacantos = (this as any).getters.getTapacantosAdd
      if (elemento.puerta) {
        elemento.puerta.tapacantos[payload.key] = tapacantos.find((tapacanto: any) => tapacanto.id === payload.value);
      }
      if (elemento.cajon) {
        elements.forEach((el: any) => {
          if (el.parent === elemento.parent && el.cajon) {
            el.tapacantos[payload.key] = tapacantos.find((tapacanto: any) => tapacanto.id === payload.value);
          }
        });
      }
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], tc))
    },
    setTapacantoDivision(state: any, payload: any) {
      const elements = Modulo.Selected().elements
      const childIndex = Modulo.SelectedIndex()

      let elementoId = (elements[childIndex] as Separator).childs[payload.pieza]
      let elemento = (elements.filter((element: any) => {
        return element.id == elementoId
      }) as any[])[0]

      const tc = elemento.tapacantos
      tc[payload.key] = payload.value
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], tc))
    },
    setTapacantoDF(state: any, payload: any) {
      const elements = Modulo.Selected().elements
      const childIndex = Modulo.SelectedIndex()
      const tc = (elements[childIndex] as any).dobleFondo.tapacantos
      tc[payload.key] = payload.value
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], tc))
    },
    setTapacantoPuerta(state: any, payload: any) {
      const elements = Modulo.Selected().elements
      const childIndex = Modulo.SelectedIndex()
      const tc = (elements[childIndex] as any).puerta.tapacantos
      tc[payload.key] = payload.value
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], tc))
      Puerta.AgregarPiezasTapacantos(elements[childIndex], tc);
    },
    updateMaterialFondo(state: any, payload: any) {
      let givenCurrentModule = null
      if (
        payload.existingModule &&
        payload.existingModule.hasOwnProperty("moduleName") &&
        payload.existingModule.hasOwnProperty("isRoomEditor")
      ){
        if (!payload.existingModule.isRoomEditor) {
          let normalizedName = `Mod ${String(payload.existingModule.moduleName.split(' ')[1])}`
          givenCurrentModule = state.modules.find((module: any) => module.moduleName === normalizedName)
        } else {
          let roomEditorModuleIndexWithHundred = String(payload.existingModule.moduleName.split(' ')[1])
          let roomEditorRealModuleNumber = Number(roomEditorModuleIndexWithHundred.substring(0, roomEditorModuleIndexWithHundred.length - 2))
          let moduleName = `Mod ${roomEditorRealModuleNumber}`
          givenCurrentModule = state.roomEditorModules.find((module: any) => module.moduleName === moduleName)
        }
      }

      givenCurrentModule = givenCurrentModule ? givenCurrentModule : Modulo.Selected();
      givenCurrentModule.fondo = payload.material
    },
    updateDescription(state: any, payload: any) {
      let givenCurrentModule = null
      if (
        payload.existingModule &&
        payload.existingModule.hasOwnProperty("moduleName") &&
        payload.existingModule.hasOwnProperty("isRoomEditor")
      ){
        if (!payload.existingModule.isRoomEditor) {
          let normalizedName = `Mod ${String(payload.existingModule.moduleName.split(' ')[1])}`
          givenCurrentModule = state.modules.find((module: any) => module.moduleName === normalizedName)
          givenCurrentModule.settings.description = payload.description
        } else {
          let roomEditorModuleIndexWithHundred = String(payload.existingModule.moduleName.split(' ')[1])
          let roomEditorRealModuleNumber = Number(roomEditorModuleIndexWithHundred.substring(0, roomEditorModuleIndexWithHundred.length - 2))
          let moduleName = `Mod ${roomEditorRealModuleNumber}`
          givenCurrentModule = state.roomEditorModules.find((module: any) => module.moduleName === moduleName)
          givenCurrentModule.settings.description = payload.description
        }
      }
    },
    updateCommentary(state: any, payload: any) {
      let givenCurrentModule = null
      if (
        payload.existingModule &&
        payload.existingModule.hasOwnProperty("moduleName") &&
        payload.existingModule.hasOwnProperty("isRoomEditor")
      ){
        if (!payload.existingModule.isRoomEditor) {
          let normalizedName = `Mod ${String(payload.existingModule.moduleName.split(' ')[1])}`
          givenCurrentModule = state.modules.find((module: any) => module.moduleName === normalizedName)
          givenCurrentModule.settings.comentario = payload.commentary
        } else {
          let roomEditorModuleIndexWithHundred = String(payload.existingModule.moduleName.split(' ')[1])
          let roomEditorRealModuleNumber = Number(roomEditorModuleIndexWithHundred.substring(0, roomEditorModuleIndexWithHundred.length - 2))
          let moduleName = `Mod ${roomEditorRealModuleNumber}`
          givenCurrentModule = state.roomEditorModules.find((module: any) => module.moduleName === moduleName)
          givenCurrentModule.settings.comentario = payload.commentary
        }
      }
    },
    addDobleFondo(state: any) {
      const elements = Modulo.Selected().elements
      const childIndex = Modulo.SelectedIndex()
      const df = new DobleFondo()
      df.size = Modulo.Selected().settings.EspesorGeneral
      df.material = (this as any).getters.defaultMaterial
      df.name = 'Doble Fondo ' + elements[childIndex].id
      df.z = 0
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], { dobleFondo: df }));
    },
    addDobleFondoCustom(state: any, payload: any) {
      const elements = Modulo.Selected().elements;
      const childIndex = Modulo.SelectedIndex();
      const df = new DobleFondo();
      df.size = Modulo.Selected().settings.EspesorGeneral;
      df.material = (this as any).getters.defaultMaterial;
      df.name = 'Doble Fondo ' + elements[childIndex].id;
      df.z = 0;
      df.isCustom = true;
      df.sides = payload.dobleFondoSides;
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], { dobleFondo: df }));
    },
    addPuerta(state: any, payload: any) {
      const elements = Modulo.Selected().elements
      const tc = (this as any).state.general[state.ambienteEnabled ? 'tapacantos_default_por_modulo_room_editor' : 'tapacantos_default_por_modulo'][Modulo.Selected().moduleId - 1];
      const tcFrente = tc ? JSON.parse(tc) : (this as any).getters.tapacantos_default;
      const childIndex = Modulo.SelectedIndex()
      const puerta = new Puerta()
      puerta.name = 'Puerta ' + elements[childIndex].id;
      puerta.corrediza = payload && payload.corrediza;
      puerta.size = Modulo.Selected().settings.EspesorGeneral
      puerta.tapacantos = { superior: tcFrente, inferior: tcFrente, izquierdo: tcFrente, derecho: tcFrente }
      const mat = (this as any).state.general[state.ambienteEnabled ? 'material_default_por_modulo_room_editor' : 'material_default_por_modulo_grupo'][Modulo.Selected().moduleId - 1];
      const mDefault = tc ? JSON.parse(mat) : (this as any).getters.defaultMaterial;
      puerta.material = mDefault;
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], { puerta: puerta, grupoMaterial:true }))
      Puerta.UpdatePosicionBisagras(elements[childIndex]);
      Puerta.AgregarPiezasTapacantos(elements[childIndex], puerta.tapacantos);
    },
    addPuertaCustom(state: any, payload: any) {
      const elements = Modulo.Selected().elements;
      const tc = (this as any).state.general[state.ambienteEnabled ? 'tapacantos_default_por_modulo_room_editor' : 'tapacantos_default_por_modulo'][Modulo.Selected().moduleId - 1];
      const tcFrente = tc ? JSON.parse(tc) : (this as any).getters.tapacantos_default;
      const childIndex = Modulo.SelectedIndex();
      let puerta;
      if (payload.corrediza) {
        puerta = new PuertaCorrediza();
        puerta.elementType = ElementType.puertaCorrediza;
      } else {
        puerta = new Puerta();
        puerta.elementType = ElementType.puertaCustom;
        puerta.tapacantos = { superior: tcFrente, inferior: tcFrente, izquierdo: tcFrente, derecho: tcFrente };
      }
      puerta.name = 'Puerta ' + elements[childIndex].id;
      puerta.size = Modulo.Selected().settings.EspesorGeneral;
      puerta.sides = payload.doorSides;
      const mat = (this as any).state.general[state.ambienteEnabled ? 'material_default_por_modulo_room_editor' : 'material_default_por_modulo'][Modulo.Selected().moduleId - 1];
      const mDefault = tc ? JSON.parse(mat) : (this as any).getters.defaultMaterial;
      puerta.material = mDefault;
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], { puerta: puerta }));

      if (payload.corrediza) {
        // agrego los rieles
        crearRielesPuertaCorrediza('', Modulo.SelectedIndex());
        PuertaCorrediza.UpdateMaterial(puerta as PuertaCorrediza, (this as any).getters.defaultMaterial);
      }

      Modulo.Selected().elements.forEach(elem => Separator.CalcularConexiones(elem as any));
      Puerta.UpdatePosicionBisagras(elements[childIndex]);
      Puerta.AgregarPiezasTapacantos(elements[childIndex], puerta.tapacantos);
    },
    deleteDobleFondo(state: any, payload: any) {
      let elements = Modulo.Selected().elements as any;
      const childIndex = Modulo.SelectedIndex();
      let container = elements[childIndex];
      delete container.dobleFondo;
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], container));
      Modulo.Selected().selected = null;
    },
    deleteDoor(state: any, payload: any) {
      let elements = Modulo.Selected().elements as any;
      const childIndex = Modulo.SelectedIndex();
      let container = elements[childIndex];
      if (container.puerta.corrediza) {
        // Borro el riel superior e inferior. filter no funciona
        elements.splice(elements.findIndex((elem: any) => elem.puertaCorredizaId === container.id), 1);
        elements.splice(elements.findIndex((elem: any) => elem.puertaCorredizaId === container.id), 1);
      }
      Puerta.EliminarPiezasTapacantos(container);
      delete container.puerta;
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], container));
      Modulo.Selected().selected = null;
    },
    setModuleSetting(state: any, payload: any) {
      (Modulo.Selected().settings as any)[payload.key] = payload.value;

      // actualizo piezas-tapacantos de cajones y puertas
      const elements = Modulo.Selected().elements
      elements.forEach((el: any) => {
        if (el.cajon) {
          Cajon.AgregarPiezasTapacantos(el, el.tapacantos);
        }
        if (el.puerta) {
          Puerta.AgregarPiezasTapacantos(el, el.puerta.tapacantos);
        }
      });
    },
    setExportableCustomFondo(state: any, payload: any) {
      const index = Modulo.Selected().customFondos.findIndex((elem: any) => elem.Name === payload.Name);
      Modulo.Selected().customFondos[index].Exportable = payload.Exportable;
    },
    selectModule(state: any, payload: any) {
      if (payload < Modulo.GetModules().length) {
        state[Modulo.isRoomEditorSelected() ? 'selectedRoomEditorModule' : 'selectedModule'] = payload;
      }
    },
    updateDeactivatedModules(state: any, payload: any) {
      if (!payload) {
        return;
      }
      Modulo.GetModules().forEach(m => {
        m.activated = payload.indexOf(m.moduleId) === -1;
      });
    },
    activateModule(state: any, payload: any) {
      Modulo.GetModuleByIndex(payload - 1).activated = true;
    },
    setModuleCount(state: any, payload: any) {
      const roomEditorEnabled = Modulo.isRoomEditorSelected();
      state[roomEditorEnabled ? 'selectedRoomEditorModule' : 'selectedModule'] = Math.min(state.selectedModule, payload - 1);
      let modules = Modulo.GetModules();
      const keyMaterial = roomEditorEnabled ? 'material_default_por_modulo_room_editor' : 'material_default_por_modulo';
      const keyTapacanto = roomEditorEnabled ? 'tapacantos_default_por_modulo_room_editor' : 'tapacantos_default_por_modulo';
      if (payload < Modulo.GetModules().length) {
        const deleteModules = modules.slice(payload, modules.length);
        deleteModules.forEach((modulo: any, i: number) => {
          (this as any).state.general[keyMaterial][i + payload] = null;
          (this as any).state.general[keyTapacanto][i + payload] = null;
        });

        modules.splice(payload, modules.length - 1);
      } else {
        for (let i = modules.length; i < payload; i++) {
          modules.push(new Modulo(roomEditorEnabled));

          if (i < payload - 1) {
            (this as any).state.general[keyMaterial][i + 1] = null;
            (this as any).state.general[keyTapacanto][i + 1] = null;
          }
        }
      }
    },
    saveDrawing(state: any, payload: any) {
      console.log(payload);
      if (payload.id >= 100000) {
        //fondo

        const drawing: any = {};
        const conexionesDrawing: any = {};
        drawing[payload.side] = payload.drawing;
        conexionesDrawing[payload.side] = payload.conexionesDrawing;

        const modulo = Modulo.Selected();
        if (modulo.customFondos.length === 0) {
          Vue.set(modulo, 'drawing', drawing);
          try {
            Vue.set(modulo, 'conexionesDrawing', conexionesDrawing);
          } catch (error) {
            
          }
        } else {
          const fondoIndex = modulo.customFondos.findIndex((f: any) => f.Name === payload.name);
          modulo.customFondos.splice(fondoIndex, 1, (Object as any).assign(modulo.customFondos[fondoIndex], { drawing }))
        }
        return;
      }

      const elements = Modulo.Selected().elements as any;
      const childIndex = Modulo.SelectedIndex();
      const element = elements[childIndex];
      console.log(element);
      if (payload.property) {
        const drawing: any = element[payload.property].drawing || {};
        drawing[payload.side] = payload.drawing;
        const conexionesDrawing: any = element[payload.property].conexionesDrawing || {};
        conexionesDrawing[payload.side] = payload.conexionesDrawing;
        (Object as any).assign(element[payload.property], { drawing, conexionesDrawing })
      } else {
        const drawing: any = element.drawing || {};
        drawing[payload.side] = payload.drawing;
        const conexionesDrawing: any = element.conexionesDrawing || {};
        conexionesDrawing[payload.side] = payload.conexionesDrawing;
        console.log(element);
        (Object as any).assign(element, { drawing, conexionesDrawing });
      }

      elements.splice(childIndex, 1, element);
    },
    deleteDrawing(state: any, payload: any) {
      if (payload.id >= 100000) {
        //fondo

        const modulo = Modulo.Selected();

        if (modulo.customFondos.length === 0) {
          modulo.drawing = undefined;
          modulo.conexionesDrawing = undefined;
        } else {
          const fondoIndex = modulo.customFondos.findIndex((f: any) => f.Name === payload.name);
          modulo.customFondos.splice(fondoIndex, 1, (Object as any).assign(modulo.customFondos[fondoIndex], { drawing: undefined }))
          modulo.customFondos.splice(fondoIndex, 1, (Object as any).assign(modulo.customFondos[fondoIndex], { conexionesDrawing: undefined }))
        }

        return;
      }

      const elements = Modulo.Selected().elements as any;
      const childIndex = Modulo.SelectedIndex();
      const element = elements[childIndex];

      if (payload.property) {
        const drawing: any = element[payload.property].drawing;
        drawing[payload.side] = undefined;
        const conexionesDrawing: any = element[payload.property].conexionesDrawing;
        conexionesDrawing[payload.side] = undefined;
        (Object as any).assign(element[payload.property], { drawing, conexionesDrawing })
      } else {
        const drawing: any = element.drawing;
        const conexionesDrawing: any = element.conexionesDrawing;
        drawing[payload.side] = undefined;
        conexionesDrawing[payload.side] = undefined;
        (Object as any).assign(element, { drawing, conexionesDrawing })
      }

      elements.splice(childIndex, 1, element);
    },
    setPosicionBisagras(state: any, payload: any) {
      const elements = Modulo.Selected().elements
      const childIndex = Modulo.SelectedIndex()
      const p = (elements[childIndex] as any).puerta;
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], { puerta: payload.puerta }))
    },
    updatePosicionBisagras(state: any, payload: any) {
      const elements = Modulo.Selected().elements
      const childIndex = Modulo.SelectedIndex()
      Puerta.UpdatePosicionBisagras(elements[childIndex]);
    },
    setPuertaProperty(state: any, payload: any) {
      const elements = Modulo.Selected().elements
      const childIndex = Modulo.SelectedIndex()
      const p = (elements[childIndex] as any).puerta;

      if (payload.key === 'cantidadBisagras') {
        if (payload.value > p.cantidadBisagras) {
          for (let index = 0; index < payload.value - p.cantidadBisagras; index++) {
            p.posicionBisagrasDerecha.push(0);
            p.posicionBisagrasIzquierda.push(0);
          }
        } else {
          p.posicionBisagrasDerecha.splice(p.posicionBisagrasDerecha.length - (p.cantidadBisagras - payload.value), p.cantidadBisagras - payload.value);
          p.posicionBisagrasIzquierda.splice(p.posicionBisagrasIzquierda.length - (p.cantidadBisagras - payload.value), p.cantidadBisagras - payload.value);
        }
      }

      if (payload.key !== 'cantPuertas') {
        p[payload.key] = payload.value
      } else {
        // Fix: llamo al setter cantPuertas
        (Object as any).setPrototypeOf(p, PuertaCorrediza.prototype)
        p.cantPuertas = +payload.value
      }
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], { puerta: p }))
      Puerta.UpdatePosicionBisagras(elements[childIndex]);
      Puerta.AgregarPiezasTapacantos(elements[childIndex], p.tapacantos)
    },
    updatePuertasCorredizas(state: any, payload: any) {
      const elements = Modulo.Selected().elements as any;
      const childIndex = Modulo.SelectedIndex();
      const puerta = (elements[childIndex] as any).puerta;
      puerta.puertas = payload.puertas;
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], { puerta: puerta }));
    },
    setPuertaKit(state: any, payload: any) {
      const elements = Modulo.Selected().elements as any;
      const childIndex = Modulo.SelectedIndex();
      const puerta = (elements[childIndex] as any).puerta;
      puerta['kit'] = payload;
      // Borro el riel superior e inferior. filter no funciona
      elements.splice(elements.findIndex((elem: any) => elem.puertaCorredizaId === elements[childIndex].id), 1);
      elements.splice(elements.findIndex((elem: any) => elem.puertaCorredizaId === elements[childIndex].id), 1);

      // agrego los rieles
      crearRielesPuertaCorrediza(payload.material, Modulo.SelectedIndex());

      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], { puerta: puerta }));
    },
    updateMaterialList(state: any, { material }: any) {
      (Object as any).assign(state.materials[material.nombre], material);
    },
    updateAlternativeMaterialList(state: any, { material }: any) {
      if (!state.alternativeMaterials[material.nombreOriginal]) {
        Vue.set(state.alternativeMaterials, material.nombreOriginal, {});
      }

      Vue.set(state.alternativeMaterials, material.nombreOriginal, material);
    },
    setAlternativeMaterialList(state: any, payload: any) {
      Object.keys(state.alternativeMaterials).forEach(key => {
        Vue.set(state.alternativeMaterials, key, null)
      });
    },
    updateMaterialListDesperdicio(state: any, { material }: any) {
      crearListaMateriales(); // slow
      (Object as any).assign(state.materials[material.nombre], material);
    },
    updatePresupuestoProperty(state: any, payload: any) {
      let index = Element.state.services.findIndex((s: any) => s.nombre === payload.item.nombre);
      let obj: any = {};
      obj[payload.key] = payload.item[payload.key];
      Element.state.services.splice(index, 1, (Object as any).assign(Element.state.services[index], obj));
    },
    addToPresupuesto(state: any, payload: any) {
      Element.state.services.push(payload);
    },
    setPresupuesto(state: any, payload: any) {
      Element.state.presupuesto = payload;
    },
    addCuota(state: any, payload: any) {
      const cuotas = Element.state.cuotas;
      cuotas.push(payload);
      Vue.set(state, 'cuotas', cuotas);
    },
    updateCuota(state: any, { cuota, index }: any) {
      const cuotas = Element.state.cuotas;
      cuotas[index] = cuota;
      Vue.set(state, 'cuotas', cuotas);
    },
    removeCuota(state: any, cuota: any) {
      const cuotas = Element.state.cuotas;
      const index = cuotas.findIndex((c: any) => c === cuota);
      cuotas.splice(index, 1);
      Vue.set(state, 'cuotas', cuotas);
    },
    removeFromPresupuesto(state: any, payload: any) {
      let index = Element.state.services.findIndex((s: any) => s.nombre === payload.nombre);
      Element.state.services.splice(index, 1);
    },
    setDoblefondoProperty(state: any, payload: any) {
      const elements = Modulo.Selected().elements
      const childIndex = Modulo.SelectedIndex()
      const df = (elements[childIndex] as any).dobleFondo
      df[payload.key] = payload.value
      elements.splice(childIndex, 1, (Object as any).assign(elements[childIndex], { dobleFondo: df }))
    },
    removeCajon(state: any) {
      const items = []
      const selected = Element.Selected()
      const parent: any = Element.GetParent(selected);
      const elements = Modulo.Selected().elements

      // borro piezas-tapacantos
      const cajonGroup = Cajon.GetCajonGroup(selected as Cajon);
      cajonGroup.childs.forEach((childId: number) => {
        const cajon = (elements as any).find((el: any) => el.id === childId);
        if (cajon.cajon) {
          Cajon.EliminarPiezasTapacantos(cajon);
        }
      });

      parent.cajonGroup = false
      const it = selected
      let beforeIt = Element.GetBeforeSibling(it)
      while (beforeIt != null) {
        items.push(beforeIt.id)
        beforeIt = Element.GetBeforeSibling(beforeIt)
      }
      items.push(selected.id)
      let afterIt = Element.GetAfterSibling(it)
      while (afterIt != null) {
        items.push(afterIt.id)
        afterIt = Element.GetAfterSibling(afterIt)
      }
      (this as any).commit('deleteElements', items)
    },
    calcularConexion(state: any, payload: any) {
      Separator.CalcularConexion(payload.separator, payload.s2, payload.tipo)
      Modulo.Selected().elements.forEach(elem => Separator.CalcularConexiones(elem as any))
    },
    calcularConexiones(state: any, payload: any) {
      Modulo.Selected().elements.forEach(elem => Separator.CalcularConexiones(elem as any))
    },
    addCustomPart(state: any, payload: any) {
      const piece = payload.piece;
      const modulo = Modulo.GetModuleByIndex(payload.module - 1);

      const elements = modulo.elements as any;
      const childIndex = elements.findIndex((element: any) => element.piezaManual && (element.id === piece.id));

      if (piece.moduleId && piece.moduleId !== payload.module) {
        // se cambia la pieza de modulo, hay que eliminarla del modulo viejo
        const oldModule = Modulo.GetModuleByIndex(piece.moduleId - 1);
        const oldElements = oldModule.elements as any;
        const oldIndex = oldElements.findIndex((element: any) => element.piezaManual && (element.id === piece.id));
        const parent = Element.GetParent(oldElements[oldIndex])
        const parentIndex = oldElements.findIndex((element: any) => parent.id === element.id);
        oldElements.splice(oldIndex, 1);
        oldElements.splice(parentIndex, 1);
      }

      if (childIndex > -1) {
        const parent = Element.GetParent(elements[childIndex])
        const parentIndex = elements.findIndex((element: any) => parent.id === element.id);
        elements.splice(childIndex, 1);
        elements.splice(parentIndex, 1);
      }
      const parent = new Cube(null, modulo);
      parent.childs = [];
      if (piece.Orietacion === 2 || piece.Orietacion === 4) {
        parent.layout = ModuleLayout.Horizontal;
      } else {
        parent.layout = ModuleLayout.Vertical;
      }

      const pieza = new PiezaManual(parent, piece.Espesor, modulo);
      pieza.name = piece.Name;
      pieza.tapacantos.izquierdo = piece.tapacantos.izquierdo;
      pieza.tapacantos.superior = piece.tapacantos.superior;
      pieza.tapacantos.inferior = piece.tapacantos.inferior;
      pieza.tapacantos.derecho = piece.tapacantos.derecho;
      pieza.girarVeta = piece.girarVeta;
      pieza.material = piece.material;
      pieza.size = +piece.Espesor;
      pieza.Count = +piece.Count;
      pieza.LVeta = +piece.LVeta;
      pieza.AVeta = +piece.AVeta;
      pieza.Orientacion = piece.Orientacion;
      pieza.X = +piece.X;
      pieza.Y = +piece.Y;
      pieza.Z = +piece.Z;
    },
    deleteCustomPart(state: any, payload: any) {
      const part = Element.GetElementFromAnyModuleById(payload);
      const elements = Modulo.GetModuleByIndex(part.moduleId - 1).elements as any;
      const index = elements.findIndex((elem: any) => elem.id === payload);
      elements.splice(index, 1);
    },
    addCustomModule(state: any, payload: any) {
      const root = new Cube(null, state.selectedModule)
      root.childs = []
      root.layout = 'horizontal'
      /* let sep = new ModuloExterno(root, payload.Espesor, state.selectedModule)
      sep.name = payload.TipoModulo
      sep.Count = payload.Cantidad
      sep.AVeta = payload.AVeta
      sep.LVeta = payload.LVeta
      sep.material = payload.Material   
      sep.Base = payload.Base
      sep.Profundidad = payload.Profundidad
      sep.Altura = payload.Altura
      sep.Ancho = payload.Ancho */

      if (payload.TipoModulo === ModulosExternosEnum.EstanteFlotante) {

        for (let num = 0; num < payload.Cantidad; num++) {
          if (payload.Espesor.toString() === EspesorEnum.Espesor18) {
            let pPart1 = new ModuloExterno(root, payload.Espesor, state.selectedModule)
            pPart1.Count = 1
            pPart1.name = payload.TipoModulo
            pPart1.AVeta = payload.AVeta
            pPart1.LVeta = payload.LVeta
            pPart1.material = payload.Material
            pPart1.Profundidad = payload.Profundidad
            pPart1.Altura = payload.Altura
            pPart1.Ancho = payload.Ancho
          }
          if (payload.Espesor.toString() === EspesorEnum.Espesor36) {
            if (payload.Base === TipoDeBaseEnum.Entera) {

              let pPart2 = new ModuloExterno(root, payload.Espesor, state.selectedModule)
              pPart2.Count = 1
              pPart2.name = EstanteFlotanteEnum.TapaAlta
              pPart2.AVeta = (payload.AVeta)
              pPart2.LVeta = (payload.LVeta)
              pPart2.material = payload.Material
              pPart2.Profundidad = payload.Profundidad
              pPart2.Altura = payload.Altura
              pPart2.Ancho = payload.Ancho

              let pPart3 = new ModuloExterno(root, payload.Espesor, state.selectedModule)
              pPart3.Count = 1
              pPart3.name = EstanteFlotanteEnum.TapaBaja
              pPart3.AVeta = (payload.AVeta)
              pPart3.LVeta = (payload.LVeta)
              pPart3.material = payload.Material
              pPart3.Profundidad = payload.Profundidad
              pPart3.Altura = payload.Altura
              pPart3.Ancho = payload.Ancho
            }
          }
          if (payload.Espesor.toString() === EspesorEnum.Espesor54) {

            let pPart4 = new ModuloExterno(root, payload.Espesor, state.selectedModule)
            pPart4.Count = 1
            pPart4.name = EstanteFlotanteEnum.TapaAlta
            pPart4.AVeta = (payload.AVeta)
            pPart4.LVeta = (payload.LVeta)
            pPart4.material = payload.Material
            pPart4.Profundidad = payload.Profundidad
            pPart4.Altura = payload.Altura
            pPart4.Ancho = payload.Ancho

            let pPart5 = new ModuloExterno(root, payload.Espesor, state.selectedModule)
            pPart5.Count = 1
            pPart5.name = EstanteFlotanteEnum.TapaMedia
            pPart5.AVeta = (payload.AVeta)
            pPart5.LVeta = (payload.LVeta)
            pPart5.material = payload.Material
            pPart5.Profundidad = payload.Profundidad
            pPart5.Altura = payload.Altura
            pPart5.Ancho = payload.Ancho

            let pPart6 = new ModuloExterno(root, payload.Espesor, state.selectedModule)
            pPart6.Count = 1
            pPart6.name = EstanteFlotanteEnum.TapaBaja
            pPart6.AVeta = (payload.AVeta)
            pPart6.LVeta = (payload.LVeta)
            pPart6.material = payload.Material
            pPart6.Profundidad = payload.Profundidad
            pPart6.Altura = payload.Altura
            pPart6.Ancho = payload.Ancho

          }
        }
      } else if (payload.TipoModulo === ModulosExternosEnum.Banquina) {


        for (let num = 0; num < payload.Cantidad; num++) {
          let pPart7 = new ModuloExterno(root, Modulo.Selected().settings.EspesorGeneral, state.selectedModule)
          pPart7.Count = 1
          pPart7.name = PiezasporModulosExternosEnum.Frente
          pPart7.AVeta = payload.AVeta
          pPart7.LVeta = payload.LVeta
          pPart7.material = payload.Material
          pPart7.Profundidad = payload.Profundidad
          pPart7.Altura = payload.Altura
          pPart7.Ancho = payload.Ancho

          let pPart8 = new ModuloExterno(root, Modulo.Selected().settings.EspesorGeneral, state.selectedModule)
          pPart8.Count = 1
          pPart8.name = PiezasporModulosExternosEnum.ContraFrente
          pPart8.AVeta = payload.AVeta
          pPart8.LVeta = payload.LVeta
          pPart8.material = payload.Material
          pPart8.Profundidad = payload.Profundidad
          pPart8.Altura = payload.Altura
          pPart8.Ancho = payload.Ancho

          let pPart9 = new ModuloExterno(root, Modulo.Selected().settings.EspesorGeneral, state.selectedModule)
          pPart9.Count = 1
          pPart9.name = PiezasporModulosExternosEnum.LateralIzquierdo
          pPart9.AVeta = payload.AVeta
          pPart9.LVeta = payload.Profundidad - (2 * Modulo.Selected().settings.EspesorGeneral)
          pPart9.Espesor = payload.LVeta - (2 * Modulo.Selected().settings.EspesorGeneral)
          pPart9.material = payload.Material
          pPart9.Profundidad = payload.Profundidad
          pPart9.Altura = payload.Altura
          pPart9.Ancho = payload.Ancho

          let pPart10 = new ModuloExterno(root, Modulo.Selected().settings.EspesorGeneral, state.selectedModule)
          pPart10.Count = 1
          pPart10.name = PiezasporModulosExternosEnum.LateralDerecho
          pPart10.AVeta = payload.AVeta
          pPart10.LVeta = payload.Profundidad - (2 * Modulo.Selected().settings.EspesorGeneral)
          pPart10.Espesor = payload.LVeta - (2 * Modulo.Selected().settings.EspesorGeneral)
          pPart10.material = payload.Material
          pPart10.Profundidad = payload.Profundidad
          pPart10.Altura = payload.Altura
          pPart10.Ancho = payload.Ancho
        }

      }
      else if (payload.TipoModulo === ModulosExternosEnum.MesaBajoMesada) {

        for (let num = 0; num < payload.Cantidad; num++) {
          let pPart11 = new ModuloExterno(root, Modulo.Selected().settings.EspesorGeneral, state.selectedModule)
          pPart11.Count = 1
          pPart11.name = PiezasporModulosExternosEnum.Tapa
          pPart11.AVeta = payload.Profundidad
          pPart11.LVeta = payload.Ancho
          pPart11.material = payload.Material
          pPart11.Profundidad = payload.Profundidad
          pPart11.Altura = payload.Altura
          pPart11.Ancho = payload.Ancho

          let pPart12 = new ModuloExterno(root, Modulo.Selected().settings.EspesorGeneral, state.selectedModule)
          pPart12.Count = 4
          pPart12.name = PiezasporModulosExternosEnum.Pata
          pPart12.AVeta = 80
          pPart12.LVeta = payload.Altura - (Modulo.Selected().settings.EspesorGeneral)
          pPart12.material = payload.Material
          pPart12.Profundidad = payload.Profundidad
          pPart12.Altura = payload.Altura
          pPart12.Ancho = payload.Ancho
        }

      } else {

        for (let num = 0; num < payload.Cantidad; num++) {
          let pPart13 = new ModuloExterno(root, Modulo.Selected().settings.EspesorGeneral, state.selectedModule)
          pPart13.Count = 1
          pPart13.name = payload.TipoModulo
          pPart13.AVeta = payload.AVeta
          pPart13.LVeta = payload.LVeta
          pPart13.material = payload.Material
          pPart13.Profundidad = payload.Profundidad
          pPart13.Altura = payload.Altura
          pPart13.Ancho = payload.Ancho
        }
      }
    },
    deleteCustomModule(state: any, payload: any) {
      state.customModules.splice(payload, 1)
    },
    setPiecePosition (state: any, payload: any) {
      let selectedModule: any = state.modules[payload.selectedModuleIndex];
      let selectedPiece: any = selectedModule.elements.find((element:any) => element.name === payload.selectedPieceName);

      if (
        selectedModule &&
        selectedModule.elements &&
        selectedPiece
      ){
        selectedPiece.position = {
          x: payload.position.x,
          y: payload.position.x
        }
      }
    },
    // setPieceThickness (state: any, payload: any) {
    //   let selectedModule: any = state.modules[payload.selectedModuleIndex];
    //   let selectedPiece: any = selectedModule.elements.find((element:any) => element.name === payload.selectedPieceName);

    //   if (
    //     selectedModule &&
    //     selectedModule.elements &&
    //     selectedPiece
    //   ){
    //     selectedPiece.size = Number(payload.thickness)
    //   }
    // },
    setPieceThickness (state: any, payload: any) {
      if (
        payload.hasOwnProperty("thickness") &&
        payload.hasOwnProperty("moduleName") &&
        payload.hasOwnProperty("pieceName") &&
        payload.hasOwnProperty("isRoomEditor")
      ){
        if (!payload.isRoomEditor) {
          let module = state.modules.find((module: any) => module.moduleName === payload.moduleName)
          let piece = module.elements.find((element:any) => element.name === payload.pieceName)
          console.log(module, piece, payload)
          piece.size = Number(payload.thickness)
        } else {
          let roomEditorModuleIndexWithHundred = String(payload.moduleName.split(' ')[1])
          let roomEditorRealModuleNumber = Number(roomEditorModuleIndexWithHundred.substring(0, roomEditorModuleIndexWithHundred.length - 2))
          let moduleName = `Mod ${roomEditorRealModuleNumber}`
          let module = state.roomEditorModules.find((module: any) => module.moduleName === moduleName)
          let piece = module.elements.find((element:any) => element.name === payload.pieceName)
          piece.size = Number(payload.thickness)
        }
      }else if (
        payload.hasOwnProperty("_showOnly") &&
        payload.hasOwnProperty("moduleName")
      ){
        let normalizedName = `Mod ${String(payload.moduleName.split(' ')[1])}`
        let module = state.modules.find((module: any) => module.moduleName === normalizedName)
        module._showOnly = payload._showOnly
      }
    },
    togglePieceVisibility (state: any, payload: any) {
      if (
        payload.hasOwnProperty("visible") &&
        payload.hasOwnProperty("moduleName") &&
        payload.hasOwnProperty("pieceName") &&
        payload.hasOwnProperty("isRoomEditor") &&
        payload.hasOwnProperty("pieceId")
      ){
        if (!payload.isRoomEditor) {
          let module = state.modules.find((module: any) => module.moduleName === payload.moduleName)

          // Module level fondo attribute validation
          if (payload.pieceName.includes('Fondo') && !payload.pieceName.includes('Doble')) {
            module.fondoVisible = payload.visible
          } else {
            let piece = null
            if (payload.elementId) {
              piece = module.elements.find((element:any) => {
                return element.id === payload.elementId
              })
            }
            setPieceVisibility(module.elements, payload.elementId, piece, payload.pieceName, payload.visible)
          }
        } else {
          let roomEditorModuleIndexWithHundred = String(payload.moduleName.split(' ')[1])
          let roomEditorRealModuleNumber = Number(roomEditorModuleIndexWithHundred.substring(0, roomEditorModuleIndexWithHundred.length - 2))
          let moduleName = `Mod ${roomEditorRealModuleNumber}`
          let module = state.roomEditorModules.find((module: any) => module.moduleName === moduleName)

          // Module level fondo attribute validation
          if (payload.pieceName.includes('Fondo') && !payload.pieceName.includes('Doble')) {
            console.log('chao')
            module.fondoVisible = payload.visible
          } else {
            let piece = null
            if (payload.elementId) {
              piece = module.elements.find((element:any) => {
                return element.id === payload.elementId
              })
            }
            piece.visible = payload.visible
          }
        }
      }
    },
    toggleModuleVisibility (state: any, payload: any) {
      if (
        payload.hasOwnProperty("_visible") &&
        payload.hasOwnProperty("moduleName") &&
        payload.hasOwnProperty("isRoomEditor")
      ){
        if (!payload.isRoomEditor) {
          let normalizedName = `Mod ${String(payload.moduleName.split(' ')[1])}`
          let module3d = state.modules.find((moduleFind: any) => moduleFind.moduleName === normalizedName)
          module3d._visible = payload._visible
        } else {
          let roomEditorModuleIndexWithHundred = String(payload.moduleName.split(' ')[1])
          let roomEditorRealModuleNumber = Number(roomEditorModuleIndexWithHundred.substring(0, roomEditorModuleIndexWithHundred.length - 2))
          let moduleName = `Mod ${roomEditorRealModuleNumber}`
          let module3d = state.roomEditorModules.find((moduleFind: any) => moduleFind.moduleName === moduleName)
          module3d._visible = payload._visible
        }
      }else if (
        payload.hasOwnProperty("_showOnly") &&
        payload.hasOwnProperty("moduleName") &&
        payload.hasOwnProperty("isRoomEditor")
      ){
        
        if (!payload.isRoomEditor) {
          let normalizedName = `Mod ${String(payload.moduleName.split(' ')[1])}`
          let module3d = state.modules.find((module: any) => module.moduleName === normalizedName)
          module3d._showOnly = payload._showOnly
        } else {
          let roomEditorModuleIndexWithHundred = String(payload.moduleName.split(' ')[1])
          let roomEditorRealModuleNumber = Number(roomEditorModuleIndexWithHundred.substring(0, roomEditorModuleIndexWithHundred.length - 2))
          let moduleName = `Mod ${roomEditorRealModuleNumber}`
          let module3d = state.roomEditorModules.find((module: any) => module.moduleName === moduleName)
          
          module3d._showOnly = payload._showOnly
        }
        state.showOnlyItsActiveInModules = state.modules.some((moduleShowOnly:Modulo) => moduleShowOnly._showOnly === true)
        state.showOnlyItsActiveInRoomEditorModules = state.roomEditorModules.some((moduleShowOnly:Modulo) =>  moduleShowOnly._showOnly === true)
      }
    },    
    setAllAxis(state: any, payload: any){
      if (
        payload.hasOwnProperty("moduleName") &&
        payload.hasOwnProperty("isRoomEditor")
      ){
        let currentModule = null
        
        if (!payload.isRoomEditor) {
          let normalizedName = `Mod ${String(payload.moduleName.split(' ')[1])}`
          currentModule = state.modules.find((module: any) => module.moduleName === normalizedName)
        } else {
          let roomEditorModuleIndexWithHundred = String(payload.moduleName.split(' ')[1])
          let roomEditorRealModuleNumber = Number(roomEditorModuleIndexWithHundred.substring(0, roomEditorModuleIndexWithHundred.length - 2))
          let moduleName = `Mod ${roomEditorRealModuleNumber}`
          currentModule = state.roomEditorModules.find((module: any) => module.moduleName === moduleName)
        }
        
        if (currentModule){
          currentModule._x = payload.x || currentModule._x
          currentModule._y = payload.y || currentModule._y
          currentModule._z = payload.z || currentModule._z
          currentModule._rx = payload.rx || currentModule._rx
          currentModule._ry = payload.ry || currentModule._ry
          currentModule._rz = payload.rz || currentModule._rz
        }
      }
    },

    setEjeX(state: any, payload: any) {
      const currentModule = payload.index !== undefined ? Modulo.GetModuleByIndex(payload.index) : Modulo.Selected();
      currentModule._x = payload._x || payload;
    },
    setEjeY(state: any, payload: any) {
      const currentModule = payload.index !== undefined ? Modulo.GetModuleByIndex(payload.index) : Modulo.Selected();
      currentModule._y = payload._y || payload;
    },
    setEjeZ(state: any, payload: any) {
      const currentModule = payload.index !== undefined ? Modulo.GetModuleByIndex(payload.index) : Modulo.Selected();
      currentModule._z = payload._z || payload;
    }, /*===Opciones de Rotacion en Grados Para el 3D=====*/
    setEjeRX(state: any, payload: any) {
      const currentModule = payload.index !== undefined ? Modulo.GetModuleByIndex(payload.index) : Modulo.Selected();
      currentModule._rx = payload._rx || payload;
    },
    setEjeRY(state: any, payload: any) {
      const currentModule = payload.index !== undefined ? Modulo.GetModuleByIndex(payload.index) : Modulo.Selected();
      currentModule._ry = payload._ry || payload;
    },
    setEjeRZ(state: any, payload: any) {
      const currentModule = payload.index !== undefined ? Modulo.GetModuleByIndex(payload.index) : Modulo.Selected();
      currentModule._rz = payload._rz || payload;
    }, /*===Opciones de Rotacion en Grados Para el 3D=====*/
    setHoveredElement(state: any, payload: any) {
      if (payload.elementIds) {
        state.hoveredElement = [...payload.elementIds];
      } else {
        state.hoveredElement = [payload.elementId];
      }
    },
    componerListones(state: any, payload: any) {
      const elements = Modulo.Selected().elements as any;
      const from = Element.GetElement(payload.origen) as any;
      const to = Element.GetElement(payload.destino) as any;
      const ids = {} as any;
      [...from.compound || [], ...to.compound || [], from.id, to.id].forEach((id: any) => {
        ids[id] = undefined;
      });

      const fromCompound = Object.keys(ids).map((_id: string) => +_id);
      fromCompound.forEach((id: any) => {
        const liston = Element.GetElement(id) as any;
        const listonIndex = elements.findIndex((e: any) => e.id === id);
        liston.diagramWidth = from.diagramWidth;
        liston.espesorListon = from.espesorListon;
        liston.anchoListon = from.anchoListon;
        liston.ejeZ = from.ejeZ;
        liston.visible = from.visible;
        elements.splice(listonIndex, 1, (Object as any).assign(elements[listonIndex], { compound: fromCompound, position: from.position }));
      });

      const fromY = Separator.GetY(from);
      const toY = Separator.GetY(to);
      if (fromY < toY) {
        from.extraAlto = toY - (fromY + Separator.GetLargoVeta(from));
      } else {
        from.extraAbajo = fromY - (toY + Separator.GetLargoVeta(to));
      }

      const fromX = Separator.GetX(from);
      const toX = Separator.GetX(to);
      if (fromX < toX) {
        from.extraDerecha = toX - (fromX + Separator.GetLargoVeta(from));
      } else {
        from.extraIzquierda = fromX - (toX + Separator.GetLargoVeta(to));
      }

      const fromIndex = elements.findIndex((e: any) => e.id === from.id);
      elements.splice(fromIndex, 1, (Object as any).assign(elements[fromIndex], { compound: fromCompound }));
    },
    removeFromCompound(state: any, payload: any) {
      const liston = Separator.GetElement(payload) as Liston;
      liston.compound.forEach((id: any) => {
        const elements = Modulo.Selected().elements as any;
        const index = elements.findIndex((el: any) => el.id === id);
        elements.splice(index, 1, (Object as any).assign(elements[index], { compound: elements[index].compound.filter((idx: any) => idx !== payload) }));
      });
      liston.compound = [].slice();
    },
    setHojaCorredizaSelected(state: any, payload: any) {
      state.hojaCorredizaSelected = payload.index;
    },
    setCruceEntrePuertasSelected(state: any, payload: any) {
      state.cruceEntrePuertasSelected = payload.index;
    },
    setSelectedFondo(state: any, payload: any) {
      state.selectedFondo = payload;
    },
    changeSelection(state: any, payload: any) {
      const modulo = Modulo.Selected();
      const elements = modulo.elements || [];
      if (!elements || elements.length === 0) {
        return;
      }

      const firstSelectable = elements[0].id;
      const lastSelectable = elements[elements.length - 1].id;
      let selected = modulo.selected ? modulo.selected : firstSelectable - 1;
      let foundElement = false;
      do {
        selected += payload ? 1 : -1;

        if (selected > lastSelectable) {
          selected = firstSelectable;
        } else if (selected < firstSelectable) {
          selected = lastSelectable;
        }

        const element = Element.GetElement(selected) as any;
        // piezas o espacios que no poseen hijos (es decir no estan subdivididos) y no son rieles
        foundElement = !element.riel && (!element.cube || (element.cube && (!element.childs || element.childs.length === 0)))
      } while (!foundElement);
      modulo.selected = selected;
    },
    clearSelectionMod(state: any, payload: any){
      state.eventSelectModule = true;
      const modulo = Modulo.Selected();
      modulo.selected = null;
      setTimeout(() => {
        state.eventSelectModule = false;
      }, 200);
    }
  },
  getters: {
    getCadGrupos3D(state: any, getters: any){
      try {
        var data = JSON.parse(state.DesignObject);
        return data;
      } catch (error) {
        return [];
      }
    },
    selectedModule(state: any, getters: any) {
      return Modulo.Selected();
    },
    getColorPorDefecto(state: any, getters: any) {
      return state.idColorPorDefecto;
    },
    getColoresModulo(state: any, getters: any) {
      if(state.coloresModule.id !== "default"){
        return state.coloresModule.values;
      }else{
        const resp = Object.assign({}, state.coloresModuleDefaul);
        return resp;
      }
    },
    getListColores(state: any, getters: any) {
      if(!state.listColores.find((a:any)=>a.id=="default")){
        state.listColores.push({
          "name": "default",
          "type": "coloresmodulo",
          "values": state.coloresModuleDefaul,
          "id": "default"
        });
      }
      return state.listColores;
    },
    getConexionDB(state: any, getters: any) {
      return state.conexionesDb;
    },
    selectedModuleId(state: any, getters: any) {
      return state[Modulo.isRoomEditorSelected() ? 'selectedRoomEditorModule' : 'selectedModule'];
    },
    getSelectedSeparadorOrientacion(state: any, getters: any) {
      if (getters.selectedModule.selected) {
        return Separator.GetOrientacion(Element.GetElement(getters.selectedModule.selected));
      }
      return null
    },
    selectedElement(state: any, getters: any) {
      return Element.GetElement(getters.selectedModule.selected)
    },
    /**
     * Devuelvo las piezas que tienen conexion con un elemento dado
     */
    getPiecesThatConnectWithGivenElementId(state: any, getters: any) {
      return (elementId: number) => {
        const currentModule = Modulo.Selected() as any;
        let pieces: any = [];
        const findFn = (e: any) => {
          if (e.separator.virtual) {
            return false;
          }
          return e.separator && e.separator.id === elementId;
        }
        let conexionesAfter = [] as any;
        let conexionesBefore = [] as any;
        const puerta = (Element.Selected() as any).puerta // && (Element.Selected() as any).puerta.corrediza; 
        currentModule.elements.forEach((element: any) => {

          // si es puerta re calculo las conexiones para incluir los elementos de espesor 0
          if (puerta && !(element.division || element.division > 0)) {
            conexionesAfter = Separator.CalcularConexionesAfter(element, true);
            conexionesBefore = Separator.CalcularConexionesBefore(element, true);
            if ((conexionesAfter as any).find(findFn) || (conexionesBefore as any).find(findFn)) {
              pieces.push(element)
            }
          } else if (
            (element.conexionesAfter && element.conexionesAfter.find(findFn)) ||
            (element.conexionesBefore && element.conexionesBefore.find(findFn))
          ) {
            pieces.push(element);
          }

        });

        let ownConexionesAfter = Separator.CalcularConexionesAfter(Separator.GetElement(elementId) as any, true)
        let ownConexionesBefore = Separator.CalcularConexionesBefore(Separator.GetElement(elementId) as any, true)

        if (ownConexionesAfter && ownConexionesAfter.length > 0) {
          ownConexionesAfter.forEach((con: any) => {
            if (
              (!con.separator.virtual && !con.separator.separadorCajon && !con.separator.cajon) &&
              ((con.separator > 0) || puerta)
            ) {
              pieces.push(con.separator)
            }
          });
        }

        if (ownConexionesBefore && ownConexionesBefore.length > 0) {
          ownConexionesBefore.forEach((con: any) => {
            if (
              (!con.separator.virtual && !con.separator.separadorCajon && !con.separator.cajon) &&
              ((con.separator > 0) || puerta)
            ) {
              pieces.push(con.separator)
            }
          });
        }

        return pieces;
      }
    },
    /**
     * Retorna los elementos que pertenecen a una capa para el modulo seleccionado.
     * layerId: id de la capa (la capa numero 1 tiene id 0)
     */
    getElementsInLayer(state: any, payload: any) {
      return (layerId: number) => Modulo.GetElementsInLayer(layerId);
    },
    /**
     * Dado dos ID de dos elementos, calculo las piezas que conectan ambos elementos
     */
    getElementConnectingPiecesInCommon(state: any, payload: any) {
      return (firstElementId: number, secondElementId: number) => {
        let firstElement = Element.GetElement(firstElementId) as any;
        let secondElement = Element.GetElement(secondElementId) as any;


        let firstElementConnections = Separator.CalcularConexionesAfter(firstElement, true).concat(Separator.CalcularConexionesBefore(firstElement, true))
        let secondElementConnections = Separator.CalcularConexionesAfter(secondElement, true).concat(Separator.CalcularConexionesBefore(secondElement, true))

        let preliminaryResult: any = Element.getters.getPiecesThatConnectWithGivenElementId(firstElement.id);
        firstElementConnections.forEach((con: any) => {
          let cons = Element.getters.getPiecesThatConnectWithGivenElementId(con.separator.id);
          if (cons.find((c: any) => c.id === secondElementId)) {
            preliminaryResult.push(con);
          }
        });

        secondElementConnections.forEach((con: any) => {
          let cons = Element.getters.getPiecesThatConnectWithGivenElementId(con.separator.id);
          if (cons.find((c: any) => c.id === firstElementId)) {
            preliminaryResult.push(con);
          }
        });

        let result: any = [];
        preliminaryResult.forEach((element: any) => {
          const elementId = element.separator.id || element.id
          if (!result.find((el: any) => elementId === el.separator.id || elementId === el.id)) {
            result.push(element);
          }
        });

        return result;
      }
    },
    hoveredElement(state: any) {
      return state.hoveredElement;
    },
    hojaCorredizaSelected(state: any) {
      return state.hojaCorredizaSelected;
    },
    cruceEntrePuertasSelected(state: any) {
      return state.cruceEntrePuertasSelected;
    },
    selectedFondo(state: any) {
      return state.selectedFondo
    },
    getElement(state: any, getters: any) {
      return (id: number) => {
        return Element.GetElement(id)
      }
    },
    getParent(state: any, getters: any) {
      return (id: number) => Element.GetParent(Element.GetElement(id))
    },
    getBeforeSibling(state: any, getters: any) {
      return (id: number) => Element.GetBeforeSibling(Element.GetElement(id))
    },
    getAfterSibling(state: any, getters: any) {
      return (id: number) => Element.GetAfterSibling(Element.GetElement(id))
    },
    getWidth(state: any, getters: any) {
      return (id: number) => Element.GetWidth(Element.GetElement(id))
    },
    getWidthRoot(state: any, getters: any) {
      return (id: number) => {
        try {
          let separators: any = Element.GetElement(id);
          var x = Element.GetX(Element.GetElement(id)) + parseInt(Modulo.Selected()._x.toString());
          var x = x - parseInt(Modulo.Selected()._x.toString());
          // var x = x;
          return x;
        } catch (error) {
          return 0
        }
      }
    },
    getWidthRootD(state: any, getters: any) {
      return (id: number) => {

        try {
          // console.log(this.getPartList);
          // console.log(Element.getters.getPartList);
          if(Modulo.Selected().isRoomEditor){
            return Modulo.Selected().width - Element.GetX(Element.GetElement(id))
          }
  
          let separators: any = Element.GetElement(id);
          var x = Element.GetX(Element.GetElement(id)) + parseInt(Modulo.Selected()._x.toString());
          var totalModulo = Modulo.Selected().width;
          var totalPosicionX = x - parseInt(Modulo.Selected()._x.toString());
          var total = totalModulo  - ( totalPosicionX) - separators.size;
          return total
        } catch (error) {
          return 0;
        }
        
      }
    },
    getHeight(state: any, getters: any) {
      return (id: number) => Element.GetHeight(Element.GetElement(id))
    },
    getHeightRoot(state: any, getters: any) {
      return (id: number) => {
        try {
          let separators: any = Element.GetElement(id);
          var y = Element.GetY(Element.GetElement(id)) + parseInt(Modulo.Selected()._y.toString());
          var y = y - parseInt(Modulo.Selected()._y.toString());
          // var y = y;
          return y;
        } catch (error) {
          return 0
        }
      }
    },
    getHeightRootA(state: any, getters: any) {
      return (id: number) => {

        try {

          if(Modulo.Selected().isRoomEditor){
            return Modulo.Selected().height - Element.GetY(Element.GetElement(id))
          }
  
          let separators: any = Element.GetElement(id);
          var y = Element.GetY(Element.GetElement(id)) + parseInt(Modulo.Selected()._y.toString());
          
          var totalModulo = Modulo.Selected().height;
          var totalPosicionY = y - parseInt(Modulo.Selected()._y.toString());
          var total = totalModulo  - ( totalPosicionY) - separators.size;
          return total
          
        } catch (error) {
          return 0
        }
        
      }
    },
    getPuertaWidth(state: any, getters: any) {
      return (id: number) => Puerta.GetWidth(Element.GetElement(id))
    },
    getPuertaHeight(state: any, getters: any) {
      return (id: number) => Puerta.GetHeight(Element.GetElement(id))
    },
    getPuertaCorredizaWidth(state: any, getters: any) {
      return (id: number, index: number) => PuertaCorrediza.GetWidth(Element.GetElement(id), index)
    },
    getPuertaCorredizaLeftMostSide(state: any, getters: any) {
      return (puerta: Element, index: number) => PuertaCorrediza.getLeftMostSide(puerta)
    },
    getPuertaCorredizaHeight(state: any, getters: any) {
      return (id: number) => PuertaCorrediza.GetHeight(Element.GetElement(id))
    },
    getX(state: any, getters: any) {
      return (id: number) => Element.GetX(Element.GetElement(id))
    },
    getY(state: any, getters: any) {
      return (id: number) => Element.GetY(Element.GetElement(id))
    },
    getConnections(state: any, getters: any) {
      return (id: number) => Element.GetConnections(Element.GetElement(id))
    },
    getFilteredElementList(state: any, getters: any): Element[] {
      const elements: Element[] = []
      state.modules.filter((m: Modulo) => m.activated).forEach((modulo: Modulo, index: number) => {
        // Recorrer separadores (filtrar los separadores imaginarios) + cajones + puertas + doble fondo
        const els: Element[] = modulo.elements
          .filter((element: any) => {
            return !(element.liston && element.compound && element.compound.length > 0 && element.id === element.compound[0]) && !element.separatorDivision && element.separator && element.size !== 0 || element.cajon || element.puerta || element.dobleFondo || element.riel
          }) as Element[]

        elements.push(...els);

        if (modulo.fondo && !modulo.isTypeL) {
          const customFondos = modulo.customFondos;
          if (customFondos.length) {
            customFondos.forEach((fondo: any, index: number) => {
              if (fondo.Exportable) {
                const name = fondo.Name.split(' ');
                name.splice(0, 1); // saco la palabra 'Fondo'
                const numbers = name[0].split('-').join('');
                const idFondo = +((100000 * modulo.moduleId + '') + numbers);
                elements.push({
                  name: fondo.Name,
                  moduleName: modulo.moduleName,
                  moduleId: modulo.moduleId,
                  visible: true,
                  elementType: 'fondo',
                  comentario: '',
                  parent: null,
                  id: idFondo // el id del fondo es la concatenacion del id del modulo mas el nombre del fondo (sin guiones)
                });
              }
            });
          } else {
            elements.push({
              name: 'Fondo',
              moduleName: modulo.moduleName,
              moduleId: modulo.moduleId,
              visible: true,
              elementType: 'fondo',
              comentario: '',
              parent: null,
              id: 100000 * modulo.moduleId
            });
          }
        }
      });
      return elements;
    },
    /**
     * Devuelvo las piezas a partir de las cuales puedo dividir el fondo
     */
    getFondoDivideOptions(state: any) {
      const selectedModuleName = Modulo.Selected().moduleName;
      const fondos = Element.getters.getPartList.filter((elem: Part) => {
        return (elem.ElementType === ElementType.fondo) && (selectedModuleName === elem.Module);
      });
      const selectedFondo = fondos.length > 1 ? state.selectedFondo : fondos[0];

      if (fondos.length === 0) {
        alert('Este modulo no posee fondo');
        return;
      }

      let left = selectedFondo.X;
      let right = selectedFondo.X + selectedFondo.AVeta;
      let top = selectedFondo.Y + selectedFondo.LVeta;
      let bottom = selectedFondo.Y;
      const moduleElements = Modulo.Selected().elements;
      let piso: any, techo: any, ladoIzq: any, ladoDer: any;
      // Cuando solo tengo el fondo original, empiezo dividiendo desde los laterales, piso y techo
      if (fondos.length === 1) {
        ladoIzq = moduleElements.filter(elem => elem.name === 'Lat. Izquierdo')[0];
        ladoDer = moduleElements.filter(elem => elem.name === 'Lat. Derecho')[0];
        techo = moduleElements.filter(elem => elem.name === 'Techo')[0];
        piso = moduleElements.filter(elem => elem.name === 'Piso')[0];
        // Cuando es el fondo original, hay que decontar los movimientos en los ejes. Para los fondos custom estos ya fueron descontados al momento de crearlos
        left -= Modulo.Selected()._x;
        right -= Modulo.Selected()._x;
        top -= Modulo.Selected()._y;
        bottom -= Modulo.Selected()._y;
      }

      if (fondos.length > 1) {
        // console.log('**Fondo coords**\n', 'left:', left, 'right:', right, 'top:', top, 'bottom:', bottom, '\n**************************************\n');
        const elementsInFondo = moduleElements.filter((element: any) => {
          if (element.separator && !element.virtual) {
            const elementY = Element.GetY(element);
            const elementX = Element.GetX(element);
            return ((bottom <= elementY) && (elementY <= top) && (left <= elementX) && (elementX <= right)) ||
              ((left <= elementX + Element.GetWidth(element)) && ((elementY + element.size) <= top) && ((elementX + element.size) <= right) && (bottom <= elementY + Element.GetHeight(element)));
          }
          return false;
        });


        elementsInFondo.forEach((element: any) => {
          const orientation = Separator.GetOrientacion(element);
          if (!piso && orientation === 2) piso = element;
          if (!techo && orientation === 2) techo = element;
          if (!ladoDer && orientation === 1) ladoDer = element;
          if (!ladoIzq && orientation === 1) ladoIzq = element;

          if ((Element.GetY(element) <= (piso && Element.GetY(piso))) && (orientation === 2)) {
            piso = element;
          }
          if ((Element.GetY(element) >= (techo && Element.GetY(techo))) && (orientation === 2)) {
            techo = element;
          }
          if ((Element.GetX(element) <= (ladoIzq && Element.GetX(ladoIzq))) && (orientation === 1)) {
            ladoIzq = element;
          }
          if ((Element.GetX(element) >= (ladoDer && Element.GetX(ladoDer))) && (orientation === 1)) {
            ladoDer = element;
          }
        });

        console.log('piso', piso)
        console.log('techo', techo)
        console.log('ladoIzq', ladoIzq)
        console.log('ladoDer', ladoDer)
      }

      const verticalOptions = Element.getters.getElementConnectingPiecesInCommon(piso.id, techo.id).filter((elem: any) => {
        const id = elem.id || elem.separator.id;
        const element = elem.separator || elem;
        const elementY = Element.GetY(element);
        const elementX = Element.GetX(element);
        return (id != ladoDer.id && id != ladoIzq.id) && ((bottom < elementY) && (elementY < top) && (left < elementX) && (elementX < right)); // vuelvo a chequear que este en el fondo por que las piezas largas pueden conectar con piezas fuera del fondo
      });

      const horizontalOptions = Element.getters.getElementConnectingPiecesInCommon(ladoDer.id, ladoIzq.id).filter((elem: any) => {
        const id = elem.id || elem.separator.id;
        const element = elem.separator || elem;
        const elementY = Element.GetY(element);
        const elementX = Element.GetX(element);
        return (id != piso.id && id != techo.id) && ((bottom < elementY) && (elementY < top) && (left <= elementX) && (elementX < right)); // vuelvo a chequear que este en el fondo por que las piezas largas pueden conectar con piezas fuera del fondo
      });

      return verticalOptions.concat(horizontalOptions).map((elem: any) => elem.separator || elem);
    },
    getModulesList(state: any, getters: any): any[] {
      const modulos: any[] = [];

      Modulo.GetModules().forEach((modulo: Modulo, index: number) => {
        const temp_modules = {
          id :index + 1,
          module: 'Mod ' + (index + 1),
          armado: modulo.settings.armado,
          comentario: modulo.settings.comentario,
          descripcion: modulo.settings.description,
        }

        modulos.push(temp_modules)
      })

      return modulos
    },
    getMaterialsList(state: any, getters: any) {
      const materials = crearListaMateriales();
      return materials;
    },
    getAlternativeMaterialList(state: any, getters: any): any {
      return state.alternativeMaterials;
    },
    getCuotas(state: any, getters: any): any {
      return state.cuotas;
    },
    getPresupuesto(state: any, getters: any): any {
      return state.presupuesto;
    },
    getServicesList(state: any, getters: any) {
      return Element.state.services;
    },
    getPlaceholders(state: any, getters: any): any {
      return state.placeholders;
    },
    getCurrentDesignSystemSection(state: any, getters: any): any {
      return state.currentDesignSystemSection;
    },
    getAmbienteModules(state: any, getters: any): any {
      return Modulo.GetSectionModules(true);
    },
    getModuloModules(state: any, getters: any): any {
      return Modulo.GetSectionModules(false);
    },
    getAllModules(state: any, getters: any): any {
      return Modulo.GetAllModules();
    },
    isAmbienteSelected(state: any, getters: any): any {
      return state.currentDesignSystemSection === 'ambiente';
    },
    getPartList(state: any, getters: any): Part[] {
      return getParts(state, getters, false);
    },
    getRoomEditorPartList(state: any, getters: any): Part[] {
      return getParts(state, getters, true);
    },
    getCustomParts(state: any, getters: any) {
      const listado: PiezaManual[] = []
      Modulo.GetModules().forEach((modulo: Modulo, index: number) => {
        const piezaManual: Element[] = modulo.elements.filter((element: any) => element.piezaManual)
        piezaManual.forEach(cube => {
          const current = (cube as any) as PiezaManual
          if (!current.only3d && !current.isL) {
            listado.push(current);
          }
        })
      })
      return listado
    },
    getCustomModules(state: any, getters: any) {
      const listado: ModuloExterno[] = []
      Modulo.GetModules().forEach((modulo: Modulo, index: number) => {
        const moduloExterno: Element[] = modulo.elements.filter((element: any) => element.moduloExterno)
        moduloExterno.forEach(cube => {
          const current = (cube as any) as ModuloExterno
          listado.push(current)
        })
      })
      return listado
    },
    getCalcoInfo(state: any, getters: any) {
      return (el: any) => {
        if (typeof el === 'object') {
          return Element.GetFondoCalco(el);
        }
        let elemento = Element.GetElement(el) as Separator
        if (!elemento) {
          return null;
        }
        if (elemento.separator && elemento.childs != undefined && elemento.childs.length > 0) {
          let CalcoPadre = Separator.GetCalcoInfo(elemento)
          let child1 = Element.GetElement(elemento.childs[0]) as Separator
          child1.conexionesAfter = elemento.conexionesAfter
          child1.conexionesBefore = elemento.conexionesBefore
          let child2 = Element.GetElement(elemento.childs[1]) as Separator
          child2.conexionesAfter = elemento.conexionesAfter
          child2.conexionesBefore = elemento.conexionesBefore
          let calcos1 = Separator.GetCalcoInfo(child1)
          let calcos2 = Separator.GetCalcoInfo(child2)
          return calcos1.concat(calcos2)
        } else {
          if (state.errorsIn3d) {
            setTimeout(() => {
              errorsIn3dCache[elemento.id] = false;
            }, 5000);

            if (!errorsIn3dCache[elemento.id]) {
              errorsIn3dCache[elemento.id] = Separator.GetCalcoInfo(elemento);
            }
            return errorsIn3dCache[elemento.id];
          }
          errorsIn3dCache = [].slice();
          return Separator.GetCalcoInfo(elemento)
        }
      }
    },
    /**
     * Devuelve la metadata del proyecto:
     * - Materiales, herrajes, kits utilizados
     * - comentario, medidas, material por defecto, descripcion de modulos
     * - armado de modulos
     */
    createProjectMetadata(state: any, getters: any) {
      return () => {
        let metadata: any = [];
        state.modules.forEach((modulo: any) => {
          let moduleMeta: any = {
            comentario: modulo.settings.comentario,
            descripcion: modulo.settings.description,
            armado: modulo.settings.armado,
            height: modulo.height,
            width: modulo.width,
            materialFondo: modulo.fondo,
            materialPorDefecto: getters.all_material_default[modulo.moduleId - 1],
            tapacantosPorDefecto: getters.all_tapacantos_default[modulo.moduleId - 1].nombre,
            moduleName: modulo.moduleName,
            moduleId: modulo.moduleId
          };

          metadata.push({ key: modulo.moduleName, value: moduleMeta });
        });
        const info = getters.projectInfo
        metadata.push({ key: 'materiales', value: crearListaMateriales() });
        metadata.push({ key: 'placa_waste', value: getters.presupuestosConfig.waste })
        metadata.push({ key: 'exportado_por', value: localStorage.getItem('user-name') })
        metadata.push({
          key: 'caja', value: {
            total: info.total,
            totalDescripcion: info.totalDescripcion,
            senia: info.senia,
            seniaDescripcion: info.seniaDescripcion,
            items: info.items,
            pagos: info.pagos,
            saldo: info.saldo
          }
        });
        metadata.push({ key: 'project_info', value: info });
        return metadata;
      }
    },
    tokenize(state: any, getters: any) {
      return (id: any) => {
        // ofusco un poco la url
        let sid = '' + id
        while (sid.length < 5) {
          sid = '0' + sid
        }
        return Math.floor(Math.random() * 100000) + sid + Math.floor(Math.random() * 100000)
      }
    },
    parseToken(state: any, getters: any) {
      return (token: any) => {
        return +('' + token).substring(5, 10)
      }
    },
    getCalcoObject(state: any, getters: any) {
      return (el: any) => {
        if (el >= 100000) {
          return Element.GetFondoCalco(el);
        }
        return Separator.GetCalcoObject(Element.GetElement(el) as Separator);
      }
    },
    getFondoCalco(state: any, getters: any) {
      return (el: any) => {
        return Element.GetFondoCalco(el);
      }
    },
    // getCustomCalcoInfo (state: any, getters: any) {
    // return (id: any) => CustomPart.GetCalcoInfo(id as any)
    // },
    moduleCount(state: any, payload: any) {
      return Modulo.GetModules().length;
    },
    getModules() {
      return Modulo.GetModules();
    },
    getActivatedModules() {
      return Modulo.getActivatedModules();
    },
    getModulesRotacion(state: any) {
      let modulosExport: any = [];
      Modulo.GetAllModules().forEach((modulo: Modulo, index: number) => {
        const id = modulo.isRoomEditor ? (modulo.moduleId * 100) : modulo.moduleId;
        const modName = modulo.isRoomEditor ? 'Mod ' + (modulo.moduleId * 100) : modulo.moduleName;
        const modAbreviatura = modulo.isRoomEditor ? 'A' + modulo.moduleId :'M' + modulo.moduleId;
        // console.log(` getModulesRotacion:  ${JSON.stringify(modulo)} ** modules/layout.ts` )
        let m = {
          'id' : id,
          'name': modName,
          'modAbreviatura': modAbreviatura,
          'comentario': modulo.settings.comentario,     //
          'descripcion': modulo.settings.description,    // 
          'rx': modulo._rx,
          'ry': modulo._ry,
          'rz': modulo._rz,
          'isRoomEditorModule': modulo.isRoomEditor
        }
        modulosExport.push(m)

      })
      return modulosExport
    }
  },
  actions:{
    async getConexionesDB(state: any, payload: any){
      const conexiones: any = []
      const { data } = await HTTP.get(
        "/api/configuracion/tipo/ConexionesConfig/all"
      );

      if (!data.error && data.configuraciones) {
        data.configuraciones.forEach((config:any) => {
          const object = buildFromJson(config.values);
          object.id = config.id;
          if (object.tipo === "conexion") {
            conexiones.push(object);
          }
        });
      }

      state.state.conexionesDb = conexiones;
      localStorage.setItem('conexiones', JSON.stringify(conexiones));
      return conexiones;
    },
    async getColoresModuloDB(state: any, payload: any){
      let dataResp: any = []
      const { data } = await HTTP.get(
        "/api/configuracion/tipo/ColoresModulo/all"
      );

      if (!data.error && data.configuraciones) {
        dataResp = data.configuraciones;
        state.state.listColores = data.configuraciones;
      }

      // state.state.conexionesDb = conexiones;
      return dataResp;
    },
    async getColorActivadoDB(state: any, payload: any){
      console.log(state.state.proyectoSinColor);
      if(true){
        let dataResp: any = []
        const { data } = await HTTP.get(
          "/api/configuracion/tipo/ColoresModuloActivado/all"
        );
  
        if (!data.error && data.configuraciones.length > 0) {
          state.state.idColorPorDefecto = data.configuraciones[0].values.id;
          dataResp = data.configuraciones;
          if(state.state.proyectoSinColor){

            state.state.idColorActive = data.configuraciones[0].id;
            state.state.coloresModule = data.configuraciones[0].values;
            let temp = state.getters.getListColores;
            var valor = temp.find((a:any)=> a.id == data.configuraciones[0].values.id);
            if(valor){
              
            }else{
              valor = temp.find((a:any)=> a.id == "default");
              state.state.coloresModule = valor;
              state.dispatch("activarColoresModuloDB", valor);
            }
            
          }else{
            console.log(data.configuraciones[0].values.id);
            state.state.idColorActive = data.configuraciones[0].id;
          }
        }else{
          let temp = state.getters.getListColores;
          var valor = temp.find((a:any)=> a.id == "default");
          state.state.idColorActive = null;
          state.state.coloresModule = valor;
          state.state.idColorPorDefecto = "default";
          state.dispatch("activarColoresModuloDB", valor);
        }
  
        // state.state.conexionesDb = conexiones;
        return dataResp;
      }

    },
    async addColoresModuloDB(state: any, payload: any){
      const colores: any = {
        name: payload.nombre,
        type: "ColoresModulo",
        values: payload.colores,
      };

      const { data } = await HTTP.post("/api/configuracion", colores);

      if (!data.error) {
        (this as any).dispatch("getColoresModuloDB").then((a:any)=>{
          // state.state.coloresModule = colores;
          let temp = state.getters.getListColores;
          var valor = temp.find((a:any)=> a.id == data.id);
          state.state.coloresModule = valor;
          (this as any).dispatch("activarColoresModuloDB", valor);
          // (this as any).dispatch("getColorActivadoDB");
        });
      }

      // state.state.conexionesDb = conexiones;
      return colores;
    },
    async activarColoresModuloDB(state: any, payload: any){

      const colores: any = {
        name: "colorActivo2d",
        type: "ColoresModuloActivado",
        values: payload,
      };

      // alert(state.state.idColorActive);

      if(state.state.idColorActive){
        const { data } = await HTTP.put(`/api/configuracion/${state.state.idColorActive}`, colores);
  
        if (!data.error) {
          // state.state.idColorActive = data.id;
        }

      }else{
        const { data } = await HTTP.post("/api/configuracion", colores);
  
        if (!data.error) {
          state.state.idColorActive = data.id;
          state.state.idColorPorDefecto = data.configuracion.values.id;
        }
      }
      

      // state.state.conexionesDb = conexiones;
      return colores;
    },
    addCustomPartAction(state: any, payload: any) {
      const piece = payload.piece;
      const modulo = Modulo.GetModuleByIndex(payload.module - 1);

      const elements = modulo.elements as any;
      const childIndex = elements.findIndex((element: any) => element.piezaManual && (element.id === piece.id));

      if (piece.moduleId && piece.moduleId !== payload.module) {
        // se cambia la pieza de modulo, hay que eliminarla del modulo viejo
        const oldModule = Modulo.GetModuleByIndex(piece.moduleId - 1);
        const oldElements = oldModule.elements as any;
        const oldIndex = oldElements.findIndex((element: any) => element.piezaManual && (element.id === piece.id));
        const parent = Element.GetParent(oldElements[oldIndex])
        const parentIndex = oldElements.findIndex((element: any) => parent.id === element.id);
        oldElements.splice(oldIndex, 1);
        oldElements.splice(parentIndex, 1);
      }

      if (childIndex > -1) {
        const parent = Element.GetParent(elements[childIndex])
        const parentIndex = elements.findIndex((element: any) => parent.id === element.id);
        elements.splice(childIndex, 1);
        elements.splice(parentIndex, 1);
      }
      const parent = new Cube(null, modulo);
      parent.childs = [];
      if (piece.Orietacion === 2 || piece.Orietacion === 4) {
        parent.layout = ModuleLayout.Horizontal;
      } else {
        parent.layout = ModuleLayout.Vertical;
      }

      const pieza = new PiezaManual(parent, piece.Espesor, modulo);
      pieza.name = piece.Name;
      pieza.tapacantos.izquierdo = piece.tapacantos.izquierdo;
      pieza.tapacantos.superior = piece.tapacantos.superior;
      pieza.tapacantos.inferior = piece.tapacantos.inferior;
      pieza.tapacantos.derecho = piece.tapacantos.derecho;
      pieza.girarVeta = piece.girarVeta;
      pieza.material = piece.material;
      pieza.size = +piece.Espesor;
      pieza.Count = +piece.Count;
      pieza.LVeta = +piece.LVeta;
      pieza.AVeta = +piece.AVeta;
      pieza.Orientacion = piece.Orientacion;
      pieza.X = +piece.X;
      pieza.Y = +piece.Y;
      pieza.Z = +piece.Z;
      return pieza.id;
    }
  }
}
