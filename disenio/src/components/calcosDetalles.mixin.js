export default {
    computed: {
        dobledondo() {
          console.log(this.$store.getters.selectedElement.dobleFondo);
          return this.$store.getters.selectedElement.dobleFondo;
        },
        getModule () {
          return this.$store.getters.selectedModule
        },
        // calcoList () {
        //   // this.$store.commit('calcularConexiones', this.$store.getters.getElement(this.id.id))
        //   console.log(this.$store.getters.getCalcoInfo(this.id.id));
        //   return this.$store.getters.getCalcoInfo(this.id.id)
        // },
        aperturaUbicacion () {
          if (this.selectedElement && this.selectedElement.puerta) {
            return this.selectedElement.puerta.aperturaUbicacion
          }
        },
        bisagraUbicacion () {
          if (this.id && this.id.puerta) {
            // HOTFIX:
            console.log(this.selectedElement && this.selectedElement.puerta && this.selectedElement.puerta.bisagraUbicacion)
            //
            return this.id.puerta.bisagraUbicacion
          }
        },
        height () {
        //   return Number(this.$store.getters.getHeight(this.id.id)).toFixed(2)
        },
        width () {
        //   return Number(this.$store.getters.getWidth(this.id.id)).toFixed(2)
        }
    },
    methods: {
        isCorrediza ({separator}) {
            return separator && separator.puerta && separator.puerta.corrediza
        },
        getBisagraPosicion ({separator}, index) {
            const position = separator.puertaIzquierda ? separator.puerta.posicionBisagrasIzquierda[index] : separator.puerta.posicionBisagrasDerecha[index]
            return this.round(position)
        },
        round (n, decimals = 2) {
            let negative = false
            if (n < 0) {
            negative = true
            n = n * -1
            }
            var multiplicator = Math.pow(10, decimals)
            n = parseFloat((n * multiplicator).toFixed(11))
            n = (Math.round(n) / multiplicator).toFixed(decimals)
            if (negative) {
            n = (n * -1).toFixed(decimals)
            }
            return n
        },
        getBisagraStyle (index, separator) {
            const puerta = separator.puerta
            let styles = {}
            const diagramSize = 198
            if (puerta.bisagraUbicacion === 'Derecha') {
            if (index !== 0) {
                styles['margin-bottom'] = 0.40 * ((diagramSize / (puerta.cantidadBisagras + 1))) + 'px'
            }
            styles['margin-left'] = '93px'
            }
            if (puerta.bisagraUbicacion === 'Inferior') {
            if (index !== puerta.cantidadBisagras - 1) {
                styles['margin-right'] = 0.40 * ((diagramSize / (puerta.cantidadBisagras + 1))) + 'px'
            }
            styles['margin-top'] = '93px'
            }
            if (puerta.bisagraUbicacion === 'Superior') {
            if (index !== puerta.cantidadBisagras - 1) {
                styles['margin-right'] = 0.40 * ((diagramSize / (puerta.cantidadBisagras + 1))) + 'px'
            }
            styles['margin-top'] = '-4px'
            }
            if (puerta.bisagraUbicacion === 'Izquierda') {
            if (index !== 0) {
                styles['margin-bottom'] = 0.40 * ((diagramSize / (puerta.cantidadBisagras + 1))) + 'px'
            }
            styles['margin-left'] = '-4px'
            }
            if (puerta.bisagraUbicacion === 'Izquierda/Derecha') {
            if (separator.puertaIzquierda) {
                if (index !== 0) {
                styles['margin-bottom'] = 0.40 * ((diagramSize / (puerta.cantidadBisagras + 1))) + 'px'
                }
                styles['margin-left'] = '-4px'
            } else {
                if (index !== 0) {
                styles['margin-bottom'] = 0.40 * ((diagramSize / (puerta.cantidadBisagras + 1))) + 'px'
                }
                styles['margin-left'] = '93px'
            }
            }
            return styles
        },
        getBisagraUbicacion (separator) {
            if (this.bisagraUbicacion) {
            return this.bisagraUbicacion
            }
            if (separator.puerta) {
            return separator.puerta.bisagraUbicacion
            }
            return ''
        },
        getAperturaUbicacion (separator) {
            if (this.aperturaUbicacion) {
            return this.aperturaUbicacion
            }
            if (separator.puerta && !separator.puerta.corrediza) {
            return separator.puerta.aperturaUbicacion
            }
            return ''
        },
        downRightMeasure (calcoInfo) {
            const modulo = calcoInfo.modulo
            let measure = modulo.LType === 'derecho' ? modulo.LLength - this.$store.getters.getElement(modulo.latDerId).size : modulo.latDerZ
            return measure + 'mm'
        },
        downMeasure (calcoInfo) {
            const modulo = calcoInfo.modulo
            const calco = this.$store.getters.getCalcoInfo(modulo.techoId)[0]
            return calco.LVeta + 'mm'
        },
        downLeftMeasure (calcoInfo) {
            const modulo = calcoInfo.modulo
            let measure = modulo.LType === 'derecho' ? modulo.latIzqZ : modulo.LLength - this.$store.getters.getElement(modulo.latIzqId).size
            return measure + 'mm'
        },
        upperMeasure (calcoInfo) {
            const modulo = calcoInfo.modulo
            let measure = modulo.LType === 'derecho' ? modulo.latDerZ : modulo.latIzqZ
            return measure + 'mm'
        },
        getComentario (calco) {
            if (calco.isCustomDoor) {
            return calco.separator.puerta.comentario
            }
            return calco.separator.comentario
        },
        isFrenteCajon (separator) {
            return separator && separator.cajon && separator.name.toUpperCase().indexOf('FRENTE') > -1
        },
        isFrenteDesplazado (separator) {
            if (!this.isFrenteCajon(separator)) {
            return false
            }
            return separator.extraAbajo > 0 || separator.extraDerecha > 0 || separator.extraIzquierda > 0
        },
        getCorredera ({separator}) {
            if (this.isFrenteCajon(separator) || separator.bandeja) {
            return separator.corredera
            }
        },
        getCajonMaterial ({separator}) {
            if (separator.name.toUpperCase().indexOf('FRENTE') > -1) {
            return separator.frenteMaterial
            }

            if (separator.name.toUpperCase().indexOf('BASE') > -1) {
            return separator.fondoMaterial
            }

            return separator.material
        },
        getOrientacionManija ({separator}) {
            if (separator.puerta && !separator.puerta.corrediza) {
            return 'Manija: ' + separator.puerta.orientationManija
            }
        },
        getInfoApertura ({separator}) {
            if (separator.cajon && separator.name.toUpperCase().indexOf('FRENTE') > -1) {
            return separator.aperturaSistema ? separator.aperturaSistema + ' - ' + separator.aperturaUbicacion : separator.aperturaUbicacion
            }
            if (separator.puerta && !separator.puerta.corrediza) {
            let aperturaUbicacion = separator.puerta.aperturaUbicacion.toUpperCase()
            if (aperturaUbicacion !== 'IZQUIERDA' && aperturaUbicacion !== 'DERECHA' && aperturaUbicacion !== 'INFERIOR' && aperturaUbicacion !== 'SUPERIOR') {
                return separator.puerta.aperturaSistema + ' ' + aperturaUbicacion
            }
            }
        },
        medidaSuperior (o) {
            if (o.separator) {
            if (o.separator.dobleFondo) {
                return o.AVeta
            }
            if (o.separator.elementType === 'puerta' || o.separator.elementType === 'puerta-custom' || o.separator.elementType === 'puerta-corrediza' || o.separator.cajon) {
                const sentidoVeta = o.separator.cajon ? o.separator.sentidoVeta.toUpperCase() : o.separator.puerta.sentidoVeta.toUpperCase()

                if (sentidoVeta === 'VERTICAL' && (this.isFrenteCajon(o.separator) || o.separator.puerta)) {
                return o.AVeta
                }

                return o.LVeta
            }
            }
            return o.separator.displayAVeta || o.AVeta
        },
        medidaInferior (o) {
            if (o.separator) {
            if (o.separator.dobleFondo) {
                return o.AVeta
            }
            if (o.separator.elementType === 'puerta' || o.separator.elementType === 'puerta-custom' || o.separator.elementType === 'puerta-corrediza' || o.separator.cajon) {
                const sentidoVeta = o.separator.cajon ? o.separator.sentidoVeta.toUpperCase() : o.separator.puerta.sentidoVeta.toUpperCase()

                if (sentidoVeta === 'VERTICAL' && (this.isFrenteCajon(o.separator) || o.separator.puerta)) {
                return o.AVeta
                }

                return o.LVeta
            }
            }
            return o.separator.displayAVeta || o.AVeta
        },
        medidaIzquierda (o) {
            if (o.separator) {
            if (o.separator.dobleFondo) {
                return o.LVeta
            }

            if (o.separator.elementType === 'puerta' || o.separator.elementType === 'puerta-custom' || o.separator.elementType === 'puerta-corrediza' || o.separator.cajon) {
                const sentidoVeta = o.separator.cajon ? o.separator.sentidoVeta.toUpperCase() : o.separator.puerta.sentidoVeta.toUpperCase()

                if (sentidoVeta === 'VERTICAL' && (this.isFrenteCajon(o.separator) || o.separator.puerta)) {
                return o.LVeta
                }

                return o.AVeta
            }
            }
            return o.separator.displayLVeta || o.LVeta
        },
        medidaDerecha (o) {
            if (o.separator) {
            if (o.separator.dobleFondo) {
                return o.LVeta
            }

            if (o.separator.elementType === 'puerta' || o.separator.elementType === 'puerta-custom' || o.separator.elementType === 'puerta-corrediza' || o.separator.cajon) {
                const sentidoVeta = o.separator.cajon ? o.separator.sentidoVeta.toUpperCase() : o.separator.puerta.sentidoVeta.toUpperCase()

                if (sentidoVeta === 'VERTICAL' && (this.isFrenteCajon(o.separator) || o.separator.puerta)) {
                return o.LVeta
                }

                return o.AVeta
            }
            }
            return o.separator.displayLVeta || o.LVeta
        },
        superior (o) {
            if (o.separator.cajon && !this.isFrenteCajon(o.separator)) {
            return false
            }
            if (o.separator && o.separator.tapacantos && o.separator.tapacantos.superior) {
            return true
            }
            if (o.separator && o.separator.dobleFondo && o.separator.dobleFondo.tapacantos && o.separator.dobleFondo.tapacantos.superior) {
            return true
            }
            if (o.separator && o.separator.puerta && o.separator.puerta.tapacantos && o.separator.puerta.tapacantos.superior) {
            return true
            }
            return false
        },
        getCaraBackFront (o, lado, calcoInfo) {

            try {
            if (calcoInfo.separator.cajon && !this.isFrenteCajon(calcoInfo.separator)) {
                return ""
            }
            if (calcoInfo.separator && calcoInfo.separator.dobleFondo && calcoInfo.separator.dobleFondcalcoInfo.tapacantos && calcoInfo.separator.dobleFondcalcoInfo.tapacantos.superior) {
                return "";
            }
            if (calcoInfo.separator && calcoInfo.separator.puerta && calcoInfo.separator.puerta.tapacantos && calcoInfo.separator.puerta.tapacantos.superior) {
                return "";
            }
            
            var numerosD = [];
            var numerosI = [];
            var i = 0;
            for (let index = 0; index < 50; index++) {
                numerosD.push(i);
                i++;
                numerosI.push(i);
                i++;
            }

            if(lado == "I"){
                if(typeof numerosD.find(a=> a == o) !== "undefined"){
                return "Fo";
                }

                if(typeof numerosI.find(a=> a == o) !== "undefined"){
                return "Fre";
                }
            }
            
            if(lado == "D"){
                if(typeof numerosD.find(a=> a == o) !== "undefined"){
                return "Fre";
                }

                if(typeof numerosI.find(a=> a == o) !== "undefined"){
                return "Fo";
                }
            }
            
            return "";
            } catch (error) {
            console.error(error);
            return "";
            }
            
        },
        superiorInfo (o) {
            let apertura = ''
            if ((o.separator.puerta && !o.separator.puerta.corrediza) && this.getAperturaUbicacion(o.separator) === 'Superior') {
            apertura = o.separator.puerta.aperturaSistema
            }
            let bisagra = ''
            if ((o.separator.puerta && !o.separator.puerta.corrediza) && this.getBisagraUbicacion(o.separator) === 'Superior') {
            bisagra = o.separator.puerta.bisagraTipo || ''
            }
            if (o.separator) {
            if (o.separator.cajon && !this.isFrenteCajon(o.separator)) {
                return ''
            }
            if (o.separator.elementType === 'separador' && (o.separator.tapacantos && o.separator.tapacantos.superior)) {
                return o.separator.tapacantos.superior.nombre || o.separator.tapacantos.superior
            }
            if (o.separator.tapacantos && o.separator.tapacantos.superior && !o.isCustomDoor) {
                return o.separator.tapacantos.superior.nombre || o.separator.tapacantos.superior
            }
            if ((o.separator.elementType === 'puerta' || o.separator.elementType === 'puerta-custom' || (o.separator.elementType === 'puerta-corrediza')) && o.separator.puerta.tapacantos) {
                const tapacantos = o.separator.puerta.tapacantos.superior ? o.separator.puerta.tapacantos.superior.nombre || o.separator.puerta.tapacantos.superior : ''
                return tapacantos + ' ' + apertura + ' ' + bisagra
            }
            if (o.separator.dobleFondo && o.separator.dobleFondo.tapacantos) {
                return o.separator.dobleFondo.tapacantos.superior.nombre || o.separator.dobleFondo.tapacantos.superior
            }
            }
            return ''
        },
        derecho (o) {
            if (o.separator.cajon && !this.isFrenteCajon(o.separator)) {
            return false
            }
            if (o.separator && o.separator.tapacantos && o.separator.tapacantos.derecho) {
            return true
            }
            if (o.separator && o.separator.dobleFondo && o.separator.dobleFondo.tapacantos && o.separator.dobleFondo.tapacantos.derecho) {
            return true
            }
            if (o.separator && o.separator.puerta && o.separator.puerta.tapacantos && o.separator.puerta.tapacantos.derecho) {
            return true
            }
            return false
        },
        derechoInfo (o) {
            let apertura = ''
            if ((o.separator.puerta && !o.separator.puerta.corrediza) && this.getAperturaUbicacion(o.separator) === 'Izquierda') {
            apertura = o.separator.puerta.aperturaSistema
            }
            let bisagra = ''
            if ((o.separator.puerta && !o.separator.puerta.corrediza) && this.getBisagraUbicacion(o.separator) === 'Izquierda') {
            bisagra = o.separator.puerta.bisagraTipo || ''
            }
            if (o.separator.puerta && this.getBisagraUbicacion(o.separator) === 'Izquierda/Derecha') {
            const name = o.separator.name.split(' ')
            if (name[name.length - 1] === 'I') {
                bisagra = o.separator.puerta.bisagraTipo || ''
            }
            }
            if (o.separator) {
            if (o.separator.cajon) {
                return this.isFrenteCajon(o.separator) ? o.separator.tapacantos.izquierdo.nombre || o.separator.tapacantos.izquierdo : ''
            }
            if (o.separator.elementType === 'separador' && (o.separator.tapacantos && o.separator.tapacantos.derecho)) {
                if(/Doble Fondo/i.test(`${o.separator.name}`)){
                console.log(o.separator);
                if (o.separator.dobleFondo && o.separator.dobleFondo.tapacantos) {
                    return o.separator.dobleFondo.tapacantos.derecho.nombre || o.separator.dobleFondo.tapacantos.derecho
                }
                }else{
                    return o.separator.tapacantos.derecho.nombre || o.separator.tapacantos.derecho
                }
            }
            if (o.separator.tapacantos && o.separator.tapacantos.derecho && !o.isCustomDoor) {
                return o.separator.tapacantos.derecho.nombre || o.separator.tapacantos.derecho
            }
            if ((o.separator.elementType === 'puerta' || o.separator.elementType === 'puerta-custom' || (o.separator.elementType === 'puerta-corrediza')) && o.separator.puerta.tapacantos) {
                const tapacantos = o.separator.puerta.tapacantos.izquierdo ? o.separator.puerta.tapacantos.izquierdo.nombre || o.separator.puerta.tapacantos.izquierdo : ''
                return tapacantos + ' ' + apertura + ' ' + bisagra
            }
            if (o.separator.dobleFondo && o.separator.dobleFondo.tapacantos) {
                return o.separator.dobleFondo.tapacantos.derecho.nombre || o.separator.dobleFondo.tapacantos.derecho
            }
            }
            return ''
        },
        izquierdo (o) {
            if (o.separator.cajon && !this.isFrenteCajon(o.separator)) {
            return false
            }
            if (o.separator && o.separator.tapacantos && o.separator.tapacantos.izquierdo) {
            return true
            }
            if (o.separator && o.separator.dobleFondo && o.separator.dobleFondo.tapacantos && o.separator.dobleFondo.tapacantos.izquierdo) {
            return true
            }
            if (o.separator && o.separator.puerta && o.separator.puerta.tapacantos && o.separator.puerta.tapacantos.izquierdo) {
            return true
            }
            return false
        },
        izquierdoInfo (o) {
            let apertura = ''
            if ((o.separator.puerta && !o.separator.puerta.corrediza) && this.getAperturaUbicacion(o.separator) === 'Derecha') {
            apertura = o.separator.puerta.aperturaSistema
            }
            let bisagra = ''
            if ((o.separator.puerta && !o.separator.puerta.corrediza) && this.getBisagraUbicacion(o.separator) === 'Derecha') {
            bisagra = o.separator.puerta.bisagraTipo || ''
            }
            if (o.separator.puerta && this.getBisagraUbicacion(o.separator) === 'Izquierda/Derecha') {
            const name = o.separator.name.split(' ')
            if (name[name.length - 1] === 'D') {
                bisagra = o.separator.puerta.bisagraTipo || ''
            }
            }
            if (o.separator) {
            if (o.separator.cajon) {
                return this.isFrenteCajon(o.separator) ? o.separator.tapacantos.derecho.nombre || o.separator.tapacantos.derecho : ''
            }
            if (o.separator.elementType === 'separador' && (o.separator.tapacantos && o.separator.tapacantos.izquierdo)) {
                if(/Doble Fondo/i.test(`${o.separator.name}`)){
                console.log(o.separator);
                if (o.separator.dobleFondo && o.separator.dobleFondo.tapacantos) {
                    return o.separator.dobleFondo.tapacantos.izquierdo.nombre || o.separator.dobleFondo.tapacantos.izquierdo
                }
                }else{
                return o.separator.tapacantos.izquierdo.nombre || o.separator.tapacantos.izquierdo
                }
            }
            if (o.separator.tapacantos && o.separator.tapacantos.izquierdo && !o.isCustomDoor) {
                return o.separator.tapacantos.izquierdo.nombre || o.separator.tapacantos.izquierdo
            }
            if ((o.separator.elementType === 'puerta' || o.separator.elementType === 'puerta-custom' || (o.separator.elementType === 'puerta-corrediza')) && o.separator.puerta.tapacantos) {
                const tapacantos = o.separator.puerta.tapacantos.derecho ? o.separator.puerta.tapacantos.derecho.nombre || o.separator.puerta.tapacantos.derecho : ''
                return tapacantos + ' ' + apertura + ' ' + bisagra
            }
            if (o.separator.dobleFondo && o.separator.dobleFondo.tapacantos) {
                return o.separator.dobleFondo.tapacantos.izquierdo.nombre || o.separator.dobleFondo.tapacantos.izquierdo
            }
            }
            return ''
        },
        inferior (o) {
            if (o.separator.cajon && !this.isFrenteCajon(o.separator)) {
            return false
            }
            if (o.separator && o.separator.tapacantos && o.separator.tapacantos.inferior) {
            return true
            }
            if (o.separator && o.separator.dobleFondo && o.separator.dobleFondo.tapacantos && o.separator.dobleFondo.tapacantos.inferior) {
            return true
            }
            if (o.separator && o.separator.puerta && o.separator.puerta.tapacantos && o.separator.puerta.tapacantos.inferior) {
            return true
            }
            return false
        },
        inferiorInfo (o) {
            let apertura = ''
            if ((o.separator.puerta && !o.separator.puerta.corrediza) && this.getAperturaUbicacion(o.separator) === 'Inferior') {
            apertura = o.separator.puerta.aperturaSistema
            }
            let bisagra = ''
            if ((o.separator.puerta && !o.separator.puerta.corrediza) && this.getBisagraUbicacion(o.separator) === 'Inferior') {
            bisagra = o.separator.puerta.bisagraTipo || ''
            }
            if (o.separator) {
            if (o.separator.cajon && !this.isFrenteCajon(o.separator)) {
                return ''
            }
            if (o.separator.elementType === 'separador' && (o.separator.tapacantos && o.separator.tapacantos.inferior)) {
                return o.separator.tapacantos.inferior.nombre || o.separator.tapacantos.inferior
            }
            if (o.separator.tapacantos && o.separator.tapacantos.inferior && !o.isCustomDoor) {
                return o.separator.tapacantos.inferior.nombre || o.separator.tapacantos.inferior
            }
            if ((o.separator.elementType === 'puerta' || o.separator.elementType === 'puerta-custom' || (o.separator.elementType === 'puerta-corrediza')) && o.separator.puerta.tapacantos) {
                const tapacantos = o.separator.puerta.tapacantos.inferior ? o.separator.puerta.tapacantos.inferior.nombre || o.separator.puerta.tapacantos.inferior : ''
                return tapacantos + ' ' + apertura + ' ' + bisagra
            }
            if (o.separator.dobleFondo && o.separator.dobleFondo.tapacantos) {
                return o.separator.dobleFondo.tapacantos.inferior.nombre || o.separator.dobleFondo.tapacantos.inferior
            }
            }
            return ''
        }
    }
}