import {
    CajonTipo, CajonAperturaUbicacion, ModuleLayout, HerrajeEnum,
    MaterialEnum, TapacantoEnum, UbicacionBisagra, PuertaTipo, AperturaSistema, ModulosExternosEnum, ElementType
} from './enums';
import Vue from 'vue';

export class Element {
    static state: any
    static getters: any

    readonly parent: number
    readonly id: number

    name: string
    comentario: string

    public elementType: string
    public visible: boolean = true;
    public moduleId: number;
    public moduleName: string;
    public girarVeta?: boolean = false; // rota en exportar las medidas lveta y aveta
    public layerId?: number = -1; // capa a la cual pertenece el elemento
    public drawing?: any = {}; // dibujo personalizado para la calcomania (en cara opuesta y frontal)
    public grupoMaterial?: boolean = true;

    // crea y devuelve la calcomania para un fondo
    static GetFondoCalco(fondo: any): CalcoInfo {
        const modulo = Modulo.GetModuleByIndex(fondo.moduleId - 1) as any;
        const calcoInfo = new CalcoInfo();
        if (modulo.customFondos.length) {
            let fondoInfo = modulo.customFondos.find((f: any) => f.Name === fondo.name);
            let index = 1;
            let i = 0;
            // busco el indice del fondo actual
            while (fondoInfo.Name != modulo.customFondos[i].Name) {
                if (modulo.customFondos[i].Exportable) {
                    index++;
                }
                i++;
            }

            const fondosCount = modulo.customFondos.filter((f: any) => f.Exportable).length;
            calcoInfo.separator = fondoInfo;
            calcoInfo.AVeta = fondoInfo.ExtraAncho || fondoInfo.ExtraIzquierda || fondoInfo.ExtraDerecha ?
                +fondoInfo.ExtraIzquierda + +fondoInfo.ExtraDerecha + +fondoInfo.ExtraAncho + fondoInfo.AVeta :
                fondoInfo.AVeta;
            calcoInfo.AVeta = +calcoInfo.AVeta.toFixed(2);
            calcoInfo.LVeta = fondoInfo.ExtraAlto ? +fondoInfo.ExtraAlto + fondoInfo.LVeta : fondoInfo.LVeta;
            calcoInfo.LVeta = +calcoInfo.LVeta.toFixed(2);
            calcoInfo.material = fondoInfo.Material;
            calcoInfo.extra = index + ' de ' + fondosCount + ' fondos';
            calcoInfo.separator.drawing = fondoInfo.drawing;
        } else {
            calcoInfo.separator = fondo;
            calcoInfo.AVeta = modulo.width + (+modulo.ExtraIzquierda || 0) + (+modulo.ExtraDerecha || 0);
            calcoInfo.LVeta = modulo.height + (+modulo.ExtraAlto || 0) + (+modulo.ExtraAbajo || 0);
            calcoInfo.material = modulo.fondo;
            calcoInfo.extra = '1 de 1 fondo';
            calcoInfo.separator.drawing = modulo.drawing;
        }
        calcoInfo.moduleName = fondo.moduleName;
        calcoInfo.moduleDescripcion = Modulo.GetModuleByIndex(fondo.moduleId - 1).settings.description;
        calcoInfo.moduleComentario = Modulo.GetModuleByIndex(fondo.moduleId - 1).settings.comentario;
        calcoInfo.generalName = this.getters.generalSettings('name');
        calcoInfo.generalMueble = this.getters.generalSettings('mueble');
        calcoInfo.generalComentarioInstalacion = this.getters.generalSettings('comentario');
        return calcoInfo;
    }

    /**
     * Devuelve el espesor del tapacantos para un lado dado
     * 1: superior
     * 2: derecha
     * 3: inferior
     * 4: izquierda
     */
    static GetEspesorTapacanto(elem: any, side: 1 | 2 | 3 | 4): number {
        if (!elem.tapacantos) {
            return 0;
        }

        switch (side) {
            case 1:
                return elem.tapacantos.superior && elem.tapacantos.superior.espesor || 0;
            case 2:
                return elem.tapacantos.derecho && elem.tapacantos.derecho.espesor || 0;
            case 3:
                return elem.tapacantos.inferior && elem.tapacantos.inferior.espesor || 0;
            case 4:
                return elem.tapacantos.izquierdo && elem.tapacantos.izquierdo.espesor || 0;
            default: return 0;
        }
    }

    static Selected(): Element {
        return Element.GetElement(Modulo.Selected().selected as any)
    }

    static GetElement(id: number): Element {
        let el = (Modulo.Selected().elements as any).find((e: Element) => e.id === id);
        if (el) {
            return el;
        }
        return Element.GetElementFromAnyModuleById(id);
    }

    static GetElementFromAnyModuleById(id: number): Element {
        const elements: Element[] = [];
        Element.state.modules.forEach((mod: any) => {
            elements.push(...mod.elements);
        });

        Element.state.roomEditorModules.forEach((mod: any) => {
            elements.push(...mod.elements);
        });

        return (elements as any).find((e: Element) => e.id === id);
    }

    static GetElementIndex(element: Element) {
        return (Modulo.Selected().elements as any).findIndex((e: number) => e === element.id)
    }

    static GetParent(element: Element): Element {
        let el = (Modulo.Selected().elements as any).find((e: Element) => e.id === element.parent);
        if (el) {
            return el;
        }
        return Element.GetElementFromAnyModuleById(element.parent);
    }

    private static GetRight(cube: Cube, searchLayout: string, showZeroWidth: boolean = false): Element[] {
        let list: Element[] = []
        if (cube.layout === searchLayout) {
            // Buscar entre todos los hijos los elementos mas cercanos
            cube.childs.forEach((childId: number) => {
                const element = Element.GetElement(childId)
                if ((element as any).separator || (element as any).cajon) {
                    list.push(element)
                } else {
                    list = list.concat(Element.GetRight(element as Cube, searchLayout, showZeroWidth))
                }
            });
        } else if (cube.childs && cube.childs.length > 0) {
            // Buscar el elemento mas cercano
            const child = Element.GetElement(cube.childs[cube.childs.length - 1]) as Cube
            list = list.concat(Element.GetRight(child, searchLayout, showZeroWidth))
        }

        if (!showZeroWidth) {
            list = list.filter((elem: any) => elem.cajon || elem.size > 0);
        }
        return list
    }

    private static GetLeft(cube: Cube, searchLayout: string, showZeroWidth: boolean = false): Element[] {
        let list: Element[] = []
        if (cube.layout === searchLayout) {
            cube.childs.forEach((childId: number) => {
                const element = Element.GetElement(childId)
                if ((element as any).separator || (element as any).cajon) {
                    list.push(element)
                } else {
                    list = list.concat(Element.GetLeft(element as Cube, searchLayout, showZeroWidth))
                }
            });
        } else if (cube.childs && cube.childs.length > 0) {
            list = list.concat(Element.GetLeft(Element.GetElement(cube.childs[0]) as Cube, searchLayout, showZeroWidth))
        }

        if (!showZeroWidth) {
            list = list.filter((elem: any) => elem.cajon || elem.size > 0);
        }
        return list
    }

    static GetBeforeConnections(element: Element, showZeroWidth: boolean = false): Element[] {
        const parent = Element.GetParent(element) as Cube
        const before = Element.GetBeforeSibling(element)
        let elements: any = [];
        if (!before) {
            return elements;
        } else if (parent.layout === ModuleLayout.Vertical) {
            // Buscar a izquierda
            elements = Element.GetRight(before as Cube, ModuleLayout.Horizontal, showZeroWidth);
        } else {
            elements = Element.GetRight(before as Cube, ModuleLayout.Vertical, showZeroWidth)
        }
        return elements.filter((element: any) => !element.virtual)
    }

    static GetAfterConnections(element: Element, showZeroWidth: boolean = false): Element[] {
        const parent = Element.GetParent(element) as Cube
        const after = Element.GetAfterSibling(element)
        let elements: any = [];
        if (!after) {
            return elements;
        } else if (parent.layout === ModuleLayout.Vertical) {
            // Buscar a derecha
            elements = Element.GetLeft(after as Cube, ModuleLayout.Horizontal, showZeroWidth)
        } else {
            elements = Element.GetLeft(after as Cube, ModuleLayout.Vertical, showZeroWidth)
        }

        return elements.filter((element: any) => !element.virtual);
    }

    static GetConnections(element: Element): Element[] {
        console.log('GET-CONNECTIONS')
        Separator.CalcularConexiones(element as Separator)
        return this.GetBeforeConnections(element).concat(this.GetAfterConnections(element))
    }

    static GetBeforeSibling(element: Element) {
        const parent = Element.GetParent(element) as Cube

        // Root element has not parent
        if (parent == null) {
            return null
        }

        const index = parent.childs.findIndex((e: number) => e === element.id)
        return index === 0 ? null : Element.GetElement(parent.childs[index - 1])
    }

    static GetAfterSibling(element: Element) {
        const parent = Element.GetParent(element) as Cube

        if (parent == null) {
            return null
        }

        const index = parent.childs.findIndex((e: any) => e === element.id)
        return index === parent.childs.length - 1 ? null : Element.GetElement(parent.childs[index + 1])
    }

    static GetWidth(element: Element): number {
        const parent = Element.GetParent(element) as Cube

        // Root Element
        if (parent == null) {
            return Modulo.FindModuleByPiece(element).width;
        }

        // Horizontal Layout
        if (parent.layout !== 'vertical') {
            return Element.GetWidth(parent)
        }

        // Vertical Layout, Separator => Separator Size
        if ((element as any).separator) {
            return (element as Separator).size
        }

        // Vertical Layout, Cube/Cajon => Distance between separators
        const after = Element.GetAfterSibling(element) as Separator
        const afterPos = after ? after.position.x : Element.GetWidth(parent)
        const before = Element.GetBeforeSibling(element) as Separator
        const beforePos = before ? before.position.x + before.size : 0

        return afterPos - beforePos
    }

    static GetHeight(element: Element): number {
        const parent = Element.GetParent(element) as Cube

        // Root Element
        if (parent == null) {
            let modulo = Modulo.FindModuleByPiece(element);
            return modulo.height;
        }

        // Vertical Layout
        if (parent.layout !== 'horizontal') {
            return Element.GetHeight(parent)
        }

        // Horizontal Layout, Separator => Separator Size
        if ((element as any).separator) {
            return (element as Separator).size
        }

        // Horizontal Layout, Cube/Cajon => Distance between separators
        const after = Element.GetAfterSibling(element) as Separator
        const afterPos = after ? after.position.y + after.size : 0
        const before = Element.GetBeforeSibling(element) as Separator
        const beforePos = before ? before.position.y : Element.GetHeight(parent)

        return beforePos - afterPos
    }

    // Separador de arriba de un cubo
    static GetTop(element: Element): any {
        const parent = Element.GetParent(element) as Cube
        let before = Element.GetBeforeSibling(element) as Separator;

        if (!before) {
            return Element.GetTop(parent);
        }

        if (parent.layout === 'vertical') {
            return Element.GetTop(parent)
        }

        return before;
    }

    static GetBottom(element: Element): any {
        const parent = Element.GetParent(element) as Cube
        let after = Element.GetAfterSibling(element) as Separator;

        if (!after) {
            return Element.GetBottom(parent);
        }

        if (parent.layout === 'vertical') {
            return Element.GetBottom(parent)
        }

        return after;
    }

    // Separador de abajo de un cubo
    static GetX(element: Element): number {
        const parent = Element.GetParent(element) as Cube

        // Root Element. Position 0
        if (parent == null) {
            return 0
        }

        if (parent.layout !== 'vertical') {
            if ((element as any).separator && (element as any).separadorPadre != undefined) {
                if ((element as any).separatorDivision) {
                    return Element.GetX((element as any).separadorPadre);
                }
                return (element as Separator).position.x
            }
            return Element.GetX(parent)
        }

        if ((element as any).separator) {
            return Element.GetX(parent) + (element as Separator).position.x
        }

        const leftSibling = Element.GetBeforeSibling(element) as Separator
        if (leftSibling) {
            return Element.GetX(leftSibling) + leftSibling.size
        }

        return Element.GetX(parent)
    }

    static GetY(element: Element): number {
        const parent = Element.GetParent(element) as Cube

        // Root Element. Position 0
        if (parent == null) {
            return 0
        }

        if (parent.layout !== 'horizontal') {
            return Element.GetY(parent)
        }

        if ((element as any).separator) {
            return Element.GetY(parent) + (element as Separator).position.y
        }

        const bottomSibling = Element.GetAfterSibling(element) as Separator
        if (bottomSibling) {
            return Element.GetY(bottomSibling) + Element.GetHeight(bottomSibling)
        }
        return Element.GetY(parent)
    }

    constructor(parent: any, modulo_id: any) {
        let m_id = modulo_id;
        if (modulo_id.moduleId !== undefined) {
            m_id = modulo_id.moduleId - 1;
        }

        const modulo = Modulo.GetModuleByIndex(m_id);
        if (parent == null) {
            parent = undefined
        }
        const els = modulo.elements.length
        const idMultiplier = Element.state.ambienteEnabled ? Element.state.idMultiplier.roomEditor : Element.state.idMultiplier.modulo;
        this.id = els > 0 ? modulo.elements[els - 1].id + 1 : (modulo_id + 1) * idMultiplier;
        this.name = 'Elemento ' + this.id.toString()
        this.comentario = ''
        this.moduleId = modulo.moduleId;
        this.moduleName = modulo.moduleName;

        if (parent !== undefined) {
            this.parent = parent.id
            parent.childs.push(this.id)
        }

        modulo.elements.push(this)
    }
}

export class Cube extends Element {
    public childs: any;
    public cube = true;
    public layout: string

    constructor(parent: any, modulo_id: any) {
        super(parent, modulo_id);
    }
}

export class TapacantoSetting {
    izquierdo = TapacantoEnum.No
    derecho = TapacantoEnum.No
    superior = TapacantoEnum.No
    inferior = TapacantoEnum.No
}

export class Separator extends Element {
    public separator = true
    public size: number
    public position: any
    public tapacantos = new TapacantoSetting()
    public material = MaterialEnum.None
    public conexionesBefore = [] as Conexion[]
    public conexionesAfter = [] as Conexion[]
    public anchoVeta = -1 // -1 significa que se toma la anchoVeta del módulo
    public largoVeta = -1 // -1 significa que se toma la largoVeta del módulo
    public full = false
    public division = 0
    public childs = [] as any[]
    public separatorDivision = false
    public separadorPadre: any = null;
    public ejeZ = 0
    public virtual: boolean = false;
    public diagramWidth: number = -1; // ancho con el que se dibujara el separador en el plano. Si es menor que 0, se utilizara el espesor
    public lTypeZ?: number = 0; // ancho de la L en un modulo de tipo L
    public techoPisoL?: boolean = false; // si el separador es un piso o techo de un modulo en L
    public displayAVeta?: number; // Aveta para mostrar (ej: en calcos). No es el Aveta que va a tomar el 3d
    public displayLVeta?: number; // Lveta para mostrar (ej: en calcos). No es el Lveta que va a tomar el 3d
    public isL?: boolean = false; // si la parte es en L
    public lPartId: number = null; // id de la parte en L

    static getLPart(separator: Separator): PiezaManual {
        const modulo = Modulo.GetModuleByIndex(separator.moduleId - 1) as any;
        const index = Separator.getLPartIndex(separator);
        if (index >= 0) {
            return modulo.elements[index];
        }
        return null;
    }

    static getLPartIndex(separator: Separator): number {
        const modulo = Modulo.GetModuleByIndex(separator.moduleId - 1) as any;
        return modulo.elements.findIndex((elem: any) => elem.id === separator.lPartId);
    }

    static GetLargoVeta(separator: Separator): number {
        if (!separator) {
            return -1;
        }

        if (separator.largoVeta > -1) {
            return separator.largoVeta
        }

        // Separador Dividido
        if ((separator as any).separatorDivision) {
            return SeparatorDividido.GetLargoVeta(separator as any)
        }

        // Bandeja
        if ((separator as Bandeja).bandeja) {
            return Bandeja.GetLargoVeta(separator as Bandeja)
        }

        // Barral
        if ((separator as Barral).barral) {
            return Barral.GetLargoVeta(separator as Barral)
        }

        if ((separator as PiezaManual).piezaManual) {
            return PiezaManual.GetLargoVeta(separator as PiezaManual)
        }

        if ((separator as ModuloExterno).moduloExterno) {
            return ModuloExterno.GetLargoVeta(separator as ModuloExterno)
        }

        const parent = Element.GetParent(separator) as Cube

        // Horizontal Layout
        if (parent.layout === 'vertical') {
            let lv = Element.GetHeight(parent);
            if ((separator as any).liston) {
                lv += ((separator as any).extraAlto || 0) + ((separator as any).extraAbajo || 0);
            }
            return lv;
        }

        // Vertical Layout
        let w = Element.GetWidth(parent);
        if ((separator as any).liston) {
            w += ((separator as any).extraDerecha || 0) + ((separator as any).extraIzquierda || 0);
        }

        return w;
    }

    static GetAnchoVeta(separator: Separator): number {
        if (!separator) {
            return -1;
        }

        if (separator.anchoVeta > -1) {
            return separator.anchoVeta
        }

        // Separador Dividido
        if ((separator as any).separatorDivision) {
            return SeparatorDividido.GetAnchoVeta(separator as any)
        }

        // Bandeja
        if ((separator as Bandeja).bandeja) {
            return Bandeja.GetAnchoVeta(separator as Bandeja)
        }

        // Pieza Manual
        if ((separator as PiezaManual).piezaManual) {
            return PiezaManual.GetAnchoVeta(separator as PiezaManual)
        }

        // Barral
        if ((separator as Barral).barral) {
            return Barral.GetAnchoVeta(separator as Barral)
        }

        if ((separator as ModuloExterno).moduloExterno) {
            return ModuloExterno.GetAnchoVeta(separator as ModuloExterno)
        }

        return Modulo.FindModuleByPiece(separator).z;
    }

    static GetOrientacion(separator: any): number {
        if (separator.liston && separator.Orientacion) {
            return separator.Orientacion;
        }

        if (separator.piezaManual) {
            return separator.Orientacion;
        }

        const parent = Element.GetParent(separator) as Cube
        return parent.layout === ModuleLayout.Horizontal ? 2 : 1
    }

    static GetFrenteZ(separator: any): number {
        if ((separator as Barral).barral) {
            return (separator.prof2)
        }
        return separator.ejeZ;
    }

    static CalcularTipoConexion(separator: any): ConexionTypeEnum {
        try {
            var conexionesUser = JSON.parse(localStorage.getItem('conexiones'));
            if(!conexionesUser){
                return ConexionTypeEnum.None;
            }else{
                if (separator.cajon) {
                    return conexionesUser.find((a:any) => a.nombre == "TELE").nombre;
                } else if (separator.bandeja) {
                    return conexionesUser.find((a:any) => a.nombre == "TELE").nombre;
                } else if (separator.barral) {
                    return conexionesUser.find((a:any) => a.nombre == "Soporte barral").nombre;
                }

                return conexionesUser.find((a:any) => a.nombre == "2 TO 35").nombre;
            }
        } catch (error) {
            return ConexionTypeEnum.None;
        }
    }

    static CalcularConexion(separator: Separator, s2: Separator, tipo: ConexionTypeEnum) {
        const index = (separator.conexionesBefore as any).findIndex((conexion: Conexion) => {
            return conexion.separator.id === s2.id
        })

        if (index != -1) {
            let c = new Conexion()
            c.separator = s2
            c.tipo = tipo
            c.info = Calco.Create(separator, c.separator, c.tipo)
            separator.conexionesBefore.splice(index, 1, c)
            return
        }

        // ConexionesAfter
        const index2 = (separator.conexionesAfter as any).findIndex((conexion: Conexion) => {
            return conexion.separator.id === s2.id
        })

        const c = new Conexion()
        c.separator = s2
        c.tipo = tipo
        c.info = Calco.Create(separator, c.separator, c.tipo)
        separator.conexionesAfter.splice(index2, 1, c)
    }

    static CalcularConexionesBefore(separator: Separator, showZeroWidth: boolean = false) {
        let before: Conexion[] = [];
        Element.GetBeforeConnections(separator, showZeroWidth).forEach((element: any, index: number) => {
            const c = new Conexion()
            c.separator = element as Separator
            const conexiones = separator.conexionesBefore as any;
            const conexion = conexiones.find((con: any) => con.separator.id === c.separator.id);
            c.tipo = conexion ? conexion.tipo : this.CalcularTipoConexion(element);
            c.info = Calco.Create(separator, c.separator, c.tipo)
            c.conexionDividida = c.separator.division && +c.separator.division > 0;
            before.push(c);
            c.conexionDividida = c.separator.division && +c.separator.division > 0;
        })

        if (!showZeroWidth && (separator.conexionesBefore && separator.conexionesBefore.length)) {
            before = before.filter((c) => c.separator.size !== undefined ? c.separator.size > 0 : true);
        }

        return before;
    }

    static CalcularConexionesAfter(separator: Separator, showZeroWidth: boolean = false) {
        let after: Conexion[] = [];
        Element.GetAfterConnections(separator, showZeroWidth).forEach((element: any, index: number) => {
            const c = new Conexion()
            c.separator = element as Separator
            const conexiones = separator.conexionesAfter as any;
            const conexion = conexiones.find((con: any) => con.separator.id === c.separator.id);
            c.tipo = conexion ? conexion.tipo : this.CalcularTipoConexion(element);
            c.info = Calco.Create(separator, c.separator, c.tipo)
            c.conexionDividida = c.separator.division && +c.separator.division > 0;
            after.push(c);
        })

        if (!showZeroWidth && (separator.conexionesAfter && separator.conexionesAfter.length)) {
            after = after.filter((c) => c.separator.size !== undefined ? c.separator.size > 0 : true);
        }

        return after;
    }

    static CalcularConexiones(separator: Separator, showZeroWidth: boolean = false) {
        Vue.set(separator, 'conexionesBefore', Separator.CalcularConexionesBefore(separator, showZeroWidth));
        Vue.set(separator, 'conexionesAfter', Separator.CalcularConexionesAfter(separator, showZeroWidth));
    }

    static GetCalcoObject(separator: Separator): CalcoInfo {
        if (!separator) {
            return {} as CalcoInfo;
        }
        if (separator.id === -1) {
            return Element.GetFondoCalco(separator);
        }
        const calcoInfo = new CalcoInfo()
        calcoInfo.separator = separator
        calcoInfo.AVeta = Separator.GetAnchoVeta(separator)
        calcoInfo.LVeta = Separator.GetLargoVeta(separator)
        calcoInfo.moduleName = separator.moduleName;
        calcoInfo.moduleDescripcion = Modulo.GetModuleByIndex(separator.moduleId - 1).settings.description
        calcoInfo.moduleComentario = Modulo.GetModuleByIndex(separator.moduleId - 1).settings.comentario
        calcoInfo.moduleArmado = Modulo.GetModuleByIndex(separator.moduleId - 1).settings.armado
        calcoInfo.generalName = this.getters.generalSettings('name')
        calcoInfo.generalMueble = this.getters.generalSettings('mueble')
        calcoInfo.generalComentarioInstalacion = this.getters.generalSettings('comentario')
        return calcoInfo
    }

    static GetCalcoInfo(sep: Separator): CalcoInfo[] {
        const calcos: CalcoInfo[] = [];
        let separator = sep as any;

        if (separator.liston && separator.compound && separator.compound.length > 0 && separator.compound[0] !== separator.id) {
            // separator es un liston que forma parte de un liston compuesto (y no es el liston principal de la composicion)
            separator = Separator.GetElement((sep as any).compound[0]) as Separator;
        }

        // Agregar primera calco (lado izquierdo)
        const calcoInfo = new CalcoInfo()
        calcoInfo.separator = separator
        calcoInfo.AVeta = (separator as Liston).liston ? (separator as Liston).anchoListon : Separator.GetAnchoVeta(separator);
        calcoInfo.LVeta = Separator.GetLargoVeta(separator)
        calcoInfo.moduleName = separator.moduleName;
        calcoInfo.moduleDescripcion = Modulo.GetModuleByIndex(separator.moduleId - 1).settings.description
        calcoInfo.moduleComentario = Modulo.GetModuleByIndex(separator.moduleId - 1).settings.comentario
        calcoInfo.moduleArmado = Modulo.GetModuleByIndex(separator.moduleId - 1).settings.armado
        calcoInfo.generalName = this.getters.generalSettings('name')
        calcoInfo.generalMueble = this.getters.generalSettings('mueble')
        calcoInfo.generalComentarioInstalacion = this.getters.generalSettings('comentario')
        calcoInfo.modulo = Modulo.GetModuleByIndex(separator.moduleId - 1);

        if (calcoInfo.LVeta === 18) {
            console.log(separator.name)
        }

        if (separator.separator) {
            // dibujo canvas, lado del frente
            if (separator.drawing && (separator as any).drawing.front) {
                calcoInfo.drawing = (separator as any).drawing.front;
            }

            if (separator.liston) {
                if (separator.compound && separator.compound.length > 0) {
                    // liston compuesto
                    calcoInfo.LVeta = 0;
                    separator.compound.forEach((id: any) => {
                        const l = Separator.GetElement(id) as any;
                        calcoInfo.LVeta += Separator.GetLargoVeta(l);
                    });
                }
                //  else {
                //     // liston simple
                //     calcoInfo.LVeta += ((separator as any).extraAbajo || 0) + ((separator as any).extraAlto || 0);
                // }
            }

            calcos.push(calcoInfo)
        }

        // Agregar segunda calco (lado derecho)
        if (separator &&
            (separator.conexionesBefore && separator.conexionesBefore.length > 0)
            || (separator.conexionesAfter && separator.conexionesAfter.length > 0)) {

            const calco2 = JSON.parse(JSON.stringify(calcoInfo)) as CalcoInfo
            calco2.drawing = undefined;

            // Swap tapacantos
            const temp = calco2.separator.tapacantos.derecho
            calco2.separator.tapacantos.derecho = calco2.separator.tapacantos.izquierdo
            calco2.separator.tapacantos.izquierdo = temp

            // Swap conexiones
            const temp2 = calco2.separator.conexionesAfter
            calco2.separator.conexionesAfter = calco2.separator.conexionesBefore
            calco2.separator.conexionesBefore = temp2

            // dibujo canvas, lado de atras
            if (separator.drawing && separator.drawing.back) {
                calco2.drawing = separator.drawing.back;
            }

            calcos.push(calco2)
        }

        if (separator.puerta) {
            const puertaInfo = separator.puerta as Puerta
            if (puertaInfo.tipo == PuertaTipo.Dividida) {
                const calcoPuertaIzq = JSON.parse(JSON.stringify(calcoInfo)) as CalcoInfo
                const calcoPuertaDer = JSON.parse(JSON.stringify(calcoInfo)) as CalcoInfo
                calcoPuertaDer.separator.elementType = ElementType.puerta;
                calcoPuertaIzq.separator.elementType = ElementType.puerta;
                (calcoPuertaDer as any).separator['puertaDerecha'] = true;
                (calcoPuertaIzq as any).separator['puertaIzquierda'] = true;

                // Borramos las conexiones de la puerta custom, ya que estas son en realidad las conexiones del separador que la contienen
                if (puertaInfo.elementType === 'puerta-custom') {
                    calcoPuertaIzq.separator.conexionesAfter = [];
                    calcoPuertaIzq.separator.conexionesBefore = [];
                    calcoPuertaDer.separator.conexionesAfter = [];
                    calcoPuertaDer.separator.conexionesBefore = [];
                    calcoPuertaDer.separator.elementType = ElementType.puertaCustom;
                    calcoPuertaIzq.separator.elementType = ElementType.puertaCustom;
                }

                calcoPuertaIzq.AVeta = puertaInfo.sentidoVeta === ModuleLayout.Vertical ? Puerta.GetWidth(separator) : Puerta.GetHeight(separator)
                calcoPuertaIzq.LVeta = puertaInfo.sentidoVeta === ModuleLayout.Vertical ? Puerta.GetHeight(separator) : Puerta.GetWidth(separator)
                calcoPuertaIzq.separator.name = 'Puerta ' + calcoPuertaIzq.separator.id + ' I';

                // Invierto tapacantos para puerta dividida izquierda
                const tcDerecho = (calcoPuertaIzq as any).separator['puerta'].tapacantos.derecho;
                const tcIzquierdo = (calcoPuertaIzq as any).separator['puerta'].tapacantos.izquierdo;
                (calcoPuertaIzq as any).separator['puerta'].tapacantos.izquierdo = tcDerecho;
                (calcoPuertaIzq as any).separator['puerta'].tapacantos.derecho = tcIzquierdo;
                (calcoPuertaIzq as any).isCustomDoor = !separator.cube;

                calcos.push(calcoPuertaIzq)

                calcoPuertaDer.AVeta = puertaInfo.sentidoVeta === ModuleLayout.Vertical ? Puerta.GetWidth(separator) : Puerta.GetHeight(separator)
                calcoPuertaDer.LVeta = puertaInfo.sentidoVeta === ModuleLayout.Vertical ? Puerta.GetHeight(separator) : Puerta.GetWidth(separator)
                calcoPuertaDer.separator.name = 'Puerta ' + calcoPuertaDer.separator.id + ' D';
                (calcoPuertaDer as any).isCustomDoor = !separator.cube;
                calcos.push(calcoPuertaDer)
            } else {
                if (puertaInfo.elementType === 'puerta-corrediza') {
                    // puertas corredizas
                    for (let index = 0; index < (puertaInfo as PuertaCorrediza)['puertas'].length; index++) {
                        if ((puertaInfo as PuertaCorrediza)['puertas'][index].enabled) {
                            const calcoPuerta = JSON.parse(JSON.stringify(calcoInfo)) as CalcoInfo
                            // Borramos las conexiones de la puerta custom, ya que estas son en realidad las conexiones del separador que la contienen
                            calcoPuerta.separator.conexionesAfter = [];
                            calcoPuerta.separator.conexionesBefore = [];
                            (calcoPuerta.separator as any).puerta.material = calcoPuerta.material = (puertaInfo as PuertaCorrediza)['puertas'][index].material;
                            calcoPuerta.AVeta = puertaInfo.sentidoVeta === ModuleLayout.Vertical ? PuertaCorrediza.GetWidth(separator, index) : PuertaCorrediza.GetHeight(separator)
                            calcoPuerta.LVeta = puertaInfo.sentidoVeta === ModuleLayout.Vertical ? PuertaCorrediza.GetHeight(separator) : PuertaCorrediza.GetWidth(separator, index)
                            calcoPuerta.separator.name = 'Puerta ' + calcoPuerta.separator.id + ' (' + (index + 1) + ')';
                            (calcoPuerta as any).isCustomDoor = !separator.cube;
                            calcoPuerta.separator.elementType = ElementType.puertaCorrediza;
                            calcos.push(calcoPuerta);
                        }
                    }
                } else {
                    const calcoPuerta = JSON.parse(JSON.stringify(calcoInfo)) as CalcoInfo

                    // Borramos las conexiones de la puerta custom, ya que estas son en realidad las conexiones del separador que la contienen
                    if (puertaInfo.elementType === 'puerta-custom' || puertaInfo.elementType === 'puerta-corrediza') {
                        calcoPuerta.separator.conexionesAfter = [];
                        calcoPuerta.separator.conexionesBefore = [];
                    }

                    calcoPuerta.separator.elementType = 'puerta-custom';
                    calcoPuerta.AVeta = puertaInfo.sentidoVeta === ModuleLayout.Vertical ? Puerta.GetWidth(separator) : Puerta.GetHeight(separator)
                    calcoPuerta.LVeta = puertaInfo.sentidoVeta === ModuleLayout.Vertical ? Puerta.GetHeight(separator) : Puerta.GetWidth(separator)
                    calcoPuerta.separator.name = 'Puerta ' + calcoPuerta.separator.id;
                    (calcoPuerta as any).isCustomDoor = !separator.cube;
                    calcos.push(calcoPuerta)
                }
            }
        }

        if (separator.riel) {
            // rieles
            const riel = separator as any;
            let calco = new CalcoInfo();
            calco.separator = riel;
            calco.AVeta = riel.AVeta;
            calco.LVeta = riel.LVeta;
            calco.extra = 'kit: ' + (riel.material || 'Sin kit');
            calco.moduleName = separator.moduleName;
            calco.moduleDescripcion = Modulo.GetModuleByIndex(separator.moduleId - 1).settings.description;
            calco.moduleArmado = Modulo.GetModuleByIndex(separator.moduleId - 1).settings.armado;
            calco.generalName = this.getters.generalSettings('name');
            calco.generalMueble = this.getters.generalSettings('mueble');
            calco.generalComentarioInstalacion = this.getters.generalSettings('comentario');
            calcos.push(calco);
        }

        if (separator.dobleFondo) {
            const dobleFondo = separator.dobleFondo as DobleFondo
            const calcoDobleFondo = JSON.parse(JSON.stringify(calcoInfo)) as CalcoInfo
            calcoDobleFondo.separator.name = dobleFondo.name
            calcoDobleFondo.drawing = separator.dobleFondo.drawing && separator.dobleFondo.drawing.front;
            calcoDobleFondo.AVeta = DobleFondo.GetWidth(separator);
            calcoDobleFondo.LVeta = DobleFondo.GetHeight(separator);
            calcos.push(calcoDobleFondo);
        }

        if (separator.cajon) {
            const cajonGroup = Element.GetParent(separator) as any
            const cajonCount = Math.ceil(cajonGroup.childs.length / 2)
            const cajon: Cajon = Element.GetElement(cajonGroup.childs[0]) as Cajon

            // Base cajon
            let calcoCajon = JSON.parse(JSON.stringify(calcoInfo)) as CalcoInfo
            calcoCajon.AVeta = Cajon.AnchoBase(cajon)
            calcoCajon.LVeta = Cajon.LargoBase(cajon)
            // calcoCajon.separator.tapacantos = new TapacantoSetting()
            calcoCajon.separator.name = 'Base Cajon ' + calcoCajon.separator.id
            calcos.push(calcoCajon)

            // Lat Cajon
            calcoCajon = JSON.parse(JSON.stringify(calcoInfo)) as CalcoInfo
            calcoCajon.AVeta = Cajon.AnchoLateral(cajon, cajonCount)
            calcoCajon.LVeta = Cajon.LargoLateral(cajon)
            // calcoCajon.separator.tapacantos = new TapacantoSetting()
            calcoCajon.separator.name = 'Lat. Cajon ' + calcoCajon.separator.id
            calcos.push(calcoCajon)
            const lateralDer = JSON.parse(JSON.stringify(calcoCajon));
            lateralDer.separator.name += ' (2)';
            calcos.push(lateralDer);

            // C/F Cajon
            calcoCajon = JSON.parse(JSON.stringify(calcoInfo)) as CalcoInfo
            calcoCajon.AVeta = Cajon.AnchoContrafrente(cajon, cajonCount)
            calcoCajon.LVeta = Cajon.LargoContrafrente(cajon)
            // calcoCajon.separator.tapacantos = new TapacantoSetting()
            calcoCajon.separator.name = 'C/F Cajon ' + calcoCajon.separator.id
            calcos.push(calcoCajon)
            const cf2 = JSON.parse(JSON.stringify(calcoCajon));
            cf2.separator.name += ' (2)';
            calcos.push(cf2);

            // Frente Cajon
            calcoCajon = JSON.parse(JSON.stringify(calcoInfo)) as CalcoInfo
            calcoCajon.AVeta = cajon.sentidoVeta === ModuleLayout.Vertical ? Cajon.AnchoFrente(cajon) : Cajon.LargoFrente(cajon, cajonCount)
            calcoCajon.LVeta = cajon.sentidoVeta === ModuleLayout.Vertical ? Cajon.LargoFrente(cajon, cajonCount) : Cajon.AnchoFrente(cajon)
            // calcoCajon.separator.tapacantos = new TapacantoSetting()
            calcoCajon.separator.name = 'Frente Cajon ' + calcoCajon.separator.id
            calcos.push(calcoCajon)
        }

        return calcos
    }

    constructor(parent: any, size: number, position: any, modulo_id: any, virtual: boolean = false) {
        super(parent, modulo_id);
        this.size = virtual ? 0 : size;
        this.position = position;
        this.elementType = ElementType.separador;
        this.virtual = virtual;
    }
}

export class Liston extends Separator {
    public liston = true;
    public Orientacion: 1 | 2 | 3 | 4;
    public anchoListon: number;
    public espesorListon: number;
    public compound?: any = []; // listones que componen un liston mayor
    public extraAlto: number = 0; // superficie extra hacia arriba
    public extraDerecha: number = 0; // superficie extra hacia la derecha
    public extraAbajo: number = 0; // superficie extra hacia abajo
    public extraIzquierda: number = 0; // superficie extra hacia la izquierda

    constructor(parent: any, espesor: number, position: any, modulo_id: any, ancho: number, z: number, orientacion: 1 | 2 | 3 | 4, isL?: boolean) {
        super(parent, espesor, position, modulo_id, false);
        this.name = 'Liston ' + this.id;
        this.ejeZ = z;
        this.Orientacion = orientacion;
        this.anchoListon = ancho;
        this.isL = !!isL;
        switch (orientacion) {
            case 1:
            case 2:
                this.anchoVeta = ancho;
                this.espesorListon = this.diagramWidth = this.size = espesor;
                break;
            case 3:
            case 4:
                this.diagramWidth = this.size = ancho;
                this.espesorListon = this.anchoVeta = espesor;
                break;
        }
    }
}

export class SeparatorDividido extends Element {
    public separator = true
    public size: number
    public position: any
    public tapacantos = new TapacantoSetting()
    public material = MaterialEnum.None
    public anchoVeta = -1 // -1 significa que se toma la anchoVeta del módulo
    public largoVeta = -1 // -1 significa que se toma la largoVeta del módulo
    public full = false
    public separatorDivision = true
    public division = 0
    public separadorPadre: any = null
    public ejeZ = 0
    public orientacion = 'horizontal'
    public proportionDivision = 0;

    static GetLargoVeta(separadorDividido: any): number {
        return Separator.GetLargoVeta(separadorDividido.separadorPadre);
    }

    static GetAnchoVeta(separadorDividido: any): number {
        const parent = separadorDividido.separadorPadre;
        if (separadorDividido.proportionDivision) {
            const gap = Separator.GetAnchoVeta(parent) * separadorDividido.proportionDivision;
            let width = (Separator.GetAnchoVeta(parent) - gap) / 2;
            return width;
        } else {
            // en los proyectos viejos, no existe el atributo proportionDivision
            // usamos la formula vieja
            return (Separator.GetAnchoVeta(parent) - parent.division) / 2;
        }
    }

    static GetFrenteZ(separadorDividido: any): number {
        return separadorDividido.position.ejeZ
    }

    static GetOrientacion(separadorDividido: any): number {
        return separadorDividido.orientacion
    }

    constructor(parent: any, position: any, orientacion: any, modulo_id: any) {
        super(parent, modulo_id);
        this.position = position
        this.ejeZ = position.z
        this.name = 'División ' + parent.childs.length + ' ' + parent.name
        this.size = parent.size
        // Si el padre tiene tapacanto este hijo lo debe tener
        this.tapacantos = new TapacantoSetting()
        this.division = Number(parent.division)
        this.separadorPadre = parent
        this.orientacion = orientacion
        this.material = parent.material
        this.proportionDivision = ((this.division * 100) / Separator.GetAnchoVeta(parent)) / 100;
    }

}

export class ModuloExterno extends Separator {
    public moduloExterno = true
    // public size: number
    public Count: number
    public AVeta: number
    public LVeta: number
    public Base: string

    public X: number
    public Y: number
    public Z: number
    public Profundidad: number
    public Altura: number
    public Ancho: number
    public Espesor: number

    constructor(parent: any, size: number, modulo_id: any) {
        super(parent, size, 0, modulo_id)
    }

    static GetLargoVeta(moduloExterno: ModuloExterno): number {
        return moduloExterno.LVeta
    }

    static GetAnchoVeta(moduloExterno: ModuloExterno): number {
        return moduloExterno.AVeta
    }
}

export class PiezaManual extends Separator {
    public piezaManual = true
    public Count: number
    public AVeta: number
    public LVeta: number
    public Orientacion: 1 | 2 | 3 | 4;
    public only3d: boolean = false; // si la pieza solo deberia verse en el 3d
    public tipo: string = 'pieza-manual'; // tipo de la pieza manual. Ej: pieza manual, tapacantos
    public extra?: any; // informacion extra

    public X: number
    public Y: number
    public Z: number

    constructor(parent: any, size: number, modulo_id: any) {
        super(parent, size, 0, modulo_id)
    }

    static GetLargoVeta(piezaManual: PiezaManual): number {
        return piezaManual.LVeta
    }

    static GetAnchoVeta(piezaManual: PiezaManual): number {
        return piezaManual.AVeta
    }
}

export class Bandeja extends Separator {
    public bandeja = true;
    public corredera: HerrajeEnum;

    static GetLargoVeta(bandeja: Bandeja): number {
        return Element.GetWidth(bandeja) - 27
    }

    static GetAnchoVeta(bandeja: Bandeja): number {
        return Modulo.GetModuloModuleByIndex(bandeja.moduleId - 1).z;
    }

    constructor(parent: any, size: number, position: any, modulo_id: any) {
        super(parent, size, position, modulo_id)
    }
}

export class Barral extends Separator {
    public barral = true
    public prof2 = 250;

    static GetLargoVeta(barral: Barral): number {
        return Element.GetWidth(barral) - 5
    }

    static GetAnchoVeta(barral: Barral): number {
        return 12
    }

    constructor(parent: any, size: number, position: any, modulo_id: any) {
        super(parent, size, position, modulo_id)
        this.elementType = ElementType.barral
    }
}

export class Cajon extends Element {
    public cajon = true;
    public frenteMaterial: MaterialEnum = MaterialEnum.None
    public frenteEncastre = CajonTipo.Encastrado
    public profundidad = 50
    public corredera: HerrajeEnum
    public material: MaterialEnum
    public fondoMaterial: MaterialEnum
    public fondoEncastre = CajonTipo.Encastrado
    public altura: number
    public aperturaSistema: HerrajeEnum
    public aperturaUbicacion = CajonAperturaUbicacion.Centro
    public sentidoVeta = ModuleLayout.Horizontal
    public luz = 3
    public extraAlto = 0 // area extra hacia arriba en el frente
    public extraDerecha = 0 // area extra a la derecha en el frente
    public extraAbajo = 0 // area extra hacia abajo en el frente
    public extraIzquierda = 0 // area extra a la izquierda en el frente
    public extraAltoLatYCF = -60 // extra alto laterales y contra frente

    public tapacantos = new TapacantoSetting()

    /**
     * Oculta a un cajon asi como tambien a sus piezas tapacantos
     * @param element cajon
     * @param payload true/false
     */
    static setCajonVisibility(element: any, isVisible: boolean) {
        const visibilityFn = (name: string, elements: any) => {
            const index = elements.findIndex((ele: any) => ele.name === name);
            if (index > -1) {
                const elem = { ...elements[index] };
                elem.visible = isVisible
                elements.splice(index, 1, elem);
            }
        }

        const elements = Modulo.Selected().elements;
        const childIndex = Modulo.SelectedIndex();
        element.visible = isVisible;
        elements.splice(childIndex, 1, element);

        Cajon.GetCajonesInGroup(element).forEach((cajon) => {
            ['superior', 'inferior', 'derecho', 'izquierdo'].forEach((ubicacion: any) => {
                const name = 'tapacanto ' + ubicacion + ' Cajon ' + cajon.id;
                visibilityFn(name, elements);
            });
        });
    }

    /**
     * Crea piezas manuales que representan los tapacantos del cajon
     * @param cajon cajon
     * @param tapacantos tapacantos
     */
    static AgregarPiezasTapacantos(cajon: Cajon, tapacantos: any) {
        const modulo = Modulo.GetModuloModuleByIndex(cajon.moduleId - 1);
        const oldTapacantos = cajon.tapacantos as any;

        // eliminamos piezas viejas
        Cajon.EliminarPiezasTapacantos(cajon);

        (Object as any).keys(tapacantos).forEach((ntc: any) => {
            const tapacanto = tapacantos[ntc];
            const cajonIndexInGroup = Cajon.GetCajonIndexInCajonGroup(cajon);
            const cajonCount = Cajon.GetCajonCountInCajonGroup(Cajon.GetCajonGroup(cajon));
            if (+tapacanto.espesor > 0) {
                const pieza = new PiezaManual(null, +tapacanto.alto, modulo);
                pieza.name = 'tapacanto ' + ntc + ' Cajon ' + cajon.id;
                pieza.only3d = true;
                pieza.material = tapacanto.nombre;
                pieza.Count = 1;
                pieza.LVeta = Cajon.AnchoFrente(cajon);
                pieza.AVeta = +tapacanto.espesor;
                pieza.Orientacion = 3;
                pieza.tipo = 'tapacanto-manual';
                pieza.extra = { related: cajon.id };

                const desplazamientoLuz = cajon.luz - (cajon.luz - ((cajon.luz / cajonCount) * (cajonIndexInGroup + 1)));


                // EJE Z
                const anchoVetaPadre = Separator.GetAnchoVeta(Element.GetParent(cajon) as Separator)
                pieza.Z = 0;
                if (cajon.frenteEncastre === CajonTipo.Superpuesto) {
                    pieza.Z = anchoVetaPadre + 2
                    if (cajonIndexInGroup === 0) {
                        pieza.Z += 1
                    }
                } else {
                    pieza.Z = anchoVetaPadre - 18 - modulo.settings.RetrasoFrontalFrente
                }

                // EJE X
                pieza.X = 0;
                if (cajon.frenteEncastre === CajonTipo.Superpuesto) {
                    pieza.X = Element.GetX(Element.GetParent(cajon)) - modulo.settings.SuperpuestoGlobalLateral
                } else {
                    pieza.X = Element.GetX(Element.GetParent(cajon)) + modulo.settings.HolguraLateralFrentesCajon
                }

                if (ntc === 'superior') {
                    pieza.LVeta += +oldTapacantos.derecho.espesor + +oldTapacantos.izquierdo.espesor;

                    if (cajon.frenteEncastre === CajonTipo.Superpuesto) {
                        pieza.Y = Element.GetY(Element.GetParent(cajon)) + (cajonIndexInGroup + 1) * Cajon.LargoFrente(cajon, cajonCount) + +oldTapacantos.inferior.espesor - modulo.settings.SuperpuestoGlobalAltura;
                        if (cajonIndexInGroup > 0) {
                            pieza.Y += (cajon.luz + +oldTapacantos.inferior.espesor) * cajonIndexInGroup + +oldTapacantos.superior.espesor * cajonIndexInGroup;
                        }
                    } else {
                        pieza.Y = Element.GetY(Element.GetParent(cajon)) + (cajonIndexInGroup + 1) * Cajon.LargoFrente(cajon, cajonCount) + +oldTapacantos.inferior.espesor + cajonIndexInGroup * (+oldTapacantos.inferior.espesor + +oldTapacantos.superior.espesor) + (cajon.luz * (cajonIndexInGroup + 1));
                    }
                }

                if (ntc === 'inferior') {
                    pieza.LVeta += +oldTapacantos.derecho.espesor + +oldTapacantos.izquierdo.espesor;

                    if (cajon.frenteEncastre === CajonTipo.Superpuesto) {
                        pieza.Y = Element.GetY(Element.GetParent(cajon)) + cajonIndexInGroup * Cajon.LargoFrente(cajon, cajonCount) - modulo.settings.SuperpuestoGlobalAltura;
                        if (cajonIndexInGroup > 0) {
                            pieza.Y += (cajon.luz + oldTapacantos.inferior.espesor) * cajonIndexInGroup + +oldTapacantos.superior.espesor * (cajonIndexInGroup);
                        }
                    } else {
                        pieza.Y = Element.GetY(Element.GetParent(cajon)) + cajonIndexInGroup * Cajon.LargoFrente(cajon, cajonCount) + cajonIndexInGroup * (+oldTapacantos.inferior.espesor + +oldTapacantos.superior.espesor) + (cajon.luz * (cajonIndexInGroup + 1));
                    }
                }

                if (ntc === 'derecho') {
                    pieza.X += pieza.LVeta + +oldTapacantos.izquierdo.espesor;
                    pieza.Orientacion = 4;
                    pieza.LVeta = Cajon.LargoFrente(cajon, cajonCount);

                    if (cajon.frenteEncastre === CajonTipo.Superpuesto) {
                        pieza.Y = Element.GetY(Element.GetParent(cajon)) + +oldTapacantos.inferior.espesor + cajonIndexInGroup * Cajon.LargoFrente(cajon, cajonCount) + cajonIndexInGroup * (+oldTapacantos.inferior.espesor + +oldTapacantos.superior.espesor) - modulo.settings.SuperpuestoGlobalAltura;
                        if (cajonIndexInGroup > 0) {
                            pieza.Y += cajon.luz * cajonIndexInGroup
                        }
                    } else {
                        pieza.Y = Element.GetY(Element.GetParent(cajon)) + +oldTapacantos.inferior.espesor + cajonIndexInGroup * Cajon.LargoFrente(cajon, cajonCount) + cajonIndexInGroup * (+oldTapacantos.inferior.espesor + +oldTapacantos.superior.espesor) + (cajon.luz * (cajonIndexInGroup + 1));
                    }

                }

                if (ntc === 'izquierdo') {
                    pieza.Orientacion = 4;
                    pieza.LVeta = Cajon.LargoFrente(cajon, cajonCount);

                    if (cajon.frenteEncastre === CajonTipo.Superpuesto) {
                        pieza.Y = Element.GetY(Element.GetParent(cajon)) + +oldTapacantos.inferior.espesor + cajonIndexInGroup * Cajon.LargoFrente(cajon, cajonCount) + cajonIndexInGroup * (+oldTapacantos.inferior.espesor + +oldTapacantos.superior.espesor) - modulo.settings.SuperpuestoGlobalAltura;

                        if (cajonIndexInGroup > 0) {
                            pieza.Y += cajon.luz * cajonIndexInGroup;
                        }
                    } else {
                        pieza.Y = Element.GetY(Element.GetParent(cajon)) + +oldTapacantos.inferior.espesor + cajonIndexInGroup * Cajon.LargoFrente(cajon, cajonCount) + cajonIndexInGroup * (+oldTapacantos.inferior.espesor + +oldTapacantos.superior.espesor) + (cajon.luz * (cajonIndexInGroup + 1));
                    }
                }

                pieza.Y -= cajon.extraAbajo;
                pieza.X -= cajon.extraIzquierda;
            }
        });
    }

    /**
     * Borra las piezas manuales que representan los tapacantos del cajon
     * @param cajon cajon
     */
    static EliminarPiezasTapacantos(cajon: Cajon) {
        const elements = Modulo.Selected().elements as any;
        ['superior', 'inferior', 'derecho', 'izquierdo'].forEach((ubicacion: any) => {
            const index = elements.findIndex((ele: any) => ele.name === 'tapacanto ' + ubicacion + ' Cajon ' + cajon.id);
            if (index > -1) {
                elements.splice(index, 1);
            }
        });
    }

    /**
     * Devuelve el grupo de cajones al que pertenece un cajon
     * @param cajon cajon
     */
    static GetCajonGroup(cajon: Cajon): Cube {
        const cajonGroups: Cube[] = Modulo.Selected().elements.filter((element: any) => element.cajonGroup) as Cube[]
        const group = cajonGroups.filter((cajonGroup: Cube) => cajonGroup.childs.findIndex((id: any) => id === cajon.id) > -1)

        return group.length ? group[0] : null;
    }

    /**
     * Devuelve los cajones de un grupo de cajones
     * @param cajonOrCajonGroup cajon o grupo de cajones
     */
    static GetCajonesInGroup(cajonOrCajonGroup: any): Cajon[] {
        let cajonGroup;
        let cajones = [] as any;
        if (cajonOrCajonGroup.cajon) {
            cajonGroup = Cajon.GetCajonGroup(cajonOrCajonGroup);
        } else if (cajonOrCajonGroup.cube) {
            cajonGroup = cajonOrCajonGroup;
        } else {
            return [];
        }

        cajonGroup.childs.forEach((id: number) => {
            const el = Element.GetElement(id) as any;
            if (el && el.cajon) {
                cajones.push(el);
            }
        })

        return cajones;
    }

    /**
     * Devuelve el indice de un cajon dentro del grupo de cajone
     * @param cajon cajon
     */
    static GetCajonIndexInCajonGroup(cajon: Cajon): number {
        const group = this.GetCajonGroup(cajon);
        if (group && group.childs) {
            let cajones: any = [];
            group.childs.forEach((id: any) => {
                let element = Element.GetElement(id) as any;
                if (element.cajon) {
                    cajones.push(element);
                }
            });
            return cajones.findIndex((c: any) => c.id === cajon.id);
        }

        return -1;
    }

    /**
     * Devuelve la cantidad de cajones en un grupo
     * @param cajonGroup grupo de cajones
     */
    static GetCajonCountInCajonGroup(cajonGroup: Cube): number {
        let count = 0;
        if (cajonGroup && cajonGroup.childs) {
            cajonGroup.childs.forEach((id: any) => {
                count += (Element.GetElement(id) as any).cajon ? 1 : 0;
            });
        }
        return count;
    }

    /**
     * Devuelve el LVETA de la base de un cajón
     * Depende si es encastrado o superpuesto
     * @param cajon cajon
     */
    static LargoBase(cajon: Cajon): number {
        if (cajon.fondoEncastre === CajonTipo.Superpuesto) {
            return Element.GetWidth(cajon) - 27
        }
        let espesor = 18
        return Element.GetWidth(cajon) - 27 - (2 * espesor)
    }

    /**
     * Devuelve el AVETA de la base de un cajón
     * Depende si es encastrado o superpuesto
     * @param cajon cajon
     */
    static AnchoBase(cajon: Cajon): number {
        if (cajon.fondoEncastre === CajonTipo.Superpuesto) {
            return cajon.profundidad
        }
        let espesor = 18
        return cajon.profundidad - (2 * espesor)
    }

    /**
     * Devuelve el LVETA de un lateral de un cajón
     * @param cajon cajon
     */
    static LargoLateral(cajon: Cajon): number {
        return cajon.profundidad
    }

    /**
     * Devuelve el AVETA de un lateral de un cajón
     * @param cajon cajon
     * @param n cantidad de cajones en el grupo
     */
    static AnchoLateral(cajon: Cajon, n: number): number {
        const extra = cajon.extraAltoLatYCF || 0;
        return Cajon.LargoFrente(cajon, n) + Cajon.GetEspesorTapacanto(cajon, 1) + Cajon.GetEspesorTapacanto(cajon, 3) + extra;
    }

    /**
     * Devuelve el LVETA de un contra frente de un cajón
     * @param cajon cajon
     */
    static LargoContrafrente(cajon: Cajon): number {
        let espesor = 18
        return Element.GetWidth(cajon) - 27 - (2 * espesor)
    }

    /**
     * Devuelve el AVETA de un contra frente de un cajón
     * @param cajon cajon
     * @param n cantidad de cajones en el grupo
     */
    static AnchoContrafrente(cajon: Cajon, n: number): number {
        const extra = cajon.extraAltoLatYCF || 0;
        return Cajon.LargoFrente(cajon, n) + Cajon.GetEspesorTapacanto(cajon, 1) + Cajon.GetEspesorTapacanto(cajon, 3) + extra;
    }

    /**
     * Devuelve el LVETA de un frente de un cajón.
     * Depende si es superpuesto o encastrado
     * @param cajon cajon
     * @param n cantidad de cajones en el grupo
     */
    static LargoFrente(cajon: Cajon, n: number): number {
        const modulo = Modulo.GetModuloModuleByIndex(cajon.moduleId - 1);
        const virtualAbove = Element.GetTop(Element.GetParent(cajon)).virtual;
        const superpuestoGlobalAltura = modulo.settings.SuperpuestoGlobalAltura;
        const offsetTapacanto = Cajon.GetEspesorTapacanto(cajon, 1) + Cajon.GetEspesorTapacanto(cajon, 3);
        if (cajon.frenteEncastre === CajonTipo.Superpuesto) {
            const parentHeight = virtualAbove ? Element.GetHeight(Element.GetParent(cajon)) - (cajon.luz + 2 * superpuestoGlobalAltura) : Element.GetHeight(Element.GetParent(cajon)) - cajon.luz
            return (cajon.extraAlto + cajon.extraAbajo - (offsetTapacanto * n) + (parentHeight + superpuestoGlobalAltura * 2 - (n - 1) * cajon.luz)) / n;
        }
        let offset = virtualAbove ? cajon.luz : 0;
        offset += cajon.extraAlto + cajon.extraAbajo;
        return (offset - (offsetTapacanto * n) + (Element.GetHeight(Element.GetParent(cajon)) - (n + 1) * cajon.luz)) / n;
    }

    /**
     * Devuelve el LVETA de un frente de cajon
     * Depende si es superpuesto o encastrado
     * @param cajon cajon
     */
    static Ancho2Frente(cajon: Cajon): number {
        const offsetTapacanto = Cajon.GetEspesorTapacanto(cajon, 2) + Cajon.GetEspesorTapacanto(cajon, 4);
        const modulo = Modulo.GetModuloModuleByIndex(cajon.moduleId - 1);
        if (cajon.frenteEncastre === CajonTipo.Superpuesto) {
            return Element.GetWidth(cajon) + cajon.extraDerecha + cajon.extraIzquierda - offsetTapacanto + modulo.settings.SuperpuestoGlobalLateral * 2
        }
        return Element.GetWidth(cajon) + cajon.extraDerecha + cajon.extraIzquierda - offsetTapacanto - modulo.settings.HolguraLateralFrentesCajon * 2
    }

    /**
     * Devuelve el LVETA de un frente de cajon
     * Depende si es superpuesto o encastrado
     * @param cajon cajon
     */
    static AnchoFrente(cajon: Cajon): number {
        return Cajon.Ancho2Frente(cajon)
    }

    /**
     * Devuelve la orientacion de un cajon.
     * Retorna 3 si es horizontal o 4 si es vertical
     * @param cajon cajon
     */
    static GetOrientacion(cajon: Cajon): number {
        return cajon.sentidoVeta === ModuleLayout.Horizontal ? 3 : 4
    }

    static getFrenteZ(cajon: Cajon): number {
        const index = this.GetCajonIndexInCajonGroup(cajon);
        const modulo = Modulo.GetModuloModuleByIndex(cajon.moduleId - 1);
        const anchoVetaPadre = Separator.GetAnchoVeta(Element.GetParent(cajon) as Separator);
        let z = 0;
        if (cajon.frenteEncastre === CajonTipo.Superpuesto) {
            z = anchoVetaPadre + 2;
            if (index != 0) {
                z += 1;
            }
        } else {
            z = anchoVetaPadre - 18 - modulo.settings.RetrasoFrontalFrente;
        }

        return Number(z);
    }

    public constructor(parent: any, modulo_id: any) {
        super(parent, modulo_id);
    }
}

export class ModuleConfiguration {
    public width: number
    public height: number
    public z: number
    public mainLayout: ModuleLayout
    public material: string
    public tapacantos: any
}

export class ModuleSettings {
    EspesorGeneral = 18
    EspesorBarral = 34
    EspesorCajones = 18
    DesplazamientoFrentalCajon = 14
    RetrasoFrontalFrente = 10
    RetrasoFrontalEstante = 0
    HolguraEntreFrentes = 3
    HolguraLateralFrentesCajon = 3
    SuperpuestoGlobalLateral = 7
    SuperpuestoGlobalAltura = 9
    ProfundidadMarco = 100
    AnchoListonesPisosTechos = 100
    TechoMarco = 120
    TechoCajoneras = 60
    Perfil35 = 35
    Espacio25 = 25
    Corte45Grados = 22
    MargenLateral = 40
    MargenVertical = 40
    description = ''
    comentario = ''
    armado = ''
    Tarugo = 45;
    Pituto = 40;
    Minfix = 45;
    Tornillo = 50;
}

export class GeneralConfiguration {
    color1 = localStorage.getItem('material_default') ? JSON.parse(localStorage.getItem('material_default') || '{}') : MaterialEnum.BlancoMDF
    color2 = MaterialEnum.None
    color3 = MaterialEnum.None
    fondo1 = localStorage.getItem('fondo_default') ? JSON.parse(localStorage.getItem('fondo_default') || '{}') : MaterialEnum.BlancoFibro3mm
    fondo2 = MaterialEnum.None
    metal1 = MaterialEnum.Perfil2045
    metal2 = MaterialEnum.None
    metal3 = MaterialEnum.None
    metal4 = MaterialEnum.None
    herraje1 = HerrajeEnum.None
    herraje2 = HerrajeEnum.None
    herraje3 = HerrajeEnum.None
    herraje4 = HerrajeEnum.None
    herraje5 = HerrajeEnum.None
    herraje6 = HerrajeEnum.None
    herraje7 = HerrajeEnum.None
    herraje8 = HerrajeEnum.None
    tapacantoGeneral = TapacantoEnum.Melamina
    tapacantoFrente = TapacantoEnum.Melamina
    materiales_add = MaterialEnum.None
    material_default = MaterialEnum.None
    material_default_grupo = MaterialEnum.None
    material_default_por_modulo: any[] = []
    material_default_por_modulo_grupo: any[] = []
    material_default_por_modulo_room_editor: any[] = []
    tapacantos_default_por_modulo: any[] = []
    tapacantos_default_por_modulo_room_editor: any[] = []
    tapacantos_add = MaterialEnum.None
    tapacantos_default = MaterialEnum.None
    herrajes_add = MaterialEnum.None
    herrajes_default = MaterialEnum.None
    metales_add = MaterialEnum.None
    metal_default = MaterialEnum.None
    classicMultiplier = 1.5;
    premiumMultiplier = 2.5;
    autoUpdateMsg = true; // actualizar mensaje de contacto cuando se modifica la informacion en listado materiales
    presupuestosConfig = {
        waste: 10 // porcentaje de desperdicio en una placa de material
    };
}

export class Part {
    Count: number
    Name: string
    Module: string
    Espesor: number
    LVeta: number
    AVeta: number
    tapacantos = new TapacantoSetting()
    Material: string
    Orientacion: any
    X: number
    Y: number
    Z: number
    Comentario?: string
    Profundidad?: number
    Altura?: number
    Ancho?: number
    _Id?: number
    Visible?: boolean
    Exportable?: boolean = true
    ElementType?: string
    ExtraAncho?: number = 0 // deprecado: usado para fondos
    ExtraAlto?: number = 0; // superficie extra hacia arriba
    ExtraDerecha?: number = 0; // superficie extra hacia la derecha
    ExtraAbajo?: number = 0; // superficie extra hacia abajo
    ExtraIzquierda?: number = 0; // superficie extra hacia la izquierda
    Only3d?: boolean = false
    DisplayLVeta?: number
    DisplayAVeta?: number
    IsL?: boolean
    girarVeta?: boolean
}
export class ModelLineaPremium {
    Id:string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
    });
    Name:string = "";
    Activo: boolean = false;
    Multiplier = 2.5;
    AlternativeMaterialList: object = {};
}

export class Puerta {
    name = ''
    material: string = undefined
    tipo = PuertaTipo.Dividida
    encastre = CajonTipo.Encastrado
    aperturaUbicacion = CajonAperturaUbicacion.InferiorCentro
    bisagraUbicacion = UbicacionBisagra.Derecha
    bisagraTipo: string = undefined;
    cantidadBisagras: number = 2;
    posicionBisagrasDerecha: number[] = []; // posicion de las bisagras en la puerta derecha. Si la bisagra esta en el eje X, es posicion en mm desde la izquierda a la derecha. Si esta en el eje y, es de abajo hacia arriba
    posicionBisagrasIzquierda: number[] = []; // posicion de las bisagras izquierda. Si la bisagra esta en el eje X, es posicion en mm desde la izquierda a la derecha. Si esta en el eje y, es de abajo hacia arriba
    orientationManija = ModuleLayout.Horizontal
    sentidoVeta = ModuleLayout.Horizontal
    aperturaSistema = AperturaSistema.Manija
    size: number
    tapacantos = new TapacantoSetting()
    elementType = ElementType.puerta
    sides: any = []
    visible: boolean = true
    extraAlto: number = 0; // superficie extra hacia arriba
    extraDerecha: number = 0; // superficie extra hacia la derecha
    extraAbajo: number = 0; // superficie extra hacia abajo
    extraIzquierda: number = 0; // superficie extra hacia la izquierda
    comentario: string = '' // solo para puertas custom
    corrediza: boolean = false // la puerta es una puerta corrediza

    /**
     * Crea piezas manuales que representan los tapacantos de la puerta.
     * Utilizar solo en puertas normales.
     * @param puerta puerta
     * @param tapacantos tapacantos
     */
    static AgregarPiezasTapacantosPuertaCubo(cubo: Element, tapacantos: any) {
        const modulo = Modulo.GetModuloModuleByIndex(cubo.moduleId - 1);
        const puerta = (cubo as any).puerta;
        const oldTapacantos = puerta.tapacantos as any;

        (Object as any).keys(tapacantos).forEach((ntc: any) => {
            const tapacanto = tapacantos[ntc];

            if (+tapacanto.espesor > 0) {
                const pieza = new PiezaManual(null, +tapacanto.alto, modulo);
                pieza.tipo = 'tapacanto-manual';
                pieza.name = 'tapacanto ' + ntc + ' Puerta ' + cubo.id;
                pieza.only3d = true;
                pieza.material = tapacanto.nombre;
                pieza.Count = 1;
                pieza.LVeta = Puerta.GetWidth(cubo) + +oldTapacantos.derecho.espesor + +oldTapacantos.izquierdo.espesor;
                pieza.extra = { related: cubo.id };

                pieza.AVeta = +tapacanto.espesor;
                pieza.Orientacion = 3;
                // // EJE Z
                pieza.Z = Puerta.GetFrenteZ(cubo);
                // EJE X
                pieza.X = Element.GetX(cubo) - puerta.extraIzquierda;

                if (ntc === 'superior') {
                    pieza.Y = Element.GetY(cubo) + Puerta.GetHeight(cubo) + +oldTapacantos.inferior.espesor;
                }

                if (ntc === 'inferior') {
                    pieza.Y = Element.GetY(cubo);
                }

                if (ntc === 'derecho') {
                    pieza.Orientacion = 4;
                    pieza.LVeta = Puerta.GetHeight(cubo);
                    pieza.Y = +oldTapacantos.inferior.espesor + Element.GetY(cubo);
                    pieza.X += Puerta.GetWidth(cubo) + +oldTapacantos.izquierdo.espesor;
                }

                if (ntc === 'izquierdo') {
                    pieza.Orientacion = 4;
                    pieza.LVeta = Puerta.GetHeight(cubo);
                    pieza.Y = +oldTapacantos.inferior.espesor + Element.GetY(cubo);
                }

                if (puerta.encastre === CajonTipo.Superpuesto) {
                    pieza.Y -= modulo.settings.SuperpuestoGlobalAltura;
                    pieza.X -= modulo.settings.SuperpuestoGlobalLateral;
                }

                pieza.Y -= puerta.extraAbajo;

                if (puerta.tipo === PuertaTipo.Dividida) {
                    const piezaD = new PiezaManual(null, +tapacanto.alto, modulo);
                    (Object as any).assign(piezaD, {
                        name: pieza.name + ' (alt)',
                        only3d: true,
                        Count: 1,
                        material: pieza.material,
                        X: pieza.X,
                        Y: pieza.Y,
                        Z: pieza.Z,
                        LVeta: pieza.LVeta,
                        AVeta: pieza.AVeta,
                        tipo: pieza.tipo,
                        extra: pieza.extra,
                        Orientacion: pieza.Orientacion
                    });

                    if (ntc === 'izquierdo') {
                        piezaD.X = 1 + Element.GetX(cubo) + Puerta.GetWidth(cubo) * 2 + +oldTapacantos.izquierdo.espesor + +oldTapacantos.derecho.espesor * 2 + (modulo.settings.HolguraLateralFrentesCajon * 3);
                    }

                    if (ntc === 'derecho') {
                        piezaD.X = Element.GetX(cubo) + Puerta.GetWidth(cubo) + +oldTapacantos.izquierdo.espesor + +oldTapacantos.derecho.espesor + (modulo.settings.HolguraLateralFrentesCajon * 3);
                    }

                    if (ntc === 'superior' || ntc === 'inferior') {
                        piezaD.X = Element.GetX(cubo) + Puerta.GetWidth(cubo) + (modulo.settings.HolguraLateralFrentesCajon * 3) + oldTapacantos.derecho.espesor + +oldTapacantos.izquierdo.espesor;
                    }

                    if (puerta.encastre === CajonTipo.Superpuesto) {
                        piezaD.X -= modulo.settings.SuperpuestoGlobalLateral;
                    }

                    piezaD.X -= puerta.extraIzquierda;
                }
            }
        });
    }

    /**
     * Crea piezas manuales que representan los tapacantos de la puerta.
     * Utilizar solo en puertas custom (antes puertas beta).
     * @param puerta puerta
     * @param tapacantos tapacantos
     */
    static AgregarPiezasTapacantosPuertaCustom(separador: Separator, tapacantos: any) {
        const modulo = Modulo.GetModuloModuleByIndex(separador.moduleId - 1);
        const puerta = (separador as any).puerta;
        const oldTapacantos = tapacantos as any;
        const bottomSide = Puerta.getBottomMostSide(separador);
        const upperSide = Puerta.getUpperMostSide(separador);
        const leftSide = Puerta.getLeftMostSide(separador);
        const rightSideId = (Object as any).values(puerta.sides).filter((id: any) => id !== leftSide.id && id !== upperSide.id && id !== bottomSide.id)[0];
        const rightSide = Element.GetElement(rightSideId) as Separator;

        (Object as any).keys(tapacantos).forEach((ntc: any) => {
            const tapacanto = tapacantos[ntc];

            if (+tapacanto.espesor > 0) {
                const pieza = new PiezaManual(null, +tapacanto.alto, modulo);
                pieza.name = 'tapacanto ' + ntc + ' Puerta ' + separador.id;
                pieza.only3d = true;
                pieza.tipo = 'tapacanto-manual';
                pieza.material = tapacanto.nombre;
                pieza.Count = 1;
                pieza.LVeta = Puerta.GetWidth(separador) + +oldTapacantos.derecho.espesor + +oldTapacantos.izquierdo.espesor;
                pieza.extra = { related: separador.id };

                pieza.AVeta = +tapacanto.espesor;
                pieza.Orientacion = 3;
                // // EJE Z
                if (puerta.encastre === CajonTipo.Superpuesto) {
                    pieza.Z = modulo.z;
                } else {
                    pieza.Z = modulo.z - puerta.size - modulo.settings.RetrasoFrontalFrente;
                }
                // EJE X
                pieza.X = Element.GetX(leftSide) + leftSide.size;

                if (ntc === 'superior') {
                    pieza.Y = Element.GetY(upperSide) - +oldTapacantos.superior.espesor - 6;

                    if (puerta.encastre === CajonTipo.Superpuesto) {
                        pieza.Y += modulo.settings.SuperpuestoGlobalAltura + 6;
                    }

                    pieza.Y += puerta.extraAlto;
                }

                if (ntc === 'inferior') {
                    pieza.Y = Element.GetY(bottomSide) + bottomSide.size;

                    if (puerta.encastre === CajonTipo.Superpuesto) {
                        pieza.Y -= modulo.settings.SuperpuestoGlobalAltura;
                    }

                    pieza.Y -= puerta.extraAbajo;
                }

                if (ntc === 'derecho') {
                    pieza.Orientacion = 4;
                    pieza.LVeta = Puerta.GetHeight(separador);
                    pieza.Y = Element.GetY(upperSide) - +oldTapacantos.superior.espesor - 6 - Puerta.GetHeight(separador);
                    pieza.X += Puerta.GetWidth(separador) + +oldTapacantos.izquierdo.espesor;

                    if (puerta.encastre === CajonTipo.Superpuesto) {
                        pieza.Y += modulo.settings.SuperpuestoGlobalAltura + 6;
                    }

                    pieza.Y += puerta.extraAlto;
                }

                if (ntc === 'izquierdo') {
                    pieza.Orientacion = 4;
                    pieza.LVeta = Puerta.GetHeight(separador);
                    pieza.Y = Element.GetY(upperSide) - +oldTapacantos.superior.espesor - 6 - Puerta.GetHeight(separador);

                    if (puerta.encastre === CajonTipo.Superpuesto) {
                        pieza.Y += modulo.settings.SuperpuestoGlobalAltura + 6;
                    }

                    pieza.Y += puerta.extraAlto;
                }

                if (puerta.encastre === CajonTipo.Superpuesto) {
                    pieza.X -= modulo.settings.SuperpuestoGlobalLateral;
                }

                pieza.X -= puerta.extraIzquierda;

                if (puerta.tipo === PuertaTipo.Dividida) {
                    const piezaD = new PiezaManual(null, +tapacanto.alto, modulo);
                    (Object as any).assign(piezaD, {
                        name: pieza.name + ' (alt)',
                        only3d: true,
                        Count: 1,
                        material: pieza.material,
                        X: pieza.X,
                        Y: pieza.Y,
                        Z: pieza.Z,
                        tipo: pieza.tipo,
                        extra: pieza.extra,
                        LVeta: pieza.LVeta,
                        AVeta: pieza.AVeta,
                        Orientacion: pieza.Orientacion
                    });

                    if (ntc === 'izquierdo') {
                        piezaD.X = 1 + Element.GetX(leftSide) + leftSide.size + Puerta.GetWidth(separador) * 2 + +oldTapacantos.izquierdo.espesor + +oldTapacantos.derecho.espesor * 2 + (modulo.settings.HolguraLateralFrentesCajon * 3);
                    }

                    if (ntc === 'derecho') {
                        piezaD.X = Element.GetX(leftSide) + leftSide.size + Puerta.GetWidth(separador) + +oldTapacantos.izquierdo.espesor + +oldTapacantos.derecho.espesor + (modulo.settings.HolguraLateralFrentesCajon * 3);
                    }

                    if (ntc === 'superior' || ntc === 'inferior') {
                        piezaD.X = Element.GetX(leftSide) + leftSide.size + Puerta.GetWidth(separador) + (modulo.settings.HolguraLateralFrentesCajon * 3) + oldTapacantos.derecho.espesor + +oldTapacantos.izquierdo.espesor;
                    }

                    if (puerta.encastre === CajonTipo.Superpuesto) {
                        piezaD.X -= modulo.settings.SuperpuestoGlobalLateral;
                    }

                    piezaD.X -= puerta.extraIzquierda;
                }
            }
        });
    }

    /**
     * Crea piezas manuales que representan los tapacantos de la puerta.
     * Utilizar en cualquier tipo de puertas.
     * @param puerta puerta
     * @param tapacantos tapacantos
     */
    static AgregarPiezasTapacantos(element: Element, tapacantos: any) {
        const puerta = (element as any).puerta;

        Puerta.EliminarPiezasTapacantos(element);

        if (puerta.elementType === 'puerta') {
            Puerta.AgregarPiezasTapacantosPuertaCubo(element, tapacantos)
        }

        if (puerta.elementType === 'puerta-custom') {
            Puerta.AgregarPiezasTapacantosPuertaCustom(element as Separator, tapacantos)
        }
    }

    /**
     * Borra las piezas manuales que representan los tapacantos de la puerta
     * @param cubo hueco donde se encuentra la puerta
     */
    static EliminarPiezasTapacantos(cubo: Element) {
        const deleteFn = (name: string) => {
            const elements = Modulo.Selected().elements as any;
            const index = elements.findIndex((ele: any) => ele.name === name);
            if (index > -1) {
                elements.splice(index, 1);
            }
        }

        ['superior', 'inferior', 'derecho', 'izquierdo'].forEach((ubicacion: any) => {
            const name = 'tapacanto ' + ubicacion + ' Puerta ' + cubo.id;
            deleteFn(name);
            const altName = 'tapacanto ' + ubicacion + ' Puerta ' + cubo.id + ' (alt)';
            deleteFn(altName);
        });
    }

    /**
     * Oculta una puerta en el 3d asi como a sus piezas tapacantos
     * @param element el elemento que contiene a la puerta
     * @param isVisible true/false
     */
    static setDoorVisibility(element: any, isVisible: boolean) {
        const visibilityFn = (name: string, elements: any) => {
            const index = elements.findIndex((ele: any) => ele.name === name);
            if (index > -1) {
                const elem = { ...elements[index] };
                elem.visible = isVisible
                elements.splice(index, 1, elem);
            }
        }

        const elements = Modulo.Selected().elements;
        const childIndex = Modulo.SelectedIndex();
        element.puerta.visible = isVisible;
        elements.splice(childIndex, 1, element);

        ['superior', 'inferior', 'derecho', 'izquierdo'].forEach((ubicacion: any) => {
            const name = 'tapacanto ' + ubicacion + ' Puerta ' + element.id;
            visibilityFn(name, elements);
            const altName = 'tapacanto ' + ubicacion + ' Puerta ' + element.id + ' (alt)';
            visibilityFn(altName, elements);
        });
    }

    // En puertas manuales y corredizas, devuelve el lado mas izquierdo
    static getLeftMostSide(separador: Element): any {
        const puerta = (separador as any).puerta as Puerta;
        if ((puerta.elementType === ElementType.puertaCustom) || (puerta.elementType === ElementType.puertaCorrediza)) {
            const side1 = Separator.GetOrientacion(separador as Separator) === 1 ? Element.GetElement(puerta.sides.side3) : Element.GetElement(puerta.sides.side1);
            const side2 = Separator.GetOrientacion(separador as Separator) === 1 ? Element.GetElement(puerta.sides.side4) : Element.GetElement(puerta.sides.side2);
            return Element.GetX(side1) < Element.GetX(side2) ? side1 : side2;
        }
    }

    // En puertas manuales y corredizas, devuelve el lado mas arriba
    static getUpperMostSide(separador: Element): any {
        const puerta = (separador as any).puerta as Puerta;
        if ((puerta.elementType === ElementType.puertaCustom) || (puerta.elementType === ElementType.puertaCorrediza)) {
            const side1 = Separator.GetOrientacion(separador as Separator) === 2 ? Element.GetElement(puerta.sides.side3) : Element.GetElement(puerta.sides.side1);
            const side2 = Separator.GetOrientacion(separador as Separator) === 2 ? Element.GetElement(puerta.sides.side4) : Element.GetElement(puerta.sides.side2);
            return Element.GetY(side1) > Element.GetY(side2) ? side1 : side2;
        }
    }

    // En puertas manuales y corredizas, devuelve el lado mas abajo
    static getBottomMostSide(separador: Element): any {
        const puerta = (separador as any).puerta as Puerta;
        if ((puerta.elementType === ElementType.puertaCustom) || (puerta.elementType === ElementType.puertaCorrediza)) {
            const side1 = Separator.GetOrientacion(separador as Separator) === 2 ? Element.GetElement(puerta.sides.side3) : Element.GetElement(puerta.sides.side1);
            const side2 = Separator.GetOrientacion(separador as Separator) === 2 ? Element.GetElement(puerta.sides.side4) : Element.GetElement(puerta.sides.side2);
            return Element.GetY(side1) < Element.GetY(side2) ? side1 : side2;
        }
    }

    static UpdatePosicionBisagras(cube: Element) {
        let puerta = (cube as any).puerta as Puerta;
        let positionOffset = ((puerta.bisagraUbicacion === 'Superior') || ((puerta.bisagraUbicacion === 'Inferior'))) ? Puerta.GetWidth(cube) / (puerta.cantidadBisagras + 1) : Puerta.GetHeight(cube) / (puerta.cantidadBisagras + 1);
        let positionCount = positionOffset;
        const position = [];
        const relativePosition = Element.state.relativePosition;
        const margin = Element.state.margin;
        if (Element.state.lockBisagra) {
            return;
        }

        if (relativePosition) {

            switch (puerta.bisagraUbicacion) {
                case UbicacionBisagra.Derecha:
                case UbicacionBisagra.Izquierda:
                case UbicacionBisagra.IzquierdaDerecha:
                    const height = Puerta.GetHeight(cube);
                    // bisagra de arriba
                    margin <= height ? position.push(height - margin) : position.push(height);
                    // bisagra de abajo
                    margin < height ? position.push(margin) : position.push(height);
                    break;
                case UbicacionBisagra.Superior:
                case UbicacionBisagra.Inferior:
                    const width = Puerta.GetWidth(cube);
                    margin <= width ? position.push(width - margin) : position.push(width);
                    margin <= width ? position.push(margin) : position.push(margin);
                    break;
            }

        } else {
            for (let i = 0; i < +puerta.cantidadBisagras; i++) {
                position.push(positionCount);
                positionCount += positionOffset;
            }
        }

        puerta.posicionBisagrasDerecha = position.slice();
        puerta.posicionBisagrasIzquierda = position.slice();
    }

    static GetTapacantos(puerta: Puerta): TapacantoSetting {
        const tc = new TapacantoSetting()
        tc.derecho = puerta.tapacantos.derecho
        tc.izquierdo = puerta.tapacantos.izquierdo
        tc.inferior = puerta.tapacantos.inferior
        tc.superior = puerta.tapacantos.superior
        if (puerta.aperturaSistema === AperturaSistema.Angulo || puerta.aperturaSistema === AperturaSistema.Perfil35) {
            switch (puerta.bisagraUbicacion) {
                case UbicacionBisagra.Derecha:
                    tc.derecho = puerta.aperturaSistema as any
                    break;
                case UbicacionBisagra.Izquierda:
                    tc.izquierdo = puerta.aperturaSistema as any
                    break;
                case UbicacionBisagra.Superior:
                    tc.superior = puerta.aperturaSistema as any
                    break;
                case UbicacionBisagra.Inferior:
                    tc.inferior = puerta.aperturaSistema as any
                    break;
                case UbicacionBisagra.IzquierdaDerecha:
                    tc.izquierdo = puerta.aperturaSistema as any
                    tc.derecho = puerta.aperturaSistema as any
                    break;
            }
        }
        return tc
    }

    static GetPrecomputedWidth(cube: Element): number {
        const puerta = (cube as any).puerta as Puerta
        const modulo = Modulo.GetModuloModuleByIndex(cube.moduleId - 1);
        const settings = modulo.settings
        let width;

        if ((puerta.elementType === ElementType.puertaCustom) || (puerta.elementType === ElementType.puertaCorrediza)) {
            let side1 = Separator.GetOrientacion(cube as Separator) === 2 ? Element.GetElement(puerta.sides.side1) as any : Element.GetElement(puerta.sides.side3) as any;
            let side2 = Separator.GetOrientacion(cube as Separator) === 2 ? Element.GetElement(puerta.sides.side2) as any : Element.GetElement(puerta.sides.side4) as any;
            width = Math.abs(Element.GetX(side1) - Element.GetX(side2));
            width -= Element.GetX(side1) > Element.GetX(side2) ? side2.size : side1.size;
        } else {
            width = Element.GetWidth(cube);
        }
        width += puerta.extraDerecha + puerta.extraIzquierda;
        if (puerta.encastre === CajonTipo.Encastrado) {
            if (puerta.tipo === PuertaTipo.Entera) {
                return width - 2 * settings.HolguraLateralFrentesCajon
            } else {
                return (width - 3 * settings.HolguraLateralFrentesCajon) / 2
            }
        } else {
            if (puerta.tipo === PuertaTipo.Entera) {
                return width + 2 * settings.SuperpuestoGlobalLateral
            } else {
                return (width + 2 * settings.SuperpuestoGlobalLateral - settings.HolguraLateralFrentesCajon) / 2
            }
        }
    }

    static GetWidth(cube: Element): number {
        const modulo = Modulo.GetModuloModuleByIndex(cube.moduleId - 1);
        const puerta = (cube as any).puerta as Puerta
        const settings = modulo.settings

        let precomputed = Puerta.GetPrecomputedWidth(cube)
        precomputed -= Element.GetEspesorTapacanto(puerta, 2) + Element.GetEspesorTapacanto(puerta, 4);

        if ((puerta.aperturaUbicacion === CajonAperturaUbicacion.Izquierda ||
            puerta.aperturaUbicacion === CajonAperturaUbicacion.Derecha)) {
            if (puerta.aperturaSistema === AperturaSistema.Perfil35) {
                return precomputed - settings.Perfil35
            } else if (puerta.aperturaSistema === AperturaSistema.Espacio25) {
                return precomputed - settings.Espacio25
            }
        }
        return precomputed
    }

    static GetPrecomputedHeight(cube: Element): number {
        const modulo = Modulo.GetModuloModuleByIndex(cube.moduleId - 1);
        const puerta = (cube as any).puerta as Puerta
        const settings = modulo.settings
        let height;

        if (puerta.elementType === ElementType.puertaCustom || (puerta.elementType === ElementType.puertaCorrediza)) {
            let side3 = Separator.GetOrientacion(cube as Separator) === 2 ? Element.GetElement(puerta.sides.side3) as any : Element.GetElement(puerta.sides.side1) as any;
            let side4 = Separator.GetOrientacion(cube as Separator) === 2 ? Element.GetElement(puerta.sides.side4) as any : Element.GetElement(puerta.sides.side2) as any;
            height = Math.abs(Math.abs(Element.GetY(side3) - Element.GetY(side4)));
            height -= Element.GetY(side3) > Element.GetY(side4) ? side4.size : side3.size;
        } else {
            height = Element.GetHeight(cube);
        }
        height += puerta.extraAlto + puerta.extraAbajo;
        if (puerta.encastre === CajonTipo.Encastrado) {
            return height - 2 * settings.HolguraLateralFrentesCajon
        } else {
            return height + 2 * settings.SuperpuestoGlobalAltura
        }
    }

    static GetHeight(cube: Element): number {
        const modulo = Modulo.GetModuloModuleByIndex(cube.moduleId - 1);
        const puerta = (cube as any).puerta as Puerta
        const settings = modulo.settings

        let precomputed = Puerta.GetPrecomputedHeight(cube)
        precomputed -= Element.GetEspesorTapacanto(puerta, 1) + Element.GetEspesorTapacanto(puerta, 3);

        if ((puerta.aperturaUbicacion === CajonAperturaUbicacion.Inferior ||
            puerta.aperturaUbicacion === CajonAperturaUbicacion.Superior)) {
            if (puerta.aperturaSistema === AperturaSistema.Perfil35) {
                return precomputed - settings.Perfil35
            } else if (puerta.aperturaSistema === AperturaSistema.Espacio25) {
                return precomputed - settings.Espacio25
            }
        }

        return precomputed
    }

    static GetFrenteZ(cube: Element): number {
        const puerta = (cube as any).puerta;
        const modulo = Modulo.GetModuloModuleByIndex(cube.moduleId - 1);
        if (puerta.encastre === CajonTipo.Superpuesto) {
            return modulo.z
        }
        return modulo.z - puerta.size - modulo.settings.RetrasoFrontalFrente
    }
}

export class PuertaCorrediza extends Puerta {
    _cantPuertas: number = 3;
    kit: any;
    cruceEntrePuertas: number = 9;
    private puertas: any = [
        { extraWidth: 0, extraHeight: 0, enabled: true, cruceEntrePuertasADerecha: 0, material: this.material },
        { extraWidth: 0, extraHeight: 0, enabled: true, cruceEntrePuertasADerecha: 0, material: this.material },
        { extraWidth: 0, extraHeight: 0, enabled: true, cruceEntrePuertasADerecha: 0, material: this.material }
    ];

    constructor() {
        super();
        this.elementType = ElementType.puertaCorrediza;
        this.tipo = PuertaTipo.Entera;
        this.encastre = CajonTipo.Encastrado;
        this.corrediza = true;
        this.sentidoVeta = ModuleLayout.Vertical
    }

    get cantPuertas(): number {
        return this._cantPuertas;
    }

    set cantPuertas(cant: number) {
        if (cant < 0 || cant === this.cantPuertas) {
            return;
        }
        if (cant < this.cantPuertas) {
            this.puertas.splice(this.cantPuertas - (this.cantPuertas - cant) - 1, this.cantPuertas - cant);
        } else {
            let door: any = { extraWidth: 0, extraHeight: 0, enabled: true, material: this.material };
            let doors: any = Array.apply(null, Array(cant - this.cantPuertas)).map((d: any) => door);
            this.puertas = this.puertas.concat(doors);
        }
        this._cantPuertas = cant;
    }

    /**
     * Actualiza el material de todas las puertas corredizas
     * @param material string
     */
    static UpdateMaterial(puerta: PuertaCorrediza, material: string) {
        puerta.material = material;
        if (puerta.puertas && puerta.puertas.length) {
            for (var i = 0; i < puerta.puertas.length; i++) {
                puerta.puertas[i].material = puerta.material
            }
        }
    }

    static GetPrecomputedHeight(cube: Element) {
        const modulo = Modulo.GetModuloModuleByIndex(cube.moduleId - 1);
        return Puerta.GetPrecomputedHeight(cube) + 2 * modulo.settings.HolguraLateralFrentesCajon
    }

    static GetHeight(separator: Element) {
        const puerta = (separator as any).puerta as PuertaCorrediza;
        const descuento_alto = puerta.kit ? puerta.kit.descuento_alto : 0;
        let precomputed = PuertaCorrediza.GetPrecomputedHeight(separator);
        precomputed -= Element.GetEspesorTapacanto(puerta, 1) + Element.GetEspesorTapacanto(puerta, 3);
        return precomputed - descuento_alto;
    }

    static GetPrecomputedWidth(cube: Element) {
        const modulo = Modulo.GetModuloModuleByIndex(cube.moduleId - 1);
        return Puerta.GetPrecomputedWidth(cube) + 2 * modulo.settings.HolguraLateralFrentesCajon
    }

    static GetWidth(separator: Element, puertaIndex: number = -1) {
        const puerta = (separator as any).puerta as PuertaCorrediza;
        const descuento_ancho = puerta.kit ? puerta.kit.descuento_ancho : 0;
        const extraWidth = puertaIndex > -1 ? puerta['puertas'][puertaIndex].extraWidth : 0;
        let precomputed = PuertaCorrediza.GetPrecomputedWidth(separator);
        precomputed -= Element.GetEspesorTapacanto(puerta, 2) + Element.GetEspesorTapacanto(puerta, 4);
        return (precomputed / puerta.puertas.length) + (+puerta.cruceEntrePuertas) - (descuento_ancho * 2) + extraWidth;
    }

    // retorna el ancho del espacio que ocupa todo el conjunto de puertas corredizas
    static GetInternalSpaceWidth(cube: Element) {
        const puerta = (cube as any).puerta as PuertaCorrediza;
        return (puerta.sentidoVeta === ModuleLayout.Horizontal ? PuertaCorrediza.GetPrecomputedHeight(cube) : PuertaCorrediza.GetPrecomputedWidth(cube)) - 1;
    }

    // retorna el alto del espacio que ocupa todo el conjunto de puertas corredizas
    static GetInternalSpaceHeight(cube: Element) {
        const puerta = (cube as any).puerta as PuertaCorrediza;
        return puerta.sentidoVeta === ModuleLayout.Horizontal ? PuertaCorrediza.GetPrecomputedHeight(cube) : PuertaCorrediza.GetPrecomputedWidth(cube);
    }

    /**
     * dado un separador el cual contiene una puerta corrediza, retorna los rieles para la misma.
     * Los rieles deberian estar en el modulo seleccionado.
     */
    static GetRieles(cube: Element): any {
        if ((cube as any).puerta.corrediza) {
            const modulo = Modulo.Selected();
            return modulo.elements.filter((elem: any) => elem.puertaCorredizaId === cube.id);
        }
    }
}

export class Riel extends Element {
    public riel = true;
    public elementType = 'riel';
    public AVeta: number; // profundidad
    public LVeta: number; // largo
    public only3d: boolean = false; // si la pieza solo deberia verse en el 3d
    public puertaCorredizaId: number;
    public isSuperior: boolean = true;
    public size: number; // alto
    public material: any;
    public tapacantos: TapacantoSetting = new TapacantoSetting();
    public Orientacion: 1 | 2 | 3 | 4;
    public X: number;
    public Y: number;
    public Z: number;

    constructor(parent: any, modulo_id: any, puertaId: number) {
        super(parent, modulo_id);
        this.puertaCorredizaId = puertaId;
    }
}

export class DobleFondo {
    name = ''
    material = MaterialEnum.None
    size: number
    z: number
    tapacantos = new TapacantoSetting()
    sides: any = []
    isCustom: boolean = false;
    extraAlto: number = 0; // superficie extra hacia arriba
    extraDerecha: number = 0; // superficie extra hacia la derecha
    extraAbajo: number = 0; // superficie extra hacia abajo
    extraIzquierda: number = 0; // superficie extra hacia la izquierda
    drawing?: any; // dibujo para la calco
    girarVeta?: boolean = false;

    static GetHeight(element: Element): number {
        const dobleFondo = (element as any).dobleFondo;
        if (!dobleFondo.isCustom) {
            return Element.GetHeight(element) + dobleFondo.extraAbajo + dobleFondo.extraAlto;
        }

        const upperSide = DobleFondo.getUpperMostSide(element);
        const bottomSide = DobleFondo.getBottomMostSide(element);

        return Element.GetY(upperSide) - (Element.GetY(bottomSide) + bottomSide.size) + dobleFondo.extraAbajo + dobleFondo.extraAlto;
    }

    static GetWidth(element: Element): number {
        const dobleFondo = (element as any).dobleFondo;
        if (!dobleFondo.isCustom) {
            return Element.GetWidth(element) + dobleFondo.extraIzquierda + dobleFondo.extraDerecha;
        }

        const leftSide = DobleFondo.getLeftMostSide(element);
        const rightSide = DobleFondo.getRightMostSide(element);

        return Element.GetX(rightSide) - (Element.GetX(leftSide) + leftSide.size) + dobleFondo.extraIzquierda + dobleFondo.extraDerecha;
    }

    static getLeftMostSide(cube: Element): any {
        const dobleFondo = (cube as any).dobleFondo as DobleFondo;
        const side1 = Separator.GetOrientacion(cube as Separator) === 1 ? Element.GetElement(dobleFondo.sides.side3) : Element.GetElement(dobleFondo.sides.side1);
        const side2 = Separator.GetOrientacion(cube as Separator) === 1 ? Element.GetElement(dobleFondo.sides.side4) : Element.GetElement(dobleFondo.sides.side2);
        return Element.GetX(side1) < Element.GetX(side2) ? side1 : side2;
    }

    static getRightMostSide(cube: Element): any {
        const dobleFondo = (cube as any).dobleFondo as DobleFondo;
        const side1 = Separator.GetOrientacion(cube as Separator) === 1 ? Element.GetElement(dobleFondo.sides.side3) : Element.GetElement(dobleFondo.sides.side1);
        const side2 = Separator.GetOrientacion(cube as Separator) === 1 ? Element.GetElement(dobleFondo.sides.side4) : Element.GetElement(dobleFondo.sides.side2);
        return Element.GetX(side1) > Element.GetX(side2) ? side1 : side2;
    }

    static getUpperMostSide(cube: Element): any {
        const dobleFondo = (cube as any).dobleFondo as DobleFondo;
        const side1 = Separator.GetOrientacion(cube as Separator) === 2 ? Element.GetElement(dobleFondo.sides.side3) : Element.GetElement(dobleFondo.sides.side1);
        const side2 = Separator.GetOrientacion(cube as Separator) === 2 ? Element.GetElement(dobleFondo.sides.side4) : Element.GetElement(dobleFondo.sides.side2);
        return Element.GetY(side1) > Element.GetY(side2) ? side1 : side2;
    }

    static getBottomMostSide(cube: Element): any {
        const dobleFondo = (cube as any).dobleFondo as DobleFondo;
        const side1 = Separator.GetOrientacion(cube as Separator) === 2 ? Element.GetElement(dobleFondo.sides.side3) : Element.GetElement(dobleFondo.sides.side1);
        const side2 = Separator.GetOrientacion(cube as Separator) === 2 ? Element.GetElement(dobleFondo.sides.side4) : Element.GetElement(dobleFondo.sides.side2);
        return Element.GetY(side1) < Element.GetY(side2) ? side1 : side2;
    }
}

export class Modulo {
    static index = 0;
    activated: boolean = true; // permite saber si deberia trabajar con este modulo (calculo de calcomanias, materiales, etc)
    fondo: string = ''
    customFondos: any = []
    ExtraAlto?: number = 0; // superficie de fondo extra hacia arriba
    ExtraDerecha?: number = 0; // superficie de fondo extra hacia la derecha
    ExtraAbajo?: number = 0; // superficie de fondo extra hacia abajo
    ExtraIzquierda?: number = 0; // superficie de fondo extra hacia la izquierda
    id: number
    width = 2500
    height = 1200
    z = 500
    moduleId: number;
    moduleName: string;
    settings = new ModuleSettings()
    name: string
    elements: Element[] = []
    selected: any = null
    isTypeL: boolean = false;
    LType: string = undefined;
    displayWidth: number = -1; // ancho para mostrar (sobrescribe a with)
    isRoomEditor: boolean = false; // si es un modulo del editor de ambientes de instalacion
    grupoMaterial?: boolean = false;
    LLength?: number = 0;
    latIzqZ?: number = -1;
    latDerZ?: number = -1;
    techoId?: number;
    latDerId?: number;
    latIzqId?: number;
    drawing?: any; // dibujo para la calco del fondo
    layers: { name: string, visible: boolean }[] = [
        { name: 'Capa 1', visible: true },
        { name: 'Capa 2', visible: true },
        { name: 'Capa 3', visible: true }
    ]; // capas
    _x = 0
    _y = 0
    _z = 0
    /*====Opciones de Rotacion en Angulos Para El 3D====*/
    _rx = 0                                         /*3D*/
    _ry = 0                                         /*3D*/
    _rz = 0                                         /*3D*/
    /*====Opciones de Rotacion en Angulos Para El 3D====*/


    /**
     * Devuelve los modulos activos
     */
    static getActivatedModules(roomEditor?: boolean): Modulo[] {
        if (!Element.state) {
            return [];
        }

        if ((roomEditor !== undefined && roomEditor) || Element.state.ambienteEnabled) {
            return Element.state.roomEditorModules.filter((m: Modulo) => m.activated === undefined || m.activated);
        }
        return Element.state.modules.filter((m: Modulo) => m.activated === undefined || m.activated);
    }

    static getGrupoModules(): Modulo[] {
        if (!Element.state) {
            return [];
        }
        return Element.state.modules.filter((m: Modulo) => m.grupoMaterial);
    }

    /**
     * Devuelve el modulo seleccionado, dependiendo de si esta el editor de ambiente de instalacion abierto o no
     */
    static Selected(): Modulo {
        if (Element.state.ambienteEnabled) {
            return Element.state.roomEditorModules[Element.state.selectedRoomEditorModule];
        }
        return Element.state.modules[Element.state.selectedModule];
    }

    /**
     * Devuelve el indice (empezando de 0) del modulo seleccionado
     */
    static SelectedModuleIndex(): number {
        const modulo = Modulo.Selected();
        return modulo.moduleId - 1;
    }

    // static SetSelectedModuleIndex(index: number) {
    //     if (Element.state.ambienteEnabled) {
    //         return Element.state.selectedRoomEditorModule = index;
    //     }
    //     return Element.state.selectedModule = index;
    // }

    /**
     * Retorna true si esta seleccionado el ambiente de instalacion, false en caso contrario.
     */
    static isRoomEditorSelected(): boolean {
        return Element.state.ambienteEnabled;
    }

    /**
     * Retorna los elementos de una capa para el modulo seleccionado
     * @param layerId id de la capa
     */
    static GetElementsInLayer(layerId: number): any {
        const modulo = Modulo.Selected();
        if (layerId === -1 || layerId > modulo.layers.length) {
            return [];
        }
        const elements: any = modulo.elements;
        return elements.filter((el: any) => el.layerId === layerId);
    }

    /**
     * Retorna el indice de la pieza seleccionada en el modulo seleccionado
     */
    static SelectedIndex(): number {
        const modulo = Modulo.Selected()
        return (modulo.elements as any).findIndex((e: Element) => e.id === modulo.selected)
    }

    static GetNextIndex(): number {
        return ++Modulo.index;
    }

    static GetModuleByIndex(index: number): Modulo {
        const modules = Modulo.GetModules();
        if (index > modules.length - 1) {
            return null;
        }
        return modules[index];
    }

    static GetModuloModuleByIndex(index: number): Modulo {
        const modules = Element.state.modules;
        if (index > modules.length - 1) {
            return null;
        }
        return modules[index];
    }

    static FindModuleByPiece(piece: Element): Modulo {
        const modules = [...Modulo.GetSectionModules(true), ...Modulo.GetSectionModules(false)];
        const modulesWithSameId = modules.filter(m => m.moduleId === piece.moduleId);
        let found = false;
        let i = 0;
        while (!found) {
            found = !!((modulesWithSameId[i].elements as any).find((e: any) => e.id === piece.id));
            if (found) {
                return modulesWithSameId[i]
            }
            i++;
        }

        return null; // not found
    }

    static GetModules(): Modulo[] {
        if (!Element.state) {
            return [];
        }
        return Element.state.ambienteEnabled ? Element.state.roomEditorModules : Element.state.modules;
    }

    static GetSectionModules(roomEditor: boolean): Modulo[] {
        if (!Element.state) {
            return [];
        }
        return roomEditor ? Element.state.roomEditorModules : Element.state.modules;
    }

    static GetAllModules(): Modulo[] {
        return [...Modulo.GetSectionModules(false), ...Modulo.GetSectionModules(true)];
    }

    constructor(isRoomEditor: boolean = false) {
        const modules = Modulo.GetModules();
        this.moduleId = Element.state ? modules.length + 1 : 1;
        this.moduleName = 'Mod ' + this.moduleId;
        this.isRoomEditor = isRoomEditor;
    }
}

export class GeneralInformation {
    username = ''
    token_project = ''
    name = ''
    address = ''
    phone = ''
    mueble = ''
    total = ''
    senia = ''
    encargadoMed = ''
    encargadoInst = ''
    connectedCNC = -1
    fechaInstalacion = ''
    horaInstalacion = ''
    comentarioInstalacion = ''
    comentario = ''
    saldo?= ''
    pagos?: any[] = []
    items?: any[] = [] // items del valor total
    links: string[] = [] // links externos
    seniaDescripcion?= ''
    totalDescripcion?= ''
    estadoProyecto: ProjectStatus = ProjectStatus.Presupuesto
}

export enum ProjectStatus {
    Presupuesto = 'Presupuesto',
    En_curso = 'Proyecto en Curso',
    Exportado = 'Exportado'
}

// CALCOS
export enum CalcoTypeEnum {
    None = '',
    Mix = 'Mix', // Minimix
    To = 'To', // Tornillo
    Ta = 'Ta', // Tarugo
    Pi = 'Pi', // Pituto
    Tele = 'Tele', // Corredera Telescopica
}

export class CalcoItem {
    altura1 = 0
    altura2 = 0
    tipo = ''
    prof1 = 0
    prof2 = 0
    prof3 = 0

    // conexiones de piezas divididas
    prof4 = 0;
    prof5 = 0;
    prof6 = 0;
}

export enum ConexionTypeEnum {
    None = '',
    Tornillo2 = '2 Tornillos',
    Tornillo3 = '3 Tornillos',
    Pituto = 'Pituto',
    Tarugo2 = '2 Tarugos',
    Tarugo3 = '3 Tarugos',
    Minifix2 = '2 Minifix',
    Minifix3 = '3 Minifix',
    TelescopicaCajon = 'Telescopica Cajon',
    TelescopicaBandeja = 'Telescopica Bandeja',
    Referencia = 'Referencia'
}

export class Conexion {
    public separator: Separator
    public tipo = ConexionTypeEnum.None
    public info = new Calco()
    public conexionDividida = false;
}

export class Calco {
    caraEnContacto: CalcoItem
    caraOpuesta: CalcoItem

    static Create(s1: Separator, s2: Separator, tipo: ConexionTypeEnum): Calco {
        const conexionesString = localStorage.getItem('conexiones');
        const conexiones = conexionesString ? JSON.parse(conexionesString) : [];
        const selectedConexion = conexiones.find((c: any) => c.nombre === tipo);

        if (selectedConexion) {
            return this.CreateCustomConexion(s1, s2, selectedConexion);
        }

        // conexiones
        switch (tipo) {
            case ConexionTypeEnum.Referencia:
                return this.CreateReferencia(s1, s2)
            case ConexionTypeEnum.Tornillo2:
                return this.CreateTornillo(s1, s2, false)
            case ConexionTypeEnum.Tornillo3:
                return this.CreateTornillo(s1, s2, true)
            case ConexionTypeEnum.Tarugo2:
                return this.CreateTarugo(s1, s2, false)
            case ConexionTypeEnum.Tarugo3:
                return this.CreateTarugo(s1, s2, true)
            case ConexionTypeEnum.Pituto:
                return this.CreatePituto(s1, s2)
            case ConexionTypeEnum.Minifix2:
                return this.CreateMinifix(s1, s2, false)
            case ConexionTypeEnum.Minifix3:
                return this.CreateMinifix(s1, s2, true)
            case ConexionTypeEnum.TelescopicaCajon:
                return this.CreateTelescopicaCajon(s1, s2, (s2 as any).frenteEncastre)
            case ConexionTypeEnum.TelescopicaBandeja:
                return this.CreateTelescopicaBandeja(s1, s2)
            default:
                return new Calco()
        }
    }

    static CreateCustomConexion(s1: Separator, s2: Separator, conexionObj: any): Calco {
        if ((s2 as any).cajon) {
            return this.CreateCustomConexionForCajon(s1, s2, conexionObj, (s2 as any).frenteEncastre);
        }

        const conexion = JSON.parse(conexionObj.conexion);
        const posterior = conexion.posterior;
        const anterior = conexion.anterior;

        const isDividida = s2.division && +s2.division > 0;
        const modulo = Modulo.GetModuleByIndex(s2.moduleId - 1);
        const anchoParteDividida = isDividida ? ((modulo.z - s2.division) / 2) : null;
        const anchoDivision = isDividida ? +s2.division : -1;
        const parent = Element.GetParent(s1) as Cube
        const calco = new Calco()
        const cPosterior = new CalcoItem()
        const cAnterior = new CalcoItem()
        const regexpMax = /^(limites|limite|límite|límites)$/i;

        if (parent.layout === ModuleLayout.Vertical) {
            if(regexpMax.test(posterior.alt1)){
                cPosterior.altura1 = Element.GetY(s2) - Element.GetY(s1);
            }else{
                cPosterior.altura1 = posterior.alt1 ? Element.GetY(s2) - Element.GetY(s1) + +posterior.alt1 : 0;
            }
        } else {

            if(regexpMax.test(posterior.alt1)){
                cPosterior.altura1 = Element.GetX(s2) - Element.GetX(s1);
            }else{
                cPosterior.altura1 = posterior.alt1 ? Element.GetX(s2) - Element.GetX(s1) + +posterior.alt1 : 0;
            }
            
        }

        let prof1Posterior = s2.ejeZ - s1.ejeZ + +posterior.prof1 < +posterior.prof1 ? +posterior.prof1 : s2.ejeZ - s1.ejeZ + +posterior.prof1;
        let prof1Anterior = s2.ejeZ - s1.ejeZ + +anterior.prof1 < +anterior.prof1 ? +anterior.prof1 : s2.ejeZ - s1.ejeZ + +anterior.prof1;

        let prof3Posterior = (s2.ejeZ - s1.ejeZ + (s2.anchoVeta > -1 ? s2.anchoVeta : modulo.z) - +posterior.prof3);
        let prof3Anterior = (s2.ejeZ - s1.ejeZ + (s2.anchoVeta > -1 ? s2.anchoVeta : modulo.z) - +anterior.prof3);

        let s1Dividido = s1.division && +s1.division > 0;
        let aVeta = s1.anchoVeta > -1 ? s1.anchoVeta : s1Dividido ? (modulo.z - s1.division) / 2 : modulo.z;


        prof3Posterior = prof3Posterior > aVeta ? aVeta - posterior.prof3 : prof3Posterior;
        prof3Anterior = prof3Anterior > aVeta ? aVeta - anterior.prof3 : prof3Anterior;

        let prof2Posterior = (+prof3Posterior - +prof1Posterior) / 2 + +prof1Posterior;
        let prof2Anterior = (+prof3Anterior - +prof1Anterior) / 2 + +prof1Anterior;

        cPosterior.tipo = (s2 as any).barral ? 'SB' : posterior.tipo;
        if (cPosterior.tipo === 'SB') {
            // Barral
            cPosterior.altura1 += 18
            cPosterior.altura2 = cPosterior.altura1 - 30
            cPosterior.prof2 = (s2 as any).prof2 - s1.ejeZ;

            calco.caraEnContacto = cPosterior
            return calco
        }

        if(regexpMax.test(posterior.alt1)){
            cPosterior.altura2 = cPosterior.altura1 + s2.size;
        }else{
            cPosterior.altura2 = posterior.alt2 ? cPosterior.altura1 + /*s2.size*/ + +posterior.alt2 : 0;
        }
        
        cPosterior.prof1 = posterior.prof1 ? prof1Posterior : 0;
        cPosterior.prof4 = isDividida ? (posterior.prof1 ? anchoParteDividida + anchoDivision + prof1Posterior:0) : 0;
        if (posterior.prof2) {
            cPosterior.prof2 = isDividida ? anchoParteDividida / 2 : prof2Posterior;
            cPosterior.prof5 = isDividida ? anchoParteDividida * 1.5 + anchoDivision : 0;
        }

        if ((s2 as any).liston && (s2 as any).Orientacion > 2) {
            // Liston Horizontal de Frente y Vertical de Frente
            const liston = s2 as Liston;
            cPosterior.prof1 = cPosterior.prof2 = 0;
            cPosterior.prof3 = liston.ejeZ + (liston.espesorListon / 2);

            cAnterior.prof1 = cAnterior.prof2 = 0;
            cAnterior.prof3 = liston.ejeZ + (liston.espesorListon / 2);
        } else {
            if (posterior.prof3) {
                cPosterior.prof3 = isDividida ? anchoParteDividida - posterior.prof3 : prof3Posterior;
                cPosterior.prof6 = isDividida ? Modulo.Selected().z - posterior.prof3 : 0;
            }

            cAnterior.prof1 = anterior.prof1 ? prof1Anterior : 0;
            if (anterior.prof2) {
                cAnterior.prof2 = isDividida ? anchoParteDividida / 2 : prof2Anterior;
                cAnterior.prof5 = isDividida ? anchoParteDividida * 1.5 + anchoDivision : 0;
            }

            if (anterior.prof3) {
                cAnterior.prof3 = isDividida ? anchoParteDividida - anterior.prof3 : prof3Anterior;
                cAnterior.prof6 = isDividida ? Modulo.Selected().z - anterior.prof3 : 0;
            }
            cAnterior.prof4 = isDividida ? (anterior.prof1 ? anchoParteDividida + anchoDivision + prof1Anterior:0) : 0;
        }

        cAnterior.tipo = anterior.tipo;

        if (parent.layout === ModuleLayout.Vertical) {
            
            if(regexpMax.test(anterior.alt2)){
                cAnterior.altura2 = Element.GetY(s2) - Element.GetY(s1) + s2.size / 2;
            }else{
                cAnterior.altura2 = anterior.alt2 ? Element.GetY(s2) - Element.GetY(s1) + +anterior.alt2 + s2.size / 2 : 0;
            }
            
        } else {
            
            if(regexpMax.test(anterior.alt2)){
                cAnterior.altura2 = Element.GetX(s2) - Element.GetX(s1) + s2.size / 2;
            }else{
                cAnterior.altura2 = anterior.alt2 ? Element.GetX(s2) - Element.GetX(s1) + +anterior.alt2 + s2.size / 2 : 0;
            }
            
        }

        if (anterior.alt1 || anterior.alt2 || anterior.prof1 || anterior.prof2 || anterior.prof3 || anterior.tipo) {
            calco.caraOpuesta = cAnterior
        }

        if (posterior.alt1 || posterior.alt2 || posterior.prof1 || posterior.prof2 || posterior.prof3 || posterior.tipo) {
            calco.caraEnContacto = cPosterior
        }

        return calco;
    }

    static CreateCustomConexionForCajon(s1: Separator, s2: Element, conexionObj: any, tipo: CajonTipo = CajonTipo.Superpuesto): Calco {
        const conexion = JSON.parse(conexionObj.conexion);
        const posterior = conexion.posterior;
        // const anterior = conexion.anterior;

        const parent = Element.GetParent(s2) as Cube;
        const calco = new Calco();

        // Solo cara en contacto
        const cPosterior = new CalcoItem();
        cPosterior.tipo = posterior.tipo;

        const cajon = s2 as any;
        const cajonIndex = Cajon.GetCajonIndexInCajonGroup(cajon);
        const cajonesEnGrupo = Cajon.GetCajonCountInCajonGroup(Cajon.GetCajonGroup(cajon));

        // no es cajon (puede ser bandeja)
        if (cajonIndex === -1) {
            if (posterior.alt1) {
                cPosterior.altura1 += Element.GetY(s2);
            }
        } else {
            // TODO: CHECK VIRTUAL!
            // REFACTOR
            if (tipo === CajonTipo.Superpuesto) {
                if (posterior.alt1) {
                    cPosterior.altura1 += Element.GetY(parent) + +posterior.alt1;
                }
                if (cajonIndex !== cajonesEnGrupo - 1) {
                    if (posterior.alt1) {
                        cPosterior.altura1 += (Cajon.LargoFrente(cajon, cajonesEnGrupo) + cajon.luz) * (cajonesEnGrupo - 1 - cajonIndex);
                    }
                }
                cPosterior.prof1 = posterior.prof1 ? Modulo.Selected().z - +posterior.prof1 - 2 : 0;
                cPosterior.prof2 = posterior.prof2 ? Modulo.Selected().z - +posterior.prof2 : 0;
                cPosterior.prof3 = posterior.prof3 ? Modulo.Selected().z - +posterior.prof3 : 0;
            } else {

                cPosterior.altura1 += posterior.alt1 ? Element.GetY(parent) + +posterior.alt1 + Modulo.Selected().settings.DesplazamientoFrentalCajon : 0;
                if (cajonIndex !== cajonesEnGrupo - 1) {
                    cPosterior.altura1 += posterior.alt1 ? (Cajon.LargoFrente(cajon, cajonesEnGrupo) + cajon.luz) * (cajonesEnGrupo - 1 - cajonIndex) : 0;
                }

                const zFrenteCajon = posterior.prof1 || posterior.prof2 || posterior.prof3 ? Cajon.getFrenteZ(s2 as Cajon) : 0;
                // cPosterior.prof1 = posterior.prof1 ? Modulo.Selected().z + +posterior.prof2 - 2 : 0;
                cPosterior.prof1 = posterior.prof1 ? zFrenteCajon - +posterior.prof1 : 0;
                cPosterior.prof2 = posterior.prof2 ? zFrenteCajon - +posterior.prof2 : 0;
                cPosterior.prof3 = posterior.prof3 ? zFrenteCajon - +posterior.prof3 : 0;
            }
        }


        // resto la posicion en Y del separador (puede que el separador no empiece en Y=0)
        if (posterior.alt1) {
            cPosterior.altura1 -= Element.GetY(s1);
        }

        // para mantener las correderas en su lugar hay que tener en cuenta el espesor de los tapacantos superior e inferior
        cPosterior.altura1 += posterior.alt1 ? Cajon.GetEspesorTapacanto(s2, 3) * (cajonesEnGrupo - (cajonIndex + 1)) : 0;
        cPosterior.altura1 += posterior.alt1 ? Cajon.GetEspesorTapacanto(s2, 1) * (cajonesEnGrupo - (cajonIndex + 1)) : 0;
        calco.caraEnContacto = cPosterior

        return calco
    }

    static CreateReferencia(s1: Separator, s2: Separator): Calco {
        const calco = this.CreateTornillo(s1, s2, false);
        calco.caraEnContacto.tipo = 'RE';
        calco.caraOpuesta.tipo = 'RTo';
        return calco;
    }

    // TODO Agregar soporte para las piezas horizontales
    static CreateTornillo(s1: Separator, s2: Separator, tresTornillos = true): Calco {
        const isDividida = s2.division && +s2.division > 0;
        const modulo = Modulo.GetModuleByIndex(s2.moduleId - 1);
        const conexion = modulo.settings.Tornillo;
        const anchoParteDividida = isDividida ? ((modulo.z - s2.division) / 2) : null;
        const anchoDivision = isDividida ? +s2.division : -1;
        const parent = Element.GetParent(s1) as Cube
        const c = new Calco()
        const cContacto = new CalcoItem()
        const cOpuesta = new CalcoItem()

        if (parent.layout === ModuleLayout.Vertical) {
            cContacto.altura1 = Element.GetY(s2) - Element.GetY(s1)
        } else {
            cContacto.altura1 = Element.GetX(s2) - Element.GetX(s1)
        }
        let prof1 = s2.ejeZ - s1.ejeZ + conexion < conexion ? conexion : s2.ejeZ - s1.ejeZ + conexion;
        let prof3 = (s2.ejeZ - s1.ejeZ + (s2.anchoVeta > -1 ? s2.anchoVeta : modulo.z) - conexion)
        let s1Dividido = s1.division && +s1.division > 0;
        let aVeta = s1.anchoVeta > -1 ? s1.anchoVeta : s1Dividido ? (modulo.z - s1.division) / 2 : modulo.z;
        prof3 = prof3 > aVeta ? aVeta - conexion : prof3;
        let prof2 = (prof3 - prof1) / 2 + prof1;

        cContacto.tipo = (s2 as any).barral ? 'SB' : 'LE'
        if (cContacto.tipo === 'SB') {
            // Barral
            cContacto.altura1 += 18
            cContacto.altura2 = cContacto.altura1 - 30
            cContacto.prof2 = (s2 as any).prof2 - s1.ejeZ;

            c.caraEnContacto = cContacto
            return c
        }

        // Tornillos
        cContacto.altura2 = cContacto.altura1 + s2.size
        cContacto.prof1 = prof1;
        cContacto.prof4 = isDividida ? anchoParteDividida + anchoDivision + conexion : 0;
        if (tresTornillos) {
            cContacto.prof2 = isDividida ? anchoParteDividida / 2 : prof2;
            cContacto.prof5 = isDividida ? anchoParteDividida * 1.5 + anchoDivision : 0;
        }

        if ((s2 as any).liston && (s2 as any).Orientacion > 2) {
            // Liston Horizontal de Frente y Vertical de Frente
            const liston = s2 as Liston;
            cContacto.prof1 = cContacto.prof2 = 0;
            cContacto.prof3 = liston.ejeZ + (liston.espesorListon / 2);

            cOpuesta.prof1 = cOpuesta.prof2 = 0;
            cOpuesta.prof3 = liston.ejeZ + (liston.espesorListon / 2);
        } else {
            cContacto.prof3 = isDividida ? anchoParteDividida - conexion : prof3;
            cContacto.prof6 = isDividida ? Modulo.Selected().z - conexion : 0;

            cOpuesta.prof1 = prof1;
            if (tresTornillos) {
                cOpuesta.prof2 = isDividida ? anchoParteDividida / 2 : prof2;
                cOpuesta.prof5 = isDividida ? anchoParteDividida * 1.5 + anchoDivision : 0;
            }
            cOpuesta.prof3 = isDividida ? anchoParteDividida - conexion : prof3;
            cOpuesta.prof4 = isDividida ? anchoParteDividida + anchoDivision + conexion : 0;
            cOpuesta.prof6 = isDividida ? Modulo.Selected().z - 50 : 0;
        }

        cOpuesta.tipo = 'TO'
        c.caraEnContacto = cContacto

        if (parent.layout === ModuleLayout.Vertical) {
            cOpuesta.altura2 = Element.GetY(s2) - Element.GetY(s1) + s2.size / 2
        } else {
            cOpuesta.altura2 = Element.GetX(s2) - Element.GetX(s1) + s2.size / 2
        }
        c.caraOpuesta = cOpuesta

        return c
    }

    static CreatePituto(s1: Separator, s2: Separator): Calco {
        const isDividida = s2.division && +s2.division > 0;
        const modulo = Modulo.GetModuleByIndex(s2.moduleId - 1);
        const conexion = modulo.settings.Pituto;
        const anchoParteDividida = isDividida ? ((modulo.z - s2.division) / 2) : null;
        const anchoDivision = isDividida ? +s2.division : -1;
        const parent = Element.GetParent(s1) as Cube
        const c = new Calco()
        let prof1 = s2.ejeZ - s1.ejeZ + conexion < conexion ? conexion : s2.ejeZ - s1.ejeZ + conexion;
        let prof3 = s2.ejeZ - s1.ejeZ + (s2.anchoVeta > -1 ? s2.anchoVeta : modulo.z) - conexion;
        let s1Dividido = s1.division && +s1.division > 0;
        let aVeta = s1.anchoVeta > -1 ? s1.anchoVeta : s1Dividido ? (modulo.z - s1.division) / 2 : modulo.z;
        prof3 = prof3 > aVeta ? aVeta - conexion : prof3;

        // Solo cara en contacto
        const cContacto = new CalcoItem()
        if (parent.layout === ModuleLayout.Vertical) {
            cContacto.altura1 = Element.GetY(s2) - Element.GetY(s1) - 3
        } else {
            cContacto.altura1 = Element.GetX(s2) - Element.GetX(s1) - 3
        }
        cContacto.tipo = 'PI';
        cContacto.prof1 = prof1;
        cContacto.prof3 = isDividida ? anchoParteDividida - conexion : prof3;
        cContacto.prof4 = isDividida ? anchoParteDividida + anchoDivision + conexion : 0;
        cContacto.prof6 = isDividida ? Modulo.Selected().z - conexion : 0;
        c.caraEnContacto = cContacto

        return c
    }

    static CreateTarugo(s1: Separator, s2: Separator, tresTornillos = true, valorConexion?: number): Calco {
        const isDividida = s2.division && +s2.division > 0;
        const modulo = Modulo.GetModuleByIndex(s2.moduleId - 1);
        const conexion = valorConexion || modulo.settings.Tarugo;
        const anchoParteDividida = isDividida ? ((modulo.z - s2.division) / 2) : null;
        const anchoDivision = isDividida ? +s2.division : -1;
        const parent = Element.GetParent(s1) as Cube
        const c = new Calco()
        let prof1 = s2.ejeZ - s1.ejeZ + conexion < conexion ? conexion : s2.ejeZ - s1.ejeZ + conexion;
        let prof3 = s2.ejeZ - s1.ejeZ + (s2.anchoVeta > -1 ? s2.anchoVeta : modulo.z) - conexion;
        let s1Dividido = s1.division && +s1.division > 0;
        let aVeta = s1.anchoVeta > -1 ? s1.anchoVeta : s1Dividido ? (modulo.z - s1.division) / 2 : modulo.z;
        prof3 = prof3 > aVeta ? aVeta - conexion : prof3;
        let prof2 = (prof3 - prof1) / 2 + prof1;

        // Solo cara en contacto
        const cContacto = new CalcoItem()
        if (parent.layout === ModuleLayout.Vertical) {
            cContacto.altura1 = Element.GetY(s2) - Element.GetY(s1) + s2.size / 2
        } else {
            cContacto.altura1 = Element.GetX(s2) - Element.GetX(s1) + s2.size / 2
        }
        cContacto.tipo = 'TA'
        cContacto.prof1 = prof1;
        cContacto.prof4 = isDividida ? anchoParteDividida + anchoDivision + conexion : 0;
        if (tresTornillos) {
            cContacto.prof2 = isDividida ? anchoParteDividida / 2 : prof2;
            cContacto.prof5 = isDividida ? anchoParteDividida * 1.5 + anchoDivision : Modulo.Selected().z / 2;
        }
        cContacto.prof3 = isDividida ? anchoParteDividida - conexion : prof3;
        cContacto.prof6 = isDividida ? Modulo.Selected().z - conexion : 0;
        c.caraEnContacto = cContacto

        return c
    }

    static CreateMinifix(s1: Separator, s2: Separator, tresTornillos = true): Calco {
        const modulo = Modulo.GetModuleByIndex(s2.moduleId - 1);
        const conexion = modulo.settings.Minfix;
        const c = Calco.CreateTarugo(s1, s2, tresTornillos, conexion);

        c.caraEnContacto.tipo = 'MIX'

        return c
    }

    // TODO Determinar si es superpuesto/encastrado + si es Perfil35
    static CreateTelescopicaCajon(s1: Separator, s2: Element, tipo: CajonTipo = CajonTipo.Superpuesto): Calco {
        const parent = Element.GetParent(s2) as Cube
        const c = new Calco()

        // Solo cara en contacto
        const cContacto = new CalcoItem()
        cContacto.tipo = 'TE'

        const cajon = s2 as any;
        const cajonIndex = Cajon.GetCajonIndexInCajonGroup(cajon);
        const cajonesEnGrupo = Cajon.GetCajonCountInCajonGroup(Cajon.GetCajonGroup(cajon));

        // no es cajon (puede ser bandeja)
        if (cajonIndex === -1) {
            cContacto.altura1 += Element.GetY(s2);
        } else {
            // TODO: CHECK VIRTUAL!
            // REFACTOR
            if (tipo === CajonTipo.Superpuesto) {
                cContacto.altura1 += Element.GetY(parent) + 23;
                if (cajonIndex !== cajonesEnGrupo - 1) {
                    cContacto.altura1 += (Cajon.LargoFrente(cajon, cajonesEnGrupo) + cajon.luz) * (cajonesEnGrupo - 1 - cajonIndex);
                }
                cContacto.prof1 = Modulo.Selected().z - 36;
            } else {
                cContacto.altura1 += Element.GetY(parent) + 23 + Modulo.Selected().settings.DesplazamientoFrentalCajon;
                if (cajonIndex !== cajonesEnGrupo - 1) {
                    cContacto.altura1 += (Cajon.LargoFrente(cajon, cajonesEnGrupo) + cajon.luz) * (cajonesEnGrupo - 1 - cajonIndex);
                }
                cContacto.prof1 = Modulo.Selected().z - 56;
            }
        }

        // resto la posicion en Y del separador (puede que el separador no empiece en Y=0)
        cContacto.altura1 -= Element.GetY(s1);

        // para mantener las correderas en su lugar hay que tener en cuenta el espesor de los tapacantos superior e inferior
        cContacto.altura1 += Cajon.GetEspesorTapacanto(s2, 3) * (cajonesEnGrupo - (cajonIndex + 1));
        cContacto.altura1 += Cajon.GetEspesorTapacanto(s2, 1) * (cajonesEnGrupo - (cajonIndex + 1));
        c.caraEnContacto = cContacto

        return c
    }

    static CreateTelescopicaBandeja(s1: Separator, s2: Separator, tipo: CajonTipo = CajonTipo.Superpuesto) {
        return this.CreateTelescopicaCajon(s1, s2, tipo)
    }
}

export class CalcoInfo {
    // Separador
    separator: Separator
    // Central
    generalName = ''
    generalMueble = ''
    generalComentarioInstalacion = ''
    moduleName = ''
    moduleArmado = '' // SI/NO
    moduleDescripcion = ''
    moduleComentario = ''
    material?= ''
    extra?= '' // informacion extra que se quiera mostrar
    // Corredera/Piston
    // CARA COL J (CARA)

    // Borde
    LVeta: number
    AVeta: number

    modulo: any;
    drawing?: any; // dibujo hecho con canvas
}
