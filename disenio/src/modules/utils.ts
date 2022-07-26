import { CajonTipo, ElementType, ModuleLayout, PuertaTipo, TapacantoEnum } from "../models/enums";
import { Cajon, Cube, DobleFondo, Element, Liston, Modulo, ModuloExterno, Part, PiezaManual, Puerta, PuertaCorrediza, Riel, Separator, SeparatorDividido, TapacantoSetting } from "../models/models";

const getAxisOffsetX = (currentModule: any) => parseInt(currentModule._x.toString());
const getAxisOffsetY = (currentModule: any) => parseInt(currentModule._y.toString());
const getAxisOffsetZ = (currentModule: any) => parseInt(currentModule._z.toString());
let reload = true;

function noReload(value:any):boolean {
  reload = value;
  return true
}

function getPartsOfModulo (state: any, getters: any, modulo: Modulo, modName: string, isRoomEditorParts: boolean):Part[] {
  let newParts:Part[] = []
  
  
  let {newPartsOfCajonGroups, refrescar:refrescarSegunCajones} = getPartsOfCajonGroups(getters, modulo, modName)
  
  let newPartsOfSeparators = getPartsOfSeparators(getters, modulo, modName, isRoomEditorParts)
  
  let newPartsOfListones = getPartsOfListones(modulo, modName)
  
  let newPartsOfgetPartsOfSeparatorsDivision = getPartsOfSeparatorsDivision(modulo, modName)
  
  let newPartsOfDobleFondo = getPartsOfDobleFondo(modulo, modName)
  
  let {newPartsOfPuertas, refrescar:refrescarSegunPuertas} = getPartsOfPuertas(modulo, modName)
  
  let newPartsOfRieles = getPartsOfRieles(modulo, modName)
  
  let newPartsOfFondo = getPartsOfFondo(modulo, modName)
  
  let newPartsOfPiezasManuales = getPartsOfPiezasManuales(modulo, modName,newPartsOfCajonGroups, newPartsOfPuertas)
  
  let newPartsOfModuloExterno = getPartsOfModuloExterno(modulo, modName)
  
  //Buscar porque no actualiza los modulos al crearlos
  if((refrescarSegunCajones || refrescarSegunPuertas) && document.querySelector("a[title='3D']") && document.querySelector("a[title='3D']").className.includes("active")){
    if(reload){
      window.location.reload()
    }
  }

  return newParts.concat(
    newPartsOfCajonGroups,
    newPartsOfSeparators,
    newPartsOfListones,
    newPartsOfgetPartsOfSeparatorsDivision,
    newPartsOfDobleFondo,
    newPartsOfPuertas,
    newPartsOfRieles,
    newPartsOfFondo,
    newPartsOfPiezasManuales,
    newPartsOfModuloExterno,
  )
}

function getPartsOfCajonGroups(getters: any, modulo: Modulo, modName: string): {newPartsOfCajonGroups:Part[],refrescar:boolean}{
  const cajonGroups: Cube[] = modulo.elements.filter((element: any) => element.cajonGroup) as Cube[]
  let newPartsOfCajonGroups: Part[] = []
  var refrescar = false
  cajonGroups.forEach(cajonGroup => {
    const cajonCount = Math.ceil(cajonGroup.childs.length / 2)
    let cajon: Cajon = Element.GetElement(cajonGroup.childs[0]) as Cajon

    const anchoVetaPadre = Separator.GetAnchoVeta(Element.GetParent(cajon) as Separator)

    let ejeXFrente = 0
    let ejeYFrente = 0
    let ejeZFrente = 0

    let frenteEncastre = cajon.frenteEncastre
    for (let num = 0; num < cajonCount; num++) {
      let cajonInner = Element.GetElement(cajonGroup.childs[num]) as Cajon

      // EJE X
      if (frenteEncastre === CajonTipo.Superpuesto) {
        ejeXFrente = Element.GetX(Element.GetParent(cajon)) - modulo.settings.SuperpuestoGlobalLateral
      } else {
        ejeXFrente = Element.GetX(Element.GetParent(cajon)) + modulo.settings.HolguraLateralFrentesCajon
      }
      ejeXFrente += Cajon.GetEspesorTapacanto(cajon, 4);

      // EJE Y
      /*
      * Se diferencia es el primer cajón 
      * Se diferencia si es superpuesto o encastrado
      */
      if (num == 0) {
        if (frenteEncastre === CajonTipo.Superpuesto) {
          ejeYFrente += Element.GetY(Element.GetParent(cajon)) + parseInt(modulo._y.toString()) - modulo.settings.SuperpuestoGlobalAltura
        } else {
          ejeYFrente += Element.GetY(Element.GetParent(cajon)) + parseInt(modulo._y.toString()) + cajon.luz
        }
      } else {
        ejeYFrente += cajon.luz + Cajon.LargoFrente(cajon, cajonCount);
      }
      ejeYFrente += Cajon.GetEspesorTapacanto(cajon, 3);
      if (num !== 0) {
        ejeYFrente += Cajon.GetEspesorTapacanto(cajon, 1);
      }

      // EJE Z
      /*
      * Se diferencia es el primer cajón 
      * Se diferencia si es superpuesto o encastrado
      */
      if (frenteEncastre === CajonTipo.Superpuesto) {
        ejeZFrente = anchoVetaPadre + 2
        if (num != 0) {
          ejeZFrente += 1
        }
      } else {
        ejeZFrente = anchoVetaPadre - 18 - modulo.settings.RetrasoFrontalFrente
      }

      const cajonInnerPiece: Part = {
        Count: 1,
        Name: 'Cajon ' + cajonInner.id,
        Module: modName,
        Comentario: cajon.comentario,
        Espesor: 0,
        AVeta: 0,
        LVeta: 0,
        tapacantos: cajon.tapacantos,
        Material: cajon.frenteMaterial || getters.defaultMaterial,
        Orientacion: Cajon.GetOrientacion(cajon),
        X: 0,
        Y: 0,
        Z: 0,
        _Id: cajonInner.id,
        elementId: cajonInner.id,
        Visible: cajonInner.visible,
        Only3d:true,
        Exportable:false
      }
      
      newPartsOfCajonGroups.push(cajonInnerPiece)

      if(cajonInner.frenteVisible === undefined){
        refrescar = true
        cajonInner.frenteVisible = true
      }
      const frente: Part = {
        Count: 1,
        Name: 'Frente Cajon ' + (cajon.id + (num * 2)),
        Module: modName,
        Comentario: cajon.comentario,
        Espesor: 18,
        AVeta: cajon.sentidoVeta === ModuleLayout.Vertical ? Cajon.AnchoFrente(cajon) : Cajon.LargoFrente(cajon, cajonCount),
        LVeta: cajon.sentidoVeta === ModuleLayout.Vertical ? Cajon.LargoFrente(cajon, cajonCount) : Cajon.AnchoFrente(cajon),
        tapacantos: cajon.tapacantos,
        Material: cajon.frenteMaterial || getters.defaultMaterial,
        Orientacion: Cajon.GetOrientacion(cajon),
        X: ejeXFrente + getAxisOffsetX(modulo) - cajon.extraIzquierda,
        Y: ejeYFrente - cajon.extraAbajo,
        Z: ejeZFrente + getAxisOffsetZ(modulo),
        _Id: (cajon.id + (num * 2)),
        elementId: cajonInner.id,

        Visible:  (!cajonInner.visible)?false:cajonInner.frenteVisible,
      }
      newPartsOfCajonGroups.push(frente)
      
      const offsetTapacantosInferior = cajon.tapacantos && cajon.tapacantos.inferior ? (cajon.tapacantos.inferior as any).espesor : 0;
      let ejeYBase = ejeYFrente + modulo.settings.DesplazamientoFrentalCajon - offsetTapacantosInferior;
      let ejeXBase = Element.GetX(Element.GetParent(cajon)) + 13.5 + getAxisOffsetX(modulo) + 18;
      let ejeZBase = ejeZFrente - Cajon.AnchoBase(cajon) + getAxisOffsetZ(modulo) - 18;

      if (cajon.fondoEncastre === CajonTipo.Superpuesto) {
        ejeZBase += 18;
        ejeXBase -= 18;
      }

      if(cajonInner.baseVisible === undefined){
        cajonInner.baseVisible = true
      }
      const base: Part = {
        Count: 1,
        Name: 'Base Cajon ' + (cajon.id + (num * 2)),
        Module: modName,
        Comentario: cajon.comentario,
        Espesor: 18,
        AVeta: Cajon.AnchoBase(cajon),
        LVeta: Cajon.LargoBase(cajon),
        tapacantos: { superior: TapacantoEnum.No, inferior: TapacantoEnum.No, izquierdo: TapacantoEnum.No, derecho: TapacantoEnum.No },
        Material: cajon.fondoMaterial,
        Orientacion: 2, // Horiz
        X: ejeXBase,
        Y: ejeYBase,
        Z: ejeZBase,
        _Id: (cajon.id + (num * 2)),
        elementId: cajonInner.id,
        Visible:  (!cajonInner.visible)?false:cajonInner.baseVisible,
      }
      newPartsOfCajonGroups.push(base)
      

      let ejeYLateral = ejeYFrente + modulo.settings.DesplazamientoFrentalCajon - offsetTapacantosInferior;
      let ejeXLateral = Element.GetX(Element.GetParent(cajon)) + 13.5 + getAxisOffsetX(modulo);
      let ejeZLateral = ejeZFrente - cajon.profundidad + getAxisOffsetZ(modulo);

      if (cajon.fondoEncastre === CajonTipo.Superpuesto) {
        ejeYLateral += 18;
      }

      if(cajonInner.latIzqVisible === undefined){
        cajonInner.latIzqVisible = true
      }
      const lateralIzq: Part = {
        Count: 1,
        Name: 'Lat. Izq. Cajon ' + (cajon.id + (num * 2)),
        Module: modName,
        Comentario: cajon.comentario,
        Espesor: 18,
        LVeta: Cajon.AnchoLateral(cajon, cajonCount),
        AVeta: Cajon.LargoLateral(cajon),
        tapacantos: { superior: TapacantoEnum.No, inferior: TapacantoEnum.No, izquierdo: cajon.tapacantos.izquierdo, derecho: TapacantoEnum.No },
        Material: cajon.material,
        Orientacion: 1, // Vert
        X: ejeXLateral,
        Y: ejeYLateral,
        Z: ejeZLateral,
        _Id: (cajon.id + (num * 2)),
        elementId: cajonInner.id,
        Visible: (!cajonInner.visible)?false:cajonInner.latIzqVisible,
      }
      newPartsOfCajonGroups.push(lateralIzq)
      

      if(cajonInner.latDerVisible === undefined){
        cajonInner.latDerVisible = true
      }
      const lateralDer = JSON.parse(JSON.stringify(lateralIzq));  
      lateralDer.X = ejeXLateral + Cajon.LargoContrafrente(cajon) + 18.5;
      lateralDer.Name = lateralDer.Name.replace('Izq', 'Der');
      lateralDer.elementId = cajonInner.id
      lateralDer.Visible =  (!cajonInner.visible)?false:cajonInner.latDerVisible,
      newPartsOfCajonGroups.push(lateralDer);
      

      let ejeXContraFrente = ejeXLateral + 18;
      let ejeYContraFrente = ejeYLateral;
      let ejeZContraFrente = ejeZLateral;

      if(cajonInner.cfVisible === undefined){
        cajonInner.cfVisible = true
      }
      const cf: Part = {
        Count: 1,
        Name: 'C/F Cajon ' + (cajon.id + (num * 2)),
        Module: modName,
        Comentario: cajon.comentario,
        Espesor: 18,
        AVeta: Cajon.AnchoContrafrente(cajon, cajonCount),
        LVeta: Cajon.LargoContrafrente(cajon),
        tapacantos: { superior: TapacantoEnum.No, inferior: TapacantoEnum.No, izquierdo: cajon.tapacantos.izquierdo, derecho: TapacantoEnum.No },
        Material: cajon.material,
        Orientacion: Cajon.GetOrientacion(cajon),
        X: ejeXContraFrente,
        Y: ejeYContraFrente,
        Z: ejeZContraFrente,
        _Id: (cajon.id + (num * 2)),
        elementId: cajonInner.id,
        Visible:   (!cajonInner.visible)?false:cajonInner.cfVisible,
      }
      newPartsOfCajonGroups.push(cf)
      
      if(cajonInner.cf2Visible === undefined){
        cajonInner.cf2Visible = true
      }
      const cf2 = JSON.parse(JSON.stringify(cf));
      cf2.Z = ejeZFrente - 18 + getAxisOffsetZ(modulo);
      cf2.Y = ejeYLateral;
      cf2.Name += ' (2)';
      cf2.elementId = cajonInner.id
      cf2.Visible = (!cajonInner.visible)?false:cajonInner.cf2Visible
      newPartsOfCajonGroups.push(cf2);
      
    }
  })

  return {newPartsOfCajonGroups, refrescar}
}

function getPartsOfSeparators(state: any, modulo: Modulo, modName: string, isRoomEditorParts: boolean): Part[]{
  const newSeparatorsParts: Part[] = []
  // Recorrer separadores (filtrar los separadores imaginarios)
  let separators: Separator[] = modulo.elements.filter((element: any) => element.separator && !element.virtual && element.piezaManual !== true && element.moduloExterno !== true && (element.childs == undefined || element.childs.length == 0) && element.separatorDivision == false && !element.liston) as Separator[]

  if (!isRoomEditorParts || state.roomEditorEspesor === 0) {
    separators = separators.filter((element: any) => element.size !== 0)
  }

  separators.forEach((separator) => {
    const espesor = isRoomEditorParts ? separator.size || state.roomEditorEspesor : separator.size;
    const sepPart: Part = {
      Count: 1,
      Name: separator.name,
      Module: modName,
      girarVeta: separator.girarVeta,
      Comentario: separator.comentario,
      Espesor: espesor,
      AVeta: Separator.GetAnchoVeta(separator),
      DisplayAVeta: separator.displayAVeta,
      LVeta: Separator.GetLargoVeta(separator),
      IsL: separator.isL,
      DisplayLVeta: separator.displayLVeta,
      tapacantos: separator.tapacantos,
      Material: separator.material,
      Orientacion: Separator.GetOrientacion(separator),
      X: Element.GetX(separator) + getAxisOffsetX(modulo),
      Y: Element.GetY(separator) + getAxisOffsetY(modulo),
      Z: Separator.GetFrenteZ(separator) + getAxisOffsetZ(modulo),
      _Id: separator.id,
      elementId: separator.id,
      Visible: separator.visible
    }

    if ((separator as any).bandeja) {
      sepPart.X += 13;
    }
    newSeparatorsParts.push(sepPart)
  });
  return newSeparatorsParts
}

function getPartsOfListones(modulo: Modulo, modName: string): Part[]{
  const newListonesParts:Part[]=[]
  // Recorrer listones
  const listones: Liston[] = modulo.elements
    .filter((element: any) => element.separator && !element.virtual && element.size !== 0 && !element.piezaManual && !element.moduloExterno && (element.childs == undefined || element.childs.length == 0) && !element.separatorDivision && element.liston === true) as Liston[]
  listones.forEach((liston) => {
    let AVeta = liston.anchoListon;
    let LVeta = Separator.GetLargoVeta(liston);
    let displayAVeta = liston.displayAVeta;
    let displayLVeta = liston.displayLVeta;
    let x = (liston.lPartId && modulo.LType === 'izquierdo' ? Liston.getLPart(liston).X : Element.GetX(liston) + getAxisOffsetX(modulo)) - (liston.extraIzquierda || 0);
    let y = Element.GetY(liston) + getAxisOffsetY(modulo) - (liston.extraAbajo || 0);
    let visible = liston.visible;

    if (liston.compound && liston.compound.length > 0) {
      // es un liston compuesto
      const primary = Element.GetElement(liston.compound[0]);

      LVeta = 0;
      y = 99999;
      x = 99999;
      liston.compound.forEach((id: any) => {
        const l = Separator.GetElement(id) as any;
        LVeta += Separator.GetLargoVeta(l);

        // me quedo con el Y del liston mas abajo
        let currentY = Element.GetY(l) + getAxisOffsetY(modulo)// - l.extraAbajo;
        if (currentY < y) {
          y = currentY;
        }

        // me quedo con el X del liston mas izquierdo
        let currentX = Element.GetX(l) + getAxisOffsetX(modulo) - l.extraIzquierda;
        if (currentX < x) {
          x = currentX;
        }
      });

      visible = (liston.id === primary.id) && primary.visible;
    }

    const sepPart: Part = {
      Count: 1,
      Name: liston.name,
      Module: modName,
      Comentario: liston.comentario,
      Espesor: liston.espesorListon,
      AVeta: AVeta,
      LVeta: LVeta,
      DisplayAVeta: displayAVeta,
      DisplayLVeta: displayLVeta,
      tapacantos: liston.tapacantos,
      girarVeta: liston.girarVeta,
      Material: liston.material,
      Orientacion: Separator.GetOrientacion(liston),
      X: x,
      Y: y,
      Z: Separator.GetFrenteZ(liston) + getAxisOffsetZ(modulo),
      _Id: liston.id,
      elementId: liston.id,
      Visible: visible,
      Only3d: (liston.compound && liston.compound.length > 0) && (liston.id !== liston.compound[0])
    }
    newListonesParts.push(sepPart)
  });
  return newListonesParts
}

function getPartsOfSeparatorsDivision(modulo:Modulo, modName:string): Part[]{
  const newPartsSeparatorsDivision: Part[] = []
  // Recorrer separadores (filtrar los separadores imaginarios)
  const separatorsDivision: Separator[] = modulo.elements
    .filter((element: any) => element.separator && element.size !== 0 && element.piezaManual !== true && element.moduloExterno !== true && (element.childs == undefined || element.childs.length == 0) && element.separatorDivision == true) as Separator[]

  separatorsDivision.forEach((separator) => {
    const sepPart: Part = {
      Count: 1,
      Name: separator.name,
      Module: modName,
      Comentario: separator.comentario,
      Espesor: separator.size,
      AVeta: SeparatorDividido.GetAnchoVeta(separator),
      LVeta: SeparatorDividido.GetLargoVeta(separator),
      tapacantos: separator.tapacantos,
      Material: separator.material,
      Orientacion: SeparatorDividido.GetOrientacion(separator),
      X: Element.GetX(separator) + getAxisOffsetX(modulo),
      Y: Element.GetY(separator) + getAxisOffsetY(modulo),
      Z: +modulo._z + separator.ejeZ,
      _Id: separator.id,
      elementId: separator.id,
      Visible: separator.visible
    }
    newPartsSeparatorsDivision.push(sepPart)
  })

  return newPartsSeparatorsDivision
}

function getPartsOfDobleFondo(modulo: Modulo, modName: string): Part[]{
  const newPartsDobleFondo: Part[] = []
  // Doble Fondo
  const dobleFondos: Element[] = modulo.elements.filter((element: any) => element.dobleFondo)
  dobleFondos.forEach((cube) => {
    const dobleFondo = (cube as any).dobleFondo as DobleFondo
    const dfPart: Part = {
      Count: 1,
      Name: dobleFondo.name,
      Module: modName,
      Espesor: dobleFondo.size,
      AVeta: DobleFondo.GetWidth(cube),
      LVeta: DobleFondo.GetHeight(cube),
      tapacantos: dobleFondo.tapacantos,
      Material: dobleFondo.material,
      girarVeta: dobleFondo.girarVeta,
      Orientacion: 4,
      X: Element.GetX(cube) + getAxisOffsetX(modulo) - dobleFondo.extraIzquierda,
      Y: Element.GetY(cube) + getAxisOffsetY(modulo) - dobleFondo.extraAbajo,
      Z: dobleFondo.z + getAxisOffsetZ(modulo),
      _Id: cube.id,
      elementId: cube.id,
      Visible: cube.visible,
    }
    newPartsDobleFondo.push(dfPart)
  })
  return newPartsDobleFondo
}

function getPartsOfPuertas(modulo: Modulo, modName: string): {newPartsOfPuertas:Part[],refrescar:boolean}{
  const newPartsOfPuertas: Part[] = []
  // Puertas
  const puertas: Element[] = modulo.elements.filter((element: any) => element.puerta)
  var refrescar = false

  puertas.forEach(cube => {
    const puerta = (cube as any).puerta as Puerta;
    const encastreOffsetX = puerta.encastre === CajonTipo.Superpuesto ? -modulo.settings.SuperpuestoGlobalLateral : 0;
    const encastreOffsetY = puerta.encastre === CajonTipo.Superpuesto ? -modulo.settings.SuperpuestoGlobalAltura : 0;
    let x, y;
    if(puerta.tipo === PuertaTipo.Dividida || puerta.elementType === ElementType.puertaCustom || puerta.elementType === ElementType.puertaCorrediza){
      const puertaContainerPiece: any = {
        Count: 1,
        Name: puerta.name,
        Module: modName,
        Espesor: puerta.size,
        AVeta: 0,
        LVeta: 0,
        tapacantos: Puerta.GetTapacantos(puerta),
        Material: 0,
        Orientacion: puerta.sentidoVeta === ModuleLayout.Horizontal ? 3 : 4,
        X: 0,
        Y: 0,
        Z: 0,
        _Id: cube.id,
        elementId: cube.id,
        Visible: puerta.visible,
        Only3d:true,
        Exportable:false,
      };
      newPartsOfPuertas.push(puertaContainerPiece);
    }
    
  

    if (puerta && (puerta.elementType === ElementType.puertaCustom) || (puerta.elementType === ElementType.puertaCorrediza)) {
      const side1 = Element.GetElement(puerta.sides['side1']) as any;
      const side2 = Element.GetElement(puerta.sides['side2']) as any;
      const side3 = Element.GetElement(puerta.sides['side3']) as any;
      const side4 = Element.GetElement(puerta.sides['side4']) as any;
      x = Separator.GetOrientacion(cube as Separator) === 2 ? Math.min(Element.GetX(side1), Element.GetX(side2)) : Math.min(Element.GetX(side3), Element.GetX(side4));
      y = Separator.GetOrientacion(cube as Separator) === 2 ? Math.min(Element.GetY(side3), Element.GetY(side4)) : Math.min(Element.GetY(side1), Element.GetY(side2));
      // Tomo en cuenta el ancho del separador donde va a ir anclada la puerta     
      if (Separator.GetOrientacion(cube as Separator) === 2) {
        x += Element.GetX(side1) < Element.GetX(side2) ? side1.size : side2.size;
        y += Element.GetY(side3) < Element.GetY(side4) ? side3.size : side4.size;
      } else {
        x += Element.GetX(side3) < Element.GetX(side4) ? side3.size : side4.size;
        y += Element.GetY(side1) < Element.GetY(side2) ? side1.size : side2.size;
      }
    } else {
      x = Element.GetX(cube);
      y = Element.GetY(cube);
    }
    y += Element.GetEspesorTapacanto(puerta, 3);
    x += Element.GetEspesorTapacanto(puerta, 4);

    // puertas corredizas
    if (puerta.elementType === ElementType.puertaCorrediza) {
      const puertaC = puerta as PuertaCorrediza;
      const kitEspesor = puertaC.kit ? puertaC.kit.espesor : 0;
      let xWidth = 0;
      
      for (let index = 0; index < puertaC['puertas'].length; index++) {
        xWidth += index === 0 ? 0 : PuertaCorrediza.GetWidth(cube, index - 1);
        if (puertaC['puertas'][index].enabled) {
          if(!puerta.puertasVisible){
            refrescar = true
            puerta.puertasVisible = [true]
          }else if(refrescar){
            puerta.puertasVisible.push(true)
          }
          const cruceEntrePuertas = +puertaC.cruceEntrePuertas * index;
          const centerOffset = 0;
          const z = Puerta.GetFrenteZ(cube) + getAxisOffsetZ(modulo) + kitEspesor;
          const pPart: any = {
            Count: 1,
            Name: puerta.name + ' (' + (index + 1) + ')',
            Module: modName,
            Espesor: puerta.size,
            AVeta: puerta.sentidoVeta === ModuleLayout.Vertical ? PuertaCorrediza.GetWidth(cube, index) : PuertaCorrediza.GetHeight(cube),
            LVeta: puerta.sentidoVeta === ModuleLayout.Vertical ? PuertaCorrediza.GetHeight(cube) : PuertaCorrediza.GetWidth(cube, index),
            tapacantos: Puerta.GetTapacantos(puerta),
            Material: puertaC['puertas'][index].material,
            Orientacion: puerta.sentidoVeta === ModuleLayout.Horizontal ? 3 : 4,
            X: (x + getAxisOffsetX(modulo) + encastreOffsetX - puerta.extraIzquierda) + xWidth - cruceEntrePuertas + centerOffset,
            Y: y + + getAxisOffsetY(modulo) + encastreOffsetY - puerta.extraAbajo + 3,
            Z: (index + 1) % 2 === 0 ? z - 25 : z,
            _Id: cube.id,
            elementId: cube.id,
            Visible: (!puerta.visible)?false:puerta.puertasVisible[index],
            puerta_index: index
          };
          newPartsOfPuertas.push(pPart);
        }
      }
    } else {
      if(!puerta.puertasVisible){
        refrescar = true
        puerta.puertasVisible = [true]
      }
      const pPart: Part = {
        Count: 1,
        Name: puerta.tipo === PuertaTipo.Dividida ? puerta.name + ' I' : puerta.name,
        Module: modName,
        Espesor: puerta.size,
        AVeta: puerta.sentidoVeta === ModuleLayout.Vertical ? Puerta.GetWidth(cube) : Puerta.GetHeight(cube),
        LVeta: puerta.sentidoVeta === ModuleLayout.Vertical ? Puerta.GetHeight(cube) : Puerta.GetWidth(cube),
        tapacantos: Puerta.GetTapacantos(puerta),
        Material: puerta.material,
        Orientacion: puerta.sentidoVeta === ModuleLayout.Horizontal ? 3 : 4,
        X: x + getAxisOffsetX(modulo) + encastreOffsetX - puerta.extraIzquierda,
        Y: y + + getAxisOffsetY(modulo) + encastreOffsetY - puerta.extraAbajo,
        Z: Puerta.GetFrenteZ(cube) + getAxisOffsetZ(modulo),
        _Id: cube.id,
        elementId: cube.id,
        Visible: (!puerta.visible)?false:puerta.puertasVisible[0]
      }

      newPartsOfPuertas.push(pPart)

      if (puerta.tipo === PuertaTipo.Dividida) {
        if(refrescar){
          puerta.puertasVisible.push(true)
        }
        
        let mitadPuerta = JSON.parse(JSON.stringify(pPart)); // deep copy
        mitadPuerta.X = Puerta.GetWidth(cube) + (modulo.settings.HolguraLateralFrentesCajon * 3) + pPart.X + Element.GetEspesorTapacanto(puerta, 2) * 2;
        mitadPuerta.Name = puerta.name + ' D';
        mitadPuerta.Visible = (!puerta.visible)?false:puerta.puertasVisible[1]
        mitadPuerta.elementId = cube.id;
        newPartsOfPuertas.push(mitadPuerta);
      }
    }
  });
  return {newPartsOfPuertas, refrescar}
}

function getPartsOfRieles(modulo: Modulo, modName: string): Part[]{
  const newPartsRieles: Part[] = []

  // Rieles
  const rieles: Element[] = modulo.elements.filter((element: any) => element.riel)
  rieles.forEach((cube, num) => {
    const riel = (cube as any) as Riel
    if (riel.size !== 0) {
      const pPart: Part = {
        Count: 1,
        Name: riel.name,
        Module: modName,
        Only3d: riel.only3d,
        Comentario: riel.comentario,
        Espesor: riel.size,
        AVeta: riel.AVeta,
        LVeta: riel.LVeta,
        tapacantos: riel.tapacantos,
        Material: riel.material,
        Orientacion: riel.Orientacion,
        X: riel.X + getAxisOffsetX(modulo),
        Y: riel.Y + getAxisOffsetY(modulo),
        Z: riel.Z + getAxisOffsetZ(modulo),
        _Id: riel.id,
        elementId: riel.id,
        Visible: riel.visible
      };
      newPartsRieles.push(pPart);
    }
  });

  return newPartsRieles
}

function getPartsOfFondo(modulo: Modulo, modName: string): Part[]{
  const newPartsFondo: Part[] = []
  // fondo
  if (modulo.fondo && !modulo.isTypeL) {
    const customFondos = modulo.customFondos;
    if (customFondos.length) {
      customFondos.forEach((fondo: any, index: number) => {
        if (fondo.Exportable) {
          const name = fondo.Name.split(' ');
          name.splice(0, 1); // saco la palabra 'Fondo'
          const numbers = name[0].split('-').join('');
          const idFondo = +(((100000 * modulo.moduleId) + '') + numbers);
          const fondoPart: Part = {
            Count: 1,
            Name: fondo.Name,
            Module: modName,
            Espesor: modulo.settings.EspesorGeneral,
            AVeta: fondo.AVeta + (+fondo.ExtraIzquierda || 0) + (+fondo.ExtraDerecha || 0),
            LVeta: fondo.LVeta + (+fondo.ExtraAlto || 0) + (+fondo.ExtraAbajo || 0),
            tapacantos: new TapacantoSetting(),
            Material: modulo.fondo,
            Orientacion: 4,
            X: fondo.X + getAxisOffsetX(modulo) - (+fondo.ExtraIzquierda || 0),
            Y: fondo.Y + getAxisOffsetY(modulo) - (+fondo.ExtraAbajo || 0),
            Z: -modulo.settings.EspesorGeneral + getAxisOffsetZ(modulo),
            ElementType: ElementType.fondo,
            _Id: idFondo,
            elementId: idFondo,
            Visible: modulo.fondoVisible
          };
          (fondoPart as any).history = fondo.history;
          newPartsFondo.push(fondoPart);
        }
      });
    } else {
      // fondo original
      const fondoPart: Part = {
        Count: 1,
        Name: 'Fondo',
        Module: modName,
        Exportable: true,
        Espesor: modulo.settings.EspesorGeneral,
        AVeta: modulo.width + (+modulo.ExtraIzquierda || 0) + (+modulo.ExtraDerecha || 0),
        LVeta: modulo.height + (+modulo.ExtraAlto || 0) + (+modulo.ExtraAbajo || 0),
        tapacantos: new TapacantoSetting(),
        Material: modulo.fondo,
        Orientacion: 4,
        X: 0 + getAxisOffsetX(modulo) - (+modulo.ExtraIzquierda || 0),
        Y: 0 + getAxisOffsetY(modulo) - (+modulo.ExtraAbajo || 0),
        Z: -modulo.settings.EspesorGeneral + getAxisOffsetZ(modulo),
        ElementType: ElementType.fondo,
        ExtraAlto: 0,
        ExtraAncho: 0,
        ExtraAbajo: 0,
        ExtraDerecha: 0,
        ExtraIzquierda: 0,
        _Id: 100000 * modulo.moduleId,
        elementId: 100000 * modulo.moduleId,
        Visible: modulo.fondoVisible
      };
      newPartsFondo.push(fondoPart);
    }
  }
  return newPartsFondo
}

function getPartsOfPiezasManuales(modulo: Modulo, modName: string, newPartsOfCajonGroups: Part[], newPartsOfPuertas: Part[]): Part[]{
  const newPartsPiezasManuales: Part[] = []
  // PiezaManual
  const piezaManual: Element[] = modulo.elements.filter((element: any) => element.piezaManual)
  piezaManual.forEach(cube => {
    const piezaManual = (cube as any) as PiezaManual
    if (piezaManual.size !== 0) {
      let visible = piezaManual.visible
      if(piezaManual.name.includes('tapacanto')){
        const nombrePieza = `${piezaManual.name.split(" ")[2]} ${piezaManual.name.split(" ")[3]}`
        const cajon = newPartsOfCajonGroups.find(c=>{
          return c.Name === nombrePieza}) 
        if(cajon){
          visible = !cajon.Visible ? false : piezaManual.visible
        }
        const puerta = newPartsOfPuertas.find(p=>{
          return p.Name === nombrePieza}) 
        if(puerta){
          visible = !puerta.Visible ? false : piezaManual.visible
        }
        
        
      }
      const pPart: Part = {
        Count: piezaManual.Count,
        Name: piezaManual.name,
        Module: modName,
        Only3d: piezaManual.only3d,
        Comentario: piezaManual.comentario,
        Espesor: piezaManual.size,
        AVeta: piezaManual.AVeta,
        LVeta: piezaManual.LVeta,
        girarVeta: piezaManual.girarVeta,
        DisplayAVeta: piezaManual.displayAVeta,
        DisplayLVeta: piezaManual.displayLVeta,
        tapacantos: piezaManual.tapacantos,
        Material: piezaManual.material,
        Orientacion: piezaManual.Orientacion,
        X: piezaManual.X + getAxisOffsetX(modulo),
        Y: piezaManual.Y + getAxisOffsetY(modulo),
        Z: piezaManual.Z + getAxisOffsetZ(modulo),
        _Id: piezaManual.id,
        elementId: piezaManual.id,
        Visible: visible
      }
      newPartsPiezasManuales.push(pPart)
    }
  });
  return newPartsPiezasManuales
}

function getPartsOfModuloExterno(modulo: Modulo, modName: string): Part[]{
  const newPartsModuloExterno: Part[] = []

  const moduloExterno: Element[] = modulo.elements.filter((element: any) => element.moduloExterno)

  moduloExterno.forEach(cube => {

    const moduloExterno = (cube as any) as ModuloExterno

    const pPart: Part = {
      Count: moduloExterno.Count,
      Name: moduloExterno.name,
      Module: modName,
      Espesor: moduloExterno.size,
      AVeta: moduloExterno.AVeta,
      LVeta: moduloExterno.LVeta,
      tapacantos: moduloExterno.tapacantos,
      Material: moduloExterno.material,
      Orientacion: 4,
      X: moduloExterno.X + getAxisOffsetX(modulo),
      Y: moduloExterno.Y + getAxisOffsetY(modulo),
      Z: moduloExterno.Z + getAxisOffsetZ(modulo),
      _Id: moduloExterno.id,
      elementId: moduloExterno.id,
      Visible: moduloExterno.visible
    }
    newPartsModuloExterno.push(pPart)
  });
  return newPartsModuloExterno

}

function isPartOfCajonGroup(elements: any[], idPart:number): boolean{
  return elements.some((element)=>{
      return element.cajonGroup && element.childs.includes(idPart)
  })
}
function setPieceVisibility(elements:any, elementId: any, piece: any, pieceName: any, visible: any){
  if( isPartOfCajonGroup(elements,elementId)){
    setCajonVisibility(visible, piece, pieceName)
  }else if(pieceName.startsWith('Puerta') && piece.puerta){
    setPuertaVisibility(visible, piece, pieceName)
  }
  else{
    piece.visible = visible
  }
}

function setCajonVisibility(visible: boolean, piece: any, pieceName: string){
  if(visible) piece.visible = true
  if(pieceName.includes('Base Cajon')){
    piece.baseVisible = !piece.baseVisible
  }else if(pieceName.includes('Frente Cajon')){
    piece.frenteVisible = !piece.frenteVisible
  }else if(pieceName.includes('Lat. Izq. Cajon')){
    piece.latIzqVisible = !piece.latIzqVisible
  }else if(pieceName.includes('Lat. Der. Cajon')){
    piece.latDerVisible = !piece.latDerVisible
  }else if(pieceName.includes('C/F Cajon')){
    if(!pieceName.includes('(2)')){
      piece.cfVisible = !piece.cfVisible
    }else{
      piece.cf2Visible = !piece.cf2Visible
    }
  }else{
    piece.visible = visible
  }
}
function setPuertaVisibility(visible: boolean, piece: any, pieceName: string){
  
  const tipo = (pieceName.split(" ").length > 2) ? pieceName.split(" ")[2] : ""
  if(tipo==="I"){
    piece.puerta.puertasVisible[0] = visible
  }else if(tipo==="D"){
    piece.puerta.puertasVisible[1] = visible
  }else if(tipo.startsWith("(")){
    const nroPuerta = parseInt(tipo.split("(")[1].split(")")[0]) - 1 // Sacar el número dentro de los parentesis (58) y se resta uno para obtener el indice
    piece.puerta.puertasVisible[nroPuerta] = visible
  }else{
    piece.puerta.visible = visible
  }
  
  piece.puerta.visible = !piece.puerta.visible
  piece.puerta.visible = !piece.puerta.visible
  
}
export {
  getPartsOfModulo,
  setPieceVisibility,
  noReload
}
